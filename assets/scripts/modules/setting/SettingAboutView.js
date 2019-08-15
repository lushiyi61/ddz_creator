/*
设置-关于界面
*/

let Dialog = require("../../frameworks/mvc/Dialog");

cc.Class({
    extends: Dialog,

    properties: {
        scrollview: cc.ScrollView
    },

    onLoad () {
        this._super();

        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        cc.loader.loadRes(qf.res.setting_about, cc.SpriteFrame, (err, spriteFrame) => {
            sprite.spriteFrame = spriteFrame;
            let r = spriteFrame.getRect();
            this.scrollview.content.height = r.height;
        });

        node.anchorX = 0;
        node.anchorY = 1;
        this.scrollview.content.addChild(node);
    },

    onClick(touch, name) {
        switch (name) {
            case 'close':
                this.removeSelf();
                break;
        }
    },

})