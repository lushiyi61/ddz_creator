let AbstractGameController = require("../AbstractGameController");

cc.Class({
    extends: AbstractGameController,

    properties: {
        TAG: "NormalGameController",
    },

    initView(params) {
        let node = cc.instantiate(cc.loader.getRes(qf.res.prefab_table));
        let script = node.addComponent("NormalGameView");
        script.init(params);
        return script;
    },

    //初始化全局事件监听
    initGlobalEvent() {
        this._super();

        //看视频、分享领取
        qf.event.addEvent(qf.ekey.PICK_REWARD_BY_VEDIO_OR_SHARE, this.pickRewardByVedioOrShare, this);
    },

    //控制器事件，随着主view销毁而销毁
    initModuleEvent() {
        this._super();

        //退出询问
        this.addModuleEvent(qf.ekey.CLASSICROOM_ONEXIT_GAME, this.classicRoomExit, this);

        //退桌请求
        this.addModuleEvent(qf.ekey.LORD_NET_EXIT_DESK_REQ, this.requestExitDesk, this);

        //叫分请求
        this.addModuleEvent(qf.ekey.LORD_NET_CALL_POINT_REQ, this.requestCallPoint, this);

        //托管请求
        this.addModuleEvent(qf.ekey.LORD_NET_AUTO_PLAY_REQ, this.requestAutoPlay, this);

        //打牌请求
        this.addModuleEvent(qf.ekey.LORD_NET_DISCARD_REQ, this.requestDescard, this);

        //加倍请求
        this.addModuleEvent(qf.ekey.LORD_NET_MUTI_REQ, this.requestMuti, this);

        //退桌通知
        this.addModuleEvent(qf.ekey.LORD_NET_EXIT_DESK_NOTIFY, this.onUserLeave, this);

        //一副牌结束结算通知
        this.addModuleEvent(qf.ekey.LORD_NET_RESULT_NOTIFY, this.onResult, this);

        //牌桌当前操作者通知
        this.addModuleEvent(qf.ekey.DDZ_OPUSER_NOTIFY, this.onOpUserNotify, this);

        //叫分通知
        this.addModuleEvent(qf.ekey.LORD_NET_CALL_POINT_NOTIFY, this.onCallPointNotify, this);

        //游戏开始通知
        this.addModuleEvent(qf.ekey.LORD_NET_START_GAME_NOTIFY, this.onStartGame, this);

        //打牌通知
        this.addModuleEvent(qf.ekey.LORD_NET_DISCARD_NOTIFY, this.onPlayGame, this);

        //托管通知
        this.addModuleEvent(qf.ekey.LORD_NET_AUTO_PLAY_NOTIFY, this.lordAutoPlayNotify, this);

        //加倍通知
        this.addModuleEvent(qf.ekey.LORD_NET_MUTI_NOTIFY, this.onMutiNotify, this);

        //操作超时请求
        this.addModuleEvent(qf.ekey.LORD_NET_OP_TIME_OUT_REQ, this.requestOpTimeOut, this);

        //收到一条互动表情
        this.addModuleEvent(qf.ekey.INTERACT_PHIZ_NTF, this.handleInteractPhiz, this);

        //拉取个人信息
        this.addModuleEvent(qf.ekey.LORD_NET_PLAYER_INFO_REQ, this.requestPlayInfo, this);

        //玩家准备请求
        this.addModuleEvent(qf.ekey.NET_USER_READY_REQ, this.requestUserReady, this);

        //玩家准备通知
        this.addModuleEvent(qf.ekey.NET_USER_READY_NOTIFY, this.userReadyNotify, this);

        //明牌通知
        this.addModuleEvent(qf.ekey.DDZ_SHOW_CARD_NOTIFY, this.showCardNotify, this);

        //发牌过程中明牌请求
        this.addModuleEvent(qf.ekey.DDZ_SHOW_CARD_REQ, this.showCardReq, this);

        //公共倍数改变通知
        this.addModuleEvent(qf.ekey.DDZ_DESK_MULTI_NOTIFY, this.onDeskMultiNotify, this);

        //更新开始按钮
        this.addModuleEvent(qf.ekey.UPDATE_BEGIN_BUTTONS, this.updateBeginButtons, this);

        //隐藏按钮
        this.addModuleEvent(qf.ekey.HIDE_ALL_BTNS, this.hideAllBtns, this);

        //更新明牌按钮
        this.addModuleEvent(qf.ekey.UPDATE_SHOW_CARD_BTN, this.updateShowCardBtn, this);

        //打开公共倍数弹窗
        this.addModuleEvent(qf.ekey.OPEN_MULTI_DIALOG, this.onOpenMultiDialog, this);

        //换桌请求
        this.addModuleEvent(qf.ekey.LORD_REQUEST_USER_CHANGE_DESK, this.requestUserChangeDesk, this);

        //聊天通知
        this.addModuleEvent(qf.ekey.NET_GAME_CHAT_NOTIFY, this.onGameChatNotify, this);
        this.addModuleEvent(qf.ekey.DDZ_GAME_CHAT_REQ, this.gameChatReq, this);

        //进桌金币限制请求
        this.addModuleEvent(qf.ekey.CHECK_GOLD_LIMIT, this.requestCheckGoldLimit, this);

        //牌桌内记牌器分享
        this.addModuleEvent(qf.ekey.COUNTER_DESK_SHARE_REQ, this.sendShareCounterToWX, this);

        //更新换桌按钮
        this.addModuleEvent(qf.ekey.UPDATE_CHANGE_TABLE_BUTTONS, this.updateChangeTableBtns, this);

        //同步人员的财产信息。 比如同步人员金币信息到客户端，后续可拓展其他
        this.addModuleEvent(qf.ekey.DDZ_USER_SYNC_FORTUNE_INFO_NOTIFY, this.syncFortuneInfoNotify, this);

        //好友房结算后清掉ui
        this.addModuleEvent(qf.ekey.DDZ_CLEAR_UI_BY_OVER, this.clearUIByGameOver, this);

        //赛事活动通知
        this.addModuleEvent(qf.ekey.DDZ_JOIN_MATCH_REWARD_NOTIFY, this.onJoinMatchRewardNotify, this);

        //隐藏房间内邀请有礼
        this.addModuleEvent(qf.ekey.HIDE_LORDGAME_VIEW_INVITE_BTN, this.onHideInviteBtn, this);
    },

    //退桌请求
    requestExitDesk(paras) {
        qf.net.send({
            cmd: qf.cache.desk.cmd_list_list.exitDeskCmd,
            body: {},
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: () => {
                        qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME);
                        // let instance = qf.cache.globalInfo.getStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_BACK_INTO_HALL);
                        // if(instance) {
                        //     qf.platform.uploadEventStat({   //游戏内返回大厅
                        //         "module": "performance",
                        //         "event": STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_BACK_INTO_HALL,
                        //         "value": instance
                        //     });
                        // }
                    },
                    failCb: () => {
                        qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.cache.Config.errorMsg[rsp.ret] || qf.txt.exit_to_other_fail });
                    }
                });
            }
        });
    },

    //叫分请求
    requestCallPoint(paras) {
        qf.net.send({
            cmd: qf.cache.desk.cmd_list.userCallCmd,
            body: { grab_action: paras.score },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp);
            }
        });
    },

    //托管请求
    requestAutoPlay(paras) {
        if (!paras || !qf.utils.isValidType(paras.auto)) return;
        qf.net.send({
            cmd: qf.cache.desk.cmd_list.autoPlayCmd,
            body: { auto: paras.auto },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp);
            }
        });
    },

    //出牌请求
    requestDescard(paras) {
        paras = paras || [];
        let card = paras.card || [];
        //let cards2 = paras.cards2 || {};
        qf.net.send({
            cmd: qf.cache.desk.cmd_list.discardCmd,
            body: { cards: card },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp);
            }
        });
    },

    //加倍请求
    requestMuti(paras) {
        qf.net.send({
            cmd: qf.cache.desk.cmd_list.userMutiCmd,
            body: { do_multi: paras.is_muti },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        logd("**********requestMuti success**********");
                        if (model && model.desc) {
                            qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: model.desc });
                        }
                    }
                });
            }
        });
    },

    //override 进桌推送消息
    processInputGameEvt(rsp) {
        this._super();
        logd("LordGameController:processInputGameEvt");
        logd(rsp.model);

        qf.cache.desk.updateCacheByJoinGame(rsp.model);
        qf.cache.desk.setLordFirstHandle(rsp.model.is_first_card);

        //换桌按钮
        if (qf.cache.desk.getOpUin() === qf.cache.user.uin) {
            this.view.updateChangeDesk(true);
        }

        //更新记牌器数量
        this.updateCounterNum();

        //刷新user
        this.view.enterUser(qf.cache.desk.getOpUin());

        //隐藏发牌
        this.view.setShufflePanelHide();

        let mystatus = qf.cache.desk.getUserByUin(qf.cache.user.uin).status;
        if (qf.cache.desk.getUserListLength() >= 3 || mystatus !== qf.const.UserStatus.USER_STATE_SIT_READYED) {
            this.view.setMatchingShow(false);
            // let instance = qf.cache.globalInfo.getStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_WAIT_SUCC_TIME);
            // if(instance) {
            //     let typeInfo = qf.cache.desk.getTypeInfo();
            //     qf.platform.uploadEventStat({   //各场次匹配成功时长
            //         "module": "performance",
            //         "event": STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_WAIT_SUCC_TIME,
            //         "value": instance,
            //         "custom": typeInfo.roomId
            //     });
            // }
        } else {
            // qf.cache.globalInfo.setStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_WAIT_SUCC_TIME);
            this.view.setMatchingShow(true, qf.cache.desk.getOpUin());
        }

        //根据赛事是否显示和隐藏对局详情按钮
        //this.view.hideGameDetailBtn()

        //我自己进桌
        if (qf.cache.desk.getOpUin() === qf.cache.user.uin) {
            qf.cache.chat_records = [];
            //更新顶部牌桌信息
            this.view.updateTopStatus();

            this.view.getButtonManager().initCallButtons();

            //先隐藏所有操作按钮，需要显示再显示
            this.view.getButtonManager().hideAllBtns();
            let isMySelfAuto = qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin);
            this.view.updateRobot(qf.cache.user.uin, isMySelfAuto);

            //水印
            this.view.setTypeInfo(qf.cache.desk.getTypeInfo());

            // //换桌
            // this.view.updateChangeDesk();

            //清空赖子，暂未用到，先屏蔽
            //this.view.getPokerManager().clearLaizi();
            //更新用户状态
            let userList = qf.cache.desk.getUserList();
            for (let uin in userList) {
                let v = userList[uin];
                this.view.getUser(v.uin).updateStatus();
                //更新其他玩家的手牌数量
                let uView = this.view.getUser(v.uin);
                if (uView) {
                    uView.setWarningStatus(v.cards_num);
                }
                if (v.uin !== qf.cache.user.uin) {
                    if (uView) {
                        uView.updateCards(v.cards_num);
                        uView.setIsShowCards(true);
                    }
                } else {
                    //刷新我的手牌
                    if (v.cards_num > 0) {
                        this.view.sendPoker({ aniamtion: false });

                        //根据托管状态更新手牌
                        this.view.updateMyHandCardsByAuto();
                    }
                }
            }

            if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_FAPAI) {
                //发牌
                //this.view.sendPoker({aniamtion: false});
            } else if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_QDZ) {
                logd(" ====== qf.const.LordGameStatus.GAME_STATE_QDZ =======");

                //显示三张背面
                this.view.getTopManager().genThreeCards([-1, -1, -1], false, true); //qf.cache.desk.getRoomType() === LordGameType.LAIZICHANG, true)

                //轮到我操作要显示叫分按钮
                if (qf.cache.desk.getNextUin() === qf.cache.user.uin)
                    this.view.getButtonManager().updateCallBtns(qf.cache.desk.getMaxGrabAction());

                let userList = qf.cache.desk.getUserList();
                //更新用户的叫分气泡提示
                for (let uin in userList) {
                    let v = userList[uin];
                    let uView = this.view.getUser(v.uin);
                    if (uView)
                        uView.setRobLordTips(v.grab_action);
                }
                //清掉下一个操作者气泡
                if (qf.cache.desk.getNextUin()) {
                    let uView = this.view.getUser(qf.cache.desk.getNextUin());
                    if (uView)
                        uView.clearTips();
                }
            } else if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_MUTIPLE) {
                logd(" ====== qf.const.LordGameStatus.GAME_STATE_MUTIPLE =======");

                //进入选择加倍阶段，此时地主已经确定，可以显示三张地主牌
                let topMng = this.view.getTopManager();
                topMng.genThreeCards(qf.cache.desk.getThreeCards()); //qf.cache.desk.getRoomType() === LordGameType.LAIZICHANG)
                topMng.addMultipleTag(qf.cache.desk.getBottomMultiple());

                //轮到我操作要显示加倍按钮
                if (qf.cache.desk.isMyTurn()) {
                    this.view.setWaitMultiShow(false);
                    this.view.getButtonManager().updateDoubleBtns();
                } else {
                    if (qf.cache.desk.isAllMuti()) {
                        this.view.setWaitMultiShow(false);
                    } else {
                        if (qf.cache.desk.isMySelfLand()) {
                            this.view.setWaitMultiShow(true);
                        }
                    }

                }

                //更新用户的加倍气泡提示
                for (let uin in userList) {
                    let v = userList[uin];
                    let uView = this.view.getUser(v.uin);
                    if (uView) {
                        uView.setDoubleTips(v.call_multiple);
                    }
                }
            } else if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME) {
                logd(" ====== qf.const.LordGameStatus.GAME_STATE_INGAME =======");

                //显示三张地主牌
                let topMng = this.view.getTopManager();
                topMng.genThreeCards(qf.cache.desk.getThreeCards()); //qf.cache.desk.getRoomType() === LordGameType.LAIZICHANG)
                topMng.addMultipleTag(qf.cache.desk.getBottomMultiple());
                //设定癞子，暂未使用，先屏蔽
                //this.view.getPokerManager().setLaizi();
                //this.view.getTopManager().genLaiziCards(qf.cache.desk.getLaiziPoint(), false);
                this.view.beginPlayCountDown();
                //轮到我操作，要显示出牌按钮
                if (qf.cache.desk.getNextUin() === qf.cache.user.uin) {
                    this.view.getPokerManager().clearPromit();
                    this.view.getPokerManager().updateOperBtns();
                    this.view.setImgNoLargerOtherShow(false);
                    if (qf.cache.desk.getLastCardsNum() === 0) {
                        //没上家牌，自己出牌，不出按钮关了
                        //this.view.getButtonManager().updateOperBtns({{1, false}});
                    } else {
                        //检查是否能大于上家
                        if (0 === this.view.getPokerManager().genPromitTable()) {
                            this.view.getPokerManager().noPokerThanOther();
                        }

                        if (qf.cache.desk.getShortOpFlag() === qf.const.OP_FLAG.SHORT) {
                            this.view.showMyNotGreaterAni();
                        }
                    }
                }

                //上家出牌
                let lastCardsInfoList = qf.cache.desk.getLastCardsInfoList();
                if (lastCardsInfoList.length > 0) {
                    for (let k in lastCardsInfoList) {
                        let v = lastCardsInfoList[k];
                        if (v.action === qf.const.LordPokerOper.BUYAO)
                            //上家未出牌，显示气泡提示
                            this.view.getUser(v.uin).setNotWantTips(true);
                        else if (v.action === qf.const.LordPokerOper.CHUPAI) {
                            //上家出牌，显示出牌内容
                            let index = this.view.getUserIndexByUin(v.uin);
                            let cards = [];
                            for (let n in v.cards) {
                                cards.push(v.cards[n]);
                            }
                            cards.sort(qf.utils.compareNumByIncrs);
                            let isShow = false;
                            if (v.uin === qf.cache.user.uin) {
                                isShow = true;
                            }
                            this.view.showPlayCards(cards, true, qf.cache.desk.getLastCards2(), index, null, isShow, true);
                        }
                    }
                }
            }

            this.view.updateMySelfClockPostion();

            //更新显示记牌器
            this.view.updateCounter();
            this.view.showCounter(1);
            //赛事活动
            this.updateEventActivityDialog();
            //清理任务数据 TODO
            // ModuleManager.getModule("TaskController").getModel().clearTaskInfo();
        }

        //这个放在进桌所有音效播放后
        qf.cache.desk.setEnterDeskMusicFlag(true);
        //设定剩余时间
        this.setCountLeftTime();

        let allUserList = qf.cache.desk.getAllUserList();
        for (let k in allUserList) {
            let v = allUserList[k];
            if (qf.utils.isValidType(v) && v.status > qf.const.UserStatus.USER_STATE_STAND) this.view.updateUserReady(v.uin);

            if (v.uin === qf.cache.user.uin) {
                if (rsp.model.uin === qf.cache.user.uin && v.status === qf.const.UserStatus.USER_STATE_SIT_UNREADY)
                    this.updateBeginButtons();
                if (v.status !== qf.const.UserStatus.USER_STATE_SIT_READYED)
                    this.view.updateShowCard();
            }
        }

        let userListLength = qf.cache.desk.getUserListLength();
        if (userListLength === this.view.seatLimit) {
            let me = qf.cache.desk.getUserByUin(qf.cache.user.uin);
            if (me.status <= qf.const.UserStatus.USER_STATE_STAND && qf.cache.desk.getOpUin() === qf.cache.user.uin) { //是自己进桌 提示牌桌已满
                qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.txt.table_players_full });
            }
        }
        this.view.showInviteAndSeatBtn();
        this.view.updateTableBtns();

        //数据统计
        // let typeInfo = qf.cache.desk.getTypeInfo();
        // qf.platform.uploadEventStat({   //进入房间
        //     "module": "reg_funnel",
        //     "event": STAT_KEY.PYWXDDZ_EVENT_REG_FUNNEL_ENTER_DESK,
        //     "value": 1,
        //     "custom": typeInfo.roomId,
        // });

        // let instance = qf.cache.globalInfo.getStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_ROOM);
        // if(instance) {
        //     qf.platform.uploadEventStat({   //大厅点击经典玩法--点击进入各个场次
        //         "module": "performance",
        //         "event": STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_ROOM,
        //         "value": instance,
        //         "custom": typeInfo.roomId,
        //     });
        // }

        // let instance = qf.cache.globalInfo.getStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CHANGE_DESK);
        // if(instance) {
        //     qf.platform.uploadEventStat({   //牌桌内换桌
        //         "module": "performance",
        //         "event": STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CHANGE_DESK,
        //         "value": instance
        //     });
        // }

        // let key = ResourceManager.getIsFirstLoad() ? STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_CREATE_ROOM_FIRST_LOAD:
        //     STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CREATE_DESK_ENTER;
        // let instance = qf.cache.globalInfo.getStatUploadTime(key);
        // if(instance) {
        //     qf.platform.uploadEventStat({   //大厅点击创建房间-进入房间
        //         "module": "performance",
        //         "event": key,
        //         "value": instance,
        //     });
        // }

        // let instance = qf.cache.globalInfo.getStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_ENTER_CUSTOM_DESK);
        // if(instance) {
        //     qf.platform.uploadEventStat({   //外部被邀请进入好友房-成功进入
        //         "module": "performance",
        //         "event": STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_ENTER_CUSTOM_DESK,
        //         "value": instance
        //     });
        // }
    },

    //牌局结束服务器推送的消息
    onResult(rsp) {
        if (!this.view) return;
        logd("======onResult======");
        logd(rsp.model);
        qf.cache.desk.updateCacheByResult(rsp.model);

        let resultInfo = qf.cache.desk.getResultInfo();
        if (resultInfo && resultInfo.spring_type) {
            if (resultInfo.spring_type > 0) {
                this.view.showMultiAction(2);
            }
        }

        //更新记牌器数量
        this.updateCounterNum();

        this.view.handlerGameOver();

        //换桌
        this.view.setImgNoLargerOtherShow(false);
        //不显示记牌器
        logd(qf.cache.desk.getCardCounter().counts, "记牌器数量");
        this.view.updateCounter();
        this.view.showCounter(2);

    },

    callPointAction(grab_action) {
        if (grab_action > 1)
            this.view.showMultiAction(2);
    },

    onCallPointNotify(rsp) {
        logd("======onCallPointNotify======", this.TAG);
        let maxGrabAction = qf.cache.desk.getMaxGrabAction();
        logd(rsp.model);
        qf.cache.desk.updateCacheByCallPoint(rsp.model);

        this.callPointAction(qf.cache.desk.grab_action);

        //更新牌桌顶部状态
        this.view.updateTopStatus();

        //如果操作者是我自己，需要隐藏我的操作按钮
        if (qf.cache.desk.getOpUin() === qf.cache.user.uin)
            this.view.getButtonManager().hideAllBtns();

        this.setCountLeftTime();
        let u = qf.cache.desk.getUserByUin(qf.cache.desk.getOpUin());
        //更新叫分用户的气泡提示
        let vUser = this.view.getUser(qf.cache.desk.getOpUin());
        if (vUser && u)
            vUser.setRobLordTips(u.grab_action, maxGrabAction, true);

        //大家都没叫地主
        if (qf.cache.desk.getNextUin() === -1) {
            logd(" //没人叫分，等待重新发牌消息 //");
            return;
        }

        //地主没确定是谁，还要叫分
        if (!qf.cache.desk.isLordConfirmed()) {
            //下一个操作者是我，要显示叫分按钮
            if (qf.cache.desk.getNextUin() === qf.cache.user.uin)
                this.view.getButtonManager().updateCallBtns(qf.cache.desk.getMaxGrabAction());
            //清掉下一个操作者气泡
            if (qf.cache.desk.getNextUin()) {
                let uView = this.view.getUser(qf.cache.desk.getNextUin());
                if (uView) {
                    uView.clearTips();
                }
            }
        } else {
            //已经确认地主是谁，进入加倍阶段，此时有两个防守方同时选择加倍或者不加倍
            //this.view.getPokerManager().clearLaizi()
            qf.cache.desk.setLordFirstHandle(true);
            qf.cache.desk.clearLastCards();

            //处理我是地主的情况，插入3张牌
            if (qf.cache.desk.getLordUin() === qf.cache.user.uin) {
                this.view.getPokerManager().clearPromit();
                this.view.getPokerManager().insertCards(qf.cache.desk.getThreeCards());
            }
            //------------此过程移到用户操作那里去turnMuti-----------------
            // //如果轮到我操作，需显示加倍、不加倍按钮
            // if (qf.cache.desk.isMyTurn())
            // 	this.view.getButtonManager().updateDoubleBtns();
            //------------------------------------------------------

            let userList = qf.cache.desk.getUserList();
            //更新用户状态
            for (let uin in userList) {
                let v = userList[uin];

                //更新其他玩家的手牌数量
                let uView = this.view.getUser(v.uin);
                if (uView) {
                    uView.setWarningStatus(v.cards_num);
                }
                if (v.uin !== qf.cache.user.uin) {
                    if (uView) {
                        uView.updateCards(v.cards_num);
                        if (v.status === qf.const.UserStatus.USER_STATE_INGAME) //玩游戏中
                            uView.setIsShowCards(true);
                    }
                }

                //设定user状态
                this.view.getUser(uin).setLandlordStatus(qf.cache.desk.getLordUin());
            }

            this.view.getTopManager().showThreeCardsAnimation(qf.cache.desk.getThreeCards(), qf.cache.desk.getBottomMultiple(), qf.cache.desk.getBottomMultipleType());
            this.view.updateMySelfClockPostion();
            //------------此过程移到用户操作那里去turnMuti-----------------
            //this.view.hideMyStatusNode();
            //------------------------------------------------------
            //抢地主确认分两步通知处理
            this.callPointAfterHandle();

            qf.cache.desk.updateUsersCardInfo(rsp.model.card_list);
            this.view.updateShowCard();
            this.view.showLordAppearsAnimation();
        }
    },

    //抢地主确认分两步通知处理
    callPointAfterHandle() {},

    turnMuti() {
        logd("======turnMuti======", this.TAG);

        this.setCountLeftTime();
        //隐藏所有操作按钮
        this.view.getButtonManager().hideAllBtns();
        //隐藏显示气泡
        let userList = qf.cache.desk.getUserList();
        for (let uin in userList) {
            let v = userList[uin];
            let uView = this.view.getUser(v.uin);
            if (uView) {
                uView.clearTips();
            }
        }

        //显示操作按钮
        if (qf.cache.desk.isMyTurn()) {
            this.view.setWaitMultiShow(false);
            this.view.getButtonManager().updateDoubleBtns();
        } else {
            if (qf.cache.desk.isMySelfLand()) {
                this.view.setWaitMultiShow(true);
            }
        }
    },

    //加倍通知
    onMutiNotify(rsp) {
        logd("LordGameController:onMutiNotify");
        logd(rsp.model);
        qf.cache.desk.updateCacheByMuti(rsp.model);

        //先隐藏所有操作按钮
        this.view.getButtonManager().hideAllBtns();

        //设置倒计时
        this.setCountLeftTime();

        //更新多个用户的加倍状态
        for (let i in rsp.model.do_multi) {
            let multiInfo = rsp.model.do_multi[i];
            let uView = this.view.getUser(multiInfo.uin);
            if (multiInfo.uin === qf.cache.user.uin) {
                if (multiInfo.result > 0) {
                    this.view.showMultiAction(multiInfo.result * 2);
                }
            }
            if (uView) {
                uView.setDoubleTips(multiInfo.result, true, rsp.model.op_uin === qf.cache.user.uin);
                uView.setDoubleStatus(multiInfo.result);
            }
        }

        //判定是否进入游戏状态
        //if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME) {
        if (qf.cache.desk.isAllMuti()) {
            //轮到我操作，说明我是第一个打牌的玩家，关闭不出按钮
            this.view.setWaitMultiShow(false);
        } else {
            //未进入游戏状态，说明加倍还没结束
            if (qf.cache.desk.isMyTurn()) {
                this.view.setWaitMultiShow(false);
                this.view.getButtonManager().updateDoubleBtns();
            } else {
                //未轮到我，并且是地主
                if (qf.cache.desk.isMySelfLand()) {
                    this.view.setWaitMultiShow(true);
                }
            }
        }

        this.view.updateMySelfClockPostion();
    },

    turnPlayGame() {
        logd("======turnPlayGame======", this.TAG);
        this.view.setWaitMultiShow(false);
        this.setCountLeftTime();
        //隐藏所有操作按钮
        this.view.getButtonManager().hideAllBtns();
        //隐藏显示气泡
        let userList = qf.cache.desk.getUserList();
        for (let uin in userList) {
            let v = userList[uin];
            let uView = this.view.getUser(v.uin);
            if (uView) {
                uView.clearTips();
            }
        }

        this.view.beginPlayCountDown();
        if (qf.cache.desk.isMyTurn()) {
            this.view.getPokerManager().updateOperBtns();
            this.view.setImgNoLargerOtherShow(false);
        }
        //更新显示记牌器
        this.view.updateCounter();
        this.view.autoShowCounterOrShare();
    },

    //开始打牌，从叫分开始
    onStartGame(rsp) {
        logd("onStartGame", this.TAG);
        //logd(rsp.model);

        qf.cache.desk.updateCacheByStartGame(rsp.model);

        let isMySelfAuto;
        //清除UI
        this.view.clearLastUI();
        this.view.removeOverDialog();

        if (this.view.PMRight.node.children.length !== 0) {
            this.view.PMRight.node.removeAllChildren(true);
        }
        if (this.view.PMLeft.node.children.length !== 0) {
            this.view.PMLeft.node.removeAllChildren(true);
        }

        let userList = qf.cache.desk.getUserList();
        for (let k in userList) {
            let v = userList[k];
            if (qf.utils.isValidType(v)) this.view.updateUserReady(v.uin);
            let uView = this.view.getUser(v.uin);
            if (uView) {
                uView.setWarningStatus(v.cards_num);
            }
            if (v.uin !== qf.cache.user.uin) {
                if (uView) {
                    uView.updateCards(v.cards_num);
                    uView.setIsShowCards(true);
                }
            }
        }

        if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_FAPAI) {
            //发牌
            isMySelfAuto = qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin);
            let bAni = !isMySelfAuto;
            let time = this.view.sendPoker({ aniamtion: bAni });
        }

        //主要关闭退桌提示
        //qf.event.dispatchEvent(qf.ekey.REMOVE_VIEW_DIALOG, {name: "lordexit"});
        //qf.event.dispatchEvent(qf.ekey.REMOVE_VIEW_DIALOG, {name: "lordreadyfullgame"});

        //更新顶部
        this.view.updateTopStatus();

        //this.setCountLeftTime();

        //隐藏所有操作按钮
        this.view.getButtonManager().hideAllBtns();

        this.view.updateRobot(qf.cache.user.uin, isMySelfAuto);
        //this.view.updateMyHandCardsByAuto();
        this.view.updateUIByMySelfAutoPlay();
        //换桌按钮
        this.view.updateChangeDesk();
        this.view.showPairAnimation(qf.cache.desk.getCurRound(), qf.cache.desk.getIsFinalRound());

        qf.music.playMyEffect("kaishi");

        //幸运任务气泡
        this.view.showLuckyTaskBubble();
    },

    //开始出牌
    onPlayGame(rsp) {
        logd("onPlayGame" + rsp.model.next_uin, this.TAG);
        //logd(rsp.model);

        qf.cache.desk.setLordFirstHandle(false);

        //pve 自动不要
        let isAutoBuChu = qf.cache.desk.getIsNextAutoBuChu();
        qf.cache.desk.updateCacheByPlay(rsp.model);
        if (!this.view) return;

        let u = qf.cache.desk.getUserByUin(qf.cache.desk.getOpUin());
        let uView = this.view.getUser(qf.cache.desk.getOpUin());

        if (qf.cache.desk.card_type === qf.const.CARD_TYPE.ZHADAN || qf.cache.desk.card_type === qf.const.CARD_TYPE.WANGZHA) {
            this.view.showMultiAction(2);
        }

        this.view.hideAllCountDown();
        this.view.setMultip(qf.cache.desk.getMultiple()); //更新倍数
        this.view.setImgNoLargerOtherShow(false);
        //记牌器数量
        this.view.updateCounter();
        if (qf.cache.desk.getPlayCards().length === 0) { //打了0张牌
            if (isAutoBuChu) {
                this.view.showMyNotGreaterAni();
            } else {
                if (uView)
                    uView.setNotWantTips(true, true);
            }
        } else {
            //这里显示动画
            let index = this.view.getUserIndexByUin(qf.cache.desk.getOpUin());

            let uin = qf.cache.desk.getOpUin();
            this.view.showPlayCards(qf.cache.desk.getPlayCards(), false, qf.cache.desk.getLastCards2(), index, uin);
            qf.music.playMyEffect("chupai");
        }

        if (uView) {
            uView.setWarningStatus(u.cards_num);
        }
        if (qf.cache.desk.getOpUin() !== qf.cache.user.uin) { //更新一下别人的牌
            if (u && uView) {
                uView.updateCards(u.cards_num);
                uView.setIsShowCards(true);
            }
        } else { //上一把是自己
            this.view.getPokerManager().checkMyHandCards(); //检查牌
            logd("上一把是自己 ， 隐藏按钮", this.TAG);
            this.view.getButtonManager().hideAllBtns(); //隐藏按钮
            this.view.getPokerManager().clearNoPokerThanOther(); //清理没有大于上家
            this.view.getPokerManager().clearPromit(); //清理智能提示
            qf.cache.desk.setIsUserSendCard(false);
        }

        this.setCountLeftTime();

        if (qf.cache.desk.getNextUin() <= 0) return; //马上会收到结束的， 下一个人是空的，不用处理下面的了
        uView = this.view.getUser(qf.cache.desk.getNextUin());
        if (uView) {
            uView.clearTips();
        }

        this.view.clearDeskCardsByUin(qf.cache.desk.getNextUin());
        if (qf.cache.desk.getNextUin() === qf.cache.user.uin) { //轮到自己

            if (qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin)) { //托管状态
            } else { //非托管状态，要显示按钮等等
                this.view.getPokerManager().updateOperBtns(); //显示按钮
                if (0 === this.view.getPokerManager().genPromitTable()) { //没有牌大于上家
                    this.view.getPokerManager().noPokerThanOther(); //全部变灰间
                }

                if (qf.cache.desk.getShortOpFlag() === qf.const.OP_FLAG.SHORT) {
                    this.view.showMyNotGreaterAni();
                }
                if (qf.cache.desk.getIsLastCardsAuto() === qf.const.LordPokerAutoLastOper.AUTO) {
                    this.view.setAutoLastCards();
                }

                /* this.view.getPokerManager().updateOperBtns()  //刷新一下按钮
                if (qf.cache.desk.getLastCardsNum() === 0)
                	this.view.getPokerManager().updateOperBtns();	//自己打牌权 */
            }
        }

        qf.cache.desk.updateUsersCardInfo(rsp.model.card_list);
        this.view.updateShowCard();
    },

    //设置倒计时
    setCountLeftTime() {
        //设置倒计时
        let bool = qf.cache.desk.getNextUin() > 0 || qf.cache.desk.getNextUin2().length > 0;
        this.view.showCountDown(bool);
        this.view.setCountDownTime(qf.cache.desk.getOpLeftTime());
    },

    //退桌通知  (自己发退桌请求，自己不会收到该通知)
    //牌局结束的时候，会收到一个退桌通知
    onUserLeave(rsp) {
        logd("LordGameController:onUserLeave");
        //logd(rsp.model);
        let model = rsp.model;
        qf.cache.desk.updateCacheByExitDesk(model);
        if (model.reason === qf.const.EXIT_REASON.EVENT_OVER) {
            //赛事结束展示大结算界面，不返回上个界面,也不清掉ui
        } else {
            this.view.clearOneUI(qf.cache.desk.getOpUin());
        }

        if (qf.cache.desk.getOpUin() === qf.cache.user.uin) {
            qf.event.dispatchEvent(qf.ekey.REMOVE_PROMPT_DIALOG);

            if (model.reason === qf.const.EXIT_REASON.NORMAL || model.reason === qf.const.EXIT_REASON.OVER) {

                qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME);

            } else if (model.reason === qf.const.EXIT_REASON.KICK) {
                //被房主踢出房间

                //弹出对话框，点确定后再退桌
                let _sureCb = () => {
                    qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME);
                }

                qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, { sureCb: _sureCb, isModal: true, isOnly: true, content: rsp.model.prompt });

            } else if (model.reason === qf.const.EXIT_REASON.TIMEOUT) {

                let id = qf.cache.desk.getTypeInfo().roomId;

                qf.rm.checkLoad("match", () => {
                    qf.mm.clean();
                    qf.mm.show("match", { roomId: id, timeout: true });
                });
            } else if (model.reason === qf.const.EXIT_REASON.EVENT_OVER) {
                //赛事结束展示大结算界面，不返回上个界面
            }
        } else {
            //別人退出桌子了
            let vUser = this.view.getUser(qf.cache.desk.getOpUin());
            if (vUser)
                vUser.hide();
            qf.cache.desk.removeUserByUin(qf.cache.desk.getOpUin());
            this.view.showInviteAndSeatBtn();
            this.view.updateTableBtns();

            let myStatus = qf.cache.desk.getUserByUin(qf.cache.user.uin).status;
            if (qf.cache.desk.getUserListLength() < 3 && qf.const.UserStatus.USER_STATE_SIT_READYED === myStatus) {
                // qf.cache.globalInfo.setStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_WAIT_SUCC_TIME);
                this.view.setMatchingShow(true);
                this.view.updateChangeDesk(true);
            }
        }

    },

    lordAutoPlayNotify(rsp) {
        let model = rsp.model;
        logd("托管消息");
        logd(model);
        qf.cache.desk.updateCacheByTuoGuan(model);
        if (this.view)
            this.view.setLordAutoPlay(model);
    },

    //操作超时请求
    requestOpTimeOut() {
        this.view.hideAllBtns();
        qf.net.send({
            cmd: qf.cache.desk.cmd_list.opTimeOutCmd,
            body: {},
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp);
            }
        });
    },

    //收到一条互动表情
    handleInteractPhiz(args) {
        let model = args.model;
        let uin = model.from_uin;
        let fromNick = model.nick;
        let toUin = model.to_uin;
        let phizId = model.expression_id;
        if (!this.view) return;

        //判断资源是否已经加载
        qf.rm.checkLoad("playerInfo", () => {
            this.handleInteractPhiz(args);
        });

        this.view.interactPhizAnimation(uin, toUin, phizId, fromNick);
    },

    //服务端下发游戏内聊天信息得通知，显示聊天气泡
    processGameChatEvt(paras) {
        if (!this.view) return;
        if (!paras || !paras.model) return;

        let model = paras.model;
        if (!model.op_uin) return;

        //this.handleChat(model);	//开始下载
    },

    //拉取玩家信息，并展示玩家信息对话框
    requestPlayInfo(args) {
        qf.net.send({
            cmd: qf.cmd.LORD_PLAYER_INFO_REQ,
            body: { other_uin: args.uin },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (gameData) => {
                        if (args.uin === qf.cache.user.uin) {
                            //自己个人信息
                            qf.cache.user.updateUserInfo(gameData);

                            qf.rm.checkLoad("playerInfo", () => {
                                qf.event.dispatchEvent(qf.ekey.OPEN_VIEW_DIALOG, { name: "lordmyselfinfo", data: args });
                            });
                        } else {
                            //他人个人信息
                            qf.cache.otherUserInfos.updateLordUserInfo(gameData);

                            qf.rm.checkLoad("playerInfo", () => {
                                qf.event.dispatchEvent(qf.ekey.OPEN_VIEW_DIALOG, { name: "lordmyselfinfo", data: args });
                            });
                        }
                    }
                });
            }
        });
    },

    requestUserReady(args) {
        qf.net.send({
            cmd: qf.cmd.DDZ_USER_READY_REQ,
            body: { start_type: args.start_type, show_multi: args.show_multi },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp);
            }
        });
    },

    userReadyNotify(rsp) {
        let model = rsp.model;
        let uin = model.uin;
        //更新用户为已准备
        let status = qf.const.UserStatus.USER_STATE_SIT_READYED;
        qf.cache.desk.updateReadyStatus(uin, status);
        this.view.updateUserReady(uin);

        let userList = qf.cache.desk.getUserList();
        let count = 0;
        let noready = 0;
        for (let i in userList) {
            let u = userList[i];
            if (u.status !== qf.const.UserStatus.USER_STATE_SIT_READYED) noready = 1;
            count++;
        }
        if (count === 3 && noready === 0)
            if (this.view.BM)
                this.view.BM.updateChangeTableBtns(false);

        if (uin === qf.cache.user.uin) {
            //清除UI
            this.view.clearLastUI();
            //加倍数据变为初始数据
            qf.net.send({
                cmd: qf.cache.desk.cmd_list.deskMultiCmd,
                body: {},
                callback: (rsp) => {
                    qf.net.util.rspHandler(rsp, {
                        successCb: (model) => {}
                    });
                }
            });

            if (this.view.PMRight.getChildrenCount() !== 0) {
                this.view.PMRight.node.removeAllChildren(true);
            }
            if (this.view.PMLeft.getChildrenCount() !== 0) {
                this.view.PMLeft.node.removeAllChildren(true);
            }

            if (qf.cache.desk.getUserListLength() < 3) {
                // qf.cache.globalInfo.setStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_WAIT_SUCC_TIME);
                this.view.setMatchingShow(true);
                //换桌按钮
                this.view.updateChangeDesk(true);
            }
        }
    },

    //明牌通知
    showCardNotify(rsp) {
        let model = rsp.model;
        //logd(model);
        for (let k in model.show_cards) {
            let v = model.show_cards[k];
            qf.cache.desk.updateCardInfo(v.card_info);

            qf.music.playMyEffect("sound_showcard", false);
            let user = qf.cache.desk.getOnDeskUserByUin(v.uin);

            if (!(qf.cache.desk.getMultiInfo().show_multi && qf.cache.desk.getMultiInfo().show_multi >= v.show_multi)) {
                if (qf.cache.desk.has_show_start === 0) {
                    this.view.showMultiAction(v.show_multi);
                }
            }

            if (user) {
                let sex = user.sex;
                qf.music.playMyEffect("mingpai" + "_" + sex, false);
                user.show_multi = v.show_multi;

                this.view.showCardAni(user.seat_id)
            }
        }

        this.view.updateShowCard();
    },

    //发牌过程中明牌请求
    showCardReq(args) {
        qf.net.send({
            cmd: qf.cmd.DDZ_SHOW_CARD_REQ,
            body: { show_multi: args.show_multi },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp);
            }
        });
    },

    //公共倍数改变通知
    onDeskMultiNotify(rsp) {
        logd("LordGameController:onDeskMultiNotify");
        logd(rsp.model);
        qf.cache.desk.updateMultiInfo(rsp.model);

        //如果公共倍数界面是打开的，则更新界面数据
        let multi = qf.cache.desk.getMultiInfo();
        qf.event.dispatchEvent(qf.ekey.UPADTE_MULTIPLE_DIALOG, multi);

        this.view.setMultip(qf.cache.desk.getMultiple()); //更新总倍数
    },

    updateBeginButtons() {
        this.view.getButtonManager().updateBeginBtns();
    },

    hideAllBtns() {
        this.view.getButtonManager().hideAllBtns();
    },

    updateShowCardBtn(args) {
        let multiple = args.multiple;
        this.view.getButtonManager().updateShowCardBtn(multiple);
    },

    onOpenMultiDialog(args) {
        let commonmultipleModule = () => {
            qf.event.dispatchEvent(qf.ekey.OPEN_VIEW_DIALOG, { name: "commonmultiple" });
        }

        ModuleManager.checkPreLoadModule({ callback: commonmultipleModule, loadResName: "commonmultiple" });

        let multi = qf.cache.desk.getMultiInfo();
        qf.event.dispatchEvent(qf.ekey.UPADTE_MULTIPLE_DIALOG, multi);

        // 好友结算会下发数据，无需请求
        if (!args.isGameOver) {
            //打开窗口的同时，请求协议
            qf.net.send({
                cmd: qf.cache.desk.cmd_list.deskMultiCmd,
                body: {},
                callback: (rsp) => {
                    qf.net.util.rspHandler(rsp, {
                        successCb: (model) => {
                            logd("**********qf.cmd.DDZ_DESK_MULTI_REQ success**********");
                        }
                    });
                }
            });
        }
    },

    onOpUserNotify(rsp) {
        logd("LordGameController:onOpUserNotify");
        logd(rsp.model);
        qf.cache.desk.updateOpUserInfo(rsp.model);
        if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_QDZ) {
            this.turnGrabLord();
        } else if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_MUTIPLE) {
            this.turnMuti();
        } else if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME) {
            this.turnPlayGame();
        }
    },

    turnGrabLord() {
        logd("turnGrabLord", this.TAG);
        if (this.view) {
            this.view.stopSendPoker();
        }
        this.setCountLeftTime();
        //隐藏所有操作按钮
        this.view.getButtonManager().hideAllBtns();

        let isMySelfAuto = qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin);
        //轮到自己叫分，显示叫分按钮组
        if (qf.cache.desk.getNextUin() === qf.cache.user.uin)
            this.view.getButtonManager().updateCallBtns(qf.cache.desk.getMaxGrabAction());

        this.view.updateRobot(qf.cache.user.uin, isMySelfAuto);
        this.view.updateMyHandCardsByAuto();
        this.view.updateUIByMySelfAutoPlay();

        //先显示三张背面
        this.view.getTopManager().genThreeCards([-1, -1, -1], false, true); //qf.cache.desk.getRoomType() === LordGameType.LAIZICHANG, true)

        this.view.updateMySelfClockPostion();

    },

    //发起换桌请求
    requestUserChangeDesk(paras) {
        logd("requestUserChangeDesk");
        //显示loading界面，收到进桌推送后再移除
        let body = {};
        if (paras && paras.roomId) {
            //roomId存在就是换场
            body.room_id = paras.roomId;
        }
        qf.net.send({
            cmd: this.getUserChangeDeskCmd(),
            wait: true,
            body: body,
            callback: (rsp) => {
                logd(rsp);
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        logd("**********requestUserChangeDesk success**********");
                        qf.cache.desk = null;
                        qf.cache.desk = ModuleManager.getGameEntry().createDesk();
                        ModuleManager.reloadToTopModule("GameController");

                        //发送进桌通知
                        qf.event.dispatchEvent(qf.ekey.LORD_NET_ENTER_DESK_NOTIFY, rsp);

                    }
                });
            }
        });
    },

    getUserChangeDeskCmd() {
        return qf.cmd.LORD_USER_CHANGE_DESK_REQ;
    },

    onGameChatNotify(rsp) {
        let model = rsp.model;
        if (!model) return;
        let record = {};
        record.op_uin = model.op_uin;
        record.nick = model.nick;
        record.content = model.content;
        record.content_type = model.content_type;
        //record.deskid = model.deskid;
        //record.room_id = model.room_id;
        // record.gender = model.gender;
        //record.portrait = model.portrait;
        //record.voice_time = model.voice_time;

        let showPopChat = () => {
            let user = this.view.getUser(record.op_uin)
            if (user)
                user.showPopChat(record)
            this.updateChatRecord(record); //更新聊天记录
        }

        ModuleManager.checkPreLoadModule({ callback: showPopChat, loadResName: "gamechat" })

    },
    gameChatReq(paras) {
        qf.net.send({
            cmd: qf.cmd.DDZ_GAME_CHAT_REQ,
            body: { content: paras.content, content_type: paras.content_type },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: () => {
                        logd("gameChatReq succ");
                    }
                });
            }
        });
    },

    updateChatRecord(record) {},

    //发起进桌检查金币限制请求
    requestCheckGoldLimit(paras) {
        logd("requestCheckGoldLimit");
        let callBackData = paras.data;
        let goldLimitCallback = paras.goldLimitCallback;
        let limitSuccessFunc = () => {
            if (goldLimitCallback) {
                goldLimitCallback(callBackData);
            }
        };
        let changeDesk = id => {
            qf.event.dispatchEvent(qf.ekey.LORD_REQUEST_USER_CHANGE_DESK, { roomId: id }); //换场
        };
        let goShop = () => {
            // TODO
            // function pushSetModule() {
            //     //显示商城
            //     ModuleManager.pushModule("ShopController");
            // }

            // ModuleManager.checkPreLoadModule({callback: pushSetModule, loadResName: "shop"});
        };
        let goFlowMain = () => {
            qf.event.dispatchEvent(qf.ekey.CLICK_VEDIO_AD);
        };
        let cancelFunc = () => {
            //退出桌子，返回到大厅
            qf.event.dispatchEvent(qf.ekey.LORD_NET_EXIT_DESK_REQ);
            // qf.cache.globalInfo.setStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_BACK_INTO_HALL); //游戏内返回大厅
        };
        let typeInfo = qf.cache.desk.getTypeInfo();
        qf.net.send({
            cmd: qf.cmd.DDZ_CHECK_GOLD_LIMIT_REQ,
            wait: true,
            body: { room_id: typeInfo.roomId },
            callback: (rsp) => {
                logd(rsp);
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        logd("**********CheckGoldLimit success**********");
                        let id = model.room_id;
                        if (model.flag === 1) {
                            //金币过少，前往低级场
                            if (id) {
                                //前往商城
                                qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                                    sureCb() {
                                        changeDesk(id);
                                    },
                                    cancelCb() {
                                        cancelFunc();
                                    },
                                    isModal: true,
                                    content: qf.txt.tip_gold_limit_low1
                                });
                            } else {
                                let OS = qf.platform.getPlatformName();
                                let txt = "";
                                let img = null;
                                let isIOS = false;
                                if (OS === "ios") {
                                    isIOS = true;
                                    txt = qf.txt.tip_gold_limit_low3;
                                    img = qf.tex.global_txt_ljhq;
                                } else {
                                    txt = qf.txt.tip_gold_limit_low2
                                }
                                qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                                    sureCb() {
                                        if (!isIOS) {
                                            goShop();
                                        } else {
                                            cancelFunc();
                                            goFlowMain();
                                        }
                                    },
                                    cancelCb() {
                                        cancelFunc();
                                    },
                                    isModal: true,
                                    content: txt,
                                    isOnly: true,
                                    confirmTxtImg: img
                                });
                            }
                        } else if (model.flag === 2) {
                            //金币过多,前往更高级场
                            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                                sureCb() {
                                    changeDesk(id)
                                },
                                cancelCb() {
                                    cancelFunc();
                                },
                                isModal: true,
                                content: qf.txt.tip_gold_limit_up
                            });
                        } else if (model.flag === 0) {
                            //限制通过
                            limitSuccessFunc();
                        }
                    },
                    failCb: () => {
                        // //金币不足检测，如果有破产补助则返回错误码1370，不做处理
                        // ver.520 所有金币不足情况均返回1370并接收6622金币不足通知
                    }
                });
            }
        });
    },

    sendShareCounterToWX() { //记牌器分享
        let data = "type=" + qf.const.LaunchOptions.TYPE_COUNTER_SHARE + "&fromUin=" + qf.cache.user.uin;
        logd("shareMessage  query:" + data);

        let title = qf.txt.stringShareTitle; //默认标题
        let imgUrl = qf.res.share_banner_normal_game; //默认图片
        let id = -1;
        // for(k in qf.cache.Config.shareMsgs){
        //     let v = qf.cache.Config.shareMsgs[k];
        //     if(v.type === qf.const.ShareMsgType.SHARE){
        //         //title = v.title;
        //         //imgUrl = v.img_url;
        //     }
        // }
        //随机图片
        let shareImgUrls = qf.cache.Config.shareImgUrls;
        if (shareImgUrls && shareImgUrls.length > 0) {
            let random_num = Math.floor(Math.random() * 10);
            let index = random_num % (shareImgUrls.length);
            imgUrl = shareImgUrls[index].img_url;
            title = shareImgUrls[index].title;
            id = shareImgUrls[index].id;
        }

        let shareInfo = qf.cache.desk.getCounterShareInfo();
        if (shareInfo && shareInfo !== undefined) {
            imgUrl = shareInfo.icon;
            title = shareInfo.str;
            id = shareInfo.share_id;
            logd("----------------------------牌桌内记牌器分享图文----------------------------");
            logd(shareInfo);
        }
        // qf.platform.uploadEventStat({   //用户点击立即分享
        //     "module": "share",
        //     "event": STAT_KEY.PYWXDDZ_EVENT_SHARE_CLICK_SHARE_BTN,
        //     "custom":{
        //         scene:qf.const.ShareScene.GAME,
        //         via:qf.const.ShareMsgType.SHARE,
        //         img_id:id
        //     }
        // });
        let shareSuccess = ()=>{
            // qf.platform.uploadEventStat({   //用户点击立即邀请
            //     "module": "share",
            //     "event": STAT_KEY.PYWXDDZ_EVENT_SHARE_SUCCESS,
            //     "custom":{
            //         scene:qf.const.ShareScene.GAME,
            //         via:qf.const.ShareMsgType.SHARE,
            //         img_id:id
            //     }
            // });
        }
        qf.platform.shareMessage({
            imageUrl: imgUrl,
            title: title,
            shareId: id,
            query: "type=" + qf.const.LaunchOptions.TYPE_COUNTER_SHARE + "&fromUin=" + qf.cache.user.uin,
            scb: (res) => {
                shareSuccess();
                qf.net.send({
                    cmd: qf.cmd.DDZ_DESK_COUNTER_RECEIVE_REQ,
                    wait: true,
                    body: {},
                    callback: (rsp) => {
                        logd("-----------------------sendShareCounterToWX-------------------");
                        //logd(rsp);
                        qf.net.util.rspHandler(rsp, {
                            successCb: (mode) => {
                                //分享成功
                                qf.cache.desk.updateCardCounter(mode.card_counter);
                                qf.cache.desk.updateCardCounterShow(mode.need_pop_card_counter);
                                let card_counter = qf.cache.desk.getCardCounter();
                                qf.cache.config.updateCounterNum(card_counter.counts);
                                if (this.view) {
                                    this.view.updateCounter();
                                    // this.view.hideCounter();
                                }
                                qf.event.dispatchEvent(qf.ekey.GLOBAL_SINGLE_TOAST, { txt: qf.txt.counter_share_tip3 });
                            },
                            failCb: () => {
                                if (rsp.ret === 1367) { //今日分享领取计牌器已达上限
                                    qf.event.dispatchEvent(qf.ekey.GLOBAL_SINGLE_TOAST, { txt: qf.txt.counter_share_tip2 });
                                } else if (rsp.ret === 1368) { //已经分享过
                                    qf.event.dispatchEvent(qf.ekey.GLOBAL_SINGLE_TOAST, { txt: qf.txt.counter_share_tip1 });
                                } else {
                                    qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.cache.Config.errorMsg[rsp.ret] || cc.js.formatStr(qf.txt.common_error_tips, rsp.ret) });
                                }
                            }
                        });
                    }
                });
            }
        });
    },

    //更新换桌按钮
    updateChangeTableBtns() {
        this.view.updateChangeDesk();
    },

    syncFortuneInfoNotify(rsp) {
        logd("syncFortuneInfoNotify");
        let model = rsp.model;
        logd(model);

        qf.cache.desk.updateFortuneInfo(model);
        this.view.updateFortuneInfo();
    },

    //好友房结算后清掉ui
    clearUIByGameOver(rsp) {
        //清除UI
        if (this.view) {
            this.view.clearLastUI();
        }
    },

    //更新记牌器数量
    updateCounterNum() {
        let card_counter = qf.cache.desk.getCardCounter();
        qf.cache.config.updateCounterNum(card_counter.counts);
    },

    //override
    isInMatchView(args) {
        let roomId = null;

        if (ModuleManager.getModule("MatchController") && ModuleManager.getModule("MatchController").getModel()) {
            roomId = ModuleManager.getModule("MatchController").getModel().getRoomId();
        }
        if (args.ret === 2) //&& qf.cache.desk.classicShareIsopen
        {
            let isBackMatch = false; //是否回到匹配界面
            if (roomId) {
                isBackMatch = true; //先移除再回到匹配界面
            }
            qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME, { isBackMatch: isBackMatch });

            if (roomId) //qf.cache.desk.roomId
            {
                qf.rm.checkLoad("match", () => {
                    qf.mm.clean();
                    qf.mm.show("match", { roomId: roomId });
                });
            }
        } else {
            let text = qf.cache.config.errorMsg[args.ret] || qf.txt.tip_error_desc_6;
            qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: text });
            qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME);
        }
    },

    //赛事活动通知
    onJoinMatchRewardNotify(rsp) {
        logd("LordGameController:onJoinMatchRewardNotify");
        logd(rsp.model);
        let report = [];
        if (rsp.model && rsp.model.report) {
            report = rsp.model.report;
        }
        qf.cache.desk.updateEventGameActivityData(report);

        //如果赛事活动界面是打开的，则更新界面数据
        this.updateEventActivityDialog();
    },

    onHideInviteBtn() {
        if (this.view) {
            this.view.hideInviteBtn();
        }
    },

    classicRoomExit(args) {
        loge("!!! 退出询问")
        let cb = () => {
            // TODO 任务系统
            // let closestTask = ModuleManager.getModule("TaskController").getModel().getClosestTask();
            // if(closestTask){
            //     let txt_tip_1 = "";
            //     if(closestTask.type === 1){
            //         let task_reward = closestTask.task_reward;
            //         txt_tip_1 = task_reward.reward_type === 1 ? qf.txt.task_tip_1 : qf.txt.task_tip_3;
            //     }else{
            //         txt_tip_1 = qf.txt.task_tip_2;
            //     }

            //     let left = closestTask.condition - closestTask.process;
            //     txt_tip_1 = cc.formatStr(txt_tip_1,left,closestTask.task_reward.amount);

            //     let data = {
            //         sureCb () {
            //             if(args.confirmCb) args.confirmCb();
            //         },
            //         cancelCb () {
            //             if(args.exitCb) args.exitCb();
            //         },
            //         confirmBtnImg:qf.res.global_btn_middle2,
            //         confirmTxtImg:qf.res.global_txt_qued_2,
            //         cancelBtnImg:qf.res.global_btn_middle1,
            //         cancelTxtImg:qf.res.global_txt_continue,
            //         isModal:false,
            //         content:txt_tip_1
            //     }

            //     qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, data);

            // }else{
            let txtTips = qf.txt.exit_desk_ready_tip;

            let u = qf.cache.desk.getUserByUin(qf.cache.user.uin);
            if (u && u.status === qf.const.UserStatus.USER_STATE_INGAME)
                txtTips = qf.txt.exit_desk_playing_tip;

            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                sureCb: () => {
                    qf.event.dispatchEvent(qf.ekey.LORD_NET_EXIT_DESK_REQ);
                },
                isModal: false,
                content: txtTips
            });
            // }
        }

        // let taskInfo = ModuleManager.getModule("TaskController").getModel().getTaskInfo();
        // if(taskInfo.length === 0){
        //     ModuleManager.getModule("TaskController").getTaskInfoReq(cb);
        // }else{
        cb();
        // }
    },

    //更新赛事活动界面
    updateEventActivityDialog() {
        if (this.view) {
            this.view.updateEventActivityDialog();
        }
    },

    //type  0:看视频  1：分享
    pickRewardByVedioOrShare(args) {
        loge("pickRewardByVedioOrShare ")
        //移除弹框
        let luckyTask = args.luckyData; //qf.cache.desk.getLuckyTask();
        let reward_type = luckyTask.awards[0].reward_type;
        if (reward_type !== 2) qf.event.dispatchEvent(qf.ekey.REMOVE_LUCKY_REWARD_DIALOG);

        if (args.type === 0) {
            qf.platform.showRewardedVideoAd(()=>{
                //看完视频回调
                this.pickLuckyTaskReward(true, args);
            });
        } else {
            let title = qf.txt.stringShareTitle; //默认标题
            let imgUrl = qf.res.share_banner_normal_game; //默认图片
            let id = -1;
            let shareInfo = qf.cache.desk.getLuckyTask().share_info;
            if (shareInfo && shareInfo.icon && shareInfo.share_id) {
                imgUrl = shareInfo.icon;
                title = shareInfo.str;
                id = shareInfo.share_id;
            }

            //数据上报
            // qf.platform.uploadEventStat({
            //     "module": "share",
            //     "event": STAT_KEY.PYWXDDZ_EVENT_SHARE_CLICK_SHARE_BTN,
            //     "custom":{
            //         scene:qf.const.ShareScene.GAME,
            //         via:qf.const.ShareMsgType.LUCKYTASK,
            //         img_id:id
            //     }
            // });
            let shareSuccess = ()=>{
                // qf.platform.uploadEventStat({
                //     "module": "share",
                //     "event": STAT_KEY.PYWXDDZ_EVENT_SHARE_SUCCESS,
                //     "custom":{
                //         scene:qf.const.ShareScene.GAME,
                //         via:qf.const.ShareMsgType.LUCKYTASK,
                //         img_id:id
                //     }
                // });
            }

            qf.platform.shareMessage({
                imageUrl: imgUrl,
                title: title,
                shareId: id,
                query: "type=" + qf.const.LaunchOptions.TYPE_LUCKY_TASK + "&fromUin=" + qf.cache.user.uin,
                scb: (res) => {
                    shareSuccess();
                    this.pickLuckyTaskReward(false, args);
                },
            });
        }
    },

    pickLuckyTaskReward(bUpdateAdInfo, args) {
        let luckyTask = args.luckyData; //qf.cache.desk.getLuckyTask();
        let hand_id = luckyTask.hand_id;
        qf.net.send({
            cmd: qf.cmd.DDZ_PICK_LUCKY_TASK_REWARD_REQ,
            wait: true,
            body: { tid: luckyTask.tid, hand_id: hand_id },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        //恭喜获得
                        if (bUpdateAdInfo) {
                            //更新流量主
                            qf.event.dispatchEvent(qf.ekey.GET_USER_AD_INFO_REQ, { type: qf.const.FLOWMAIN_TYPE.GET });
                        }

                        if (luckyTask.awards[0]) {
                            let reward_type = luckyTask.awards[0].reward_type;
                            if (reward_type !== 2) {
                                let type = 0;
                                let amount = luckyTask.awards[0].amount;
                                if (reward_type === 1) {
                                    type = qf.const.rewardType.COIN;
                                } else if (reward_type === 3) {
                                    type = qf.const.rewardType.CARDCOUNTER;
                                }

                                qf.event.dispatchEvent(qf.ekey.SHOW_REWARD_DIALOG, { type: type, rewardNum: amount, txtTip: qf.txt.luckyTask_tip_3 });
                            }

                            if (args.cb) args.cb();
                        }
                    }
                });
            }
        });
    },
});