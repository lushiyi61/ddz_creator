/*
主界面视图
*/

let View = require("../../frameworks/mvc/View");

cc.Class({
    extends: View,

    properties: {
        actionDistance: -800,
        iconDistance: -790,
        actionTime: 0.3,
        MODULE_ADAPTER_DISTANCE: 115,

        btnPosXList: [],

        img_head: cc.Node,
    },

    onLoad() {
        this.adjustIPhoneX("root");
    },

    initEvent() {
        //更新流量主信息
        qf.cache.config.on(qf.cache.config.VIDEOAD_CHANGE, this.showVideoAd, this);

        //更新记牌器可获取数量
        qf.cache.config.on(qf.cache.config.COUNTER_CANGET, this.updateCounterInfo, this);

        //更新玩家金币
        qf.cache.user.on(qf.cache.user.GOLD_CHANGE, this.updateUserGold, this);

        //更新玩家钻石
        qf.cache.user.on(qf.cache.user.DIAMOND_CHANGE, this.updateUserDiamond, this);

        //更新小红点列表
        qf.cache.redDotConfig.on(qf.cache.redDotConfig.REDDOT_CHANGE, this.updateRedDotList, this);
    },

    initUI() {
        this.root = this.node.getChildByName('root');

        // 界面主要UI
        this.panelMask = cc.find('panel_mask', this.root); //点击遮罩
        this.btnCompetition = cc.find('panel_main_entrance/btn_match', this.root); //万元赛事
        this.btnResidual = cc.find('panel_main_entrance/btn_residual', this.root); //残局闯关
        this.btnFriend = cc.find('panel_main_entrance/btn_friend', this.root); //好友约局
        this.btnCoinMode = cc.find('panel_main_entrance/btn_coinMode', this.root); //金币场
        this.btnRank = cc.find('panel_main_entrance/btn_rank', this.root); //排行榜
        this.pan_ani_residual = cc.find('pan_ani_residual', this.btnResidual); //残局闯关动画
        this.panelAniMatch = cc.find('panel_ani_match', this.btnCompetition); //比赛场动画
        this.panelAnicoinMode = cc.find('panel_ani_coinMode', this.btnCoinMode); //金币场动画
        this.pan_ani_friend = cc.find('pan_ani_friend', this.btnFriend); //好友场动画
        this.img_share_redpacket = cc.find('img_share_redpacket', this.btnResidual) //瓜分万元红包奖励
        this.lblResidualTotalPass = cc.find('lbl_residual_total_pass', this.btnResidual); //总通关
        this.lblResidualPassRank = cc.find('lbl_residual_pass_rank', this.btnResidual); //总排名

        // 其它功能
        this.btnWelfare = cc.find('panel_other_function/btn_welfare', this.root); //新手福利
        this.btnInvitation = cc.find('panel_other_function/btn_invitation', this.root); //邀请有礼
        this.btnFocus = cc.find('panel_other_function/btn_focus', this.root); //关注有礼
        this.btnCounter = cc.find('panel_other_function/btn_counter', this.root); //记牌器
        this.lblCounterNum = cc.find('img_counter_red/img_counter_num', this.btnCounter); //记牌器小红点数量
        this.btnEventActivity = cc.find('panel_other_function/btn_eventActivity', this.root); //赛事活动
        this.btnVideoAd = cc.find('panel_other_function/btn_videoAd', this.root); //流量主
        this.bmlblVideoAd = cc.find("bmlbl_videoAd", this.btnVideoAd); //流量主可播倒计时
        this.imgVideoAdReddot = cc.find("img_videoAd_reddot", this.btnVideoAd); //流量主按钮小红点
        this.imgVideoAdTitle = cc.find("img_videoAd_title", this.btnVideoAd); //流量主标题
        this.lblVideoAdReddot = cc.find("lbl_videoAd_reddot", this.imgVideoAdReddot); //流量主可看剩余次数
        this.panNationalDay = cc.find('panel_other_function/pan_nationalDay', this.root); //国庆活动
        this.lblNationalDayRmb = cc.find('btn_nationalDay/lbl_nationalDay_rmb', this.panNationalDay); //国庆活动图标奖励值
        this.imgInvitationReddot = cc.find('img_invitation_reddot', this.btnInvitation); //邀请有礼红点
        this.imgEventActivityReddot = cc.find('img_eventActivity_reddot', this.btnEventActivity); //赛事活动有礼红点
        this.imgWelfareRedDot = cc.find('img_welfare_reddot', this.btnWelfare); //登录礼包小红点

        // 顶部功能
        this.panelTop = cc.find('panel_top', this.root);
        this.btnCoin = cc.find('panel_info/btn_coininfo_bg', this.panelTop);
        this.btnDiamond = cc.find('panel_info/btn_diamondinfo _bg', this.panelTop);
        this.btnVoucher = cc.find('panel_info/btn_voucher_bg', this.panelTop);
        this.imgCoinAdd = cc.find('img_coin_add', this.btnCoin);
        this.imgDiamondAdd = cc.find('img_diamond_add', this.btnDiamond);
        this.lblNick = cc.find('panel_info/lbl_nick', this.panelTop);
        this.lblCoin = cc.find('lbl_coin', this.btnCoin)
        this.lblVoucher = cc.find('lbl_voucher', this.btnVoucher);
        this.lblDiamond = cc.find('lbl_diamond', this.btnDiamond);
        this.lblLevel = cc.find('panel_info/lbl_level', this.panelTop);
        this.imgLevel = cc.find('panel_info/img_level', this.panelTop);

        // 底部功能
        this.panelBottom = cc.find('panel_bottom', this.root);
        this.panelMenu = cc.find('panel_menu', this.panelBottom);
        this.imgMenu = cc.find('panel_menu/img_menu', this.panelBottom); //更多面板
        this.panelTouch = cc.find('panel_menu/panel_touch', this.panelBottom); //更多面板空白区域
        this.btnMore = cc.find('btn_more', this.panelBottom); //更多面板容器
        this.btnExchange = cc.find('btn_exchange', this.panelBottom); //兑换
        this.btnRedpacket = cc.find('btn_redpacket', this.panelBottom); //红包
        this.btnDiamondB = cc.find('btn_diamond', this.panelBottom); //钻石活动
        this.btnShop = cc.find('btn_shop', this.panelBottom); //商店
        this.btnSetting = cc.find('btn_setting', this.imgMenu); //设置
        this.gotoProgram = cc.find('Image_goToProgram', this.imgMenu); //圈子
        this.btnBag = cc.find('btn_bag', this.imgMenu); //背包
        this.btnMail = cc.find('btn_mail', this.imgMenu); //邮件
        this.btnRecord = cc.find('btn_record', this.imgMenu); //战绩
        this.imgMoreMsgNumBg = cc.find('img_more_mailnum_bg', this.btnMore); //更多图标小红点
        this.imgMsgNumBg = cc.find('img_mailnum_bg', this.btnMail); //邮件图标小红点
        this.lblNum = cc.find('lbl_mail_nums', this.imgMsgNumBg); //邮件图标小红点数字
        this.imgDiamondRedpacketReddot = cc.find('img_diamond_reddot', this.btnDiamondB); //钻石活动小红点

        this.imgMsgNumBg.active = true;
        this.lblNum.active = false;
        this.imgMoreMsgNumBg.active = true;
        this.btnFriend.active = qf.utils.getFuncIsOpen(qf.const.moduleConfig.FRIENDGAME) === qf.const.moduleVisible.TRUE;
        if (this.panNationalDay && this.panNationalDay.visible) {
            let actInfo = qf.cache.user.nationalDayActInfo;
            if (actInfo) this.lblNationalDayRmb.getComponent(cc.Label).string = cc.js.formatStr(qf.txt.nationalDay_icon_rmb, (actInfo.bonuses_sum / 100).toFixed(2));
        }

        this.updateVideoAdState();
        this.handlerIOS();
        this.initBtnPosX();

        qf.rm.checkLoad("mainEffect", () => {
            this.playBtnAni();
        });

        // this.adjustIPhoneX("root");

        //流量主 激励视频
        qf.platform.createRewardedVideoAd();
    },

    //初始化数据
    initData() {
        let userInfo = qf.cache.user;
        let gold = qf.cache.user.gold;
        let diamond = qf.cache.user.diamond_amount;
        let voucher = qf.cache.user.lottery_ticket;
        let counterNum = qf.cache.config.counterInfo.counterCanGetNum;
        let endGameLevel = qf.cache.user.endgame_level;
        let isNewLevel = qf.cache.user.match_guide_info.status;
        let loginInfo = qf.cache.user.userLoginInfo;

        this.lblResidualTotalPass.getComponent(cc.Label).string = cc.js.formatStr(qf.txt.main_total_pass, endGameLevel || 0);
        this.lblResidualTotalPass.setAnchorPoint(0, 0.5);
        this.lblResidualPassRank.getComponent(cc.Label).string = cc.js.formatStr(qf.txt.main_pass_rank, qf.cache.config.endgameTotleLevel);

        this.lblNick.getComponent(cc.Label).string = qf.string.cutString(userInfo.nick);
        this.lblCoin.getComponent(cc.Label).string = qf.utils.getFormatNumber(gold);
        this.lblVoucher.getComponent(cc.Label).string = qf.utils.getFormatNumber(voucher);
        this.lblDiamond.getComponent(cc.Label).string = qf.utils.getFormatNumber(diamond);

        if (isNewLevel) {
            this.lblLevel.getComponent(cc.Label).string = qf.txt.competition_level[userInfo.match_level];
            this.imgLevel.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.global, qf.tex.competition_level[userInfo.match_level]);
        } else {
            this.lblLevel.getComponent(cc.Label).string = qf.txt.competition_old_level[userInfo.match_level];
            this.imgLevel.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.global, qf.tex.competition_old_level[userInfo.match_level]);
        }

        //加判断，是正式服还是审核服，如果是审核服则按钮为巅峰赛事
        //is_arraigned:0为正式版本，1为提审版本
        if (loginInfo && loginInfo.is_arraigned && (loginInfo.is_arraigned === 1)) {
            this.btnCompetition.getComponent(cc.Button).normalSprite = qf.rm.getSpriteFrame(qf.res.main, qf.tex.mainBtnMessReviewed);
            // this.btn_game_center.active = false;
        }
        //后端开关
        if (qf.utils.getFuncIsOpen(qf.const.moduleConfig.ENTRANCE) === qf.const.moduleVisible.FALSE) {
            this.btnCompetition.getComponent(cc.Button).normalSprite = qf.rm.getSpriteFrame(qf.res.main, qf.tex.mainBtnMessReviewed);
        }

        this.updateMailRedShow();
        this.updateInvitationRedShow();
        this.updateEventActivityRedShow();
        this.updateDiamondRedShow();
        this.updateWelfareRedShow();

        this.updateHead();

        let imgRed = cc.find('img_counter_red', this.btnCounter); //记牌器小红点
        let imgShare = cc.find('img_counter_share', this.btnCounter); //记牌器分享可得
        if (counterNum > 0) {
            this.lblCounterNum.getComponent(cc.Label).string = counterNum;
            imgRed.active = true;
            imgShare.active = false;
        } else {
            this.lblCounterNum.getComponent(cc.Label).string = "";
            imgRed.active = false;
            imgShare.active = true;
        }
    },

    resetBtnPosX() {
        const btnList = [];
        btnList[qf.const.moduleConfig.WELFARE] = this.btnWelfare;
        btnList[qf.const.moduleConfig.COUNTER] = this.btnCounter;
        btnList[qf.const.moduleConfig.FOCUS] = this.btnFocus;
        //btnList[qf.const.moduleConfig.INVITATION] = this.btnInvitation;
        btnList[qf.const.moduleConfig.EVENTACTIVITY] = this.btnEventActivity;
        btnList[qf.const.moduleConfig.MAINFLOW] = this.btnVideoAd;
        btnList[qf.const.moduleConfig.NATIONALDAY] = this.panNationalDay;

        btnList.forEach((k, j) => {
            let x = this.btnPosXList[j];
            if (!this.actionIsfinish) {
                x = x - this.iconDistance;
            }
            k.x = x;
            k.active = true;
        });
    },

    initBtnPosX() {
        this.btnPosXList = [];
        this.btnPosXList[qf.const.moduleConfig.WELFARE] = this.btnWelfare.x + this.iconDistance;
        this.btnPosXList[qf.const.moduleConfig.COUNTER] = this.btnCounter.x + this.iconDistance;
        this.btnPosXList[qf.const.moduleConfig.FOCUS] = this.btnFocus.x + this.iconDistance;
        //this.btnPosXList[qf.const.moduleConfig.INVITATION] = this.btnInvitation.x + this.iconDistance;
        this.btnPosXList[qf.const.moduleConfig.EVENTACTIVITY] = this.btnEventActivity.x + this.iconDistance;
        this.btnPosXList[qf.const.moduleConfig.MAINFLOW] = this.btnVideoAd.x + this.iconDistance;
        this.btnPosXList[qf.const.moduleConfig.NATIONALDAY] = this.panNationalDay.x + this.iconDistance;
    },

    resetBehindFlowMainBtnPos() {
        const moduleBtnArr = [];
        moduleBtnArr[qf.const.moduleConfig.WELFARE] = this.btnWelfare;
        moduleBtnArr[qf.const.moduleConfig.COUNTER] = this.btnCounter;
        moduleBtnArr[qf.const.moduleConfig.FOCUS] = this.btnFocus;
        //moduleBtnArr[qf.const.moduleConfig.INVITATION] = this.btnInvitation;
        moduleBtnArr[qf.const.moduleConfig.EVENTACTIVITY] = this.btnEventActivity;
        moduleBtnArr[qf.const.moduleConfig.MAINFLOW] = this.btnVideoAd;
        moduleBtnArr[qf.const.moduleConfig.NATIONALDAY] = this.panNationalDay;

        const loginInfo = qf.cache.user.userLoginInfo;
        for (let m in loginInfo.module) {
            let i = loginInfo.module[m].type;
            if (i > qf.const.moduleConfig.MAINFLOW) {
                if (moduleBtnArr[i]) {
                    if (moduleBtnArr[i].active) {
                        moduleBtnArr[i].x = moduleBtnArr[i].x + this.MODULE_ADAPTER_DISTANCE;
                    }
                }
            }
        }
    },

    //播放按钮骨骼动画
    playBtnAni() {
        const armatureDisplay1 = this.createArmatureDisplay(this.panelAniMatch, "Animation1lv"); //比赛场动画
        const armatureDisplay2 = this.createArmatureDisplay(this.panelAnicoinMode, "Animation2zi"); //金币场动画
        const armatureDisplay3 = this.createArmatureDisplay(this.pan_ani_residual, "Animation5canju"); //残局动画        
        const armatureDisplay4 = this.createArmatureDisplay(this.pan_ani_friend, "Animation3haoyourukou"); //好友房动画

        armatureDisplay3.play();
        let frameCount = 0;
        this.schedule(() => {
            frameCount++;
            if (frameCount === 135)
                armatureDisplay1.play();
            else if (frameCount === 270)
                armatureDisplay2.play();
            else if (frameCount === 405)
                armatureDisplay4.play();
        }, 0, 405);
    },

    createArmatureDisplay(parent, animationName) {
        parent.parent.getChildByName("sp").opacity = 0;

        const armatureDisplay = qf.utils.createArmatureAnimation(parent, {
            dragonAsset: qf.res.animation_Main_ske,
            dragonAtlasAsset: qf.res.animation_Main_tex,
            armatureName: "armatureName",
        });
        const playstate = armatureDisplay.playAnimation(animationName)
        playstate.stop();

        return playstate;
    },
    //更新头像
    updateHead() {
        let u = qf.cache.user;
        this.img_head.getComponent("UserHead").setHead(u.sex, u.portrait);
    },
    //播放移入移出动画
    playAction(type) {
        const absActionDistance = Math.abs(this.actionDistance);

        if (type === qf.const.INOUT_TYPE.IN) {
            this.actionIsfinish = false;
            this.initModuleVisible();
            this.btnCompetition.runAction(cc.sequence(
                cc.callFunc(() => {
                    this.panelMask.active = true;
                }),
                cc.moveTo(this.actionTime, cc.v2(491, 510)),
                cc.callFunc(() => {
                    this.panelMask.active = false;
                    this.btnCompetition.setPosition(cc.v2(491, 510));
                })));
            this.btnResidual.runAction(cc.sequence(cc.moveTo(this.actionTime, cc.v2(163, 390)), cc.callFunc(() => {
                this.btnResidual.setPosition(cc.v2(163, 390));
            })));
            this.btnFriend.runAction(cc.sequence(cc.moveTo(this.actionTime, cc.v2(135, 5)), cc.callFunc(() => {
                this.btnFriend.setPosition(cc.v2(135, 5));
            })));
            this.btnCoinMode.runAction(cc.sequence(cc.moveTo(this.actionTime, cc.v2(468, 127)), cc.callFunc(() => {
                this.btnCoinMode.setPosition(cc.v2(468, 127));
            })));
            this.btnRank.runAction(cc.sequence(cc.moveTo(this.actionTime, cc.v2(-33, 400)), cc.callFunc(() => {
                this.btnRank.setPosition(cc.v2(-33, 400));
            })));
            this.btnWelfare.runAction(cc.moveBy(this.actionTime, cc.v2(this.actionDistance, 0)));
            this.btnInvitation.runAction(cc.moveBy(this.actionTime, cc.v2(this.actionDistance, 0)));
            this.btnFocus.runAction(cc.moveBy(this.actionTime, cc.v2(this.actionDistance, 0)));
            this.btnCounter.runAction(cc.moveBy(this.actionTime, cc.v2(this.actionDistance, 0)));
            this.btnEventActivity.runAction(cc.moveBy(this.actionTime, cc.v2(this.actionDistance, 0)));
            this.btnVideoAd.runAction(cc.moveBy(this.actionTime, cc.v2(this.actionDistance, 0)));
            this.panNationalDay.runAction(cc.sequence(
                cc.moveBy(this.actionTime, cc.v2(this.actionDistance, 0)),
                cc.callFunc(() => {
                    this.playNationalDayIconAction();
                })
            ));

            this.panelTop.runAction(cc.moveBy(this.actionTime, cc.v2(0, this.actionDistance)));
            let sequence_last = cc.sequence(cc.moveBy(this.actionTime, cc.v2(0, absActionDistance)),
                cc.callFunc(() => {
                    this.actionIsfinish = true;
                    this.initModuleVisible();
                    this.isInit = false;
                }))
            this.panelBottom.runAction(sequence_last);
        } else if (type === qf.const.INOUT_TYPE.OUT) {

            this.btnCompetition.runAction(cc.moveTo(this.actionTime, cc.v2(1291, 510)));
            this.btnResidual.runAction(cc.moveTo(this.actionTime, cc.v2(-763, 312)));
            this.btnFriend.runAction(cc.moveTo(this.actionTime, cc.v2(-763, 400)));
            this.btnCoinMode.runAction(cc.moveTo(this.actionTime, cc.v2(1268, 122)));
            this.btnRank.runAction(cc.moveTo(this.actionTime, cc.v2(-800, 400)));
            this.btnWelfare.runAction(cc.moveBy(this.actionTime, cc.v2(absActionDistance, 0)));
            this.btnInvitation.runAction(cc.moveBy(this.actionTime, cc.v2(absActionDistance, 0)));
            this.btnFocus.runAction(cc.moveBy(this.actionTime, cc.v2(absActionDistance, 0)));
            this.btnCounter.runAction(cc.moveBy(this.actionTime, cc.v2(absActionDistance, 0)));
            this.btnEventActivity.runAction(cc.moveBy(this.actionTime, cc.v2(absActionDistance, 0)));
            this.btnVideoAd.runAction(cc.moveBy(this.actionTime, cc.v2(absActionDistance, 0)));
            this.panNationalDay.runAction(cc.moveBy(this.actionTime, cc.v2(absActionDistance, 0)));

            this.panelTop.runAction(cc.moveBy(this.actionTime, cc.v2(0, absActionDistance)));
            this.panelBottom.runAction(cc.moveBy(this.actionTime, cc.v2(0, this.actionDistance)));
            this.actionIsfinish = false;
        }
    },
    //初始化模块按钮显示
    initModuleVisible() {
        //不论进场动画是否播放完，都重置按钮位置，未播放时，置为未移动前的初始位置，播放之后则，重置为异动之后的初始位置
        this.resetBtnPosX();

        const moduleConfig = qf.cache.config.moduleConfig;
        const moduleBtnArr = [];
        moduleBtnArr[qf.const.moduleConfig.WELFARE] = this.btnWelfare;
        moduleBtnArr[qf.const.moduleConfig.COUNTER] = this.btnCounter;
        moduleBtnArr[qf.const.moduleConfig.FOCUS] = this.btnFocus;
        //moduleBtnArr[qf.const.moduleConfig.INVITATION] = this.btnInvitation;
        moduleBtnArr[qf.const.moduleConfig.EVENTACTIVITY] = this.btnEventActivity;
        moduleBtnArr[qf.const.moduleConfig.MAINFLOW] = this.btnVideoAd;
        moduleBtnArr[qf.const.moduleConfig.NATIONALDAY] = this.panNationalDay;

        for (let m in moduleConfig) {
            let i = moduleConfig[m].type;
            if (moduleBtnArr[i]) {
                if (i === qf.const.moduleConfig.MAINFLOW && !this.btnVideoAdMark) {
                    if (moduleBtnArr[i].active) {
                        moduleBtnArr[i].active = false;
                    }

                    this.resetBehindFlowMainBtnPos();
                    return;
                }

                if (qf.utils.getFuncIsOpen(i) === qf.const.moduleVisible.FALSE) {
                    if (moduleBtnArr[i].active) {
                        moduleBtnArr[i].active = false;
                        //动态适配排版, 前一个功能不显示则后面的功能都往前移
                        for (let j in moduleBtnArr) {
                            let k = moduleBtnArr[j];
                            if (qf.func.checkint(j) > i) {
                                if (k.active) k.x = k.x + this.MODULE_ADAPTER_DISTANCE;
                            }
                        }
                    }
                } else {
                    if (moduleBtnArr[i]) moduleBtnArr[i].active = true;
                }
            }
        }
    },
    //国庆活动图标动画
    playNationalDayIconAction() {

    },
    //是否需要赛事引导
    isNeedGuide(isNeed) {

    },
    //IOS版本处理
    handlerIOS() {
        let OS = qf.platform.getPlatformName();

        if (OS === "ios") {
            this.btnMore.setPosition(100, 84);
            this.btnExchange.setPosition(270, 84);
            this.btnRedpacket.setPosition(439, 84);
            this.btnDiamondB.setPosition(609, 84);
        }

        this.btnShop.active = OS !== "ios";
        this.btnCoin.getComponent(cc.Button).interactable = OS !== "ios";
        this.imgCoinAdd.active = OS !== "ios";
        this.btnDiamond.getComponent(cc.Button).interactable = OS !== "ios";
        this.imgDiamondAdd.active = OS !== "ios";

        // 判断模块开关
        const pos = {};
        pos[2] = [cc.v2(270, 70), cc.v2(439, 70)];
        pos[3] = [cc.v2(200, 70), cc.v2(360, 70), cc.v2(520, 70)];
        pos[4] = [cc.v2(100, 70), cc.v2(270, 70), cc.v2(439, 70), cc.v2(609, 70)];
        pos[5] = [cc.v2(72, 70), cc.v2(208, 70), cc.v2(345, 70), cc.v2(481, 70), cc.v2(634, 70)];

        let loginInfo = qf.cache.user.userLoginInfo;
        this.btnRedpacket.active = loginInfo.red_packet_switch;
        this.btnDiamondB.active = loginInfo.diamond_activity_switch;
        this.img_share_redpacket.active = loginInfo.red_packet_switch;

        let btn = [this.btnMore, this.btnExchange];
        if (loginInfo.red_packet_switch) btn.push(this.btnRedpacket);
        if (loginInfo.diamond_activity_switch) btn.push(this.btnDiamondB);

        if (OS !== "ios") {
            btn.push(this.btnShop);
            this.btnDiamond.getComponent(cc.Button).interactable = loginInfo.diamond_activity_switch;
        }

        let tempPos = pos[btn.length];
        btn.forEach((btnA, index) => {
            btnA.setPosition(tempPos[index]);
            if (OS !== "ios" && index === btn.length - 1) {
                btnA.y = 60;
            }
        })

        //调整更多菜单栏
        this.panelMenu.x = this.btnMore.x - 50;
        const menuPos = [cc.v2(73, 90), cc.v2(189, 90), cc.v2(306, 90), cc.v2(423, 90), cc.v2(540, 90)];
        const menuBtn = [this.btnSetting, this.gotoProgram, this.btnBag, this.btnMail, this.btnRecord];
        let index = 0;

        if (qf.utils.getFuncIsOpen(qf.const.moduleConfig.FRIENDGAME) === qf.const.moduleVisible.FALSE) {
            this.btnSetting.active = false;
            menuBtn.shift();
        }
        if (qf.utils.getFuncIsOpen(qf.const.moduleConfig.FRIENDGAME) === qf.const.moduleVisible.FALSE) {
            this.btnRecord.active = false;
            menuBtn.pop();
        }

        menuBtn.map((btnB) => {
            if (btnB.active) {
                btnB.setPosition(menuPos[index]);
                index++;
            }
        });
        this.imgMenu.setContentSize(this.btnSetting.width * index + (index + 1) * 20, 165);
    },

    //检测模块弹出
    checkModulePop(model) {

    },

    /********* 播放激励广告 **********/
    //更新流量主显示状态
    updateVideoAdState(type) {
        if (type === qf.const.FLOWMAIN_STATE.CANPLAY) {
            this.bmlblVideoAd.active = false;
            this.imgVideoAdReddot.active = true;
            this.imgVideoAdTitle.active = true;
        } else if (type === qf.const.FLOWMAIN_STATE.NEXTTIME) {
            this.bmlblVideoAd.active = true;
            this.imgVideoAdReddot.active = false;
            this.imgVideoAdTitle.active = false;
        } else {
            this.bmlblVideoAd.active = false;
            this.imgVideoAdReddot.active = false;
            this.imgVideoAdTitle.active = true;
        }
    },

    clickVideoAd(outMain) {
        qf.event.dispatchEvent(qf.ekey.GET_USER_AD_INFO_REQ, { type: qf.const.FLOWMAIN_TYPE.GET, button: true, outMain: outMain });
        qf.platform.uploadEventStat({ //点击商城
            "module": "reg_funnel",
            "event": qf.rkey.PYWXDDZ_EVENT_REG_FUNNEL_CLICK_videoAD,
            "value": 1
        });
    },
    showVideoAd(model) {
        if (!model) return;

        const videoAdInfo = model.videoAdInfo;
        let button = model.button;
        let outMain = model.outMain;

        this.stopVideoAdTime();

        if (videoAdInfo.next_time === qf.const.FLOWMAIN_STATE.OVER) {
            this.btnVideoAd.active = false;
            this.btnVideoAdMark = false;

            this.updateVideoAdState(qf.const.FLOWMAIN_STATE.OVER);

            if (button) qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, { isModal: false, isOnly: true, content: qf.txt.videoAdOver });

            this.initModuleVisible();
        } else if (videoAdInfo.next_time === qf.const.FLOWMAIN_STATE.CANPLAY) {
            this.btnVideoAd.active = true;
            this.btnVideoAdMark = true;

            this.updateVideoAdState(qf.const.FLOWMAIN_STATE.CANPLAY);

            if (button) {
                qf.platform.showRewardedVideoAd();
                qf.platform.uploadEventStat({
                    "module": "reg_funnel",
                    "event": qf.rkey.PYWXDDZ_EVENT_REG_FUNNEL_PLAY_videoAD,
                    "value": 1
                });
            }

            let leftTimes = videoAdInfo.total_times - videoAdInfo.current_time;
            if (this.lblVideoAdReddot && leftTimes)
                this.lblVideoAdReddot.getComponent(cc.Label).string = leftTimes;
        } else if (videoAdInfo.next_time > 0) {
            this.btnVideoAd.active = true;
            this.btnVideoAdMark = true;

            this.updateVideoAdState(qf.const.FLOWMAIN_STATE.NEXTTIME);

            this.updateVideoAdLeftTime(videoAdInfo.next_time);

            if (outMain) {
                qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: cc.js.formatStr(qf.txt.videoAdOver1, videoAdInfo.next_time) });
            } else {
                if (button) {
                    qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.txt.videoAdOver2 });
                }
            }
        }
    },
    //更新激励广告剩余时间
    updateVideoAdLeftTime(time) {
        let secondTime = time;
        let leftTime = qf.utils.secondToDate(secondTime);
        this.bmlblVideoAd.getComponent(cc.Label).string = leftTime;

        let updateTimeAction = cc.repeatForever(
            cc.sequence(
                cc.callFunc(() => {
                    secondTime = secondTime - 1;
                    if (secondTime <= 0) {
                        qf.event.dispatchEvent(qf.ekey.GET_USER_AD_INFO_REQ, { type: qf.const.FLOWMAIN_TYPE.GET });
                        this.stopVideoAdTime();
                    } else {
                        this.updateVideoAdState(qf.const.FLOWMAIN_STATE.NEXTTIME);

                        let udTime = qf.utils.secondToDate(secondTime);
                        this.bmlblVideoAd.getComponent(cc.Label).string = udTime;
                    }
                }), cc.delayTime(1)));
        this.bmlblVideoAd.runAction(updateTimeAction);
    },

    stopVideoAdTime() {
        if (this.bmlblVideoAd) this.bmlblVideoAd.stopAllActions();
    },
    /********* 播放激励广告 END **********/

    //更新小红点列表
    updateRedDotList(param) {
        this.updateMailRedShow();
        this.updateInvitationRedShow();
        this.updateEventActivityRedShow();
        this.updateDiamondRedShow();
    },

    //更新邮件小红点
    updateMailRedShow() {
        if (this.imgMsgNumBg) {
            let red1 = qf.cache.redDotConfig.getRedDotByType(qf.const.RED_DOT_TYPE.REWARDMAIL);
            let red2 = qf.cache.redDotConfig.getRedDotByType(qf.const.RED_DOT_TYPE.SYSTEMMAIL);
            if (red1 || red2) {
                this.imgMsgNumBg.active = true;
                if (this.imgMoreMsgNumBg) this.imgMoreMsgNumBg.active = true;
            } else {
                this.imgMsgNumBg.active = false;
                if (this.imgMoreMsgNumBg) this.imgMoreMsgNumBg.active = false;
            }
            this.lblNum.active = false;
        }
    },

    //更新邀请有礼小红点
    updateInvitationRedShow() {
        if (this.imgInvitationReddot) {
            let reddot = qf.cache.redDotConfig.getRedDotByType(qf.const.RED_DOT_TYPE.INVITATION);
            if (reddot) this.imgInvitationReddot.active = true;
            else this.imgInvitationReddot.active = false;
        }
    },

    //更新登录礼包小红点
    updateWelfareRedShow(bHide) {
        if (bHide && this.imgWelfareRedDot) {
            this.imgWelfareRedDot.active = false;
            return;
        }
        if (this.imgWelfareRedDot) {
            if (qf.cache.config.giftInfo.flag) this.imgWelfareRedDot.active = true;
            else this.imgWelfareRedDot.active = false;
        }
    },

    //更新赛事活动有礼小红点
    updateEventActivityRedShow() {
        if (this.imgEventActivityReddot) {
            let reddot = qf.cache.redDotConfig.getRedDotByType(qf.const.RED_DOT_TYPE.EVENTACTIVITY);
            if (reddot) this.imgEventActivityReddot.active = true;
            else this.imgEventActivityReddot.active = false;
        }
    },

    //更新钻石活动小红点
    updateDiamondRedShow() {
        if (this.imgDiamondRedpacketReddot) {
            let reddot = qf.cache.redDotConfig.getRedDotByType(qf.const.RED_DOT_TYPE.DIAMOND_REDPACKET);
            if (reddot) {
                this.imgDiamondRedpacketReddot.active = true;
                let txt_diamond_red = this.imgDiamondRedpacketReddot.getChildByName("txt_diamond_red");
                let count = qf.cache.redDotConfig.getRedDotNumByType(qf.const.RED_DOT_TYPE.DIAMOND_REDPACKET);
                txt_diamond_red.active = count;
                txt_diamond_red.getComponent(cc.Label).string = count;
            } else {
                this.imgDiamondRedpacketReddot.active = false;
            }
        }
    },

    updateCounterInfo(param) {
        let imgRed = cc.find('img_counter_red', this.btnCounter); //记牌器小红点
        let imgShare = cc.find('img_counter_share', this.btnCounter); //记牌器分享可得
        if (param.canGetNum > 0) {
            this.lblCounterNum.getComponent(cc.Label).string = param.canGetNum;
            imgRed.active = true;
            imgShare.active = false;
        } else {
            this.lblCounterNum.getComponent(cc.Label).string = "";
            imgRed.active = false;
            imgShare.active = true;
        }
    },

    updateUserDiamond(param) {
        this.lblDiamond.getComponent(cc.Label).string = qf.utils.getFormatNumber(param.diamond);
    },

    updateUserGold(param) {
        this.lblCoin.getComponent(cc.Label).string = qf.utils.getFormatNumber(param.gold);
    },

    updateUserVoucher(param) {
        this.lblVoucher.getComponent(cc.Label).string = qf.utils.getFormatNumber(param.lotteryTicket);
    },

    updateCardCounterNum(param) {
        let imgRed = ccui.helper.seekWidgetByName(this.gui, "img_counter_red"); //记牌器小红点
        let imgShare = ccui.helper.seekWidgetByName(this.gui, "img_counter_share"); //记牌器分享可得
        if (param.counterNum > 0) {
            this.lblCounterNum.getComponent(cc.Label).string = param.counterNum;
            imgRed.active = true;
            imgShare.active = false;
        } else {
            this.lblCounterNum.getComponent(cc.Label).string = "";
            imgRed.active = false;
            imgShare.active = true;
        }
    },

    updateUserLevel(param) {
        let isNewLevel = ModuleManager.getModule("LoginController").getModel().getMatchGuideStatus();

        if (isNewLevel) {
            this.lblLevel.getComponent(cc.Label).string = qf.txt.competition_level[param.userLevel];
            this.imgLevel.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.global, qf.res.competition_level[param.userLevel]);
        } else {
            this.lblLevel.getComponent(cc.Label).string = qf.txt.competition_old_level[param.userLevel];
            this.imgLevel.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.global, qf.res.competition_old_level[param.userLevel]);
        }
    },

    updateModulePopInfo(param) {
        this.checkModulePop(param);
    },

    updateEndGamePass(param) {
        this.lblResidualTotalPass.getComponent(cc.Label).string = cc.js.formatStr(qf.txt.main_total_pass, param.endGameLevel || 0);
    },

    /************************ 主要按钮 *************************/
    //残局闯关
    onClickResidual() {
        cc.error("残局闯关");

        qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: "残局闯关" });
    },
    //万元赛事
    onClickCompetition() {
        cc.error("万元赛事");

        // qf.rm.checkLoad("competition",()=>{
        //     let aa = cc.loader.getRes(qf.res.prefab_competition);
        //     let node = cc.instantiate(aa);
        //     node.parent = this.node;
        // })

        qf.event.dispatchEvent(qf.ekey.EVT_SHOW_COMPETITION_VIEW);
    },
    //好友约局
    onClickFriend() {
        qf.rm.checkLoad("createroom", () => {
            qf.dm.push({ prefab: qf.res.prefab_create_room, script: 'CreateRoomDialog', loadded_data: true });
            qf.dm.pop();
        });
    },
    //金币场
    onClickCoinMode() {
        cc.error("金币场");
        qf.event.dispatchEvent(qf.ekey.EVT_SHOW_HALL);
    },
    //排行榜
    onClickRank() {
        cc.error("排行榜");
    },

    /************************ 顶部栏 **************************/
    //金币商城
    onClickCoin() {

    },
    //钻石商城
    onClickDiamond() {

    },
    //奖券
    onClickVoucher() {

    },
    //个人信息
    onClickUserInfo() {

    },

    /************************ 活动栏 **************************/
    //新手福利
    onClickWelfare() {
        qf.event.dispatchEvent(qf.ekey.SHOW_WELFARE_DIALOG);
    },
    //关注有礼
    onClickFocus() {

    },
    //邀请有礼
    onClickInvitation() {

    },
    //赛事活动
    onClickEventActivity() {

    },
    //流量主
    onClickVideoAd() {

    },
    //国庆活动
    onClickNationalDay() {

    },
    //记牌器
    onClickCounter() {

    },

    /******************** 游戏中心 ***************************/
    onClickGameCenter() {

    },

    /********************* 底部栏 *************************/
    //更多
    onClickMore() {
        this.imgMenu.active = this.panelTouch.active = !this.imgMenu.active;
        this.isNeedGuide(!this.imgMenu.active);
    },
    //更多空白区域,关闭更多功能面板
    onClickPanelTouch() {
        this.imgMenu.active = this.panelTouch.active = false;
        this.isNeedGuide(true);
    },
    //商城
    onClickShop() {

    },
    //红包
    onClickRedpacket() {
        cc.error("红包");
    },
    //钻石活动
    onClickDiamondB() {
        cc.error("钻石");
    },
    //兑换
    onClickExchange() {

    },
    //设置
    onClickSetting() {
        qf.rm.checkLoad("setting", () => {
            qf.dm.push({ prefab: qf.res.prefab_setting, script: 'SettingView', loadded_data: true });
            qf.dm.pop();
        });
        this.onClickPanelTouch();
    },
    //战绩
    onClickRecord() {
        this.onClickPanelTouch();

    },
    //邮件
    onClickMail() {
        this.onClickPanelTouch();

    },
    //背包
    onClickBag() {
        this.onClickPanelTouch();

    },

    //圈子
    onClickProgram() {
        this.onClickPanelTouch();

    },

    onDestroy() {
        qf.cache.user.targetOff(this);

        qf.cache.config.targetOff(this);

        qf.cache.redDotConfig.targetOff(this);
    },

});