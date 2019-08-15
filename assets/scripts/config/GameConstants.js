//牌桌内通用常量整理

let GameConstants = {};

//正常开始 1 明牌开始 2
GameConstants.GAME_START_TYPE = {
    NORMAL: 1,
    SHOW: 2,
};

GameConstants.DESK_MODE_NORMAL = 1; //标准房
GameConstants.DESK_MODE_FRIEND = 2; //好友房
GameConstants.DESK_MODE_EVENT = 3; //万元赛事
GameConstants.DESK_MODE_ENDGAME = 4; //残局
GameConstants.DESK_MODE_NEWEVENT = 5; //新赛事

GameConstants.START_MODE_NORMAL = 1; //1：正常开始， 2：明牌开始
GameConstants.START_MODE_OPEN = 2; //1：正常开始， 2：明牌开始

GameConstants.BATTLE_TYPE_NORMAL = 1; //1经典场 2.癞子玩法
GameConstants.BATTLE_TYPE_LAIZI = 2; //2.癞子玩法
GameConstants.BATTLE_TYPE_UNSHUFFLE = 3; //3.不洗牌玩法

//道具类型，0：所有道具；1：房卡 2:钻石 3:斗地主门票(仅斗地主) 4.斗地主奖券
GameConstants.USER_PROP_TYPE_ALL = 0;
GameConstants.USER_PROP_TYPE_ROOM_CARD = 1;
GameConstants.USER_PROP_TYPE_DIAMOND = 2;
GameConstants.USER_PROP_TYPE_TICKET = 3;
GameConstants.USER_PROP_TYPE_VOUCHER = 4;

//消耗 类型，0：无消耗 1.消耗金币 2.消耗钻石 3.消耗门票
GameConstants.GAME_USE_MONEY_TYPE_NONE = 0;
GameConstants.GAME_USE_MONEY_TYPE_COIN = 1;
GameConstants.GAME_USE_MONEY_TYPE_DIAMOND = 2;
GameConstants.GAME_USE_MONEY_TYPE_TICKET = 3;

//赛事广播level级别
GameConstants.BROADCAST_EVENT_LEVEL = 600;

GameConstants.CHAT_CONTENT_TYPE = {
    EXPRESSION: 0,
    NORMAL_VOICE: 1,
    TEXT: 2,
    TENCENT_GVOICE: 3
};

GameConstants.NETWODK_SPEED_TIME = {
    FAST: 150,
    COMMON: 300,
    SLOW: 600,
    OUT: 1000
};

//特殊处理的错误码
GameConstants.NET_WORK_STATUS = {
    SUCCESS: 0, //成功
    TIMEOUT: -200, //超时
    NOT_LOGIN: 14, //未登录
    FORBID_VIEWER: 1365, //当前牌桌已满, 不允许旁观
    GOLD_NOT_ENOUGH: 1369, //赛事报名钱不够
    GAME_STOPING: 1074, //游戏服务器维护中
    GAME_NO_TOAST: 1370, //此错误码不在TOAST显示
    DIAMOND_NOT_ENOUGH: 1383, //钻石不足
};

//牌型
GameConstants.LordPokerType = {
    DANZHANG: 1,
    DUIZI: 2,
    SAN: 30,
    SANDAI1: 31,
    SANDAIDUIZI: 32,
    SHUNZI: 40,
    SHUNZIDUIZI: 41,
    FEIJI: 50,
    FEIJI1: 51,
    FEIJI2: 52,
    ZHADAN2: 60,
    ZHADAN4: 61,
    RUANZHADAN: 70,
    ZHADAN: 71,
    YINGZHADAN: 72,
    WANGZHA: 73,
    UNKOWNTYPE: -1,
};

//游戏状态
GameConstants.LordGameStatus = {
    GAME_STATE_READY: 0, //准备中
    GAME_STATE_FAPAI: 5, //发牌中
    GAME_STATE_QDZ: 10, //抢地主
    GAME_STATE_MUTIPLE: 20, //加倍中
    GAME_STATE_INGAME: 30, //游戏中
};

//操作不要
//server 玩家选择：加倍 -1:还没做出选择 叫分 -1:还未选择叫分
GameConstants.LordPokerOper = {
    NOSELECT: -1,
    CHUPAI: 1,
    BUYAO: 2,
};

