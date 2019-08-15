
//返回唯一标识符，仅用于事件定义
let __uuid = 0;
let getUID = function () {
    __uuid = __uuid + 1;
    return "UUID" + __uuid.toString();
};


let M = {};

//网络连接成功
M.BASIC_NET_CONNECT_SUCCESS = getUID();

M.SHOW_PROMPT_DIALOG = getUID(); //显示通用提示框
M.REMOVE_PROMPT_DIALOG = getUID(); //移除通用提示框

M.GLOBAL_TOAST = getUID(); //吐司

//应用前后台切换事件
M.APPLICATION_ACTIONS_EVENT = getUID();

//游戏前后台切换事件
M.GAME_ACTION_EVENT = getUID();

M.EXIT_LORD_GAME = getUID() //退出牌桌

M.GLOBAL_REMOVE_TOAST = getUID(); // 删除吐司
M.OPEN_VIEW_DIALOG = getUID(); // 打开对话框
M.REMOVE_VIEW_DIALOG = getUID(); // 删除对话框
M.INTERACT_PHIZ_NTF = getUID(); // 互动表情

M.GLOBAL_SHOW_WAITING = getUID(); //显示透明全屏等待
M.GLOBAL_REMOVE_WAITING = getUID(); //移除透明全屏等待

//进入房间
M.NET_INPUT_REQ = getUID();

M.GLOBAL_SINGLE_TOAST = getUID(); //打开单个吐司
M.GLOBAL_REMOVE_SINGLE_TOAST = getUID(); // 删除单个吐司

//////////////////////////////斗地主事件 start//////////////////////////////////////

//退桌
M.LORD_NET_EXIT_DESK_REQ = getUID();

//叫分
M.LORD_NET_CALL_POINT_REQ = getUID();

//托管
M.LORD_NET_AUTO_PLAY_REQ = getUID();

//打牌
M.LORD_NET_DISCARD_REQ = getUID();

//退桌通知
M.LORD_NET_EXIT_DESK_NOTIFY = getUID();

//进桌通知
M.LORD_NET_ENTER_DESK_NOTIFY = getUID();

//结算通知
M.LORD_NET_RESULT_NOTIFY = getUID();

//叫分通知
M.LORD_NET_CALL_POINT_NOTIFY = getUID();

//游戏开始通知
M.LORD_NET_START_GAME_NOTIFY = getUID();

//打牌通知
M.LORD_NET_DISCARD_NOTIFY = getUID();

//托管通知
M.LORD_NET_AUTO_PLAY_NOTIFY = getUID();

//加倍请求
M.LORD_NET_MUTI_REQ = getUID();

//加倍通知
M.LORD_NET_MUTI_NOTIFY = getUID();

//倒计时超时请求
M.LORD_NET_OP_TIME_OUT_REQ = getUID();

M.LORD_FEEDBACK_EVENT = getUID(); //用户反馈

//查询牌桌
M.LOGIN_SUCCESS_IN_GAME = getUID();

M.DDZ_PROTECT_NOTIFY = getUID(); //移除破产提示框
M.SHOW_BACKRUPT_DIALOG = getUID(); //显示破产提示框
M.REMOVE_BACKRUPT_DIALOG = getUID(); //移除破产提示框

M.UPADTE_MULTIPLE_DIALOG = getUID(); //更新公共倍数弹窗
M.NET_USER_READY_REQ = getUID(); //玩家准备请求
M.NET_USER_READY_NOTIFY = getUID(); //玩家准备通知

M.DDZ_SHOW_CARD_NOTIFY = getUID(); //明牌通知

M.RECORD_OPEN_DIALOG = getUID(); //打开战绩中窗口

M.DDZ_SHOW_CARD_REQ = getUID(); //发牌过程中明牌请求

M.DDZ_DESK_MULTI_NOTIFY = getUID(); //牌桌倍数变化通知

M.UPDATE_BEGIN_BUTTONS = getUID(); //更新开始按钮

M.HIDE_ALL_BTNS = getUID(); //隐藏按钮

M.UPDATE_SHOW_CARD_BTN = getUID(); //更新明牌按钮

M.OPEN_MULTI_DIALOG = getUID(); //打开公共倍数弹窗


