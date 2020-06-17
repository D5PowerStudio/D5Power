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
    export class D5Bitmap extends D5Component
    {
        private bit:egret.Bitmap;

        private _url:string;

        private _onComplate:Function;

        private _onComplateObj:any;

        /**
         * 运行脚本
         */
        public script:string;

        /**
         * 默认贴图
         */
        private static _defaultTexture:egret.Texture = new egret.Texture();

        public constructor()
        {
            super();
        }

        private _isLoopFill:number;
        /**
         * 是否为循环贴图
         */
        public set loop(b:boolean)
        {
            if(this.bit)
                this.bit.fillMode = b ? egret.BitmapFillMode.REPEAT : egret.BitmapFillMode.SCALE;
            else
                this._isLoopFill = b ? 1 : 0;
        }

        public get texture():egret.Texture
        {
            return this.bit ? this.bit.texture : null;
        }

        public setSkin(name:string):void
        {
            if(this._nowName == name) return;
            this._nowName = name;
            var data:D5UIResourceData = D5UIResourceData.getData(name);
            if(data==null)
            {
                trace("[D5Bitmap]No Resource"+name);
                var texture:egret.Texture = RES.getRes(name);
                if(texture)
                {
                    this.bit = new egret.Bitmap();
                    this.bit.texture = texture;
                    this.invalidate();
                }else
                {
                    this.setSrc(name);
                }
                return;
            }
            if(this.bit == null) 
            {
                this.bit = new egret.Bitmap();
            }

            if(!isNaN(this._isLoopFill) && this._isLoopFill) this.loop = true; 
            this.bit.texture = data.getResource(0);
            if(isNaN(this._w) || isNaN(this._h)) this.setSize(this.bit.$getWidth(),this.bit.$getHeight());
            this.invalidate();
        }

        public setComplete(fun:Function,thisObj:any)
        {
            this._onComplate = fun;
            this._onComplateObj = thisObj;
        }

        public setSrc(url:string):void
        {
            this._url = url;
            if(url==null)
            {
                this.bit.texture = null;
                return;
            }
            this.loadResource(this._url,this.onComplate,this);
        }
        
        public clone():D5Bitmap
        {
            var b:D5Bitmap = new D5Bitmap();
            b.setSize(this._w,this._h);
            b.setRes(this.bit==null ? null : this.bit.texture);
            b.anchorOffsetX = this.anchorOffsetX;
            b.anchorOffsetY = this.anchorOffsetY;
            return b;
        }

        /**
         * 通过网址加载图片素材，本方法支持跨域
         * @param url 需要加载的图片地址
         */
        public loadUrl(url:string):void
        {
            var that:D5Bitmap = this;
            var loader:egret.ImageLoader = new egret.ImageLoader();
            loader.crossOrigin = 'anonymous';
            loader.once(egret.Event.COMPLETE,function(e:egret.Event):void{
                var t:egret.Texture = new egret.Texture();
                t.bitmapData = loader.data;
                this.setRes(t);
            },this);
            loader.load(url);
        }

        public setRes(data:egret.Texture):void
        {
            this.onComplate(data);
        }
        
        protected onComplate(data:any):void
        {
            if(this.bit == null) this.bit = new egret.Bitmap();
            this.addChild(this.bit);
            if(data==null)
            {
                trace(this.name,'resource hot found ==============');
                data = D5Bitmap._defaultTexture;
            }
            this.bit.texture = data;
            if(!isNaN(this._isLoopFill) && this._isLoopFill) this.loop = true; 
            if(isNaN(this._w) || isNaN(this._h)) this.setSize(this.bit.$getWidth(),this.bit.$getHeight());
            //this.invalidate();

            if(this._onComplate!=null)
            {
                try
                {
                    this._onComplate.apply(this._onComplateObj);
                    this._onComplate = null;
                }catch(e){
                    trace(e);
                }
                
                this._onComplate = null;
                this._onComplateObj = null;
            }
        }

        public draw():void
        {
            if(this.bit==null)
            {

            }else{
                if(!this.contains(this.bit)) {
                    this.addChildAt(this.bit,0);
                }
                
                if(this.bit.fillMode==egret.BitmapFillMode.SCALE)
                {
                    this.bit.width = this._w;
                    this.bit.height = this._h;
                }
            }
            super.draw();
        }
        public dispose():void
        {
            if(this.bit)
            {
                if(this.bit.parent)this.bit.parent.removeChild(this.bit);
                this.bit.texture = null;
                this.bit = null;
            }          
        }

    }
}