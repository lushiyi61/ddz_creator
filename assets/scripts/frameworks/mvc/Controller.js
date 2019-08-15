
/*
控制器基类
*/

cc.Class({
    properties: {
        _view: null,
        view: {
            get() {
                return this._view;
            }
        },

        root: {
            get() {
                return qf.layer.view;
            }
        },

        _events: [],
    },

    ctor() {
        this.initGlobalEvent();
    },

    //初始化全局事件监听
    initGlobalEvent() {
        //这里使用qf.event.on/addEvent添加事件
    },

    //控制器事件，随着主view销毁而销毁
    initModuleEvent() {
        //这里使用addModuleEvent添加事件
        //销毁事件时使用clearModuleEvent
    },

    //override
    initView(params) {
        return null;
    },
    
    //只有全屏视图才能调用这个方法
    //弹窗请走弹窗管理器相关逻辑
    show(params) {
        if (!this._view) {
            this._view = this.initView(params);
            if (!this._view) return null;

            this.root.addChild(this._view.node);

            this.initModuleEvent();
        }
        else {
            if (!this._view.active) {
                this._view.active = true;
            }
        }
        return this._view;
    },

    remove() {
        if (this._view) {
            this.clearModuleEvent();

            this._view.node.destroy();
            this._view = null;
        }
    },
    hide() {
        if (this._view && this._view.node.active) {
            this._view.node.active = false;
        }
    },
    display() {
        if (this._view && !this._view.node.active) {
            this._view.node.active = true;
        }
    },

    addGlobalEvent(name, callback, target) {
        target = target || this;
        qf.event.on(name, callback, target);
    },
    addModuleEvent(name, callback, target) {
        target = target || this;
        qf.event.on(name, callback, target);
        this._events.push(name);
    },

    clearModuleEvent() {
        for (let i = 0; i < this._events.length; i++) {
            qf.event.off(this._events[i]);
        }
        this._events.length = 0;
    },
});