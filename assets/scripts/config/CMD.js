
let M = {};

M.TEST_LOGIN = 3;  //登录测试协议
M.HEARTBEAT = 7;  //心跳
//测试网络速度
M.CMD_NETWORK_SPEED_TEST = 101;
M.CONFIG = 31;    //获取config配置信息
M.BROADCAST_OTHER_EVT = 148; //跑马灯（广播）
M.CMD_INTERACT_PHIZ = 310; // #互动表情
M.CMD_INTERACT_PHIZ_NTF = 311; // #互动表情

M.WECHAT_GAME_LOGIN = 703; //微信小游戏登录

M.WECHAT_GAME_GETUSERINFO = 161; //用户登陆后获取用户信息授权

M.IS_DIFFERENT_WX_GROUP_REQ = 6603; //是否是不一样的微信群


//////////////////新协议start//////////////////////
//用户主动进桌，换桌
M.LORD_ENTER_DESK_REQ = 6500;

//用户主动进桌，换桌
M.LORD_ENTER_DESK_NEWEVENT_REQ = 30000;   //仅用于新赛事场

//用户主动,退桌
M.LORD_EXIT_DESK_REQ = 6502;

//叫分
M.LORD_CALL_REQ = 6504;

//叫分通知
M.LORD_CALL_NOTIFY = 6508;

//托管/取消托管
M.LORD_AUTO_PLAY_REQ = 6505;

//托管/取消托管通知
M.LORD_AUTO_PLAY_NOTIFY = 6511;

//出牌请求
M.LORD_DISCARD_REQ = 6506;

//出牌通知
M.LORD_DISCARD_NOTIFY = 6510;

//结算通知
M.LORD_RESULT_NOTIFY = 6507;

//游戏开始通知
M.LORD_START_NOTIFY = 6509;

//进桌通知
M.LORD_ENTER_DESK_NOTIFY = 6512;

//退桌通知
M.LORD_EXIT_DESK_NOTIFY = 6513;

//加倍请求
M.LORD_MUTI_REQ = 6514;

//加倍通知
M.LORD_MUTI_NOTIFY = 6515;

//查询牌桌
M.LORD_QUERY_DESK_REQ = 6516;

//客户端玩家定时器超时
M.LORD_OP_TIME_OUT_REQ = 6521;

//互动表情请求
M.LORD_INTERACT_PHIZ_REQ = 6522;

M.LORD_EMAIL_REQ = 6545;  /////邮件..

//////////////////新协议end//////////////////////

M.UPDATA_GOLD_EVT = 5001;    //单独通知用户金币变化

M.LORD_PLAYER_INFO_REQ = 160;       //获取个人信息

M.DDZ_PROTECT_NOTIFY = 6527; //cmd: 6527 破产保护

M.DDZ_USER_READY_REQ = 6528; //cmd: 6528 玩家准备请求
M.DDZ_USER_READY_NOTIFY= 6529; //cmd: 6529 玩家准备通知

M.DDZ_SHOW_CARD_NTF = 6531;      //cmd: 6531 明牌通知

M.DDZ_SHOW_CARD_REQ = 6530;  //cmd:6530 发牌过程中明牌请求

M.DDZ_DESK_MULTI_NOTIFY = 6533; //cmd: 6533 牌桌倍数变化通知
M.DDZ_DESK_MULTI_REQ = 6532; //cmd: 6532 查询牌桌倍数
M.DDZ_ROOM_CHECK_REQ = 6534; //cmd: 6534 进桌前检测是否进去了其他场次

M.DDZ_USER_STAND_REQ = 6535; //cmd: 6535 站起请求
M.DDZ_USER_STAND_NOTIFY = 6536; //cmd: 6536 站起通知
M.DDZ_USER_SITDOWN_REQ = 6537; //cmd: 6537 坐下请求
M.DDZ_USER_SITDOWN_NOTIF = 6538; //cmd: 6538 坐下通知

M.DDZ_OPUSER_NOTIFY = 6539;  //cmd 6539 牌桌当前操作者通知---暂用于发牌阶段结束通知抢地主

