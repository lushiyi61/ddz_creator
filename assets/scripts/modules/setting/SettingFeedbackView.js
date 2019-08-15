/*
设置-反馈界面
*/

let Dialog = require("../../frameworks/mvc/Dialog");

cc.Class({
    extends: Dialog,

    properties: {
        inputStr: { default: "", visible: false },
    },

    onClick(touch, name) {
        switch (name) {
            case 'close':
                this.removeSelf();
                break;
            case 'commit':
                if (this.inputStr === "") {
                    qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.txt.feedback_isNotFeedbackLegal });
                } else {
                    qf.event.dispatchEvent(qf.ekey.LORD_FEEDBACK_EVENT, { content: this.inputStr, contact_info: "" });
                }
                break;
            default:
                break;
        }
    },

    onEditingDidBegin(sender) {},

    onEditingDidEnded(sender) {},

    onEditingChanged(inputStr) {
        this.inputStr = inputStr;
    },

});