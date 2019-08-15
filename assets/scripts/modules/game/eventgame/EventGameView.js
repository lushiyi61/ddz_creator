/*赛事*/
let NormalGameView = require("../normalgame/NormalGameView");
cc.Class({
    extends: NormalGameView,

    properties: {
        TAG: {
            override: true,
            default: "EventGameView",
        },

    },

    init(parameters) {
        this._super(parameters);

        this.btn_task.active = false;

        // this.btn_win_streak.setVisible(false);
        // this.btn_mult.setVisible(false);
        // this.pan_mult_msg.setVisible(false);

        //this.initComponentEvent();
    },

    //override 创建用户组件
    createLordUser(index) {
        var node = cc.find("pan_user" + index, this.root);
        let lordUser = node.addComponent("EventLordUser");
        lordUser.index = index;
        lordUser.onLoad();
        return lordUser;
    },

    //override
    initButtonManager(node) {
        this.BM = node.addComponent("EventButtonManager");  //除托管按钮外，其他的按钮都在ui中，且在pm的下层
    },

    //override 初始化不同类型牌桌按钮
    initBtnOtherDif() {
        this.panelBottom.setVisible(false);
        this.panelEventBottom.setVisible(true);

        this.btnEventRecord = cc.find("panel_event_bottom/btn_event_record", this.root);
        this.btnEventRecord.interactable = true;
        this.btnEventRecord.node.on(cc.Node.EventType.TOUCH_END, this.onClickEventRecord.bind(this));

        this.btnEventAvtivity.interactable = true;
        this.btnEventAvtivity.node.on(cc.Node.EventType.TOUCH_END, this.onClickEventAvtivity.bind(this));
    },

    onClickEventRecord() {
        qf.event.dispatchEvent(qf.ekey.OPEN_ROUND_DETAIL_DIALOG);
    },

    onClickEventAvtivity() {
        // function eventGameActivityModule() {
        //     //赛事活动
        //     qf.event.dispatchEvent(qf.ekey.OPEN_VIEW_DIALOG, {name: "eventgameactivity"});
        // }
        //
        // ModuleManager.checkPreLoadModule({callback: eventGameActivityModule, loadResName: "eventgameactivity"});
    },

    setMatchingShow(visible, enterUin) {
        let user = qf.cache.desk.getOnDeskUserByUin(qf.cache.user.uin);
        if (visible) {
            // //打开赛事匹配界面
            // qf.rm.checkLoad("event_match",()=>{
            //     qf.mm.show("event_match", null, true);
            // })
        }
        else {
            //qf.mm.remove("event_match");

            qf.cache.global.setStatUploadTime(qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_MATCH_WAIT_SUCC_TIME);
            qf.platform.uploadEventStat({
                "module": "performance",
                "event": qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_MATCH_WAIT_SUCC,
                "value": 1,
                "custom": user.match_level,
            });
        }

        let controller = qf.mm.get("event_match");
        let match_view = controller.view;
        if (match_view) {
            match_view.refreshUI(enterUin);
        }
    },

    //override 更新菜单项依据主动托管是否显示
    updateMenuIdsByAutoPlayShow(idArr, isBtnAutoPlayVisible) {
        return idArr;
    },

    //override
    setCurJu() {
        this.setTypeInfo();
    },

    //override 设置底纹信息
    setTypeInfo(typeInfo) {
        let typeStr = qf.cache.desk.getDeskName();
        let baseScore = qf.cache.desk.getMaxGrabAction();
        if (!baseScore || baseScore <= 0) {
            baseScore = qf.cache.desk.getBaseScore();
        }
        //底分
        let scoreStr = baseScore;
        let curRound = qf.cache.desk.getCurRound() || 0;
        curRound = curRound + 1;
        let curRoundStr = cc.js.formatStr(qf.txt.cur_round_txt, curRound);

        let serverStr = " ";

        this.txtPlayWay.getComponent(cc.Label).string = typeStr + "   " + curRoundStr;
        this.txtScore.getComponent(cc.Label).string = scoreStr;
        this.txtServer.getComponent(cc.Label).string = serverStr;
        this.txtCapping.getComponent(cc.Label).string = curRoundStr;
    },

    showSpringAnimation() {
        let resultInfo = qf.cache.desk.getResultInfo();
        if (resultInfo.over_flag === qf.const.RESULT_OVER_FLAG.TRUE) {
            return this._super();
        }
        return 0;
    },

    //添加结算弹窗
    addGameOver() {
        let resultInfo = qf.cache.desk.getResultInfo();
        let res;
        if (resultInfo.is_winner === 0) {
            qf.music.playMyEffect("fail", false);
            res = qf.tex.table_you_lose;
        } else {
            qf.music.playMyEffect("victory", false);
            res = qf.tex.table_you_win;
        }

        if (resultInfo.over_flag === qf.const.RESULT_OVER_FLAG.TRUE) {
            qf.rm.checkLoad("eventgameover", () => {
                if (resultInfo.cur_level >= qf.const.MATCH_LEVEL.WANGZHE) {
                    qf.event.dispatchEvent(qf.ekey.OPEN_VIEW_DIALOG, { name: "event_wangzhe_share" });
                } else {
                    qf.event.dispatchEvent(qf.ekey.OPEN_VIEW_DIALOG, { name: "event_game_over" });
                }
            })
        } else {
            this.showOnePairEndAnimation(res);
        }
    },

    showOnePairEndAnimation(res) {
        this.img_you_result.runAction(cc.sequence(
            cc.callFunc((sender) => {
                sender.position = this.pos_you_result;
                sender.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.table, res),
                    sender.active = true;
            }),
            cc.moveBy(0.8, 0, -400),
            cc.delayTime(1),
            cc.callFunc((sender) => {
                sender.active = false;
            })
        ));
    },

    //显示结算动画
    showGameOverAnimation() {

    },

    //override
    exitBtnFun() {
        qf.event.dispatchEvent(qf.ekey.LORD_NET_EXIT_DESK_REQ);
    },

    //最后一副牌自动打出
    setAutoLastCards(rsp) {
        this.getButtonManager().hideAllBtns();
        this.PM.setLastCardsAuto();
    },
    //override 一副牌结束后清除托管
    clearRobot(uin, isAllOver) {
        if (isAllOver)
            this._super(uin, isAllOver);
    },

    //初始化加倍文字动画ui
    initMultiRunTxt() {
        this.panelMultiRunTxt = cc.find("panel_multi_run_txt", this.root);
        this.imgMultiDeng = this.panelMultiRunTxt.getChildByName("img_multi_deng");
        this.imgMultiDai = this.panelMultiRunTxt.getChildByName("img_multi_dai");
        this.imgMultiNong = this.panelMultiRunTxt.getChildByName("img_multi_nong");
        this.imgMultiMing = this.panelMultiRunTxt.getChildByName("img_multi_ming");
        this.imgMultiJia = this.panelMultiRunTxt.getChildByName("img_multi_jia");
        this.imgMultiBei = this.panelMultiRunTxt.getChildByName("img_multi_bei");
        this.imgMultiEllipsis1 = this.panelMultiRunTxt.getChildByName("img_multi_shengluehao_1");
        this.imgMultiEllipsis2 = this.panelMultiRunTxt.getChildByName("img_multi_shengluehao_2");
        this.imgMultiEllipsis3 = this.panelMultiRunTxt.getChildByName("img_multi_shengluehao_3");

        this.runMultiTxtAction();
    },

    //跑等待农民加倍文字动画
    runMultiTxtAction() {
        let txtArr = [
            this.imgMultiDeng,
            this.imgMultiDai,
            this.imgMultiNong,
            this.imgMultiMing,
            this.imgMultiJia,
            this.imgMultiBei,
            this.imgMultiEllipsis1,
            this.imgMultiEllipsis2,
            this.imgMultiEllipsis3,
        ];

        let i = -1;

        let runMultiTxtFunc = () => {
            i++;
            let v = txtArr[i];

            v.runAction(
                cc.sequence(
                    cc.moveBy(this.RUNMULTITXTTIME, cc.v2(0, this.RUNMULTITXTDISTANCE)),
                    cc.moveBy(this.RUNMULTITXTTIME, cc.v2(0, -this.RUNMULTITXTDISTANCE))
                )
            );

            if (i === txtArr.length - 1)
                i = -1;
        }

        this.schedule(runMultiTxtFunc, this.RUNMULTITXTTIME);
    },

    updateResultValue() {
        let resultInfo = qf.cache.desk.getResultList();
        for (let k in resultInfo) {
            let v = resultInfo[k];
            let u = this.getUser(v.uin);
            if (u) {
                u.updateResultValue(v.score);
            }
        }
    },

    //设置等待农民加倍显示与否
    setWaitMultiShow(visible) {
        this.panelMultiRunTxt.active = visible;
    },

    enterUser(uin) {
        if (uin === qf.cache.user.uin) {

            this.beforeChangDesk();
            //qf.music.playBackGround(qf.res.lord_music.fightbgm);
        }

        let userList = qf.cache.desk.getUserList();
        this.updateMeIndex(userList);
        for (let uin in userList) {
            let v = userList[uin];
            this.getUser(v.uin).update(v.uin);

            if (v.status !== qf.const.UserStatus.USER_STATE_INGAME) {
                let u = qf.cache.desk.getUserByUin(v.uin);
                this.getUser(v.uin).setDefaultHead(u);
            }
        }
    },
});