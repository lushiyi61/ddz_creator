let View = require("../../frameworks/mvc/View");

cc.Class({
    extends: View,

    properties: {
        actionDistance:-710,
        actionTime: 0.3,
    },

    onLoad() {
        this.adjustIPhoneX("root");
    },

    initEvent() {
        qf.cache.user.on(qf.cache.user.GOLD_CHANGE, this.onGoldChange, this);
        qf.cache.user.on(qf.cache.user.DIAMOND_CHANGE, this.onDiamondChange, this);
    },

    //初始化数据
    setData(){
        this.lblCoin.string = qf.utils.getFormatNumber(qf.cache.user.gold);
        
        let classic_room = qf.cache.config.classic_room;
        let unshuffle_room = qf.cache.config.unshuffle_room;
        let roomInfo = [];

        // 整理
        let index1 = 0;
        for(let i = 0;i < classic_room.length;i++){
            let v = classic_room[i];
            roomInfo[index1] = v;
            index1 += 2;
        }

        let index2 = 1;
        for(let j = 0;j < unshuffle_room.length;j++){
            let v = unshuffle_room[j];
            roomInfo[index2] = v;
            index2 += 2;
        }

        this.showBtnPanel(roomInfo);
    },

    //初始化UI
    initUI() {
        this.root = this.node.getChildByName('root');

        this.panelMask = cc.find("panel_mask",this.root);           //遮罩

        this.panelMain = cc.find("panel_main_big",this.root);
        this.btnExit = cc.find("img_exit/btn_exit",this.root);	    //快速开始

        this.lblCoin = cc.find("panel_info/btn_coin/lbl_coin",this.root).getComponent(cc.Label);                       //金币
        this.lblDiamond = cc.find("panel_info/btn_diamond/lbl_diamond",this.root).getComponent(cc.Label);              //钻石
        this.imgCoinAdd = cc.find("panel_info/btn_coin/img_coin_add",this.root);                //加号

        this.btnCoin = cc.find("panel_info/btn_coin",this.root);
        this.btnDiamond = cc.find("panel_info/btn_diamond",this.root);

        this.panelList = cc.find("panel_main_big/panel_list",this.root);         //列表list
        this.btnItem = cc.find("btn_item",this.root);           //

        this.btnListView = cc.find("panel_main_big/btnListView",this.root).getComponent(cc.ScrollView);
        this.content = this.btnListView.content;

        this.btn_quick_start = cc.find("btn_quick_start",this.root);

        let OS = qf.platform.getPlatformName();
        this.btnCoin.interactable = (OS !== "ios");
        this.btnDiamond.active = false;
        this.imgCoinAdd.active = OS !== "ios";

        this.setData();
    },

    //显示按钮列表
    showBtnPanel(roomInfo) {
        this.panelList.active = true;
        this.btnItem.active = true;
        this.content.removeAllChildren(true);

        let length = Math.ceil(roomInfo.length/2);
        let list = [];
        for(let k = 0;k < length;k++){
            let v1 = roomInfo[2*k];
            let v2 = roomInfo[2*k+1];
            list.push([v1,v2]);

            var item = cc.instantiate(this.btnItem);
            this.content.addChild(item);
            this.setItemData(item,[v1,v2]);
        }
        this.btnListView.active = true;
    },

    setItemData(item,datas) {
        item.active = true;
        item.x = 0;
        for(let i = 0;i<2;i++){
            let data = datas[i];
            let btnItem = item.getChildByName("pan_item"+(i+1));
            if(data){
                let lblBaseScore = btnItem.getChildByName("lbl_base_score").getComponent(cc.Label);
                let lblCurOnline = btnItem.getChildByName("lbl_cur_online").getComponent(cc.Label);
                let lblCarryDesc = btnItem.getChildByName("lbl_carry_desc").getComponent(cc.Label);
                let img_difen = btnItem.getChildByName("img_base_score");
                let img_tag = btnItem.getChildByName("img_tag");

                img_tag.active = data.show_tag;
                lblBaseScore.string = data.base_score;
                lblCurOnline.string = data.cur_online;
                lblCarryDesc.string = data.carry_desc;

                let bg = (i === 0) ? qf.tex.hall_classic_bg : qf.tex.hall_unshuffle_bg;
                let sp = qf.rm.getSpriteFrame(qf.res.hall_plist, bg[data.room_level]);
                btnItem.getComponent(cc.Sprite).spriteFrame = sp;
                btnItem.itemData = data;

                // 居中
                let w = String(data.base_score).length * 32;
                let sz2 = img_difen.getContentSize();
                lblBaseScore.node.x = sz2.width/2;
                img_difen.x = -w/2;

                btnItem.active = true;
            }
            else{
                btnItem.active = false;
            }
        }
    },

    onClickExit() {
        loge("返回")
        qf.mm.show("main", null, true);
    },
    onClickQuickStart() {

        loge("快速开始")
        qf.event.dispatchEvent(qf.ekey.ROOM_CHECK,{roomCheckCallBack:this.quickStartCallBack.bind(this)});
    },
    onClickCoin() {
        loge("金币商城")
        cc.loader.loadRes(qf.res.prefab_table,cc.Prefab,(err,prefba)=>{
            let node = cc.instantiate(prefba);
            node.parent = cc.director.getScene();
        })
    },

    // 快速开始
    quickStartCallBack () {
        qf.net.send({cmd:qf.cmd.QUICK_START_REQ, wait: true,body: {play_mode:this.type},callback: (rsp)=> {
            qf.net.util.rspHandler(rsp, {
                successCb: (model)=> {
                    this.quickStart(model.room_id);
                },
                failCb: ()=> {
                    // //金币不足检测，如果有破产补助则返回错误码1370，不做处理
                    // ver.520 所有金币不足情况均返回1370并接收6622金币不足通知
                }});
        }});
    },

    quickStart(roomId) {
        if(roomId<0){
            let goShop = ()=> {
                qf.event.dispatchEvent(qf.ekey.EVT_SHOW_SHOP);
            };

            let goFlowMain = ()=> {
                qf.event.dispatchEvent(qf.ekey.CLICK_VEDIO_AD);
            };

            //前往商城
            let OS = qf.platform.getPlatformName();
            let txt = "";
            let img = null;
            let isIOS = false;
            if(OS === "ios"){
                isIOS = true;
                txt = qf.txt.tip_gold_limit_low3;
                img = qf.tex.global_txt_ljhq;
            } else {
                txt = qf.txt.tip_gold_limit_low2
            }
            qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {sureCb : ()=> {
                    if(!isIOS){
                        goShop();
                    }else{
                        goFlowMain();
                    }
                }, isModal : false, content : txt, isOnly : true, confirmTxtImg: img});
        }
        else {
            qf.event.dispatchEvent(qf.ekey.EVT_SHOW_MATCH,{roomid: roomId});
        }
    },

    //播放动画
    playAction(type){
        let absActionDistance = Math.abs(this.actionDistance);
        if(type === qf.const.INOUT_TYPE.IN){
            this.panelMain.runAction(
                cc.sequence(
                    cc.callFunc(()=>{
                        this.panelMask.active = true;
                        //this.panelMask.setTouchEnabled(true);
                    }),
                    cc.moveBy(this.actionTime,cc.v2(this.actionDistance, 0)),
                    cc.callFunc(()=>{
                        this.panelMask.active = false;
                        //this.panelMask.setTouchEnabled(false);
                    })))
        }
        else if(type === qf.const.INOUT_TYPE.OUT) {
            this.panelMain.runAction(cc.moveBy(this.actionTime, cc.v2(absActionDistance, 0)));
        }

    },

    onClickRoomItem(sender){
        let roomid = -1, itemData = sender.target.itemData;
        if (itemData) {
            roomid = itemData.room_id;
        }
        else if (sender.room_id) {
            roomid = sender.room_id;
        }

        qf.event.dispatchEvent(qf.ekey.ROOM_CHECK, {
            roomid: roomid,
            roomCheckCallBack:()=>{
                qf.event.dispatchEvent(qf.ekey.EVT_CHECK_GOLD_ENOUGH, {roomid: roomid});
            }});
        //Cache.globalInfo.setStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_ROOM); //大厅点击经典玩法--点击进入各个场次
    },

    onGoldChange(params) {
        this.lblCoin.string = qf.utils.getFormatNumber(params.gold);
    },
    onDiamondChange() {
        //this.lblDiamond.string = qf.utils.getFormatNumber(params.diamond);
    },

    //override
    onDestroy() {
        //销毁在user上绑定的监听
        qf.cache.user.targetOff(this);
    }
});