//人机赛自动不要 1：标识自动不要  0: 玩家操作
GameConstants.LordPokerAutoOper = {
    CHUPAI: 0,
    BUYAO: 1,
};

GameConstants.LordPokerAutoLastOper = {
    NOTAUTO: 0,
    AUTO: 1,
};

//服务端返回的需特殊处理的错误码
GameConstants.SERVER_ERROR = {
    GPS_IP_CONFILCT: 1196, //GPS/IP限制，禁止坐下
    OTHER_ALREADY_SITDOWN: 1033, //其他人已经坐在该位置上
    NOT_LOGIN: 14 //未登录
};

//状态 1010站起， 1018坐下未准备， 1020坐下已准备， 1030游戏中
GameConstants.UserStatus = {
    USER_STATE_DEFAULT: 1000, //不存在(进入游戏时初始化时的默认状态)
    USER_STATE_STAND: 1010, //站起 旁观中
    USER_STATE_SIT_UNREADY: 1018, //坐下未准备
    USER_STATE_SIT_READYED: 1020, //坐下，坐下已准备
    USER_STATE_INGAME: 1030, //  玩游戏中
};

//发牌过程中明牌倍数
GameConstants.SHOW_CARD_MULTIPLE = {
    TWO: 2, //2倍
    THREE: 3, //3倍
    FOUR: 4, //4倍
};


//进出场类型
GameConstants.INOUT_TYPE = {
    IN: 1, //入场
    OUT: 2, //退场
};

GameConstants.ROOM_LEVEL = {
    NOVICE: 1, //新手场
    PRIMARY: 2, //初级场
    NORMAL: 3, //普通场
    MEDIUM: 4, //中级场
    ADVANCED: 5, //高级场
    SUPER: 6, //顶级场
};

GameConstants.OPER_BTN_STAUTS = {
    UNSHOW: 0, //不显示
    SHOW: 1, //不显示
    UNABLE: -1, //灰色不可用
};

GameConstants.CALL_SCORE = {
    ZERO: 0, //不叫
    ONE: 1, //1分
    TWO: 2, //2分
    THREE: 3, //3分
};

GameConstants.EXIT_REASON = {
    NORMAL: 0, //玩家主动发起退桌
    OVER: 1, //牌桌正常结束
    KICK: 2, //被房主踢出房间
    TIMEOUT: 3, //长时间未准备
    EVENT_OVER: 5, //赛事牌桌解散并退桌
};

GameConstants.LaunchOptions = {
    //type: 1邀请有礼 2红包
    type: "type",
    uuid: "uuid",
    desk_id: "desk_id",
    room_id: "room_id",
    from_uin: "from_uin",
    TYPE_INVITE_FRIEND: "1", //邀请有礼
    TYPE_RED_PACKET: "2", //红包
    TYPE_GAME_INVITE: "3", //游戏内邀请
    TYPE_FRIEND_FROOM_INVITE: "4", //好友房内邀请
    TYPE_RULES_INVITE: "5", //规则界面邀请
    TYPE_APP_SHARE: "6", //小游戏自带转发
    TYPE_COUNTER_SHARE: "7", //记牌器分享
    TYPE_COUNTER_INVITE: "8", //记牌器邀请
    TYPE_GROUP_RANK_SHARE: "9", //群排行分享
    TYPE_GAME_OVER_SHARE: "10", //比赛结算分享
    TYPE_EXIT_SHARE: "11", //退赛分享
    TYPE_EXCHANGE_SHARE: "12", //兑换分享
    TYPE_GROUP_SELFRANK_SHARE: "13", //群排行炫耀一下
    TYPE_BEST_RANK_SHARE: "14", //最强王者分享
    TYPE_BANKRUPT_SHARE: "15", //破产保护分享
    TYPE_CLASSIC_GAME_OVER_SHARE: "16", //经典场结算分享
    wxgzh_type: "DDZWXGZHGZYL", //关注有礼
    TYPE_INVITATION_SHARE: "17", //邀请有礼点击邀请
    TYPE_EVENTACTIVITY_SHARE: "18", //赛事活动限时有礼
    TYPE_REWARD_DIAMOND_SHARE: "19", //获取钻石分享
    TYPE_REWARD_DIAMOND_INVITE: "20", //获取钻石邀请
    TYPE_DIAMONDACTIVITY_SHARE: "21", //钻石活动-红包分享
    TYPE_DIAMONDACTIVITY_INVITE_SHARE: "22", //钻石活动-邀请有礼分享
    TYPE_FIRST_ENTER_ENDGAME: "23", //每日首次进入残局大厅
    TYPE_END_GAME_GROUP_RANK_SHARE: "24", //排行榜群排行分享
    TYPE_WELFARE_SHARE: "25", //登录礼包分享
    TYPE_NATIONALDAY_SHARE: "26", //国庆红包邀请好友助攻
    TYPE_FLOWMAIN_SHARE: "27", //流量主分享
    TYPE_CLASSIC_RESULT_SHARE: { //经典场结算分享 区分类型
        SHARE_DOUBLE: "28", //分享翻倍
        SHARE_EXCUSE_LOSING: "29", //分享免输
        HIGH_CONTINUOUS_WIN: "30", //高连胜
        HIGH_MUTIPLE: "31", //高倍数
        SPRING: "32", //春天
    },
    TYPE_COMPETITION_RESULT_SHARE: { //比赛场结算分享 区分类型
        WIN: "33", //胜利
        LOSE: "34", //失败
        SAVE: "35", //保级
    },
    TYPE_ENDGAME_RESULT_WIN: "36", //残局结算胜利分享
    TYPE_EVENT_WANGZHE_SHARE: "37", //赛事晋级王者分享
};

