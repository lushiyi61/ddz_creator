/*
游戏主界面抽象类，所有游戏主场景的基类
*/
let View = require("../../frameworks/mvc/View");

cc.Class({
    extends:View,

    properties: {
        MIN_SLIDE_LEN: 50,    //滑动出现界面的最小长度
        MENU_ZORDER: 10,	//菜单的层级
    },

    init() {
        this.winSize = cc.winSize;
        
        qf.pokerpool.initPool();

        this.initPublicModule();
    },

    //初始化公共部分，公共部分的UI名称在不同游戏场景下必须保持一致，该方法必须需在派生类构造函数中调用
    initPublicModule () {
    },

});