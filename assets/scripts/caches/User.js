/*
用户缓存
*/
let Model = require("../frameworks/mvc/Model");

cc.Class({
    extends: Model,

    properties: {
        "GOLD_CHANGE": "gold_change", //金币变更
        "DIAMOND_CHANGE": "diamond_change", //钻石变更
        "TICKET_CHANGE": "ticket_change", //奖券变更
    },

    ctor() {
        this.uin = 0;
        this.gold = 0;
        this.diamond_amount = 0;
        this.sex = 1;
        this.lottery_ticket = 0;
        this.portrait = "";
        this.endgame_level = 0;
        this.match_guide_info = {};
        this.userLoginInfo = {};
    },

    updateUserInfo(model) {
        let filed = [
            "nick",                     //昵称
            "gold",                     //金币
            "diamond_amount",           //钻石
            "win",                      //获胜次数
            "lose",                     //失败次数
            "title",
            "sex",                      //性别
            "portrait",                 //头像url
            "play_level",               //等级
            "is_friend",                //是否好友
            "play_times",               //玩牌次数
            "win_prob",                 //胜率
            "view_times",               //旁观次数
            "win_times_streak",         //历史最高连胜
            "win_times_spring",         //春天次数
            "max_history_multi_num",    //历史最大倍数
            "career_win_score",         //生涯累计得分
            "career_bomb_times",        //生涯炸弹
            "career_win_gold",          //生涯累计输赢金币
            "uin",                      //玩家uin
            "match_level",              //赛事段位
            "lottery_ticket",           //奖券
        ];
        qf.utils.copyFiled(filed, this, model);
    },

    //更新赛事等级
    updateMatchLevel(match_level) {
        this.match_level = match_level;
    },

    //更新金币
    updateGold(gold) {
        this.gold = gold;

        this.emit(this.GOLD_CHANGE, {gold: this.gold});
    },

    //更新钻石
    updateDiamond(diamond_amount) {
        this.diamond_amount = diamond_amount;

        this.emit(this.DIAMOND_CHANGE, {diamond: this.diamond});
    },

    //更新奖劵
    updateTicket(lottery_ticket) {
        this.lottery_ticket = lottery_ticket;

        this.emit(this.TICKET_CHANGE, {ticket: this.lottery_ticket});
    },

    //更新玩家头像
    updatePortrait(portrait) {
        this.portrait = portrait;
    },

    //更新残局通过关卡
    updateEndgame_level(endgame_level) {
        this.endgame_level = endgame_level;
    },

    updateMatchGuideInfo(match_guide_info) {
        let filedname = [
            "status",          //赛事引导状态 0未引导 1已引导
            "exit_match_rewards",          //退赛能获得的奖券
            "continue_name",          //继续挑战获得的称号
            "common_rewards_diamond"        //全员奖励钻石量
        ];

        qf.utils.copyFiled(filedname, this.match_guide_info, match_guide_info);
    },

    updateUserLoginInfo(model) {
        let filedName = [
            "open_id",                  //open_id
            "old_roomid",               //断线重连room_id
            "room_type",                //断线重连room_type
            "desk_id",                  //当前牌桌
            "blocked",                  //是否被封号
            "is_register",              //是否本次注册
            "unread_msg_num",           //未读邮件数
            "in_game",                  //当前是否在打牌
            "is_arraigned",             //是否为提审版本
            "free_times_pop",           //弹窗周期
            "reject_times_pop",         //拒绝后弹窗时间
            "wx_subscribe_gift_max",    //公众号关注有礼最高领取金币值
            "ban_info",                 //被封号文案
            "red_packet_switch",        //红包开关
            "diamond_activity_switch",  //钻石活动开关
            "new_endgame_notify",       //新残局提醒
            "task_need_notify",         //任务系统是否需要提示
        ]

        qf.utils.copyFiled(filedName, this.userLoginInfo, model);
    },
});