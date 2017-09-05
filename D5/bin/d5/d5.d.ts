declare module d5power {
    class GameObject implements IGD {
        protected _pos: egret.Point;
        protected _monitor: egret.DisplayObject;
        protected _map: IMap;
        speed: number;
        beFocus: boolean;
        constructor(map: IMap);
        readonly posX: number;
        readonly posY: number;
        readonly $pos: egret.Point;
        setPos(px: number, py: number): void;
        render(t: number): void;
        run(t: number): void;
        readonly monitor: egret.DisplayObject;
        protected updatePos(offX?: number, offY?: number): void;
    }
}
declare module d5power {
    class GMath {
        static K_R2A: number;
        static K_A2R: number;
        constructor();
        /**
         * 获取某点的夹角
         * 返回为弧度值
         */
        static getPointAngle(x: number, y: number): number;
        /**
         * 弧度转角度
         */
        static R2A(r: number): number;
        /**
         * 角度转弧度
         */
        static A2R(a?: number): number;
    }
}
declare module d5power {
    class D5Event {
    }
}
declare module d5power {
    class Actions {
        /**
         * 特殊状态：复活
         */
        static RELIVE: number;
        /**
         * Stop 停止
         * */
        static Stop: number;
        /**
         * Run 跑动
         * */
        static Run: number;
        /**
         * Sing 施法攻击
         * */
        static Sing: number;
        /**
         * Attack 物理攻击
         * */
        static Attack: number;
        /**
         * 弓箭攻击
         * */
        static BowAtk: number;
        /**
         * 坐下
         */
        static Sit: number;
        /**
         * 死亡
         */
        static Die: number;
        /**
         * 拾取
         */
        static Pickup: number;
        /**
         * 被攻击
         */
        static BeAtk: number;
        /**
         * 等待（备战）
         */
        static Wait: number;
        constructor();
    }
}
declare module d5power {
    class BaseMap implements IMap {
        /**
         * 在二进制文件中，由于需要1个字节表示多个状态。因此采用大于0的值表示可通过
         * 在导入后进行了转义
         */
        private static BIN_ALPHA_VALUE;
        private static BIN_CAN_VALUE;
        private static BIN_NO_VALUE;
        private static _tilePool;
        private static rebuildPool(num);
        private static back2pool(data);
        private static getTile();
        private _mapid;
        private _mapWidth;
        private _mapHeight;
        private _tileW;
        private _tileH;
        private _onReady;
        private _onReadyThis;
        private _mapResource;
        private _tileFormat;
        private _tempPoint;
        private _loopBg;
        private _roadW;
        private _roadH;
        private _smallMap;
        private _roadArr;
        private _alphaArr;
        /**
         * 显示区域区块数量
         */
        private _areaX;
        private _areaY;
        private _nowStartX;
        private _nowStartY;
        /**
         * 当前屏幕正在渲染的坐标记录
         */
        private _posFlush;
        /**
         * 正常渲染层（与角色同层次）
         */
        private _dbuffer;
        private _astar;
        constructor();
        createLoop(id: number, bg: string, callback: Function, thisobj: any, blockw?: number, blockh?: number): void;
        enter(id: number, callback: Function, thisobj: any): void;
        readonly id: number;
        setContainer(container: egret.DisplayObjectContainer): void;
        setTileFormat(s: string): void;
        setup(id: number, w: number, h: number, tw: number, th: number, onReady: Function, onReadyThis: any): void;
        private createSmallData(smallW, smallH);
        readonly width: number;
        readonly height: number;
        readonly tileWidth: number;
        readonly tileHeight: number;
        readonly roadWidth: number;
        readonly roadHeight: number;
        render(flush?: boolean): void;
        resize(): void;
        /**
         * 重置地图数据
         */
        resetRoad(): void;
        /**
         * 设置地图数据
         * @param data
         */
        setRoad(data: Array<Array<number>>): void;
        isInAlphaArea(px: number, py: number): boolean;
        /**
         * 尝试寻找周围可以通过的位置
         * 进行若干次尝试，如果没有发现，则返回null，请注意容错判断
         */
        getPointAround(center: egret.Point, from: egret.Point, r: number): egret.Point;
        PointCanMove(p: egret.Point, n: egret.Point): Boolean;
        getRoadPass(px: number, py: number): boolean;
        findPath(fromx: number, fromy: number, tox: number, toy: number): Array<any>;
        /**
         * 根据屏幕某点坐标获取其在世界（全地图）内的坐标
         */
        getWorldPostion(x: number, y: number): egret.Point;
        /**
         * 根据世界坐标获取在屏幕内的坐标
         */
        getScreenPostion(x: number, y: number): egret.Point;
        /**
         * 根据路点获得世界（全地图）内的坐标
         */
        tile2WorldPostion(x: number, y: number): egret.Point;
        /**
         * 世界地图到路点的转换
         */
        Postion2Tile(px: number, py: number): egret.Point;
        reset(): void;
        /**
         * 设置路点。至此，地图准备完毕，通知主程序开始渲染
         * @param data
         */
        private setupRoad(res);
        private makeData(startx, starty, flush);
        clear(): void;
        private _nowName;
        private loadTiles(data?);
        private mod_buffer;
        private fillTile(tx, ty, data);
        /**
         * 绘制小地图
         */
        private fillSmallMap(startX, startY, tx, ty);
    }
}
declare module d5power {
    class Camera {
        static zeroX: number;
        static zeroY: number;
        /**
         * 分布渲染时间限制。每次渲染的最大允许占用时间，单位毫秒
         */
        static RenderMaxTime: number;
        /**
         * 摄像机可视区域
         */
        private static _cameraView;
        /**
         * 是否需要重新裁剪
         */
        static $needreCut: boolean;
        private _cameraCutView;
        private _zorderSpeed;
        /**
         * 镜头注视
         */
        _focus: IGD;
        _timer: egret.Timer;
        _moveSpeed: number;
        private _moveStart;
        private _moveEnd;
        private _moveAngle;
        private _moveCallBack;
        private _map;
        static readonly needreCut: boolean;
        constructor(map: IMap);
        setZero(x: number, y: number): void;
        update(): void;
        /**
         * 镜头注视
         */
        focus: IGD;
        /**
         * 镜头移动速度
         */
        moveSpeed: number;
        /**
         * 镜头视野矩形
         * 返回镜头在世界地图内测区域
         */
        static readonly cameraView: egret.Rectangle;
        /**
         * 镜头裁剪视野
         */
        readonly cameraCutView: egret.Rectangle;
        /**
         * 镜头向上
         * @param    k    倍率
         */
        moveNorth(k?: number): void;
        /**
         * 镜头向下
         */
        moveSourth(k?: number): void;
        /**
         * 镜头向左
         */
        moveWest(k?: number): void;
        /**
         * 镜头向右
         */
        moveEast(k?: number): void;
        move(xdir: number, ydir: number, k?: number): void;
        /**
         * 镜头观察某点
         */
        lookAt(x: number, y: number): void;
        flyTo(x: number, y: number, callback?: Function): void;
        moveCamera(e: egret.TimerEvent): void;
        readonly zorderSpeed: number;
        reCut(): void;
    }
}
declare module d5power {
    class Direction {
        static Down: number;
        static LeftDown: number;
        static Left: number;
        static LeftUp: number;
        static Up: number;
        static RightUp: number;
        static Right: number;
        static RightDown: number;
        constructor();
    }
}
declare module d5power {
    interface ID5Power {
    }
}
declare module d5power {
    class DisplayPluginData {
        offX: number;
        offY: number;
        obj: egret.DisplayObject;
    }
}
declare module d5power {
    interface IGD {
        posX: number;
        posY: number;
        $pos: egret.Point;
        speed: number;
        beFocus: boolean;
        monitor: egret.DisplayObject;
        setPos(px: number, py: number): void;
        /**
         * 渲染运行
         */
        render(t: number): void;
        /**
         * 数据运行
         */
        run(t: number): void;
    }
}
declare module d5power {
    interface IMap {
        width: number;
        height: number;
        tileWidth: number;
        tileHeight: number;
        findPath(fromx: number, fromy: number, tox: number, toy: number): Array<any>;
        tile2WorldPostion(tx: number, ty: number): egret.Point;
        getScreenPostion(wx: number, wy: number): egret.Point;
        render(): any;
        setContainer(container: egret.DisplayObjectContainer): any;
    }
}
declare module d5power {
    class PlayerData {
        uid: number;
        private _missionList;
        constructor();
        getMission(id: number): void;
    }
}
declare module d5power {
    class SilzAstar {
        /**
         * 寻路方式，8方向和4方向，有效值为8和4
         */
        private static WorkMode;
        private _grid;
        private _index;
        private _path;
        private astar;
        /**
         * 地图显示尺寸
         */
        private _cellSize;
        /**
         * 路径显示器
         */
        private path;
        /**
         * 地图显示器
         */
        private image;
        /**
         * 显示容器
         */
        private imageWrapper;
        /**
         * 显示模式
         */
        private isDisplayMode;
        /**
         * @param    mapdata        地图数据
         * @param    container    显示容器，若为null则不显示地图
         */
        constructor(mapdata: Array<any>, container?: egret.DisplayObjectContainer);
        WORKMODE: number;
        /**
         * @param        xnow    当前坐标X(寻路格子坐标)
         * @param        ynow    当前坐标Y(寻路格子坐标)
         * @param        xpos    目标点X(寻路格子坐标)
         * @param        ypos    目标点Y(寻路格子坐标)
         */
        find(xnow: number, ynow: number, xpos: number, ypos: number): Array<any>;
        private makeGrid(data);
        private drawGrid();
        private getColor(node);
    }
    class AStar {
        private _open;
        private _grid;
        private _endNode;
        private _startNode;
        private _path;
        private _floydPath;
        heuristic: Function;
        private _straightCost;
        private _diagCost;
        private nowversion;
        constructor(grid: Grid);
        private justMin(x, y);
        findPath(): boolean;
        floyd(): void;
        private floydCrossAble(n1, n2);
        private bresenhamNodes(p1, p2);
        private floydVector(target, n1, n2);
        search(): boolean;
        private buildPath();
        readonly path: Array<any>;
        readonly floydPath: Array<any>;
        manhattan(node: SilzAstarNode): number;
        manhattan2(node: SilzAstarNode): number;
        euclidian(node: SilzAstarNode): number;
        private TwoOneTwoZero;
        chineseCheckersEuclidian2(node: SilzAstarNode): number;
        private sqrt(x);
        euclidian2(node: SilzAstarNode): number;
        diagonal(node: SilzAstarNode): number;
    }
    class BinaryHeap {
        a: Array<any>;
        justMinFun: Function;
        constructor(justMinFun?: Function);
        ins(value: any): void;
        pop(): any;
    }
    class Grid {
        private _startNode;
        private _endNode;
        private _nodes;
        private _numCols;
        private _numRows;
        private type;
        private _straightCost;
        private _diagCost;
        constructor(numCols: number, numRows: number);
        /**
         *
         * @param   type    0四方向 1八方向 2跳棋
         */
        calculateLinks(type?: number): void;
        getType(): number;
        /**
         *
         * @param   node
         * @param   type    0八方向 1四方向 2跳棋
         */
        private initNodeLink(node, type);
        nodeValuable(x: number, y: number): boolean;
        getNode(x: number, y: number): SilzAstarNode;
        setEndNode(x: number, y: number): void;
        setStartNode(x: number, y: number): void;
        setWalkable(x: number, y: number, value: boolean): void;
        readonly endNode: SilzAstarNode;
        readonly numCols: number;
        readonly numRows: number;
        readonly startNode: SilzAstarNode;
    }
    class Link {
        node: SilzAstarNode;
        cost: number;
        constructor(node: SilzAstarNode, cost: number);
    }
    class SilzAstarNode {
        x: number;
        y: number;
        f: number;
        g: number;
        h: number;
        walkable: boolean;
        parent: SilzAstarNode;
        version: number;
        links: Array<any>;
        constructor(x: number, y: number);
        toString(): string;
    }
}
declare module d5power {
    class BoneCharacter extends GameObject implements IGD {
        private _data;
        private _texture_data;
        private _texture;
        private _factory;
        private _onReady;
        private _onReady_obj;
        private _waitAction;
        private _targetPoint;
        private _faceAngle;
        constructor(map: IMap);
        run(t: number): void;
        move2Tile(tx: number, ty: number): void;
        setSkin(path: string, onReady: Function, thisobj: any): void;
        private setup();
        action: number;
        /**
         * 根据角度值修改角色的方向
         * @param   angle   角度
         */
        private faceAngle;
    }
}
declare module d5power {
    class FrameCharacter extends GameObject implements ISpriteSheetWaiter, IGD {
        private _sheet;
        loadID: number;
        private _action;
        private _dir;
        private _faceAngle;
        private _playFrame;
        private _lastTimer;
        private _data_renderTime;
        private _data_totalFrame;
        private _data_totalDir;
        protected _targetPoint: egret.Point;
        protected _offX: number;
        protected _offY: number;
        protected _skin: string;
        protected _plugin_list: Array<DisplayPluginData>;
        constructor(map: IMap);
        /**
         * 增加挂件
         */
        addDisplayPlugin(obj: egret.DisplayObject, offX?: number, offY?: number): void;
        /**
         * 移动到某一个Tile
         */
        move2Tile(tx: number, ty: number): void;
        dir: number;
        readonly monitor: egret.DisplayObject;
        action: number;
        setSkin(path: string): void;
        onSpriteSheepReady(data: IDisplayer): void;
        run(t: number): void;
        render(t: number): void;
        /**
         * 根据角度值修改角色的方向
         * @param   angle   角度
         */
        private faceAngle;
    }
}
declare module d5power {
    class D5Game {
        /**
         * 游戏中的每“米”对应程序中的像素值
         */
        static MI: number;
        /**
         * 游戏资源服务器，留空则为本地素材相对路径
         */
        static RES_SERVER: string;
        /**
         * 游戏资源的保存目录
         */
        static ASSET_PATH: string;
        static screenWidth: number;
        static screenHeight: number;
        static timer: number;
        static FPS: number;
    }
}
declare module d5power {
    class D5World {
        private _farLayer;
        private _groundLayer;
        private _lowLayer;
        private _middleLayer;
        private _topLayer;
        private _container;
        private _objList;
        private _intervalID;
        private _camera;
        private _map;
        private static _that;
        constructor(container: egret.DisplayObjectContainer, map: IMap, camera: Camera);
        start(): void;
        map: IMap;
        camera: Camera;
        addObject(obj: GameObject): void;
        protected run(): void;
    }
}
