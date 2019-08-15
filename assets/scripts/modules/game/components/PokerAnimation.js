cc.Class({
    properties: {
    },

    ctor() {
    },

    setMainView(view) {
        this.MAIN_VIEW = view;

        this.init();
    },

    init() {
        this.node0 = this.MAIN_VIEW.getSendPokerPanel(0);
        this.node1 = this.MAIN_VIEW.getSendPokerPanel(1);
        this.node2 = this.MAIN_VIEW.getSendPokerPanel(2);

        this.ws = cc.winSize;

        let fixNum = this.ws.height / qf.dev_size.h;
        this.showCardsPosT = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
        ];

        this.sendCardsPosT = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 0 },
        ];

        this.bombAnimationCards = {}; //记录最后的手牌，暂时只是用于炸弹的播放
    },

    sendCard(cardsNode, cardType, index, uin, notShowAction) {
        this.bombAnimationCards = this.bombAnimationCards || {};
        this.bombAnimationCards[index] = cardType;
        if (index === 0) this.sendCard0(cardsNode, cardType, uin);
        else if (index === 1) this.sendCard1(cardsNode, cardType, uin, notShowAction);
        else if (index === 2) this.sendCard2(cardsNode, cardType, uin, notShowAction);
    },

    //index(0:自己，1：右上座位，2：左上座位)
    getPos(alignedPos, number, scale, index, isMyHandCard, isSendPokerAni) {
        let offsetTxtT = [{ x: 45, y: 0 }, { x: 0, y: 40 }, { x: 0, y: 40 }];
        let pos = [];
        let cardTypeTxtPos = {};
        let maxLen = qf.pokerconfig.maxOutRowPokerNum;
        if (isMyHandCard) maxLen = qf.pokerconfig.maxRowPokerNum;
        let row = Math.floor((number - 1) / maxLen);
        let len = 0;
        let pokerDistance = qf.pokerconfig.outPokerDistance;
        let pokerHeightDis = qf.pokerconfig.pokerSpace[1].height;

        if (index === 0) {
            pokerHeightDis = qf.pokerconfig.pokerSpace[0].height;
            pokerDistance = qf.pokerconfig.outMyPokerDistance;
        }

        if (isMyHandCard) {
            pokerDistance = qf.pokerconfig.pokerDistance;
        }

        if (isSendPokerAni) {
            pokerDistance = pokerDistance / 2;
        }

        if (number >= maxLen) {
            len = ((maxLen - 1) * pokerDistance + qf.pokerconfig.pokerWidth) * scale;
        } else {
            len = ((number - 1) * pokerDistance + qf.pokerconfig.pokerWidth) * scale;
        }

        let maxLength = len;

        let mX = 0;
        let mY = 0;
        let xX = 0;
        let xY = 0;
        if (index === 0) { //中心对齐
            mX = -1 / 2;
            mY = -1 / 2;
            xX = 1;
            //xY = 0;
        } else if (index === 1) { //右上对齐
            mX = -1;
            mY = -1;
            xX = -1;
            //xY = -1;
        } else if (index === 2) { //左上对齐
            mX = 0;
            mY = -1;
            xX = 1;
            //xY = -1;
        }

        //最大坐标，最小坐标
        let minX = null;
        let maxX = null;

        for (let i = 1; i <= number; i++) {
            let curRow = Math.floor((i - 1) / maxLen);
            let position = {};
            let lastNum = (number - curRow * maxLen); //一行剩余量
            if (lastNum > maxLen) {
                len = maxLength;
            } else {
                len = ((lastNum - 1) * pokerDistance + qf.pokerconfig.pokerWidth) * scale;
            }

            position.x = alignedPos.x + mX * len + ((qf.pokerconfig.pokerWidth / 2 + ((i - 1) % maxLen) * pokerDistance) * scale);

            position.y = alignedPos.y + mY * curRow * pokerHeightDis * scale - (qf.pokerconfig.pokerWidth / 2) * scale;
            if (index === 0) {
                position.y = alignedPos.y + (-curRow - mY * row) * pokerHeightDis * scale;
            }

            if (!minX || minX > position.x) {
                minX = position.x;
            }

            if (!maxX || maxX < position.x) {
                maxX = position.x;
            }

            pos.push(position);
        }

        cardTypeTxtPos.x = alignedPos.x + xX * maxLength / 2 + offsetTxtT[index].x;
        cardTypeTxtPos.y = alignedPos.y + xY * (qf.pokerconfig.pokerWidth + row * pokerHeightDis) * scale + offsetTxtT[index].y;
        let high = (qf.pokerconfig.pokerWidth + row * pokerHeightDis) * scale;

        return { pos: pos, cardTypeTxtPos: cardTypeTxtPos, width: len, height: high, minX: minX, maxX: maxX };
    },

    sendCard2(cardsNode, cardType, uin, notShowAction) { 	//用户左
        this.clearCards(2);
        for (let i in cardsNode) {
            cardsNode[i].setParent(this.node2);
            cardsNode[i].destroy();
        }

        let count = 0;
        for (let j in cardsNode) {
            if (cardsNode.hasOwnProperty(j)) {
                count++;
            }
        }

        let objPos = this.getPos(this.sendCardsPosT[2], count, qf.pokerconfig.pokerScale.MIN * 1.2, 2);
        let fianlObjPos = this.getPos(this.sendCardsPosT[2], count, qf.pokerconfig.pokerScale.MIN, 2);
        let ppp = objPos.pos;
        let fianlP = fianlObjPos.pos;
        let txtPos = objPos.cardTypeTxtPos;
        let minX = fianlObjPos.minX || fianlP[0];

        let disPX = (objPos.width - fianlObjPos.width) / 2;

        let showUnfoldAction = this.getCardTypeAction(cardType);
        for (let k in cardsNode) {
            cardsNode[k].opacity = 255;
            if (notShowAction) {
                cardsNode[k].setScale(qf.pokerconfig.pokerScale.MID);
                cardsNode[k].setPosition(cc.v2(fianlP[k].x, fianlP[k].y));
                continue;
            }
            let action = cc.sequence(
                cc.scaleTo(0.1, qf.pokerconfig.pokerScale.MID + 0.02).easing(cc.easeElasticOut(0.9)),
                cc.scaleTo(0.1, qf.pokerconfig.pokerScale.MID - 0.02).easing(cc.easeElasticOut(0.9)),
                cc.scaleTo(0.1, qf.pokerconfig.pokerScale.MID).easing(cc.easeElasticOut(0.9))
            )

            if (showUnfoldAction) {
                cardsNode[k].setPosition(cc.v2(minX - k * 15 - 20, fianlP[0].y));
                action = cc.moveTo(0.3, cc.v2(fianlP[k].x, fianlP[k].y));
                cardsNode[k].setScale(qf.pokerconfig.pokerScale.MID);
            } else {
                cardsNode[k].setPosition(cc.v2(fianlP[k].x, fianlP[k].y));
                cardsNode[k].setScale(0);
            }

            cardsNode[k].runAction(action);
        }

        if (!notShowAction) {
            this.showActionEffectAnimation({ type: cardType, user: this.MAIN_VIEW.getUserByIndex(2) });
        }

        if (qf.cache.desk.getEnterDeskMusicFlag()) {
            qf.music.readCard(cardsNode, cardType, this.MAIN_VIEW.getUserByIndex(2));
        }
    },

    sendCard1(cardsNode, cardType, uin, notShowAction) { 	//用户右
        this.clearCards(1);
        for (let i in cardsNode) {
            cardsNode[i].setParent(this.node1);
            cardsNode[i].destroy();
        }

        let count = 0;
        for (let j in cardsNode) {
            if (cardsNode.hasOwnProperty(j)) {
                count++;
            }
        }

        let objPos = this.getPos(this.sendCardsPosT[1], count, qf.pokerconfig.pokerScale.MIN * 1.2, 1);
        let fianlObjPos = this.getPos(this.sendCardsPosT[1], count, qf.pokerconfig.pokerScale.MIN, 1);
        let ppp = objPos.pos;
        let fianlP = fianlObjPos.pos;
        let txtPos = objPos.cardTypeTxtPos;

        let maxX = fianlObjPos.maxX || fianlP[fianlP.length - 1];

        let disPX = (objPos.width - fianlObjPos.width) / 2;

        let showUnfoldAction = this.getCardTypeAction(cardType);
        for (let k in cardsNode) {
            cardsNode[k].opacity = 255;
            if (notShowAction) {
                cardsNode[k].setScale(qf.pokerconfig.pokerScale.MID);
                cardsNode[k].setPosition(cc.v2(fianlP[k].x, fianlP[k].y));
                continue;
            }
            let action = cc.sequence(
                cc.scaleTo(0.1, qf.pokerconfig.pokerScale.MID + 0.02).easing(cc.easeElasticOut(0.9)),
                cc.scaleTo(0.1, qf.pokerconfig.pokerScale.MID - 0.02).easing(cc.easeElasticOut(0.9)),
                cc.scaleTo(0.1, qf.pokerconfig.pokerScale.MID).easing(cc.easeElasticOut(0.9))
            )
            if (showUnfoldAction) {
                cardsNode[k].setPosition(cc.v2(maxX + k * 15 + 20, fianlP[0].y));
                action = cc.moveTo(0.3, cc.v2(fianlP[k].x, fianlP[k].y));
                cardsNode[k].setScale(qf.pokerconfig.pokerScale.MID);
            } else {
                cardsNode[k].setPosition(cc.v2(fianlP[k].x, fianlP[k].y));
                cardsNode[k].setScale(0);
            }

            cardsNode[k].runAction(action);
        }

        if (!notShowAction) {
            this.showActionEffectAnimation({ type: cardType, user: this.MAIN_VIEW.getUserByIndex(1) });
        }
        if (qf.cache.desk.getEnterDeskMusicFlag()) {
            qf.music.readCard(cardsNode, cardType, this.MAIN_VIEW.getUserByIndex(1));
        }
    },

    sendCard0(cardsNode, cardType, uin) {
        this.clearCards(0);
        for (let k in cardsNode) {
            let pos = cardsNode[k].worldPosition;
            if (qf.utils.isValidType(pos)) {
                pos = this.node0.convertToNodeSpace(pos);
                cardsNode[k].setPosition(pos);
            }
            cardsNode[k].setParent(this.node0);
            cardsNode[k].destroy();
        }

        let count = 0;
        for (let i in cardsNode) {
            if (cardsNode.hasOwnProperty(i)) {
                count++;
            }
        }

        let objPos = this.getPos(this.sendCardsPosT[0], count, qf.pokerconfig.pokerScale.MID, 0);
        let ppp = objPos.pos;
        let txtPos = objPos.cardTypeTxtPos;

        let isSelfPlaying = (uin === qf.cache.user.uin);
        for (let j in cardsNode) {
            let v = cardsNode[j];
            let k = qf.func.checkint(j);

            if (!isSelfPlaying) {
                cardsNode[k].setPosition(cc.v2(ppp[k].x, ppp[k].y));
                cardsNode[k].setScale(qf.pokerconfig.pokerScale.MID);
            } else {
                ( (v, k) => {
                    let pos = cc.v2(ppp[k].x, ppp[k].y);

                    v.runAction(cc.sequence(
                        cc.spawn(
                            cc.fadeOut(0.1),
                            cc.moveBy(0.1, cc.v2(0, 50))
                        ),
                        cc.moveTo(0.1, pos),
                        cc.callFunc( () => {
                            v.opacity = 255;
                            v.setScale(0);
                        }),
                        cc.scaleTo(0.1, qf.pokerconfig.pokerScale.MID + 0.05).easing(cc.easeElasticOut(0.9)),
                        cc.scaleTo(0.1, qf.pokerconfig.pokerScale.MID - 0.05).easing(cc.easeElasticOut(0.9)),
                        cc.scaleTo(0.1, qf.pokerconfig.pokerScale.MID).easing(cc.easeElasticOut(0.9))
                    ))

                })(v, k);
            }
        }

        this.showActionEffectAnimation({ type: cardType, user: this.MAIN_VIEW.getUserByIndex(0) });
        if (qf.cache.desk.getEnterDeskMusicFlag()) {
            qf.music.readCard(cardsNode, cardType, this.MAIN_VIEW.getUserByIndex(0));
        }
    },

    sendCard0WithReconnect(cardsNode) {
        this.clearCards(0);
        for (let k in cardsNode) {
            cardsNode[k].setParent(this.node0);
            cardsNode[k].destroy();
        }

        //mark: by Derrick
        let count = 0;
        for (let i in cardsNode) {
            if (cardsNode.hasOwnProperty(i)) {
                count++;
            }
        }

        let objPos = this.getPos(this.sendCardsPosT[0], count, qf.pokerconfig.pokerScale.MID, 0);
        let ppp = objPos.pos;

        for (let k in cardsNode) {
            cardsNode[k].setScale(qf.pokerconfig.pokerScale.MID);
            cardsNode[k].setPosition(ppp[k].x, ppp[k].y);
        }
    },

    sendCardByDrag(cardsNode, cardType, allpos, x, y) {
        this.clearCards(0);
        for (k in cardsNode) {
            cardsNode[k].setScale(qf.pokerconfig.pokerScale.MID);
            cardsNode[k].setPosition(x + qf.pokerconfig.pokerWidth * 0.5 * qf.pokerconfig.pokerScale.MID + allpos[k].x * qf.pokerconfig.pokerScale.MID,
                y + qf.pokerconfig.pokerHeight * qf.pokerconfig.pokerScale.MID);
            cardsNode[k].setParent(this.node0);
            cardsNode[k].destroy();
        }

        //mark: by Derrick
        let count = 0;
        for (let i in cardsNode) {
            if (cardsNode.hasOwnProperty(i)) {
                count++;
            }
        }

        let objPos = this.getPos(this.sendCardsPosT[0], count, qf.pokerconfig.pokerScale.MID, 0);
        let ppp = objPos.pos;
        let txtPos = objPos.cardTypeTxtPos;

        for (k in cardsNode) {
            cardsNode[k].runAction(cc.moveTo(0.15, cc.v2(ppp[k].x, ppp[k].y)));
        }

        if (qf.cache.desk.getEnterDeskMusicFlag()) {
            qf.music.readCard(cardsNode, cardType, this.MAIN_VIEW.getUserByIndex(0));
        }
    },

    showLastAnimation(cardsNode, index, parentNode, clear) {
        let scale = qf.pokerconfig.pokerScale.MAX;
        if (index === 0)
            scale = qf.pokerconfig.pokerScale.MID;
        parentNode.removeAllChildren(true);

        //mark: by Derrick
        let count = 0;
        for (let i in cardsNode) {
            if (cardsNode.hasOwnProperty(i)) {
                count++;
            }
        }

        let objPos = null;
        if (index === 0)
            objPos = this.getPos(this.showCardsPosT[index], count, scale, index);
        else
            objPos = this.getShowPos(this.showCardsPosT[index], count, scale, index);
        let ppp = objPos.pos;
        if (clear) {
            this.clearCards(index);
        }
        for (k in cardsNode) {
            cardsNode[k].setScale(scale);
            cardsNode[k].setPosition(ppp[k].x, ppp[k].y);
            cardsNode[k].setParent(parentNode);
            cardsNode[k].destroy();
        }
    },

    clearCards(index) {
        if (this["node" + index]) {
            this["node" + index].children.forEach(poker => {
                poker.clear();
            });
        }
    },

    //三带几的出牌动画
    showFeiJiAction(cardType, cardsNode) {
        let count = 0;
        for (let i in cardsNode) {
            if (cardsNode.hasOwnProperty(i)) {
                count++;
            }
        }

        if (cardType === qf.const.LordPokerType.SAN || cardType === qf.const.LordPokerType.SANDAIDUIZI || cardType === qf.const.LordPokerType.SANDAI1) { 		//如果是飞机
            if (Math.floor(cardsNode[1].id / 4) === Math.floor(cardsNode[3].id / 4)) {    //前三张一样
                cardsNode[1].runAction(cc.spawn(
                    cc.rotateBy(0.2, -32),
                    cc.moveBy(0.15, cc.v2(8, -6))));
                cardsNode[2].runAction(cc.moveBy(0.15, cc.v2(0, 5)));
                cardsNode[3].runAction(cc.spawn(
                    cc.rotateBy(0.2, 32),
                    cc.moveBy(0.15, cc.v2(-8, -6))));
                for (let i = 4; i <= count; i++) {
                    cardsNode[i].runAction(cc.moveBy(0.1, cc.v2(80, -7)));
                }
            } else { 	    //后三张一样
                cardsNode[count - 2].runAction(cc.spawn(
                    cc.rotateBy(0.2, -32),
                    cc.moveBy(0.15, cc.v2(8, -6))));
                cardsNode[count - 1].runAction(cc.moveBy(0.15, cc.v2(0, 5)));
                cardsNode[count].runAction(cc.spawn(
                    cc.rotateBy(0.2, 32),
                    cc.moveBy(0.15, cc.v2(-8, -6))));
                for (let i = 1; i <= count - 3; i++) {
                    cardsNode[i].runAction(cc.moveBy(0.1, cc.v2(-80, -7)));
                }
            }
        }
    },

    //取用户头像坐标
    getUserPosition(index) {
        let tou = this.MAIN_VIEW.getUserByIndex(index);
        let pt = [tou.getPositionX() + tou.getContentSize().width * 0.5 + (tou.index === 2 ? 25 : -25),
        tou.y + tou.getContentSize().height * 0.5];
        return cc.v2(pt[0], pt[1]);
    },

    //出牌牌型
    showTypeTxt(index, cardType, pos) {
        logd("showTypeTxt cardType=" + (cardType).toString());
        if (cardType > 0) {
            let txt = qf.txt.lord_type_txt[cardType];
            if (qf.utils.isValidType(txt)) {
                let pText = new cc.Node();
                let lbl_com = pText.addComponent(cc.Label);
                lbl_com.string = txt;
                lbl_com.fontFamily = qf.res.font1,
                    lbl_com.fontSize = 30,
                    pText.setParent(this["node" + index]);
                let xsX = 0;
                if (index === 0) {
                    xsX = 1 / 2;
                }

                pText.setPosition(cc.v2(pos.x + xsX * pText.getContentSize().width, pos.y));
            }
        }
    },
    //index(0:自己，1：右上座位，2：左上座位)
    getShowPos(alignedPos, number, scale, index) {
        let pos = [];
        let maxLen = qf.pokerconfig.maxOutRowPokerNum;
        let len = 0;
        let pokerDistance = qf.pokerconfig.pokerShowSpace.width;
        let pokerHeightDis = qf.pokerconfig.pokerShowSpace.height;

        if (number >= maxLen) {
            len = ((maxLen - 1) * pokerDistance + qf.pokerconfig.pokerShowWidth) * scale;
        } else {
            len = ((number - 1) * pokerDistance + qf.pokerconfig.pokerShowWidth) * scale;
        }

        let maxLength = len;

        let mX = 0;
        let mY = 0;
        let xX = 0;
        let xY = 0;
        if (index === 1) { //右上对齐
            mX = -1;
            mY = -1;
            xX = -1;
            //xY = -1;
        } else if (index === 2) { //左上对齐
            mX = 0;
            mY = -1;
            xX = 1;
            //xY = -1;
        }

        for (let i = 1; i <= number; i++) {
            let curRow = Math.floor((i - 1) / maxLen);
            let position = {};
            let lastNum = (number - curRow * maxLen); //一行剩余量
            if (lastNum > maxLen) {
                len = maxLength;
            } else {
                len = ((lastNum - 1) * pokerDistance + qf.pokerconfig.pokerShowWidth) * scale;
            }

            position.x = alignedPos.x + mX * len + ((qf.pokerconfig.pokerShowWidth / 2 + ((i - 1) % maxLen) * pokerDistance) * scale);

            position.y = alignedPos.y + mY * curRow * pokerHeightDis * scale - (qf.pokerconfig.pokerShowWidth / 2) * scale;

            pos.push(position);
        }

        return { pos: pos };
    },
    //牌型动画
    showActionEffectAnimation(paras) {
        let cardType = paras.type;

        let fromUser = paras.user;
        let ske = null;
        let tex = null;
        let name = null;
        if (cardType === qf.const.LordPokerType.FEIJI || cardType === qf.const.LordPokerType.FEIJI1 || cardType === qf.const.LordPokerType.FEIJI2) {
            //飞机
            ske = qf.res.animation_feiji_ske;
            tex = qf.res.animation_feiji_tex;
            name = "Animation1";
            qf.music.playMyEffect("feiji");
        }
        else if (cardType === qf.const.LordPokerType.SHUNZI) {
            //顺子
            ske = qf.res.animation_shunzi_ske;
            tex = qf.res.animation_shunzi_tex;
            name = "Animation1";
        }
        else if (cardType === qf.const.LordPokerType.SHUNZIDUIZI) {
            //连对
            ske = qf.res.animation_liandui_ske;
            tex = qf.res.animation_liandui_tex;
            name = "Animation1";
            qf.music.playMyEffect("liandui");
        }
        else if (cardType === qf.const.LordPokerType.ZHADAN) {
            //炸弹
            ske = qf.res.animation_baozha_ske;
            tex = qf.res.animation_baozha_tex;
            name = "Animation1";
            qf.music.playMyEffect("boom");
        }
        else if (cardType === qf.const.LordPokerType.WANGZHA) {
            //王炸
            ske = qf.res.animation_huojian_ske;
            tex = qf.res.animation_huojian_tex;
            name = "Animation1";
            qf.music.playMyEffect("wangzha");
            //qf.platform.playVibrate();//震动
        }
        if (ske && tex && this.MAIN_VIEW) {
            let node = new cc.Node();
            const armatureDisplay = qf.utils.createArmatureAnimation(node, {
                dragonAsset: ske,
                dragonAtlasAsset: tex,
                armatureName: "armatureName",
            });
            node.setParent(this.MAIN_VIEW.node);
            node.zIndex = 10;

            let szWin = cc.winSize;
            if (cardType === qf.const.LordPokerType.FEIJI || cardType === qf.const.LordPokerType.FEIJI1 || cardType === qf.const.LordPokerType.FEIJI2) {
                //飞机
                node.setPosition(-szWin.width * 0.2, szWin.height * 0.55);
                node.runAction(cc.sequence(
                    cc.delayTime(0),
                    cc.moveTo(1.5, cc.v2(szWin.width * 1.2, szWin.height * 0.55)).easing(cc.easeOut(0.9)),
                    cc.callFunc( (sender) => {
                        if (node) {
                            node.stopAllActions();
                            node.destroy();
                            node = null;
                        }
                    })
                ));
                armatureDisplay.playAnimation("Animation1");
            }
            else if (cardType === qf.const.LordPokerType.WANGZHA) {
                //王炸
                node.setPosition(szWin.width * 0.5, szWin.height * 0.22);
                node.runAction(cc.sequence(
                    cc.delayTime(1),
                    cc.moveTo(0.5, cc.v2(szWin.width * 0.5, szWin.height * 1.22))
                ));
                armatureDisplay.playAnimation("Animation1", -1, 0);
            }
            else if (cardType === qf.const.LordPokerType.ZHADAN) {
                //炸弹
                node.active = false;
                let res = qf.rm.getSpriteFrame(qf.res.table, qf.res.bombPng2);
                let sprite = node.addComponent(cc.Sprite);
                sprite.spriteFrame = res;
                node.setParent(this.MAIN_VIEW.node);
                node.zIndex = 10;
                let isReverse = fromUser.index === 1;
                if (isReverse) {
                    node.setScaleX(-1);
                    sprite.setFlippedX(true);
                }
                let toPos = cc.v2(szWin.width * 0.5, szWin.height * 0.55);
                let fromPos = cc.v2(fromUser.getCenPos());
                node.setPosition(toPos);
                sprite.setPosition(fromPos);
                sprite.setScale(0.7);
                node.setScale(1.2);
                let bezierConfig = this.getBezierConfig(fromPos, toPos);
                let spwan = cc.spawn(cc.bezierTo(0.5, bezierConfig),
                    cc.scaleTo(0.5, 1));
                sprite.runAction(cc.sequence(
                    spwan,
                    cc.callFunc((sender) => {
                        if (node) {
                            node.active = true;
                            armatureDisplay.playAnimation("Animation1", -1, 0);
                        }
                        if (sprite) {
                            sprite.stopAllActions();
                            sprite.destroy();
                            sprite = null;
                        }
                    })
                ));

            }
            else {
                if (cardType === qf.const.LordPokerType.SHUNZI || cardType === qf.const.LordPokerType.SHUNZIDUIZI) {
                    node.setPosition(szWin.width * 0.4, szWin.height * 0.55);
                } else {
                    node.setPosition(szWin.width * 0.5, szWin.height * 0.55);
                }
                armatureDisplay.playAnimation("Animation1", -1, 0);
            }
        }
    },

    //设置贝塞尔曲线的参数
    getBezierConfig(fromPos, toPos) {
        let offPoint = cc.v2(toPos.x - fromPos.x, toPos.y - fromPos.y);
        let controll1 = cc.v2(fromPos.x, fromPos.y + 100);
        let controll2 = cc.v2(fromPos.x + offPoint.x * 3 / 5, toPos.y + 100);
        let bezierConfig = [controll1
            , controll2
            , toPos];
        return bezierConfig;
    },

    //获取牌型使用展示动画
    getCardTypeAction(cardType) {
        if (cardType === qf.const.LordPokerType.SANDAI1 ||      //三带一
            cardType === qf.const.LordPokerType.SANDAIDUIZI ||  //三带二
            cardType === qf.const.LordPokerType.SHUNZI ||       //顺子
            cardType === qf.const.LordPokerType.SHUNZIDUIZI ||  //连对
            cardType === qf.const.LordPokerType.FEIJI ||        //飞机
            cardType === qf.const.LordPokerType.FEIJI1 ||
            cardType === qf.const.LordPokerType.FEIJI2
        ) {
            return true;
        }
        return false;
    }
});