module d5power
{
    export class RandMapConfig
    {
        public id:number;
        public w:number;
        public h:number;
        public tw:number;
        public th:number;
        public birthX:number;
        public birthY:number;
        public data:any;
        
    }
    
    export class BaseRandMap extends BaseMap
    {
        private _mapsnap:egret.Texture;
        private _tileResource:any;
        private _itemConf:Map<number,Array<RandMapItem>>;
        private _birthX:number;
        private _birthY:number;

        public constructor(goManager:IGameObjectManager=null)
        {
            super(goManager);
            this._tileResource = {};

        }

        public setTileResource(id:number,texture:egret.Texture):void
        {
            this._tileResource[id] = texture;
        }

        public setup(id:number,w:number=800, h:number=800, tw:number=64, th:number=64, onReady:Function=null, onReadyThis:any=null):void
        {
            throw new Error("[BaseRandMap] Can not support setup mode.please build map with generate function.Or you can use BaseMap");
        }

        public createLoop(id:number,bg:string,callback:Function,thisobj:any,blockw:number = 10,blockh:number=10):void
        {
            throw new Error("[BaseRandMap] Can not support setup mode.please build map with generate function.Or you can use BaseMap");
        }

        public get data():RandMapConfig
        {
            var data:RandMapConfig = new RandMapConfig();
            data.id = this._mapid;
            data.w = this._mapWidth;
            data.h = this._mapHeight;
            data.tw = this._tileW;
            data.th = this._tileH;
            data.birthX = this._birthX;
            data.birthY = this._birthY;
            data.data = D5RandMapGen.map.getObj();

            return data;
        }

        /**
         * 从现有的地图配置文件生成地图
         * @param obj           地图配置
         * @param onReady       地图生成完毕后的触发函数
         * @param onReadyThis 
         */
        public format(obj:RandMapConfig,onReady:Function,onReadyThis:any):void
        {
            d5power.D5RandMapGen.format(obj.data,function():void{
                if(D5RandMapGen.map==null || D5RandMapGen.mapsnap==null)
                {
                    throw new Error("[BaseRandMap] Please make map data first by D5RandMapGen.format function.");
                }
                this._mapsnap = D5RandMapGen.mapsnap;

                this._mapid = obj.id;
                this._mapWidth = obj.w;
                this._mapHeight = obj.h;
                this._tileW = obj.tw;
                this._tileH = obj.th;
                this._onReady = onReady;
                this._onReadyThis = onReadyThis;

                // 初始化贴图库
                this.buildTileRes();

                this._posFlush=[];
                if (this._onReady != null) {
                    var p:egret.Point = new egret.Point();
                    p.x = obj.birthX;
                    p.y = obj.birthY;
                    this._onReady.apply(this._onReadyThis,[p]);
                }

                this._smallMap = new egret.SpriteSheet(this._mapsnap);
                this.createSmallData(this._mapsnap.textureWidth,this._mapsnap.textureHeight);

                this.resize();

            },this);
        }

        /**
         * 生成一个全新的地图
         * @param id            地图编号
         * @param onReady       地图生成完毕后的触发函数
         * @param onReadyThis   
         * @param w             地图横向区块数
         * @param h             地图纵向区块数
         * @param tw            区块宽度
         * @param th            区块高度
         */
        public generate(id:number,onReady:Function, onReadyThis:any,w:number=800, h:number=800, tw:number=128, th:number=128):void
        {
            
            d5power.D5RandMapGen.generate(w,h,function(){
                if(D5RandMapGen.map==null || D5RandMapGen.mapsnap==null)
                {
                    throw new Error("[BaseRandMap] Please make map data first by D5RandMapGen.generate function.");
                }
                this._mapsnap = D5RandMapGen.mapsnap;

                this._mapid = id;
                this._mapWidth = D5RandMapGen.mapW*tw;
                this._mapHeight = D5RandMapGen.mapH*th;
                this._tileW = tw;
                this._tileH = th;
                this._onReady = onReady;
                this._onReadyThis = onReadyThis;

                // 初始化贴图库
                this.buildTileRes();

                this._nowStartX = -1;
                this._nowStartY = -1;

                this._smallMap = new egret.SpriteSheet(this._mapsnap);
                this.createSmallData(this._mapsnap.textureWidth,this._mapsnap.textureHeight);

                // BaseMap正常渲染必须使此属性不为空。在随机地图中本数字无需使用，但为了兼容BaseMap，还是进行初始化
                this._posFlush=[];
                if (this._onReady != null) {
                    var p:egret.Point = d5power.D5RandMapGen.map.getBorn();
                    p.x = p.x*tw;
                    p.y = p.y*th;

                    this._birthX = p.x;
                    this._birthY = p.y;
                    this._onReady.apply(this._onReadyThis,[p]);
                }

                this.resize();

            },this);
        }

        /**
         * 获取某点坐标的贴图
         */
        public getTileTexture(px:number,py:number):egret.Texture
        {
            var type:number = D5RandMapGen.map.getFloorTypeByArea(px,py);
            return this._tileResource[type];
        }

        protected buildTileRes():void
        {
            var color:number;
            
            for(var i:number=0,j:number=RandMap._fixFloorTypes.length;i<j;i++)
            {
                if(this._tileResource[color]) continue;
                color = RandMap._fixFloorTypes[i];
                var texture:egret.RenderTexture = new egret.RenderTexture();
                var s:egret.Shape = new egret.Shape();
                s.graphics.beginFill(color);
                s.graphics.drawRect(0,0,this._tileW,this._tileH);
                s.graphics.endFill();
                texture.drawToTexture(s);
                s.graphics.clear();

                this._tileResource[color] = texture;
            }
        }

        protected makeData(startx:number,starty:number,flush:boolean):void
        {
            if (this._nowStartX == startx && this._nowStartY == starty) return;

            this._nowStartX = startx;
            this._nowStartY = starty;

            for(var i:number=0,j:number=this._dbuffer.numChildren;i<j;i++)
            {
                (<egret.Bitmap><any>this._dbuffer.getChildAt(i)).texture=null;
            }
            //this.fillSmallMap(startx, starty);

            var maxY:number = Math.min(starty + this._areaY, Math.floor(this._mapHeight / this._tileH));
            var maxX:number = Math.min(startx + this._areaX, Math.floor(this._mapWidth / this._tileW));

            var key:string;
            for (var y:number = starty; y < maxY; y++) {
                for (var x:number = startx; x < maxX; x++) {
                    key = y + '_' + x;
                    if (x < 0 || y < 0) {
                        continue;
                    } else {
                        this.fillTile((x-this._nowStartX),(y-this._nowStartY),this.getTileTexture(x,y));
                    }
                }
            }
        }
    }
}