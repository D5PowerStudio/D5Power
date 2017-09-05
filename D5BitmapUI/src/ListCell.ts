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
    export class ListCell extends egret.Sprite
    {
        private text:d5power.D5Text;

        private loop:d5power.D5MirrorLoop;

        private _id:number;

        public constructor()
        {
            super();
        }

        public setBtnID(id:number):void
        {
            this._id = id;
        }

        public get btnID():number
        {
           return this._id;
        }

        public showCell(w:number,msg:string):void
        {
            this.touchEnabled = true;

            this.loop = new d5power.D5MirrorLoop();
            this.loop.setSkin('loop0');
            this.loop.setSize(w,0);
            this.addChild(this.loop);

            this.text = new d5power.D5Text();
            this.text.setWidth(w);
            this.text.setFontSize(5);
            this.text.setTextColor(0xff0000);
            this.text.setText(msg);
            this.addChild(this.text);

        }

        public dispose():void
        {
            if(this.text.parent)  this.text.parent.removeChild( this.text);
            this.text = null;

            if(this.loop.parent) this.loop.parent.removeChild(this.loop);
            this.loop = null;
        }

    }
}
