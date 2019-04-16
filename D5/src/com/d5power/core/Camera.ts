module d5power
{
    export class Camera
    {
        public static zeroX:number = 0;
        public static zeroY:number = 0;

        /**
         * 分布渲染时间限制。每次渲染的最大允许占用时间，单位毫秒
         */
        public static RenderMaxTime:number = 10;

        /**
         * 摄像机可视区域
         */
        private static _cameraView:egret.Rectangle;

        /**
         * 是否需要重新裁剪
         */
        public static $needreCut:boolean;

        private _cameraCutView:egret.Rectangle;

        private _zorderSpeed:number = 600;
        /**
         * 镜头注视
         */
        public _focus:IGD;

        public _timer:egret.Timer;

        public _moveSpeed:number=1;

        private _moveStart:egret.Point;
        private _moveEnd:egret.Point;
        private _moveAngle:number = 0;
        private _moveCallBack:Function;

        private _map:IMap;

        public static get needreCut():boolean {
            return Camera.$needreCut;
        }

        public constructor(map:IMap) {
            if (Camera._cameraView == null) Camera._cameraView = new egret.Rectangle();
            this._cameraCutView = new egret.Rectangle();

            this._map = map;
        }

        public setZero(x:number, y:number):void {

            x = Math.ceil(x);
            y = Math.ceil(y);

            Camera.zeroX = x;
            Camera.zeroY = y;

            var value:number = this._map.width - D5Game.screenWidth;
            Camera.zeroX = Camera.zeroX < 0 ? 0 : Camera.zeroX;
            if(this._map.width>D5Game.screenWidth) Camera.zeroX = Camera.zeroX > value ? value : Camera.zeroX;

            value = this._map.height - D5Game.screenHeight;
            Camera.zeroY = Camera.zeroY < 0 ? 0 : Camera.zeroY;
            if(this._map.height>D5Game.screenHeight) Camera.zeroY = Camera.zeroY > value ? value : Camera.zeroY;

        }

        public update():void {
            if (this._focus) this.setZero(this._focus.posX - (D5Game.screenWidth >> 1),this._focus.posY - (D5Game.screenHeight >> 1));

            Camera._cameraView.x = Camera.zeroX;
            Camera._cameraView.y = Camera.zeroY;

            Camera._cameraView.width = D5Game.screenWidth;
            Camera._cameraView.height = D5Game.screenHeight;
        }

        /**
         * 镜头注视
         */
        public set focus(o:IGD){
            if(this._focus)
            {
                this._focus.beFocus=false;
            }
            this._focus = o;
            if(o) o.beFocus = true;
            this.update();
            this.reCut();
        }

        public get focus():IGD {
            return this._focus;
        }

        /**
         * 镜头移动速度
         */
        public set moveSpeed(s:number) {
            this._moveSpeed = s;
        }

        /**
         * 镜头视野矩形
         * 返回镜头在世界地图内测区域
         */
        public static get cameraView():egret.Rectangle {
            return Camera._cameraView;
        }

        /**
         * 镜头裁剪视野
         */
        public get cameraCutView():egret.Rectangle {
            var zero_x:number = Camera.zeroX;
            var zero_y:number = Camera.zeroY;

            if (zero_x > 0)zero_x -= this._map.tileWidth * 2;
            if (zero_x > 0)zero_y -= zero_y - this._map.tileHeight * 2;

            zero_x = zero_x < 0 ? 0 : zero_x;
            zero_y = zero_y < 0 ? 0 : zero_y;


            this._cameraCutView.x = zero_x;
            this._cameraCutView.y = zero_y;
            this._cameraCutView.width = D5Game.screenWidth + this._map.tileWidth * 2;
            this._cameraCutView.height = D5Game.screenHeight + this._map.tileHeight * 2;

            return this._cameraCutView;
        }

        /**
         * 镜头向上
         * @param    k    倍率
         */
        public moveNorth(k:number = 1):void {
            if (this._moveSpeed == 0 || Camera.zeroY == 0) return;
            this.focus = null;
            this.setZero(Camera.zeroX, Camera.zeroY - this._moveSpeed * k);
            this.reCut();
        }

        /**
         * 镜头向下
         */
        public moveSourth(k:number = 1):void {
            if (this._moveSpeed == 0) return;
            this.focus = null;
            this.setZero(Camera.zeroX, Camera.zeroY + this._moveSpeed * k);
            this.reCut();
        }

        /**
         * 镜头向左
         */
        public moveWest(k:number = 1):void {
            if (this._moveSpeed == 0 || Camera.zeroX == 0) return;
            this.focus = null;
            this.setZero(Camera.zeroX - this._moveSpeed * k, Camera.zeroY);
            this.reCut();
        }

        /**
         * 镜头向右
         */
        public moveEast(k:number = 1):void {
            if (this._moveSpeed == 0) return;
            this.focus = null;
            this.setZero(Camera.zeroX + this._moveSpeed * k, Camera.zeroY);
            this.reCut();
        }

        public move(xdir:number, ydir:number, k:number = 1):void {
            this.focus = null;
            this.setZero(Camera.zeroX + this._moveSpeed * xdir * k, Camera.zeroY + this._moveSpeed * ydir * k);
            this.reCut();
        }

        /**
         * 镜头观察某点
         */
        public lookAt(x:number, y:number):void {
            this.focus = null;
            this.setZero(x - (D5Game.screenWidth >> 1), y - (D5Game.screenHeight >> 1));
            this.reCut();
        }

        public flyTo(x:number, y:number, callback:Function = null):void {
            if (this._timer != null) {
                console.log("[D5Camera] Camera is moving,can not do this operation.");
                return;
            }
            this.focus = null;
            this._moveCallBack = callback;

            this._moveStart = new egret.Point(Camera.zeroX - (D5Game.screenWidth >> 1), Camera.zeroY - (D5Game.screenHeight >> 1));
            this._moveEnd = new egret.Point(x - (D5Game.screenWidth >> 1), y - (D5Game.screenHeight >> 1));

            this._timer = new egret.Timer(50);
            this._timer.addEventListener(egret.TimerEvent.TIMER, this.moveCamera, this);
            this._timer.start();
        }

        public moveCamera(e:egret.TimerEvent):void {

            var k:number = 8;

            var xspeed:number = (this._moveEnd.x - this._moveStart.x) / k;
            var yspeed:number = (this._moveEnd.y - this._moveStart.y) / k;
            this._moveStart.x += xspeed;
            this._moveStart.y += yspeed;
            this.setZero(this._moveStart.x, this._moveStart.y);
            if ((xspeed > -.2 && xspeed < .2) && (yspeed > -.2 && yspeed < .2)) {
                //_scene.Map.$Center = _moveEnd;
                this._moveEnd = null;
                this._timer.stop();
                this._timer.removeEventListener(egret.TimerEvent.TIMER, this.moveCamera, this);
                this._timer = null;
                this.reCut();
                if (this._moveCallBack != null) this._moveCallBack();
            }
        }

        public get zorderSpeed():number {
            return this._zorderSpeed;
        }

        public reCut():void {
            /*
            var list:Array<IGD> = D5Game.me.dataList;
            var length:number = list.length;
            var obj:IGD;
            var contains:boolean;
            //console.log("[D5Camera] there are ",length,"objects.");
            for (var i:number = 0; i < length; i++) {
                obj = list[i];
                contains = Camera.cameraView.containsPoint(obj.$pos);
                //console.log("[D5Camera] check ",obj.$pos,D5Camera.cameraView);
                if (!obj.inScreen && contains) {
                    D5Game.me.add2Screen(obj);
                } else if(obj.inScreen && !contains) {
                    D5Game.me.remove4Screen(obj);
                }
            }
            */
        }
    }
}