M.ROOM_CHECK = getUID(); //请求是否有未完成牌局

M.DDZ_OPUSER_NOTIFY = getUID(); //牌桌当前操作者通知

M.DDZ_USER_STAND_REQ = getUID(); //玩家站起请求
M.NET_USER_STAND_NOTIFY = getUID(); //玩家站起通知
M.DDZ_USER_SITDOWN_REQ = getUID(); //玩家坐下请求
M.NET_USER_SITDOWN_NOTIFY = getUID(); //玩家坐下通知
M.DDZ_GOLD_CHANGE_NOTIFY = getUID(); //单独通知用户金币变化
M.LORD_REQUEST_VIEWER_CREATE_DESK = getUID(); //请求旁观玩家新开房间
M.LORD_REQUEST_USER_CHANGE_DESK = getUID(); //请求换桌

M.OPEN_PLAYERINFO_DIALOGVIEW = getUID(); /////打开玩家信息
M.REMOVE_PLAYERINFO_DIALOGVIEW = getUID(); /////关闭/移除玩家信息

M.LORD_REQUEST_OPEN_EMAIL = getUID();

M.NET_GAME_CHAT_NOTIFY = getUID();
M.DDZ_GAME_CHAT_REQ = getUID();
M.GET_EMAIL_DATA_CONTENTS = getUID();
M.EVT_SHOW_MAIL_VIEW = getUID();
M.EVT_REQ_MAIL_DATA = getUID();
M.NET_PRODUCT_EXCHANGE_BY_DIAMOND = getUID(); //用钻石兑换金币
M.GAME_PAY_NOTICE = getUID(); //购买钻石
M.DDZ_DIAMOND_CHANGE_NOTIFY = getUID(); //单独通知用户钻石变化
M.DDZ_BUY_SUCCESS_NOTIFY = getUID(); //通知购买商城物品成功了
M.UPDATE_USER_GOLD = getUID(); //金币更新
M.UPDATE_USER_DIAMOND = getUID(); //钻石更新
M.DDZ_PRODUCT_EXCHANGE_BY_MONEY = getUID(); //兑换金币钻石不足调用计费点
M.EVT_SHOW_EXCHANGE_DIALOG = getUID();
M.EVT_REQ_EXCHANGE_DATA = getUID();

M.LORD_EMAIL_NOTE_NUMS_TO_MAINVIEW = getUID();
M.EMAIL_DATAS_REQ = getUID();
M.UPDATE_EMAILDATAS_UNREAD_NUM = getUID();
M.GET_VIEW_DIALOG_BY_NAME = getUID(); //获取相应的对话框

M.UPDATE_WELFARE_INFO = getUID(); //更新新手福利信息
M.RECEIVE_GIFT_REQ = getUID(); //领取福利
M.GET_WELFARE_DATA_REQ = getUID(); // 请求登录礼包数据

M.CHECK_GOLD_LIMIT = getUID(); //进桌检查金币限制

M.KICK_OUT_REQ = getUID(); //踢人请求

M.DDZ_CLOSE_BUY_COVER = getUID(); //取消商城点击购买遮罩

M.UPDATE_FOCUS_INFO = getUID(); //更新关注有礼信息

M.UPDATE_CARD_COUNTER_NUM = getUID(); //更新记牌器数量

M.EVT_LAUNCH_FROM_COUNTER_LINK = getUID(); //从记牌器链接进来
M.EVT_LAUNCH_FROM_INVITATION_LINK = getUID(); //从邀请有礼链接进来

M.SHOW_CARD_COUNTER_VIEW = getUID(); //打开记牌器
M.UPDATE_CARD_COUNTER_INFO = getUID(); //更新记牌器信息
M.REQ_CARD_COUNTER_DATA = getUID();

M.RECEIVE_COUNTER_REQ = getUID(); //领取记牌器请求

M.COUNTER_MAIN_SHARE_REQ = getUID(); //记牌器大厅内分享
M.COUNTER_INVITE_REQ = getUID(); //记牌器大厅内邀请
M.COUNTER_DESK_SHARE_REQ = getUID(); //记牌器牌桌内分享
M.STATISTICAL_RECONNECTION_INFO = getUID(); //统计断线重连相关