GameConstants.ReportKeys = {
    gold: "gold", //上报金币
    week_win_times: "week_win_times", //每周赢取的底池数量
    score: "score", //竞技分
};

GameConstants.FRIEND_BASE_SCORE = 1; //好友房默认底分

GameConstants.GAME_CHAT_TYPE_FACE = 0; //表情
GameConstants.GAME_CHAT_TYPE_VOICE = 1; //语音
GameConstants.GAME_CHAT_TYPE_TXT = 2; //文本（用户输入）
GameConstants.GAME_CHAT_TYPE_SYSTEM_TXT = 3; //文本（系统配置）

GameConstants.SHOP_REF = 1; //购买场景来源商城

GameConstants.TYPE_CLASSIC_RESULT_SHARE = {
    3: GameConstants.LaunchOptions.TYPE_CLASSIC_RESULT_SHARE.SHARE_DOUBLE,
    8: GameConstants.LaunchOptions.TYPE_CLASSIC_RESULT_SHARE.SHARE_EXCUSE_LOSING,
    6: GameConstants.LaunchOptions.TYPE_CLASSIC_RESULT_SHARE.HIGH_CONTINUOUS_WIN,
    7: GameConstants.LaunchOptions.TYPE_CLASSIC_RESULT_SHARE.HIGH_MUTIPLE,
    1: GameConstants.LaunchOptions.TYPE_CLASSIC_RESULT_SHARE.SPRING,
};

GameConstants.TYPE_COMPETITION_RESULT_SHARE = {
    1: GameConstants.LaunchOptions.TYPE_COMPETITION_RESULT_SHARE.WIN,
    2: GameConstants.LaunchOptions.TYPE_COMPETITION_RESULT_SHARE.LOSE,
    3: GameConstants.LaunchOptions.TYPE_COMPETITION_RESULT_SHARE.SAVE,
};

GameConstants.OP_FLAG = {
    NORMAL: 0, //无标记。正常操时间
    SHORT: 1, //要不起时，当前操作者时间变短
};

GameConstants.NEW_POKER_TYPE = {
    NORMAL: 0, //正常牌
    OTHERSHOW: 1, //其他人SHOW出的牌
    BOTTOM: 2, // 地主底牌
};

GameConstants.INGAME = {
    FALSE: 0, //否
    TRUE: 1, //是
};

GameConstants.OVER_FLAG = {
    FALSE: 0, //否
    TRUE: 1, //是
};

GameConstants.CounterRecevieType = {
    SHARE: 1, //分享
    INVITE: 2, //邀请
};

