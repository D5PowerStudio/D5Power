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

		private static BASIC_CONTENT:string = '0123456789';
        private data:D5UIResourceData;
        private _align: number = 0;
        private _box: D5HBox;
        private _autoAdd:boolean;
        private _keepLength:number=0;
        private _displayer:Array<egret.Bitmap>;
        private _nowValue:number = 0;
		private _targetValue:number = 0;
		private _lastrender:number = 0;
		private _string_map:string='';
		private _value:string='';

		

		private _hasPoint:boolean;
		private _allowPoint:boolean;
		private _edge:number;
		private _perWidth:number=0;
		
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
            this._box.setPadding(0);
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
                trace("[D5Button]No Resource in lib:"+name);
                return;
			}
			
			this._perWidth = this.data.getResource(0).textureWidth;
			this._hasPoint = this.data.extData && this.data.extData.indexOf('.')!=-1
			this._string_map = D5BitmapNumber.BASIC_CONTENT+(this.data.extData);
		}

		private getNumber(value:string):string
		{
			return value.replace(/[^.0123456789]/ig,'');
		}

		public setValue(v:string):void
		{
			var len: number = v.length;
			if(len>0 && this._value.length!=v.length)
			{
				var bitmap:egret.Bitmap;
				if(len>this._displayer.length){
    			    // 需要新增
        			   for(var i:number=this._displayer.length;i<len;i++){
						   bitmap = D5BitmapNumber.getBitmap();
						   bitmap.width = this._perWidth;
            			   this._displayer.push(bitmap);
            			   this._box.addChild(bitmap);
        			   }
    			}else{
    			    // 需要减少
					while(this._displayer.length>len){
						bitmap = this._displayer.pop();
						this._box.removeChild(bitmap);
						D5BitmapNumber.back2Pool(bitmap);
					}
				}
				
				this._w = len*this._perWidth;
    			
    			switch(this._align)
                {
                    case D5Text.CENTER:
                    this._box.x = -this._w >> 1;
                    break;
                    case D5Text.RIGHT:
                    this._box.x = -this._w-this._perWidth;
                    break;
                }
			}
			
			this._allowPoint = v.indexOf('.')!=-1 && this._hasPoint;
			this._edge = this._allowPoint ? 0.01 : 1;


			if(this.getNumber(this._value)==this.getNumber(v))
			{
				if(this._value!=v) this.drawNumber(v);
				this._value = v;
				return;
			}

			this._value = v;
			if(!this.data) return;

			
            if(!this._autoAdd)
			{
    			this.drawNumber(v);
			}else{
				this._targetValue = Number(this.getNumber(v));
				this.cacheAsBitmap=false;
				this.addEventListener(egret.Event.ENTER_FRAME,this.autoAddRender,this);
			}
		}
		
		private drawNumber(str:string):void
		{
		    var pnumber: string;
		    var bitmap:egret.Bitmap;
			var len:number = str.length;
			var i:number;
			if(this._keepLength!=0)
			{
				var totalZero:String='';
				for(i=len;i<this._keepLength;i++) totalZero+='0';
				str = totalZero+str;
				len = this._keepLength;
			}
			
            for(var i: number = 0;i < len;i++){
				pnumber = str.substr(i,1);
				var id:number = this._string_map.indexOf(pnumber);
                this._displayer[i].texture = id==-1 ? null : this.data.getResource(id);
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

			if(Math.abs(this._targetValue-this._nowValue)<this._edge)
			{
				this._nowValue = this._targetValue;
				this.drawNumber(this._value);
				this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
				this.autoCache();
				return;
			}
			
			// 避免小数转整后相同而导致的渲染
			if(parseInt(<string><any>this._nowValue)==parseInt(<string><any>nowOld)) return;
			this.drawNumber(Math.floor(this._nowValue)+'');

			if(!this._allowPoint && Math.floor(nowOld)==Math.floor(this._nowValue)) return;
			this.drawNumber((this._allowPoint ? this._nowValue.toFixed(2) : Math.floor(this._nowValue)).toString());
		}
	}
}