M.SHOW_REWARD_DIALOG = getUID(); //显示获得物品提示框
M.SHOW_REWARD_DIALOG_LIST = getUID();
M.REMOVE_REWARD_DIALOG = getUID(); //移除获得物品提示框

M.UPDATE_CHANGE_TABLE_BUTTONS = getUID(); //更新换桌按钮

M.CHECK_WELFARE_FLAG = getUID(); //检测福利弹窗

M.DDZ_USER_UNREADNUM_NOTIFY = getUID(); //用户未读消息的数量(目前只在登录时候推送)

M.DDZ_USER_SYNC_FORTUNE_INFO_NOTIFY = getUID(); //同步人员的财产信息。 比如同步人员金币信息到客户端，后续可拓展其他

M.UPDATE_USER_LOTTERYTICKET = getUID(); //更新玩家奖券

M.DDZ_LOTTERYTICKET_CHANGE_NOTIFY = getUID(); //玩家奖券变化通知

M.UPDATE_COMPETITION_INFO = getUID(); //更新赛事信息

M.OPEN_ROUND_DETAIL_DIALOG = getUID(); //打开赛事详情弹窗

M.UPDATE_USER_LEVEL = getUID(); //更新用户段位

M.DDZ_LEVEL_CHANGE_NOTIFY = getUID(); //通知用户段位变化

M.EXIT_COMPETITION_REQ = getUID(); //退赛兑奖按钮请求

M.UPDATE_EXIT_COMPETITION_INFO = getUID(); //更新退赛弹框信息

M.EXCHANGE_SOMETHING_REQ = getUID(); //退赛兑换请求

M.DDZ_CLEAR_UI_BY_OVER = getUID(); //好友房结算后清掉ui

M.UPDATE_RANK_OF_WORLD_INFO = getUID(); //更新世界排行榜

M.GROUP_RANK_SHARE_REQ = getUID(); //群排行分享


M.UPDATE_EXCHANGE_CLASSIFY_INFO = getUID(); //更新兑换信息

M.SEND_EXCHANGE_GOODS = getUID(); //发送兑换请求

M.SEND_ALTER_ADDRESS = getUID(); //发送修改信息请求

M.SEND_EXCHANGE_RECORD = getUID(); //发送兑换记录请求

M.USER_AUTOMATIC_AWARD_REQ = getUID(); //玩家请求是否展示最强王者自动退赛兑奖弹窗请求

M.DDZ_CARD_COUNTER_NOTIFY = getUID(); //记牌器数量

M.DDZ_EVT_BROADCAST = getUID(); //赛事广播

M.SHOW_OR_HIDE_BROADCAST = getUID(); //是否显示跑马灯

M.EVT_SHOW_VOUCHER_DIALOG = getUID(); //打开奖券弹窗
M.EVT_REQ_VOUCHER_DATA = getUID(); //获取奖券数据

M.DDZ_AWARD_INFO_DETAIL_REQ = getUID(); //获取奖券弹窗信息
M.DDZ_RED_DOT_NOTIFY = getUID(); //通知小红点

M.UPDATE_MAIL_ALL_LIST = getUID(); //更新邮件数据

M.UPDATE_RED_DOT_LIST = getUID(); //更新小红点列表

M.SEND_SYSMESSAGE_READ = getUID(); //发送系统消息已读

M.SEND_MAIL_RECEIVE_READ = getUID(); //邮件领取

M.UPDATE_REMOVE_MAIL_DATA = getUID(); //移除邮件

M.DDZ_UPDATE_MAIL_NOTIFY = getUID(); //邮件消息通知

M.Add_MAIL_DATE = getUID(); //新的可领邮件消息通知

M.Add_SYS_DATE = getUID(); //新的系统邮件消息通知

M.HIDE_LOADING_BAR = getUID(); //隐藏进度条

M.UPDATE_BAG_PROPS_LIST = getUID(); //更新背包产品列表
M.EVT_SHOW_BAG_DIALOG = getUID(); //打开背包界面
M.SEND_USE_BAG_PROPS = getUID(); //使用背包产品

M.SEND_GO_COMPETITION = getUID(); //去比赛场

M.CLOSE_COMPETITION_VIEW = getUID(); //关闭比赛场

