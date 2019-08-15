
/*
主界面控制器
*/

let Controller = require("../../frameworks/mvc/Controller");
cc.Class({
    extends: Controller,

    ctor() {

    },

    //初始化全局事件监听
    initGlobalEvent() {
        //流量主需求
        qf.event.addEvent(qf.ekey.GET_USER_AD_INFO_REQ, this.getUserAdInfoReq, this);
        //小红点推送
        qf.event.addEvent(qf.ekey.DDZ_RED_DOT_NOTIFY, this.onRedDotNotify, this);
        //通知记牌器信息
        qf.event.addEvent(qf.ekey.DDZ_CARD_COUNTER_INFO_NOTIFY, this.onCardCounterInfoNotify, this);
    },

    //控制器事件，随着主view销毁而销毁
    initModuleEvent() {

    },

    initView(params) {
        let prefab = cc.loader.getRes(qf.res.prefab_main);
        let script = cc.instantiate(prefab).getComponent("MainView");
        script.init(params);
        return script;
    },

    show(params) {
        this._super(params);

        this.view.playAction(qf.const.INOUT_TYPE.IN);

        qf.rm.checkLoad("broadcast", () => {
            qf.mm.get("broadcast").show();
            qf.event.dispatchEvent(qf.ekey.IS_SHOW_BROADCAST, { isShow: true });
        });
    },

    updateCounterInfo(param) {
        this.view.updateCounterInfo(param);
    },
    //通知小红点
    onRedDotNotify(rsp) {
        if (rsp && rsp.model) {
            qf.cache.redDotConfig.updateRedDot(rsp.model.red_dot_msg);
        }
    },
    //通知记牌器信息变化
    onCardCounterInfoNotify(rsp) {
        cc.error("onCardCounterInfoNotify== ", rsp);
        
        if (rsp.model) {
            qf.cache.config.updateCardCounterInfo(rsp.model);
        }
    },

    //流量主
    getUserAdInfoReq(rsp) {
        let self = this;
        let type = 0;
        let button = false;
        let outMain = false;
        let over = 0;

        if (rsp) {
            type = rsp.type ? rsp.type : 0;
            if (rsp.button) button = true;
            if (rsp.outMain) outMain = true;
        }

        if (type === qf.const.FLOWMAIN_TYPE.OVER) {
            type = qf.const.FLOWMAIN_TYPE.GET;
            over = qf.const.FLOWMAIN_TYPE.OVER;
        }

        //req_type  0:普通查询 1:普通领取奖励 2:分享领取
        qf.net.send({
            cmd: qf.cmd.USER_AD_INFO_REQ
            , body: { req_type: type }
            , callback: (rsp)=>{
                qf.net.util.rspHandler(rsp, {
                    successCb: (model)=>{
                        if (!model) return;
                        if (self.getView()) {
                            qf.cache.config.updateVedioAdInfo(model, button, outMain);
                            if (over === qf.const.FLOWMAIN_TYPE.OVER) {
                                let reward_type = null;
                                let reward_num = null;
                                if (model.last_gold > 0) {
                                    reward_type = qf.const.rewardType.COIN;
                                    reward_num = model.last_gold;
                                }
                                if (model.last_diamond > 0) {
                                    reward_type = qf.const.rewardType.DIAMOND;
                                    reward_num = model.last_diamond;
                                }

                                if (model.double_switch) {
                                    qf.event.dispatchEvent(qf.ekey.SHOW_REWARD_DIALOG, {
                                        rewardNum: reward_num,
                                        flowmain_share: true,
                                        type: reward_type,
                                        flowmain: true,
                                    });
                                } else {
                                    qf.event.dispatchEvent(qf.ekey.SHOW_REWARD_DIALOG, {
                                        rewardNum: reward_num,
                                        type: reward_type,
                                        flowmain: true
                                    });
                                }

                                let times = model.current_time;
                                qf.platform.uploadEventStat({
                                    "module": "reg_funnel",
                                    "event": qf.rkey.PYWXDDZ_EVENT_REG_FUNNEL_VEDIOAD_SUCCESS,
                                    "value": times,
                                });
                            }

                            if (type === qf.const.FLOWMAIN_TYPE.NORMAL) {
                                //服务器发普通奖励
                            } else if (type === qf.const.FLOWMAIN_TYPE.SHARE) {
                                //服务器发双倍奖励
                                let reward_type = null;
                                let reward_num = null;
                                if (model.last_gold > 0) {
                                    reward_type = qf.const.rewardType.COIN;
                                    reward_num = model.last_gold;
                                }
                                if (model.last_diamond > 0) {
                                    reward_type = qf.const.rewardType.DIAMOND;
                                    reward_num = model.last_diamond;
                                }

                                qf.event.dispatchEvent(qf.ekey.SHOW_REWARD_DIALOG, {
                                    rewardNum: reward_num,
                                    type: reward_type
                                });
                            }
                        }
                    }
                });
            }
        });
    },

    onDestroy() {

    }
});