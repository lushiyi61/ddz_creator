/*
资源管理器
统一处理资源的加载、静默加载
*/

cc.Class({
    properties: {
        is_loadded: { default: {} },

        _sprite_atlas: { default: {} },

        _sprite_frames: { default: {} },
    },

    ctor() {

    },

    //获取指定模块的资源列表
    getResList(parent, module) {
        let ret = [], i;

        if (!module) {
            module = parent;
            parent = qf.resclassify;
        }

        //mark by Gallen,此处数据插入别修改方法调用，有坑,直接push会多递归一次
        if (typeof module === "string") {
            ret = qf.func.clone(parent[module]);

            typeof ret === "string" && (ret = [ret]);
        }
        else if (module instanceof Array) {
            for (i = 0; i < module.length; i++) {
                ret.push.apply(ret, this.getResList(parent, module[i]));
            }
        }
        else if (module instanceof Object) {
            for (i in module) {
                ret.push.apply(ret, this.getResList(parent[i], module[i]));
            }
        }

        return ret;
    },

    splitPathAndType(res) {
        let path = [], type = [];
        for (let i = 0; i < res.length; i++) {
            if (typeof res[i] === "string") {
                path[i] = res[i];
            }
            else {
                path[i] = res[i][0];
                type[i] = res[i][1];
            }
        }
        return [path, type];
    },

    genAlias(module) {
        let alias = [];
        //mark by Gallen
        if (module === "global") {
            alias = ["global"];
        }
        else {
            alias = [module];
        }

        return alias;
    },

    parseModule(module) {
        let modules = [], alias = [], i;

        if (typeof module === "string") {
            modules.push(module);
        }
        else if (module instanceof Array) {
            for (i = 0; i < module.length; i++) {
                modules.push.apply(alias, this.parseModule(module[i]));
            }
        }
        else if (module instanceof Object) {
            for (i in module) {
                modules.push.apply(alias, this.parseModule(module[i]));
            }
        }

        for (i = 0; i < modules.length; i++) {
            alias.push.apply(alias, this.genAlias(modules[i]));
        }

        return alias;
    },

    //预加载资源
    preload(module, complete) {

        complete || (complete = () => { });

        let alias = this.parseModule(module);
        let res_list = this.splitPathAndType(this.getResList(alias));

        cc.loader.loadResArray(res_list[0], res_list[1], (loaddedCount, count, result) => {
        }, (errors, resources) => {
            if (errors) {
                setTimeout(() => {
                    this.preload(module, complete);
                }, 500);
            }
            else {
                this.setLoadded(alias, true);
                this.setSpriteAtlasLoadded(resources);
                if (complete) complete();
            }
        });
    },

    //加载纹理缓存
    load(module, iterator, complete) {

        iterator || (iterator = () => { });
        complete || (complete = () => { });

        //显示加载百分比
        let funcPercent = (percent) => {
            if (!this.isLoadded("global")) return;
            if (typeof module !== "string" || (module !== "global" && module !== "iloadding" && module !== "maineffect")) {
                qf.event.dispatchEvent(qf.ekey.GLOBAL_SHOW_WAITING, { txt: qf.txt.net002 + percent + "%", isAutoDestroy: false });
            }
        }

        //加载回调
        let iteratorFunc = (result, count, loaddedCount) => {
            if (iterator) iterator(result, count, loaddedCount);
            funcPercent(Math.ceil(loaddedCount / count * 100));
        }

        funcPercent(0);	//显示加载百分比为0

        let alias = this.parseModule(module);
        let res_list = this.splitPathAndType(this.getResList(alias));

        cc.loader.loadResArray(res_list[0], res_list[1], (loaddedCount, count, result) => {
            this.loadIterator(result, count, loaddedCount, iteratorFunc);
        }, (errors, resources) => {
            this.loadComplete(errors, resources, module, alias, iteratorFunc, complete);
        });
    },

    //下载的迭代器
    loadIterator(result, count, loaddedCount, iterator) {
        //下载出错
        if (!result) {

        }
        else {
            if (iterator) iterator(result, count, loaddedCount);
        }
    },

    //下载完成的回调
    loadComplete(errors, resources, module, alias, iterator, complete) {
        if (!errors) {
            //没有错
            qf.event.dispatchEvent(qf.ekey.GLOBAL_REMOVE_WAITING);

            this.setLoadded(alias, true);

            this.setSpriteAtlasLoadded(resources);

            if (complete) complete();
        }
        else {
            //下载出错，延迟0.5s之后重新下载
            setTimeout(() => {
                cc.error(errors)
                this.load(module, iterator, complete);
            }, 500);
        }
    },

    setLoadded(alias, loadded) {
        if (typeof (alias) === "string") {
            this.is_loadded[alias] = loadded;
        }
        else {
            for (let i = 0; i < alias.length; i++) {
                this.is_loadded[alias[i]] = loadded;
            }
        }
    },

    //获取某个模块是否加载完成
    isLoadded(module) {
        return this.is_loadded[module] || false;
    },

    checkLoad(module, callback) {
        if (this.is_loadded[module]) {
            callback();
        }
        else {
            this.load(module, null, callback);
        }
    },

    setSpriteAtlasLoadded(resources) {
        if (!resources || resources.length <= 0) return;

        resources.forEach(item => {
            if (item instanceof cc.SpriteAtlas) {
                this._sprite_atlas[item.name] = item;

                let sprite_frames = item.getSpriteFrames();
                for (let k in sprite_frames) {
                    let sf = sprite_frames[k];
                    this._sprite_frames[sf.name] = sf;
                }
            }
        });
    },

    getSpriteFrame(atlas, name) {
        //如果只传了一个参数默认是直接获取精灵
        if (!name) {
            return this._sprite_frames[atlas];
        }

        let realatlas = cc.path.basename(cc.path.mainFileName(atlas)) + ".plist";
        if (this._sprite_atlas[realatlas]) {
            return this._sprite_atlas[realatlas].getSpriteFrame(name);
        }
    },
});