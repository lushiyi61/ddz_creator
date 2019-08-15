let LordUser = require("../../components/LordUser");

cc.Class({
    extends: LordUser,

    properties: {
        TAG:{
            override: true,
            default:"EventLordUser"
        }
    },

    onLoad() {
        loge("EventLordUser onLoad")
        this._super();
        if (this._index === this._PLAYER_INDEX.MYSELF) {
            this.lblCoin.scale = 0.7;
            let img_gold_bg = qf.utils.seekNodeByName("img_gold_bg", this.node);
            img_gold_bg.scale = 0.7;
            img_gold_bg.x += 35;
            this.lblCoin.x += 25;
        }
    },

    //override
    //设置抢地主气泡 0:不叫 1:不抢 2:叫地主 3:抢地主 不传参数就不显示
    setRobLordTips(num, maxGrabAction, isSound) {
        if(qf.utils.isValidType(this.statusNode)) {
            if(qf.utils.isValidType(num) && num >= qf.const.CALL_SCORE.ZERO) {
                this.statusNode.active = true;
                var soundStr = "";
                if (num === qf.const.CALL_SCORE.ZERO) {
                    this.setTextureByName("notCall");
                    soundStr = "bujiao";
                }
                else if (num === qf.const.CALL_SCORE.ONE) {
                    this.setTextureByName("oneScore");
                    soundStr = "onescore";
                }
                else if (num === qf.const.CALL_SCORE.TWO) {
                    this.setTextureByName("twoScore");
                    soundStr = "twoscore";
                } else if (num === qf.const.CALL_SCORE.THREE) {
                    this.setTextureByName("threeScore");
                    soundStr = "threescore";
                }
                if(isSound && soundStr && soundStr !== ""){
                    var user = Cache.desk.getUserByUin(this.uin);
                    if(user){
                        var sex = user.sex;
                        qf.music.playMyEffect(soundStr + "_" + sex, false);
                    }
                }

                this.startTipsActionNoAnima();
            } else {
                this.statusNode.setVisible(false);
            }
        }
    },

    //更新分数 override
    updateCoin() {
        if (qf.utils.isValidType(this.lblCoin)) {
            var u = qf.cache.desk.getUserByUin(this._uin);
            if(!qf.utils.isValidType(u)) return;
            var player_score = qf.func.checkint(u.player_score);
            this.lblCoin.string = player_score;
        }

        this.img_gold.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(qf.res.table, qf.tex.table_pic_event_fen);
    },

    //设置段位等级 override
    updateName(u) {
        this.updateLevel(u);
    },

    //更新段位等级 override
    updateLevel(u) {
        if(!qf.utils.isValidType(u.match_level)) return;
        if(qf.utils.isValidType(this.lblPlayerName)) {
            this.lblPlayerName.active = true;
            this.lblPlayerName.getComponent(cc.Label).string = qf.txt.competition_level[u.match_level];
        }
    },
});