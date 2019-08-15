/*
经典场游戏缓存
*/

cc.Class({
    properties: {
        cmd_list: { default: {} },
        cmd: {
            get() {
                return this.cmd_list;
            }
        },

        //房间类型
        mode: {
            set(m) {
                this.desk_mode = m;
            },
            get() {
                return this.desk_mode;
            }
        },
    },

    ctor() {
        let self = this;
        self._userList = {};
        self._allUserList = {};
        self._observeUserList = {}; //旁观列表
        self.cm_data = {}; //好友自定义房间数据
        self.lastCardsInfoList = []; //玩家进桌还原上次玩家出牌状态
        self.lastCards = []; //self.genCards({5,5,5,7}) --{}   --最后一次牌，自己是否是第一次出牌，自己每次出完牌后重置该table
        self.lastCards2 = []; //self.genCards({4,9,9,9})	--带癞子的手牌

        self.cards = []; //自己的手牌
        self.threeCards = []; //地主牌
        self.playCards = []; //玩家每次出的牌

        self.userSendCard = false; //用户主动出牌
        self.last_uin = null;
        self.laizi_point = 0;
        self.resultInfo = {}; //牌局结束要缓存的信息

        self.initCMD();
        self.enterDeskMusicFlag = true; //进桌音效是否开启
        self.isUserSendCard = false; //标示用户出牌(客户端)
        self.next_auto_buchu = qf.const.LordPokerAutoOper.CHUPAI; //下一个出牌玩家自动不出（打不过上家牌) 1：标识自动不要  0: 玩家操作

        self.rankList = []; //帮助奖励列表
        self.max_grab_action = 0;
        self.resultList = [];

        self.multiInfo = {}; //牌桌上公共倍数
        self.userListLength = 0;
        self.allUserListLength = 0;
        self.observeUserListLength = 0;
        self.round_id = "0"; //牌桌uuid. 牌桌唯一标识. 这个值应该是string类型

        self._standUpUserArray = [];
        self.next_uin2 = []; //同时操作uin列表

        self.card_counter = {}; //记牌器数据

        self.resultShareInfo = {}; //结算分享
        self.resultMultipleInfo = {}; //公共倍数
        self.classicShareIsopen = false; //经典场分享是否开启了判断错误码为不在房间内时是否退出房间后是否进入经典场匹配
        // self.roomId = 0;//记录当前的room_id 方便分享之后进入经典场匹配界面
        self.eventActivityData = []; //赛事活动
        self.ad_share = {};
        self.luckyTask = {}; //幸运任务

        self.is_first_card = true;
    },

    //由于查询牌桌走统一流程，此处需定义斗地主查询牌桌命令字
    initCMD() {
        this.cmd_list = {};
        this.cmd_list.exitDeskCmd = qf.cmd.LORD_EXIT_DESK_REQ;
        this.cmd_list.userCallCmd = qf.cmd.LORD_CALL_REQ;
        this.cmd_list.autoPlayCmd = qf.cmd.LORD_AUTO_PLAY_REQ;
        this.cmd_list.discardCmd = qf.cmd.LORD_DISCARD_REQ;
        this.cmd_list.userMutiCmd = qf.cmd.LORD_MUTI_REQ;
        this.cmd_list.queryDeskCmd = qf.cmd.LORD_QUERY_DESK_REQ;

        this.cmd_list.opTimeOutCmd = qf.cmd.LORD_OP_TIME_OUT_REQ;
        this.cmd_list.deskMultiCmd = qf.cmd.DDZ_DESK_MULTI_REQ;
        this.cmd_list.userChangeDeskCmd = qf.cmd.LORD_USER_CHANGE_DESK_REQ;
    },

    //进桌
    updateCacheByJoinGame(model) {
        let self = this;
        self.laizi_point = 0;
        logd("******join game********");
        //dump(model);
        let f1 = ["desk_id",
            "room_id",
            "status", //游戏状态 0:准备中 10:叫分中 20:加倍中 30:游戏中
            "next_uin", //轮到谁了， 断线重连有效
            "multiple", //倍数
            "landlord_uin", //地主id
            "op_left_time", //玩家操作剩余过期时间
            "room_type", //房间类型
            "last_uin", //上一手牌是谁出的
            "desk_mode", //  1.标准模式 2.好友模式
            "max_grab_action", //当前叫到的最大请地主类型值
            "round_id", //牌桌uuid. 牌桌唯一标识
            "round_index", // 当前局数 从0开始
            "over_flag", // 整场牌桌结束标记 0否 1是
            "master_uin", // 房主的uin. 好友房则有房主。没有填充0
            "short_op_flag", //当前操作者标记 0；无 1.当前操作者要不起。
            "card_counter_time", //记牌器弹窗显示时间
        ];
        self.copyFiled(model, self, f1);

        //更新该操作者的uin
        self.opUin = model.uin;
        // self.roomId = model.room_id;
        self.updateCounterShareInfo(model.ad_share);

        if (self.opUin === qf.cache.user.uin) //自己进桌才解析 自定义房间
            self.updateCustomData(model);

        //next_uin2  同时操作的uin
        self.updateNextUin2(model.next_uin2);

        //更新牌桌玩家的字段
        self.updateUserInfo(model.player_info);

        //更新手牌的数量 和我的牌
        self.updateUsersCardInfo(model.card_list);

        //更新三张底牌
        self.updateThreeCards(model.hole_cards, model.dipai_multi_type, model.dipai_multi);

        //上一手打出的牌
        self.lastCards = [];
        //self.copyArray(model.last_use_cards,self.lastCards) //记录手牌


        //当前操作者之前的人出牌信息
        self.lastCardsInfoList = [];
        let lastCardsInfoList = model.last_cards;

        /*optional int32 uin = 1;             // 上一手牌是谁出的
        repeated int32 cards = 2;           // 上一手牌是什么
        repeated int32 action = 3;         	// 0: 没有操作；1：出牌；2：不出*/

        for (let i in lastCardsInfoList) {
            let info = {};
            let data = lastCardsInfoList[i];
            info.uin = data.uin;
            info.cards = [];
            self.copyArray(data.cards, info.cards);
            info.action = data.action;
            self.lastCardsInfoList.push(info);
            if (info.uin === self.getLastUin()) {
                self.lastCards = info.cards; //记录手牌
            }
        }

        //自己操作清掉|| 自己操作别人都不要 又轮到自己
        if (self.getLastUin() === qf.cache.user.uin || (self.getNextUin() === qf.cache.user.uin && self.getLastUin() < 0)) {
            self.lastCards = [];
        }

        //赖子 暂时屏蔽 by raintian
        self.lastCards2 = [];
        //self.copyArray(model.last_laizi_cards, self.lastCards2);
        self.setEnterDeskMusicFlag(false);
        self.updateMySelfOperated();

        self.updateCmData(model.cm_data);

        self.updateUsersCardInfo(model.card_list);

        self.createRemarkMap();

        //更新记牌器数据
        if (model.card_counter) {
            self.updateCardCounter(model.card_counter);
        }

        //邀请好友（好友房）
        self.updateInviteShareInfo(model.share_info);
        //赛事活动
        if (self.opUin === qf.cache.user.uin) {
            self.updateEventGameActivityData(model.report);
        }

        // 是否领取了邀请有礼大礼包
        self.has_get_packs = model.has_get_packs;

        // 是否显示记牌器
        self.need_pop_card_counter = model.need_pop_card_counter;

        // 超级加倍卡信息
        self.updateSuperDoubleCardInfo(model.super_multi_card)
    },

    //邀请好友分享数据
    updateInviteShareInfo(model) {
        let self = this;

    },

    //记牌器分享信息
    updateCounterShareInfo(model) {
        let self = this;
        self.ad_share = model;
    },

    //房间类型
    getDeskMode: function() {
        var self = this;
        return self.desk_mode;
    },

    //记牌器分享信息
    getCounterShareInfo() {
        let self = this;
        return self.ad_share || {};
    },

    //游戏开始
    updateCacheByStartGame(model) {
        let self = this;
        loge("游戏开始数据 ")
        cc.log(model)
        self.clearAllCallAndMuti();
        self.multiInfo = {}; //清理公共倍数
        self.laizi_point = 0;

        //游戏刚开始没有确定地主是谁
        self.landlord_uin = -1;
        let f1 = ["next_uin", "status", "base_score", "multiple", "op_left_time", "max_grab_action", "round_index", "is_final_round", "has_show_start"];
        self.copyFiled(model, self, f1);

        self.updateUserInfo(model.player_info);

        //更新牌桌上所有人的手牌数量
        self.updateUsersCardInfo(model.card_list);
        self.updateMySelfOperated();
        self.resultList = [];

        self.updateLuckyTask(model.lucky_task_info);
    },

    // 更新幸运任务
    updateLuckyTask(data) {
        let self = this;

        //清理任务列表数据
        // ModuleManager.getModule("TaskController").getModel().clearTaskInfo();

        // if (!data) {
        //     self.luckyTask = null;
        //     return;
        // }

        // self.luckyTask = {};
        // let f1 = ["tid", "desc", "progress", "condition", "status", "hand_id", "share_info"];
        // self.copyFiled(data, self.luckyTask, f1);

        // self.luckyTask.awards = [];
        // for (let i = 0; i < data.awards.length; i++) {
        //     self.luckyTask.awards[i] = [];
        //     self.luckyTask.awards[i].reward_type = data.awards[i].reward_type;
        //     self.luckyTask.awards[i].amount = data.awards[i].amount;
        // }

        // loge("本地缓存幸运任务")
        // logd(self.luckyTask)
    },

    getLuckyTask() {
        let self = this;

        // return self.luckyTask;
    },

    //更新玩家信息 统一接口
    updateUserInfo(userinfo) {
        let self = this;
        if (!userinfo) return;
        //更新牌桌玩家的字段
        self._userList = {};
        self._allUserList = {};
        self._observeUserList = {};
        let fuser = ["status", "nick", "seat_id", "sex", "uin", "openid",
            "is_robot", "portrait", "call_multiple", "call_score", "auto_play", "gold", "show_multi", "player_score", "grab_action"
        ];
        self.userListLength = 0;
        self.allUserListLength = 0;
        self.observeUserListLength = 0;
        for (let i in userinfo) {
            let u = {};
            self.copyFiled(userinfo[i], u, fuser);
            self._allUserList[u.uin] = u;
            self.allUserListLength = self.allUserListLength + 1;
            if (u.status > qf.const.UserStatus.USER_STATE_STAND) { //在桌上列表
                self._userList[u.uin] = u;
                self.userListLength = self.userListLength + 1;
            } else { //旁观列表
                self._observeUserList[u.uin] = u;
                self.observeUserListLength = self.observeUserListLength + 1;
            }
        }
    },

    //更新玩家准备状态
    updateReadyStatus(uin, status) {
        let self = this;
        let u = self._userList[uin];
        if (u)
            u.status = status;
    },

    //更新玩家输赢结果
    updateResultList(userinfo) {
        let self = this;
        if (!userinfo) return;
        //更新牌桌玩家的结算信息

        self.resultList = [];

        let fresult = ["uin", "nick", "win_gold", "score", "multi", "base_socre", "calc_type"];

        for (let i in userinfo) {
            let data = userinfo[i];
            let info = {};
            for (let k in fresult) {
                let v = fresult[k];
                info[v] = data[v];
            }
            self.resultList.push(info);
        }
    },

    //更新玩家输赢结果
    getResultList(userinfo) {
        let self = this;
        return self.resultList;
    },

    //叫分数据更新
    updateCacheByCallPoint(model) {
        let self = this;

        /*
        optional int32 op_uin = 1;            // 谁抢了地主
        optional int32 grab_action = 2;         // 抢地主类型
        optional int32 landlord_uin = 3;        // 地主uin, 不等于-1时说明地主已经确定
        optional int32 next_uin = 4;            // 下一个操作者
        repeated int32 hole_cards = 5;          // 3张底牌
        optional int32 status = 6;              // 游戏状态
        repeated int32 next_uin2 = 7;           // 当地主确认后，next_uin2是可以选择加倍或者不加倍的3个人的列表（有地主情况下生效）
        repeated CardInfo card_list = 8;        // 玩家的牌组信息列表
        optional int32 op_left_time = 9;        // 玩家操作剩余过期时间
        optional int32 max_grab_action = 10;    // 桌子中当前抢地主最大的类型值(保持与进桌协议中的字段一致)
        optional int32 multiple = 11;           // X倍数
        optional int32 first_grab_uin = 12;     // 首叫地主的玩家。便于客户端区分‘叫’‘抢’类型， 默认值0；还没有人首叫
        optional int32 dipai_multi = 13;        // 底牌翻倍倍数
        optional int32 dipai_multi_type = 14;   // 底牌翻倍类型 1:大王 2:小王 3:同花 4:顺子 5:大王小王 6:同花顺 7:三张
        */

        let feild = ["grab_action", "landlord_uin", "next_uin", "status", "op_left_time", "max_grab_action", "first_grab_uin"];
        self.copyFiled(model, self, feild);

        //更新该操作者的uin
        self.opUin = model.op_uin;

        //next_uin2  同时操作的uin
        self.updateNextUin2(model.next_uin2);

        //更新叫分玩家的叫分的分数
        if (self._userList[model.op_uin])
            self._userList[model.op_uin].grab_action = model.grab_action;

        if (self.isLordConfirmed()) {

            //如果地主已经确定，则更新我的手牌数据，以及其他玩家的手牌数量
            self.updateUsersCardInfo(model.card_list);

            //如果地主已经确定，更新地主三张牌的数据
            self.updateThreeCards(model.hole_cards, model.dipai_multi_type, model.dipai_multi);
        }
        self.updateMySelfOperated();
    },

    //加倍数据更新
    updateCacheByMuti(model) {
        let self = this;
        let f = ["next_uin", "status", "op_left_time"];
        self.copyFiled(model, self, f);

        //更新该操作者的uin
        self.opUin = model.op_uin;

        //next_uin2  同时操作的uin
        self.updateNextUin2(model.next_uin2);

        //更新多个用户的加倍状态
        for (let i in model.do_multi) {
            let multiInfo = model.do_multi[i];

            if (self._userList[multiInfo.uin])
                self._userList[multiInfo.uin].call_multiple = multiInfo.result
        }
        self.updateMySelfOperated();

        //更新记牌器数据
        if (self.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME) {
            self.updateCardCounter(model.card_counter);
        }

        if (model.op_uin === qf.cache.user.uin) {
            self.updateSuperDoubleCardInfo(model.super_multi_card);
        }
    },

    //所有用户是否都加倍
    isAllMuti() {
        //多个用户的加倍状态
        for (let k in this._userList) {
            if (this._userList[k].call_multiple === qf.const.LordPokerOper.NOSELECT) {
                return false;
            }
        }
        return true;
    },

    //更新我的手牌以及其他玩家的手牌数量
    updateUsersCardInfo(card_infos) {
        let self = this;
        for (let i in card_infos) {
            let cardInfo = card_infos[i]
            self.updateCardInfo(cardInfo);
        }
    },

    //更新用户手牌
    updateCardInfo(cardInfo) {
        let self = this;
        let u = self.getUserByUin(cardInfo.uin);
        if (u && cardInfo) {
            //更新手牌数量
            u.cards_num = cardInfo.cards_num;

            //更新手牌，如果有的话
            u.cards = [];
            if (!cardInfo.cards) return;
            for (let i = 0; i < cardInfo.cards.length; i++) {
                u.cards[i] = cardInfo.cards[i];
            }
        }
    },

    //打牌
    updateCacheByPlay(model) {
        let self = this;
        //logd("出牌的人的手牌更新-->" + dump(model), "手牌个数");
        let f1 = ["card_type", "next_uin", "status", "op_left_time", "next_auto_buchu", "short_op_flag"];
        self.copyFiled(model, self, f1);

        //更新该操作者的uin
        self.opUin = model.op_uin;
        self.last_uin = model.op_uin;
        //打牌阶段只有一个
        self.next_uin2 = [];

        self.playCards = [];
        self.copyArray(model.play_cards, self.playCards);

        self.updateUsersCardInfo(model.card_list);

        if (self.playCards.length > 0) {
            self.lastCards = self.playCards; //记录手牌
            //self.copyArray(model.last_cards, self.lastCards) //记录手牌

            self.lastCards2 = [];
            //暂时没有赖子 mark by raintian
            //self.copyArray(model.cards2,self.lastCards2) //记录手牌中的癞子

            if (self.opUin === qf.cache.user.uin) {
                //自己出牌，清空记录牌
                self.lastCards = [];
            }
        }

        self.updateMySelfOperated();

        //更新记牌器数据
        self.updateCardCounter(model.card_counter);
    },

    //托管
    updateCacheByTuoGuan(model) {
        let self = this;
        let u = self.getUserByUin(model.uin);
        if (!u) return;
        u.auto_play = model.auto;
    },

    //判断玩家是否是机器人
    getIsRobot(uin) {
        let self = this;
        let u = self.getUserByUin(uin);
        if (u)
            return (u.is_robot === 1);
    },

    //判断玩家是否处于托管
    getIsUserAutoPlay(uin) {
        let self = this;
        let u = self.getUserByUin(uin);
        if (u)
            return (u.auto_play === 1);
        else
            return false;
    },

    //结算
    updateCacheByResult(model) {
        let self = this;
        loge("游戏结算数据 ")
        cc.log(model)
        let f1 = [
            "is_winner", //0:失败, 1:胜利
            "win_score", //小于0失败 大于0胜利
            "win_gold", //玩家输赢金币
            "call_score", //叫分
            "cost_time", //耗时:秒
            "spring_type", //春天类型
            "multiple", //加倍系数(不包含炸弹和春天等)
            "bomb_count", //炸弹系数
            "landlord_uin", //地主的uin
            "is_abolish", //是否是流局， 0: 不是  1: 是
            "over_flag", //整场结束标记位  0: 否  1: 是
        ];

        self.resultInfo = {};
        self.copyFiled(model, self.resultInfo, f1);
        //更新分享相关
        self.updateResultShareInfo(model.share_info);
        self.updateResultMultipleInfo(model.multiple_info);
        self.total_player_num = model.total_player_num; //总的参赛人数
        self.expected_wait_time = model.expected_wait_time; //预计本副牌等待时间
        self.updateUserInfo(model.player_info);
        self.updateUsersCardInfo(model.card_list);
        self.updateResultList(model.player_result);
        self.status = qf.const.LordGameStatus.GAME_STATE_READY;

        //更新记牌器数据
        self.updateCardCounter(model.card_counter);

        self.updateLuckyTask(model.lucky_task_info);
    },


    updateCacheByExitDesk(model) {
        let self = this;
        self.opUin = model.op_uin;

        //更新牌桌玩家的字段
        self.updateUserInfo(model.player_info);
    },

    //获取结束牌局缓存的信息
    getResultInfo() {
        let self = this;
        return self.resultInfo;
    },

    //更新三张底牌
    updateThreeCards(cards, multi_type, multiple) {
        let self = this;
        self.threeCards = [];
        for (let i in cards) {
            self.threeCards.push(cards[i]);
        }

        self.dipai_multi = multiple;
        self.dipai_multi_type = multi_type;
    },

    copyArray(src, dest) {
        let self = this;
        for (let i = 0; i < src.length; i++) {
            dest[i] = src[i];
        }
    },

    copyFiled(src, dest, filed) {
        let self = this;
        for (let k in filed) {
            let v = filed[k];
            dest[v] = src[v];
        }
    },

    genCards(cards) {
        let ret = [];
        for (let k in cards) {
            let v = cards[k];
            ret.push((v - 3) * 4);
        }
        return ret;
    },

    getSexByUin(uin) {
        if (this._userList[uin]) {
            return this._userList[uin].sex;
        }
        return -1;
    },

    getCardNumByUin(uin) {
        //手牌的数量
        if (this._userList[uin]) {
            return this._userList[uin].cards_num;
        }
    },

    getSexBySeatid(seatid) {
        for (let k in this._userList) {
            let v = this._userList[k]
            if (v.seat_id === seatid)
                return v.sex;
        }
        return -1;
    },

    //桌子中当前抢地主最大的类型值
    getMaxGrabAction() {
        return this.max_grab_action;
    },

    //获取牌局状态
    getStatus() {
        let self = this;
        return self.status;
    },

    //获取当前操作者的uin 注：进桌会更新进桌者的uin, 打牌会更新打牌者的uin
    getOpUin() {
        let self = this;
        return self.opUin;
    },

    //用uin查询玩家信息
    getUserByUin(uin) {
        let self = this;
        return self._allUserList[uin];
    },

    removeUserByUin(uin) {
        let self = this;

        for (let k in self._allUserList) {
            if (uin === parseInt(k)) {
                self._allUserList[uin] = null;
                delete self._allUserList[uin];
            }
        }
    },

    //获取用户列表  只获取在桌上的
    getUserList() {
        let self = this;
        return self._userList;
    },
    //获取在桌上的用户列表
    getUserListLength() {
        let self = this;
        return self.userListLength;
    },

    //用uin查询在座玩家信息
    getOnDeskUserByUin(uin) {
        let self = this;
        return self._userList[uin];
    },

    //获取所有用户列表
    getAllUserList() {
        let self = this;
        return self._allUserList;
    },
    //获取所有用户列表长度
    getAllUserListLength() {
        let self = this;
        return self.allUserListLength;
    },
    //用uin查询玩家信息
    getObserveUserByUin(uin) {
        let self = this;
        return self._observeUserList[uin];
    },

    //获取所有用户列表
    getObserveUserList() {
        let self = this;
        return self._observeUserList;
    },
    //获取所有用户列表长度
    getObserveUserListLength() {
        let self = this;
        return self.observeUserListLength;
    },

    //获取下一个操作者的uin
    getNextUin() {
        let self = this;
        return self.next_uin;
    },

    //在加倍阶段会有3个操作者，所以该接口获取操作者列表
    getNextUin2() {
        let self = this;
        return self.next_uin2;
    },

    //获取上一个操作者的uin
    getLastUin() {
        let self = this;
        return self.last_uin;
    },

    //我是否是地主
    isMySelfLand() {
        let self = this;
        return (self.landlord_uin === qf.cache.user.uin);
    },

    //获取当前操作者的剩余操作时间
    getOpLeftTime() {
        let self = this;
        return self.op_left_time;
    },

    //获取地主的uin
    getLordUin() {
        let self = this;
        return self.landlord_uin;
    },

    //获取三张底牌
    getThreeCards() {
        let self = this;
        return self.threeCards;
    },

    getBottomMultiple() {
        let self = this;

        return self.dipai_multi;
    },

    getBottomMultipleType() {
        let self = this;

        return self.dipai_multi_type;
    },

    //获取上一手打出的牌，即桌面上的出牌
    getLastCards() {
        let self = this;
        return self.lastCards;
    },

    //获上一手打出的牌的数量
    getLastCardsNum() {
        let self = this;
        return (self.lastCards ? self.lastCards.length : 0);
    },

    //清空上一手的牌
    clearLastCards() {
        let self = this;
        self.lastCards = [];
    },
    //判断地主是否确定
    isLordConfirmed() {
        let self = this;
        return (self.landlord_uin && self.landlord_uin > 0);
    },

    //获取倍数，该倍数为游戏倍数，不包含加倍操作的倍数
    getMultiple() {
        let self = this;
        if (self.multiple) {
            return self.multiple;
        } else {
            return 0;
        }
    },

    //判断当前是否应该是我操作
    isMyTurn() {
        let self = this;
        let isMineSameOper = false;
        if (self.getStatus() === qf.const.LordGameStatus.GAME_STATE_MUTIPLE) {
            for (let k in self.next_uin2) {
                let uin = self.next_uin2[k];
                if (uin === qf.cache.user.uin) {
                    isMineSameOper = true;
                    break;
                }
            }
        }
        return (self.next_uin === qf.cache.user.uin || isMineSameOper);
    },

    //获取我的手牌
    getMyHandCards() {
        let self = this;
        let user = self.getUserByUin(qf.cache.user.uin);
        if (user) {
            return user.cards;
        }
        return [];
        //  let tmpTable = [ 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        // return tmpTable;
    },

    //获取出牌玩家的出牌信息
    getLastCardsInfoList() {
        let self = this;
        return self.lastCardsInfoList;
    },


    //设置进桌音效标示(标示音效是否开启 true开启, false关闭)
    setEnterDeskMusicFlag(flag) {
        let self = this;
        self.enterDeskMusicFlag = flag;
    },

    //获取进桌音效标示
    getEnterDeskMusicFlag() {
        let self = this;
        return self.enterDeskMusicFlag;
    },

    //获取玩家打出的牌
    getPlayCards() {
        let self = this;
        return self.playCards;
    },

    //获取带癞子的手牌
    getLastCards2() {
        let self = this;
        return self.lastCards2;
    },

    //获取癞子点数
    getLaiziPoint() {
        let self = this;
        return self.laizi_point;
    },

    //获取用户出牌标示
    getIsUserSendCard() {
        let self = this;
        return self.isUserSendCard;
    },

    //设置用户出牌标示
    setIsUserSendCard(bool) {
        let self = this;
        self.isUserSendCard = bool;
    },

    //获取下个操作者是否自动不要
    getIsNextAutoBuChu() {
        let self = this;
        return (self.next_auto_buchu === qf.const.LordPokerAutoOper.BUYAO);
    },

    //设置自己是否已操作过标记（client）
    setIsMySelfOperated(isMySelfOperated) {
        let self = this;
        self.isMySelfOperated = isMySelfOperated;
    },

    //更新自己是否已操作过标记（server）
    updateMySelfOperated() {
        let self = this;
        if (self.isMyTurn())
            self.setIsMySelfOperated(false);
        else
            self.setIsMySelfOperated(true);
    },

    //获取自己是否已操作过标记（client）
    getIsMySelfOperated() {
        let self = this;
        return self.isMySelfOperated;
    },

    //清除所有玩家叫分，加倍
    clearAllCallAndMuti() {
        let self = this;
        for (let k in self._userList) {
            let u = self._userList[k];
            u.call_multiple = qf.const.LordPokerOper.NOSELECT;
            u.call_score = qf.const.LordPokerOper.NOSELECT;
        }
    },

    //创建我自己对所有人的备注名映射列表
    createRemarkMap() {
        let self = this;
        self.remarkMap = {}
        if (self.remark_map) {
            try {
                self.remarkMap = JSON.parse(self.remark_map);
                logd("****decode remarkMap sucess****");
            } catch (e) {
                self.remarkMap = {};
                logd("****decode remarkMap fail****");
            }
            dump(self.remarkMap);
        }
    },

    //根据openid获取对应的备注名
    getRemarkByOpenid(openid) {
        let self = this;
        self.remarkMap = self.remarkMap || {};
        let oneremark = self.remarkMap[openid];
        let remark = "";
        if (oneremark)
            remark = oneremark;
        return remark;
    },

    //更新自定义房间
    updateCustomData(model) {

    },

    //对局类型
    getDeskName() {
        let self = this;
        return self.cm_data.name || "";
    },

    //对局类型
    getBattleType() {
        let self = this;
        return self.cm_data.battle_type || qf.const.BATTLE_TYPE_NORMAL;
    },

    //最大局数
    getMaxRound() {
        let self = this;
        return self.cm_data.max_round;
    },
    //当前局数
    getCurRound() {
        let self = this;
        return self.round_index;
    },

    //是不是决胜局
    getIsFinalRound() {
        let self = this;
        // return self.is_final_round;
    },

    //地主封顶分数
    getCapScore() {
        let self = this;
        return self.cm_data.cap_score;
    },

    //是否允许旁观
    getAllowView() {
        let self = this;
        return self.cm_data.allow_view;
    },

    //获取服务费
    getEnterFee() {
        let self = this;
        return self.cm_data.enter_fee;
    },

    //获取首叫人的Uin
    getFirstGrabUin() {
        let self = this;
        return self.first_grab_uin;

    },

    //更新同时操作人数uin列表
    updateNextUin2(model) {
        let self = this;
        self.next_uin2 = [];
        if (!model) return;
        self.copyArray(model, self.next_uin2);
    },

    //更新牌桌上公共倍数
    updateMultiInfo(model) {
        let self = this;
        self.multiInfo = {};
        self.multiple = 0;
        if (!model) {
            return;
        }
        let f1 = [
            "multiple", //玩家倍数（总倍数）--与进桌一致
            "init_multi", //初始倍数
            "show_multi", //明牌倍数
            "qdz_multi", //抢地主倍数
            "dipai_multi", //底牌倍数
            "bomb_multi", //炸弹倍数
            "spring_multi", //春天倍数
            "common_multi", //公共倍数
            "landloard_increase", //地主加倍倍数
            "farmer_increase", //农民加倍
        ];
        self.copyFiled(model, self.multiInfo, f1);
        self.multiple = model.multiple;
    },

    getMultiInfo() {
        let self = this;

        return self.multiInfo;
    },

    updateOpUserInfo(model) {
        let self = this;

        /*optional int32 status = 1;				//牌桌状态
        optional int32 next_uin = 2;				// 可操作人员
        optional int32 op_left_time = 3;			//操作剩余时间*/

        let feild = ["status", "next_uin", "op_left_time", "next_uin2"];
        self.copyFiled(model, self, feild);
    },

    getTypeInfo() {
        let self = this;
        let typeInfo = {
            roomId: self.room_id,
            deskMode: self.desk_mode
        };
        return typeInfo;
    },

    setStanduserArray(array) {
        let self = this;
        self._standUpUserArray = array;
    },

    getStandUserArray() {
        let self = this;
        return self._standUpUserArray;
    },

    getRoundId() {
        let self = this;
        return self.round_id;
    },

    isFriendDesk() {
        let self = this;
        if (self.room_id === qf.cache.config.friend_room_id || self.room_id === qf.cache.config.friend_room_id_no_shuffle) { //是好友房间  显示分数
            return true;
        }
        return false;
    },

    getShortOpFlag() {
        let self = this;
        return self.short_op_flag;
    },

    //更新记牌器数据
    updateCardCounter(data) {
        let self = this;
        self.card_counter = {};
        if (data) {
            self.card_counter.counts = data.counts;
            self.card_counter.can_use_counts = data.can_use_counts;
            if (data.remain_list) {
                self.card_counter.remain_list = [];
                for (let i in data.remain_list) {
                    let v = data.remain_list[i];
                    self.card_counter.remain_list.push(v);
                }
            }
        }
    },

    // 更新记牌器显示
    updateCardCounterShow(need_pop_card_counter) {
        let self = this;

        self.need_pop_card_counter = need_pop_card_counter;
    },

    //获取记牌器数据
    getCardCounter() {
        let self = this;
        return self.card_counter;
    },

    updateFortuneInfo(model) {
        let self = this;
        if (!model || model.fortune_infos.length <= 0) return;
        for (let k in model.fortune_infos) {
            let v = model.fortune_infos[k];
            let u = self._userList[v.uin];
            if (u)
                u.gold = v.gold;
        }
    },

    //更新定制信息
    updateCmData(model) {
        let self = this;
        if (!model) return;
        self.cm_data = {};

        let f2 = ["name",
            "battle_type", //对局类型： 1经典场 2.癞子玩法
            "max_round", //最大局数
            "cap_score", //地主封顶分数
            "allow_view", //是否允许旁观 0 否， 1是
            "enter_fee", //服务费
        ];

        self.copyFiled(model, self.cm_data, f2);
    },

    //获取最后一幅牌是否自动打出
    getIsLastCardsAuto() {
        return qf.const.LordPokerAutoLastOper.NOTAUTO;
    },

    //更新分享相关
    updateResultShareInfo(info) {
        let self = this;
        self.resultShareInfo = {};
        if (!info) return;
        let f1 = [
            "share_type", //分享类型 1春天 2反春 3分享盈利翻倍 4刷新连胜记录 5刷新倍数记录 6打出高连胜 7打出高倍数 8分享免输 9分享保级
            "client_title", //小于0失败 大于0胜利
            "times", //倒计时长
            "share_str", //分享一句文案
            "share_icon", //分享图
            "share_id", //分享图文id
            "hand_id", //hand_id
            "icon_txt", //客户端显示图片内的文案
            "match_txt", // 赛事字段
            "protect", // 保级 分享图文信息
            "loss", // 输了 分享图文信息
            "x_dimension", // x维度的值，没有x维度则为空字符串
            "gte_two_hundred", // 0 输赢不大于200   1 输赢大于等于200
            "gold_box", // 金币宝箱 分享图文信息
        ];
        self.copyFiled(info, self.resultShareInfo, f1);
    },

    //更新公共倍数相关
    updateResultMultipleInfo(info) {
        let self = this;
        self.resultMultipleInfo = {};
        if (!info) return;
        let f1 = [
            "init_multi", //初始倍数
            "show_multi", //明牌倍数的值
            "spring_multi", //春天倍数
            "dipai_multi", //底牌倍数
            "bomb_multi", //炸弹倍数
            "qdz_multi", //抢地主倍数
            "common_multi", //公共倍数
            "landlord_multi", //地主加倍倍数
            "farmers_multi", //农民加倍倍数
            "total_multi", //总倍数
        ];
        self.copyFiled(info, self.resultMultipleInfo, f1);
    },

    //获取结算分享数据
    getResultShareInfo(data) {
        let self = this;

        return self.resultShareInfo;
    },

    //获取结算公共倍数数据
    getResultMultipleInfo(data) {
        let self = this;

        return self.resultMultipleInfo;
    },

    //记牌器分享气泡时间
    getCounterCardTime() {
        let self = this;

        return self.card_counter_time;
    },

    //更新赛事活动信息
    updateEventGameActivityData(report) {
        let self = this;
        if (!report) return;
        self.eventActivityData = [];

        for (let j in report) {
            let task = report[j];
            let f1 = [
                "task_desc", //任务描述
                "schedule_desc", //进度描述
                "status", //0未完成 1已完成
            ];
            let taskData = {};
            self.copyFiled(task, taskData, f1);
            self.eventActivityData.push(taskData);
        }

    },

    //获取赛事活动信息
    getEventGameActivityData() {
        let self = this;

        return self.eventActivityData;
    },

    //更新超级加倍卡信息
    updateSuperDoubleCardInfo(info) {
        let self = this;

        if (!info) return;

        self.superDoubleCardInfo = info;
    },

    //获取超级加倍卡信息
    getSuperDoubleCardInfo() {
        let self = this;

        return self.superDoubleCardInfo || 0;
    },

    //地主是否还未打出第一手牌
    setLordFirstHandle(is_first_card) {
        let self = this;
        self.is_first_card = is_first_card;
    },

    getLordFirstHandle() {
        let self = this;
        return self.is_first_card;
    },
});