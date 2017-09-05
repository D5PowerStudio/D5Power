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

	export class D5Swf extends D5Component implements ISpriteSheetWaiter
    {
		public _src:string;
		public _zoom:number;
		private _drager:egret.Shape;
		protected _loadID:number=0;
		public _spriteSheet:IDisplayer;
		protected _monitor:egret.Bitmap;
		private _lastRender:number;

		private _playFrame:number=0;

		public constructor(){
			super();
			this._monitor = new egret.Bitmap();
			this._zoom = 1;
		}
		
		public setSrc(src:string):void{
			this._src = src;
            this.addParticle();
		}
		public get loadID():number
		{
			return this._loadID;
		}
		public setEditorMode():void{
			if(!this._drager){
				this._drager = new egret.Shape();
				this._drager.graphics.beginFill(Math.random()*0xffffff,.5);
				this._drager.graphics.drawRect(-20,-20,40,40);
				this._drager.graphics.endFill();
			}
			
			this.addChild(this._drager);
		}

        private addParticle():void
        {
			this._loadID++;
			D5SpriteSheet.getInstance(this._src+'.png',this);
			//RES.getResByUrl(this._src+'.png', this.onTextureComplete, this);
        }
		public onSpriteSheepReady(data:IDisplayer):void
		{
			if (this._spriteSheet) this._spriteSheet.unlink();
			this._spriteSheet = data;
			if(!this.contains(this._monitor)) this.addChild(this._monitor);
			this.onLoadComplate();
			this.addEventListener(egret.Event.ENTER_FRAME, this.runAction, this);
		}
		private runAction(e:egret.Event):void
		{
			if(egret.getTimer()-this._lastRender<this._spriteSheet.renderTime) return;
			this._lastRender = egret.getTimer();
			var direction:number = 0;
			this._monitor.texture = this._spriteSheet.getTexture(direction,this._playFrame);
			if(this._spriteSheet.uvList)
			{
				this._monitor.x = this._spriteSheet.uvList[direction*this._spriteSheet.totalFrame+this._playFrame].offX;
				this._monitor.y = this._spriteSheet.uvList[direction*this._spriteSheet.totalFrame+this._playFrame].offY;
			}
			else
			{
				this._monitor.x = this._spriteSheet.gX;
				this._monitor.y = this._spriteSheet.gY;
			}

			this._playFrame++;
			if(this._playFrame>=this._spriteSheet.totalFrame) this._playFrame=0;
		}

		public setZoom(value:number){
			if(this._zoom==value) return;
			this._zoom = value;
			this.invalidate();
		}
		
		private onLoadComplate():void
        {
			//if(this._w==0){
			//	this._w = data.width;
			//	this._h = data.height;
			//}
			if(this._drager) this.addChild(this._drager);
			this.invalidate();
			this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
		}
		
		public draw():void
        {
			if(this._zoom!=1) this.scaleX = this.scaleY = this._zoom;
			
			this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
		}
		public dispose():void
		{
            if(this._monitor)
            {
                if(this._monitor.parent)this._monitor.parent.removeChild(this._monitor);
                this._monitor.texture = null;
                this._monitor = null;
            }
            this._spriteSheet = null;
		}
	}
}