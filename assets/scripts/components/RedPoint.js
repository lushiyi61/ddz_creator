/*
按钮上的小红点
*/

cc.Class({
    extends: cc.Component,

    properties: {
        num: 0, //不为0才显示此组件
        threshold: -1, //红点阈值，大于此值才显示Label

        pos: cc.v2(),

        img_red: cc.Node,
        lbl_num: cc.Node,
    },

    init(params) {
        this.initData(params);
        this.initUI();
    },

    initData(params) {
        params = params || {};
        this.num = params.num === undefined ? 0 : params.num;
        this.pos = params.pos === undefined ? cc.v2() : params.pos;
        this.threshold = params.threshold === undefined ? -1 : params.threshold;
        this.threshold = this.threshold < -1 ? -1 : this.threshold;
    },

    initUI() {
        this.img_red = new cc.Node();
        this.img_red.position = this.pos;
        this.node.addChild(this.img_red);
        let sprite = this.img_red.addComponent(cc.Sprite);
        sprite.spriteFrame = qf.rm.getSpriteFrame(qf.tex.global_pic_red);

        this.lbl_num = new cc.Node();
        this.lbl_num.position = this.pos;
        this.node.addChild(this.lbl_num);
        let label = this.lbl_num.addComponent(cc.Label);
        label.fontSize = 20;
    },

    updateNum(num) {
        num = num === undefined ? 0 : num;

        this.num = num;

        this.lbl_num.setString(this.num);

        if (this.threshold === -1) {
            this.lbl_num.active = false;
        } else {
            this.lbl_num.active = this.num > this.threshold;
        }

        let tex_res = qf.tex.global_pic_red;
        if (this.num >= 10) {
            tex_res = qf.tex.global_pic_red1;
        }
        this.img_red.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(tex_res);

        this.img_red.active = this.num > 0;
    },
});