
let Model = require("../frameworks/mvc/Model");

cc.Class({
    extends: Model,

    properties: {
        "REDDOT_CHANGE": "reddot_change", //红点变更
    },

     //更新小红点信息
    updateRedDot(infos) {
        if (infos){
            for (let info of infos) {
                this.updateRedDotByType(info.is_show,info.red_dot_type,info.show_amount);
            }
        }

        this.emit(this.REDDOT_CHANGE);
    },

    //按类型区分小红点
    updateRedDotByType(is_show,type,show_amount) {
        this.redDotInfo = this.redDotInfo || [];

        let isHas = false;
        for (let k in this.redDotInfo) {
            let info = this.redDotInfo[k];
            if(info.red_dot_type === type){
                info.is_show = is_show;
                info.show_amount = show_amount;
                isHas = true;
            }
        }
        if(!isHas){
            let data = {
                red_dot_type:type, //小红点类型 1: 邮件小红点 2: 系统消息小红
                is_show:is_show,  //小红点变化 0: 不展示 1: 展示
                show_amount:show_amount
            };
            this.redDotInfo.push(data);
        }
    },

    //按类型获取小红点
    getRedDotByType(type) {
        this.redDotInfo = this.redDotInfo || [];

        for (let info of this.redDotInfo) {
            if(info.red_dot_type === type){
                return info.is_show === 0;
            }
        }
        return false;
    },

    getRedDotNumByType(type) {
        this.redDotInfo = this.redDotInfo || [];

        for (let info of this.redDotInfo) {
            if(info.red_dot_type === type){
                return info.show_amount;
            }
        }
        return null;
    },
})