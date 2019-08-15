// 管理按钮
// 纯客户端管理器
// 与网络无关，故可以注册事件，且事件会随着对象的回收而消失
let ButtonManager = require("../../components/ButtonManager");
cc.Class({
    extends: ButtonManager,

    properties: {
        TAG:{
            override: true,
            default: "EventButtonManager",
        },
    },

    //override
    initOtherDif() {
        this.panelBegin.active = false;
        this.panelCallScore.active = false;
        this.panelEventCallScore.active = true;
        this.panelOver.active = false;
    },

    callScore(score) {
        this.hideAllBtns();
        qf.event.dispatchEvent(qf.ekey.LORD_NET_CALL_POINT_REQ, {score: score});
        qf.cache.desk.setIsMySelfOperated(true);
    },

    initCallButtons(num) {
        this.btnCall = [];
        var name = ["btn_call_0", "btn_call_1", "btn_call_2", "btn_call_3"];
        for(var k in name) {
            var v = name[k];
            var score = qf.func.checkint(k);
            let resPath;
            if (score > qf.const.CALL_SCORE.ZERO) {
                if (score === qf.const.CALL_SCORE.ONE)
                    resPath = qf.tex.lord_land_res.one;
                else if (score === qf.const.CALL_SCORE.TWO)
                    resPath = qf.tex.lord_land_res.two;
                else if (score === qf.const.CALL_SCORE.THREE)
                    resPath = qf.tex.lord_land_res.three;
            }

            let node = cc.find(v, this.panelCallScore);
            this.btnCall[k] = node.addComponent("GButton");
            this.btnCall[k].setResPath(resPath);
            this.btnCall[k].node.setTag(score + 1);
            this.btnCall[k].hide();

            qf.utils.addTouchEvent(this.btnCall[k].node, (sender)=>{
                this.callScore(sender.getTag() - 1);
            })
        }
    },

    updateCallDif(callPoint) {
        //此处添加相关逻辑应该哪几个按钮灰掉
        for (var k in this.btnCall) {
            var score = qf.func.checkint(k);
            var v = this.btnCall[k];
            if (score > qf.const.CALL_SCORE.ZERO) {
                if (score > callPoint)
                    v.open();
                else
                    v.close();
            }
        }
    }
});