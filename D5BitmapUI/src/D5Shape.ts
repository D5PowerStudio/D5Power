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
/**
 * Created by Administrator on 2015/8/28.
 */
module d5power {
    /**
     *
     * @author
     *
     */
    export class D5Shape extends D5Component
    {
        protected _workMode:number = 0;
        /**
         * 工作模式矩形
         */
        public static RECT:number = 0;
        /**
         * 工作模式圆
         */
        public static CIRCLE:number = 1;
        
        /**
		 * 自定义填充
		 */ 
		public static CUSTOM:number = 2;

        private _fillColor:number;

        private _tickNess:number = 0;

        private _color:number;

        private _offX:number = 0;

        private _offY:number = 0;

        private _radius:number = 0;

        private _points:Array<string>;

        private _maskName:string = '';

        private _waitTime:number;
        
        public drawAlpha:number = 1;

        public lineAlpha:number = 1;

        private _round_0:number = 0;

		private _round_1:number = 0;

		private _round_2:number = 0;

		private _round_3:number = 0;

		private _round:string;
        
        public constructor(autoInit:boolean=true)
        {
            super();
        }

        private _staticTex:egret.RenderTexture;
        public saveStatic():void
        {
            if(this._staticTex)
            {
                this._staticTex.dispose();
            }
            this._staticTex = new egret.RenderTexture();
            this._staticTex.drawToTexture(this);
            this.graphics.clear();
            this.removeChildren();
            this.addChild(new egret.Bitmap(this._staticTex));
        }
        
        public set pointString(value:string)
		{
			this._points = value.split(',');
			this.invalidate();
		}
        
        public set maskName(value:string)
        {
            this._maskName = value;
            this._waitTime = egret.getTimer();
			this.addEventListener(egret.Event.ENTER_FRAME,this.waitMasker,this);
        }

        public get round():string
		{
			return this._round ? this._round : '';
		}

