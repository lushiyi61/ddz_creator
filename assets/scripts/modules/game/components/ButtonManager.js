/**
 * 牌桌内按钮管理器
 * 纯客户端管理器
 * 与网络无关，故可以注册事件，且事件会随着对象的回收而消失
 */
cc.Class({
    extends: cc.Component,

    properties: {
        TAG: "ButtonManager",
    },

    onLoad() {
        this.desk_mode = qf.cache.desk.desk_mode;

        this.init();

        this.multiple = 1;
    },

    init() {
        logd(" --- ButtonManager init --- ", this.TAG);
        this.btnBegin = [];
        this.btnOver = [];
        this.btnChangeTable = [];
        this.btnCall = [];
        this.btnOper = [];
        this.btnDouble = [];
        this.btnShowCard = [];

        this.isBtnShow = qf.const.OPER_BTN_STAUTS.SHOW;
        this.isBtnUnShow = qf.const.OPER_BTN_STAUTS.UNSHOW;
        this.isBtnUnAble = qf.const.OPER_BTN_STAUTS.UNABLE;

        this.panelBegin = cc.find("panel_begin", this.node);
        this.panelCallScore = cc.find("panel_call_score", this.node);
        this.panelEventCallScore = cc.find("panel_event_call_score", this.node);
        this.panelOver = cc.find("panel_over", this.node);
        this.lblSuperDblCard = cc.find("btn_super_double/img_super_double_dot/txt_super_double_num", this.node);

        this.initAllButtons();

        this.btns_arr = [
            this.btnBegin,
            this.btnOver,
            this.btnOper,
            this.btnCall,
            this.btnDouble,
            this.btnChangeTable,
            this.btnShowCard
        ];

        this.initOtherDif();
    },

    initOtherDif() {
        this.panelBegin.active = true;
        this.panelCallScore.active = true;
        this.panelEventCallScore.active = false;
        this.panelOver.active = true;
        this.initCallButtons();
    },

    initAllButtons() {
        this.initBeginButtons();
        this.initOverButtons();
        this.initChangeTableButtons();
        this.initOperButtons();
        this.initDoubleButtons();
        this.initShowCardButton();
    },

    // 通用回调
    normalCallback(start_type, show_multi) {
        let goldLimitCallback = () => {
            this.hideAllBtns();
            qf.event.dispatchEvent(qf.ekey.NET_USER_READY_REQ, { start_type: start_type, show_multi: show_multi });
            qf.event.dispatchEvent(qf.ekey.UPDATE_CHANGE_TABLE_BUTTONS);
        };
        let deskMode = qf.cache.desk.getDeskMode();
        if (deskMode === qf.const.DESK_MODE_NORMAL) {
            qf.event.dispatchEvent(qf.ekey.EVT_CHECK_GOLD_ENOUGH_INGAME, {
                data: {},
                goldLimitCallback: goldLimitCallback
            });
        }
        else {
            goldLimitCallback();
        }
    },

    initBeginButtons() {
        let name = ["btn_begin_mingpai", "btn_begin_normal"];
        for (let k in name) {
            let v = name[k];
            let node = cc.find(v, this.panelBegin);
            this.btnBegin[k] = node.addComponent("GButton");
            this.btnBegin[k].show();    //show一次为了激活组件
            this.btnBegin[k].hide();
        }

        qf.utils.addTouchEvent(this.btnBegin[0].node, e => {
            this.normalCallback(qf.const.GAME_START_TYPE.SHOW, 5).bind(this);
        });

        qf.utils.addTouchEvent(this.btnBegin[1].node, e => {
            this.normalCallback(qf.const.GAME_START_TYPE.NORMAL, 1).bind(this);
        });
    },

    initOverButtons() {
        let name = ["btn_over_detail", "btn_start_game"];
        for (let k in name) {
            let v = name[k];
            let node = cc.find(v, this.panelOver);
            this.btnOver[k] = node.addComponent("GButton");
            this.btnOver[k].show();//show一次为了激活组件
            this.btnOver[k].hide();
        }

        qf.utils.addTouchEvent(this.btnOver[0].node, () => {
            qf.event.dispatchEvent(qf.ekey.SHOW_CLASSIC_OVER_DIALOG);
            this.hideAllBtns();
        });

        qf.utils.addTouchEvent(this.btnOver[1].node, () => {
            this.normalCallback(qf.const.GAME_START_TYPE.NORMAL, 1).bind(this);
        });

    },

    initChangeTableButtons() {
        let name = ["btn_change_tabel"];
        for (let k in name) {
            let v = name[k];
            let node = cc.find(v, this.panelBegin);
            this.btnChangeTable[k] = node.addComponent("GButton");
            this.btnChangeTable[k].show();//show一次为了激活组件
            this.btnChangeTable[k].hide();
        }

        qf.utils.addTouchEvent(this.btnChangeTable[0].node, () => {
            let goldLimitCallback = () => {
                qf.event.dispatchEvent(qf.ekey.LORD_REQUEST_USER_CHANGE_DESK); //换桌
            };

            qf.event.dispatchEvent(qf.ekey.EVT_CHECK_GOLD_ENOUGH_INGAME, {
                data: {},
                goldLimitCallback: goldLimitCallback
            });
        });
    },

    initCallButtons(num) {
        this.btnCall = [];
        let name = ["btn_call", "btn_not_call"];

        for (let k in name) {
            let v = name[k];
            let node = cc.find(v, this.panelCallScore);
            this.btnCall[k] = node.addComponent("GButton");
            this.btnCall[k].show();//show一次为了激活组件
            this.btnCall[k].hide();
        }

        qf.utils.addTouchEvent(this.btnCall[0].node, () => {
            callback(qf.cache.desk.getMaxGrabAction() || 0);
        });

        qf.utils.addTouchEvent(this.btnCall[1].node, () => {
            callback(0);
        });

        let callback = score => {
            this.hideAllBtns();
            qf.event.dispatchEvent(qf.ekey.LORD_NET_CALL_POINT_REQ, { score: score });
            qf.cache.desk.setIsMySelfOperated(true);
        }
    },

    initOperButtons() {
        let name = ["btn_buchu",
            "btn_tishi",
            "btn_chupai",
            "btn_yao_buqi",
            "btn_chupai_lord",      //地主第一次出牌按钮
            "btn_showcard_lord",    //地主第一次出牌明牌按钮
            "btn_chupai_mid"        //地主第一次出牌 已明牌时 出牌按钮
        ];

        let resPath;
        let btnCall;
        for (let key in name) {
            let value = name[key];

            let node = cc.find(value, this.node);
            if (!qf.utils.isValidType(node)) continue;

            if (qf.func.checkint(key) === 0) {
                resPath = qf.tex.lord_land_res.buchu;
                btnCall = () => {
                    this.hideAllBtns();
                    this.node.emit(qf.ekey.DDZ_BM_DONTSENDCARD);
                    qf.cache.desk.setIsMySelfOperated(true);
                }
            } else if (qf.func.checkint(key) === 1) {
                btnCall = () => {
                    this.node.emit(qf.ekey.DDZ_BM_PMPROMIT);
                }
            } else if (qf.func.checkint(key) === 2 || qf.func.checkint(key) === 4 || qf.func.checkint(key) === 6) {
                resPath = qf.tex.lord_land_res.chupai;
                btnCall = () => {
                    this.hideAllBtns();
                    this.node.emit(qf.ekey.DDZ_BM_SENDCARD);
                    qf.cache.desk.setIsMySelfOperated(true);
                }
            } else if (qf.func.checkint(key) === 3) {
                btnCall = () => {
                    this.hideAllBtns();
                    this.node.emit(qf.ekey.DDZ_BM_DONTSENDCARD);
                    qf.cache.desk.setIsMySelfOperated(true);
                    this.node.emit(qf.ekey.DDZ_BM_SETOTHERSHOW, false);
                }
            } else if (qf.func.checkint(key) === 5) {
                btnCall = () => {
                    qf.net.send({
                        cmd: qf.cmd.DDZ_LAND_LORDSHOWCARD_REQ,
                        callback: (rsp) => {
                            if (rsp.ret === 0) {
                                this.node.emit(qf.ekey.DDZ_BM_UPDATEOPEBTN);
                            }
                        }
                    })
                }
            }

            this.btnOper[key] = node.addComponent("GButton");
            this.btnOper[key].setResPath(resPath);
            this.btnOper[key].show();//show一次为了激活组件
            this.btnOper[key].hide();

            qf.utils.addTouchEvent(this.btnOper[key].node, btnCall);
        }

    },

    initDoubleButtons() {
        let name = ["btn_double", "btn_super_double", "btn_not_double"];

        for (let k in name) {
            let v = name[k];
            let node = cc.find(v, this.node);
            this.btnDouble[k] = node.addComponent("GButton");
            this.btnDouble[k].show();//show一次为了激活组件
            this.btnDouble[k].hide();
        }

        qf.utils.addTouchEvent(this.btnDouble[0].node, (sender) => {
            if (!sender.active) return;
            callback(1);
        });

        qf.utils.addTouchEvent(this.btnDouble[1].node, (sender) => {
            if (!sender.active) return;
            if (qf.cache.desk.getSuperDoubleCardInfo().counts > 0) {
                callback(2);
            } else {
                qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.txt.noSuperDoubleCard });
            }
        });

        qf.utils.addTouchEvent(this.btnDouble[2].node, (sender) => {
            if (!sender.active) return;
            callback(0);
        });

        let callback = is_multi => {
            this.hideAllBtns();
            qf.event.dispatchEvent(qf.ekey.LORD_NET_MUTI_REQ, { is_muti: is_multi });
            qf.cache.desk.setIsMySelfOperated(true);
        }
    },

    initShowCardButton() {
        let name = ["btn_showcard"];

        for (let k in name) {
            let v = name[k];
            let node = cc.find(v, this.node);
            this.btnShowCard[k] = node.addComponent("GButton");
            this.btnShowCard[k].show();//show一次为了激活组件
            this.btnShowCard[k].hide();
        }

        qf.utils.addTouchEvent(this.btnShowCard[0].node, (sender) => {
            if (!sender.active) return;
            this.hideAllBtns();
        });
    },

    showBtn(btnTable) {
        for (let k in btnTable) {
            let v = btnTable[k];
            v.show();
        }
    },

    hideBtn(btnTable) {
        for (let k in btnTable) {
            let v = btnTable[k];
            v.hide();
        }
    },

    //更新开始按钮状态
    updateBeginBtns() {
        this.showBtn(this.btnBegin);
        this.hideBtn(this.btnOver);
        this.hideBtn(this.btnOper);
        this.hideBtn(this.btnCall);
        this.hideBtn(this.btnDouble);
        this.hideBtn(this.btnShowCard);
        this.checkChangeTableBtns();
    },

    //更新结算按钮状态
    updateOverBtns() {
        this.hideBtn(this.btnBegin);
        this.showBtn(this.btnOver);
        this.hideBtn(this.btnOper);
        this.hideBtn(this.btnCall);
        this.hideBtn(this.btnDouble);
        this.hideBtn(this.btnShowCard);
    },

    //查询是否有换桌按钮
    checkChangeTableBtns() {

    },

    //更新换桌按钮
    updateChangeTableBtns(isVisible) {
        if (isVisible) {
            this.showBtn(this.btnChangeTable);
        } else {
            this.hideBtn(this.btnChangeTable);
        }
    },

    //查询是否有开始按钮
    checkBeginBtns() {

    },

    //更新叫分按钮状态
    updateCallBtns(callPoint) {
        if (qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin))
            return;

        this.hideBtn(this.btnBegin);
        this.hideBtn(this.btnOver);
        this.hideBtn(this.btnOper);
        this.showBtn(this.btnCall);
        this.hideBtn(this.btnDouble);
        this.hideBtn(this.btnShowCard);

        this.updateCallDif(callPoint);
        this.node.emit(qf.ekey.DDZ_BM_SETCOUNTDOWNPOS, this.btnCall.length);
    },

    //更新叫分按钮状态
    updateCallDif(callPoint) {
        if (callPoint > 0) {
            this.btnCall[0].updateRes(qf.tex.lord_land_res.grab[0]);
            this.btnCall[1].updateRes(qf.tex.lord_land_res.grab[1]);
        } else {
            this.btnCall[0].updateRes(qf.tex.lord_land_res.call[0]);
            this.btnCall[1].updateRes(qf.tex.lord_land_res.call[1]);
        }
    },

    //更新不要，提示，出牌 要不起 按钮状态
    updateOperBtns(paras) {
        if (qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin))
            return;

        this.hideAllBtns();

        let param = [];
        if (paras) {
            param = paras;
        }

        if (param.length <= 0) {
            for (let k in this.btnOper) {
                let v = this.btnOper[k];
                v.show();
            }
            this.btnOper[3].hide();
            return;
        }

        for (let k in param) {
            let v = param[k];
            if (v[1] === this.isBtnShow) {
                this.btnOper[v[0]].show();
            } else if (v[1] === this.isBtnUnShow) {
                this.btnOper[v[0]].hide();
            } else if (v[1] === this.isBtnUnAble) {
                this.btnOper[v[0]].show();
                this.btnOper[v[0]].close();
            }
        }
        this.node.emit(qf.ekey.DDZ_BM_SETCOUNTDOWNPOS, qf.const.CountDownNum.THREE);
    },

    //更新加倍，不加倍按钮状态
    updateDoubleBtns() {
        if (qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin))
            return;

        this.hideBtn(this.btnBegin);
        this.hideBtn(this.btnOver);
        this.hideBtn(this.btnOper);
        this.hideBtn(this.btnCall);
        this.showBtn(this.btnDouble);
        this.hideBtn(this.btnShowCard);

        if (this.desk_mode && this.desk_mode !== qf.const.DESK_MODE_NORMAL) {
            this.btnDouble[1].hide();
            this.btnDouble[0].node.x = -110;
            this.btnDouble[2].node.x = 120;
            this.node.emit(qf.ekey.DDZ_BM_SETCOUNTDOWNPOS, qf.const.CountDownNum.TWO);
        } else {
            this.node.emit(qf.ekey.DDZ_BM_SETCOUNTDOWNPOS, qf.const.CountDownNum.THREE);
        }

        // 更新超级加倍卡数量
        this.lblSuperDblCard.getComponent(cc.Label).string = qf.cache.desk.getSuperDoubleCardInfo().counts || "0";
    },

    //更新明牌按钮状态
    updateShowCardBtn(multiple) {
        this.hideBtn(this.btnBegin);
        this.hideBtn(this.btnOver);
        this.hideBtn(this.btnOper);
        this.hideBtn(this.btnCall);
        this.hideBtn(this.btnDouble);
        this.showBtn(this.btnShowCard);

        this.multiple = multiple;

        if (this.multiple === qf.const.SHOW_CARD_MULTIPLE.TWO) this.btnShowCard[0].updateRes(qf.tex.showCardMultiple2);
        if (this.multiple === qf.const.SHOW_CARD_MULTIPLE.THREE) this.btnShowCard[0].updateRes(qf.tex.showCardMultiple3);
        if (this.multiple === qf.const.SHOW_CARD_MULTIPLE.FOUR) this.btnShowCard[0].updateRes(qf.tex.showCardMultiple4);

        qf.utils.addTouchEvent(this.btnShowCard[0].node, e => {
            if (!e.target.active) return;
            this.hideAllBtns();
            this.node.emit(qf.ekey.DDZ_BM_UPDATEMULTI, false);
            qf.event.dispatchEvent(qf.ekey.DDZ_SHOW_CARD_REQ, { show_multi: this.multiple });
            qf.cache.desk.setIsMySelfOperated(true);
        });
    },

    //隐藏所有按钮
    hideAllBtns() {
        this.hideBtn(this.btnBegin);
        this.hideBtn(this.btnOver);
        this.hideBtn(this.btnOper);
        this.hideBtn(this.btnCall);
        this.hideBtn(this.btnDouble);
        this.hideBtn(this.btnShowCard);
    },
})