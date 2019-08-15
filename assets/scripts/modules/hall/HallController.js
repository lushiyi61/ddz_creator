
/*
金币场大厅控制器
*/

let Controller = require("../../frameworks/mvc/Controller");

cc.Class({
    extends: Controller,

    ctor () {

    },

    //初始化全局事件监听
    initGlobalEvent() {
        qf.event.on(qf.ekey.EVT_SHOW_HALL, this.onShowHall, this);
    },

    //控制器事件，随着主view销毁而销毁
    initModuleEvent() {

    },

    initView(params) {

        let prefab = cc.loader.getRes(qf.res.prefab_hall);
        let script = cc.instantiate(prefab).getComponent("HallView");
        script.init(params);
        return script;
    },

    show(params) {
        this._super(params);

        this.view.playAction(qf.const.INOUT_TYPE.IN);
    },

    onShowHall(params) {
        qf.rm.checkLoad("hall",()=>{
            qf.mm.show("hall", params, true);
        })
    },

    onDestroy () {

    }
});