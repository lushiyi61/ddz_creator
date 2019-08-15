/*
游戏controller抽象类，所有游戏controller的基类
*/

let Controller = require("../../frameworks/mvc/Controller");

cc.Class({
    extends: Controller,

    initGlobalEvent() {

        //游戏内前后台切换
        qf.event.on(qf.ekey.GAME_ACTION_EVENT, this.processGameActionsEvt, this);

        //切出牌桌
        qf.event.on(qf.ekey.EXIT_LORD_GAME, this.exitGame, this);

        //登陆成功后的处理流程
        qf.event.on(qf.ekey.LOGIN_SUCCESS_IN_GAME, this.loginScuessInGame, this);
    },

    initModuleEvent() {
        //聊天消息通知
        this.addModuleEvent(qf.ekey.NET_CHAT_NOTICE_EVT, this.processGameChatEvt);

        //进入牌桌通知
        this.addModuleEvent(qf.ekey.LORD_NET_ENTER_DESK_NOTIFY, this.processInputGameEvt);
    },

    //所有子类都必须实现该方法
    processInputGameEvt(parameters) {
        var self = this;

        //移除全屏等待
        qf.event.dispatchEvent(qf.ekey.GLOBAL_REMOVE_WAITING);

        //进桌成功，移除Toast
        qf.event.dispatchEvent(qf.ekey.GLOBAL_REMOVE_TOAST);

    },

    //登录成功后的自动进桌处理流程
    loginScuessInGame(paras) {
        var self = this;
        loge("----------------------------------loginScuessInGame--------------------------------------");
        if (!self.view) return;
        var loginInfo = ModuleManager.getModule("LoginController").getModel().getLoginInfo();
        if (loginInfo.desk_id && loginInfo.desk_id > 0) {
            self.queryDesk();
        }
    },

    //前后台切换
    processGameActionsEvt(paras) {
        var self = this;
        if (!self.view) return;

        logd(` ---- APPLICATION_ACTIONS_EVENT ${paras.type} ---- `);

        if (paras.type === "show") {
            qf.event.dispatchEvent(qf.ekey.GLOBAL_REMOVE_TOAST);
            if (qf.net.isConnected() && qf.cache.desk_mode) {
                self.onSpecailDeskShow();
            }
            self.processAudioResumeFromBg();
        } else if (paras.type === "hide") {
            //清除网络消息的回调事件
            self.clearModuleEvent();
            self.processAudioPauseToBg();
        }

    },

    //切后台后来，不同场景特殊处理
    onSpecailDeskShow() {
        qf.event.dispatchEvent(qf.ekey.EVT_QUERY_DESK);
    },

    processAudioResumeFromBg() {
        qf.music.setEffectMute(false);
        qf.music.resumeMusic();
    },

    processAudioPauseToBg() {
        //音效处理
        qf.music.pauseMusic();
    },

    //退桌前的处理
    exitGame(args) {
        var self = this;
        logd("---------------------------exitGame---------------------------");
        if (!self.view) return;
        qf.music.stopMusic();
        // TODO 音效资源
        // qf.music.playMusic(qf.res.lord_music.background);   //播放背景乐
        if ((!args) || (!args.notFromGame)) {
            qf.cache.config.updateShowByGame(true);
        }
        // TODO
        // ModuleManager.popGivenModueName("GameController");
        qf.event.dispatchEvent(qf.ekey.EVT_SHOW_HALL);
        //不是回到匹配界面移除结算框
        if ((!args) || (!args.isBackMatch)) {
            qf.event.dispatchEvent(qf.ekey.REMOVE_CLASSIC_OVER_DIALOG);
            qf.event.dispatchEvent(qf.ekey.REMOVE_LUCKY_REWARD_DIALOG);
        }
    },

    //服务端下发游戏内聊天信息得通知，显示聊天气泡
    processGameChatEvt(paras) {

    },

    //override
    onShowView() {
        var self = this;

        qf.event.dispatchEvent(qf.ekey.SHOW_OR_HIDE_BROADCAST, { isVisible: false });
    },

    //override
    isInMatchView(args) {
        var self = this;

        var text = Cache.Config.errorMsg[args.ret] || qf.txt.tip_error_desc_6;
        qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: text });
        qf.event.dispatchEvent(qf.ekey.EXIT_LORD_GAME);
    }
});