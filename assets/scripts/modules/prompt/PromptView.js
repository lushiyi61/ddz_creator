/*通用提示框*/
let Dialog = require("../../frameworks/mvc/Dialog");

cc.Class({
    extends: Dialog,

    initUI() {
        this.root = this.node.getChildByName('root');
        let args = this.init_data;

        this.panel = qf.utils.seekNodeByName("panel",this.root);
        //标题
        this.imgTitle = qf.utils.seekNodeByName("img_title",this.root).getComponent(cc.Sprite);
        //提示语
        this.txtContent = qf.utils.seekNodeByName("txt_content",this.root).getComponent(cc.Label);
        //确定按钮
        this.btnOk = qf.utils.seekNodeByName("btn_ok",this.root);
        this.btnCancel = qf.utils.seekNodeByName("btn_cancel",this.root);

        if (args.content){
            this.txtContent.string = args.content;
        }

        this.sureCb = args.sureCb;
        this.cancelCb = args.cancelCb;

        if (args.titlePath){
            this.imgTitle.spriteFrame = args.titlePath;
        }

        this.isOnly = args.isOnly;
        if (this.isOnly){
            this.btnCancel.active = false;
            this.btnOk.x = this.panel.getContentSize().width/2;
        }

        //修改按钮txt图片样式
        if(args.confirmTxtImg){
            let img_btn_title = this.btnOk.getChildByName("img_btn_title").getComponent(cc.Sprite);
            img_btn_title.spriteFrame = args.confirmTxtImg;
        }

        if(args.confirmBtnImg){
            this.btnOk.getComponent(cc.Sprite).spriteFrame = args.confirmBtnImg;
        }

        if(args.cancelTxtImg){
            let img_btn_title = this.btnCancel.getChildByName("img_btn_title").getComponent(cc.Sprite);
            img_btn_title.spriteFrame = args.cancelTxtImg;
        }

        if(args.cancelBtnImg){
            this.btnCancel.getComponent(cc.Sprite).spriteFrame = args.cancelBtnImg;
        }
    },

    onClickOk() {
        if(this.sureCb) this.sureCb();
        this.removeSelf();
    },

    onClickCancel() {
        if(this.cancelCb) this.cancelCb();
        this.removeSelf();
    },

});