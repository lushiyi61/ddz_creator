/*
用户缓存初始化
*/

let EndDesk     = require("./desk/EndDesk");
let EventDesk   = require("./desk/EventDesk");
let NormalDesk  = require("./desk/NormalDesk");
let FriendDesk  = require("./desk/FriendDesk");

let User    = require("./User");
let Config  = require("./Config");
let Match   = require("./Match");
let Global  = require("./Global");
let Welfare = require("./Welfare");
let Broadcast   = require("./Broadcast");
let Competition = require("./Competition");
let RedDotConfig= require("./RedDotConfig");

let CacheInit = cc.Class({
    statics: {
        init(qf) {
            qf.cache = new CacheInit();
        }
    },

    properties: {
        _desk_mode: null,
        desk_mode: {
            set(mode) {
                this._desk_mode = mode;

                if (mode === qf.const.DESK_MODE_NORMAL) {
                    this.desk = this.normal_desk;
                } else if (mode === qf.const.DESK_MODE_FRIEND) {
                    this.desk = this.friend_desk;
                } else if (mode === qf.const.DESK_MODE_EVENT) {
                    this.desk = this.event_desk;
                } else if (mode === qf.const.DESK_MODE_ENDGAME) {
                    this.desk = this.end_desk;
                } else {
                    this.desk = null;
                }
            },
            get() {
                return this._desk_mode;
            }
        },
    },

    ctor() {
        this.desk = null;
        this.normal_desk= new NormalDesk();
        this.friend_desk= new FriendDesk();
        this.event_desk = new EventDesk();
        this.end_desk   = new EndDesk();

        this.user   = new User();
        this.config = new Config();
        this.match  = new Match();
        this.global = new Global();
        this.welfare= new Welfare();

        this.broadcast      = new Broadcast();
        this.competition    = new Competition();
        this.redDotConfig   = new RedDotConfig();
    },
});