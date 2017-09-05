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
	export interface IDisplayer {
		/**
		 * 渲染

		render():void;
		/**
		 * 更换素材

		change(f:string,onloaded:Function=null,frame:number=-1,framebak:Function=null):void;
		/**
		 * 是否循环动作

		loop:void
		/**
		 * 更换动作接口

		action:void;
		/**
		 * 更换方向接口

		direction:void;
		
		/**
		 * 获得位图显示对象

		monitor:egret.DisplayObject
		
		shadow:egret.Shape;
		
		renderDirection:number;
		
		effectDirection:number
		
		playFrame:number;
		
		totalFrame:number;
		/**
		 * 重置播放帧数

		resetFrame():void;

        dispose();
         */
        getTexture(dir:number,frame:number):egret.Texture;
        setup(res:string):void;
        unlink():void;
        name:string;
        renderTime:number;
        totalFrame:number;
        totalDirection:number;
        shadowX:number;
        shadowY:number;
		uvList:Array<any>;
        /**
         * 重心坐标X
         */
        gX:number;
        /**
         * 重心坐标Y
         */
        gY:number;
        /**
         * 帧宽
         */
        frameWidth:number;
        /**
         * 帧高
         */
        frameHeight:number;
	}
}