/*
	User类
*/

let UserHead = require("../../../components/UserHead");

cc.Class({
    extends: cc.Component,

    properties: {
        TAG: "LordUser",

        //玩家位置 0:自己,1:右边玩家,2:左边玩家
        _PLAYER_INDEX: {
            get() {
                return {
                    MYSELF: 0,
                    RIGHT: 1,
                    LEFT: 2
                }
            }
        },

        //剩余手牌数量
        _LEFT_CARDS_NUM: {
            get() {
                return {
                    ZERO: 0,
                    ONE: 1,
                    TWO: 2,
                }
            }
        },

        //是否叫地主或抢地主
        _WHETHER_ROB_LAND: {
            get() {
                return {
                    NOT_CALL: 0,
                    CALL_LAND: 1,
                }
            }
        },

        //是否加倍
        _WHETHER_DOUBLE: {
            get() {
                return {
                    NOT_DOUBLE: 0,
                    DOUBLE: 1,
                    SUPER_DOUBLE: 2
                }
            }
        },

        _userHeadWidth: 108,
        _headScale: 126,
        _POPTIME: 3, //3秒气泡保留的时间ui

        _winSize: cc.winSize,

        _hided: false,

        _uin: -1,

        Index: 0,

        _direction: 0,

        headImg: cc.Node,
    },

    onLoad() {
        loge("LordUser onLoad")
        this.init();
    },

    init(paras) {
        this._uin = -1;
        this._index = this.Index;
        this._direction = (this._index === this._PLAYER_INDEX.RIGHT ? this._PLAYER_INDEX.RIGHT : this._PLAYER_INDEX.LEFT);

        (this._index === this._PLAYER_INDEX.MYSELF) && this.initSelf();

        this.initBaseInfo();
        this.initHead(paras);
        this.hide();
        this.setRightHeadDirector(false);

        return this;
    },

    //初始化一些基础信息
    initBaseInfo() {
        this.imgHeadBg = qf.utils.seekNodeByName("img_head", this.node); //头像
        this.lblPlayerName = qf.utils.seekNodeByName("txt_user_name", this.node); //名称
        this.lblCoin = qf.utils.seekNodeByName("txt_gold", this.node); //金币数量
        this.imgDefend = qf.utils.seekNodeByName("img_defend", this.node); //攻防(地主)图标
        this.statusNode = qf.utils.seekNodeByName("img_status", this.node); //状态气泡
        this.imgLeftBg = qf.utils.seekNodeByName("img_poker_back", this.node); //牌背
        this.lblLeftCardNum = this.imgLeftBg.getChildByName("img_porker_last_num"); //剩余手牌数量
        this.imgDouble = qf.utils.seekNodeByName("img_multiple", this.node); //加倍图标
        this.imgSuperDouble = qf.utils.seekNodeByName("img_super_multi", this.node); //加倍图标
        this.imgAutoPlay = qf.utils.seekNodeByName("img_auto_playing", this.node); //托管图标
        this.imgWarning = qf.utils.seekNodeByName("panel_alarm", this.node); //警告图标(剩余1、2张牌)
        this.imgReady = qf.utils.seekNodeByName("img_ready", this.node); //警告图标(剩余1、2张牌)
        this.img_gold = qf.utils.seekNodeByName("img_gold", this.node);
        this.bplblResultValueWin = qf.utils.seekNodeByName("bplbl_result_value_win", this.node); //结算数字
        this.bplblResultValueFail = qf.utils.seekNodeByName("bplbl_result_value_fail", this.node); //结算数字

        this.statusNode.stopAllActions();
        this.statusNode.active = false;
        this.imgLeftBg.active = false;
        this.imgDouble.active = false;
        this.imgSuperDouble.active = false;
        this.imgAutoPlay.active = false;
        this.lblLeftCardNum.getComponent(cc.Label).string = "0";
        this.imgReady.active = false;

        this.panle_chat_bubble = qf.utils.seekNodeByName("panle_chat_bubble", this.node);
        this.panle_chat_bubble.active = false;
        this.lbl_chat = qf.utils.seekNodeByName("lbl_chat", this.node);

        this.panel_chat_size = cc.size(35, 19);
        // TODO 失效API
        // this.panle_chat_bubble.setCascadeOpacityEnabled(true);
        this.statusType = null;
    },

    //初始化头像
    initHead(u) {
        u = u || {};
        let cs = this.imgHeadBg.getContentSize();
        this.headImg = qf.utils.seekNodeByName("img_head", this.node);
        this.headImg.getComponent("UserHead").setHead(u.sex, u.portrait);
        // this.headImg.position = cc.v2(cs.width/2 , cs.height/2);
        // this.imgHeadBg.addChild(this.headImg, -1);
        this.setRightHeadDirector(false);
    },

    //初始化自己
    initSelf() {
        this._uin = qf.cache.user.uin;
    },

    //更新 外部调用接口
    update(uin) {
        if (!uin) return;
        this._uin = uin;
        this.show();
        this._update();
    },

    //更新 内部接口
    _update() {
        let u = qf.cache.desk.getUserByUin(this._uin);
        if (!qf.utils.isValidType(u)) return;

        //是否托管
        let auto = (u.auto_play === 1);

        //加倍倍数，-1:未选择加倍 0:不加倍；1：加倍 2: 超级加倍
        let callMutiple = u.call_multiple;

        //是否抢地主，-1:还未开始抢地主 0:不叫 1:不抢 2:叫地主 3:抢地主
        let robLord = u.rob_lord;

        //手牌数量
        let cardsNum = u.cards_num;
        this.openid = u.openid;
        this.updateHead(u);
        this.updateName(u); //设置昵称
        this.updateCoin(u.gold); //金币数量
        this.clearTips(); //清除状态
        this.setDoubleStatus();
        this.setWarningStatus(u.cards_num); //警告状态
        this.updateCards(u.cards_num);
        this.setIsShowCards(false);
        this.updateRobot(auto);
        this.clearLandlordStatus();
        this.initTouch();
        this.countDownNode.tag = this._uin;
        //如果地主已经确定，要显示攻防标记
        if (qf.cache.desk.isLordConfirmed()) {
            this.setLandlordStatus(qf.cache.desk.getLordUin());
        }

        let status = qf.cache.desk.getStatus();
        if (status === qf.const.LordGameStatus.GAME_STATE_READY) { //游戏状态 准备中
            this.showReady();
        } else if (status === qf.const.LordGameStatus.GAME_STATE_CALLPOINT) { //抢地主中

            //抢地主阶段需显示抢地主提示
            this.setRobLordTips(robLord);

        } else if (status === qf.const.LordGameStatus.GAME_STATE_MUTIPLE) { //加倍中

            //加倍阶段需显示加倍提示和加倍状态
            this.setDoubleTips(callMutiple, false, true);
            this.setDoubleStatus(callMutiple);

            //需展示手牌数量
            this.updateCards(cardsNum);
            this.setIsShowCards(true);

        } else if (status === qf.const.LordGameStatus.GAME_STATE_INGAME) { //游戏中

            //游戏状态需显示加倍状态
            this.setDoubleStatus(callMutiple);

            //需展示手牌数量
            this.updateCards(cardsNum);
            this.setIsShowCards(true);

        }
    },

    //更新头像
    updateHead(u) {
        this.headImg.getComponent("UserHead").setHead(u.sex, u.portrait);
        this.headImg.active = true;
        this.setRightHeadDirector(false);
    },

    setDefaultHead(u) {
        let img = u.sex === 1 ? qf.res.default_girl_icon : qf.res.default_man_icon;
        this.headImg.setDefaultHeadImg(img, this._userHeadWidth - 2);
    },

    //设置昵称
    updateName(u) {
        if (!u || !qf.utils.isValidType(u.nick)) return;
        if (qf.utils.isValidType(this.lblPlayerName)) {
            this.lblPlayerName.getComponent(cc.Label).string = qf.string.cutString(u.nick, this._index === this._PLAYER_INDEX.MYSELF ? 7 : 9);
        }
    },

    //设置结算金币
    updateResultValue(gold) {
        if (qf.utils.isValidType(this.bplblResultValueWin) && qf.utils.isValidType(this.bplblResultValueFail)) {
            if (!gold && gold !== 0) {
                this.bplblResultValueWin.active = false;
                this.bplblResultValueFail.active = false;
            } else {
                if (gold < 0) {
                    this.bplblResultValueFail.active = true;
                    this.bplblResultValueFail.getComponent(cc.Label).string = gold.toString();

                    this.bplblResultValueFail.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(() => {
                        this.bplblResultValueFail.active = false;
                    })));
                } else if (gold >= 0) {
                    this.bplblResultValueWin.active = true;
                    this.bplblResultValueWin.getComponent(cc.Label).string = "+" + gold.toString();

                    this.bplblResultValueWin.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(() => {
                        this.bplblResultValueWin.active = false;
                    })));
                }
            }
        }
    },

    //更新金币数量
    updateCoin(coinNum) {
        if (qf.cache.desk && qf.cache.desk.isFriendDesk()) { //是好友房间  显示分数
            if (qf.utils.isValidType(this.img_gold)) {
                this.img_gold.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.table, qf.tex.table_pic_fen);
            }
            if (qf.utils.isValidType(this.lblCoin)) {
                let u = qf.cache.desk.getUserByUin(this._uin);
                if (!qf.utils.isValidType(u)) return;
                let player_score = qf.func.checkint(u.player_score);
                this.lblCoin.getComponent(cc.Label).string = player_score;
            }

        } else {
            if (!qf.utils.isValidType(coinNum)) return;
            if (qf.utils.isValidType(this.lblCoin)) {
                this.lblCoin.getComponent(cc.Label).string = qf.utils.getFormatNumber(coinNum);
            }
        }
    },

    //统一清除玩家气泡
    clearTips() {
        if (qf.utils.isValidType(this.statusNode)) {
            this.statusNode.stopAllActions();
            this.statusNode.active = false;
        }
        this.statusType = null;
    },

    //设置是否显示加倍图标(显示在头像上的加倍，打牌过程中也一直显示)
    setDoubleStatus(doubleFlag) {
        if (qf.utils.isValidType(this.imgDouble) && qf.utils.isValidType(this.imgSuperDouble)) {
            if (qf.utils.isValidType(doubleFlag) && doubleFlag === this._WHETHER_DOUBLE.DOUBLE) {
                this.imgDouble.active = true;
                this.imgSuperDouble.active = false;
            } else if (qf.utils.isValidType(doubleFlag) && doubleFlag === this._WHETHER_DOUBLE.SUPER_DOUBLE) {
                this.imgDouble.active = false;
                this.imgSuperDouble.active = true;
            } else {
                this.imgDouble.active = false;
                this.imgSuperDouble.active = false;
            }
        }
    },

    //设置是否显示警告图标(剩余1、2张牌显示警告)
    setWarningStatus(cardsNum) {
        if (qf.utils.isValidType(this.imgWarning)) {
            this.setWarningVisible((cardsNum === this._LEFT_CARDS_NUM.ONE || cardsNum === this._LEFT_CARDS_NUM.TWO));

            if ((cardsNum === this._LEFT_CARDS_NUM.ONE || cardsNum === this._LEFT_CARDS_NUM.TWO)) {
                // TODO
                // let res = qf.res.baojingAniJson;
                // let name = "NewAnimationDDZbaojingqi";
                // ccs.armatureDataManager.addArmatureFileInfo(res);

                // this.armature = new ccs.Armature(name);
                // this.armature.scale = 1;
                // this.armature.position = cc.v2(20,50);
                // this.imgWarning.addChild(this.armature,10);

                // this.armature.getAnimation().play("Animation1");
            }
        }
    },

    //是否显示报警动画
    setWarningVisible(isVisible) {
        this.imgWarning.active = isVisible;

        if (this.armature && !isVisible) {
            this.armature.stopAllActions();
            this.armature.removeFromParent(true);
            this.armature = null;
        }
    },

    //---------------------------	设置牌背  start   ---------------------------

    //设置剩余多少张牌
    updateCards(num) {
        if (qf.utils.isValidType(this.imgLeftBg) && qf.utils.isValidType(this.lblLeftCardNum)) {
            let newnum = (num && num >= this._LEFT_CARDS_NUM.ZERO) ? num : this._LEFT_CARDS_NUM.ZERO;
            this.lblLeftCardNum.getComponent(cc.Label).string = newnum;
            //数量为0不显示
            if (newnum > 0) {
                this.imgLeftBg.active = true;
                if (this._uin === qf.cache.user.uin) {
                    this.imgLeftBg.active = false;
                }
            } else {
                this.imgLeftBg.active = false;
            }
        }
    },

    //得到背牌的世界坐标
    getBackCardWorldPosition() {
        return this.imgLeftBg.getParent().convertToWorldSpace(cc.v2(this.imgLeftBg.getPosition()));
    },

    //显示剩余牌图标 自己的不显示
    setIsShowCards(isshow) {
        if (qf.utils.isValidType(this.imgLeftBg)) {
            if (this._uin === qf.cache.user.uin) {
                this.imgLeftBg.active = false;
                return;
            }
            let u = qf.cache.desk.getUserByUin(this._uin);
            let cardsNum = 0;
            if (qf.utils.isValidType(u) && u.cards_num) {
                cardsNum = u.cards_num;
            }
            if (isshow && cardsNum > 0) {
                this.imgLeftBg.active = true;
            } else {
                this.imgLeftBg.active = false;
            }
        }
    },

    //---------------------------	设置牌背  end   ---------------------------

    //更新托管状态
    updateRobot(auto) {
        if (this.imgAutoPlay) {
            if (this._uin !== qf.cache.user.uin)
                this.imgAutoPlay.active = auto;
            else
                this.imgAutoPlay.active = false;

            let isRobot = qf.cache.desk.getIsRobot(this._uin);
            if (isRobot)
                this.imgAutoPlay.active = false;
        }
    },

    //----------------- 攻防状态 start -----------------

    //设置攻防状态(是否是地主标示) 左上角的标志
    setLandlordStatus(uin) {
        let u = qf.cache.desk.getUserByUin(this._uin);
        if (!qf.utils.isValidType(u)) return;

        if (u.status === qf.const.UserStatus.USER_STATE_INGAME) {
            //在游戏状态才显示地主农民
            if (uin === this._uin) {

                this.setDefendOrAttack("attack");
                this.headImg.updateHeadWithLocalImg(qf.res.default_lord_icon, this._userHeadWidth);
                this.setRightHeadDirector(true);
            } else {
                this.setDefendOrAttack();
                this.headImg.updateHeadWithLocalImg(qf.res.default_farmer_icon, this._userHeadWidth);
                this.setRightHeadDirector(true);
            }
        } else {
            this.clearLandlordStatus();
        }


    },

    //设置攻防状态
    setDefendOrAttack(_type) {
        if (!qf.utils.isValidType(this.imgDefend)) return;

        // if(_type === "defend") {
        // 	this.imgDefend.active = true);
        // 	this.imgDefend.loadTexture(qf.res.lord_img_defend);
        // } else
        if (_type === "attack") {
            this.imgDefend.active = true;
            //this.imgDefend.loadTexture(qf.res.lord_img_attack);
        } else {
            this.imgDefend.active = false;
        }
    },

    //清除玩家左上角攻防状态标志
    clearLandlordStatus() {
        this.setDefendOrAttack();

        //显示自己原本的头像
        let u = qf.cache.desk.getUserByUin(this._uin);
        if (qf.utils.isValidType(u)) {
            this.headImg.getComponent("UserHead").setHead(u.sex, u.portrait);
            this.setRightHeadDirector(false);
        }
    },

    //----------------- 攻防状态 end -----------------

    //-----------------------  气泡 start  -----------------------

    //设置是否显示不要气泡
    setNotWantTips(isbuyao, isSound) {
        if (qf.utils.isValidType(this.statusNode)) {
            if (isbuyao) {
                this.statusNode.active = true;
                this.statusType = "notwant";
                if (isSound) {
                    let user = qf.cache.desk.getUserByUin(this._uin);
                    if (user) {
                        let sex = user.sex;
                        let index = Math.floor(Math.random(1, 2) * 2);
                        if (index === 1) {
                            qf.music.playMyEffect("guo" + "_" + sex, false);
                        } else {
                            qf.music.playMyEffect("buyao" + "_" + sex, false);
                        }
                    }
                }
                this.setTextureByName("notwant");
                //this.startTipsAction();
                this.startTipsActionNoAnima();
            } else {
                this.statusNode.active = false;
                this.statusType = null;
            }
        }

        // if(qf.cache.desk:getEnterDeskMusicFlag()) {
        // 	let num = math.random(1,3);
        // 	qf.music.normalVoice("dontsend" + num, qf.cache.desk.getSexByUin(this._uin));
        // }
    },

    //设置加倍气泡
    setDoubleTips(isDouble, isSound, isMyself) {
        if (qf.utils.isValidType(this.statusNode)) {
            if (qf.utils.isValidType(isDouble) && isDouble >= this._WHETHER_DOUBLE.NOT_DOUBLE) {
                this.statusNode.active = true;
                this.statusType = "jiabei";
                let user = qf.cache.desk.getUserByUin(this._uin);
                if (isDouble === this._WHETHER_DOUBLE.DOUBLE) {
                    this.setTextureByName("double");
                    if (isSound && user) {
                        let sex = user.sex;
                        qf.music.playMyEffect("jiabei" + "_" + sex, false);
                    }
                } else if (qf.utils.isValidType(isDouble) && isDouble === this._WHETHER_DOUBLE.SUPER_DOUBLE) {
                    if (!isMyself) {
                        this.statusNode.active = true;
                        this.statusType = "chaojijiabei";
                        let user = qf.cache.desk.getUserByUin(this._uin);
                        if (isDouble === this._WHETHER_DOUBLE.SUPER_DOUBLE) {
                            this.setTextureByName("superDouble");
                        }
                    } else {
                        // 播放超级加倍动画
                        this.statusNode.active = false;

                        let res = qf.res.chaojijiabeiAniJson;
                        let name = "NewAnimationCJJB";
                        ccs.armatureDataManager.addArmatureFileInfo(res);

                        this.armature = new ccs.Armature(name);
                        this.armature.setScale(1);
                        this.armature.setPosition(this._winSize.width * 0.5, this._winSize.height * 0.55);
                        this.node.parent.addChild(this.armature, 10);

                        this.armature.getAnimation().play("Animation1", -1, 0);
                    }

                    if (isSound && user) {
                        let sex = user.sex;
                        qf.music.playMyEffect("chaojijiabei" + "_" + sex, false);
                    }
                } else {
                    this.setTextureByName("notdouble");
                    if (isSound && user) {
                        let sex = user.sex;
                        qf.music.playMyEffect("bujiabei" + "_" + sex, false);
                    }
                }

                //this.startTipsAction(1);
                this.startTipsActionNoAnima();

                // if(qf.cache.desk.getEnterDeskMusicFlag()) {
                //  	let musicName = "bujiabei";
                //  	if(isDouble > this._WHETHER_DOUBLE.NOT_DOUBLE) {
                //  		musicName = "jiabei";
                //  	}
                //  	qf.music.normalVoice(musicName, qf.cache.desk.getSexByUin(this._uin));
                // }
            } else {
                this.statusNode.active = false;
                this.statusType = null;
            }
        }
    },

    //设置抢地主气泡 0:不叫 1:不抢 2:叫地主 3:抢地主 不传参数就不显示
    setRobLordTips(num, maxGrabAction, isSound) {
        if (qf.utils.isValidType(this.statusNode)) {
            if (qf.utils.isValidType(num) && num >= this._WHETHER_ROB_LAND.NOT_CALL) {
                this.statusNode.active = true;
                this.statusType = "jiaodizhu";
                let soundStr = "";
                if (num === this._WHETHER_ROB_LAND.NOT_CALL) {
                    if (qf.cache.desk.getFirstGrabUin() > 0) {
                        this.setTextureByName("notRob");
                        soundStr = "buqiang";
                    } else {
                        this.setTextureByName("notCall");
                        soundStr = "bujiao";
                    }
                } else if (num === this._WHETHER_ROB_LAND.CALL_LAND) {
                    this.setTextureByName("callLord");
                    soundStr = "jiaodizhu";
                } else {
                    this.setTextureByName("robLord");
                    soundStr = "qiangdizhu";
                }
                if (isSound && soundStr && soundStr !== "") {
                    let user = qf.cache.desk.getUserByUin(this._uin);
                    if (user) {
                        let sex = user.sex;
                        qf.music.playMyEffect(soundStr + "_" + sex, false);
                    }
                }

                //this.startTipsAction();
                this.startTipsActionNoAnima();

            } else {
                this.statusNode.active = false;
                this.statusType = null;
            }
        }
    },

    //改变status的图片
    setTextureByName(name) {
        if (!qf.utils.isValidType(name)) return;
        let res = qf.tex.lord_userstatus_img[name];
        this.statusNode.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.table, res);
    },

    //气泡倒计时，3秒后清除
    startTipsAction(value) {
        if (qf.utils.isValidType(this.statusNode)) {
            this.statusNode.stopAllActions();

            //为了处理加倍不加倍和出牌按钮同时出现的特殊情况，需要减少加倍不加倍的消失时间
            let time = this._POPTIME;
            if (value) {
                time = this._POPTIME - value;
            }
            let action = cc.sequence(cc.delayTime(time), cc.callFunc((sender) => {
                sender.stopAllActions();
                sender.active = false;
                this.statusType = null;
            }));
            this.statusNode.runAction(action);
        }
    },

    //气泡显示,没有动画
    startTipsActionNoAnima(value) {
        if (qf.utils.isValidType(this.statusNode)) {
            this.statusNode.stopAllActions();
        }
    },

    //-----------------------  气泡 end  -----------------------

    //-----------------------  时钟 start  -----------------------

    updateTime(time) {
        this.stopAllActions();

        this.node.active = true;
        let leftTime = time;
        this.lblTime.getComponent(cc.Label).string = leftTime;

        let _tick = () => {
            let repeateAction = cc.repeatForever(
                cc.sequence(
                    cc.callFunc(() => {
                        leftTime = leftTime - 1;
                        if (leftTime < 0) {
                            this.stopCountTime();
                        } else {
                            this.lblTime.getComponent(cc.Label).string = leftTime;
                        }
                    }), cc.delayTime(1)));
            this.runAction(repeateAction);
        };

        //先延时0.5秒，再以一秒为间隔计时
        let action = cc.sequence(cc.delayTime(0.5), cc.callFunc(_tick))
        this.runAction(action);

    },

    stopCountDown() {
        this.stopAllActions();
        this.node.active = false;
    },

    stopCountTime(isOnlyClose) {
        this.stopCountDown();
        if (isOnlyClose) { return; }
        if ((!qf.cache.desk.getIsMySelfOperated()) && (!qf.cache.desk.getIsNextAutoBuChu())) {
            if (qf.cache.desk.isMyTurn() && (!qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin))) {
                qf.event.dispatchEvent(qf.ekey.LORD_NET_OP_TIME_OUT_REQ);
            }
        }
    },

    //-----------------------  时钟 end  -----------------------

    //准备
    showReady(paras) {
        this.clearTips(); //移除状态
        this.node.stopAllActions();
    },

    //点击玩家头像,弹出信息框
    initTouch() {
        qf.utils.addTouchEvent(this.node, (sender) => {
            if (this.is_touch_ing) return;
            this.is_touch_ing = true;
            qf.utils.targetDelayRun(this.node, 0.1, () => {
                this.is_touch_ing = false;
            });
            if (sender.active) {
                qf.event.dispatchEvent(qf.ekey.LORD_NET_PLAYER_INFO_REQ, { uin: this._uin });
            }
        });
    },

    //隐藏
    hide(paras) {
        paras = paras || {};
        if (this._hided === true) return;
        //this._uin = null;
        this._hided = true;

        this.clearTips();
        this.updateRobot(false);
        this.clearLandlordStatus();
        this.node.active = false;
        //qf.event.dispatchEvent(qf.ekey.GAME_IS_USER_LEAVE,{index: this._index});  //请求移除该的信息框
    },

    //显示
    show() {
        this._hided = false;
        if (this._uin === qf.cache.user.uin) {
            this.imgLeftBg.active = false;
        }
        this.node.active = true;
    },

    //清除攻防标记/手牌/提示/头像
    clearUser() {
        this.setWarningVisible(false);
        this.updateStatus();
        this.setIsShowCards(false);
        this.clearLandlordStatus();
        this.clearTips();
        this.setDoubleStatus();
    },

    //获取用户中心点
    getCenPos() {
        let _cs = this.getContentSize();
        let _posx = this.getPosition().x;
        let _posy = this.getPosition().y;
        return { x: _cs.width * 0.5 + _posx, y: _cs.height * 0.5 + _posy };
    },

    //获取气泡UI
    getStatusNode() {
        return this.statusNode;
    },

    updateStatus(uin) {
        let u = qf.cache.desk.getUserByUin(uin);
        if (u) {
            if (u.status === qf.const.UserStatus.USER_STATE_SIT_READYED)
                this.imgReady.active = true;
            else
                this.imgReady.active = false;
        }
    },

    showPopChat(paras) {
        let cs = this.getContentSize();
        if (qf.const.GAME_CHAT_TYPE_FACE === paras.content_type) { //是表情
            let face = this.getFaceNode(paras.content);
            if (face) {
                face.setPosition(cs.width / 2, cs.height / 2);
                this.addChild(face, 20);
            }
        } else if (qf.const.GAME_CHAT_TYPE_TXT === paras.content_type || qf.const.GAME_CHAT_TYPE_SYSTEM_TXT === paras.content_type) { //是文字
            this.showTxtBubble(paras.content);
            if (qf.const.GAME_CHAT_TYPE_SYSTEM_TXT === paras.content_type) {
                //系统配置文本，播放音效
                this.playChatVoice(paras.content);
            }
        }
    },

    setCountDownNode(node) {
        this.countDownNode = node;
    },

    getCountDownNode() {
        return this.countDownNode;
    },

    setCountDownNodePosition(count) {
        // (count === qf.const.CountDownNum.ONE) && this.countDownNode.setPosition(qf.const.CountDownNodePosition.ONE);
        // (count === qf.const.CountDownNum.TWO) && this.countDownNode.setPosition(qf.const.CountDownNodePosition.TWO);
        // (count === qf.const.CountDownNum.THREE) && this.countDownNode.setPosition(qf.const.CountDownNodePosition.THREE);
        // (count === qf.const.CountDownNum.FOUR) && this.countDownNode.setPosition(qf.const.CountDownNodePosition.FOUR);
    },

    setRightHeadDirector(reverse) {
        if (this._direction === this._PLAYER_INDEX.RIGHT) {
            //右边玩家头像和地主标识反向
            if (reverse) {
                //地主农民头像反向
                this.imgHeadBg.scaleX = -1;
                //this.imgDefend.setScaleX(-1);
            } else {
                this.imgHeadBg.scaleX = 1;
            }
        }
    },

    //系统聊天固定音效
    playChatVoice(content) {
        let user = qf.cache.desk.getUserByUin(this._uin);
        if (user) {
            let sex = user.sex;
            for (let key in qf.txt.stringChatDefault) {
                let v = qf.txt.stringChatDefault[key];
                if (v === content) {
                    qf.music.playMyEffect("chat" + "_" + key + "_" + sex, false);
                }
            }
        }

    },

    //更新段位等级
    updateLevel(u) {

    },

    //获得气泡（抢地主，叫地主，不叫）的状态
    getstatusType() {
        return this.statusType;
    },

    //表情
    getFaceNode(content) {
        let face_res = cc.js.formatStr(qf.tex.chat_face_name, content);
        let frame = qf.rm.getSpriteFrame(qf.res.chat, face_res);
        let face = new cc.Sprite(frame);
        face.runAction(cc.sequence(cc.scaleTo(0.5, 1.2),
            cc.scaleTo(0.5, 0.8),
            cc.scaleTo(0.5, 1.2),
            cc.scaleTo(0.5, 0.8),
            cc.scaleTo(0.5, 1.2), cc.callFunc(() => {
                face.removeFromParentAndCleanup();
            })));
        return face;
    },

    //聊天文字
    showTxtBubble(content) {
        this.panle_chat_bubble.stopAllActions();
        this.panle_chat_bubble.scale = 1;

        content = qf.string.cutStringAddLine(content);
        this.lbl_chat.getComponent(cc.Label).string = content;
        this.panle_chat_bubble.width = this.panel_chat_size.width + this.lbl_chat.width;
        this.panle_chat_bubble.height = this.panel_chat_size.height + this.lbl_chat.height;
        this.panle_chat_bubble.opacity = 255;

        if (this.lbl_chat.anchorX === 1) {
            this.lbl_chat.x = this.panle_chat_bubble.width - 20;
        }

        let getDisAction = () => {
            return cc.sequence(
                cc.show(),
                cc.delayTime(1.5), cc.spawn(
                    cc.fadeTo(1.5, 0),
                    cc.scaleBy(1.5, 1.1)), cc.hide())
        }
        this.panle_chat_bubble.runAction(getDisAction());
    },

});