/*
福利
*/

let Model = require("../frameworks/mvc/Model");

cc.Class({
    extends: Model,

    properties: {
        _daily_picked: false,
        daily_picked: {
            get() {
                return this._daily_picked;
            },
            set(b) {
                this._daily_picked = b;
            }
        },

        _showed: false,
        showed: {
            get() {
                return this._showed;
            },
            set(b) {
                this._showed = b;
            }
        },
    },

    updateWelfareInfo(giftInfo) {
        let self = this;

        self.giftInfo = {};
        let filename = [
            "flag", //是否可领 0 表示不可领 1表示可领
            "gift_type", //领取的福利类型 1----7 对应不同的金币数量
        ];
        self.copyFiled(giftInfo, self.giftInfo, filename);

        //礼物配置
        self.updateWelfareConfig(giftInfo.gift_config);

        //分享信息
        self.giftInfo.share_info = [];
        for (let j in giftInfo.share_info) {
            let v = giftInfo.share_info[j];
            self.giftInfo.share_info[j] = v;
        }
    },

    //更新礼物配置
    updateWelfareConfig(giftConfigModel) {
        let self = this;

        let filename = ["days", "gold_num"];

        self.giftConfig = {};

        for (let k in giftConfigModel) {
            let v = giftConfigModel[k];
            self.giftConfig[v.days] = v;
        }

        // self.notifyObservers(ET.UPDATE_WELFARE_INFO, {giftInfo: self.giftInfo, giftConfig: self.giftConfig});
    },

    copyFiled(src, dest, filed) {
        let self = this;
        for (let k in filed) {
            let v = filed[k];
            dest[v] = src[v];
        }
    },

    getGiftInfo() {
        let self = this;

        return self.giftInfo;
    },

    getGiftConfig() {
        let self = this;

        return self.giftConfig;
    },

    updateTaskInfo(model) {
        let self = this;

        if (!model || !model.task_info) return;

        self.taskInfo = [];

        for (let k in model.task_info) {
            let v = model.task_info[k];
            self.taskInfo[k] = v;
        }
    },

    updateWinStreakInfo(model) {
        let self = this;

        if (!model) return;
        let wsInfo = model.ws_info;

        self.winStreakDetailInfo = [];
        self.can_done_times = model.can_done_times; //连胜剩余完成次数

        let filename = [
            "ws_streak",
            "name",
            "status",
            "can_pick_times"
        ];

        for (let i in wsInfo) {
            let data = wsInfo[i];
            let info = {};
            for (let k in filename) {
                let v = filename[k];
                info[v] = data[v];
            }
            self.winStreakDetailInfo.push(info);
        }
    },

    getWinStreakDetailInfo() {
        let self = this;
        return self.winStreakDetailInfo;
    },

    getCanDoneTimes() {
        let self = this;

        return self.can_done_times;
    },

    //只有完成连胜任务时有该字段
    updateWinStreakRewardInfo(model) {
        let self = this;

        self.winStreakRewardInfo = {};
        let filename = [
            "ws_streak", //连胜 领取奖励时候回传
            "ws_name", //连胜任务名称 完成任务有该字段
            "need_diamond", //需要钻石
            "user_diamond", //用户拥有钻石
        ];
        self.copyFiled(model, self.winStreakRewardInfo, filename);
    },

    getWinStreakRewardInfo() {
        let self = this;

        return self.winStreakRewardInfo;
    },

    //领取返回时更新缓存
    updateTaskInfoByPickReward(id) {
        let self = this;

        let tempData = null;
        for (let k in self.taskInfo) {
            let v = self.taskInfo[k];
            if (v.id === id) {
                tempData = clone(v);
                self.taskInfo.splice(k, 1);
            }
        }

        if (tempData) {
            tempData.status = 2;
            self.taskInfo.push(tempData);
        }
    },

    getTaskInfo() {
        let self = this;

        return self.taskInfo;
    },

});