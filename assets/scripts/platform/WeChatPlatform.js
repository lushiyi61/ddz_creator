/*
微信平台接口类
*/

let BasicPlatform = require("./BasicPlatform");

cc.Class({
    extends: BasicPlatform,

    properties: {

    },

    ctor() {
        this.is_update_ready = false;
        this.is_force_update = false;
        this.launch_options = this.getLaunchData().query;

        this.initWallSDK();
    },

    showTips(type) {
        if (type) {
            if (wx.showModal) {
                wx.showModal({
                    title: qf.txt.wx_modal_title,
                    content: qf.txt.wx_modal_content
                })
                return;
            }
        }
        qf.log.loge(qf.txt.wx_modal_content);
    },

    getLaunchData() {
        if (!this.launch_data) {
            if (wx.getLaunchOptionsSync) {
                this.launch_data = wx.getLaunchOptionsSync();
            } else {
                this.showTips();
            }
        }

        return this.launch_data;
    },

    getLocLaunchData() {
        this.loclaunch_options = qf.func.clone(this.launch_options);
        return this.loclaunch_options;
    },

    clearLocLaunchData() {
        this.loclaunch_options = {};
        this.launch_options = {};
    },

    getOnShowData() {
        return this.onshow_options;
    },

    clearOnShowData() {
        this.onshow_options = {};
    },

    getOnShowOptions() {
        return this.options;
    },

    clearOnShowOptions() {
        this.options = {};
    },

    clearLocLaunchAndShowData() {
        this.clearLocLaunchData();
        this.clearOnShowData();
        this.clearOnShowOptions();
    },

    onHide() {
        if (this.onshow_options.type === qf.const.LaunchOptions.TYPE_INVITATION_SHARE) {
            this.onshow_options = {};
        }
    },

    onShow(options) {
        if (!options) return;

        let showQuery = options.query || {};
        this.onshow_options = showQuery;

        if (showQuery[qf.cosnt.LaunchOptions.type] === qf.const.LaunchOptions.TYPE_INVITE_FRIEND) {
            //邀请有礼
        } else if (showQuery[qf.cosnt.LaunchOptions.type] === qf.const.LaunchOptions.TYPE_RULES_INVITE) {
            //规则引导
        } else if (showQuery[qf.cosnt.LaunchOptions.type] === qf.const.LaunchOptions.TYPE_GROUP_RANK_SHARE) {
            //群排行榜
        } else if (showQuery[qf.cosnt.LaunchOptions.type] === qf.const.LaunchOptions.TYPE_END_GAME_GROUP_RANK_SHARE) {
            //残局榜群排行榜
        }
    },

    report(key, value) {
        if (wx.setUserCloudStorage) {
            wx.setUserCloudStorage({
                KVDataList: [{ key: key, value: String(value) }],
                success: () => { },
                fail: () => { }
            });
        } else {
            this.showTips();
        }
    },

    authorize(scope, cb) {
        scope = scope || "scope.userInfo";

        if (wx.authorize) {
            wx.authorize({
                scope: scope,
                success: () => {
                    if (cb) cb(0);
                },
                fail: (res) => {
                    if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                        // 处理用户拒绝授权的情况
                        if (cb) cb(-1);
                    }
                }
            })
        } else {
            this.showTips();
        }
    },

    getSetting(cb, scope) {
        scope = scope || "scope.userInfo";

        if (wx.getSetting) {
            wx.getSetting({
                success: (res) => {
                    let authSetting = res.authSetting || {};

                    if (authSetting[scope]) {
                        if (cb) cb(0);
                    } else {
                        if (cb) cb(-1);
                    }

                    cb = null;
                },
                fail: () => {
                    if (cb) cb(-1);
                    cb = null;
                }
            })
        } else {
            if (cb) cb(-1);
            this.showTips();
        }
    },

    getUserInfoWithOutButton(cb) {
        if (wx.getUserInfo) {
            wx.getUserInfo({
                withCredentials: true,
                success: (res) => {
                    qf.log.loge(res);
                    if (cb) cb(0, res);
                },
                fail: () => {
                    let firstAuth = cc.sys.localStorage.getItem(qf.skey.IS_WX_FIRST_AUTH) || 0;
                    firstAuth++;

                    cc.sys.localStorage.setItem(qf.skey.IS_WX_FIRST_AUTH, firstAuth);
                    if (cb) cb(-1);
                }
            })
        } else {
            if (cb) cb(0);
            this.showTips();
        }
    },

    login(cb) {
        if (wx.login) {
            wx.login({
                success: (res) => {
                    this.loc_login_data = this.loc_login_data || {};
                    this.loc_login_data.code = res.code;
                    this.getSetting((ret) => {
                        if (ret === 0) {
                            this.getUserInfoWithOutButton(cb);
                        } else {
                            if (cb) cb(0);
                        }
                    }, "scope.userInfo")
                },
                fail: () => {
                    if (cb) cb(0);
                }
            })
        } else {
            this.showTips();
        }
    },

    checkSession(cb) {
        if (wx.checkSession) {
            wx.checkSession({
                success: () => {
                    if (cb) cb(0);
                },
                fail: () => {
                    if (cb) cb(-1);
                }
            })
        } else {
            this.showTips();
        }
    },

    openSetting(cb, scope) {
        scope = scope || "scope.userInfo";
        if (wx.openSetting) {
            wx.openSetting({
                success: (res) => {
                    let authSetting = res.authSetting || {};

                    if (authSetting[scope]) {
                        if (cb) cb(0);
                    } else {
                        if (cb) cb(-1);
                    }
                },
                fail: () => {
                    if (cb) cb(-1);
                }
            })
        } else {
            this.showTips();
        }
    },

    getSystemInfoSync() {
        let systemInfo = {};
        if (wx.getSystemInfoSync) {
            systemInfo = wx.getSystemInfoSync();
        } else {
            this.showTips();
        }

        return systemInfo;
    },

    getPlatformName() {
        let systemInfo = this.getSystemInfoSync();
        return systemInfo.platform;
    },

    getRegInfo(cb) {
        let loginCallback = (ret, args) => {
            this.loc_login_data = this.loc_login_data || {};
            this.loc_login_data.cmd = qf.cmd.WECHAT_GAME_LOGIN;

            let body = this.loc_login_data.body || {};

            body.channel = qf.cfg.CHANNEL;
            body.version = qf.cfg.VERSION;
            body.os = this.getPlatformName();
            body.res_version = qf.cfg.RES_VERSION;

            args = args || {};

            body.encrypted_data = args.encryptedData || null;
            body.iv = args.iv || null;

            let loginQuery = qf.utils.getLaunchData();

            //检测是否邀请进入
            if (loginQuery) {
                let fuin = qf.func.checkint(loginQuery.fromUin);

                if (fuin) {
                    body.inviter = fuin;
                    let inviter_info = {};
                    if (loginQuery.type === qf.const.LaunchOptions.TYPE_INVITATION_SHARE) {
                        inviter_info = {
                            inviter_uin: parseInt(fuin),
                            inviter_type: qf.const.INVITE_TYPE.INVITATION,
                        }
                    } else if (loginQuery.type === qf.const.LaunchOptions.TYPE_DIAMONDACTIVITY_SHARE) {
                        inviter_info = {
                            inviter_uin: parseInt(fuin),
                            inviter_type: qf.const.INVITE_TYPE.DIAMONDACTIVITY,
                        }
                    } else if (loginQuery.type === qf.const.LaunchOptions.TYPE_DIAMONDACTIVITY_INVITE_SHARE) {
                        inviter_info = {
                            inviter_uin: parseInt(fuin),
                            inviter_type: qf.const.INVITE_TYPE.DIAMONDACTIVITY_INVITE,
                        }
                    } else if (loginQuery.type === qf.const.LaunchOptions.TYPE_REWARD_DIAMOND_SHARE || loginQuery.type === qf.const.LaunchOptions.TYPE_REWARD_DIAMOND_INVITE) {
                        inviter_info = {
                            inviter_uin: parseInt(fuin),
                            inviter_type: qf.const.INVITE_TYPE.REWARDDIAMOND,
                        }
                    } else if (loginQuery.type === qf.const.LaunchOptions.TYPE_NATIONALDAY_SHARE) {
                        inviter_info = {
                            inviter_uin: parseInt(fuin),
                            inviter_type: qf.const.INVITE_TYPE.NATIONALDAY_INVITE,
                        }
                    } else {
                        inviter_info = {
                            inviter_uin: parseInt(fuin),
                            inviter_type: qf.const.INVITE_TYPE.NORMALINVITE,
                        }
                    }

                    //检测是否邀请二维码入内
                    if (loginQuery.query && loginQuery.query.scene) {
                        let invite = qf.utils.parseKV(decodeURIComponent(loginQuery.query.scene));

                        if (parseInt(invite.type) === qf.const.INVITE_TYPE.NATIONALDAY_QRCODE_INVITE) {
                            inviter_info = {
                                inviter_uin: parseInt(invite.uin),
                                inviter_type: qf.const.INVITE_TYPE.NATIONALDAY_QRCODE_INVITE
                            }
                        }
                    }

                    body.inviter_info = inviter_info;
                }
            }

            if (ret === 0) {
                if (cb) cb(0);
            } else {
                if (cb) cb(-1);
            }

            this.loc_login_data.body = body;
        }

        this.login(loginCallback);
    },

    createUserInfoButton(cb, args) {
        args = args || {};
        let version666 = false;
        let systemInfo = this.getSystemInfoSync();
        let version = systemInfo.version;

        if (version === "6.6.6") version666 = true;

        if (wx.createUserInfoButton && !version666) {
            if (this.userInfoButton) {
                this.userInfoButton.destroy();
                this.userInfoButton = null;
            }

            let type = args.type || 'image';
            let image = args.image || "images/btn_wx_author_mainview.png";
            let btnSize = args.size || { width: systemInfo.screenWidth, height: systemInfo.screenHeight };
            let left = args.left || 0;
            let top = args.top || 0;

            let button = wx.createUserInfoButton({
                type: type,
                image: image,
                style: {
                    left: left,
                    top: top,
                    width: btnSize.width,
                    height: btnSize.height,
                    lineHeight: 16,
                    backgroundColor: '#ffffff',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            })

            let isOnTap = false;

            button.onTap((res) => {
                if (!isOnTap) {
                    let destroyButton = () => {
                        isOnTap = true;
                        button.destroy();
                        button = null;
                    }

                    if (res.userInfo) {
                        if (cb) cb(0, res, destroyButton);
                    } else {
                        if (cb) cb(-1, res, destroyButton);
                    }
                }
            })

            this.userInfoButton = button;
        } else {
            this.showTips();
            return false;
        }

        return true;
    },

    setLocLoginData(data) {
        this.loc_login_data = data;
    },

    getLocLoginData() {
        let login_data = qf.func.clone(this.loc_login_data);
        return login_data;
    },

    //判断用户是否授权
    getUserIsAuthorization() {
        return this.loc_login_data ? this.loc_login_data.body ? this.loc_login_data.body.encrypted_data ? this.loc_login_data.body.iv ? true : false : false : false : false;
    },

    removeFile(filePath, completeCb) {
        wx.getFileSystemManager().unlink({
            filePath: filePath,
            success: () => {
                if (completeCb) completeCb(0);
            },
            fail: () => {
                if (completeCb) completeCb(-1);
            }
        })
    },

    writeFile(filePath, data, completeCb) {
        wx,
            getFileSystemManager().writeFile({
                filePath: filePath,
                data: data,
                success: () => {
                    if (completeCb) completeCb(0);
                },
                fail: () => {
                    if (completeCb) completeCb(-1);
                }
            })
    },

    saveImageToPhotosAlbum(filePath, completeCb) {
        if (wx.saveImageToPhotosAlbum) {
            wx.saveImageToPhotosAlbum({
                filePath: filePath,
                success: () => {
                    if (completeCb) completeCb(0);
                },
                fail: () => {
                    if (completeCb) completeCb(-1);
                }
            })
        } else {
            if (completeCb) completeCb(-1);
            this.showTips();
        }
    },

    access(filePath, successCb, failCb) {
        wx.getFileSystemManager().access({
            path: filePath,
            success: () => {
                if (successCb) successCb();
            },
            fail: () => {
                if (failCb) failCb();
            }
        })
    },

    /*
    打开同一个公众号下另外一个小程序
    appId: 要打开的小程序appId
    data: 要传递的数据
    completeCb: 调用接口后的回调
    */
    navigateToMiniProgram(appId, data, completeCb) {
        let systemInfo = this.getSystemInfoSync();

        let paras = {
            appId: appId,
            path: data.path,
            extraData: data.extraData,
            envVersion: data.envVersion,
            success: () => {
                //打开成功
                if (completeCb) completeCb(0);
            },
            fail: (res) => {
                //打开失败
                if (completeCb) completeCb(-1);
            }
        }

        if (wx.navigateToMiniProgram) {
            wx.navigateToMiniProgram(paras);
        } else {
            if (completeCb) completeCb(-1);
            this.showTips();
        }
    },

    //预览图片
    previewImage(urls, completeCb) {
        if (!urls || url.length < 1) return;

        if (wx.previewImage) {
            wx.previewImage({
                urls: urls,
                success: () => {
                    if (completeCb) completeCb(0);
                },
                fail: () => {
                    if (completeCb) completeCb(-1);
                }
            })
        } else {
            this.showTips();
        }
    },

    createRewardedVideoAd() {
        if (wx.createRewardedVideoAd) {
            this.videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-0ea879b10abb7390' //adUnitId 微信后台配置的广告位Id
            });

            this.videoAd.onError(() => {
                qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.txt.ad_err_tips });
            });

            // 用户点击了[关闭广告]按钮
            this.videoAd.onClose((res) => {
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束
                    if (this.cbVideoAdClose) {
                        this.cbVideoAdClose();
                    } else {
                        qf.event.dispatchEvent(qf.ekey.GET_USER_AD_INFO_REQ, { type: qf.const.FLOWMAIN_TYPE.OVER });
                    }
                }
            });
        } else {
            this.showTips(true);
            return false;
        }

        return true;
    },

    showRewardedVideoAd(cbVideoAdClose) {
        if (this.videoAd) {
            this.cbVideoAdClose = cbVideoAdClose || null;

            try {
                this.videoAd.show();
            } catch (error) {
                this.videoAd.load();
                this.videoAd.show();
            }
        }
    },

    getOpenDataContext() {
        if (wx.getOpenDataContext) {
            return wx.getOpenDataContext();
        }

        this.showTips();
        return false;
    },

    //对用户托管数据进行写数据操作
    setUserCloudStorage(args) {
        if (wx.setUserCloudStorage) {
            let KVDataList = [];
            for (let key in args) {
                let KV = { key: key, value: args[key] + "" };
                KVDataList.push(KV);
            }

            wx.setUserCloudStorage({
                KVDataList: KVDataList,
                success: () => {
                    qf.log.loge("托管数据保存成功");
                },
                fail: () => {
                    qf.log.loge("托管数据保存失败");
                }
            })
        } else {
            this.showTips();
        }
    },

    setClipboardData(wxPublicData) {
        if (wx.setClipboardData) {
            wx.setClipboardData({
                data: String(wxPublicData) || ""
            })
        } else {
            this.showTips();
        }
    },

    registerOnGlobalError() {
        if (wx.onError) {
            wx.onError((res) => {
                this.uploadError(String(res.message));
            });
        } else {
            this.showTips();
        }
    },

    initWallSDK() {
        if (window['wallsdk']) {
            window['wallsdk'].init({
                gameId: qf.cfg.HORTOR_WALL_GAMEID, // 游戏ID
                key: qf.cfg.HORTOR_WALL_KEY, // Key
                env: 'Prod', // 运行环境 测试：Test 上线：Prod
                gameVersion: qf.cfg.VERSION, // 游戏版本号
            });
        }
    },

    loginWallSDK(openId, sex) {
        sex = qf.func.checkint(sex) + 1;
        if (window['wallsdk']) {
            window['wallsdk'].setLogind(openId, sex, "");
        }
    },

    //给疯狂游戏上报数据 只有分享成功上报
    uploadHortorStat() {
        let query = this.launch_data.query || {};

        let tp = "share";
        let gameId = qf.cfg.HORTOR_GAMEID;
        let secret = qf.cfg.HORTOR_SECRET;
        let source = query.subchid || "";
        let channel = qf.utils.parseKV(query.scene).channel || "";
        let userId = qf.cache.user.uin;

        let timestamp = Math.floor(new Date().getTime() / 1000);

        let md5str = "gameId=" + gameId;
        md5str = md5str + "secret=" + secret;
        md5str = md5str + "timestamp=" + timestamp;
        md5str = md5str + "tp=" + tp;

        let sign = md5(md5str);

        let postInfo = {
            "tp": tp,
            "data": {
                "gameId": gameId,
                "source": source,
                "channel": channel,
                "userId": "" + userId,
                "scene": 0,
                "sign": sign
            },
            "timestamp": timestamp
        };

        if (wx.request) {
            wx.request({
                url: qf.cfg.HOST_HTTP + qf.cfg.UPLOAD_HORTOR_NAME,
                method: "POST",
                header: {
                    'Accept': 'application/json'
                },
                data: postInfo,
                success: () => {
                    //上传统计成功
                },
                fail: () => {
                    //上传统计失败
                }
            })
        } else {
            this.showTips();
        }
    },

    //数据上报
    uploadEventStat(args) {
        let postInfo = {
            "source": "pywxddz",
            "channel": qf.cfg.CHANNEL,
            "version": qf.cfg.VERSION,
            "os": this.getPlatformName(),
            "res_version": qf.cfg.RES_VERSION,
            "path": this.getLaunchData().path,
            "session_id": qf.utils.getUuid(),
            "uin": qf.cache.user.uin,
            "module": args.module,
            "event": args.event,
            "value": args.value,
            "custom": args.custom,
            "extend": args.extend, //以{key:value}的形式
        };

        if (wx.request) {
            wx.request({
                url: qf.cfg.HOST_HTTP + qf.cfg.UPLOAD_STAT_NAME,
                method: "POST",
                header: {
                    'Accept': 'application/json'
                },
                data: { 'data': JSON.stringify(postInfo) },
                success: () => {
                    //上传统计成功
                },
                fail: () => {
                    //上传统计失败
                }
            })
        } else {
            this.showTips();
        }
    },

    uploadError(content) {
        let url = qf.cfg.HOST_HTTP + qf.cfg.HOST_NAME + "/client/exc/record";
        let uin = String(qf.cache.user.uin || 0);
        let os = this.getPlatformName();

        if (wx.request) {
            wx.request({
                url: url,
                method: "POST",
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    uin: uin,
                    channel: qf.cfg.CHANNEL,
                    version: String(qf.cfg.VERSION),
                    res_version: String(qf.cfg.RES_VERSION),
                    os: os,
                    content: content
                },
                success: () => {
                    //上传统计成功
                },
                fail: () => {
                    //上传统计失败
                }
            })
        } else {
            this.showTips();
        }
    },

    listen() {
        if (wx.showShareMenu) {
            wx.showShareMenu({
                withShareTicket: true
            });
        } else {
            this.showTips();
        }

        let share_paras = {
            title: qf.txt.common_share_txt,
            imageUrl: qf.res.share_banner_normal_game,
        };
        if (share_paras.imageUrl.substr(0, 4) !== "http") {
            share_paras.imageUrl = window.REMOTE_SERVER_ROOT + share_paras.imageUrl;
        }
        if (wx.onShareAppMessage) {
            wx.onShareAppMessage(() => {
                let fuin = null;
                if (qf.cache && qf.cache.user && qf.cache.user && qf.cache.user.uin) {
                    fuin = qf.cache.user.uin;
                }

                //数据上报
                qf.platform.uploadEventStat({
                    "module": "share",
                    "event": qf.rkey.PYWXDDZ_EVENT_SHARE_CLICK_SHARE_BTN,
                    "custom": {
                        scene: qf.const.ShareScene.MAIN,
                        via: qf.const.ShareMsgType.APPSHARE,
                    }
                });

                share_paras.query = "type=" + LaunchOptions.TYPE_APP_SHARE + "&fromUin=" + fuin;
                share_paras.success = (res) => {
                    qf.platform.uploadEventStat({
                        "module": "share",
                        "event": qf.rkey.PYWXDDZ_EVENT_SHARE_SUCCESS,
                        "custom": {
                            scene: qf.const.ShareScene.MAIN,
                            via: qf.const.ShareMsgType.APPSHARE,
                        }
                    });

                    this.uploadHortorStat();
                    if (qf.net.isConnected()) {
                        qf.net.send({
                            cmd: qf.cmd.DDZ_COMSHARE_SUCBACK_REQ,
                            wait: true,
                            body: { share_id: -1 },
                            callback: (rsp) => { }
                        });
                    }
                };
                return share_paras;
            });
        } else {
            this.showTips();
        }
    },

    exit() {
        if (wx.exitMiniProgram) {
            wx.exitMiniProgram();
        } else {
            this.showTips();
        }
    },

    hideKeyboard(successCb, failCb, completeCb) {
        if (wx.hideKeyboard) {
            wx.hideKeyboard({
                success: () => {
                    if (successCb) successCb();
                },
                fail: () => {
                    if (failCb) failCb();
                },
                complete: () => {
                    if (completeCb) completeCb();
                }
            });
        } else {
            this.showTips();
        }

        if (wx.offKeyboardConfirm) {
            wx.offKeyboardConfirm();
        } else {
            this.showTips();
        }
        if (wx.offKeyboardInput) {
            wx.offKeyboardInput();
        } else {
            this.showTips();
        }
        if (wx.offKeyboardComplete) {
            wx.offKeyboardComplete();
        } else {
            this.showTips();
        }
    },

    garbageCollect() {
        if (wx.triggerGC) {
            wx.triggerGC();
        } else {
            this.showTips();
        }
    },

    keepScreenOn() {
        if (wx.setKeepScreenOn) {
            wx.setKeepScreenOn({
                keepScreenOn: true
            })
        } else {
            this.showTips();
        }
    },

    getShareInfo(args) {
        if (this.getSystemInfoSync().SDKVersion >= "2.3.0") {
            if (args.success) args.success({});
        } else {
            wx.getShareInfo({
                shareTicket: args.shareTicket,
                success: (res) => {
                    if (args.success) args.success(res);
                },
                fail: (res) => {
                    if (args.fail) args.fail(res)
                }
            })
        }
    },

    shareMessage(args) {
        let imageUrl = null;
        if (args && args.imageUrl)
            imageUrl = args.imageUrl;

        if (imageUrl && imageUrl.substr(0, 4) !== "http") {
            imageUrl = window.REMOTE_SERVER_ROOT + imageUrl;
        }

        let shareId = -1;
        if (args.shareId) {
            shareId = args.shareId;
        }
        if (args.query && args.query !== "") {
            args.query = args.query + "&shareId=" + shareId;
        } else {
            args.query = "shareId=" + shareId;
        }

        let successCb = () => {
            if (args.scb) {
                args.scb({
                    shareTickets: []
                });
            }

            this.uploadHortorStat();

            // var instance = Cache.globalInfo.getStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CUSTOM_DESK_INVITE);
            // if(instance) {
            //     qf.platform.uploadEventStat({   //好友房点击邀请-切换到邀请页面
            //         "module": "performance",
            //         "event": STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CUSTOM_DESK_INVITE,
            //         "value": instance
            //     });
            // }
            if (qf.net.isConnected()) {
                qf.net.send({
                    cmd: qf.cmd.DDZ_COMSHARE_SUCBACK_REQ,
                    wait: true,
                    body: { share_id: shareId },
                    callback: (rsp) => {
                        qf.net.util.rspHandler(rsp, {
                            successCb: (mode) => {
                                logd("--------com_share_success-------------");
                            }
                        });
                    }
                });
            }
        }

        if (wx.shareAppMessage) {
            setTimeout(() => {
                if (this.getSystemInfoSync().SDKVersion >= "2.3.0") { // 此版本之后无法获取分享回调
                    successCb();
                }
            }, 3000);

            wx.shareAppMessage({
                title: args.title, //标题
                imageUrl: imageUrl, //图片路径或网络地址
                query: args.query, //透传参数"key1=1&key2=2"格式

                success: (res) => {
                    console.log("分享成功");
                    if (this.getSystemInfoSync().SDKVersion >= "2.3.0") return;
                    if (args.scb) args.scb(res);

                    this.uploadHortorStat();

                    // var instance = Cache.globalInfo.getStatUploadTime(STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CUSTOM_DESK_INVITE);
                    // if(instance) {
                    //     qf.platform.uploadEventStat({   //好友房点击邀请-切换到邀请页面
                    //         "module": "performance",
                    //         "event": STAT_KEY.PYWXDDZ_EVENT_PERFORMANCE_CUSTOM_DESK_INVITE,
                    //         "value": instance
                    //     });
                    // }
                    if (qf.net.isConnected()) {
                        qf.net.send({
                            cmd: qf.cmd.DDZ_COMSHARE_SUCBACK_REQ,
                            wait: true,
                            body: { share_id: shareId },
                            callback: (rsp) => {
                                qf.net.util.rspHandler(rsp, {
                                    successCb: (mode) => {
                                        logd("--------com_share_success-------------");
                                    }
                                });
                            }
                        });
                    }
                },
                fail: (err) => {
                    console.log(err);
                    if (this.getSystemInfoSync().SDKVersion >= "2.3.0") return;
                    if (qf.utils.isValidType(args) && args.shareFail) args.shareFail();
                },
            })
        } else {
            this.showTips();
        }
    },

    allPay(args) {
        let payFunc = (billInfo) => {
            qf.utils.savePayBillId(billInfo.bill_id);

            if (wx.requestMidasPayment) {
                wx.requestMidasPayment({
                    mode: billInfo.mode,
                    env: billInfo.env,
                    offerId: billInfo.offerId,
                    currencyType: billInfo.currencyType,
                    platform: billInfo.platform,
                    buyQuantity: res.buyQuantity,
                    zoneId: billInfo.zoneId,
                    success: () => {
                        this.paySuccessReq(billInfo.bill_id);
                    },
                    fail: () => {
                        if (billInfo && billInfo.bill_id) {
                            this.paySuccessReq(billInfo.bill_id); //防止支付成功后，米大师返回支付失败
                        }
                    }
                })
            } else {
                this.showTips();
            }
        }

        this.requestPayBill(args, payFunc);
    },

    requestPayBill(args, payCb) {
        let loginInfo = this.getLocLoginData().body;
        let sdk_version = 21080330;
        let postInfo = "item_id=" + args.item_id + "&ref=" + args.ref + "&encrypted_data=" + encodeURIComponent(loginInfo.encrypted_data) + "&iv=" +
            encodeURIComponent(loginInfo.iv) + "&sdk_version=" + sdk_version + "&access_token=" + encodeURIComponent(loginInfo.access_token);

        if (args.gold_item_id) {
            postInfo = postInfo + "&gold_item_id=" + args.gold_item_id
        }

        if (wx.request) {
            wx.request({
                url: qf.cfg.HOST_PAY_NAME,
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                data: postInfo,
                success: (res) => {
                    qf.event.dispatchEvent(qf.ekey.DDZ_CLOSE_BUY_COVER); //取消商城点击购买遮罩
                    if (res.data.ret === 0) {
                        if (payCb) payCb(res.data); //拉起SDK支付
                    } else if (res.data.ret === 10001) {
                        qf.event.dispatchEvent(qf.ekey.GLOBAL_TOAST, { txt: qf.txt.unLoginBuy });
                    }
                },
                fail: () => {
                    qf.event.dispatchEvent(qf.ekey.DDZ_CLOSE_BUY_COVER); //取消商城点击购买遮罩
                }
            })
        } else {
            this.showTips();
        }
    },

    paySuccessReq(billId) {
        let reqNum = cc.sys.localStorage.getItem(billId + "") || 0; //通知服务器支付成功次数
        reqNum = reqNum + 1;
        cc.sys.localStorage.setItem(billId + "", reqNum);
        let loginInfo = this.getLocLoginData().body;
        let postInfo = "access_token=" + encodeURIComponent(loginInfo.access_token) + "&bill_id=" + billId;

        if (wx.request) {
            wx.request({
                url: qf.cfg.HOST_PAY_CALLBACK,
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                data: postInfo,
                success: (res) => {
                    if (res.data.ret === 0)
                        qf.utils.deletePayBillId(billId); //删除订单号
                    else {
                        if (reqNum >= 10) {
                            qf.utils.deletePayBillId(billId); //删除订单号
                            cc.sys.localStorage.setItem(billId + "", "");
                        } else {
                            if (reqNum % 3 === 0) {

                            } else {
                                this.paySuccessReq(billId);
                            }
                        }
                    }
                },
                fail: () => {
                    if (reqNum >= 10) {
                        qf.utils.deletePayBillId(billId); //删除订单号
                        cc.sys.localStorage.setItem(billId + "", "");
                    } else {
                        if (reqNum % 3 === 0) { } else {
                            this.paySuccessReq(billId);
                        }
                    }
                }
            })
        } else {
            this.showTips();
        }
    },

});