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
        private _waitAction:string='';
        private _nowAction:string='';
        private _dirK:number = 1;
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

        public get id():string
        {
            return this._boneName;
        }

        public get boneName():string
        {
            return this._boneName;
        }

        public run(t:number):void
        {
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

            this.updatePos();
        }

        /**
         * 由跑动切换到待机的缓冲动作
         * @param action_name 由跑动切换到待机的缓冲动作
         */
        protected run2wait(action_name:string=null,callback:Function=null,thisobj:any=null):void
        {
            if(action_name!=null) this.playAction(action_name);
            this._speedK = .5;
            var that:BoneCharacter = this;
            setTimeout(function():void{
                that.action = Actions.Wait;
                that._speedK = 1;
                that._movedir = NaN;
                if(callback!=null) callback.apply(thisobj);
            },800);
        }

        /**
         * 移动到某个区块地图
         * @param tx 移动到的X坐标
         * @param ty 移动到的Y坐标
         */
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

        /**
         * 移动到某个世界地图
         * @param px 移动到的X坐标
         * @param py 移动到的Y坐标
         */
        public move2Pos(px:number,py:number):void
        {
            if(this._targetPoint)
            {
                this._targetPoint.x = px;
                this._targetPoint.y = py;
            }else{
                this._targetPoint = new egret.Point(px,py);
            }

            this.action = Actions.Run;
        }

        /**
         * 
         * @param path 
         * @param onReady 
         * @param thisobj 
         * @param leftDir 若角色方向默认向左，不需要使用此参数。若角色方向默认向右，请传递-1
         */
        public setSkin(path:string,onReady:Function,thisobj:any,leftDir:number=1)
        {
            var that:BoneCharacter = this;
            this._dirK = leftDir;

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

            if(this._waitAction!=null) this.playAction(this._waitAction);
        }

        /**
         * 兼容逐帧对象的播放形式，传递动作ID开始播放
         */
        public set action(v:number)
        {
            this.playAction('action'+v);
        }

        public get action():number
        {
            if(this._nowAction && this._nowAction.substr(0,6)=='action')
            {
                return parseInt(this._nowAction.substr(6));
            }else{
                return -1;
            }
        }

        /**
         * 沿着某一个方向移动
         * @param dir 移动角度
         */
        public go(dir:number):void
        {
            this._movedir = dir;
            this.action = Actions.Run;
        }

        /**
         * 停止沿某个方向移动
         * @param   action  过渡切换动作
         * @param   callback 完全停止后的反馈函数，无参数
         * @param   thisobj
         */
        public stop(action:string=null,callback:Function=null,thisobj:any=null):void
        {
            this.run2wait(action,callback,thisobj);
        }

        /**
         * 播放某个骨骼动作
         * @param name 动作名
         */
        public playAction(name:string):void
        {
            if(!this._monitor) 
            {
                this._waitAction = name;
                return;
            }

            if(this._nowAction==name) return;
            this._nowAction = name;
            (<dragonBones.EgretArmatureDisplay><any>this._monitor).animation.play(name);
            this._waitAction = null;
        }

        /**
         * 根据角度值修改角色的方向
         * @param   angle   角度
         */
        protected set faceAngle(angle:number){
            this._faceAngle = angle;
            　
            if(!this._monitor) return;

            var s:number = Math.abs(this._monitor.scaleX);
            if(angle<-22.5) angle+=360;
            if(angle>=-22.5 && angle<22.5){
                
            }else if(angle>=22.5 && angle<67.5){
                this._monitor.scaleX = s*-1*this._dirK;
            }else if(angle>=67.5 && angle<112.5){
                this._monitor.scaleX = s*-1*this._dirK;
            }else if(angle>=112.5 && angle<157.5){
                this._monitor.scaleX = s*-1*this._dirK;
            }else if(angle>=157.5 && angle<202.5){
                
            }else if(angle>=202.5 && angle<247.5){
                this._monitor.scaleX = s*this._dirK;
            }else if(angle>=247.5 && angle<292.5){
                this._monitor.scaleX = s*this._dirK;
            }else{
                this._monitor.scaleX = s*this._dirK;
            }
        }
    }
}