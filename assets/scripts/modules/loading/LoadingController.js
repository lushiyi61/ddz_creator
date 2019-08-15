/*
Loadding界面
*/
let Controller = require("../../frameworks/mvc/Controller");

cc.Class({
    extends: Controller,

    properties: {
       
    },

    //override
    initView(param) {
        let node = new cc.Node();
        node.anchorX = node.anchorY = 0;
        node.position = cc.v2(cc.winSize.width*0.5, cc.winSize.height*0.5);
        let script = node.addComponent("LoadingView");
        script.init();

        return script;
    }
});