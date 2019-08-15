/*
启动器
主场景被加载后，用来对游戏的初始化
*/

let qf = window.qf = {};

let ConfigInit  = require("./config/ConfigInit");
let CacheInit   = require("./caches/CacheInit");
let UtilsInit   = require("./utils/UtilsInit");
let PlatformInit    = require("./platform/PlatformInit");
let FrameworkInit   = require("./frameworks/FrameworkInit");

let ModuleManager = require("./manager/ModuleManager");
let DialogManager = require("./manager/DialogManager");
let ResouceManager = require("./manager/ResourceManager");

let GameHepler = require("./modules/game/GameHelper");
let PokerUtil   = require("./modules/game/components/PokerUtil");
let PokerPool   = require("./modules/game/components/poker/PokerPool");
let PokerConfig = require("./modules/game/components/PokerConfig");
let PokerAlgorithmVT = require("./modules/game/algorithm/PokerAlgorithmVT");

cc.Class({
    extends: cc.Component,

    properties: {
        layer_view: cc.Node,
        layer_dialog: cc.Node,
        layer_top: cc.Node,
    },

    onLoad() {
        this.initLayer();

        ConfigInit.init(qf);
        
        PlatformInit.init(qf);
        
        CacheInit.init(qf);

        FrameworkInit.init(qf);
        
        UtilsInit.init(qf);

        qf.mm = new ModuleManager();
        qf.rm = new ResouceManager();
        qf.dm = new DialogManager();

        qf.dev_size = { w: 720, h: 1280 };
        
        this.initGame();

        this.launch();
    },

    initLayer() {
        qf.layer = {};

        qf.layer.view   = this.layer_view;   //场景层
        qf.layer.dialog = this.layer_dialog; //弹窗层
        qf.layer.top    = this.layer_top;    //最顶层
    },

    initGame() {
        qf.pokerconfig  = PokerConfig;
        qf.pokerutil    = new PokerUtil();
        qf.pokerai      = new PokerAlgorithmVT();
        qf.pokerpool    = new PokerPool();
        qf.gamehelper   = new GameHepler();
    },

    launch() {
        //global/toast常驻内存
        qf.mm.get("global").show();
        qf.mm.get("toast").show();

        qf.mm.show("loading");
    }
});