		public set round(r:string)
		{
			if(r==null || r=='null') r = '0';
			r = r.replace(/'/g,'');
			var v:number;
			if(r.indexOf(' ')==-1)
			{
				v = parseInt(r);
				if(v<0) v = 0;
				this._round_0 = this._round_1 = this._round_2 = this._round_3 = v;
				this._round = v+'';
			}else{
				var arr:Array<string> = r.split(' ');
				switch(arr.length)
				{
					case 2:
						v = parseInt(arr[0]);
						if(v<0) v = 0;
						this._round_0 = this._round_1 = v;
						v = parseInt(arr[1]);
						if(v<0) v = 0;
						this._round_2 = this._round_3 = v;
						this._round = arr[0]+' '+arr[1];
						break;
					case 3:
						v = parseInt(arr[0]);
						if(v<0) v = 0;
						this._round_0 = v;

						v = parseInt(arr[1]);
						if(v<0) v = 0;
						this._round_1 = v;

						v = parseInt(arr[2]);
						if(v<0) v = 0;
						this._round_2 = this._round_3 = v;

						this._round = arr[0]+' '+arr[1]+' '+arr[2];
						break;
					default:
						for(var i:number=0;i<4;i++)
						{
							v = parseInt(arr[i]);
							if(v<0) v = 0;
							this['_round_'+i]  = v;
						}
						this._round = arr[0]+' '+arr[1]+' '+arr[2]+' '+arr[3];
						break;
				}
			}

			this.draw();
		}

        private waitMasker(e:egret.Event):void
        {
            if(egret.getTimer()-this._waitTime>5000)
			{
				this.removeEventListener(egret.Event.ENTER_FRAME,this.waitMasker,this);
				return;
			}
			if(this.parent && this._maskName!='' && this._maskName && this.parent.getChildByName(this._maskName)!=null)
			{
				this.parent.getChildByName(this._maskName).mask = this;
				this.removeEventListener(egret.Event.ENTER_FRAME,this.waitMasker,this);
			}
        }

        public draw():void
        {
            this.graphics.clear();
            const rk = Math.PI/180;

            this._fillColor>=0 &&  this.graphics.beginFill(this._fillColor,this.drawAlpha);
            this._tickNess>=0 && this.graphics.lineStyle(this._tickNess, this._color,this.lineAlpha);

            switch(this._workMode)
            {
                case D5Shape.RECT:
                    if (this._round_0 == this._round_1 && this._round_1==this._round_2 && this._round_2==this._round_3){
                        this.graphics.drawRoundRect(this._offX, this._offY, this._w, this._h,this._round_0);
                    }else if(this._round_0!=0 || this._round_1!=0 || this._round_2!=0 || this._round_3!=0)
					{
                        var p:egret.Point = new egret.Point(this._offX,this._offY);
                        this.graphics.moveTo(p.x, p.y);
                        this.graphics.drawArc(p.x + this._round_0, p.y + this._round_0, this._round_0, 180*rk,270*rk);
                        p.x += this._w - this._round_1;
                        this.graphics.lineTo(p.x, p.y);
                        this.graphics.drawArc(p.x, p.y + this._round_1, this._round_1, -90*rk, 0);
                        p.x += this._round_1;
                        p.y += this._h - this._round_3;
                        this.graphics.lineTo(p.x, p.y);
                        this.graphics.drawArc(p.x - this._round_3, p.y, this._round_3, 0, 90*rk);
                        p.x -= this._w - this._round_2;
                        p.y += this._round_3;
                        this.graphics.lineTo(p.x, p.y);
                        this.graphics.drawArc(p.x, p.y - this._round_2, this._round_2, 90 * rk, 180 * rk);
					}else{
						this.graphics.drawRect(this._offX,this._offY,this._w,this._h);
					}
                    this.graphics.endFill();
                    break;
                case D5Shape.CIRCLE:
                    this.graphics.drawCircle(this._offX,this._offY,this._radius);
                    this.graphics.endFill();
                    break;
                case D5Shape.CUSTOM:
					var temp:Array<string>;
					var tempX:number;
					var tempY:number;
					for(var i:number = 0;i<this._points.length;i++)
					{
						temp = this._points[i].split('_');
						tempX = parseInt(temp[0]);
						tempY = parseInt(temp[1]);
						if(i==0)
						{
							this.graphics.moveTo(tempX,tempY);
						}
						else
						{
							this.graphics.lineTo(tempX,tempY);
						}
					}
                    this.graphics.endFill();
                    break;
            }
            super.draw();
        }

        /**
         *填充颜色
         */
        public get fillColor():number
        {
            return this._fillColor;
        }

        /**
         * @private
         */
        public setFillColor(value:number):void
        {
            if(this._fillColor == value)return;
            this._fillColor = value;
            this.invalidate();
        }

        /**
         * 线条粗细，0为不显示线条
         */
        public get tickNess():number
        {
            return this._tickNess;
        }

        /**
         * @private
         */
        public  setTickNess(value:number):void
        {
            if(this._tickNess == value)return;
            this._tickNess = value;
            this.invalidate();
        }

        /**
         * 线条颜色
         */
        public get color():number
        {
            return this._color;
        }

        /**
         * @private
         */
        public  setColor(value:number):void
        {
            if(this._color == value)return;
            this._color = value;
            this.invalidate();
        }

        /**
         * 偏移坐标x,y
         */
        public get offX():number
        {
            return this._offX;
        }

        /**
         * @private
         */
        public  setOffX(value:number):void
        {
            if(this._offX == value)return;
            this._offX = value;
            this.invalidate();
        }

        /**
         * 偏移坐标x,y
         */
        public get offY():number
        {
            return this._offY;
        }

        /**
         * @private
         */
        public setOffY(value:number):void
        {
            if(this._offY == value)return;
            this._offY = value;
            this.invalidate();
        }

        public get drawWidth():number
        {
            return this._w;
        }
        
        public clone():D5Shape
        {
            
            if(!this._staticTex)
            {
                var obj:D5Shape = new D5Shape();
                obj._workMode = this._workMode;
                obj._fillColor = this._fillColor;
                obj._tickNess = this._tickNess;
                obj._color = this._color;
                obj._offX = this._offX;
                obj._offY = this._offY;
                obj._radius = this._radius;
                obj.round = this._round;
                obj.setSize(this._w,this._h);
                obj.drawAlpha = this.drawAlpha;
                obj.invalidate();
            }else{
                var obj:D5Shape = new D5Shape(false);
                obj.setSize(this._staticTex.textureWidth,this._staticTex.textureHeight);
                obj.addChild(new egret.Bitmap(this._staticTex));
            }
            
            return obj;
        }

        public setDrawWidth(value:number):void
        {
            if(this._w == value)return;
            this._w = value;
            this.invalidate();
        }

        public get drawHeight():number
        {
            return this._h;
        }

        public setDrawHeight(value:number):void
        {
            if(this._h == value)return;
            this._h = value;
            this.invalidate();
        }
        

        public get radius():number
        {
            return this._radius;
        }

        public setRadius(value:number):void
        {
            if(this._radius == value)return;
            this._radius = value;
            this.invalidate();
        }

        public get workMode():number
        {
            return this._workMode;
        }

        public setWorkMode(value:number):void
        {
            if(this._workMode == value)return;
            this._workMode = value;
            this.invalidate();
        }
        public dispose():void
        {
            this.graphics.clear();
        }


    }
}
