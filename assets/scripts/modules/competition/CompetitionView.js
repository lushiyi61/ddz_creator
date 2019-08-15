/*赛事大厅主页*/
let View = require("../../frameworks/mvc/View");
cc.Class({
    extends: View,

    properties: {
        actionDistance: -800,
        actionTime: 0.3,
        yellowColor: cc.color(255, 228, 113),
        grayColor: cc.color(178, 178, 178),
        showCount: 0,

        ANI_NAME: { default: "", zkxz: "zhankaixunzhang", threestar: "sanxing", twostar: "erxing", onestar: "yixing" },
        STAR_NUM: {
            default: -1,
            ONE: 1,
            TWO: 2,
            THREE: 3,
        },

    },

    onLoad() {
        this.adjustIPhoneX("root");
    },

    initEvent() {
        qf.cache.user.on(qf.cache.user.GOLD_CHANGE, this.onGoldChange, this);
        //qf.cache.user.on(qf.cache.user.DIAMOND_CHANGE, this.onDiamondChange, this);
        qf.cache.user.on(qf.cache.user.TICKET_CHANGE, this.onTicketChange, this);

        qf.cache.redDotConfig.on(qf.cache.redDotConfig.REDDOT_CHANGE, this.updateExchangeRedShow, this);

        qf.cache.competition.on(qf.ekey.UPDATE_COMPETITION_INFO, this.updateData, this);
        qf.cache.competition.on(qf.ekey.UPDATE_EXIT_COMPETITION_INFO, this.showExitCompetition, this); //打开退赛兑换
        //qf.cache.competition.on(qf.ekey.UPDATE_HIGH_LEVEL_MATCH_INFO, this.updateHighLevelData, this);
    },

    initUI() {
        this.root = this.node.getChildByName('root');

        this.btnExit = cc.find("panel_bottom/btn_exit", this.root); //返回
        this.btnExchange = cc.find("panel_bottom/btn_exchange", this.root); //兑换
        this.btnRank = cc.find("panel_bottom/btn_rank", this.root); //排行榜
        this.btnRule = cc.find("panel_bottom/btn_rule", this.root); //规则
        this.lblCoin = cc.find("panel_top/btn_coin/lbl_coin", this.root).getComponent(cc.Label); //金币
        this.lblVoucher = cc.find("panel_top/btn_voucher/lbl_voucher", this.root).getComponent(cc.Label); //奖券
        this.btnVoucher = cc.find("panel_top/btn_voucher", this.root);
        this.imgExchangeReddot = this.btnExchange.getChildByName("img_exchange_reddot").getComponent(cc.Sprite); //兑换中心红点
        this.panelMask = this.root.getChildByName("panel_mask") //遮罩
        this.panelMain = cc.find("panel_main", this.root);
        this.panelTop = cc.find("panel_top", this.root);
        this.panelBottom = cc.find("panel_bottom", this.root);
        this.btnCoin = cc.find("panel_top/btn_coin", this.root);
        this.panelLevel = cc.find("panel_main/panel_level", this.root);
        this.imgCoinAdd = this.btnCoin.getChildByName("img_add").getComponent(cc.Sprite); //加号
        this.img_bg = cc.find("img_bg", this.root).getComponent(cc.Sprite);

        this.pan_season_reward = this.panelMain.getChildByName("pan_season_reward");//赛季奖励
        this.pan_season_time = this.panelMain.getChildByName("pan_season_time");   //赛季时间
        this.btn_paiweisai = this.panelMain.getChildByName("btn_paiweisai");    //排位赛按钮
        this.btn_wangzhesai = this.panelMain.getChildByName("btn_wangzhesai");    //王者赛按钮
        this.pan_level_mask = this.panelMain.getChildByName("pan_level_mask");
        this.btn_season_wenhao = this.pan_season_time.getChildByName("pan_season_reward");

        this.btn_paiweisai.interactable = false;
        this.btn_wangzhesai.interactable = false;

        let OS = qf.platform.getPlatformName();
        this.btnCoin.interactable = (OS !== "ios");
        this.imgCoinAdd.active = (OS !== "ios");
    },

    initData(args) {
        this._super(args);

        this.lblCoin.string = qf.cache.user.gold;
        this.lblVoucher.string = qf.cache.user.lottery_ticket;

        this.updateExchangeRedShow();
    },

    //更新兑换中心小红点
    updateExchangeRedShow() {
        if (this.imgExchangeReddot) {
            let reddot = qf.cache.redDotConfig.getRedDotByType(qf.const.RED_DOT_TYPE.EXCHANGE_CENTER);
            if (reddot) {
                this.imgExchangeReddot.active = true;
                let txt_diamond_red = this.imgExchangeReddot.node.getChildByName("txt_exchange_red").getComponent(cc.Label);
                let count = qf.cache.redDotConfig.getRedDotNumByType(qf.const.RED_DOT_TYPE.EXCHANGE_CENTER);
                txt_diamond_red.avtive = Boolean(count);
                txt_diamond_red.string = count;
            } else {
                this.imgExchangeReddot.avtive = false;
            }
        }
    },

    updateData(model) {
        let competitionInfo = model.competitionInfo;
        this.armatures = [];    //张开勋章
        this.aniNames = [this.ANI_NAME.zkxz];
        this.star_bg = [];      //星星底
        this.star_star = [];    //星星
        this.star_bg_aniName = [];
        this.star_star_aniName = [];
        this.curLevel = competitionInfo.match_level;

        this.season_award = competitionInfo.season_award;  //赛季奖励
        this.session_info = competitionInfo.session_info;   //赛季信息
        this.guide_status = competitionInfo.guide_status;   //引导状态
        this.first_guide_status = competitionInfo.first_guide_status;//赛事更新引导
        this.next_level_award = competitionInfo.next_level_award;//下级可得奖券
        this.sub_level = competitionInfo.sub_level; //小段位
        this.match_regulations_path = competitionInfo.match_regulations_path;// 赛季规则图片路径
        this.star_number = competitionInfo.star_number;

        if (this.armNode)
            this.armNode.removeFromParent(true);
        this.armNode = new cc.Node();
        this.armNode.setPosition(cc.p(0, 16));
        this.panelLevel.addChild(this.armNode, 10);

        this.setSeasonAward();//赛季奖励
        this.setSeasonInfo();//赛季详情
        this.addStarAniBgNode(competitionInfo.star_max_number);//星星背景
        this.addStarAniNode(this.star_number, competitionInfo.star_max_number);//星星
        this.addArmature();//段位徽章动画
        this.playAni();

        if (competitionInfo.need_exchange_coupon) {
            this.showExchangeCoupon();
        } else {
            this.showNewSeaonTip();//新手引导
        }
        this.showSeasonOver();//赛季结算
        this.setBtns();//参赛按钮
    },

    setBtns() {
        let btns = [this.btn_paiweisai, this.btn_wangzhesai];
        for (let i = 0; i < this.session_info.length; i++) {
            let btn = btns[i];
            let info = this.session_info[i];
            btn.active = info.session_switch !== 0;
            btn.interactable = info.session_switch >= 1;

            if (info.session_type === 1) {//1.排位赛 2.王者赛
                let txt_paiwei_des = btn.getChildByName("txt_paiwei_des").getComponent(cc.Label);
                let txt_paiwei_coin = btn.getChildByName("txt_paiwei_coin").getComponent(cc.Label);
                let img_paiwei_coin = btn.getChildByName("img_paiwei_coin");
                let img_paiwei_coin_bg = btn.getChildByName("img_paiwei_coin_bg");
                let pan_paiwei_mask = btn.getChildByName("pan_paiwei_mask");
                txt_paiwei_des.string = (qf.txt.competition_nextreward + this.next_level_award);
                txt_paiwei_coin.string = ("x" + info.enter_fee);

                txt_paiwei_coin.active = (info.enter_fee > 0);
                img_paiwei_coin.active = (info.enter_fee > 0);
                img_paiwei_coin_bg.active = (info.enter_fee > 0);

                pan_paiwei_mask.active = (info.session_switch === 2);
                //pan_paiwei_mask.setSwallowTouches(false);

                btn.getChildByName("img_paiweisai").active = (info.session_switch !== 2);
                txt_paiwei_des.active = (info.session_switch !== 2);
                btn.getChildByName("img_paiwei_start").active = (info.session_switch !== 2);
                btn.getChildByName("img_paiwei_coin_bg").active = (info.session_switch !== 2);
                img_paiwei_coin.active = (info.session_switch !== 2);
                txt_paiwei_coin.active = (info.session_switch !== 2);
            } else {
                btn.interactable = false;
                let img_wangzhesai = btn.getChildByName("img_wangzhesai");
                let txt_wangzhe_des = btn.getChildByName("txt_wangzhe_des").getComponent(cc.Label);
                let img_wangzhe_start = btn.getChildByName("img_wangzhe_start");
                let img_wangzhe_mask = btn.getChildByName("img_wangzhe_mask");
                let img_wangzhe_qidai = btn.getChildByName("img_wangzhe_qidai");

                img_wangzhesai.active = (info.session_switch !== 2);
                txt_wangzhe_des.active = (info.session_switch !== 2);
                img_wangzhe_start.active = (info.session_switch !== 2);
                img_wangzhe_mask.active = (info.session_switch === 2);
                img_wangzhe_qidai.active = (info.session_switch === 2);
            }
        }
    },

    //赛季信息
    setSeasonInfo() {
        let info = qf.cache.competition.getCompetitionData();
        let txt_season_1 = this.pan_season_time.getChildByName("txt_season_1");
        let txt_season_time = this.pan_season_time.getChildByName("txt_season_time");
        let season = this.getSeason(info.season_sn);
        txt_season_1.string = cc.js.formatStr(qf.txt.season_sn, season);
        txt_season_time.string = info.season_date_range;
    },

    getSeason(num) {
        let str = "";
        if (num <= 10) {
            str = qf.txt.season_change[num];
        } else {
            let a = parseInt(num - num % 10);
            let b = parseInt(num % 10);
            let c = parseInt(a / 10);
            if (b === 0) {
                str = qf.txt.season_change[c] + qf.txt.season_change[10];
            } else {
                if (c === 1) {
                    str = qf.txt.season_change[10] + qf.txt.season_change[b];
                } else {
                    str = qf.txt.season_change[c] + qf.txt.season_change[10] + qf.txt.season_change[b];
                }
            }
        }

        return str;
    },

    //赛季奖励
    setSeasonAward() {
        if (!this.season_award) return;
        loge("赛季奖励")
        cc.log(this.season_award)

        let setData = (img, txt, data) => {
            if (data.award_type === 1) {//1.钻石 2.头像框
                img.setScale(1);
                img.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.global, qf.tex.global_diamond[4]);
                txt.getComponent(cc.Label).string = cc.js.formatStr(qf.txt.endgamelobby_reward_1[2], data.award_num);
            } else {
                img.setScale(0.70);
                txt.getComponent(cc.Label).string = qf.txt.head_frame;

                if (data.icon_frame_path) {
                    img.opacity = 0;
                    //let head = new LoadSprite(null, data.icon_frame_path);
                    // head.setPosition(img.getContentSize().width/2,img.getContentSize().height/2);
                    // img.addChild(head);
                }
            }
        }

        let img_season_reward_1 = this.pan_season_reward.getChildByName("img_season_reward_1");
        let img_season_reward_2 = this.pan_season_reward.getChildByName("img_season_reward_2");
        let txt_season_reward_1 = this.pan_season_reward.getChildByName("txt_season_reward_1");
        let txt_season_reward_2 = this.pan_season_reward.getChildByName("txt_season_reward_2");
        let txt_no_award = this.pan_season_reward.getChildByName("txt_no_award");
        let img_season_tip_2 = this.pan_season_reward.getChildByName("img_season_tip_2");
        img_season_tip_2.active = (this.curLevel < 70);
        let txt = [txt_season_reward_1, txt_season_reward_2];
        let img = [img_season_reward_1, img_season_reward_2];

        img_season_reward_1.active = true;
        img_season_reward_2.active = true;
        txt_season_reward_1.active = true;
        txt_season_reward_2.active = true;
        txt_no_award.active = false;
        img_season_reward_1.x = 273;
        txt_season_reward_1.x = 273;

        if (this.season_award.length === 1) {
            img_season_reward_2.active = false;
            txt_season_reward_2.active = false;
            if (this.season_award[0].award_num === 0) {
                txt_no_award.active = true;
                img_season_reward_1.active = false;
                txt_season_reward_1.active = false;
            } else {
                img_season_reward_1.x = 360;
                txt_season_reward_1.x = 360;

                setData(img_season_reward_1, txt_season_reward_1, this.season_award[0]);
            }
        } else {
            for (let i = 0; i < this.season_award.length; i++) {
                setData(img[i], txt[i], this.season_award[i]);
            }
        }
    },

    //新手引导
    showGuide() {
        loge("showGuide")

        if (this.guide_status > 0) return

        let sendReq = () => {
            qf.net.send({
                cmd: qf.cmd.DDZ_COMPETITION_VIEW_GUIDE, wait: false, body: { guide_type: 1, guide_status: 1 }, callback: (rsp) => {
                    qf.net.util.rspHandler(rsp, {
                        successCb: (model) => {

                        }
                    });
                }
            });
        }

        let guide3 = () => {
            let info = this.session_info[0];
            this.btn_paiweisai.interactable = info.session_switch >= 1;

            this.btn_season_wenhao.interactable = false;
            qf.event.dispatchEvent(qf.et.SHOW_GUIDE_VIEW, {
                btn: this.btn_season_wenhao,
                btnResUrl: qf.tex.competition_img_wenhao,
                isSpriteFrame: true,
                type: null,
                text: qf.txt.competition_guide[3],
                isClose: true,
                finger: false,
                fingerOffset: cc.p(-150, 20),
                showTip: true,
                closeFunc: () => {
                    sendReq();
                    this.btn_season_wenhao.interactable = true;
                },
                clickFunc: () => {
                    sendReq();
                    this.btn_season_wenhao.interactable = true;
                }
            })
        }

        let guide2 = () => {
            this.btn_paiweisai.interactable = false;
            qf.event.dispatchEvent(qf.et.SHOW_GUIDE_VIEW, {
                btn: this.btn_paiweisai,
                btnResUrl: qf.tex.competition_paiwei_bg,
                isSpriteFrame: true,
                type: null,
                text: qf.txt.competition_guide[2],
                isClose: true,
                finger: false,
                fingerOffset: cc.p(-150, -30),
                showTip: true,
                closeFunc: () => {
                    sendReq();
                    guide3();
                },
                clickFunc: () => {
                    sendReq();
                    guide3();
                }
            })
        }

        let guide1 = () => {
            qf.event.dispatchEvent(qf.et.SHOW_GUIDE_VIEW, {
                btn: this.pan_level_mask,
                btnResUrl: qf.tex.competition_level_mask,
                isSpriteFrame: true,
                type: null,
                text: qf.txt.competition_guide[1],
                isClose: true,
                finger: false,
                fingerOffset: cc.p(50, 40),
                showTip: true,
                closeFunc: () => {
                    sendReq();
                    guide2();
                },
                clickFunc: () => {
                    sendReq();
                    guide2();
                }
            })
        }

        guide1();
    },

    //星星背景节点
    addStarAniBgNode(num) {
        // if(this.curLevel >= 70) return;
        //
        // let pos = this.star_pos[num];
        // ccs.armatureDataManager.addArmatureFileInfo(qf.tex.aniEventGameOverJson_1);
        // for(let i=0;i<num;i++){
        //     let armature = new ccs.Armature("NewAnimationduanwei24");
        //     this.star_bg.push(armature);
        //     this.armNode.addChild(armature,200);
        //     armature.setPosition(pos[i]);
        //     armature.active = (false);
        //     this.star_bg_aniName.push("Animation1xingxingdi");
        // }
    },

    //星星动画节点
    addStarAniNode(num, maxNum) {
        // let pos = this.star_pos[maxNum];
        //
        // if(this.curLevel >= 70){
        //     let wangzhe_star = new cc.Sprite();
        //     wangzhe_star.initWithSpriteFrameName(qf.tex.competition_wangzhe_xing);
        //     this.armNode.addChild(wangzhe_star,200);
        //     wangzhe_star.setPositionY(92);
        // }else {
        //     ccs.armatureDataManager.addArmatureFileInfo(qf.tex.aniEventGameOverJson_1);
        //     for(let i=0; i<num; i++){
        //         let armature = new ccs.Armature("NewAnimationduanwei24");
        //         this.star_star.push(armature);
        //         this.armNode.addChild(armature,200);
        //         armature.setPosition(pos[i]);
        //         armature.active = (false);
        //         this.star_star_aniName.push("Animation4yiyouxing");
        //     }
        // }
    },

    showExchangeCoupon() {
        qf.event.dispatchEvent(qf.ekey.SHOW_COMPETITION_EXCHANGE_COUPON, { cb: this.showNewSeaonTip.bind(this) });
    },

    showNewSeaonTip() {
        this.showCount++;
        if (this.showCount === 2) {
            this.showGuide();
        }
    },

    //显示赛季结算
    showSeasonOver() {
        let info = qf.cache.competition.getSettleInfo();
        if (!info) return;

        qf.event.dispatchEvent(qf.et.SHOW_COMPETITION_SEASON_OVER_DIALOG);
    },


    showEventRewardDialog() {
        // function eventRewardModule() {
        //     this.closeEventRewardDialog();
        //     this.eventReward = new EventRewardDialog(args);
        //     this.addChild(this.eventReward, 10000);
        //     this.eventReward.showDialog();
        // }
        // ModuleManager.checkPreLoadModule({callback: eventRewardModule, loadResName: "eventreward"});
    },

    addArmature(key) {
        return

        let armature = qf.utils.createArmatureAnimation(this.armNode, {
            dragonAsset: qf.res.aniEventGameOver_ske,
            dragonAtlasAsset: qf.res.aniEventGameOver_tex,
            armatureName: "armatureName",
        }, () => {
            //armature.node.removeComponent(dragonBones.ArmatureDisplay);
        });

        this.armatures.push(armature);
        armature.node.active = false;
    },

    playAni(aniNames) {
        return

        if (aniNames.length <= 0) return;

        let animationEvent = (armatureBack, movementType, movementID) => {
            if (movementType === ccs.MovementEventType.complete) {
                let aniName = aniNames[0];
                aniNames.shift();
                this.armatures.shift();
                if (aniNames.length > 0) {
                    this.playAni(aniNames);
                } else {
                    //添加蓝色底框
                    let spriteBg = this.img_bg.getChildByName("spriteBg");
                    if (spriteBg) {
                        spriteBg.removeFromParent();
                        spriteBg = null;
                    }
                    spriteBg = new cc.Sprite();
                    spriteBg.initWithSpriteFrameName(qf.txt.competition_landibg);
                    this.img_bg.addChild(spriteBg);
                    spriteBg.setName("spriteBg");
                    spriteBg.setPosition(cc.p(360, 700));
                }

            }
        }

        let aniName = aniNames[0];
        let levelFlag;
        if (aniName === this.ANI_NAME.zkxz) {
            levelFlag = this.curLevel;
            let segTitleSpr = null;
            let levelRes = "#" + qf.tex.result_level_res[levelFlag];
            if (levelRes) {
                //segTitleSpr = new dragonBones.SkinData(levelRes);
            }
            let level = this.danGrading;

            // let segTitleBgSpr = new dragonBones.SkinData("#" + qf.tex.result_seg_res[level][0]);
            // let leftWingSpr = new dragonBones.SkinData("#" + qf.tex.result_seg_res[level][1]);
            // let rightWingSpr = new dragonBones.SkinData("#" + qf.tex.result_seg_res[level][2]);
            // let segFrameSpr = new dragonBones.SkinData("#" + qf.tex.result_seg_res[level][3]);

            //     let bone = this.armatures[0].getBone("jiesuan_zuanshi_kuang");
            //     bone.addDisplay(segFrameSpr, 1);
            //     bone.changeDisplayWithIndex(1, true);
            //
            //     let bone = this.armatures[0].getBone("jiesuan_zuanshi_chibang1");
            //     bone.addDisplay(leftWingSpr, 1);
            //     bone.changeDisplayWithIndex(1, true);
            //
            //     let bone = this.armatures[0].getBone("jiesuan_zuanshi_chibang2");
            //     bone.addDisplay(rightWingSpr, 1);
            //     bone.changeDisplayWithIndex(1, true);
            //
            //     let bone = this.armatures[0].getBone("jiesuan_zuanshi_biaoqian");
            //     bone.addDisplay(segTitleBgSpr, 1);
            //     bone.changeDisplayWithIndex(1, true);
            //
            //     let bone = this.armatures[0].getBone("jiesuan_zuanshi_biaoqian1");
            //     if (segTitleSpr) {
            //         bone.addDisplay(segTitleSpr, 1);
            //         bone.changeDisplayWithIndex(1, true);
            //     }
            // }
            //
            // this.armatures[0].active = (true);
            // this.armatures[0].getAnimation().setMovementEventCallFunc(animationEvent);
            // this.armatures[0].getAnimation().play(aniName, -1, 0);

        }
    },

    showExitCompetition() {
        loge("打开退赛兑换");
    },

    // updateHighLevelData(model) {
    //     if (!model) return;
    //     let highLevelMatchInfo = model.highLevelMatchInfo;
    //     if (!highLevelMatchInfo.high_level_desc) highLevelMatchInfo.high_level_desc = "";
    //     this.lblHighLevelTips.string = (highLevelMatchInfo.high_level_desc);
    //     this.lblHighLevelTips.active = (highLevelMatchInfo.can_join === 0);
    //
    //     if (model.check) {
    //         if (highLevelMatchInfo.can_join === 0) {
    //             qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.txt.highLevelMatchTips });
    //         } else {
    //             this.startMatch();
    //         }
    //     }
    // },
    //开始比赛
    startMatch() {
        this.enterEventDesk();
        let matchLevel = qf.cache.competition.getMatchLevel();
        qf.platform.uploadEventStat({
            "module": "performance",
            "event": qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_MATCH_CLICK_WAIT,
            "value": 1,
            "custom": matchLevel,
        });
    },

    enterEventDesk() {
        let roomId = 0;
        let body = {
            room_id: roomId,
            desk_id: 0,
            entry_type: 0,
            start_type: qf.const.GAME_START_TYPE.NORMAL,
            just_view: 0,
            desk_mode: qf.const.DESK_MODE_EVENT,
            show_multi: 0,
            is_match: 1,
        };


        let reqEnterEventDesk = (args) => {
            qf.event.dispatchEvent(qf.ekey.NET_INPUT_REQ, { body: args });
        };

        //检查是否有未完成对局后在创建房间
        qf.event.dispatchEvent(qf.ekey.ROOM_CHECK, {
            roomid: roomId,
            data: body,
            roomCheckCallBack: reqEnterEventDesk
        });
    },


    onClickExit() {
        loge("退出")
        qf.mm.show("main", null, true);
    },

    onClickExchange() {
        loge("兑换")

    },

    onClickRank() {
        loge("排行榜")
    },

    onClickPaiweisai() {
        loge("排位赛")
        qf.event.dispatchEvent(qf.ekey.CHECK_IF_CAN_JOIN_MATCH, { check: true });
    },

    onClickWangzhesai() {
        loge("王者赛")
    },

    onClickRule() {
        loge("规则")
    },

    onClickExitCompetition() {
        loge("退赛兑换")
        qf.event.dispatchEvent(qf.ekey.EXIT_COMPETITION_REQ);
    },

    onClickCoin() {
        loge("金币")
    },

    onClickVoucher() {
        loge("奖券")
    },

    onClickUseLevelCard() {
        loge("使用等级卡")
        qf.event.dispatchEvent(qf.ekey.BACKPACK_LEVEL_CARD_REQ);
    },

    playAction(type) {
        let absActionDistance = Math.abs(this.actionDistance);

        if (type === qf.const.INOUT_TYPE.IN) {

            this.panelMain.runAction(cc.sequence(
                cc.callFunc(() => {
                    this.panelMask.active = true;
                    //this.panelMask.setTouchEnabled(true);
                }),
                cc.moveBy(this.actionTime, cc.p(absActionDistance, 0)),
                cc.callFunc(() => {
                    this.panelMask.active = false;
                    //this.panelMask.setTouchEnabled(false);
                    this.showNewSeaonTip();
                })));

            this.panelTop.runAction(cc.moveBy(this.actionTime, cc.p(0, this.actionDistance)));
            this.panelBottom.runAction(cc.moveBy(this.actionTime, cc.p(0, absActionDistance)));

        } else if (type === qf.const.INOUT_TYPE.OUT) {

            this.panelMain.runAction(cc.moveBy(this.actionTime, cc.p(this.actionDistance, 0)));

            this.panelTop.runAction(cc.moveBy(this.actionTime, cc.p(0, absActionDistance)));
            this.panelBottom.runAction(cc.moveBy(this.actionTime, cc.p(0, this.actionDistance)));
        }
    },

    onGoldChange(params) {
        this.lblCoin.string = qf.utils.getFormatNumber(params.gold);
    },

    onTicketChange(params) {
        this.lblVoucher.string = qf.utils.getFormatNumber(params.ticket);
    },
});