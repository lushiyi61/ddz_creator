/*
    好友房创建房间弹窗
*/

let Dialog = require("../../../frameworks/mvc/Dialog");

cc.Class({
    extends: Dialog,

    properties: {
        CAP_SCORE_1: 32,
        CAP_SCORE_2: 64,
        CAP_SCORE_3: 128,
        MAX_ROUND_1: 6,
        MAX_ROUND_2: 9,
        MAX_ROUND_3: 15,
        ALLOW_VIEW_COULD: 1,
        ALLOW_VIEW_FORBID: 0,
    },

    initData(params) {
        this._super(params);

        this.room_name = "";
        this.battle_type = qf.const.BATTLE_TYPE_NORMAL; //经典玩法
        this.max_round = 6; //默认最大局数6局
        this.cap_score = 32; //默认32分
        this.allow_view = 1; //默认支持旁观
    },

    //初始化UI
    initUI() {
        this.btnClose = qf.utils.seekNodeByName("btn_close", this.node); //关闭按钮

        this.btn_class = qf.utils.seekNodeByName("btn_class", this.node);
        this.btn_unshuffle = qf.utils.seekNodeByName("btn_unshuffle", this.node);
        this.btn_laizi = qf.utils.seekNodeByName("btn_laizi", this.node);
        this.btn_laizi.active = false;
        this.btn_view = qf.utils.seekNodeByName("btn_view", this.node);

        this.btn_max_1 = qf.utils.seekNodeByName("btn_max_1", this.node);
        this.btn_max_2 = qf.utils.seekNodeByName("btn_max_2", this.node);
        this.btn_max_3 = qf.utils.seekNodeByName("btn_max_3", this.node);
        this.btn_max_1.value = this.CAP_SCORE_1;
        this.btn_max_2.value = this.CAP_SCORE_2;
        this.btn_max_3.value = this.CAP_SCORE_3;
        this.max_btns = {
            1: this.btn_max_1,
            2: this.btn_max_2,
            3: this.btn_max_3
        };

        this.btn_number_1 = qf.utils.seekNodeByName("btn_number_1", this.node);
        this.btn_number_2 = qf.utils.seekNodeByName("btn_number_2", this.node);
        this.btn_number_3 = qf.utils.seekNodeByName("btn_number_3", this.node);
        this.btn_number_1.value = this.MAX_ROUND_1;
        this.btn_number_2.value = this.MAX_ROUND_2;
        this.btn_number_3.value = this.MAX_ROUND_3;
        this.numbers_btns = {
            1: this.btn_number_1,
            2: this.btn_number_2,
            3: this.btn_number_3
        };

        this.btn_open = qf.utils.seekNodeByName("btn_open", this.node);
        this.lbl_open_tip = qf.utils.seekNodeByName("lbl_open_tip", this.node);
        this.lbl_open_tip.active = false;

        this.selectGameType(this.btn_class.gameType);
    },

    //初始化点击事件
    initClick() {
        this._super();

        this.gameTypeBtns = [];

        //关闭按钮
        qf.utils.addTouchEvent(this.btnClose, () => {
            this.removeSelf();
        });

        //经典场
        qf.utils.addTouchEvent(this.btn_class, () => {
            this.battle_type = qf.const.BATTLE_TYPE_NORMAL; //经典玩法
            this.selectGameType(this.btn_class.gameType);
        });
        this.btn_class.gameType = qf.cache.config.friend_room_id;
        this.gameTypeBtns.push(this.btn_class);

        if (qf.utils.getFuncIsOpen(qf.const.moduleConfig.UNSHUFFLE) === qf.const.moduleVisible.FALSE) {
            this.btn_unshuffle.active = false;
        } else {
            //不洗牌玩法
            qf.utils.addTouchEvent(this.btn_unshuffle, () => {
                this.battle_type = qf.const.BATTLE_TYPE_UNSHUFFLE; //不洗牌玩法
                this.selectGameType(this.btn_unshuffle.gameType);
            });
            this.btn_unshuffle.gameType = qf.cache.config.friend_room_id_no_shuffle;
            this.gameTypeBtns.push(this.btn_unshuffle);
            this.btn_unshuffle.active = true;
        }

        // 癞子玩法
        qf.utils.addTouchEvent(this.btn_laizi, () => {

        })

        //是否旁观
        qf.utils.addTouchEvent(this.btn_view, () => {
            if (this.allow_view === this.ALLOW_VIEW_COULD) { //允许旁观
                this.allow_view = this.ALLOW_VIEW_FORBID;
                this.btn_view.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.btn_duoxuan1);
            } else {
                this.allow_view = this.ALLOW_VIEW_COULD;
                this.btn_view.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.btn_duoxuan2);
            }
        });

        //创建
        qf.utils.addTouchEvent(this.btn_open, () => {
            this.removeSelf();
            let cm_data = { name: this.room_name, battle_type: this.battle_type, max_round: this.max_round, cap_score: this.cap_score, allow_view: this.allow_view };

            let body = {
                room_id: this.gameType,
                desk_id: 0,
                entry_type: 0,
                start_type: qf.const.START_MODE_NORMAL,
                just_view: 0,
                desk_mode: qf.const.DESK_MODE_FRIEND,
                new_desk: 1,
                cm_data: cm_data,
            };
            let createFunc = (args) => {
                qf.event.dispatchEvent(qf.ekey.NET_INPUT_REQ, { body: args });
            };
            //createFunc(body);
            //检查是否有未完成对局后在创建房间
            qf.event.dispatchEvent(qf.ekey.ROOM_CHECK, {
                roomid: this.gameType,
                data: body,
                roomCheckCallBack: createFunc
            });

            // let key = qf.rm.getIsFirstLoad() ? qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_CLICK_CREATE_ROOM_FIRST_LOAD:
            //     qf.rkey.PYWXDDZ_EVENT_PERFORMANCE_CREATE_DESK_ENTER;
            // qf.cache.globalInfo.setStatUploadTime(key);
        });
        for (let k in this.max_btns) { //封顶分数
            let v = this.max_btns[k];
            qf.utils.addTouchEvent(v, (sender) => {
                for (let i in this.max_btns) { //封顶分数
                    let button = this.max_btns[i];
                    button.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.btn_danxuan1);
                }
                this.cap_score = sender.value;
                v.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.btn_danxuan2);
            });
        }

        for (let k in this.numbers_btns) { //局数
            let v = this.numbers_btns[k];
            qf.utils.addTouchEvent(v, (sender) => {
                for (let i in this.numbers_btns) { //封顶分数
                    let button = this.numbers_btns[i];
                    button.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.btn_danxuan1);
                }
                this.max_round = sender.value;
                v.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.btn_danxuan2);
            });
        }
    },

    selectGameType(index) {
        if (this.gameType === index) {
            return;
        }
        this.gameType = index;
        for (let k in this.gameTypeBtns) {
            let v = this.gameTypeBtns[k];
            let bg = v.getChildByName("btn_sBg");
            if (v.gameType === this.gameType) {
                bg.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.create_room_selectbg2);
            } else {
                bg.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.tex.create_room_selectbg1);
            }
        }
    },

});