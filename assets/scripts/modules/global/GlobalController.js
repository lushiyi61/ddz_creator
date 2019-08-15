/*
公共控制器
*/

let Controller = require("../../frameworks/mvc/Controller");

cc.Class({
    extends: Controller,

    properties: {
        root: {
            override: true,
            get () {
                return qf.layer.top;
            }
        }
    },

    ctor() {
        this.isFirstIn = true;    //是否是第一次进入
        this.registerApplicationEvent();
    },

    //override
    initView() {
        let node = new cc.Node("node");
        let globalView = node.addComponent("GlobalView");
        return globalView;
    },

    registerApplicationEvent() {

        this.eventHideLock = false;
        this.eventShowLock = false;

        let onHide = ()=>{
            cc.audioEngine.stopAllEffects();
            this.eventHideLock = true;
            logd("cc.game.EVENT_HIDE");
            qf.platform.onHide();
            qf.event.dispatchEvent(qf.ekey.APPLICATION_ACTIONS_EVENT, {type: "hide"});
        }

        let onShow = (event)=>{
            this.eventShowLock = true;

            //保持屏幕常亮
            qf.platform.keepScreenOn();

            qf.log.loge(event, "cc.game.EVENT_SHOW ");
            qf.platform.onShow(event);
            qf.event.dispatchEvent(qf.ekey.APPLICATION_ACTIONS_EVENT, {type: "show"});
        }

        cc.game.on(cc.game.EVENT_HIDE, event=>{
            onHide(event);
        }, this);

        cc.game.on(cc.game.EVENT_SHOW, event=>{
            onShow(event);
        }, this);
    },

    //override
    initModuleEvent() {
        //封号登出通知
        this.addModuleEvent(qf.ekey.DDZ_USER_LOGIN_OFF_NOTIFY, this.onUserLoginOffNotify);

        //显示半透明waiting
        this.addModuleEvent(qf.ekey.GLOBAL_SHOW_WAITING, this.showWaiting);

        //移除半透明waiting
        this.addModuleEvent(qf.ekey.GLOBAL_REMOVE_WAITING, this.removeWaiting);

        //前后台切换/刷新牌桌
        this.addModuleEvent(qf.ekey.APPLICATION_ACTIONS_EVENT, this.processApplicationActionsEvt);

        //统计断线重连相关
        this.addModuleEvent(qf.ekey.STATISTICAL_RECONNECTION_INFO, this.handleStatisticalReconnectInfo);

        //发送邀请者信息
        this.addModuleEvent(qf.ekey.SEND_INVITER_REQ, this.sendInviterReq);
    },

    onUserLoginOffNotify(rsp) {
        let model = rsp.model;
        let str = qf.txt.login_loginoff;
        if(model.ban_info){
            str = model.ban_info;
        }

        let _sureCb = ()=>{
            //封号了,返回到登录页
            qf.utils.backLoadingController();
        }

        qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {sureCb : _sureCb, isModal : true, isOnly : true, content : str});
    },

    diamondNotEnough() {
        //判断模块开关
        //let loginInfo = ModuleManager.getModule("LoginController").getModel().getLoginInfo(); //标记
        let loginInfo = {};
        if(!loginInfo.diamond_activity_switch){
            qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST,{txt:qf.txt.endgame_diamond_not_enough_1});
            return;
        }

        let body = {
            isModal: false,
            isOnly: true,
            content: qf.txt.endgame_diamond_not_enough_1,
            confirmTxtImg:qf.res.global_togetDiamond,
            sureCb: ()=> {
                // 显示钻石活动
                qf.rm.checkLoad("diamondActivity", () => {
                    // qf.dm.push({ prefab: qf.res.prefab_setting, script: 'SettingView', loadded_data: true });
                    // qf.dm.pop();
                });
            }
        }
        qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, body);
    },

    showWaiting(param) {
        this.view.showWaiting(param);
    },

    removeWaiting() {
        this.view.removeWaiting();
    },

    processApplicationActionsEvt(paras) {
        qf.event.dispatchEvent(qf.ekey.GAME_ACTION_EVENT, paras);

        //发送邀请者信息 只针对邀请有礼活动
        this.sendInviterReq();

        if (!qf.platform.getUserIsAuthorization()) return;
        if (paras && paras.type === "show") {
            //qf.utils.cleanSwallowTouchesLayerCurTouch(); //标记
            let loginQuery = qf.utils.getLaunchData();
            if(qf.net.isConnected()) {
                if (!qf.cache.desk_mode){    // 目前不在牌局界面且有点击邀请  则检查是否有残局
                    if (qf.utils.isLaunchDataValid(loginQuery)) {   //点击有效链接 进入前台
                        logd("**********if (qf.utils.isLaunchDataValid(loginQuery)) {//点击有效链接 进入前台 **********");
                        //qf.mm.popExitTopModuleStack();    //标记
                        let old_roomid = this.getAutoEnterRoomId();
                        let old_deskid = this.getAutoEnterDeskId();

                        if (old_roomid && old_deskid) {
                            qf.event.emit(qf.ekey.EVT_INPUT_SPECIFIED_DESK, { room_id: old_roomid, desk_id: old_deskid });
                            qf.platform.clearLocLaunchAndShowData();//清除启动和切前台的数据
                        }
                        else {
                            let room_id = qf.func.checkint(loginQuery.room_id);
                            let desk_id = qf.func.checkint(loginQuery.desk_id);
                            //检查是否有残局  没有残局直接进入邀请牌局  有残局且不是同一个牌局提示有残局  是同一个牌局直接进入。
                            qf.event.dispatchEvent(qf.ekey.ROOM_CHECK,{
                                roomid: room_id,
                                deskid: desk_id,
                                roomCheckCallBack:()=>{
                                    qf.event.emit(qf.ekey.EVT_INPUT_SPECIFIED_DESK, { room_id: roomid, desk_id: deskid });
                                }
                            });
                        }
                    }

                    if(loginQuery.type === qf.const.LaunchOptions.TYPE_GROUP_RANK_SHARE){
                        let onshowOptions = qf.platform.getOnShowOptions();
                        if(onshowOptions){
                            let shareTicket = onshowOptions.shareTicket;

                            if(shareTicket){

                                // 标记
                                // if(qf.mm.get("GroupRankController").view){
                                //     qf.mm.get("GroupRankController").view.remove();
                                // }
                                //
                                // if(qf.mm.get("RankController").view){
                                //     qf.mm.get("RankController").view.remove();
                                // }
                                //
                                // if(qf.mm.get("EndGameRankController").view) {
                                //     qf.mm.get("EndGameRankController").view.remove();
                                // }
                                //
                                // //显示群排行榜
                                // qf.rm.checkLoad("rank", () => {
                                //     qf.dm.push({ prefab: qf.res.prefab_setting, script: 'SettingView', loadded_data: true });
                                //     qf.dm.pop();
                                // });
                            }
                        }
                    }

                    // 残局榜群分享进入
                    if(loginQuery.type === qf.const.LaunchOptions.TYPE_END_GAME_GROUP_RANK_SHARE){
                        let onshowOptions = qf.platform.getOnShowOptions();
                        if(onshowOptions){
                            let shareTicket = onshowOptions.shareTicket;
                            if(shareTicket){
                                // if(qf.mm.get("EndGameRankController").view) {
                                //     qf.mm.get("EndGameRankController").view.remove();
                                // }
                                //
                                // if(qf.mm.get("GroupRankController").view){
                                //     qf.mm.get("GroupRankController").view.remove();
                                // }
                                //
                                // if(qf.mm.get("RankController").view){
                                //     qf.mm.get("RankController").view.remove();
                                // }
                                //
                                // //显示群排行榜
                                // qf.rm.checkLoad("endGameRank", () => {
                                //     qf.dm.push({ prefab: qf.res.prefab_setting, script: 'SettingView', loadded_data: true });
                                //     qf.dm.pop();
                                // });
                            }
                        }
                    }
                }
            }

            let isFormal = true;
            if (cc.game.config["debugMode"] === 1 && !isFormal) //模拟公众号前后台切换
            {
                if (!this.isFirstIn)
                {
                    qf.net.send({cmd: qf.cmd.DDZ_SUBSCRIBEGIFT_REQ, body:{},isNeedResend:true});
                }
            }

            //是否是从微信公众号关注有礼切换进来的
            let onshowQuery = qf.platform.getOnShowData();
            console.log(">>>>>>>>>>>>>>>>onshowdata<<<<<<<<<<<<<<<<<<<<", onshowQuery);
            if (onshowQuery && onshowQuery.dst && onshowQuery.dst === LaunchOptions.wxgzh_type)
            {
                //第一次进入游戏不走这里的，只有在游戏中切换前后台时走这里
                if (!this.isFirstIn)
                {
                    qf.net.send({cmd: qf.cmd.DDZ_SUBSCRIBEGIFT_REQ, body:{},isNeedResend:true});
                }
            }

            this.isFirstIn = false;
            //分享链接被点击次数上报
            let shareType = 0;//默认为0
            if (loginQuery.type === qf.const.LaunchOptions.TYPE_COUNTER_SHARE)
            {
                shareType = qf.const.ShareMsgType.SHARE;//立即分享
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_COUNTER_INVITE){
                shareType = qf.const.ShareMsgType.INVITE;//立即邀请
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_INVITATION_SHARE){
                shareType = qf.const.ShareMsgType.INVITATION;//邀请有礼
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_FRIEND_FROOM_INVITE){
                shareType = qf.const.ShareMsgType.GAMEINVITE;  //好友游戏邀请
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_GAME_OVER_SHARE){
                shareType = qf.const.ShareMsgType.GAMEOVER;  //比赛场结算分享
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_EXIT_SHARE){
                shareType = qf.const.ShareMsgType.EXITSHARE;  //退赛分享
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_EXCHANGE_SHARE){
                shareType = qf.const.ShareMsgType.EXCHANGESHARE;   //兑换分享
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_GROUP_SELFRANK_SHARE){
                shareType = qf.const.ShareMsgType.GROUPSELFRENKSHARE;  //群排行炫耀一下
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_BEST_RANK_SHARE){
                shareType = qf.const.ShareMsgType.BESTRANKSHARE;  //最强王者分享
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_GROUP_RANK_SHARE){
                shareType = qf.const.ShareMsgType.GROUPRENKSHARE;   //查看群排行
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_BANKRUPT_SHARE){
                shareType = qf.const.ShareMsgType.BANKRUPT;    //破产保护
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_CLASSIC_GAME_OVER_SHARE){
                shareType = qf.const.ShareMsgType.GAMEOVERCLASSICSHARE;   //经典场结算分享
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_EVENTACTIVITY_SHARE){
                shareType = qf.const.ShareMsgType.EVENTACTIVITY;         //赛事活动限时有礼
            }
            else if(loginQuery.type === qf.const.LaunchOptions.TYPE_WELFARE_SHARE){
                shareType = qf.const.ShareMsgType.REWARDLOGINAWARDSHARE;         //登陆奖励分享进入
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_FLOWMAIN_SHARE) {
                shareType = qf.const.ShareMsgType.TYPEFLOWMAINSHARE;         //流量主分享进入
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_NATIONALDAY_SHARE) {
                shareType = qf.const.ShareMsgType.NATIONALDAYSHARE;         //国庆活动分享（微信分享）
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_CLASSIC_RESULT_SHARE.SHARE_DOUBLE){
                shareType = qf.const.ShareMsgType.CLASSIC_RESULT_SHARE_DOUBLE;         //经典场结算分享翻倍
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_CLASSIC_RESULT_SHARE.SHARE_EXCUSE_LOSING){
                shareType = qf.const.ShareMsgType.CLASSIC_RESULT_SHARE_EXCUSE_LOSING;         //经典场结算分享免输
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_CLASSIC_RESULT_SHARE.HIGH_CONTINUOUS_WIN){
                shareType = qf.const.ShareMsgType.CLASSIC_RESULT_HIGH_CONTINUOUS_WIN;         //经典场结算高连胜
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_CLASSIC_RESULT_SHARE.HIGH_MUTIPLE){
                shareType = qf.const.ShareMsgType.CLASSIC_RESULT_HIGH_MUTIPLE;         //经典场结算高倍数
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_CLASSIC_RESULT_SHARE.SPRING){
                shareType = qf.const.ShareMsgType.CLASSIC_RESULT_SPRING;         //经典场结算春天
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_COMPETITION_RESULT_SHARE.WIN){
                shareType = qf.const.ShareMsgType.COMPETITION_RESULT_WIN;         //比赛场结算胜利
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_COMPETITION_RESULT_SHARE.LOSE){
                shareType = qf.const.ShareMsgType.COMPETITION_RESULT_LOSE;         //比赛场结算失败
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_COMPETITION_RESULT_SHARE.SAVE){
                shareType = qf.const.ShareMsgType.COMPETITION_RESULT_SAVE;         //比赛场结算保级
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_ENDGAME_RESULT_WIN){
                shareType = qf.const.ShareMsgType.ENDGAME_RESULT_WIN;              //残局结算胜利分享
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_END_GAME_GROUP_RANK_SHARE){
                shareType = qf.const.ShareMsgType.ENDGAMEGROUPRENK;              //残局群排行
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_APP_SHARE){
                shareType = qf.const.ShareMsgType.APPSHARE;              //小游戏自带转发
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_FIRST_ENTER_ENDGAME){
                shareType = qf.const.ShareMsgType.ENDGAMEDOUBLEDIAMOND;              //每日首次进入残局大厅双倍钻石
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_DIAMONDACTIVITY_SHARE) {        //钻石红包
                shareType = qf.const.ShareMsgType.DIAMONDREDPACKET;
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_DIAMONDACTIVITY_INVITE_SHARE){  //钻石分享
                shareType = qf.const.ShareMsgType.DIAMONDINVITE;
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_REWARD_DIAMOND_SHARE){          //通用获取钻石框内 分享
                shareType = qf.const.ShareMsgType.REWARDDIAMONDSHARE;
            }
            else if (loginQuery.type === qf.const.LaunchOptions.TYPE_REWARD_DIAMOND_INVITE){         //通用获取钻石框内 邀请
                shareType = qf.const.ShareMsgType.REWARDDIAMONDINVITE;
            }

            //二维码判断分享进入
            let launchData = qf.platform.getLaunchData();
            if (loginQuery.query && loginQuery.query.scene) {
                let invite = qf.utils.parseKV(decodeURIComponent(launchData.query.scene));
                if (parseInt(invite.type) === 1007){
                    shareType = qf.const.ShareMsgType.NATIONALDAYSHARE_QRCODE;         //国庆活动分享（二维码分享）
                }
            }

            if (shareType)
            {
                qf.platform.uploadEventStat({   //用户点击进入
                    "module": "share",
                    "event": qf.rkey.PYWXDDZ_EVENT_SHARE_SHARED_CLICK,
                    "custom":{
                        type:shareType,
                        img_id:loginQuery.shareId,
                    }
                });
            }
        }
    },

    getAutoEnterRoomId() {
        let loginInfo = qf.cache.user.userLoginInfo;
        let old_roomid = loginInfo.old_roomid;
        if (old_roomid && old_roomid > 0) {
            return old_roomid;
        }
        return null;
    },
    getAutoEnterDeskId() {
        let loginInfo = qf.cache.user.userLoginInfo;
        let desk_id = loginInfo.desk_id;
        if (desk_id && desk_id > 0) {
            return desk_id;
        }
        return null;
    },

    handleStatisticalReconnectInfo() {
        //Cache.globalInfo.setStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_RECONNECT_INOT_HALL);
    },

    sendInviterReq() {
        let loginQuery = qf.utils.getLaunchData();
        if(loginQuery.fromUin === qf.cache.user.uin) return;

        let inviter_uin = loginQuery.fromUin;
        let inviter_type = loginQuery.type;

        if(inviter_type === qf.const.LaunchOptions.TYPE_INVITATION_SHARE){
            let inviter_info = {
                inviter_uin: parseInt(inviter_uin),
                inviter_type: qf.const.INVITE_TYPE.INVITATION,
            };
            qf.net.send({
                cmd: qf.cmd.BE_INVITER_ENTER_REQ, wait: true, body: {inviter_info: inviter_info}, callback: (rsp)=> {
                    qf.net.util.rspHandler(rsp, {
                        successCb: (model)=> {
                            if(!model) return;

                            //自己给自己助力
                            if(model.inviter_help_ret.ret_help === qf.const.INVITATION_RET_TYPE.ZJGZJZL) return;

                            // 显示助力信息弹框
                            // if(!ModuleManager.isStackTopModule("InvitationController")){
                            //     function pushInvitationModule() {
                            //         //显示邀请有礼
                            //         ModuleManager.pushModule("InvitationController", {data: true});
                            //         if(ModuleManager.getModule("InvitationController").getView())
                            //             ModuleManager.getModule("InvitationController").getView().beInviterBackTips(model.inviter_help_ret);
                            //     }
                            //
                            //     ModuleManager.checkPreLoadModule({callback: pushInvitationModule, loadResName: "invitation"});
                            // } else {
                            //     if(ModuleManager.getModule("InvitationController").getView())
                            //         ModuleManager.getModule("InvitationController").getView().beInviterBackTips(model.inviter_help_ret);
                            // }
                        }
                    });
                }
            });
        }else if(inviter_type === qf.const.LaunchOptions.TYPE_DIAMONDACTIVITY_SHARE || inviter_type === qf.const.LaunchOptions.TYPE_DIAMONDACTIVITY_INVITE_SHARE){
            let inviter_type = inviter_type === qf.const.LaunchOptions.TYPE_DIAMONDACTIVITY_SHARE ? qf.const.INVITE_TYPE.DIAMONDACTIVITY:
                qf.const.INVITE_TYPE.DIAMONDACTIVITY_INVITE;

            let inviter_info = {
                inviter_uin: parseInt(inviter_uin),
                inviter_type: inviter_type,
            };

            if(inviter_type === qf.const.INVITE_TYPE.DIAMONDACTIVITY_INVITE) return;

            qf.net.send({
                cmd: qf.cmd.BE_INVITER_ENTER_REQ, wait: true, body: {inviter_info: inviter_info}, callback: (rsp)=> {
                    qf.net.util.rspHandler(rsp, {
                        successCb: (model)=> {
                            if(!model) return;
                            //自己给自己助力
                            if(model.diamond_share_ret.ret_help === qf.const.DIAMOND_INVITATION_RET_TYPE.ZJGZJZL) return;

                            // 显示助力信息弹框
                            // if(!ModuleManager.isStackTopModule("DiamondActivityController")){
                            //     function pushInvitationModule() {
                            //         //显示邀请有礼
                            //         ModuleManager.pushModule("DiamondActivityController", {data: true});
                            //         if(ModuleManager.getModule("DiamondActivityController").getView())
                            //             ModuleManager.getModule("DiamondActivityController").getView().beInviterBackTips(model.diamond_share_ret);
                            //     }
                            //
                            //     ModuleManager.checkPreLoadModule({callback: pushInvitationModule, loadResName: "diamondActivity"});
                            // } else {
                            //     if(ModuleManager.getModule("DiamondActivityController").getView())
                            //         ModuleManager.getModule("DiamondActivityController").getView().beInviterBackTips(model.diamond_share_ret);
                            // }
                        }
                    });
                }
            });
        }else if(inviter_type === qf.const.LaunchOptions.TYPE_REWARD_DIAMOND_SHARE || inviter_type === qf.const.LaunchOptions.TYPE_REWARD_DIAMOND_INVITE){
            let inviter_info = {
                inviter_uin: parseInt(inviter_uin),
                inviter_type: qf.const.INVITE_TYPE.REWARDDIAMOND,
            };
            qf.net.send({
                cmd: qf.cmd.BE_INVITER_ENTER_REQ, wait: true, body: {inviter_info: inviter_info}, callback: (rsp)=> {
                    logd(rsp);
                    qf.net.util.rspHandler(rsp, {
                        successCb: (model)=> {
                            if(!model || !model.diamond_store_ret) return;

                            //自己给自己助力
                            if(model.diamond_store_ret.ret_help === 0) {
                                let str = cc.js.formatStr(qf.txt.reward_diamond_shareFriend3,model.diamond_store_ret.nick ,model.diamond_store_ret.diamond);
                                qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, {txt: str});
                            }
                        }
                    });
                }
            });
        }
    }

});