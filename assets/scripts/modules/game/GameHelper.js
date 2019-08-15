/*
 */

cc.Class({
    ctor() {
        //向服务器请求是否有未完成牌局
        qf.event.on(qf.ekey.ROOM_CHECK, this.onCheckRoom, this);

        //进桌前检查金币是否足够
        qf.event.on(qf.ekey.EVT_CHECK_GOLD_ENOUGH, this.onCheckGoldEnough, this);

        //在场内：开始前检查金币是否足够
        qf.event.on(qf.ekey.EVT_CHECK_GOLD_ENOUGH_INGAME, this.onCheckGoldEnoughInGame, this);

        //游戏内进桌请求
        qf.event.on(qf.ekey.NET_INPUT_REQ, this.onInputGame, this);

        //游戏内前后台切换
        qf.event.on(qf.ekey.EVT_QUERY_DESK, this.onQueryDesk, this);

        //进入邀请的牌桌
        qf.event.on(qf.ekey.EVT_INPUT_INVITED_DESK, this.onInputInvitedDesk, this);

        //进入指定的牌桌
        qf.event.on(qf.ekey.EVT_INPUT_SPECIFIED_DESK, this.onInputSpecifiedDesk, this);
    },

    //检查是否在经典场
    //params 从需要检查的场景传来的参数
    //model 从服务器请求来的数据
    _checkNormalRoom(params, model) {
        let roomid = params.roomid;
        let returnGameCallBack = params.returnGameCallBack;
        let old_roomid = model.old_room;
        let old_deskid = model.desk_id;
        //未完成对局是经典房
        if (roomid === old_roomid) {
            this.onInputSpecifiedDesk({ room_id: old_roomid, desk_id: old_deskid, show_multi: 1 });
        } else {
            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                sureCb: () => {
                    if (returnGameCallBack) returnGameCallBack();
                    this.onInputSpecifiedDesk({ room_id: old_roomid, desk_id: old_deskid, show_multi: 1 });
                },
                isModal: false,
                content: qf.txt.tip_unFinishedGame
            });
        }
    },

    //检查是否在好友房
    //params 从需要检查的场景传来的参数
    //model 从服务器请求来的数据
    _checkFriendRoom(params, model) {
        let roomid = params.roomid;
        let deskid = params.deskid ? params.deskid : -1;
        let returnGameCallBack = params.returnGameCallBack;
        let old_roomid = model.old_room;
        let old_deskid = model.desk_id;
        let old_ingame = model.in_game;

        //好友房 roomid 都是一个  所以用deskid 判断
        if (deskid === old_deskid) {
            this.onInputSpecifiedDesk({ room_id: old_roomid, desk_id: old_deskid });
        } else if (old_ingame === qf.const.INGAME.TRUE) {
            //如果邀请进入的deskid和之前的desk_id不一致,但玩家还在打牌,进入之前的牌桌
            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                sureCb: () => {
                    if (returnGameCallBack) returnGameCallBack();
                    this.onInputSpecifiedDesk({ room_id: old_roomid, desk_id: old_deskid });
                },
                isModal: false,
                content: qf.txt.tip_unFinishedGame
            });
        } else {
            //如果邀请进入的deskid和之前的desk_id不一致,并且没在打牌,进入新邀请牌桌
            this.onInputSpecifiedDesk({ room_id: roomid, desk_id: deskid });
        }
    },

    //检查是否在赛事场
    //params 从需要检查的场景传来的参数
    //model 从服务器请求来的数据
    _checkEventRoom(params, model) {
        let roomid = params.roomid;
        let returnGameCallBack = params.returnGameCallBack;
        let old_roomid = model.old_room;
        let old_deskid = model.desk_id;

        if (roomid === old_roomid) {
            this.onInputSpecifiedDesk({ room_id: old_roomid, desk_id: old_deskid, is_match: 1 });
        } else {
            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                sureCb: () => {
                    if (returnGameCallBack) returnGameCallBack();
                    this.onInputSpecifiedDesk({ room_id: old_roomid, desk_id: old_deskid });
                },
                isModal: false,
                content: qf.txt.tip_unFinishedGame
            });
        }
    },

    //检查是否在残局
    //params 从需要检查的场景传来的参数
    //model 从服务器请求来的数据
    _checkEndRoom() {
        let roomid = params.roomid;
        let returnGameCallBack = params.returnGameCallBack;
        let old_roomid = model.old_room;
        let old_deskid = model.desk_id;

        if (roomid === old_roomid) {
            this.onInputSpecifiedDesk({ room_id: old_roomid, desk_id: old_deskid, show_multi: 1 });
        } else {
            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                sureCb: () => {
                    if (returnGameCallBack) returnGameCallBack();
                    this.onInputSpecifiedDesk({ room_id: old_roomid, desk_id: old_deskid });
                },
                isModal: false,
                content: qf.txt.tip_unFinishedGame
            });
        }
    },

    //检查看是否有之前未完成的牌局
    onCheckRoom(params) {
        let roomCheckCallBack = params.roomCheckCallBack;

        qf.net.send({
            cmd: qf.cmd.DDZ_ROOM_CHECK_REQ,
            wait: true,
            body: {},
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        if (model && model.old_room && model.desk_id) {
                            let old_desk_mode = model.desk_mode;
                            //1:经典场 
                            if (old_desk_mode === qf.const.DESK_MODE_NORMAL) {
                                logd(" **** gameType === qf.const.DESK_MODE_NORMAL **** ");
                                this._checkNormalRoom(params, model);
                            }
                            //2:好友房
                            else if (old_desk_mode === qf.const.DESK_MODE_FRIEND) {
                                logd(" **** gameType === qf.const.DESK_MODE_FRIEND **** ");
                                this._checkFriendRoom(params, model);
                            }
                            //赛事
                            else if (old_desk_mode === qf.const.DESK_MODE_EVENT) {
                                logd(" **** gameType === qf.const.DESK_MODE_EVENT **** ");
                                this._checkEventRoom(params, model);
                            }
                            //残局
                            else if (old_desk_mode === qf.const.DESK_MODE_ENDGAME) {
                                logd(" **** gameType === qf.const.DESK_MODE_ENDGAME **** ");
                                this._checkEndRoom(params, model);
                            }
                        } else {
                            if (roomCheckCallBack) roomCheckCallBack(params.data);
                        }
                    }
                });
                qf.platform.clearLocLaunchAndShowData(); //清除启动和切前台的数据
            }
        });
    },

    //在房间内：进桌前检查金币是否足够进桌
    onCheckGoldEnoughInGame(params) {
        let goldLimitCallback = params.goldLimitCallback;

        //换桌
        let changeDesk = (id) => {
            qf.event.dispatchEvent(qf.ekey.LORD_REQUEST_USER_CHANGE_DESK, { room_id: id });
        };

        //退出桌子，返回到大厅
        let cancelFunc = () => {
            qf.event.dispatchEvent(qf.ekey.LORD_NET_EXIT_DESK_REQ);
            //游戏内返回大厅
            qf.cache.global.setStatUploadTime(qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_BACK_INTO_HALL);
        };

        let roomid = params.roomid;
        let content = this.getCommonPromptNotGold();

        qf.net.send({
            cmd: qf.cmd.DDZ_CHECK_GOLD_LIMIT_REQ,
            wait: true,
            body: { room_id: roomid },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        //金币过少，前往低级场
                        if (model.flag === 1) {
                            if (model.room_id) {
                                //前往商城
                                qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                                    sureCb: () => {
                                        changeDesk(model.room_id)
                                    },
                                    cancelCb: () => {
                                        cancelFunc();
                                    },
                                    isModal: true,
                                    content: qf.txt.tip_gold_limit_low1
                                });
                            } else {
                                qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                                    sureCb: () => {
                                        if (content.ios) {
                                            cancelFunc();
                                            qf.event.dispatchEvent(qf.ekey.CLICK_VEDIO_AD);
                                        } else {
                                            qf.event.dispatchEvent(qf.ekey.EVT_SHOW_SHOP);
                                        }
                                    },
                                    cancelCb: () => {
                                        cancelFunc();
                                    },
                                    isModal: true,
                                    content: content.txt,
                                    isOnly: true,
                                    confirmTxtImg: content.img
                                });
                            }
                        }
                        //金币过多,前往更高级场
                        else if (model.flag === 2) {
                            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                                sureCb: () => {
                                    changeDesk(model.room_id)
                                },
                                cancelCb: () => {
                                    cancelFunc();
                                },
                                isModal: true,
                                content: qf.txt.tip_gold_limit_up
                            });
                        }
                        //限制通过
                        else if (model.flag === 0) {
                            goldLimitCallback && goldLimitCallback();
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

    //进桌前检查金币是否足够
    onCheckGoldEnough(params) {

        let roomid = params.roomid;
        let content = this.getCommonPromptNotGold();
        qf.net.send({
            cmd: qf.cmd.DDZ_CHECK_GOLD_LIMIT_REQ,
            wait: true,
            body: { room_id: roomid },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        //金币过少
                        if (model.flag === 1) {
                            if (model.room_id) {
                                qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                                    sureCb: () => {
                                        qf.event.dispatchEvent(qf.ekey.EVT_SHOW_MATCH, { roomid: model.room_id });
                                    },
                                    isModal: false,
                                    content: qf.txt.tip_gold_limit_low1
                                });
                            } else {
                                qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                                    sureCb: () => {
                                        if (content.ios) {
                                            qf.event.dispatchEvent(qf.ekey.CLICK_VEDIO_AD);
                                        } else {
                                            qf.event.dispatchEvent(qf.ekey.EVT_SHOW_SHOP);
                                        }
                                    },
                                    isModal: false,
                                    content: content.txt,
                                    isOnly: true,
                                    confirmTxtImg: content.img
                                });
                            }
                        }
                        //金币过多
                        else if (model.flag === 2) {
                            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                                sureCb: () => {
                                    qf.event.dispatchEvent(qf.ekey.EVT_SHOW_MATCH, { roomid: model.room_id });
                                },
                                isModal: false,
                                content: qf.txt.tip_gold_limit_up
                            });
                        }
                        //可以进入
                        else if (model.flag === 0) {
                            qf.event.dispatchEvent(qf.ekey.EVT_SHOW_MATCH, { roomid: roomid });
                        }
                    },
                    failCb: () => {
                        // //金币不足检测，如果有破产补助则返回错误码1370，不做处理
                    }
                });
            }
        });
    },

    onInputGame(params) {
        if (!qf.rm.isLoadded("table")) {
            //匹配成功到打牌界面，页面加载时间
            qf.cache.global.setStatUploadTime(qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_MATCH_SUCC_WAIT);
        }
        let desk_mode = params.body.desk_mode;

        let deskLoadCallback = () => {
            //显示游戏模块
            this.requestInputDesk(params);

            let instance = qf.cache.global.getStatUploadTime(qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_MATCH_SUCC_WAIT);
            if (instance) {
                qf.platform.uploadEventStat({ //匹配成功到打牌界面，页面加载时间
                    "module": "performance",
                    "event": qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_MATCH_SUCC_WAIT,
                    "value": instance
                });
            }
        };

        let loadCallback = () => {
            if (desk_mode) {
                qf.rm.checkLoad(qf.const.TABLE_RES_NAME[desk_mode], () => {
                    deskLoadCallback();
                });
            } else {
                //显示游戏模块
                this.requestInputDesk(params);

                let instance = qf.cache.global.getStatUploadTime(qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_MATCH_SUCC_WAIT);
                if (instance) {
                    qf.platform.uploadEventStat({ //匹配成功到打牌界面，页面加载时间
                        "module": "performance",
                        "event": qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_MATCH_SUCC_WAIT,
                        "value": instance
                    });
                }
            }
        };

        qf.rm.checkLoad("table", () => {
            loadCallback();
        });
    },

    //请求服务器执行进桌
    //在这之前，客户端应该已经把资源全部下载成功了
    requestInputDesk(params) {
        //显示loading界面，收到进桌推送后再移除
        let body = params.body;
        let cmd = qf.cmd.LORD_ENTER_DESK_REQ;
        if(body.desk_mode === qf.const.DESK_MODE_NEWEVENT){
            cmd = qf.cmd.LORD_ENTER_DESK_NEWEVENT_REQ;
        }

        qf.net.send({
            cmd: cmd,
            wait: true,
            body: body,
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        this._inputDeskSuccess(params, model);
                    },
                    failCb: () => {
                        this._inputDeskFail(rsp);
                    }
                });
            }
        });
    },

    //进桌请求成功的处理
    //params 从进桌场景传来的参数
    //model 从服务器请求来的数据
    _inputDeskSuccess(params, model) {

        let desk_mode = model.desk_mode;

        let goto_game = (name) => {
            qf.rm.checkLoad("table", () => {

                //关掉所有的弹窗
                qf.dm.clean();

                //清理掉所有的场景
                qf.mm.clean();

                //显示要进入的游戏场景
                qf.mm.show(name);
            });
        };

        //牌桌缓存
        qf.cache.desk_mode = desk_mode;

        //创建牌桌数据
        if (desk_mode === qf.const.DESK_MODE_NORMAL) {
            goto_game("normal");
        } else if (desk_mode === qf.const.DESK_MODE_FRIEND) {
            goto_game("friend");
        } else if (desk_mode === qf.const.DESK_MODE_EVENT) {
            qf.cache.desk.updateCmData(model.cm_data);
            goto_game("event");
        } else if (desk_mode === qf.const.DESK_MODE_ENDGAME) {
            goto_game("end");
        } else if (desk_mode === qf.const.DESK_MODE_NEWEVENT){
            qf.cache.event_desk.updateCmData(model.cm_data);
            goto_game("event");
        }
    },

    //当金币不足时返回提示框内显示的内容
    getCommonPromptNotGold() {
        let txt = "",
            img = null;
        let is_ios = qf.platform.getPlatformName() === "ios";
        if (is_ios === "ios") {
            txt = qf.txt.tip_gold_limit_low3;
            img = qf.tex.global_txt_ljhq;
        } else {
            txt = qf.txt.tip_gold_limit_low2;
        }
        return {
            ios: is_ios,
            txt: txt,
            img: img
        }
    },

    _inputDeskFail(rsp) {

        if (rsp.ret === qf.const.NET_WORK_STATUS.FORBID_VIEWER) {
            let txtTips = qf.txt.noEnterDeskForFull;
            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, { isModal: false, isOnly: true, content: txtTips });
        } else if (rsp.ret === qf.const.NET_WORK_STATUS.GOLD_NOT_ENOUGH) {
            let content = this.getCommonPromptNotGold();
            if (content.ios) {
                //设置mainview是否打开赛事邀请引导 标记
                // if (ModuleManager.getModule("MainController") && ModuleManager.getModule("MainController").view)
                // {
                //     if (ModuleManager.getModule("MainController").view.viewIsVisable)
                //     {
                //         if (ModuleManager.getModule("MainController").view.setIsOpenGuide())
                //         {
                //             let view = ModuleManager.getModule("MainController").view;
                //             ModuleManager.getModule("MainController").view.lastTime = new Date().getTime() + view.rejecttimes*1000;
                //             ModuleManager.getModule("MainController").view.isNeedGuide(true);
                //         }
                //     }
                // }

                qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                    sureCb: () => {
                        qf.event.dispatchEvent(qf.ekey.CLICK_VEDIO_AD);
                    },
                    isModal: false,
                    content: content.txt,
                    isOnly: true,
                    confirmTxtImg: content.img
                });
            } else {
                qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                    sureCb: () => {
                        qf.event.dispatchEvent(qf.ekey.EVT_SHOW_SHOP);
                    },
                    isModal: false,
                    content: content.txt,
                    isOnly: true,
                    confirmTxtImg: content.img
                });
            }
        }
        // ver.520 所有金币不足情况均返回1370并接收6622金币不足通知
        else if (rsp.ret === qf.const.NET_WORK_STATUS.DIAMOND_NOT_ENOUGH) {
            // 钻石不足
            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_NOT_DIAMOND);
        }
        //rsp.ret = NET_WORK_STATUS.GAME_NO_TOAST 时，不弹吐司
        else if (rsp.ret !== qf.const.NET_WORK_STATUS.GAME_NO_TOAST) {
            qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.cache.config.errorMsg[rsp.ret] || cc.js.formatStr(qf.txt.common_error_tips, rsp.ret) });
        }
    },

    //查询牌桌
    onQueryDesk() {

        qf.net.send({
            cmd: qf.cache.desk.cmd.queryDeskCmd,
            wait: true,
            body: {},
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        //进桌
                        qf.event.dispatchEvent(qf.ekey.LORD_NET_ENTER_DESK_NOTIFY, rsp);

                        let loginQuery = qf.utils.getLaunchData();
                        if (qf.utils.isLaunchDataValid(loginQuery)) {
                            let room_id = qf.func.checkint(loginQuery.room_id);
                            let desk_id = qf.func.checkint(loginQuery.desk_id);
                            qf.event.dispatchEvent(qf.ekey.ROOM_CHECK, {
                                roomid: room_id,
                                deskid: desk_id,
                                roomCheckCallBack: () => {
                                    this.onInputSpecifiedDesk({ room_id: room_id, desk_id: desk_id });
                                }
                            });
                        }
                        qf.platform.clearLocLaunchAndShowData(); //清除启动和切前台的数据
                    },
                    timeOutCb: () => {
                        //超时重发
                        this.onQueryDesk();
                    },
                    failCb: () => {
                        this.isInMatchView(rsp);
                        qf.cache.desk.classicShareIsopen = false;
                    }
                });
            }
        });
    },

    //进入被邀请的房间
    onInputInvitedDesk() {
        let loginQuery = qf.utils.getLaunchData();
        if (loginQuery.type === qf.const.LaunchOptions.TYPE_GAME_INVITE ||
            loginQuery.type === qf.const.LaunchOptions.TYPE_FRIEND_FROOM_INVITE) {
            let desk_id = qf.func.checkint(loginQuery.desk_id)
            let room_id = qf.func.checkint(loginQuery.room_id);

            this.onInputSpecifiedDesk({ room_id: room_id, desk_id: desk_id });
            qf.cache.global.setStatUploadTime(qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_ENTER_CUSTOM_DESK);
        }
    },

    //进入指定的房间
    //room_id: 指定房间id
    //desk_id: 指定的牌桌id
    onInputSpecifiedDesk(params) {
        let room_id = params.room_id || 0;
        let desk_id = params.desk_id || 0;
        let desk_mode = params.desk_mode || qf.const.DESK_MODE_NORMAL;
        let entry_type = params.entry_type || 0;
        let start_type = params.start_type || qf.const.GAME_START_TYPE.NORMAL;
        let show_multi = params.show_multi || 0;
        let just_view = params.just_view || 0;
        let new_desk = params.new_desk || 0;
        let is_match = params.is_match || 0;

        if (room_id === qf.cache.config.friend_room_id ||
            room_id === qf.cache.config.friend_room_id_no_shuffle) {
            desk_mode = qf.const.DESK_MODE_FRIEND;
        } else if (Math.floor(Number(room_id) / 10000) === 2) {
            desk_mode = qf.const.DESK_MODE_EVENT;
        } else if (Math.floor(Number(room_id) / 10000) === 3) {
            desk_mode = qf.const.DESK_MODE_ENDGAME;
        }

        let body = {
            room_id: room_id,
            desk_id: desk_id,
            entry_type: entry_type,
            start_type: start_type,
            just_view: just_view,
            desk_mode: desk_mode,
            new_desk: new_desk,
            show_multi: show_multi,
            is_match: is_match,
        };
        qf.event.dispatchEvent(qf.ekey.NET_INPUT_REQ, { body: body });
    },
});