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
    export class D5MirrorBox extends D5Component
    {
        public cutX:number = 0;
        public cutY:number = 0;
        
        private lt:egret.Bitmap;
        private t:egret.Bitmap;
        private rt:egret.Bitmap;
        private l:egret.Bitmap;
        private m:egret.Bitmap;
        private r:egret.Bitmap;
        private lb:egret.Bitmap;
        private b:egret.Bitmap;
        private rb:egret.Bitmap;

        private _texture:egret.Texture;
        public constructor()
        {
            super();
        }

        public setRes(data:egret.Texture):void
        {
            this.onComplate(data);
        }

        public clone():D5MirrorBox
        {
            var c:D5MirrorBox = new D5MirrorBox();
            c.cutX = this.cutX;
            c.cutY = this.cutY;
            this._texture ? c.onComplate(this._texture) : c.setSkin(this._nowName);
            c.setSize(this._w,this._h);
            return c;
        }

        protected onComplate(data:egret.Texture):void
        {
            this._texture = data;
             var sheet:egret.SpriteSheet = new egret.SpriteSheet(data);
             sheet.createTexture('0',0,0,this.cutX,this.cutY);
             sheet.createTexture('1',this.cutX,0,data.textureWidth - this.cutX,this.cutY);
             sheet.createTexture('2',0,this.cutY,this.cutX,data.textureHeight - this.cutY);
             sheet.createTexture('3',this.cutX,this.cutY,data.textureWidth - this.cutX,data.textureHeight - this.cutY);

             if(this.lt==null)this.lt = new egret.Bitmap();
            this.lt.texture = sheet.getTexture('0');

            if(this.t==null)this.t = new egret.Bitmap();
            this.t.texture = sheet.getTexture('1');
            this.t.fillMode = egret.BitmapFillMode.REPEAT;

            if(this.rt==null)this.rt = new egret.Bitmap();
            this.rt.texture = sheet.getTexture('0');
            this.rt.scaleX = -1;

            if(this.l==null)this.l = new egret.Bitmap();
            this.l.texture = sheet.getTexture('2');
            this.l.fillMode = egret.BitmapFillMode.REPEAT;

            if(this.m==null)this.m = new egret.Bitmap();
            this.m.texture = sheet.getTexture('3');
            this.m.fillMode = egret.BitmapFillMode.REPEAT;

            if(this.r==null)this.r = new egret.Bitmap();
            this.r.texture = sheet.getTexture('2');
            this.r.scaleX = -1;
            this.r.fillMode = egret.BitmapFillMode.REPEAT;

            if(this.lb==null)this.lb = new egret.Bitmap();
            this.lb.texture = sheet.getTexture('0');
            this.lb.scaleY=-1;

            if(this.b==null)this.b = new egret.Bitmap();
            this.b.texture = sheet.getTexture('1');
            this.b.scaleY=-1;
            this.b.fillMode = egret.BitmapFillMode.REPEAT;

            if(this.rb==null)this.rb = new egret.Bitmap();
            this.rb.texture = sheet.getTexture('0');
            this.rb.scaleX=this.rb.scaleY=-1;
            this.rb.fillMode = egret.BitmapFillMode.REPEAT;
            
            this.invalidate();
        }

        public setSkin(name:string):void
        {
            if(this._nowName == name) return;
            this._nowName = name;
            var data:D5UIResourceData = D5UIResourceData.getData(name);
            if(data==null)
            {
                trace("[D5MirrorBox]No Resource"+name);
                this.loadResource(name,this.onComplate,this);
                return;
            }
            if(this.lt==null)this.lt = new egret.Bitmap();
            this.lt.texture = data.getResource(0);

            if(this.t==null)this.t = new egret.Bitmap();
            this.t.texture = data.getResource(1);
            this.t.fillMode = egret.BitmapFillMode.REPEAT;

            if(this.rt==null)this.rt = new egret.Bitmap();
            this.rt.texture = data.getResource(0);
            this.rt.scaleX = -1;

            if(this.l==null)this.l = new egret.Bitmap();
            this.l.texture = data.getResource(2);
            this.l.fillMode = egret.BitmapFillMode.REPEAT;

            if(this.m==null)this.m = new egret.Bitmap();
            this.m.texture = data.getResource(3);
            this.m.fillMode = egret.BitmapFillMode.REPEAT;

            if(this.r==null)this.r = new egret.Bitmap();
            this.r.texture = data.getResource(2);
            this.r.scaleX = -1;
            this.r.fillMode = egret.BitmapFillMode.REPEAT;

            if(this.lb==null)this.lb = new egret.Bitmap();
            this.lb.texture = data.getResource(0);
            this.lb.scaleY=-1;

            if(this.b==null)this.b = new egret.Bitmap();
            this.b.texture = data.getResource(1);
            this.b.scaleY=-1;
            this.b.fillMode = egret.BitmapFillMode.REPEAT;

            if(this.rb==null)this.rb = new egret.Bitmap();
            this.rb.texture = data.getResource(0);
            this.rb.scaleX=this.rb.scaleY=-1;
            this.rb.fillMode = egret.BitmapFillMode.REPEAT;

            this.invalidate();
        }

        public draw():void
        {
            if(this.l==null)
            {
                return;
            }else{
                if(!this.contains(this.l))
                {
                    this.addChildAt(this.lt,0);
                    this.addChildAt(this.t,0);
                    this.addChildAt(this.rt,0);
                    this.addChildAt(this.l,0);
                    this.addChildAt(this.m,0);
                    this.addChildAt(this.r,0);
                    this.addChildAt(this.lb,0);
                    this.addChildAt(this.b,0);
                    this.addChildAt(this.rb,0);
                }

                this.t.x = this.m.x = this.b.x = this.lt.width;
                this.rt.x = this.r.x = this.rb.x = this._w;

                this.l.y = this.m.y = this.r.y = this.lt.height;
                this.lb.y = this.b.y = this.rb.y = this._h;

                this.m.width = this.t.width = this.b.width = this._w-this.lt.width*2;
                this.m.height = this.l.height = this.r.height = this._h-this.lt.height*2;

            }

            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
            this.autoCache();
            super.draw();
        }
        public get mBitmap():egret.Bitmap
        {
            return this.m;
        }
        public dispose():void
        {
            if(this.lt)
			{
				if(this.lt.parent) this.lt.parent.removeChild(this.lt);
				this.lt.texture = null;
				this.lt = null;
			}
			if(this.t)
			{
				if(this.t.parent) this.t.parent.removeChild(this.t);
				this.t.texture = null;
				this.t = null;
			}
			if(this.rt)
			{
				if(this.rt.parent) this.rt.parent.removeChild(this.rt);
				this.rt.texture = null;
				this.rt = null;
			}
			if(this.l)
			{
				if(this.l.parent) this.l.parent.removeChild(this.l);
				this.l.texture = null;
				this.l = null;
			}
			if(this.m)
			{
				if(this.m.parent) this.m.parent.removeChild(this.m);
				this.m.texture = null;
				this.m = null;
			}
			if(this.r)
			{
				if(this.r.parent) this.r.parent.removeChild(this.r);
				this.r.texture = null;
				this.r = null;
			}
			if(this.lb)
			{
				if(this.lb.parent) this.lb.parent.removeChild(this.lb);
				this.lb.texture = null;
				this.lb = null;
			}
			if(this.b)
			{
				if(this.b.parent) this.b.parent.removeChild(this.b);
				this.b.texture = null;
				this.b = null;
			}
			if(this.rb)
			{
				if(this.rb.parent) this.rb.parent.removeChild(this.rb);
				this.rb.texture = null;
				this.rb = null;
			}
        }

    }
}