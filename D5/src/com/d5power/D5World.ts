module d5power
{
    export class D5World
    {
        private _farLayer:egret.DisplayObjectContainer;
        private _groundLayer:egret.DisplayObjectContainer;
        private _lowLayer:egret.DisplayObjectContainer;
        private _middleLayer:egret.DisplayObjectContainer;
        private _topLayer:egret.DisplayObjectContainer;

        private _container:egret.DisplayObjectContainer;
        private _objList:Array<GameObject>;

        private _intervalID:number=-1;
        private _camera:Camera;
        private _map:IMap;

        private static _that:D5World;

        public constructor(container:egret.DisplayObjectContainer,map:IMap,camera:Camera)
        {
            D5World._that = this;

            this._objList = [];
            this._container = container;
            this._lastOrder = 0;

            this._farLayer = new egret.DisplayObjectContainer();
            this._groundLayer = new egret.DisplayObjectContainer();
            this._lowLayer = new egret.DisplayObjectContainer();
            this._middleLayer = new egret.DisplayObjectContainer();
            this._topLayer = new egret.DisplayObjectContainer();

            container.addChild(this._farLayer);
            container.addChild(this._groundLayer);
            container.addChild(this._lowLayer);
            container.addChild(this._middleLayer);
            container.addChild(this._topLayer);

            this.map = map;
            this.camera = camera;
        }

        public start():void
        {
            if(!this._map || !this._camera) return;
            if(this._intervalID!=-1) return;
            this._intervalID = setInterval(this.run,Math.floor(1000/D5Game.FPS))
        }

        public set map(map:IMap)
        {
            map.setContainer(this._groundLayer);
            this._map = map;
            this.start();
        }

        public set camera(camera:Camera)
        {
            this._camera = camera;

            this.start();
        }

        public addObject(obj:GameObject):void
        {
            if(this._objList.indexOf(obj)==-1) return;
            this._objList.push(obj);

            this._middleLayer.addChild(obj.monitor);
        }

        private _lastOrder:number;
        protected run()
        {
            var that:D5World = D5World._that;
            var t:number = egret.getTimer();

            var obj:GameObject;
            for(var i:number=that._objList.length-1;i>=0;i--){
                obj = that._objList[i];
                obj.run(t);
            }


            for(var i:number=that._objList.length-1;i>=0;i--){
                obj = that._objList[i];
                obj.render(t);
            }

            // 定期调增深度排序
            if(t-that._lastOrder>500)
            {
                that._objList.sort(this.deepSort);
				
				var orderCount:number = that._objList.length;
				// 交换层次对象
				var child:egret.DisplayObject;	// 场景对象
				var child_now:egret.DisplayObject;
                var _layer_go:egret.DisplayObjectContainer = that._middleLayer;
				while(orderCount--)
				{
					child_now = that._objList[orderCount].monitor;
					if(orderCount<_layer_go.numChildren)
					{
						child = _layer_go.getChildAt(orderCount);
						if(child!=child_now && _layer_go.contains(child_now))
						{
							_layer_go.setChildIndex(child_now,orderCount);
						}
					}
                }
                
                this._lastOrder = t;
            }
            
            that._camera.update();
            that._map.render();
        }

        private deepSort(orderA:GameObject,orderB:GameObject):number
        {
            return (orderA.posY-orderB.posY)*100+orderA.posX-orderB.posX;
        }
    }
}
