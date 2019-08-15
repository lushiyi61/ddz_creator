let Controller = require("../../frameworks/mvc/Controller");

cc.Class({
    extends: Controller,

    ctor () {

    },

    //初始化全局事件监听
    initGlobalEvent() {
        qf.event.on(qf.ekey.EVT_SHOW_MATCH, this.onShowMatch, this);
    },

    //控制器事件，随着主view销毁而销毁
    initModuleEvent() {
        //经典场结算界面通知继续游戏给匹配界面
        this.addModuleEvent(qf.ekey.START_BY_CLASSSSIC_OVER, this.startGameByGameOver, this);

        //换桌
        this.addModuleEvent(qf.ekey.LORD_REQUEST_USER_CHANGE_DESK, this.onChangeDesk, this);

        //退出
        this.addModuleEvent(qf.ekey.LORD_NET_EXIT_DESK_REQ, this.onExitDesk, this);
    },

    //经典场结算界面通知继续游戏给匹配界面
    startGameByGameOver(rsp){
        logd("-----startGameByGameOver");
        if(this.view){
            let roomId = qf.cache.match.getRoomId();
            this.view.sendCheckGoldLimit({roomId:roomId,startType:rsp.start_type});
        }
    },

    initView(params) {
        let prefab = cc.loader.getRes(qf.res.prefab_matching);

        qf.cache.match.updateRoomId(params);

        let script = cc.instantiate(prefab).getComponent("MatchView");
        script.init(params);
        return script;
    },

    show(params) {
        this._super(params);

        qf.event.dispatchEvent(qf.ekey.SHOW_OR_HIDE_BROADCAST,{isVisible: false});
    },

    onShowMatch(params) {

        if (!qf.rm.isLoadded("match")) {
            //从牌局中点击匹配到匹配界面，页面加载时间
            // Cache.globalInfo.setStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_DESK_TO_MATCH);
        }

        qf.rm.checkLoad("match", () => {
            qf.mm.clean();
            qf.mm.show("match", params);
            // let instance = Cache.globalInfo.getStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_DESK_TO_MATCH);
            // if (instance) {
            //     qf.platform.uploadEventStat({   //从牌局中点击匹配到匹配界面，页面加载时间
            //         "module": "performance",
            //         "event": STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_DESK_TO_MATCH,
            //         "value": instance
            //     });
            // }
        });
    },

    onChangeDesk(params) {
        if (!this.view) return;

        this.view.changeDesk(params);
    },

    onExitDesk(params) {
        qf.event.dispatchEvent(qf.ekey.EVT_SHOW_HALL);
    },

    //override
    remove () {
        this._super();

        //移除结算框
        qf.event.dispatchEvent(qf.ekey.REMOVE_CLASSIC_OVER_DIALOG);
    }
});