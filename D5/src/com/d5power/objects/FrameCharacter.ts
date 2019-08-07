module d5power
{
    export class FrameCharacter extends GameObject implements ISpriteSheetWaiter,IGD
    {
        private _sheet:D5SpriteSheet;
        public loadID:number;
        

        private _action:number = 0;
        private _dir:number = 0;
        private _playFrame:number = 0;
        private _lastTimer:number = 0;


        private _data_renderTime:number = 0;
        private _data_totalFrame:number = 0;
        private _data_totalDir:number = 0;

        protected _offX:number=0;
        protected _offY:number=0;

        protected _skin:string;

        protected _plugin_list:Array<DisplayPluginData>;


        public constructor(map:IMap)
        {
            super(map);
            this._monitor = new egret.Bitmap();
        }

        /**
         * 增加挂件
         */
        public addDisplayPlugin(obj:egret.DisplayObject,offX:number=0,offY:number=0):void
        {
            var data:DisplayPluginData = new DisplayPluginData();
            data.offX = offX;
            data.offY = offY;
            data.obj = obj;

            this._plugin_list.push(data);

            if(this._monitor.parent)
            {

            }else{
                
            }

        }

        /**
         * 移动到某一个Tile
         */
        public move2Tile(tx:number,ty:number)
        {
            tx = Math.ceil(tx);
            ty = Math.ceil(ty);
            
            var p:egret.Point = this._map.tile2WorldPostion(tx,ty);
            if(this._targetPoint)
            {
                this._targetPoint.x = p.x;
                this._targetPoint.y = p.y;
            }else{
                this._targetPoint = new egret.Point(p.x,p.y);
            }

            this.action = Actions.Run;
        }

        public set dir(v:number)
        {
            if(v==this._dir) return;
            this._dir = v;
        }

        public get dir():number
        {
            return this._dir;
        }

        public get monitor():egret.DisplayObject
        {
            return this._monitor;
        }

        public set action(v:number)
        {
            if(!this._skin || this._skin==null || v==this._action) return;

            if(this._sheet==null)
            {
                this._sheet = D5SpriteSheet.getInstance(this._skin+v,this);
            }else{
                this._sheet = D5SpriteSheet.getInstance(this._skin+v,this);
            }
        }

        public setSkin(path:string)
        {
            var index:number = path.lastIndexOf('/');
            var action:string = path.substr(index+1);

            path = path.substr(0,index)+'/';
            this._skin = path;
            if(parseInt(action)>0)
            {
                // 包含动作
                this.action = parseInt(action);
            }else{
                this.action = Actions.Wait;
            }
            
        }

        public onSpriteSheepReady(data:IDisplayer):void
        {
           this._data_renderTime = data.renderTime;
           this._data_totalFrame = data.totalFrame;
           this._data_totalDir = data.totalDirection;

           this.render(egret.getTimer());
        }

        public run(t:number):void
        {
            super.run(t);

            if(this._targetPoint)
            {
                this._movedir = GMath.getPointAngle(this._targetPoint.x-this._pos.x,this._targetPoint.y-this._pos.y);
                if(this.moveWidthDir())
                {
                    // 走到新的位置点 更新区块坐标
                    this._targetPoint = null;
                    this.action = Actions.Wait;
                }
            }else if(!isNaN(this._movedir)){
                this.moveWidthDir();
            }
        }

        public render(t:number):void
        {
            if(!this._sheet || t-this._lastTimer<this._sheet.renderTime) return;

            this._lastTimer = t;
            var direction:number = this._dir;
            if(this._playFrame>=this._sheet.totalFrame) this._playFrame=0;
            if(this._dir<=4)
            {
                if(this._sheet.totalDirection==1)
                {
                    direction = 0;
                    (<any>this._monitor).texture = this._sheet.getTexture(direction,this._playFrame);
                }
                else if(this._sheet.totalDirection==4)
                {
                    if(direction ==1||direction==2||direction==3)
                    {
                        direction = 1;
                    }
                    (<any>this._monitor).texture = this._sheet.getTexture(direction,this._playFrame);
                }
                else
                {
                    (<any>this._monitor).texture = this._sheet.getTexture(direction,this._playFrame);
                }
                this._monitor.scaleX = 1;
                if(this._sheet.uvList)
                {
                    this._offX = this._sheet.uvList[direction*this._sheet.totalFrame+this._playFrame].offX;
                    this._offY = this._sheet.uvList[direction*this._sheet.totalFrame+this._playFrame].offY;
                }
                else
                {
                    this._offX = this._sheet.gX;
                    this._offY = this._sheet.gY;
                }
            }
            else
            {
                if(this._sheet.totalDirection==1)
                {
                    direction = 0;
                    (<any>this._monitor).texture = this._sheet.getTexture(direction,this._playFrame);
                }
                else if(this._sheet.totalDirection==4)
                {
                    direction = 1;
                    (<any>this._monitor).texture = this._sheet.getTexture(direction,this._playFrame);
                }
                else
                {
                    direction = 8 - this._dir;
                    (<any>this._monitor).texture = this._sheet.getTexture(direction,this._playFrame);
                }
                this._monitor.scaleX = -1;
                if(this._sheet.uvList)
                {
                    this._offX = -this._sheet.uvList[direction*this._sheet.totalFrame+this._playFrame].offX;
                    this._offY = this._sheet.uvList[direction*this._sheet.totalFrame+this._playFrame].offY;
                }
                else {
                    this._offX = -this._sheet.gX;
                    this._offY = this._sheet.gY;
                }
            }
            this._playFrame++;
            this.updatePos(this._offX,this._offY);
            /*
            if(this._data.action == d5power.Actions.Attack)
            {
                if(this._playFrame==0 && this._flag)
                {
                    this._data.setAction(d5power.Actions.Wait);
                    this._flag = false;
                }
                if(this._playFrame+1>=this._sheet.totalFrame && !this._flag)
                {
                    this['atkfun']();
                    this._flag = true;
                }
            }
            */
        }

        /**
         * 根据角度值修改角色的方向
         * @param   angle   角度
         */
        protected set faceAngle(angle:number){
            this._faceAngle = angle;

            if(angle<-22.5) angle+=360;
            if(angle>=-22.5 && angle<22.5){
                this._dir = Direction.Up;
            }else if(angle>=22.5 && angle<67.5){
                this._dir = Direction.RightUp;
            }else if(angle>=67.5 && angle<112.5){
                this._dir = Direction.Right;
            }else if(angle>=112.5 && angle<157.5){
                this._dir = Direction.RightDown;
            }else if(angle>=157.5 && angle<202.5){
                this._dir = Direction.Down;
            }else if(angle>=202.5 && angle<247.5){
                this._dir = Direction.LeftDown;
            }else if(angle>=247.5 && angle<292.5){
                this._dir = Direction.Left;
            }else{
                this._dir = Direction.LeftUp;
            }
        }
    }
}