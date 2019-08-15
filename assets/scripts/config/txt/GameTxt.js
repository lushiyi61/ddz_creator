let M = {};

let res = require("../res/GameRes");

M.network_timeout = "网络连接超时";

M.string011 = "万";
M.string012 = "亿";

M.TimerUnitStr = ["年", "个月", "周", "天", "小时", "分钟", "秒"];
M.TimerFormatStr = ["年", "月", "日"];
M.colonStr = ":";
M.string632 = "请输入..";

M.string633 = ["/g", "/kiss", "/ogle", "/crazy", "/angry", "/cry", "/gri",
    "/cool", "/shit", "/naughty", "/wow", "/shy", "/happy", "/ee",
    "/h", "/speechless", "/zz", "/ama", "/knif", "/sleep", "/zy",
    "/fist", "/love", "/pray", "/smile", "/hb", "/yea", "/whirr",
    "/pitiful", "/bye"
];
M.string634 = ["/allin", "/help", "/hi", "/feck", "/check", "/aa", "/omg", "/you", "/no", "/ha"];
M.stringChatDefault = [
    "和你合作真是太愉快了",
    "快点啊，等得我花都谢了",
    "小伙伴，你和地主是一家吧",
    "你这么厉害，你家人知道吗",
    "啊，糟了",
    "别吵了别吵了，专心玩游戏吧",
    "不胜利，吾宁死",
    "怎么又断线了，网络也太差了",
    "不要走，决战到天亮",
    "土豪，我们做朋友吧"
];
M.faceChatDefault = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];

M.string_chat_action_json = [res.expression_smiley8_Json, res.expression_smiley9_Json, res.expression_smiley10_Json,
    res.expression_smiley11_Json, res.expression_smiley12_Json
];
M.string_chat_action_name = ["smiley8", "smiley9", "smiley10", "smiley11", "smiley12"];
M.string_chat_action_plist = [res.expression_smiley8_plist, res.expression_smiley9_plist, res.expression_smiley10_plist,
    res.expression_smiley11_plist, res.expression_smiley12_plist
];
M.string_chat_action_png = [res.expression_smiley8_png, res.expression_smiley9_png, res.expression_smiley10_png,
    res.expression_smiley11_png, res.expression_smiley12_png
];

M.phizStrings = ["niubei", "zhadan", "bingtong", "qinwen", "bixin", "sendflower"];

M.common_error_tips = "错误码%s";

M.common_share_txt = "真是对不起，我牌好就是可以为所欲为~";

M.gameLoaddingTips001 = ["忍是为了下次all in", "你不能控制输赢,但能控制输赢的多少", "应该懂得什么时候放弃", "赌的不是运气,赢的是你的智慧", "冲动是魔鬼,心态好,运气自然来"];
M.loading_txt = "%d%";

M.login005 = "网络连接失败，请检查你的网络";
M.login007 = "游戏正在准备中...";
M.login008 = "游戏正在准备中%s...";
M.dingtips = "正在下载中";
M.input_roomerror_tips = "进桌失败,错误码%s";

M.tip_error_desc_1 = "您的账号已在其他设备上登录";
M.tip_error_desc_2 = "登录失败！";
M.tip_error_desc_3 = "解析配置失败！";
M.tip_error_desc_4 = "拉取个人信息失败！";
M.tip_error_desc_5 = "进桌失败！";
M.tip_error_desc_6 = "查询牌桌失败！";
M.tip_error_desc_7 = "保存配置失败！";
M.tip_error_desc_8 = "牌局已结束";

M.lord_game_title = "趣凡斗地主";
M.lord_myself = "我自己";
M.lord_gameover_status = ["失败", "胜利"];

M.lord_game_ingame_back = "    离开房间系统默认托管，报名道具不予返还，是否离开比赛!";
M.lord_game_fullsginup_back = "    离开房间将取消报名，并返还报名费，是否离开比赛!";
M.lord_game_timesginup_back = "    请在比赛开始前回到比赛桌否则不退回报名费，是否离开比赛!";
M.lord_no_larger_cards = "你没有大过上家的牌";

M.exit_to_other_fail = "退桌失败";
M.stand_up_fail = "站起失败";
M.sit_down_fail = "坐下失败";

////////////////////竞技二打一UI文字提取 begin////////////////////

