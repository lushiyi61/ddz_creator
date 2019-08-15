let Dialog = require("../../../../frameworks/mvc/Dialog");

cc.Class({
    extends: Dialog,

    properties: {
        userHeadWidth: 106,
        HEAD_TAG: 1001,
    },

    initUI() {
        this.nodeTimer = new cc.Node();
        this.addChild(this.nodeTimer);
        this.txtWait = qf.utils.seekNodeByName("txt_wait", this.node).getComponent(cc.Label);
        this.bmlTime = qf.utils.seekNodeByName("bml_time", this.node).getComponent(cc.Label);
        this.panUser = {};
        for (let k = 0; k <= 2; k++) {
            this.panUser[k] = qf.utils.seekNodeByName("pan_user" + k, this.node);
            this.panUser[k].imgHeadGray = this.panUser[k].getChildByName("img_head_gray");
            this.panUser[k].imgHead = this.panUser[k].getChildByName("img_head");
            this.panUser[k].imgCircle = this.panUser[k].getChildByName("img_circle");

            this.panUser[k].imgHeadGray.active = true;
            this.panUser[k].imgHead.active = false;
            this.panUser[k].imgCircle.active = false;

            let repeateAction = cc.repeatForever(
                cc.rotateBy(1, 360)
            );
            this.panUser[k].imgCircle.runAction(repeateAction);
        }

        this.btnCancelMatch = qf.utils.seekNodeByName("btn_cancel_match", this.node);

        this.updateWithData();
    },

    initClick() {
        this._super();

        qf.utils.addTouchEvent(this.btnCancelMatch, () => {
            this.removeSelfAndGoBack();
        });
    },

    removeSelfAndGoBack() {
        this.removeSelf();
        //退出桌子，返回到大厅
        qf.event.dispatchEvent(qf.ekey.LORD_NET_EXIT_DESK_REQ);
    },

    onClickSpace() {

    },

    updateWithData() {
        let predictTime = qf.cache.event_desk.getPredictTime();
        let matchingTime = qf.cache.event_desk.getMatchingTime();
        let matchingTimeOut = qf.cache.event_desk.getMatchingTimeOut();
        this.txtWait.string = (cc.js.formatStr(qf.txt.event_match_wait_time, predictTime));
        this.bmlTime.string = (this.formatRemainTime(matchingTime));

        this.startTimer(matchingTime, matchingTimeOut);
        this.refreshUI();
    },

    refreshUI: function (enterUin) {
        let onDeskUserList = qf.cache.event_desk.getUserList();
        let userList = [];
        for (let k in onDeskUserList) {
            let user = onDeskUserList[k];
            if (user.uin === Cache.user.uin)
                userList.push(user);
        }

        for (let k in onDeskUserList) {
            let user = onDeskUserList[k];
            if (user.uin !== Cache.user.uin)
                userList.push(user);
        }

        let index = 0;
        for (let k in userList) {
            let user = userList[k];
            this.panUser[index].imgHeadGray.active = false;
            this.panUser[index].imgHead.active = true;

            this.updateHead(user, this.panUser[index].imgHead);
            this.panUser[index].imgCircle.active = true;
            index++;
        }

        for (let k = index; k <= 2; k++) {
            this.panUser[k].imgHeadGray.active = (true);
            this.panUser[k].imgHead.active = (false);
            this.panUser[k].imgCircle.active = (false);
        }

        if (enterUin && enterUin !== Cache.user.uin)
            this.updateTimerEndTime();
    },

    //初始化头像
    updateHead(u, imgHeadBg) {
        let cs = imgHeadBg.getContentSize();
        let headImg = new UserHead(u.sex, this.userHeadWidth);
        headImg.setPosition(cs.width / 2, cs.height / 2);
        imgHeadBg.addChild(headImg, -1, this.HEAD_TAG);
    },

    /*
    倒计时时间
    格式化时间成：00:00
    */
    formatRemainTime(remainTime) {
        let second = Math.floor(remainTime % 60);
        let minute = Math.floor(remainTime / 60) % 60;
        let ret = "";
        if (minute >= 0) {
            let mStr = minute;
            if (minute < 10)
                mStr = "0" + minute;
            ret = ret + mStr + qf.txt.colonStr;
        }

        if (second >= 0) {
            let sStr = second;
            if (second < 10)
                sStr = "0" + second;
            ret = ret + sStr;
        }

        return ret;
    },

    startTimer(startTime, endTime) {
        this.startTime = startTime;
        this.OriginEndTime = endTime;
        this.endTime = endTime;
        this.nodeTimer.stopAllActions();
        let repeateAction = new cc.RepeatForever(
            new cc.Sequence(
                new cc.CallFunc(function () {
                    if (qf.cache.event_desk && (qf.cache.event_desk.getUserListLength() >= 3 || qf.cache.event_desk.getUserByUin(Cache.user.uin).status !== GameConstants.UserStatus.USER_STATE_SIT_READYED)) {
                        loge("!!!!!!!!!!!!!!!!!!!!!!")
                        //qf.event.dispatchEvent(ET.REMOVE_VIEW_DIALOG, {name: "event_match"});
                        qf.event.dispatchEvent(ET.REMOVE_EVENT_MATCH_DIALOG);
                    }
                    this.startTime = this.startTime + 1;
                    if (this.startTime > this.endTime) {
                        this.nodeTimer.stopAllActions();
                        qf.event.dispatchEvent(ET.GLOBAL_TOAST, { txt: qf.txt.event_match_fail_txt });
                        this.removeSelfAndGoBack();
                    } else {
                        this.bmlTime.string = (this.formatRemainTime(this.startTime));
                    }
                }), new cc.DelayTime(1)));
        this.nodeTimer.runAction(repeateAction);
    },

    //其他人进桌更新匹配结束时间
    updateTimerEndTime() {
        this.endTime = this.startTime + this.OriginEndTime;
    },
});

