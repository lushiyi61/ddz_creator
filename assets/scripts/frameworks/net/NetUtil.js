cc.Class({
    rspHandler(rsp, args) {
        if (rsp.ret === qf.const.NET_WORK_STATUS.SUCCESS) {
        
            if (qf.utils.isValidType(args) && args.successCb) {
                var model = rsp.model;
            
                args.successCb(model);
            }
            
            return true;
        }
        else {
            if (rsp.ret === qf.const.NET_WORK_STATUS.TIMEOUT) {	//超时
                if (qf.utils.isValidType(args) && args.timeOutCb) {
                    args.timeOutCb();
                }
                else {
                    qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, {txt: qf.cache.config.errorMsg[rsp.ret] || cc.js.formatStr(qf.txt.common_error_tips, rsp.ret)});
                }
            }
            else {
                if (qf.utils.isValidType(args) && args.failCb) {
                    args.failCb();
                }
                else {
                    qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.cache.config.errorMsg[rsp.ret] || cc.js.formatStr(qf.txt.common_error_tips, rsp.ret)});
                }
            }
            return false;
        }
    }
})
