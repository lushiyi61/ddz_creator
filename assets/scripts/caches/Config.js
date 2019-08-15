/*
从服务器拉取的通用配置
*/

let Model = require("../frameworks/mvc/Model");

cc.Class({
    extends: Model,

    properties: {
        "VIDEOAD_CHANGE": "videoad_change", //流量主变更
        "COUNTER_CANGET": "counter_canget", //记牌器可获得数变更
        "COUNTER_CHANGE": "counter_change", //记牌器数量变更

        module: {
            get() {
                return this.moduleConfig;
            }
        },
        gift: {
            get() {
                return this.giftInfo;
            }
        }
    },

    ctor() {
        this.errorMsg = {};

        this.cardCounterNum = 0;

        this.room = []; // 所有房间信息
        this.classic_room = []; // 经典玩法
        this.unshuffle_room = [] // 不洗牌玩法
        this.laizi_room = []; // 癞子玩法

        this.new_version = {};

        this.shop = {};
        this.shop.gold_items = [];

        this.shareMsgs = [];
        this.shareImgUrls = [];

        this.nationalDayActInfo = {};

        this.endgameTotleLevel = 0;

        this.moduleConfig = [];

        this.counterInfo = {};
        this.counterNum = 0;

        this.showByGame = false;

        this.giftInfo = {};
        this.giftInfo.giftConfig = [];
        this.giftInfo.shareInfo = {};
    },

    updateConfigInfo(model) {
        let filedName = [
            "friend_room_id", //单独标记好友房room_id
            "friend_room_id_no_shuffle", //好友房不洗牌玩法room_id
            "timestamp", //时间戳
        ];

        qf.utils.copyFiled(filedName, this, model);

        this.updateErrorMsg(model.error_list);
        this.updateCardCounterNum(model.card_counter.count);
        this.updateRoomInfo(model.room);
        this.updateCheckNewVisionInfo(model.check_new_version);
        this.updateShopConf(model.store_conf);
        this.updateShareMsgs(model.updateShareMsgs);
        this.updateShareImgConf(model.shareimg_conf);
    },

    updateErrorMsg(error_list) {
        this.errorMsg[-200] = qf.txt.network_timeout; //超时提示前台配置
        for (let key in error_list) {
            let errorInfo = error_list[key];
            this.errorMsg[errorInfo.id] = errorInfo.desc;
        }
    },

    updateCardCounterNum(count) {
        this.cardCounterNum = count;
    },

    updateRoomInfo(room) {
        this.room = [];
        this.classic_room = [];
        this.laizi_room = [];
        this.unshuffle_room = [];

        let filedRoom = [
            "room_id", // room id
            "carry_min", // 最小buy
            "carry_limit", // 最大buy
            "carry_desc", // 带入限制描述
            "seat_limit", // 几人桌
            "room_level", // 房间等级 1新手 2初级 3普通 4中级 5高级 6顶级
            "cur_online", // 当前在线人数
            "enter_limit", // 进入房间最下金币携带
            "base_score", // 底分
            "cap_score", // 封顶分数
            "enter_fee", // 服务费
            "play_mode", // 玩法标记
            "show_tag", // 展示标签
        ];

        for (let key in room) {
            let data = room[key];
            let roomInfo = qf.utils.copyFiled(filedRoom, {}, data);

            this.room.push(roomInfo);
        }

        //区分玩法
        for (let key in this.room) {
            let roomInfo = this.room[key];

            if (roomInfo.play_mode === qf.const.BATTLE_TYPE_NORMAL) {
                this.classic_room.push(roomInfo);
            } else if (roomInfo.play_mode === qf.const.BATTLE_TYPE_LAIZI) {
                this.laizi_room.push(roomInfo);
            } else if (roomInfo.play_mode === qf.const.BATTLE_TYPE_UNSHUFFLE) {
                this.unshuffle_room.push(roomInfo);
            }
        }
    },

    updateCheckNewVisionInfo(check_new_version) {
        let filedCheckNewVersion = [
            "is_latest", //是否最新版本 id
            "version", //最新版本号
            "msg", //新版本功能介绍
            "download_url", //下载地址
        ];

        qf.utils.copyFiled(filedCheckNewVersion, this.new_version, check_new_version);
    },

    updateShopConf(store_conf) {
        this.shop.gold_items = [];

        let filedShopName = [
            "item_id", //计费点
            "price", //价格
            "amount", //数量
            "img_name" //图片名
        ];

        for (let key in store_conf.gold_items) {
            let data = store_conf.gold_items[key];
            let gold_item = qf.utils.copyFiled(filedShopName, {}, data);
            this.shop.gold_items.push(gold_item);
        }
    },

    updateShareMsgs(share_msg) {
        this.shareMsgs = [];

        let filedShare = [
            "type", //类型
            "title", //标题
            "img_url", //图片
        ];

        for (let key in share_msg) {
            let data = share_msg[key];
            let msg = qf.utils.copyFiled(filedShare, {}, data);
            this.shareMsgs.push(msg);
        }
    },

    updateShareImgConf(shareimg_conf) {
        this.shareImgUrls = [];

        let filedShare = [
            "type", //类型
            "title", //标题
            "img_url", //图片
        ];

        for (let key in shareimg_conf) {
            let data = shareimg_conf[key];
            let msg = qf.utils.copyFiled(filedShare, {}, data);
            this.shareImgUrls.push(msg);
        }
    },

    updateNationalDayActInfo(bonuses1001) {
        let filedName = [
            "in_period",
            "first_login",
            "first_bonuses"
        ];

        qf.utils.copyFiled(filedName, this.nationalDayActInfo, bonuses1001)
    },

    //更新当前残局总关卡数
    updateEndGameTotleLevel(total_level) {
        this.endgameTotleLevel = total_level;
    },

    //更新模块开关配置
    updateModuleConfig(module) {
        this.moduleConfig = [];

        let filedName = [
            "type", //模块id
            "desc", //模块描述
            "flag" //模块是否可用
        ]

        for (let key in module) {
            let data = module[key];
            let moduleInfo = qf.utils.copyFiled(filedName, {}, data);
            this.moduleConfig.push(moduleInfo);
        }
    },

    //更新福利信息
    updateGiftInfoInfo(gift_info) {
        let filedName = [
            "flag", //是否可领 0 表示不可领 1表示可领
            "gift_type", //领取的福利类型 1----7 对应不同的金币数量
        ];

        qf.utils.copyFiled(filedName, this.giftInfo, gift_info);

        let filedGiftName = [
            "days",
            "gold_num"
        ];

        this.giftInfo.giftConfig = [];

        for (let key in gift_info.gift_config) {
            let data = gift_info.gift_config[key];
            let giftConf = qf.utils.copyFiled(filedGiftName, {}, data);
            this.giftInfo.giftConfig.push(giftConf);
        }

        let filedShareName = [
            "str",
            "icon",
            "share_id"
        ];

        qf.utils.copyFiled(filedShareName, this.giftInfo.shareInfo, gift_info.share_info);
    },

    //更新流量主信息
    updateVedioAdInfo(model, button, outMain) {
        if (!model) return;

        this.vedioAdInfo = [];
        let filename = [
            "next_time", //下一次可领取时间  单位为秒 次数没有了的话为-1    未查看过为0
            "total_times", //总的次数
            "current_time", //当前第几次
            "last_gold", //上一轮金币数
            "last_diamond", //上一轮钻石数
            "double_switch", //是否展示分享翻倍按钮
        ];

        qf.utils.copyFiled(model, this.vedioAdInfo, filename);

        let filedShareName = [
            "str",
            "icon",
            "share_id"
        ];

        qf.utils.copyFiled(model.share_info, this.vedioAdInfo.shareInfo, filedShareName);

        this.emit(this.VIDEOAD_CHANGE, { vedioAdInfo: this.vedioAdInfo, button: button, outMain: outMain });
    },

    //更新记牌器信息
    updateCardCounterInfo(info) {
        let filename = [
            "remain_counts", //记牌器数量
            "share_add_counts", //分享一次增加记牌器数量
            "invite_add_counts", //邀请一次增加记牌器数量
            "share_chances", //分享可领取次数
            "invite_chances", //邀请可领取次数
            "valid_days", //记牌器有效期
            "share_max_chances", // 分享最大次数
            "invite_max_chances", // 邀请最大次数
            "already_shared_chances", // 已分享次数
            "already_invited_chances", // 已邀请次数
            "share_info", //分享信息
        ];

        qf.utils.copyFiled(info, this.counterInfo, filename);

        this.updateCounterNum(info.remain_counts);

        let canGetNum = (info.invite_chances || 0) * (info.invite_add_counts || 0);
        this.counterInfo.counterCanGetNum = canGetNum || 0;

        this.emit(this.COUNTER_CHANGE, { counterNum: this.counterCanGetNum });

        this.emit(this.COUNTER_CANGET, { canGetNum: canGetNum });
    },
    updateCounterNum(num, isAdd) {
        if (isAdd) {
            this.counterNum = this.counterNum + num;
        } else {
            this.counterNum = num;
        }

        this.emit(qf.ekey.UPDATE_CARD_COUNTER_NUM, { counterNum: this.counterNum })
    },
    getCounterNum() {
        return this.counterNum;
    },

    updateShowByGame(isShowByGame) {
        this.showByGame = isShowByGame;
    },

    getShowByGame() {
        return this.showByGame;
    },
});