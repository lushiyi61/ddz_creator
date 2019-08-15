
let NormalGameController = require("../normalgame/NormalGameController");

cc.Class({
    extends: NormalGameController,

    properties: {
        TAG: {
            override: true,
            default: "EventGameController",
        },
    },

    //override
    initView(params) {
        let node = cc.instantiate(cc.loader.getRes(qf.res.prefab_table));
        let script = node.addComponent("EventGameView");
        script.init(params);
        return script;
    },

    //override
    initModuleEvent() {
        this._super();

        //打开赛事详情弹窗
        this.addModuleEvent(qf.ekey.OPEN_ROUND_DETAIL_DIALOG, this.onOpenRoundDetailDialog, this);

        //结算分享
        this.addModuleEvent(qf.ekey.DZZ_EVENT_RESULT_SHARE, this.onShareFunc, this);

        //最强王者分享
        this.addModuleEvent(qf.ekey.DDZ_EVENT_RESULT_WANGZHE_SHARE, this.onWangZheShare, this);
    },

    initGlobalEvent() {
        this._super();

        //领取金币宝箱
        qf.event.on(qf.ekey.PICK_GOLD_BOX_REQ, this.pickGoldBoxReq, this);

        //分享保级
        qf.event.on(qf.ekey.DZZ_EVENT_SAVE_LEVEL, this.onResultSaveLevelSuccess, this);

        //打开赛事匹配界面
        qf.event.on(qf.ekey.SHOW_EVENT_MATCH_DIALOG, this.showEventMatchDialog, this);
        //移除赛事匹配界面
        qf.event.on(qf.ekey.REMOVE_EVENT_MATCH_DIALOG, this.removeEventMatchDialog, this);
        //刷新赛事匹配界面
        qf.event.on(qf.ekey.UPDATE_EVENT_MATCH_VIEW, this.updateEventMatchView, this);
    },

    showEventMatchDialog(args){
        qf.rm.checkLoad("event_match",()=>{
            let data = {
                prefab: qf.res.prefab_event_match,
                script: 'EventMatchDialog',
                loadded_data: true,
                init_data:args,
            }
            this.id_event_match_dia = qf.dm.push(data);
            qf.dm.pop();
        })
    },

    removeEventMatchDialog(){
        let handler = qf.dm.getDialog(this.id_event_match_dia);
        handler && handler.removeSelf();
    },

    updateEventMatchView(args){
        let handler = qf.dm.getDialog(this.id_event_match_dia);
        handler && handler.refreshUI(args.enterUin);
    },

    onOpenRoundDetailDialog() {
        qf.net.send({
            cmd: qf.cache.desk.getReqCmd().roundDetailCmd,
            body: {},
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        if (model) {
                            // function eventRoundDetailModule() {
                            //     qf.event.dispatchEvent(qf.ekey.OPEN_VIEW_DIALOG, {name: "eventrounddetail",data: model});
                            // }
                            //
                            // ModuleManager.checkPreLoadModule({callback: eventRoundDetailModule, loadResName: "eventrounddetail"});
                        }
                    }
                });
            }
        });
    },

    //炫耀一下/吐槽一下/分享保级
    onShareFunc(args) {
        let type = args.type;
        let info = args.info;
        let curLevel = args.curLevel;
        let shareType = type;
        let data = "type=" + qf.const.LaunchOptions.TYPE_GAME_OVER_SHARE + "&fromUin=" + qf.cache.user.uin;
        logd("shareMessage  query:" + data);
        let title = qf.txt.stringShareTitle; //默认标题
        let imgUrl = qf.tex.share_banner_normal_game; //默认图片
        let id = -1;

        let share_type_str = null;
        if (type === qf.const.EVENT_RESULT_SHARE_TYPE.WIN) {
            share_type_str = qf.const.SHARE_STRING_KEY.MATCH_SHARE_WIN_300;
        } else if (type === qf.const.EVENT_RESULT_SHARE_TYPE.LOSE) {
            share_type_str = qf.const.SHARE_STRING_KEY.MATCH_SHARE_LOSS_300;
        } else if (type === qf.const.EVENT_RESULT_SHARE_TYPE.SAVE) {
            share_type_str = qf.const.SHARE_STRING_KEY.MATCH_SHARE_PROTECT_300;
        } else if (type === qf.const.EVENT_RESULT_SHARE_TYPE.SAVESUCCESS) {
            share_type_str = qf.const.SHARE_STRING_KEY.MATCH_SHARE_PROTECT_300;
        }

        qf.net.send({
            cmd: qf.cmd.GET_SHARE_INFO_REQ,
            body: { share_type_str: share_type_str },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        if (!model) return;

                        //随机图片
                        if (shareType === qf.const.EVENT_RESULT_SHARE_TYPE.WIN || shareType === qf.const.EVENT_RESULT_SHARE_TYPE.SAVESUCCESS) {
                            //胜利或保级成功
                            let shareInfo = model.share_info;
                            if (shareInfo && shareInfo.icon && shareInfo.share_id) {
                                imgUrl = shareInfo.icon;
                                title = shareInfo.str;
                                id = shareInfo.share_id;
                            }
                        } else {
                            let shareImgUrls = qf.cache.Config.shareImgUrls;
                            if (shareImgUrls && shareImgUrls.length > 0) {
                                let random_num = Math.floor(Math.random() * 10);
                                let index = random_num % (shareImgUrls.length);
                                imgUrl = shareImgUrls[index].img_url;
                                title = shareImgUrls[index].title;
                                id = shareImgUrls[index].id;
                            }

                            let shareInfo = model.share_info;
                            if (shareType === qf.const.EVENT_RESULT_SHARE_TYPE.LOSE) {
                                //失败分享
                                if (shareInfo) {
                                    imgUrl = shareInfo.icon;
                                    title = shareInfo.str;
                                    id = shareInfo.share_id;
                                    logd("----------------------------赛事失败分享图文----------------------------");
                                }
                            }
                            if (shareType === qf.const.EVENT_RESULT_SHARE_TYPE.SAVE) {
                                //失败分享
                                if (shareInfo) {
                                    imgUrl = shareInfo.icon;
                                    title = shareInfo.str;
                                    id = shareInfo.share_id;
                                    logd("----------------------------保级分享图文----------------------------");
                                }
                            }

                        }
                        //数据上报
                        qf.platform.uploadEventStat({
                            "module": "share",
                            "event": qf.rkey.PYWXDDZ_EVENT_SHARE_CLICK_SHARE_BTN,
                            "custom": {
                                scene: qf.const.ShareScene.GAME,
                                via: qf.const.ShareMsgType.GAMEOVER,
                                img_id: id,
                                type: shareType,
                                level: curLevel
                            }
                        });
                        let shareSuccess = () => {
                            qf.platform.uploadEventStat({
                                "module": "share",
                                "event": qf.rkey.PYWXDDZ_EVENT_SHARE_SUCCESS,
                                "custom": {
                                    scene: qf.const.ShareScene.GAME,
                                    via: qf.const.ShareMsgType.GAMEOVER,
                                    img_id: id,
                                    type: shareType,
                                    level: curLevel
                                }
                            });
                        }
                        qf.platform.shareMessage({
                            imageUrl: imgUrl,
                            title: title,
                            shareId: id,
                            query: "type=" + qf.const.TYPE_COMPETITION_RESULT_SHARE[type] + "&fromUin=" + qf.cache.user.uin,
                            scb: (res) => {
                                logd("--------------------ShareSuccess------------------");
                                shareSuccess();
                                if (shareType === qf.const.EVENT_RESULT_SHARE_TYPE.SAVE) {
                                    logd("save level success");
                                    if (this.view && this.dialogController) {
                                        let view = this.dialogController.getEventViewByName("event_game_over");
                                        if (view) {
                                            view.shareSuccessFunc();
                                            this.onResultShareSuccess(info);
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            }
        });
    },

    //结算分享成功
    onResultShareSuccess(args) {
        let body = {
            share_type: args.share_type,
            hand_id: args.hand_id,
        };
        qf.net.send({
            cmd: qf.cmd.DDZ_GAME_SHARE_REQ,
            wait: true,
            body: body,
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (mode) => {
                        qf.cache.desk.updateSaveLeval(mode);
                        if (this.view && this.dialogController) {
                            let view = this.dialogController.getEventViewByName("event_game_over");
                            if (view) {
                                view.saveLevelSuccess();
                            }
                            this.dialogController.handleRemoveDialog({ name: "event_game_over" });
                            this.dialogController.handleOpenDialog({ name: "event_game_over" });
                        }
                    },
                    failCb: () => {
                        if (this.view && this.dialogController) {
                            let view = this.dialogController.getEventViewByName("event_game_over");
                            if (view) {
                                view.saveLevelFail();
                            }
                        }
                        qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.cache.Config.errorMsg[rsp.ret] || cc.js.formatStr(qf.txt.common_error_tips, rsp.ret) });
                    }
                });
            }
        });
    },
    //override
    updateShowCardBtn(args) {

    },

    getUserChangeDeskCmd() {
        return qf.cmd.EVENT_USER_CHANGE_DESK_REQ;
    },

    //override
    callPointAction(grab_action) {

        // if(grab_action > 0)
        //     this.view.showMultiAction(grab_action);
    },

    //抢地主确认分两步通知处理
    callPointAfterHandle() {

        if (!this.view) return;

        //如果轮到我操作，需显示加倍、不加倍按钮
        if (qf.cache.desk.isMyTurn()) {
            this.view.getButtonManager().updateDoubleBtns();
        } else {
            if (qf.cache.desk.isMySelfLand()) {
                this.view.setWaitMultiShow(true);
            }
        }

        //隐藏显示气泡
        let userList = qf.cache.desk.getUserList();
        for (let uin in userList) {
            let v = userList[uin];
            let uView = this.view.getUser(v.uin);
            if (uView) {
                uView.clearTips();
            }
        }
    },

    onResultSaveLevelSuccess(args) {
        //数据上报
        qf.platform.uploadEventStat({
            "module": "share",
            "event": qf.rkey.PYWXDDZ_EVENT_SHARE_CLICK_SHARE_BTN,
            "custom": {
                scene: qf.const.ShareScene.GAME,
                via: qf.const.ShareMsgType.GAMEOVER,
                type: qf.const.EVENT_RESULT_SHARE_TYPE.SAVE,
            }
        });
        qf.platform.uploadEventStat({
            "module": "share",
            "event": qf.rkey.PYWXDDZ_EVENT_SHARE_SUCCESS,
            "custom": {
                scene: qf.const.ShareScene.GAME,
                via: qf.const.ShareMsgType.GAMEOVER,
                type: qf.const.EVENT_RESULT_SHARE_TYPE.SAVE,
            }
        });

        let body = {
            share_type: args.share_type,
            hand_id: args.hand_id,
        };
        qf.net.send({
            cmd: qf.cmd.DDZ_GAME_SHARE_REQ,
            wait: true,
            body: body,
            callback: (rsp) => {
                dump(rsp);
                qf.net.util.rspHandler(rsp, {
                    successCb: (mode) => {
                        qf.cache.desk.updateSaveLeval(mode);
                        if (this.view && this.dialogController) {
                            let view = this.dialogController.getEventViewByName("event_game_over");
                            if (view) {
                                view.saveLevelSuccess();
                            }
                            this.dialogController.handleRemoveDialog({ name: "event_game_over" });
                            this.dialogController.handleOpenDialog({ name: "event_game_over" });
                        }
                    },
                    failCb: () => {
                        if (this.view && this.dialogController) {
                            let view1 = this.dialogController.getEventViewByName("event_game_over");
                            if (view1) {
                                qf.event.dispatchEvent(qf.ekey.REMOVE_VIEW_DIALOG, { name: "event_coin_box" });

                                let view2 = this.dialogController.getEventViewByName("event_coin_box");
                                if (view2) {
                                    this.dialogController.handleRemoveDialog({ name: "event_coin_box" });
                                }
                            }
                        }

                        qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.cache.Config.errorMsg[rsp.ret] || cc.js.formatStr(qf.txt.common_error_tips, rsp.ret) });
                    }
                });
            }
        });
    },
    onWangZheShare() {
        let resultInfo = qf.cache.desk.getResultInfo();

        qf.net.send({
            cmd: qf.cmd.GET_SHARE_INFO_REQ,
            body: { share_type_str: qf.const.SHARE_STRING_KEY.PROMOTION_GUIDE_SHARE_500 },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        if (!model) return;

                        let shareInfo = model.share_info;

                        let sharetype = qf.const.LaunchOptions.TYPE_EVENT_WANGZHE_SHARE;
                        let data = "type=" + sharetype + "&fromUin=" + qf.cache.user.uin;
                        logd("shareMessage  query:" + data);
                        let title = qf.txt.stringShareTitle; //默认标题
                        let imgUrl = qf.tex.share_banner_normal_game; //默认图片
                        let id = -1;

                        if (shareInfo && shareInfo.icon && shareInfo.share_id) {
                            imgUrl = shareInfo.icon;
                            title = shareInfo.str;
                            id = shareInfo.share_id;
                        }

                        qf.platform.shareMessage({
                            imageUrl: imgUrl,
                            title: title,
                            shareId: id,
                            query: "type=" + sharetype + "&fromUin=" + qf.cache.user.uin,
                            scb: (res) => {}
                        });
                    }
                });
            }
        });
    },

    //override
    onSpecailDeskShow() {
        logd("onSpecailDeskShow0");
        if (!this.view) {
            return;
        }
        let isEventResultShow = false;
        let view = null;
        let view2 = null;
        if (this.dialogController) {
            view = this.dialogController.getEventViewByName("event_game_over");
            view2 = this.dialogController.getEventViewByName("event_wangzhe_share");
            if (view || view2) {
                isEventResultShow = true;
            }
        }

        if (isEventResultShow) {
            //比赛场结算界面存在，不查询牌桌
            logd("onSpecailDeskShow");
            this.clearModuleEvent();
            this.initModuleEvent();
            if (this.dialogController) {
                this.dialogController.onInitModuleEvent();
                if (view) {
                    view.startTimer();
                }
            }
        } else {
            //查询牌桌
            this._super();
        }
    },

    //override
    isInMatchView(args) {
        let text = qf.cache.Config.errorMsg[args.ret] || qf.txt.tip_error_desc_6;
        qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: text });
        qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME);
    },

    //领取金币宝箱
    pickGoldBoxReq(args) {
        let is_protect_level = args.is_protect_level;

        qf.net.send({
            cmd: qf.cmd.PICK_GOLD_BOX_REQ,
            wait: true,
            body: { is_protect_level: is_protect_level },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        if (model) {
                            qf.event.dispatchEvent(qf.ekey.REMOVE_VIEW_DIALOG, { name: "event_coin_box" });

                            let view = this.dialogController.getEventViewByName("event_coin_box");
                            if (view) {
                                this.dialogController.handleRemoveDialog({ name: "event_coin_box" });
                            }

                            qf.event.dispatchEvent(qf.ekey.SHOW_REWARD_DIALOG, { rewardNum: model.gold });
                        }
                    }
                });
            }
        });
    },

});