/**
 * 倒计时组件
 */
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.lblTime = cc.find("txt_time", this.node);
        this.lblTime.getComponent(cc.Label).string = "0";
    },

    updateTime(time) {
		this.stopCountDown();

        let leftTime = time;
        this.lblTime = cc.find("txt_time", this.node);
        this.lblTime.getComponent(cc.Label).string = leftTime;

        let _tick = sender => {
            let repeateAction = cc.repeatForever(
                cc.sequence(
                cc.callFunc(() => {
                        leftTime = leftTime - 1;
                        if (leftTime < 0 ){
                            this.stopCountTime();
                        }
                        else{
                            if (leftTime > 0 && leftTime < 4){
                                qf.music.playMyEffect("clock", false);
                            }
                            this.lblTime.getComponent(cc.Label).string = leftTime;
                        }
                    }), cc.delayTime(1)));
                this.node.runAction(repeateAction);
        }

		//先延时0.5秒，再以一秒为间隔计时
		let action = cc.sequence(cc.delayTime(0.5), cc.callFunc(_tick))
		this.node.runAction(action);
	},

	stopCountDown() {
        this.node.stopAllActions();
        this.node.active = false;
	},

	stopCountTime(isOnlyClose) {
        this.stopCountDown();
		if (isOnlyClose || this.getTag() !== qf.cache.user.uin) {return;}
		if((!qf.cache.desk.getIsMySelfOperated()) && (!qf.cache.desk.getIsNextAutoBuChu())) {
			if(qf.cache.desk.isMyTurn() && (!qf.cache.desk.getIsUserAutoPlay(qf.cache.user.uin))) {
				qf.event.dispatchEvent(qf.ekey.LORD_NET_OP_TIME_OUT_REQ);
			}
		}
	},

})