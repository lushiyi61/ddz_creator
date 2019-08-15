
let Log         = require("./log/Log");
let Net         = require("./net/Net");
let NetUtil     = require("./net/NetUtil");
let MusicPlayer     = require("./music/MusicPlayer");
let LocalStorage    = require("./storage/LocalStorage");
let EventDispatcher = require("./event/EventDispatcher");

cc.Class({

    statics: {
        init(qf) {
            qf.event    = new EventDispatcher();
            qf.storage  = new LocalStorage();
            qf.music    = new MusicPlayer();
            qf.net      = new Net();
            qf.net.util = new NetUtil();

            qf.log = new Log();
            //定义全局函数以方便移植
            window.logd = qf.log.logd.bind(qf.log);
            window.loge = qf.log.loge.bind(qf.log);
            window.logw = qf.log.logw.bind(qf.log);

        }
    }

});