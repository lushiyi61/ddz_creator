let PokerAnimation = require("../PokerAnimation");
cc.Class({
    extends: cc.Component,

    ctor() {
        this.pokerAnimation = new PokerAnimation();
    },

    //更新显示牌
    updateShowCard(cards, index) {
        if(cards.length === 0) return;

        let cardNodes = [];
        let count = 0;

        for(let k in cards) {
            let v = cards[k];
            let p = qf.pokerpool.take({id: v, resType: qf.const.NEW_POKER_TYPE.OTHERSHOW});
            count++;
            cardNodes[k] = p;
            p.unDizhu();
        }

        qf.pokerutil.sortPokers(cardNodes);

        let userList = qf.cache.desk.getUserList();

        for (let uin in userList) {
            let v = userList[uin];
            let u = qf.cache.desk.getUserByUin(uin);
            let id = this.getUserIndexBySeatId(u.seat_id);
            if (id === index) {
                if(qf.cache.desk.getLordUin() === index){
                    cardNodes[count - 1].setDizhu(0);
                }
            }
        }

        this.pokerAnimation.showLastAnimation(cardNodes, index, this, false);
    },

    getPokerAnimation() {
        return this.pokerAnimation;
    }
})