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

module d5power{

	export class D5List extends D5Component{
		private _list:Array<egret.DisplayObjectContainer>;
		private _content:D5VBox;
		private _selected:egret.DisplayObjectContainer;
		
		public _blockW:number = 0;
		public _blockH:number = 0;
		public _textColor:number = 0;
		public _hoverColor:number = 0;
		public _hoverAlpha:number;
		public _fontSize:number = 0;
		
		public _stage:egret.Stage;
		
		public get className():string{
			return 'D5List';
		}

		public constructor(){
			super();
			this.setupListener();
		}
		
		public drawBackground(background:number,alpha:number=1,line:number=0):void{
			this.graphics.beginFill(background,alpha);
			this.graphics.lineStyle(1,line);
			this.graphics.drawRect(0,0,this._blockW,this.height);
			this.graphics.endFill();
		}
		
		/**
		 * 设置列表样式
		 * 
		 * @param	blockW		每个区块的宽度
		 * @param	blockH		每个区块的高度
		 * @param	textColor	字体颜色
		 * @param	hoverColor	鼠标经过颜色
		 * @param	hoverAlpha	鼠标经过透明度
		 * @param	textSize	字体大小
		 */ 
		public setFormat(blockW:number,blockH:number,textColor:number,hoverColor:number,hoverAlpha:number=1.0,textSize:number=12):void{
			this._blockW = blockW;
			this._blockH = blockH;
			this._textColor = textColor;
			this._hoverColor = hoverColor;
			this._hoverAlpha = hoverAlpha;
			this._fontSize = textSize;
			this.flushFormat();
		}
		
		public setblockW(value:number = 0){
			this._blockW = value;
			this.flushFormat();
		}

		public set blockW(v:number)
		{
			this._blockW = v;
			this.flushFormat();
		}

		public set blockH(v:number)
		{
			this._blockH = v;
			this.flushFormat();
		}

		public get blockW():number
		{
			return this._blockW;
		}

		public get blockH():number
		{
			return this._blockH;
		}

		public get count():number
		{
			return this._list.length;
		}
		
		public dispose():void{
			if(this.parent)this.parent.removeChild(this);
			this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this);
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this);
			this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAdd,this);
		}

		private _beginX:number;
		private _beginY:number;
		private onBegin(e:egret.TouchEvent):void
		{
			this._beginX = e.stageX;
			this._beginY = e.stageY;
		}
		
		public addStuff(lable:any,data:any):void{
			var lab:egret.DisplayObjectContainer;
			
			if(lable instanceof egret.DisplayObjectContainer){
				lab = <egret.DisplayObjectContainer><any> lable;
				lab.name = data.toString();		
			}else{
				if(!(typeof(lable) == "string")) lable = lable.toString();
				
				lab = new D5HoverText(lable,0xffffff);
				if(this._blockW>0){
    				this.flushFormatDoing(<D5HoverText><any> lab);
				}else{
					//(<D5HoverText><any> lab).autoGrow();
					(<D5HoverText><any> lab).setHover(this._hoverColor,this._hoverAlpha);
					(<D5HoverText><any> lab).autoGrow();
				}
				
				(<D5HoverText><any> lab).setData(data);
				
			}
			this._list.push(lab);
			this._content.addChild(lab);
		}
		
		public removeStuffByIndex(index:number = 0):void{
			if(index>=this._list.length) return;
			var lab:egret.DisplayObjectContainer = this._list[index];
			if(this._content.contains(lab)) this._content.removeChild(lab);
			this._list.splice(index,1);
		}
		
		public removeAllStuff():void{
			while(this._list.length) this.removeStuffByIndex(0);
			this._selected = null;
		}
		
		public getIndex(obj:egret.DisplayObjectContainer):number
		{
			return this._list.indexOf(obj);
		}
		
		public get height():number{
			var p:number = (<D5VBox><any> (this._content)).padding;
			return this._list.length>0 ? this._list.length*(this._list[0].height+p)-p+this._content.y*2 : 0;
		}
		
		/**
		 * 当前选择的值
		 */ 
		public get value():any{
			if(this._selected==null) return null;
			
			if(this._selected instanceof D5HoverText){
				return (<D5HoverText><any> (this._selected)).data;
			}else{
				return this._selected.name;
			}
		}
		
		public get lable():string{
			if(this._selected==null) return '';
			
			if(this._selected instanceof D5HoverText){
				return (<D5HoverText><any> (this._selected)).text;
			}else{
				return this._selected.toString();
			}
		}
		
		public get index():number{
			return this._list.indexOf(this._selected);
		}
		
		private setupListener():void{
			this._list = [];
			this._content = new D5VBox();
			this._content.x = this._content.y = 4;
			this.addChild(this._content);
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this);
			this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this);
//			addEventListener(Event.ADDED_TO_STAGE,onAdd);
		}
		
		private onMove(e:egret.TouchEvent):void{
			var t:egret.DisplayObjectContainer = this.getUnderMouse(e.stageX,e.stageY);
			if(t==null) return;
			
			
			if(t instanceof D5HoverText){
				if(!(<D5HoverText><any> t).isHover && t!=this._selected){
					if(this._selected && this._selected instanceof D5HoverText) (<D5HoverText><any> (this._selected)).unhover();
					(<D5HoverText><any> t).hover();
					this._selected = t;
				}
			}else{
				
			}
			
		}
		private onClick(e:egret.TouchEvent):void{
			if(e.stageX!=this._beginX || e.stageY!=this._beginY) return;
			
			var t:egret.DisplayObjectContainer = this.getUnderMouse(e.stageX,e.stageY);
			if(t){
				this._selected = t;
				this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
			}
			
			if(D5HoverText.lastHover){
			    D5HoverText.lastHover.unhover();
			    D5HoverText.lastHover=null;
			}
		}
		private onAdd(e:Event):void{
			this._stage = this.stage;
		}
		private onStageClick(e:egret.TouchEvent):void{
			if(this.parent && this.stage){
				if(e.target == this)return;
				this.parent.removeChild(this);
				if(this.stage)this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onStageClick,this);
			}
		}
		
		private getUnderMouse(px:number,py:number = 0):egret.DisplayObjectContainer{
			var length:number = this._list.length;
			for(var i:number = 0;i < length;i++){
				var t:egret.DisplayObjectContainer = this._list[i];
				if(t.hitTestPoint(px,py)){
					return t;
				}
			}
			return null;
		}
		
		public flushFormat():void{
			var length:number = this._list.length;
			for(var i:number = 0;i < length;i++){
				var t:D5HoverText = <D5HoverText><any>this._list[i];
				this.flushFormatDoing(t);
			}
		}
		
		private flushFormatDoing(t:D5HoverText):void
		{
		    t.setSize(this._blockW-this._content.x*2,this._blockH);
			t.setTextColor(this._textColor);
			t.setHover(this._hoverColor,this._hoverAlpha);
			t.setFontSize(this._fontSize);
		}
	}
}