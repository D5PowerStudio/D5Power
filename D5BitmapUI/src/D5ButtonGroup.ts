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

	export class D5ButtonGroup extends D5FlyBox
    {
		private _hasDefaultSelected:boolean;
		private items:Array<D5Component>;
		private _itemNum:number = 0;
		

		
		public unsetup(e:egret.Event=null):void{

			this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this._onItemClick,this);
			var length:number = this.items.length;
			for(var i:number = 0;i < length;i++){
				var item:d5power.D5Component = <D5Component>this.items[i];

				if(item.parent) item.parent.removeChild(item);
				item = null;
			}
		}
		
		/**
		 * 构造函数
		 * @param	w	按钮组的容器宽度
		 */ 
		public constructor(w:number=0){
			super();
            this._w = w;
			this._hasDefaultSelected = true;
			this.items = [];
		   this.addEventListener(egret.TouchEvent.TOUCH_TAP,this._onItemClick,this);
		}
		
		/**
		 * 按钮数量
		 */ 
		public setItemNum(num:number = 0){
			this._itemNum = num;
		}
		/**
		 * 按钮数量
		 */ 
		public get itemNum():number{
			return this.items.length;
		}

		
		/**
		 * 是否具备默认选项
		 */ 
		public get hasDefaultSelected():boolean{
			return this._hasDefaultSelected;
		}
		/**
		 * 是否具备默认选项
		 */ 
		public setHasDefaultSelected(value:boolean){
			this._hasDefaultSelected = value;
		}
	
		/**
		 * 向按钮组中增加对象
		 */ 
		public addItem(item:d5power.D5Button):void{
			if(item==null){
				trace("[D5ButtonGroup] 按钮组只能添加按钮对象");
				return;
			}
			this.addChild(item);
			if(this.items.indexOf(item)==-1) this.items.push(item);
		}
		
		public addChild(child:d5power.D5Component):egret.DisplayObject{
			if(!(child instanceof d5power.D5Button)){
                trace("[D5ButtonGroup] 按钮组只能添加按钮对象");
				return null;
			}
			if(this.items.indexOf(child)==-1) this.items.push(child);
			return super.addChild(child);
		}
		
		/**
		 * 从按钮组中移除某对象
		 */ 
		public removeItem(item:d5power.D5Component):void{
			this.removeChild(item);
			if(item.hasEventListener(egret.TouchEvent.TOUCH_TAP)) item.removeEventListener(egret.TouchEvent.TOUCH_TAP,this._onItemClick,this);
		}
		
		/**
		 * 点击事件
		 */ 
		private _onItemClick(e:egret.TouchEvent):void
        {
			var item:d5power.D5Component = <D5Component><any> (e.target);
			if(item!=this._lastSelectedItem)
            {
				
				this._lastSelectedItem = item;
				this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
			} 
			
		}
		
		public getSelectedID():number
        {
			return this.items.indexOf(this._lastSelectedItem);
		}
		
		private _lastSelectedItem:d5power.D5Component;
		
		
		public setEditorMode():void
        {
			this.createBgShape();
		}
		
		/**
		 *此组件默认背景 
		 */
		public createBgShape(w:number=500,h:number=60):void
        {
			
			this.graphics.beginFill(0x3e3e3e);
			this.graphics.drawRect(0,0,w,h);
			this.graphics.endFill();
			this._bgShapeFlg = 1;
		}
		public clearVirtualBackground():void
        {
			this.graphics.clear();
			this._bgShapeFlg = 0;
		}
		
		
		private _bgShapeFlg:number = 0;
		public get bgShapeFlg():number
        {
			return this._bgShapeFlg;
		}
		public set bgShapeFlg(flg:number)
        {
			this._bgShapeFlg = flg;
		}
		public dispose():void
		{
		    this.unsetup();
		}
	}
}