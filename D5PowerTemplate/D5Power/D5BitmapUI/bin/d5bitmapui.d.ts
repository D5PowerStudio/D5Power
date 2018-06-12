declare module d5power {
    class D5Component extends egret.Sprite {
        static MOVE_NUMBER: number;
        static MOVE_NONE: number;
        static MOVE_LEFT: number;
        static MOVE_RIGHT: number;
        static MOVE_DOWN: number;
        static MOVE_UP: number;
        static MOVE_ALPHA: number;
        static autoRelease: boolean;
        private static _preloadList;
        protected _w: number;
        protected _h: number;
        protected _nowName: string;
        /**
         * 归属，用于判断加载进度
         */
        protected _belone: string;
        protected _moveAction: number;
        moveAction: number;
        startX: number;
        startY: number;
        private static _me;
        static readonly me: D5Component;
        constructor();
        private static _moveList;
        static addMoveList(target: D5Component): void;
        private static onMoveUI(e);
        /**
         * 将与自己同容器，且在自己范围内的对象纳入自己的自对象，形成一个整体
         *
         * @param   e
         * @param   skip    不进行合并的对象
         * @param   contain 必然进行合并的对象
         */
        add2Me(e?: egret.Event, skip?: Array<any>, contain?: Array<any>): void;
        setSkin(name: string): void;
        protected static _pro_binding_source: IUserInfoContainer;
        /**
         * 属性绑定目标
         */
        static setproBindingSource(obj: IUserInfoContainer): void;
        static readonly proBindingSource: IUserInfoContainer;
        setSize(w: number, h: number): void;
        readonly nowName: string;
        readonly width: number;
        readonly height: number;
        static getComponentByURL(res: string, container: egret.DisplayObjectContainer, onPre?: Function): void;
        protected loadResource(name: string, callback: Function, thisobj: any): void;
        static getCompoentByJson(value: any, container: egret.DisplayObjectContainer): any;
        dispose(): void;
        protected invalidate(): void;
        draw(): void;
        invalidateSize(): void;
        protected autoCache(): void;
        private onAutoCache(event);
    }
}
declare module d5power {
    class D5FlyBox extends D5Component {
        static LEFT: number;
        static CENTER: number;
        private _maxWidth;
        private _usedWidth;
        private _usedHeight;
        private _paddingx;
        private _paddingy;
        private _align;
        /**
         * 提供给编辑器使用的背景
         */
        private _editorBG;
        /**
         * 原始X坐标
         */
        private _zerox;
        /**
         * @pararm	w	最大的自动换行宽度
         */
        constructor();
        /**
         * 设置对齐模式
         */
        setMode(values: number): void;
        setX(value: number): void;
        setPaddingx(num?: number): void;
        setPaddingy(num?: number): void;
        getPaddingx(): number;
        getPaddingy(): number;
        /**
         * 设置最大宽度，当内容超过最大宽度后，即会自动换行
         */
        setMaxWidth(w?: number): void;
        readonly maxWidth: number;
        readonly $maxWidth: number;
        parseToXML(): string;
        setEditorMode(): void;
        addChild(child: egret.DisplayObject): egret.DisplayObject;
        removeChild(child: egret.DisplayObject): egret.DisplayObject;
        private redraw(e?);
        private updateEditorBG();
    }
}
declare module d5power {
    class D5MirrorBox extends D5Component {
        cutX: number;
        cutY: number;
        private lt;
        private t;
        private rt;
        private l;
        private m;
        private r;
        private lb;
        private b;
        private rb;
        constructor();
        setRes(data: egret.Texture): void;
        protected onComplate(data: egret.Texture): void;
        setSkin(name: string): void;
        draw(): void;
        readonly mBitmap: egret.Bitmap;
        dispose(): void;
    }
}
declare module d5power {
    class D5Text extends D5Component implements IProBindingSupport {
        static LEFT: number;
        static CENTER: number;
        static RIGHT: number;
        static TOP: number;
        static MIDDLE: number;
        static BOTTOM: number;
        static AUTO_PADDING: number;
        /**
         * 绑定属性
         */
        _binding: string;
        _textField: egret.TextField;
        /**
         * 背景色
         */
        _bgColor: number;
        /**
         * 亮色边
         */
        _lightBorder: number;
        /**
         * 暗色边
         */
        _darkBorder: number;
        /**
         * 当前的描边颜色
         */
        private _filterColor;
        /**
         * 最大宽度
         */
        private _maxWidth;
        /**
         *文本id,用此id去语言包取对应的值
         */
        private _textID;
        /**
         *
         * @param	_text		字符内容
         * @param	fontcolor	字体颜色
         * @param	bgcolor		文本框背景颜色
         * @param	border		文本框边线颜色
         */
        constructor(_text?: string, fontcolor?: number, bgcolor?: number, border?: number, size?: number);
        update(): void;
        invalidateSize(): void;
        clone(): D5Text;
        /**
         * 将自身的格式复制设置给目标文本
         * @param		copy		想复制当前文本格式的D5Text
         */
        copyFormat(copy: D5Text, content?: String): void;
        /**
         * 设置文本内容的描边
         * @param	color	描边的值，-1为删除描边
         */
        setVerticalAlign(value?: number): void;
        /**
         * 设置文本内容的描边
         * @param	color	描边的值，-1为删除描边
         */
        setFontBorder(color?: number): void;
        readonly fontBorder: number;
        /**
         * 传入内容文本,兼容旧版。建议直接使用text属性
         */
        setText(t: string): void;
        text: string;
        readonly textField: egret.TextField;
        /**
        *传入html文本
        */
        setHtmlText(html: string): void;
        /**
         * 设置背景颜色
         */
        setBgColor(v?: number): void;
        readonly bgColor: number;
        /**
         * 设置边框颜色
         * @param	lt	LeftTop，左侧和顶部的线条颜色
         * @param	rb	RightBottom,右侧和底部的线条颜色
         */
        setLtBorder(v?: number): void;
        readonly ltBorder: number;
        setRbBorder(v?: number): void;
        readonly rbBorder: number;
        /**
         * 是否以密码的状态显示文本
         */
        setIsPassword(v: boolean): void;
        readonly isPassword: boolean;
        /**
         *文本id,用此id去语言包取对应的值
         */
        readonly textID: string;
        setTextID(value: string): void;
        /**
         *设置宽高
         */
        setWidth(value: number): void;
        setHeight(value: number): void;
        /**
         *设置对齐
         */
        setTextAlign(value: number): void;
        /**
         *背景宽高
         */
        setSize(w: number, h?: number): void;
        /**
        * 自动调整宽度和高度
        */
        autoGrow(): void;
        /**
         * 是否为多行
         */
        setWrapFlg(flg?: number): void;
        readonly wrapFlg: number;
        /**
         * 将文本框锁定在某背景元素上,使文本框的宽\高\坐标与目标完全一致
         * @param	d
         */
        lockTo(d: egret.DisplayObject, changeHeight?: boolean, padding?: number): void;
        /**
         * 设置字体大小
         */
        setFontSize(size?: number): void;
        readonly fontSize: number;
        /**
         * 设置字体加粗
         */
        setFontBold(b: boolean): void;
        readonly fontBold: boolean;
        /**
         * 设置文本的输入类型（是否允许输入）1,允许输入；0，不允许
         */
        setType(u?: number): void;
        readonly type: number;
        /**
         * 文本内容宽高
         */
        readonly textWidth: number;
        readonly textHeight: number;
        /**
         * 设置文本颜色
         */
        setTextColor(u?: number): void;
        textColor: number;
        clear(): void;
        dispose(): void;
    }
}
declare module d5power {
    class D5ImageBox extends D5MirrorBox {
        private _url;
        private spr;
        private _name;
        protected _logo: egret.Bitmap;
        /**
         * 物品数量
         */
        protected _itemNum: number;
        /**
         * 是否显示数量
         */
        protected _showNum: boolean;
        /**
         * 数量显示器
         */
        protected numShower: D5Text;
        _id: number;
        static _resourceLib: any;
        constructor();
        protected onComplate(data: egret.Texture): void;
        /**
         * 设置物品图片
         */
        setLogo(url: string): void;
        removeLogo(): void;
        draw(): void;
        private over(evt);
        /**
         * 设置URL，本功能仅用来保存URL，不会加载地址
         * 如需要加载，请使用logo属性，或者通过logoData直接设置位图数据
         */
        url: string;
        /**
         * 是否显示数量（例如背包的右下角数据）
         */
        showNum(b: boolean): void;
        protected buildNumShower(): void;
        /**
         * 设置数量
         */
        setNum(v: number): void;
        /**
         * 获取数量
         */
        readonly num: number;
        readonly id: number;
        setId(value: number): void;
        dispose(): void;
    }
}
declare module d5power {
    /**
     *
     * @author
     *
     */
    class D5BitmapNumber extends D5Component {
        private data;
        private _align;
        private _box;
        private _autoAdd;
        private _keepLength;
        private _displayer;
        private _nowValue;
        private _targetValue;
        private _lastrender;
        private static _pool;
        private static getBitmap();
        private static back2Pool(v);
        constructor();
        setAlign(v: number): void;
        /**
         * 设置保持长度
         */
        keepLength(v: number): void;
        /**
         * 是否开启自动增长功能
         */
        autoGrow: boolean;
        setSkin(name: string): void;
        setValue(v: number): void;
        private drawNumber(str);
        setPadding(v: number): void;
        dispose(): void;
        private autoAddRender(e);
    }
}
declare module d5power {
    class D5Button extends D5Component {
        type: number;
        private _sheet;
        private a;
        private data;
        private _lable;
        private sound;
        private _callback2;
        protected _icon: D5Bitmap;
        protected _iconAutoFly: boolean;
        constructor();
        showIcon(v: boolean): void;
        readonly iconDisplay: Boolean;
        setIcon(url: string, xpos?: number, ypos?: number): void;
        private flyIcon();
        setLable(lab: string): void;
        private autoLableSize();
        enabled(b: boolean): void;
        setRes(data: egret.Texture): void;
        protected onComplate(data: egret.Texture): void;
        private drawButton();
        setSkin(name: string): void;
        setSound(sound: string): void;
        private btnDown(evt);
        private btnUp(evt);
        private btnOutSide(evt);
        private btnClick(evt);
        draw(): void;
        setCallback(fun: Function): void;
        dispose(): void;
    }
}
declare module d5power {
    /**
     *
     * @author
     *
     */
    class D5CDdisplayer extends d5power.D5Component {
        static CIRCLE: number;
        static RECT: number;
        constructor();
        private _mode;
        private _cd;
        private _cding;
        private _startX;
        private _startY;
        private _progressLen;
        private _progressMax;
        private _startTime;
        private _lastRender;
        private _renderSpeed;
        private _color;
        private _drawPath;
        setMode(v: number): void;
        setColor(v: number): void;
        setAlpha(value: number): void;
        /**
        * 是否正在CD
        */
        readonly cding: boolean;
        setSize(w: number, h: number): void;
        /**
        * 开始CD
        * @param	v	CD时间，单位秒
        */
        startCD(v: number): void;
        private render(e?);
        private renderCircle(e?);
        private renderRect(e?);
    }
}
/**
 * Created by Administrator on 2015/8/3.
 */
