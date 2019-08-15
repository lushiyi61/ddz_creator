
/*
配置的初始化
*/

cc.Class({

    statics: {
        init(qf) {

            qf.cfg = require("./GameConfig");
            qf.const = require("./GameConstants");

            qf.txt = require("./txt/GameTxt");
            qf.res = require("./res/GameRes");
            qf.tex = require("./res/GameTexture");
            qf.res64 = require("./res/GameResBase64");
            qf.resclassify  = require("./res/GameResClassify");

            qf.cmd  = require("./CMD");
            qf.ekey = require("./EventKey");
            qf.rkey = require("./ReportKey");
            qf.skey = require("./StorageKey");
        }
    }

});