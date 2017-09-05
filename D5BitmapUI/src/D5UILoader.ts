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
 * Created by Administrator on 2015/9/1.
 */
module d5power {
    export class D5UILoader extends egret.Sprite implements IUserInfoDisplayer,IProBindingContainer {
        public  _realWidth:number=0;
        public  _realHeight:number=0;
        public  _flyX:number=0;
        public  _flyY:number=0;

        protected _uiSrc:string;
        private _bindingList:Array<any>;
        public constructor() {
            super();
        }
        public addBinder(obj:IProBindingSupport):void
        {
            if(this._bindingList==null) this._bindingList = new Array<any>();
            this._bindingList.push(obj);
        }
        public setup(url:String):void
        {
            this.removeChildren();
            RES.getResByUrl(this._uiSrc,this.LoadComplete,this);
        }
        private LoadComplete(data:any):void
        {
            if(data) {
                d5power.D5Component.getComponentByURL(data,this);
            }
            if(this.stage)
            {
                this.flyPos();
            }else{
                this.addEventListener(egret.Event.ADDED_TO_STAGE,this.flyPos,this);
            }
        }
        public dispose():void
        {
            this.stage.removeEventListener(egret.Event.RESIZE,this.autoFly,this);
            if(this.parent)this.parent.removeChild(this);
        }
        private flyPos(e:egret.Event=null):void
        {
            if(e!=null) this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.flyPos,this);
            if(D5Component.proBindingSource && this._bindingList)
            {
                D5Component.proBindingSource.addDisplayer(this);
                this.stage.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.autoDispose,this);
                this.update();
            }
            if(this._flyX!=0 && this._flyY!=0) this.stage.addEventListener(egret.Event.RESIZE,this.autoFly,this);
            this.autoFly();
        }
        private autoFly(e:egret.Event=null):void
        {
            this.x = this._flyX==1 ? (this.stage.stageWidth-this._realWidth) : (this._flyX==.5 ? (this.stage.stageWidth-this._realWidth) >> 1 : (this.stage.stageWidth*this._flyX));
            this.y = this._flyY==1 ? (this.stage.stageHeight-this._realHeight) : (this._flyY==.5 ? (this.stage.stageHeight-this._realHeight) >> 1 : (this.stage.stageHeight*this._flyY));
        }
        private autoDispose(e:Event):void
        {
            this.stage.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.autoDispose,this);
            trace("[D5UILoader] ",name,' 自动释放');
            if(D5Component.proBindingSource && this._bindingList)
            {
                D5Component.proBindingSource.removeDisplayer(this);
                this._bindingList = null;
            }

            this.stage.removeEventListener(egret.Event.RESIZE,this.autoFly,this);
        }

        public update():void
        {
            if(this._bindingList)
            {
                var ui:IProBindingSupport;
                for(var i:number = 0;i<this._bindingList.length;i++)
                {
                    ui = this._bindingList[i];
                    ui.update();
                }
            }
        }
        public get width():number
        {
            return this._realWidth;
        }

        public get height():number
        {
            return this._realHeight;
        }

    }
}