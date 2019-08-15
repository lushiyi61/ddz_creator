
export default {
    HOTUPDATE_ENTRY: "updated_hotupdate_entry",
    OPEN_ID: "__openid",

    LOGIN_TYPE: "__login_type",
    PHONE: "__phone",
    PWD: "__PWD",
    ACCESSTOKEN: "__acesstoken",

    RES_VERSION: "_resversion",
    BASE_VERSION: "_baseversion",
    REVIEW_STATUS: "review_status", //审核状态，默认是version_code:status,例如400:false表示在审核中
    REVIEW_RANDOM_1: "review_random_1", //审核状态第二个主按钮入口随机数
    REVIEW_RANDOM_2: "review_random_2", //审核状态第三个主按钮入口随机数
    REVIEW_RANDOM_POS_1: "review_random_pos_1", //审核状态三个主按钮入口位置随机数
    REVIEW_RANDOM_POS_2: "review_random_pos_2", //审核状态商城、更多、玩家头像三个按钮入口位置随机数
    RES_ZIP_UNCOMPRESS: "res_zip_uncompress",   //zip资源文件是否已经解压

    IS_GUIDED: "is_guided", //标记是否进行过新手引导

    IS_EFFECTS_ENABLED: "is_effects_enabled",   //记录游戏音效开关
    IS_CAHT_EFFECTS_ENABLED: "is_chat_effects_enabled", //记录聊天音效开关
    IS_BGMUSIC_ENABLED: "is_bgmusic_enabled",   //记录背景音乐开关

    IS_VIBRATION_ENABLED: "is_vibration_enabled",   //记录震动效果开关

    PLAYER_SIGNIN_DAYS: "player_signin_days",   //记录玩家签到天数

    IS_SETTING_LOOK_ENABLED: "is_look_enabled",   //设置里面旁观开关
    IS_SETTING_YY_ENABLED: "is_yy_enabled",   //设置里面语音开关
    IS_SETTING_CHAT_ENABLED: "is_chat_enabled", //设置里面聊天开关

    IS_WX_FIRST_AUTH: "is_wx_first_auth",   //标识首次授权

    PAY_BILL_ID: "pay_bill_id",   //订单id
};
