
let AbstractGameView = require("../AbstractGameView");

let Menu        = require("../components/Menu");
let TopManager  = require("../components/TopManager");
let PokerManager= require("../components/poker/PokerManager");
let PokerOtherManager = require("../components/poker/PokerOtherManager");

cc.Class({
    extends: AbstractGameView,

    properties: {
        TAG: "LordGameView",
        topZZ: 1,
        RESULT_ACTION_TAG: 1000,
        PROMPT_ZORDER: 8,
        RUNTXTTIME: 0.3,
        RUNTXTDISTANCE: 30,
        COUNTER_SHARE_TIME: 5,
        SPRING_ANI_TIME: 2,
        RUNMULTITXTTIME: 0.3,
        RUNMULTITXTDISTANCE: 30,
    },

    onLoad() {
        this.adjustIPhoneX("root");
    },

    init(params) {
        this.user = [];
        this.isQueryEnter = false; //是否是  查询牌桌进来的
        if (params && params.isQuery)
            this.isQueryEnter = params.isQuery; //是否是  查询牌桌进来的
        this.meIndex = -1;
        this.seatLimit = 3;

        this._super(params);
    },

    initPublicModule() {
        this.root = this.node.getChildByName('root');

        this.panelSendPokerList = {};
        for (let k = 0; k <= 2; k++) {
            let pan = cc.find("panel_send" + k, this.root);
            this.panelSendPokerList[k] = pan;
        }

        this.shufflePanel = cc.find("panel_shuffle", this.root);
        this.shufflePanel.active = false;

        //右边玩家明牌组件
        let panRightPoker = cc.find("panel_show1", this.root);
        this.PMRight = panRightPoker.getComponent("PokerOtherManager");
        this.PMRight.getPokerAnimation().setMainView(this);

        // //左边玩家明牌组件
        let panLeftPoker = cc.find("panel_show2", this.root);
        this.PMLeft = panRightPoker.getComponent("PokerOtherManager");
        this.PMLeft.getPokerAnimation().setMainView(this);

        let panPoker = cc.find("panel_poker", this.root);
        this.panPokerPos = panPoker.getPosition();
        //按钮管理组件
        this.PM = panPoker.getComponent("PokerManager");
        this.PM.getPokerAnimation().setMainView(this);

        //牌组组件
        let panBtnMgr = cc.find("pan_btn_mgr", this.root);
        this.BM = panBtnMgr.getComponent("ButtonManager"); //除托管按钮外，其他的按钮都在ui中，且在pm的下层

        this.btnMenu = cc.find("btn_menu", this.root);
        let panelMenu = cc.find("img_menu", this.root);
        this.Menu = panelMenu.getComponent("Menu");
        this.Menu.active = false;

        //User组件
        for (let i = 0; i < 3; i++) {
            let k = qf.func.checkint(i);
            this.user[k] = this.createLordUser(k);
            //倒计时组件
            let node = cc.find("img_clock", this.user[k].node).getComponent("LordCountDownNode");
            this.user[k].setCountDownNode(node);
        }

        this.user_sitdown0 = cc.find("user_sitdown_0", this.root);
        this.user_sitdown1 = cc.find("user_sitdown_1", this.root);
        this.user_sitdown2 = cc.find("user_sitdown_2", this.root);
        this.user_sitdown0.index = 0;
        this.user_sitdown1.index = 1;
        this.user_sitdown2.index = 2;

        this.user_sitdown0.active = false;
        this.user_sitdown1.active = false;
        this.user_sitdown2.active = false;

        let myStatusNode = this.user[0].getStatusNode();

        //顶部信息组件
        this.topManager = cc.find("pan_top", this.root).getComponent("TopManager");
        this.topManager.node.setSiblingIndex(this.topZZ);

        this.imgNoLargerOthers = cc.find("img_no_larger_others", this.root);
        this.imgNoLargerOthers.active = false;

        this.hideAllCountDown();

        let panelCenter = cc.find("panel_center", this.root);
        this.txtPlayWay = cc.find("txt_play_way", panelCenter);
        this.txtServer = cc.find("panel_txt_server/panel_server/txt_server", this.root);
        this.txtServerOriginPos = this.txtServer.getPosition();
        this.txtScore = cc.find("pan_bottom_point/txt_score", this.root);
        this.txtScoreOriginPos = this.txtScore.getPosition();
        this.txtCapping = cc.find("panel_txt_server/panel_server/txt_capping", this.root);
        this.txtCappingOriginPos = this.txtCapping.getPosition();
        this.bplblMulti = cc.find("bplbl_multi", this.root);

        this.btn_invite = cc.find("btn_invite", this.root);
        this.imgInvitationReddot = cc.find("img_invitation_reddot", this.btn_invite); //邀请有礼红点

        // 结算前输赢图片
        this.img_you_result = cc.find("img_you_result", this.root);
        this.img_you_result.active = false;
        this.pos_you_result = this.img_you_result.getPosition();

        //初始化view中的各种按钮
        this.btn_task = cc.find("btn_task", this.root); //任务
        this.img_task_reddot = this.btn_task.getChildByName("img_task_reddot");
        this.img_task_bubble = this.btn_task.getChildByName("pan_task_bubble");

        //初始化明牌动画播放节点
        this.panel_showCard_0 = cc.find("panel_showCard_0", this.root);
        this.panel_showCard_1 = cc.find("panel_showCard_1", this.root);
        this.panel_showCard_2 = cc.find("panel_showCard_2", this.root);

        //记牌器
        this.counterBg = cc.find("panel_counter/img_counterBg", this.root);
        this.counterBtn = cc.find("panel_counter/btn_counter", this.root);
        this.counterBg.active = false;
        this.counterShareBg = cc.find("panel_counter/img_shareBg", this.root);
        this.counterShareBtn = cc.find("panel_counter/img_shareBg/btn_counterShare", this.root);
        this.shareTipBtn = cc.find("panel_counter/img_shareBg/img_share_tip1", this.root);
        this.shareTipBtn.getComponent(cc.Button).interactable = true;
        this.counterShareBg.active = false;

        this.panelBottom = cc.find("panel_bottom", this.root);
        this.panelEventBottom = cc.find("panel_event_bottom", this.root);

        //背景
        this.tableBg = cc.find("img_table_bg", this.root);
        this.tableBg.getComponent(cc.Button).interactable = true;

        this.panelBottom.active = true;
        this.panelEventBottom.active = false;
        this.imgJuBg = cc.find("img_ju_bg", this.panelBottom);
        this.lblCurJu = cc.find("txt_cur_jushu", this.imgJuBg);
        this.lblTotalJu = cc.find("txt_total_jushu", this.imgJuBg);

        this.lblMultiple = cc.find("pan_multiple/txt_multiple", this.root);

        //战绩
        this.imgJuBg.getComponent(cc.Button).interactable = true;

        this.btnEventAvtivity = cc.find("btn_eventActivity", this.root);
        this.btnEventAvtivity.getComponent(cc.Button).interactable = true;

        this.initRunTxt();
        this.initMultiRunTxt();
        this.initLocalUITxt();
        this.initShowOrHideUI();
        this.setWaitMultiShow(false);
        this.setCancelAutoPlayVisible(false);
        this.updateInviteReddot();
        this.updateTaskReddot();
        this.startInviteTipAciotn(15);
        this.initComponentEvent();
    },

    //侦听组件派发事件
    initComponentEvent() {
        this.BM.node.on(qf.ekey.DDZ_BM_DONTSENDCARD, this.dontSendCard, this);
        this.BM.node.on(qf.ekey.DDZ_BM_SENDCARD, this.sendCard, this);
        this.BM.node.on(qf.ekey.DDZ_BM_PMPROMIT, () => this.getPokerManager().promit(), this);
        this.BM.node.on(qf.ekey.DDZ_BM_SETOTHERSHOW, (b) => this.setImgNoLargerOtherShow(b), this);
        this.BM.node.on(qf.ekey.DDZ_BM_UPDATEOPEBTN, () => this.getPokerManager().updateOperBtns(), this);
        this.BM.node.on(qf.ekey.DDZ_BM_SETCOUNTDOWNPOS, (pos) => this.user[0].setCountDownNodePosition(pos), this);
        this.BM.node.on(qf.ekey.DDZ_BM_UPDATEMULTI, (b) => this.getPokerManager().updateMultiple(b), this);

        this.Menu.node.on(qf.ekey.DDZ_MENU_EXIT, this.exitBtnFun, this);
        this.Menu.node.on(qf.ekey.DDZ_MENU_AUTO, this.autoPlayBtnFun, this);
        this.Menu.node.on(qf.ekey.DDZ_MENU_SET, this.setBtnFun, this);

        this.PM.node.on(qf.ekey.DDZ_PM_UPDATEOPERBTNS, (arr) => this.getButtonManager().updateOperBtns(arr), this);
        this.PM.node.on(qf.ekey.DDZ_PM_SETIMGNOLARGER, (b) => this.setImgNoLargerOtherShow(b), this);
        this.PM.node.on(qf.ekey.DDZ_PM_DONTSENDCARD, () => this.dontSendCard(), this);
        this.PM.node.on(qf.ekey.DDZ_PM_HINDALLBTNS, () => this.getButtonManager().hideAllBtns(), this);
        this.PM.node.on(qf.ekey.DDZ_PM_SHUFFLEPANELHIDE, () => this.setShufflePanelHide(), this);
    },

    //创建用户组件
    createLordUser(index) {
        let lordUser = cc.find("pan_user" + index, this.root).addComponent("LordUser");
        lordUser.index = index;
        lordUser.onLoad();
        return lordUser;
    },

    //加倍效果
    showMultiAction(value) {
        this.bplblMulti.setScale(0);
        this.bplblMulti.active = true;
        this.bplblMulti.getComponent(cc.Label).string = qf.txt.tableMulti + value;
        this.bplblMulti.runAction(cc.sequence(cc.scaleTo(0.2, 1), cc.delayTime(0.8),
            cc.callFunc(() => {
                this.bplblMulti.setScale(0);
                this.bplblMulti.active = false;
            })));
    },

    showCardAni(seatId) {

        if (!qf.utils.isValidType(seatId)) return;

        let index = this.getUserIndexBySeatId(seatId);

        let armature = qf.utils.createArmatureAnimation(this["panel_showCard_" + index], {
            dragonAsset: qf.res.animation_sendcards_ske,
            dragonAtlasAsset: qf.res.animation_sendcards_tex,
            armatureName: "armatureName",
        }, () => {
            armature.node.removeComponent(dragonBones.ArmatureDisplay);
        });

        if (index !== 0) {
            armature.setScale(0.5);
        }
        armature.playAnimation("Animation1", 1);
    },

    //初始化文字动画ui
    initRunTxt() {
        this.panelRunTxt = cc.find("panel_run_txt", this.root);
        this.imgZheng = cc.find("img_zheng", this.panelRunTxt);
        this.imgZai = cc.find("img_zai", this.panelRunTxt);
        this.imgPi = cc.find("img_pi", this.panelRunTxt);
        this.imgPei = cc.find("img_pei", this.panelRunTxt);
        this.imgWan = cc.find("img_wan", this.panelRunTxt);
        this.imgJia = cc.find("img_jia", this.panelRunTxt);
        this.imgEllipsis1 = cc.find("img_shengluehao_1", this.panelRunTxt);
        this.imgEllipsis2 = cc.find("img_shengluehao_2", this.panelRunTxt);
        this.imgEllipsis3 = cc.find("img_shengluehao_3", this.panelRunTxt);

        this.runTxtAction();
    },

    //初始化加倍文字动画ui
    initMultiRunTxt() {

    },

    //初始化隐藏显示ui
    initShowOrHideUI() {
        cc.find("btn_voice", this.root).active = false;
        cc.find("btn_open_room", this.root).active = false;
        cc.find("panel_wx_share", this.root).active = false;
        cc.find("panel_standupViewers", this.root).active = false;
        cc.find("btn_sitdown", this.root).active = false;

        this.btn_chat = cc.find("btn_chat", this.root);
        this.btn_chat.active = true;
        cc.find("panel_bottom/img_ju_bg", this.root).active = false;

        cc.find("panel_counter/btn_counter/img_counter_red", this.root).active = false;
        cc.find("panel_counter/btn_counter/img_counter_share", this.root).active = false;

        if (qf.utils.getFuncIsOpen(qf.const.moduleConfig.TASK) === qf.const.moduleVisible.FALSE) {
            this.btn_task.active = false;
        } else {
            this.btn_task.active = true;
        }
    },

    // 更新记牌器显示
    hideCounter() {
        cc.find("panel_counter", this.root).active = false;
        //this.btn_invite.getLayoutParameter().setMargin({ left: 0, right: 0, top: 0, bottom: 110});
        // TODO
        // this.gui.requestDoLayout();
    },

    //根据阶段显示自己的倒计时
    updateMySelfClockPostion() {
        /*let this = this;
        let worldPos = null;
        let nodePos = null;
        let mySelfClock = this.user[0].getCountDownNode();
        if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_QDZ) {
        	worldPos = this.panelCallClock.getParent().convertToWorldSpace(cc.v2(this.panelCallClock.getPosition()));
        	nodePos = mySelfClock.getParent().convertToNodeSpace(worldPos);
        }
        else if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_MUTIPLE) {
        	worldPos = this.panelMultiClock.getParent().convertToWorldSpace(cc.v2(this.panelMultiClock.getPosition()));
        	nodePos = mySelfClock.getParent().convertToNodeSpace(worldPos);
        }
        else {
        	worldPos = this.panelOperClock.getParent().convertToWorldSpace(cc.v2(this.panelOperClock.getPosition()));
        	nodePos = mySelfClock.getParent().convertToNodeSpace(worldPos);
        }

        mySelfClock:setPosition(nodePos);*/
    },

    //aniamtion //是否有动画
    sendPoker(paras) {
        //在座位上的玩家
        let inDeskUser = qf.cache.desk.getOnDeskUserByUin(qf.cache.user.uin);
        if (!paras || !inDeskUser) return 0;
        let pokers = qf.cache.desk.getMyHandCards();
        let time = 0;
        if (paras.aniamtion) {
            time = this.PM.setCardsWithAnimations(pokers, this.getShufflePanel());
            qf.music.playMyEffect("fapai");
        } else
            this.PM.setCards(pokers);

        return time;
    },

    //停止发牌有动画
    stopSendPoker() {
        this.PM.stopSendPokersAcitons();
    },

    /************************* 点击事件 ********************/
    // 初始化点击事件
    initClick() {
        qf.utils.addTouchEvent(this.btnMenu, () => {
            this.onClickMenu();
        });

        qf.utils.addTouchEvent(this.tableBg, () => {
            this.onClickTableBG();
        });
    },
    //聊天按钮
    onClickChat() {

    },

    //左上角菜单
    onClickMenu() {
        if (this.Menu.node.active) {
            this.Menu.setMenuVisible(false);
        } else {
            this.Menu.updateMenuItem();
            this.Menu.setMenuVisible(true);

            if (qf.cache.desk.getTypeInfo().deskMode === qf.const.DESK_MODE_FRIEND) {
                var my_user = qf.cache.desk.getUserByUin(qf.cache.user.uin);
                if (my_user && my_user.status && my_user.status > qf.const.UserStatus.USER_STATE_STAND) {
                    qf.event.dispatchEvent(qf.ekey.SHOW_GUIDE_VIEW, {
                        btn: this.Menu,
                        btnResUrl: qf.res.table_pic_menu,
                        isSpriteFrame: false,
                        type: qf.const.GUIDE_TYPE.FRIEND_MENU,
                        text: qf.txt.friend_guide_1,
                        isClose: true,
                        finger: true,
                        fingerOffset: cc.v2(200, -180)
                    })
                }
            }
        }
    },

    //取消托管
    onClickCancelAutoPlay() {

    },

    //记牌器分享
    onClickCounterShare() {

    },

    //记牌器
    onClickCounter() {

    },

    //背景
    onClickTableBG() {
        this.Menu.setMenuVisible(false);
        this.hideLuckyTaskBubble();
        // TODO pokermanager
        // this.PM.setAllPokerDownByClick();
    },

    //邀请有礼
    onClickInvite() {

    },

    //幸运任务
    onClickTask() {

    },

    //战绩
    onClickJuBg() {

    },

    //赛事活动
    onClickEventAct() {

    },

    //退出
    exitBtnFun() {
        //qf.event.dispatchEvent(qf.ekey.GET_TASK_DATA_REQ);
        let args = {
            confirmCb: () => {
                qf.event.dispatchEvent(qf.ekey.LORD_NET_EXIT_DESK_REQ);
            }
        }
        qf.event.dispatchEvent(qf.ekey.CLASSICROOM_ONEXIT_GAME, args);
    },

    //托管
    autoPlayBtnFun() {
        qf.event.dispatchEvent(qf.ekey.LORD_NET_AUTO_PLAY_REQ, { auto: 1 });
    },

    //设置
    setBtnFun() {

    },
    /************************* 点击事件END *****************/

    startInviteTipAciotn(time) {
        if (!this.btn_invite.active) return;
        this.startTime = 0;
        this.firstTime = true;
        let img_invite = this.btn_invite.getChildByName("img_invite");
        img_invite.setScale(0);

        img_invite.opacity = 0;
        let seq2 = cc.sequence(
            cc.spawn(
                cc.scaleTo(0.65, 0.8),
                cc.fadeIn(0.65)
            ).easing(cc.easeSineOut()),
            cc.scaleTo(0.1, 0.7).easing(cc.easeSineOut()),
            cc.delayTime(2),
            cc.scaleTo(0.1, 0.8).easing(cc.easeSineInOut()),
            cc.scaleTo(0.8, 0).easing(cc.easeSineInOut())
        )

        let seq = cc.sequence(
            cc.callFunc(() => {
                this.startTime = this.startTime + 1;
                if (this.firstTime || this.startTime > time) {
                    this.startTime = 0;
                    this.firstTime = false;
                    img_invite.runAction(seq2);
                    img_invite.opacity = 0;
                    img_invite.setScale(0);
                }
            }), cc.delayTime(1)
        );

        this.node.runAction(cc.repeatForever(seq));
    },

    updateInviteReddot() {
        if (this.imgInvitationReddot) {
            let reddot = qf.cache.redDotConfig.getRedDotByType(qf.const.RED_DOT_TYPE.INVITATION);
            if (reddot) this.imgInvitationReddot.active = true;
            else this.imgInvitationReddot.active = false;
        }
    },

    updateTaskReddot() {
        if (this.img_task_reddot) {
            let reddot = qf.cache.redDotConfig.getRedDotByType(qf.const.RED_DOT_TYPE.TASK);
            let num = qf.cache.redDotConfig.getRedDotNumByType(qf.const.RED_DOT_TYPE.TASK);
            let txt_task_num = cc.find("btn_task/txt_task_num", this.root);

            if (num <= 0) {
                this.img_task_reddot.active = false;
                txt_task_num.active = false;
                return;
            }
            if (reddot) {
                this.img_task_reddot.active = true;
                txt_task_num.active = true;
                txt_task_num.getComponent(cc.Label).string = num;
            } else {
                this.img_task_reddot.active = false;
                txt_task_num.active = false;
            }
        }
    },

    showLuckyTaskBubble() {
        let luckyTask = qf.cache.desk.getLuckyTask();

        if (luckyTask && luckyTask.tid) {
            qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.txt.luckyTask_tip, showTime: 1.5 });
            // TODO 不支持的api 暂时注释
            // this.img_task_bubble.setCascadeColorEnabled(true);
            // this.img_task_bubble.setCascadeOpacityEnabled(true);

            this.img_task_bubble.opacity = 0;
            this.img_task_bubble.active = true;

            let reward = luckyTask.awards[0];
            let txt_line = this.img_task_bubble.getChildByName("txt_line");
            let txt_task_desc = this.img_task_bubble.getChildByName("txt_task_desc");
            let img_reward = this.img_task_bubble.getChildByName("img_reward");
            let txt_reward_2 = this.img_task_bubble.getChildByName("txt_reward_2");
            let bg = this.img_task_bubble.getChildByName("img_bubble_bg");

            let txt = luckyTask.desc;
            let txt_2 = txt.slice(0, txt.length - 6);
            txt_task_descgetComponent(cc.Label).string = txt_2;

            bg.setContentSize(txt_task_desc.getContentSize().width + 100, 120)
            let scalex = txt_task_desc.getContentSize().width / txt_line.getContentSize().width;
            txt_line.setScaleX(scalex);

            img_reward.loadTexture(qf.res.table_lucky_reward_icon[reward.reward_type], ccui.Widget.PLIST_TEXTURE);
            txt_reward_2.getComponent(cc.Label).string = reward.amount + qf.txt.table_lucky_reward_unit[reward.reward_type];
            if (reward.reward_type === 2) {
                txt_reward_2.getComponent(cc.Label).string = reward.amount / 100 + "元" + qf.txt.table_lucky_reward_unit[reward.reward_type];
            } else {
                txt_reward_2.getComponent(cc.Label).string = reward.amount + qf.txt.table_lucky_reward_unit[reward.reward_type];
            }

            let seq = cc.sequence(
                cc.fadeIn(0.5),
                cc.delayTime(10),
                cc.fadeOut(0.3)
            )
            this.img_task_bubble.runAction(seq);
        } else {
            this.img_task_bubble.active = false;
        }
    },

    hideLuckyTaskBubble() {
        if (this.img_task_bubble && this.img_task_bubble.active) {
            this.img_task_bubble.active = false;
        }
    },

    hideInviteBtn() {
        this.btn_invite.active = false;
    },

    setMultip(str) {
        this.lblMultiple.getComponent(cc.Label).string = str + "";
    },

    setCurJu() {
        let curRound = qf.cache.desk.getCurRound() + 1;
        let maxRound = qf.cache.desk.getMaxRound();
        this.lblCurJu.getComponent(cc.Label).string = curRound;
        this.lblTotalJu.getComponent(cc.Label).string = maxRound;
    },

    enterUser(uin) {
        if (uin === qf.cache.user.uin) {
            this.beforeChangDesk();
            // TODO 音效资源
            // qf.music.playBackGround(qf.res.lord_music.fightbgm);
        }

        let userList = qf.cache.desk.getUserList();
        this.updateMeIndex(userList);
        for (let uin in userList) {
            let v = userList[uin];
            // TODO 头像组件
            this.getUser(v.uin).update(v.uin);
        }
    },

    //底分，倍数等等
    updateTopStatus() {
        this.setCurJu();
        this.setMultip(qf.cache.desk.getMultiple());
        if (qf.utils.getFuncIsOpen(qf.const.moduleConfig.INVITATION) === qf.const.moduleVisible.FALSE ||
            qf.cache.desk.has_get_packs) {
            this.btn_invite.active = false;
        }
    },

    //换桌之前做的准备
    beforeChangDesk() {
        this.user[0].clearTips(); //清除自己的状态， 比如说准备
        this.user[1].hide();
        this.user[2].hide();
    },

    getUser(uin) {
        let index = this.getUserIndexByUin(uin);
        return this.getUserWidgetByIndex(index);
    },
    getUserWidgetByIndex(index) {
        if (qf.utils.isValidType(index))
            return this.user[index];
        else
            return null;
    },
    getUserWidgetByBySeatId(seat_id) {
        let index = this.getUserIndexBySeatId(seat_id);
        return this.getUserWidgetByIndex(index);
    },
    getCountDownNode(uin) {
        let index = this.getUserIndexByUin(uin);
        let userWidget = null;
        if (qf.utils.isValidType(index))
            userWidget = this.user[index];

        if (userWidget)
            return userWidget.getCountDownNode();
    },

    getUserByIndex(index) {
        return this.user[index];
    },
    //更新自己的位置索引
    updateMeIndex(userList) {
        let meIndex = -1;
        if (this.meIndex) meIndex = this.meIndex;
        for (let k in userList) {
            let u = userList[k];
            if (u.uin == qf.cache.user.uin) {
                meIndex = u.seat_id;
                break;
            } else {
                if (u.seat_id === meIndex)
                    meIndex = -1;
            }
        }
        this.meIndex = meIndex;
        if (-1 === this.meIndex) {
            this.meIndex = 0;
        }
    },
    //根据Uin获取User组件的index值
    getUserIndexByUin(uin) {
        let u = qf.cache.desk.getUserByUin(uin);
        if (u)
            return this.getUserIndexBySeatId(u.seat_id);
    },
    //根据seatId获取User组件的index值
    getUserIndexBySeatId(seatId) {
        if (seatId < 0) { //站起  获取不到位置索引
            return null;
        } else {
            return (seatId - this.meIndex + this.seatLimit) % this.seatLimit;
        }
    },

    //根据index获取User组件的seatId
    getSeatIdByIndex(index) {
        if (this.meIndex === -1) { // 肯定是没有座位的
            if (index >= 0) return index;
            else return this.seatLimit - 1;
        } else {
            let seatId = (index + this.meIndex) % this.seatLimit;
            return seatId;
        }
    },
    //更新玩家
    updateUser(user) {
        if (user) {
            let userWidget = this.getUser(user.uin);
            if (userWidget) userWidget.update(user.uin);
        }
    },
    //更新玩家
    updateUserByUin(uin) {
        let userWidget = this.getUser(uin);
        if (userWidget) userWidget.update(uin);
    },

    getUserSitDownByUin(uin) {
        let index = this.getUserIndexByUin(uin);
        if (qf.utils.isValidType(index))
            return this["user_sitdown" + index];
    },
    getUserSitDownByIndex(index) {
        return this["user_sitdown" + index];
    },

    addGameOver() {

    },

    getPokerManager() {
        return this.PM;
    },

    getButtonManager() {
        return this.BM;
    },

    getTopManager() {
        return this.topManager;
    },

    dontSendCard() {
        logd("DONT_SEND_CARD");
        qf.event.dispatchEvent(qf.ekey.LORD_NET_DISCARD_REQ);
        this.PM.allPokerPushDown(); //不出按钮所有牌推下去
    },

    sendCard(parameters) {
        parameters = parameters || {};
        let isCanSend = (qf.cache.desk.getNextUin() === qf.cache.user.uin) && (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME); //先检查自己的状态- 若处理自己出牌阶段
        parameters.isCanSend = isCanSend;
        this.PM.sendCard(parameters);
        return isCanSend;
    },

    //托管界面设置 chenfei
    setLordAutoPlay(model) {
        let u = this.getUser(model.uin);
        if (!u) {
            loge("托管的uin 错误", this.TAG);
            return;
        }

        let auto = model.auto === 1;
        this.updateRobot(model.uin, auto);

        if (model.uin === qf.cache.user.uin) {
            this.updateMyHandCardsByAuto();
            this.updateUIByMySelfAutoPlay();
        }
    },

    //根据自己托管状态更新按钮组
    updateUIByMySelfAutoPlay() {
        if (qf.cache.desk.isMyTurn()) { //在显示加倍按钮的时候，有可能会有两个操作者
            if (qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin)) {
                this.BM.hideAllBtns();
            } else {
                if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_QDZ) {
                    //轮到我操作要显示叫分按钮
                    this.BM.updateCallBtns(qf.cache.desk.getMaxGrabAction());
                } else if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_MUTIPLE) {
                    //轮到我操作要显示加倍按钮
                    let myUser = qf.cache.desk.getUserByUin(qf.cache.user.uin);
                    if (myUser.call_multiple === LordPokerOper.NOSELECT)
                        this.BM.updateDoubleBtns();
                }
                if (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME) {
                    //轮到我操作，要显示出牌按钮
                    this.PM.updateOperBtns();

                    //最后一副牌自动打出
                    if (qf.cache.desk.getIsLastCardsAuto() === qf.const.LordPokerAutoLastOper.AUTO) {
                        this.setAutoLastCards();
                    }

                }
            }
        }
    },

    //清除上局UI
    clearLastUI() {
        // qf.utils.targetStopDelayRun(this,this.RESULT_ACTION_TAG);
        this.topManager.removeThreeCards();
        this.setMultip(0);
        this.PM.clear();
        this.PM.clearAllDeskCards();

        if (this.PMRight.node.children.length !== 0) {
            this.PMRight.node.removeAllChildren(true);
        }
        if (this.PMLeft.node.children.length !== 0) {
            this.PMLeft.node.removeAllChildren(true);
        }

        let userList = qf.cache.desk.getUserList();
        for (let uin in userList) {
            let v = userList[uin];
            let uView = this.getUser(v.uin);
            if (uView) {
                uView.clearUser();
            }
        }
        this.setImgNoLargerOtherShow(false);
    },

    //清除单人UI
    clearOneUI(uin) {
        let u = this.getUser(uin);

        if (u) {
            u.clearUser();

            if (u.index === 0) {
                this.PM.clear();
                this.PM.clearDeskCard(0);
            } else if (u.index === 1) {
                if (this.PMRight.getChildrenCount() !== 0) {
                    this.PMRight.removeAllChildren(true);
                }
                this.PM.clearDeskCard(1);
            } else if (u.index === 2) {
                if (this.PMLeft.getChildrenCount() !== 0) {
                    this.PMLeft.removeAllChildren(true);
                }
                this.PM.clearDeskCard(2);
            }
        }

    },

    //比赛开始把相应的结束框清理掉
    removeOverDialog() {
        /*qf.event.dispatchEvent(qf.ekey.REMOVE_VIEW_DIALOG, {name: "lordwaitnextgame"});
        qf.event.dispatchEvent(qf.ekey.REMOVE_VIEW_DIALOG, {name: "lordgameover"});
        qf.event.dispatchEvent(qf.ekey.REMOVE_VIEW_DIALOG, {name: "lordreadygame"});
        qf.event.dispatchEvent(qf.ekey.REMOVE_VIEW_DIALOG, {name: "lordpvpdetailes"});*/
    },

    updateResultValue() {
        let resultInfo = qf.cache.desk.getResultList();
        for (let k in resultInfo) {
            let v = resultInfo[k];
            let u = this.getUser(v.uin);
            if (u) {
                u.updateResultValue(v.win_gold);
            }
        }
    },

    //游戏结束的处理
    handlerGameOver() {
        let resultInfo = qf.cache.desk.getResultInfo();
        if (resultInfo.is_abolish === qf.const.RESULT_IS_ABOLISH.TRUE) return;
        let isAllOver = (resultInfo.over_flag === qf.const.RESULT_OVER_FLAG.TRUE);
        this.removeOverDialog();
        let delayTime = this.showSpringAnimation(); //春天动画

        this.updateResultValue();

        let userList = qf.cache.desk.getUserList();
        for (let uin in userList) {
            let v = userList[uin];
            let u = this.getUser(v.uin);
            if (u) {
                u.updateCoin(v.gold);
                u.updateLevel(v);
                this.clearRobot(v.uin, isAllOver);

                u.clearUser();
                if (uin !== qf.cache.user.uin) {
                    if (u.index === 0) {
                        this.PM.showLastAllCards(v.cards, u.index, this.getSendPokerPanel(0));
                    } else if (u.index === 1) {
                        this.PMRight.updateShowCard(v.cards, u.index);
                    } else if (u.index === 2) {
                        this.PMLeft.updateShowCard(v.cards, u.index);
                    }
                }
            }
        }

        this.BM.hideAllBtns();
        this.topManager.stopCountDown();
        // qf.utils.targetStopDelayRun(this, this.RESULT_ACTION_TAG);

        let seaction = cc.sequence(cc.delayTime(delayTime),
            cc.callFunc(() => {
                this.addGameOver();
            })
        );
        // seaction.setTag(this.RESULT_ACTION_TAG);
        this.runAction(seaction);
    },

    //播放玩家出牌动画 uin 标示出牌的人
    showPlayCards(cards, reconnect, laizicards, index, uin, isShowCards, notShowAction) {
        let a = null;
        let b = null;
        if (laizicards.length === 0) {
            a = laizicards;
            b = cards;
        } else {
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
            isShowCards: isShowCards,
            notShowAction: notShowAction
        });
    },

    //设置操作倒计时
    setCountDownTime(leftTime) {
        if (leftTime <= 0) {
            this.stopAllCountTime();
            return;
        }

        this.showCountDown(true);
        let uin = qf.cache.desk.getNextUin();
        let uin2List = qf.cache.desk.getNextUin2();
        let countDownNode = this.getCountDownNode(uin);
        if (countDownNode)
            countDownNode.updateTime(leftTime);

        for (let k in uin2List) {
            let uin2 = uin2List[k];
            let countDownNode2 = this.getCountDownNode(uin2);
            if (countDownNode2)
                countDownNode2.updateTime(leftTime);
        }
    },

    stopAllCountTime() {
        let uin2List = qf.cache.desk.getNextUin2();
        let mineUin = qf.cache.user.uin;
        let userList = qf.cache.desk.getUserList();
        for (let uin in userList) {
            let v = userList[uin];
            let countDownNode = this.getCountDownNode(v.uin);
            if (countDownNode) {
                countDownNode.stopCountTime(true);
                countDownNode.active = false;
            }
        }
    },

    //设置是否显示倒计时组件
    showCountDown(isShow) {
        this.hideAllCountDown();
        let uin = qf.cache.desk.getNextUin();
        let uin2List = qf.cache.desk.getNextUin2();
        let countDownNode = this.getCountDownNode(uin);
        if (countDownNode)
            countDownNode.active = isShow;

        for (let k in uin2List) {
            let uin2 = uin2List[k];
            let countDownNode2 = this.getCountDownNode(uin2);
            if (countDownNode2)
                countDownNode2.active = isShow;
        }
    },

    //隐藏所有倒计时组件
    hideAllCountDown() {
        let userList = qf.cache.desk.getUserList();
        for (let k in userList) {
            let v = userList[k];
            let countDownNode = this.getCountDownNode(v.uin);
            if (countDownNode) {
                countDownNode.stopCountTime(true);
                countDownNode.active = false;
            }
        }
    },

    //开始游戏总的90s倒计时
    beginPlayCountDown() {
        this.topManager.gameBeginCountDown();
    },

    //清除操作人上把打出的牌
    clearDeskCardsByUin(uin) {
        let index = this.getUserIndexByUin(uin);
        this.PM.clearDeskCard(index);
    },

    //托管更新自己牌状态
    updateMyHandCardsByAuto() {
        let isMySelfAuto = qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin);
        if (isMySelfAuto)
            this.PM.addTuoGuan(); //托管
        else
            this.PM.removeTuoGuan(); //取消托管
    },

    //设置取消托管按钮的隐藏和显示
    setCancelAutoPlayVisible(visible) {
        if (!this.btnCancleAutoPlay) {
            this.btnCancleAutoPlay = cc.find('btn_cancel_auto', this.root);
        }
        this.btnCancleAutoPlay.active = visible;
        this.setBtnAutoPlayVisible(!visible);
    },

    //设置托管按钮的隐藏和显示
    setBtnAutoPlayVisible(visible) {
        let idArr = [
            qf.const.MenuItemId.EXIT
        ];

        if (qf.utils.getFuncIsOpen(qf.const.moduleConfig.FRIENDGAME) === qf.const.moduleVisible.TRUE) {
            idArr.push(qf.const.MenuItemId.SET)
        }

        idArr = this.updateMenuIdsByAutoPlayShow(idArr, visible);
        this.Menu.updateMenuItem(idArr);
    },

    //更新菜单项依据主动托管是否显示
    updateMenuIdsByAutoPlayShow(idArr, isBtnAutoPlayVisible) {
        let uMine = qf.cache.desk.getOnDeskUserByUin(qf.cache.user.uin);
        if (uMine && uMine.status === qf.const.UserStatus.USER_STATE_INGAME) {
            if (isBtnAutoPlayVisible) {
                idArr = [
                    qf.const.MenuItemId.EXIT,
                    qf.const.MenuItemId.AUTOPLAY
                ];
            }

            if (qf.utils.getFuncIsOpen(qf.const.moduleConfig.FRIENDGAME) === qf.const.moduleVisible.TRUE) {
                idArr.push(qf.const.MenuItemId.SET)
            }
        }
        return idArr;
    },

    //一副牌结束后清除托管
    clearRobot(uin, isAllOver) {
        this.updateRobot(uin, false);
    },

    updateRobot(uin, bool) {
        if (uin === qf.cache.user.uin) {
            this.setCancelAutoPlayVisible(bool);
        } else {
            let userView = this.getUser(uin);
            if (userView)
                userView.updateRobot(bool);
        }
    },

    initLocalUITxt() {

    },

    //播放互动动画
    interactPhizAnimation(uin, toUin, phizId, nick) {

        //todo:此处应该判断旁观玩家是否在在桌子里
        let fromUser = this.getUser(uin);
        //let isLookOn = !fromUser //and isInDesk

        let toUser = this.getUser(toUin);
        if (!toUser) return;

        // let data = {};
        // data.content_type = 0;
        // data.nick = nick;
        // data.op_uin = uin;
        // data.content = phizId;
        // this.updateChatOrVoice(data);

        let pos = null;
        let fromScale = null;
        let centerFromUser = null;
        if (fromUser) centerFromUser = cc.v2(fromUser.getCenPos());
        else centerFromUser = this.getBtnObservePos();
        // else if (isLookOn) {
        // 	pos, fromScale = this.chatOutDesk.getChatFaceArgs();
        // 	centerFromUser = this.convertToNodeSpace(pos);

        let centerToUser = cc.v2(toUser.getCenPos());
        // if (toUin === qf.cache.user.uin)
        // 	//是自己并且头像不可见（头像不可见说明在游戏中或在游戏的间隙中）
        // 	centerToUser.x = centerToUser.x + 100;
        let isReverse = toUser.index !== 1;
        let handler = InteractPhizManager.playArmatureAnimation(centerFromUser, centerToUser, phizId, isReverse);

        for (let k in handler) {
            let v = handler[k];
            this.addChild(v, 21)
        }
    },

    //隐藏所有按钮接口
    hideAllBtns() {
        this.BM.hideAllBtns();
    },

    //获取打出牌动画对应的节点
    getSendPokerPanel(i) {
        return this.panelSendPokerList[i];
    },


    //自己没有打过上家牌提示动画
    showMyNotGreaterAni() {
        let isBtnShow = qf.const.OPER_BTN_STAUTS.SHOW;
        let isBtnUnShow = qf.const.OPER_BTN_STAUTS.UNSHOW;
        this.getButtonManager().updateOperBtns([
            [0, isBtnUnShow],
            [1, isBtnUnShow],
            [2, isBtnUnShow],
            [3, isBtnShow]
        ]);
        this.imgNoLargerOthers.setPosition(this.panPokerPos);
        this.imgNoLargerOthers.active = true;
        /*this.imgNotGreaterTips.stopAllActions();
        this.imgNotGreaterTips.active = true;
        this.imgNotGreaterTips.opacity = 0;
        this.imgNotGreaterTips.runAction(cc.sequence(
        	cc.fadeIn(0.3),
        	cc.delayTime(1.5),
        	cc.fadeOut(0.3),
        	cc.callFunc((sender)=>{
        		sender.active = false;
        	})
        ));*/
    },

    //地主确定后 隐藏自己叫分气泡
    hideMyStatusNode() {
        myUserWidget = this.getUser(qf.cache.user.uin);
        if (myUserWidget) {
            let myStatusNode = myUserWidget.getStatusNode();
            if (myStatusNode)
                myStatusNode.active = false;
        }
    },

    updateUserReady(uin) {
        let userWidget = this.getUser(uin);
        if (userWidget) {
            userWidget.updateStatus(uin);
        }
    },

    updateShowCard() {
        let userList = qf.cache.desk.getUserList();
        for (let uin in userList) {
            let v = userList[uin];
            let u = this.getUser(v.uin);
            if (u) {
                if (qf.utils.isValidType(v.cards) && v.cards.length !== 0) {
                    //mark by Gallen 不友好 todo： 封装函数处理
                    if (u.index === 0 && v.uin !== qf.cache.user.uin && v.show_multi > 1) this.PM.updateShowCard(v.cards, u.index);
                    else if (u.index === 1) this.PMRight.updateShowCard(v.cards, u.index);
                    else if (u.index === 2) this.PMLeft.updateShowCard(v.cards, u.index);
                }
            }
        }
    },

    updateTableBtns() {},

    setTypeInfo(typeInfo) {
        let roomId = typeInfo.roomId;
        let deskMode = typeInfo.deskMode;
        let typeStr1 = qf.txt.room_battle_type_name[qf.cache.desk.getBattleType()];
        let typeStr2 = "";
        let typeStr = "";
        let scoreStr = "";
        let maxScoreStr = "";
        let maxScoreStr1 = "";
        let serverStr = "";
        if (deskMode === qf.const.DESK_MODE_NORMAL) {
            //经典场
            for (let k in qf.cache.config.room) {
                let v = qf.cache.config.room[k];
                if (roomId === v.room_id) {
                    if (v.room_level === qf.const.ROOM_LEVEL.NOVICE) typeStr2 = qf.txt.room_level_novice;
                    else if (v.room_level === qf.const.ROOM_LEVEL.PRIMARY) typeStr2 = qf.txt.room_level_primary;
                    else if (v.room_level === qf.const.ROOM_LEVEL.NORMAL) typeStr2 = qf.txt.room_level_normal;
                    else if (v.room_level === qf.const.ROOM_LEVEL.MEDIUM) typeStr2 = qf.txt.room_level_medium;
                    else if (v.room_level === qf.const.ROOM_LEVEL.ADVANCED) typeStr2 = qf.txt.room_level_advanced;
                    else if (v.room_level === qf.const.ROOM_LEVEL.SUPER) typeStr2 = qf.txt.room_level_super;
                    else typeStr2 = qf.txt.room_level_unknow;
                    scoreStr = qf.utils.getFormatNumber(v.base_score);
                    serverStr = cc.js.formatStr(qf.txt.room_serverStr, qf.utils.getFormatNumber(v.enter_fee));

                }
            }
        } else {
            //好友房底分
            scoreStr = qf.const.FRIEND_BASE_SCORE + "";
            //好友房没有服务费
            serverStr = " ";

            // this.txtCapping.setPositionX(this.txtCappingOriginPos.x - 80);
            // this.txtCapping.getLayoutParameter().setMargin({ left: -40, right: 0, top: -33, bottom: 0});
            // this.txtCapping.getParent().requestDoLayout();

        }
        maxScoreStr = cc.js.formatStr(qf.txt.room_maxScoreStr, qf.utils.getFormatNumber(qf.cache.desk.getCapScore()));
        maxScoreStr1 = cc.js.formatStr(qf.txt.room_maxScoreStr1, qf.utils.getFormatNumber(qf.cache.desk.getCapScore()));
        if (typeStr2 && typeStr2 !== "") {
            typeStr = cc.js.formatStr(typeStr2, typeStr1);
        } else {
            typeStr = typeStr1;
        }

        this.txtPlayWay.getComponent(cc.Label).string = typeStr;
        this.txtServer.getComponent(cc.Label).string = serverStr;
        this.txtScore.getComponent(cc.Label).string = scoreStr;
        this.txtCapping.getComponent(cc.Label).string = maxScoreStr;

        if (deskMode === qf.const.DESK_MODE_FRIEND) {
            this.txtPlayWay.getComponent(cc.Label).string = typeStr + "   " + maxScoreStr1;
        }
    },

    updateChangeDesk(delay) {
        let u = qf.cache.desk.getUserByUin(qf.cache.user.uin);
        if (u && u.status !== qf.const.UserStatus.USER_STATE_SIT_READYED) {
            this.BM.updateChangeTableBtns(false);
        } else {
            if (delay && !this.isQueryEnter) {
                this.node.runAction(cc.sequence(cc.delayTime(5), cc.callFunc(() => {
                    let u = qf.cache.desk.getUserByUin(qf.cache.user.uin);
                    if (u && u.status === qf.const.UserStatus.USER_STATE_SIT_READYED) {
                        this.BM.updateChangeTableBtns(true);
                    }
                })));
            } else {
                this.BM.updateChangeTableBtns(true);
            }
        }
    },

    //自己没有打过上家牌提示动画
    setImgNoLargerOtherShow(isShow) {
        this.imgNoLargerOthers.active = isShow;
    },

    //事件通知刷新界面
    onNotify(event, param) {
        if (event === qf.ekey.UPDATE_USER_GOLD) {
            let uView = this.getUser(qf.cache.user.uin);
            if (uView)
                uView.updateCoin(param.gold);
        } else if (event === qf.ekey.UPDATE_RED_DOT_LIST) {
            loge("小红点通知 ！！")
            this.updateInviteReddot();
            this.updateTaskReddot();
        }
    },

    showInviteAndSeatBtn() {},

    updateTableBtns() {},

    userStandUp(seat_id) {},

    userSitDown(paras) {},

    adjustByAllUser(paras) {},

    getBtnObservePos() {
        return cc.v2(0, 0);
    },

    //跑正在匹配玩家文字动画
    runTxtAction() {
        let txtArr = [
            this.imgZheng,
            this.imgZai,
            this.imgPi,
            this.imgPei,
            this.imgWan,
            this.imgJia,
            this.imgEllipsis1,
            this.imgEllipsis2,
            this.imgEllipsis3
        ];

        let i = -1;

        let runTxtFunc = () => {
            i++;
            let v = txtArr[i];

            v.runAction(
                cc.sequence(
                    cc.moveBy(this.RUNTXTTIME, cc.v2(0, this.RUNTXTDISTANCE)),
                    cc.moveBy(this.RUNTXTTIME, cc.v2(0, -this.RUNTXTDISTANCE))
                )
            );

            if (i === txtArr.length - 1)
                i = -1;
        }

        this.schedule(runTxtFunc, this.RUNTXTTIME);
    },

    //跑等待农民加倍文字动画
    runMultiTxtAction() {},

    //设置正在匹配玩家显示与否
    setMatchingShow(visible, enterUin) {
        this.setRunTxtVisible(visible)
    },

    setRunTxtVisible(visible) {
        this.panelRunTxt.active = visible;
    },

    //设置等待农民加倍显示与否
    setWaitMultiShow(visible) {},

    //更新记牌器
    updateCounter() {
        let imgRed = cc.find("panel_counter/btn_counter/img_counter_red", this.root);
        let imgShare = cc.find("panel_counter/btn_counter/img_counter_share", this.root);
        let counterNum = cc.find("img_counter_num", imgRed);
        let card_counter = qf.cache.desk.getCardCounter();
        let visible1 = imgShare.active;
        let visible2 = false;

        if (card_counter.counts > 0) {
            //次数
            counterNum.getComponent(cc.Label).string = card_counter.counts;
            imgRed.active = true;
            imgShare.active = false;
            visible2 = false;
        } else {
            if (qf.cache.desk.need_pop_card_counter === false) {
                this.hideCounter();
            } else {
                //分享可得
                counterNum.getComponent(cc.Label).string = "";
                imgRed.active = false;
                if (qf.utils.getFuncIsOpen(qf.const.moduleConfig.COUNTER) === qf.const.moduleVisible.TRUE) imgShare.active = true;
                visible2 = true;
            }
        }
        if (visible1 !== visible2) {
            imgShare.stopAllActions();
            imgShare.setRotation(0);
            if (visible2) {
                imgShare.runAction(cc.repeatForever(cc.sequence(
                    cc.rotateTo(0.5, 15),
                    cc.rotateTo(1, -15),
                    cc.rotateTo(0.5, 0),
                    cc.delayTime(10)
                )))
            }
        }
        //剩余牌数
        if (card_counter.remain_list && card_counter.remain_list.length > 0) {
            for (let i = 0; i < card_counter.remain_list.length; i++) {
                let v = card_counter.remain_list[i];
                let numImg = cc.find("panel_counter/img_counterBg/img_counter_num" + (i + 1), this.root);
                numImg.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.table, qf.tex["table_pic_countNum" + v]);
            }
        } else {
            this.counterBg.active = false;
        }
    },

    //显示记牌器
    showCounter(type) { //不传参取相反，传参：1显示，2不显示
        let u = qf.cache.desk.getUserByUin(qf.cache.user.uin);
        let card_counter = qf.cache.desk.getCardCounter();

        if ((u && u.status === qf.const.UserStatus.USER_STATE_INGAME) && (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME) &&
            (card_counter.counts > 0) && (card_counter.can_use_counts > 0) && (card_counter.remain_list && card_counter.remain_list.length > 0)) {
            //打牌阶段
            let visible = !(this.counterBg.active);
            if (type === 1) {
                visible = true;
            } else if (type === 2) {
                visible = false;
            }
            this.counterBg.active = visible;
        } else {
            this.counterBg.active = false;
        }
    },

    //显示记牌器分享气泡
    showCounterShare(visible) {
        this.counterShareBg.stopAllActions();
        if (visible) {
            let showTime = this.COUNTER_SHARE_TIME;
            let time = qf.cache.desk.getCounterCardTime();
            if (time && time > 0) {
                showTime = time;
            }
            this.counterShareBg.runAction(cc.sequence(
                cc.delayTime(showTime),
                cc.callFunc(() => {
                    this.counterShareBg.active = false;
                })
            ));
            //记牌器分享是否开启
            if (qf.utils.getFuncIsOpen(qf.const.moduleConfig.COUNTER) === qf.const.moduleVisible.FALSE) return;
            this.counterShareBg.active = true;
        } else {
            this.counterShareBg.active = false;
        }
    },

    //加倍阶段自动显示记牌器/分享
    autoShowCounterOrShare() {
        let card_counter = qf.cache.desk.getCardCounter();
        if (card_counter.counts > 0) { //次数
            //记牌器流程
            this.showCounter(1);
            this.showCounterShare(false);
        } else {
            //分享可得分支
            this.counterBg.active = false;
            this.showCounterShare(true);
        }
    },

    //显示春天动画
    showSpringAnimation(visible) {
        let resultInfo = qf.cache.desk.getResultInfo();
        let delayTime = 0;
        // TODO
        // if(resultInfo.spring_type && this){//春天
        //     ccs.armatureDataManager.addArmatureFileInfo(qf.res.springAniJson);

        //     let armature = new ccs.Armature("NewAnimationchuntian02");
        //     let szWin = cc.winSize;
        //     armature.setPosition(szWin.width * 0.5, szWin.height * 0.5);
        //     function animationEvent(armatureBack, movementType, movementID){
        //         if(movementType === ccs.MovementEventType.complete){
        //             if(armature){
        //                 armature.removeFromParent(true);
        //                 armature = null;
        //                 logd("remove",res);
        //             }
        //         }
        //     }
        //     armature.getAnimation().setMovementEventCallFunc(animationEvent);
        //     this.addChild(armature,10);
        //     armature.getAnimation().play("Animation1",-1,0);
        //     delayTime = this.SPRING_ANI_TIME;
        // }
        return delayTime;
    },

    updateFortuneInfo() {
        let userList = qf.cache.desk.getUserList();
        for (let uin in userList) {
            let v = userList[uin];
            let uView = this.getUser(v.uin);
            if (uView)
                uView.updateCoin(v.gold);
        }
    },

    //显示地主出现动画
    showLordAppearsAnimation() {},

    //显示一副牌开场动画
    showPairAnimation(roundIndex, isFinalRound) {
        if (roundIndex === qf.const.ROUND_INDEX.ONE)
            this.showFirstPairAnimation();
        else if (roundIndex === qf.const.ROUND_INDEX.TWO)
            this.showSecondPairAnimation();
        else if (roundIndex === qf.const.ROUND_INDEX.THREE) {
            if (!isFinalRound)
                this.showThirdPairAnimation();
            else
                this.showSixthPairAnimation();
        } else if (roundIndex === qf.const.ROUND_INDEX.FOUR)
            this.showFourthPairAnimation();
        else if (roundIndex === qf.const.ROUND_INDEX.FIVE)
            this.showFifthPairAnimation();
        else if (roundIndex === qf.const.ROUND_INDEX.SIX)
            this.showSixthPairAnimation();
    },

    //显示第一副牌开场动画
    showFirstPairAnimation() {},

    //显示第二副牌开场动画
    showSecondPairAnimation() {},

    //显示第三副牌开场动画
    showThirdPairAnimation() {},

    //显示第四副牌开场动画
    showFourthPairAnimation() {},

    //显示第五副牌开场动画
    showFifthPairAnimation() {},

    //显示第六副牌开场动画
    showSixthPairAnimation() {},

    showOnePairEndAnimation() {},

    //最后一副牌自动打出
    setAutoLastCards(rsp) {},

    //更新赛事活动界面
    updateEventActivityDialog() {
        let tasks = qf.cache.desk.getEventGameActivityData();
        let btnActivityIsOpen = qf.utils.getFuncIsOpen(qf.const.moduleConfig.EVENTACTIVITY) === qf.const.moduleVisible.TRUE;
        if (tasks && tasks.length > 0 && btnActivityIsOpen) {
            this.btnEventAvtivity.active = true;
        } else {
            this.btnEventAvtivity.active = false;
        }
        //如果赛事活动界面是打开的，则更新界面数据
        let refreshFunc = (view) => {
            if (view) view.setDatas();
        };
        qf.event.dispatchEvent(qf.ekey.GET_VIEW_DIALOG_BY_NAME, { name: "eventgameactivity", cb: refreshFunc });
    },

    //隐藏发牌
    setShufflePanelHide() {
        this.shufflePanel.active = false;
        let shuffleNodes = cc.find(this.shufflePanel, "node_shuffles");
        if (shuffleNodes) {
            shuffleNodes.removeAllChildren();
        }
    },

    //获取发牌父节点
    getShufflePanel() {
        return this.shufflePanel;
    },
});