M.DDZ_GOLD_CHANGE_NOTIFY = 190;//cmd: 190 单独通知用户金币变化
//好友房间旁观玩家新建桌子
M.LORD_VIEWER_CREATE_DESK_REQ = 6540;
//玩家点击换桌
M.LORD_USER_CHANGE_DESK_REQ = 6541;
//反馈
M.LORD_FEEDBACK_REQ = 6544;
//战绩
M.LORD_ROUND_SETTLE_REQ = 6542;
//对局排行信息
M.LORD_ROUND_RANK_REQ = 6543;

//聊天
M.DDZ_GAME_CHAT_REQ = 145;
M.DDZ_GAME_CHAT_NOTIFY = 146;
//商城钻石兑换商品
M.PRODUCT_EXCHANGE_BY_DIAMOND = 194;

//cmd: 193 单独通知用户钻石变化
M.DDZ_DIAMOND_CHANGE_NOTIFY = 193;

//cmd: 149 通知购买商城物品成功了
M.DDZ_BUY_SUCCESS_NOTIFY = 149;

//cmd: 6546 新手福利请求
M.DDZ_FRESH_MAN_GIFT_REQ = 6546;

//cmd: 6547 领取福利请求
M.DDZ_RECEIVE_GIFT_REQ = 6547;

//cmd: 6548 检测能进的场次----金币限制
M.DDZ_CHECK_GOLD_LIMIT_REQ = 6548;

//cmd: 6549 房主踢人
M.DDZ_KICK_OUT_REQ = 6549;

//cmd: 6550 微信公众号
M.DDZ_FOCUS_GIFT_REQ = 6550;

//cmd: 196 记牌器请求
M.DDZ_CARD_COUNTER_DETAIL_REQ = 196;

//cmd: 197 分享成功后增加领取次数
M.DDZ_COUNTER_ADD_REQ = 197;

//cmd: 198 领取记牌器请求
M.DDZ_COUNTER_RECEIVE_REQ = 198;

//cmd: 199牌桌内分享领取记牌器
M.DDZ_DESK_COUNTER_RECEIVE_REQ = 199;

//cmd: 6551 用户未读消息的数量(目前只在登录时候推送)
M.DDZ_USER_UNREADNUM_NOTIFY = 6551;

//cmd:200同步人员的财产信息。 比如同步人员金币信息到客户端，后续可拓展其他
M.DDZ_USER_SYNC_FORTUNE_INFO_NOTIFY = 200;

//cmd:7550 赛事主页信息请求  630版本cmd: 30050
M.DDZ_MATCH_HOME_PAGE_INFO_REQ = 30050;

//cmd:7551 单独通知用户奖券变化
M.DDZ_LOTTERYTICKET_CHANGE_NOTIFY = 7551;

//cmd:7555 单独通知用户段位变化
M.DDZ_LEVEL_CHANGE_NOTIFY = 7555;

//cmd: 6552  获取兑换商品的信息
M.DDZ_EXCHANGE_CLASSIFY_REQ = 6552;

//cmd: 6553  兑换
M.DDZ_EXCHANGE_GOODS_REQ = 6553;

//cmd: 6554  修改地址
M.DDZ_EXCHANGE_ALTER_ADDRESS_REQ = 6554;

//cmd: 6555  兑换记录
M.DDZ_EXCHANGE_RECORD_REQ = 6555;

//cmd: 201 记牌器数量
M.DDZ_CARD_COUNTER_NOTIFY = 201;

//cmd: 6576 通知记牌器信息
M.DDZ_CARD_COUNTER_INFO_NOTIFY = 6576;

//cmd: 180 通知小红点
M.DDZ_RED_DOT_NOTIFY = 180;

//cmd: 181 获取邮件列表
M.DDZ_EMAIL_BOX_REQ = 181;

//cmd: 182 邮件领取请求
M.DDZ_EMAIL_RECEIVE_REQ = 182;

//cmd: 183 系统消息已查看请求
M.DDZ_SYSMESSAGE_READ_REQ = 183;

//cmd: 184 邮件消息通知
M.DDZ_UPDATE_MAIL_NOTIFY = 184;

//cmd: 202 背包
M.DDZ_KNAPSACK_INFO_REQ = 202;

