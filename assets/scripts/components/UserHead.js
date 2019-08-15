//用户头像

const ERR_MAX = 3;

cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Mask,
        head: cc.Node,
        head_sprite: cc.Sprite,

        sex: { visible: false, default: -1 },
        url: { visible: false, default: "" },
        err_num: { visible: false, default: 0 },
        width: 100,

        mask_type: cc.Mask.Type.ELLIPSE,
        mask_enabled: true,
    },

    onLoad() {
        this.setMask();

        this.setHead(0);
    },

    setMask() {
        if (this.mask_enabled) {
            if (!this.mask) {
                this.mask = this.addComponent(cc.Mask);
                this.mask.alphaThreshold = 0;
            }
            this.mask.type = this.mask_type;
        } else {
            if (this.mask) {
                this.removeComponent(cc.Mask);
                this.mask = null;
            }
        }
    },

    setMaskType(type) {
        this.mask_type = type;

        this.setMask();
    },

    setUrl(url) {
        if (!url) return;

        this.setHead(this.sex, url);
    },

    setHead(sex, url) {
        if (!this.head) {
            this.head = new cc.Node();
            this.head_sprite = this.head.addComponent(cc.Sprite);
            this.head_sprite.type = cc.Sprite.Type.SIMPLE;
            this.head_sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            this.node.addChild(this.head);
        }

        if (sex !== this.sex) {
            let default_res = (sex === 1) ? qf.tex.default_girl_icon : qf.tex.default_man_icon;
            this.head_sprite.spriteFrame = qf.rm.getSpriteFrame(default_res);
            this.head.scale = this.width / this.head.getContentSize().width;
        }
        this.sex = sex;

        if (!url || url === this.url) return;
        this.url = url;

        this.err_num = 0;
        this.loadImage();
    },

    loadImage() {
        if (!this.url) return;

        let hostname = window && window.location && window.location.hostname;

        let url = this.url;
        let texture = cc.loader.getRes(url);
        if (texture) {
            this.head_sprite.spriteFrame.setTexture(texture);
            this.head.scale = this.width / this.head.getContentSize().width;
        } else if (!(hostname && hostname === "localhost")) {
            cc.loader.load(url, (err, texture) => {
                if (err) {
                    this.onLoadError(url);
                } else {
                    try {
                        if (this.head_sprite) {
                            this.head_sprite.spriteFrame.setTexture(texture);
                            this.head.scale = this.width / this.head.getContentSize().width;
                        }
                    } catch (e) {
                        this.onLoadError(url);
                    }
                }
            });
        }
    },

    onLoadError(url) {
        if (this.url !== url) return;

        if ((++this.err_num) > ERR_MAX) return;

        this.scheduleOnce(() => {
            this.loadImage();
        }, 0.5);
    },

});