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
    /**
     * 三元数据
     */
    class ThreeBase {
        /**
         * 三元数据的含义
         */
        type: number;
        /**
         * 三元数据的数据根
         */
        key: string;
        /**
         * 三元数据的数据量
         */
        count: number;
    }
}
declare module d5power {
    /**
     * 地图中的NPC配置
     */
    class NPConf {
        /**
         * NPC编号
         */
        id: number;
        /**
         * NPC在当前地图的名字
         */
        name: string;
        /**
         * NPC位置x
         */
        posx: number;
        /**
         * NPC位置y
         */
        posy: number;
        /**
         * NPC对话设置
         */
        say: string;
        /**
         * NPC可执行的脚本
         */
        script: string;
        /**
         * NPC特殊功能
         */
        job: ThreeBase;
        format(obj: any): void;
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
    class ItemData {
        id: number;
        name: string;
        info: string;
        buy: number;
        sale: number;
        /**
         * 是否可叠加
         */
        canAdd: boolean;
        constructor();
        format(obj: any): void;
    }
}
declare module d5power {
    class MissionNR {
        /**
         * 系统保存的处理模式
         */
        static SAVE_KEY: number;
        /**
         * 需求与奖励分割线
         */
        static N_R_LINE: number;
        /**
         * 杀死怪物
         */
        static N_MONSTER_KILLED: number;
        /**
         * 拥有物品（不扣除）
         */
        static N_ITEM_TACKED: number;
        /**
         * 拥有物品（扣除）
         */
        static N_ITEM_NEED: number;
        /**
         * 拥有任务
         */
        static N_MISSION: number;
        /**
         * 玩家属性
         */
        static N_PLAYER_PROP: number;
        /**
         * 与NPC对话
         */
        static N_TALK_NPC: number;
        /**
         * 需要技能
         */
        static N_SKILL_LV: number;
        /**
         * 需要主角皮肤
         */
        static N_SKIN: number;
        /**
         * 需要装备某类型道具
         */
        /**
         * 需要装备某个特定道具
         */
        static N_EQU: number;
        /**
         * 需要学会技能
         */
        static N_SKILL: number;
        /**
         * 需要增益
         */
        static N_BUFF: number;
        /**
         *需要游戏币
         */
        static N_MONEY: number;
        /**
         *需要标记
         */
        static N_MARK: number;
        /**
         *拥有游戏币
         */
        static N_MONEY_KEEP: number;
        /**
         * 奖励道具
         */
        static R_ITEM: number;
        /**
         * 奖励游戏币
         */
        static R_MONEY: number;
        /**
         * 奖励经验
         */
        static R_EXP: number;
        /**
         * 奖励任务
         */
        static R_MISSION: number;
        /**
         * 奖励属性
         */
        static R_PLAYER_PROP: number;
        /**
         * 获得技能
         */
        static R_SKILL: number;
        private static COSTOM_DEFINE;
        constructor();
        /**
         * 增加用户处理配置
         */
        static addCostomDefine(data: ThreeBase): boolean;
        static getChinese(id?: number): string;
    }
}
declare module d5power {
    /**
     * 背包道具映射
     */
    class PackageItemData {
        /**
         * 道具id
         */
        itemid: number;
        /**
         * 道具数量
         */
        number: number;
        /**
         * 背包id
         */
        packageid: number;
        constructor();
    }
}
declare module d5power {
    /**
     * 单个任务数据
     */
    class MissionData {
        /**
         * 承接类任务 ！
         */
        static TYPE_GET: number;
        /**
         * 交付类任务 ？
         */
        static TYPE_COMPLATE: number;
        type: number;
        /**
         * 任务ID
         */
        id: number;
        /**
         * 任务名
         */
        name: string;
        /**
         * 任务内容
         */
        info: string;
        /**
         * NPC对话内容
         */
        npc_said: string;
        /**
         * 未完成任务的对话
         */
        uncompDialog: string;
        /**
         * 相关NPC
         */
        npc_id: number;
        /**
         * 是否完成
         */
        iscomplate: boolean;
        /**
         * 任务完成后脚本
         */
        complate_script: string;
        /**
         * 任务需求
         */
        need: Array<ThreeBase>;
        /**
         * 任务奖励
         */
        give: Array<ThreeBase>;
        constructor(id: number);
        formatFromJSON(data: any): void;
        readonly needstring: string;
        /**
         * 任务是否完成
         */
        readonly isComplate: boolean;
        /**
         * 增加完成条件
         */
        addNeed(need: ThreeBase): void;
        /**
         * 增加奖励内容
         */
        addGive(give: ThreeBase): void;
        /**
         * 检查当前任务是否完成
         */
        check(checker: IMissionManager): boolean;
        /**
         * 完成任务
         */
        complate(checker: IMissionManager): boolean;
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
        /**
         * 地砖池，用于地砖重用
         */
        private static _tilePool;
        private static rebuildPool(num);
        /**
         * 将地砖回收至地砖池
         * @param data 需要回收的地砖
         */
        private static back2pool(data);
        /**
         * 获取一个地砖
         */
        private static getTile();
        /**
         * 地图编号
         */
        private _mapid;
        /**
         * 地图宽度
         */
        private _mapWidth;
        /**
         * 地图高度
         */
        private _mapHeight;
        /**
         * 地砖宽度
         */
        private _tileW;
        /**
         * 地砖高度
         */
        private _tileH;
        /**
         * 地图加载完成后的处理
         */
        private _onReady;
        /**
         * 地图准备完成后的处理目标对象
         */
        private _onReadyThis;
        /**
         *
         */
        private _mapResource;
        /**
         * 区块文件格式
         */
        private _tileFormat;
        /**
         * 临时点数据处理，用于输出
         */
        private _tempPoint;
        /**
         * 循环贴图
         */
        private _loopBg;
        /**
         * 路点宽度
         */
        private _roadW;
        /**
         * 路点高度
         */
        private _roadH;
        /**
         * 小地图
         */
        private _smallMap;
        /**
         * 路点序列
         */
        private _roadArr;
        /**
         * 透视序列
         */
        private _alphaArr;
        /**
         * 显示区域区块数量x方向
         */
        private _areaX;
        /**
         * 显示区域区块数量y方向
         */
        private _areaY;
        /**
         * 当前渲染的起始区块x
         */
        private _nowStartX;
        /**
         * 当前渲染的起始区块y
         */
        private _nowStartY;
        /**
         * 当前屏幕正在渲染的坐标记录
         */
        private _posFlush;
        /**
         * 正常渲染层（与角色同层次）
         */
        private _dbuffer;
        /**
         * 二叉堆优化的a*寻路
         */
        private _astar;
        /**
         * 游戏对象管理器
         */
        private _gameObjectManager;
        /**
         * 当前地图的配置
         */
        private _data;
        constructor();
        /**
         * 临时创建一个循环地砖的地图
         * @param id 地图编号
         * @param bg 循环地砖素材
         * @param callback 准备完成后的触发函数
         * @param thisobj 触发函数的对象引用
         * @param blockw 区块宽度
         * @param blockh 区块高度
         */
        createLoop(id: number, bg: string, callback: Function, thisobj: any, blockw?: number, blockh?: number): void;
        /**
         * 进入一个地图
         * @param id 地图编号
         * @param callback 地图准备完成后的触发函数
         * @param thisobj 地图准备完成后的触发函数的处理对象
         */
        enter(id: number, callback: Function, thisobj: any): void;
        /**
         * 地图编号
         */
        readonly id: number;
        /**
         * 设置主容器
         * @param container 主容器
         */
        setContainer(container: egret.DisplayObjectContainer): void;
        /**
         * 设置区块格式
         * @param s 区块格式
         */
        setTileFormat(s: string): void;
        /**
         * 构建一个新的地图
         * @param id 地图编号
         * @param w 地图尺寸宽
         * @param h 地图尺寸高
         * @param tw 区块尺寸高
         * @param th 区块尺寸宽
         * @param onReady 地图准备完成后的回叫函数
         * @param onReadyThis this
         */
        setup(id: number, w: number, h: number, tw: number, th: number, onReady: Function, onReadyThis: any): void;
        /**
         *
         * @param smallW
         * @param smallH
         */
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
    interface IMissionManager {
        /**
         * 获得任务
         */
        addMission(id: number): boolean;
        /**
         * 删除任务
         */
        deleteMission(data: MissionData): boolean;
        /**
         * 自定义条件检测
         */
        custormCheck(data: ThreeBase): boolean;
        /**
         * 是否具备某个条件的独立检查器
         */
        hasChecker(type: number): boolean;
        /**
         * 是否具备某个任务
         */
        hasMission(id: number): boolean;
        /**
         * 检查某物品数量
         */
        hasItemNum(itemid: number): number;
        /**
         * 检查时否拥有特定数量的游戏币
         */
        hasMoney(value: number): boolean;
        /**
         * 检查是否拥有某个标记
         */
        hasMark(id: number): boolean;
        /**
         * 是否和某NPC对话过
         */
        hasTalkedWith(npcid: number): boolean;
        /**
         * 杀死怪物数量
         */
        killMonseterNum(monsterid: number): number;
        /**
         * 玩家属性达到
         */
        userPro(pro_name: string, value: number): boolean;
        /**
         * 得到某物品
         */
        getItem(itemid: number, num: number): boolean;
        /**
         * 获得经验
         */
        getExp(num: number): void;
        /**
         * 获得某个任务
         */
        addMissionById(id: number): void;
        /**
         * 获得游戏币
         */
        getMoney(num: number): boolean;
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
    interface IGameObjectManager {
        addNPC(data: NPConf): any;
    }
}
declare module d5power {
    /**
     * 玩家数据
     */
    class PlayerData {
        /**
         * 玩家id
         */
        uid: number;
        /**
         * 任务列表
         */
        private _missionList;
        /**
         * 背包
         */
        private _itemList;
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