//cmd: 7560 使用等级卡
M.DDZ_USER_LEVEL_CARD_REQ = 7560;

//cmd: 6558 牌桌信息分享成功后 回掉服务器接口
M.DDZ_GAME_SHARE_REQ = 6558;

//cmd: 204 春天分享领取记牌器
M.CARD_COUNTER_WITH_SPRING = 204;

//cmd: 6559 领取记牌器窗口是否需要弹出
M.DDZ_CARD_COUNTER_NEEDPOP_REQ = 6559;

//cmd: 6567 参赛有礼
M.DDZ_JOIN_MATCH_REWARD_REQ = 6567;

//cmd: 6568 参赛进度通知
M.DDZ_JOIN_MATCH_REWARD_NOTIFY = 6568;

//cmd: 6569 参赛有礼 领取奖励
M.DDZ_JOIN_MATCH_REWARDGET_REQ = 6569;

//cmd: 6570 参赛有礼 分享成功回调
M.DDZ_JOIN_MATCH_REWARDSHARE_REQ = 6570;

//cmd: 6571 所有分享成功回调
M.DDZ_COMSHARE_SUCBACK_REQ = 6571;

//cmd: 6573 参赛有礼是否在活动时间内
M.DDZ_IN_JOIN_MATCH_REWARD_REQ = 6573;

//cmd:6574 封号通知
M.DDZ_USER_LOGIN_OFF_NOTIFY = 6575;


//---------------------- DDZ 万元赛 begin ---------------------------------
//退桌
//cmd: 30002
M.DDZ_EVENT_EXIT_DESK_REQ = 30002;

//叫分
//cmd: 30004
M.DDZ_EVENT_USER_CALL_REQ = 30004;

//托管
//cmd: 30005
M.DDZ_EVENT_AUTO_PLAY_REQ = 30005;

//出牌
//cmd: 30006
M.DDZ_EVENT_DISCARD_REQ = 30006;

//加倍
//cmd: 30007
M.DDZ_EVENT_USER_MUTI_REQ = 30007;

//从后台切换回前台查询牌桌信息
//cmd: 30008
M.DDZ_EVENT_QUERY_DESK_REQ = 30008;

//客户端玩家定时器超时请求
//cmd: 30009
M.DDZ_EVENT_OP_TIME_OUT_REQ = 30009;

//牌桌倍数请求
//cmd: 30011
M.DDZ_EVENT_DESK_MULTI_REQ = 30011;

//查看加倍信息请求
//cmd: 30014
M.DDZ_GET_MULTINFO_630_REQ = 30014;

//玩家查询战绩
//cmd: 7542
M.DDZ_EVENT_ROUND_SETTLE_REQ = 7542;

//场次金币检测
//cmd: 7548
M.DDZ_EVENT_CHECK_GOLD_LIMIT_REQ = 7548;

//玩家查询赛事对局详情
//cmd: 30013
M.DDZ_ROUND_DETAIL_REQ = 30013;

//明牌过程中明牌请求 新赛事
//cmd: 30015
M.DDZ_SHOW_CARD_EVENT_630_REQ = 30015;

//玩家退赛兑奖信息
//cmd: 7553
M.DDZ_EXIT_MATCH_INFO_REQ = 7553;

//明牌通知
//cmd: 7531
M.DDZ_SHOW_CARD_EVENT_NTF = 7531;

//玩家退赛兑奖
//cmd: 7554
M.DDZ_EXIT_MATCH_REQ = 7554;

// cmd: 7556 ddz赛事世界排行榜 630以上版本cmd: 30061
M.DDZ_MATCH_LEADER_BOARD_INFO_REQ = 30061;

//玩家点击继续挑战
//cmd 30012
M.EVENT_USER_CHANGE_DESK_REQ = 30012;


// 玩家请求是否展示最强王者自动退赛兑奖弹窗
// cmd 7559
M.USER_AUTOMATIC_AWARD_REQ = 7559;

//---------------------- DDZ 万元赛 end ---------------------------------

//赛事广播
//cmd 6556
M.DDZ_EVT_BROADCAST = 6556;

