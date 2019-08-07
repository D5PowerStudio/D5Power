module d5power
{
    /**
     * 随机地图产生器
     */
    export class D5RandMapGen
    {
        private static _map:RandMap;
        private static _mapsnap:egret.Texture;
        private static _mapW:number;
        private static _mapH:number;

        /**
         * 地图区块宽
         */
        public static get mapW():number
        {
            return this._mapW;
        }

        /**
         * 地图区块高
         */
        public static get mapH():number
        {
            return this._mapH;
        }

        /**
         * 地图截图
         */
        public static get mapsnap():egret.Texture
        {
            return this._mapsnap;
        }

        /**
         * 地图数据
         */
        public static get map():RandMap
        {
            return this._map;
        }

        public static format(obj:any,callback:Function,thisObj:any):void
        {
            var t:number = egret.getTimer();
            var map:RandMap = new RandMap();
            map.format(obj);
            D5RandMapGen.buildSnap(map);
            trace("Rebuild map success,cost:"+(egret.getTimer()-t)+'ms');
            D5RandMapGen._map = map;
            if(callback!=null) callback.apply(thisObj);


        }

        /**
         * 产生地图
         * @param   sizeW   地图宽度
         * @param   sizeH   地图高度
         * @param   callback    产生完毕后的响应函数
         * @param   thisObj     this
         */
        public static generate(sizeW:number,sizeH:number,callback:Function,thisObj:any):void
        {
            this._mapW = sizeW;
            this._mapH = sizeH;


            var makeMap:Function = function(){
                var t:number = egret.getTimer();
                var map:RandMap = new RandMap();

                var points:Array<number> = RandomPointUtil.getRandomPoints(sizeW,sizeH,10,1000);
                var lloy:RandMapUtil = new RandMapUtil(points,sizeW,sizeH);
                lloy.delaunay();
                try{
                    lloy.voronoi();
                }catch(e){
                    makeMap();
                    return;
                }
                
                if(!lloy.optimization(makeMap)) return;

                var nosie:any = PerlinNoiseUtil.noise2D(500,500);
                map.initData(lloy.getPolgons(),sizeW,sizeH);//初始化地图数据
                map.adjustCoast(0.58,nosie);//优化海岸线
                map.initArea();//初始化区域
                map.checkTerrain();//检测地形
                map.amendLake(6,8);//修正湖泊
                //检查陆地?区分大陆块和岛屿
                //修正岛屿?如果有业务的需要才需要修正岛屿
                map.initAltitude(5,8,2);//创建海拔图（每快陆地都应该有自己的海拔）
                map.initRiver(1,1,5,8,10);//创建河流
                map.initHumidity();//修正降水量
                map.buildLand();//修正地图的地形为最终地形
                map.amendOasis(3);//增加绿洲

                D5RandMapGen.buildSnap(map);

                trace("Create map success,cost:"+(egret.getTimer()-t)+'ms');
                D5RandMapGen._map = map;
                if(callback!=null) callback.apply(thisObj);
            }

            makeMap();
        }

        private static buildSnap(map:RandMap):void
        {
            var smap:egret.Shape = map.getMapBaseTextture(RandMapConf.SMAP_W,RandMapConf.SMAP_H);
            var ttr:egret.RenderTexture = new egret.RenderTexture();
            ttr.drawToTexture(smap);
            map.baseMap = ttr;
            var river:egret.Shape = map.getRiverTextture(RandMapConf.SMAP_W,RandMapConf.SMAP_H);
            ttr = new egret.RenderTexture();
            ttr.drawToTexture(river);
            map.riverMap = ttr;

            var box:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            box.addChild(smap);
            box.addChild(river);

            if(D5RandMapGen._mapsnap==null) D5RandMapGen._mapsnap = new egret.RenderTexture();

            (<egret.RenderTexture>D5RandMapGen._mapsnap).drawToTexture(box);
        }
    }
}