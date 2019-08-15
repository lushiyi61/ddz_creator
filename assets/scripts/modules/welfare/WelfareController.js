let Controller = require("../../frameworks/mvc/Controller");

const WELFARE_FLAG = {
    CANTRECEIVE: 0,
    CANRECEIVE: 1
};

cc.Class({
    extends: Controller,

    //override
    initGlobalEvent() {
        this.addGlobalEvent(qf.ekey.SHOW_WELFARE_DIALOG, this.onShowWelfareDialog, this);
        // 打开窗口后拉取数据
        this.addGlobalEvent(qf.ekey.GET_WELFARE_VIEW_DATA, this.getWelfareViewData, this);
        // 请求任务列表数据
        this.addGlobalEvent(qf.ekey.GET_TASK_DATA_REQ, this.getTaskInfoReq, this);

        this.addGlobalEvent(qf.ekey.RECEIVE_GIFT_REQ, this.sendReceiveGiftReq, this);

        // 请求登录礼包数据
        this.addGlobalEvent(qf.ekey.GET_WELFARE_DATA_REQ, this.onReqWelfareData, this);

        //领取任务奖励
        this.addGlobalEvent(qf.ekey.PICK_TASK_REWARD, this.pickTaskReward, this);

        // 请求连胜数据
        this.addGlobalEvent(qf.ekey.GET_WINSTREAK_DATA_REQ, this.onReqWinstreakData, this);

        //连胜任务查询请求
        this.addGlobalEvent(qf.ekey.WIN_STREAK_TASK_QUERY_REQ, this.winStreakTaskQueryReq, this);

        //打开连胜奖励红包弹窗
        this.addGlobalEvent(qf.ekey.SHOW_WINSTREAK_REWARD_DIALOG, this.showWinStreakRedpacketDia, this);

        //连胜详细弹窗请求
        this.addGlobalEvent(qf.ekey.WIN_STREAK_DETAIL_REQ, this.winStreakDetailReq, this);

        //领取任务奖励
        this.addGlobalEvent(qf.ekey.WIN_STREAK_TASK_PICK_REQ, this.winStreakTaskPickReq, this);

        //显示幸运奖励弹框
        this.addGlobalEvent(qf.ekey.ADD_LUCKY_REWARD_DIALOG, this.showLuckyRewardDialog, this);
    },

    getWelfareViewData() {
        // 有未领取的奖励，请求登录礼包，否则请求任务
        let b_pick = qf.cache.welfare.daily_picked;
        let gift_info = qf.cache.config.gift;
        if (b_pick || gift_info.flag === WELFARE_FLAG.CANTRECEIVE) {
            this.onReqWinstreakData(true);
        } else {
            this.onReqWelfareData();
        }
    },

    onShowWelfareDialog() {
        qf.rm.checkLoad("welfare", () => {
            this.id_welfare = qf.dm.push({
                prefab: qf.res.prefab_welfare,
                script: 'WelfareView',
            });
            qf.dm.pop();

            qf.cache.welfare.showed = true;
        });
    },

    //发送获取福利信息请求
    onReqWelfareData() {
        qf.net.send({
            cmd: qf.cmd.DDZ_FRESH_MAN_GIFT_REQ,
            wait: true,
            body: {},
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        qf.cache.welfare.updateWelfareInfo(model);

                        let data = {
                            giftInfo: qf.cache.welfare.getGiftInfo(),
                            giftConfig: qf.cache.welfare.getGiftConfig(),
                            type: 0
                        };

                        let handler = qf.dm.getDialog(this.id_welfare);
                        handler && handler.setData(data);
                    }
                });
            }
        });
    },

    //请求连胜数据
    onReqWinstreakData(firstOpen) {
        qf.net.send({
            cmd: qf.cmd.DDZ_WIN_STREAK_TASK_REQ,
            wait: true,
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        if (!model) return;

                        let setViewData = () => {
                            let data = {
                                winStreakInfo: qf.cache.welfare.getWinStreakDetailInfo(),
                                type: 1
                            };

                            let handler = qf.dm.getDialog(this.id_welfare);
                            handler && handler.setData(data);
                        }

                        if (firstOpen) {
                            if (model.can_done_times) {
                                qf.cache.welfare.updateWinStreakInfo(model);
                                setViewData();
                                return;
                            }

                            let ws_info = model.ws_info;
                            for (let k in ws_info) {
                                let v = ws_info[k];
                                if (v.can_pick_times > 0) {
                                    qf.cache.welfare.updateWinStreakInfo(model);
                                    setViewData();
                                    return;
                                }
                            }

                            this.getTaskInfoReq();
                        } else {
                            qf.cache.welfare.updateWinStreakInfo(model);
                            setViewData();
                        }
                    }
                });
            }
        });
    },

    //发送领取福利请求
    sendReceiveGiftReq(args) {
        let body = {};
        let sendReq = (isShare) => {
            qf.net.send({
                cmd: qf.cmd.DDZ_RECEIVE_GIFT_REQ,
                wait: true,
                body: body,
                callback: (rsp) => {
                    qf.net.util.rspHandler(rsp, {
                        successCb: (model) => {
                            let handler = qf.dm.getDialog(this.id_welfare);

                            let isGold = (model && model.gold_num && model.gold_num > 0) ? true : false;
                            let diamond_num = (model && model.diamond_num) ? model.diamond_num : 0;
                            let num = isGold ? model.gold_num : diamond_num;
                            let rewardType = isGold ? qf.const.rewardType.COIN : qf.const.rewardType.DIAMOND;
                            let data = {
                                rewardNum: num,
                                isShare: isShare,
                                type: rewardType,
                            };
                            handler && handler.welfareSuccessRsp(data);

                            qf.cache.welfare.daily_picked = true;

                            if (isShare) {
                                let giftType = qf.cache.welfare.gift.gift_type;
                                qf.event.dispatchEvent(qf.ekey.SHOW_REWARD_DIALOG, {
                                    rewardNum: num / 2,
                                    day: giftType,
                                    double_reward: true,
                                    type: rewardType
                                });
                            }
                            //关闭小红点
                            qf.event.dispatchEvent(qf.ekey.HIDE_WELFARE_RED_DOT);
                        }
                    });
                }
            });
        }

        // 普通领取
        if (args.type === 0) {
            body = {
                is_share: 0
            };
            sendReq(false);
        } else {
            body = {
                is_share: 1
            };

            let sharetype = qf.const.LaunchOptions.TYPE_WELFARE_SHARE;
            let title = qf.txt.stringShareTitle; //默认标题
            let imgUrl = qf.res.share_banner_normal_game; //默认图片
            let id = -1;
            let cur_time;

            qf.net.send({
                cmd: qf.cmd.GET_SHARE_INFO_REQ,
                body: {
                    share_type_str: qf.const.SHARE_STRING_KEY.FRESH_GIFT_SHARE_460
                },
                callback: (rsp) => {
                    qf.net.util.rspHandler(rsp, {
                        successCb: (mode) => {
                            if (!mode) return;

                            let shareInfo = mode.share_info;
                            if (shareInfo && shareInfo.icon && shareInfo.share_id) {
                                imgUrl = shareInfo.icon;
                                title = shareInfo.str;
                                id = shareInfo.share_id;
                                cur_time = mode.cur_time;
                            }

                            //数据上报
                            qf.platform.uploadEventStat({
                                "module": "share",
                                "event": qf.rkey.PYWXDDZ_EVENT_SHARE_CLICK_SHARE_BTN,
                                "custom": {
                                    scene: qf.const.ShareScene.MAIN,
                                    via: qf.const.ShareMsgType.REWARDLOGINAWARDSHARE,
                                    img_id: id
                                }
                            });

                            let shareSuccess = () => {
                                qf.platform.uploadEventStat({
                                    "module": "share",
                                    "event": qf.rkey.PYWXDDZ_EVENT_SHARE_SUCCESS,
                                    "custom": {
                                        scene: qf.const.ShareScene.MAIN,
                                        via: qf.const.ShareMsgType.REWARDLOGINAWARDSHARE,
                                        img_id: id,
                                    }
                                });
                            }

                            qf.platform.shareMessage({
                                imageUrl: imgUrl,
                                title: title,
                                shareId: id,
                                query: "type=" + sharetype + "&fromUin=" + qf.cache.user.uin + "&curTime=" + cur_time,
                                scb: (res) => {
                                    shareSuccess();
                                    sendReq(true);
                                }
                            });
                        }
                    });
                }
            });
        }
    },

    getTaskInfoReq(cb) {
        qf.net.send({
            cmd: qf.cmd.DDZ_TASK_INFO_REQ,
            wait: true,
            body: {},
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        qf.cache.welfare.updateTaskInfo(model);

                        let data = {
                            taskInfo: qf.cache.welfare.getTaskInfo(),
                            type: 2
                        };

                        let handler = qf.dm.getDialog(this.id_welfare);
                        handler && handler.setData(data);

                        if (cb) cb();
                    }
                });
            }
        });
    },

    //领取任务奖励
    pickTaskReward(data) {
        // 区分每日任务 幸运任务
        if (data.type === 1 || data.type === 2 || data.type === 3) { //每日
            this.pickReward(data);
        } else {

        }
    },

    pickReward(data) {
        qf.net.send({
            cmd: qf.cmd.DDZ_PICK_TASK_REWARD_REQ,
            wait: true,
            body: {
                id: data.id
            },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        // 更新缓存数据
                        qf.cache.welfare.updateTaskInfoByPickReward(data.id);

                        let taskInfo = qf.cache.welfare.getTaskInfo();
                        let handler = qf.dm.getDialog(this.id_welfare);
                        handler && (handler.setTaskData({
                            taskInfo: taskInfo
                        }));

                        //恭喜获得
                        if (data.task_reward && data.task_reward.amount) {
                            let type = 0;
                            let reward_type = data.task_reward.reward_type;
                            if (reward_type === 1) {
                                type = qf.const.rewardType.COIN;
                            } else if (reward_type === 3) {
                                type = qf.const.rewardType.CARDCOUNTER;
                            }
                            qf.event.dispatchEvent(qf.ekey.SHOW_REWARD_DIALOG, {
                                type: type,
                                rewardNum: data.task_reward.amount
                            });
                        }
                    }
                });
            }
        });
    },

    //连胜任务查询请求
    winStreakTaskQueryReq(args) {
        if (!args) return;

        let wsStreak = args.wsStreak;

        qf.net.send({
            cmd: qf.cmd.DDZ_WIN_STREAK_TASK_QUERY_REQ,
            wait: true,
            body: {
                ws_streak: wsStreak
            },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        if (!model) return;

                        qf.cache.welfare.updateWinStreakRewardInfo(model.ws_pick_info);

                        if (qf.cache.desk_mode) {
                            qf.cache.desk.updateWinStreakRewardInfo(model.ws_pick_info);
                        }

                        qf.event.dispatchEvent(qf.ekey.SHOW_WINSTREAK_REWARD_DIALOG);
                    }
                });
            }
        });
    },

    //查看连胜任务详情请求
    winStreakDetailReq() {
        qf.net.send({
            cmd: qf.cmd.DDZ_WIN_STREAK_TASK_REQ,
            wait: true,
            body: {},
            callback: (rsp)=>{
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        if (!model) return;

                        if (qf.cache.desk_mode) {
                            qf.cache.desk.updateWinStreakDetailInfo(model);
                        }

                        this.showWinStreakDetailDialog();
                    }
                });
            }
        });
    },

    //打开连胜弹窗
    showWinStreakDetailDialog() {
        qf.rm.checkLoad("winStreakDetail", () => {
            this.id_winStreakDetail_dia = qf.dm.push({
                prefab: qf.res.prefab_winstreak_detail,
                script: 'WinStreakDetailDialog',
                action_type: 1,
                loadded_data: true
            });
            qf.dm.pop();
        });
    },

    showWinStreakRedpacketDia() {
        qf.rm.checkLoad("winStreakReward", () => {
            this.id_winStreakReward_dia = qf.dm.push({
                prefab: qf.res.prefab_winstreak_reward,
                script: 'WinStreakRewardDialog',
                action_type: 1,
                loadded_data: true
            });
            qf.dm.pop();
        });
    },

    //领取任务奖励
    winStreakTaskPickReq(args) {
        let wsStreak = args.wsStreak;
        qf.net.send({
            cmd: qf.cmd.DDZ_WIN_STREAK_TASK_PICK_REQ,
            wait: true,
            body: {
                ws_streak: wsStreak
            },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        if (!model) return;

                        if (args.cb) args.cb(model.task_reward.amount);

                        qf.event.dispatchEvent(qf.ekey.UPDATE_WIN_STREAKINFO, {
                            ws_desk_info: model.ws_desk_info
                        });
                    }
                });
            }
        });
    },

    // 显示幸运任务框
    showLuckyRewardDialog(params) {
        let luckyData = params.lucky_data;

        if (luckyData && luckyData.tid) {
            let args = {};
            args.luckyData = luckyData;
            args.taskBtnType = (luckyData.pick_type === 1) ? 0 : 1;

            args.rewardNum = luckyData.awards[0].amount;
            args.taskId = luckyData.tid;

            if (luckyData.awards[0].reward_type === 2) { //红包
                qf.event.dispatchEvent(qf.ekey.SHOW_TASK_REDPACKET_REWARD_DIALOG, args);
            } else {
                let type = 0;
                let reward_type = luckyData.awards[0].reward_type;
                if (reward_type === 1) {
                    type = qf.const.rewardType.COIN;
                } else if (reward_type === 3) {
                    type = qf.const.rewardType.CARDCOUNTER;
                }
                args.type = type;
                qf.event.dispatchEvent(qf.ekey.SHOW_TASK_REWARD_DIALOG, args);
            }
        }
    },

});