//奖券模块 [banner]
//cmd: 203
M.DDZ_AWARD_INFO_DETAIL_REQ = 203;

//通知玩家排行榜的分数改变
//cmd: 7557
M.DDZ_MATCH_USER_BOARD_INFO_NTF = 7557;

//破产保护分享状态
//cmd: 6557
M.DDZ_BANKRUPTCY_SHARE_REQ = 6557;

//公众号点击关注有礼请求
//cmd: 6565
M.DDZ_SUBSCRIBEGIFT_REQ = 6565;
//公众号点击关注有礼
//cmd: 6566
M.DDZ_SUBSCRIBEGIFT_WINDOWEVT_NTF = 6566;
//窗口是否需要弹出
//cmd: 6563
M.DDZ_NEED_POP_REQ = 6563;

//邀请有礼
//cmd: 6560
M.DDZ_INVITE_REWARD_REQ = 6560;

//领取邀请有礼奖励
//cmd: 6561
M.DDZ_INVITE_REWARD_GET_REQ = 6561;

//通过邀请连接进入游戏处理
//cmd: 6564
M.BE_INVITER_ENTER_REQ = 6564;

//邀请有礼结果返回
//cmd: 6562
M.DDZ_INVITE_HELPRET_NTF = 6562;

//钻石活动结果返回
//cmd: 6602
M.DDZ_DIAMOND_ACTIVITY_HELPRET_NTF = 6602;

//背包检测有无等级卡
//cmd: 6572
M.DDZ_BACKPACK_LEVEL_CARD_REQ = 6572;

//流量主需求 查看广告数据
//cmd: 6574
M.USER_AD_INFO_REQ = 6574;

//是否是高段位
//cmd: 6577
M.DDZ_IS_HIGH_MATCH_LEVEL_REQ = 6577;

//金币场大厅相关
//cmd:601
M.COIN_HALL_REQ = 601;

//快速开始
//cmd:602
M.QUICK_START_REQ = 602;

//赛事邀请弹窗 cmd :6600
M.MATCH_INVITE_NEED_POP_REQ = 6600;

//红包信息 cmd:6605
M.REDPACKET_INFO_REQ = 6605;

//红包提现 cmd:6604
M.REDPACKET_GETCASH_REQ = 6604;

//红包奖励明细 cmd:6607
M.REDPACKET_REWARD_DETAIL_REQ = 6607;

//红包提现明细 cmd:6608
M.REDPACKET_GETCASH_DETAIL_REQ = 6608;

//残局通过数改变通知 cmd:8007
M.END_GAME_LEVEL_CHANGE_NTF = 8007;

//残局结算通知 cmd:7565
M.DDZ_END_GAME_OVER_EVT = 7565;

//活动获取钻石 cmd: 6601
M.DDZ_DIAMOND_REDPACKET_REQ = 6601;

//进入残局大厅 cmd: 8009
M.END_GAME_LOBBY_REQ = 8009;

//残局闯关提示 cmd:8011
M.ENDGAME_DDZ_REMIND = 8011;

//残局结算通知 cmd:8008
M.DDZ_END_GAME_OVER_EVT = 8008;

//钻石商城获得钻石 cmd: 6611
M.DDZ_DIAMOND_REWARD_REQ = 6611;

//点击获取钻石链接结果返回
//cmd: 6610
M.DDZ_REWARD_DIAMOND_CLICK_NTF = 6610;

//为成功邀请之后，邀请者会收到的通知
//cmd: 6614
M.DDZ_REWARD_DIAMOND_SUCCESS_NTF = 6614;

//cmd: 6615 查看国庆红包活动状态
M.DDZ_NATIONALDAY_REQ = 6615;

//cmd: 6616 国庆领取红包
M.DDZ_NATIONALDAY_GET_REQ = 6616;

M.DDZ_NEW_USER_GUIDANCE_REQ = 6620;//新手引导

