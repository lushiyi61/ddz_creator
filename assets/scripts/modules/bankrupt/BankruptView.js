/*破产补助*/

let Dialog = require("../../frameworks/mvc/Dialog");
cc.Class({
    extends:Dialog,

    properties:{

    },

    //override
    initUI() {
        this.root = this.node.getChildByName('root');
        this.rpanel = cc.find("panel/rpanel",this.root);

        let data = this.init_data;
        this.share_info = data.share_info;
        this.count = data.count || 1;

        this.txtContent = cc.find("txt_content",this.rpanel).getComponent(cc.Label);//提示语
        this.txtContent.active = false;
        this.txtContent.string = "";

        this.lblCoin = cc.find("lbl_coin",this.rpanel).getComponent(cc.Label);//金币
        this.lblCoin.string = qf.utils.getFormatNumber(data.coin) + "金币";
        this.btnOk = cc.find("btn_ok",this.rpanel);//确定按钮
        this.imageTitle = cc.find("img_bg/img_bg_title",this.rpanel).getComponent(cc.Sprite);//标题
        this.img_btn_title = this.btnOk.getChildByName("img_btn_title").getComponent(cc.Sprite);
        this.btnOk.active = qf.utils.getFuncIsOpen(qf.const.moduleConfig.BANKUP) === qf.const.moduleVisible.TRUE;

        //第二次补助逻辑
        if (this.count === 2)
        {
            this.imageTitle.spriteFrame = qf.rm.getSpriteFrame(qf.res.common,qf.tex.common_title_Buzhu);
            this.img_btn_title.spriteFrame = qf.rm.getSpriteFrame(qf.res.common,qf.tex.common_txt_fxlq);
        }else{
            this.imageTitle.spriteFrame = qf.rm.getSpriteFrame(qf.res.common,qf.tex.common_title_Jinbbz);
            this.img_btn_title.spriteFrame = qf.rm.getSpriteFrame(qf.res.common,qf.tex.common_txt_fxjb_2);
        }
    },

    onClickClose() {
        this.removeSelf();
    },

    onClickShare() {
        //分享
        let data = "type=" + qf.const.LaunchOptions.TYPE_BANKRUPT_SHARE + "&fromUin=" + qf.cache.user.uin;
        logd("shareMessage  query:"+data);
        let title = qf.txt.stringShareTitle;//默认标题
        let imgUrl = qf.res.share_banner_normal_game;//默认图片
        let id = -1;

        qf.net.send({cmd: qf.cmd.GET_SHARE_INFO_REQ
            , body: {share_type_str: qf.const.SHARE_STRING_KEY.USER_BROKE_SHARE_300}
            , callback:(rsp)=> {
                qf.net.util.rspHandler(rsp, {successCb:(model)=> {
                        if(!model) return;
                        //随机图片
                        let shareImgUrls  = qf.cache.config.shareImgUrls;
                        if(shareImgUrls &&  shareImgUrls.length>0) {
                            let random_num = Math.floor(Math.random() * 10);
                            let index = random_num % (shareImgUrls.length);
                            imgUrl = shareImgUrls[index].img_url;
                            title = shareImgUrls[index].title;
                            id = shareImgUrls[index].id;
                        }

                        if (model.share_info)
                        {
                            imgUrl = model.share_info.icon;
                            title = model.share_info.str;
                            id = model.share_info.share_id;
                        }
                        logd("----------------------------破产补助分享图文----------------------------");
                        //数据上报
                        qf.platform.uploadEventStat({
                            "module": "share",
                            "event": qf.skey.PYWXDDZ_EVENT_SHARE_CLICK_SHARE_BTN,
                            "custom":{
                                scene:qf.const.ShareScene.MAIN,
                                via:qf.const.ShareMsgType.BANKRUPT,
                                img_id:id
                            }
                        });

                        let shareSuccess = ()=>{
                            qf.platform.uploadEventStat({
                                "module": "share",
                                "event": qf.skey.PYWXDDZ_EVENT_SHARE_SUCCESS,
                                "custom":{
                                    scene:qf.const.ShareScene.MAIN,
                                    via:qf.const.ShareMsgType.BANKRUPT,
                                    img_id:id
                                }
                            });
                        }

                        qf.platform.shareMessage({
                            imageUrl: imgUrl,
                            title: title,
                            shareId: id,
                            query: "type=" + qf.const.LaunchOptions.TYPE_BANKRUPT_SHARE + "&fromUin=" + qf.cache.user.uin,
                            scb: (res)=> {
                                logd("--------------------ShareSuccess------------------");
                                shareSuccess();

                                //发送6557证明已经是分享成功 直接result为1 没有其它情况存在
                                qf.net.send({cmd:qf.cmd.DDZ_BANKRUPTCY_SHARE_REQ , wait : true, body: {result: 1},callback: (rsp)=> {
                                        qf.net.util.rspHandler(rsp, {successCb:(mode)=> {
                                                this.removeSelf();
                                                qf.event.dispatchEvent(qf.ekey.SHOW_REWARD_DIALOG,{rewardNum:mode.coin_amount});
                                            }});
                                    }});
                            }
                        });
                    }});
            }});
    },
});