/*
HTTP请求
对多个平台做兼容，支持web、原生、微信小游戏
*/
cc.Class({
    /**
     * 登录下发的验证token
     */
    accesstoken: "",

    ctor() {
        this._url = "";
        this._method = "GET";
        this._timeout = 10000;
        
        this._xhr = cc.loader.getXMLHttpRequest();

        this.setTimeout(10000);
    },

    /**
     * 设置验证token
     * @param token
     */
    setAccessToken(token) {
        this.accesstoken = token;
    },

    setURL(url) {
        this._url = url;
    },
    setMethod(method) {
        this._method = method === "POST" ? "POST" : (method === "GET" ? "GET" : this._method);
    },
    //设置回调监听
    setListener(listener) {
        this._listener = listener;
    },
    setTimeout(timeout) {
        this._timeout = timeout;
        this._xhr.timeout = timeout;
    },
    setResponseType(responseType) {
        this._responseType = responseType;
        this._xhr.responseType = responseType;
    },
    open(url, method, timeout) {
        if (url !== undefined) {
            this.setURL(url);
            if (method !== undefined) {
                this.setMethod(method);
                if (timeout !== undefined) {
                    this.setTimeout(timeout);
                }
            }
        }
        this._xhr.open(this._method, this._url, true);
    },

    /**
     * 发送异步HTTP请求
     * @param data 请求参数
     */
    send(data) {
        let xhr = this._xhr;

        let errInfo = "load " + this._url + " failed!";

        //如果还没有open
        if (this._xhr.readyState === 0) {
            this.open();
        }

        //执行回调，内部必须用try/catch处理
        let _doCallBack = (err, response)=>{
            try {
                if (this._listener) this._listener(err, response);
            } catch (e) {
                loge(e);
            }
        }

        if (!cc.sys.isNative && /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
            xhr.onreadystatechange = ()=>{
                if (xhr.readyState === 4) {
                    xhr.status === 200 ? _doCallBack(null, xhr.responseText) : _doCallBack({
                        status:xhr.status, errorMessage:errInfo
                    }, null);
                }
            };
        }
        else {
            xhr.onload = ()=>{
                if (xhr._timeoutId >= 0) {
                    clearTimeout(xhr._timeoutId);
                }
                if (xhr.readyState === 4) {
                    xhr.status === 200 ? _doCallBack(null, xhr.response) : _doCallBack({
                        status:xhr.status, errorMessage:errInfo
                    }, null);
                }
            };

            xhr.onerror = ()=>{
                _doCallBack({status: xhr.status, errorMessage: errInfo}, null);
            };

            if (xhr.ontimeout === undefined) {
                xhr._timeoutId = setTimeout(()=>{
                    xhr.ontimeout();
                }, xhr.timeout);
            }

            xhr.ontimeout = ()=>{
                _doCallBack({status: xhr.status, errorMessage: "Request timeout: " + errInfo}, null);
            };
        }

        xhr.setRequestHeader("Content-Type", "application\/x-www-form-urlencoded;charset=utf-8");

        data ? (xhr.send(data)): (xhr.send());
    },
});