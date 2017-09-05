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
	export class D5CDdisplayer extends d5power.D5Component{
    	
    	public static CIRCLE:number = 0;
    	public static RECT:number = 1;
		public constructor() {
            super();
            this.alpha = 0.8;
            this.setSize(60,60);
		}
        private  _mode:number = 0;
        private  _cd:number;
        private  _cding:boolean;
        private  _startX:number;
        private  _startY:number;
        private  _progressLen:number;
        private  _progressMax:number;
        
        private  _startTime:number;
        private  _lastRender:number;
        private  _renderSpeed:number;
        
        private  _color:number = 0;
        //private  _alpha:number = 0.5;
        private  _drawPath:Array<any>;
        
        public setMode(v:number):void
        {
            this._mode = v;
        }
       
        public  setColor(v:number):void
        {
            this._color = v;
        }
        
         public  setAlpha(value:number):void
        {
            this.alpha = value;
        }
        
        /**
        * 是否正在CD
        */ 
        public  get cding():boolean
        {
            return this._cding;
        }
        
        public  setSize(w:number, h:number):void
        {
            super.setSize(w,h);
            this._progressMax = (w+h)*2;
            this._startX = w>>1;
            this._startY = h>>1;
            this._drawPath = [[(w>>1),0,0],[w,0,(w>>1)],[w,h,(w>>1)+h],[0,h,(w>>1)+h+w],[0,0,(w>>1)+h+h+w],[(w>>1),0,(w+h)*2]];
        }
        
        /**
        * 开始CD
        * @param	v	CD时间，单位秒
        */ 
        public  startCD(v:number):void
        {
            this._cd = v*1000;
            this._cding = true;
            this._startTime = egret.getTimer();
            this._progressLen = 0;
            
            if(v<2)
                {
                this._renderSpeed = 20;
            }else if(v<6){
                this._renderSpeed = 40;
            }else if(v<10){
                this._renderSpeed = 100;
            }else if(v<30){
                this._renderSpeed = 150;
            }else if(v<120){
                this._renderSpeed = 200;
            }else{
                this._renderSpeed = 800;
            }
            
            this.graphics.clear();
            this.graphics.beginFill(this._color,this.alpha);
            this.graphics.drawRect(0,0,this.width,this.height);
            this.addEventListener(egret.Event.ENTER_FRAME,this.render,this);
        }
        private render(e: Event = null): void
        {
            if(this._mode == D5CDdisplayer.CIRCLE)
            {
                this.renderCircle();
            }
            else 
            {
                this.renderRect();
            }
        }
        private renderCircle(e: Event = null): void
        {
            var t: number = egret.getTimer();
            var checker: number = t - this._lastRender;
            if(checker < this._renderSpeed) return;
            checker = t - this._startTime;
            if(checker >= this._cd) {
                this.removeEventListener(egret.Event.ENTER_FRAME,this.render,this);
                this._cding = false;
                this.graphics.clear();
                return;
            }
            this._progressLen = checker*360 / this._cd;

            this.graphics.clear();
            this.graphics.beginFill(this._color,this.alpha);
            this.graphics.moveTo(this._startX,this._startY);

            var angle: number;
            for(var i: number = 0;i < this._progressLen;i+=5)
            {
                angle = i * Math.PI / 180;
                this.graphics.lineTo(this._startX + this._startX * Math.sin(angle),this._startY - this._startY * Math.cos(angle));
            }
            this.graphics.lineTo(this._startX,this._startY);
            this.graphics.endFill();
            this._lastRender = t;
        }
        
        private  renderRect(e:Event=null):void
        {
            var t:number = egret.getTimer();
            var checker:number = t-this._lastRender;
            if(checker<this._renderSpeed) return;
            checker = t - this._startTime;
            if(checker>=this._cd)
                {
                this.removeEventListener(egret.Event.ENTER_FRAME,this.render,this);
                this._cding = false;
                this.graphics.clear();
                return;
            }
            this._progressLen = this._progressMax*(checker/this._cd);
            
            this.graphics.clear();
            if(this._color == 0xffffff)
            {
                this.graphics.beginFill(0x000000,0.1);
			    this.graphics.drawRect(0,0,this.width,this.height);
			    this.graphics.endFill();
            }
            this.graphics.beginFill(this._color,this.alpha);
            this.graphics.moveTo(this._startX,this._startY);
            
            var nowX:number = -1;
            var nowY:number = -1;
            
            for(var i:number=0;i<6;i++)
            {
                if(i<4 && this._progressLen>this._drawPath[i+1][2]) continue;
                if(nowX==-1)
                    {
                    switch(i)
                        {
                        case 0:
                        nowX = this._drawPath[i][0]+this._progressLen;
                        nowY = this._drawPath[i][1];
                        break;
                        case 1:
                        nowX = this._drawPath[i][0];
                        nowY = this._drawPath[i][1]+this._progressLen-this._drawPath[i][2];
                        break;
                        case 2:
                        nowX = this._drawPath[i][0]-this._progressLen+this._drawPath[i][2];
                        nowY = this._drawPath[i][1];
                        break;
                        case 3:
                        nowX = this._drawPath[i][0];
                        nowY = this._drawPath[i][1]-this._progressLen+this._drawPath[i][2];
                        break;
                        case 4:
                        nowX = this._drawPath[i][0]+this._progressLen-this._drawPath[i][2];
                        nowY = this._drawPath[i][1];
                        break;
                    }
                    this.graphics.lineTo(nowX,nowY);
                }else{
                    this.graphics.lineTo(this._drawPath[i][0],this._drawPath[i][1]);
                }
            }
            this.graphics.lineTo(this._startX,this._startY);
            this.graphics.endFill();
            
            this._lastRender = t;
        }
        
	}
}
