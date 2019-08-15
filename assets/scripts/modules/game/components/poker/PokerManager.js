let PokerOtherManager = require("./PokerOtherManager");
let PokerUtil = require("../PokerUtil");
let PokerAnimation = require("../PokerAnimation");

cc.Class({
    extends: PokerOtherManager,

    properties: {
        SORT_KING: 0,
        SORT_BOMB: 1,
        SORT_THREE: 2,
        SORT_PAIR: 3,

        POKER_SCALE: 0,
        CUR_POKER_COUNT: null,

        OPER_POKER_TAG: 99778866,
    },

    onLoad() {
        this.CUR_POKER_COUNT = {
            FOUR: 4,
            SIX: 6,
            NINE: 9,
            TWELVE: 12,
            FOURTEEN: 14,
            SIXTEEN: 16,
            SEVENTEEN: 17,
        }

        this.POKER_SCALE = qf.pokerconfig.pokerScale.MAX;
        this.initDifferent();
    },

    initDifferent() {
        this._pokers = [];

        this._pokersLen = null; // poker的长度
        this._leftPosx = null; // 最左边的
        this._boundingBox = null; // aabb盒子
        this._beganPoint = null; // 鼠标点击的点
        this._isDraging = false; // 是否在拖拽
        this._dragingCardsNode = null; //拖拽的牌的节点
        this._dragingPokers = null; //拖拽牌的对象表
        this._clickOIndex = null; // 非标准区域的点击
        this._promitIndex = null; // 当前提示到第几个了
        this._promitTables = null; // 提示列表

        this.tuoguanStatus = false; // 是否是托管狀態
        this.canTouch = !this.tuoguanStatus; //牌是不是可以点
        this.closeDrag = true; // 关闭拖拽
        this.playingAni = false; //发牌动画播放中
        this.multiple = true;

        this.init();

        this.handCardsPos = cc.v2(0, 0);
    },

    init() {
        this.pu = new PokerUtil();
        // this.pokerAnimation = new PokerAnimation();

        qf.utils.addTouchEvent(this.node, this.touchended.bind(this), this.touchmoved.bind(this), this.touchbegan.bind(this));
    },

    touchbegan(event) {
        let touch = event.touch;
        if (this._pokers.length === 0) return false; // poker为0
        let inDeskUser = qf.cache.desk.getOnDeskUserByUin(qf.cache.user.uin);
        if (!this.canTouch || !inDeskUser) return false;

        let point = touch.getLocation();
        this._beganPoint = point;
        this._isDraging = false;
        this._clickOIndex = null;

        if (this._boundingBox.intersection(point)) { //点击区域在牌内
            let index = this.getIndexByPoint(point);
            if (qf.utils.isValidType(index)) {
                this._pokers[index].mark();
                return true;
            }
        } else if ((point.x >= this._leftPosx) //在牌外，检查是否点击了弹出了牌
            &&
            (point.x < this._leftPosx + this._pokersLen) &&
            (point.y < this.getUpY() + qf.pokerconfig.pokerInversionDistance * this.POKER_SCALE) &&
            (point.y >= this.getDownY())) {
            let index = this.getPokerByPoint(point); // 获取点击的牌
            if (qf.utils.isValidType(index)) {
                let index2 = this.getIndexByPoint(point);
                if (index !== index2) {
                    this._clickOIndex = index;
                }
                this._pokers[index].mark();
                return true;
            }
        }
        return false;
    },

    touchmoved(event) {
        if (!this.canTouch) return;
        let touch = event.touch;
        let point = touch.getLocation();
        if (this.closeDrag) { //拖拽关了
            this.updateMarkStatus(point);
            return;
        }

        if (point.y > this.getUpY() + qf.pokerconfig.pokerInversionDistance * this.POKER_SCALE || this._isDraging) {
            // 被拖出屏幕了,牌跟着走呗
            // 先要检查选择之前有没有牌是弹起状态
            if (!this._isDraging) {
                this.genDragingCards();
                this._isDraging = true;
            }
            this._dragingCardsNode.adjustPoint(point);
        } else if (!this._isDraging) { //用户在牌内拖来拖去,且不是在外面
            this.updateMarkStatus(point);
        }
    },

    touchended(event) {
        if (!this.canTouch) return;
        let touch = event.touch;

        if (this._isDraging) { //检查mark状态，若是拖动状态

            let point = touch.getLocation();

            if (this._boundingBox.intersection(point)) { //非法规则直接放回，或者拖到了牌内
                this.putDragingCardsToPokers();
            } else {
                // 发送消息打牌，并且返回参数
                const isCanSend = (qf.cache.desk.getNextUin() === qf.cache.user.uin) && (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME); //先检查自己的状态- 若处理自己出牌阶段
                const param = { drag: true, isCanSend: isCanSend };
                this.sendCard(param);
                if (!isCanSend) { //不是你的状态
                    this.putDragingCardsToPokers();
                }
            }
        } else { //非拖动状态
            let smartTips = true;
            for (let k in this._pokers) {
                let v = this._pokers[k];
                if (v.isUp) {
                    smartTips = false;
                    break;
                }
            }
            if (smartTips) {
                /*选之前一个都没选中，那么应该智能提示,
                    检查选中的中，有没有候选提示方案,如果没有，则全部选中*/

                let markCards = [];
                for (let k in this._pokers) {
                    let v = this._pokers[k];
                    if (v.isMark) {
                        markCards.push(v.id);
                    }
                }

                if (markCards.length <= 0) {
                    smartTips = false;
                } else if ((qf.cache.desk.getLastCardsNum() === 0)) { // 忽略生成提示的
                    logd(" ---智能提示啊 ---- ");
                    // v500需求，玩家手动划出的牌全部弹起
                    smartTips = false;
                } else {
                    logd(" ---- 从提示列表中寻找候选的 ---- "); //如果找不到
                    if (this._promitTables && this._promitTables.length !== 0) {
                        let hasCards = false;
                        if (markCards.length > 1) {
                            //判断提示的是选中的子集
                            let scards = qf.pokerai.getSmartCardsInPromitTable(markCards, this._promitTables, this._pokers);

                            if (scards) {
                                hasCards = true;
                                this.upCards1(qf.pokerai.unSerialization(scards), markCards);
                                this.clearMark();
                            }
                        }
                        if (!hasCards) {
                            //判断选中的是提示的子集
                            let scards1 = qf.pokerai.getSmartCardsInPromitTable1(markCards, this._promitTables, this._pokers);
                            if (scards1) {
                                this.upCards1(qf.pokerai.unSerialization(scards1), markCards);
                                this.clearMark();
                            } else {
                                smartTips = false;
                            }
                        }
                    } else {
                        smartTips = false;
                    }
                }
            }

            let temp_cards = [];
            if (!smartTips) {
                for (let k in this._pokers) {
                    let v = this._pokers[k];
                    if (v.isMark) {
                        v.doInversion();
                        temp_cards.push(v);
                    }
                    v.unmark();
                }
            }

            if (temp_cards.length > 1) {
                this.node.runAction(cc.repeat(
                    cc.sequence(
                        cc.callFunc(() => {
                            MusicPlayer.playMyEffect("xuanpai");
                        }),
                        cc.delayTime(0.05)
                    ), temp_cards.length > 5 ? 5 : temp_cards.length))
            } else if (temp_cards.length === 1) {
                MusicPlayer.playMyEffect("xuanpai");
            }
        }
        //到我操作拖牌显示按钮
        this.sendInfoToBnt();
    },

    setCards(pokers) {
        this.clear();

        let count = pokers.length;
        let pos = this.pokerAnimation.getPos(this.handCardsPos, count, this.POKER_SCALE, 0, true).pos;

        for (let i in pokers) {
            let id = pokers[i];
            let poker = qf.pokerpool.take({ id: id, resType: qf.const.NEW_POKER_TYPE.NORMAL });
            poker.scale = this.POKER_SCALE;
            poker.x = pos[i].x;
            poker.y = pos[i].y;

            poker.parent = this.node;
            this._pokers.push(poker);
        }

        qf.pokerutil.sortPokers(this._pokers);
        this.updatePokers();
    },

    updatePokers() {
        if (this._pokers.length === 0) return;
        this.cardTypeAutoAdjust();

        let count = this._pokers.length;
        let pos = this.pokerAnimation.getPos(this.handCardsPos, count, this.POKER_SCALE, 0, true).pos;

        for (let i in this._pokers) {
            let intI = qf.func.checkint(i) + 1;

            let poker = this._pokers[i];
            poker.x = pos[i].x;
            poker.y = pos[i].y;

            poker.setInitDownPosY(pos[i].y);

            poker.isUp && poker.setUp();
            poker.unDizhu();
            poker.unCardShow();

            poker.zIndex = intI;
            poker.setColorSpriteShow(false);

            let curRowNum = Math.floor(intI / qf.pokerconfig.maxRowPokerNum);

            if ((curRowNum > 0 && intI === curRowNum * qf.pokerconfig.maxRowPokerNum) || intI === count) {
                poker.setColorSpriteShow(true);
            }

            if (qf.cache.desk.isMySelfLand()) {
                this._pokers[this._pokers.length - 1].setDizhu(0);
            }

            let user = qf.cache.desk.getUserByUin(qf.cache.user.uin);

            if (user && user.show_multi > 1) {
                this._pokers[this._pokers.length - 1].setCardShow(0);
            }

            this.updateBoundingBox();
            this.canTouch = !this.tuoguanStatus;
        }
    },

    cardTypeAutoAdjust() {
        let twoPokerArr = [];
        let threePokerArr = [];
        let fourPokerArr = [];

        for (let i in this._pokers) {
            let poker = this._pokers[i];
            let intI = qf.func.checkint(i);

            if (intI === qf.const.CARDTYPEAUTOADJUST_COUNT.NINE) {
                twoPokerArr.push(poker.id);
                threePokerArr.push(poker.id);
                fourPokerArr.push(poker.id);
            }
            if (intI === qf.const.CARDTYPEAUTOADJUST_COUNT.TEN) {
                twoPokerArr.push(poker.id);
                threePokerArr.push(poker.id);
                fourPokerArr.push(poker.id);
            }
            if (intI === qf.const.CARDTYPEAUTOADJUST_COUNT.ELEVEN) {
                threePokerArr.push(poker.id);
                fourPokerArr.push(poker.id);
            }
            if (intI === qf.const.CARDTYPEAUTOADJUST_COUNT.TWELVE) {
                fourPokerArr.push(poker.id);
            }
        }

        if (qf.pokerai.getPA().getCardTypeWithFullId(fourPokerArr) === qf.const.LordPokerType.ZHADAN) {
            qf.pokerconfig.cardTypeAutoAdjust(qf.const.LordPokerType.ZHADAN);
        } else if (qf.pokerai.getPA().getCardTypeWithFullId(threePokerArr) === qf.const.LordPokerType.SAN) {
            qf.pokerconfig.cardTypeAutoAdjust(qf.const.LordPokerType.SAN);
        } else if (qf.pokerai.getPA().getCardTypeWithFullId(twoPokerArr) === qf.const.LordPokerType.DUIZI) {
            qf.pokerconfig.cardTypeAutoAdjust(qf.const.LordPokerType.DUIZI);
        } else {
            qf.pokerconfig.cardTypeAutoAdjust(-1);
        }

        return true;
    },

    getInsertCards(cards) {
        let pokerTable = [];

        for (let k in cards) {
            let v = cards[k];
            let bfind = this.findPokerId(v);
            if (!bfind) {
                pokerTable.push(v);
            }
        }

        return pokerTable;
    },

    findPokerId(pokerId) {
        for (let k in this._pokers) {
            let v = this._pokers[k];
            if (v.id === pokerId) {
                return true;
            }
        }

        return false;
    },

    insertCards(cards) {
        cards = this.getInsertCards(cards);

        if (cards.legnth <= 0) return;

        for (let i in cards) {
            let card = cards[i];

            let poker = qf.pokerpool.take({ id: card, resType: qf.const.NEW_POKER_TYPE.NORMAL });
            poker.scale = this.POKER_SCALE;
            poker.parent = this.node;
            this._pokers.push(poker);
        }

        qf.pokerutil.sortPokers(this._pokers);
        this.updatePokers();

        let hash2 = {};
        for (let i in cards) {
            let card = cards[i];
            hash2[card] = true;
        }

        for (let i in this._pokers) {
            let poker = this._pokers[i];

            if (hash2[poker.id]) {
                poker.y = poker.getInitDownPosY(); + qf.pokerconfig.insertPokerUpDistance;
                poker.stopAllActions();

                poker.runAction(cc.sequence(
                    cc.delayTime(qf.pokerconfig.insertPokerDelayTime),
                    cc.moveTo(qf.pokerconfig.insertPokerMoveTime, cc.v2(poker.x, poker.getInitDownPosY())),
                    cc.callFunc(() => {
                        if (qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin)) {
                            this.allMark();
                        }
                    })
                ))
            }
        }
    },

    removeCard() {
        let pokers = [];

        for (let i in this._pokers) {
            if (this._pokers[i]) {
                pokers.push(this._pokers[i]);
            }
        }

        this._pokers = pokers;
        this.updatePokers();
    },

    removeCardsByIndex(index) {
        for (let k in index) {
            let v = index[k];
            this._pokers[v].clear();
            this._pokers[v] = null;
        }

        this.removeCard();
    },

    genDragingCards() {
        let dragingIndexs = [];

        for (let k in this._pokers) { //先判断有没有选牌
            let v = this._pokers[k];
            if (v.isUp) { dragingIndexs.push(k); }
        }

        if (dragingIndexs.length === 0) {
            for (let k in this._pokers) {
                let v = this._pokers[k];
                if (v.isMark) { dragingIndexs.push(k); }
            }
        }

        this.clearMark();

        if (dragingIndexs.length !== 0) { //重新设置牌，且重新
            this._dragingCardsNode = new cc.Node();
            this._dragingCardsNode.parent = this.node;
            this._dragingCardsNode.zIndex = qf.pokerconfig.otherZ;

            this._dragingPokers = [];

            for (let k in dragingIndexs) {
                let v = dragingIndexs[k];

                let p = this._pokers[v];

                this._pokers[v] = null;
                this._dragingPokers[k] = { poker: p, index: v };
                p.parent = this._dragingCardsNode;
                p.unDizhu();
                p.unCardShow();
                let i = qf.func.checkint(k);
                if ((i === dragingIndexs.length - 1) && qf.cache.desk.isMySelfLand()) {
                    p.setDizhu(0); // 打出的牌设置地主标志
                }
            }

            this._dragingCardsNode.offsetx = qf.pokerutil.getPokerLen(dragingIndexs.length) / 2; //设置呗
            this._dragingCardsNode.offsety = this.handCardsPos.y;

            this._dragingCardsNode.adjustPoint = (point) => {
                this.setPosition(cc.v2(point.x - 0.5 * this.offsetx, point.y - 0.5 * this.offsety));
            }

            this.removeCard();
        }
    },

    putDragingCardsToPokers() {
        for (let k in this._dragingPokers) {
            let v = this._dragingPokers[k];

            let poker = v.poker;

            poker.isUp = true;

            let len = this._pokers.length;
            for (let i = len - 1; i >= 0; i--)
                if (i === v.index) {
                    this._pokers[i + 1] = this._pokers[i];
                    this._pokers[i] = poker;
                } else if (i > v.index) {
                this._pokers[i + 1] = this._pokers[i];
            }
            poker.parent = this.node;
        }
        this.updatePokers();
        this._dragingCardsNode.parent = null;
        this._dragingCardsNode = null;
        this._dragingPokers = null;
    },

    updateBoundingBox() {
        this._pokersLen = qf.pokerutil.getPokerLen(this._pokers.length) * this.POKER_SCALE;

        this._leftPosx = -this._pokersLen / 2;
        let height = 0;
        let row = Math.ceil((this._pokers.length - 1) / qf.pokerconfig.maxRowPokerNum);

        if (this._pokers.length > 0) {
            height = (qf.pokerconfig.pokerHeight + row * qf.pokerconfig.pokerSpace[0].height) * this.POKER_SCALE;
        }

        this._boundingBox = cc.rect(this._leftPosx, this.getDownY(), this._pokersLen, height);
    },

    getUpY() {
        let row = Math.floor((this._pokers.length - 1) / qf.pokerconfig.maxRowPokerNum);
        return (qf.pokerconfig.pokerHeight + row * qf.pokerconfig.pokerSpace[0].height) * 0.5 * this.POKER_SCALE;
    },

    getDownY() {
        let row = Math.floor((this._pokers.length - 1) / qf.pokerconfig.maxRowPokerNum);
        return -(qf.pokerconfig.pokerHeight + row * qf.pokerconfig.pokerSpace[0].height) * this.POKER_SCALE / 2;
    },

    clear() {
        this.clearNoPokerThanOther();
        this.removeTuoGuan();
        for (let k in this._pokers) {
            let v = this._pokers[k];
            if (v) {
                v.clear();
            }
        }

        this._pokers = [];
        qf.pokerpool.initPool();
        this.updateBoundingBox();
        this.playingAni = false;
    },

    getIndexByPoint(point) {
        for (let i = this._pokers.length - 1; i >= 0; i--) {
            let v = this._pokers[i];

            if ((point.x >= -qf.pokerconfig.pokerWidth * this.POKER_SCALE / 2) &&
                (point.x < qf.pokerconfig.pokerWidth * this.POKER_SCALE / 2) &&
                (point.y >= -qf.pokerconfig.pokerHeight * this.POKER_SCALE / 2) &&
                (point.y < qf.pokerconfig.pokerHeight * this.POKER_SCALE / 2)) {
                return i;
            }
        }
    },

    getPokerByPoint(point) {
        for (let i = this._pokers.length - 1; i >= 0; i--) {
            let v = this._pokers[i];

            if ((point.x >= v.x - qf.pokerconfig.pokerWidth * this.POKER_SCALE / 2) &&
                (point.x < v.x + qf.pokerconfig.pokerWidth * this.POKER_SCALE / 2) &&
                (point.y >= v.y - qf.pokerconfig.pokerHeight * this.POKER_SCALE / 2) &&
                (point.y < v.y + qf.pokerconfig.pokerHeight * this.POKER_SCALE / 2) &&
                (v.isUp)) {
                return i;
            }
        }
        return null;
    },

    updateMarkStatus(point) {
        let bpoint = this._beganPoint;

        if (qf.utils.isValidType(this._clickOIndex)) { //修复非标准区域的选择问题
            bpoint.x = (this._clickOIndex + 0.5) * qf.pokerconfig.pokerDistance;
        }

        // 检查区间
        let number = this._pokers.length;

        let beginIndex = this.getIndexByPoint(bpoint);
        let endIndex = this.getIndexByPoint(point);
        if (!((beginIndex !== null) && (endIndex !== null))) return;

        if (beginIndex > endIndex) {
            let tempIndex = endIndex;
            endIndex = beginIndex;
            beginIndex = tempIndex;
        }

        for (let i = 0; i < number; i++) {
            if (i >= beginIndex && i <= endIndex) {
                this._pokers[i].mark();
            } else {
                this._pokers[i].unmark();
            }
        }
    },

    sendInfoToBnt() {
        qf.utils.targetStopDelayRun(this, this.OPER_POKER_TAG);
        qf.utils.targetDelayRun(this, qf.pokerconfig.pokerInversionTime * 1.5, () => {
            if (this.checkIsCanOperate()) {
                this.updateOperBtns(); // 更新btn信息
            }
        }, this.OPER_POKER_TAG);
    },

    checkIsCanOperate() {
        let isCanOperate = false;

        if ((qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME) &&
            (qf.cache.desk.getNextUin() === qf.cache.user.uin) &&
            (qf.cache.desk.getShortOpFlag() !== qf.const.OP_FLAG.SHORT) &&
            (!qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin))) {
            isCanOperate = true;
        }
        return isCanOperate;
    },

    updateOperBtns() {
        let advanceOutCards = [];

        for (let k in this._pokers) {
            let v = this._pokers[k];
            if (v.isUp) {
                advanceOutCards.push(v.id);
            }
        }

        let isBtnShow = qf.const.OPER_BTN_STAUTS.SHOW;
        let isBtnUnShow = qf.const.OPER_BTN_STAUTS.UNSHOW;
        let isBtnUnAble = qf.const.OPER_BTN_STAUTS.UNABLE;

        let bShowBuYao = false;
        let btnBuYaoStatus = isBtnUnAble;
        let lastCards = qf.cache.desk.getLastCards();

        if (lastCards.length > 0) {
            bShowBuYao = true;
            btnBuYaoStatus = isBtnShow;
        }
        let cObj = qf.pokerai.checkCanSendCards(advanceOutCards, lastCards, (qf.pokerai.getLaiziHash2(lastCards, qf.cache.desk.getLastCards2())).length);
        let ret = cObj.isCanSend;
        if (ret) {
            if (qf.cache.user.uin === qf.cache.desk.getLordUin() && qf.cache.desk.getLordFirstHandle()) {
                let user = qf.cache.desk.getUserByUin(qf.cache.user.uin);
                loge(user)
                if (user && user.show_multi > 1) {
                    this.node.emit(qf.ekey.DDZ_PM_UPDATEOPERBTNS, [
                        [0, isBtnUnShow],
                        [1, isBtnUnShow],
                        [2, isBtnUnShow],
                        [3, isBtnUnShow],
                        [4, isBtnUnShow],
                        [5, isBtnUnShow],
                        [6, isBtnShow]
                    ]);
                } else {
                    this.node.emit(qf.ekey.DDZ_PM_UPDATEOPERBTNS, [
                        [0, isBtnUnShow],
                        [1, isBtnUnShow],
                        [2, isBtnUnShow],
                        [3, isBtnUnShow],
                        [4, isBtnShow],
                        [5, isBtnShow],
                        [6, isBtnUnShow]
                    ]);
                }
            } else {
                this.node.emit(qf.ekey.DDZ_PM_UPDATEOPERBTNS, [
                    [0, btnBuYaoStatus],
                    [1, isBtnShow],
                    [2, isBtnShow],
                    [3, isBtnUnShow],
                    [4, isBtnUnShow],
                    [5, isBtnUnShow],
                    [6, isBtnUnShow]
                ]);
            }
        } else {
            if (qf.cache.user.uin === qf.cache.desk.getLordUin() && qf.cache.desk.getLordFirstHandle()) {
                let user = qf.cache.desk.getUserByUin(qf.cache.user.uin);
                loge(user)
                if (user && user.show_multi > 1) {
                    this.node.emit(qf.ekey.DDZ_PM_UPDATEOPERBTNS, [
                        [0, isBtnUnShow],
                        [1, isBtnUnShow],
                        [2, isBtnUnShow],
                        [3, isBtnUnShow],
                        [4, isBtnUnShow],
                        [5, isBtnUnShow],
                        [6, isBtnUnAble]
                    ]);
                } else {
                    this.node.emit(qf.ekey.DDZ_PM_UPDATEOPERBTNS, [
                        [0, isBtnUnShow],
                        [1, isBtnUnShow],
                        [2, isBtnUnShow],
                        [3, isBtnUnShow],
                        [4, isBtnUnAble],
                        [5, isBtnShow],
                        [6, isBtnUnShow]
                    ]);
                }
            } else {
                this.node.emit(qf.ekey.DDZ_PM_UPDATEOPERBTNS, [
                    [0, btnBuYaoStatus],
                    [1, isBtnShow],
                    [2, isBtnUnAble],
                    [3, isBtnUnShow],
                    [4, isBtnUnShow],
                    [5, isBtnUnShow],
                    [6, isBtnUnShow]
                ]);
            }

        }
        this.node.emit(qf.ekey.DDZ_PM_SETIMGNOLARGER, false);
    },

    clearMark() {
        for (let k in this._pokers) {
            this._pokers[k].unmark();
        }
    },

    allMark() {
        for (let i in this._pokers) {
            let poker = this._pokers[i];
            poker.mark();
        }
    },

    noPokerThanOther() {
        this.canTouch = false;
        this.allPokerSetDown();
        this.allMark();
    },

    clearNoPokerThanOther() {
        if (!this.tuoguanStatus) {
            this.clearMark();
            this.canTouch = !this.tuoguanStatus;
        }
    },

    pokerNotRight(drag) {

        if (!drag) {
            this.allPokerSetDown();

            let isBtnShow = qf.const.OPER_BTN_STAUTS.SHOW;
            let isBtnUnShow = qf.const.OPER_BTN_STAUTS.UNSHOW;
            let isBtnUnAble = qf.const.OPER_BTN_STAUTS.UNABLE;

            this.node.emit(qf.ekey.DDZ_PM_UPDATEOPERBTNS, [
                [0, isBtnShow],
                [1, isBtnShow],
                [2, isBtnUnAble],
                [3, isBtnUnShow]
            ]);
            this.node.emit(qf.ekey.DDZ_PM_SETIMGNOLARGER, false);
        }
    },

    allPokerPushDown() {
        for (let k in this._pokers) {
            let v = this._pokers[k];
            if (v.isUp) { v.doInversion(); }
        }
    },

    allPokerSetDown() {
        for (let k in this._pokers) {
            let v = this._pokers[k];
            v.setDown();
        }
    },

    allPokerSetUp() {
        for (let k in this._pokers) {
            let v = this._pokers[k];
            v.setUp();
        }
    },

    isValueChecked(card, cards) {
        for (let k in cards) {
            let curCard = cards[k];
            if (curCard === card) { //在数组中
                return true;
            }
        }
        return false;
    },

    getCardsByType(cards, type) {
        let sameValueCardsLength = 1;
        let curTypeCards = [];

        if (type === this.SORT_KING) { // 检查双王
            let pushCardsNums = 0;
            for (let k in cards) {
                let curCard = cards[k];
                let curCardValue = Math.floor(curCard / 4) + 3;

                if (curCardValue === 17) { //大王
                    curTypeCards.push(curCard);
                    pushCardsNums = pushCardsNums + 1;
                } else if (curCardValue === 16) { //小王
                    curTypeCards.push(curCard);
                    pushCardsNums = pushCardsNums + 1;
                }
            }
            if (pushCardsNums === 2) {
                return curTypeCards;
            } else {
                return [];
            }
        } else if (type === this.SORT_BOMB) //检查有炸弹
        {
            sameValueCardsLength = 4;
        } else if (type === this.SORT_THREE) //检查是否3带
        {
            sameValueCardsLength = 3;
        } else if (type === this.SORT_PAIR) //检查是对子
        {
            sameValueCardsLength = 2;
        }

        curTypeCards = [];
        for (let i in cards) {
            let curCheckCard = cards[i];
            if (this.isValueChecked(curCheckCard, curTypeCards)) //当前要检查的值已经 在点数一样的列表里
            {

            } else {
                let curCheckCardValue = Math.floor(curCheckCard / 4) + 3;
                let sameValeNums = 0;
                let sameValeCards = [];
                for (let k in cards) {
                    let curCard = cards[k];
                    let curCardValue = Math.floor(curCard / 4) + 3;
                    if (curCheckCardValue === curCardValue) {
                        sameValeNums = sameValeNums + 1;
                        sameValeCards.push(curCard);
                    }
                }
                if (sameValeNums === sameValueCardsLength) {
                    for (let k in sameValeCards) {
                        let sameCard = sameValeCards[k];
                        curTypeCards.push(sameCard);
                    }
                }
            }
        }

        return curTypeCards;
    },

    getSortCardsWithType(nowcards) {
        if (nowcards && nowcards.length > 0)

            nowcards.sort(qf.utils.compareNumByDes);

        let newcards = [];
        let sortTypes = [this.SORT_KING, this.SORT_BOMB, this.SORT_THREE, this.SORT_PAIR];

        for (let i in sortTypes) {
            let type = sortTypes[i];
            let curTypeCards = this.getCardsByType(nowcards, type);
            for (let k in curTypeCards) {
                let sameCard = curTypeCards[k];
                newcards.push(sameCard);
            }
        }

        for (let k in nowcards) {
            let card = nowcards[k];
            if (this.isValueChecked(card, newcards)) //已经在 四个牌型的列表中
            {

            } else //不在四个牌型的列表中  加上
            {
                newcards.push(card);
            }
        }
        return newcards;
    },

    sendCard(paras) {
        if (!paras.isCanSend) {
            logd(" ----- --不能出牌，不是出牌阶段 ");
            return;
        }

        let nowcards = [];
        let nowcardsNode = [];

        if (paras.drag) {
            for (let k in this._dragingPokers) {
                let v = this._dragingPokers[k];
                nowcards.push(v.poker.id);
                nowcardsNode.push(v.poker);
            }
        } else {
            for (let k in this._pokers) {
                let v = this._pokers[k];
                if (v.isUp) {
                    nowcards.push(v.id);
                    nowcardsNode.push(v);
                }
            }
        }
        nowcards = this.getSortCardsWithType(nowcards);

        qf.event.dispatchEvent(qf.ekey.LORD_NET_DISCARD_REQ, { card: nowcards, cards2: [] }) // 发送给服务器
    },

    genPromitTable() {
        let cards = [];
        for (let k in this._pokers) {
            let v = this._pokers[k];
            cards.push(v.id);
        }

        this._promitTables = qf.pokerai.promit(cards, qf.cache.desk.getLastCards(), (qf.pokerai.getLaiziHash2(qf.cache.desk.getLastCards(), qf.cache.desk.getLastCards2())).length);

        this._promitIndex = 0;
        return this._promitTables.length;
    },

    promit() {
        if (!this._promitTables) {
            this.genPromitTable();
        }

        if (this._promitTables.length === 0) { //没有提示，点提示按钮就不出
            this.node.emit(qf.ekey.DDZ_PM_DONTSENDCARD)
            return;
        }

        let upcards = qf.pokerai.unSerialization(this._promitTables[this._promitIndex]);
        this._promitIndex = this._promitIndex + 1;
        if (this._promitIndex > this._promitTables.length - 1) {
            this._promitIndex = 0;
        }

        this.upCards(upcards);
    },

    upCards(upcards) {
        for (let k in this._pokers) {
            let v = this._pokers[k];
            let id = Math.floor(v.id / 4) + 3;
            if (upcards[id] && (upcards[id] > 0)) { //这些要弹起
                upcards[id] = upcards[id] - 1;
                v.markUp = true;
                if (!v.isUp) {
                    v.doInversion();
                }
            } else { //这些要坐下
                if (v.isUp) {
                    v.markDown = true;
                }
            }
        }

        let number = 0;
        for (let k in upcards) {
            let v = upcards[k];
            number = number + v;
        }

        for (let k in this._pokers) {
            let v = this._pokers[k];

            if (v.laizi && (number > 0) && (!v.markUp)) {
                number = number - 1;
                if (!v.isUp) {
                    v.doInversion();
                }
                v.markDown = false;
            }
        }

        for (let k in this._pokers) {
            let v = this._pokers[k];

            v.markUp = null;
            if (v.markDown) {
                v.setDown();
                v.markDown = false;
            }
        }
        this.sendInfoToBnt();
    },

    //开始
    upCards1(upcards, markCards) {
        let realCards = this.getRealUpCards(upcards, markCards);

        for (let k in this._pokers) {
            let v = this._pokers[k];
            let id = Math.floor(v.id / 4) + 3;
            if (upcards[id] && (upcards[id] > 0)) { //这些要弹起
                if (realCards[id]) {
                    let has = false;
                    for (let j in realCards[id]) {
                        if (realCards[id][j] === v.id) {
                            has = true;
                            break;
                        }
                    }
                    if (has) {
                        upcards[id] = upcards[id] - 1;
                        v.markUp = true;
                        if (!v.isUp) {
                            v.doInversion();
                        }
                    } else {
                        //这些要坐下
                        if (v.isUp) { v.markDown = true; }
                    }
                } else {
                    upcards[id] = upcards[id] - 1;
                    v.markUp = true;
                    if (!v.isUp) {
                        v.doInversion();
                    }
                }
            } else { //这些要坐下
                if (v.isUp) {
                    v.markDown = true;
                }
            }
        }

        let number = 0;
        for (let k in upcards) {
            let v = upcards[k];
            number = number + v;
        }

        for (let k in this._pokers) {
            let v = this._pokers[k];

            if (v.laizi && (number > 0) && (!v.markUp)) {
                number = number - 1;
                if (!v.isUp) {
                    v.doInversion();
                }
                v.markDown = false;
            }
        }

        for (let k in this._pokers) {
            let v = this._pokers[k];

            v.markUp = null;
            if (v.markDown) {
                v.setDown();
                v.markDown = false;
            }
        }
        this.sendInfoToBnt();
    },

    getRealUpCards(upcards, markCards) {
        let allCards = {};
        for (let k in this._pokers) {
            let v = this._pokers[k];
            let id = Math.floor(v.id / 4) + 3;
            if (!allCards[id]) {
                allCards[id] = [];
            }
            allCards[id].push(v.id);
        }

        let mcards = {};
        for (let k in markCards) {
            let v = markCards[k];
            let id = Math.floor(v / 4) + 3;
            if (upcards[id] && (upcards[id] > 0)) {
                if (!mcards[id]) {
                    mcards[id] = [];
                }
                mcards[id].push(v);
            }
        }

        let realCards = {};
        for (let k in allCards) {
            let v = allCards[k];
            let id = k;
            if (upcards[id] && (upcards[id] > 0) && (v.length > upcards[id])) {
                if (mcards[id] && mcards[id].length > 0 && upcards[id] >= mcards[id].length) {
                    let card_ = this.getCardsByNum(v, upcards[id], mcards[id]);
                    if (card_ && card_.length > 0) {
                        realCards[id] = card_;
                    }
                }
            }
        }
        return realCards;
    },

    getCardsByNum(cards, unum, mcards) {
        let sortCards = [];

        //得到sortCards：[4,5],[5,6],[6,7],[7,8]
        for (let i = 0; i < cards.length; i++) {
            let num = 0;
            let k = i;
            let scards = [];
            for (let j = k; j < cards.length; j++) {
                scards.push(cards[j]);
                num = num + 1;
                if (num === unum) {
                    sortCards.push(scards);
                    break;
                }
            }
        }

        //得到sortCards：[4,5]
        for (let i = 0; i < sortCards.length; i++) {
            let v = sortCards[i];
            let isMatch = false;
            for (let j = 0; j < mcards.length; j++) {
                let m = mcards[j];
                let isMatch0 = false;
                for (let k = 0; k < v.length; k++) {
                    if (m === v[k]) {
                        isMatch0 = true;
                    }
                }
                if (!isMatch0) {
                    isMatch = false;
                    break;
                } else {
                    isMatch = true;
                }
            }
            if (isMatch) {
                return v;
            }
        }
    },

    clearPromit() {
        this._promitTables = null;
    },

    getSelectCards() {
        let result = {};
        let sel = [];
        let index = [];
        for (let k in this._pokers) {
            let v = this._pokers[k];
            if (v.isUp) {
                sel.push(v.id);
                index.push(k);
            }
        }
        result.sel = sel;
        result.index = index;
        return result;
    },

    sendCardAnimationsByDrag(type, laizicards) {
        let cardNodes = [];
        let allpos = [];
        for (let k in this._dragingPokers) {
            let v = this._dragingPokers[k];
            let poker = v.poker;
            cardNodes.push(poker);
            allpos.push(poker.convertToWorldSpace(cc.v2(0, 0)));
        }

        this.changLaiziToDestValue(cardNodes, laizicards);
        this.pokerAnimation.sendCardByDrag(cardNodes, type, allpos, this._dragingCardsNode.getPosition());
        this._dragingCardsNode.parent = null;
        this._dragingCardsNode = null;
        this._dragingPokers = null;
    },

    sendCardAnimations(paras) {
        if (!paras.laizicards) {
            paras.laizicards = [];
        }
        let type1 = null;
        if (qf.utils.isValidType(paras.ctype)) {
            type1 = paras.ctype;
        } else {
            if (paras.laizicards.length <= 0) {
                type1 = qf.pokerai.getCardTypeWithFullId(paras.cards);
            } else {
                type1 = qf.pokerai.getCardTypeWithFullId(paras.laizicards);
            }

        }
        let laizicards = paras.laizicards;

        logd(" ----------------出牌 -----" + type1);
        if (paras.drag) {
            qf.cache.desk.setIsUserSendCard(true);
            this.sendCardAnimationsByDrag(type1, laizicards);
            return;
        }

        //如果癞子有牌，则代表
        let cardNodes = [];
        paras.cards = this.getSortCardsWithType(paras.cards);
        if (paras.index === 0 && paras.uin === qf.cache.user.uin) {

            if (paras.reconnect) { //断线重连的,直接显示
                let count = paras.cards.length;
                for (let k in paras.cards) {
                    let i = qf.func.checkint(k) + 1;
                    let v = paras.cards[k];
                    cardNodes[k] = qf.pokerpool.take({ id: v, resType: qf.const.NEW_POKER_TYPE.NORMAL });
                    cardNodes[k].scale = this.POKER_SCALE;
                    cardNodes[k].setColorSpriteShow(false);
                    let curRowNum = Math.floor(i / qf.pokerconfig.maxRowPokerNum);
                    if (curRowNum > 0 && i === curRowNum * qf.pokerconfig.maxRowPokerNum)
                        cardNodes[k].setColorSpriteShow(true);
                    if (i === count)
                        cardNodes[k].setColorSpriteShow(true);

                }
                this.pokerAnimation.sendCard0WithReconnect(cardNodes);
                return;
            }

            if (qf.cache.desk.getIsUserSendCard()) { return; }

            cardNodes = paras.cardsNode;
            let needFind = false;
            if (!cardNodes) { //说明托管出牌,需要到牌堆里面去找
                cardNodes = [];
                needFind = true;
            }

            let cardHash1 = [];
            for (let k in paras.cards) {
                let v = paras.cards[k];
                cardHash1.push(v);
            }

            for (let i in cardHash1) {
                let id = cardHash1[i];
                for (let k in this._pokers) {
                    let v = this._pokers[k];
                    if (v && v.id === id) {
                        v.unDizhu();
                        v.unCardShow();
                        let pos = cc.v2(v.x, v.y);
                        v.worldPosition = v.parent.convertToWorldSpace(pos);

                        v.unmark();
                        if (needFind) {
                            cardNodes.push(v);
                        }

                        this._pokers[k] = null; //mark
                    }
                }

            }

            cardHash1 = [];

            this.removeCard(); //清理牌
            qf.cache.desk.setIsUserSendCard(true);
        } else {
            for (let k in paras.cards) {
                let v = paras.cards[k];
                let poker = qf.pokerpool.take({ id: v, resType: qf.const.NEW_POKER_TYPE.NORMAL });
                cardNodes.push(poker);
                poker.opacity = 0;
                poker.scale = this.POKER_SCALE;
            }
        }

        this.changLaiziToDestValue(cardNodes, laizicards);
        if (cardNodes.length === 0) { return; }
        if (paras.land) { cardNodes[cardNodes.length - 1].setDizhu(0); } else if ((paras.index === 0) && (qf.cache.desk.isMySelfLand())) { cardNodes[cardNodes.length - 1].setDizhu(0); }

        if ((paras.uin === qf.cache.user.uin) || paras.isShowCards) {
            let user = qf.cache.desk.getUserByUin(qf.cache.user.uin);
            if (user && user.show_multi > 1) cardNodes[cardNodes.length - 1].setCardShow(0);
        }

        //设置牌中心图标显示
        let count = cardNodes.length;
        for (let k in cardNodes) {
            let poker = cardNodes[k];
            let i = qf.func.checkint(k) + 1;
            poker.setColorSpriteShow(false);
            let curRowNum = Math.floor(i / qf.pokerconfig.maxRowPokerNum);
            if (curRowNum > 0 && i === curRowNum * qf.pokerconfig.maxRowPokerNum)
                poker.setColorSpriteShow(true);
            if (i === count)
                poker.setColorSpriteShow(true);
        }

        this.pokerAnimation.sendCard(cardNodes, type1, paras.index, paras.uin, paras.notShowAction);
    },

    changLaiziToDestValue(cardNodes, _laizicards) {
        for (let k in cardNodes) {
            let v = cardNodes[k];
            if ((Math.floor(v.id / 4) + 3) === qf.cache.desk.getLaiziPoint()) {
                v.setLaizi(true);
            }
        }

        let cards = [];
        for (let k in cardNodes) {
            let v = cardNodes[k];
            cards.push(v.id);
        }

        let laizicards = qf.pokerai.getLaiziHash2(cards, _laizicards);

        if (laizicards.length !== 0) {
            let laiziindex = 0;
            for (let k in cardNodes) {
                let v = cardNodes[k];
                if ((v.laizi === true) && (laizicards.length >= laiziindex)) {
                    let to = laizicards[laiziindex];
                    laiziindex = laiziindex + 1;
                    v.id = qf.pokerconfig.shortIDToLong(to);
                }
            }
        }

        for (let k in cardNodes) {
            let v = cardNodes[k];
            let zOrder = qf.func.checkint(k) + 1;
            v.zIndex = zOrder;
        }
    },

    clearDeskCard(index) {
        this.pokerAnimation.clearCards(index);
    },

    clearAllDeskCards() {
        for (let index = 0; index <= 2; index++) {
            this.pokerAnimation.clearCards(index);
        }
    },

    // getPokerAnimation() {
    //     return this.pokerAnimation;
    // },

    addTuoGuan() {
        this.tuoguanStatus = true;
        this.canTouch = !this.tuoguanStatus;

        this.node.emit(qf.ekey.DDZ_PM_HINDALLBTNS);
        this.node.emit(qf.ekey.DDZ_PM_SETIMGNOLARGER, false);
        this.refreshPokers();
        this.allPokerSetDown();
        this.allMark();
    },

    refreshPokers() {
        if (!this.playingAni) { return; }
        this.setCards(qf.cache.desk.getMyHandCards());
    },

    removeTuoGuan() {
        this.tuoguanStatus = false;
        this.canTouch = !this.tuoguanStatus;
        this.clearMark();
    },

    checkMyHandCards() {
        let tmpcards = [];
        for (let k in this._pokers) {
            let v = this._pokers[k];
            tmpcards.push(v.id);
        }

        qf.cache.desk.getMyHandCards().sort((a, b) => {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });

        tmpcards.sort((a, b) => {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });

        let cardIsRight = true;
        if (qf.cache.desk.getMyHandCards().length !== this._pokers.length) {
            cardIsRight = false;
        } else {
            let handTable = qf.cache.desk.getMyHandCards();
            for (let k in handTable) {
                let v = handTable[k];
                if (v !== tmpcards[k]) {
                    cardIsRight = false;
                    break;
                }
            }
        }

        if (!cardIsRight) {
            logd(" ----- 牌不對，需要同步牌 ----- ");
            this.setCards(qf.cache.desk.getMyHandCards());
            this.setLaizi();
            if (this.tuoguanStatus) {
                this.addTuoGuan();
            }
            this.clearDeskCard(0);
        } else if (cardIsRight) {
            logd(" ----- 牌与服务器相同，不需要同步牌 ----- ");
        }
    },

    setCardsWithAnimations(cards, panel) {
        this.clear();
        this.canTouch = false;
        this.playingAni = true;
        let total = cards.length;
        let objPos = this.pokerAnimation.getPos(this.handCardsPos, total, this.POKER_SCALE, 0, true);
        let ppp = objPos.pos;
        for (let k in cards) {
            let i = qf.func.checkint(k) + 1;
            let v = cards[k];
            let p = qf.pokerpool.take({ id: v, resType: qf.const.NEW_POKER_TYPE.NORMAL });
            p.scale = this.POKER_SCALE;
            p.x = ppp[k].x;
            p.y = ppp[k].y;

            p.active = false;
            p.parent = this.node;

            this._pokers[k] = p;

            p.setColorSpriteShow(false);
            let curRowNum = Math.floor(i / qf.pokerconfig.maxRowPokerNum);
            if (curRowNum > 0 && i === curRowNum * qf.pokerconfig.maxRowPokerNum)
                p.setColorSpriteShow(true);
            if (i === total)
                p.setColorSpriteShow(true);

        }

        let time = 0;
        let battle_type = qf.cache.desk.getBattleType();
        if (battle_type === qf.const.BATTLE_TYPE_UNSHUFFLE) {
            //不洗牌玩法
            time = this.setAnimationWithNoShuffle(objPos, panel);
        } else {
            time = this.setAnimation(objPos);
        }
        return time;
    },

    setAnimation(objPos) {
        let total = this._pokers.length;
        let time = 0;
        let delayIntervTime = 0.15;
        let moveTime = 0.4;
        this.stopPokersAllAcitons();

        let count = 0;
        let multiple;

        let user = qf.cache.desk.getUserByUin(qf.cache.user.uin);

        for (let i in this._pokers) {
            let v = this._pokers[i];
            let k = qf.func.checkint(i) + 1;
            ((v, k) => {
                v.runAction(cc.sequence(
                    cc.delayTime(delayIntervTime * k),
                    cc.callFunc(() => {
                        v.setVisible(true);
                        count++;
                        if (this.multiple && user && user.show_multi === 1) {
                            if (count > this.CUR_POKER_COUNT.SIXTEEN) {
                                qf.event.dispatchEvent(qf.ekey.HIDE_ALL_BTNS);
                            } else {
                                if (count <= this.CUR_POKER_COUNT.SIX) multiple = qf.const.SHOW_CARD_MULTIPLE.FOUR;
                                if (count > this.CUR_POKER_COUNT.SIX && count <= this.CUR_POKER_COUNT.TWELVE) multiple = qf.const.SHOW_CARD_MULTIPLE.THREE;
                                if (count > this.CUR_POKER_COUNT.TWELVE && count <= this.CUR_POKER_COUNT.FOURTEEN) multiple = qf.const.SHOW_CARD_MULTIPLE.TWO;
                                qf.event.dispatchEvent(qf.ekey.UPDATE_SHOW_CARD_BTN, { multiple: multiple });
                            }
                        }

                        if (k === total) {
                            this.updateMultiple(true);
                            this.stopPokersAllAcitons();
                            this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(() => {
                                this.actSecond(moveTime, objPos);
                            })));
                        }
                    })
                ))

            })(v, k);
        }

        time = total * delayIntervTime + moveTime + 0.1;
        return time;
    },

    setAnimationWithNoShuffle(objPos, panel) {
        let total = this._pokers.length;
        let delayIntervTime = 0.05;
        let _time = 0.15;
        let moveTime = 0.4;
        this.stopPokersAllAcitons();

        let shufflePanel = panel;
        let shuffleNodes = cc.find("node_shuffles", shufflePanel);
        shufflePanel.active = true;

        let count = 0;
        let multiple;

        let user = qf.cache.desk.getUserByUin(qf.cache.user.uin);

        let num = 6;
        let intervalTime = 0.4;
        for (let i in this._pokers) {
            let v = this._pokers[i];
            let k = qf.func.checkint(i) + 1;
            let shuffle = new cc.Node();
            shuffle.addComponent(cc.Sprite);
            shuffle.parent = shuffleNodes;

            shuffle.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.poker, qf.tex.poker_bg_big1);

            ((v, k, shuffle) => {
                //自己
                let pos_0 = v.parent.convertToWorldSpace(cc.v2(v.x, v.y));
                let pos = shuffleNodes.convertToNodeSpace(pos_0);
                shuffle.runAction(cc.sequence(
                    cc.delayTime(delayIntervTime * k + Math.floor((k - 1) / num) * intervalTime),
                    cc.spawn(
                        cc.moveTo(_time, pos),
                        cc.scaleTo(_time, 1)
                    ),
                    cc.callFunc(() => {
                        v.active = true;
                        count++;
                        if (this.multiple && user && user.show_multi === 1) {
                            if (count >= this.CUR_POKER_COUNT.SEVENTEEN) {
                                qf.event.dispatchEvent(qf.ekey.HIDE_ALL_BTNS);
                            } else {
                                if (count <= this.CUR_POKER_COUNT.SIX) multiple = qf.const.SHOW_CARD_MULTIPLE.FOUR;
                                if (count > this.CUR_POKER_COUNT.SIX && count <= this.CUR_POKER_COUNT.TWELVE) multiple = qf.const.SHOW_CARD_MULTIPLE.THREE;
                                if (count > this.CUR_POKER_COUNT.TWELVE && count <= this.CUR_POKER_COUNT.SEVENTEEN) multiple = qf.const.SHOW_CARD_MULTIPLE.TWO;
                                qf.event.dispatchEvent(qf.ekey.UPDATE_SHOW_CARD_BTN, { multiple: multiple });
                            }
                        }

                        if (shuffle) {
                            shuffle.parent = null;
                        }

                        if (k === total) {
                            this.updateMultiple(true);
                            this.stopPokersAllAcitons();
                            this.node.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(() => {
                                this.actSecond(moveTime, objPos);
                            })));
                        }
                    })
                ));
            })(v, k, shuffle);
        }

        let time = total * delayIntervTime + Math.floor((total - 1) / num) * intervalTime + _time + moveTime + 0.1;
        return time;
    },

    updateMultiple(value) {
        this.multiple = value;
    },

    stopPokersAllAcitons() {
        for (let k in this._pokers) {
            let v = this._pokers[k];
            v.stopAllActions();
        }
        let battle_type = qf.cache.desk.getBattleType();
        if (battle_type === qf.const.BATTLE_TYPE_UNSHUFFLE) {
            //不洗牌玩法
            this.node.emit(qf.ekey.DDZ_PM_SHUFFLEPANELHIDE);
        }
    },

    stopSendPokersAcitons() {
        this.updateMultiple(true);
        this.stopPokersAllAcitons();
        this.playingAni = false;
        let cards = qf.cache.desk.getMyHandCards();
        if (!cards) {
            cards = [];
        }
        if (cards && cards.length > 0) {
            this.setCards(cards);
        }
    },

    actSecond(moveTime, objPos) {
        let total = this._pokers.length;
        let objFinalPos = this.pokerAnimation.getPos(this.handCardsPos, total, this.POKER_SCALE, 0, true, true);

        let finalPos = null;
        if (objPos) {
            finalPos = objPos.pos;
        } else {
            finalPos = objFinalPos.pos;
        }

        let objStartPos = this.pokerAnimation.getPos(this.handCardsPos, total, this.POKER_SCALE, 0, true, true);

        qf.pokerutil.sortPokers(this._pokers);
        this.updatePokers();

        for (let i in this._pokers) {
            let v = this._pokers[i];
            let k = qf.func.checkint(i);

            ((v, k) => {
                v.runAction(cc.sequence(
                    cc.moveTo(moveTime, this.getHandCardsPos()),
                    cc.callFunc(() => {
                        let zOrder = k;
                        v.zIndex = zOrder;
                    }),
                    cc.moveTo(moveTime, cc.v2(finalPos[k].x, finalPos[k].y)),
                    cc.callFunc((sender) => {
                        if (k + 1 === total) {
                            logd("sendPokerFinished2");
                            this.updatePokers();
                            this.playingAni = false;
                        }
                    })
                ));

            })(v, k);
        }
    },

    showLastAllCards(cards, index, parentNode) {
        if (cards.length <= 0) return;

        let cardNodes = [];
        for (let k in cards) {
            let v = cards[k];
            let p = qf.pokerpool.take({ id: v, resType: qf.const.NEW_POKER_TYPE.NORMAL });
            p.scale = this.POKER_SCALE;
            if ((Math.floor(v / 4) + 3) === qf.cache.desk.getLaiziPoint()) { p.setLaizi(true); }
            cardNodes.push(p);

        }
        qf.pokerutil.sortPokers(cardNodes);

        let total = cardNodes.length;
        for (let k in cardNodes) {
            let i = qf.func.checkint(k) + 1;
            let p = cardNodes[k];
            p.setColorSpriteShow(false);
            let curRowNum = Math.floor(i / qf.pokerconfig.maxRowPokerNum);
            if (curRowNum > 0 && i === curRowNum * qf.pokerconfig.maxRowPokerNum)
                p.setColorSpriteShow(true);
            if (i === total)
                p.setColorSpriteShow(true);
        }

        if (index === 0) {
            this.pokerAnimation.showLastAnimation(cardNodes, index, parentNode, true);
            this.clear();
        } else if (index === 1) {
            this.pokerAnimation.showLastAnimation(cardNodes, index, parentNode, true);
        } else if (index === 2) {
            this.pokerAnimation.showLastAnimation(cardNodes, index, parentNode, true);
        }
    },

    setLaizi() {
        qf.pokerai.laizi = null;
        let laiziPoint = qf.cache.desk.getLaiziPoint();
        if (!laiziPoint) { return; }
        if (laiziPoint <= 2) { return; }
        qf.pokerai.laizi = laiziPoint;

        for (let k in this._pokers) {
            let v = this._pokers[k];
            if ((Math.floor(v.id / 4) + 3) === laiziPoint) {
                v.setLaizi(true);
            }
        }

        qf.pokerutil.sortPokers(this._pokers);
        this.updatePokers();
    },

    clearLaizi() {
        qf.pokerai.laizi = null;
    },

    getHandCardsPos() {
        return this.handCardsPos;
    },

    updateShowCard(cards) {
        this.setCards(cards);
    },

    setAllPokerDownByClick() {
        if (this._pokers.length === 0) { return; }
        let inDeskUser = qf.cache.desk.getOnDeskUserByUin(qf.cache.user.uin);
        if (!this.canTouch || !inDeskUser) { return; }

        logd("-----------------setAllPokerDownByClick-----------------");
        this.allPokerSetDown();
        this.sendInfoToBnt();
    },

    setLastCardsAuto() {
        this.canTouch = false;
        this.allPokerSetDown();
    }
})