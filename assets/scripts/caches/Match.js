/*
    匹配界面数据缓存
*/

cc.Class({
    properties: {
        roomid: 0,
    },

    updateRoomId(args) {
        this.roomid = args.roomid;
    },

    getRoomId() {
        return this.roomid;
    },
});