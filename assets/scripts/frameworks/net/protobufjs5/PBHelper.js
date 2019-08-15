
/*
	protobuf.js 5.x版本编解码代理
	2018/1/26
	raintian
*/

cc.Class({
    extends: cc.Component,

    properties: {
        builder: null,
        package: "texas.net.proto"
    },

    statics: {
        TAG: "PBHelper",
    },

    //异步加载proto文件
    loadProtoFile(callBack) {
        dcodeIO.ProtoBuf.loadProtoFile(qf.res.proto, (err, builder)=>{
            if (err) {
                loge(err, this.TAG);
                return;
            }

            this.builder = builder.build(this.package);

            //proto文件异步加载执行的回调
            if(callBack) callBack();
        });
    },

    //查找pbName对应的pb类
    findPbClass(pbName) {
        var self = this;
        if (this.builder && pbName) {
            return self.builder[pbName];
        }
        return null;
    },

    //pb编码
    encode(pbName, obj) {
        var self = this;
        var pbClass = this.findPbClass(pbName);
        if(pbClass) {
            //调用protobuf.js的编码接口
            var msgObj = new pbClass(obj);
            //msgObj.set(obj);
            var buffer = msgObj.encode().toBuffer();
            return buffer;
        }
        return null;
    },

    //pb解码
    decode(pbName, buffer) {
        var pbClass = this.findPbClass(pbName);

        if(pbClass) {
            //调用protobuf.js的解码接口
            var msgObj = pbClass.decode(buffer);
            return msgObj;
        }
        return null;
    },

    //数据类型转换
    formatData(arrayBuffer) {
        //protobuf 5.x版本不需转换数据类型，使用ArrayBuffer即可
        return arrayBuffer;
    }

});