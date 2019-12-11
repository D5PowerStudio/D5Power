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
    export class D5MirrorLoop extends D5Component
    {
        private front:egret.Bitmap;

        private enter:egret.Bitmap;

        private after:egret.Bitmap;
        
        public _mode:number = 0;

        public _cutSize:number = 0;

        private _minW:number;

        private _minH:number;

        public constructor()
        {
            super();
        }

        public setRes(data:egret.Texture):void
        {
            this.onComplate(data);
        }

        protected onComplate(data:egret.Texture):void
        {
            var sheet:egret.SpriteSheet = new egret.SpriteSheet(data);
            if(this._mode==0)
            {
                sheet.createTexture('0',0,0,this._cutSize,data.textureHeight);
                sheet.createTexture('1',this._cutSize,0,data.textureWidth - this._cutSize,data.textureHeight);
                if(this.front==null)this.front = new egret.Bitmap();
                this.front.texture = sheet.getTexture('0');

                if(this.enter==null)this.enter = new egret.Bitmap();
                this.enter.texture = sheet.getTexture('1');
                this.enter.fillMode = egret.BitmapFillMode.REPEAT;

                if(this.after==null)this.after = new egret.Bitmap();
                this.after.texture = sheet.getTexture('0');
                this.after.scaleX = -1;

                this._minW = this.front.texture.textureWidth+this.enter.texture.textureWidth+this.after.texture.textureWidth;
            }
            else
            {
                sheet.createTexture('0',0,0,data.textureWidth,this._cutSize);
                sheet.createTexture('1',0,this._cutSize,data.textureWidth,data.textureHeight- this._cutSize);
                if(this.front==null)this.front = new egret.Bitmap();
                this.front.texture = sheet.getTexture('0');

                if(this.enter==null)this.enter = new egret.Bitmap();
                this.enter.texture = sheet.getTexture('1');
                this.enter.fillMode = egret.BitmapFillMode.REPEAT;

                if(this.after==null)this.after = new egret.Bitmap();
                this.after.texture = sheet.getTexture('0');
                this.after.scaleY = -1;

                this._minH = this.front.texture.textureHeight+this.enter.texture.textureHeight+this.after.texture.textureHeight;
            }
            this.invalidate();
        }
        public setSkin(name:string):void
        {
            if(this._nowName == name) return;
            this._nowName = name;
            var data:D5UIResourceData = D5UIResourceData.getData(name);
            if(data==null)
            {
                trace("[D5MirrorLoop]No Resource"+name);
                this.loadResource(name,this.onComplate,this);
                return;
            }

            if(data.typeLoop == 0)   //x轴D5UIResourceData._typeLoop == 0
            {
                this._mode = 0;
                if(this.front==null)this.front = new egret.Bitmap();
                this.front.texture = data.getResource(0);

                if(this.enter==null)this.enter = new egret.Bitmap();
                this.enter.texture = data.getResource(1);
                this.enter.fillMode = egret.BitmapFillMode.REPEAT;

                if(this.after==null)this.after = new egret.Bitmap();
                this.after.texture = data.getResource(0);
                this.after.scaleX = -1;
            }else{
                this._mode = 1;
                if(this.front==null)this.front = new egret.Bitmap();
                this.front.texture = data.getResource(0);

                if(this.enter==null)this.enter = new egret.Bitmap();
                this.enter.texture = data.getResource(1);
                this.enter.fillMode = egret.BitmapFillMode.REPEAT;

                if(this.after==null)this.after = new egret.Bitmap();
                this.after.texture = data.getResource(0);
                this.after.scaleY = -1;
            }

            this.invalidate();

        }

        public draw():void
        {
            if(this.front==null)
            {
                return;
            }else{

                if(!this.contains(this.front)) {

                    this.addChildAt(this.front,0);
                    this.addChildAt(this.enter,1);
                    this.addChildAt(this.after,2);
                }
            }
            var targetSize:number;
            this.enter.visible = true;
            if(this._mode == 0)
            {
                this.enter.x = this.front.width;
                targetSize<0 && (targetSize=0);
                targetSize>0 ? (this.enter.width = targetSize) : (this.enter.visible=false);
                this.after.x = this.enter.x+targetSize+this.front.width;
            }else{
                this.enter.y = this.front.height;
                targetSize = this._h - this.front.height * 2;
                targetSize<0 && (targetSize=0);
                targetSize>0 ? (this.enter.height = targetSize) : (this.enter.visible=false);
                this.after.y = this.enter.y+targetSize+this.front.height;
            }
            this.autoCache();
            super.draw();

        }

        public setSize(w:number,h:number):void
        {
            if(!this.enter) return;
            if(this._mode==0)
            {
                w = w<=this._minW ? this._minW : w;
            }else{
                h = h<=this._minH ? this._minH : h;
            }
            super.setSize(w,h);
        }

        public clone():D5MirrorLoop
		{
			var ui:D5MirrorLoop = new D5MirrorLoop();
			ui._mode = this._mode;
            ui._cutSize = this._cutSize;
            ui.setSkin(this._nowName);
			ui.setSize(this.width,this.height);
			return ui;
		}
        public get mBitmap():egret.Bitmap
        {
            return this.enter;
        }
        public dispose():void
        {
            if(this.front)
			{
				if(this.front.parent) this.front.parent.removeChild(this.front);
				this.front.texture = null;
				this.front = null;
			}
			if(this.enter)
			{
				if(this.enter.parent) this.enter.parent.removeChild(this.enter);
				this.enter.texture = null;
				this.enter = null;
			}
			if(this.after)
			{
				if(this.after.parent) this.after.parent.removeChild(this.after);
				this.after.texture = null;
				this.after = null;
			}
            
        }

    }
}
