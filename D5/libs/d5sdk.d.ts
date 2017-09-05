declare module d5power {
    class D5EffectSpriteSheet implements IDisplayer {
        /**
         * 最大允许回收对象池容量
         */
        static MAX_IN_JALE: number;
        /**
         * 正在使用中的对象
         */
        private static _pool_inuse;
        /**
         * 待重用的对象
         */
        private static _pool_jale;
        /**
         * 加载id
         */
        private loadID;
        /**
         * 连接数量，此对象的引用计数
         */
        private _link;
        /**
         * 资源名
         */
        private _name;
        /**
         * 纹理集
         * 针对多帧素材，如果为单张贴图，此属性为空
         */
        private _sheet;
        /**
         * 原始贴图
         */
        private _texture;
        /**
         * 多帧素材的uv配置
         */
        private _conf;
        /**
         * 渲染时间
         */
        private _renderTime;
        /**
         * 最大帧数
         */
        private _totalFrame;
        /**
         * 影子尺寸
         */
        private _shadowX;
        /**
         * 影子尺寸
         */
        private _shadowY;
        /**
         * 包含的方向数量
         */
        private _totalDirection;
        /**
         * 加载等待列表
         */
        private _waiterList;
        /**
         *
         */
        private _gX;
        /**
         *
         */
        private _gY;
        /**
         *
         */
        private _frameW;
        /**
         *
         */
        private _frameH;
        /**
         *
         */
        private _uvList;
        static getInstance(res: string, getObj: ISpriteSheetWaiter): D5EffectSpriteSheet;
        private static back2pool(data);
        constructor();
        readonly name: string;
        readonly renderTime: number;
        readonly totalFrame: number;
        readonly totalDirection: number;
        readonly shadowX: number;
        readonly shadowY: number;
        readonly gX: number;
        readonly gY: number;
        readonly uvList: Array<any>;
        readonly frameWidth: number;
        readonly frameHeight: number;
        addWaiter(waiter: ISpriteSheetWaiter): void;
        unlink(): void;
        setup(res: string): void;
        getTexture(dir: number, frame: number): egret.Texture;
        private onTextureComplete(data);
        private onConfigComplate(data);
        private onDataComplate(texture);
    }
}
declare function trace(...args: any[]): void;
declare module d5power {
    /**
     * 使用要求：必须使用getInstance获得实例，等待onSpriteSheepReady回叫，确保素材加载完毕。
     * 当不再使用时，需要使用unlink断开引用，对象将自动等待重用
     */
    class D5SpriteSheet implements IDisplayer {
        private static _unknow;
        static setupUnknow(res: string, ready?: Function, readyObj?: any): void;
        private static _shadow;
        static setupShadow(res: string, ready?: Function, readyObj?: any): void;
        static readonly shadow: egret.Texture;
        /**
         * 对象池最大容量
         * @type {number}
         */
        static MAX_IN_JALE: number;
        private static _pool_inuse;
        private static _pool_jale;
        private loadID;
        static getInstance(res: string, getObj: ISpriteSheetWaiter): D5SpriteSheet;
        private static back2pool(data);
        private _link;
        private _name;
        private _sheet;
        private _renderTime;
        private _totalFrame;
        private _shadowX;
        private _shadowY;
        private _totalDirection;
        private _waiterList;
        private _gX;
        private _gY;
        private _frameW;
        private _frameH;
        private _uvList;
        constructor();
        readonly name: string;
        readonly renderTime: number;
        readonly totalFrame: number;
        readonly totalDirection: number;
        readonly shadowX: number;
        readonly shadowY: number;
        readonly gX: number;
        readonly gY: number;
        readonly uvList: Array<any>;
        readonly frameWidth: number;
        readonly frameHeight: number;
        addWaiter(waiter: ISpriteSheetWaiter): void;
        setup(res: string): void;
        unlink(): void;
        private onTextureComplete(data);
        getTexture(dir: number, frame: number): egret.Texture;
        private onDataComplate(data);
    }
}
declare module d5power {
    interface IDisplayer {
        /**
         * 渲染

        render():void;
        /**
         * 更换素材

        change(f:string,onloaded:Function=null,frame:number=-1,framebak:Function=null):void;
        /**
         * 是否循环动作

        loop:void
        /**
         * 更换动作接口

        action:void;
        /**
         * 更换方向接口

        direction:void;
        
        /**
         * 获得位图显示对象

        monitor:egret.DisplayObject
        
        shadow:egret.Shape;
        
        renderDirection:number;
        
        effectDirection:number
        
        playFrame:number;
        
        totalFrame:number;
        /**
         * 重置播放帧数

        resetFrame():void;

        dispose();
         */
        getTexture(dir: number, frame: number): egret.Texture;
        setup(res: string): void;
        unlink(): void;
        name: string;
        renderTime: number;
        totalFrame: number;
        totalDirection: number;
        shadowX: number;
        shadowY: number;
        uvList: Array<any>;
        /**
         * 重心坐标X
         */
        gX: number;
        /**
         * 重心坐标Y
         */
        gY: number;
        /**
         * 帧宽
         */
        frameWidth: number;
        /**
         * 帧高
         */
        frameHeight: number;
    }
}
declare module d5power {
    interface ISpriteSheetWaiter {
        onSpriteSheepReady(data: IDisplayer): void;
        loadID: number;
    }
}
declare module d5power {
    interface IUserInfoContainer {
        addDisplayer(ui: IUserInfoDisplayer): void;
        removeDisplayer(ui: IUserInfoDisplayer): void;
        getPro(name: string): any;
    }
}
declare module d5power {
    interface IUserInfoDisplayer {
        update(): void;
    }
}
declare module d5power {
    /**
     * 用于处理UI素材的贴图数据
     * 本数据仅供D5BitmapUI使用
     * D5Rpg中的贴图数据直接调用Json中的uv对象，未进行结构化
     */
    class UVData {
        /**
         * 贴图的偏移坐标
         */
        offX: number;
        /**
         * 贴图的偏移坐标
         */
        offY: number;
        /**
         * 贴图宽度
         */
        width: number;
        /**
         * 贴图高度
         */
        height: number;
        /**
         * 贴图uv
         */
        u: number;
        /**
         * 贴图uv
         */
        v: number;
        /**
         * 素材宽度
         */
        w: number;
        /**
         * 素材高度
         */
        h: number;
        /**
         * 贴图的起始坐标
         */
        x: number;
        /**
         * 贴图的起始坐标
         */
        y: number;
        /**
         * 格式化数据
         */
        format(data: any): void;
    }
}
/**
 * Created by Administrator on 2015/4/22.
 */
declare module d5power {
    class D5UIResourceData {
        private static _resource;
        private static _resourceLib;
        static _typeLoop: number;
        static setup(path: string, callback: Function, thisobj: any): void;
        static setupResLib(bitmap: egret.Texture, config: any): void;
        static getData(name: string): D5UIResourceData;
        private _resList;
        private _name;
        buttonType: number;
        constructor();
        setupResource(sp: egret.SpriteSheet, name: string, uvData: Array<UVData>): void;
        getResource(id: number): egret.Texture;
        static addResource(id: number, texture: egret.Texture, name?: string): void;
    }
}
