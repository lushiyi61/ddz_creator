
/*
平台接口基础类
*/

cc.Class({
    properties: {
        // 无需做适配的手机品牌
        _noNeedAdaptBrandList: [],

        // 需要适配的品牌中为全面屏但是无刘海的手机型号（无需适配）
        // 型号统一用小写
        _noDangerAreaModelList: [],

        // 需要额外适配的机型 Key:model Value:height
        // 型号统一用小写
        _needAdaptModelMap: {
            default: {},
        },
    },

    ctor() {
        this.registerOnGlobalError();
        this.loc_login_data = {};
        this.loclaunch_options = {};
        this.launch_options = null;
        this.onshow_options = {};

        this.initIPhoneXConfig();
    },

    onHide() {},
    onShow() {},
    getOnShowData() {},
    clearOnShowData() {},
    clearOnShowOptions() {},
    onLaunch() {},
    report() {},
    authorize() {},
    showTips(){},
    login() {},
    getLaunchData() {},
    clearLocLaunchData() {},
    getLocLaunchData() {},
    getRegInfo() {},
    allPay() {},
    requestPayBill() {},
    paySuccessReq() {},
    share() {},
    shareMessage() {},
    keepScreenOn() {},
    hideKeyboard() {},
    exit() {},
    forceUpdate() {},
    uploadError() {},
    uploadEventStat() {},
    uploadHortorStat() {},
    initWallSDK() {},
    loginWallSDK() {},
    setClipboardData() {},
    getSystemInfoSync() { return {}; },
    reportEndGameData() {},
    setUserCloudStorage() {},
    getOpenDataContext() {},
    createRewardedVideoAd() {},
    showRewardedVideoAd() {},
    getSetting() {},
    previewImage() {},
    isSupportNavigate() {},
    navigateToMiniProgram() {},
    setLocLoginData() {},
    removeFile() {},
    makeDir() {},
    writeFile() {},
    saveImageToPhotosAlbum() {},
    toTempFilePath() {},
    getQRCode() {},
    access() {},

    //web可用
    checkSession(cb) {
        if (cb) cb(0);
    },

    openSetting(cb) {
        if (cb) cb(0);
    },

    clearLocLaunchAndShowData() {
        this.clearLocLaunchData();
        this.clearOnShowData();
        this.clearOnShowOptions();
    },

    getLocLoginData() {
        return this.loc_login_data;
    },

    setLocLoginAsscessToken(token) {
        this.loc_login_data = this.loc_login_data || {};
        this.loc_login_data.body = this.loc_login_data.body || {};
        this.loc_login_data.body.access_token = token;
    },

    testWXLogin(successCb) {
        let body = {uin: qf.cfg.UIN};

        if (successCb) successCb(qf.cmd.TEST_LOGIN, body);
    },

    garbageCollect() {
        cc.sys.garbageCollect();
    },

    getBatteryLevel() {
        return "0";
    },

    getPlatformName() {
        return "web"
    },

    registerOnGlobalError() {
        window.onerror = () => {};
    },

    getUserInfoWithOutButton() {
        return true;
    },

    createUserInfoButton() {
        return true;
    },

    getUserIsAuthorization() {
        return true;
    },

    getLocalResPath() {
        return "";
    },

    initIPhoneXConfig() {
        // 无需做适配的手机品牌
        this._noNeedAdaptBrandList = [
            // "HUAWEI",
            "Xiaomi",
            "samsung",
            "OnePlus",
            "meizu",
            "HONOR"
        ];

        // 需要适配的品牌中为全面屏但是无刘海的手机型号（无需适配）
        // 型号统一用小写
        this._noDangerAreaModelList = [
            "vivo nex",
            "oppo r17",
            "oppo find",
            "vivo x23",
        ];
    },

    getIPhoneXOffsetHeight () {
        let t = cc.view.getFrameSize(), height = 0;
        
        if (t.width === 1125 && t.height === 2436) { //iPhoneX
            height = 189;
        }
        else if (t.width === 375 && t.height === 812) { //iPhoneX
            height = 63;
        }
        else if (t.width === 1080 && t.height === 2208) { //vivo Y85A
            height = 171;
        }
        else if (t.width === 360 && t.height === 736) { //vivo Y85A
            height = 57;
        }
        else {
            let systemInfo = this.getSystemInfoSync();
            let statusBarHeight = systemInfo.statusBarHeight || 0;
            if (statusBarHeight < 28) {
                height = 0;
            }
            else {
                let model = systemInfo.model;
                let brand = systemInfo.brand;
                let value = this.getNeedAdaptValue(model);
                if (this.isNoNeedAdapt(brand) || this.isNoDangerArea(model)) {
                    // 无需做适配
                }
                else if (value !== null) {
                    height = value;
                }
                else if (t.width < t.height) {  // 未知分辨率机型统一按iphoneX适配
                    height = 63;
                }
                else if (t.width > t.height) {
                    height = 63;
                }
            }
        }

        return height;
    },

    isNoNeedAdapt (brand) {
        if (!brand) return false;

        let list = this._noNeedAdaptBrandList;

        for (let i in list) {
            if (brand.toLowerCase() === list[i].toLowerCase()) {
                return true;
            }
        }

        return false;
    },

    isNoDangerArea (model) {
        if (!model) return false;

        let list = this._noDangerAreaModelList;

        for (let i in list) {
            if (model.toLowerCase().indexOf(list[i].toLowerCase()) !== -1) {
                return true;
            }
        }

        return false;
    },

    getNeedAdaptValue (model) {
        if (!model) return null;

        let list = this._needAdaptModelMap;

        for (let key in list) {
            if (model.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                return list[key];
            }
        }

        return null;
    },
});