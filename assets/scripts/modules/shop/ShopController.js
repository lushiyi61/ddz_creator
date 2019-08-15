
let Controller = require("../../frameworks/mvc/Controller");

cc.Class({
    extends: Controller,

    initGlobalEvent() {
        qf.event.on(qf.ekey.EVT_SHOW_SHOP, this.onShowShop, this);
    },

    initView() {

    },

    onShowShop() {
        qf.rm.checkLoad("shop", ()=>{
            qf.mm.show("shop");
        });
    }
})