M.DDZ_MATCH_USER_BOARD_INFO_NTF = getUID(); //通知玩家排行榜的分数改变

M.EVT_SHOW_PLAYER_DIALOG = getUID(); //打开个人资料卡
M.EVT_REMOVE_PLAYER_DIALOG = getUID(); //移除个人资料卡

M.DZZ_EVENT_RESULT_SHARE = getUID(); //赛事结算分享

//经典场结算
M.SHOW_CLASSIC_OVER_DIALOG = getUID();
M.REMOVE_CLASSIC_OVER_DIALOG = getUID();
M.SHOW_FRIENDROOM_OVER_DIALOG = getUID(); //打开好友房结算界面
//经典场结束分享
M.SHOW_CLASSIC_SHARE_DIALOG = getUID();
M.REMOVE_CLASSIC_SHARE_DIALOG = getUID();

//关注有礼相关信息通知
M.DDZ_SUBSCRIBEGIFT_WINDOWEVT_NTF = getUID();
M.UPDATE_MODULE_POP_INFO = getUID(); //更新模块弹出

M.UPDATE_INVITATION_INFO = getUID(); //更新邀请有礼
M.SHOW_INVITATION_VIEW = getUID();
M.EVT_REQ_INVITATION_DATA = getUID();

M.INVIT_EREWARD_GET_REQ = getUID(); //领取超级礼包

M.INVIT_SHARE_REQ = getUID(); //邀请有礼邀请

M.DDZ_INVITE_HELPRET_NTF = getUID(); //邀请有礼结果返回

M.DDZ_DIAMOND_ACTIVITY_HELPRET_NTF = getUID(); //钻石活动结果返回

M.SEND_INVITER_REQ = getUID(); //发送邀请者信息

M.DDZ_JOIN_MATCH_REWARD_NOTIFY = getUID(); //参赛进度通知

M.SEND_EVENT_MATCH_REWARD = getUID(); //请求领取赛事活动奖励

M.EVT_SHOW_EVENTACT_DIALOG = getUID(); //打开显示奖励弹窗
M.EVT_REQ_EVENTACT_DATA = getUID();

M.BACKPACK_LEVEL_CARD_REQ = getUID(); //背包检测有无等级卡

M.GET_USER_AD_INFO_REQ = getUID(); //流量主需求 查看广告数据

M.UPDATE_VEDIO_AD_INFO = getUID(); //更新流量主

M.UPDATE_CARD_COUNTER_CANGET_NUM = getUID(); //更新可获取记牌器的数量

M.DDZ_CARD_COUNTER_INFO_NOTIFY = getUID(); //通知记牌器信息变化

M.DDZ_USER_LOGIN_OFF_NOTIFY = getUID(); //封号

M.CHECK_IF_CAN_JOIN_MATCH = getUID(); //检测是否可以参赛

M.TAKE_OUT_AD_REDDOT = getUID(); //去掉小红点

M.WECHAT_GAME_GETUSERINFO = getUID(); //用户授权

M.HIDE_LORDGAME_VIEW_INVITE_BTN = getUID(); // 隐藏房间内邀请有礼按钮

M.START_BY_CLASSSSIC_OVER = getUID(); //经典场结算界面通知继续游戏给匹配界面

M.SHOW_REDPACKET_VIEW = getUID(); //显示红包界面
M.EVT_REQ_REDPACKET_DATA = getUID(); //拉取红包界面信息
M.UPDATE_REDPACKET_VIEW = getUID(); //更新红包界面
M.GET_REDPACKET_DETAIL_REQ = getUID(); //红包奖励明细
M.UPDATE_REDPACKET_DETAIL_VIEW = getUID(); //更新红包奖励界面
M.REDPACKET_GET_CASH_REQ = getUID(); //提现
M.SHOW_REDPACKET_RECORD_VIEW = getUID(); //显示历史记录界面
M.GET_REDPACKET_GETCASH_REQ = getUID(); //提现明细
M.REFRESH_REDPACKET_DETAIL_VIEW = getUID(); //更新历史明细界面

M.END_GAME_LEVEL_CHANGE_NTF = getUID(); //残局通过数改变通知

M.UPDATE_END_GAME_LEVEL = getUID(); //更新残局通关数

