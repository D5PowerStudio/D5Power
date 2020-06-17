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
    export class D5RadioBtn extends D5Component
    {
        private static _radioLib:Array<D5RadioBtn> = [];
        public static disposeLib(group:string,target:D5RadioBtn=null):void
		{
    		var radio:D5RadioBtn;
			for(var i:number = D5RadioBtn._radioLib.length-1;i>=0;i--)
			{
	            radio = D5RadioBtn._radioLib[i];
			    if(target==null || (target===radio) && radio._groupName==group){
			        this._radioLib.splice(i,1);
			    }
			}
		}
		
        private a:egret.Bitmap;

        private data:D5UIResourceData;

        private _selected:boolean = false;

        private _lable:d5power.D5Text;
        
        private _groupName:string;

        public constructor()
        {
            super();
        }
        
        public set groupName(v:string)
        {
            this._groupName = v;
            if(v!=null && v!='' && D5RadioBtn._radioLib.indexOf(this)==-1)
            {
                D5RadioBtn._radioLib.push(this);
            }
        }

        public clone():D5RadioBtn
        {
            var c:D5RadioBtn = new D5RadioBtn();
            c.setSkin(this._nowName);
            return c;
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
        }

        private autoLableSize():void
        {
            if(this._lable==null || this.a==null) return;

            trace(this.a.height,this._lable.height,"左左右右");
//            this._lable.autoGrow();
            this._lable.x = this.a.width;
            this._lable.y = (this.a.height-this._lable.height)>>1;

        }

        public setSelected(value:boolean):void
        {
            if(this._groupName)
            {
                var list:Array<D5RadioBtn> = D5RadioBtn._radioLib;
                for(var i:number = list.length-1;i>=0;i--)
                {
                    if(list[i]!=this && list[i]._groupName==this._groupName)
                    {
                        list[i]._selected = false;
                        list[i].updateFace();
                    }
                }
            }
            this._selected = value;
            this.updateFace();
        }

        public get selected():boolean
        {
            return this._selected;
        }
        
        public set selected(v:boolean)
        {
            this.setSelected(v);
        }

        private updateFace():void
        {
            if(this._selected){
                this.a.texture = this.data.getResource(2);
                this.invalidate();
            }else{
                this.a.texture = this.data.getResource(0);
                this.invalidate();
            }
        }

        public enabled(b:boolean):void
        {
            if(b) {
                this.a.texture = this.data.getResource(0);
            }
            else{
                this.a.texture = this.data.getResource(3);
            }
            this.invalidate();
        }

        public setSkin(name:string):void
        {
            if(this._nowName == name) return;
            this._nowName = name;
            this.data = D5UIResourceData.getData(name);
            if(this.data==null)
            {
                trace("[D5RadioBtn]No Resource"+name);
                return;
            }

            this.a = new egret.Bitmap();
            this.a.texture = this.data.getResource(0);

            this.touchEnabled = true;
            this.enabled(true);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.btnDown,this);
            this.addEventListener(egret.TouchEvent.TOUCH_END,this.btnUp,this);

            this.invalidate();

        }

        private btnDown(evt:egret.TouchEvent):void
        {
            this.a.texture = this.data.getResource(2);
            this.invalidate();
        }

        private btnUp(evt:egret.TouchEvent):void
        {
            this.setSelected(!this._selected);
        }

        public draw():void
        {
            if(this.a==null)
            {

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
        public dispose():void
        {
            if(this.a)
            {
                if(this.a.parent)this.a.parent.removeChild(this.a);
                this.a.texture = null;
                this.a = null;
            }
            if(this._lable)
            {
                if(this._lable.parent)this._lable.parent.removeChild(this._lable);
                this._lable = null;
            }
            this.data = null;
            
            if(this._groupName!=null)
            {
                D5RadioBtn.disposeLib(this._groupName);
            }
        }



    }
}

