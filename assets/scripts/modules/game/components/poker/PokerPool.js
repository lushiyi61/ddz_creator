let Poker = require("./Poker");

cc.Class({
    properties: {
        node_pool: cc.NodePool,
        originalSize: 30, //初始内存池大小
        maxSize: 60 //内存池最大大小
    },

    ctor() {
        this.node_pool = new cc.NodePool();
    },

    initPool() {
        while (this.node_pool.size() <= this.originalSize) {
            this.node_pool.put(this.createPoker());
        }
    },

    createPoker(params) {
        let node = new Poker();
        node.init(params);
        return node;
    },

    //可直接初始化
    take(params) {
        if (this.node_pool.size() > 0) {
            let node = this.node_pool.get();
            node.init(params);
            return node;
        }

        return this.createPoker(params);
    },

    recover(node) {
        if (this.node_pool.size() > this.maxSize) {
            node.parent = null;
            return;
        }
        this.node_pool.put(node);
    },

    clearPool() {
        this.node_pool.clear();
    }
})