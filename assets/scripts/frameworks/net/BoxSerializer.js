/*
	Box封装
	2018/1/30
	raintian
*/
let MAGIC = 2037952207;
let INT_SIZE = 4;
let SHORT_SZIE = 2;

cc.Class({
    //初始化header
    initHeader() {
        var header = {};
        header.magic = { value: MAGIC, length: INT_SIZE };
        header.version = { value: 0, length: SHORT_SZIE };
        header.flag = { value: 0, length: SHORT_SZIE };
        header.boxSize = { value: 0, length: INT_SIZE };
        header.cmd = { value: 0, length: INT_SIZE };
        header.ret = { value: 0, length: INT_SIZE };
        header.sn = { value: 0, length: INT_SIZE };

        return header;
    },

    //获取header的属性列表，由于在浏览器中并不一定保证对象的属性遍历顺序
    //因此需要用数组来确保属性遍历的顺序
    getHeaderPropertyList() {
        return ["magic", "version", "flag", "boxSize", "cmd", "ret", "sn"];
    },

    //封装box
    packBox(cmd, sn, bodyArrayBuffer) {
        var self = this;
        var header = self.initHeader();

        header.cmd.value = cmd;
        header.sn.value = sn;
        //从500版本开始增加协议签名，flag使用二进制第二位
        header.flag.value = 0x02;
        var boxSize = self.getBoxSize(header, bodyArrayBuffer);
        header.boxSize.value = boxSize;

        //偏移量
        var pos = 0;

        var headerPropertyList = self.getHeaderPropertyList();

        //写入header
        var boxArrayBuffer = new ArrayBuffer(boxSize);
        var boxDataView = new DataView(boxArrayBuffer);
        var propLen = headerPropertyList.length;
        for (let i = 0; i < propLen; i++) {
            var propObj = header[headerPropertyList[i]];
            if (propObj.length === INT_SIZE) {
                boxDataView.setInt32(pos, propObj.value);
            } else if (propObj.length === SHORT_SZIE) {
                boxDataView.setInt16(pos, propObj.value);
            }
            pos += propObj.length;
        }

        //写入body
        var bodyBytes = new Uint8Array(bodyArrayBuffer);
        var bodyLength = bodyBytes.length;
        for (var i = 0; i < bodyLength; i++) {
            boxDataView.setUint8(pos, bodyBytes[i]);
            pos += 1;
        }

        return boxArrayBuffer;

    },

    //解包box
    unpackBox(boxArrayBuffer) {
        var self = this;

        var header = self.initHeader();

        //偏移量
        var pos = 0;

        var headerPropertyList = self.getHeaderPropertyList();

        //先解码header
        var boxDataView = new DataView(boxArrayBuffer);
        var propLen = headerPropertyList.length;
        for (let i = 0; i < propLen; i++) {
            var propObj = header[headerPropertyList[i]];
            if (propObj.length === INT_SIZE) {
                propObj.value = boxDataView.getInt32(pos);
            } else if (propObj.length === SHORT_SZIE) {
                propObj.value = boxDataView.getInt16(pos);
            }
            pos += propObj.length;
        }

        //获取body
        var boxSize = header.boxSize.value;
        var headerSize = self.getHeaderSize(header);
        var bodyArrayBuffer = boxArrayBuffer.slice(headerSize, boxSize);

        let ret = {};
        ret.cmd = header.cmd.value;
        ret.ret = header.ret.value;
        ret.sn = header.sn.value;
        ret.body = bodyArrayBuffer;

        return ret;
    },

    //获取box的大小
    getBoxSize(header, bodyArrayBuffer) {
        var self = this;
        var boxSize = self.getHeaderSize(header);

        if (bodyArrayBuffer) {
            boxSize += bodyArrayBuffer.byteLength;
        }

        return boxSize;
    },

    //获取头大小
    getHeaderSize(header) {
        var headerSize = 0;
        for (let prop in header) {
            headerSize += header[prop].length;
        }
        return headerSize;
    }

});

function BoxSerializerUnitTest() {

    var boxSerializer = new BoxSerializer();

    //模拟发送数据
    var sendArrayBuffer = new ArrayBuffer(1024);
    var sendDataView = new DataView(sendArrayBuffer);
    var cmd = 1001;
    var sn = 1;
    var sendData = -100;
    sendDataView.setInt32(0, sendData);
    var boxArrayBuffer = boxSerializer.packBox(cmd, sn, sendArrayBuffer);

    //模拟接收数据
    var data = boxSerializer.unpackBox(boxArrayBuffer);
    var receiveDataView = new DataView(data.body);
    var receiveCmd = data.cmd;
    var receiveSn = data.sn;
    var receiveData = receiveDataView.getInt32();

    //测试验证
    if (sendData === receiveData && cmd === receiveCmd && sn === receiveSn) {
        loge("success!!!!", "raintian test");
    } else {
        loge("fail!!!!", "raintian test");
    }

    dump(data);

}