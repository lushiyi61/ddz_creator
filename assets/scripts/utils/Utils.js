let uuid = 0;
const UNIT_TYPE_NONE = 0;
const UNIT_TYPE_K = 1;
const UNIT_TYPE_M = 2;

cc.Class({
    properties: {
        uuid: {
            get() {
                return ++uuid;
            }
        },
        _uuid: 0
    },

    isValidType(v) {
        return !(!v && v !== 0 && v !== "");
    },

    pointById(id) {
        return ((~~id) >> 2) + 3;
    },

    setString(node, str) {
        node.getComponent(cc.Label).string = str;
    },
    setSpriteFrame(node, tex_name) {
        node.getComponent(cc.Sprite).spriteFrame = qf.rm.getSpriteFrame(tex_name);
    },

    addTouchEvent(node, efunc, mfunc, bfunc, cfunc) {
        node.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (efunc) efunc(event);
            event.stopPropagation();
        });
        node.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (bfunc) bfunc(event);
            event.stopPropagation();
        });
        node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if (mfunc) mfunc(event);
            event.stopPropagation();
        });
        node.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            if (cfunc) cfunc(event);
        });
    },

    addClickEvent(node, func) {
        node.on("click", (event) => {
            if (func) func(event);
        });
    },

    //四舍五入. num, 整数; n, 向第n位取整。 例如输入125，要输出130， 则n要传入2
    roundOff(num, n) {
        if (n > 0) {
            let scale = Math.pow(10, n - 1);
            return Math.floor(num / scale + 0.5) * scale;
        } else if (n < 0) {
            let scale = Math.pow(10, n);
            return Math.floor(num / scale + 0.5) * scale;
        } else if (n === 0)
            return num;
    },

    //v, 数值; model, 保留小数点后位数 默认2位
    getFormatUnit(v, model) {
        let n = model ? model : 2;
        let u = UNIT_TYPE_NONE;

        if (typeof (v) !== "number") {
            return { f: v, u: u };
        }
        let k = qf.cfg.LANG === "cn" ? 10000 : 1000;
        let m = qf.cfg.LANG === "cn" ? 100000000 : 1000000;
        let f = Math.abs(v);
        let b = 0 > v;

        v = Math.abs(v);
        if (v >= m) {
            f = v / m;
            u = UNIT_TYPE_M;
        } else if (v >= k) {
            f = v / k;
            u = UNIT_TYPE_K;
        }

        if (u > UNIT_TYPE_NONE) {
            let num = f * Math.pow(10, n + 1);
            num = this.roundOff(num, 2); //四舍五入
            f = num / Math.pow(10, n + 1);
        }

        if (b)
            f = "-" + f;

        return { f: f, u: u };
    },

    getFormat(v, model) {
        let obj = this.getFormatUnit(v, model);
        let num = obj.f;
        let unit = obj.u;

        let str = "";

        if (unit === UNIT_TYPE_M) {
            str = qf.txt.string012;
        } else if (unit === UNIT_TYPE_K) {
            str = qf.txt.string011;
        }

        return { num: num, str: str };
    },

    getFormatString(v, model) {
        if (v === null) return "";

        let obj = this.getFormat(v, model);
        let s = obj.num
        let u = obj.str;

        if (s === null) {
            return "";
        } else if (u === null) {
            return s + "";
        }

        return s + u;
    },

    //保留n位有效位 小数点后最多dot位
    getFormatNumber(number, n, dot) {
        dot = dot ? dot : 2;
        n = n ? n : 4;
        let k = qf.cfg.LANG === "cn" ? 10000 : 1000;
        let m = qf.cfg.LANG === "cn" ? 100000000 : 1000000;
        let b = 0 > number;
        let u = UNIT_TYPE_NONE;
        number = Math.abs(number);
        if (number >= m) {
            number = number / m;
            u = UNIT_TYPE_M;
        } else if (number >= k) {
            number = number / k;
            u = UNIT_TYPE_K;
        }
        if (u > UNIT_TYPE_NONE) {
            let ndot = Math.pow(10, dot);
            number = Math.floor(number * ndot + 0.5);
            let net = Math.pow(10, n + 1);
            while (number >= net && ndot > 1) {
                number = Math.floor((number + 5) / 10);
                ndot = ndot / 10;
            }
            number = number / ndot;
        }
        let s = number.toString();
        //对长度进行处理(除开小数点，数字长度为n)
        let ns = number.toString().split(".");
        if (ns && ns[1] && ns[1] !== "") {
            if (ns[0].length < n) {
                s = ns[0] + "." + ns[1].substr(0, n - ns[0].length);
            } else {
                s = ns[0];
            }
        }
        if (u === UNIT_TYPE_K) {
            s = s + qf.txt.string011;
        } else if (u === UNIT_TYPE_M) {
            s = s + qf.txt.string012;
        }

        if (b)
            s = "-" + s;

        return s;
    },

    /*
    倒计时时间
    格式化时间成：x天y小时z分钟
    */
    formatRemainTime(remainTime) {
        remainTime = Math.ceil(remainTime / 60);
        let day = Math.floor(remainTime / 24 / 60);
        remainTime = remainTime - day * 24 * 60;
        let hour = Math.floor(remainTime / 60);
        let minute = remainTime - hour * 60;

        let ret = "";
        if (0 !== day)
            ret = ret + day + qf.txt.TimerUnitStr[4];

        if (0 !== hour)
            ret = ret + hour + qf.txt.TimerUnitStr[5];

        if (0 !== minute)
            ret = ret + minute + qf.txt.TimerUnitStr[6];

        return ret;
    },

    //该方法必须指定node, 调用该方法请注意node的生命周期
    targetDelayRun(node, time, cb, tag) {
        if (!node) return;
        let action = cc.sequence(
            cc.delayTime(time),
            cc.callFunc(() => {
                if (node && cb) cb();
            }));

        if (tag) action.setTag(tag);

        return node.runAction(action);
    },

    //该方法必须指定node, 调用该方法请注意node的生命周期
    targetStopDelayRun(node, tag) {
        if (!node) return;

        if (node.getActionByTag(tag)) {
            node.stopActionByTag(tag);
        }
    },

    //将时间戳转化为时间描述字符串, 2015-12-20 11:25
    getTimeDescription(timestamp, separator, separator1) {
        let sep = separator || "-";
        let sep1 = separator1 || " ";

        let day_temp = new Date(parseInt(timestamp) * 1000);
        let year = day_temp.getFullYear();
        let month = day_temp.getMonth() + 1;
        let day = day_temp.getDate(); //日
        let hour = day_temp.getHours(); //时
        let min = day_temp.getMinutes(); //分

        let numForm = (num) => {
            if (num < 10) {
                return "0" + num;
            } else {
                return num;
            }
        };

        let day_str = cc.js.formatStr("%s%s%s%s%s", year, sep, numForm(month), sep, numForm(day));
        let time_str = cc.js.formatStr("%s%s%s%s%s", day_str, sep1, numForm(hour), ":", numForm(min));
        return time_str;
    },

    getGradualValue(n) {
        let r1 = n;
        let r = 0;
        let g = 0;
        let b = 0;

        if (r1 < 0.5) {
            g = 255;
            r = 2 * r1 * 255;
        }
        if (r1 > 0.5) {
            g = (1 - r1) * 2 * 255;
            r = 255;
        }
        return cc.color(r, g, b);
    },

    /**
     * 
     * @param {*} txt 文本
     * @param {*} fontSize 总体文本大小
     * @param {*} fontname 文本字体
     * @param {*} fontHeight 字体行高
     * @param {*} maxWidth 最大宽度 为0则需手动换行
     * @param {*} horizontalAlign 水平对齐方式
     * 
     * 富文本设置：
     *              颜色<color = "00ff00"></color>
     *              大小<size = 25></size>
     *              加粗<b></b>
     */
    createRichText(paras) {
        if (!paras.txt) return;

        let node = new cc.Node();
        node.addComponent(cc.RichText);
        let richText = node.getComponent(cc.RichText);
        richText.string = paras.txt;

        let fontSize = paras.fontSize || 40;
        let fontname = paras.fontname;
        let fontHeight = paras.fontHeight || 40;
        let maxWidth = paras.maxWidth || 0;
        let horizontalAlign = paras.horizontalAlign || 0;

        richText.fontSize = fontSize;
        richText.font = fontname;
        richText.lineHeight = fontHeight;
        richText.maxWidth = maxWidth;
        richText.horizontalAlign = horizontalAlign;

        return node;
    },

    genGameConfigUrl() {
        //服务器路径
        let urlFormat = qf.cfg.HOST_HTTP + "%s/router/wx_game_server_allocate?uin=%s&os=%s&channel=%s&version=%d";

        let uin = "0";
        let os = "web";
        let channel = qf.cfg.CHANNEL;
        let version = parseInt(qf.cfg.VERSION);

        let hostName = qf.cfg.HOST_NAME;

        let urlStr = cc.js.formatStr(urlFormat, hostName, uin, os, channel, version);

        return urlStr;
    },

    //存储支付订单号
    savePayBillId(billId) {
        let billIds = cc.sys.localStorage.getItem(qf.skey.PAY_BILL_ID) || "";
        billIds = billIds + "," + billId;
        cc.sys.localStorage.setItem(qf.skey.PAY_BILL_ID, billIds);
    },

    //获取支付订单号
    getPayBillIds() {
        let billIds = cc.sys.localStorage.getItem(qf.skey.PAY_BILL_ID) || "";
        if (billIds !== "")
            return billIds.split(",");
        return null;
    },

    //删除支付订单号
    deletePayBillId(billId) {
        let billIdsTab = this.getPayBillIds();
        if (!billIdsTab) return;
        let billIds = "";
        for (let i = 0; i < billIdsTab.length; i++) {
            if (billId !== billIdsTab[i]) {
                if (i === 0)
                    billIds = billIdsTab[i];
                else
                    billIds = billIds + "," + billIdsTab[i];
            }
        }
        cc.sys.localStorage.setItem(qf.skey.PAY_BILL_ID, billIds);
    },

    //生成uuid
    createUuid() {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        this._uuid = s.join("");
    },

    //获取uuid
    getUuid() {
        ;
        return this._uuid;
    },

    // 点数= id/4+3; 花色= id%4; 0红 1黑 2梅 3方
    getPokerResNameById(id, resType) {
        let retInfo = { numberRes: null, colorRes: null, bgRes: null };
        if (!this.isValidType(id)) return retInfo;
        if (id < 0) {
            if (resType === qf.const.NEW_POKER_TYPE.OTHERSHOW) {
                retInfo.bgRes = qf.tex.lord_poker_back_other;
            } else {
                retInfo.bgRes = qf.tex.lord_poker_back;
            }
            return retInfo;
        }

        let _ctable = ["r", "h", "m", "f"];

        let i = Math.floor(id / 4);

        i = i + 3;
        let c = id % 4;
        if (resType === qf.const.NEW_POKER_TYPE.NORMAL)
            retInfo.bgRes = qf.tex.poker_bg_big;
        else if (resType === qf.const.NEW_POKER_TYPE.OTHERSHOW || resType === qf.const.NEW_POKER_TYPE.BOTTOM)
            retInfo.bgRes = qf.tex.poker_bg_small;

        if (i === 16 || i === 17) {
            retInfo.numberRes = qf.tex["lord_poker_" + i];
            retInfo.colorRes = qf.tex["lord_poker_color_" + i];
            retInfo.isJoker = true;
        } else if (i < 10) {
            retInfo.numberRes = qf.tex["lord_poker_" + _ctable[(c)] + "0" + i];
            retInfo.colorRes = qf.tex.lord_poker_color[c];
        } else {
            retInfo.numberRes = qf.tex["lord_poker_" + _ctable[(c)] + i];
            retInfo.colorRes = qf.tex.lord_poker_color[c];
        }
        return retInfo;
    },

    compareNumByDes(value1, value2) {
        if (value1 < value2) {
            return 1;
        } else if (value1 > value2) {
            return -1;
        } else {
            return 0;
        }
    },

    compareNumByIncrs(value1, value2) {
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    },

    getLaunchData() {
        let onshowQuery = qf.platform.getOnShowData();
        let launchQuery = qf.platform.getLocLaunchData();
        if (onshowQuery && onshowQuery.type) {
            return onshowQuery;
        }
        if (launchQuery && launchQuery.type) {
            return launchQuery;
        }
        return {};
    },

    isLaunchDataValid(loginQuery) {
        if (loginQuery.type === qf.const.LaunchOptions.TYPE_GAME_INVITE ||
            loginQuery.type === qf.const.LaunchOptions.TYPE_FRIEND_FROOM_INVITE) {
            let desk_id = qf.func.checkint(loginQuery.desk_id);
            let room_id = qf.func.checkint(loginQuery.room_id);
            if ((desk_id > 0) && (room_id > 0)) return true;
        }
        return false;
    },

    parseKV(kvlist) {
        kvlist = kvlist || "";

        let ret = {};
        let value = kvlist.split("&");
        for (let i = 0, kv; i < value.length; i++) {
            kv = value[i].split("=");
            ret[kv[0]] = kv[1];
        }

        return ret;
    },

    //秒转时分秒
    secondToDate(result) {
        let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
        let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
        let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
        return result = h + ":" + m + ":" + s;
    },

    ////回到loading界面，重新登录
    backLoadingController(args) {
        //关掉socket
        qf.net.disconnect(true);
        //清除所有模块
        qf.mm.clean();
        //清掉global弹窗
        qf.event.dispatchEvent(qf.ekey.GLOBAL_REMOVE_TOAST); //移除通用吐司
        qf.event.dispatchEvent(qf.ekey.GLOBAL_REMOVE_SINGLE_TOAST); //移除单个通用吐司
        qf.event.dispatchEvent(qf.ekey.GLOBAL_REMOVE_WAITING); //移除全屏等待
        qf.event.dispatchEvent(qf.ekey.REMOVE_PROMPT_DIALOG, { tagName: "all" }); //移除所有通用弹窗
        qf.event.dispatchEvent(qf.ekey.REMOVE_BACKRUPT_DIALOG); //不显示破产保护
        qf.event.dispatchEvent(qf.ekey.REMOVE_REWARD_DIALOG); //不显示获取弹窗
        qf.event.dispatchEvent(qf.ekey.SHOW_OR_HIDE_BROADCAST, { isVisible: false }); //不显示跑马灯
        qf.event.dispatchEvent(qf.ekey.REMOVE_CLASSIC_OVER_DIALOG); //移除结算框
        qf.event.dispatchEvent(qf.ekey.REMOVE_LUCKY_REWARD_DIALOG); //移除幸运任务奖励框
        //重新加载loading界面
        let onlyShowUI = false;
        if (args && args.onlyShowUI) {
            onlyShowUI = args.onlyShowUI; //只显示ui，不做之后加载资源和登录流程
        }

        qf.mm.show("loading", { data: { onlyShowUI: onlyShowUI } });
    },

    //获取资源md5文件列表
    getResMd5List(md5ResFile) {
        let md5ResList = {};
        if (md5ResFile === "") return md5ResList;
        let md5ResTab = md5ResFile.split("\n");
        for (let i in md5ResTab) {
            let md5Res = md5ResTab[i].split("|");
            if (md5Res[0] && md5Res[1]) {
                md5ResList[md5Res[1]] = md5Res[0];
            }
        }
        return md5ResList;
    },

    //获取后台控制功能是否开启
    getFuncIsOpen(key) {
        let isopen = 1;
        let config = qf.cache.config.moduleConfig;
        if (qf.cache.config.moduleConfig) {
            for (let i = 0; i < config.length; i++) {
                let module = config[i];
                if (module.type === key) {
                    isopen = module.flag;
                    break;
                }
            }
        }
        return isopen;
    },

    //小程序跳转
    gotoOtherProgram(args) {
        if (wx.navigateToMiniProgram) {
            if (!args) return;
            wx.navigateToMiniProgram({
                appId: args.appId, // 要跳转的小程序的appid
                path: args.path, // 跳转的目标页面

                extarData: args.extarData || {},
                envVersion: args.envVersion,
                success: (res) => { }
            })
        } else {
            qf.platform.showTips(true);
        }
    },

    /**
     * 根据节点截屏
     * args: node:渲染节点
     */
    saveImageByNode(args) {
        if (!this.isValidType(args.node)) return;
        let node = args.node;

        let cameraNode = new cc.Node();
        cameraNode.parent = node;
        let camera = cameraNode.addComponent(cc.Camera);

        // 设置你想要的截图内容的 cullingMask
        camera.cullingMask = 0xffffffff;

        let texture = new cc.RenderTexture();
        let gl = cc.game._renderContext;

        texture.initWithSize(node.width, node.height, gl.STENCIL_INDEX8);
        camera.targetTexture = texture;

        camera.render();

        if (args.isHide) node.setVisible(false);

        // 这样我们就能从 RenderTexture 中获取到数据了
        let data = texture.readPixels();

        // 接下来就可以对这些数据进行操作了
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = texture.width;
        canvas.height = texture.height;

        let width = canvas.width;
        let height = canvas.height;

        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }

            ctx.putImageData(imageData, 0, row);
        }
        if (window.wx) {
            //获取截取画布后的临时文件
            // qf.platform.toTempFilePath({
            //     canvas: canvas,
            //     width: args.width || width,
            //     height: args.height || height,
            //     destWidth: args.destWidth,
            //     destHeight: args.destHeight,
            //     x: args.x,
            //     y: args.y,
            //     cb : args.cb
            // })
            canvas.toTempFilePath({
                success: (res) => {
                    wx.saveImageToPhotosAlbum({ filePath: res.tempFilePath })
                }
            })
            return;
        }
        let dataURL = canvas.toDataURL("image/jpeg");
        let img = document.createElement("img");
        img.src = dataURL;
    },

    //根据索引名复制表 filed:索引表 table:赋值table copyTable:被copy Table
    copyFiled(filed, table, copyTable) {
        if (!this.isValidType(table)) return;
        if (!this.isValidType(copyTable)) return;
        for (let key in filed) {
            let value = filed[key];
            table[value] = copyTable[value];
        }
        return table;
    },

    //遍历寻找子节点
    seekNodeByName(name, root) {
        let child;
        if (name.indexOf("/") !== -1) {
            child = cc.find(name, root);
        } else {
            if (root.name === name) {
                child = root;
            } else {
                child = this._findChild(name, root);
            }
        }
        if (child) {
            return child;
        } else {
            loge(name, "没有找到指定的Node");
            return null;
        }
    },

    _findChild(name, parent) {
        let child = parent.getChildByName(name);
        if (child) {
            return child;
        } else {
            let children = parent.children;
            for (let i in children) {
                child = this._findChild(name, children[i]);
                if (child) {
                    return child;
                }
            }
        }
        return null;
    },

    // 龙骨动画初始化
    createArmatureAnimation(parent, dragonInfo, cb) {
        const armatureDisplay = parent.addComponent(dragonBones.ArmatureDisplay);
        const dragonAsset = cc.loader.getRes(dragonInfo.dragonAsset);
        const dragonAtlasAsset = cc.loader.getRes(dragonInfo.dragonAtlasAsset, dragonBones.DragonBonesAtlasAsset);

        if (dragonAsset) {
            armatureDisplay.dragonAsset = cc.loader.getRes(dragonInfo.dragonAsset);
        } else {
            loge(dragonInfo.dragonAsset, "dragonAsset is not loaded")
        }

        if (dragonAtlasAsset) {
            armatureDisplay.dragonAtlasAsset = cc.loader.getRes(dragonInfo.dragonAtlasAsset, dragonBones.DragonBonesAtlasAsset);
        } else {
            loge(dragonInfo.dragonAtlasAsset, "dragonAtlasAsset is not loaded");
        }

        armatureDisplay.armatureName = dragonInfo.armatureName;
        armatureDisplay.buildArmature(dragonInfo.armatureName, parent);

        // 添加监听
        if (cb) {
            armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                cb()
            }, this);
        }

        return armatureDisplay;
    },
});