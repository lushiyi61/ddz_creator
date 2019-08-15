let prefix = "textures/";
let prefab = "prefabs/";
let animation = "animation/";

let M = {};

M.proto = "texas_net";
M.font1 = "Arial";

M.prefab_main = prefab + "Main";
M.prefab_setting = prefab + "Setting";
M.prefab_setting_help = prefab + "SettingHelp";
M.prefab_setting_about = prefab + "SettingAbout";
M.prefab_setting_feedback = prefab + "SettingFeedback";
M.prefab_broadcast = prefab + "Broadcast";
M.prefab_hall = prefab + "Hall";
M.prefab_matching = prefab + "Matching";
M.prefab_table = prefab + "Table";
M.prefab_bankrupt = prefab + "bankrupt_dialog";
M.prefab_prompt = prefab + "prompt_dialog";
M.prefab_server_stop = prefab + "server_stop_dialog";
M.prefab_competition = prefab + "Competition";
M.prefab_create_room = prefab + "CreateFriendRoom";
M.prefab_welfare = prefab + "welfare";
M.prefab_event_match = prefab + "EventMatch";

M.global = prefix + "global/global";
M.global_png = prefix + "global/global.png";
M.global_plist = prefix + "global/global.plist";

M.main = prefix + "main/main";
M.main_png = prefix + "main/main.png";
M.main_plist = prefix + "main/main.plist";

M.setting = prefix + "setting/setting";
M.setting_about = prefix + "setting/setting_pic_about_content";
M.setting_help_1 = prefix + "setting/setting_pic_help_content1";

M.welfare = prefix + "welfare/welfare";
M.welfare_bg = prefix + "welfare/welfare_bg";

M.createroom = prefix + "createroom/createroom";

M.animation_Main_ske = animation + "NewAnimationMain_ske";
M.animation_Main_tex = animation + "NewAnimationMain_tex";

M.hall = prefix + "hall/hall";
M.hall_png = prefix + "hall/hall.png";
M.hall_plist = prefix + "hall/hall.plist";

M.game_table_bg = prefix + "table/table_pic_bg";
M.table = prefix + "table/table";
M.table_png = prefix + "table/table.png";
M.table_plist = prefix + "table/table.plist";

M.table_pic_menu = prefix + "table/table_pic_menu.png";
M.multiTypeBgPng = prefix + "table/table_pic_multiTypeBg.png";
M.tableRecordBgBottomPng = prefix + "table/table_record_bg_bottom.png";
M.share_banner_normal_game = prefix + "ui/global/global_pic_common_share.png";

M.animation_baozha_ske = animation + "NewAnimation_baozha_ske";
M.animation_baozha_tex = animation + "NewAnimation_baozha_tex";
M.animation_feiji_ske = animation + "NewAnimation_feiji_ske";
M.animation_feiji_tex = animation + "NewAnimation_feiji_tex";
M.animation_huojian_ske = animation + "NewAnimation_huojian_ske";
M.animation_huojian_tex = animation + "NewAnimation_huojian_tex";
M.animation_chuntian_ske = animation + "NewAnimationchuntian02_ske";
M.animation_chuntian_tex = animation + "NewAnimationchuntian02_tex";
M.animation_liandui_ske = animation + "NewAnimationliandui22_ske";
M.animation_liandui_tex = animation + "NewAnimationliandui22_tex";
M.animation_shunzi_ske = animation + "NewAnimationshunzi2_ske";
M.animation_shunzi_tex = animation + "NewAnimationshunzi2_tex";
M.animation_CJJB_ske = animation + "NewAnimationCJJB_ske";
M.animation_CJJB_tex = animation + "NewAnimationCJJB_tex";

M.animation_baojingqi_ske = animation + "NewAnimationDDZbaojingqi_ske";
M.animation_baojingqi_tex = animation + "NewAnimationDDZbaojingqi_tex";

M.animation_sendcards_ske = animation + "NewAnimationMP001D_1_ske";
M.animation_sendcards_tex = animation + "NewAnimationMP001D_1_tex";

M.poker = prefix + "poker/poker";
M.poker_png = prefix + "poker/poker.png";
M.poker_plist = prefix + "poker/poker.plist";