M.DDZ_END_GAME_OVER_EVT = getUID(); //残局结算通知

M.UPDATE_DIAMOND_ACTIVITY_VIEW = getUID(); //更新钻石活动界面数据
M.UPDATE_DIAMOND_REDPACKET_TIP = getUID(); //钻石红包邀请回来更新提示

M.DIAMOND_ACTIVITY_SHARE = getUID(); //钻石活动分享

M.SHOP_TAB_CHANGE = getUID(); //商城tab切换
M.DDZ_REWARD_DIAMOND_CLICK_NTF = getUID(); //点击获取钻石链接结果返回
M.DDZ_REWARD_DIAMOND_SUCCESS_NTF = getUID(); //获取钻石为成功邀请之后，邀请者会收到的通知

M.LORD_ENDGAME_REMIND = getUID(); //残局提示
M.LORD_ENDGAME_REMIND_VIEW = getUID(); //残局提示框
M.ENDGAME_RESET_GAME = getUID(); //重新挑战提示框
M.ENDGAME_ENTER_DESK = getUID(); //残局进桌请求

M.ENDGAME_GROUP_RANK_SHARE_REQ = getUID(); //残局排行群分享

M.ENDGAME_RANK_CHANGE_NTF = getUID(); //残局排行数据变更

M.ENDGAME_LOBBY_PAUSE_UPDATE = getUID(); //残局大厅开放数据停止刷新

M.ENDGAME_LOBBY_RESUME_UPDATE = getUID(); //残局大厅开放数据继续刷新

M.ENDGAME_RESET_GAME_REQ = getUID(); //残局重新挑战请求

M.SHOW_DIAMOND_ACTIVITY_BACK_VIEW = getUID(); //显示钻石活动back弹框

M.HIDE_WELFARE_RED_DOT = getUID(); //关闭登录礼包小红点
M.MAIN_HIDE_WELFARE_RED_DOT = getUID(); //主界面关闭登录礼包小红点

M.CLICK_VEDIO_AD = getUID(); //点击流量主功能

M.DDZ_NATIONALDAY_BONUSESHELP_NTF = getUID(); //国庆活动助攻成功通知
M.SHOW_NATIONALDAY_ACT_BACK_VIEW = getUID(); //国庆活动助力弹窗
M.SHOW_NATIONALDAY_ACT_RULE_VIEW = getUID(); //国庆助力攻略弹窗
M.SHOW_NATIONALDAY = getUID();
M.EVT_REQ_NATIONALDAY_DATA = getUID();
M.SHOW_NATIONALDAY_ACT_HELPLIST_VIEW = getUID(); //国庆助力列表弹窗
M.GET_NATIONALDAY_ACT_HELPLIST_REQ = getUID(); //获取国庆助力列表数据
M.SHOW_NATIONALDAY_ACT_LOGIN_AWARD_VIEW = getUID(); //国庆登陆红包弹窗

M.UPDATE_NATIONALDAY_ICON_ACTION = getUID(); //国庆活动ICON动画状态更新

M.SAVE_PHOTO_NATIONALDAY_ACT = getUID(); //国庆活动保存图片到相册

M.SHOW_FIRST_LOGIN_REWARD = getUID(); //打开首次登陆奖励弹窗

M.HIDE_FIRST_LOGIN_REWARD = getUID();
M.PICK_GOLD_BOX_REQ = getUID(); //领取金币宝箱
M.SHOW_GUIDE_VIEW = getUID(); // 显示引导组件

M.DDZ_GOLD_GUIDE_NTF = getUID(); //金币不足通知

M.DZZ_EVENT_SAVE_LEVEL = getUID(); //分享保级

M.DDZ_TASK_RECHARGE_SUCC_NTF = getUID(); //每日任务充值成功
M.UPDATE_TASK_VIEW = getUID(); //更新任务界面
M.PICK_TASK_REWARD = getUID(); //领取任务奖励
M.GET_WELFARE_VIEW_DATA = getUID(); //获取福利中心数据
M.PICK_REWARD_BY_VEDIO_OR_SHARE = getUID(); //看视频或分享领取任务奖励
M.GET_TASK_DATA_REQ = getUID(); //获取任务数据
M.CLASSICROOM_ONEXIT_GAME = getUID(); //经典场退出询问
M.ADD_LUCKY_REWARD_DIALOG = getUID(); //显示幸运奖励弹框