//反馈界面
M.feedback_feedbackContent = "请输入反馈信息";
M.feedback_contactway = "请输入联系方式";
M.feedback_success = "反馈成功";
M.feedback_isNotNumerLegal = "手机号格式有误，请重新输入";
M.feedback_isNotFeedbackLegal = "反馈信息不能为空";

M.back_login_tips1 = "您的帐号在其他设备登录，请重新登录";
M.back_login_tips2 = "您的登录状态已经失效，请重新登录";
M.back_login_tips3 = "您的登录状态异常，请重新登录";

//--------------------- new start ---------------------

//--------------------- new end ---------------------

////////////////////////////////////////公共倍数文字Begin////////////////////////////////////////
M.common_multiple_str1 = "初始";
M.common_multiple_str2 = "明牌";
M.common_multiple_str3 = "抢地主";
M.common_multiple_str4 = "底牌";
M.common_multiple_str5 = "炸弹";
M.common_multiple_str6 = "春天";
M.common_multiple_str7 = "公共倍数";
M.common_multiple_str8 = "地主加倍";
M.common_multiple_str9 = "农民加倍";
M.common_multiple_str10 = "总倍数";

////////////////////////////////////////公共倍数文字End////////////////////////////////////////

//反馈界面
M.feedback_Content = "欢迎您给客服小姐姐提出任何建议和反馈，非常感谢您对我们小游戏的支持！";
M.feedback_Content1 = "您可以关注“趣凡斗地主”公众号，获取更多客服反馈。";
M.feedback_feedbackContent = "请输入您的意见或建议^_^";
M.feedback_isNotFeedbackLegal = "反馈信息不能为空";
M.feedback_success = "您的意见发送成功，谢谢！";

//破产保护
M.bankrupt_content = "今天系统第%d次赠送给您%d金币！";

//战绩
M.record_score = "分";
M.record_loading = "正在加载中…";
M.record_noRecord = "您还没有好友房对局记录，赶快游戏去吧!";
M.record_maxTip = "记录最近10场对局";
M.record_winStr = "胜：";
M.record_loseStr = "负：";

M.record_gameTypeStr = "本轮玩法：";
M.record_gameScoreStr = "地主封顶：";
M.record_playNumStr = "本轮局数：";
M.record_settingStr = "其他设置：";
M.record_endTimeStr = "结束时间：";

M.room_battle_type_name = {
    1: "经典玩法",
    2: "癞子玩法",
    3: "不洗牌玩法",
};

M.room_level_novice = "%s 新手场";
M.room_level_primary = "%s 初级场";
M.room_level_normal = "%s 普通场";
M.room_level_medium = "%s 中级场";
M.room_level_advanced = "%s 高级场";
M.room_level_super = "%s 顶级场";
M.room_level_unknow = "%s";

M.room_scoreStr = "底分 %d";
M.room_maxScoreStr = "%d";
M.room_maxScoreStr1 = "封顶 %d";
M.room_serverStr = "%d";

M.tip_unFinishedGame = "亲，你正在其他场次游戏，是否回去？";
M.tip_GameingInvite = "亲，你正在游戏中，不会进入被邀请的牌桌";

M.exit_desk_playing_tip = "现在离开会由笨笨的机器人代打哟，输了可不能怪他哟？";
M.tip_openRoom = "是否进入新房间（%s %s %s %s %s %s 封顶%d 局数%d）？";
M.exit_desk_ready_tip = "确认要退出房间吗？可能会被他人抢了牌局位置哦！";
M.tip_allowView = "允许旁观";
M.tip_notAllowView = "不允许旁观";
M.tip_allowAd = "允许记牌器";
M.tip_notAllowAd = "不允许记牌器";
M.tip_allowVolte = "允许语音";
M.tip_notAllowVolte = "不允许语音";
M.tip_allowAutoplay = "允许托管";
M.tip_notAllowAutoplay = "不允许托管";
M.tip_allowShowhands = "允许明牌";
M.tip_notAllowShowhands = "不允许明牌";
M.viewer_create_desk_fail = "创建失败";
M.table_players_full = "当前牌桌已满";
M.game_chat_holder = "请输入文字，最多25字";
M.totalObserversNumTxt = "(共有%d人旁观）"

M.gameover_name_header = "昵称";
M.gameover_bottom_score_header = "底分";
M.gameover_multiple_header = "倍数";
M.gameover_score_header = "分数";
M.gameover_time = "秒后自动回到游戏";

M.emailError = "获取邮件失败";

