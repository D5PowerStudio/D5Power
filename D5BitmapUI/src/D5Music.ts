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
    export class D5Music extends D5Component
    {
        /**
         * 标签，舞台是否被点击过
         */
        private static _stageClicked:boolean;
        /**
         * 音乐地址
         */
        private _src:string;
        /**
         * 自动播放
         */
        private _autoPlay:boolean;
        /**
         * 是否循环
         */
        private _loop:boolean;
        /**
         * 声音对象
         */
        private _sound:egret.Sound;

        /**
         * 驻留
         */
        private _keep:boolean;
        /**
         * 声音通道，用于声音控制
         */
        private _sound_c:egret.SoundChannel;
        /**
         * 当前正在播放的音乐地址
         */
        private _nowPlay:string;
        /**
         * 标签，是否正在加载中
         */
        private _isLoading:boolean;

        /**
         * 状态，是否正在播放中
         */
        private _isPlaying:boolean;

        public constructor()
        {
            super();
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.dispose,this);
        }

        public dispose():void
        {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.dispose,this);
            super.dispose();
            if(this._sound_c)
            {
                this._sound_c.stop();
                this._sound_c = null;
            }

            if(this._sound)
            {
                this._sound.close();
                this._sound = null;
            }

            if(this.parent) this.parent.removeChild(this);
        }

        public set keep(v:boolean)
        {
            if(v) this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.dispose,this);
        }

        /**
         * 设置循环（只写）
         * 本参数设置时不会自动进行播放，请使用play方法主动播放
         */
        public set loop(v:boolean)
        {
            this._loop = v;
        }

        /**
         * 设置声音地址（只写）
         */
        public set src(v:string)
        {
            this._src = v;
            this.invalidate();
            this.checkAuto();
        }

        /**
         * 设置自动播放
         */
        public set autoPlay(v:boolean)
        {
            this._autoPlay = v;
            this.checkAuto();
        }

        public stop():void
        {
            this._nowPlay = '';
            this._isPlaying = false;
            if(this._sound_c==null) return;
            this._sound_c.stop();
            this._sound_c = null;
        }
        
        /**
         * 开始播放
         */
        public play(callback:Function=null,thisobj:any=null,begin:number=0):void
        {
            this._isPlaying = true;
            var that:D5Music = this;
            // 若播放的文件相同，且已经在播放了，则重新开始，并重置循环状态
            if(this._nowPlay==this._src && this._sound_c)
            {
                this._sound_c.stop();
                if(this._sound) this._sound_c = this._sound.play(this._loop?0:1);

                return;
            }
            // 多播放地址不相同，则重置
            if(this._sound_c!=null && this._nowPlay!=this._src)
            {
                this._sound_c.stop();
                this._sound.close();

                this._sound_c = null;
                this._sound = null;
            }

            this._nowPlay = this._src;
            this._sound = new egret.Sound();
            this._sound.once(egret.Event.COMPLETE,function loadOver(e:egret.Event):void{
                that._isLoading = false;
                // 若加载完成后，播放地址发生了变化，则重新尝试新的播放
                if(that._src!=that._nowPlay)
                {
                    that._sound.close();
                    that._sound = null;
                    // 若在加载期间调用了stop方法，则一下代码不会运行
                    if(that._isPlaying) that.play();
                    return;
                }
                if(that.parent || that.keep)
                {
                    that._sound_c = that._sound.play(0,that._loop?0:1);
                    that._sound_c.once(egret.Event.SOUND_COMPLETE,function(e:egret.Event):void{
                        if(callback!=null) callback.apply(thisobj);
                    },this);
                }else if(that._sound){
                    that._sound.close();
                }
            },this);

            this._sound.once(egret.IOErrorEvent.IO_ERROR,function loadError(e:egret.IOErrorEvent):void{
                trace('[D5Music] sound load error');
            },this);

            this._isLoading = true;
            this._sound.load(this._nowPlay);
        }

        private onAdded(e:egret.Event):void
        {
            this.stage.once(egret.TouchEvent.TOUCH_TAP,this.play,this);
        }

        /**
         * 自动播放检测
         */
        private checkAuto():void
        {
            if(this._src!=null && this._src!='' && this._autoPlay)
            {
                if(D5Music._stageClicked)
                {
                    this.play();
                }else if(this.stage){
                    this.onAdded(null);
                }else{
                    this.once(egret.Event.ADDED_TO_STAGE,this.onAdded,this);
                }
            }
        }

    }
}