/*
音乐播放器
统一处理音效、音乐
*/

let POKER_TYPE_MUSIC = {
    1: "single_",
    2: "double_",
    30: "sange_",
    31: "sandaiyi",
    32: "sandaier",
    40: "shunzi",
    41: "liandui",
    50: "feiji",
    51: "feiji",
    52: "feiji",
    60: "sidaier",
    61: "sidailiangdui",
    71: "zhadan",
    73: "wangzha",
};

cc.Class({
    properties: {
        _effect_mute: 0, //临时性的
        _effect_enabled: 1,
        effect: {
            get () {
                return this._effect_enabled;
            },
            set(enabled) {
                this._effect_enabled = Number(enabled) || 0;
                cc.sys.localStorage.setItem(qf.skey.IS_EFFECTS_ENABLED, this._effect_enabled.toString());
            }
        },

        _music_enabled: 1,
        music: {
            get() {
                return this._music_enabled;
            },
            set (enabled) {
                this._music_enabled = Number(enabled) || 0;
                cc.sys.localStorage.setItem(qf.skey.IS_BGMUSIC_ENABLED, this._music_enabled.toString());
            }
        },

        _vibration_enabled: 1,
        vibration: {
            get() {
                return this._vibration_enabled;
            },
            set (enabled) {
                this._vibration_enabled = Number(enabled) || 0;
                cc.sys.localStorage.setItem(qf.skey.IS_VIBRATION_ENABLED, this._vibration_enabled.toString());
            }
        },

        _look_enabled: 1,
        look: {
            get() {
                return this._look_enabled;
            },
            set (enabled) {
                this._look_enabled = Number(enabled) || 0;
                cc.sys.localStorage.setItem(qf.skey.IS_SETTING_LOOK_ENABLED, this._look_enabled.toString());
            }
        },

        _yy_enabled: 1,
        yy: {
            get() {
                return this._yy_enabled;
            },
            set (enabled) {
                this._yy_enabled = Number(enabled) || 0;
                cc.sys.localStorage.setItem(qf.skey.IS_SETTING_YY_ENABLED, this._yy_enabled.toString());
            }
        },

        _chat_enabled: 1,
        chat: {
            get() {
                return this._chat_enabled;
            },
            set (enabled) {
                this._chat_enabled = Number(enabled) || 0;
                cc.sys.localStorage.setItem(qf.skey.IS_SETTING_CHAT_ENABLED, this._chat_enabled.toString());
            }
        },

        music_name: "",
        _audio_chip_map: { default: {} },

        is_sining_out: false,
        is_sining_in: false,
    },

    ctor() {
        this._effect_enabled = Number(cc.sys.localStorage.getItem(qf.skey.IS_EFFECTS_ENABLED) || 1);

        this._vibration_enabled = Number(cc.sys.localStorage.getItem(qf.skey.IS_VIBRATION_ENABLED) || 1);

        this._music_enabled = Number(cc.sys.localStorage.getItem(qf.skey.IS_BGMUSIC_ENABLED) || 1);

        this._look_enabled = Number(cc.sys.localStorage.getItem(qf.skey.IS_SETTING_LOOK_ENABLED) || 1);

        this._yy_enabled = Number(cc.sys.localStorage.getItem(qf.skey.IS_SETTING_YY_ENABLED) || 1);

        this._chat_enabled = Number(cc.sys.localStorage.getItem(qf.skey.IS_SETTING_CHAT_ENABLED) || 1);

    },

    //volume: 0.0 ~ 1.0
    setMusicVolume(volume) {
        volume = Number(volume) || 0;
        cc.audioEngine.setMusicVolume(volume);
    },
    getMusicVolume() {
        return cc.audioEngine.getMusicVolume();
    },
    stopMusic(isReleaseData) {
        cc.audioEngine.stopMusic();
        this.music_name = "";
    },
    playMusic(name, isloop) {
        if (name === this.music_name) return;

        if (!this._music_enabled) return;

        isloop = Boolean(isloop);

        if (this._audio_chip_map[name]) {
            cc.audioEngine.playMusic(this._audio_chip_map[name], isloop);
        }
        else {
            cc.loader.loadRes(name, cc.AudioClip, (err, audio_chip) => {
                this._audio_chip_map[name] = audio_chip;
                if (music_name === name) {
                    this.playMusic(name, isloop);
                }
            });
        }

        this.music_name = name;
    },
    pauseMusic() {
        cc.audioEngine.pauseMusic();
    },
    resumeMusic() {
        cc.audioEngine.resumeMusic();
    },

    sineOutMusic() {
        if (this.is_sining_out) return;

        this.is_sining_in = false;
        this.is_sining_out = true;

        let volume = this.getMusicVolume();
        let sineout = ()=>{
            if (volume <= 0.02) {
                this.stopMusic();
            }
            if (!this.is_sining_out || volume <= 0.02) {
                this.setMusicVolume(0);
                this.is_sining_out = false;
                return;
            }

            volume = Math.min(volume - 0.01, 0);
            this.setMusicVolume(volume);

            setTimeout(()=>{
                sineout();
            }, 200);
        }
        sineout();
    },
    sineInMusic() {
        if (this.is_sining_in) return;

        this.is_sining_in = true;
        this.is_sining_out = false;

        this.playMusic(qf.res.lord_music.background);

        let volume = 0;
        let sinein = ()=>{
            if (volume >= 1) {
                this.playMusic(qf.res.lord_music.background);
            }
            if (!this.is_sining_in || volume >= 1) {
                this.setBackGroundMusicVolume(1);
                this.is_sining_in = false;
                return;
            }
            volume = Math.min(volume + 0.01, 1);
            this.setMusicVolume(volume);

            setTimeout(() => {
                sinein();
            }, 200);
        }
        sinein();
    },

    //播放音效
	playMyEffect(filename){
		if(!qf.utils.isValidType(this.pauseGameEffects)){
			filename = qf.res.lord_music[filename];
			if (qf.utils.isValidType(filename)) {
				this.playEffect(filename);
			}
		}
	},
    playEffect(name, isloop) {
        isloop = Boolean(isloop);

        if (this._effect_mute) return;

        if (!this._effect_enabled) return;

        if (this._audio_chip_map[name]) {
            return cc.audioEngine.playEffect(name, isloop);
        }
        else {
            cc.loader.loadRes(name, cc.AudioClip, (err, audio_chip)=>{
                this._audio_chip_map[name] = audio_chip;
            })
        }
    },
    stopEffect(id) {
        cc.audioEngine.stopEffect(id);
    },
    setEffectMute(mute) {
        this._effect_mute = Boolean(mute);
        if (this._effect_mute) {
            cc.audioEngine.stopAllEffects();
        }
    },

    readCard(id, type, u) {
        if (!(type = Number(type))) return;

        let sex = 1;// Cache.desk.getSexByUin(u.uin);
        let num = 1; //Cache.desk.getCardNumByUin(u.uin);
        let effect_name = null;
        if (type === qf.const.LordPokerType.DANZHANG ||
            type === qf.const.LordPokerType.DUIZI || 
            type === qf.const.LordPokerType.SAN)
        {
            effect_name = POKER_TYPE_MUSIC[type] + qf.utils.pointById(id).toString();
        }
        else {
            effect_name = POKER_TYPE_MUSIC[type];
        }

        if (!effect_name) return;

        //0:男 1:女
        effect_name = qf.res.lord_music[effect_name + "_" + sex];

        this.playEffect(effect_name);

        if (num <= 2 && num > 0) {
            this.playEffect(qf.res.lord_music["last" + num + "_" + sex]);
        }
    }
});