module d5power
{
    /**
     * 使用要求：必须使用getInstance获得实例，等待onSpriteSheepReady回叫，确保素材加载完毕。
     * 当不再使用时，需要使用unlink断开引用，对象将自动等待重用
     */
    export class D5SpriteSheet implements IDisplayer
    {
        private static _unknow:egret.Texture;

        public static setupUnknow(res:string,ready:Function=null,readyObj:any=null):void
        {
            var onUnkown:Function = function(data:egret.Texture):void
            {
                if(data==null) return;
                D5SpriteSheet._unknow = data;
                if(ready!=null) ready.apply(readyObj);
            }

            RES.getResByUrl(res, onUnkown, null);
        }

        private static _shadow:egret.Texture;

        public static setupShadow(res:string,ready:Function=null,readyObj:any=null):void
        {
            var onShadow:Function = function(data:egret.Texture):void
            {
                if(data==null) return;
                D5SpriteSheet._shadow = data;
                if(ready!=null) ready.apply(readyObj);
            }

            RES.getResByUrl(res, onShadow, null);
        }

        public static get shadow():egret.Texture
        {
            return D5SpriteSheet._shadow;
        }

        /**
         * 对象池最大容量
         * @type {number}
         */
        public static MAX_IN_JALE:number = 200;
        private static _pool_inuse:any = {};
        private static _pool_jale:Array<D5SpriteSheet> = new Array<D5SpriteSheet>();
        private loadID:number;

        public static getInstance(res:string,getObj:ISpriteSheetWaiter):D5SpriteSheet
        {
            var data:D5SpriteSheet;
            if(D5SpriteSheet._pool_inuse[res]!=null)
            {
                data = D5SpriteSheet._pool_inuse[res];
                data._link++;
                if(data._link==1) data.setup(res);
            }else{
                if(D5SpriteSheet._pool_jale.length>0)
                {
                    data = D5SpriteSheet._pool_jale.pop();
                }else{
                    data = new D5SpriteSheet();
                }

                data._link++;
                data.setup(res);
            }

            if(data._sheet==null)
            {
                data.addWaiter(getObj);
                //console.log("[D5SpriteSheet] please wait.");
            }else{
                getObj.onSpriteSheepReady(data);
                //console.log("[D5SpriteSheet] res is ready.");
            }
            data.loadID = getObj.loadID;
            return data;
        }

        private static back2pool(data:D5SpriteSheet):void
        {
            D5SpriteSheet._pool_inuse[data._name] = null;
            if(D5SpriteSheet._pool_jale.length<D5SpriteSheet.MAX_IN_JALE && D5SpriteSheet._pool_jale.indexOf(data)==-1)
            {
                D5SpriteSheet._pool_jale.push(data);
            }
        }

        private _link:number;
        private _name:string;
        private _sheet:egret.SpriteSheet;
        private _renderTime:number;
        private _totalFrame:number;
        private _shadowX:number;
        private _shadowY:number;
        private _totalDirection:number;
        private _waiterList:Array<ISpriteSheetWaiter>;
        private _gX:number;
        private _gY:number;
        private _frameW:number;
        private _frameH:number;
        private _uvList:Array<any>;



        public constructor()
        {
            this._link = 0;
            this._waiterList = new Array<ISpriteSheetWaiter>();
        }

        public get name():string{
            return this._name;
        }

        public get renderTime():number
        {
            return this._renderTime;
        }

        public get totalFrame():number
        {
            return this._totalFrame;
        }

        public get totalDirection():number
        {
            return this._totalDirection;
        }

        public get shadowX():number
        {
            return this._shadowX;
        }

        public get shadowY():number
        {
            return this._shadowY;
        }

        public get gX():number
        {
            return this._gX;
        }

        public get gY():number
        {
            return this._gY;
        }
        public get uvList():Array<any>
        {
            return this._uvList;
        }

        public get frameWidth():number
        {
            return this._frameW;
        }

        public get frameHeight():number
        {
            return this._frameH;
        }

        public addWaiter(waiter:ISpriteSheetWaiter):void
        {
            if(this._waiterList.indexOf(waiter)==-1) this._waiterList.push(waiter);
        }

        public setup(res:string):void
        {
            if(res.substr(-4,4)=='.png')
            {
                this._name = res.substr(0,res.length-4);

            }else{
                this._name = res;
                res = res+'.png';
            }

            D5SpriteSheet._pool_inuse[this._name] = this;
            //console.log("[D5SpriteSheet] Res is load."+res);
            RES.getResByUrl(res, this.onTextureComplete, this);
        }

