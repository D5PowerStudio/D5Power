module d5power
{
    export class BaseMap implements IMap
    {
        /**
         * 在二进制文件中，由于需要1个字节表示多个状态。因此采用大于0的值表示可通过
         * 在导入后进行了转义
         */
        private static BIN_ALPHA_VALUE:number = 2;
        private static BIN_CAN_VALUE:number = 1;
        private static BIN_NO_VALUE:number = 0;

        /**
         * 地砖池，用于地砖重用
         */
        private static _tilePool:Array<egret.Bitmap>=new Array<egret.Bitmap>();
        private static rebuildPool(num:number):void
        {
            if(BaseMap._tilePool.length>num)
            {
                while(BaseMap._tilePool.length>num) BaseMap._tilePool.pop();
            }else{
                while(BaseMap._tilePool.length<num) BaseMap._tilePool.push(new egret.Bitmap());
            }

            //console.log("[BaseMap] there are ",num,"tiles in pool.");
        }

        /**
         * 将地砖回收至地砖池
         * @param data 需要回收的地砖
         */
        private static back2pool(data:egret.Bitmap):void
        {
            if(BaseMap._tilePool.indexOf(data)==-1) BaseMap._tilePool.push(data);
            //console.log("[BaseMap] 1 tiles get home.there are ",BaseMap._tilePool.length,"tiles in pool.");
        }

        /**
         * 获取一个地砖
         */
        private static getTile():egret.Bitmap
        {
            var data:egret.Bitmap;
            data = BaseMap._tilePool.length ? BaseMap._tilePool.pop() : new egret.Bitmap();
            //console.log("[BaseMap] pop 1 tiles.there are ",BaseMap._tilePool.length,"tiles in pool.");
            data.texture=null;
            return data;
        }

        /**
         * 地图编号
         */
        protected _mapid:number;
        /**
         * 地图宽度
         */
        protected _mapWidth:number;
        /**
         * 地图高度
         */
        protected _mapHeight:number;
        /**
         * 地砖宽度
         */
        protected _tileW:number;
        /**
         * 地砖高度
         */
        protected _tileH:number;
        /**
         * 地图加载完成后的处理
         */
        protected _onReady:Function;
        /**
         * 地图准备完成后的处理目标对象
         */
        protected _onReadyThis:any;
        /**
         * 
         */
        protected _mapResource:any;
        /**
         * 区块文件格式
         */
        private _tileFormat:string='.jpg';
        /**
         * 临时点数据处理，用于输出
         */
        private _tempPoint:egret.Point;
        /**
         * 循环贴图
         */
        private _loopBg:egret.Texture;

        /**
         * 路点宽度
         */
        private _roadW:number = 60;
        /**
         * 路点高度
         */
        private _roadH:number = 30;

        /**
         * 小地图
         */
        protected _smallMap:egret.SpriteSheet;
        /**
         * 路点序列
         */
        private _roadArr:Array<any>;
        /**
         * 透视序列
         */
        private _alphaArr:Array<any>;

        /**
         * 显示区域区块数量x方向
         */
        protected _areaX:number;
        /**
         * 显示区域区块数量y方向
         */
        protected _areaY:number;
        /**
         * 当前渲染的起始区块x
         */
        protected _nowStartX:number=-1;
        /**
         * 当前渲染的起始区块y
         */
        protected _nowStartY:number=-1;
        /**
         * 当前屏幕正在渲染的坐标记录
         */
        private _posFlush:Array<any>;

        /**
         * 正常渲染层（与角色同层次）
         */
        protected _dbuffer:egret.DisplayObjectContainer;

        /**
         * 二叉堆优化的a*寻路
         */
        private _astar:SilzAstar;

        /**
         * 游戏对象管理器
         */
        private _gameObjectManager:IGameObjectManager;
        
        /**
         * 当前地图的配置
         */
        private _data:any;

        /**
         * 地图是否准备好
         */
        protected _isReady:boolean;

        /**
         * 
         * @param goManager 用来维护和管理地图场景中的各种游戏对象的管理器
         */
        public constructor(goManager:IGameObjectManager=null) {
            this._tempPoint = new egret.Point();
            this._gameObjectManager = goManager;
        }

        public get isReady():boolean
        {
            return this._isReady;
        }

        /**
         * 临时创建一个循环地砖的地图
         * @param id 地图编号
         * @param bg 循环地砖素材
         * @param callback 准备完成后的触发函数
         * @param thisobj 触发函数的对象引用
         * @param blockw 区块宽度
         * @param blockh 区块高度
         */
        public createLoop(id:number,bg:string,callback:Function,thisobj:any,blockw:number = 10,blockh:number=10):void
        {
            var that:BaseMap = this;
            this._isReady = false;
            RES.getResByUrl(bg,function(data:egret.Texture){
                
                that._mapid = id;
                that._tileW = data.textureWidth;
                that._tileH = data.textureHeight;
                that._mapHeight = this._tileH*blockh;
                that._mapWidth = this._tileW*blockw;
                that._onReady = callback;
                that._onReadyThis = thisobj;

                that._nowStartX = -1;
                that._nowStartY = -1;
                
                that._loopBg = data;
                
                that.reset();
                that.resize();


                this._isReady = true;
                if(callback) callback.apply(thisobj);
            },this);
        }

        /**
         * 进入一个地图
         * @param id 地图编号
         * @param callback 地图准备完成后的触发函数
         * @param thisobj 地图准备完成后的触发函数的处理对象
         */
        public enter(id:number,callback:Function,thisobj:any):void{

            var that:BaseMap = this;
            this._isReady = false;
            RES.getResByUrl(D5Game.RES_SERVER + D5Game.ASSET_PATH + "/tiles/" + id + "/mapconf.json", function(data:any){
                that._data = data;
                that.setup(
                    parseInt(data.id),
                    parseInt(data.mapW),
                    parseInt(data.mapH),
                    parseInt(data.tileX),
                    parseInt(data.tileY),
                    callback,
                    thisobj
                );
            }, this);
        }

        /**
         * 地图编号
         */
        public get id():number {
            return this._mapid;
        }

        /**
         * 设置主容器
         * @param container 主容器
         */
        public setContainer(container:egret.DisplayObjectContainer):void
        {
            if(container==this._dbuffer) return;
            if(this._dbuffer!=null)
            {
                this._dbuffer.removeChildren();
                if(this._dbuffer.parent) this._dbuffer.parent.removeChild(this._dbuffer);
            }
            this._dbuffer = container;

            if(this._dbuffer.stage==null)
            {
                var that:BaseMap = this;
                this._dbuffer.once(egret.Event.ADDED_TO_STAGE,function():void{
                    D5Game.screenWidth = that._dbuffer.stage.stageWidth;
                    D5Game.screenHeight = that._dbuffer.stage.stageHeight;
                },this);
            }else{
                D5Game.screenWidth = this._dbuffer.stage.stageWidth;
                D5Game.screenHeight = this._dbuffer.stage.stageHeight;
            }
        }
        /**
         * 设置区块格式
         * @param s 区块格式
         */
        public setTileFormat(s:string):void
        {
            if(s.substr(0,1)!='.') s = "."+s;
            this._tileFormat = s;
        }

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
        public setup(id:number, w:number, h:number, tw:number, th:number, onReady:Function, onReadyThis:any):void {
            this._isReady = false;
            this._mapid = id;
            this._mapHeight = h;
            this._mapWidth = w;
            this._tileW = tw;
            this._tileH = th;
            this._onReady = onReady;
            this._onReadyThis = onReadyThis;

            this._nowStartX = -1;
            this._nowStartY = -1;

            var that:BaseMap = this;
            var onSmallMapLoaded:Function = function (data:egret.Texture):void {
                that._smallMap = new egret.SpriteSheet(data);
                that.createSmallData(data.textureWidth,data.textureHeight);
                RES.getResByUrl(D5Game.RES_SERVER + D5Game.ASSET_PATH + '/tiles/' + that._mapid + '/roadmap.bin',that.setupRoad,that,RES.ResourceItem.TYPE_BIN);
            };

            RES.getResByUrl(D5Game.RES_SERVER + D5Game.ASSET_PATH + '/tiles/' + this._mapid + '/s.jpg', onSmallMapLoaded, this);
        }

        /**
         * 
         * @param smallW 
         * @param smallH 
         */
        protected createSmallData(smallW:number,smallH:number):void
        {
            var smallWidth:number = smallW/(this._mapWidth/this._tileW);
            var smallHeight:number = smallH/(this._mapHeight/this._tileH);
            var i:number;
            var l:number;
            for(l=0;l<this._mapWidth/this._tileW;l++)
            {
                for(i=0;i<this._mapHeight/this._tileH;i++)
                {
                    this._smallMap.createTexture('small' + l + '_' + i, i * smallWidth, l * smallHeight, smallWidth, smallHeight,0,0);
                }
            }
        }

        public get width():number {
            return this._mapWidth;
        }

        public get height():number {
            return this._mapHeight;
        }

        public get tileWidth():number {
            return this._tileW;
        }

        public get tileHeight():number {
            return this._tileH;
        }

        public get roadWidth():number
        {
            return this._roadW;
        }

        public get roadHeight():number
        {
            return this._roadH;
        }

        public render(flush:boolean = false):void {

            if(this.mod_buffer)
            {
                this.mod_buffer=false;
                this._dbuffer.cacheAsBitmap=true;
            }

            var startx:number = parseInt(<string><any>(Camera.zeroX / this._tileW));
            var starty:number = parseInt(<string><any>(Camera.zeroY / this._tileH));
            this.makeData(startx, starty, flush); // 只有在采用大地图背景的前提下才不断修正数据
            if (this._nowStartX == startx && this._nowStartY == starty && this._posFlush != null) {
                var zero_x:number = Camera.zeroX % this._tileW;
                var zero_y:number = Camera.zeroY % this._tileH;
                this._dbuffer.x = -zero_x;
                this._dbuffer.y = -zero_y;
            }
        }

        public resize():void
        {
            this._areaX = Math.ceil(D5Game.screenWidth / this._tileW) + 1;
            this._areaY = Math.ceil(D5Game.screenHeight / this._tileH) + 1;
            console.log("[D5Game] max tiles number ",this._areaX,this._areaY);
            BaseMap.rebuildPool(this._areaX*this._areaY+this._areaX+this._areaY);
        }

        /**
         * 重置地图数据
         */
        public resetRoad():void {
            this._roadArr = [];
            this._alphaArr = [];
            // 定义临时地图数据
            var h:number = Math.floor(this._mapHeight / this._roadH);
            var w:number = Math.floor(this._mapWidth / this._roadW);
            for (var y:number = 0; y < h; y++) {
                var arr:Array<number> = new Array<number>();
                var arr2:Array<number> = new Array<number>();
                for (var x:number = 0; x < w; x++) {
                    arr.push(0);
                    arr2.push(0);
                }
                this._roadArr.push(arr);
                this._alphaArr.push(arr2);
            }
        }

        /**
         * 设置地图数据
         * @param data
         */
        public setRoad(data:Array<Array<number>>):void
        {
            this._roadArr = data;
        }

        public isInAlphaArea(px:number,py:number):boolean
        {
            var tile: egret.Point = this.Postion2Tile(px,py);
            return this._alphaArr[tile.y] && this._alphaArr[tile.y][tile.x]==BaseMap.BIN_ALPHA_VALUE;
        }
        
        /**
         * 尝试寻找周围可以通过的位置
         * 进行若干次尝试，如果没有发现，则返回null，请注意容错判断
         */
        public getPointAround(center:egret.Point,from:egret.Point,r:number):egret.Point
        {
            if(!center || !from) return null;
            var i:number = 0;
            var max:number = 5;
            var step:number = Math.PI*2/max;
            var gotoP:egret.Point = new egret.Point();
            var angle:number = GMath.getPointAngle(center.x-from.x,center.y-from.y)+(Math.random()>.5 ? 1 : -1)*Math.PI/8;
            while(i<max)
            {
                var n:number = step*i+angle;
                gotoP.x = Math.round(center.x-r*Math.cos(n));
                gotoP.y = Math.round(center.y-r*Math.sin(n));
                if(this.PointCanMove(gotoP,from))
                {
                    return gotoP;
                }
                i++;
            }

            return null;
        }

        public PointCanMove(p:egret.Point,n:egret.Point):Boolean
        {
            if(this._astar==null) return true;
            var nodeArr:Array<any> = this._astar.find(n.x,n.y,p.x,p.y);
            return nodeArr!=null;
        }


        public getRoadPass(px:number,py:number):boolean
        {
            if(this._roadArr[py]==null || this._roadArr[py][px]!=0) return false;
            return true;
        }

        public findPath(fromx:number,fromy:number,tox:number,toy:number):Array<any>
        {
            return this._astar==null ? null : this._astar.find(fromx,fromy,tox,toy);
        }



        /**
         * 根据屏幕某点坐标获取其在世界（全地图）内的坐标
         */
        public getWorldPostion(x:number, y:number):egret.Point {
            this._tempPoint.x = Camera.zeroX + x;
            this._tempPoint.y = Camera.zeroY + y;

            return this._tempPoint;
        }

        /**
         * 根据世界坐标获取在屏幕内的坐标
         */
        public getScreenPostion(x:number, y:number):egret.Point {
            this._tempPoint.x = x - Camera.zeroX;
            this._tempPoint.y = y - Camera.zeroY;
            return this._tempPoint;
        }

        /**
         * 根据路点获得世界（全地图）内的坐标
         */
        public tile2WorldPostion(x:number, y:number):egret.Point {
            this._tempPoint.x = x * this._roadW + this._roadW * .5;
            this._tempPoint.y = y * this._roadH + this._roadH * .5;
            return this._tempPoint;
        }

        /**
         * 世界地图到路点的转换
         */
        public Postion2Tile(px:number, py:number):egret.Point {
            this._tempPoint.x = Math.floor(px / this._roadW);
            this._tempPoint.y = Math.floor(py / this._roadH);
            return this._tempPoint;
        }

        public reset():void
        {
            this._tempPoint = new egret.Point();
            this._mapResource = {tiles: new Object()};
            if(this._dbuffer) this._dbuffer.removeChildren();
            
//            this._tiledResource = {};
        }

        /**
         * 设置路点。至此，地图准备完毕，通知主程序开始渲染
         * @param data
         */
        private setupRoad(res:ArrayBuffer):void {

            if(res==null || res==undefined)
            {
                this.resetRoad();
            }else {
                var data:egret.ByteArray = new egret.ByteArray(res);

                var sign:string = data.readUTFBytes(5);
                var value:number;
                
                var px: number = 0;
                var py: number = 0;
                
                if (sign == 'D5Map') {
                    py = data.readShort();
                    px = data.readShort();

                    var resmap:Array<any> = [];
                    for (var y:number = 0; y < py; y++) {
                        var temp:Array<number> = [];
                        for (var x:number = 0; x < px; x++) {
                            temp.push(data.readByte());
                        }
                        resmap.push(temp);
                    }


                    this.resetRoad();
                    
                    if(px > 1) {
                        var h: number = Math.floor(this._mapHeight / this._roadH);
                        var w: number = Math.floor(this._mapWidth / this._roadW);

                        var k: number = w == px && h == py ? 1 : py/h;

                        for(y = 0;y < h;y++) {
                            for(x = 0;x < w;x++) {
                                try {
                                    py = Math.floor(y * k);
                                    px = Math.floor(x * k);
                                    value = resmap[py][px];
                                    this._roadArr[y][x] = value == BaseMap.BIN_NO_VALUE ? 1 : 0;
                                    this._alphaArr[y][x] = value;
                                } catch(e) {
                                    trace("［BaseMap］路点超出范围Y:X(" + y + ":" + x + ")",py,px);
                                    this._roadArr[y][x] = BaseMap.BIN_NO_VALUE;
                                    this._alphaArr[y][x] = BaseMap.BIN_NO_VALUE;
                                }
                            }
                        }
                    }
                } else {
                    console.log("[BaseMap]非法的地图配置文件");
                }
            }

            this.reset();
            this.resize();


            this._astar = new SilzAstar(this._roadArr);

            var length:number = this._data && this._data.npc ? this._data.npc.length : 0;
            if(this._gameObjectManager!=null)
            {
                for(var i:number = 0;i < length;i++) {
                    var npconf:NPConf = new NPConf();
                    npconf.format(this._data.npc[i]);
                    this._gameObjectManager.addNPC(npconf);
                }
            }
            
            this._isReady = true;
            if (this._onReady != null) {
                this._onReady.apply(this._onReadyThis);
            }


        }

        protected makeData(startx:number, starty:number, flush:boolean):void
        {
            if (this._nowStartX == startx && this._nowStartY == starty) return;

            this._nowStartX = startx;
            this._nowStartY = starty;

            this._posFlush=[];
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
                    } else if(this._mapResource.tiles[key]==null){
                        if(this._loopBg)
                        {
                            this.fillTile((x-this._nowStartX),(y-this._nowStartY),this._loopBg);
                        }else{
                            this._posFlush.push(y + '_' + x + '_' +this._nowStartX + '_' +this._nowStartY + '_' +this._mapid);
                            this.fillSmallMap(y, x,(x-this._nowStartX),(y-this._nowStartY));
                        }
                        
                    }else{
                        this.fillTile((x-this._nowStartX),(y-this._nowStartY),this._mapResource.tiles[key]);
                    }
                }
            }

            if(this._loopBg==null) this.loadTiles();
        }

        public clear():void
        {
            this._mapResource = {tiles: new Object()};
            var loop:egret.Bitmap;
            while(this._dbuffer.numChildren)
            {
                loop = <egret.Bitmap><any>this._dbuffer.removeChildAt(0);
                loop.texture=null;
                BaseMap.back2pool(loop);
            }

            this._nowName = '';
            this. _tileFormat = '.jpg';
        }

        private _nowName='';
        private loadTiles(data:egret.Texture=null):void
        {
            if(data!=null)
            {
                var pos:Array<any> = this._nowName.split('_');
                if(parseInt(pos[4])!=this._mapid)
                {
                    console.log("[BaseMap] 读取了已切换了的地图资源");
                    return;
                }
                var tileName:string = pos[0]+"_"+pos[1];
                if(this._mapResource.tiles[tileName]==null) this._mapResource.tiles[tileName] = data;

                // 若加载后位置已变更，则只存储不渲染
                var tx:number = parseInt(pos[1]) - this._nowStartX;
                var ty:number = parseInt(pos[0]) - this._nowStartY;
                if(parseInt(pos[2])==this._nowStartX && parseInt(pos[3])==this._nowStartY) {
                    this.fillTile(tx,ty,data);
                }

                this._nowName='';
            }

            if (this._posFlush.length == 0) {
                this._dbuffer.cacheAsBitmap=false;
                this.mod_buffer=true;
            } else if (this._nowName == '') {
                this._nowName = this._posFlush.pop();
                var pos:Array<any> = this._nowName.split('_');
                var name:string = D5Game.RES_SERVER + D5Game.ASSET_PATH + "/tiles/" + this._mapid + "/" + pos[0] + "_" + pos[1] + this._tileFormat;
                RES.getResByUrl(name, this.loadTiles, this);
            }
        }

        private mod_buffer:boolean;
        protected fillTile(tx:number,ty:number,data:egret.Texture):void
        {
            var bitmap: egret.Bitmap = <egret.Bitmap><any>this._dbuffer.getChildByName(tx + "_" + ty);
            if(bitmap==null)
            {
                bitmap = BaseMap.getTile();
                bitmap.x = tx * this._tileW;
                bitmap.y = ty * this._tileH;
                bitmap.name = tx+"_"+ty;
                this._dbuffer.addChild(bitmap);
            }
            bitmap.texture = data;
        }

        /**
         * 绘制小地图
         */
        private fillSmallMap(startX:number,startY:number,tx:number,ty:number):void
        {
            if(this._smallMap)
            {
                var data:egret.Texture = this._smallMap.getTexture('small'+startX+'_'+startY);
                var bitmap: egret.Bitmap = <egret.Bitmap><any>this._dbuffer.getChildByName(tx + "_" + ty);
                if(bitmap==null)
                {
                    bitmap = BaseMap.getTile();
                    bitmap.x = tx * this._tileW;
                    bitmap.y = ty * this._tileH;
                    bitmap.fillMode = egret.BitmapFillMode.SCALE;
                    bitmap.name = tx+"_"+ty;
                    this._dbuffer.addChild(bitmap);
                }
                bitmap.texture = data;
                bitmap.width = this._tileW;
                bitmap.height = this._tileH;
                this._dbuffer.cacheAsBitmap=true;
            }
            
        }
    }
}