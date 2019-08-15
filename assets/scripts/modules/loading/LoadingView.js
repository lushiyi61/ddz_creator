/*
Loadding界面
*/

let View = require("../../frameworks/mvc/View");
cc.Class({
    extends: View,

    properties: {
        base64ImgTotalNum: 7,

        base64ImgCurrNum: 0,

        cur_percent: 0,
    },

    init() {
        this.initComponents();
        this.initBase64Res();
    },

    initComponents() {
        this.loading_bg = new cc.Node();
        this.loading_bg.addComponent(cc.Sprite);

        this.loading_logo = new cc.Node();
        this.loading_logo.addComponent(cc.Sprite);
        this.loading_logo.setPosition(-220, 502);

        this.loading_tips = new cc.Node();
        this.loading_tips.addComponent(cc.Sprite);
        this.loading_tips.setPosition(0, -522);

        this.loading_bar = new cc.Node();
        this.loading_bar.anchorX = 0;
        this.s_loading_bar = this.loading_bar.addComponent(cc.Sprite);

        this.loading_bar_bg = new cc.Node();
        this.loading_bar_bg.setPosition(cc.v2(0, -320));
        this.loading_bar_bg.addChild(this.loading_bar);
        this.s_loading_bar_bg = this.loading_bar_bg.addComponent(cc.Sprite);

        this.loading_bar_dot = new cc.Node();
        this.loading_bar_dot.addComponent(cc.Sprite);

        this.panel_animation = new cc.Node();
        this.panel_animation.setPosition(0, 0);
        this.dragonBonesInstance = this.panel_animation.addComponent(dragonBones.ArmatureDisplay);
        this._dragonAsset = new dragonBones.DragonBonesAsset();
        this._dragonAsset.dragonBonesJson = qf.res64.loading_ani_ske_json;
        this._dragonAtlasAsset = new dragonBones.DragonBonesAtlasAsset();
        this._dragonAtlasAsset.atlasJson = qf.res64.loading_ani_tex_json;
    },

    initBase64Res() {
        this.loadBase64Img(qf.res64.loading_bg, frame => {
            this.loading_bg.getComponent(cc.Sprite).spriteFrame = frame;
        });
        this.loadBase64Img(qf.res64.loading_logo, frame => {
            this.loading_logo.getComponent(cc.Sprite).spriteFrame = frame;
        });
        this.loadBase64Img(qf.res64.loading_tips, frame => {
            this.loading_tips.getComponent(cc.Sprite).spriteFrame = frame;
        });
        this.loadBase64Img(qf.res64.loading_bar_bg, frame => {
            this.loading_bar_bg.getComponent(cc.Sprite).spriteFrame = frame;
        });
        this.loadBase64Img(qf.res64.loading_bar, frame => {
            this.loading_bar.getComponent(cc.Sprite).spriteFrame = frame;
        });
        this.loadBase64Img(qf.res64.loading_bar_dot, frame => {
            this.loading_bar_dot.getComponent(cc.Sprite).spriteFrame = frame;
        });
        this.loadBase64Texture(qf.res64.img_loading_ani_tex, tex => {
            this._dragonAtlasAsset.texture = tex;
        })
    },

    initUI() {
        this.loading_bar_size = this.s_loading_bar.spriteFrame.getRect();
        this.loading_bar_bg_size = this.s_loading_bar_bg.spriteFrame.getRect();

        // 设置progress bar
        this.loading_bar_bg.setContentSize(this.loading_bar_bg_size.width, this.loading_bar_bg_size.height);
        let loaddingBar_comp = this.loading_bar_bg.addComponent(cc.ProgressBar);
        loaddingBar_comp.barSprite = this.s_loading_bar;
        loaddingBar_comp.totalLength = this.loading_bar_size.width;
        this.loading_bar.position = cc.v2(-this.loading_bar_size.width * 0.5, -0.5);
        this.loading_bar.setContentSize(this.loading_bar_size.width, this.loading_bar_size.height);
        this.loading_bar_bg.setContentSize(this.loading_bar_bg_size.width, this.loading_bar_bg_size.height);
        loaddingBar_comp.progress = 0;
        this.loaddingBar_comp = loaddingBar_comp;

        //播放动画
        let dragonBonesInstance = this.dragonBonesInstance;
        dragonBonesInstance.dragonAsset = this._dragonAsset;
        dragonBonesInstance.dragonAtlasAsset = this._dragonAtlasAsset;
        dragonBonesInstance.buildArmature('armatureName', this.panel_animation);
        dragonBonesInstance.playAnimation('Animation1');

        //加载完成统一显示
        this.loading_bg.parent = this.node;
        this.loading_logo.parent = this.node;
        this.loading_tips.parent = this.node;
        this.loading_bar_bg.parent = this.node;
        this.loading_bar_dot.parent = this.loading_bar;
        this.panel_animation.parent = this.node;
    },

    loadBase64Img(base64Img, callBack) {
        const img = new Image();
        img.src = base64Img;

        img.onload = () => {
            const texture2d = new cc.Texture2D();
            texture2d.initWithElement(img);
            texture2d.handleLoadedTexture();
            const newFrame = new cc.SpriteFrame(texture2d);

            callBack(newFrame);
            //所有base64图片加载完毕后再开始预加载
            this.base64ImgCurrNum += 1;
            if (this.base64ImgCurrNum === this.base64ImgTotalNum) {
                this.initUI();
                this.startLoadding();
            }
        }
    },

    loadBase64Texture(base64Img, callBack) {
        const img = new Image();
        img.src = base64Img;

        img.onload = () => {
            const texture2d = new cc.Texture2D();
            texture2d.initWithElement(img);
            texture2d.handleLoadedTexture();

            callBack(texture2d);
            //所有base64图片加载完毕后再开始预加载
            this.base64ImgCurrNum += 1;
            if (this.base64ImgCurrNum === this.base64ImgTotalNum) {
                this.initUI();
                this.startLoadding();
            }
        }
    },

    updatePercent() {
        if (this.base64ImgCurrNum !== this.base64ImgTotalNum) return;

        this.loaddingBar_comp.progress = this.cur_percent * 0.01;
        this.loading_bar_dot.x = this.loading_bar_size.width * this.cur_percent / 100;
    },

    completedAni() {
        this.loaddingBar_comp.progress = this.cur_percent * 0.01;
        this.loading_bar_dot.x = this.loading_bar_size.width * this.cur_percent / 100;

        if (this.cur_percent >= 100) {
            qf.event.dispatchEvent(qf.ekey.EVENT_LOADDING_FINISH);
        }
    },

    startLoadding() {
        this.cur_percent = 0;

        let blockCallback = (count, total) => {
            let percent = (count / total * 100) || 0;

            this.cur_percent = Math.max(this.cur_percent, Math.min(percent, 100));
            this.cur_percent = Math.floor(this.cur_percent);

            this.updatePercent();
        }

        qf.rm.load("global", (result, count, loaddedCount) => {
            // cc.error("===global=>> 1 ", count, loaddedCount);
            blockCallback(loaddedCount, count);
        }, () => {
            blockCallback(100, 100);
            this.completedAni();
        });
    }
});