        public unlink():void
        {

            this._link--;
            if(this._link<0) this._link=0;
            //console.log('[D5SpriteSheet] unlink ',this._name,this._link);
            if(this._link==0)
            {
                this._sheet=null;
                this._waiterList = [];
                D5SpriteSheet._pool_inuse[this._name]=null;
                D5SpriteSheet.back2pool(this);
            }
        }

        private onTextureComplete(data:egret.Texture):void
        {
            //console.log("[D5SpriteSheet] Res is loaded."+this._name);
            // link为0意味着该对象已失去全部引用，被废弃掉了，所以无需再处理程序
            if(this._link==0) return;

            this._sheet = new egret.SpriteSheet(data);
            RES.getResByUrl(this._name+'.json', this.onDataComplate, this);
        }

        public getTexture(dir:number,frame:number):egret.Texture
        {
            return this._sheet==null ? D5SpriteSheet._unknow : this._sheet.getTexture('frame'+dir+'_'+frame);
        }

        private onDataComplate(data:any):void
        {
            //console.log("[D5SpriteSheet] json is loaded."+this._name);
            // link为0意味着该对象已失去全部引用，被废弃掉了，所以无需再处理程序
            if(this._link==0)
            {
                this._sheet = null;
                return;
            }


            //{"X":-59,"shadowY":12,"FrameWidth":120,"shadowX":20,"Direction":1,"Time":120,"Frame":4,"Y":-114,"FrameHeight":120}
            this._totalFrame = parseInt(<string><any>data.Frame);
            this._renderTime = parseInt(<string><any>data.Time);
            this._shadowX = parseInt(<string><any>data.shadowX);
            this._shadowY = parseInt(<string><any>data.shadowY);
            if(this._shadowY>=this._shadowX) this._shadowY = data.shadowX*0.5;
            this._totalDirection = parseInt(<string><any>data.Direction);
            switch(parseInt(<string><any>data.Direction))
            {
                case 1:
                    this._totalDirection = 1;
                    break;
                case 5:
                    this._totalDirection = 8;
                    break;
                case 3:
                    this._totalDirection = 4;
                    break;
            }
            this._gX = parseInt(<string><any>data.X);
            this._gY = parseInt(<string><any>data.Y);
            this._frameW = parseInt(<string><any>data.FrameWidth);
            this._frameH = parseInt(<string><any>data.FrameHeight);
            this._uvList = data.uv?data.uv:null;
            //console.log("[D5SpriteSheepINIT] renderTime:",this._renderTime,",shadowY:",this._shadowY);

            var i:number;
            var l:number;

            if(data.uv)
            {
                //console.log("[D5SpriteSheepINIT] totalFrame:",this._totalFrame,",uvdata nums:",data.uv.length);
                for(l=0;l<this._totalDirection;l++)
                {
                    for(i=0;i<this._totalFrame;i++)
                    {
                        var uvLine:number = l<5 ? l : (this._totalDirection==8 ? l : 8-l);
                        var uv:any = data.uv[uvLine*this._totalFrame+i];
                        if(uv==null)
                        {
                            console.log("[D5SpriteSheepINIT] can not find uv config line:",l,",frame:",i,"===========================");
                        }else {
                            if(uv.offY == -uv.height) uv.offY += 0.01;
                            //this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth, l * data.FrameHeight, uv.width, uv.height,l<5 ? uv.offX : -uv.width-uv.offX, uv.offY);
                            this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth+uv.x, l * data.FrameHeight+uv.y, uv.width, uv.height,0,0);
                            //this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth, l * data.FrameHeight, uv.width, uv.height,l<5 ? uv.offX : -uv.width-uv.offX, uv.offY);
                        }
                    }
                }
            }else{
                for(l=0;l<this._totalDirection;l++)
                {
                    for(i=0;i<this._totalFrame;i++)
                    {
                        this._sheet.createTexture('frame'+l+'_'+i,i*data.FrameWidth,l*data.FrameHeight,data.FrameWidth,data.FrameHeight,0,0);
                    }
                }
            }
            while(this._waiterList.length>0)
            {
                var poper:ISpriteSheetWaiter = this._waiterList.pop();
                if(poper.loadID==this.loadID)poper.onSpriteSheepReady(this);
            }
        }
    }
}