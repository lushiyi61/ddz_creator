
/*
斗地主算法
*/

cc.Class({

    properties: {
        TAG: "PokerAlgorithm",
    },

    //根据牌的对象得到牌型
    getPokerType (pokers) {
        let self = this;
        let ids = [];
        for (let k in pokers) {
            let v = pokers[k];
            let id = Math.floor(v.poker.id / 4) + 3;
            ids.push(id);
        }

        return self.getCardType(ids);
    },

    getCardTypeWithFullId (cards) {
        let self = this;
        let ids = [];
        for (let k in cards) {
            let v = cards[k];
            let id = Math.floor(v / 4) + 3;
            ids.push(id);
        }
        return self.getCardType(ids);
    },

    getCardType (cards) {
        let self = this;
        cards.sort(qf.utils.compareNumByIncrs);
        if (self.checkWangZha(cards)) {
            return qf.const.LordPokerType.WANGZHA;
        }
        let preTable = self.genPreTable(cards);
        let buckets = preTable.buckets, maxBucketHeight = preTable.maxBucketHeight, bucketLen = preTable.bucketLen;
        if (bucketLen <= 0) {
            return qf.const.LordPokerType.UNKOWNTYPE;
        }
        
        return self["getCardType" + maxBucketHeight](buckets, bucketLen);
    },

    getCardType1 (buckets, bucketLen) {
        let self = this;
        if (bucketLen === 1) return qf.const.LordPokerType.DANZHANG;	//只有一张，单牌
        if (buckets[qf.pokerconfig.poker2]) return qf.const.LordPokerType.UNKOWNTYPE;  //非单牌，且有2，不是顺子
        if (bucketLen < 5) return qf.const.LordPokerType.UNKOWNTYPE;	//小于5张牌，非顺子
        if (self.checkIsContinuous(buckets)) return qf.const.LordPokerType.SHUNZI;
        return qf.const.LordPokerType.UNKOWNTYPE;
    },

    getCardType2 (buckets, bucketLen) {
        let self = this;
        if (bucketLen === 1) return qf.const.LordPokerType.DUIZI;  //单对
        if (buckets[qf.pokerconfig.poker2]) return qf.const.LordPokerType.UNKOWNTYPE;  //非单对，且有2，不是顺子

        for (let k in buckets) {	//若有单牌
            let v = buckets[k];
            if (qf.func.checkint(v) === 1) return qf.const.LordPokerType.UNKOWNTYPE;
        }

        if (bucketLen < 3) return qf.const.LordPokerType.UNKOWNTYPE;	//少于三对
        if (self.checkIsContinuous(buckets)) return qf.const.LordPokerType.SHUNZIDUIZI;	//对子顺
        return qf.const.LordPokerType.UNKOWNTYPE;
    },

    getCardType3 (buckets, bucketLen) {
        let self = this;

        //先找出几个3个的，几个2个的，几个1个的
        let t = [[], [], []];
        for (let k in buckets) {
            let v = buckets[k];
            t[qf.func.checkint(v) - 1].push(qf.func.checkint(k));
        }

        t[2].sort(qf.utils.compareNumByIncrs);

        if (!self._isContinuous(t[2])) return qf.const.LordPokerType.UNKOWNTYPE;	//检查连续,一个也是连续的
        if (self.havePoker2(t[2]) && t[2].length > 1) return qf.const.LordPokerType.UNKOWNTYPE;	//AAA222的情况
        let feiji = t[2].length > 1;
        if (t[1].length + t[0].length === 0) {
            return feiji ? qf.const.LordPokerType.FEIJI : qf.const.LordPokerType.SAN;
        }
        else if (t[1].length * 2 + t[0].length === t[2].length * 2) {	//只能带对子
            if (t[0].length === 0) return feiji ? qf.const.LordPokerType.FEIJI2 : qf.const.LordPokerType.SANDAIDUIZI;	//只有对子
        }
        else if (t[1].length * 2 + t[0].length === t[2].length) {  //只能带单牌
            if (self.checkWangZha(t[0])) return qf.const.LordPokerType.UNKOWNTYPE;
            return feiji ? qf.const.LordPokerType.FEIJI1 : qf.const.LordPokerType.SANDAI1;	//end
        }
        return qf.const.LordPokerType.UNKOWNTYPE;
    },

    getCardType4 (buckets, bucketLen) {
        let self = this;

        let t = [[], [], [], []];
        for (let k in buckets) {
            let v = buckets[k];
            t[qf.func.checkint(v) - 1].push(qf.func.checkint(k));
        }

        if (t[3].length > 1) return qf.const.LordPokerType.UNKOWNTYPE; //只能出现一个4个
        if (t[2].length > 0) return qf.const.LordPokerType.UNKOWNTYPE; //4个不能伴随3个出现的

        if (t[0].length === 0) {
            if (t[1].length === 2)
                return qf.const.LordPokerType.ZHADAN4;  //4带两队
            else if (t[1].length === 1)
                return qf.const.LordPokerType.ZHADAN2;  //4带两单牌
            else if (t[1].length === 0)     //炸弹
                return qf.const.LordPokerType.ZHADAN;
        }
        else if (t[0].length === 2) {
            if (t[1].length === 0 && !self.checkWangZha(t[0])) return qf.const.LordPokerType.ZHADAN2;	//4带两单牌
        }
        return qf.const.LordPokerType.UNKOWNTYPE;
    },

    havePoker2 (cards) {
        for (let k in cards) {
            let v = cards[k];
            if (v === qf.pokerconfig.poker2) return true;
        }

        return false;
    },

    //mark by Gallen
    checkIsContinuous (pokers) {
        let self = this;
        let keys = [];
        for (let k in pokers) {
            keys.push(qf.func.checkint(k));
        }
        keys.sort(qf.utils.compareNumByIncrs);
        return self._isContinuous(keys);
    },

    _isContinuous (cards) {
        let pre = null;
        for (let k in cards) {
            let v = cards[k];
            if (!qf.utils.isValidType(pre)) {
                pre = v;
            } else {
                if (v - 1 === pre)
                    pre = v;
                else
                    return false;
            }
        }
        return true;
    },

    genPreTable (cards) {
        let self = this;
        let buckets = {};
        let maxBucketHeight = 0;
        let bucketLen = 0;
        for (let k in cards) {
            let v = cards[k];
            if (!qf.utils.isValidType(buckets[v])) {
                buckets[v] = 1;
                bucketLen = bucketLen + 1;
            }
            else {
                buckets[v] = buckets[v] + 1;
            }

            if (buckets[v] > maxBucketHeight)
                maxBucketHeight = buckets[v];
            if (maxBucketHeight > 4) {
                //dump(cards);
                loge("-------maxBucketHeight error-------" + v, self.TAG);
                loge(" 竟然有 " + maxBucketHeight + "张一样的牌");
            }
        }

        return { buckets: buckets, maxBucketHeight: maxBucketHeight, bucketLen: bucketLen };
    },

    checkWangZha (pokers) {
        let self = this;
        if (pokers.length === 2) {
            if (pokers[0] === qf.pokerconfig.pokerSJ && pokers[1] === qf.pokerconfig.pokerBJ) return true;
        }
        return false;
    },

    //检查两对牌的大小
    checkCanSendCards (_nowcards, _precards, ln) {
        let self = this;
        let nowcards = [];
        let precards = [];
        _precards = _precards || [];
        for (let k in _nowcards) {
            let v = _nowcards[k];
            nowcards.push(Math.floor(v / 4) + 3);
        }

        for (let j in _precards) {
            let v = _precards[j];
            precards.push(Math.floor(v / 4) + 3);
        }

        nowcards.sort(qf.utils.compareNumByIncrs);
        precards.sort(qf.utils.compareNumByIncrs);

        let nowCardType = self.getCardType(nowcards);
        let retInfo = {
            cardType: qf.const.LordPokerType.UNKOWNTYPE,
            isCanSend: false,
        };

        retInfo.cardType = nowCardType;

        //轮到随便出
        if (precards.length === 0) {
            retInfo.isCanSend = (nowCardType !== qf.const.LordPokerType.UNKOWNTYPE);
            return retInfo;
        }
        if (nowCardType === qf.const.LordPokerType.UNKOWNTYPE) {
            return retInfo;
        }
        else if (nowCardType === qf.const.LordPokerType.WANGZHA) {
            retInfo.isCanSend = true
            return retInfo;
        }

        let preCardType = self.getCardType(precards);
        let nowPreTable = self.genPreTable(nowcards);
        let prePreTable = self.genPreTable(precards);

        let nb = nowPreTable.buckets, nh = nowPreTable.maxBucketHeight, bl = nowPreTable.bucketLen;
        let pb = prePreTable.buckets, ph = prePreTable.maxBucketHeight, pl = prePreTable.bucketLen;
        let nhash = [[], [], [], []];
        let phash = [[], [], [], []];

        for (let j in nb) {
            let v = nb[j];
            let k = qf.func.checkint(j);
            nhash[v - 1].push(k);
        }

        for (let j in pb) {
            let v = pb[j];
            let k = qf.func.checkint(j);
            phash[v - 1].push(k);
        }

        logd("-------nowCardType-------" + nowCardType, self.TAG);
        logd("-------preCardType-------" + preCardType, self.TAG);

        if (nowCardType === preCardType && nowcards.length === precards.length) {   //类型一样，牌的数量相同
            retInfo.isCanSend = self.compare(nhash, phash, nh);
            return retInfo;
        }
        else if (nowCardType === qf.const.LordPokerType.ZHADAN && preCardType !== qf.const.LordPokerType.ZHADAN) {	//我是炸弹,别人不是炸弹,果断可以出
            logd("我是炸弹 ， 别人不是炸弹 ，我要出牌");
            retInfo.isCanSend = true;
            return retInfo;
        }

        return retInfo;
    },

    compare(hash1, hash2, index) {
        index = index - 1
        hash1[index].sort(qf.utils.compareNumByIncrs);
        hash2[index].sort(qf.utils.compareNumByIncrs);
        
        if (hash1[index].length === hash2[index].length) {
            return hash1[index][0] > hash2[index][0];
        }
        return false;
    },

    serialization(hash, start, endd, number) {
        let sret = "";
        for (let i = start; i <= endd; i++) {
            sret = sret + this._serialization(number, hash[i]);
        }
        return sret;
    },

    unSerialization(str) {
        let ret = {};
        let cards = str.split(";");
        for (let k in cards) {
            let v = cards[k];
            if (v !== "") {
                let pair = v.split(",");
                ret[qf.func.checkint(pair[1])] = (ret[qf.func.checkint(pair[1])] || 0) + qf.func.checkint(pair[0]);
            }
        }
        return ret;
    },

    getCardTypeBySerialization (str) {
        let self = this;
        return self.getCardType(self.getShortIDBySerialization(str));
    },

    getShortIDBySerialization (str) {
        let self = this;
        let uns = self.unSerialization(str);
        let cc = [];
        for (let k in uns) {
            let v = uns[k];
            for (let i = 0; i < v; i++) {
                cc.push(qf.func.checkint(k));
            }
        }

        cc.sort(qf.utils.compareNumByIncrs);
        return cc;
    },

    getShortIDByLong (cards) {
        let ret = [];
        for (let k in cards) {
            let v = cards[k];
            ret.push(Math.floor(v / 4) + 3);
        }
        return ret;
    },

    inversionTable (t) {
        let ret = {};
        for (let k in t) {
            let v = t[k];
            ret[v] = k
        }

        return ret;
    },

    _serialization (number, value) {
        return number + "," + value + ";";
    },

    //hash1 4个桶
    getAllShuzi (hash1, hash2, height) {
        let self = this;  //从序列里面找大于X的顺子，包括单牌

        //先压缩合并,
        let newhash1 = [];
        let ret = [];
        let maxHeight = (height === 4 ? 4 : 3);
        let tmpSort = [];

        for (let i = height; i <= maxHeight; i++) {
            let j = i - 1;
            for (let k in hash1[j]) {
                let v = hash1[j][k];
                tmpSort.push({ index: v, value: i });
            }
        }

        let heightIndex = height - 1;
        hash2[heightIndex].sort(qf.utils.compareNumByIncrs);

        if (hash2[heightIndex].length === 1) {
            tmpSort.sort( (a, b)=>{	//小牌和数量小的牌，排在前面
                if (a.value < b.value)
                    return -1;
                else if (a.value === b.value) {
                    if (a.index < b.index)
                        return -1;
                    return 0

                }
                else
                    return 1;
            });
        }

        for (let k in tmpSort) {
            let v = tmpSort[k];
            newhash1.push(v.index);
        }
        if (hash2[heightIndex].length !== 1)
            newhash1.sort(qf.utils.compareNumByIncrs);

        for (let j in newhash1) {
            let v = newhash1[j];
            let k = qf.func.checkint(j);
            if (v > hash2[heightIndex][0]) {  //碰到相等的
                let isok = true;
                for (let i = 1; i < hash2[heightIndex].length; i++) {
                    //长度不够，返回
                    if (k + i >= newhash1.length) {
                        isok = false;
                        break;
                    }

                    //连续的牌中2和王，不算
                    if (newhash1[k + i] === qf.pokerconfig.poker2 || 
                        newhash1[k + i] === qf.pokerconfig.pokerSJ ||
                        newhash1[k + i] === qf.pokerconfig.pokerBJ)
                    {
                        isok = false;
                        break;
                    }

                    //不连续，也不算
                    if (newhash1[k + i] - 1 !== newhash1[k + i - 1]) {
                        isok = false;
                        break;
                    }
                }

                if (isok)
                    ret.push(self.serialization(newhash1, k, k + hash2[heightIndex].length - 1, height));
            }
        }
        //dump(ret);

        return ret;
    },

    appendZHADAN (hash, ret) {
        let self = this;
        if (hash[3].length !== 0) {
            for (let k in hash[3]) {
                let v = hash[3][k];
                ret.push(self._serialization(4, v));
            }
        }
    },

    //不拆炸弹 ， 获取最小的对子或者单牌
    //桶，要取单牌还是对子，取的数量，主体的结果
    getLeftCards (buckets, height, number, tmpRet) {
        let self = this;

        let ret = [];
        for (let k in tmpRet) {
            let v = tmpRet[k];
            let tmpCards = {};
            //拷贝一份数据
            for (let j in buckets) {
                let v1 = buckets[j];
                tmpCards[j] = qf.func.checkint(v1);
            }

            let usedCards = self.unSerialization(v);
            let leftMinStr = self.getMinCards(usedCards, tmpCards, height, number);
            if (qf.utils.isValidType(leftMinStr))
                ret.push(v + leftMinStr);
        }
        return ret;
    },

    getMinCards (usedCards, tmpCards, height, number) {
        let self = this;

        for (let k in usedCards) {
            tmpCards[k] = null;
        }

        for (let k in tmpCards) {  //过滤掉炸弹和比需求小的牌，比如说带一对，那么首先过滤掉单牌
            let v = tmpCards[k];
            if (qf.utils.isValidType(v)) {
                if (v > (height === 4 ? 4 : 3) || v < height)
                    tmpCards[k] = null;
            }
        }

        let rightData = [];
        for (let i in tmpCards) {
            let v = tmpCards[i];
            if (qf.utils.isValidType(v)) {
                let k = qf.func.checkint(i);
                rightData.push({ index: k, value: v });
            }
        }

        rightData.sort( (a, b)=>{	//小牌和数量小的牌，排在前面
            if (a.value < b.value) {
                return -1
            }
            else if (a.value === b.value) {
                if (a.index < b.index)
                    return -1;
                return 0;
            }
            else
                return 1;
        }
        );

        let lastret = [];
        if (height === 1) {  //拆分，为啥要这么拆呢
            //比如说4带2，手上剩下炸弹带1对，下面代码会报错
            for (let k in rightData) {
                let v = rightData[k];
                for (let i = 0; i < v.value; i++) {
                    lastret.push({ index: v.index, value: v.value });
                }
            }
        }
        else
            lastret = rightData;

        rightData = null;
        //dump(lastret);

        logd("getMinCards left = " + lastret.length, self.TAG);
        logd("needCards len  = " + number);
        if (lastret.length < number) return null;	//候选牌不够

        let retStr = "";
        for (let i = 0; i < number; i++) {
            retStr = retStr + self._serialization(height, lastret[i].index);
        }
        return retStr;
    },


    genPromitEmpty (selfCards) {
        let self = this; //自由提示
        let ret = [];
        selfCards.sort(qf.utils.compareNumByIncrs); //提示前面
        if (self.getCardType(selfCards) === qf.const.LordPokerType.WANGZHA) {
            let serialData = self._serialization(1, qf.pokerconfig.pokerSJ) + self._serialization(1, qf.pokerconfig.pokerBJ);
            ret.push(serialData);
            return ret;
        }

        let number = 1;
        let value = selfCards[0];
        for (let i = 1; i < selfCards.length; i++) {
            if (selfCards[i] === value)
                number = number + 1;
        }
        ret.push(self._serialization(number, value));
        return ret;
    },

    //提示
    promit (_selfCards, _lastCards) {
        let self = this;
        logd(" -------生成提示列表开始-------" + Date.parse(new Date()));
        _selfCards.sort(qf.utils.compareNumByIncrs);
        let ret = [];
        let rethash = []; //去掉重复的

        let selfCards = [];
        let lastCards = [];
        for (let k in _selfCards) {
            let v = _selfCards[k];
            if (qf.utils.isValidType(v))
                selfCards.push(Math.floor(v / 4) + 3);
        }

        for (let k in _lastCards) {
            let v = _lastCards[k];
            if (qf.utils.isValidType(v))
                lastCards.push(Math.floor(v / 4) + 3);
        }

        //自由提示
        if (_lastCards.length === 0)
            return self.genPromitEmpty(selfCards);

        let cardType = self.getCardType(lastCards);

        if (cardType === qf.const.LordPokerType.WANGZHA)
            return []; //王炸不用提示了 

        let nowPreTable = self.genPreTable(selfCards);
        let prePreTable = self.genPreTable(lastCards);

        let nb = nowPreTable.buckets, nh = nowPreTable.maxBucketHeight, bl = nowPreTable.bucketLen;
        let pb = prePreTable.buckets, ph = prePreTable.maxBucketHeight, pl = prePreTable.bucketLen;
        let nhash = [[], [], [], []];
        let phash = [[], [], [], []];

        for (let k in nb) {
            let v = nb[k];	//k 点数 v 张数
            nhash[qf.func.checkint(v) - 1].push(qf.func.checkint(k));
        }

        for (let j in pb) {
            let v = pb[j];
            phash[qf.func.checkint(v) - 1].push(qf.func.checkint(j));
        }

        if (ph === 1 || ph === 2) {  //单牌，顺子，单顺，对顺 , 最后加上炸弹
            ret = self.getAllShuzi(nhash, phash, ph);
            self.appendZHADAN(nhash, ret);
        } else if (ph === 3) {
            if (cardType === qf.const.LordPokerType.SAN || cardType === qf.const.LordPokerType.FEIJI)   //纯三张
                ret = self.getAllShuzi(nhash, phash, ph);
            else {
                let tmpRet = self.getAllShuzi(nhash, phash, ph);
                let hh = 0;
                if (cardType === qf.const.LordPokerType.FEIJI2 || cardType === qf.const.LordPokerType.SANDAIDUIZI)
                    hh = 2;
                else if (cardType === qf.const.LordPokerType.FEIJI1 || cardType === qf.const.LordPokerType.SANDAI1)
                    hh = 1;

                logd(" -----三张补牌-----", self.TAG);
                ret = self.getLeftCards(nb, hh, phash[2].length, tmpRet);  //获取结果
            }

            self.appendZHADAN(nhash, ret);
        }
        else if (ph === 4) {
            if (qf.const.LordPokerType.ZHADAN === cardType)	//炸弹
                ret = self.getAllShuzi(nhash, phash, ph)
            else {
                let tmpRet = self.getAllShuzi(nhash, phash, ph);
                let hh = 0;
                if (cardType === qf.const.LordPokerType.ZHADAN4)
                    hh = 2;
                else if (cardType === qf.const.LordPokerType.ZHADAN2)
                    hh = 1;

                logd("-----四张补牌-----" + hh, self.TAG);
                //两张单牌或者两对，所以结果都是2
                ret = self.getLeftCards(nb, hh, 2, tmpRet);  //获取结果

                self.appendZHADAN(nhash, ret);
            }
        }
        else
            loge("-----error on gen promit-----", self.TAG);


        //最后加上王炸
        if (nb[qf.pokerconfig.pokerSJ] && nb[qf.pokerconfig.pokerBJ])
            ret.push(self._serialization(1, qf.pokerconfig.pokerSJ) + self._serialization(1, qf.pokerconfig.pokerBJ))

        //dump(ret);
        logd("-----生成提示列表完成-----" + Date.parse(new Date()));
        return ret;
    },

    getMaxContinuous (hash, height) {
        let self = this;

        let seq = [];
        for (let i = height; i <= 3; i++) {		//压缩桶
            let j = i - 1;
            for (let k in hash[j]) {
                let v = hash[j][k];
                seq.push(v);
            }
        }

        if (seq.length === 0) {
            return { tb: [], len: 0 };
        }
        seq.sort(qf.utils.compareNumByIncrs);
        let r1 = [0, 0];
        let r2 = [0, 0];
        for (let i = 1; i < seq.length; i++) {
            if (seq[i] - 1 === seq[i - 1] && seq[i] !== qf.pokerconfig.poker2) {	//认为连续
                r2[1] = i;
            }
            else {
                if (r2[1] - r2[0] > r1[1] - r1[0]) {	//比原来的大
                    r1[0] = r2[0];
                    r1[1] = r2[1];
                }
                r2[0] = i;
                r2[1] = i;
            }
        }

        if (r2[1] - r2[0] > r1[1] - r1[0]) {	//比原来的大
            r1[0] = r2[0];
            r1[1] = r2[1];
        }

        let ret = [];
        let retstr = "";
        for (let i = r1[0]; i <= r1[1]; i++) {
            retstr = retstr + self._serialization(height, seq[i]);	//序列化
        }

        ret.push(retstr);
        return { tb: ret, len: (r1[1] - r1[0] + 1) };
    },

    //拖选一堆牌时的智能提示
    getSmartCards (cards) {
        let self = this;
        let scards = [];
        if (!cards) return { tb: null, cardType: null };
        for (let k in cards) {
            let v = cards[k];
            scards.push(Math.floor(v / 4) + 3);
        }

        retInfo = { tb: null, cardType: null };
        let cardType = self.getCardType(scards);
        //本身是牌型
        if (cardType !== qf.const.LordPokerType.UNKOWNTYPE)
            return retInfo;

        let prePreTable = self.genPreTable(scards);
        let pb = prePreTable.buckets, ph = prePreTable.maxBucketHeight, pl = prePreTable.bucketLen;
        let phash = [[], [], [], []];

        for (let k in pb) {
            let v = pb[k];
            phash[v - 1].push(qf.func.checkint(k));
        }

        let obj3 = self.getMaxContinuous(phash, 3);
        let tmpRet3 = obj3.tb, length3 = obj3.len;
        let tmpRet32 = self.getLeftCards(pb, 2, length3, tmpRet3);
        let tmpRet31 = self.getLeftCards(pb, 1, length3, tmpRet3);
        if (length3 > 1) {	//有飞机
            if (tmpRet32.length !== 0) {
                retInfo.tb = tmpRet32;
                retInfo.cardType = qf.const.LordPokerType.FEIJI2; //飞机带对子
                return retInfo;
            }
            if (tmpRet31.length !== 0) {
                retInfo.tb = tmpRet31;
                retInfo.cardType = qf.const.LordPokerType.FEIJI1; //飞机带单牌
                return retInfo;
            }
            retInfo.tb = tmpRet3;
            retInfo.cardType = qf.const.LordPokerType.FEIJI;
            return retInfo;
        }

        let obj2 = self.getMaxContinuous(phash, 2);  //连对
        let tmpRet2 = obj2.tb, length2 = obj2.len;
        if (length2 >= 3) {
            retInfo.tb = tmpRet2;
            retInfo.cardType = qf.const.LordPokerType.SHUNZIDUIZI;
            return retInfo;
        }

        let obj1 = self.getMaxContinuous(phash, 1);  //顺子
        let tmpRet1 = obj1.tb, length1 = obj1.len;

        if (length1 >= 5) {
            retInfo.tb = tmpRet1;
            retInfo.cardType = qf.const.LordPokerType.SHUNZI;
            return retInfo;
        }

        if (length3 === 1) { //三带对子，三带1，单三张
            if (tmpRet32.length !== 0) {
                retInfo.tb = tmpRet32;
                retInfo.cardType = qf.const.LordPokerType.SANDAIDUIZI; //三带对子
                return retInfo;
            }
            if (tmpRet31.length !== 0) {
                retInfo.tb = tmpRet31;
                retInfo.cardType = qf.const.LordPokerType.SANDAI1; //三带单张
                return retInfo;
            }
            retInfo.tb = tmpRet3;
            retInfo.cardType = qf.const.LordPokerType.SAN; //单三个
            return retInfo;
        }

        phash[1].sort(qf.utils.compareNumByIncrs);
        if (phash[1].length !== 0) {
            retInfo.tb = [self._serialization(2, phash[1][phash[1].length - 1])];
            retInfo.cardType = qf.const.LordPokerType.DUIZI; //对子
            return retInfo;
        }
        phash[0].sort(qf.utils.compareNumByIncrs);
        if (phash[0].length !== 0) {
            retInfo.tb = [self._serialization(1, phash[0][phash[0].length - 1])];
            retInfo.cardType = qf.const.LordPokerType.DANZHANG; //单张
            return retInfo;
        }

        return retInfo;
    },

    //检查 ， 选中的牌中，有没有大于上家的牌（智能选牌是选中牌的子集）
    getSmartCardsInPromitTable (_markCards, promitTable) {
        let self = this;
        let markCards = [];
        for (let k in _markCards) {
            let v = _markCards[k];
            markCards.push(Math.floor(v / 4) + 3);
        }
        //只选两张，王炸
        if (self.getCardType(markCards) === qf.const.LordPokerType.WANGZHA)
            return self._serialization(1, qf.pokerconfig.pokerSJ) + self._serialization(1, qf.pokerconfig.pokerBJ);

        let preTable = self.genPreTable(markCards);
        let pb = preTable.buckets, ph = preTable.maxBucketHeight, pl = preTable.bucketLen;
        for (k in promitTable) {
            let v = promitTable[k];
            let t = self.unSerialization(v);
            //dump(pb)
            for (let k1 in pb) {
                let v1 = pb[k1];
                if (t[k1])
                    t[k1] = t[k1] - v1;
            }

            let iscan = true;
            //dump(t);
            for (let k1 in t) {
                let v1 = t[k1];
                if (v1 > 0) iscan = false;
            }
            if (iscan) return v;
        }
    },

    //检查 ， 选中的牌中，有没有大于上家的牌（选中牌是智能选牌的子集,并且三带x或四带x中的x不要）
    getSmartCardsInPromitTable1 (_markCards, promitTable) {
        let self = this;
        let markCards = [];
        for (let k in _markCards) {
            let v = _markCards[k];
            markCards.push(Math.floor(v / 4) + 3);
        }
        //只选两张，王炸
        if (self.getCardType(markCards) === qf.const.LordPokerType.WANGZHA)
            return self._serialization(1, qf.pokerconfig.pokerSJ) + self._serialization(1, qf.pokerconfig.pokerBJ);

        let preTable = self.genPreTable(markCards);
        let pb = preTable.buckets, ph = preTable.maxBucketHeight, pl = preTable.bucketLen;
        for (k in promitTable) {
            let v = promitTable[k];
            let t = self.unSerialization(v);
            //dump(pb)
            let mnum = -1;
            let mcard = -1;
            for (let j in t) {
                if (t[j] > mnum) {
                    mnum = t[j];
                    mcard = j;
                }
            }
            let isHas = false;
            for (let k1 in pb) {
                let v1 = pb[k1];
                if (t[k1]) {
                    isHas = true;
                    t[k1] = t[k1] - v1;
                }
                else {
                    isHas = false;
                    break;
                }
            }

            let iscan = true;
            //dump(t);
            for (let k1 in t) {
                let v1 = t[k1];
                if (v1 < 0) iscan = false;
                if (mnum >= 3 && t[mcard] >= mnum) iscan = false;
            }
            if (iscan && isHas) {
                //去掉三带x或四带x中的x
                // logd("------------------str0");
                // logd(v);
                let d = self.deleteSingleAndPair(v);
                // logd("------------------str1");
                // logd(d);
                return d;
            }
        }
    },
    //去掉三带x或四带x中的x
    deleteSingleAndPair (str) {
        let self = this;
        let ret = self.unSerialization(str);
        if (ret) {
            let num = 0;
            for (k in ret) {
                let v = ret[k];
                if (v > num) {
                    num = v;
                }
            }
            if (num >= 3) {
                let newStr = "";
                for (k in ret) {
                    let v = ret[k];
                    if (v >= num) {
                        newStr = newStr + self._serialization(v, k);
                    }
                }
                if (newStr && newStr !== "") {
                    return newStr;
                }
            }
        }
        return str;
    },
});
