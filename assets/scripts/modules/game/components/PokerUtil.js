/**
 * 扑克牌相关方法
 */
cc.Class({
    properties: {},

    ctor() {
        this.ws = cc.winSize;
        this.handCardsPos = { x: this.ws.width * 0.50, y: this.ws.height * 0.153 };
        this.maxLen = this.getPokerLen(qf.pokerconfig.maxRowPokerNum);
        this.sortType = "value";	//排序方式
    },

    getPosXByPoker(paras) {
        let len = this.getPokerLen(paras.total);
        return (qf.dev_size.w - len) * 0.5 + qf.pokerconfig.pokerWidth * 0.5 + (paras.index - 1) * qf.pokerconfig.pokerDistance;
    },

    getHandCardsPosY() {
        return this.handCardsPos.y;
    },

    getHandCardsPosX() {
        return this.handCardsPos.x;
    },

    getHandCardsPos() {
        return this.handCardsPos;
    },

    //取得所有扑克的累计宽度
    getPokerLen(total) {
        if (total <= 0) return 0;
        let num = total;
        if (total >= qf.pokerconfig.maxRowPokerNum)
            num = qf.pokerconfig.maxRowPokerNum;

        return (num - 1) * qf.pokerconfig.pokerDistance + qf.pokerconfig.pokerWidth;
    },

    sortPokers(pokers) {
        if (this.sortType === "value")
            this.sortPokersByValue(pokers)
        else if (this.sortType === "xxxx")
            this.sortPokersByXXXX(pokers);
    },

    sortPokersByValue(pokers) {
        //不稳定排序，会导致弹出的牌位置错乱，慎用
        pokers.sort((p1, p2) => {
            return p2.id - p1.id;
        })
    },

    //其他的排序方式
    sortPokersByXXXX(pokers) {

    },
})