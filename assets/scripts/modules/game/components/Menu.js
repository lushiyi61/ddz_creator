/**
 * 牌桌左上角菜单组件
 */
cc.Class({
    extends: cc.Component,

    properties: {
        MENUBG_MENUITEM_HEIGHT: 71, //菜单项高度

        MENUBG_TOP_OTHER_HEIGHT: 22,//菜单背景素材上部箭头的高度

        MENUBG_OTHER_HEIGHT: 18,    //菜单背景阴影多出的高度

        MENU_WIDTH: 254,            //菜单宽度
    },

    onLoad() {
        this._menuData = [];

        // this.idArr = [
        //     qf.const.MenuItemId.EXIT,
        //     // qf.const.MenuItemId.AUTOPLAY,
        //     // qf.const.MenuItemId.STANDUP,
        //     qf.const.MenuItemId.SET
        // ];

        qf.utils.addTouchEvent(this.node, e => {
            this.setMenuVisible(false);
        })
    },

    //显示菜单
    showMenu() {
        this.menu_height = this._menuData.length * this.MENUBG_MENUITEM_HEIGHT - this.MENUBG_OTHER_HEIGHT - this.MENUBG_OTHER_HEIGHT;
        this.node.setContentSize(this.MENU_WIDTH, this.menu_height);

        //添加菜单项
        this._menuData.forEach((v, i) => {
            this.addMenuItem(i, v);
        });
    },

    //设置菜单是否可见
    setMenuVisible(isVisible) {
        this.node.active = isVisible;

        // this._listener.setSwallowTouches(isVisible);
    },

    //更新菜单item项 注意idArr中设置始终放最后一个,美术素材图里设置底部特意少一条横线
    updateMenuItem(idArr) {
        if (idArr)
            this.idArr = idArr;

        if(!this.idArr){
            this.idArr = [
                qf.const.MenuItemId.EXIT,
                // qf.const.MenuItemId.AUTOPLAY,
                // qf.const.MenuItemId.STANDUP,
                qf.const.MenuItemId.SET
            ];
        }

        this._menuData = [];
        this.node.removeAllChildren(true);

        for (let i = 1; i <= this.idArr.length; i++) {
            this._menuData[i] = { id: this.idArr[i - 1] };
        }

        this.showMenu();
    },

    //增加菜单项
    addMenuItem(index, itemData) {
        let res = "";
        let pressedRes = "";
        if (itemData.id === qf.const.MenuItemId.EXIT) {
            res = qf.tex.tableMenuExit;
            pressedRes = qf.tex.tableMenuExitPressed;
        } else if (itemData.id === qf.const.MenuItemId.AUTOPLAY) {
            res = qf.tex.tableMenuAuto;
            pressedRes = qf.tex.tableMenuAutoPressed;
        } else if (itemData.id === qf.const.MenuItemId.STANDUP) {
            res = qf.tex.tableMenuStand;
            pressedRes = qf.tex.tableMenuStandPressed;
        } else if (itemData.id === qf.const.MenuItemId.SET) {
            res = qf.tex.tableMenuSet;
            pressedRes = qf.tex.tableMenuSetPressed;
        }

        let menu_item = new cc.Node();
        let item_sp = menu_item.addComponent(cc.Sprite);
        let item_btn = menu_item.addComponent(cc.Button);

        item_btn.interactable = true;
        item_btn.transition = cc.Button.Transition.SPRITE;
        item_btn.normalSprite = qf.rm.getSpriteFrame(qf.res.table, res);
        item_btn.pressedSprite = qf.rm.getSpriteFrame(qf.res.table, pressedRes);
        menu_item.setPosition(cc.v2(this.MENU_WIDTH*0.5, this.MENUBG_MENUITEM_HEIGHT*0.5 - this.MENUBG_MENUITEM_HEIGHT * parseInt(index) - this.MENUBG_TOP_OTHER_HEIGHT));
        menu_item.id = itemData.id;
        this.node.addChild(menu_item, 2);

        qf.utils.addTouchEvent(menu_item, e => {
            this.itemClick(e);
        })
    },

    itemClick(e) {
        let menu_id = e.target.id;
        if (menu_id === qf.const.MenuItemId.EXIT) {                  //退出
            this.node.emit(qf.ekey.DDZ_MENU_EXIT);
        } else if (menu_id === qf.const.MenuItemId.AUTOPLAY) {      //托管
            this.node.emit(qf.ekey.DDZ_MENU_AUTO);
        } else if (menu_id === qf.const.MenuItemId.STANDUP) {       //站起
            this.node.emit(qf.ekey.DDZ_MENU_STANDUP);
        } else if (menu_id === qf.const.MenuItemId.SET) {           //设置
            this.node.emit(qf.ekey.DDZ_MENU_SET);
        }

        this.setMenuVisible(false);
    },
})