M.chat = prefix + "chat/chat";
M.chat_png = prefix + "chat/chat.png";
M.chat_plist = prefix + "chat/chat.plist";

//互动表情
M.interactPhiz_1 = {
    "niubei": animation + "niubei/niubei_ske",
    "zhadan": animation + "zhadan/zhadan_ske",
    "bingtong": animation + "bingtong/bingtong_ske",
    "qinwen": animation + "qinwen/qinwen_ske",
    "bixin": animation + "bixin/bixin_ske",
    "sendflower": animation + "sendflower/sendflower_ske",
};

M.interactPhiz_2 = {
    "niubei": animation + "niubei/niubei_tex",
    "zhadan": animation + "zhadan/zhadan_tex",
    "bingtong": animation + "bingtong/bingtong_tex",
    "qinwen": animation + "qinwen/qinwen_tex",
    "bixin": animation + "bixin/bixin_tex",
    "sendflower": animation + "sendflower/sendflower_tex",
};

//个人信息
M.playerInfo = prefix + "playerinfo/playerinfo";
M.playerInfo_png = prefix + "playerinfo/playerinfo.png";
M.playerInfo_plist = prefix + "playerinfo/playerinfo.plist";

//公共弹窗
M.common = prefix + "common/common";
M.common_plist = prefix + "common/common.plist";
M.common_png = prefix + "common/common.png";
M.common_pic_bankrupt_bg = prefix + "common/common_pic_bankrupt_bg";

//赛事大厅主页
M.competition = prefix + "competition/competition";
M.competition_plist = prefix + "competition/competition.plist";
M.competition_png = prefix + "competition/competition.png";
M.competition_bg = prefix + "competition/competition_bg";

//赛事结算
M.event_game_over = prefix + "eventgameover/eventgameover";
M.event_game_over_plist = prefix + "eventgameover/eventgameover.plist";
M.event_game_over_png = prefix + "eventgameover/eventgameover.png";

M.aniEventGameOver_ske = animation + "event_game_over/NewAnimation_jiesuan_ske";
M.aniEventGameOver_tex = animation + "event_game_over/NewAnimation_jiesuan_tex";

//赛事开局动画
M.firstPair_ske = animation + "one_pair_opening/first_pair/NewAnimationdoudizhudiyifu01_ske";
M.firstPair_tex = animation + "one_pair_opening/first_pair/NewAnimationdoudizhudiyifu01_tex";

M.secondPair_ske = animation + "one_pair_opening/second_pair/NewAnimationdoudizhudierfu02_ske";
M.secondPair_tex = animation + "one_pair_opening/second_pair/NewAnimationdoudizhudierfu02_tex";

M.threeToFivePair_ske = animation + "one_pair_opening/three_to_five_pair/NewAnimationdi345ju_ske";
M.threeToFivePair_tex = animation + "one_pair_opening/three_to_five_pair/NewAnimationdi345ju_tex";

M.lastPair_ske = animation + "one_pair_opening/last_pair/NewAnimationjueshengju3_ske";
M.lastPair_tex = animation + "one_pair_opening/last_pair/NewAnimationjueshengju3_tex";

M.onePairEnd_ske = animation + "one_pair_end/NewAnimationDDZshule_ske";
M.onePairEnd_tex = animation + "one_pair_end/NewAnimationDDZshule_tex";

//任务
M.task = prefix + "task/task";
M.font_task_reward_num = prefix + "font/font_task_reward_num";
M.font_task_reward_1 = prefix + "font/font_task_reward_1";
M.font_task_reward_2 = prefix + "font/font_task_reward_2";
M.task_redpacket_bg1 = prefix + "task/task_redpacket_bg1";
M.task_redpacket_bg2 = prefix + "task/task_redpacket_bg2";
M.fontWelfareWinstreak = prefix + "font/font_welfare_winstreak";

M.lord_music = {

};

//赛事匹配
M.event_match = prefix + "eventmatch/eventmatch";
M.eventMatchPlist = prefix + "eventmatch/eventmatch.plist";
M.eventMatchPng = prefix + "eventmatch/eventmatch.png";

export default M;