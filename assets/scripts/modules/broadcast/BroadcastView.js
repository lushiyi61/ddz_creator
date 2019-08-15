/*
    广播视图
*/

let View = require("../../frameworks/mvc/View");

cc.Class({
    extends: View,

    properties: {
        showTimes: 3,           //目前广播默认播放1次
        initPositionX: 360,     //广播初始化位置
        _broadcastSaveMax: 20,   //广播保存最大条数
        _canShowModule: 0,       //模块是否显示广播标记
    },

    //初始化UI
    initUI() {
        this.root = this.node.getChildByName('root');               //根节点
        this.rtxtContent = cc.find('bg/rtxt_content', this.root);      //文本内容

        this.initTxtPosition();
        this.getLoginBroadcast();
    },

    //初始化响应事件
    initEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.onClick();
        });
    },

    //初始化广播位置
    initTxtPosition() {
        this.rtxtContent.x = this.initPositionX;
    },

    //广播滚动动画
    runBroadcastAction(args) {
        this.rtxtContent.getComponent(cc.RichText).string = args.content;
        var time = (this.rtxtContent.width + this.root.width)/ 200;

        //目前跑马灯默认播放1次
        let times = this.showTimes;
        //commonTimes为重复播放次数
        let commonTimes = times - 1;
        //最后一次动画
        let lastAction = cc.sequence(
                cc.moveTo(time, (-(this.initPositionX + this.rtxtContent.width)),0),
                cc.callFunc(() => {
                    this.initTxtPosition();
                    this.endBroadCast();
                }),
            );
        //重复播放动画
        let commonAction = cc.sequence(
                cc.moveTo(time, (-(this.initPositionX + this.rtxtContent.width)),0),
                cc.callFunc(() => {
                    this.initTxtPosition();
                }),
            );
        let repeatCommonAction = cc.repeat(commonAction, commonTimes);
        if (times === 1)
            this.rtxtContent.runAction(lastAction);
        else
            this.rtxtContent.runAction(cc.sequence(repeatCommonAction, lastAction));
    },

    //获取登录下发跑马灯
    getLoginBroadcast(){
        let broadcastInfo = qf.cache.broadcast.getBroadcastInfo();
        this._broadcast = broadcastInfo;
        if(!this._broadcast) this._broadcast = [];

        for(let k in this._broadcast){
            let v = this._broadcast[k];
            this.enterBroadcast(v, true);
        }
    },

    //跑马灯接口
    //进入这个接口的都是单条进入, 来源有服务器通知跑马灯、登录时服务器下发跑马灯
    enterBroadcast (rsp, loginType) {
        let paras;
        if(rsp.model) paras = rsp.model;
        else paras = rsp;

        let item = {};

        item.level = paras.level;
        item.content = paras.content;
        item.timestamp = paras.timestamp;

        this.processBroadcast(item, loginType);
    },

    //走跑马灯流程
    processBroadcast (item, loginType) {
        if(!loginType) this.addBroadcastItem(item);     //单条跑马灯插入队列 从登录时拿到的数据已在队列不做插入处理
        this.delBroadcastItem();     //单条跑马灯移出队列

        if (!this._showBroadcastIng)
            this.handleBroadcast();      //处理跑马灯
    },

    //插入单条跑马灯
    addBroadcastItem(item){
        let index = 0;
        for(let k in this._broadcast){
            let v = this._broadcast[k];
            //qf.const.BROADCAST_LEVEL qf.const.BROADCAST_TYPE 服务器下发level 100-400 客户端匹配成0-3的等级对比
            if(qf.const.BROADCAST_LEVEL[qf.const.BROADCAST_TYPE[item.level]] >= qf.const.BROADCAST_LEVEL[qf.const.BROADCAST_TYPE[v.level]]){
                index = k;
            }
        }

        //插入队列中同等级的最后一个跑马灯后一个
        if(this._broadcast && item)
            this._broadcast.splice(parseInt(index) + 1, 0, item);
    },

    //移出单条跑马灯
    delBroadcastItem(){
        //递归删除
        this.recursiveDel();
    },

    //递归删除
    recursiveDel(){
        //超过限制条数就移除旧的消息
        if (this._broadcast.length > this.BROADCAST_SAVE_MAX){
            let index = 0;
            for(let k in this._broadcast){
                let v = this._broadcast[k];

                //qf.const.BROADCAST_LEVEL qf.const.BROADCAST_TYPE 服务器下发level 100-400 客户端匹配成0-3的等级对比
                if(qf.const.BROADCAST_TYPE[v.level] === "CONFIG"){
                    index = k;
                    break;
                    //此时获取的index为跑马灯队列中的第一条配置随机跑马灯位置
                }
            }
            //如果没有进入break, 则此刻跑马灯队列没有level为400的跑马灯, 那就index为0从队列中的第一条旧数据开始删除

            //为避免逻辑出错, 导致内存泄露, 这里做一层保险处理
            //删除队列超出限制条数的所有条数, 而不是固定删除1条, 但理论上这里的moreCount会是1
            let moreCount = this._broadcast.length - this.BROADCAST_SAVE_MAX;
            this._broadcast.splice(parseInt(index), moreCount);

            //因为优先从配置随机跑马灯开始删除, 所以有时会出现不够删的情况, 需要判断删完后是否还是超过限制条数
            if(this._broadcast){
                if(this._broadcast.length > this.BROADCAST_SAVE_MAX){
                    this.recursiveDel();
                }
            }
        }
    },

    //处理跑马灯
    handleBroadcast () {
        this._showBroadcastIng = false;

        if(this._broadcast.length > 0){
            let v = this._broadcast[0];
            this._showBroadcastIng = true;
            this.runBroadcastAction({content: v.content});

            //配置的随机跑马灯需要回到队列进行轮播
            if(qf.const.BROADCAST_TYPE[v.level] === "CONFIG") this._broadcast.push(v);
            //播完当前这条就干掉
            this._broadcast.splice(0, 1);
        } else {
            this.hideBroadcast();
        }
    },

    //广播播放结束处理
    endBroadCast () {
        // this.isRuning = false;
        this.handleBroadcast();
    },

    //显示广播
    showBroadcast () {
        if(this._showBroadcastIng){
            this.root.active = true;
        }
    },

    //隐藏广播
    hideBroadcast () {
        this.root.active = false;
    },

    onClick(touch, name) {
        qf.mm.get("broadcast").remove();
    },
});