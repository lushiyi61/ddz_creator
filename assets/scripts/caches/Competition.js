/*赛事大厅*/
let Model = require("../frameworks/mvc/Model");

cc.Class({
    extends: Model,

    ctor() {
        this.competitionInfo = {};
    },

    updateCompetitionData(model) {
        this.competitionInfo = {};
        this.competitionInfo.season_award = [];
        this.competitionInfo.session_info = [];
        this.competitionInfo.settle_info = [];
        let filename = [
            "match_level",              // 用户段位
            "dan_grading",              // DDZ具体赛事段位范围 10:青铜 20:白银 30:黄金 40:钻石 50:宗师 60:最强王者
            "star_number",              // 星星个数   -1: 表示没有星星
            "current_level_award",      // 当前退赛可得奖券
            "next_level_award",         // 下级可得奖券
            "guide_status",             // 新手引导状态 0未参与赛事引导 1有参与赛事引导
            "star_max_number",          // 当前段位星星个数上限
            "season_sn",                // 第几赛季
            "season_date_range",        // 赛季日期范围
            "sub_level",                // 小段位
            "match_regulations_path",   // 赛季规则图片路径
            "need_exchange_coupon",     //是否需要兑换用户的老段位和老等级卡
        ];
        qf.utils.copyFiled(filename, this.competitionInfo, model);

        //赛季奖励
        for(var k in model.season_award){
            var v = model.season_award[k];
            this.competitionInfo.season_award[k] = v;
        }

        //赛季信息
        for(var k in model.session_info){
            var v = model.session_info[k];
            this.competitionInfo.session_info[k] = v;
        }

        //赛季结算
        this.setSettleInfo(model.settle_info);

        loge("赛事大厅数据")
        cc.log(this.competitionInfo)

        this.emit(qf.ekey.UPDATE_COMPETITION_INFO, { competitionInfo: this.competitionInfo });
    },

    setSettleInfo:function (data) {
        loge("赛季结算数据")
        cc.log(data)
        // data = {};
        // data.season_sn = 6
        // data.season_award = {
        //     0:{award_type:1,award_num:2,icon_frame_path:null},
        //     1:{award_type:1,award_num:5,icon_frame_path:null},
        // };
        // data.all_lv_info = {
        //     match_lv:40,
        //     sub_lv:2,
        //     star:5,
        //     sub_lv_star_num:5
        // };

        if(!data) {
            this.competitionInfo.settle_info = null;
            return;
        }

        this.competitionInfo.settle_info.season_sn = data.season_sn;
        this.competitionInfo.settle_info.season_award = [];
        this.competitionInfo.settle_info.all_lv_info = [];

        for (var i in data.season_award) {
            var award = data.season_award[i];
            var info = {}
            for (var k in award) {
                var v = award[k];
                info[k] = v;
            }
            this.competitionInfo.settle_info.season_award.push(info);
        }

        for(var k in data.all_lv_info){
            var v = data.all_lv_info[k];
            this.competitionInfo.settle_info.all_lv_info[k] = v;
        }
    },

    getSettleInfo:function () {
        var self = this;

        return self.competitionInfo.settle_info;
    },


    getCompetitionData() {
        return this.competitionInfo;
    },

    updateExitCompetitionInfo(model) {
        this.exitCompetitionInfo = {};
        let filedname = [
            "awards", // 奖励信息
        ];

        for (let k in filedname) {
            let v = filedname[k];
            this.exitCompetitionInfo[v] = model[v];
        }

        this.emit(qf.ekey.UPDATE_EXIT_COMPETITION_INFO, { exitCompetitionInfo: this.exitCompetitionInfo });
    },

    getExitCompetitionInfo() {
        return this.exitCompetitionInfo;
    },

    updateMatchLevelInfo(model) {
        this.competitionInfo.match_level = model.match_level; // DDZ赛事段位信息 从青铜一阶到最强王者段位===>10~140 以10的跨度
        this.competitionInfo.dan_grading = model.dan_grading; // DDZ具体赛事段位范围 10:青铜 20:白银 30:黄金 40:钻石 50:宗师 60:最强王者
        this.competitionInfo.star_number = model.star_number; // 星星个数  -1: 表示没有星星
    },

    getMatchLevel() {
        return this.competitionInfo.match_level;
    },

    //otherView  CompetitionView不存在时开始赛事
    updateHighLevelMatchInfo(model, check, otherView) {
        this.highLevelMatchInfo = {};
        let filename = [
            "high_level_desc", // 高段位高峰期开放描述
            "can_join", // 是否可以进入
        ];
        qf.utils.copyFiled(filename, this.highLevelMatchInfo, model);

        // let et = otherView ? qf.ekey.UPDATE_HIGH_LEVEL_FROM_OTHER_VIEW : qf.ekey.UPDATE_HIGH_LEVEL_MATCH_INFO;
        //
        // this.emit(et, { highLevelMatchInfo: this.highLevelMatchInfo, check: check });
    },

    getHighLevelMatchInfo() {
        return this.highLevelMatchInfo;
    },
});