GameConstants.ShareMsgType = {
    SHARE: 1, //立即分享
    INVITE: 2, //立即邀请
    GAMEINVITE: 3, //好友游戏邀请
    GAMEOVER: 4, //比赛场结算分享
    EXITSHARE: 5, //退赛分享
    EXCHANGESHARE: 6, //兑换分享
    GROUPSELFRENKSHARE: 7, //群排行炫耀一下
    BESTRANKSHARE: 8, //最强王者分享
    GROUPRENKSHARE: 9, //查看群排行
    BANKRUPT: 10, //破产保护
    GAMEOVERCLASSICSHARE: 11, //经典场结算分享
    INVITATION: 12, //邀请有礼
    EVENTACTIVITY: 13, //赛事活动限时有礼
    ENDGAMEOVERSHARE: 14, //残局结算分享
    REWARDDIAMONDSHARE: 15, //获取钻石分享
    REWARDDIAMONDINVITE: 16, //获取钻石邀请
    REWARDLOGINAWARDSHARE: 17, //登陆奖励分享
    TYPEFLOWMAINSHARE: 18, //流量主分享
    NATIONALDAYSHARE: 19, //国庆活动分享（微信分享）
    NATIONALDAYSHARE_QRCODE: 20, //国庆活动分享（二维码）
    CLASSIC_RESULT_SHARE_DOUBLE: 21, //经典场结算分享翻倍
    CLASSIC_RESULT_SHARE_EXCUSE_LOSING: 22, //经典场结算分享免输
    CLASSIC_RESULT_HIGH_CONTINUOUS_WIN: 23, //经典场结算高连胜
    CLASSIC_RESULT_HIGH_MUTIPLE: 24, //经典场结算高倍数
    CLASSIC_RESULT_SPRING: 25, //经典场结算春天
    COMPETITION_RESULT_WIN: 26, //比赛场结算胜利
    COMPETITION_RESULT_LOSE: 27, //比赛场结算失败
    COMPETITION_RESULT_SAVE: 28, //比赛场结算保级
    ENDGAME_RESULT_WIN: 29, //残局结算胜利
    ENDGAMEGROUPRENK: 30, //残局查看群排行
    APPSHARE: 31, //小游戏自带分享
    ENDGAMEDOUBLEDIAMOND: 32, //残局每日登录分享双倍钻石
    DIAMONDREDPACKET: 33, //钻石活动-红包分享
    DIAMONDINVITE: 34, //钻石活动-邀请有礼分享
};

GameConstants.PERFORMANCE_CLICK_DESK_SETTING_TAB = {
    HELP: 1, //帮助
    FEEDBACK: 2, //反馈
    ABOUT: 3, //关于
};

GameConstants.PERFORMANCE_CLICK_ACTIVITY = {
    COUNTER: 1, //记牌器
    HOLIDAY: 2, //节日活动
    NOVICE: 3, //新手福利
};

//时钟位置
GameConstants.CountDownNodePosition = {
    ONE: { x: 246, y: 507 }, //1个按钮时的位置
    TWO: { x: 338, y: 507 }, //2个按钮时的位置
    THREE: { x: 246, y: 507 }, //3个按钮时的位置
    FOUR: { x: 184, y: 507 }, //4个按钮时的位置
};

//出现时钟时的按钮个数
GameConstants.CountDownNum = {
    ONE: 1, //1个按钮
    TWO: 2, //2个按钮
    THREE: 3, //3个按钮
    FOUR: 4, //4个按钮
};

//菜单项
GameConstants.MenuItemId = {
    EXIT: 1, //退出
    AUTOPLAY: 2, //托管
    STANDUP: 3, //站起
    SET: 4, //设置
};
//领取类型
GameConstants.rewardType = {
    COIN: 1, //金币
    CARDCOUNTER: 2, //记牌器
    REWARD: 3, //奖券
    DIAMOND: 4, //钻石
    MATCH_LEVEL: 5, //赛事等级
    REDPACKET: 6 //红包
};

//模块是否显示
GameConstants.moduleVisible = {
    FALSE: 0, //不显示
    TRUE: 1, //显示
};

//模块类型
GameConstants.moduleConfig = {
    WELFARE: 1, //新手福利
    COUNTER: 2, //记牌器
    FOCUS: 3, //关注有礼
    EVENTINVITE: 4, //赛事邀请
    ENTRANCE: 5, //赛事入口选图
    ALLACTIVTY: 6, //活动总开关
    EXCHANGE: 7, //兑换界面
    INVITATION: 8, //邀请有礼
    EVENTACTIVITY: 9, //赛事活动
    BANKUP: 10, //破产补助分享加赠
    CIRCLEBTN: 11, //进入圈子按钮
    MAINFLOW: 12, //流量主
    UNSHUFFLE: 13, //不洗牌玩法
    NATIONALDAY: 14, // 国庆活动
    TASK: 15, //牌桌内的任务系统
};

