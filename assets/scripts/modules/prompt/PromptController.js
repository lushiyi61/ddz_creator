let Controller = require("../../frameworks/mvc/Controller");

cc.Class({
    extends: Controller,

    initGlobalEvent() {
        qf.event.addEvent(qf.ekey.SHOW_PROMPT_DIALOG,this.showPromptDialog,this);
    },

    // 显示通用提示框
    showPromptDialog(args) {
        qf.rm.checkLoad("prompt",()=>{
            let prefab = null;
            if(args.serverStop){
                prefab = qf.res.prefab_server_stop;
            }else{
                prefab = qf.res.prefab_prompt;
            }
            let data = {
                prefab: prefab,
                script: 'PromptView',
                loadded_data: true,
                init_data:args,
            }
            qf.dm.push(data);
            qf.dm.pop();
        })
    }
});