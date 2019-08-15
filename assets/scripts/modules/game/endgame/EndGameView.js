let AbstractGameView = require("../AbstractGameView");

cc.Class({
    extends: AbstractGameView,

    onLoad() {
        this.adjustIPhoneX("root");
    },

    initPublicModule() {
        this._super();
    },

    initEvent() {
        qf.cache.user.on(qf.cache.user.DIAMOND_CHANGE, this.updateMoney, this);
    },

    initUI() {
        this.root = this.node.getChildByName('root');

        this.panel_poker = cc.find("panel_poker", this.root);
        this.panel_robot_poker = cc.find("panel_robot_poker", this.root);

        this.panel_send_self = cc.find("panel_send_self", this.root);
        this.panel_send_robot = cc.find("panel_send_robot", this.root);

        this.panel_btn_mgr = cc.find("pan_btn_mgr", this.root);

        this.imgNoLargerOthers = cc.find("img_no_larger_others", this.root);
        this.imgNoLargerOthers.active = false;

        this.pan_user = cc.find("pan_user", this.root);
        this.pan_robot = cc.find("pan_robot", this.root);

        this.txt_diamond_num = cc.find("btn_diamond/txt_diamond_num", this.root);
        this.txt_recharge_num = cc.find("btn_recharge/txt_recharge_num", this.root);
        this.txt_diamond_num.string = 0;
        this.txt_recharge_num.string = 0;

        this.txt_play_way = cc.find("panel_center/txt_play_way", this.root);
        this.txt_play_way.active = false;

        this.btn_gameTips = cc.find("btn_gameTips", this.root);
        this.btn_gameReset = cc.find("btn_gameReset", this.root);
        this.btn_exit = cc.find("btn_exit", this.root);
        this.btn_diamond = cc.find("btn_diamond", this.root);
        this.btn_get_diamond = cc.find("btn_get_diamond", this.root);

        this.PM = this.panel_poker.getComponent("EndGamePokerManager");
        this.PM.init({mainView: this});

        this.PM_Robot = this.panel_poker.getComponent("EndGamePokerManager");
        this.PM_Robot.init({mainView: this, isRobot: true});

        this.BM = this.panel_btn_mgr.getComponent("EndGameButtonManager");

        this.user[0] = this.pan_user.getComponent("EndGameUser");
        this.user[1] = this.pan_robot.getComponent("EndGameUser");

        this.updateMoney();
    },

    updateMoney() {
        this.txt_recharge_num.setString(qf.cache.desk.getEndGamePlayTimes() <= 100 ? qf.cache.desk.getEndGamePlayTimes() : "100+")

        let diamond = qf.cache.user.diamond_amount;
        this.txt_diamond_num.string = qf.utils.getFormatNumber(diamond);
    },
    
    //提示按钮
    onClickGameTips() {
        loge("残局提示");

        if (qf.cache.desk.getShortOpFlag() === qf.const.OP_FLAG.SHORT) {
            qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, {txt: qf.txt.endgame_TipTxt[7]});
            return;
        }
        qf.event.dispatchEvent(qf.ekey.LORD_ENDGAME_REMIND_VIEW);
    },

    //钻石红包
    onClickGameReset() {
        loge("钻石红包");

        qf.rm.checkLoad("diamondActivity", ()=> {
            qf.mm.show("diamondActivity");
        })
    },

    //钻石点击
    onClickGameReset() {
        loge("钻石点击");
    },

    //退出按钮
    onClickGameReset() {
        loge("退出");

        let content = qf.cache.desk.getEndGameMaxLevel() >= qf.cache.desk.getEndGameDeskLevel() ?qf.txt.endgame_TipTxt[6] : qf.txt.endgame_TipTxt[5];
            
        qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {sureCb: ()=> {
            qf.event.dispatchEvent(qf.ekey.LORD_NET_EXIT_DESK_REQ);
        }, isModal : false, content : content});
    },

    sendCard(params) {
        params = params || {};

        let isCanSend = (qf.cache.desk.getNextUin() === qf.cache.user.uin) && (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME);
        params.isCanSend = isCanSend;

        this.PM.sendCard(params);

        return isCanSend;
    },

    setImgNoLargerOtherShow(isShow) {
        this.imgNoLargerOthers.active(isShow);
    },

    getSendPokerPanel(index) {
        if (index === 0) {
            return this.panel_send_self;
        }

        return this.panel_send_robot;
    },

    getButtonManager() {
        return this.BM;
    },

    getPokerManager() {
        return this.PM;
    },

    showMyNotGreaterAni() {
        this.BM.updateOperBtns();
        this.setImgNoLargerOtherShow(false);
    },

    clearDeskCardsByUin(uin) {
        let index = this.getUserIndexByUin(uin);

        this.PM.clearDeskCard(index);
    },

    updateShowCard(onlyRobot) {
        let userList = qf.cache.desk.getUserList();
        for (let uin in userList) {
            let v = userList[uin];
            let u = this.getUser(v.uin);
            if (u) {
                if (qf.utils.isValidType(v.cards)) {
                    if (u.index === 0 && v.uin === Cache.user.uin){
                        if (!onlyRobot){
                            this.PM.updateShowCard(v.cards, u.index);
                        }
                        
                    }
                    else{
                        this.PM_Robot.updateShowCard(v.cards, u.index);
                    }
                }
            }
        }
    },

    getUser(uin) {
        let index = this.getUserIndexByUin(uin);
        return  this.getUserWidgetByIndex(index);
    },

    getUserWidgetByIndex(index) {
        if (qf.utils.isValidType(index)) {
            return this.user[index];
        }

        return null;
    },

    getUserIndexByUin(uin) {
        if (uin === qf.cache.user.uin){
            return 0;
        }
        return 1;
    },

    getUserByIndex(index) {
        return this.user[index];
    },

    sendPoker(params) {
        params = params || {};

        let poker = qf.cache.desk.getMyHandCards();
        let robotPokers = qf.cache.desk.getRobotHandCards();

        if (params.aniamtion) {
            this.PM.setCardsWithAnimations(poker,this.getShufflePanel());
            this.PM_Robot.setCardsWithAnimations(robotPokers,this.getShufflePanel());
        }else {
            this.PM.setCards(poker);
            this.PM_Robot.setCards(robotPokers);
        }
    },

    showPlayCards(cards, reconnect, laizicards, index, uin, isShowCards) {
        let a = null;
        let b = null;
        
        if (laizicards.length === 0) {
            a = laizicards;
            b = cards;
        }
        else {
            a = cards;
            b = laizicards;
        }
        
        this.PM.sendCardAnimations({
            index: index,
            server: true,
            laizicards: a,
            cards: b,
            land: qf.cache.desk.getLordUin() === uin,
            reconnect: reconnect,
            uin: uin,
            isShowCards:isShowCards,
        });
    },

    dontSendCard() {
        qf.event.dispatchEvent(qf.ekey.LORD_NET_DISCARD_REQ);
        this.PM.allPokerPushDown();
    },

    enterDesk() {
        qf.music.playMusic(qf.res.lord_music.fightbgm);

        let userList = qf.cache.desk.getUserList();

        for (let key in userList) {
            let user = userList[key];

            if (user.uin !== qf.cache.user.uin) {
                this.user[1].updateUin(user.uin);
            }
        }

        this.txt_play_way.string = cc.js.format("第%s关", qf.cache.desk.getEndGameDeskLevel());
        this.txt_play_way.active = true;
    },

    getTipCard(cards) {
        if (this.PM.tipCardUp(cards)){
            this.PM.updateOperBtns();
        }
    },

    clearLastUI() {
        this.PM.clear();
        this.PM.clearAllDeskCards();
        this.PM_Robot.clear();
        this.PM_Robot.clearAllDeskCards();

        let userList = qf.cache.desk.getUserList();
        for (let uin in userList) {
            let v = userList[uin];
            let uView = this.getUser(v.uin);
            if (uView) {
                uView.clearUser();
            }
        }

        this.setImgNoLargerOtherShow(false);
    }
})