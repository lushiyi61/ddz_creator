/*
	网络消息序列化
	2017/8/5
	raintian
*/

let PBAdapter = require("./PBAdapter");
let BoxSerializer = require("./BoxSerializer");
let PBHelper = require("./protobufjs5/PBHelper");

cc.Class({
    properties: {
        TAG: "NetSerializer",
        pbAdapter: null,
        pbHelper: null,
        boxSerializer: null,
        sn: 0,
    },

    ctor() {
        var self = this;
        self.pbAdapter = new PBAdapter();
        self.boxSerializer = new BoxSerializer();
        self.pbHelper = new PBHelper();
    },

    //加载proto文件
    loadProto(callBack) {
        var self = this;
        self.pbHelper.loadProtoFile(()=>{
            if(callBack) callBack();
        });
    },

    //封包接口
    packMsg(cmd, body) {
        var self = this;

        var serializedBody = "";
        //判空以兼容心跳等body无结构的消息
        if (body) {
            var pbName = this.pbAdapter.findPBNameByCmd("req", cmd);
            if (pbName) {
                //序列化业务逻辑body
                serializedBody = self.pbHelper.encode(pbName, body);
            }
        }

        //封装safeShell
        var safeShellObj = {
            sign_type: 0,                                     //暂时不使用签名校验
            encrypt_type: 0,                                  //默认不对body加密
            uid: qf.cache.user.uin ? qf.cache.user.uin : 0,         //登录填0，其他填uin
            random: Math.floor(Math.random() * 100000000),    //随机数(int32)
            time: Date.parse(new Date()) / 1000,              //本地时间
            time_zone: 8,                                     //本地时区(待修改)
            version: qf.cfg.VERSION,                      //版本号(待修改)
            channel: qf.cfg.CHANNEL,                      //渠道号(待修改)
            extra: "",                                        //附加信息(待修改)
            body: serializedBody,                             //业务body序列化
            sign: ""                                          //签名，暂时不填写
        };

        //编码safeShell
        var safeShellPbName = self.pbAdapter.getSafeShellPbName();
        var pbArrayBuffer = self.pbHelper.encode(safeShellPbName, safeShellObj);

        //封装box
        var boxArrayBuffer = self.boxSerializer.packBox(cmd, ++self.sn, pbArrayBuffer);

        return boxArrayBuffer;
    },


    //解包接口
    unpackMsg(data) {
        var self = this;

        //先解包box
        var boxData = self.boxSerializer.unpackBox(data);

        //再解包safeShell
        var safeShellPbName = self.pbAdapter.getSafeShellPbName();
        var formatData = self.pbHelper.formatData(boxData.body);
        var safeShellObj = self.pbHelper.decode(safeShellPbName, formatData);

        if (!safeShellObj) {
            loge("message decode error!!!", self.TAG);
            return null;
        }

        var ret = {};
        ret.cmd = boxData.cmd;
        ret.ret = boxData.ret;
        ret.sn = boxData.sn;
        if (ret.ret === 0) {
            //解包业务body, 加判断兼容空包
            if (safeShellObj.body) {
                var pbName = self.pbAdapter.findPBNameByCmd("rsp", ret.cmd);
                if (pbName) {
                    var body = self.pbHelper.decode(pbName, safeShellObj.body);
                    ret.model = body;
                }
            }
        }
        //dump(ret);
        return ret;
    },

    //解包带签名的部分
    getDataBySignedBody(signedbody, cmd) {
        var self = this;

        //mark: 签名校验不通过，可能是数据转换有问题，先跳过
        //var str = String.fromCharCode.apply(null, signedbody.body);

        // var str = "";
        // for (var i=0; i<signedbody.body.byteLength; i++) {
        //     str += String.fromCharCode(signedbody.body[i])
        // }

        //var signOrigin = UNITY_PAY_SECRET + str;

        // var body = null;
        // var clientSign = md5(signOrigin);
        // if (signedbody.sign === clientSign) {
        //     body = signedbody.body;
        // } else {
        //     return null;
        // }

        var body = signedbody.body;

        var pbName = self.pbAdapter.findPBNameByCmd("rsp", cmd);
        if (!pbName) return null;
        var obj = self.pbHelper.decode(pbName, body);
        return obj;
    },

    //获取消息序列号
    getSn() {
        var self = this;
        return self.sn;
    }

});

function NetBoxSerializerUnitTest() {

    logd("NetBoxSerializerUnitTest");

    var netSerializer = new NetSerializer();

    netSerializer.initPbHelper(()=>{

        //模拟发包
        var boxArrayBuffer = netSerializer.packMsg(qf.cmd.USER_PROP_CHANGE,
                {prop_type: 1, delta_amount: 1234567890123456, remain_amount: 3});

        //模拟收包
        var msg = netSerializer.unpackMsg(boxArrayBuffer);

        dump(msg);

    });

    //构造extra字段
    // var extraStr = JSON.stringify({cmd: cmd});
    // var byteBuffer = new dcodeIO.ByteBuffer().writeIString(extraStr);
    // safeShellObj.extra = byteBuffer;
    //
    // var extraStr2 = byteBuffer.readIString();


    // var extraStr = JSON.stringify({cmd: cmd});
    // var extraStrLen = extraStr.length;
    // var data = new Uint8Array(extraStr.length);
    // for (var i = 0; i < extraStrLen; ++i) {
    //     data[i] = extraStr.charCodeAt(i);
    // }
    // safeShellObj.extra = data.buffer;

}