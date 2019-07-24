module d5power
{
    export class BoneCharacter extends GameObject implements IGD
    {
        private _data:any;
        private _texture_data:any;
        private _texture:egret.Texture;
        protected static factory:dragonBones.EgretFactory;
        private _onReady:Function;
        private _factory:dragonBones.EgretFactory;
        private _bone:dragonBones.Armature;
        private _onReady_obj:any;
        private _waitAction:number=-1;
        private _targetPoint:egret.Point;
        private _faceAngle:number;
        private _boneName:string;

        public constructor(map:IMap,boneName:string='armatureName',factory:dragonBones.EgretFactory=null)
        {
            super(map);
            if(BoneCharacter.factory==null)
            {
                BoneCharacter.factory = dragonBones.EgretFactory.factory;
            }

            this._factory = factory==null ? BoneCharacter.factory : factory;
            this._boneName = boneName;
        }

        public run(t:number):void
        {
            if(this._targetPoint)
            {
                var radian:number = GMath.getPointAngle(this._targetPoint.x-this._pos.x,this._targetPoint.y-this._pos.y);
                var angle:number = GMath.R2A(radian)+90;
                if(this._faceAngle!=angle)
                {
                    this.faceAngle = angle;
                }

                var xisok:boolean=false;
                var yisok:boolean=false;

                var xspeed:number = this.speed*Math.cos(radian);
                var yspeed:number = this.speed*Math.sin(radian);


                if(Math.abs(this._pos.x-this._targetPoint.x)<=1){
                    xisok=true;
                    xspeed=0;
                }

                if(Math.abs(this._pos.y-this._targetPoint.y)<=1){
                    yisok=true;
                    yspeed=0;
                }

                this.setPos(this._pos.x+xspeed,this._pos.y+yspeed);
                if(xisok && yisok){
                    // 走到新的位置点 更新区块坐标
                    this._targetPoint = null;
                    this.action = Actions.Wait;
                }
            }

            this.updatePos();
        }

        public move2Tile(tx:number,ty:number):void
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

        public setSkin(path:string,onReady:Function,thisobj:any)
        {
            var that:BoneCharacter = this;
            var onTexture:Function = function(data:egret.Texture)
            {
                if(data==null)
                {
                    onReady.apply(thisobj,null);
                }else{
                    that._texture = data;
                    RES.getResByUrl(path+'tex.json',onTextureData,this);
                }
            }

            var onTextureData:Function = function(data:any)
            {
                if(data==null)
                {
                    onReady.apply(thisobj,null);
                }else{
                    that._texture_data = data;
                    RES.getResByUrl(path+'ske.json',onData,this);
                }
            }

            var onData:Function = function(data:any)
            {
                if(data==null)
                {
                    onReady.apply(thisobj,null);
                }else{
                    that._data = data;
                    that._onReady = onReady;
                    that._onReady_obj = thisobj;
                    that.setup();
                    
                }
            }

            if(path.substr(-1)!='/') path+='/';
            RES.getResByUrl(path+'tex.png',onTexture,this);
        }

        private _lastRender:number=0;
        public render(t:number):void
        {
            if(this._bone)
            {
                var cost:number = t-this._lastRender;
                this._lastRender = t;
                this._bone.advanceTime(cost/1000);
            }
        }

        /**
         * 骨骼动画播放速度系数
         */
        private _speedK:number = 1;
        /**
         * 设置骨骼动画播放速度系数
         */
        public set speedK(k:number)
        {
            this._speedK = k;
            if(this._bone) this._bone.animation.timeScale = k;
        }

        private setup():void
        {
            if(this._factory) this._factory.dispose();
            if(this._monitor)
            {
                this._monitor.parent.removeChild(this._monitor);
                (<dragonBones.EgretArmatureDisplay><any>this._monitor).dispose();
            }

            this._factory = new dragonBones.EgretFactory();  
            this._factory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(this._data));  
            this._factory.addTextureAtlasData(this._factory.parseTextureAtlasData(this._texture_data,this._texture));
            
            this._bone = this._factory.buildArmature("armatureName");
            this._bone.animation.timeScale = this._speedK;
            this._monitor = this._bone.display;
            if(this._texture_data.scale)
            {
                this._monitor.scaleX = this._monitor.scaleY = this._texture_data.scale;
            }
            this.setPos(this._pos.x,this._pos.y);
            this.faceAngle = this._faceAngle;
            
            this._onReady.apply(this._onReady_obj,[this]);

            if(this._waitAction!=-1) this.action = this._waitAction;
        }

        public set action(v:number)
        {
            if(!this._monitor) 
            {
                this._waitAction = v;
                return;
            }
            (<dragonBones.EgretArmatureDisplay><any>this._monitor).animation.play('action'+v);
            this._waitAction = -1;
        }

        /**
         * 根据角度值修改角色的方向
         * @param   angle   角度
         */
        private set faceAngle(angle:number){
            this._faceAngle = angle;
            　
            if(!this._monitor) return;

            var s:number = Math.abs(this._monitor.scaleX);
            if(angle<-22.5) angle+=360;
            if(angle>=-22.5 && angle<22.5){
                
            }else if(angle>=22.5 && angle<67.5){
                this._monitor.scaleX = s*-1;
            }else if(angle>=67.5 && angle<112.5){
                this._monitor.scaleX = s*-1;
            }else if(angle>=112.5 && angle<157.5){
                this._monitor.scaleX = s*-1;
            }else if(angle>=157.5 && angle<202.5){
                
            }else if(angle>=202.5 && angle<247.5){
                this._monitor.scaleX = s;
            }else if(angle>=247.5 && angle<292.5){
                this._monitor.scaleX = s;
            }else{
                this._monitor.scaleX = s;
            }
        }
    }
}