declare module d5power {
    interface IProBindingContainer {
        addBinder(obj: IProBindingSupport): void;
    }
}
declare module d5power {
    class D5ButtonGroup extends D5FlyBox {
        private _hasDefaultSelected;
        private items;
        private _itemNum;
        unsetup(e?: egret.Event): void;
        /**
         * 构造函数
         * @param	w	按钮组的容器宽度
         */
        constructor(w?: number);
        /**
         * 按钮数量
         */
        setItemNum(num?: number): void;
        /**
         * 按钮数量
         */
        readonly itemNum: number;
        /**
         * 是否具备默认选项
         */
        readonly hasDefaultSelected: boolean;
        /**
         * 是否具备默认选项
         */
        setHasDefaultSelected(value: boolean): void;
        /**
         * 向按钮组中增加对象
         */
        addItem(item: d5power.D5Button): void;
        addChild(child: d5power.D5Component): egret.DisplayObject;
        /**
         * 从按钮组中移除某对象
         */
        removeItem(item: d5power.D5Component): void;
        /**
         * 点击事件
         */
        private _onItemClick(e);
        getSelectedID(): number;
        private _lastSelectedItem;
        setEditorMode(): void;
        /**
         *此组件默认背景
         */
        createBgShape(w?: number, h?: number): void;
        clearVirtualBackground(): void;
        private _bgShapeFlg;
        bgShapeFlg: number;
        dispose(): void;
    }
}
declare module d5power {
    class D5HBox extends D5Component {
        _padding: number;
        /**
         * 提供给编辑器使用的背景
         */
        private _editorBG;
        autoFly: boolean;
        constructor();
        setEditorMode(): void;
        parseToXML(): string;
        /**
         * Override of addChild to force layout;
         */
        addChildAt(child: egret.DisplayObject, index?: number): egret.DisplayObject;
        addChild(child: egret.DisplayObject): egret.DisplayObject;
        /**
         * Override of removeChild to force layout;
         */
        removeChild(child: egret.DisplayObject): egret.DisplayObject;
        /**
         * Override of removeChild to force layout;
         */
        removeChildAt(index?: number): egret.DisplayObject;
        onResize(event: egret.Event): void;
        /**
         * Draws the visual ui of the component, in this case, laying out the sub components.
         */
        draw(): void;
        /**
         * Gets / sets the spacing between each sub component.
         */
        setPadding(s: number): void;
        readonly padding: number;
    }
}
declare module d5power {
    class D5List extends D5Component {
        private _list;
        private _content;
        private _selected;
        _blockW: number;
        _blockH: number;
        _textColor: number;
        _hoverColor: number;
        _hoverAlpha: number;
        _fontSize: number;
        _stage: egret.Stage;
        readonly className: string;
        constructor();
        drawBackground(background: number, alpha?: number, line?: number): void;
        /**
         * 设置列表样式
         *
         * @param	blockW		每个区块的宽度
         * @param	blockH		每个区块的高度
         * @param	textColor	字体颜色
         * @param	hoverColor	鼠标经过颜色
         * @param	hoverAlpha	鼠标经过透明度
         * @param	textSize	字体大小
         */
        setFormat(blockW: number, blockH: number, textColor: number, hoverColor: number, hoverAlpha?: number, textSize?: number): void;
        setblockW(value?: number): void;
        dispose(): void;
        addStuff(lable: any, data: any): void;
        removeStuffByIndex(index?: number): void;
        removeAllStuff(): void;
        readonly height: number;
        /**
         * 当前选择的值
         */
        readonly value: any;
        readonly lable: string;
        readonly index: number;
        private setupListener();
        private onMove(e);
        private onClick(e);
        private onAdd(e);
        private onStageClick(e);
        private getUnderMouse(px, py?);
        flushFormat(): void;
        private flushFormatDoing(t);
    }
}
declare module d5power {
    class D5Loop extends D5Component {
        private _workmode;
        private _cutsize1;
        private _cutsize2;
        private _partI;
        private _partII;
        private _partIII;
        constructor(mode: number, cutsize1: number, cutsize2: number);
        private buildPart();
        setSkin(name: string): void;
        protected onComplate(data: egret.Texture): void;
        draw(): void;
    }
}
/**
 * Created by Administrator on 2015/8/3.
 */