//新手福利延迟时间，需在Main的动画0.3秒播放后再检测
GameConstants.WELFARE_DELAY_TIME = 0.4;

//新手福利是否已经弹过
GameConstants.WELFARE_SHOWED = {
    FALSE: 0, //未弹过
    TRUE: 1, //弹过
};

GameConstants.ShareScene = {
    MAIN: 1, //大厅
    GAME: 2, //牌桌
};

//段位
GameConstants.MATCH_LEVEL = {
    QINGTONG: 10, //青铜
    BAIYING: 20, //白银
    HUANGJIN: 30, //黄金
    BOJIN: 40, //铂金
    ZHUANSHI: 50, //钻石
    DASHI: 60, //大师
    WANGZHE: 70, //王者
};

GameConstants.MAIN_MENU = {
    TWO: { width: 246, height: 165 },
    THREE: { width: 365, height: 165 },
};

//第几副牌
GameConstants.ROUND_INDEX = {
    ONE: 0,
    TWO: 1,
    THREE: 2,
    FOUR: 3,
    FIVE: 4,
    SIX: 5,
};

//0:无 1.金币 2.奖券 3.记牌器 4.等级卡 5.超级加倍卡
GameConstants.PROPERTY_TYPE = {
    NULL: 0,
    GOLD: 1,
    LOTTERY_TICKET: 2,
    CARD_COUNTER: 3,
    GRADE_CARD: 4,
    DOUBLE_CARD: 5,
};

//自定义大段位
GameConstants.RESULT_BIG_SEG = {
    QTONG: 10,
    SILVER: 20,
    GOLD: 30,
    DIAMOND: 40,
    DASHI: 50,
    WANGZHE: 60,
};

//排行榜
GameConstants.RANK_TYPE = {
    WORLD: 1,
    FRIEND: 2,
    GROUP: 3,
    FRIENDPAGING: 4,
    GROUPPAGING: 5,
    DRAWFRIEND: 6,
    DRAWGROUP: 7,
    ENDGAMEHALLFRIEND: 8, //残局大厅
    ENDGAME_FRIEND: 9,
    ENDGAME_FRIENDPAGING: 10,
    ENDGAME_DRAWFRIEND: 11,
    ENDGAME_GROUP: 12,
    ENDGAME_GROUPPAGING: 13,
    ENDGAME_DRAWGROUP: 14,
    MAINHALL_MYRANKNUM: 15, // 主界面大厅自己通关排名
};

//结算流局
GameConstants.RESULT_IS_ABOLISH = {
    TRUE: 1,
    FALSE: 0,
};

//总结算标示
GameConstants.RESULT_OVER_FLAG = {
    TRUE: 1,
    FALSE: 0,
};

//一副牌 输赢 0:输了 1:赢了 2:保级
GameConstants.RESULT_WIN_OR_LOSE_FLAG = {
    LOSE: 0,
    WIN: 1,
    SAVE: 2,
};

//小红点类型
GameConstants.RED_DOT_TYPE = {
    REWARDMAIL: 1, //邮件
    SYSTEMMAIL: 2, //系统消息
    INVITATION: 3, //邀请有礼
    EVENTACTIVITY: 4, //赛事活动有礼
    DIAMOND_REDPACKET: 5, //钻石红包
    TASK: 6, //牌桌任务
    EXCHANGE_CENTER: 7, //兑换中心
};

//跑马灯类型配对
GameConstants.BROADCAST_TYPE = {
    100: "MATCH",
    200: "EXCHANGE",
    300: "CUSTOM",
    400: "CONFIG",
};

//跑马灯等级 1最高 2其次 以此类推
GameConstants.BROADCAST_LEVEL = {
    "NONE": 0, //没有跑马灯
    "CUSTOM": 1, //后台自定义
    "EXCHANGE": 2, //兑换
    "MATCH": 2, //赛事
    "CONFIG": 3, //配置
};
//结算分享
GameConstants.SHARE_RESULT_TYPE = {
    NONE: 0, //不能分享
    SAVELEVEL: 50, //降级保护
};

