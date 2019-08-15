
cc.Class({
    properties: {
        TAG: "PBAdapter",
        _reqtable: { default: {} },
        _rsptable: { default: {} }
    },

    ctor() {
        let self = this;
        self.bindCommonCmdPb();
        self.bindNormalCmdPb();
        self.bindEventCmdPb();
    },

    //绑定通用的命令字与事件
    bindCommonCmdPb() {
        let self = this;
        //cmd: 3,登录测试
        self._reqtable[qf.cmd.TEST_LOGIN] = "UserLoginReq";
        self._rsptable[qf.cmd.TEST_LOGIN] = "UserLoginRsp";
        
        //cmd: 101, 测试网络速度
        self._reqtable[qf.cmd.CMD_NETWORK_SPEED_TEST] = "SpeedTestReq";
        self._rsptable[qf.cmd.CMD_NETWORK_SPEED_TEST] = "SpeedTestRsp";

        self._reqtable[qf.cmd.WECHAT_GAME_LOGIN] = "WXAUserRegReq";
        self._rsptable[qf.cmd.WECHAT_GAME_LOGIN] = "UserLoginRsp";

        self._reqtable[qf.cmd.CONFIG] = "GameConfReq";
        self._rsptable[qf.cmd.CONFIG] = "GameConfRsp";         //协议解析config配置


        self._reqtable[qf.cmd.CMD_INTERACT_PHIZ] = "InteractiveExpressionReq"; //发送互动表情
        self._rsptable[qf.cmd.CMD_INTERACT_PHIZ] = "InteractiveExpressionRsp";
        self._rsptable[qf.cmd.CMD_INTERACT_PHIZ_NTF] = "InteractiveExpressionNtf"; //下发互动表情

        self._reqtable[qf.cmd.WECHAT_GAME_GETUSERINFO] = "UserAuthorizationReq";
        self._rsptable[qf.cmd.WECHAT_GAME_GETUSERINFO] = "UserAuthorizationRsp";
    },

    //绑定经典场、好友房的命令字与事件
    bindNormalCmdPb() {
        let self = this;
        //cmd: 6500 斗地主进桌请求
        self._reqtable[qf.cmd.LORD_ENTER_DESK_REQ] = "DDZEnterDeskReq";
        self._rsptable[qf.cmd.LORD_ENTER_DESK_REQ] = "DDZEnterDeskRsp";

        //cmd: 6502 退桌请求
        self._reqtable[qf.cmd.LORD_EXIT_DESK_REQ] = "DDZExitDeskReq";
        self._rsptable[qf.cmd.LORD_EXIT_DESK_REQ] = "DDZExitDeskRsp";

        //cmd: 6535 站起请求
        self._reqtable[qf.cmd.DDZ_USER_STAND_REQ] = "DDZUserStandReq";
        self._rsptable[qf.cmd.DDZ_USER_STAND_REQ] = "DDZUserStandRsp";
        //cmd: 6536 站起通知
        self._rsptable[qf.cmd.DDZ_USER_STAND_NOTIFY] = "DDZUserStandNtf";

        //cmd: 6537 坐下请求
        self._reqtable[qf.cmd.DDZ_USER_SITDOWN_REQ] = "DDZUserSitDownReq";
        self._rsptable[qf.cmd.DDZ_USER_SITDOWN_REQ] = "DDZUserSitDownRsp";
        //cmd: 6538  坐下通知
        self._rsptable[qf.cmd.DDZ_USER_SITDOWN_NOTIF] = "DDZUserSitDownNtf";

        //cmd: 6504 叫分
        self._reqtable[qf.cmd.LORD_CALL_REQ] = "DDZUserCallReq";
        self._rsptable[qf.cmd.LORD_CALL_REQ] = "DDZUserCallRsp";

        //cmd: 6508 叫分通知
        self._rsptable[qf.cmd.LORD_CALL_NOTIFY] = "DDZUserCallEvt";

        //cmd: 6505 托管/取消托管
        self._reqtable[qf.cmd.LORD_AUTO_PLAY_REQ] = "DDZAutoPlayReq";
        self._rsptable[qf.cmd.LORD_AUTO_PLAY_REQ] = "DDZAutoPlayRsp";

        //cmd: 6511 托管/取消托管通知
        self._rsptable[qf.cmd.LORD_AUTO_PLAY_NOTIFY] = "DDZAutoPlayEvt";

        //cmd: 6506 出牌请求
        self._reqtable[qf.cmd.LORD_DISCARD_REQ] = "DDZDiscardReq";
        self._rsptable[qf.cmd.LORD_DISCARD_REQ] = "DDZDiscardRsp";

        //cmd: 6510 出牌通知
        self._rsptable[qf.cmd.LORD_DISCARD_NOTIFY] = "DDZDiscardEvt";

        //cmd: 6507 结算通知
        self._rsptable[qf.cmd.LORD_RESULT_NOTIFY] = "DDZResultEvt";

        //cmd: 6509 游戏开始通知
        self._rsptable[qf.cmd.LORD_START_NOTIFY] = "DDZStartGameEvt";

        //cmd: 6512 进桌通知
        self._rsptable[qf.cmd.LORD_ENTER_DESK_NOTIFY] = "DDZEnterDeskEvt";

        //cmd: 6513 退桌通知
        self._rsptable[qf.cmd.LORD_EXIT_DESK_NOTIFY] = "DDZExitDeskEvt";

        //cmd: 6514 加倍请求
        self._reqtable[qf.cmd.LORD_MUTI_REQ] = "DDZUserMutiReq";
        self._rsptable[qf.cmd.LORD_MUTI_REQ] = "DDZUserMutiRsp";

        //cmd: 6515 退桌通知
        self._rsptable[qf.cmd.LORD_MUTI_NOTIFY] = "DDZUserMutiEvt";

        //cmd：6516 查询牌桌
        self._reqtable[qf.cmd.LORD_QUERY_DESK_REQ] = "DDZQueryDeskReq";   //后台恢复时请求
        self._rsptable[qf.cmd.LORD_QUERY_DESK_REQ] = "DDZEnterDeskEvt";    //桌子信息

        //cmd: 6521  客户端玩家定时器超时请求
        self._reqtable[qf.cmd.LORD_OP_TIME_OUT_REQ] = "DDZOPTimeoutReq";

        //cmd: 6521 客户端玩家定时器超时返回
        self._rsptable[qf.cmd.LORD_OP_TIME_OUT_REQ] = "DDZOPTimeoutRsp";

        //cmd: 6522 互动表情请求
        self._reqtable[qf.cmd.LORD_INTERACT_PHIZ_REQ] = "InteractiveExpressionReq"; //发送互动表情
        self._rsptable[qf.cmd.LORD_INTERACT_PHIZ_REQ] = "InteractiveExpressionRsp";

        //cmd: 160  获取个人信息
        self._reqtable[qf.cmd.LORD_PLAYER_INFO_REQ] = "OtherUserInfoReq";
        self._rsptable[qf.cmd.LORD_PLAYER_INFO_REQ] = "OtherUserInfoRsp";

        //cmd: 10055  头像框列表
        self._reqtable[qf.cmd.ICON_FRAME_LIST_REQ] = "IconFrameListReq";
        self._rsptable[qf.cmd.ICON_FRAME_LIST_REQ] = "IconFrameListRsp";

        //cmd: 10056  使用头像框
        self._reqtable[qf.cmd.USE_ICON_FRAME_REQ] = "UseIconFrameReq";
        self._rsptable[qf.cmd.USE_ICON_FRAME_REQ] = "UseIconFrameRsp";

		//cmd: 6527 破产保护
        self._rsptable[qf.cmd.DDZ_PROTECT_NOTIFY] = "DDZProtectNtf";

        //cmd: 6557 破产保护分享状态
        self._reqtable[qf.cmd.DDZ_BANKRUPTCY_SHARE_REQ] = "DDZBankruptcyShareReq";
        self._rsptable[qf.cmd.DDZ_BANKRUPTCY_SHARE_REQ] = "DDZBankruptcyShareRsp";

        //cmd: 6528 玩家准备请求
        self._reqtable[qf.cmd.DDZ_USER_READY_REQ] = "DDZUserReadyReq";
        self._rsptable[qf.cmd.DDZ_USER_READY_REQ] = "DDZUserReadyRsp";

        //cmd: 6529 玩家准备通知
        self._rsptable[qf.cmd.DDZ_USER_READY_NOTIFY] = "DDZUserReadyNtf";

        //cmd: 6531 明牌通知
        self._rsptable[qf.cmd.DDZ_SHOW_CARD_NTF] = "DDZShowCardNtf";

        //cmd: 6530 发牌过程中明牌请求
        self._reqtable[qf.cmd.DDZ_SHOW_CARD_REQ] = "DDZShowCardReq";
        self._rsptable[qf.cmd.DDZ_SHOW_CARD_REQ] = "DDZShowCardRsp";

        //cmd: 6533 牌桌倍数变化通知
        self._rsptable[qf.cmd.DDZ_DESK_MULTI_NOTIFY] = "DDZDeskMultiNtf";

        //cmd: 6532 查询牌桌倍数
        self._reqtable[qf.cmd.DDZ_DESK_MULTI_REQ] = "DDZDeskMultiReq";
        self._rsptable[qf.cmd.DDZ_DESK_MULTI_REQ] = "DDZDeskMultiRsp";

        //cmd: 6534 进桌前检测是否进去了其他场次
        self._reqtable[qf.cmd.DDZ_ROOM_CHECK_REQ] = "RoomCheckRsq";
        self._rsptable[qf.cmd.DDZ_ROOM_CHECK_REQ] = "RoomCheckRsp";

        //cmd 6539 牌桌当前操作者通知---暂用于发牌阶段结束通知抢地主
        self._rsptable[qf.cmd.DDZ_OPUSER_NOTIFY] = "DDZOpUserNtf";

        //cmd: 6540 好友房间旁观玩家新建桌子
        self._reqtable[qf.cmd.LORD_VIEWER_CREATE_DESK_REQ] = "DDZViewerCreateDeskReq";
        self._rsptable[qf.cmd.LORD_VIEWER_CREATE_DESK_REQ] = "DDZEnterDeskEvt";

        //cmd: 6541 玩家点击换桌
        self._reqtable[qf.cmd.LORD_USER_CHANGE_DESK_REQ] = "DDZUserChangeDeskReq";
        self._rsptable[qf.cmd.LORD_USER_CHANGE_DESK_REQ] = "DDZEnterDeskEvt";

        //cmd: 6544 反馈
        self._reqtable[qf.cmd.LORD_FEEDBACK_REQ] = "DDZFeedBackReq";
        self._rsptable[qf.cmd.LORD_FEEDBACK_REQ] = "DDZFeedBackRsp";

        //cmd: 6542 战绩
        self._reqtable[qf.cmd.LORD_ROUND_SETTLE_REQ] = "DDZRoundSettleReq";
        self._rsptable[qf.cmd.LORD_ROUND_SETTLE_REQ] = "DDZRoundSettleRsp";

        //cmd: 6543 对局排行信息
        self._reqtable[qf.cmd.LORD_ROUND_RANK_REQ] = "DDZRoundRankReq";
        self._rsptable[qf.cmd.LORD_ROUND_RANK_REQ] = "DDZRoundRankRsp";

        self._reqtable[qf.cmd.LORD_EMAIL_REQ] = "DDZGetEmailReq";
        self._rsptable[qf.cmd.LORD_EMAIL_REQ] = "DDZGetEmailRsp";

        //cmd: 145 聊天
        self._reqtable[qf.cmd.DDZ_GAME_CHAT_REQ] = "DeskChatReq";
        self._rsptable[qf.cmd.DDZ_GAME_CHAT_REQ] = "DeskChatRsp";
        self._rsptable[qf.cmd.DDZ_GAME_CHAT_NOTIFY] = "EvtDeskChat";
        //cmd:194 商城钻石兑换商品
        self._reqtable[qf.cmd.PRODUCT_EXCHANGE_BY_DIAMOND] = "StoreBuyItemUsingDiamondReq";
        self._rsptable[qf.cmd.PRODUCT_EXCHANGE_BY_DIAMOND] = "StoreBuyItemUsingDiamondRsp";

        //cmd: 190 单独通知用户金币变化
        self._rsptable[qf.cmd.DDZ_GOLD_CHANGE_NOTIFY] = "UserChangeNtf";

        //cmd: 193 单独通知用户钻石变化
        self._rsptable[qf.cmd.DDZ_DIAMOND_CHANGE_NOTIFY] = "UserChangeNtf";

        //cmd:7551 单独通知用户奖券变化
        self._rsptable[qf.cmd.DDZ_LOTTERYTICKET_CHANGE_NOTIFY] = "UserChangeNtf";

        //cmd:7555 单独通知用户段位变化
        self._rsptable[qf.cmd.DDZ_LEVEL_CHANGE_NOTIFY] = "UserChangeNtf";

        //cmd: 149 通知购买商城物品成功了
        self._rsptable[qf.cmd.DDZ_BUY_SUCCESS_NOTIFY] = "EvtBuySucc";

        //cmd: 6546 新手福利请求
        self._reqtable[qf.cmd.DDZ_FRESH_MAN_GIFT_REQ] = "DDZFreshManGiftReq";
        self._rsptable[qf.cmd.DDZ_FRESH_MAN_GIFT_REQ] = "DDZFreshManGiftRsp";

        //cmd: 6547 领取福利请求
        self._reqtable[qf.cmd.DDZ_RECEIVE_GIFT_REQ] = "DDZReceiveGiftReq";
        self._rsptable[qf.cmd.DDZ_RECEIVE_GIFT_REQ] = "DDZReceiveGiftRsp";

        //cmd: 6548 检测能进的场次----金币限制
        self._reqtable[qf.cmd.DDZ_CHECK_GOLD_LIMIT_REQ] = "DDZCheckGoldLimitReq";
        self._rsptable[qf.cmd.DDZ_CHECK_GOLD_LIMIT_REQ] = "DDZCheckGoldLimitRsp";

        //cmd: 6549 房主踢人
        self._reqtable[qf.cmd.DDZ_KICK_OUT_REQ] = "DDZKickOutReq";
        self._rsptable[qf.cmd.DDZ_KICK_OUT_REQ] = "DDZKickOutRsp";

        //cmd: 6550 微信公众号
        self._reqtable[qf.cmd.DDZ_FOCUS_GIFT_REQ] = "DDZFocusGiftReq";
        self._rsptable[qf.cmd.DDZ_FOCUS_GIFT_REQ] = "DDZFocusGiftRsp";

        //cmd: 196 记牌器请求
        self._reqtable[qf.cmd.DDZ_CARD_COUNTER_DETAIL_REQ] = "CardCounterDetailReq";
        self._rsptable[qf.cmd.DDZ_CARD_COUNTER_DETAIL_REQ] = "CardCounterDetailRsp";

        //cmd: 197 分享成功后增加领取次数
        self._reqtable[qf.cmd.DDZ_COUNTER_ADD_REQ] = "IncrCardCounterChanceReq";
        self._rsptable[qf.cmd.DDZ_COUNTER_ADD_REQ] = "IncrCardCounterChanceRsp";

        //cmd: 198 领取记牌器请求
        self._reqtable[qf.cmd.DDZ_COUNTER_RECEIVE_REQ] = "PickCardCounterInMainReq";
        self._rsptable[qf.cmd.DDZ_COUNTER_RECEIVE_REQ] = "PickCardCounterInMainRsp";

        //cmd: 199 牌桌内分享领取记牌器
        self._reqtable[qf.cmd.DDZ_DESK_COUNTER_RECEIVE_REQ] = "PickCardCounterInDeskReq";
        self._rsptable[qf.cmd.DDZ_DESK_COUNTER_RECEIVE_REQ] = "PickCardCounterInDeskRsp";

        //cmd: 6551 用户未读消息的数量(目前只在登录时候推送)
        self._rsptable[qf.cmd.DDZ_USER_UNREADNUM_NOTIFY] = "UserUnreadNumNtf";

        //cmd:200同步人员的财产信息。 比如同步人员金币信息到客户端，后续可拓展其他
        self._rsptable[qf.cmd.DDZ_USER_SYNC_FORTUNE_INFO_NOTIFY] = "SyncFortuneInfoNtf";

        //cmd: 7550 赛事主页信息请求
        self._reqtable[qf.cmd.DDZ_MATCH_HOME_PAGE_INFO_REQ] = "DDZMatchHomepageInfoReq";
        self._rsptable[qf.cmd.DDZ_MATCH_HOME_PAGE_INFO_REQ] = "DDZMatchHomepageInfoRsp";

        //cmd: 7556 ddz赛事世界排行榜
        self._reqtable[qf.cmd.DDZ_MATCH_LEADER_BOARD_INFO_REQ] = "DDZMatchLeaderBoardInfoReq";
        self._rsptable[qf.cmd.DDZ_MATCH_LEADER_BOARD_INFO_REQ] = "DDZMatchLeaderBoardInfoRsp";

        //cmd: 6552 获取兑换商品的信息
        self._reqtable[qf.cmd.DDZ_EXCHANGE_CLASSIFY_REQ] = "ExchangeClassifyReq";
        self._rsptable[qf.cmd.DDZ_EXCHANGE_CLASSIFY_REQ] = "ExchangeClassifyRsp";

        //cmd: 6553 兑换
        self._reqtable[qf.cmd.DDZ_EXCHANGE_GOODS_REQ] = "ExchangeGoodsReq";
        self._rsptable[qf.cmd.DDZ_EXCHANGE_GOODS_REQ] = "ExchangeGoodsRsp";

        //cmd: 6554 修改地址
        self._reqtable[qf.cmd.DDZ_EXCHANGE_ALTER_ADDRESS_REQ] = "UserChangeAddressesReq";
        self._rsptable[qf.cmd.DDZ_EXCHANGE_ALTER_ADDRESS_REQ] = "UserChangeAddressesRsp";

        //cmd: 6555 兑换记录
        self._reqtable[qf.cmd.DDZ_EXCHANGE_RECORD_REQ] = "UserChangeRecordReq";
        self._rsptable[qf.cmd.DDZ_EXCHANGE_RECORD_REQ] = "UserChangeRecordRsp";

        //cmd: 201 记牌器数量更新
        self._rsptable[qf.cmd.DDZ_CARD_COUNTER_NOTIFY] = "CardCounterChangeNtf";

        //cmd: 6576 通知记牌器信息
        self._rsptable[qf.cmd.DDZ_CARD_COUNTER_INFO_NOTIFY] = "DDZUpdateCardCounterEvt";

        //cmd: 6556 赛事广播
        self._rsptable[qf.cmd.DDZ_EVT_BROADCAST] = "EvtBroadCast";

        //cmd: 203 奖券模块 [banner]
        self._reqtable[qf.cmd.DDZ_AWARD_INFO_DETAIL_REQ] = "AwardInfoDetailReq";
        self._rsptable[qf.cmd.DDZ_AWARD_INFO_DETAIL_REQ] = "AwardInfoDetailRsp";

        //cmd: 180 通知小红点
        self._rsptable[qf.cmd.DDZ_RED_DOT_NOTIFY] = "DDZLittleRedDotNtf";

        //cmd: 181 获取邮件列表
        self._reqtable[qf.cmd.DDZ_EMAIL_BOX_REQ] = "DDZMailBoxReq";
        self._rsptable[qf.cmd.DDZ_EMAIL_BOX_REQ] = "DDZMailBoxRsp";

        //cmd: 182 邮件领取请求
        self._reqtable[qf.cmd.DDZ_EMAIL_RECEIVE_REQ] = "DDZMailReceiveReq";
        self._rsptable[qf.cmd.DDZ_EMAIL_RECEIVE_REQ] = "DDZMailReceiveRsp";

        //cmd: 183 系统消息已查看请求
        self._reqtable[qf.cmd.DDZ_SYSMESSAGE_READ_REQ] = "DDZSysMessageReadReq";
        self._rsptable[qf.cmd.DDZ_SYSMESSAGE_READ_REQ] = "DDZSysMessageReadRsp";

        //cmd: 184 邮件消息通知
        self._rsptable[qf.cmd.DDZ_UPDATE_MAIL_NOTIFY] = "DDZmailBoxNtf";

        //cmd: 202 背包
        self._reqtable[qf.cmd.DDZ_KNAPSACK_INFO_REQ] = "KnapsackInfoReq";
        self._rsptable[qf.cmd.DDZ_KNAPSACK_INFO_REQ] = "KnapsackInfoRsp";

        //cmd: 204 春天分享领取记牌器
        self._reqtable[qf.cmd.CARD_COUNTER_WITH_SPRING] = "PickSpringCardCounterReq";
        self._rsptable[qf.cmd.CARD_COUNTER_WITH_SPRING] = "PickSpringCardCounterRsp";

        //cmd: 7560 使用等级卡
        self._reqtable[qf.cmd.DDZ_USER_LEVEL_CARD_REQ] = "UseLevelCardReq";
        self._rsptable[qf.cmd.DDZ_USER_LEVEL_CARD_REQ] = "UseLevelCardRsp";

        //cmd: 7557 通知玩家排行榜的分数改变
        self._rsptable[qf.cmd.DDZ_MATCH_USER_BOARD_INFO_NTF] = "DDZMatchUserBoardInfoNtf";

        //cmd: 6558 牌桌信息分享成功后 回掉服务器接口
        self._reqtable[qf.cmd.DDZ_GAME_SHARE_REQ] = "DDZGameShareReq";
        self._rsptable[qf.cmd.DDZ_GAME_SHARE_REQ] = "DDZGameShareRsp";

        //cmd: 6559 领取记牌器窗口是否需要弹出
        self._reqtable[qf.cmd.DDZ_CARD_COUNTER_NEEDPOP_REQ] = "DDZCardCounterNeedPopReq";
        self._rsptable[qf.cmd.DDZ_CARD_COUNTER_NEEDPOP_REQ] = "DDZCardCounterNeedPopRsp";

        //cmd: 6562 邀请有礼结果返回
        self._rsptable[qf.cmd.DDZ_INVITE_HELPRET_NTF] = "DDZInviteHelpRetNtf";

        //cmd: 6602 钻石活动结果返回
        self._rsptable[qf.cmd.DDZ_DIAMOND_ACTIVITY_HELPRET_NTF] = "DDZDiamondRedPacketHelpRetNtf";

        self._reqtable[qf.cmd.DDZ_SUBSCRIBEGIFT_REQ] = "DDZSubscribeGiftReq"; //关注有礼DDZSubscribeGiftRsp
        self._rsptable[qf.cmd.DDZ_SUBSCRIBEGIFT_REQ] = "DDZSubscribeGiftRsp";
        //cmd: 6565 关注有礼信息下发通知
        self._rsptable[qf.cmd.DDZ_SUBSCRIBEGIFT_WINDOWEVT_NTF] = "DDZSubscribeGiftWindowEvt";

        // 窗口是否需要弹出
        // cmd： 6563
        self._reqtable[qf.cmd.DDZ_NEED_POP_REQ] = "DDZNeedPopReq";
        self._rsptable[qf.cmd.DDZ_NEED_POP_REQ] = "DDZNeedPopRsp";

        // 邀请有礼
        // cmd: 6560
        self._reqtable[qf.cmd.DDZ_INVITE_REWARD_REQ] = "DDZInviteRewardReq";
        self._rsptable[qf.cmd.DDZ_INVITE_REWARD_REQ] = "DDZInviteRewardRsp";

        // 领取邀请有礼奖励
        // cmd: 6561
        self._reqtable[qf.cmd.DDZ_INVITE_REWARD_GET_REQ] = "DDZInviteRewardGetReq";
        self._rsptable[qf.cmd.DDZ_INVITE_REWARD_GET_REQ] = "DDZInviteRewardGetRsp";

        // 通过邀请连接进入游戏处理
        // cmd: 6564
        self._reqtable[qf.cmd.BE_INVITER_ENTER_REQ] = "BeInviteEnterReq";
        self._rsptable[qf.cmd.BE_INVITER_ENTER_REQ] = "BeInviteEnterRsp";

        //cmd: 6567 参赛有礼
        self._reqtable[qf.cmd.DDZ_JOIN_MATCH_REWARD_REQ] = "DDZJoinMatchRewardReq";
        self._rsptable[qf.cmd.DDZ_JOIN_MATCH_REWARD_REQ] = "DDZJoinMatchRewardRsp";

        //cmd: 6568 参赛进度通知
        self._rsptable[qf.cmd.DDZ_JOIN_MATCH_REWARD_NOTIFY] = "DDZJoinMatchRewardNtf";

        //cmd: 6569 参赛有礼 领取奖励
        self._reqtable[qf.cmd.DDZ_JOIN_MATCH_REWARDGET_REQ] = "DDZJoinMatchRewardGetReq";
        self._rsptable[qf.cmd.DDZ_JOIN_MATCH_REWARDGET_REQ] = "DDZJoinMatchRewardGetRsp";

        //cmd: 6570 参赛有礼 分享成功回调
        self._reqtable[qf.cmd.DDZ_JOIN_MATCH_REWARDSHARE_REQ] = "DDZJoinMatchRewardShareReq";
        self._rsptable[qf.cmd.DDZ_JOIN_MATCH_REWARDSHARE_REQ] = "DDZJoinMatchRewardShareRsp";

        //cmd: 6571 所有分享成功回调
        self._reqtable[qf.cmd.DDZ_COMSHARE_SUCBACK_REQ] = "DDZComShareSucBackReq";
        self._rsptable[qf.cmd.DDZ_COMSHARE_SUCBACK_REQ] = "DDZComShareSucBackRsp";

        //cmd: 6573 参赛有礼是否在活动时间内
        self._reqtable[qf.cmd.DDZ_IN_JOIN_MATCH_REWARD_REQ] = "DDZInJoinMatchRewardReq";
        self._rsptable[qf.cmd.DDZ_IN_JOIN_MATCH_REWARD_REQ] = "DDZInJoinMatchRewardRsp";

        //cmd: 6574 流量主需求 查看广告数据
        self._reqtable[qf.cmd.USER_AD_INFO_REQ] = "UserADInfoReq";
        self._rsptable[qf.cmd.USER_AD_INFO_REQ] = "UserADInfoRsp";


        //cmd:6574 封号通知
        self._rsptable[qf.cmd.DDZ_USER_LOGIN_OFF_NOTIFY] = "DDZUserIsOffNtf";

        // cmd:601 金币场大厅
        self._reqtable[qf.cmd.COIN_HALL_REQ] = "HallSelectPlayModeReq";
        self._rsptable[qf.cmd.COIN_HALL_REQ] = "HallSelectPlayModeRsp";

        // cmd:602 快速开始
        self._reqtable[qf.cmd.QUICK_START_REQ] = "QuickAllocRoomIdReq";
        self._rsptable[qf.cmd.QUICK_START_REQ] = "QuickAllocRoomIdRsp";

        // cmd:6600 赛事邀请弹窗
        self._reqtable[qf.cmd.MATCH_INVITE_NEED_POP_REQ] = "MatchNeedPopReq";
        self._rsptable[qf.cmd.MATCH_INVITE_NEED_POP_REQ] = "MatchNeedPopRsp";

        // cmd:7563 红包信息
        self._reqtable[qf.cmd.REDPACKET_INFO_REQ] = "ExchangeCashInfoReq";
        self._rsptable[qf.cmd.REDPACKET_INFO_REQ] = "ExchangeCashInfoRsp";

        // cmd:7562 红包提现
        self._reqtable[qf.cmd.REDPACKET_GETCASH_REQ] = "ExchangeCashReq";
        self._rsptable[qf.cmd.REDPACKET_GETCASH_REQ] = "ExchangeCashRsp";

        // cmd:7564 红包奖励明细
        self._reqtable[qf.cmd.REDPACKET_REWARD_DETAIL_REQ] = "PickRedPacketRecordsReq";
        self._rsptable[qf.cmd.REDPACKET_REWARD_DETAIL_REQ] = "PickRedPacketRecordsRsp";

        // cmd:8007 残局通过数改变通知
        self._rsptable[qf.cmd.END_GAME_LEVEL_CHANGE_NTF] = "EndGameLevelChangeNTF";

        // cmd: 6601 活动获取钻石
        self._reqtable[qf.cmd.DDZ_DIAMOND_REDPACKET_REQ] = "DDZActivityDiamondReq";
        self._rsptable[qf.cmd.DDZ_DIAMOND_REDPACKET_REQ] = "DDZActivityDiamondRsp";

        // cmd: 8009 进入残局大厅
        self._reqtable[qf.cmd.END_GAME_LOBBY_REQ] = "EndGameHallReq";
        self._rsptable[qf.cmd.END_GAME_LOBBY_REQ] = "EndGameHallRsp";

        // cmd:8011 残局闯关提示
        self._reqtable[qf.cmd.ENDGAME_DDZ_REMIND] = "UseEndGameRemindReq";
        self._rsptable[qf.cmd.ENDGAME_DDZ_REMIND] = "UseEndGameRemindRsp";

        // cmd:8008 残局结算通知
        self._rsptable[qf.cmd.DDZ_END_GAME_OVER_EVT] = "DDZEndGameOverEvt";

        //cmd: 8002 退桌请求
        self._reqtable[qf.cmd.ENDGAME_EXIT_DESK_REQ] = "DDZExitDeskReq";
        self._rsptable[qf.cmd.ENDGAME_EXIT_DESK_REQ] = "DDZExitDeskRsp";

        //cmd: 8003 出牌请求
        self._reqtable[qf.cmd.ENDGAME_DISCARD_REQ] = "DDZDiscardReq";
        self._rsptable[qf.cmd.ENDGAME_DISCARD_REQ] = "DDZDiscardRsp";

        //cmd：8004 查询牌桌
        self._reqtable[qf.cmd.ENDGAME_QUERY_DESK_REQ] = "DDZQueryDeskReq";   //后台恢复时请求
        self._rsptable[qf.cmd.ENDGAME_QUERY_DESK_REQ] = "DDZEnterDeskEvt";    //桌子信息

        //cmd:8010 查询残局关卡消耗
        self._reqtable[qf.cmd.ENDGAME_CHECK_LEVEL_COST] = "DDZEndGameQueryDiamondFeeReq";
        self._rsptable[qf.cmd.ENDGAME_CHECK_LEVEL_COST] = "DDZEndGameQueryDiamondFeeRsp";

        //cmd: 6611 钻石商城获得钻石
        self._reqtable[qf.cmd.DDZ_DIAMOND_REWARD_REQ] = "DDZDiamondStoreRewardReq";
        self._rsptable[qf.cmd.DDZ_DIAMOND_REWARD_REQ] = "DDZDiamondStoreRewardRsp";

        //cmd: 6610 点击获取钻石链接结果返回
        self._rsptable[qf.cmd.DDZ_REWARD_DIAMOND_CLICK_NTF] = "DDZDiamondStoreHelpRetNtf";

        // cmd:6603 判断是否同一个群
        self._reqtable[qf.cmd.IS_DIFFERENT_WX_GROUP_REQ] = "IsDifferentWXGroupReq";
        self._rsptable[qf.cmd.IS_DIFFERENT_WX_GROUP_REQ] = "IsDifferentWXGroupRsp";

        // cmd:8014 残局排行榜
        self._reqtable[qf.cmd.DDZ_ENDGAME_RANK_SHARE] = "EndGameRankShareReq";
        self._rsptable[qf.cmd.DDZ_ENDGAME_RANK_SHARE] = "EndGameRankShareRsp";

        //cmd: 8013 重玩请求
        self._reqtable[qf.cmd.ENDGAME_RESET_GAME_REQ] = "DDZEndGameReplayReq";
        self._rsptable[qf.cmd.ENDGAME_RESET_GAME_REQ] = "DDZEnterDeskEvt";

        //cmd: 6614 为成功邀请之后，邀请者会收到的通知
        self._rsptable[qf.cmd.DDZ_REWARD_DIAMOND_SUCCESS_NTF] = "DDZDiamondShareSuccNtf";

        //cmd:6608 红包提现明细
        self._reqtable[qf.cmd.REDPACKET_GETCASH_DETAIL_REQ] = "ExchangeCashRecordsReq";
        self._rsptable[qf.cmd.REDPACKET_GETCASH_DETAIL_REQ] = "ExchangeCashRecordsRsp";

        // CMD:6615 查看国庆红包活动状态
        self._reqtable[qf.cmd.DDZ_NATIONALDAY_REQ] = "DDZNationalDayBonusesReq";
        self._rsptable[qf.cmd.DDZ_NATIONALDAY_REQ] = "DDZNationalDayBonusesRsp";

        // CMD:6616 领取红包
        self._reqtable[qf.cmd.DDZ_NATIONALDAY_GET_REQ] = "DDZNationalDayBonusesGetReq";
        self._rsptable[qf.cmd.DDZ_NATIONALDAY_GET_REQ] = "DDZNationalDayBonusesGetRsp";
        
        //cmd:6617 国庆活动助攻成功通知
        self._rsptable[qf.cmd.DDZ_NATIONALDAY_BONUSESHELP_NTF] = "DDZNationalDayBonusesHelpNtf";

        //cmd:6618 国庆活动助攻列表
        self._reqtable[qf.cmd.DDZ_NATIONALDAY_BONUSESHELPER_REQ] = "DDZNationalDayBonusesHelperReq";
        self._rsptable[qf.cmd.DDZ_NATIONALDAY_BONUSESHELPER_REQ] = "DDZNationalDayBonusesHelperRsp";

        //CMD: 6620 新手引导
        self._reqtable[qf.cmd.DDZ_NEW_USER_GUIDANCE_REQ] = "SetNewUserGuidanceReq";
        self._rsptable[qf.cmd.DDZ_NEW_USER_GUIDANCE_REQ] = "SetNewUserGuidanceRsp";

        //CMD: 6619 赛事引导
        self._reqtable[qf.cmd.DDZ_MATCH_GUIDE_REQ] = "DDZMatchGuideReq";
        self._rsptable[qf.cmd.DDZ_MATCH_GUIDE_REQ] = "DDZMatchGuideRep";

        //CMD:6621 赛事引导信息获取
        self._reqtable[qf.cmd.DDZ_MATCH_GUIDE_INFO_REQ] = "DDZMatchGuideLatestInfoReq";
        self._rsptable[qf.cmd.DDZ_MATCH_GUIDE_INFO_REQ] = "DDZMatchGuideLatestInfoRsp";

        self._rsptable[qf.cmd.DDZ_GOLD_GUIDE_NTF] = "GoldGuideNtf";


        //CMD:6622 任务列表
        self._reqtable[qf.cmd.DDZ_TASK_INFO_REQ] = "TaskListReq";
        self._rsptable[qf.cmd.DDZ_TASK_INFO_REQ] = "TaskListRsp";

        //CMD:6623 领取任务奖励
        self._reqtable[qf.cmd.DDZ_PICK_TASK_REWARD_REQ] = "TaskPickRewardReq";
        self._rsptable[qf.cmd.DDZ_PICK_TASK_REWARD_REQ] = "TaskPickRewardRsp";

        //CMD:6624 每日任务充值成功
        self._rsptable[qf.cmd.DDZ_TASK_RECHARGE_SUCC_NTF] = "TaskRechargeSuccessNTF";

        //CMD:领取幸运任务奖励
        self._reqtable[qf.cmd.DDZ_PICK_LUCKY_TASK_REWARD_REQ] = "DDZLuckyTaskPickRewardReq";
        self._rsptable[qf.cmd.DDZ_PICK_LUCKY_TASK_REWARD_REQ] = "DDZLuckyTaskPickRewardRsp";

        self._reqtable[qf.cmd.GET_SHARE_INFO_REQ] = "GetShareInfoReq";     //客户端拉取最新分享图文信息
        self._rsptable[qf.cmd.GET_SHARE_INFO_REQ] = "GetShareInfoRsp";     //客户端拉取最新分享图文信息

        self._reqtable[qf.cmd.DDZ_LAND_LORDSHOWCARD_REQ] = "DDZLandlordShowCardReq";
        self._rsptable[qf.cmd.DDZ_LAND_LORDSHOWCARD_REQ] = "DDZLandlordShowCardRsp";

        //CMD:6634 退出连胜询问
        self._reqtable[qf.cmd.DDZ_WIN_STREAK_TASK_EXIT_REQ] = "DDZWinStreakTaskExitReq";
        self._rsptable[qf.cmd.DDZ_WIN_STREAK_TASK_EXIT_REQ] = "DDZWinStreakTaskExitRsp";

        //CMD:6631 查看连胜任务详情
        self._reqtable[qf.cmd.DDZ_WIN_STREAK_TASK_REQ] = "DDZWinStreakTaskReq";
        self._rsptable[qf.cmd.DDZ_WIN_STREAK_TASK_REQ] = "DDZWinStreakTaskRsp";

        //CMD:6633 领取任务奖励
        self._reqtable[qf.cmd.DDZ_WIN_STREAK_TASK_PICK_REQ] = "DDZWinStreakTaskPickReq";
        self._rsptable[qf.cmd.DDZ_WIN_STREAK_TASK_PICK_REQ] = "DDZWinStreakTaskPickRsp";

        //CMD:6630 获得加倍信息
        self._reqtable[qf.cmd.DDZ_GET_MULTINFO_REQ] = "DDZGetMultipleInfoReq";
        self._rsptable[qf.cmd.DDZ_GET_MULTINFO_REQ] = "DDZGetMultipleInfoRsp";

        //CMD:6632 查询任务
        self._reqtable[qf.cmd.DDZ_WIN_STREAK_TASK_QUERY_REQ] = "DDZWinStreakTaskQueryReq";
        self._rsptable[qf.cmd.DDZ_WIN_STREAK_TASK_QUERY_REQ] = "DDZWinStreakTaskQueryRsp";

        //CMD:6641 请求助力好友数据
        self._reqtable[qf.cmd.DIAMOND_ACTIVITY_REDPACKET_REQ] = "DiamondRedPacketReq";
        self._rsptable[qf.cmd.DIAMOND_ACTIVITY_REDPACKET_REQ] = "DiamondRedPacketRsp";

        //CMD:6642 助力领取奖励
        self._reqtable[qf.cmd.DIAMOND_ACTIVITY_REDPACKET_PICK] = "DiamondRedPacketPickReq";
        self._rsptable[qf.cmd.DIAMOND_ACTIVITY_REDPACKET_PICK] = "DiamondRedPacketPickRsp";

        //CMD:6637 请求邀请有礼数据
        self._reqtable[qf.cmd.DIAMOND_ACTIVITY_INVITE_REQ] = "DDZDiamondInvite600Req";
        self._rsptable[qf.cmd.DIAMOND_ACTIVITY_INVITE_REQ] = "DDZDiamondInvite600Rsp";

        //CMD:6638 邀请有礼领取奖励
        self._reqtable[qf.cmd.DIAMOND_ACTIVITY_INVITE_PICK] = "DDZDiamondInvitePick600Req";
        self._rsptable[qf.cmd.DIAMOND_ACTIVITY_INVITE_PICK] = "DDZDiamondInvitePick600Rsp";

        //CMD:6635 语音请求
        self._reqtable[qf.cmd.DDZ_VOLTE_MSG_REQ] = "DDZVolteMsgReq";
        self._rsptable[qf.cmd.DDZ_VOLTE_MSG_REQ] = "DDZVolteMsgRsp";

        //cmd:6636 语音通知
        self._rsptable[qf.cmd.DDZ_VOLTE_MSG_NTF] = "DDZVolteMsgNtf";
        //好友房解散牌桌投票 cmd:6639
        self._reqtable[qf.cmd.DDZ_DISMISS_VOTE_REQ] = "DDZCustomMadeDismissVoteReq";
        self._rsptable[qf.cmd.DDZ_DISMISS_VOTE_REQ] = "DDZCustomMadeDismissVoteRsp";
        // 好友房解散牌桌投票 cmd:6640
        self._rsptable[qf.cmd.DDZ_DISMISS_VOTE_NTF] = "DDZCustomMadeDismissVoteEvt";

        //好友房切后台查询解散牌桌状态 cmd:6643
        self._reqtable[qf.cmd.DDZ_DISMISS_QUERY_REQ] = "DDZCustomMadeDismissVoteQueryReq";
        self._rsptable[qf.cmd.DDZ_DISMISS_QUERY_REQ] = "DDZCustomMadeDismissVoteQueryRsp";

        //CMD: 10051 630版本赛事场引导
        self._reqtable[qf.cmd.DDZ_COMPETITION_VIEW_GUIDE] = "SetGuidanceReq";
        self._rsptable[qf.cmd.DDZ_COMPETITION_VIEW_GUIDE] = "SetGuidanceRsp";

        // CMD: 10060 兑换新奖券
        self._reqtable[qf.cmd.EXCHANGE_NEW_COUPON] = "ExchangeNewCouponReq";
        self._rsptable[qf.cmd.EXCHANGE_NEW_COUPON] = "ExchangeNewCouponRsp";

        //cmd:30062 630赛事段位更新通知
        self._rsptable[qf.cmd.MATCH_LV_CHANGE_NTF] = "MatchLvChangeNtf";
    },

    //绑定赛事的命令字与事件
    bindEventCmdPb() {
        let self = this;

        //---------------------- DDZ 万元赛 begin ---------------------------------
        //cmd: 10000 斗地主进桌请求    新赛事场
        self._reqtable[qf.cmd.LORD_ENTER_DESK_NEWEVENT_REQ] = "DDZEnterDeskReq";
        self._rsptable[qf.cmd.LORD_ENTER_DESK_NEWEVENT_REQ] = "DDZEnterDeskRsp";

        //退桌
        //cmd: 10002
        self._reqtable[qf.cmd.DDZ_EVENT_EXIT_DESK_REQ] = "DDZExitDeskReq";
        self._rsptable[qf.cmd.DDZ_EVENT_EXIT_DESK_REQ] = "DDZExitDeskRsp";

        //叫分
        //cmd: 10004
        self._reqtable[qf.cmd.DDZ_EVENT_USER_CALL_REQ] = "DDZUserCallReq";
        self._rsptable[qf.cmd.DDZ_EVENT_USER_CALL_REQ] = "DDZUserCallRsp";

        //托管
        //cmd: 10005
        self._reqtable[qf.cmd.DDZ_EVENT_AUTO_PLAY_REQ] = "DDZAutoPlayReq";
        self._rsptable[qf.cmd.DDZ_EVENT_AUTO_PLAY_REQ] = "DDZAutoPlayRsp";

        //出牌
        //cmd: 10006
        self._reqtable[qf.cmd.DDZ_EVENT_DISCARD_REQ] = "DDZDiscardReq";
        self._rsptable[qf.cmd.DDZ_EVENT_DISCARD_REQ] = "DDZDiscardRsp";

        //加倍
        //cmd: 10007
        self._reqtable[qf.cmd.DDZ_EVENT_USER_MUTI_REQ] = "DDZUserMutiReq";
        self._rsptable[qf.cmd.DDZ_EVENT_USER_MUTI_REQ] = "DDZUserMutiRsp";

        //从后台切换回前台查询牌桌信息
        //cmd: 10008
        self._reqtable[qf.cmd.DDZ_EVENT_QUERY_DESK_REQ] = "DDZQueryDeskReq";
        self._rsptable[qf.cmd.DDZ_EVENT_QUERY_DESK_REQ] = "DDZEnterDeskEvt";

        //客户端玩家定时器超时请求
        //cmd: 10009
        self._reqtable[qf.cmd.DDZ_EVENT_OP_TIME_OUT_REQ] = "DDZOPTimeoutReq";
        self._rsptable[qf.cmd.DDZ_EVENT_OP_TIME_OUT_REQ] = "DDZOPTimeoutRsp";

        //牌桌倍数请求
        //cmd: 10011
        self._reqtable[qf.cmd.DDZ_EVENT_DESK_MULTI_REQ] = "DDZDeskMultiReq";
        self._rsptable[qf.cmd.DDZ_EVENT_DESK_MULTI_REQ] = "DDZDeskMultiRsp";

        //CMD:10014 获得加倍信息
        self._reqtable[qf.cmd.DDZ_GET_MULTINFO_630_REQ] = "DDZGetMultipleInfoReq";
        self._rsptable[qf.cmd.DDZ_GET_MULTINFO_630_REQ] = "DDZGetMultipleInfoRsp";

        //玩家查询战绩
        //cmd: 7542
        self._reqtable[qf.cmd.DDZ_EVENT_ROUND_SETTLE_REQ] = "DDZRoundSettleReq";
        self._rsptable[qf.cmd.DDZ_EVENT_ROUND_SETTLE_REQ] = "DDZRoundSettleRsp";

        //场次金币检测
        //cmd: 7548
        self._reqtable[qf.cmd.DDZ_EVENT_CHECK_GOLD_LIMIT_REQ] = "DDZCheckGoldLimitReq";
        self._rsptable[qf.cmd.DDZ_EVENT_CHECK_GOLD_LIMIT_REQ] = "DDZCheckGoldLimitRsp";

        //cmd: 7531 明牌通知
        self._rsptable[qf.cmd.DDZ_SHOW_CARD_EVENT_NTF] = "DDZShowCardNtf";

        //玩家查询赛事对局详情
        //cmd: 10013
        self._reqtable[qf.cmd.DDZ_ROUND_DETAIL_REQ] = "DDZRoundDetailReq";
        self._rsptable[qf.cmd.DDZ_ROUND_DETAIL_REQ] = "DDZRoundDetailRsp";

        //cmd: 10015 发牌过程中明牌请求
        self._reqtable[qf.cmd.DDZ_SHOW_CARD_EVENT_630_REQ] = "DDZShowCardReq";
        self._rsptable[qf.cmd.DDZ_SHOW_CARD_EVENT_630_REQ] = "DDZShowCardRsp";

        //玩家退赛兑奖信息
        //cmd: 7553
        self._reqtable[qf.cmd.DDZ_EXIT_MATCH_INFO_REQ] = "DDZExitMatchInfoReq";
        self._rsptable[qf.cmd.DDZ_EXIT_MATCH_INFO_REQ] = "DDZExitMatchInfoRsp";

        //玩家退赛兑奖
        //cmd: 7554
        self._reqtable[qf.cmd.DDZ_EXIT_MATCH_REQ] = "DDZExitMatchReq";
        self._rsptable[qf.cmd.DDZ_EXIT_MATCH_REQ] = "DDZExitMatchRsp";

        //玩家点击继续挑战
        //cmd 10012
        self._reqtable[qf.cmd.EVENT_USER_CHANGE_DESK_REQ] = "DDZUserChangeDeskReq";
        self._rsptable[qf.cmd.EVENT_USER_CHANGE_DESK_REQ] = "DDZEnterDeskEvt";


        // 玩家请求是否展示最强王者自动退赛兑奖弹窗
        // cmd 7559
        self._reqtable[qf.cmd.USER_AUTOMATIC_AWARD_REQ] = "UserAutomaticAwardReq";
        self._rsptable[qf.cmd.USER_AUTOMATIC_AWARD_REQ] = "UserAutomaticAwardRsp";

        // 背包检测有无等级卡
        // cmd 6572
        self._reqtable[qf.cmd.DDZ_BACKPACK_LEVEL_CARD_REQ] = "DDZBackpackLevelCardReq";
        self._rsptable[qf.cmd.DDZ_BACKPACK_LEVEL_CARD_REQ] = "DDZBackpackLevelCardRsp";

        // 是否是高段位
        // cmd 6577
        self._reqtable[qf.cmd.DDZ_IS_HIGH_MATCH_LEVEL_REQ] = "DDZIsHighMatchLevelReq";
        self._rsptable[qf.cmd.DDZ_IS_HIGH_MATCH_LEVEL_REQ] = "DDZIsHighMatchLevelRsp";

        // 领取金币宝箱
        // cmd 7561
        self._reqtable[qf.cmd.PICK_GOLD_BOX_REQ] = "PickGoldBoxReq";
        self._rsptable[qf.cmd.PICK_GOLD_BOX_REQ] = "PickGoldBoxRsp";

        // 使用宝箱
        // cmd 10052
        self._reqtable[qf.cmd.USE_MATCH_BOX_REQ] = "UseMatchBoxReq";
        self._rsptable[qf.cmd.USE_MATCH_BOX_REQ] = "UseMatchBoxRsp";

        // 保星请求
        // cmd 10017
        self._reqtable[qf.cmd.STAR_PROTECT_REQ] = "StarProtectReq";
        self._rsptable[qf.cmd.STAR_PROTECT_REQ] = "StarProtectRsp";

        // 保星二次弹窗通知
        // cmd 10058
        self._reqtable[qf.cmd.STAR_PROTECT_AGAIN_REQ] = "StarProtectAgainReq";
        self._rsptable[qf.cmd.STAR_PROTECT_AGAIN_REQ] = "StarProtectAgainRsp";
        //---------------------- DDZ 万元赛 end ---------------------------------

    },

    findPBNameByCmd(method, cmd) {
        let self = this;
        if(!method || !cmd) {
            loge("findPBNameByCmd paras error!!!", self.TAG);
            return null;
        }

        let pbName = self["_" + method + "table"][cmd];
        if (!pbName) {
            logd("cannot find pname by cmd=" + cmd + " on table=" + method, self.TAG);
            return null;
        }

        return pbName;
    },

    getMsgHeadPbName() {
        return "MsgHead";
    },

    getSafeShellPbName() {
        return "SafeShell";
    }
});