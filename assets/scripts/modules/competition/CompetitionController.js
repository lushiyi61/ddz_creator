
/*
金币场大厅控制器
*/

let Controller = require("../../frameworks/mvc/Controller");

cc.Class({
    extends: Controller,

    ctor() {

    },

    //控制器事件，随着主view销毁而销毁
    initModuleEvent() {
        // this.addModuleEvent(qf.ekey.EXIT_COMPETITION_REQ, this.exitCompetitionReq);
        // this.addModuleEvent(qf.ekey.EXCHANGE_SOMETHING_REQ, this.exchangeSomethingReq);
        // //关闭比赛场
        // this.addModuleEvent(qf.ekey.CLOSE_COMPETITION_VIEW, this.closeCompetitionView);
        //
        // this.addModuleEvent(qf.ekey.BACKPACK_LEVEL_CARD_REQ, this.backPackLevelCardReq);
    },

    //初始化全局事件监听
    initGlobalEvent() {
        qf.event.on(qf.ekey.EVT_SHOW_COMPETITION_VIEW, this.onShowCompetition, this);

        qf.event.on(qf.ekey.CHECK_IF_CAN_JOIN_MATCH, this.isHighMatchLevelReq, this);
    },

    initView(params) {

        let prefab = cc.loader.getRes(qf.res.prefab_competition);
        let script = cc.instantiate(prefab).getComponent("CompetitionView");
        script.init(params);
        return script;
    },

    show(params) {
        this._super(params);

        this.view.playAction(qf.const.INOUT_TYPE.IN);
        this.sendMatchHomepageInfoReq();
        this.isHighMatchLevelReq();
    },

    onShowCompetition(params) {
        qf.rm.checkLoad("competition", () => {
            qf.mm.show("competition", params, true);
        })
    },

    //赛事主页面信息请求
    sendMatchHomepageInfoReq() {
        qf.net.send({
            cmd: qf.cmd.DDZ_MATCH_HOME_PAGE_INFO_REQ, body: {}, callback: (rsp) => {
                //dump(rsp);
                qf.net.util.rspHandler(rsp, {
                    successCb: (data) => {
                        if (data) {
                            qf.cache.competition.updateCompetitionData(data);
                        }
                    }
                });
            }
        });
    },

    //是否是高段位
    isHighMatchLevelReq(params) {
        let check = false;
        if (params && params.check) check = true;

        let otherView = false;
        if (params && params.otherView) otherView = true;

        qf.net.send({
            cmd: qf.cmd.DDZ_IS_HIGH_MATCH_LEVEL_REQ, body: {}, callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        if (!model) return;
                        if (model) {
                            qf.cache.competition.updateHighLevelMatchInfo(model, check, otherView);
                        }

                        if (check) {
                            this.checkGotoEventGame(params);
                        }
                    }
                });
            }
        });
    },

    checkGotoEventGame(params) {
        let model = qf.cache.competition.getHighLevelMatchInfo();
        if (params.check) {
            if (model.can_join === 0) {
                qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.txt.highLevelMatchTips });
            }
            else {
                this.startMatch();

                if (params.from === "voucher") {
                    let matchLevel = qf.cache.competition.getMatchLevel();
                    qf.platform.uploadEventStat({
                        "module": "performance",
                        "event": qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_MATCH_CLICK_WAIT,
                        "value": 1,
                        "custom": matchLevel,
                    });
                }
            }
        }
    },

    startMatch() {
        let roomId = 0;
        let body = {
            room_id: roomId,
            desk_id: 0,
            entry_type: 0,
            start_type: qf.const.GAME_START_TYPE.NORMAL,
            just_view: 0,
            desk_mode: qf.const.DESK_MODE_NEWEVENT,
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
});