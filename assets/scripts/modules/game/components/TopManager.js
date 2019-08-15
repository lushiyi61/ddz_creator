cc.Class({
    extends: cc.Component,

    properties: {
        TAG: "TopManager",
    },

    onLoad() {
        this.init();
    },

    init() {
        this.cards = [];
        this.pokers = []; //三张地主牌
        this.panThreeCards = qf.utils.seekNodeByName("panel_dipai", this.node);
        // this.panThreeCards.setTouchEnabled(false);

        // 翻倍类型组件
        this.panMultiType = qf.utils.seekNodeByName("panel_multiType", this.node);
        // 翻倍值组件
        this.panMulti = qf.utils.seekNodeByName("panel_multi", this.node);
        // 翻倍类型文本
        this.txtMultiType = qf.utils.seekNodeByName("txt_multiType", this.node);
        // 翻倍类型九宫格背景
        this.multiTypeBg = qf.utils.seekNodeByName("img_multiTypeBg", this.node);
        // 翻倍值文本
        this.txtBottomMulti = qf.utils.seekNodeByName("txt_bottom_multi", this.node);

        this.panMultiType.active = false;
        this.panMultiType.scale = 0;
        this.panMulti.active = false;

        let panMulti_pos = this.panMultiType.getPosition();
        let panMulti_sz = this.panMultiType.getContentSize();
        this.panMultiType.anchor = cc.v2(0.5, 1);
        this.panMultiType.position = cc.v2(panMulti_pos.x + panMulti_sz.width * 0.5, panMulti_pos.y + panMulti_sz.height);
        //this.lblBaseScore = qf.utils.seekNodeByName("txt_double", this.node);
        //this.panelLeftTime = qf.utils.seekNodeByName("panel_lefttime", this.node); //人机赛的90s时间限制
        //this.lblLeftTime = qf.utils.seekNodeByName("lbl_lefttimecontent", this.node);

        this._switching = false;
        this.playLeftTime = 0; //90s剩余时间
    },

    genThreeCards(cards, laizi, background) {
        this.pokers = [];
        this.panThreeCards.removeAllChildren();
        //let start = laizi === true and -20 or -20
        //let seq = laizi === true and 35 or 55
        let panThreeCardsSize = this.panThreeCards.getContentSize();
        let pokerScale = 1;
        let sizePoker = qf.pokerconfig.pokerShowWidth * pokerScale;
        for (let k in cards) {
            let v = cards[k];
            let i = qf.func.checkint(k) + 1;
            let p = qf.pokerpool.take();
            p.init(v, qf.const.NEW_POKER_TYPE.BOTTOM);
            if (background) {
                pokerScale = 0.86;
                p.toBackGround();
            }

            p.scale = pokerScale;
            p.position = cc.v2(panThreeCardsSize.width / 2 + (i - Math.ceil(cards.length / 2)) * (sizePoker + 10), panThreeCardsSize.height * 0.5);
            this.pokers[k] = p;
            this.panThreeCards.addChild(p, 2);
        }

        if (laizi) { this.addLaiziCard(3, true); }

        //this.panThreeCards.scale = 0;
        this.showThreeCards();
    },

    showThreeCardsAnimation(cards, multiple, type) {
        this.showThreeCards();
        let ws = cc.winSize;
        let time = 0.3;
        let scale1 = 0.2;
        let pos1 = [
            [],
            [],
            []
        ];
        let pos2 = [
            [],
            [],
            []
        ];

        // for(k in self.pokers) {
        // 	let v = self.pokers[k];
        // 	let x = v.getPositionX();
        // 	let y = v.getPositionY();
        // 	pos1[k] = [x,y];
        // 	pos2[k] = [k*50, y];
        // }

        for (let i in this.pokers) {
            let v = this.pokers[i];
            let k = qf.func.checkint(i);
            ((v, k) => {
                v.runAction(cc.sequence(
                    //cc.spawn(cc.moveTo(0.2,cc.v2(pos2[k][0],pos2[k][1])),cc.scaleTo(0.2, scale1)),
                    cc.scaleTo(time, 0, scale1),
                    cc.callFunc((sender) => {
                        sender.id = cards[k];
                    }),
                    //cc.scaleTo(time,scale1, scale1),
                    cc.delayTime(time),
                    //cc.spawn(cc.moveTo(0.2, cc.v2(pos1[k][0],pos1[k][1])),cc.scaleTo(0.2, qf.pokerconfig.pokerScale.MIN))
                    cc.scaleTo(0.2, 1)
                ));
            })(v, k);
        }

        this.node.runAction(cc.sequence(
            cc.delayTime(time * 2 + 0.2),
            cc.callFunc(() => {
                this.addMultipleTag(multiple);
                this.playMultipleAnimation(multiple, type);
            })
        ))
    },

    _turnThreeCardsToNormal() {
        for (let k in this.pokers) {
            let v = this.pokers[k];
            v.id = v.id;
        }
    },

    addLaiziCard(laizin, bg) {
        let p = qf.pokerpool.take();
        p.init((laizin - 3) * 4, qf.const.NEW_POKER_TYPE.BOTTOM);
        p.scale = 0.21;
        p.position = cc.v2(140, this.panThreeCards.getContentSize().height * 0.5);
        // p.setLaizi(true);
        if (bg === true) { p.toBackGround(); }
        this.panThreeCards.addChild(p);
    },

    genLaiziCards(laizin, havaAnimation) {
        if (laizin < 3) { return; }
        if (havaAnimation) { //这里添加动画
            let ws = cc.winSize;

            this._clipNode.anchor = cc.v2(0.5, 0.5);
            this._clipNode.position = cc.v2(ws.width / 2, this.getPositionY() - ws.height * 1.05);
            this._clipNode.active = true;

            let t = 0.25;
            let pok = [];
            pok[0] = qf.pokerpool.take();
            pok[0].init((Math.random(3, 15) - 3) * 4, qf.const.NEW_POKER_TYPE.BOTTOM);
            pok[1] = qf.pokerpool.take();
            pok[1].init((Math.random(3, 15) - 3) * 4, qf.const.NEW_POKER_TYPE.BOTTOM);
            pok[2] = qf.pokerpool.take();
            pok[2].init((Math.random(3, 15) - 3) * 4, qf.const.NEW_POKER_TYPE.BOTTOM);
            pok[3] = qf.pokerpool.take();
            pok[3].init((laizin - 3) * 4, qf.const.NEW_POKER_TYPE.BOTTOM);
            pok[0].dt = 0;
            pok[0].t = t;
            pok[0].n = 11;
            pok[1].dt = t * 0.5;
            pok[1].t = t;
            pok[1].n = 11;
            pok[2].dt = t;
            pok[2].t = t;
            pok[2].n = 10;

            let clipNC = this._clipNode.getContentSize();
            let pokkec = pok[0].getContentSize();

            for (let i = 0; i < 3; i++) {
                // pok[i].setLaizi(true);
                this._clipNode.addChild(pok[i], 2);
                pok[i].position = cc.v2(clipNC.width * 0.5, this.getPositionY() - ws.height - ws.height / 6 - 55);
                pok[i].runAction(cc.sequence(
                    cc.delayTime(pok[i].dt),
                    cc.repeat(
                        cc.sequence(
                            cc.moveBy(pok[i].t, cc.v2(0, clipNC.height + pokkec.height)),
                            cc.callFunc((sender) => {
                                sender.position = cc.v2(sender.getPositionX(), this.getPositionY() - ws.height - ws.height / 6 + 50 + sender.getContentSize().height / 2);
                                sender.id = (Math.random(3, 15) - 3) * 4;
                            })
                        ), pok[i].n),
                    cc.callFunc((sender) => {
                        if (i !== 2) {
                            pok[i].destroy();
                        } else {
                            pok[i].id = (laizin - 3) * 4;
                        }
                    })
                ))
            }

            pok[2].runAction(cc.sequence(cc.delayTime(pok[2].dt + pok[2].t * pok[2].n),
                cc.moveTo(pok[2].t / 2, cc.v2(clipNC.width * 0.5, clipNC.height * 0.5)),
                cc.delayTime(0.6),
                cc.callFunc((sender) => {
                    let pppp = sender;
                    pppp.position = cc.v2(this.panThreeCards.convertToNodeSpace(pppp.getParent().convertToWorldSpace(cc.v2(pppp.getPosition()))));
                    pppp.retain();
                    pppp.destroy();
                    this._clipNode.removeAllChildren();
                    this._clipNode.active = false;
                    this.panThreeCards.addChild(pppp);
                    pppp.runAction(cc.spawn(
                        cc.moveTo(0.5, cc.v2(140, this.panThreeCards.getContentSize().height * 0.5)),
                        cc.scaleTo(0.5, 0.21)
                    ))
                })
            ))
        } else {
            this.addLaiziCard(laizin);
        }
    },

    showThreeCards() {
        // if (this.pokers.length <= 0) {return;}
        // if (this._switching === true) {return;}

        // this._switching = true;

        // this.panThreeCards.runAction(cc.sequence(
        // 	cc.delayTime(this.switchTime),
        // 	cc.scaleTo(this.switchTime,1,1),
        // 	cc.callFunc(function(sender){
        // 		this._switching = false;
        // 	})
        // ))
    },

    removeThreeCards() {
        this.pokers = [];

        // this.panThreeCards.stopAllActions();
        // this.panThreeCards.scale = 1;
        this.panThreeCards.removeAllChildren();
        this.removeMultipleTag();
    },

    //先检测是否是人机赛，人机赛则需要有时间限制，则要改变ui布局
    checkIsShowLeftTime() {
        /*if (!qf.cache.desk.isPVPMatch()){
            this.panelLeftTime.active = true;
            this.isShowLeftTime = true;
        }
        else{
            this.panelLeftTime.active = false;
            this.isShowLeftTime = false;
        }*/
    },

    //开始90s倒计时
    gameBeginCountDown() {
        /*
         if (!this.isShowLeftTime){return;}
         this.lblLeftTime.stopAllActions();
         let leftTime = this.playLeftTime;

         if (leftTime <= 0){
             this.lblLeftTime.string = leftTime+"s";
             return;
         }
         leftTime = leftTime - 1;
         this.lblLeftTime.string = leftTime+"s";
         let action = cc.repeatForever(cc.sequence(
             cc.delayTime(1),
             cc.callFunc(()=>{
                 leftTime = leftTime - 1;
                 this.lblLeftTime.string = leftTime+"s";
                 if (leftTime <= 0){
                     this.lblLeftTime.stopAllActions();
                 }
             })
         ))
         this.lblLeftTime.runAction(action);*/
    },

    //停止90s倒计时
    stopCountDown() {
        /*
        this.lblLeftTime.stopAllActions();*/
    },

    //设置牌桌剩余时间
    setLeftTime() {
        /*
         if (!this.isShowLeftTime){return;}
         let leftTime = 0;
         if (flag){
             leftTime = qf.cache.desk.getPVELeftTime();
         }
         else{
             leftTime = qf.cache.desk.getPVETotalTime();
         }
         if(leftTime < 0){
             leftTime = 0;
         }
         else{
             leftTime = leftTime;
         }
         this.lblLeftTime.string = leftTime+"s";
         this.playLeftTime = leftTime;*/
    },

    // 播放底牌倍数toast动画
    playMultipleAnimation(multiple, type) {
        if (!type || !multiple) return;

        let str = cc.js.formatStr(qf.txt.HoleCardsType[type], multiple);
        this.txtMultiType.string = str;

        let txt_sz_w = this.txtMultiType.getContentSize().width;
        this.multiTypeBg.setContentSize(cc.size(txt_sz_w > 110 ? 134 : txt_sz_w + 24, 52));

        this.panMultiType.active = true;
        this.panMultiType.runAction(cc.sequence(
            cc.scaleTo(0.3, 1, 1),
            cc.delayTime(1.5),
            cc.callFunc((sender) => {
                sender.active = false;
                sender.scale = 0;
            })
        ));
    },

    // 添加底牌倍数标签
    addMultipleTag(value) {
        if (!value) return;

        this.txtBottomMulti.string = value + qf.txt.bei;
        this.panMulti.active = true;
    },

    // 移除底牌倍数标签
    removeMultipleTag() {
        this.panMulti.active = false;
    },
});