M.string_shop_buy_gold_use_diamond = "是否确认花费【%s钻石】购买【金币x%s】？";
M.string_shop_buy_gold_use_diamond1 = "钻石不足，是否用【%s元】充值【%s钻石】？充值成功后为您自动购买【金币x%s】。";
M.string_shop_buy_gold_use_diamond2 = "钻石不足，是否补充钻石？";
M.string_shop_buy_success = "购买成功";
M.tip_unFinishGame = "正在进行，尚未结束";
M.string_shop_exchange_success = "兑换成功";
M.shop_add_mount = "赠送";

M.tip_gold_limit_low1 = "您的金币太少啦，请前往较低场次~";
M.tip_gold_limit_low2 = "您的金币不足，快去商城补充一些吧！";
M.tip_gold_limit_low3 = "您的金币不足，观看视频广告立即获得免费金币！";
M.tip_gold_limit_up = "您的金币过多，请前往对应场次。";
M.tip_gold_limit_low = "金币不足";

M.stringShareTitle = "小手一抖,金币到手!点开即玩,快来和我一起斗地主!";
M.stringShareTitle1 = "看看你在本群排第几？";
M.stringShareTitle2 = "我在斗地主比赛中赢得了大奖！速来围观";
M.noEnterDeskForFull = "当前牌桌已满,不允许旁观";
M.string_chat_richtxt = "$%s@#FFFA8218@$%s";

M.kick_other = "您确定要将玩家%s踢出房间吗?";

M.not_opened_tips = "暂未开放，敬请期待";

M.desk_over = "牌桌已经结束";
M.table_counter_tip1 = "加倍环节结束后自动使用";
M.table_counter_tip3 = "当前局不可使用记牌器";

M.top_score = "分封顶";
M.counter_name_tip = "记牌器";
M.counter_count_tip1 = "立即分享可获得     次";
M.counter_count_tip2 = "每邀请一位好友加       次";
M.counter_limitday_tip = "温馨提示：分享立得记牌器(%s天有效),打牌更容易获胜哦~";
M.counter_share_tip1 = "这里已经分享过啦~";
M.counter_share_tip2 = "今日分享领取计牌器已达上限~可邀请好友获得哦~";
M.counter_share_tip3 = "分享成功，记牌器次数+2";
M.counter_time_tip = "次";

M.competition_nextreward = "本局获胜可得奖券x";
M.common_tip_score = "分数";
M.common_tip_time = "时间";

M.competition_level = {
    10: "青铜",
    20: "白银",
    30: "黄金",
    40: "铂金",
    50: "钻石",
    60: "大师",
    70: "王者",

    80: "最强王者",
    90: "最强王者",
    100: "最强王者",
    110: "最强王者",
    120: "最强王者",
    130: "最强王者",
    140: "最强王者",
};

M.competition_old_level = {
    10: "青铜I",
    20: "青铜II",
    30: "青铜III",
    40: "白银I",
    50: "白银II",
    60: "白银III",
    70: "黄金I",
    80: "黄金II",
    90: "黄金III",
    100: "钻石I",
    110: "钻石II",
    120: "钻石III",
    130: "传奇宗师",
    140: "最强王者",
};

M.event_match_wait_time = "预计等待 %d 秒";

M.event_match_fail_txt = "匹配失败，待会再来吧~";
M.cur_round_txt = "第 %d 局";

M.exchange_name_tip = "奖券";
M.exchange_gift_desc = "礼品描述:";
M.exchange_cost_desc = "消耗奖券:";
M.exchange_num_desc = "兑换数量:";
M.exchange_zhang = "张";
M.exchange_num_limit1 = "兑换数量不能为0";
M.exchange_num_limit2 = "奖券不足";

M.exchange_comfirm_tips = {
    1: "一经提交不能修改",
    2: "收件人:",
    3: "手机号码:",
    4: "详细地址:",
    5: "话费将直接充与您的手机中",
    6: "兑换物品需要填写收货信息",
    7: "请填写您的姓名电话和详细地址",
};
M.exchange_input_tips = {
    1: "姓名不能为空", //姓名不能为空
    2: "手机号码不能为空", //手机号码不能为空
    3: "地址不能为空", //地址不能为空
};
M.exchange_record_tips = {
    1: "名称",
    2: "时间",
    3: "数量",
    4: "状态",
};

M.exchange_record_lbltips = "温馨提示：实物奖励将会在7~10个工作日内发货哦~";

