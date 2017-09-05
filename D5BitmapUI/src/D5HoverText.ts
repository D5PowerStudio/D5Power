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

	export class D5HoverText extends D5Text{
		/**
		 * 鼠标经过颜色
		 */ 
		private _hoverColor:number = 0;
		/**
		 * 鼠标经过透明度
		 */ 
		private _hoverAlpha:number;
		/**
		 * 鼠标经过是否提示
		 */ 
		private _hover:boolean;
		
		/**
		 * 是否选定状态
		 */ 
		private _isHover:boolean;

		/**
		 *数据
		 */
		private _data:any;
		
		public static lastHover:D5HoverText;
		
		public get className():string{
			return 'D5HoverText';
		}

		public constructor(_text:string='', fontcolor:number=-1, bgcolor:number=-1, border:number=-1, size:number=12){
			super(_text, fontcolor, bgcolor, border, size);
			this.touchChildren = true;
			this.touchEnabled = true;
		}
		
		public init(e:Event=null):void{
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onMouse,this);
			this.addEventListener(egret.TouchEvent.TOUCH_END,this.onMouse,this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this);
		}
		
		private onRemove(e:Event):void{
			this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onMouse,this);
			this.removeEventListener(egret.TouchEvent.TOUCH_END,this.onMouse,this);
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this);
		}
		
		/**
		 * 设置状态
		 */ 
		public setHover(colorV:number,alphaV:number):void{
			this._hover = true;
			this._hoverColor = colorV;
			this._hoverAlpha = alphaV;
			this.unhover();
			
			if(!this.hasEventListener(egret.TouchEvent.TOUCH_BEGIN)){
				this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onMouse,this);
				this.addEventListener(egret.TouchEvent.TOUCH_END,this.onMouse,this);
				this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this);
			}
		}
		
		public hover():void{
			if(!this._hover) return;
			D5HoverText.lastHover = this;
			this.graphics.clear();
			this.graphics.beginFill(this._hoverColor,this._hoverAlpha);
			this.graphics.drawRect(0,0,this._w,this._h);
			this.graphics.endFill();
			this._isHover = true;
		}
		
		public unhover():void{
			if(!this._hover) return;
			this.graphics.clear();
//			this.graphics.beginFill(this._hoverColor,0);
//			this.graphics.drawRect(0,0,this._textField.width,this._textField.height);
//			this.graphics.endFill();
			
			this._isHover = false;
		}
		
		public get isHover():boolean{
			return this._isHover;
		}
		
		public onMouse(e:egret.TouchEvent):void{
			switch(e.type){
				case egret.TouchEvent.TOUCH_BEGIN:
					this.hover();
					break;
				case egret.TouchEvent.TOUCH_END:
					this.unhover();
					break;
			}
		}
		public setData(data:any):void
		{
			this._data = data;
		}
		public get data():any
		{
			return this._data;
		}
	}
}