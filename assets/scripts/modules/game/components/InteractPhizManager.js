/*互动表情*/
//使用示例
//let phiz = require("../game/components/InteractPhizManager");
// qf.rm.checkLoad("playerInfo",()=>{
//     let phizs = phiz.getInstance();
//     let ret = phizs.playArmatureAnimation(cc.v2(10,10),cc.v2(400,200),1);
//     for(let i = 0;i<ret.length;i++){
//         let node = ret[i];
//         node.parent = this.node;
//         node.zIndex = 10000;
//     }
// })
//类型
const INTERACT_PHIZ = {
        NIUBEI: 0,
        ZHADAN: 1,
        BINGTONG: 2,
        QINWEN: 3,
        BIXIN:4,
        SENDFLOWER:5
};
let _instance;

let InteractPhiz =  cc.Class({
    properties:{

    },

    statics:{
        getInstance(){
            if(!_instance){
                _instance = new InteractPhiz();
            }

            return _instance;
        }
    },

    ctor() {

    },

    //播放一条骨骼动画
    playArmatureAnimation(fromPos, toPos, phizId, isReverse, fromScale, toScale) {
        let ret = [];

        //服务器配置了从1开始, js下标从0开始, 需要减一
        phizId = phizId - 1;

        let armature = this.getArmatureAnimation(qf.txt.phizStrings[phizId],()=>{
            armature.node.destroy();
        });
        ret.push(armature.node);

        let res;
        let pos = toPos;

        if(INTERACT_PHIZ.BINGTONG === phizId){     //冰桶
            res = qf.rm.getSpriteFrame(qf.res.playerInfo,qf.tex.interactphiz_bingtong);
            if(qf.utils.isValidType(isReverse)){
                pos.x = toPos.x + 80;
                pos.y = toPos.y + 70;
            } else {
                pos.x = toPos.x - 80;
                pos.y = toPos.y + 70;
            }
        } else if(INTERACT_PHIZ.NIUBEI === phizId){   //碰杯
            //isReverse = !isReverse;
            res = qf.rm.getSpriteFrame(qf.res.playerInfo,qf.tex.interactphiz_niubei);

        } else if(INTERACT_PHIZ.QINWEN === phizId){    //亲吻
            res = qf.rm.getSpriteFrame(qf.res.playerInfo,qf.tex.interactphiz_qinwen);
            toPos.y = toPos.y + 45;
            if(qf.utils.isValidType(isReverse)){
                toPos.x = toPos.x - 6;
            } else {
                toPos.x = toPos.x + 6;
            }

        } else if(INTERACT_PHIZ.ZHADAN === phizId){     //炸弹
            res = qf.rm.getSpriteFrame(qf.res.playerInfo,qf.tex.interactphiz_zhadan);
        }else if(INTERACT_PHIZ.BIXIN === phizId){         //比心
            res = qf.rm.getSpriteFrame(qf.res.playerInfo,qf.tex.interactphiz_bixin);
        }else if(INTERACT_PHIZ.SENDFLOWER === phizId){     //送花
            res = qf.rm.getSpriteFrame(qf.res.playerInfo,qf.tex.playerinfo_phiz_rose);
        }

        let spNode = new cc.Node();
        let sprite = spNode.addComponent(cc.Sprite);
        sprite.spriteFrame = res;

        if(isReverse){
            let flipXAction1 = cc.flipX(true);
            armature.node.runAction(flipXAction1);

            let flipXAction = cc.flipX(true);
            spNode.runAction(flipXAction);
        }

        armature.node.position = toPos;
        spNode.position = fromPos;
        armature.node.active = false;

        let toScaleParam = 1;
        if(qf.utils.isValidType(fromScale)){
            spNode.scale = fromScale;
            if(qf.utils.isValidType(toScale)){
                toScaleParam = qf.func.checkint(toScale);
            }
        }

        let obj = this.getSoundAndDelayTime(phizId);
        let sound = obj[0];
        let delaytime = obj[1];
        let angle = obj[2];

        let bezierConfig = this.getBezierConfig(fromPos, pos || toPos);
        let spwan = cc.spawn(cc.bezierTo(2, bezierConfig),
            cc.rotateBy(0.5,angle),
            //cc.scaleTo(0.5,toScaleParam)
        );

        spNode.runAction(cc.sequence(spwan,
            cc.callFunc((sender)=>{
                armature.node.active = true;
                let a = armature.playAnimation(qf.txt.phizStrings[phizId],-1);
                a.play();
                sender.active = false;
            }),
            cc.delayTime(delaytime),
            cc.callFunc((sender)=>{
                //qf.music.playMyEffect(sound);
                sender.destroy();
            })
        ));
        ret.push(spNode);

        return ret;
    },

    getArmatureAnimation(name,cb) {
        this.addArmatureFileByName(name); //每次播放动画前先加载对应的资源文件

        let node = new cc.Node();
        const armatureDisplay = node.addComponent(dragonBones.ArmatureDisplay);
        armatureDisplay.dragonAsset = this.dragonAsset;
        armatureDisplay.dragonAtlasAsset = this.dragonAtlasAsset;
        armatureDisplay.armatureName = "armatureName";
        armatureDisplay.buildArmature("armatureName",node);

        // 添加监听
        armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, ()=> {
            cb()
        }, this)

        return armatureDisplay;
    },

    addArmatureFileByName(name) {

        let res_1 = qf.res.interactPhiz_1[name];
        let res_2 = qf.res.interactPhiz_2[name];

        this.dragonAsset = cc.loader.getRes(res_1);
        this.dragonAtlasAsset = cc.loader.getRes(res_2, dragonBones.DragonBonesAtlasAsset);
    },

    getSoundAndDelayTime(phizId) {
        let config = [
            ["phiz_py_ganbei",0.7],
            ["phiz_py_zhadan",0.6],
            ["phiz_py_daoshui",0.5],
            ["phiz_py_qinwen",0.5],
            ["phiz_py_bixin",0.5],
            ["phiz_py_sendflower",0.3],
        ];
        let info = config[phizId];
        let sound = info[0];
        let delay = info[1];
        let angle = info[2] || 0;
        return [sound,delay,angle];
    },

    getBezierConfig(fromPos, toPos) {
        let offPoint = cc.v2(toPos.x - fromPos.x, toPos.y - fromPos.y);
        let controll1 = cc.v2(fromPos.x, fromPos.y + 100);
        let controll2 = cc.v2(fromPos.x + offPoint.x*3/5, toPos.y + 100);
        let bezierConfig = [controll1
            , controll2
            , toPos];
        return bezierConfig;
    },
});