//赛事结算分享1:炫耀一下 2:吐槽一下 3:分享保级 4:分享保级成功后炫耀一下
GameConstants.EVENT_RESULT_SHARE_TYPE = {
    WIN: 1,
    LOSE: 2,
    SAVE: 3,
    SAVESUCCESS: 4,
};

//模块窗口类型
GameConstants.MODULE_TYPE = {
    INVITATION: 1001, //邀请有礼
};

//是否需要弹出模块
GameConstants.MODULE_NEED_POP = {
    NO: 0, //不需要
    YES: 1, //需要
};

//是否展示小红点
GameConstants.SHOW_RED_DOT = {
    NO: 0, //不展示
    YES: 1, //展示
};

GameConstants.INVITATION_BUTTON_STATE = {
    DJYQ: 1, //点击邀请
    CJLB: 2, //超级礼包
    LQWB: 3, //领取完毕
};

GameConstants.INVITATION_RET_HELP = {
    SUCCESS: 0, //成功

};

GameConstants.INVITE_TYPE = {
    NORMALINVITE: 1000,
    INVITATION: 1001, //邀请有礼
    DIAMONDACTIVITY: 1002, //钻石红包
    REWARDDIAMOND: 1003, //获取钻石
    DIAMONDACTIVITY_INVITE: 1004, //钻石活动-邀请有礼
    DAILY_ENDGAME_ENTER: 1005,
    NATIONALDAY_INVITE: 1006, //国庆分享
    NATIONALDAY_QRCODE_INVITE: 1007, //国庆分享
};

GameConstants.INVITATION_RET_TYPE = {
    SUCCESS: 0, //助力成功
    JRBNZBZHY: 1, //今日不能再帮助好友
    HYYJBXYBZ: 2, //好友已经不需要帮助
    YJBZGGHY: 3, //已经帮助过该好友
    ZJGZJZL: 4, //自己给自己助力
};

GameConstants.DIAMOND_INVITATION_RET_TYPE = {
    SUCCESS: 0, //助力成功
    HYHBDDSX: 1, //好友红包达到上限
    YJDJG: 2, //已经点击过钻石红包链接
    ZJGZJZL: 3, //点击自己的链接
};

GameConstants.EVENTACTIVITY_GIFT_STATE = {
    UNDO: 1, //未完成
    DOING: 2, //进行中
    DONE: 3, //已完成
};

GameConstants.EVENTACTIVITY_TASK_STATE = {
    UNDO: 0, //未完成
    DONE: 1, //已完成
};

GameConstants.EVENTACTIVITY_RECIEVE_STATE = {
    UNRECIEVE: 1, //不能领取
    RECIEVEING: 2, //可以领取
    RECIEVED: 3, //已领取
};

//检测有无等级卡
GameConstants.BACKPACK_LEVEL_CARD = {
    NO: 0, //没有等级卡
    YES: 1, //有等级卡
};

//流量主请求类型
GameConstants.FLOWMAIN_TYPE = {
    GET: 0, //获取数据
    NORMAL: 1, //普通奖励
    SHARE: 2, //分享双倍奖励
    OVER: 3, //看完了广告, 返回新次数的状态
};

//流量主状态
GameConstants.FLOWMAIN_STATE = {
    OVER: -1, //次数已用完
    CANPLAY: 0, //可播放
    NEXTTIME: 1, //下次可播放时间
};

//底牌翻倍类型 1:大王 2:小王 3:同花 4:顺子 5:大王小王 6:同花顺 7:三张
GameConstants.HoleCardsType = {
    L_JOKER: 1,
    S_JOKER: 2,
    TONGHUA: 3,
    SHUNZI: 4,
    DOUBLE_JOKER: 5,
    TONGHUASHUN: 6,
    SANZHANG: 7
};

GameConstants.TABLE_RES_NAME = {
    1: "classicfriendtable",
    2: "classicfriendtable",
    3: "eventtable",
    4: "endgametable",
};

