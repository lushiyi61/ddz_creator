/*
好友房缓存
*/

let NormalDesk = require("./NormalDesk");

cc.Class({
    extends: NormalDesk,

    //更新自定义房间
    updateCustomData(model) {
        let self = this;
        self.cm_data = {};
        if (!model) return;
        let feild = ["name", "battle_type", "max_round", "cap_score", "allow_view"];
        self.copyFiled(model, self.cm_data, feild);
    },

    //站起
    updateCacheByStandup(model) {
        let self = this;
        if (!model) return;
        //更新该操作者的uin
        self.opUin = model.op_uin;
        self.stand_reason = model.reason;
        self.stand_desc = model.desc;
        //更新牌桌玩家的字段
        self.updateUserInfo(model.player_info);
    },
    //坐下
    updateCacheBySitDown(model) {
        let self = this;
        if (!model) return;
        //更新该操作者的uin
        self.opUin = model.op_uin;
        self.sitdown_desk_id = model.desk_id;
        //更新牌桌玩家的字段
        self.updateUserInfo(model.player_info);
    },

    //邀请好友分享数据
    updateInviteShareInfo(model) {
        let self = this;
        if (!model) return;
        self.inviteShareInfo = {}; //好友房邀请分享
        for (let k in model) {
            let v = model[k];
            self.inviteShareInfo[k] = v;
        }
    },

    //获取邀请好友分享数据
    getInviteShareInfo() {
        let self = this;
        return self.inviteShareInfo;
    },

    getLordFirstHandle() {
        return false;
    }
});