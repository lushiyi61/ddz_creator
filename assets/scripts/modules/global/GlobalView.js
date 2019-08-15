/*
公共视图
*/

let View = require("../../frameworks/mvc/View");

cc.Class({
    extends: View,

    properties: {
        WAITING_ZORDER: 10,

        waiting: null,
    },

    //显示透明loading并屏蔽掉所有事件响应
    showWaiting(param) {
        if (!this.waiting) {
            // this.waiting = new WaitingLayer();
            // this.addChild(this.waiting, this.WAITING_ZORDER);
        }

        if (param && !param.isAutoDestroy) {
            //强制设置非自动销毁
            //this.waiting.setAutoDestroy(false);
        } else {
            //this.waiting.startAutoDestroy();
        }

    },

    //移除透明loading
    removeWaiting() {
        // if (this.waiting)
        //     this.removeChild(this.waiting);
        //
        // this.waiting = null;
    },
});