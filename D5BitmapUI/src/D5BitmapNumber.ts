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
	/**
	 *
	 * @author 
	 *
	 */
	export class D5BitmapNumber extends D5Component {

        private data:D5UIResourceData;
        private _align: number = 0;
        private _box: D5HBox;
        private _autoAdd:boolean;
        private _keepLength:number=0;
        private _displayer:Array<egret.Bitmap>;
        private _nowValue:number = 0;
		private _targetValue:number = 0;
		private _lastrender:number = 0;
		
        private static _pool:Array<egret.Bitmap> = [];
        
        private static getBitmap():egret.Bitmap
        {
            if(D5BitmapNumber._pool.length) return D5BitmapNumber._pool.pop();
            return new egret.Bitmap;
        }
        
        private static back2Pool(v:egret.Bitmap):void
        {
            v.texture = null;
            if(v.parent) v.parent.removeChild(v);
            if(D5BitmapNumber._pool.indexOf(v)==-1) D5BitmapNumber._pool.push(v);
        }
        
		public constructor() {
			super();
			
            this._box = new D5HBox();
//            this._box.setPadding(0);
            this._displayer = [];
            this.addChild(this._box);
		}
		
		public setAlign(v:number):void
		{
            this._align = v;
		}
		
		/**
		 * 设置保持长度
		 */
		public keepLength(v:number)
		{
			this._keepLength = v;
		}

		public get nowValue():number
		{
			return this._targetValue;
		}

		public get text():string
		{
			return this._targetValue.toString();
		}
		
		/**
		 * 是否开启自动增长功能
		 */
		public set autoGrow(v:boolean)
		{
			this._autoAdd = v;
		}

        public setSkin(name:string):void
        {
            if(this._nowName == name) return;
            this._nowName = name;
            this.data = D5UIResourceData.getData(name);
            if(this.data==null)
            {
                trace("[D5Button]No Resource"+name);
                return;
            }
		}

		public setValue(v:number):void
		{
            var str: string = v + '';
            var len: number = str.length;
			
			this._targetValue = parseInt(<string><any>v);
            
			this.cacheAsBitmap=false;
            if(!this._autoAdd)
			{
    			this.drawNumber(str);
			}else if(this._targetValue!=this._nowValue){
				this.addEventListener(egret.Event.ENTER_FRAME,this.autoAddRender,this);
			}
		}
		
		private drawNumber(str:string):void
		{
		    var pnumber: string;
		    var bitmap:egret.Bitmap;
		    var len:number = str.length;
		    
		    if(len>0 && this._displayer.length!=str.length && this._keepLength==0)
			{
    			var i:number;
    			var j:number;
    			if(len>this._displayer.length){
    			    // 需要新增
        			   for(i=this._displayer.length;i<len;i++){
            			   bitmap = D5BitmapNumber.getBitmap();
            			   this._displayer.push(bitmap);
            			   this._box.addChild(bitmap);
        			   }
    			}else{
    			    // 需要减少
        			   while(this._displayer.length<=len){
        			       bitmap = this._displayer.pop();
        			       D5BitmapNumber.back2Pool(bitmap);
        			   }
    			}
    			
    			var perW:number = this.data.getResource(0).textureWidth;
    			this._w = len*perW;
    			
    			switch(this._align)
                {
                    case D5Text.CENTER:
                    this._box.x = -this._w >> 1;
                    break;
                    case D5Text.RIGHT:
                    this._box.x = -this._w-perW;
                    break;
                }
			}
		    
            for(var i: number = 0;i < len;i++){
                pnumber = str.substr(i,1);
                bitmap = this._displayer[i];
                bitmap.texture = this.data.getResource(parseInt(pnumber));
            }
		}

        public setPadding(v:number):void
        {
            this._box.setPadding(v);
        }
        
		public dispose():void
		{
		    this.data = null;	    
		    if(this._box)
            {
                if(this._box.parent)this._box.parent.removeChild(this._box);
                this._box.dispose();
        		    this._box = null;
            }
		}
		
		
		private autoAddRender(e:egret.Event):void
		{
			var t:number = egret.getTimer();
			if(t-this._lastrender<30) return;
			this._lastrender = t;
			
			var nowOld:number = this._nowValue;
			this._nowValue+= (this._targetValue-this._nowValue)/5;
			if(Math.ceil(this._nowValue)==this._targetValue)
			{
				this._nowValue = this._targetValue;
				this.removeEventListener(egret.Event.ENTER_FRAME,this.autoAddRender,this);
				this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
				this.autoCache();
			}
			
			// 避免小数转整后相同而导致的渲染
			if(parseInt(<string><any>this._nowValue)==parseInt(<string><any>nowOld)) return;
			this.drawNumber(Math.floor(this._nowValue)+'');
		}
	}
}
