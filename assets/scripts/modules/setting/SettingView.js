/*
设置界面
*/

let Dialog = require("../../frameworks/mvc/Dialog");

cc.Class({
    extends: Dialog,

    properties: {
        btn_music_on: cc.Node,
        btn_music_off: cc.Node,

        btn_sound_on: cc.Node,
        btn_sound_off: cc.Node,

        btn_look_on: cc.Node,
        btn_look_off: cc.Node,

        btn_yy_on: cc.Node,
        btn_yy_off: cc.Node,

        btn_chat_on: cc.Node,
        btn_chat_off: cc.Node
    },

    initUI() {
        let self = this;

        self.btn_music_on.active = !!qf.music.music;
        self.btn_music_off.active = !qf.music.music;
        self.btn_sound_on.active = !!qf.music.effect;
        self.btn_sound_off.active = !qf.music.effect;
        self.btn_look_on.active = !!qf.music.look;
        self.btn_look_off.active = !qf.music.look;
        self.btn_yy_on.active = !!qf.music.yy;
        self.btn_yy_off.active = !qf.music.yy;
        self.btn_chat_on.active = !!qf.music.chat;
        self.btn_chat_off.active = !qf.music.chat;
    },

    //初始化按钮点击事件
    initClick () {

        this._super();

        let onClickMusic = ()=>{
            qf.music.music = !qf.music.music;
            this.btn_music_on.active = !!qf.music.music;
            this.btn_music_off.active = !qf.music.music;
            if (qf.music.music) {
                qf.music.resumeMusic();
            }
            else {
                qf.music.stopMusic();
            }
        };
        qf.utils.addTouchEvent(this.btn_music_on, ()=>{
            onClickMusic();
        });
        qf.utils.addTouchEvent(this.btn_music_off, () => {
            onClickMusic();
        });

        let onClickEffect = ()=>{
            qf.music.effect = !qf.music.effect;
            this.btn_sound_on.active = !!qf.music.effect;
            this.btn_sound_off.active = !qf.music.effect;
        };
        qf.utils.addTouchEvent(this.btn_sound_on, () => {
            onClickEffect();
        });
        qf.utils.addTouchEvent(this.btn_sound_off, () => {
            onClickEffect();
        });

        let onClickLook = ()=>{
            qf.music.look = !qf.music.look;
            this.btn_look_on.active = !!qf.music.look;
            this.btn_look_off.active = !qf.music.look;
        };
        qf.utils.addTouchEvent(this.btn_look_on, () => {
            onClickLook();
        });
        qf.utils.addTouchEvent(this.btn_look_off, () => {
            onClickLook();
        });

        let onClickYY = ()=>{
            qf.music.yy = !qf.music.yy;
            this.btn_yy_on.active = !!qf.music.yy;
            this.btn_yy_off.active = !qf.music.yy;
        };
        qf.utils.addTouchEvent(this.btn_yy_on, () => {
            onClickYY();
        });
        qf.utils.addTouchEvent(this.btn_yy_off, () => {
            onClickYY();
        });

        let onClickChat = ()=>{
            qf.music.chat = !qf.music.chat;
            this.btn_chat_on.active = !!qf.music.chat;
            this.btn_chat_off.active = !qf.music.chat;
        };
        qf.utils.addTouchEvent(this.btn_chat_on, () => {
            onClickChat();
        });
        qf.utils.addTouchEvent(this.btn_chat_off, () => {
            onClickChat();
        });
    },

    onClick(touch, name) {
        cc.error(name)
        switch (name) {
            case 'help':
                // Cache.globalInfo.setStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_DESK_SETTING_TAB);
                qf.dm.push({ prefab: qf.res.prefab_setting_help, script: 'SettingHelpView', loadded_data: true });
                qf.dm.pop();
                // let instance = Cache.globalInfo.getStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_DESK_SETTING_TAB);
                // if (instance) {
                //     qf.platform.uploadEventStat({   //牌桌内点击设置-切换页签
                //         "module": "performance",
                //         "event": STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_DESK_SETTING_TAB,
                //         "value": instance,
                //         "custom": GameConstants.PERFORMANCE_CLICK_DESK_SETTING_TAB.HELP,
                //     });
                // }
                qf.log.logd('help');
                break;
            case 'feedback':
                // Cache.globalInfo.setStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_DESK_SETTING_TAB);
                qf.dm.push({ prefab: qf.res.prefab_setting_feedback, script: 'SettingFeedbackView', loadded_data: true });
                qf.dm.pop();
                // let instance = Cache.globalInfo.getStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_DESK_SETTING_TAB);
                // if (instance) {
                //     qf.platform.uploadEventStat({   //牌桌内点击设置-切换页签
                //         "module": "performance",
                //         "event": STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_DESK_SETTING_TAB,
                //         "value": instance,
                //         "custom": GameConstants.PERFORMANCE_CLICK_DESK_SETTING_TAB.FEEDBACK,
                //     });
                // }
                qf.log.logd('feedback');
                break;
            case 'about':
                // Cache.globalInfo.setStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_DESK_SETTING_TAB);
                qf.dm.push({ prefab: qf.res.prefab_setting_about, script: 'SettingAboutView', loadded_data: true });
                qf.dm.pop();
                // let instance = Cache.globalInfo.getStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_DESK_SETTING_TAB);
                // if (instance) {
                //     qf.platform.uploadEventStat({   //牌桌内点击设置-切换页签
                //         "module": "performance",
                //         "event": STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CLICK_DESK_SETTING_TAB,
                //         "value": instance,
                //         "custom": GameConstants.PERFORMANCE_CLICK_DESK_SETTING_TAB.ABOUT,
                //     });
                // }
                qf.log.logd('about');
                break;
            case 'close':
                this.removeSelf();
                qf.log.logd('close');
                break;
            default:
                break;
        }
    }
});

