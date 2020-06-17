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
    export class D5Button extends D5Component
    {
        public type:number = 4;
        
        private _sheet:egret.SpriteSheet;
        
        private a:egret.Bitmap;

        private data:D5UIResourceData;

        private _lable:d5power.D5Text;

        private sound:string;
       
        private _callback2:Function;

        protected _icon:D5Bitmap;

        protected _iconAutoFly:boolean=false;

        public constructor()
        {
            super();
        }

        public showIcon(v:boolean):void
        {
            if(this._icon) this._icon.visible = v;
        }

        public get iconDisplay():Boolean
        {
            return this._icon==null ? false : this._icon.visible;
        }

        public clone():D5Button
        {
            var c:D5Button = new D5Button();
            c.setSkin(this._nowName);
            return c;
        }

        public setIcon(url:string,xpos:number=0,ypos:number=0):void
        {
            if(url=='')return;
            if(!this._icon)this._icon = new D5Bitmap();
            this._icon.setSkin(url);
            this._icon.x = xpos;
            this._icon.y = ypos;
            if(this._icon.x==0 && this._icon.y==0) this._iconAutoFly = true;

            if(this._w!=0) this.flyIcon();
        }

        private flyIcon():void
        {
            if(this._icon)
            {
                if(this.contains(this._icon))
                    this.setChildIndex(this._icon,this.numChildren-1);
                else
                    this.addChild(this._icon);

                if(this._lable && this.contains(this._lable) && this.contains(this._icon) && this._iconAutoFly)
                {
                    this._icon.x = (this.a.width-this._icon.width-this._lable.width) >> 1;
                    this._lable.x = this._icon.x + this._icon.height;
                }else{
                    if(this._icon.x==0){
                        this._icon.x = (this._w-this._icon.width)>>1;
                    }
                    if(this._icon.y==0){
                        this._icon.y = (this._h-this._icon.height)>>1;
                    }
                }
            }
        }

        public setLable(lab:string):void
        {
            if(this._lable==null)
            {
                this._lable = new d5power.D5Text();
                this._lable.setFontSize(d5power.D5Style.default_btn_lable_size);
                this._lable.setFontBold(d5power.D5Style.default_btn_lable_bold);
                if(d5power.D5Style.default_btn_lable_border!=-1) this._lable.setFontBorder(d5power.D5Style.default_btn_lable_border);
                this.addChild(this._lable);
            }

            this._lable.setText(lab);
            this._lable.autoGrow();
            //this._lable.setWidth(lab.length * d5power.D5Style.default_btn_lable_size);
            //this._lable.setHeight(d5power.D5Style.default_btn_lable_size);

            this.autoLableSize();
        }

        private autoLableSize():void
        {
            if(this._lable==null || this.a==null) return;
            this._lable.x = Math.abs(this.a.width-this._lable.width) / 2;
            this._lable.y = Math.abs(this.a.height-this._lable.height) / 2;
        }

        public enabled(b:boolean):void
        {
            this.touchEnabled = b;
            if(b) {
                if(this._sheet==null)
                {
                    this.a.texture = this.data.getResource(0);
                }
                else
                {
                    this.a.texture = this._sheet.getTexture('0');
                }
                
            }
            else{
                if(this.type==2)
                {
                    if(this._sheet==null)
                    {
                        this.a.texture = this.data.getResource(0);
                    }
                    else
                    {
                        this.a.texture = this._sheet.getTexture('0');
                    }
                }
                else
                {
                    if(this._sheet==null)
                    {
                        this.a.texture = this.data.getResource(3);
                    }
                    else
                    {
                        this.a.texture = this._sheet.getTexture('3');
                    }
                }
            }
            this.invalidate();
        }

        public setRes(data:egret.Texture):void
        {
            this.onComplate(data);
        }
        protected onComplate(data:egret.Texture):void
        {
            this._sheet = new egret.SpriteSheet(data);
            if(this.type = 4)
            {
               this._sheet.createTexture('0',0,0,data.textureWidth/4,data.textureHeight); 
               this._sheet.createTexture('1',data.textureWidth/4,0,data.textureWidth/4,data.textureHeight); 
               this._sheet.createTexture('2',data.textureWidth/2,0,data.textureWidth/4,data.textureHeight); 
               this._sheet.createTexture('3',data.textureWidth*3/4,0,data.textureWidth/4,data.textureHeight); 
            }
            else
            {
                this._sheet.createTexture('0',0,0,data.textureWidth/2,data.textureHeight); 
                this._sheet.createTexture('1',data.textureWidth/2,0,data.textureWidth/2,data.textureHeight); 
            }
                     
            
            this.drawButton();
            this.invalidate();
        }
        
        private drawButton():void
        {
            if(this.a==null)this.a = new egret.Bitmap();
            this.a.texture = this._sheet ? this._sheet.getTexture('0') : this.data.getResource(0);
            this._w = this.a.width;
            this._h = this.a.height;
            
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.btnDown,this);
            this.addEventListener(egret.TouchEvent.TOUCH_END,this.btnUp,this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.btnClick,this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.btnOutSide,this);
            
            if(this._icon) this.flyIcon();
        }

        public setSkin(name:string):void
        {
            if(this._nowName == name) return;
            this._nowName = name;
            this.data = D5UIResourceData.getData(name);
            if(this.data==null)
            {
                trace("[D5Button]No Resource"+name);
                this.loadResource(name,this.onComplate,this);
                return;
            }
            
            this.type = this.data.buttonType;
            this.drawButton();

            this.invalidate();

        }
        public setSound(sound:string):void
        {
            sound = sound.replace('resource/','')
            this.sound = sound;
        }

        private btnDown(evt:egret.TouchEvent):void
        {
            if(this.type == 2) {
                if(this._sheet == null) {
                    this.a.texture = this.data.getResource(1);
                }
                else {
                    this.a.texture = this._sheet.getTexture('1');
                }
            } else {
                if(this._sheet == null) {
                    this.a.texture = this.data.getResource(1);
                }
                else {
                    this.a.texture = this._sheet.getTexture('1');
                }
            }
            this.invalidate();
        }

        private btnUp(evt:egret.TouchEvent):void
        {
            if(this._sheet==null)
            {
                this.a.texture = this.data.getResource(0);
            }
            else {
                this.a.texture = this._sheet.getTexture('0');
            }
  
            this.invalidate();
        }
        private btnOutSide(evt:egret.TouchEvent): void
        {
            if(this._sheet == null) {
                this.a.texture = this.data.getResource(0);
            }
            else {
                this.a.texture = this._sheet.getTexture('0');
            }
            this.invalidate();
        }
        
        private btnClick(evt:egret.TouchEvent): void 
        {
            var sound:egret.Sound = RES.getRes(this.sound);
            if(sound)sound.play();
            if(this._callback2!=null && this.enabled){
                    this._callback2(evt);
            }
            this.invalidate();
        }

        public draw():void
        {
            if(this.a==null)
            {
                return;
            }else{

                if(!this.contains(this.a)) {
                    this.addChildAt(this.a,0);

                }
            }


            super.draw();
            if(this._lable != null)
            {
                this.addChild(this._lable);
                this.autoLableSize();
            }
        }
        public  setCallback(fun:Function):void
        {
            this._callback2 = fun;
        }
        public dispose():void
        {
            this.data = null;
            if(this._callback2)
            {
                this._callback2 = null;
            }
            if(this.a)
            {
                if(this.a.parent)this.a.parent.removeChild(this.a);
                this.a.texture = null;
                this.a = null;
            }
            
            if(this._icon)
            {
                if(this._icon.parent)this._icon.parent.removeChild(this._icon);
                this._icon.dispose();
                this._icon = null;
            }
            if(this._lable)
            {
                if(this._lable.parent)this._lable.parent.removeChild(this._lable);
                this._lable.dispose();
                this._lable = null;
            }
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.btnDown,this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END,this.btnUp,this);
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.btnClick,this);
            this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.btnOutSide,this);
        }


    }
}
