module d5power
{
    export class GameObject implements IGD
    {
        protected _pos:egret.Point;

        protected _monitor:egret.DisplayObject;

        protected _map:IMap;

        /**
         * 面向方向
         */
        protected _faceAngle:number;
        
        /**
         * 移动方向
         */
        protected _movedir:number;

        protected _targetPoint:egret.Point;

        public speed:number=3;

        /**
         * 速度系数
         */
        protected _speedK:number = 1;

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

        /**
         * 根据角度值修改角色的方向
         * @param   angle   角度
         */
        protected set faceAngle(angle:number){
        }

        /**
         * 设置角色移动方向
         */
        public set moveDir(angle:number){
            this._movedir = angle;
        }

        /**
         * 沿某个方向移动的计算
         */
        protected moveWidthDir():boolean
        {
            var angle:number = GMath.R2A(this._movedir)+90;
            if(this._faceAngle!=angle)
            {
                this.faceAngle = angle;
            }

            var xisok:boolean=false;
            var yisok:boolean=false;

            var xspeed:number = this.speed*Math.cos(this._movedir)*this._speedK;
            var yspeed:number = this.speed*Math.sin(this._movedir)*this._speedK;


            if(this._targetPoint && Math.abs(this._pos.x-this._targetPoint.x)<=this.speed){
                xisok=true;
                xspeed=0;
            }

            if(this._targetPoint && Math.abs(this._pos.y-this._targetPoint.y)<=this.speed){
                yisok=true;
                yspeed=0;
            }

            this.setPos(this._pos.x+xspeed,this._pos.y+yspeed);
            if(xisok && yisok){
                return true;
            }else{
                return false;
            }
        }

        public get monitor():egret.DisplayObject
        {
            return this._monitor;
        }

        protected updatePos(offX:number=0,offY:number=0):void
        {
            var tx:number = this._pos.x;
            var ty:number = this._pos.y;

            

            if(this._map)
            {
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
            }
            
            if(this._monitor==null) return;

            this._monitor.x = tx+offX;
            this._monitor.y = ty+offY;
        }
    }

}