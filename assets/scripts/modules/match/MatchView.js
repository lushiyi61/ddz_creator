/*游戏匹配界面*/
let View = require("../../frameworks/mvc/View");

let UserHead = require("../../components/UserHead");

cc.Class({
    extends: View,

    properties: {
        userHeadWidth:106,

        headImg: cc.Node,
    },

    onLoad() {
        this.adjustIPhoneX("root");
    },

    initUI() {
        this.root = this.node.getChildByName('root');

        this.imgHeadBg = cc.find("pan_user0/img_head",this.root);

        this.panelTxtServer = cc.find("panel_txt_server/panel_server",this.root);

        this.txtUserName = cc.find("pan_user0/txt_user_name",this.root).getComponent(cc.Label);
        this.txtGold = cc.find("pan_user0/txt_gold",this.root).getComponent(cc.Label);

        let u = qf.cache.user;
        this.txtUserName.string = qf.string.cutString(u.nick);
        this.txtGold.string = qf.utils.getFormatNumber(u.gold);

        this.initHead();
    },

    initData(params) {
        this._super(params);

        this.showPanelTxtServer(params);

        this.setTypeInfo();
    },

    initEvent() {
        qf.cache.user.on(qf.cache.user.GOLD_CHANGE, this.onGoldChange, this);
    },

    initHead() {
        let u = qf.cache.user;
        this.headImg.getComponent("UserHead").setHead(u.sex, u.portrait);
        this.headImg.parent = this.imgHeadBg;
        this.headImg.zIndex = -1;
    },

    showPanelTxtServer(params) {
        if (params && params.timeout) return;

        this.panelTxtServer.runAction(cc.sequence(
            cc.moveTo(0.5,cc.v2(0,-7)),
            cc.delayTime(5),
            cc.moveTo(0.5,cc.v2(0,105))
        ));
    },

    setTypeInfo() {
        let roomId = qf.cache.match.getRoomId();
        let roomInfo = qf.cache.config.room;

        for(let i = 0;i < roomInfo.length;i++){
            if(roomId === roomInfo[i].room_id){
                let v = roomInfo[i];

                let typeStr1 = qf.txt.room_battle_type_name[v.play_mode], typeStr2;
                if(v.room_level === qf.const.ROOM_LEVEL.NOVICE) typeStr2 = qf.txt.room_level_novice;
                else if(v.room_level === qf.const.ROOM_LEVEL.PRIMARY) typeStr2 = qf.txt.room_level_primary;
                else if(v.room_level === qf.const.ROOM_LEVEL.NORMAL) typeStr2 = qf.txt.room_level_normal;
                else if(v.room_level === qf.const.ROOM_LEVEL.MEDIUM) typeStr2 = qf.txt.room_level_medium;
                else if(v.room_level === qf.const.ROOM_LEVEL.ADVANCED) typeStr2 = qf.txt.room_level_advanced;
                else if(v.room_level === qf.const.ROOM_LEVEL.SUPER) typeStr2 = qf.txt.room_level_super;
                else typeStr2 = qf.txt.room_level_unknow;
                let typeStr = cc.js.formatStr(typeStr2,typeStr1);
                let baseScore = cc.js.formatStr(qf.txt.room_scoreStr,v.base_score);
                let capScore = cc.js.formatStr(qf.txt.room_maxScoreStr,Number(qf.utils.getFormatNumber(v.cap_score)));
                let serverScore = cc.js.formatStr(qf.txt.room_serverStr,Number(qf.utils.getFormatNumber(v.enter_fee)));

                cc.find("panel_center/txt_play_way",this.root).getComponent(cc.Label).string = typeStr;
                this.panelTxtServer.getChildByName("txt_capping").getComponent(cc.Label).string = capScore;
                this.panelTxtServer.getChildByName("txt_server").getComponent(cc.Label).string = serverScore
            }
        }
    },

    onClickExit() {
        qf.event.dispatchEvent(qf.ekey.EVT_SHOW_HALL);
        // ModuleManager.getModule("MainController").getModel().updateShowByGame(true);
        // ModuleManager.popModule();
        // qf.music.playBackGround(qf.res.lord_music.background);   //播放背景乐
    },

    onClickBeginMingpai() {
        let roomid = qf.cache.match.getRoomId();

        qf.event.dispatchEvent(qf.ekey.EVT_CHECK_GOLD_ENOUGH_INGAME, {
            roomid: roomid, goldLimitCallback: () => {
                qf.event.dispatchEvent(qf.ekey.EVT_INPUT_SPECIFIED_DESK, {
                    room_id: roomid,
                    start_type: qf.const.GAME_START_TYPE.SHOW,
                    show_multi: 5
                });
            }
        });
    },

    onClickBeginNormal() {
        let roomid = qf.cache.match.getRoomId();

        qf.event.dispatchEvent(qf.ekey.EVT_CHECK_GOLD_ENOUGH_INGAME, {
            roomid: roomid, goldLimitCallback: ()=>{
                qf.event.dispatchEvent(qf.ekey.EVT_INPUT_SPECIFIED_DESK, { 
                    room_id: roomid, 
                    start_type: qf.const.GAME_START_TYPE.NORMAL, 
                    show_multi: 1 
                });
            }
        });
    },

    changeDesk(params) {
        let room_id = params.room_id;
        //更改配置
        qf.cache.match.updateRoomId({ roomid: room_id });
        //更改桌子水印
        this.setTypeInfo();
    },
    
    onGoldChange(params) {
        this.txtGold.string = qf.utils.getFormatNumber(params.gold);
    },
    
    onDestroy() {
        qf.cache.user.targetOff(this);
    },

})