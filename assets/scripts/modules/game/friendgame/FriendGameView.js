/*
    好友房牌桌视图
 */

let NormalGameView = require("../normalgame/NormalGameView");

let UserHead = require("../../../components/UserHead");

cc.Class({
    extends: NormalGameView,

    properties: {
        TAG: {
            override: true,
            default: "FriendGameView",
        },

        STANDUP_DIALOG_VIEW_ZORDER: 100,
    },

    init(params) {
        this._super(params);

        qf.platform.uploadEventStat({
            "module": "share",
            "event": qf.rkey.PYWXDDZ_EVENT_SHARE_POP,
            "custom": {
                scene: qf.const.ShareScene.GAME,
                share_type: qf.const.SHARE_DIALOG.FRIEND,
            }
        });

        this.initBtn();
    },

    //侦听组件派发事件
    initComponentEvent() {
        this._super();

        this.Menu.node.on(qf.ekey.DDZ_MENU_STANDUP, this.standupBtnFun, this);
    },

    //初始化各种按钮
    initBtn() {
        this.panel_wx_share = qf.utils.seekNodeByName("panel_wx_share", this.node);//微信邀请好友面板
        this.panel_wx_share.active = true;
        this.panel_wx_share.enable = false;

        this.btn_invite_wx = qf.utils.seekNodeByName("btn_invite_wx", this.node);//微信邀请好友
        this.btn_invite_wx.active = true;
        if (this.btn_invite_wx) {
            qf.utils.addTouchEvent(this.btn_invite_wx, () => {
                qf.cache.global.setStatUploadTime(qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_CUSTOM_DESK_INVITE);
                this.shareToWX();
            });
        }

        this.btn_open_room = qf.utils.seekNodeByName("btn_open_room", this.node);//新開桌子
        this.btn_open_room.active = false;
        if (this.btn_open_room) {
            qf.utils.addTouchEvent(this.btn_open_room, () => {
                //let room_name = qf.cache.desk.getDeskName();
                let battle_type = qf.cache.desk.getBattleType();
                let max_round = qf.cache.desk.getMaxRound();
                let cap_score = qf.cache.desk.getCapScore();
                let allow_view = qf.cache.desk.getAllowView();
                let typeStr = qf.txt.room_battle_type_name[battle_type];
                let allowStr = qf.txt.tip_notAllowView;
                if (allow_view) {
                    allowStr = qf.txt.tip_allowView;
                }
                let openStr = cc.js.formatStr(qf.txt.tip_openRoom, typeStr, allowStr, cap_score, max_round);
                qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                    sureCb: () => {

                        qf.event.dispatchEvent(qf.ekey.LORD_REQUEST_VIEWER_CREATE_DESK);
                    }, isModal: false, content: openStr
                });
            });
        }

        this.btn_observe = qf.utils.seekNodeByName("panel_standupViewers", this.node);//旁观列表
        this.btn_observe.active = false;
        if (this.btn_observe) {
            qf.utils.addTouchEvent(this.btn_observe, () => {
                // qf.dm.push({ prefab: qf.res.prefab_watcher_view, script: 'watcherview', loadded_data: true });
                // qf.dm.pop();
            });
        }

        let idArr = [
            qf.const.MenuItemId.EXIT,
            qf.const.MenuItemId.STANDUP,
            qf.const.MenuItemId.SET
        ];
        this.Menu.updateMenuItem(idArr);

        this.btn_sitdown = qf.utils.seekNodeByName("btn_sitdown", this.node);//坐下
        this.btn_sitdown.active = false;
        if (this.btn_sitdown) {
            //  addButtonEvent(this.btn_sitdown,  ()=>{
            // });
        }

        this.imgHead_standupUser = qf.utils.seekNodeByName("img_Bg_watchers", this.node);
        this.lblStandupNum = qf.utils.seekNodeByName("lbl_watchers_num", this.node);


        for (let k = 0; k <= this.seatLimit - 1; k++) {//处理坐下按钮
            let userSitDown = this.getUserSitDownByIndex(k);
            qf.utils.addTouchEvent(userSitDown, (sender) => {
                let index = sender.index;
                let seatId = this.getSeatIdByIndex(index);
                qf.event.dispatchEvent(qf.ekey.DDZ_USER_SITDOWN_REQ, { seat_id: seatId });//
                qf.cache.global.setStatUploadTime(qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_SIT_DOWN);
            });

        }

        // 邀请有礼按钮
        this.btn_invite.active = false;
        this.btn_task.active = false;
        // if (!this.isQueryEnter )//是房主自己 而且 不是查询  才自动邀请
        //     this.autoInvite();//自动邀请
    },

    //重写 初始化隐藏显示ui
    initShowOrHideUI() {
        this._super();

        qf.utils.seekNodeByName("panel_wx_share", this.node).active = true;
        qf.utils.seekNodeByName("img_ju_bg", this.node).active = true;

        qf.utils.seekNodeByName("btn_counter", this.node).active = false;
        qf.utils.seekNodeByName("panel_counter", this.node).active = false;
        this.btn_task.active = false;
    },

    standupBtnFun() {
        qf.event.dispatchEvent(qf.ekey.DDZ_USER_STAND_REQ);
        qf.cache.global.setStatUploadTime(qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_STAND_UP);
    },

    //重写 设置取消托管按钮的隐藏和显示
    setCancelAutoPlayVisible(visible) {
        this._super(visible);
    },

    //override
    updateTableBtns() {
        let status = qf.const.UserStatus.USER_STATE_DEFAULT;
        let my_user = qf.cache.desk.getUserByUin(qf.cache.user.uin);
        if (my_user) status = my_user.status;

        let userListLength = qf.cache.desk.getUserListLength();
        if (userListLength === this.seatLimit) {//满员 隐藏微信分享
            this.panel_wx_share.active = false;
            if (status === qf.const.UserStatus.USER_STATE_SIT_UNREADY)
                qf.event.dispatchEvent(qf.ekey.UPDATE_BEGIN_BUTTONS);//满员时且是未准备状态  显示开始明牌 开会游戏按钮
        } else {
            this.panel_wx_share.active = true;
            qf.event.dispatchEvent(qf.ekey.HIDE_ALL_BTNS);//未满员时  隐藏所有操作按钮
        }

        if (status <= qf.const.UserStatus.USER_STATE_STAND) {//站起时  显示旁观列表，新开房间，隐藏站起，记牌器。
            // this.btn_observe.active = true);

            let idArr = [
                qf.const.MenuItemId.EXIT,
                qf.const.MenuItemId.SET
            ];
            this.Menu.updateMenuItem(idArr);

            this.btn_open_room.active = true;
            this.counterBtn.active = false;
            this.btn_chat.active = false;
        } else {//在座位上 隐藏旁观列表 新开房间  显示站起，记牌器
            this.btn_observe.active = false;

            let idArr = [
                qf.const.MenuItemId.EXIT,
                qf.const.MenuItemId.STANDUP,
                qf.const.MenuItemId.SET
            ];
            this.Menu.updateMenuItem(idArr);

            this.btn_open_room.active = false;
            this.counterBtn.active = true;
            this.btn_chat.active = true;
        }

        this.showTheStandUpWatchersPanel();
        this.showInviteAndSeatBtn();

    },

    updateResultValue() {
        let resultInfo = qf.cache.desk.getResultList();
        for (let k in resultInfo) {
            let v = resultInfo[k];
            let u = this.getUser(v.uin);
            if (u) {
                u.updateResultValue(v.score);
            }
        }
    },

    autoInvite() {   //自动邀请
        Util.targetDelayRun(this, 1.0, () => {
            // 调到微信邀请界面
            let userListLength = qf.cache.desk.getUserListLength();
            logd(" userListLength:" + userListLength);
            if (userListLength == this.seatLimit) { //满员
                loge("not autoInvite");
            }
            else {
                if (qf.cache.desk.master_uin === qf.cache.user.uin) {
                    this.shareToWX();
                }
            }
        });
    },

    shareToWX() {   //邀请
        let data = "type=" + qf.const.LaunchOptions.TYPE_FRIEND_FROOM_INVITE + "&fromUin=" + qf.cache.user.uin + "&desk_id=" + qf.cache.desk.desk_id + "&room_id=" + qf.cache.desk.room_id;
        logd("shareMessage  query:" + data)
        let title = qf.txt.stringShareTitle;//默认标题
        let imgUrl = qf.res.share_banner_normal_game;//默认图片
        let id = -1;

        qf.net.send({
            cmd: qf.cmd.GET_SHARE_INFO_REQ
            , body: { share_type_str: qf.const.SHARE_STRING_KEY.FRIEND_ROOM_SHARE_300 }
            , callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        if (!model) return;

                        let shareInfo = model.share_info;
                        if (shareInfo && shareInfo.icon && shareInfo.share_id) {
                            imgUrl = shareInfo.icon;
                            title = shareInfo.str;
                            id = shareInfo.share_id;
                        }

                        //数据上报
                        qf.platform.uploadEventStat({   //用户点击好友邀请
                            "module": "share",
                            "event": qf.rkey.PYWXDDZ_EVENT_SHARE_CLICK_SHARE_BTN,
                            "custom": {
                                scene: qf.const.ShareScene.GAME,
                                via: qf.const.ShareMsgType.GAMEINVITE,
                                img_id: id
                            }
                        });
                        function shareSuccess() {
                            qf.platform.uploadEventStat({   //用户点击立即邀请
                                "module": "share",
                                "event": qf.rkey.PYWXDDZ_EVENT_SHARE_SUCCESS,
                                "custom": {
                                    scene: qf.const.ShareScene.GAME,
                                    via: qf.const.ShareMsgType.GAMEINVITE,
                                    img_id: id
                                }
                            });
                        }
                        qf.platform.shareMessage({
                            imageUrl: imgUrl,
                            title: title,
                            shareId: id,
                            query: "type=" + qf.const.LaunchOptions.TYPE_FRIEND_FROOM_INVITE + "&fromUin=" + qf.cache.user.uin + "&desk_id=" + qf.cache.desk.desk_id + "&room_id=" + qf.cache.desk.room_id,
                            scb: (res) => {
                                shareSuccess();
                            }
                        });
                    }
                });
            }
        });
    },

    //override 玩家站起
    userStandUp(seat_id) {
        let op_uin = qf.cache.desk.getOpUin();

        if (op_uin == qf.cache.user.uin) {//是自己站起  处理
            this.adjustByAllUser();
        }
        else {
            let user_widget = this.getUserWidgetByBySeatId(seat_id);
            if (user_widget) user_widget.hide();
            this.showInviteAndSeatBtn();
        }
        this.updateTableBtns();
    },

    //override 玩家坐下
    userSitDown(paras) {
        let op_uin = qf.cache.desk.getOpUin();
        if (op_uin == qf.cache.user.uin) {//是自己坐下  处理
            this.adjustByAllUser();
        }
        else {//别人坐下
            let userWidget = this.getUser(op_uin);
            if (userWidget) {
                userWidget.update(op_uin);
                userWidget.updateStatus(op_uin);
            }
            this.showInviteAndSeatBtn();
        }
        this.updateTableBtns();
    },

    //override 调整所有位置
    adjustByAllUser(paras) {
        for (let k = 0; k <= this.seatLimit - 1; k++) {
            let user_widget = this.getUserByIndex(k);
            if (user_widget) user_widget.hide();
        }
        let userList = qf.cache.desk.getUserList();
        this.updateMeIndex(userList);
        for (let k in userList) {
            let u = userList[k];
            let user_widget = this.getUser(u.uin);
            if (user_widget) {
                user_widget.update(u.uin);
                user_widget.updateStatus(u.uin);
            }
        }
        this.showInviteAndSeatBtn();
    },
    //override
    showInviteAndSeatBtn(paras) {
        let me_status = qf.const.UserStatus.USER_STATE_DEFAULT;
        let user = qf.cache.desk.getUserByUin(qf.cache.user.uin);
        if (user) me_status = user.status;
        for (let k = 0; k <= this.seatLimit - 1; k++) {//处理坐下按钮
            let user_widget = this.getUserByIndex(k);
            if (user_widget.hided)  //隐藏的玩家控件显示 坐下按钮
                if (me_status <= qf.const.UserStatus.USER_STATE_STAND)//自己站起时 才看的到 坐下按钮
                    this.getUserSitDownByIndex(k).active = true;
                else
                    this.getUserSitDownByIndex(k).active = false;// 自己状态是坐下时  看不到坐下按钮
            else
                this.getUserSitDownByIndex(k).active = false;
        }
    },
    showTheStandUpWatchersPanel() {
        // this.btn_observe.active = true);

        this.lblStandupNum.getComponent(cc.Label).string = qf.cache.desk.getObserveUserListLength();
        if (qf.cache.desk.getObserveUserListLength() === 0)
            this.btn_observe.active = false;

        let userList = qf.cache.desk.getObserveUserList(); //10 成功
        let index = 0;
        let user = null;
        for (let k in userList) {
            if (index >= 1)
                break;
            user = userList[k];
            index = index + 1;
        }
        this.imgHead_standupUser.zIndex = 2;

        let head_size = this.imgHead_standupUser.getContentSize();
        this._headImg = new UserHead();

        this._headImg.setPosition(this.btn_observe.getContentSize().width / 2, this.btn_observe.getContentSize().height / 2);
        this.btn_observe.addChild(this._headImg, 1);
        if (user)
            this._headImg.updateHead(user.sex, head_size.width - 5, user.portrait);
    },

    setBtnAutoPlayVisible(visible) {
        let idArr = [
            qf.const.MenuItemId.EXIT,
            qf.const.MenuItemId.SET
        ];

        let uMine = qf.cache.desk.getOnDeskUserByUin(qf.cache.user.uin);
        if (uMine) {
            if (uMine.status > qf.const.UserStatus.USER_STATE_STAND) {
                idArr = [
                    qf.const.MenuItemId.EXIT,
                    qf.const.MenuItemId.STANDUP,
                    qf.const.MenuItemId.SET
                ];
            }
        }

        this.Menu.updateMenuItem(idArr);
    },

    updateChangeDesk() {
        this.BM.updateChangeTableBtns(false);
    },

    getBtnObservePos() {
        return this.btn_observe.getPosition();
    },

    //显示记牌器
    onClickCounter(sender) {
        return
        let card_counter = qf.cache.desk.getCardCounter();
        //好友房免费使用
        let u = qf.cache.desk.getUserByUin(qf.cache.user.uin);
        if ((u && u.status === qf.const.UserStatus.USER_STATE_INGAME) && (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME)) {
            //打牌阶段
            if (card_counter.remain_list && card_counter.remain_list.length > 0) {
                this.showCounter();
            }
        } else {
            //非打牌阶段
            qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.txt.table_counter_tip1 });
        }

    },

    //更新记牌器
    updateCounter() {
        qf.utils.seekNodeByName("panel_counter", this.node).active = false;
        return

        let card_counter = qf.cache.desk.getCardCounter();
        qf.utils.seekNodeByName("img_counter_red", this.node).active = false;
        qf.utils.seekNodeByName("img_counter_share", this.node).active = false;
        //剩余牌数
        if (card_counter.remain_list && card_counter.remain_list.length > 0) {
            for (let i = 0; i < card_counter.remain_list.length; i++) {
                let v = card_counter.remain_list[i];
                let numImg = qf.utils.seekNodeByName("img_counter_num" + (i + 1), this.node);
                numImg.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.table, qf.tex["table_pic_countNum" + v]);
            }
        }
        else {
            this.counterBg.active = false;
        }
    },

    //显示记牌器
    showCounter(type) {//不传参取相反，传参：1显示，2不显示
        qf.utils.seekNodeByName("panel_counter", this.node).active = false;
        return

        let u = qf.cache.desk.getUserByUin(qf.cache.user.uin);
        let card_counter = qf.cache.desk.getCardCounter();
        if ((u && u.status === qf.const.UserStatus.USER_STATE_INGAME) && (qf.cache.desk.getStatus() === qf.const.LordGameStatus.GAME_STATE_INGAME) &&
            (card_counter.remain_list && card_counter.remain_list.length > 0)) {//好友房免费使用
            //打牌阶段
            let visible = !(this.counterBg.isVisible());
            if (type === 1) {
                visible = true;
            }
            else if (type === 2) {
                visible = false;
            }
            this.counterBg.active = visible;
        }
        else {
            this.counterBg.active = false;
        }
    },

    //加倍阶段自动显示记牌器/分享
    autoShowCounterOrShare() {
        this.showCounter(1);
    },

    //override
    setRunTxtVisible(visible) {
        this.panelRunTxt.active = false;
    },

    //更新赛事活动界面
    updateEventActivityDialog() {

    },

    showStandUpGuide() {
        qf.event.dispatchEvent(qf.ekey.SHOW_GUIDE_VIEW, {
            btn: [this.user_sitdown0, this.user_sitdown1, this.user_sitdown2, this.btn_open_room],
            btnResUrl: [qf.tex.table_pic_sitdown, qf.tex.table_pic_sitdown, qf.tex.table_pic_sitdown, qf.tex.table_btn_open_room],
            isSpriteFrame: [true, true, true, true],
            type: qf.const.GUIDE_TYPE.FRIEND_STANDUP,
            text: qf.txt.friend_guide_2,
            isClose: true,
            finger: false,
            fingerOffset: cc.v2(120, 500)
        })
    },

    //override
    exitBtnFun() {
        let txtTips = qf.txt.exit_desk_ready_tip;

        let u = qf.cache.desk.getUserByUin(qf.cache.user.uin);
        if (u && u.status === qf.const.UserStatus.USER_STATE_INGAME)
            txtTips = qf.txt.exit_desk_playing_tip;

        qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
            sureCb: () => {
                qf.event.dispatchEvent(qf.ekey.LORD_NET_EXIT_DESK_REQ);
            }, isModal: false, content: txtTips
        });
    },
});