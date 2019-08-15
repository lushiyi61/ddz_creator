let AbstractGameController = require("../AbstractGameController");

cc.Class({
    extends: AbstractGameController,

    initView(params) {
        let prefab = cc.loader.getRes(qf.res.prefab_endgame);
        let script = cc.instantiate(prefab).getComponent("EndGameView");
        script.init(params);
        return script;
    },

    initModuleEvent() {
        this._super();

        this.addModuleEvent(qf.ekey.LORD_NET_EXIT_DESK_REQ, this.requestExitDesk);            //退桌请求
        this.addModuleEvent(qf.ekey.LORD_NET_DISCARD_REQ, this.requestDescard);               //出牌请求
        this.addModuleEvent(qf.ekey.LORD_NET_EXIT_DESK_NOTIFY, this.onUserLeave);             //退桌通知
        this.addModuleEvent(qf.ekey.LORD_NET_RESULT_NOTIFY, this.onResult);                   //牌局结束通知
        this.addModuleEvent(qf.ekey.DDZ_OPUSER_NOTIFY, this.onOpUserNotify);                  //牌桌操作通知
        this.addModuleEvent(qf.ekey.LORD_NET_START_GAME_NOTIFY, this.onStartGame);            //牌桌开始通知
        this.addModuleEvent(qf.ekey.LORD_NET_DISCARD_NOTIFY, this.onPlayGame);                //可以开始出牌通知
        this.addModuleEvent(qf.ekey.LORD_ENDGAME_REMIND, this.requestRemind);                 //提示请求
        this.addModuleEvent(qf.ekey.LORD_ENDGAME_REMIND_VIEW, this.openRemindView);           //打开提示弹窗
        this.addModuleEvent(qf.ekey.UPDATE_USER_DIAMOND, this.onDiamondChangeNotify);         //钻石变化通知
        this.addModuleEvent(qf.ekey.DDZ_END_GAME_OVER_EVT, this.ddzEndGameOverEvt);           //残局结算通知
        this.addModuleEvent(qf.ekey.ENDGAME_RESET_GAME, this.openResetDialog);                //请求重玩弹窗
        this.addModuleEvent(qf.ekey.ENDGAME_RESET_GAME_REQ, this.requestResetGame);           //残局重新挑战请求
    },

    requestExitDesk(params) {
        params = params || {};

        if (this.deleteTable) {
            return;
        }

        if (!(qf.cache.desk.getIsInDesk &&　qf.cache.desk.getIsInDesk())) {
            qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME);
            return;
        }

        qf.net.send({
            cmd: qf.cache.desk.getReqCmd().exitDeskCmd,
            body: {},
            callback: (rsp)=> {
                qf.net.util.rspHandler(rsp, {
                    successCb: ()=> {
                        qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME);
                    },
                    failCb: ()=> {
                        qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME);
                    }
                })
            }
        })
    },

    requestDescard(params) {
        params = params || {};

        let card = params.card;

        qf.net.send({
            cmd: qf.cache.desk.getReqCmd().discardCmd,
            body: {
                cards: card
            },
            callback: (rsp)=> {
            }
        })
    },

    onUserLeave(params) {
        params = params || {};

        let model = params.model;
        qf.cache.desk.setIsInDesk(false);
        qf.cache.desk.updateCacheByExitDesk(model);

        this.exitGame();
    },

    onResult(params) {
        params = params || {};

        if (!this.view) return;
        qf.cache.desk.updateCacheByResult(params.model);
    },

    onOpUserNotify(params) {
        params = params || {};

        qf.cache.desk.updateOpUserInfo(params.model);

        //轮到我的回合
        if(qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME){
            this.view.getPokerManager().updateOperBtns();
        }
    },

    onStartGame(params) {
        params = params || {};

        qf.cache.desk.updateCacheByStartGame(params.model);

        //发牌
        if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_FAPAI) {
            this.view.sendPoker({aniamtion: true});
        }
        
        //隐藏所有操作按钮
        this.view.getButtonManager().hideAllBtns();
    },

    onPlayGame(params) {
        params = params || {};

        if (!this.view) return;

        qf.cache.desk.setIsTip(false);
        qf.cache.desk.updateCacheByPlay(params.model);
        this.view.clearDeskCardsByUin(qf.cache.desk.getNextUin());

        if (qf.cache.desk.getPlayCards().length === 0) {	//打了0张牌
            let userView = this.view.getUser(qf.cache.desk.getOpUin());
            if (userView) {
                userView.setTips(true, "notwant", true);
            }
        } else {
            //这里显示动画
            let index = this.view.getUserIndexByUin(qf.cache.desk.getOpUin());

            let uin = qf.cache.desk.getOpUin();
            this.view.showPlayCards(qf.cache.desk.getPlayCards(), false, qf.cache.desk.getLastCards2(), index, uin, true);
        }
        
        let u = qf.cache.desk.getUserByUin(qf.cache.desk.getOpUin());
        let uView = this.view.getUser(qf.cache.desk.getOpUin());

        if (! (qf.cache.desk.getOpUin() !== Cache.user.uin)) {
            //上一把是自己
            this.view.getPokerManager().checkMyHandCards(); //检查牌
            this.view.getButtonManager().hideAllBtns();  //隐藏按钮
            this.view.getPokerManager().clearNoPokerThanOther();    //清理没有大于上家
            this.view.getPokerManager().clearPromit();    //清理智能提示

            qf.cache.desk.setIsUserSendCard(false);
        }

        qf.cache.desk.updateUsersCardInfo(params.model.card_list);
        this.view.updateShowCard(true);
        
        if (qf.cache.desk.getNextUin() <= 0) return;//牌局结束

        uView = this.view.getUser(qf.cache.desk.getNextUin())
        if(uView){
            uView.clearTips();
        }

        if (qf.cache.desk.getNextUin() === Cache.user.uin) {
            this.view.getPokerManager().updateOperBtns();  //显示按钮

            if (0 === this.view.getPokerManager().genPromitTable()) {	//没有牌大于上家
                this.view.getPokerManager().noPokerThanOther(); //全部变灰间
            }

            if (qf.cache.desk.getShortOpFlag() === GameConstants.OP_FLAG.SHORT) {
                this.view.showMyNotGreaterAni();
            }
        }
    },

    requestRemind() {
        if (!this.view) return;

        qf.net.send({
            cmd: qf.cache.desk.getReqCmd().remindCmd,
            body: {},
            callback: (rsp)=> {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model)=> {

                    },
                    failCb: ()=> {
                        if (rsp.ret === qf.const.NET_WORK_STATUS.DIAMOND_NOT_ENOUGH) {
                            this.diamondNotEnough(2);
                        }else {
                            rsp.ret !== qf.const.NET_WORK_STATUS.GAME_NO_TOAST && qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, {txt: qf.cache.config.errorMsg[rsp.ret] || cc.js.formatStr(qf.txt.common_error_tips, rsp.ret)});
                        }
                    }
                })
            }
        })
    },
    
    openRemindView() {
        if (qf.cache.desk.getTipViewShow() && !qf.cache.desk.getIsTip()){
            qf.rm.checkLoad("endgame_usetip", ()=> {
                qf.event.dispatchEvent(qf.ekey.OPEN_VIEW_DIALOG, {name: "endgame_usertip", data: {content: qf.txt.endgame_TipTxt[2]}});
            });
        }else {
            qf.event.dispatchEvent(qf.ekey.LORD_ENDGAME_REMIND);
        }
    },

    onDiamondChangeNotify() {
        if (this.view) {
            this.view.updateMoney();
        }
    },

    ddzEndGameOverEvt(rsp) {
        if (!this.view) return;
        if (!rsp) return;

        if (rsp.model.end_type === 2){
            qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME);
            return;
        }

        qf.cache.desk.updateCacheByResult1(rsp.model);

        if(rsp.model.endgame_level && rsp.model.endgame_timestamp) {
            qf.platform.reportEndGameData({
                level: rsp.model.endgame_level.toString(),
                time: rsp.model.endgame_timestamp.toString()
            })
        }

        let showEndGameOverDia = ()=> {
            let endgameoverModule = ()=> {
                qf.event.dispatchEvent(qf.ekey.OPEN_VIEW_DIALOG, {name: "endgameover", data: {is_replay: rsp.model.is_replay}});
            }
            qf.cache.desk.setResultCountDownTime(rsp.model.replay_count_down);
            qf.rm.checkLoad("endgameover", endgameoverModule);
        }

        if(rsp.model.is_replay){
            showEndGameOverDia();
        }else{
            let resultRewardInfo = qf.cache.desk.getResultReward1();
            let bShow = false;
            let rewardNum = 0;
            for(let k in resultRewardInfo){
                let type = resultRewardInfo[k].award_type;
                if(type === 4){
                    bShow = true;
                    rewardNum = Number(resultRewardInfo[k].award_value);
                    break;
                }
            }

            if(bShow && rewardNum>0){
                let rewardModule = ()=> {
                    //暂无弹窗
                    // let redpacketDia = new RedpacketRewardDialog({rewardNum:rewardNum,cb:handler(this,showEndGameOverDia)});
                    // this.view.addChild(redpacketDia);
                    // redpacketDia.showDialog();
                }
                qf.rm.checkLoad("task", rewardModule);
            }else{
                showEndGameOverDia();
            }
        }

        if (rsp.model.endgame_level > qf.cache.user.endgame_level){
            qf.cache.user.updateEndgame_level(rsp.model.endgame_level);
        }
    },

    openResetDialog(params) {
        params = params || {};

        let showResetDialog = ()=> {
            let content = qf.cache.desk.getEndGameMaxLevel() >= qf.cache.desk.getEndGameDeskLevel() ? qf.txt.endgame_TipTxt[4] : qf.txt.endgame_TipTxt[3];

            let endGameReplayModule = ()=> {
                qf.event.dispatchEvent(qf.ekey.OPEN_VIEW_DIALOG, {name: "endgame_replay", data: { content: content}});
            }

            qf.rm.checkLoad("endgame_replay", endGameReplayModule);
        }

        if (params.cb) showResetDialog = params.cb;

        showResetDialog();
    },

    requestResetGame(params) {
        params = params || {};

        qf.net.send({
            cmd: qf.cache.desk.getReqCmd().resetGameCmd,
            body: {},
            callback: (rsp)=> {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model)=> {
                        qf.mm.clean();
                        qf.mm.show("endgame");
                        qf.event.dispatchEvent(qf.ekey.LORD_NET_ENTER_DESK_NOTIFY, rsp);
                    },
                    failCb: ()=> {
                        if (rsp.ret === qf.const.NET_WORK_STATUS.DIAMOND_NOT_ENOUGH) {
                            this.diamondNotEnough(1);
                        }else {
                            rsp.ret !== qf.const.NET_WORK_STATUS.GAME_NO_TOAST && qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, {txt: qf.cache.config.errorMsg[rsp.ret] || cc.js.formatStr(qf.txt.common_error_tips, rsp.ret)});
                        }

                        if (params.cb) params.cb();
                    }
                })
            }
        })
    },

    exitGame() {
        if (!this.view) return;

        if (this.deleteTable) return;
        qf.music.stopMusic();
        qf.music.playMusic(qf.res.lord_music.background);

        this.deleteTable = true;

        qf.net.send({
            cmd: qf.cmd.END_GAME_LOBBY_REQ,
            wait: true,
            body: {},
            callback: (rsp)=> {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model)=> {
                        let endGameModule = ()=> {
                            let EndGameLobbyController = qf.mm.get("EndGameLobbyController");
                            let max_level = qf.cache.user.endgame_level;
                            let isMove = max_level !== model.cur_level;

                            let level = 0;
                            if (!qf.cache.desk.getEndGameDeskLevel) {
                                level = model.cur_level - 1;
                            }else {
                                qf.cache.getEndGameDeskLevel();
                            }

                            //更新最新关卡数
                            qf.cache.user.updateEndgame_level(model.cur_level);

                            qf.mm.clean();
                            qf.mm.show("EndGameLobbyController", {data: {lordMove: isMove, returnLevel: level}})
                        }

                        qf.rm.checkLoad("endGameLobby", endGameModule);
                    },
                    failCb: ()=> {
                        this.deleteTable = false;
                    },
                    timeOutCb: ()=> {
                        this.deleteTable = false;

                        qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, {txt: qf.cache.config.errorMsg[rsp.ret] || cc.js.formatStr(qf.txt.common_error_tips, rsp.ret)});
                    }
                })
            }

        })
    },

    diamondNotEnough(type) {
        if (!qf.cache.user.userLoginInfo.diamond_activity_switch) {
            let txt = type === 1 ? qf.txt.endgame_diamond_not_enough_1 : qf.txt.endgame_diamond_not_enough_2;

            qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, {txt: txt});
            return;
        }

        let body = {
            isModal: false,
            isOnly: true,
            content: type === 1 ? qf.txt.endgame_diamond_not_enough_1 : qf.txt.endgame_diamond_not_enough_2 ,
            confirmTxtImg: qf.tex.global_togetDiamond,
            sureCb: ()=> {
                qf.rm.checkLoad("diamondActivity", ()=> {
                    qf.mm.show("DiamondActivityController");
                })
            }
        }

        qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, body);
    }
})