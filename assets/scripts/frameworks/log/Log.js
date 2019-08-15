/*
日志
项目中的所有log需求，都应使用这个类
*/

cc.Class({

    logd(content, tag) {
        var self = this;
        cc.log(self.formatTag(tag), content);
    },

    logw(content, tag) {
        var self = this;
        cc.warn(self.formatTag(tag), content);
    },

    loge(content, tag) {
        var self = this;
        cc.error(self.formatTag(tag), content);
    },

    //必须不能使用[]，否则无法log
    formatTag(tag) {
        var tagStr = "";
        if (tag) {
            tagStr = "(" + tag + ")";
        }
        return tagStr;
    }
});