M.exchange_success_tips = "兑换成功";
M.exchange_alter_tips = "保存成功";

M.event_reward_tips = "由于您已达到最高称号“最强王者”， 系统已为您退赛。";

//当前奖励类型 0:无 1.金币 2.奖券 3.记牌器 4.等级卡
M.event_reward_des = {
    1: "金币%d",
    2: "奖券x%d",
    3: "记牌器x%d",
    4: "等级卡x%d",
};

//随机名字库
M.random_name = [
    "张三",
    "李四",
    "王五",
];

//随机物品库
M.random_good = [
    "键盘",
    "鼠标",
    "主机",
];

//奖券
M.lbl_voucher = "我的奖券: ";
M.lbl_competition_voucher = "奖券";
M.lbl_competition_title = "巅峰赛事";
M.lbl_competition_subtitle = "达到指定名次可获得奖券";
M.lbl_welfare_gift = "礼包";
M.lbl_welfare_title = "福利活动";
M.lbl_welfare_subtitle = "达到活动条件即可领取";

M.event_gold_not_enough = "金币不足，无法参赛";
M.mail_reward_success_tip = "领取成功啦！";

M.wx_modal_title = "提示";
M.wx_modal_content = "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。";
M.bag_no_tips = "当前还没有获得道具，赶紧去游戏中拿道具吧！";
M.bag_cardcounter_name = "记牌器";
M.bag_cardlevel_name = "等级卡";
M.bag_doublecard_name = "超级加倍卡";
M.bag_use_tip = "使用说明：";

M.group_share_tips = "请在群聊中点击消息查看群排名吧~";
M.shop_user_tips = "金币作为游戏道具，不具任何实际价值，只限本人在游戏中使用，适度娱乐理性消费。                    ";
M.eventGameOver_saveLevel_tips = "分享到群可避免降级";

M.out_of_rank = "未上榜";

M.reward_counter_string = "记牌器x";
M.reward_coin_string = "金币 ";
M.reward_reward_string = "奖券x";
M.reward_diamond_string = "钻石x";
M.reward_redpacket_string = "红包";

M.reward_promotion_tips = "奖券可在“赛事主界面”点击退赛后获得！";

M.exchange_discount = "折";
M.exchange_phone_desc = "您将消耗%s奖券兑换%s";

M.event_invite_tips = "诚邀您参与巅峰赛事，赢取大奖";
M.bag_get_tip = "获得途径：";

//关注有礼提示
M.foucsGoldTips = "<font fontSize=fontSize color=88,36,0>最高领取</font><font fontSize=fontSize color=190,28,23>%d金币</font>" +
    "<font fontSize=fontSize color=88,36,0>！更多</font><font fontSize=fontSize color=190,28,23>专属福利</font>" +
    "<font fontSize=fontSize color=88,36,0>等你来抢！</font>";
M.coin = "金币";

M.invitation_tips1_1 = "非常感谢你的帮助!";
M.invitation_tips1_2 = "好友%s成功获得%d金币";
M.invitation_tips1_3 = "您今日剩余帮助次数：%d/5";
M.invitation_tips2_1 = "今日不能再帮助好友啦，";
M.invitation_tips2_2 = "明天再试试吧！";
M.invitation_tips3_1_1 = "你的好友已经不需要帮助啦，";
M.invitation_tips3_2_1 = "帮帮其他困难户吧！";
M.invitation_tips3_1_2 = "每位好友每天只能帮助1次哦，";
M.invitation_tips3_2_2 = "去帮帮其他好友吧！";

M.eventactivity_tips1 = "礼包奖励：";
M.eventactivity_tips2 = "任务条件";
M.eventactivity_tips3 = "任务状态";
M.eventactivity_reward = {
    1: "金币*%d",
    2: "奖券*%d",
    3: "记牌器*%d",
    4: "等级卡*%d",
};

M.checkNoLevelCardTips = "您当前还没有等级卡，快去打比赛获得吧！";
M.unLoginBuy = "请重新登录游戏并选择授权";

M.vedioAdOver = "今日看广告机会已用完, 请明天再来";
M.vedioAdOver1 = "请%d秒后再来领取";
M.vedioAdOver2 = "请稍后再来领取";
//记牌器分享
M.cardCounterRemainDes = "剩余次数(%d/%d)";