//-----------------------------------残局--------------------------
//cmd: 8014 残局榜
M.DDZ_ENDGAME_RANK_SHARE = 8014;
M.ENDGAME_EXIT_DESK_REQ = 8002;//残局退桌
M.ENDGAME_DISCARD_REQ = 8003;//残局出牌请求
M.ENDGAME_QUERY_DESK_REQ = 8004;//残局后台切换查询牌桌请求
M.ENDGAME_CHECK_LEVEL_COST = 8010;//残局查询关卡消耗
M.ENDGAME_RESET_GAME_REQ = 8013;//残局重玩请求

//国庆活动
M.DDZ_NATIONALDAY_BONUSESHELP_NTF = 6617;//国庆活动助攻成功通知
M.DDZ_NATIONALDAY_BONUSESHELPER_REQ = 6618;//国庆活动助攻列表请求

//CMD: 7561 领取金币宝箱
M.PICK_GOLD_BOX_REQ = 7561;

M.DDZ_MATCH_GUIDE_REQ = 6619;//赛事引导获得奖励

M.DDZ_MATCH_GUIDE_INFO_REQ = 6621;//赛事引导信息获取

// cmd: 6622 金币不足引导
M.DDZ_GOLD_GUIDE_NTF = 6622;

M.DDZ_TASK_INFO_REQ = 6624;//任务列表
M.DDZ_PICK_TASK_REWARD_REQ = 6625;// 领取任务奖励
M.DDZ_TASK_RECHARGE_SUCC_NTF = 6626;//每日任务充值成功
M.DDZ_PICK_LUCKY_TASK_REWARD_REQ = 6627;// 领取幸运任务奖励

M.GET_SHARE_INFO_REQ = 6623; //客户端拉取最新分享图文信息

//地主第一手明牌加倍
M.DDZ_LAND_LORDSHOWCARD_REQ = 6628;

//cmd: 6634 退出连胜询问
M.DDZ_WIN_STREAK_TASK_EXIT_REQ = 6634;

//cmd: 6631 查看连胜任务详情
M.DDZ_WIN_STREAK_TASK_REQ = 6631;

//cmd: 6633 领取任务奖励
M.DDZ_WIN_STREAK_TASK_PICK_REQ = 6633;

//cmd: 6630 获得加倍信息
M.DDZ_GET_MULTINFO_REQ = 6630;

//cmd:6632 查询任务
M.DDZ_WIN_STREAK_TASK_QUERY_REQ = 6632;

//600版本钻石活动
//cmd:6641 请求助力好友数据
M.DIAMOND_ACTIVITY_REDPACKET_REQ = 6641;
//cmd:6642 助力领取奖励
M.DIAMOND_ACTIVITY_REDPACKET_PICK = 6642;
//cmd:6637 请求邀请有礼数据
M.DIAMOND_ACTIVITY_INVITE_REQ = 6637;
//cmd:6638 邀请有礼领取奖励
M.DIAMOND_ACTIVITY_INVITE_PICK = 6638;
//cmd: 6635 语音请求
M.DDZ_VOLTE_MSG_REQ = 6635;

//cmd: 6636 语音通知
M.DDZ_VOLTE_MSG_NTF = 6636;

// 好友房解散牌桌投票 cmd:6639
M.DDZ_DISMISS_VOTE_REQ = 6639;

// 好友房解散牌桌投票 cmd:6640
M.DDZ_DISMISS_VOTE_NTF = 6640;

//好友房切后台查询解散牌桌状态 cmd:6643
M.DDZ_DISMISS_QUERY_REQ = 6643;

// CMD: 30051 630版本赛事场引导
M.DDZ_COMPETITION_VIEW_GUIDE = 30051;

// CMD: 30052 使用宝箱
M.USE_MATCH_BOX_REQ = 30052;

// CMD: 30017 保星请求
M.STAR_PROTECT_REQ = 30017;

// CMD: 30055 头像框列表
M.ICON_FRAME_LIST_REQ = 30055;

// CMD: 30056 使用头像框
M.USE_ICON_FRAME_REQ = 30056;
// CMD: 30060 兑换新奖券
M.EXCHANGE_NEW_COUPON = 30060;

// CMD: 30058 保星二次弹窗通知
M.STAR_PROTECT_AGAIN_REQ = 30058;

// CMD: 30062 赛事段位更新通知
M.MATCH_LV_CHANGE_NTF = 30062;

export default M;