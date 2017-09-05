//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, MicroGame Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
module d5power
{
	export class D5EffectSpriteSheet implements IDisplayer
	{
        /**
         * 最大允许回收对象池容量
         */
		public static MAX_IN_JALE:number = 200;
        /**
         * 正在使用中的对象
         */
        private static _pool_inuse:any = {};
        /**
         * 待重用的对象
         */
        private static _pool_jale:Array<D5EffectSpriteSheet> = new Array<D5EffectSpriteSheet>();
        /**
         * 加载id
         */
        private loadID:number;
        /**
         * 连接数量，此对象的引用计数
         */
		private _link:number = 0;
        /**
         * 资源名
         */
        private _name:string;
        
        /**
         * 纹理集
         * 针对多帧素材，如果为单张贴图，此属性为空
         */
        private _sheet:egret.SpriteSheet;
        /**
         * 原始贴图
         */
        private _texture:egret.Texture;
        /**
         * 多帧素材的uv配置
         */
        private _conf:any;
        /**
         * 渲染时间
         */
        private _renderTime:number;
        /**
         * 最大帧数
         */
        private _totalFrame:number;
        /**
         * 影子尺寸
         */
        private _shadowX:number;
        /**
         * 影子尺寸
         */
        private _shadowY:number;
        /**
         * 包含的方向数量
         */
        private _totalDirection:number;
        /**
         * 加载等待列表
         */
        private _waiterList:Array<ISpriteSheetWaiter>;
        /**
         * 
         */
        private _gX:number;
        /**
         * 
         */
        private _gY:number;
        /**
         * 
         */
        private _frameW:number;
        /**
         * 
         */
        private _frameH:number;
        /**
         * 
         */
        private _uvList:Array<any>;
        
        public static getInstance(res:string,getObj:ISpriteSheetWaiter):D5EffectSpriteSheet
        {
            var data:D5EffectSpriteSheet;
            if(D5EffectSpriteSheet._pool_inuse[res]!=null)
            {
                data = D5EffectSpriteSheet._pool_inuse[res];
                data._link++;
                if(data._link==1) data.setup(res);
            }else{
                if(D5EffectSpriteSheet._pool_jale.length>0)
                {
                    data = D5EffectSpriteSheet._pool_jale.pop();
                }else{
                    data = new D5EffectSpriteSheet();
                }

                data._link++;
                data.setup(res);
            }

            if(data._sheet==null)
            {
                data.addWaiter(getObj);
            }else{
                getObj.onSpriteSheepReady(data);
            }
            data.loadID = getObj.loadID;
            return data;
        }

        private static back2pool(data:D5EffectSpriteSheet):void
        {
            D5EffectSpriteSheet._pool_inuse[data._name] = null;
            if(D5EffectSpriteSheet._pool_jale.length<D5EffectSpriteSheet.MAX_IN_JALE && D5EffectSpriteSheet._pool_jale.indexOf(data)==-1)
            {
                D5EffectSpriteSheet._pool_jale.push(data);
            }
        }
		
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
        
        public unlink():void
        {

            this._link--;
            if(this._link<0) this._link=0;
            //console.log('[D5EffectSpriteSheet] unlink ',this._name,this._link);
            if(this._link==0)
            {
                this._sheet=null;
                this._waiterList = [];
                D5EffectSpriteSheet._pool_inuse[this._name]=null;
                D5EffectSpriteSheet.back2pool(this);
            }
        }
        
        public setup(res:string):void
        {
            this._name = res;
            D5EffectSpriteSheet._pool_inuse[this._name] = this;
            
            if(res.substr(-4,4)=='.png')
            {
                RES.getResByUrl(res, this.onTextureComplete, this);
            }else if(res.substr(-4,4)=='json'){
                RES.getResByUrl(res, this.onDataComplate, this);
            }else{
                trace("[D5EffectSpriteSheet] can not support this format.");
                
                return;
            }
        }
        
        public getTexture(dir:number,frame:number):egret.Texture
        {
            return this._sheet==null ? this._texture : this._sheet.getTexture('frame'+dir+'_'+frame);
        }
        
        private onTextureComplete(data:egret.Texture):void
        {
            //console.log("[D5EffectSpriteSheet] Res is loaded."+this._name);
            // link为0意味着该对象已失去全部引用，被废弃掉了，所以无需再处理程序
            if(this._link==0) return;

            this._sheet = new egret.SpriteSheet(data);
            
            RES.getResByUrl(this._name+'.json', this.onDataComplate, this);
        }
        
        private onConfigComplate(data:any):void
        {
            if(this._link==0) return;
            
            this._conf = data;
            RES.getResByUrl(this._name.substr(0,-5)+".png", this.onDataComplate, this);
        }
        
        private onDataComplate(texture:egret.Texture):void
        {
            //console.log("[D5EffectSpriteSheet] json is loaded."+this._name);
            // link为0意味着该对象已失去全部引用，被废弃掉了，所以无需再处理程序
            if(this._link==0 || this._conf==null)
            {
                this._sheet = null;
                return;
            }
            
            this._sheet = new egret.SpriteSheet(texture);
            var data:any = this._conf;
            
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
                        var uvLine:number = l<5 ? l : 8-l;
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
            
            var i:number = this._waiterList.length-1;
            while(i>=0)
            {
                var poper:ISpriteSheetWaiter = this._waiterList[i];
                if(poper.loadID==this.loadID)
                {
                    poper.onSpriteSheepReady(this);
                    this._waiterList.splice(i,1);
                }
            }
            
        }
	}
}