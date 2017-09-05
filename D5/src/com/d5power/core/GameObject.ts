module d5power
{
    export class GameObject implements IGD
    {
        protected _pos:egret.Point;

        protected _monitor:egret.DisplayObject;

        protected _map:IMap;

        public speed:number=3;

        public beFocus:boolean;

        public constructor(map:IMap)
        {
            this._pos = new egret.Point();
            this._map = map;
        }
        public get posX():number
        {
            return this._pos.x;
        }

        public get posY():number
        {
            return this._pos.y;
        }

        public get $pos():egret.Point
        {
            return this._pos;
        }

        public setPos(px:number,py:number):void
        {
            px = Math.ceil(px);
            py = Math.ceil(py);

            this._pos.x = px;
            this._pos.y = py;
        }

        public render(t:number):void
        {

        }

        public run(t:number):void
        {

        }

        

        public get monitor():egret.DisplayObject
        {
            return this._monitor;
        }

        protected updatePos(offX:number=0,offY:number=0):void
        {
            var tx:number = this._pos.x;
            var ty:number = this._pos.y;

            var wout:boolean = this._map.width>D5Game.screenWidth;
            var hout:boolean = this._map.height>D5Game.screenHeight;

            if(this.beFocus && wout && hout){
            // 地图比屏幕大，需要卷动

                var tw:number = wout ? D5Game.screenWidth : this._map.width;
                var th:number = hout ? D5Game.screenHeight : this._map.height;

                tx = tx>this._map.width-(tw>>1) ? tx-(this._map.width-tw) : tx;
                ty = ty>this._map.height-(th>>1) ? ty-(this._map.height-th) : ty;

                tx = tx>(tw>>1) && tx==this._pos.x ? (tw>>1) : tx;
                ty = ty>(th>>1) && ty==this._pos.y ? (th>>1) : ty;
            }else{
                var target:egret.Point = this._map.getScreenPostion(tx,ty);
                tx = target.x;
                ty = target.y;
            }

            if(this._monitor==null) return;

            this._monitor.x = tx+offX;
            this._monitor.y = ty+offY;
        }
    }

}