declare module d5power {
    interface IProBindingSupport {
        update(): void;
    }
}
declare module d5power {
    class D5MirrorLoop extends D5Component {
        private front;
        private enter;
        private after;
        _mode: number;
        _cutSize: number;
        constructor();
        setRes(data: egret.Texture): void;
        protected onComplate(data: egret.Texture): void;
        setSkin(name: string): void;
        draw(): void;
        clone(): D5MirrorLoop;
        readonly mBitmap: egret.Bitmap;
        dispose(): void;
    }
}
declare module d5power {
    class D5RadioBtn extends D5Component {
        private static _radioLib;
        static disposeLib(group: string, target?: D5RadioBtn): void;
        private a;
        private data;
        private _selected;
        private _lable;
        private _groupName;
        constructor();
        groupName: string;
        setLable(lab: string): void;
        private autoLableSize();
        setSelected(value: boolean): void;
        selected: boolean;
        private updateFace();
        enabled(b: boolean): void;
        setSkin(name: string): void;
        private btnDown(evt);
        private btnUp(evt);
        draw(): void;
        dispose(): void;
    }
}
/**
 * Created by Administrator on 2015/8/28.
 */
declare module d5power {
    /**
     *
     * @author
     *
     */
    class D5Shape extends D5Component {
        protected _workMode: number;
        /**
         * 工作模式矩形
         */
        static RECT: number;
        /**
         * 工作模式圆
         */
        static CIRCLE: number;
        /**
         * 自定义填充
         */
        static CUSTOM: number;
        private _fillColor;
        private _tickNess;
        private _color;
        private _offX;
        private _offY;
        private _radius;
        private _points;
        private _shape;
        drawAlpha: number;
        constructor();
        pointString: String;
        draw(): void;
        /**
         *填充颜色
         */
        readonly fillColor: number;
        /**
         * @private
         */
        setFillColor(value: number): void;
        /**
         * 线条粗细，0为不显示线条
         */
        readonly tickNess: number;
        /**
         * @private
         */
        setTickNess(value: number): void;
        /**
         * 线条颜色
         */
        readonly color: number;
        /**
         * @private
         */
        setColor(value: number): void;
        /**
         * 偏移坐标x,y
         */
        readonly offX: number;
        /**
         * @private
         */
        setOffX(value: number): void;
        /**
         * 偏移坐标x,y
         */
        readonly offY: number;
        /**
         * @private
         */
        setOffY(value: number): void;
        readonly drawWidth: number;
        clone(): D5Shape;
        setDrawWidth(value: number): void;
        readonly drawHeight: number;
        setDrawHeight(value: number): void;
        setSize(w: number, h: number): void;
        readonly radius: number;
        setRadius(value: number): void;
        readonly workMode: number;
        setWorkMode(value: number): void;
        dispose(): void;
    }
}
declare module d5power {
    class D5SliderButton extends D5Component {
        private button;
        private front;
        private enter;
        private after;
        private data;
        private box;
        private text;
        private vBox;
        private cell;
        private _arrCell;
        private _dataArr;
        constructor();
        setDataName(arr: Array<string>): void;
        readonly dataName: Array<string>;
        setSkin(name: string): void;
        setTable(info: string): void;
        private btnDown(evt);
        showList(arr: Array<string>): void;
        private changeName(evt);
        private cleanCell();
        private btnUp(evt);
        draw(): void;
    }
}
declare module d5power {
    class D5Style {
        /**
         * 默认Lable颜色
         */
        static default_lable_color: number;
        /**
         * 默认按钮文字描边颜色
         */
        static default_btn_lable_border: number;
        /**
         * 默认按钮文字大小
         */
        static default_btn_lable_size: number;
        /**
         * 默认按钮文字是否加粗
         */
        static default_btn_lable_bold: boolean;
        /**
         * UI控件是否自动释放
         */
        static autoRelease: boolean;
        constructor();
    }
}
declare module d5power {
    class D5Swf extends D5Component implements ISpriteSheetWaiter {
        _src: string;
        _zoom: number;
        private _drager;
        protected _loadID: number;
        _spriteSheet: IDisplayer;
        protected _monitor: egret.Bitmap;
        private _lastRender;
        private _playFrame;
        constructor();
        setSrc(src: string): void;
        readonly loadID: number;
        setEditorMode(): void;
        private addParticle();
        onSpriteSheepReady(data: IDisplayer): void;
        private runAction(e);
        setZoom(value: number): void;
        private onLoadComplate();
        draw(): void;
        dispose(): void;
    }
}
declare module d5power {
    class D5Bitmap extends D5Component {
        private bit;
        private _url;
        private _onComplate;
        private _onComplateObj;
        /**
         * 默认贴图
         */
        private static _defaultTexture;
        constructor();
        setSkin(name: string): void;
        setComplete(fun: Function, thisObj: any): void;
        setSrc(url: string): void;
        clone(): D5Bitmap;
        setRes(data: egret.Texture): void;
        protected onComplate(data: any): void;
        draw(): void;
        dispose(): void;
    }
}
declare module d5power {
    class D5HoverText extends D5Text {
        /**
         * 鼠标经过颜色
         */
        private _hoverColor;
        /**
         * 鼠标经过透明度
         */
        private _hoverAlpha;
        /**
         * 鼠标经过是否提示
         */
        private _hover;
        /**
         * 是否选定状态
         */
        private _isHover;
        /**
         *数据
         */
        private _data;
        static lastHover: D5HoverText;
        readonly className: string;
        constructor(_text?: string, fontcolor?: number, bgcolor?: number, border?: number, size?: number);
        init(e?: Event): void;
        private onRemove(e);
        /**
         * 设置状态
         */
        setHover(colorV: number, alphaV: number): void;
        hover(): void;
        unhover(): void;
        readonly isHover: boolean;
        onMouse(e: egret.TouchEvent): void;
        setData(data: any): void;
        readonly data: any;
    }
}
/**
 * Created by Administrator on 2015/9/1.
 */