M.EVENT_LESS_VOUCHER = getUID(); //奖券不足

M.WIN_STREAK_DETAIL_REQ = getUID(); //连胜详细请求

M.WIN_STREAK_TASK_PICK_REQ = getUID(); //领取任务奖励

M.GET_MULTINFO_REQ = getUID(); //获得加倍信息

M.WIN_STREAK_TASK_QUERY_REQ = getUID(); //连胜任务查询

M.UPDATE_WIN_STREAKINFO = getUID(); //更新牌桌内连胜数据

M.SEND_VOICE_REQ = getUID(); //发送语音请求

M.DDZ_VOLTE_MSG_NTF = getUID(); //语音通知
M.SHOW_FLOWMAIN_DIALOG = getUID(); //流量主提示框
M.GET_DIAMOND_ACTIVITY_REDPACKET_REQ = getUID(); //请求钻石活动助力好友数据
M.GET_DIAMOND_ACTIVITY_INVITE_REQ = getUID(); //请求钻石活动邀请有礼数据
M.PICK_DIAMOND_ACTIVITY_REDPACKET = getUID(); //领取助力好友奖励
M.PICK_DIAMOND_ACTIVITY_INVITE = getUID(); //领取邀请有礼奖励
M.UPDATE_WIN_STREAKINFO = getUID(); //更新牌桌内连胜数据

M.DDZ_DISMISS_VOTE_NTF = getUID(); //好友房解散牌桌投票

M.REMOVE_DISBAND_DIALOG = getUID(); //移除解散弹窗

M.OPEN_CREATE_ROOM_DIALOG = getUID(); //打开好友房创建弹窗

M.CLICK_LINK_TO_PICK_REWARD = getUID(); //点击链接领取奖励

M.HIDE_VOICE_UI = getUID(); //隐藏语音图标

M.UPDATE_BACK_CARD_NUM = getUID(); //更新牌背手牌数量

M.CLICK_QUICK_START = getUID(); //点击快速开始

M.HIDE_VOICE_UI = getUID(); //隐藏语音图标

M.GET_WINSTREAK_DATA_REQ = getUID(); //获取首登连胜详情请求

M.SHOW_WINSTREAK_BUBBLE = getUID(); //显示连胜气泡

M.HIDE_WINSTREAK_BUBBLE = getUID(); //隐藏连胜气泡

M.REMOVE_ALL_VOICE = getUID(); //去除所有语音

M.SHOW_WELFARE_DIALOG = getUID(); //打开新手福利-登陆奖励弹窗
M.SHOW_RECORD_MAIN_DIALOG = getUID(); //打开战绩mian弹窗
M.GET_LORD_ROUND_SETTLE_INFO = getUID(); //获取战绩main弹窗数据
M.SHOW_RECORD_RANK_DIALOG = getUID(); //打开战绩排行弹窗
M.GET_RECORD_RANK_INFO = getUID(); //获取战绩排行弹窗数据
M.SHOW_RECORD_DETAIL_DIALOG = getUID(); //打开战绩detail弹窗
M.SHOW_FOCUS_MAIN_DIALOG = getUID(); //打开关注有礼弹窗
M.GET_FOCUS_MAIN_INFO = getUID(); //打开关注有礼弹窗数据
M.SHOW_EXCHANGE_RECORD_DIALOG = getUID(); //打开兑换记录弹窗
M.SHOW_EXCHANGE_INPUT_DIALOG = getUID(); //打开兑换地址弹窗
M.SHOW_EXCHANGE_DETAIL_DIALOG = getUID(); //打开兑换物品详情弹窗
M.SHOW_EXCHANGE_COMFIRM_DIALOG = getUID(); //打开兑换物品确认弹窗
M.SHOW_EXCHANGE_PHONE_DIALOG = getUID(); //打开兑换phone弹窗
M.SHOW_EXCHANGE_ALTER_DIALOG = getUID(); //打开兑换alter弹窗
M.SHOW_EXCHANGE_SUCCESS_DIALOG = getUID(); //打开兑换成功弹窗
M.SEND_BAG_LIST_REQ = getUID(); //请求背包信息列表
M.SHOW_DIAMOND_ACTIVITY_DIALOG = getUID(); //打开钻石活动弹窗
M.SEND_MAIL_INFO_REQ = getUID(); //请求邮件信息

