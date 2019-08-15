/*
	网络消息处理中心
	2017/8/5
	raintian
*/

let ETAdapter = require("./ETAdapter");
let NetSerializer = require("./NetSerializer");

//重连时间间隔(5s)
let RECONNECT_INTERVAL = 5000;
//心跳发送间隔(10s)
let HEARTBEAT_INTERVAL = 10000;
//超时检测时间间隔(1s)
let CHECK_RSP_TIMEOUT_INTERVAL = 1000;
//默认请求回包超时时间(5s)
let RSP_TIMEOUT = 5000;

//websocket readyState属性的连接状态标识
let WS_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
};

cc.Class({

    properties: {
        TAG: "Net",
        //websocket连接地址
        WS_URL: "",
        //websocket对象
        ws: null,

        //是否已经加载proto
        isProtoLoaded: false,

        //控制断线重连的标记
        lockReconnect: false,

        //心跳启动定时器id
        heartbeatTimeoutId: null,

        //服务器响应超时定时器id
        serverTimeoutId: null,

        //检查超时响应定时器id
        checkRspTimeoutId: null,

        //网络消息序列化对象
        netSerializer: null,

        //事件适配器
        etAdapter: null,

        //请求响应回调函数队列
        rspCallBacks: { default: [] },

        //断线重连需要重新发送的消息列表
        reSendMap: { default: {} },

        _rTimeoutID: null,
    },

    ctor() {
        var self = this;
        self.etAdapter = new ETAdapter();
        self.netSerializer = new NetSerializer();
        //mark by Gallen
        self.WS_URL = qf.cfg.HOST_WSS + qf.cfg.SOCKET_IP + ":" + qf.cfg.SOCKET_PORT;
    },

    //网络下发IP地址更新
    updateWsUrl() {
        var self = this;
        self.WS_URL = qf.cfg.HOST_WSS + qf.cfg.SOCKET_IP + ":" + qf.cfg.SOCKET_PORT;
    },

    //初始化，Net启动的唯一接口
    start() {
        var self = this;
        if (!self.isProtoLoaded) {
            //由于proto文件的加载是异步的，所以必须在proto文件加载完毕后再启动websocket
            self.netSerializer.loadProto(() => {
                self.isProtoLoaded = true;
                self.createWebSocket();
            });
        } else {
            self.createWebSocket();
        }
    },


    //启动websocket
    createWebSocket() {
        var self = this;
        try {
            self.ws = new WebSocket(self.WS_URL);
            self.initEventHandle();
        } catch (e) {
            self.reconnect();
        }
    },

    //绑定websocket事件
    initEventHandle() {
        var self = this;

        self.ws.onopen = () => {
            self.onOpen();
        };
        self.ws.onmessage = (event) => {
            self.onMessage(event);
        };
        self.ws.onclose = () => {
            self.onClose();
        };
        self.ws.onerror = () => {
            self.onError();
        };
    },

    onOpen() {
        var self = this;
        logd("onopen", self.TAG);
        //心跳检测重置
        self.resetHeartbeat();
        self.startHeartbeat();

        //启动响应超时检测
        self.startCheckRspTimeout();

        //连接成功，派发登录事件
        qf.event.dispatchEvent(qf.ekey.BASIC_NET_CONNECT_SUCCESS);
    },

    onMessage(event) {
        var self = this;

        //如果获取到任何消息都说明当前连接是正常的，心跳检测重置
        self.resetHeartbeat();
        self.startHeartbeat();

        self.readBufferFromData(event.data);
    },

    //转换数据类型
    readBufferFromData(eventData) {
        var self = this;
        if (eventData instanceof ArrayBuffer) {
            //微信平台返回ArrayBuffer类型，直接使用
            self.readMsgFromBuffer(eventData);
        } else {
            //web平台返回Blog类型, 需转换为ArrayBuffer
            var reader = new FileReader();
            reader.readAsArrayBuffer(eventData);
            reader.onload = (e) => {
                //readAsArrayBuffer是异步的，必须在onload内获取转换结果，结果类型为ArrayBuffer
                self.readMsgFromBuffer(reader.result);
            };
        }
    },

    //读取消息
    readMsgFromBuffer(buffer) {
        var self = this;
        var msg = self.netSerializer.unpackMsg(buffer);
        if (!msg) return;

        logd("onmessage cmd=" + msg.cmd + " ret=" + msg.ret, self.TAG);

        //请求回包的消息sn大于0，服务端主动推送的消息sn等于0，以此来判定是否需要查询回调函数
        if (msg.sn && msg.sn > 0) {
            for (var i = 0; i < self.rspCallBacks.length; i++) {
                var callBackObj = self.rspCallBacks[i];
                if (callBackObj && callBackObj.sn === msg.sn) {
                    if (callBackObj.wait) qf.event.dispatchEvent(qf.ekey.GLOBAL_REMOVE_WAITING);
                    self.rspCallBacks.splice(i, 1);

                    if (callBackObj && callBackObj.callback) {
                        callBackObj.callback(msg);
                    }

                    break;
                }
            }
        } else {
            //服务端推送消息直接派发事件
            var event = self.etAdapter.findEventByCmd(msg.cmd);
            qf.event.dispatchEvent(event, msg);
        }

        if (msg.cmd && self.reSendMap[msg.cmd]) {
            delete self.reSendMap[msg.cmd];
        }
    },

    onClose() {
        var self = this;
        logd("onclose", self.TAG);

        self.reconnect();
    },

    onError() {
        var self = this;
        logd("onerror", self.TAG);

        self.reconnect();
    },


    //判定当前是否是连接状态
    isConnected() {
        var self = this;
        if (self.ws) {
            var state = self.ws.readyState;
            return state === WS_STATE.OPEN;
        }
        return false;
    },

    //发送消息接口
    send(paras) {
        var self = this;

        //参数校验
        if (!paras || !paras.cmd) {
            loge("send paras error!!!!", self.TAG);
            return;
        }

        //非连接状态不能发送请求
        if (!self.isConnected()) {
            loge("send fail! web socket is not open! cmd = " + paras.cmd, self.TAG);
            if (self.ws) {
                var state = self.ws.readyState;
                loge("send fail! web socket is not open! state = " + state);
            }
            if (paras.isNeedResend) {
                //加入重发列表
                logd(paras.cmd, "加入重发列表");
                self.reSendMap[paras.cmd] = paras;
            }
            return;
        }

        logd("send msg cmd=" + paras.cmd, self.TAG);
        if (self.ws && self.netSerializer) {
            var wait = paras.wait;
            if (wait) qf.event.dispatchEvent(qf.ekey.GLOBAL_SHOW_WAITING);
            var msg = self.netSerializer.packMsg(paras.cmd, paras.body);
            var ret = self.ws.send(msg);

            //添加send回调函数
            if (paras.callback) {
                var time = paras.timeout ? paras.timeout : RSP_TIMEOUT;
                var callBackObj = {
                    sn: self.netSerializer.getSn(),
                    cmd: paras.cmd,
                    timeout: Date.parse(new Date()) + time,
                    callback: paras.callback,
                    wait: wait,
                };
                self.rspCallBacks.push(callBackObj);
            }
        }
    },

    //断线重连接口
    reconnect(url) {
        var self = this;
        if (self.lockReconnect) return;
        self.lockReconnect = true;

        qf.event.dispatchEvent(qf.ekey.STATISTICAL_RECONNECTION_INFO);

        //断线显示全屏loading
        qf.event.dispatchEvent(qf.ekey.GLOBAL_SHOW_WAITING, { isAutoDestroy: false });

        self.disconnect();

        //没连接上会一直重连，设置延迟避免请求过多
        self._rTimeoutID = setTimeout(() => {
            self.start(url);
            self.lockReconnect = false;
        }, RECONNECT_INTERVAL);
    },

    //关闭连接接口 不能closed
    disconnect(isReset) {
        var self = this;
        logd("disconnect", self.TAG);

        //清掉重连定时器
        if (self._rTimeoutID) {
            clearTimeout(self._rTimeoutID);
            self._rTimeoutID = null;
        }
        //重置心跳定时器
        self.resetHeartbeat();

        //清空所有回调函数
        self.clearRspCallBacks();

        //清空回包超时检测定时器
        self.clearCheckRspTimeout();

        if (self.ws) {
            //清除网络回调函数
            self.ws.onopen = () => {};
            self.ws.onmessage = (event) => {};
            self.ws.onclose = () => {};
            self.ws.onerror = () => {};

            self.ws.close();
            self.ws = null;
        }

        if (isReset) {
            self.lockReconnect = false;
        }
    },

    //心跳启动接口
    startHeartbeat() {
        var self = this;
        self.heartbeatTimeoutId = setTimeout(()=>{
            //发送心跳，后端收到后，返回心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            self.send({ cmd: qf.cmd.HEARTBEAT });

            //如果超过一定时间还没重置，客户端认为连接断开了，并且主动关闭连接
            self.serverTimeoutId = setTimeout(()=> {
                //fix by Gallen 不能主动断开连接，断不开
                self.reconnect();
            }, HEARTBEAT_INTERVAL);

        }, HEARTBEAT_INTERVAL);
    },

    //心跳重置接口
    resetHeartbeat() {
        var self = this;
        clearTimeout(self.serverTimeoutId);
        clearTimeout(self.heartbeatTimeoutId);
    },

    //清空所有回调
    clearRspCallBacks() {
        var self = this;
        self.rspCallBacks = [];
    },

    //启动超时检查定时器
    startCheckRspTimeout() {
        var self = this;
        self.checkRspTimeoutId = setInterval(()=> {
            //遍历所有callBack, 执行并删除超时的callBack
            for (var i = 0, flag = true; i < self.rspCallBacks.length; flag ? i++ : i) {
                var callBackObj = self.rspCallBacks[i];
                var timeStamp = Date.parse(new Date());
                if (callBackObj && timeStamp >= callBackObj.timeout) {
                    if (callBackObj.wait) qf.event.dispatchEvent(qf.ekey.GLOBAL_REMOVE_WAITING);

                    logd("Timeout cmd=" + callBackObj.cmd, self.TAG);
                    flag = false;
                    self.rspCallBacks.splice(i, 1);
                    //执行回调并构造超时返回码
                    try {
                        callBackObj.callback({ cmd: callBackObj.cmd, ret: -200 });
                    } catch (e) {
                        loge(e, self.TAG);
                    }

                } else {
                    flag = true;
                }
            }
        }, CHECK_RSP_TIMEOUT_INTERVAL);
    },

    //清除超时检查定时器
    clearCheckRspTimeout() {
        var self = this;
        clearTimeout(self.checkRspTimeoutId);
    },

    //解码待签名的消息体
    getDataBySignedBody(signedbody, cmd) {
        var self = this;
        return self.netSerializer.getDataBySignedBody(signedbody, cmd);
    },

    //解码待签名的消息体
    reSendMsg() {
        var self = this;
        for (var k in self.reSendMap) {
            logd("net重新发送cmd:", self.reSendMap[k].cmd);
            self.send(self.reSendMap[k]);
        }
    },
});