declare module d5power {
    class D5UILoader extends egret.Sprite implements IUserInfoDisplayer, IProBindingContainer {
        _realWidth: number;
        _realHeight: number;
        _flyX: number;
        _flyY: number;
        protected _uiSrc: string;
        private _bindingList;
        constructor();
        addBinder(obj: IProBindingSupport): void;
        setup(url: String): void;
        private LoadComplete(data);
        dispose(): void;
        private flyPos(e?);
        private autoFly(e?);
        private autoDispose(e);
        update(): void;
        readonly width: number;
        readonly height: number;
    }
}
declare module d5power {
    class D5VBox extends D5Component {
        _padding: number;
        /**
         * 提供给编辑器使用的背景
         */
        private _editorBG;
        constructor();
        setEditorMode(): void;
        parseToXML(): string;
        /**
         * Override of addChild to force layout;
         */
        addChild(child: egret.DisplayObject): egret.DisplayObject;
        /**
         * Override of removeChild to force layout;
         */
        removeChild(child: egret.DisplayObject): egret.DisplayObject;
        /**
         * Override of removeChild to force layout;
         */
        removeChildAt(index?: number): egret.DisplayObject;
        /**
         * Internal handler for resize event of any attached component. Will redo the layout based on new size.
         */
        onResize(event: egret.Event): void;
        /**
         * Draws the visual ui of the component, in this case, laying out the sub components.
         */
        draw(): void;
        /**
         * Gets / sets the spacing between each sub component.
         */
        padding: number;
    }
}
declare module d5power {
    class D5Window extends D5Component {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        private lt;
        private t;
        private rt;
        private l;
        private m;
        private r;
        private lb;
        private b;
        private rb;
        constructor();
        setRes(data: egret.Texture): void;
        protected onComplate(data: egret.Texture): void;
        setSkin(name: string): void;
        draw(): void;
        dispose(): void;
    }
}
declare module d5power {
    class ListCell extends egret.Sprite {
        private text;
        private loop;
        private _id;
        constructor();
        setBtnID(id: number): void;
        readonly btnID: number;
        showCell(w: number, msg: string): void;
        dispose(): void;
    }
}
