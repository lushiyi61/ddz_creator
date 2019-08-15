/*
    广播控制器
*/

let Controller = require("../../frameworks/mvc/Controller");

let BroadcastView = require("./BroadcastView");

cc.Class({
    extends: Controller,

    properties: {
        root: {
            override: true,
            get() {
                return qf.layer.top;
            }
        }
    },

    //初始化全局事件监听
    initGlobalEvent() {
        qf.event.addEvent(qf.ekey.IS_SHOW_BROADCAST, this.isShowBroadcast, this);
    },

    //控制器事件，随着主view销毁而销毁
    initModuleEvent() {

    },

    initView() {
        let prefab = cc.loader.getRes(qf.res.prefab_broadcast);
        let node = cc.instantiate(prefab);
        node.zIndex = qf.const.TOP_LAYER_ZORDER.BROADCAST;

        let script = node.getComponent(BroadcastView);
        script.init();
        
        return script;
    },

    isShowBroadcast(args) {
        if(!args) return;

        if(this.view){
            if(args.isShow) this.view.showBroadcast();
            else this.view.hideBroadcast();
        }
    },

    show(params) {
        this._super(params);

    },

    onDestroy () {
        
    }
});