M.EVT_LAUNCH_FROM_DIAMONDACTIVITY_LINK = getUID(); //从钻石活动链接进游戏
M.EVT_FIRST_ENTER_ENDGAMELOBBY_REWARD = getUID(); //残局大厅每日首次奖励
M.SHOW_ENDGAME_RANK_DIALOG = getUID(); //打开残局排行榜
M.SHOW_RANK_DIALOG = getUID(); //打开排行榜
M.SHOW_TASK_REDPACKET_REWARD_DIALOG = getUID(); //打开任务奖励-红包奖励弹窗
M.SHOW_TASK_REWARD_DIALOG = getUID();
M.SHOW_REDPACKET_REWARD_DIALOG = getUID(); //打开红包奖励弹窗
M.SHOW_WINSTREAK_REWARD_DIALOG = getUID(); //打开连胜奖励红包弹窗

M.DDZ_SHOW_CARD_EVENT_NTF = getUID(); //明牌通知
M.SHOW_NEW_SEASON_TIP_DIALOG = getUID(); //打开新版赛事提醒
M.OPEN_EVENT_GAME_OVER_DIALOG = getUID(); //打开赛事结算弹窗
M.SHOW_COMPETITION_SEASON_OVER_DIALOG = getUID(); //打开赛季结算弹窗
M.SHOW_COMPETITION_EXCHANGE_COUPON = getUID(); //打开强行兑换弹窗
M.GET_EXCHANGE_NEW_COUPON_INFO = getUID(); //请求强行兑换弹窗数据

M.USE_MATCH_BOX_REQ = getUID(); //使用宝箱请求

M.STAR_PROTECT_REQ = getUID(); //保星请求
M.CLOSE_BAG_MAIN = getUID(); //关闭背包主弹窗

M.SEND_USER_HEAD_FRAME_REQ = getUID(); //发送使用头像请求

M.UPDATE_MAIN_HEAD_FRAME = getUID(); //更新大厅头像框
M.GET_RANK_OF_WORLD_INFO = getUID(); //获取赛事世界榜排名信息

M.AGAIN_SAVE_STAR_REQ = getUID(); //二次弹窗保星请求

M.STAR_PROTECT_AGAIN_REQ = getUID(); //保星二次弹窗通知服务器
M.EVENT_LOADDING_FINISH = getUID();
M.IS_SHOW_BROADCAST = getUID();

M.DDZ_BM_SETCOUNTDOWNPOS = getUID();
M.DDZ_BM_SENDCARD = getUID();
M.DDZ_BM_DONTSENDCARD = getUID();
M.DDZ_BM_PMPROMIT = getUID();
M.DDZ_BM_SETOTHERSHOW = getUID();
M.DDZ_BM_UPDATEOPEBTN = getUID();
M.DDZ_BM_UPDATEMULTI = getUID();
M.DDZ_MENU_EXIT = getUID();
M.DDZ_MENU_AUTO = getUID();
M.DDZ_MENU_SET = getUID();
M.DDZ_PM_UPDATEOPERBTNS = getUID();
M.DDZ_PM_SETIMGNOLARGER = getUID();
M.DDZ_PM_DONTSENDCARD = getUID();
M.DDZ_PM_HINDALLBTNS = getUID();
M.DDZ_PM_SHUFFLEPANELHIDE = getUID();
M.EVT_SHOW_HALL = getUID();
M.EVT_CHECK_GOLD_ENOUGH = getUID();
M.EVT_SHOW_MATCH = getUID();
M.EVT_CHECK_GOLD_ENOUGH_INGAME = getUID();
M.EVT_INPUT_SPECIFIED_DESK = getUID();
M.SHOW_EVENT_MATCH_DIALOG = getUID();  //打开赛事匹配界面
M.REMOVE_EVENT_MATCH_DIALOG = getUID();  //移除赛事匹配界面
M.UPDATE_EVENT_MATCH_VIEW = getUID();  //刷新赛事匹配界面

export default M;