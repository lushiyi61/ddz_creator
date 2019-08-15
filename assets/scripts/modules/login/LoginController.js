/*
登录控制器
*/

let Controller = require("../../frameworks/mvc/Controller");

let HttpClient  = require("../../frameworks/http/HttpClient");

cc.Class({
    extends: Controller,

    properties: {

    },

    ctor() {
        this.loaddingFinish = false;
        this.requestServerConfig();
    },

    initGlobalEvent() {
        qf.event.addEvent(qf.ekey.BASIC_NET_CONNECT_SUCCESS, this.onConnectNetSuccess, this);
        qf.event.addEvent(qf.ekey.EVENT_LOADDING_FINISH, this.finishLoad, this);
    },

    //完成loadding界面加载
    finishLoad() {
        this.loaddingFinish = true;
        if (qf.net.isConnected()) {
            this.checkToLogin();
        }
    },

    //网络连接成功
    onConnectNetSuccess() {
        if (this.loaddingFinish) {
            this.checkToLogin();
        }
    },

    checkToLogin() {
        if (CC_WECHATGAME) {
            qf.platform.checkSession((ret)=> {
                if (ret === 0) {
                    let loc_data = qf.platform.getLocLoginData();
                    this.gotoLogin(loc_data.cmd, loc_data.body);
                }else {
                    this.relogin();
                }
            })
        }else {
            qf.platform.testWXLogin((cmd, body)=> {
                this.gotoLogin(cmd, body);
            })
        }
    },

    gotoLogin(cmd, body) {
        qf.event.dispatchEvent(qf.ekey.GLOBAL_SHOW_WAITING, {isAutoDestroy: false});
        qf.log.loge(body)

        let login = ()=> {
            qf.net.send({
                cmd: cmd,
                body: body,
                callback: (rsp)=> {
                    qf.log.loge(rsp);
                    qf.net.util.rspHandler(rsp, {
                        successCb: (model)=> {
                            if (model && model.blocked) {
                                //封号
                                return;
                            }else {
                                //移除封号弹窗
                            }
                            //更新用户数据
                            qf.cache.user.updateUserInfo(model.simple_user_info);
                            qf.cache.user.updateEndgame_level(model.endgame_level);
                            qf.cache.user.updateMatchGuideInfo(model.match_guide_info);
                            qf.cache.user.updateUserLoginInfo(model);

                            //获取配置数据
                            let config = null;
                            try {
                                config = qf.net.getDataBySignedBody(model.config, qf.cmd.CONFIG);
                            } catch(error) {
                                login();
                                return;
                            }

                            qf.cache.config.updateConfigInfo(config);
                            //更新国庆活动数据
                            qf.cache.config.updateNationalDayActInfo(model.bonuses1001);
                            //更新残局总关卡数
                            qf.cache.config.updateEndGameTotleLevel(model.total_level);
                            //更新模块开关
                            qf.cache.config.updateModuleConfig(model.module);
                            //更新福利信息
                            qf.cache.config.updateGiftInfoInfo(model.gift_info);
                            //广播数据（暂无模块）
                            qf.cache.broadcast.updateBroadcastInfo(model.broadcast);

                            qf.log.loge(qf.cache.config);

                            //上报通用数据
                            qf.platform.report("uin", model.uin);
                            qf.platform.report("icon", model.simple_user_info.portrait);
                            qf.platform.report("nick", model.simple_user_info.nick);

                            //上报微信托管数据
                            if (model.user_board_info) {
                                let user_board_info = model.user_board_info;
                                let rank = user_board_info.rank;
                                let nick = user_board_info.nick;
                                let icon = user_board_info.icon;
                                let level = user_board_info.level;
                                let times = user_board_info.times;
                                let rate = user_board_info.rate;
                                let score = user_board_info.score;
                                let uin = user_board_info.uin;
                                let is_new = user_board_info.is_new;

                                qf.platform.setUserCloudStorage({
                                    rank: rank,
                                    nick: nick,
                                    icon:icon,
                                    level:level,
                                    times:times,
                                    rate:rate,
                                    score:score,
                                    uin:uin,
                                    is_new:is_new,
                                })
                            }

                            this.loginSuccess();
                        },
                        failCb: ()=> {
                            
                        },
                        timeOutCb: ()=> {
                            login();
                        }
                    })
                }
            })
        }

        login();
    },

    handlerRequestServerConfig(args) {
        args = args || {};

        let cb = args.cb;
        let url = qf.utils.genGameConfigUrl();

        let hostname = window && window.location && window.location.hostname;
        
        if (hostname &&　hostname === "localhost") {
            if (cb) cb();
        }else if (CC_WECHATGAME) {
            this.requestConfigForWX(url, cb);
        }else {
            this.tryLoadGameConfig(url, cb);
        }
    },

    //初次获取服务器配置
    requestServerConfig(cb) {
        this.handlerRequestServerConfig({cb: ()=> {
            this.connectNet();
        }});
    },

    connectNet() {
        qf.net.start();
    },

    loginSuccess() {
        qf.mm.show("main");
        qf.mm.remove("loading");
    },

    relogin() {
        this.handlerRequestServerConfig({
            cb: ()=> {
                this.checkToLogin();
            }
        });
    },

    tryLoadGameConfig(url, cb) {
        let http = new HttpClient();
        http.setListener((err, content)=>{
            if (err) {
                this.tryLoadGameConfig(url, cb);
            }else {
                let data = JSON.parse(content);
                this.decodeGameConfig(data, cb);
            }
        });
        http.open(url);
        http.send();
    },

    decodeGameConfig(data, cb) {
        if (data && data.server_list && data.server_list.length > 0) {
            qf.cfg.SOCKET_IP = data.server_list[0][0];
            qf.cfg.SOCKET_PORT = data.server_list[0][1];
            qf.net.updateWsUrl();
        }

        let exitGame = ()=>{
            qf.platform.exit();
        }

        if (data.billboard) {
            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {sureCb : exitGame, isModal : true, isOnly : true, content : data.billboard, tagName:"serverStop", serverStop: true});
            return;
        }

        if (CC_WECHATGAME) {
            if (data && data.access_token) {
                qf.platform.setLocLoginAsscessToken(data.access_token);
            }
        }

        if (cb) cb();
    },

    requestConfigForWX(url, cb) {
        let getLoginDataConfig = ()=> {
            let loc_data = qf.platform.getLocLoginData();
            let launch_data = qf.platform.getLaunchData();

            let launch = {
                path: launch_data.path,
                referrerInfo: launch_data.referrerInfo,
                query: launch_data.query,
                scene: launch_data.scene
            }

            launch = JSON.stringify(launch);
            launch = encodeURIComponent(launch);

            url = url + "&code=" + loc_data.code + "&launch=" + launch;

            this.tryLoadGameConfig(url, cb);
        }

        //初始化登陆数据
        qf.platform.getRegInfo((ret)=> {
            getLoginDataConfig();
        })
    }
});