GameConstants.SHARE_DIALOG = {
    NATIONALDAYDIALOG: 1,
    EXITCOMPETITION: 2, //成功兑奖分享
    EVENTGROUPRANK: 3, //赛事查看群排行
    ENDGAMERANK: 4, //残局查看群排行
    WELFARE: 5, //登陆奖励分享
    INVITATION: 6, //金币邀请有礼
    DIAMONDINVITATION: 7, //钻石邀请有礼
    DIAMONDREDPACKET: 8, //钻石红包
    REWARDDIAMOND: 9, //获取钻石
    FRIEND: 10, //好友房邀请
    COUNTER: 11, //记牌器
    ENDGAMEOVERWIN: 12, //残局胜利结算
};

GameConstants.GUIDE_TYPE = {
    ENDGAME_LOGIN_REWARD: 10, //残局每日首次奖励引导
    ENDGAME_FIRST_LEVEL: 20, //残局玩家首次点击第一关引导
    ENDGAME_FIRST_FAIL: 30, //残局玩家首次闯关失败引导
    ENDGAME_FIRST_SUCCESS: 40, //残局玩家首次闯关成功引导
    FRIEND_MENU: 50, //好友房玩家首次点击左上角引导
    FRIEND_STANDUP: 60, //好友房玩家首次站起引导
    FIRST_LOGIN_REWARD: 70 //首次登陆奖励引导
};

//牌型自动调整
GameConstants.CARDTYPEAUTOADJUST_COUNT = {
    NINE: 9,
    TEN: 10,
    ELEVEN: 11,
    TWELVE: 12,
};

GameConstants.CARD_TYPE = {
    ZHADAN: 19,
    WANGZHA: 20,
};

GameConstants.SHARE_STRING_KEY = {
    MATCH_SHARE_WIN_300: 'match_share_win_300', // 赛事赢了分享
    MATCH_SHARE_LOSS_300: 'match_share_loss_300', // 赛事输了分享
    MATCH_SHARE_PROTECT_300: 'match_share_protect_300', // 赛事保级分享
    FRIEND_ROOM_SHARE_300: 'friend_room_share_300', // 好友房分享
    LEADER_BOARD_SHARE_300: 'leader_board_share_300', // 排行榜分享
    PUBLIC_SHARE_300: 'public_share_300', // 公用图片
    INVITE_REWARD_SHARE_300: 'invite_reward_share_300', // 邀请有礼
    USER_BROKE_SHARE_300: 'user_broke_share_300', // 破产补助
    CARD_AD_SHARE_300: 'card_ad_share_300', // 记牌器分享
    END_GAME_WIN_SHARE_450: 'end_game_win_share_450', // 残局胜利分享
    END_GAME_HALL_SHARE_450: 'end_game_hall_share_450', // 残局大厅分享
    END_GAME_RANK_SHARE_450: 'end_game_rank_share_450', // 残局榜分享
    DIAMOND_ACTIVITY_RED_PACKET_450: 'diamond_activity_red_packet_450', // 钻石获取活动, 钻石红包
    DIAMOND_ACTIVITY_INVITE_450: 'diamond_activity_invite_450', // 钻石获取活动, 邀请奖励
    DIAMOND_ACTIVITY_STORE_450: 'diamond_activity_store_450', // 钻石获取活动，商城分享
    FRESH_GIFT_SHARE_460: 'fresh_gift_share_460', // 登入礼包，分享双倍
    AD_SHARE_480: 'ad_share_480', // 流量主分享
    BONUSES_1001_SHARE_480: 'bonuses_1001_share_480', // 国庆红包活动
    PROMOTION_GUIDE_SHARE_500: 'promotion_guide_share_500', // 晋级引导炫耀好友群
    GOLD_BOX_500: 'gold_box_500', // 金币宝箱分享
};

GameConstants.TOP_LAYER_ZORDER = {
    TOAST: 9999,
    WAITTING: 999,
    BROADCAST: 99,
};

GameConstants.WIN_STREAK_STATUS = {
    NORMAL: 1, //默认
    REDDOT: 2, //有红点
    CANRECEIVE: 3, //奖励未领取
    GRAY: 4, //灰色
};

GameConstants.WIN_STREAK_DETAIL_STATUS = {
    CANRECEIVE: 1, //可领取
    UNFINISHED: 2, //未完成
};

GameConstants.DISBAND_STATUS = {
    WAIT: 0,
    ORIGIN: 1,
    AGREE: 2,
    DISAGREE: 3,
};

GameConstants.APP_FROM = {
    AD: "CN_AD_APPWYDDZ",
    IOS: "CN_IOS_APPDDZ"
};

export default GameConstants;