/*
模块管理器
统一初始化Controller，并持有所有Controller的句柄
*/

let NormalGameController = require("../modules/game/normalgame/NormalGameController");
let FriendGameController = require("../modules/game/friendgame/FriendGameController");
let EventGameController = require("../modules/game/eventgame/EventGameController");

let MainController = require("../modules/main/MainController");
let LoginController = require("../modules/login/LoginController");
let ToastController = require("../modules/toast/ToastController");
let HallController = require("../modules/hall/HallController");
let MatchController = require("../modules/match/MatchController");
let PromptController = require("../modules/prompt/PromptController");
let GlobalController = require("../modules/global/GlobalController");
let LoadingController = require("../modules/loading/LoadingController");
let WelfareController = require("../modules/welfare/WelfareController");
let BankruptController = require("../modules/bankrupt/BankruptController");
let BroadcastController = require("../modules/broadcast/BroadcastController");
let CompetitionController = require("../modules/competition/CompetitionController");

cc.Class({
    properties: {
        _controllers: { default: {} },
        _uniques: { default: {} },

        _stack: [],
        _stack_num: 0,
    },

    ctor() {
        this.init();
    },

    init() {
        this._controllers["login"] = new LoginController();
        this._controllers["main"] = new MainController();
        this._controllers["toast"] = new ToastController();
        this._controllers["hall"] = new HallController();
        this._controllers["match"] = new MatchController();
        this._controllers["prompt"] = new PromptController();
        this._controllers["global"] = new GlobalController();
        this._controllers["welfare"] = new WelfareController();

        this._controllers["loading"] = new LoadingController();
        this._controllers["bankrupt"] = new BankruptController();
        this._controllers["broadcast"] = new BroadcastController();
        this._controllers["competition"] = new CompetitionController();

        this.initUniqueController();
    },

    //某些Controller只能同时存在一个
    initUniqueController() {
        //斗地主的几个玩法
        this._uniques["game"] = ["normal", "friend", "event", "end"];
    },

    createController(name) {
        let controller;
        switch (name) {
            case "normal":
                controller = new NormalGameController();
                break;
            case "friend":
                controller = new FriendGameController();
                break;
            case "event":
                controller = new EventGameController();
                break;
            // case "end":
            //     controller = new EndGameController();
            //     break;
            default:
                break;
        }
        return controller;
    },

    //检查给定的name是否在unique列表中
    getUniqueName(name) {
        let found_name = "";
        for (let uni_name in this._uniques) {
            if (this._uniques[uni_name].indexOf(name) !== -1) {
                found_name = uni_name;
                break;
            }
        }
        return found_name;
    },

    get(name) {
        return this._controllers[name];
    },

    //显示某一视图模块
    //name 待显示的模块名称
    //params 传给视图的参数
    //cleanly 显示视图之前是否要清理其他已打开的视图
    show(name, params, cleanly) {
        if (cleanly) {
            this.clean();
        }

        //如果name在unique列表中，则要创建一个
        if (this.getUniqueName(name)) {
            this._controllers[name] = this.createController(name);
        }

        let controller = this._controllers[name];
        if (!controller) {
            qf.log.logd(`Not Found: ${name} in show fun of qf.mm`);
            return;
        }

        controller.show(params);

        this._stack.push(name);
        this._stack_num++;
    },

    //隐藏除了栈顶视图之外的其他所有视图
    hide() {
        for (let i = 0, controller; i < this._stack_num - 1; i++) {
            controller = this._controllers[this._stack[i]];
            controller && controller.hide();
        }
    },

    //移除某一视图模块
    remove(name) {
        let controller = this._controllers[name];
        if (!controller) {
            qf.log.logd(`Not Found: ${name} in remove fun of qf.mm`);
            return;
        }

        controller.remove();

        for (let i = 0; i < this._stack_num; i++) {
            if (this._stack[i] === name) {
                if (i === this._stack_num - 1 && i !== 0) {
                    controller = this._controllers[this._stack[i - 1]];
                    controller && controller.display();
                }

                //如果name在unique列表中，则要移除引用
                this.getUniqueName(name) && (this._controllers[name] = null);

                this._stack.splice(i, 1);
                this._stack_num--;

                break;
            }
        }
    },

    //移除所有的视图模块
    clean() {
        let name, controller;
        while (this._stack.length > 0) {
            name = this._stack.pop();
            controller = this._controllers[name];

            controller && controller.remove();

            //如果name在unique列表中，则要移除引用
            this.getUniqueName(name) && (this._controllers[name] = null);
        }
        this._stack_num = 0;
    }
});