module d5power
{
    export class TouchController
    {
        private _bg:egret.DisplayObject;
        private _controller:egret.DisplayObject;

        private _callback:Function;
        private _thisobj:any;
        private _listener:egret.IEventDispatcher;
        private _limit:number;
        private _stage:egret.Stage;

        /**
         * @listener 侦听对象
         * @callback 响应函数,调用时第一参数为本次触控的角度，第二参数为触控位置距中心的距离，第三参数为和上次相比的变化角度
         * @thisobj
         */
        public constructor(listener:egret.IEventDispatcher,callback:Function,thisobj:any)
        {
            
            this._callback = callback;
            this._thisobj = thisobj;
            this._listener = listener;
            this._listener.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this);
        }

        private _actionArea:egret.Rectangle;
        private _actionPoint:egret.Point;
        public setActionArea(px:number,py:number,w:number,h:number)
        {
            if(this._actionArea==null)
            {
                this._actionArea = new egret.Rectangle(px,py,w,h);
                this._actionPoint = new egret.Point();
            }else{
                this._actionArea.x = px;
                this._actionArea.y = py;
                this._actionArea.width = w;
                this._actionArea.y = h;
            }
                
        }

        public init(bg:egret.DisplayObject,controller:egret.DisplayObject,needChangeActor:boolean=true):void
        {
            if(!bg.width || !bg.height || !controller.width || !controller.height)
            {
                egret.error("[TouchController] please draw ui interface first.");
                return;
            }

            if(!bg.parent)
            {
                egret.error("[TouchController] please make true bg is in stage.");
            }

            this._bg = bg;
            this._controller = controller;
            this._stage = this._bg.stage;
            

            this._limit = bg.width>bg.height ? Math.ceil(bg.width>>1) : Math.ceil(bg.height>>1);
            if(needChangeActor){
                this._bg.anchorOffsetX = this._bg.width>>1;
                this._bg.anchorOffsetY = this._bg.height>>1;
                this._controller.anchorOffsetX = this._controller.width>>1;
                this._controller.anchorOffsetY = this._controller.height>>1;
            }

            this._bg.touchEnabled = false;
            this._controller.touchEnabled = false;
        }

        private onBegin(e:egret.TouchEvent):void
        {
            if(this._actionArea)
            {
                this._actionPoint.x = e.stageX;
                this._actionPoint.y = e.stageY;
                if(!this._actionArea.containsPoint(this._actionPoint)) return;
            }
            this._listener.once(egret.TouchEvent.TOUCH_END,this.onEnd,this);
            this._listener.once(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onEnd,this);
            this._listener.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);

            this._bg.x = this._controller.x = e.stageX;
            this._bg.y = this._controller.y = e.stageY;

            this._lastX = this._bg.x;
            this._lastY = this._bg.y;

            this._stage.addChild(this._bg);
            this._stage.addChild(this._controller);

            this._callback.apply(this._thisobj,[0,-1,0]);
        }

        private _lastX:number;
        private _lastY:number;
        private onMove(e:egret.TouchEvent):void
        {
            e.updateAfterEvent();
            var cx:number = e.stageX-this._bg.x;
            var cy:number = e.stageY-this._bg.y;
            var p:number = Math.sqrt(cx*cx+cy*cy);
            var angle:number = Math.atan2(e.stageY-this._bg.y,e.stageX-this._bg.x);

            var changeAngle:number = Math.atan2(e.stageY-this._lastY,e.stageX-this._lastX);

            if(p>this._limit)
            {
                
                this._controller.x = this._bg.x+parseInt(this._limit*Math.cos(angle)+'');
                this._controller.y = this._bg.y+parseInt(this._limit*Math.sin(angle)+'');
            }else{
                this._controller.x = e.stageX;
                this._controller.y = e.stageY;
            }

            if(this._callback!=null)
            {
                this._callback.apply(this._thisobj,[angle,p,changeAngle]);
            }
        }

        private onEnd(e:egret.TouchEvent):void
        {
            this._listener.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);
            this._controller.x = this._lastX;
            this._controller.y = this._lastY;
            if(this._bg && this._bg.parent) this._bg.parent.removeChild(this._bg);
            if(this._controller && this._controller.parent) this._controller.parent.removeChild(this._controller);
            if(this._callback) this._callback.apply(this._thisobj);
        }

    }
}