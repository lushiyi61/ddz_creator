/**
 * 牌桌内通用按钮组件
 */
cc.Class({
    extends: cc.Button,

    properties: {
        imgTitle: null
    },

    onLoad() {
        this.imgTitle = cc.find("img_title", this.node);
        this.enableAutoGrayEffect = true;
        this.transition = cc.Button.Transition.SCALE;
    },

    close() {
        if (this.resPath && this.resPath[1] && this.imgTitle)
            this.imgTitle.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.global, this.resPath[1]);
        this.interactable = false;
    },

    open() {
        if (this.resPath && this.resPath[0] && this.imgTitle)
            this.imgTitle.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.global, this.resPath[0]);
        this.interactable = true;
    },

    hide() {
        this.node.active = false;
    },

    show() {
        this.node.active = true;        
        this.open();
    },

    updateRes(res) {
        this.imgTitle.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.global, res);
    },

    setResPath(res) {
        this.resPath = res;
    }
})