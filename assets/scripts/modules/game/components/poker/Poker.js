cc.Class({
    extends: cc.Node,

    properties: {
        _id: null,          //牌型ID
        _resType: null,      //牌类型
        _isMark: false,      //是否被选中标记
        _isUp: false,        //是否弹出
        _isDizhu: false,     //是否为地主牌
        _isShow: false,      //是否明牌
        _isDoing: false,     //是否正在执行动作
        _mask: null,         //牌选中遮罩
        _laizi: false,       //是否为癞子牌
        _laiziId: null,      //癞子牌ID

        id: {
            get() {
                return this._id;
            },
            set(id) {
                this._id = id;
                this.updateUI();
            }
        },
        resType: {
            get() {
                return this._resType;
            },
            set(resType) {
                this._resType;
                this.updateUI();
            }
        },
        isMark: {
            get() {
                return this._isMark;
            },
            set(bool) {
                this._isMark = bool;
            }
        },
        isUp: {
            get() {
                return this._isUp;
            },
            set(bool) {
                this._isUp = bool;
            }
        },
        isDizhu: {
            get() {
                return this._isDizhu;
            },
            set(bool) {
                this._isDizhu = bool;
            }
        },

        markDown: false
    },

    init(params) {
        if (!this.getComponent(cc.Sprite)) {
            this.addComponent(cc.Sprite);
        }

        params = params || {};
        this._id = params.id;
        this._resType = params.resType;
        this._isMark = false;
        this._isUp = false;
        this._isDizhu = false;


        this._laizi = params.laizi || false;                                     //是否为癞子
        this._laiziId = params.laiziId                                           //癞子显示的id

        this.updateUI();
    },

    updateUI() {
        let resInfo = qf.utils.getPokerResNameById(this._id, this._resType);
        this.refreshUI(resInfo);
    },

    refreshUI(resInfo) {
        if (!resInfo) return;
        if (!resInfo.bgRes) return;

        let bgRes = qf.rm.getSpriteFrame(qf.res.poker, resInfo.bgRes);
        let isJoker = resInfo.isJoker;
        let numberRes = qf.rm.getSpriteFrame(qf.res.poker, resInfo.numberRes);
        let colorRes = qf.rm.getSpriteFrame(qf.res.poker, resInfo.colorRes);

        this.getComponent(cc.Sprite).spriteFrame = bgRes;

        let bgSize = cc.size(this.width, this.height);
        let sprNumberSize = null;
        let sprColorSize = null;

        if (qf.utils.isValidType(numberRes)) {
            if (!qf.utils.isValidType(this.sprNumber)) {
                let node = new cc.Node();
                node.addComponent(cc.Sprite);
                node.parent = this;
                this.sprNumber = node;
            }

            this.sprNumber.getComponent(cc.Sprite).spriteFrame = numberRes;
            this.sprNumber.active = true;
            sprNumberSize = cc.size(this.sprNumber.width, this.sprNumber.height);
        }

        if (qf.utils.isValidType(colorRes)) {
            if (!qf.utils.isValidType(this.sprColor)) {
                let node = new cc.Node();
                node.addComponent(cc.Sprite);
                node.parent = this;
                this.sprColor = node;
            }

            this.sprColor.getComponent(cc.Sprite).spriteFrame = colorRes;
            this.sprColor.active = true;
            sprColorSize = cc.size(this.sprColor.width, this.sprColor.height);
        }

        if (this._resType === qf.const.NEW_POKER_TYPE.NORMAL) {
            if (sprNumberSize) {
                this.sprNumber.x = isJoker ? sprNumberSize.width / 2 - bgSize.width / 2 + 12 : sprNumberSize.width / 2 - bgSize.width / 2 + 8;
                this.sprNumber.y = isJoker ? bgSize.height / 2 - sprNumberSize.height / 2 - 10 : bgSize.height / 2 - sprNumberSize.height / 2 - 8;
            }

            if (sprColorSize) {
                this.sprColor.x = isJoker ? 18 : bgSize.width / 2 - sprColorSize.width / 2 - 12;
                this.sprColor.y = isJoker ? -14 : sprColorSize.height / 2 - bgSize.height / 2 + 12;
            }
        }else {
            if (sprNumberSize) {
                let scale = isJoker ? 0.26 : 0.55;
                this.sprNumber.scale = scale;
                this.sprNumber.x = isJoker ? sprNumberSize.width * scale / 2 - bgSize.width / 2 + 6 : sprNumberSize.width * scale / 2 - bgSize.width / 2 + 4;
                this.sprNumber.y = isJoker ? bgSize.height / 2 - sprNumberSize.height * scale / 2 - 4 : bgSize.height / 2 - sprNumberSize.height * scale / 2 - 4;

                if (sprColorSize) {
                    if (!isJoker) {
                        this.sprColor.active = false;
                        return;
                    }

                    this.sprColor.scale = scale;
                    this.sprColor.x = bgSize.width / 2 - sprColorSize.width * scale / 2 - 2;
                    this.sprColor.y = sprColorSize.height * scale / 2 - bgSize.height / 2 + 2;
                }
            }
        }

    },

    mark() {
        if (this._isMark) return;

        if (!this._mask) {
            let node = new cc.Node();
            let spr = node.addComponent(cc.Sprite);
            spr.spriteFrame = qf.rm.getSpriteFrame(qf.res.poker, qf.tex.lord_poker_select);
            node.parent = this;
            this._mask = node;
        }

        this._mask.active = true;
        this._isMark = true;
    },

    unmark() {
        this._isMark = false;
        
        if (this._mask) {
            this._mask.active = false;
        }
    },

    //反向动作
    doInversion() {
        this._isDoing = true;
        let toPointY = 0;
        if (this._isUp) {
            toPointY = this.initDownPosY;
        }else {
            toPointY = this.initDownPosY + qf.pokerconfig.pokerInversionDistance * this.scale;
        }

        this._isUp = !this._isUp;

        this.stopAllActions();
        this.runAction(cc.sequence(
            cc.easeSineInOut(
                cc.moveTo(qf.pokerconfig.pokerInversionTime, cc.v2(this.x, toPointY))
            ),
            cc.callFunc(()=> {
                this._isDoing = false;
            })
        ))
    },

    setDizhu(flag) {
        if (this._isDizhu) return;

        if (!this.sprDizhu) {
            let node = new cc.Node();
            node.addComponent(cc.Sprite);

            node.parent = this;
            this.sprDizhu = node;
        }

        this.sprDizhu.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.table, qf.tex.poker_lord_flag_res[flag]);

        this.sprDizhu.x = this.width / 2 - this.sprDizhu.width / 2 ;
        this.sprDizhu.y = (this.height / 2 - this.sprDizhu.height / 2) * (flag === 0 ? 1 : -1);

        this.sprDizhu.active = true;

        this._isDizhu = true;
    },

    unDizhu() {
        this._isDizhu = false;

        if (this.sprDizhu) {
            this.sprDizhu.active = false;
        }
    },

    //设置明牌标签
    setCardShow(flag) {
        if (this._isShow) return;

        if (!this.sprShow) {
            let node = new cc.Node();
            node.addComponent(cc.Sprite);
            node.parent = this;
            this.sprShow = node;
        }

        this.sprShow.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.table, qf.tex.poker_lord_show_res[flag]);

        this.sprShow.x = this.sprShow.width / 2 - this.width / 2 + this.height / 20;
        this.sprShow.y = this.sprShow.height / 2 - this.height / 2 + this.height / 20;

        this.sprShow.active = true;
        this._isShow = true;
    },

    unCardShow() {
        this._isShow = false;

        if (this.sprShow) {
            this.sprShow.active = false;
        }
    },

    setInitDownPosY(posY) {
        this.initDownPosY = posY;
    },

    getInitDownPosY() {
        return this.initDownPosY;
    },

    setColorSpriteShow(isVisible) {
        if (this.sprColor) {
            this.sprColor.active = isVisible;
        }
    },

    setUp() {
        this.isUp = true;
        this.stopAllActions();
        this.y = this.initDownPosY + qf.pokerconfig.pokerInversionDistance * this.getScale();
    },

    setDown() {
        this.isUp = false;
        this.stopAllActions();
        this.y = this.initDownPosY;
    },

    toBackGround() {
        this.clearSprite();
        this.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.poker, qf.tex.lord_poker_back);
    },

    clearSprite() {
        if (this.sprNumber) {
            this.sprNumber.scale = 1;
            this.sprNumber.active = false;
        }

        if (this.sprColor) {
            this.sprColor.scale = 1;
            this.sprColor.active = false;
        }
    },

    //清理牌面 放入内存池
    clear() {
        this.clearSprite();

        this.scale = 1;
        this.getComponent(cc.Sprite).spriteFrame = null;

        this.parent = null;
        this.markDown = false;

        qf.pokerpool.recover(this);
    },
})