M.login_lose = "登录失效，请重新登录";
M.login_loginoff = "玩家被封号，若有疑问请联系客服";
M.friend_no_shuffle_tip = "不洗牌玩法";
M.highLevelMatchTips = "您当前段位比赛暂未开始";

M.ad_err_tips = "网络异常拉取失败，请稍后再试 (错误码:%s)";

// 金币场大厅
M.quick_start = {
    1: "经典玩法",
    2: "癞子玩法",
    3: "不洗牌玩法"
}

//底牌翻倍类型
M.HoleCardsType = {
    1: "大王翻%d倍",
    2: "小王翻%d倍",
    3: "同花翻%d倍",
    4: "顺子翻%d倍",
    5: "双王翻%d倍",
    6: "同花顺翻%d倍",
    7: "三张翻%d倍"
};

M.bei = "倍";
M.randCoin = "随机金币";
M.rand = "随机";

//红包
M.redpacket_1 = "1：红包集满%d元才可提现；";
M.redpacket_2 = "4：客服微信：qfun2018";
M.redpacket_3 = "¥";
M.redpacket_4 = "累计提现金额：%s元";
M.redpacket_get_succ = "提现成功， 请留意微信零钱到账提示！";
M.redpacket_get_fail = "提现失败，请联系客服处理，请勿频繁操作！";
M.redpacket_no_getcash = "暂无提现明细哦~";
M.redpacket_no_reward = "暂无奖励红包哦~快去闯关获取吧！";
M.redpacket_5 = "返还失败，请联系我们的客服qfun2018";
M.redpacket_state = {
    "10": "失败",
    "20": "成功"
}

//残局大厅
M.endGame_progress = "关卡进度：";
M.redpacket_get_fail = "提现失败，请联系客服处理，请勿频繁操作！";

M.main_total_pass = "闯关进度：第%d关";
M.main_pass_rank = "总关卡数：共%d关";

//残局结算奖励
M.endgameover_reward = [
    "",
    "钻石",
    "记牌器",
    "金币",
    "红包",
    "加倍卡"
];

M.endgameover_reward_1 = [
    "",
    "钻石",
    "记牌器",
    "金币",
    "金币",
    "加倍卡"
];

//钻石红包
M.diamondActivity_1 = "每日前%d次分享，立得钻石~";
M.diamondActivity_2 = "今日第%s位助力好友";
M.diamondActivity_3 = ["一", "二", "三", "四", "五"];
M.diamondActivity_4 = "成功邀请%d位新人";
M.diamondActivity_5 = "好友%s成功获得%d钻石";
M.diamondActivity_6 = "您的好友已经不需要帮助啦";
M.diamondActivity_7 = "您已经帮助过该好友啦";

M.shop_buy_notsupport = "ios系统暂不支持支付，您可更换安卓手机进行支付哟~";
M.reward_diamond_sharetime = "分享到不同的群（%s/%s）";
M.reward_diamond_shareFriend1 = "只有分享到微信群才有效哦!";
M.reward_diamond_shareFriend2 = "需要发送到不同群才可以哦！";
M.reward_diamond_shareFriend3 = "感谢您帮助【%s】成功获得钻石%s";
M.reward_diamond_shareFriend4 = "分享次数达到上限，无法获得奖励";
M.reward_diamond_shareFriend5 = "恭喜获得钻石%s";

//残局奖励
M.endgamelobby_reward = {
    1: "金币*%s",
    2: "钻石*%s",
    3: "记牌器*%s",
    4: "红包x随机",
    5: "加倍卡*%s"
};

M.endgamelobby_reward_1 = {
    1: "金币*%s",
    2: "钻石*%s",
    3: "记牌器*%s",
    4: "金币x随机",
    5: "加倍卡*%s"
};

M.endgamelobby_random = "随机";

M.endgame_TipTxt = [
    "地主哥建议您再仔细思考一下",
    "地主哥建议您先不出~",
    "本次使用提示将花费掉您1钻石，是否继续",
    "确定要重新挑战吗？\n重新挑战将会消耗钻石",
    "是否放弃当前关卡，重新挑战",
    "退出后钻石不会返还，确认放弃当前关卡且退出吗？",
    "确认放弃当前关卡且退出吗？",
    "您没有牌大过上家",
];

M.endgame_daily_reward_share = "恭喜获得钻石*2";
M.endgame_diamond_not_enough_1 = "钻石不足，无法闯关！";
M.endgame_diamond_not_enough_2 = "钻石不足，无法提示！";
M.main_hava_new = "关卡已更新";

