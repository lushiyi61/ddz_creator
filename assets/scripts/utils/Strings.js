cc.Class({

    //获取一个字符串的子字符串
    getSubString(str, start_index, end_index) {
        end_index = end_index ? end_index : str.length;
        //将utf8字符映射到表
        let tab = str.match(/./g);
        //获取子串
        let sub = "";
        for (let i = 0; i < tab.length; i++) {
            if (i >= start_index && i <= end_index)
                sub = sub + tab[i];
        }

        return sub;
    },

    stringToByte(str) {
        let bytes = new Array();
        let len, c;
        len = str.length;
        for(let i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if(c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if(c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if(c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    },

    //按个数截取中英混合字符
    getMySubStr(str, from, to) {
        let arrByte = this.stringToByte(str);
        let lenInByte = arrByte.length;

        let cur_index = 0;
        let f_index = 0;
        let t_index = 0;
        let i = 0;
        let byteCount = 0;

        for (let j = 0; j < lenInByte; j++) {
            if (i <= lenInByte) {

                let curByte = arrByte[i];
                if (curByte > 0 && curByte <= 127) {
                    byteCount = 1;
                }else if (curByte >= 192 && curByte < 223) {
                    byteCount = 2;
                }else if (curByte >= 224 && curByte < 239) {
                    byteCount = 3;
                }else if (curByte >= 240 && curByte <= 247) {
                    byteCount = 4;
                }

                cur_index = cur_index + 1;

                if (cur_index === from) {
                    f_index = i;
                }

                i = i + byteCount;
                if ( cur_index === to) {
                    t_index = i;
                }
            }else {
                break;
            }
        }

        if (f_index > 0 && t_index > 0) {
            let new_str= str.substr(f_index, t_index);

            if (new_str){
                return new_str;
            }
        }
        return str;
    },

    filterEmoji(str) {
        let regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;

        let ret_str = str.replace(regStr, "");
        return ret_str;
    },

    //截取过长字符串 用...替代
    cutString(str, len) {
        if(!str) str = "";

        len = len || 9;

        if(str.length * 2 <= len) {
            return str;
        }

        let strlen = 0;
        let s = "";

        for(let i = 0;i < str.length; i++) {
            s = s + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if(strlen >= len){
                    return s.substring(0,s.length-1) + "...";
                }
            } else {
                strlen = strlen + 1;
                if(strlen >= len){
                    return s.substring(0,s.length-2) + "...";
                }
            }
        }
        return s;
    },

    //切割字符串 加入换行符
    cutStringAddLine(str, len) {
        len = len || 7;

        let length = str.length;
        if (str.length <= len) return str;

        return str.slice(0, len) + "\n"+ this.cutStringAddLine(str.slice(len, length), len)
    }
});