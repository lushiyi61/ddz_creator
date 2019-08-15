/*
赛事牌桌缓存
*/

let NormalDesk = require("./NormalDesk");

cc.Class({
    extends: NormalDesk,

    ctor() {
        //最后一幅牌是否自动打出 1：是  0: 否
        this.server_replaced = qf.const.LordPokerAutoLastOper.NOTAUTO;
    },

    //由于查询牌桌走统一流程，此处需定义斗地主查询牌桌命令字
    initCMD() {
        var self = this;
        self._super();
        self.cmd_list.exitDeskCmd = qf.cmd.DDZ_EVENT_EXIT_DESK_REQ;
        self.cmd_list.userCallCmd = qf.cmd.DDZ_EVENT_USER_CALL_REQ;
        self.cmd_list.autoPlayCmd = qf.cmd.DDZ_EVENT_AUTO_PLAY_REQ;
        self.cmd_list.discardCmd = qf.cmd.DDZ_EVENT_DISCARD_REQ;
        self.cmd_list.userMutiCmd = qf.cmd.DDZ_EVENT_USER_MUTI_REQ;
        self.cmd_list.queryDeskCmd = qf.cmd.DDZ_EVENT_QUERY_DESK_REQ;

        self.cmd_list.opTimeOutCmd = qf.cmd.DDZ_EVENT_OP_TIME_OUT_REQ;
        self.cmd_list.deskMultiCmd = qf.cmd.DDZ_EVENT_DESK_MULTI_REQ;
        self.cmd_list.roundDetailCmd = qf.cmd.DDZ_ROUND_DETAIL_REQ;
        self.cmd_list.userChangeDeskCmd = qf.cmd.EVENT_USER_CHANGE_DESK_REQ;
    },

    //override
    updateCacheByJoinGame(model) {
        var self = this;
        self._super(model);
        var f1 = ["predict_time", // 预计匹配时间
            "matching_time", // 已匹配时间
            "matching_timeout", // 匹配超时时间
            "is_final_round", // 是不是决胜局，True 是，False 不是
        ];
        self.copyFiled(model, self, f1);
    },

    //override 更新玩家信息 统一接口
    updateUserInfo(userinfo) {
        var self = this;
        if (!userinfo) return;
        self._super(userinfo);
        //更新牌桌玩家的字段
        for (var i in userinfo) {
            var uData = userinfo[i];
            var u = self._allUserList[uData.uin];
            u.match_level = uData.match_level; // DDZ赛事段位 从青铜一阶到最强王者段位===>10~140 以10的跨度
            u.dan_grading = uData.dan_grading; // DDZ具体赛事段位范围 10:青铜 20:白银 30:黄金 40:钻石 50:宗师 60:最强王者
            u.star_number = uData.star_number; // 星星个数   -1: 表示没有星星
        }
    },

    //override 打牌
    updateCacheByPlay(model) {
        var self = this;
        self._super(model);
        self.server_replaced = model.server_replaced;
    },

    //override
    updateCacheByResult(model) {
        var self = this;
        self._super(model);
        var f1 = [
            "old_level", // 参赛前的段位   10~140对应青铜1到最强王者 以10为跨度
            "old_dan_grading", // DDZ具体赛事段位范围 10:青铜 20:白银 30:黄金 40:钻石 50:宗师 60:最强王者
            "old_star_number", // 星星个数   -1: 表示没有星星
            "cur_level", // 参赛后的段位(真实段位)
            "cur_dan_grading", // DDZ具体赛事段位范围 10:青铜 20:白银 30:黄金 40:钻石 50:宗师 60:最强王者
            "cur_star_number", // 星星个数   -1: 表示没有星星
            "next_award_type", // 下一段位的奖励 0:无 1.金币 2.奖券 3.记牌器 4.等级卡
            "next_award_count", // 下一段位的奖励数量
            "go_flaunt", // DDZ赛事是否去炫耀 0:不去炫耀 1:去炫耀
            "stay_time", // DDZ赛事默认停留结算页面时间
            "promotion_guide_share", // 晋级引导炫耀好友群
            "last_diamond", //身上剩余的钻石
            "open_gold_box_diamond", //打开金币宝箱需要的钻石
            "gold_box_range", //金币宝箱奖励区间
        ];
        self.copyFiled(model, self.resultInfo, f1);
        self.updateResultRoundDeatils(model.round_details);
    },

    //保级成功后更新数据
    updateSaveLeval(model) {
        var self = this;
        if (!model) return;
        if (!self.resultInfo) return;
        self.resultInfo.is_winner = qf.const.RESULT_WIN_OR_LOSE_FLAG.SAVE;
        self.resultInfo.old_level = self.resultInfo.cur_level;
        self.resultInfo.old_dan_grading = self.resultInfo.cur_dan_grading;
        self.resultInfo.old_star_number = self.resultInfo.cur_star_number;
        self.resultInfo.cur_level = model.cur_level;
        self.resultInfo.cur_dan_grading = model.cur_dan_grading;
        self.resultInfo.cur_star_number = model.cur_star_number;
        self.resultInfo.next_award_type = model.next_award_type;
        self.resultInfo.next_award_count = model.next_award_count;
        //self.updateResultShareInfo();
        if (self.resultShareInfo) {
            self.resultShareInfo.share_type = qf.const.SHARE_RESULT_TYPE.NONE;
            self.resultShareInfo.hand_id = null;
        }
    },

    updateResultRoundDeatils(roundDetails) {
        var self = this;
        if (!roundDetails) return;
        self.resultInfo.roundDetails = [];
        for (var k in roundDetails) {
            var roundDetail = roundDetails[k];
            var f1 = [
                "uin",
                "nick",
                "award_type", // 当前奖励类型 0:奖券 1:金币 2:无
                "award_count", // 奖励数量
                "is_final_round", // 是否是决胜局
            ];

            var data = {};
            data.detailInfos = [];
            self.copyFiled(roundDetail, data, f1);
            self.resultInfo.roundDetails.push(data);

            for (var j in roundDetail.detail_infos) {
                var detailInfo = roundDetail.detail_infos[j];
                var f2 = [
                    "round_index", //副牌索引。总计数据index=-1
                    "score", //副牌得分， 或者总得分
                    "cost_time" //副牌耗时 ，或者总耗时
                ];
                var detailData = {};
                self.copyFiled(detailInfo, detailData, f2);
                data.detailInfos.push(detailData);
            }
        }
    },

    //override 更新定制信息
    updateCmData(model) {
        var self = this;
        if (!model) return;
        self._super(model);

        self.cm_data.base_score = model.base_score;
    },

    //是不是决胜局
    getIsFinalRound() {
        var self = this;
        return self.is_final_round;
    },

    //获取预计匹配时间
    getPredictTime() {
        var self = this;
        return self.predict_time;
    },

    //获取已匹配时间
    getMatchingTime() {
        var self = this;
        return self.matching_time;
    },

    //获取匹配超时时间
    getMatchingTimeOut() {
        var self = this;
        return self.matching_timeout;
    },

    //获取最后一幅牌是否自动打出
    getIsLastCardsAuto() {
        var self = this;
        return self.server_replaced;
    },

    //获取牌桌底分
    getBaseScore() {
        var self = this;
        return self.cm_data.base_score;
    },

    getLordFirstHandle() {
        return false;
    }
});