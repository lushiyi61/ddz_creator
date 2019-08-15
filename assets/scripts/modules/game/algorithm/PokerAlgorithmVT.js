/* PokerAlgorithm - version two 

为癞子而生
癞子可变为点数
[3-15]

ll -> laizi
nn -> normal
ln -> laizinumber
癞子可以和其他牌搭配成各种牌型，但癞子单独出时不能当做万能牌，只能作为其本身使用。
比如说三张癞子 */

let PokerAlgorithm = require("./PokerAlgorithm");

cc.Class({

    properties: {
        TAG: "PokerAlgorithmVT",
        laizi: null,
    },

    ctor() {
        this.pa = new PokerAlgorithm();
    },

    getPA() {
        return this.pa;
    },

    /* 拖选一堆牌时，给出的智能提示
    cards poker对象数组
    */
    getSmartCards(cards) {
        let self = this;
        let cardsSplit = self.seqCards(cards);
        let llcards = cardsSplit.lCards,
            nncards = cardsSplit.nCards;

        let retInfo = { tb: null, cardType: null };

        //不是癞子玩法
        if (isValidType(self.laizi) || self.laizi <= 2 || llcards.length === 0)
            return this.pa.getSmartCards(cards);

        logd("-----getSmartCards-----" + self.laizi, self.TAG);
        let cardType = qf.const.LordPokerType.UNKOWNTYPE;

        //4个以上的不提示

        //mark by Gallen

        if (this.pa.getCardType(c3) !== qf.const.LordPokerType.UNKOWNTYPE) return retInfo;
        let obj3 = self.getMaxContinuousWithLaizi(llcards, nncards, 3); //凑三个连续最大的
        let c3 = obj3.tb,
            l3 = obj3.len;

        let obj2 = self.getMaxContinuousWithLaizi(llcards, nncards, 2); //凑两个连续最大的
        let c2 = obj2.tb,
            l2 = obj2.len;

        let obj1 = self.getMaxContinuousWithLaizi(llcards, nncards, 1); //凑一个连续最大的
        let c1 = obj1.tb,
            l1 = obj1.len;

        let sObj3 = this.pa.getSmartCards(c3);
        let ret3 = sObj3.tb,
            ltype3 = sObj3.cardType;
        let retInfo3 = { tb: ret3, cardType: ltype3 };
        if (ltype3 === qf.const.LordPokerType.FEIJI ||
            ltype3 === qf.const.LordPokerType.FEIJI2 ||
            ltype3 === qf.const.LordPokerType.FEIJI1) {
            return retInfo3;
        }

        let sObj2 = this.pa.getSmartCards(c2);
        let ret2 = sObj2.tb,
            ltype2 = sObj2.cardType;
        let retInfo2 = { tb: ret2, cardType: ltype2 };
        if (ltype2 === qf.const.LordPokerType.SHUNZIDUIZI) return retInfo2;

        let sObj1 = this.pa.getSmartCards(c1);
        let ret1 = sObj1.tb,
            ltype1 = sObj1.cardType;
        let retInfo1 = { tb: ret1, cardType: ltype1 };
        if (ltype1 === qf.const.LordPokerType.SHUNZI) return retInfo1;

        /* let sObj3 =  this.pa.getSmartCards(c3);
        let ret3 = sObj3.tb, ltype3 = sObj3.cardType; 
        let retInfo3 = {tb: ret3, cardType: ltype3}; */
        if (ltype3 === qf.const.LordPokerType.SAN ||
            ltype3 === qf.const.LordPokerType.SANDAI1 ||
            ltype3 === qf.const.LordPokerType.SANDAIDUIZI) {
            return retInfo3;
        }
        /* let sObj2 =  this.pa.getSmartCards(c2);
        let ret2 = sObj2.tb, ltype2 = sObj2.cardType;
        let retInfo2 = {tb: ret2, cardType: ltype2}; */
        if (ltype2 === qf.const.LordPokerType.DUIZI) return retInfo2;

        return retInfo;
    },

    //根据短型数组
    serialization2(tt) {
        let self = this;
        let t = self.values(tt);
        let ret = "";
        for (let k in t) {
            let v = t[k];
            ret = ret + this.pa._serialization(v, k);
        }

        return ret;
    },

    //根据癞子，凑成最大连续的牌
    //返回完整的
    getMaxContinuousWithLaizi(llcards, nncards, height) {
        let self = this;
        let retInfo = { tb: null, len: null };
        let nc = self.values(this.pa.getShortIDByLong(nncards));
        let lc = self.values(this.pa.getShortIDByLong(llcards));

        //炸弹特别判断
        //dump(llcards)
        //dump(nncards)
        //dump(height)
        if (llcards.length === 3 && nncards.length === 1 && height === 4) {
            logd("---------软炸弹---------");
            let ret = [];
            self.contact(ret, nncards);
            self.contact(ret, llcards);
            for (let i = 1; i < 4; i++) {
                ret.push(nncards[0]);
            }
            retInfo.tb = ret;
            retInfo.len = 1;
            return retInfo;
        }

        let index = [3, 3];
        let tindex = [3, 3];
        let lln = llcards.length;
        let llc = [];

        let lastllcards = [];

        let swap = () => {
            if (tindex[1] - tindex[0] >= index[1] - index[0]) {
                index[1] = tindex[1]
                index[0] = tindex[0];
                lastllcards = self.copy(llc);
            }
        }

        let getMaxinOnce = (start) => {
            for (let i = start; i <= qf.pokerconfig.pokerA; i++) {
                let laizin = (height - (nc[i] || 0));
                laizin = laizin < 0 ? 0 : laizin;
                //print(i, laizin, lln);
                if (lln >= laizin) {
                    for (let j = 0; j < laizin; j++) {
                        llc.push(i);
                    }

                    lln = lln - laizin;
                    tindex[1] = i + 1;
                } else { //从这里断开了
                    swap();
                    return;
                }

            }
            swap();
        }

        for (let z = 3; z <= qf.pokerconfig.pokerA; z++) {
            tindex = [z, z];
            llc = [];
            lln = llcards.length;
            getMaxinOnce(z);
        }

        swap();

        //dump(index);
        //dump(lastllcards);

        let ret = [];

        self.contact(ret, nncards);
        self.contact(ret, llcards);
        if (index[1] - index[0] === 0) {
            logd("======没有连续的，看看有没有2======");
            let need2 = (height - (nc[qf.pokerconfig.poker2] || 0));
            need2 = need2 < 0 ? 0 : need2;
            if (llcards.length >= need2) {
                for (let i = 0; i < need2; i++) {
                    ret[ret.length - i] = qf.pokerconfig.shortIDToLong(qf.pokerconfig.poker2);
                }
            }
            retInfo.tb = ret;
            retInfo.len = 1;
            return retInfo;
        } else {
            for (let i in lastllcards) {
                let k = qf.func.checkint(i);
                let v = lastllcards[k];
                ret[ret.length - k] = qf.pokerconfig.shortIDToLong(v);
            }
            retInfo.tb = ret;
            retInfo.len = index[1] - index[0];
            return retInfo;
        }
    },


    //看看选中中牌堆中，是否包含提示列表

    /*promitTable是癞子改变后的牌
    markcards  是包含癞子的牌
    囧，先把变成癞子的牌promitTable，还原为原来的牌*/

    getSmartCardsInPromitTable(markCards, promitTable, pokers) {
        let self = this;
        if (!self.laizi || self.laizi <= 2)
            return this.pa.getSmartCardsInPromitTable(markCards, promitTable);
        let fullcards = [];
        for (let i in pokers) {
            let v = pokers[i];
            fullcards.push(self.convertCardsToValue(v.id));
        }

        for (let i in promitTable) {
            let v = promitTable[i];
            let r = this.pa.getSmartCardsInPromitTable(markCards, self.toRealCards(fullcards, v))
            if (r) return r;
        }

        return null;
    },

    //看看选中牌堆中，提示列表是否包含

    /*promitTable是癞子改变后的牌
    markcards  是包含癞子的牌
    囧，先把变成癞子的牌promitTable，还原为原来的牌*/

    getSmartCardsInPromitTable1(markCards, promitTable, pokers) {
        let self = this;
        if (!self.laizi || self.laizi <= 2)
            return this.pa.getSmartCardsInPromitTable1(markCards, promitTable);
        let fullcards = [];
        for (let i in pokers) {
            let v = pokers[i];
            fullcards.push(self.convertCardsToValue(v.id));
        }

        for (let i in promitTable) {
            let v = promitTable[i];
            let r = this.pa.getSmartCardsInPromitTable1(markCards, self.toRealCards(fullcards, v));
            if (r) return r;
        }

        return null;
    },

    toRealCards(fullcards, sv) {
        let self = this;
        //dump(sv);

        let fullPreTable = this.pa.genPreTable(fullcards);
        let fb = fullPreTable.buckets,
            fh = fullPreTable.maxBucketHeight,
            fl = fullPreTable.bucketLen;
        let t = self.unSerialization(sv);
        let nln = 0;
        let ret = "";
        for (let k in t) {
            let v = t[k];
            if (fb[k]) {
                if (fb[k] >= v) {
                    ret = ret + this.pa._serialization(v, k);
                    fb[k] = fb[k] - v;
                } else {
                    ret = ret + this.pa._serialization(fb[k], k);
                    nln = nln + v - fb[k];
                    fb[k] = 0;
                }
            } else
                nln = nln + v;
        }

        if (fb[self.laizi] && fb[self.laizi] >= nln) {
            ret = ret + this.pa._serialization(nln, self.laizi);
            return [ret];
        }

        return [];
    },


    /*检查 是否大于上家牌
    若上家牌为空，
    也就是随便出牌，需要特别处理*/
    checkCanSendCards(_nowcards, _precards, laizinumber) {
        let self = this;
        logd("======checkCanSendCards======");

        /*1.先检查牌是否能出，若能出则出牌
        2.再检查癞子
        3.果断生成promit一次,若有结果*/

        let cObj = self.seqCards(_nowcards); //分离癞子和普通牌
        let llcards = cObj.lCards,
            nncards = cObj.nCards;
        let retInfo = {
            cardType: qf.const.LordPokerType.UNKOWNTYPE,
            isCanSend: false,
            canSendCards: null,
        };

        let canSendObj = this.pa.checkCanSendCards(_nowcards, _precards);
        let rtype = canSendObj.cardType,
            tret = canSendObj.isCanSend;
        //4张牌往外抛
        if (tret && _precards.length !== 4 && _nowcards.length !== 4) {
            retInfo.cardType = rtype;
            retInfo.isCanSend = tret;
            return retInfo;
        }

        if (_precards.length === 0) {
            logd("======轮到自己出牌了======");

            let obj4 = self.getMaxContinuousWithLaizi(llcards, nncards, 4); //凑四个连续最大的
            let c4 = obj4.tb,
                l4 = obj4.len;
            if (this.pa.getCardTypeWithFullId(c4) !== qf.const.LordPokerType.UNKOWNTYPE) { //炸弹，4带2对，4带2个
                retInfo.cardType = qf.const.LordPokerType.UNKOWNTYPE;
                retInfo.isCanSend = true;
                retInfo.canSendCards = [self.serialization2(this.pa.getShortIDByLong(c4))];
                return retInfo;
            }

            let obj3 = self.getMaxContinuousWithLaizi(llcards, nncards, 3); //凑三个连续最大的
            let c3 = obj3.tb,
                l3 = obj3.len;
            if (this.pa.getCardTypeWithFullId(c3) !== qf.const.LordPokerType.UNKOWNTYPE) {
                retInfo.cardType = qf.const.LordPokerType.UNKOWNTYPE;
                retInfo.isCanSend = true;
                retInfo.canSendCards = [self.serialization2(this.pa.getShortIDByLong(c3))];
            }

            let obj2 = self.getMaxContinuousWithLaizi(llcards, nncards, 2); //凑两个连续最大的
            let c2 = obj2.tb,
                l2 = obj2.len;
            if (this.pa.getCardTypeWithFullId(c2) !== qf.const.LordPokerType.UNKOWNTYPE) {
                retInfo.cardType = qf.const.LordPokerType.UNKOWNTYPE;
                retInfo.isCanSend = true;
                retInfo.canSendCards = [self.serialization2(this.pa.getShortIDByLong(c2))];
            }

            let obj1 = self.getMaxContinuousWithLaizi(llcards, nncards, 1); //凑一个连续最大的
            let c1 = obj3.tb,
                l1 = obj1.len;
            if (this.pa.getCardTypeWithFullId(c1) !== qf.const.LordPokerType.UNKOWNTYPE) {
                retInfo.cardType = qf.const.LordPokerType.UNKOWNTYPE;
                retInfo.isCanSend = true;
                retInfo.canSendCards = [self.serialization2(this.pa.getShortIDByLong(c1))];
            }

            return retInfo;
        } else {
            logd("======要控别人的牌======");
            let cansend = self.promit(_nowcards, _precards, laizinumber);
            if (cansend.length !== 0) {
                let cObj = self.checkCanSendCards2(_nowcards, cansend);
                retInfo.cardType = cObj.cardType;
                retInfo.isCanSend = cObj.isCanSend;
                retInfo.canSendCards = cObj.canSendCards;
                return retInfo;
            } else
                return retInfo;
        }
    },

    //检查大于牌第二不，出的牌跟最终结果检查
    checkCanSendCards2(_nowcards, cansend) {
        let self = this;
        let retInfo = {
            cardType: qf.const.LordPokerType.UNKOWNTYPE,
            isCanSend: false,
            canSendCards: null,
        };

        let ret = [];
        for (let k1 in cansend) {
            let v1 = cansend[k1];
            let t = this.pa.unSerialization(v1)
            let n = 0;
            for (let k2 in t) {
                let v2 = t[k2];
                n = n + v2;
            }
            if (n === _nowcards.length)
                ret.push(v1);
        }
        if (ret.length === 0) {
            return retInfo;
        }

        retInfo.isCanSend = true;
        retInfo.canSendCards = ret;
        return retInfo;
    },

    //提示功能
    promit(selfCards, _lastCards, laizinumber) {
        let self = this;

        if (_lastCards.length === 0)
            return this.pa.promit(selfCards, _lastCards); //无提示

        laizinumber = laizinumber || 0;
        let ltype = this.pa.getCardTypeWithFullId(_lastCards); //获取牌型
        let cObj = self.seqCards(selfCards); //分离癞子和普通牌
        let llcards = cObj.lCards,
            nncards = cObj.nCards;
        let tret = null;

        if (qf.const.LordPokerType.ZHADAN === ltype) { //炸弹
            if (laizinumber > 0 && laizinumber < 4) { //软炸弹
                logd("=====软炸弹=====");
                tret = self.getAllRuanZhaDan(llcards, nncards, Math.floor(_lastCards[0] / 4) + 3); //添加软炸
                self.contact(tret, self.getAllNormallZhaDan(selfCards)); //添加普通炸弹
                self.contact(tret, self.getWangZha(selfCards)); //添加王炸
                return tret;
            } else if (laizinumber === 4 || (Math.floor(_lastCards[0] / 4) + 3) === self.laizi) { //硬炸弹
                return self.getWangZha(selfCards); //硬炸弹只有王炸能解决
            } else { //普通炸弹,只能由硬炸弹上
                logd("=====普通炸弹=====");
                tret = self.getAllYingZhadan(selfCards);
                self.contact(tret, self.getAllNormallZhaDan(selfCards, Math.floor(_lastCards[0] / 4) + 3));
                self.contact(tret, self.getWangZha(selfCards));
                return tret;
            }
        }

        if (qf.const.LordPokerType.DANZHANG === ltype) {
            tret = this.pa.promit(selfCards, _lastCards);
            self.contact(tret, self.getAllRuanZhaDan(llcards, nncards, 2));
            self.contact(tret, self.getAllNormallZhaDan(selfCards));
            self.contact(tret, self.getAllYingZhadan(selfCards));
            self.contact(tret, self.getWangZha(selfCards));
            tret = self.makeSet(tret);
            return tret;
        }

        if (qf.const.LordPokerType.DUIZI === ltype) { //对子,把其中一个癞子变成最大的牌
            logd("=====对子提示=====");
            tret = this.pa.promit(self.promitLaiziWithDuizi(llcards, nncards), _lastCards);
            self.contact(tret, self.getAllRuanZhaDan(llcards, nncards, 2));
            self.contact(tret, self.getAllNormallZhaDan(selfCards));
            self.contact(tret, self.getAllYingZhadan(selfCards));
            self.contact(tret, self.getWangZha(selfCards));
            tret = self.makeSet(tret);
            return tret;
        }

        //这种需要找连续的
        //按如下思路
        //假设对方是从456789
        /* 1.从5到A遍历，寻找是否有连续大于的,寻找过程中，使用癞子插空
        2.添加软炸弹和硬炸弹(王炸和普通炸弹前面已经判断过) */
        if (qf.const.LordPokerType.SHUNZI === ltype ||
            qf.const.LordPokerType.SHUNZIDUIZI === ltype ||
            qf.const.LordPokerType.FEIJI === ltype ||
            qf.const.LordPokerType.FEIJI1 === ltype ||
            qf.const.LordPokerType.FEIJI2 === ltype ||
            qf.const.LordPokerType.SAN === ltype ||
            qf.const.LordPokerType.SANDAI1 === ltype ||
            qf.const.LordPokerType.SANDAIDUIZI === ltype ||
            qf.const.LordPokerType.ZHADAN2 === ltype ||
            qf.const.LordPokerType.ZHADAN4 === ltype) {
            logd("======提示连续的情况======");
            tret = self.promitLaiziWithContinuous(llcards, nncards, _lastCards);
            self.contact(tret, self.getAllRuanZhaDan(llcards, nncards, 2)); //添加软炸弹
            self.contact(tret, self.getAllNormallZhaDan(selfCards));
            self.contact(tret, self.getAllYingZhadan(selfCards));
            self.contact(tret, self.getWangZha(selfCards));
            tret = self.makeSet(tret);
            return tret;
        }
        return [];
    },

    getAllNormallZhaDan(cards, start) {
        let self = this;
        start = start || 2;

        let tPreTable = this.pa.genPreTable(this.pa.getShortIDByLong(cards));
        let tb = tPreTable.buckets,
            th = tPreTable.maxBucketHeight,
            tl = tPreTable.bucketLen;
        let ret = [];
        for (let k in tb) {
            let v = tb[k];
            if (v === 4 && k !== self.laizi && k > start) {
                //ret.splice(ret.length - 1, 1, this.pa._serialization(4, k));
                ret.push(this.pa._serialization(4, k));
            }
        }
        return ret;
    },

    getWangZha(cards) {
        let self = this;
        let tPreTable = this.pa.genPreTable(this.pa.getShortIDByLong(cards));
        let tb = tPreTable.buckets,
            th = tPreTable.maxBucketHeight,
            tl = tPreTable.bucketLen;
        if (tb[qf.pokerconfig.pokerSJ] && tb[qf.pokerconfig.pokerBJ])
            return [this.pa._serialization(1, qf.pokerconfig.pokerSJ) + this.pa._serialization(1, qf.pokerconfig.pokerBJ)];

        return [];
    },

    getAllRuanZhaDan(llcards, nncards, start) {
        let self = this;
        let tPreTable = this.pa.genPreTable(this.pa.getShortIDByLong(llcards));
        let tb = tPreTable.buckets,
            th = tPreTable.maxBucketHeight,
            tl = tPreTable.bucketLen;
        let ret = [];
        for (let i = start + 1; i <= qf.pokerconfig.poker2; i++) {
            let vv = tb[i] || 0;
            if (llcards.length + vv >= 4)
                ret.push(this.pa._serialization(4, i));
        }
        return ret;
    },

    getAllYingZhadan(cards) {
        let self = this;
        let tPreTable = this.pa.genPreTable(this.pa.getShortIDByLong(cards));
        let tb = tPreTable.buckets,
            th = tPreTable.maxBucketHeight,
            tl = tPreTable.bucketLen;
        let ret = [];
        for (let k in tb) {
            let v = tb[k];
            if (v === 4 && k === self.laizi)
                ret.push(this.pa._serialization(4, k));
        }
        return ret;
    },

    promitLaiziWithDuizi(llcards, nncards) {
        let self = this;
        if (llcards.length === 0) return nncards; //如果没有癞子,直接返回

        nncards.sort(qf.utils.compareNumByIncrs);
        for (let i = nncards.length - 1; i <= 0; i--) {
            let v = nncards[i];
            if (!self.isJoker(self.convertCardsToValue(v))) {
                let tnncards = [];
                self.contact(tnncards, nncards);
                self.contact(tnncards, llcards);
                tnncards[tnncards.length - 1] = v; //改变一个癞子为最大的非王手牌

                return tnncards;
            }
        }

        return nncards;
    },

    promitLaiziWithContinuous(_llcards, _nncards, _lastCards) {
        let self = this;
        let llcards = self.convertCardsToValueArray(_llcards);
        let nncards = self.convertCardsToValueArray(_nncards);
        let lastCards = self.convertCardsToValueArray(_lastCards);
        nncards.sort(qf.utils.compareNumByIncrs);
        lastCards.sort(qf.utils.compareNumByIncrs);

        let nowPreTable = this.pa.genPreTable(nncards);
        let prePreTable = this.pa.genPreTable(lastCards);

        //buckets[k] = v, k为点数， v为张数
        let nb = nowPreTable.buckets,
            nh = nowPreTable.maxBucketHeight,
            nl = nowPreTable.bucketLen;
        let lb = prePreTable.buckets,
            lh = prePreTable.maxBucketHeight,
            ll = prePreTable.bucketLen;

        let fisrt = 0;
        let continuousLen = 0;
        for (let i in lb) {
            let v = lb[i];
            let k = qf.func.checkint(i);
            if (v === lh) {
                if (0 === fisrt)
                    fisrt = k; //找第一次
                else if (k <= fisrt)
                    fisrt = k;
                continuousLen = continuousLen + 1;
            }
        }

        continuousLen = continuousLen - 1; //lua 循环闭区间
        logd("======Continuous fisrt======" + (fisrt + 1));
        logd("======continuousLen======" + continuousLen);
        let endflag = continuousLen === 0 ? qf.pokerconfig.poker2 : qf.pokerconfig.pokerA; //如果连续为0，也就是三带1，一堆啥的，可以查找到2

        let ret = [];
        for (let i = fisrt + 1; i <= endflag; i++) {
            let needLaiziNumber = 0;
            if (i + continuousLen <= endflag) {
                for (let j = i; j <= i + continuousLen; j++) {
                    if (!nb[j]) needLaiziNumber = needLaiziNumber + lh;
                    else needLaiziNumber = needLaiziNumber + (lh - nb[j] < 0 ? 0 : lh - nb[j]);
                }
                logd("======needLaiziNumber======" + needLaiziNumber);
                if (needLaiziNumber <= llcards.length) {
                    let newcards = [];
                    self.contact(newcards, _nncards);
                    self.contact(newcards, _llcards);
                    let laiziindex = newcards.length - 1;

                    for (let j = i; j <= i + continuousLen; j++) {
                        let tv2 = nb[j] || 0;
                        let count = ((lh - tv2) < 0 ? 0 : lh - tv2);
                        for (let k = 1; k < count; k++) {
                            newcards[laiziindex] = (j - 3) * 4;
                            laiziindex = laiziindex - 1;
                        }
                    }

                    if (continuousLen === 0 && needLaiziNumber === lh && lh === 3) {

                    } else {
                        self.contact(ret, this.pa.promit(newcards, _lastCards));
                    }
                }
            }
        }
        ret = self.makeSet(ret);
        let result = [];
        if (ret && ret.length > 0) {
            result = self.checkWangZhaSet(ret);
        } else {
            result = ret;
        }
        return result;
    },

    //去掉王炸和其他牌型组合
    checkWangZhaSet(ret) {
        let self = this;
        let result = [];
        for (let k in ret) {
            let v = ret[k];
            let tt = self.unSerialization(v);
            let num = 0;
            for (let i in tt) {
                num = num + 1;
            }
            if (num > 2 && tt[qf.pokerconfig.pokerSJ] && tt[qf.pokerconfig.pokerBJ]) {
                //王炸和其他组合不能出牌
            } else {
                result.push(v);
            }

        }
        return result;
    },

    //去重
    makeSet(ttt) {
        let self = this;
        let hh = {};
        let ret = [];
        for (let k in ttt) {
            let v = ttt[k];
            if (!hh[v]) {
                ret.push(v);
                hh[v] = 1;
            }
        }
        return ret;
    },

    convertCardsToValueArray(cards) {
        let self = this;
        let r = [];
        for (let k in cards) {
            let v = cards[k];
            r.push(self.convertCardsToValue(v));
        }
        return r;
    },

    convertCardsToValue(v) {
        let self = this;
        return Math.floor(v / 4) + 3;
    },

    isJoker(v) {
        let self = this;
        return v === qf.pokerconfig.pokerSJ || v === qf.pokerconfig.pokerBJ;
    },

    getCardTypeWithFullId(cards) {
        let self = this;
        return this.pa.getCardTypeWithFullId(cards);
    },

    serialization(hash, start, endd, number) {
        let self = this;
        return this.pa.serialization(hash, start, endd, number)
    },

    unSerialization(str) {
        let self = this;
        return this.pa.unSerialization(str)
    },

    copy(ttt) {
        let self = this;
        let ret = [];
        for (let k in ttt) {
            let v = ttt[k];
            ret.push(v);
        }
        return ret;
    },

    //分离牌,到癞子和普通牌
    seqCards(cards) {
        let self = this;
        let retInfo = { nCards: [], lCards: [] };
        for (let k in cards) {
            let v = cards[k];
            if ((Math.floor(v / 4) + 3) === self.laizi) retInfo.lCards.push(v);
            else retInfo.nCards.push(v);
        }
        return retInfo;
    },

    //比对长数组和序列化的短串
    getLaiziHash(origincards, laizistr) {
        let self = this;
        let origin = self.values(this.pa.getShortIDByLong(origincards));
        let laizic = self.values(this.pa.getShortIDBySerialization(laizistr));
        return self._getLaiziHash(origin, laizic);
    },

    //比对两个数组，得出癞子牌
    _getLaiziHash(origin, laizic) {
        let self = this;
        let ret = [];
        for (let k in laizic) {
            let v = laizic[k];
            if (!origin[k]) {
                for (let i = 1; i <= v; i++) {
                    ret.push(k);
                }
            } else if (origin[k] < v) {
                for (let i = 1; i <= v - origin[k]; i++) {
                    ret.push(k);
                }
            }
        }
        return ret;
    },

    //对比两个长数组，得出癞子牌
    getLaiziHash2(longorigin, longlaizi) {
        let self = this;
        let origin = self.values(this.pa.getShortIDByLong(longorigin));
        let laizic = self.values(this.pa.getShortIDByLong(longlaizi));
        return self._getLaiziHash(origin, laizic);
    },

    //把序列化的癞子牌变成长id数组
    seriStrToLongCards(origincards, laizistr) {
        let self = this;
        let origin = self.values(this.pa.getShortIDByLong(origincards));
        let laizic = self.values(this.pa.getShortIDBySerialization(laizistr));
        let laizicards = self._getLaiziHash(origin, laizic);
        if (laizicards.length === 0) return [];

        //dump(laizicards)
        let laiziindex = 0;
        let ret = self.copy(origincards);

        for (let k in ret) {
            let v = ret[k];
            if (self.convertCardsToValue(v) === self.laizi && laizicards.length >= laiziindex) {
                let to = laizicards[laiziindex];
                laiziindex = laiziindex + 1;
                ret.push(qf.pokerconfig.shortIDToLong(to));
            }
        }
        //dump(origincards);
        //dump(ret);
        return ret;
    },

    values(t) {
        let self = this;
        let ret = {};
        for (let k in t) {
            let v = t[k];
            ret[v] = (ret[v] || 0) + 1;
        }
        return ret;
    },

    contact(a, b) {
        let self = this;
        if (b instanceof Array) {
            for (let k in b) {
                let v = b[k];
                a.push(v);
            }
        } else {
            a.push(b);
        }
        return a;
    },

});