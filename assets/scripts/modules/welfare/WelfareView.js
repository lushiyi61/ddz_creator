/*
福利界面
*/

let Dialog = require("../../frameworks/mvc/Dialog");

const WELFARE_FLAG = {
    CANTRECEIVE: 0,
    CANRECEIVE: 1
};

const GETREWARD_TYPE = {
    NORMAL: 0,
    DOUBLE: 1,
};

cc.Class({
    extends: Dialog,

    properties: {
        selectIndex: 0, //0 登录礼包
    },

    reqData() {
        qf.event.dispatchEvent(qf.ekey.GET_WELFARE_VIEW_DATA);

        qf.platform.uploadEventStat({
            "module": "share",
            "event": qf.rkey.PYWXDDZ_EVENT_SHARE_POP,
            "custom": {
                scene: qf.const.ShareScene.MAIN,
                share_type: qf.const.SHARE_DIALOG.WELFARE,
            }
        });
    },

    initData(params) {
        this._super(params);

        this.bSetWelfare = false;
        this.bSetWinstreak = false;
        this.bSetTask = false;
    },

    //初始化UI
    initUI() {
        this._super();

        this.initWelfareUI();
        this.initTaskUI();

        this.pan_tab = this.seekNodeByName("pan_tab");
        this.img_winstreak_reddot = this.pan_tab.getChildByName("img_winstreak_reddot");

        this.updateReddot();

        this.updateTab();
    },

    //override
    initEvent() {
        qf.cache.welfare.on(qf.ekey.UPDATE_RED_DOT_LIST, this.updateReddot, this);
        // ModuleManager.getModule("MainController").getModel().addObserver(this);
    },

    initWelfareUI() {
        this.pan_welfare = this.seekNodeByName("pan_welfare");
        this.pan_welfare.active = false;
        this.pan_winstreak = this.seekNodeByName("pan_winstreak");
        this.pan_winstreak.active = false;
        this.pan_task = this.seekNodeByName("pan_task");
        this.pan_task.active = false;

        this.pan_tab = this.seekNodeByName("pan_tab");
        this.btn_welfare = this.pan_tab.getChildByName("btn_welfare");
        this.btn_welfare.zoomScale = 0;
        this.btn_winstreak = this.pan_tab.getChildByName("btn_winstreak");
        this.btn_winstreak.zoomScale = 0;
        this.btn_task = this.pan_tab.getChildByName("btn_task");
        this.btn_task.zoomScale = 0;
        this.img_task_reddot = this.pan_tab.getChildByName("img_task_reddot");

        this.panelDayone = this.seekNodeByName("panel_dayone"); //第一天
        this.panelDaytwo = this.seekNodeByName("panel_daytwo"); //第二天
        this.panelDaythree = this.seekNodeByName("panel_daythree"); //第三天
        this.panelDayfour = this.seekNodeByName("panel_dayfour"); //第四天
        this.panelDayfive = this.seekNodeByName("panel_dayfive"); //第五天
        this.panelDaysix = this.seekNodeByName("panel_daysix"); //第六天
        this.panelDayseven = this.seekNodeByName("panel_dayseven"); //第七天

        this.panelArr = {};
        this.panelArr[1] = this.panelDayone;
        this.panelArr[2] = this.panelDaytwo;
        this.panelArr[3] = this.panelDaythree;
        this.panelArr[4] = this.panelDayfour;
        this.panelArr[5] = this.panelDayfive;
        this.panelArr[6] = this.panelDaysix;
        this.panelArr[7] = this.panelDayseven;

        this.btnClose = this.seekNodeByName("btn_close"); //关闭
        this.btnReceive = this.seekNodeByName("btn_receive"); //领取奖励按鈕
        this.imgReceive = this.seekNodeByName("img_receive"); //领取奖励文字

        //普通领取
        this.txt_normal_get = this.seekNodeByName("txt_normal_get");
    },

    initTaskUI() {

        this.pan_list_view = this.pan_task.getChildByName("pan_list_view");
        this.pan_item = this.pan_task.getChildByName("pan_item");
        this.pan_item.active = false;

        this.initListView();
    },

    initListView() {
        this.task_items = [];

        this.list_view = this.seekNodeByName("pan_list_view");
        this.list_content = this.seekNodeByName("content");
        this.listview = this.pan_list_view.getComponent("ListView");
    },

    //初始化数据
    setView(data) {
        let type = data.type;

        if (type === 0) {
            //登录礼包
            this.selectIndex = 0;
            this.updateTab();
            this.setWelfareData(data);
        } else if (type === 1) {
            //连胜任务
            this.selectIndex = 1;
            this.updateTab();
            this.setWinstreakData(data);
        } else {
            //任务
            this.selectIndex = 2;
            this.updateTab();
            this.setTaskData(data);
        }
    },

    setWelfareData(data) {
        this.pan_task.active = false;
        this.pan_winstreak.active = false;
        this.pan_welfare.active = true;
        this.bSetWelfare = true;

        let giftInfo = data.giftInfo;
        let giftConfig = data.giftConfig;

        if (!giftInfo || !giftConfig) {
            giftInfo = qf.cache.welfare.getGiftInfo();
            giftConfig = qf.cache.welfare.getGiftConfig();
        }

        if (giftInfo.flag === WELFARE_FLAG.CANRECEIVE) {
            this.imgReceive.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_txt_double);
        } else if (giftInfo.flag === WELFARE_FLAG.CANTRECEIVE) {
            this.imgReceive.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_huiselingjiang);
        }
        this.btnReceive.getComponent(cc.Button).interactable = giftInfo.flag === WELFARE_FLAG.CANRECEIVE;
        this.txt_normal_get.active = giftInfo.flag === WELFARE_FLAG.CANRECEIVE;
        this.seekNodeByName("txt_normal_getline").active = giftInfo.flag === WELFARE_FLAG.CANRECEIVE;

        this.giftType = giftInfo.gift_type;

        for (let i in this.panelArr) {
            let j = this.panelArr[i];
            j.active = true;

            let i = parseInt(i);
            j.getChildByName("img_check_bg").active = i === this.giftType;
            j.getChildByName("img_white_mask").active = i < this.giftType;
        }

        for (let k in giftConfig) {
            let v = giftConfig[k];
            let item = this.panelArr[v.days];
            let lbl_coincount = item.getChildByName("lbl_coincount");
            lbl_coincount.fontSize = 22;
            lbl_coincount.getComponent(cc.Label).string = "x" + (v.gold_num || v.diamond_num);

            let img_coinbag_bg = item.getChildByName("img_coinbag_bg");
            if (v.gold_num) {
                img_coinbag_bg.scale = 0.7;
                if (qf.tex.global_coin[v.days]) {
                    img_coinbag_bg.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.global_coin[v.days]);
                }
            } else {
                img_coinbag_bg.scale = 0.9;
                img_coinbag_bg.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.global_diamond[4]);
            }
        }

        if (giftInfo.flag === WELFARE_FLAG.CANTRECEIVE) {
            let todayPanel = this.panelArr[giftInfo.gift_type];
            todayPanel.getChildByName("img_check_bg").active = false;
            todayPanel.getChildByName("img_white_mask").active = true;
        }
    },

    setWinstreakData(data) {
        let model = data.winStreakInfo;

        this.pan_task.active = false;
        this.pan_winstreak.active = true;
        this.pan_welfare.active = false;

        this.bSetWinstreak = true;

        this.seekNodeByName("lbl_winstreak_tips").getComponent(cc.Label).string = qf.txt.welfare_winstreak_tips;

        if (!model) return;

        let canDoneTimes = qf.cache.welfare.getCanDoneTimes();
        this.seekNodeByName("lbl_left_times").getComponent(cc.Label).string = cc.js.formatStr(qf.txt.welfare_winstreak_candonetimes, canDoneTimes);

        let img_ws_item_3 = this.seekNodeByName("img_ws_item_3");
        let img_ws_item_5 = this.seekNodeByName("img_ws_item_5");
        let img_ws_item_7 = this.seekNodeByName("img_ws_item_7");
        let panelArr = [img_ws_item_3, img_ws_item_5, img_ws_item_7];

        for (let k in model) {
            let v = model[k];
            let panel = panelArr[k];

            let icon = panel.getChildByName("img_icon");
            let title = panel.getChildByName("lbl_title");
            let btnStatus = panel.getChildByName("btn_status");
            let imgQw = btnStatus.getChildByName("img_qw");
            let imgDlqtxt = btnStatus.getChildByName("img_dlqtxt");
            let bplblDlq = btnStatus.getChildByName("bplbl_dlq");
            imgQw.active = false;
            imgDlqtxt.active = false;
            bplblDlq.active = false;

            title.getComponent(cc.Label).string = cc.js.formatStr(qf.txt.welfare_winstreak_jlhb, v.name);

            if (canDoneTimes || v.can_pick_times) {
                title.color = cc.color(198, 133, 69);

                if (v.ws_streak === 3) {
                    icon.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_redp_small);
                } else {
                    icon.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_redp_big);
                }

                btnStatus.getComponent(cc.Button).interactable = true;
                if (v.status === qf.const.WIN_STREAK_DETAIL_STATUS.CANRECEIVE) {
                    panel.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_bg_yellow);
                    btnStatus.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.global_btn_new1);
                    imgDlqtxt.active = true;
                    bplblDlq.active = true;
                    bplblDlq.getComponent(cc.Label).string = "x" + v.can_pick_times;

                    btnStatus.status = 0;
                } else {
                    panel.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_bg_white);
                    btnStatus.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_btn_qw);
                    imgQw.active = true;

                    btnStatus.status = 1;
                }
            } else {
                panel.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_bg_gray);

                title.color = cc.color(133, 133, 133);

                if (v.ws_streak === 3) {
                    icon.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_grayp_small);
                } else {
                    icon.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_grayp_big);
                }

                btnStatus.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_pic_ylw);
                btnStatus.status = 2;
                btnStatus.getComponent(cc.Button).interactable = false;
            }

            btnStatus.ws_streak = v.ws_streak;

            qf.utils.addClickEvent(btnStatus, (sender) => {
                if (sender.status === 0) {
                    let ws_streak = sender.ws_streak;
                    qf.event.dispatchEvent(qf.ekey.WIN_STREAK_TASK_QUERY_REQ, { wsStreak: ws_streak });
                    this.removeSelf();
                } else if (sender.status === 1) {
                    qf.event.dispatchEvent(qf.ekey.ROOM_CHECK, {
                        roomCheckCallBack: () => {
                            this.roomCheckCallBack();
                        }
                    })
                } else {
                    return;
                }
            });
        }
    },

    setTaskData(data) {

        this.pan_task.active = true;
        this.pan_winstreak.active = false;
        this.pan_welfare.active = false;

        if (!this.bSetTask) {
            qf.platform.uploadEventStat({
                "module": "performance",
                "event": qf.rkey.PYWXDDZ_EVENT_DAILY_TASK_POP,
            });
        }

        this.bSetTask = true;

        let info = data.taskInfo;
        if (info.length === 0) {
            //没有任务
        } else {
            //显示任务item
            // this.list_view.removeAllItems();
            this.updateListView(info);
        }

        let scrollview = this.pan_list_view.getComponent(cc.ScrollView);
        cc.error("_convertToContentParentSpace=> ", scrollview._convertToContentParentSpace(cc.v2()));
        cc.error(this.pan_list_view.convertToWorldSpaceAR(cc.v2(0, 0)));

        cc.error("scrollview=0=", scrollview.content.getContentSize());
        cc.error("scrollview=1=", scrollview._convertToContentParentSpace(cc.v2(0, scrollview.content.height)));
        cc.error("scrollview=_leftBoundary=", scrollview._leftBoundary);
        cc.error("scrollview=_topBoundary=", scrollview._topBoundary);
    },

    updateListView(data) {
        if (!data || data.length === 0) return;

        data.push(...data);

        this.listview.listener = this.updateTaskItem.bind(this);

        this.listview.setData(data);

        // let item_size = this.pan_item.getContentSize();
        // let content_size = this.list_content.getContentSize();

        // let total_height = item_size.height * data.length;
        // total_height = Math.max(total_height, content_size.height);

        // this.list_content.setContentSize(cc.size(item_size.width, total_height));

        // let y = 0;
        // for (let i = 0; i < data.length; i++) {
        //     let item = this.task_items[i];
        //     if (!item) {
        //         item = cc.instantiate(this.pan_item);
        //         this.list_content.addChild(item);
        //     }
        //     item.active = true;
        //     this.task_items[i] = item;

        //     this.updateTaskItem({ data: data[i], item: item });

        //     y -= item_size.height;
        //     item.position = cc.v2(0, y);

        //     cc.error("===item-yu === ", y);
        // }
    },

    updateTaskItem(args) {
        let data = args.data;
        let item = args.item;

        let pan_icon = item.getChildByName("pan_icon");
        let txt_desc = item.getChildByName("txt_desc");
        let img_process_bg = item.getChildByName("img_process_bg");
        let process_bar = img_process_bg.getChildByName("process_bar");
        let btn_recharge = item.getChildByName("btn_recharge");
        let img_icon_bg = pan_icon.getChildByName("img_icon_bg");
        let img_icon = pan_icon.getChildByName("img_icon");
        let img_item_bg = item.getChildByName("img_item_bg");
        let img_hava_pick = item.getChildByName("img_hava_pick");
        let btn_pick = item.getChildByName("btn_pick");
        let txt_pro_1 = img_process_bg.getChildByName("txt_pro_1");
        let txt_pro_2 = img_process_bg.getChildByName("txt_pro_2");
        let txt_reward_1 = pan_icon.getChildByName("txt_reward_1");
        let txt_reward_2 = pan_icon.getChildByName("txt_reward_2");

        txt_reward_1.active = data.status !== 2;
        txt_reward_2.active = data.status === 2;
        txt_pro_1.active = data.type !== 3;
        txt_pro_2.active = data.type !== 3;
        btn_pick.active = data.type !== 3 && data.status !== 2;
        img_hava_pick.active = data.status === 2;
        btn_recharge.active = data.type === 3 && data.status === 0;
        btn_recharge.getComponent(cc.Button).interactable = data.status === 0;
        img_process_bg.active = data.type !== 3;

        img_item_bg.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_item_bg[data.status]);
        img_icon_bg.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_item_icon[data.status]);
        if (data.task_reward.reward_type !== 1) { //1:金币 2:红包 3:记牌器
            if (data.status === 2) {
                process_bar.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_item_pro_3);
                img_icon.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_item_2[data.task_reward.reward_type]);
            } else {
                process_bar.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_item_pro_1);
                img_icon.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_item_1[data.task_reward.reward_type]);
            }
        } else {
            if (data.status === 2) {
                process_bar.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_item_pro_3);
                img_icon.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_item_coin[data.task_reward.amount_type * 2]);
            } else {
                process_bar.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_item_pro_1);
                img_icon.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_item_coin[data.task_reward.amount_type * 2 - 1]);
            }
        }

        process_bar.percent = data.process / data.condition * 100;
        txt_desc.getComponent(cc.Label).string = data.desc;
        txt_pro_1.getComponent(cc.Label).string = data.process;
        txt_pro_2.getComponent(cc.Label).string = "/" + data.condition;

        if (data.task_reward.reward_type === 2) {
            txt_reward_1.getComponent(cc.Label).string = data.task_reward.amount / 100 + "元";
            txt_reward_2.getComponent(cc.Label).string = data.task_reward.amount / 100 + "元";
        } else {
            txt_reward_1.getComponent(cc.Label).string = "x" + data.task_reward.amount;
            txt_reward_2.getComponent(cc.Label).string = "x" + data.task_reward.amount;
        }

        if (data.type === 3) {
            txt_desc.y = btn_recharge.y;
        } else {
            txt_desc.y = btn_recharge.y + 25;
        }

        // 状态 0:未完成 1: 已完成未领奖 2:已领奖
        if (data.status === 0) {
            txt_desc.color = cc.color(200, 43, 2);
            txt_pro_1.color = cc.color(179, 123, 57);
            txt_pro_2.color = cc.color(200, 43, 2);

            btn_pick.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_btn_1);
            btn_pick.getChildByName("btn_title").getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_txt_go);
        } else if (data.status === 1) {
            txt_pro_1.color = cc.color(200, 43, 2);
            txt_pro_2.color = cc.color(200, 43, 2);
            btn_pick.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_btn_2);
            btn_pick.getChildByName("btn_title").getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.task_txt_pick);
        } else {
            txt_desc.color = cc.color(108, 108, 108);
            txt_pro_1.color = cc.color(108, 108, 108);
            txt_pro_2.color = cc.color(108, 108, 108);
        }

        qf.utils.addClickEvent(btn_pick, () => {
            if (data.status === 1) {
                qf.event.dispatchEvent(qf.ekey.PICK_TASK_REWARD, data);
            } else {
                // 快速开始逻辑
                qf.platform.uploadEventStat({
                    "module": "performance",
                    "event": qf.rkey.PYWXDDZ_EVENT_DAILY_TASK_BTN_GO,
                });
                qf.event.dispatchEvent(qf.ekey.ROOM_CHECK, {
                    roomCheckCallBack: () => {
                        this.roomCheckCallBack();
                    }
                });
            }
        });

        qf.utils.addClickEvent(btn_recharge, () => {
            //充值
            let OS = qf.platform.getPlatformName();
            if (OS === "ios") {
                //暂不支持购买
                qf.event.dispatchEvent(qf.ekey.SHOW_PROMPT_DIALOG, {
                    isModal: false,
                    isOnly: true,
                    content: qf.txt.shop_buy_notsupport
                });
            } else {
                let shopData = qf.cache.config.shop.gold_items;
                if (!shopData || !shopData[0]) return;
                let payInfo = {
                    item_id: shopData[0].item_id,
                    ref: qf.const.SHOP_REF,
                };
                qf.event.dispatchEvent(qf.ekey.GAME_PAY_NOTICE, payInfo);
                qf.platform.uploadEventStat({ //用户尝试付费
                    "module": "reg_funnel",
                    "event": qf.rkey.PYWXDDZ_EVENT_REG_FUNNEL_TRY_PAY,
                    "value": 1
                });
            }
        });
    },

    // 快速开始
    roomCheckCallBack() {
        qf.net.send({
            cmd: qf.cmd.QUICK_START_REQ,
            wait: true,
            body: {
                play_mode: 1
            },
            callback: (rsp) => {
                qf.net.util.rspHandler(rsp, {
                    successCb: (model) => {
                        this.removeSelf();
                        qf.event.dispatchEvent(qf.ekey.CLICK_QUICK_START, {
                            roomId: model.room_id
                        });
                    },
                });
            }
        });
    },

    //领取成功处理
    welfareSuccessRsp(args) {
        let todayPanel = this.panelArr[this.giftType];

        if (todayPanel) {
            todayPanel.getChildByName("img_white_mask").active = true;
            todayPanel.getChildByName("img_check_bg").active = false;
        }

        this.btnReceive.interactable = false;

        this.txt_normal_get.active = false;

        this.seekNodeByName("txt_normal_getline").active = false;

        this.imgReceive.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.welfare_huiselingjiang);

        if (args && args.rewardNum && !args.isShare) {
            qf.event.dispatchEvent(qf.ekey.SHOW_REWARD_DIALOG, { rewardNum: args.rewardNum, day: this.giftType, type: args.type });
        }
    },

    //初始化点击事件
    initClick() {

        this._super();

        //关闭按钮
        qf.utils.addClickEvent(this.btnClose, () => {
            this.removeSelf();
        });

        //领取奖励
        qf.utils.addClickEvent(this.btnReceive, () => {
            qf.event.dispatchEvent(qf.ekey.RECEIVE_GIFT_REQ, { type: GETREWARD_TYPE.DOUBLE });
        });

        qf.utils.addClickEvent(this.txt_normal_get, () => {
            qf.event.dispatchEvent(qf.ekey.RECEIVE_GIFT_REQ, { type: GETREWARD_TYPE.NORMAL });
        });

        qf.utils.addClickEvent(this.btn_welfare, () => {
            if (this.selectIndex === 0) return;

            this.selectIndex = 0;
            this.onClickTab();
        });

        qf.utils.addClickEvent(this.btn_winstreak, () => {
            if (this.selectIndex === 1) return;

            this.selectIndex = 1;
            this.onClickTab();
        });

        qf.utils.addClickEvent(this.btn_task, () => {
            if (this.selectIndex === 2) return;

            this.selectIndex = 2;
            this.onClickTab();
        })
    },

    onClickTab() {
        this.updateTab();

        if (this.selectIndex === 0) {
            if (this.bSetWelfare) {
                this.pan_welfare.active = true;
                this.pan_winstreak.active = false;
                this.pan_task.active = false;
            } else {
                qf.event.dispatchEvent(qf.ekey.GET_WELFARE_DATA_REQ);
            }
        } else if (this.selectIndex === 1) {
            if (this.bSetWinstreak) {
                this.pan_welfare.active = false;
                this.pan_winstreak.active = true;
                this.pan_task.active = false;
            } else {
                qf.event.dispatchEvent(qf.ekey.GET_WINSTREAK_DATA_REQ);
            }
        } else {
            if (this.bSetTask) {
                this.pan_welfare.active = false;
                this.pan_winstreak.active = false;
                this.pan_task.active = true;
            } else {
                qf.event.dispatchEvent(qf.ekey.GET_TASK_DATA_REQ);
            }
        }
    },

    updateTab(index) {
        if (index !== undefined) {
            this.selectIndex = index;
        }
        let btn_title_w = this.pan_tab.getChildByName("btn_title_w");
        let btn_title_s = this.pan_tab.getChildByName("btn_title_s");
        let btn_title_t = this.pan_tab.getChildByName("btn_title_t");

        if (this.selectIndex === 0) {
            this.btn_welfare.scaleX = 1;
            qf.utils.setSpriteFrame(btn_title_w, qf.tex.welfare_welfare_1);
            qf.utils.setSpriteFrame(this.btn_welfare, qf.tex.welfare_btn_tab1);

            qf.utils.setSpriteFrame(btn_title_s, qf.tex.welfare_winstreak_2);
            qf.utils.setSpriteFrame(this.btn_winstreak, qf.tex.welfare_tab_m_1);

            this.btn_task.scaleX = 1;
            qf.utils.setSpriteFrame(btn_title_t, qf.tex.welfare_task_2);
            qf.utils.setSpriteFrame(this.btn_task, qf.tex.welfare_btn_tab2);
        } else if (this.selectIndex === 1) {
            this.btn_welfare.scaleX = -1;
            qf.utils.setSpriteFrame(btn_title_w, qf.tex.welfare_welfare_2);
            qf.utils.setSpriteFrame(this.btn_welfare, qf.tex.welfare_btn_tab2);

            qf.utils.setSpriteFrame(btn_title_s, qf.tex.welfare_winstreak_1);
            qf.utils.setSpriteFrame(this.btn_winstreak, qf.tex.welfare_tab_m_0);

            this.btn_task.scaleX = 1;
            qf.utils.setSpriteFrame(btn_title_t, qf.tex.welfare_task_2);
            qf.utils.setSpriteFrame(this.btn_task, qf.tex.welfare_btn_tab2);
        } else {
            this.btn_welfare.scaleX = -1;
            qf.utils.setSpriteFrame(btn_title_w, qf.tex.welfare_welfare_2);
            qf.utils.setSpriteFrame(this.btn_welfare, qf.tex.welfare_btn_tab2);

            qf.utils.setSpriteFrame(btn_title_s, qf.tex.welfare_winstreak_2);
            qf.utils.setSpriteFrame(this.btn_winstreak, qf.tex.welfare_tab_m_1);

            this.btn_task.scaleX = -1;
            qf.utils.setSpriteFrame(btn_title_t, qf.tex.welfare_task_1);
            qf.utils.setSpriteFrame(this.btn_task, qf.tex.welfare_btn_tab1);
        }
    },

    updateReddot() {
        // if(this.img_task_reddot) {
        //     let reddot = ModuleManager.getModule("MainController").getModel().getRedDotByType(qf.const.RED_DOT_TYPE.TASK);
        //     let num = ModuleManager.getModule("MainController").getModel().getRedDotNumByType(qf.const.RED_DOT_TYPE.TASK);
        //     let txt_task_num = ccui.helper.seekWidgetByName(this.pan_tab,"txt_task_num");

        //     if(num <=0){
        //         this.img_task_reddot.active = false;
        //         txt_task_num.active = false;
        //     } else {
        //         if(reddot) {
        //             this.img_task_reddot.active = true;
        //             txt_task_num.active = true;
        //             txt_task_num.getComponent(cc.Label).string = num;
        //         }
        //         else {
        //             this.img_task_reddot.active = false;
        //             txt_task_num.active = false;
        //         }
        //     }
        // }

        // if(this.img_winstreak_reddot){
        //     let reddot1 = ModuleManager.getModule("MainController").getModel().getRedDotByType(qf.const.RED_DOT_TYPE.WIN_STREAK);
        //     let num1 = ModuleManager.getModule("MainController").getModel().getRedDotNumByType(qf.const.RED_DOT_TYPE.WIN_STREAK);
        //     let txt_winstreak_num = this.pan_tab.getChildByName("txt_winstreak_num");

        //     if(num1 <=0){
        //         this.img_winstreak_reddot.active = false;
        //         txt_winstreak_num.active = false;
        //     } else {
        //         if(reddot1) {
        //             this.img_winstreak_reddot.active = true;
        //             txt_winstreak_num.active = true;
        //             txt_winstreak_num.getComponent(cc.Label).string = num1;
        //         }
        //         else {
        //             this.img_winstreak_reddot.active = false;
        //             txt_winstreak_num.active = false;
        //         }
        //     }
        // }
    },

    onDestroy() {
        // ModuleManager.getModule("MainController").getModel().removeObserver(this);

        qf.cache.welfare.off(qf.ekey.UPDATE_RED_DOT_LIST, this.updateReddot, this);

        this._super();
    },
});