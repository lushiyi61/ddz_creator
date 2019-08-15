let PokerConfig = {};

//一些常量配置

PokerConfig.pokerWidth = 145; //扑克宽度
PokerConfig.pokerHeight = 200; //扑克高度

PokerConfig.pokerDistance = 60; //扑克之间的间隔
PokerConfig.outPokerDistance = 60; //打出的牌的距离(scale == 1)
PokerConfig.outMyPokerDistance = 60; //打出的牌的距离(scale == 1)

PokerConfig.totalPokerNumber = 20; //每个人最多18张牌
PokerConfig.normalPokerNumber = 17;
PokerConfig.pokerInversionTime = 0.05; //扑克取反的时间
PokerConfig.pokerInversionDistance = 30; //扑克取反的距离

PokerConfig.insertPokerDelayTime = 0.5;
PokerConfig.insertPokerMoveTime = 0.5;
PokerConfig.insertPokerUpDistance = 30;

PokerConfig.setCardAnimationTime = 1.5;
PokerConfig.setCarddt1 = 0.06; //移动时间
PokerConfig.setCarddt2 = 0.04; //移动延迟时间

PokerConfig.otherZ = 100;

PokerConfig.pokerA = 14;
PokerConfig.poker2 = 15;
PokerConfig.pokerSJ = 16;
PokerConfig.pokerBJ = 17;

//一排最大数量
PokerConfig.maxRowPokerNum = 10;

//打出的一排最大数量
PokerConfig.maxOutRowPokerNum = 10;

//打出牌两张间距
PokerConfig.pokerSpace = [
    { width: 60, height: 120 }, //自己出牌
    { width: 60, height: 120 } //别人出牌
];

PokerConfig.pokerShowWidth = 42; //扑克宽度
PokerConfig.pokerShowHeight = 58; //扑克高度

//其他人明牌两张间距
PokerConfig.pokerShowSpace = { width: 28, height: 46 };

PokerConfig.pokerScale = {
    MAX: 1,
    MID: 0.65,
    MIN: 0.65,
};

//牌型自动调整
PokerConfig.cardTypeAutoAdjust = (type) => {
    if (type === qf.const.LordPokerType.DUIZI) {
        PokerConfig.maxRowPokerNum = 11;
        PokerConfig.pokerDistance = 55;
    } else if (type === qf.const.LordPokerType.SAN) {
        PokerConfig.maxRowPokerNum = 12;
        PokerConfig.pokerDistance = 50;
    } else if (type === qf.const.LordPokerType.ZHADAN) {
        PokerConfig.maxRowPokerNum = 13;
        PokerConfig.pokerDistance = 45;
    } else {
        PokerConfig.maxRowPokerNum = 10;
        PokerConfig.pokerDistance = 60;
    }
};

PokerConfig.shortIDToLong = (v) => {
    return (v - 3) * 4;
};

export default PokerConfig;