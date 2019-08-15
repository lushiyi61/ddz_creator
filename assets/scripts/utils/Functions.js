
cc.Class({

    //在区间[l, r)随机一个整数
    //@param l 区间的左闭界限
    //@param r 区间的右开界限
    //@param d 指定要获取区间的值
    randint(l, r, d) {
        if (l >= r) {
            cc.error("[func:randint] value is invalid");
            return;
        }
        d = d === undefined ? Math.random() : d;
        return l + Math.floor((r - l - 1) * d);
    },

    //把字符串形式的数字转化为整数形式
    //转换失败返回0
    checkint(value) {
        let ret = Number(value);
        if (isNaN(ret)) {
            ret = 0;
        }
        return Math.floor(ret);
    },

    isTable(value) {
        return value instanceof Object || value instanceof Array;
    },

    clone(src) {
        let weak_map = new WeakMap();
        let _clone = (_src) => {
            if (!_src || typeof (_src) !== "object") {
                return _src;
            }
            else if (weak_map.get(_src)) {
                return weak_map.get(_src);
            }
            else {
                let _dst = new _src.constructor();
                weak_map.set(_src, _dst);
                for (let attr in _src) {
                    if (_src.hasOwnProperty(attr)) {
                        _dst[_clone(attr)] = _clone(_src[attr]);
                    }
                }
                return _dst;
            }
        };
        return _clone(src);
    },

    copy(src, dst, pattern) {
        if (!pattern || !(pattern instanceof Array) || pattern.length <= 0) {
            return;
        }

        for (let i = 0; i < pattern.length; i++) {
            dst[pattern[i]] = this.clone(src[pattern[i]]);
        }
    },

    //时间差值转化为指定的字符串
    //y年 M月 w周 d日 h小时 m分钟 s秒
    //@param time 以秒为单位的时间
    //@param pattern 模式串
    //@example pattern yyyy-MM-dd hh:mm:ss -> 1485-01-03 09:05:04
    //@example pattern yy-M-d h:m:s -> 19-1-3 9:5:5
    formattime(time, pattern) {
        // let date = new Date(time);
        // let y = date.getUTCFullYear() - 1970;
        // let M = date.getUTCMonth();
        // let d = date.getUTCDate();
        // let h = date.getUTCHours();
        // let m = date.getUTCMinutes();
        // let s = date.getUTCSeconds();

        // let fmt = ["y+", "M+", "d+", "h+", "m+", "s+"];
        // for (let i = 0; i < fmt.length; i++) {
        //     let reg = new RegExp(fmt[i]);
        //     if (reg.test(pattern)) {
        //         let s = reg.exec(pattern)[0];
        //     }
        // }
        // if (/y+/.test(pattern)) {
        //     s_y = /y+/.exec(pattern)[0];
        // }
        // if ()
    }

});
