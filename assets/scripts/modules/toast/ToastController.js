/*
    Toast 吐司提示
*/
let Controller = require("../../frameworks/mvc/Controller");

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

    //override
    initView() {
        let node = new cc.Node("node");
        var toastView = node.addComponent("ToastView");
        node.zIndex = qf.const.TOP_LAYER_ZORDER.TOAST;

        return toastView;
    },

    initGlobalEvent(){
        qf.event.addEvent(qf.ekey.GLOBAL_TOAST,this.showToast,this);
    },

    showToast(paras) {
        this.view.showToast(paras);
    }
});