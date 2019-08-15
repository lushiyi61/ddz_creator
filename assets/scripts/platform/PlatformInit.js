
let BasicPlatform = require("./BasicPlatform");
let WeChatPlatform = require("./WeChatPlatform");

cc.Class({

    statics: {
        init(qf) {

            qf.platform = CC_WECHATGAME ? new WeChatPlatform() : new BasicPlatform();

        }
    }

});