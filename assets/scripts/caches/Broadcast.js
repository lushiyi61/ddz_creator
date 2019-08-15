/*
    广播数据缓存
*/

cc.Class({

    //更新广播数据
    updateBroadcastInfo(model) {
        this.broadcastInfo = [];
        let filedname = [
            "level", //等级 100为玩家在赛事中晋级及获得的等级（黄金级别以上） 200.玩家兑换了物品（价值奖券100以上）300.后台自定义添加的文本  400.系统
            "content", //内容
            "timestamp", //时间戳
        ];

        for (let i in model) {
            let data = model[i];
            let info = {}
            for (let k in filedname) {
                let v = filedname[k];
                info[v] = data[v];
            }

            this.broadcastInfo.push(info);
        }

        this.broadcastInfo.sort((a, b) => {
            let bLevel = qf.const.BROADCAST_LEVEL[qf.const.BROADCAST_TYPE[b.level]];
            let aLevel = qf.const.BROADCAST_LEVEL[qf.const.BROADCAST_TYPE[a.level]];
            return aLevel - bLevel; //等级高的排在前面
        });
    },

    //获取广播数据
    getBroadcastInfo() {
        return this.broadcastInfo;
    }

});