M.nationalDay_invite_num = "已邀请%d人";
M.nationalDay_cash_num = "%d元";
M.nationalDay_act_time = "活动时间：%s";
M.nationalDay_next_invite = "再邀请%d个新人\n可领取下一个红包";
M.nationalDay_clear = "你已领取所有红包！";
M.nationalDay_share_success = "分享成功！";
M.nationalDay_share_fail = "分享失败！";
M.nationalDay_icon_rmb = "￥%d";

M.nationalDay_savePhoto_fail_title = "保存失败";
M.nationalDay_savePhoto_fail_desc = "你拒绝“牌友趣凡斗地主”保存图片至相册，按步骤依次点击，打开相册权限：\n1、右上角 “...”\n2、关于牌友斗地主\n3、右上角 “...”\n4、“设置”\n5、保存到相册 "

M.eventCoinBox_tips1 = "秒后将放弃保级";
M.eventCoinBox_tips2 = "错过保级将降级并放弃补助宝箱";
M.eventCoinBox_diamondLeft = "钻石余额：";
M.eventCoinBox_coin = "随机金币";
M.nationalDay_savePhoto_fail_desc = "你拒绝“牌友趣凡斗地主”保存图片至相册，按步骤依次点击，打开相册权限：\n1、右上角 “...”\n2、关于牌友斗地主\n3、右上角 “...”\n4、“设置”\n5、保存到相册 ";

// 引导文字
M.endgame_guide_1 = "首次进入残局大厅，\n将游戏分享给您的好友，\n可获得双倍钻石，\n点击按钮分享。";
M.endgame_guide_2 = "未通关的关卡点击\n开始会消耗钻石，已\n通关后的关卡再次闯\n关既不会消耗钻石也\n不会再有奖励。";
M.endgame_guide_3 = "恭喜过关，快分享下\n通关的喜悦吧！";
M.endgame_guide_4 = "好遗憾，差一点点就\n成功了，点击再来一次！";

M.friend_guide_1 = "点击退出，可退出房间\n" + "点击站起，则变为房间旁观\n" + "点击设置，则进入房间设置";
M.friend_guide_2 = "站起后，您可以选择任意位置再重新坐\n下，或者点击右边的“新开房间”再开新的\n房间。";


M.gameover_share_bubble_type = [
    "",
    "春天限定专享礼包",
    "春天限定专享礼包",
    "使用钻石, 可赢币翻倍！",
    "%s连胜, 发起挑战！",
    "%s倍, 发起挑战！",
    "%s连胜, 发起挑战！",
    "%s倍, 发起挑战！",
    "使用钻石, 可系统包赔！",
    "使用钻石, 系统补偿%d金币",
    "使用钻石, 系统奖励%d金币"
];

M.eventIntroducer_txt = [
    "获得%s个奖劵，重新开始!",
    "获得%s称号，继续征战!"
];

M.noSuperDoubleCard = "超级加倍卡不足，请到兑换中心获取";

M.lackCoin_1 = "观看视频广告\n立即获得免费金币！";
M.lackCoin_2 = "IOS目前不支持充值哦~";
M.lackCoin_3 = "温馨提示：你可使用安卓手\n机登录进行充值，金币是同\n步的哟~";
M.lackCoin_4 = "放弃(%d)";
M.lackCoin_5 = "放弃";

M.tableMulti = "倍数X";
M.task_tip_1 = "继续参与%d次对局，即可领取\n%d金币奖励哦！\n您确定要离开吗？";
M.task_tip_2 = "继续赢币%d，即可领取\n%d金币奖励哦！\n您确定要离开吗？";
M.task_tip_3 = "继续参与%d次对局，即可领取\n%d个记牌器奖励哦！\n您确定要离开吗？";
M.luckyTask_tip = "%s，可获幸运红包！";
M.luckyTask_tip_2 = "红包大奖，等你来拿！";
M.table_lucky_reward_unit = {
    "1": "金币",
    "2": "红包",
    "3": "记牌器",
}
M.luckyTask_tip_3 = "幸运任务完成奖励！";
M.endgame_guide_tip = "通关全部关卡，可获得%d元红包";

M.goto_reward = "可进入兑换专区使用";
M.goto_level_card = "可进入背包查看";

M.my_rank = "我的排名: %d";

