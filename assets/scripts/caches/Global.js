cc.Class({

    properties: {
        TAG: "GlobalInfo",
    },

    ctor() {
        this._global_info = {};
        this._uploadTimeTab = {};
    },

    set(key, value) {
        this._global_info[key] = value;
    },

    get(key) {
        return this._global_info[key];
    },

    setStatUploadTime(type) {
        this._uploadTimeTab[type] = new Date().getTime();
    },

    getStatUploadTime(type) {
        let curTime = new Date().getTime();
        let saveTime = this._uploadTimeTab[type];
        if (saveTime) {
            let instance = curTime - saveTime;
            this._uploadTimeTab[type] = null;
            return instance;
        }
        return null
    }
});