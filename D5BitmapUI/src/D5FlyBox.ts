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

	export class D5FlyBox extends D5Component
    {
		public static LEFT:number = 0;
		public static CENTER:number = 1;
		
		private _maxWidth:number = 0;
		private _usedWidth:number = 0;
		private _usedHeight:number = 0;
		private _paddingx:number = 5;
		private _paddingy:number = 5;
		
		private _align:number = 0;
		
		/**
		 * 提供给编辑器使用的背景
		 */ 
		private _editorBG:egret.Shape;
		
		/**
		 * 原始X坐标
		 */ 
		private _zerox:number = 0;


		/**
		 * @pararm	w	最大的自动换行宽度
		 */ 
		public constructor()
        {
            super();
		}
		
		/**
		 * 设置对齐模式
		 */ 
		public setMode(values:number):void
        {
			this._align = values;
			this.redraw();
		}
		
		public setX(value:number):void
        {
//			super.x = value;
			this._zerox = this.x;
		}

		
		public setPaddingx(num:number = 0):void
        {
			this._paddingx = num;
			this.redraw();
		}
		
		public setPaddingy(num:number = 0):void
        {
			this._paddingy = num;
			this.redraw();
		}
		
		public getPaddingx():number
        {
			return this._paddingx;
		}
		
		public getPaddingy():number
        {
			return this._paddingy;
		}
		
		/**
		 * 设置最大宽度，当内容超过最大宽度后，即会自动换行
		 */ 
		public setMaxWidth(w:number = 0):void
        {
			this._maxWidth = w;
			this.redraw();
		}
		
		public get maxWidth():number{
			return this._maxWidth;
		}
		
		public get $maxWidth():number{
			return this._maxWidth;
		}

        public parseToXML():string
        {
            var result:string = "<D5FlyBox name='"+this.name+"' x='"+this.x+"' y='"+this.y+"' maxWidth='"+this._maxWidth+"'/>\n";
            return result;
        }

		public setEditorMode():void{
			if(this._editorBG!=null) return;
			this._editorBG = new egret.Shape();
			this.addChild(this._editorBG);
			this.updateEditorBG();
		}
		
		private _lastModTime:number;
		public addChild(child:egret.DisplayObject):egret.DisplayObject{
			var obj:egret.DisplayObject = super.addChild(child);
			obj.addEventListener(egret.Event.RESIZE,this.redraw,this);
			this._lastModTime = egret.getTimer();
			if(!this.hasEventListener(egret.Event.ENTER_FRAME)) this.addEventListener(egret.Event.ENTER_FRAME,this.redraw,this);
			
			return obj;
		}
		
		public removeChild(child:egret.DisplayObject):egret.DisplayObject{
			var obj:egret.DisplayObject = super.removeChild(child);
			obj.removeEventListener(egret.Event.RESIZE,this.redraw,this);
			this._lastModTime = egret.getTimer();
			if(!this.hasEventListener(egret.Event.ENTER_FRAME)) this.addEventListener(egret.Event.ENTER_FRAME,this.redraw,this);

			return obj;
		}
		
		private redraw(e:Event=null):void{
			var t:number = egret.getTimer();
			if(t-this._lastModTime<100) return;
			this.removeEventListener(egret.Event.ENTER_FRAME,this.redraw,this);

			this._usedWidth = 0;
			this._usedHeight = 0;
			var obj:egret.DisplayObject;
			
			var perMaxHeight:number = 0;
			for(var i:number = 0,j:number=this.numChildren;i<j;i++){
				obj = this.getChildAt(i);
				
				if(this._usedWidth+obj.width>this._maxWidth){
					this._usedHeight+=perMaxHeight+this._paddingy;
					perMaxHeight = 0;
					this._usedWidth = 0;
				}
				
				obj.x = this._usedWidth;
				obj.y = this._usedHeight;
				
				
				perMaxHeight = perMaxHeight < obj.height ? obj.height : perMaxHeight;

				this._usedWidth+=obj.width+this._paddingx;
			}
			
//			if(this._align==D5FlyBox.CENTER){
//				super.x = parseInt((this._maxWidth-this._w)>>1)+this._zerox;
//			}
			this.setSize(this._maxWidth,this._usedHeight+perMaxHeight)
			
			if(this._editorBG!=null) this.updateEditorBG();
			this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
		}
	
		
		private updateEditorBG():void{
			 this._editorBG.graphics.clear();
			 this._editorBG.graphics.lineStyle(1,0);
			 this._editorBG.graphics.beginFill(0xffffff,.5);
			 this._editorBG.graphics.drawRect(0,0,this._maxWidth,this._usedHeight<20 ? 20 : this._usedHeight);
			 this._editorBG.graphics.endFill();
		}
		
	}
}