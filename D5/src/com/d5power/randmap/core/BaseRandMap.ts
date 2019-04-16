module d5power
{
    export class BaseRandMap extends BaseMap
    {
        private _mapsnap:egret.Texture;
        private _tileResource:any;

        public constructor(goManager:IGameObjectManager=null)
        {
            super(goManager);
        }

        public setup(id:number,w:number=800, h:number=800, tw:number=64, th:number=64, onReady:Function=null, onReadyThis:any=null):void
        {
            throw new Error("[BaseRandMap] Can not support setup mode.please build map with generate function.Or you can use BaseMap");
        }

        public createLoop(id:number,bg:string,callback:Function,thisobj:any,blockw:number = 10,blockh:number=10):void
        {
            throw new Error("[BaseRandMap] Can not support setup mode.please build map with generate function.Or you can use BaseMap");
        }

        public generate(id:number,onReady:Function, onReadyThis,w:number=800, h:number=800, tw:number=128, th:number=128):void
        {
            
            d5power.D5RandMapGen.generate(w,h,function(){
                if(D5RandMapGen.map==null || D5RandMapGen.mapsnap==null)
                {
                    throw new Error("[BaseRandMap] Please make map data first by D5RandMapGen.generate function.");
                }
                this._mapsnap = D5RandMapGen.mapsnap;

                // 初始化贴图库
                var color:number;
                this._tileResource = {};

                for(var i:number=0,j:number=RandMap._fixFloorTypes.length;i<j;i++)
                {
                    color = RandMap._fixFloorTypes[i];
                    var texture:egret.RenderTexture = new egret.RenderTexture();
                    var s:egret.Shape = new egret.Shape();
                    s.graphics.beginFill(color);
                    s.graphics.drawRect(0,0,tw,th);
                    s.graphics.endFill();
                    texture.drawToTexture(s);
                    s.graphics.clear();

                    this._tileResource[color] = texture;
                }

                this._mapid = id;
                this._mapHeight = D5RandMapGen.mapW*tw;
                this._mapWidth = D5RandMapGen.mapH*th;
                this._tileW = tw;
                this._tileH = th;
                this._onReady = onReady;
                this._onReadyThis = onReadyThis;

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