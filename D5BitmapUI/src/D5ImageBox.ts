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

module d5power {

    export class D5ImageBox extends D5MirrorBox {
        private _url: string;

        private spr: egret.Sprite;

        private _name: string;

        protected _logo: egret.Bitmap;
        /**
         * 物品数量
         */
        protected _itemNum: number;
        /**
         * 是否显示数量
         */
        protected _showNum: boolean = false;
        /**
         * 数量显示器
         */
        protected numShower: D5Text;

        public _id: number;

        public static _resourceLib: any = {};

        public constructor() {
            super();

        }

        private addParticle(): void {
            //外部加载icon，url为全路径，如：resource/..
            RES.getResByUrl(this._url,this.onGroupComplete,this)
        }
        public onGroupComplete(data: egret.Texture): void {
            if(this._logo == null) {
                this._logo = new egret.Bitmap();
            }
            this._logo.texture = data;
            this.addChildAt(this._logo,0);
            this.invalidate();
        }

        /**
         * 设置物品图片
         */
        public setLogo(url: string) {
            if(this.spr == null) {
                this.spr = new egret.Sprite();
                this.addChild(this.spr);
            }

            for(var i: number = 0;i < this.spr.numChildren;i++) {
                var obj: egret.DisplayObject = this.spr.getChildAt(i);
                if(obj.parent) obj.parent.removeChild(obj);
                obj = null;
            }
            if(url != "") {
                this._url = url;
                this.addParticle();
                //this.addEventListener(egret.Event.COMPLETE,this.over,this);
            }
        }
        public removeLogo(): void {
            if(this._logo && this.contains(this._logo)) {
                this.removeChild(this._logo);
                //this._logo = null;
            }
        }
        public draw(): void {
            if(this._logo) {
                this._logo.scaleX = this._w / this._logo.width;
                this._logo.scaleY = this._h / this._logo.height;
                this._logo.fillMode = egret.BitmapFillMode.REPEAT;
            }

            super.draw();
        }

        private over(evt: egret.Event): void {
            this.addParticle();
        }

        /**
         * 设置URL，本功能仅用来保存URL，不会加载地址
         * 如需要加载，请使用logo属性，或者通过logoData直接设置位图数据
         */
        public set url(v: string) {
            this._url = v;
        }
        /**
         * 是否显示数量（例如背包的右下角数据）
         */
        public showNum(b: boolean): void {
            this._showNum = b;
            if(!this._showNum && this.numShower != null && this.contains(this.numShower)) {
                this.removeChild(this.numShower);
                this.numShower = null;
            } else if(this._showNum && this.numShower == null) {
                this.buildNumShower();
            }
        }
        protected buildNumShower(): void {
            if(this.numShower == null) {
                this.numShower = new D5Text('0',0xd4cc75);
                this.numShower.setFontBorder(0x000000);
                this.numShower.setTextAlign(D5Text.RIGHT);
                this.numShower.setSize(50,18);
            }
            this.numShower.x = this._w - this.numShower.width;
            this.numShower.y = this._h - this.numShower.height;
            this.addChild(this.numShower);
        }
        /**
         * 设置数量
         */
        public setNum(v: number): void {
            this._itemNum = v;
            if(this.numShower != null) this.numShower.setText(v.toString());
        }
        /**
         * 获取数量
         */
        public get num(): number {
            return this._itemNum;
        }
        public get id(): number {
            return this._id;
        }

        public setId(value: number): void {
            this._id = value;
        }
        public dispose():void
        {	
            if(this.spr)
			{
				if(this.spr.parent) this.spr.parent.removeChild(this.spr);
				this.spr = null;
			}
			
			if(this._logo)
			{
				
				if(this._logo.parent) this._logo.parent.removeChild(this._logo);
				this._logo.texture = null;
				this._logo = null;
			}
			
			if(this.numShower)
			{
    			if(this.numShower.parent) this.numShower.parent.removeChild(this.numShower);
				this.numShower.dispose();				
				this.numShower = null;
			}
		}
    }
}