/*
ListView
1,支持Item复用
2,没有实现的方法可以直接使用cc.ScrollView
*/

let ListView = cc.Class({
    extends: cc.Component,

    statics: {
        UPDATE_UI: "update_ui", //更新ui
    },

    properties: {
        default_item: cc.Node,
        item_name: "",

        item_width: 10,
        item_height: 10,

        max_limit: 10, //最多显示多个item

        spacing: 10, //每个Item之间的距离
        padding: 10, //Item与边界的距离

        _listener: null,
        listener: {
            visible: false,
            set(cb) {
                this._listener = cb;
            },
            get() {
                return this._listener;
            }
        },
    },

    onLoad() {
        this.data = [];
        this.items = [];

        this.start_index = 0;
        this.end_index = 1;

        this.refer_index = 0; //参照的item的编号
        this.refer_position = cc.v2(); //参照坐标

        this.scrollview = this.node.getComponent(cc.ScrollView);
        this.content = this.scrollview.content;

        this.pool = new cc.NodePool();
    },

    start() {
        this.node.on("scrolling", () => {
            this.onScrolling();
        });
    },

    setData(data) {
        this.data = data;

        //可以重复调用setData，所以要先报Item清空
        for (let i = this.start_index; i < this.end_index; i++) {
            if (this.items[i]) {
                this.pool.put(this.items[i]);
                this.items[i] = null;
            }
        }
        this.start_index = 0;
        this.end_index = 0;

        let len = Math.min(this.data.length, this.max_limit);
        for (let i = 0; i < len; i++) {
            this._addItem(i);
            this.items[i].position = this.getPosition(i);
        }

        this.end_index = len;

        this.refer_index = this.start_index;
        this.updateChange();
    },

    updateItem(index, data) {
        this.data[index] = data;
        this.dispatchUpdateItem(index);

        this.refer_index = this.start_index;
        this.updateChange();
    },

    dispatchUpdateItem(index) {
        let item = this.items[index];
        let data = this.data[index];
        if (item) {
            if (this.item_name) {
                item.getComponent(this.item_name).updateUI(data);
            } else if (this.listener) {
                this.listener({ type: this.UPDATE_UI, item: item, data: data });
            } else {
                this.node.emit(this.UPDATE_UI, { item: item, data: data });
            }
        }
    },

    removeItem(index) {
        this.data.splice(index, 1);

        this._delItem(index);

        this.items.splice(index, 1);

        this.updateIndexes(index, -1);

        //删除之后，检查是否需要补充一个
        if (this.end_index - this.start_index < this.max_limit) {
            if (this.end_index < this.data.length) {
                this._addItem(this.end_index);
                this.end_index++;
            }
        }

        this.refer_index = this.start_index;
        this.updateChange();
    },

    insertItem(index, data) {
        this.data.splice(index, 0, data);
        this.items.splice(index, 0, null);

        if (index >= this.start_index && index < this.end_index) {
            this._addItem(index);

            this.updateIndexes(index, 1);

            //增加之后，检查是否超出限制
            if (this.end_index - this.start_index >= this.max_limit) {
                this._delItem(this.end_index - 1);
                this.end_index--;
            }

            this.refer_index = this.start_index;
            this.updateChange();
        }
    },
    //获取编号为index的Item位置，并且此Item一定已经存在
    getPosition(index) {
        if (this.horizontal) {
            return this.getHorizontalPosition(index);
        } else {
            return this.getVerticalPosition(index);
        }
    },
    getHorizontalPosition(index) {
        let x = this.padding, y = 0;
        if (index < this.start_index) {
            x += (this.item_width + this.spacing) * index;
        } else {
            x += (this.item_width + this.spacing) * this.start_index;
            let last_index = Math.min(this.end_index, index);
            for (let i = this.start_index; i < last_index; i++) {
                x += this.items[i].width + this.spacing;
            }
            x += (this.item_width + this.spacing) * (index - last_index);
        }
        x += this.items[index].width * this.items[index].anchorX;
        y += this.items[index].height * this.items[index].anchorY;
        return cc.v2(this.content.width * this.content.anchorX - x, y);
    },
    getVerticalPosition(index) {
        let x = 0, y = this.padding;
        if (index < this.start_index) {
            y += (this.item_height + this.spacing) * index;
        } else {
            y += (this.item_height + this.spacing) * this.start_index;
            let last_index = Math.min(this.end_index, index);
            for (let i = this.start_index; i < last_index; i++) {
                y += this.items[i].height + this.spacing;
            }
            y += (this.item_height + this.spacing) * (index - last_index);
        }
        x += this.items[index].width * this.items[index].anchorX;
        y += this.items[index].height * (1 - this.items[index].anchorY);
        return cc.v2(x, this.content.height * (1 - this.content.anchorY) - y);
    },

    //更新编号索引
    //@params index 新增的或已经被删除的Item
    //@params step -1:删除了Item, 1:新增了Item
    updateIndexes(index, step) {
        if (index < this.start_index) {
            this.start_index += step;
            this.end_index += step;
        }
        else if (index >= this.start_index && index < this.end_index) {
            this.end_index += step;
        }

        this.start_index = Math.max(this.start_index, 0);
        this.end_index = Math.min(this.end_index, this.data.length);
    },

    updateChange() {
        let old_size = this.content.getContentSize();

        this._updateReferPosition();

        this._updateContentSize();

        this._updatePosition();

        this._updateContentPosition();

        //由于content大小的改变，自动滚动时会使content发生跳动，所以要停止自动滚动效果
        let cur_size = this.content.getContentSize();
        if (old_size.width !== cur_size.width || old_size.height !== cur_size.height) {
            this.scrollview.stopAutoScroll();
        }
    },
    //更新参照坐标
    _updateReferPosition() {
        let item = this.items[this.refer_index];
        //左上角坐标
        let pos = item.convertToWorldSpace(cc.v2(0, item.height));

        this.refer_position = pos;
    },
    //更新可视item的坐标
    _updatePosition() {
        for (let i = this.start_index; i < this.end_index; i++) {
            this.items[i].position = this.getPosition(i);
        }
    },
    //更新content大小
    _updateContentSize() {
        let w = 0, h = 0;
        for (let i = this.start_index; i < this.end_index; i++) {
            w += this.items[i].width;
            h += this.items[i].height;
        }

        let visible_num = this.end_index - this.start_index;
        w += this.item_width * (this.data.length - visible_num);
        h += this.item_height * (this.data.length - visible_num);

        w += this.padding * 2 + (this.data.length - 1) * this.spacing;
        h += this.padding * 2 + (this.data.length - 1) * this.spacing;

        w = this.horizontal ? w : this.item_width;
        h = this.horizontal ? this.item_height : h;

        this.content.setContentSize(cc.size(w, h));
    },
    //更新content位置
    _updateContentPosition() {
        let p = cc.v2();
        p.x = this.scrollview._leftBoundary + this.content.anchorX * this.content.width;
        p.y = this.scrollview._topBoundary - (1 - this.content.anchorY) * this.content.height;
        this.content.position = p;

        let item = this.items[this.refer_index];
        let cur_pos = item.convertToWorldSpace(cc.v2(0, item.height));

        this.content.position = p.add(this.refer_position.sub(cur_pos));
    },

    //监听到正在滑动
    onScrolling() {
        let changed = false, is_start_rebound = false, is_end_rebound = false;

        let out_start = this.isFullOutBoundary(this.items[this.start_index], 1);
        let out_end = this.isFullOutBoundary(this.items[this.end_index - 1], 2);

        //第1个Item没有完全超出边界，而且是第1条数据
        if (!out_start && this.start_index <= 0) {
            is_start_rebound = true;
        }
        //倒数第1个Item没有超出边界，而且是最后1条数据
        if (!out_end && this.end_index >= this.data.length) {
            is_end_rebound = true;
        }

        //默认设置为起始编号
        this.refer_index = this.start_index;

        //如果不需要回弹
        if (!is_start_rebound && !is_end_rebound) {
            //检查首部
            if (!out_start) {
                //新增this.start_index - 1
                this.start_index -= 1;
                this._addItem(this.start_index);
                changed = true;
            }
            else if (this.isFullOutBoundary(this.items[this.start_index + 1], 1)) {
                //回收this.start_index
                this._delItem(this.start_index);
                this.start_index += 1;
                this.refer_index = this.start_index;
                changed = true;
            }

            //检查尾部
            if (!out_end) {
                //新增this.end_index
                this._addItem(this.end_index);
                this.end_index += 1;
                changed = true;
            } else if (this.isFullOutBoundary(this.items[this.end_index - 2], 2)) {
                //回收this.end_index - 1
                this.end_index -= 1;
                this._delItem(this.end_index);
                changed = true;
            }
        }

        //由于增加的Item或删除的Item的尺寸跟默认尺寸有区别
        //所以要调整content，而且已经显示的Item的显示位置不能有较大变动
        if (changed) {
            this.updateChange();
        }
    },

    _addItem(index) {
        let item = this.pool.get() || cc.instantiate(this.default_item);
        item.active = true;
        this.content.addChild(item);
        this.items[index] = item;

        this.dispatchUpdateItem(index);

        if (index < 4) {
            item.setContentSize(cc.size(item.width, 230));
        } else {
            item.setContentSize(cc.size(item.width, 130));
        }
    },
    _delItem(index) {
        let item = this.items[index];
        this.pool.put(item);
        this.items[index] = null;
    },

    //检查指定的item节点是否完全超出边界
    //@params type 1检查超出顶部 2检查超出尾部 3顶和尾同时检查
    isFullOutBoundary(item, type) {
        if (!item) return false;

        type = type === undefined ? 3 : type;

        let world_lt = item.convertToWorldSpace(cc.v2(0, item.height));
        let world_rb = item.convertToWorldSpace(cc.v2(item.width, 0));
        let view_lt = this.content.parent.convertToNodeSpaceAR(world_lt);
        let view_rb = this.content.parent.convertToNodeSpaceAR(world_rb);
        if (this.horizontal) {
            if (view_lt.x > this.scrollview._rightBoundary && (type & 2)) {
                return true;
            } else if (view_rb.x < this.scrollview._leftBoundary && (type & 1)) {
                return true;
            }
        } else {
            if (view_rb.y > this.scrollview._topBoundary && (type & 1)) {
                return true;
            } else if (view_lt.y < this.scrollview._bottomBoundary && (type & 2)) {
                return true;
            }
        }
        return false;
    },
    //把编号为index滚动到起始位置
    scrollToIndex(index) {

    },
    //滚动到指定的百分比处
    scrollToPercent(percent) {

    },
});