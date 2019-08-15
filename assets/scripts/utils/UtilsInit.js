
let Utils       = require("./Utils");
let Strings     = require("./Strings");
let Functions   = require("./Functions");

cc.Class({

    statics: {
        init(qf) {

            qf.utils    = new Utils();
            qf.string   = new Strings();
            qf.func     = new Functions();

        }
    }

});