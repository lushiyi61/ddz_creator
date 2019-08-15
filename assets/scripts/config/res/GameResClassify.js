/*
资源分类
注意：图集需要加上类型cc.SpriteAtlas
例子：[ res.global, cc.SpriteAtlas ]
*/

let res = require("./GameRes");

let M = {};

M.global = [
    [res.global, cc.SpriteAtlas],
    [res.main, cc.SpriteAtlas],
    res.prefab_main,
    [res.common, cc.SpriteAtlas],
];

M.broadcast = [
    res.prefab_broadcast,
];

M.setting = [
    [res.setting, cc.SpriteAtlas],
    res.setting_about,
    res.setting_help_1,
    res.prefab_setting,
    res.prefab_setting_help,
    res.prefab_setting_about,
    res.prefab_setting_feedback,
];

M.mainEffect = [
    res.animation_Main_ske,
    [res.animation_Main_tex, dragonBones.DragonBonesAtlasAsset]
];

M.hall = [
    [res.hall, cc.SpriteAtlas],
    res.prefab_hall,
];

M.match = [
    [res.table, cc.SpriteAtlas],
    res.game_table_bg,
    res.prefab_matching,
];

M.playerInfo = [
    [res.playerInfo, cc.SpriteAtlas],

    res.interactPhiz_1.niubei,
    [res.interactPhiz_2.niubei, dragonBones.DragonBonesAtlasAsset],
    res.interactPhiz_1.zhadan,
    [res.interactPhiz_2.zhadan, dragonBones.DragonBonesAtlasAsset],
    res.interactPhiz_1.bingtong,
    [res.interactPhiz_2.bingtong, dragonBones.DragonBonesAtlasAsset],
    res.interactPhiz_1.qinwen,
    [res.interactPhiz_2.qinwen, dragonBones.DragonBonesAtlasAsset],
    res.interactPhiz_1.bixin,
    [res.interactPhiz_2.bixin, dragonBones.DragonBonesAtlasAsset],
    res.interactPhiz_1.sendflower,
    [res.interactPhiz_2.sendflower, dragonBones.DragonBonesAtlasAsset],
];

M.table = [
    [res.table, cc.SpriteAtlas],
    [res.poker, cc.SpriteAtlas],
    res.game_table_bg,
    res.animation_sendcards_ske,
    [res.animation_sendcards_tex, dragonBones.DragonBonesAtlasAsset],

    res.prefab_table
];

//经典场好友房
M.classicfriendtable = [
    res.table_pic_menu
];

//赛事牌桌
M.eventtable = [
    //第一局
    res.firstPair_ske,
    res.firstPair_tex,

    //第二局
    res.secondPair_ske,
    res.secondPair_tex,

    //第三到第五局
    res.threeToFivePair_ske,
    res.threeToFivePair_tex,

    //决胜局
    res.lastPair_ske,
    res.lastPair_tex,

    //输了赢了
    res.onePairEnd_ske,
    res.onePairEnd_tex,

    res.multiTypeBgPng,
    res.tableRecordBgBottomPng,
];

M.bankrupt = [
    res.common_pic_bankrupt_bg,
    res.prefab_bankrupt,
];

M.prompt = [
    [res.global, cc.SpriteAtlas],
    res.prefab_prompt,
    res.prefab_server_stop,
];

M.competition = [
    [res.competition, cc.SpriteAtlas],
    res.prefab_competition,
    res.competition_bg,

    [res.event_game_over, cc.SpriteAtlas],
    res.aniEventGameOver_ske,
    res.aniEventGameOver_tex,
];
M.createroom = [
    res.createroom,
    res.prefab_create_room,
];
M.welfare = [
    [res.welfare, cc.SpriteAtlas],
    res.welfare_bg,

    //任务
    [res.task, cc.SpriteAtlas],
    res.task_redpacket_bg1,
    res.task_redpacket_bg2,
    [res.font_task_reward_num, cc.BitmapFont],
    [res.font_task_reward_1, cc.BitmapFont],
    [res.font_task_reward_2, cc.BitmapFont],

    //连胜
    [res.fontWelfareWinstreak, cc.BitmapFont],

    res.prefab_welfare,
];

M.event_match = [
    [res.event_match, cc.SpriteAtlas],
    res.prefab_event_match,
];
export default M;