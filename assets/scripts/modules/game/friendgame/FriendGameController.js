/*
    好友房牌桌控制器
 */

let NormalGameController = require("../normalgame/NormalGameController");

cc.Class({
    extends: NormalGameController,

    properties: {
        TAG: {
            override: true,
            default: "FriendGameController",
        },
    },

    //override
    initView(params) {
        let node = cc.instantiate(cc.loader.getRes(qf.res.prefab_table));
        let script = node.addComponent("FriendGameView");
        script.init(params);
        return script;
    },
    
    //override
    initModuleEvent() {
        this._super();

        //站起请求
        this.addModuleEvent(qf.ekey.DDZ_USER_STAND_REQ, this.requestStandUp, this);
        //站起通知
        this.addModuleEvent(qf.ekey.NET_USER_STAND_NOTIFY, this.ontStandUpNotify, this);
        //坐下请求
        this.addModuleEvent(qf.ekey.DDZ_USER_SITDOWN_REQ, this.requestSitDown, this);
        //坐下通知
        this.addModuleEvent(qf.ekey.NET_USER_SITDOWN_NOTIFY, this.ontSitDownNotify, this);
        //新开房间
        this.addModuleEvent(qf.ekey.LORD_REQUEST_VIEWER_CREATE_DESK, this.requestViewerCreateDesk, this);

        //踢人请求
        this.addModuleEvent(qf.ekey.KICK_OUT_REQ, this.kickOutReq, this);
    },

    //站起请求
    requestStandUp(paras) {
        logd("FriendLordGameController:requestStandUp");

        qf.net.send({cmd: qf.cmd.DDZ_USER_STAND_REQ, body: {}, callback(rsp) {
            qf.net.util.rspHandler(rsp, {successCb(model) {   // 站起引导
                this.view.showStandUpGuide();
            }, failCb: ()=>{
                let loginInfo = qf.cache.config;
                let type = qf.const.GUIDE_TYPE.FRIEND_STANDUP;

                qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, {txt: qf.cache.config.errorMsg[rsp.ret] || cc.js.formatStr(qf.txt.common_error_tips, rsp.ret)});
                if (loginInfo.isNeedGuide(type)) {
                    // 通知服务器引导完成
                    qf.net.send({cmd:qf.cmd.DDZ_NEW_USER_GUIDANCE_REQ, wait: false, body: {type: type},callback(rsp) {
                        qf.net.util.rspHandler(rsp, {successCb(model) {
                            // ModuleManager.getModule("LoginController").getModel().setGuide(type, true);
                        }});
                    }
                    });
                }
            }});
        }});
    },

    //站起通知
    ontStandUpNotify(rsp) {
        logd("FriendLordGameController:ontStandUpNotify");
        //dump(rsp.model);
        let op_user  = qf.cache.desk.getUserByUin(rsp.model.op_uin);
        qf.cache.desk.updateCacheByStandup(rsp.model);
        this.view.userStandUp(op_user.seat_id);
        if (rsp.model.op_uin === qf.cache.user.uin) {
            let instance = qf.cache.global.getStatUploadTime(qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_STAND_UP);
            if(instance) {
                qf.platform.uploadEventStat({   //好友房切换站起
                    "module": "performance",
                    "event": qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_STAND_UP,
                    "value": instance,
                });
            }
        }
    },
    //坐下请求
    requestSitDown(paras) {
        logd("FriendLordGameController:requestSitDown");
        let seat_id = paras.seat_id;
        qf.net.send({cmd: qf.cmd.DDZ_USER_SITDOWN_REQ, body:{seat_id:seat_id}, callback(rsp) {
            qf.net.util.rspHandler(rsp);
        }});
    },

    //坐下通知
    ontSitDownNotify(rsp) {
        logd("FriendLordGameController:ontSitDownNotify");
        //dump(rsp.model);
        qf.cache.desk.updateCacheBySitDown(rsp.model);
        this.view.userSitDown();
        let op_uin = qf.cache.desk.getOpUin();
        if (op_uin == qf.cache.user.uin) {//是自己坐下  处理
            let instance = qf.cache.global.getStatUploadTime(qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_SIT_DOWN);
            if(instance) {
                qf.platform.uploadEventStat({   //好友房切换坐下
                    "module": "performance",
                    "event": qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_SIT_DOWN,
                    "value": instance,
                    "custom": 2,
                });
            }
        }

    },
    //发起新开房间请求
    requestViewerCreateDesk(paras) {
        logd("requestViewerCreateDesk");
        //显示loading界面，收到进桌推送后再移除
        qf.net.send({cmd: qf.cmd.LORD_VIEWER_CREATE_DESK_REQ, wait: true, body: {}, callback(rsp) {
            //dump(rsp);
            qf.net.util.rspHandler(rsp,{successCb(model) {
                logd("**********requestViewerCreateDesk success**********");
                qf.cache.desk = null;
                qf.cache.desk = new FriendLordDesk();
                // ModuleManager.reloadToTopModule("GameController");
                qf.mm.clean();
                qf.mm.show("friendgame");

                //发送进桌通知
                qf.event.dispatchEvent(qf.ekey.LORD_NET_ENTER_DESK_NOTIFY, rsp);

            }});
        }});
    },

    updateChatRecord(record) {
        qf.cache.chat_records.push(record);
        let refreshFunc = (chat_view)=>{
            if (chat_view) chat_view.refreshRecordList(Cache.chat_records);
        }
        qf.event.dispatchEvent(qf.ekey.GET_VIEW_DIALOG_BY_NAME, {name:"gamechat",cb:refreshFunc});
    },

    //踢人请求
    kickOutReq(args){
        let kickUin = args.uin;

        qf.net.send({cmd: qf.cmd.DDZ_KICK_OUT_REQ, wait: true, body: {kick_uin: kickUin}, callback(rsp) {
            //dump(rsp);
            qf.net.util.rspHandler(rsp,{successCb(model) {
                //0: 踢人成功  1: 踢人失败
                if(model.result === 0) {
                    qf.event.dispatchEvent(qf.ekey.REMOVE_VIEW_DIALOG, {name: "lordotherinfo"});
                    qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, {txt: model.desc});
                } else if(model.result === 1) {
                    qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {sureCb : ()=>{
                    }, isModal : false, isOnly : true, content : model.desc});
                }
            }});
        }});
    },

    //override
    updateCounterNum() {

    },

    //override
    isInMatchView(args) {
        let text = qf.cache.config.errorMsg[args.ret] || qf.txt.tip_error_desc_6;
        qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, {txt: text});
        qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME);
    },

    //赛事活动通知
    onJoinMatchRewardNotify(rsp) {

    },

    //更新赛事活动界面
    updateEventActivityDialog(rsp) {

    },
});
