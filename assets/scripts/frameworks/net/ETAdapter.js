
cc.Class({
    properties: {
        _etable: {
            default: {}
        }
    },

    ctor() {
        let self = this;
        /*这里需要绑定 服务器消息uid与其相应的res事件id
        若有一对多的情况
        例如 self._etable[qf.cmd.INPUT_GAME_EVT] = [qf.ekey.A, qf.ekey.B]*/

        //绑定通用的命令字与事件
        self.bindCommonCmdEvent();

        //绑定经典场、好友房命令字与事件
        self.bindNormalCmdEvent();

        //绑定赛事命令字与事件
        self.bindEventCmdEvent();
    },

    bindCommonCmdEvent() {
        let self = this;

        self._etable[qf.cmd.CMD_INTERACT_PHIZ_NTF] = qf.ekey.INTERACT_PHIZ_NTF;

        self._etable[qf.cmd.BROADCAST_OTHER_EVT] = qf.ekey.NET_BROADCAST_OTHER_EVT;
        self._etable[qf.cmd.UPDATA_GOLD_EVT] = qf.ekey.NET_UPDATA_GOLD_EVT;

        self._etable[qf.cmd.CMD_PYQ_USER_REG] = qf.ekey.PYQ_USER_REG;   //牌友圈用户注册

    },

    bindNormalCmdEvent() {
        let self = this;

        //进桌通知
        self._etable[qf.cmd.LORD_ENTER_DESK_NOTIFY] = qf.ekey.LORD_NET_ENTER_DESK_NOTIFY;

        //退桌通知
        self._etable[qf.cmd.LORD_EXIT_DESK_NOTIFY] = qf.ekey.LORD_NET_EXIT_DESK_NOTIFY;

        //结算通知
        self._etable[qf.cmd.LORD_RESULT_NOTIFY] = qf.ekey.LORD_NET_RESULT_NOTIFY;

        //抢地主通知
        self._etable[qf.cmd.LORD_CALL_NOTIFY] = qf.ekey.LORD_NET_CALL_POINT_NOTIFY;

        //游戏开始通知
        self._etable[qf.cmd.LORD_START_NOTIFY] = qf.ekey.LORD_NET_START_GAME_NOTIFY;

        //打牌通知
        self._etable[qf.cmd.LORD_DISCARD_NOTIFY] = qf.ekey.LORD_NET_DISCARD_NOTIFY;

        //托管通知
        self._etable[qf.cmd.LORD_AUTO_PLAY_NOTIFY] = qf.ekey.LORD_NET_AUTO_PLAY_NOTIFY;

        //加倍通知
        self._etable[qf.cmd.LORD_MUTI_NOTIFY] = qf.ekey.LORD_NET_MUTI_NOTIFY;

        //cmd: 6527 破产保护弹窗
        self._etable[qf.cmd.DDZ_PROTECT_NOTIFY] = qf.ekey.DDZ_PROTECT_NOTIFY;

        //cmd:6529 玩家准备通知
        self._etable[qf.cmd.DDZ_USER_READY_NOTIFY] = qf.ekey.NET_USER_READY_NOTIFY;

        //cmd:6531 明牌通知
        self._etable[qf.cmd.DDZ_SHOW_CARD_NTF] = qf.ekey.DDZ_SHOW_CARD_NOTIFY;

        //cmd:6530 发牌过程中明牌请求
        self._etable[qf.cmd.DDZ_SHOW_CARD_REQ] = qf.ekey.DDZ_SHOW_CARD_REQ;

        //cmd: 6533 牌桌倍数变化通知
        self._etable[qf.cmd.DDZ_DESK_MULTI_NOTIFY] = qf.ekey.DDZ_DESK_MULTI_NOTIFY;

        //cmd 6539 牌桌当前操作者通知---暂用于发牌阶段结束通知抢地主
        self._etable[qf.cmd.DDZ_OPUSER_NOTIFY] = qf.ekey.DDZ_OPUSER_NOTIFY;

        //cmd 6536 站起通知
        self._etable[qf.cmd.DDZ_USER_STAND_NOTIFY] = qf.ekey.NET_USER_STAND_NOTIFY;
        //cmd 6538 坐下通知
        self._etable[qf.cmd.DDZ_USER_SITDOWN_NOTIF] = qf.ekey.NET_USER_SITDOWN_NOTIFY;
        //cmd: 190 单独通知用户金币变化
        self._etable[qf.cmd.DDZ_GOLD_CHANGE_NOTIFY] = qf.ekey.DDZ_GOLD_CHANGE_NOTIFY;
        //cmd: 193 单独通知用户钻石变化
        self._etable[qf.cmd.DDZ_DIAMOND_CHANGE_NOTIFY] = qf.ekey.DDZ_DIAMOND_CHANGE_NOTIFY;
        //cmd:7551 单独通知用户奖券变化
        self._etable[qf.cmd.DDZ_LOTTERYTICKET_CHANGE_NOTIFY] = qf.ekey.DDZ_LOTTERYTICKET_CHANGE_NOTIFY;
        //cmd:7555 单独通知用户段位变化
        self._etable[qf.cmd.DDZ_LEVEL_CHANGE_NOTIFY] = qf.ekey.DDZ_LEVEL_CHANGE_NOTIFY;
        //cmd: 149 通知购买商城物品成功了
        self._etable[qf.cmd.DDZ_BUY_SUCCESS_NOTIFY] = qf.ekey.DDZ_BUY_SUCCESS_NOTIFY;

        //cmd: 146 聊天通知
        self._etable[qf.cmd.DDZ_GAME_CHAT_NOTIFY] = qf.ekey.NET_GAME_CHAT_NOTIFY;

        //cmd: 6551 用户未读消息的数量(目前只在登录时候推送)
        self._etable[qf.cmd.DDZ_USER_UNREADNUM_NOTIFY] = qf.ekey.DDZ_USER_UNREADNUM_NOTIFY;

        //cmd:200同步人员的财产信息。 比如同步人员金币信息到客户端，后续可拓展其他
        self._etable[qf.cmd.DDZ_USER_SYNC_FORTUNE_INFO_NOTIFY] = qf.ekey.DDZ_USER_SYNC_FORTUNE_INFO_NOTIFY;

        //cmd:201记牌器数量
        self._etable[qf.cmd.DDZ_CARD_COUNTER_NOTIFY] = qf.ekey.DDZ_CARD_COUNTER_NOTIFY;

        //cmd:6576通知记牌器信息
        self._etable[qf.cmd.DDZ_CARD_COUNTER_INFO_NOTIFY] = qf.ekey.DDZ_CARD_COUNTER_INFO_NOTIFY;

        //cmd: 7558 通知本副牌的输赢
        self._etable[qf.cmd.USER_WIN_OR_LOSE_NTF] = qf.ekey.USER_WIN_OR_LOSE_NTF;

        //cmd: 6556 赛事广播
        self._etable[qf.cmd.DDZ_EVT_BROADCAST] = qf.ekey.DDZ_EVT_BROADCAST;

        //cmd: 203 奖券模块 [banner]
        self._etable[qf.cmd.DDZ_AWARD_INFO_DETAIL_REQ] = qf.ekey.DDZ_AWARD_INFO_DETAIL_REQ;

        //cmd: 180 通知小红点
        self._etable[qf.cmd.DDZ_RED_DOT_NOTIFY] = qf.ekey.DDZ_RED_DOT_NOTIFY;

        //cmd: 184 邮件消息通知
        self._etable[qf.cmd.DDZ_UPDATE_MAIL_NOTIFY] = qf.ekey.DDZ_UPDATE_MAIL_NOTIFY;

        //cmd: 7557 通知玩家排行榜的分数改变
        self._etable[qf.cmd.DDZ_MATCH_USER_BOARD_INFO_NTF] = qf.ekey.DDZ_MATCH_USER_BOARD_INFO_NTF;

        //cmd: 6566 关注有礼信息通知
        self._etable[qf.cmd.DDZ_SUBSCRIBEGIFT_WINDOWEVT_NTF] = qf.ekey.DDZ_SUBSCRIBEGIFT_WINDOWEVT_NTF;
        //cmd: 6562 邀请有礼结果返回
        self._etable[qf.cmd.DDZ_INVITE_HELPRET_NTF] = qf.ekey.DDZ_INVITE_HELPRET_NTF;

        //cmd: 6602 钻石活动结果返回
        self._etable[qf.cmd.DDZ_DIAMOND_ACTIVITY_HELPRET_NTF] = qf.ekey.DDZ_DIAMOND_ACTIVITY_HELPRET_NTF;

        //cmd: 6568 参赛进度通知
        self._etable[qf.cmd.DDZ_JOIN_MATCH_REWARD_NOTIFY] = qf.ekey.DDZ_JOIN_MATCH_REWARD_NOTIFY;

        //cmd:6574 封号通知
        self._etable[qf.cmd.DDZ_USER_LOGIN_OFF_NOTIFY] = qf.ekey.DDZ_USER_LOGIN_OFF_NOTIFY;

        //cmd:8007 残局通过数改变通知
        self._etable[qf.cmd.END_GAME_LEVEL_CHANGE_NTF] = qf.ekey.END_GAME_LEVEL_CHANGE_NTF;

        //cmd:7565 残局结算通知
        self._etable[qf.cmd.DDZ_END_GAME_OVER_EVT] = qf.ekey.DDZ_END_GAME_OVER_EVT;

        //cmd: 6610 点击获取钻石链接结果返回
        self._etable[qf.cmd.DDZ_REWARD_DIAMOND_CLICK_NTF] = qf.ekey.DDZ_REWARD_DIAMOND_CLICK_NTF;

        //cmd: 6614 为成功邀请之后，邀请者会收到的通知
        self._etable[qf.cmd.DDZ_REWARD_DIAMOND_SUCCESS_NTF] = qf.ekey.DDZ_REWARD_DIAMOND_SUCCESS_NTF;

        //cmd: 6617 国庆活动助攻成功通知
        self._etable[qf.cmd.DDZ_NATIONALDAY_BONUSESHELP_NTF] = qf.ekey.DDZ_NATIONALDAY_BONUSESHELP_NTF;

        // cmd: 6622 金币不足引导
        self._etable[qf.cmd.DDZ_GOLD_GUIDE_NTF] = qf.ekey.DDZ_GOLD_GUIDE_NTF;
        //CMD:6624 每日任务充值成功
        self._etable[qf.cmd.DDZ_TASK_RECHARGE_SUCC_NTF] = qf.ekey.DDZ_TASK_RECHARGE_SUCC_NTF;

        //CMD:6636 语音通知
        self._etable[qf.cmd.DDZ_VOLTE_MSG_NTF] = qf.ekey.DDZ_VOLTE_MSG_NTF;

        // 好友房解散牌桌投票 cmd:6640
        self._etable[qf.cmd.DDZ_DISMISS_VOTE_NTF] = qf.ekey.DDZ_DISMISS_VOTE_NTF;

        //cmd:7531 明牌通知
        self._etable[qf.cmd.DDZ_SHOW_CARD_EVENT_NTF] = qf.ekey.DDZ_SHOW_CARD_EVENT_NTF;

        //cmd:30062 赛事段位更新通知
        self._etable[qf.cmd.MATCH_LV_CHANGE_NTF] = qf.ekey.MATCH_LV_CHANGE_NTF;
    },

    bindEventCmdEvent() {
        let self = this;

    },

    findEventByCmd(cmd) {
        let self = this;
        let event = self._etable[cmd];
        return event;
    },

});