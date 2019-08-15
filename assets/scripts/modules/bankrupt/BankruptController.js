
let Controller = require("../../frameworks/mvc/Controller");

cc.Class({
    extends: Controller,

    initGlobalEvent() {
        qf.event.addEvent(qf.ekey.DDZ_PROTECT_NOTIFY,this.enterBankrupt,this);
    },

    enterBankrupt(rsp) {
        logd("破产保护通知");
        let model = rsp.model;

        //显示破产保护框
        if(model && model.give_gold && model.content){
            this.showBackruptDialog({coin:model.give_gold,content:model.content,count:model.count,share_info:model.share_info});
        }
    },

    showBackruptDialog(args) {
        qf.rm.checkLoad("bankrupt",()=>{
            let data = {
                prefab: qf.res.prefab_bankrupt,
                script: 'BankruptView',
                loadded_data: true,
                init_data:args,
            }
            qf.dm.push(data);
            qf.dm.pop();
        })
    },
});