M.click_share_link = "点击分享的小程序再次进入游戏可领奖哦~";
M.my_rank = "我的排名: %d";

M.win_streak_left_times = "剩余完成次数： %d";
M.win_streak_diamond_not_enough = "钻石不足，无法保持连胜！";
M.win_streak_protect_success = "保持连胜成功！";
M.win_streak_protect_fail = "保持连胜失败！";

M.win_streak_use_diamond_count = "消耗%d颗钻石可保持连胜状态！";

M.cannot_double_tip_1 = "您对手的金币不足%d，无法加倍";
M.cannot_double_tip_2 = "您的金币不足%d，无法加倍";

M.diamondActivity_ret_1 = {
    0: "您已成功为好友助力，留下来和ta一起游戏吧！",
    1: "好友助力人数已满",
    2: "您已经帮助过该好友啦！",
    3: "点击自己的链接",
    4: "欢迎您进入游戏，快来一起玩吧",
    5: "今日助力次数已满，明天再试试吧！",
}
M.disband_nick = "玩家【%s】";
M.disband_status = [
    '等待选择',
    '正在发起解散',
    '同意解散',
    '拒绝解散'
];
M.disband_fail = "部分玩家未同意，房间解散失败";
M.disband_success = "所有玩家已同意，房间解散！";

M.play_waiting = "玩家离开，请耐心等待...";
M.already_dismiss = "房间已解散";

M.save_photo_success = "图片保存成功";
M.save_photo_fail = "图片保存失败";

M.voice_playing_tips = "目前有人正在讲话，请稍后再试";

M.welfare_winstreak_tips = "每日可领9个，早上6点重置次数";
M.welfare_winstreak_candonetimes = "剩余完成次数：%d";
M.welfare_winstreak_jlhb = "金币场%s奖励红包";

M.welfare_winstreak_bubble = "%d连胜红包";

M.diamond_not_enough_to_open_redpacket = "钻石不足，无法开启红包";
M.diamond_not_enough_to_open_box = "钻石不足，无法开启宝箱";
M.diamond_not_enough_to_save_star = "钻石不足，无法保星";
M.watch_videl_more_coin = "加送%d金币";

M.lack_coin_num_1 = "%d金币";
M.lack_coin_num_2 = {
    1: 60000,
    2: 120000,
    3: 260000,
    4: 550000,
    5: 1130000,
    6: 2380000,
    7: 4080000,
};

M.txt_duanwei = {
    10: "青铜",
    20: "白银",
    30: "黄金",
    40: "铂金",
    50: "钻石",
    60: "大师",
    70: "王者",
    80: "王者",
    90: "王者",
    100: "王者",
    110: "王者",
    120: "王者",
    130: "王者",
    140: "王者",
};

M.competition_guide = {
    1: "新段位图标，详细段位及奖励\n请查看右下角规则！",
    2: "单轮赛，胜利可获得奖券，段位越\n高，奖券越多！",
    3: "每个赛季结束会根据排行榜排名\n进行发奖哦！",
};

M.head_frame = "头像框";
M.season_sn = "第%s赛季";
M.season_change = {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "七",
    8: "八",
    9: "九",
    10: "十",
};

M.eventgameover_title = {
    "nc": "昵称",
    "dw": "段位",
    "jcjl": "基础奖励",
    "dwjc": "段位加成",
    "dzjc": "地主加成"
};

M.eventgameover_voucher = "奖券:";

M.eventgameover_box = "宝箱";
M.exchange_tip = "新版赛事上线！\n系统已将您拥有的历史奖券\n及等级卡兑换成等值的新版奖券\n请查收！";

M.eventgameover_box = "宝箱已放入背包，可在背包内打开！";

M.eventgameover_save_star_bubble = "今日还剩余%s次保星机会";

M.eventgameover_save_star_success = "保星成功!";

M.eventgameover_tips_win = "段位越高，胜利之后奖券越多！";
M.eventgameover_tips_lose = "失败之后不扣除奖券哦，请您放心比赛！";

M.box_txt = "宝箱";
M.box_voucher = "奖券*";

M.bag_open_box_tips = "是否使用%s钻石开启?";
M.saishishengji = "当前赛事升级中，无法匹配进入，请稍后尝试";

M.have_head_frame_num = "当前拥有头像框：%s个";
M.new_coupon = "新版奖券 x%d";

M.starTxt = "星";

M.txt0001 = "红包可以在大厅福利中心继续领取！";

export default M;