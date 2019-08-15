/*
残局牌桌缓存
*/

cc.Class({
    ctor() {
        let self = this;

        self._userList = {};
        self._alluserList = {};

        self.lastCardsInfoList = [];
        self.lastCards = [];
        self.lastCards2 = [];
        self.cards = [];
        self.playCards = [];

        self.endgame_play_times = 1;
        self.userSendCard = false;

        self.initCMD();

        self.enterDeskMusicFlag = true; //进桌音效是否开启
        self.isUserSendCard = false; //标示用户出牌(客户端)

        self.showTipView = true;
        self.isTip = false;

        self.inDesk = true; //判断桌子是否存在
    },

    initCMD() {
        let self = this;
        self.cmd_list = {};
        self.cmd_list.exitDeskCmd = qf.cmd.ENDGAME_EXIT_DESK_REQ;
        self.cmd_list.queryDeskCmd = qf.cmd.ENDGAME_QUERY_DESK_REQ;
        self.cmd_list.discardCmd = qf.cmd.ENDGAME_DISCARD_REQ;
        self.cmd_list.remindCmd = qf.cmd.ENDGAME_DDZ_REMIND;
        self.cmd_list.checkLevelDiamond = qf.cmd.ENDGAME_CHECK_LEVEL_COST;
        self.cmd_list.resetGameCmd = qf.cmd.ENDGAME_RESET_GAME_REQ;
    },

    //房间类型
    getDeskMode() {
        let self = this;
        return self.desk_mode;
    },

    //设置游戏类型
    setDeskMode(deskMode) {
        let self = this;
        self.desk_mode = deskMode;
    },

    getReqCmd() {
        let self = this;
        return self.cmd;
    },

    updateCacheByJoinGame(model) {
        let self = this;

        let filed = [
            "desk_id",
            "room_id",
            "status",
            "next_uin",
            "room_type",
            "last_uin",
            "desk_mode",
            "round_id",
            "over_flag",
            "short_op_flag",
        ];
        self.copyFiled(model, self, filed);

        //更新该操作者的uin
        self.opUin = model.uin;

        //更新牌桌玩家的字段
        self.updateUserInfo(model.player_info);

        //更新手牌的数量 和我的牌
        self.updateUsersCardInfo(model.card_list);

        //上一手打出的牌
        self.lastCards = [];

        //当前操作者之前的人出牌信息
        self.lastCardsInfoList = [];
        let lastCardsInfoList = model.last_cards;

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
            }
        }
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

    //获取上一个操作者的uin
    getLastUin() {
        let self = this;
        return self.last_uin;
    },

    updateOpUserInfo(model) {
        let self = this;

        let feild = ["status", "next_uin", "op_left_time", "next_uin2"];
        self.copyFiled(model, self, feild);
    },

    //判断当前是否应该是我操作
    isMyTurn() {
        let self = this;

        return (self.next_uin === Cache.user.uin);
    },

    //获取牌局状态
    getStatus() {
        let self = this;
        return self.status;
    },

    updateCacheByExitDesk(model) {
        let self = this;
        self.opUin = model.op_uin;

        //更新牌桌玩家的字段
        self.updateUserInfo(model.player_info);
    },

    //用uin查询玩家信息
    getUserByUin(uin) {
        let self = this;
        return self._allUserList[uin];
    },

    getUserByNotUin(uin) {
        let self = this;
        for (key in self._allUserList) {
            if (Number(key) !== uin) {
                return self._allUserList[key]
            }
        }
    },

    //获取用户列表  只获取在桌上的
    getUserList() {
        let self = this;
        return self._userList;
    },

    //获取我的手牌
    getMyHandCards() {
        let self = this;
        let user = self.getUserByUin(Cache.user.uin);
        if (user) {
            return user.cards;
        }
        return [];
    },

    getRobotHandCards() {
        let self = this;
        let user = self.getUserByNotUin(Cache.user.uin)
        if (user) {
            return user.cards;
        }
        return [];
    },

    //获取下一个操作者的uin
    getNextUin() {
        let self = this;
        return self.next_uin;
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

    //我是否是地主
    isMySelfLand() {
        let self = this;
        return (self.landlord_uin === Cache.user.uin);
    },

    //获取带癞子的手牌
    getLastCards2() {
        let self = this;
        return self.lastCards2;
    },

    //判断玩家是否处于托管
    getIsUserAutoPlay(uin) {
        return false;
    },

    //获取出牌玩家的出牌信息
    getLastCardsInfoList() {
        let self = this;
        return self.lastCardsInfoList;
    },

    //获取所有用户列表
    getAllUserList() {
        let self = this;
        return self._allUserList;
    },

    //用uin查询在座玩家信息
    getOnDeskUserByUin(uin) {
        let self = this;
        return self._userList[uin];
    },

    getShortOpFlag() {
        let self = this;
        return self.short_op_flag;
    },

    //设置自己是否已操作过标记（client）
    setIsMySelfOperated(isMySelfOperated) {
        let self = this;
        self.isMySelfOperated = isMySelfOperated;
    },

    //打牌
    updateCacheByPlay(model) {
        let self = this;

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

            if (self.opUin === Cache.user.uin) {
                //自己出牌，清空记录牌
                self.lastCards = [];
            }
        }
    },

    //更新自己是否已操作过标记（server）
    updateMySelfOperated() {
        let self = this;
        if (self.isMyTurn())
            self.setIsMySelfOperated(false);
        else
            self.setIsMySelfOperated(true);
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

    //获取癞子点数
    getLaiziPoint() {
        let self = this;
        return self.laizi_point;
    },

    //获取玩家打出的牌
    getPlayCards() {
        let self = this;
        return self.playCards;
    },

    //获取当前操作者的uin 注：进桌会更新进桌者的uin, 打牌会更新打牌者的uin
    getOpUin() {
        let self = this;
        return self.opUin;
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

    //结算
    updateCacheByResult(model) {
        let self = this;
        let f1 = [
            "is_winner", //0:失败, 1:胜利
            "win_score", //小于0失败 大于0胜利
            "cost_time", //耗时:秒
            "landlord_uin", //地主的uin
            "over_flag", //整场结束标记位  0: 否  1: 是
        ];

        self.resultInfo = {};
        self.copyFiled(model, self.resultInfo, f1);
        //更新分享相关
        self.total_player_num = model.total_player_num; //总的参赛人数
        self.expected_wait_time = model.expected_wait_time; //预计本副牌等待时间
        self.updateUserInfo(model.player_info);
        self.updateUsersCardInfo(model.card_list);
        self.updateResultList(model.player_result);
        self.status = qf.const.LordGameStatus.GAME_STATE_READY;
    },

    //对局类型
    getBattleType() {
        return qf.const.BATTLE_TYPE_NORMAL;
    },

    //更新玩家输赢结果
    updateResultList(userinfo) {
        let self = this;
        if (!userinfo) return;
        //更新牌桌玩家的结算信息

        self.resultList = [];

        let fresult = ["uin", "nick", "win_gold", "score", "multi", "base_socre"];

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

    //游戏开始
    updateCacheByStartGame(model) {
        let self = this;

        //游戏刚开始没有确定地主是谁
        self.landlord_uin = -1;
        let f1 = ["next_uin", "status", "op_left_time", "max_grab_action", "round_index"];
        self.copyFiled(model, self, f1);

        self.updateUserInfo(model.player_info);

        //更新牌桌上所有人的手牌数量
        self.updateUsersCardInfo(model.card_list);
        self.resultList = [];
    },

    setEndGamePlayTimes(num) {
        let self = this;
        if (num !== null) {
            self.endgame_play_times = num + 1;
        }
    },

    getEndGamePlayTimes() {
        let self = this;
        return self.endgame_play_times;
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

    getSexByUin(uin) {
        let self = this;
        if (self._userList[uin])
            return self._userList[uin].sex;
        return -1;
    },

    getCardNumByUin(uin) {
        let self = this;
        //手牌的数量
        if (self._userList[uin])
            return self._userList[uin].cards_num;
    },

    setEndGameDeskLevel(level) {
        let self = this;

        if (!level) return;

        self.endGameLevel = level;
    },

    getEndGameDeskLevel() {
        let self = this;
        return self.endGameLevel;
    },

    setTipViewShow(isShow) {
        let self = this;

        self.showTipView = isShow;
    },

    getTipViewShow() {
        let self = this;

        return self.showTipView;
    },

    setIsTip(tip) {
        let self = this;

        self.isTip = tip;
    },

    getIsTip() {
        let self = this;

        return self.isTip;
    },

    setDeskCost(diamond) {
        let self = this;
        self.deskCost = diamond;
    },

    getDeskCost() {
        let self = this;
        return self.deskCost;
    },

    clearDesk() {
        let self = this;

        //self.showTipView = true;
        self.endGameLevel = 1;
        self.endgame_play_times = 0;
    },

    setIsInDesk(inDesk) {
        let self = this;

        self.inDesk = inDesk;
    },

    getIsInDesk() {
        let self = this;

        return self.inDesk;
    },

    //用户闯过的最大关卡
    setEndGameMaxLevel(level) {
        let self = this;
        self.user_endgame_level = level;
    },

    getEndGameMaxLevel() {
        let self = this;
        return self.user_endgame_level;
    },

    copyFiled(src, dest, filed) {
        let self = this;
        for (let k in filed) {
            let v = filed[k];
            dest[v] = src[v];
        }
    },

    copyArray(src, dest) {
        let self = this;
        for (let i = 0; i < src.length; i++) {
            dest[i] = src[i];
        }
    },


    //------------------------结算------------------------
    //残局结算
    updateCacheByResult1(model) {
        let self = this;
        let f1 = [
            "is_winner", //0:失败, 1:胜利
        ];

        self.resultInfo1 = {};
        self.copyFiled(model, self.resultInfo1, f1);
        //更新分享相关
        self.updateResultShareInfo1(model);
        self.updateResultReward1(model.awards);
    },

    //结算奖励
    updateResultReward1(model) {
        let self = this;
        if (!model) return;
        self.resultRewardInfo1 = {};

        self.copyArray(model, self.resultRewardInfo1);
    },

    //更新分享相关
    updateResultShareInfo1(model) {
        let self = this;
        self.resultShareInfo1 = {};
        if (!model || !model.share_info) return;
        let f1 = [
            "str", //分享一句文案
            "icon", //分享图
            "share_id", //分享图文id
        ];
        let f2 = [
            "share_type", //分享类型 1胜利分享
        ]
        self.copyFiled(model.share_info, self.resultShareInfo1, f1);
        self.copyFiled(model, self.resultShareInfo1, f2);
    },

    getResultInfo1() {
        let self = this;

        return self.resultInfo1;
    },

    getResultReward1() {
        let self = this;

        return self.resultRewardInfo1;
    },

    getResultShareInfo1() {
        let self = this;

        return self.resultShareInfo1;
    },

    setResultCountDownTime(time) {
        let self = this;

        self.countDownTime = time + 1;
        let countDownFunc = ()=>{
            if (self.countDownTime !== undefined && self.countDownTime >= 0) {
                self.countDownTime--;
                setTimeout(countDownFunc, 1000);
            }
        };
        
        countDownFunc();
    },

    getResultCountDownTime() {
        let self = this;
        return self.countDownTime;
    }
})