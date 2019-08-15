/*吐司提示*/

let View = require("../../frameworks/mvc/View");
cc.Class({
    extends: View,

    properties:{
        node_pool: cc.NodePool,
    },

    onLoad() {
       this.node_pool = new cc.NodePool();
    },

    showToast(paras) {
        if (!paras.txt) return;

        this.tbToastTxt = this.tbToastTxt ? this.tbToastTxt : [];
        this.tbToastBG = this.tbToastBG ? this.tbToastBG : [];
        this.showTime = paras.showTime || 0;
        for (let k in this.tbToastTxt) {
            let v = this.tbToastTxt[k];
            if (paras.txt === v)
                return;
        }

        if(this.tbToastTxt && this.tbToastTxt.length > 0){
            this.tbToastTxt.push(paras.txt)
            return;
        }

        let node = this.createNode(paras.txt);
        if(!node) return;
        this.setData(node,paras.txt);
        this.tbToastTxt.push(paras.txt);

        let _nextToastFunc = ()=>{
            this.tbToastTxt.splice(0, 1);
            if (this.tbToastTxt[0]) {
                let tempNode = this.createNode(this.tbToastTxt[0]);
                if(!tempNode) return;
                this.setData(tempNode,this.tbToastTxt[0]);
                this._toastAction(tempNode, _nextToastFunc);
            }
        }

        this._toastAction(node, _nextToastFunc);
    },

    createNode(str){

        if(this.node_pool.size() > 0){
            let node = this.node_pool.get();
            this.tbToastBG.push(node);
            return node;
        }

        let node = new cc.Node();
        node.opacity = 0;

        let nodeBg = new cc.Node("nodeBg");
        let spBg = nodeBg.addComponent(cc.Sprite);

        let spriteFrame = qf.rm.getSpriteFrame(qf.res.global,qf.tex.global_pic_toast_bg);
        spBg.spriteFrame = spriteFrame;
        spBg.type = cc.Sprite.Type.SLICED;
        spBg.trim = true;
        spBg.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        nodeBg.parent = node;

        let nodeLabel = new cc.Node("nodeLabel");
        nodeLabel.width = 576;
        nodeLabel.height = 0;
        let color = cc.color(255, 255, 255);
        nodeLabel.color = color;
        nodeLabel.parent = node;

        let label = nodeLabel.addComponent(cc.Label);
        label.string = str;
        label.fontSize = 30;
        label.lineHeight = 40;
        label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;

        this.tbToastBG.push(node);
        return node;
    },

    setData(node,str) {
        let nodeBg = node.getChildByName("nodeBg");
        let nodeLabel = node.getChildByName("nodeLabel");
        let label = nodeLabel.getComponent(cc.Label);
        label.string = str;

        let row = Math.ceil(str.length * label.fontSize / nodeLabel.width);
        nodeBg.width = nodeLabel.width + 100;
        nodeBg.height = label.lineHeight * row  + 30;

        node.parent = qf.layer.top;
        let winSize = cc.winSize;
        let pos = cc.v2(winSize.width / 2, winSize.height / 2 + 80);
        node.position = pos;
        node.opacity = 0;
    },

    _toastAction(bg,callBack) {
        for (let k = 0; k < this.tbToastBG.length; k++) {
            let v = this.tbToastBG[k];
            if (bg !== v)
                v.runAction(cc.moveBy(0.4, cc.v2(0, 65)));
        }
        let intervals = 0;  //两个toast的时间间隔
        if (this.tbToastBG.length > 1)
            intervals = 0.5;

        bg.runAction(cc.sequence(
            cc.delayTime(intervals),
            cc.fadeTo(0.5, 255),
            cc.callFunc(()=> {
                callBack();
            }),
            cc.delayTime(this.showTime),
            cc.fadeTo(2.5, 0),
            cc.callFunc(()=>{
                this.tbToastBG.splice(0, 1);
                this.node_pool.put(bg);
                if (this.tbToastTxt.length <= 0)
                    this.cleanToast();
            })
         ));
    },

    cleanToast() {
        this.tbToastBG = [];
        this.tbToastTxt = [];
    }
})