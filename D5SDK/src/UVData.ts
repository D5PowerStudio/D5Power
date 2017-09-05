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
     * 用于处理UI素材的贴图数据
     * 本数据仅供D5BitmapUI使用
     * D5Rpg中的贴图数据直接调用Json中的uv对象，未进行结构化
     */ 
	export class UVData{
    	/**
    	 * 贴图的偏移坐标
    	 */ 
		public offX:number = 0;
		/**
		 * 贴图的偏移坐标
		 */ 
		public offY:number = 0;
		
		/**
		 * 贴图宽度
		 */ 
		public width:number = 0;
		/**
		 * 贴图高度
		 */ 
		public height:number = 0;
		/**
		 * 贴图uv
		 */ 
		public u:number;
        /**
         * 贴图uv
         */
		public v:number;
		/**
		 * 素材宽度
		 */ 
		public w:number;
		/**
		 * 素材高度
		 */ 
		public h:number;
		/**
		 * 贴图的起始坐标
		 */ 
        public x: number;
        /**
         * 贴图的起始坐标
         */ 
        public y: number;
		
        /**
         * 格式化数据
         */ 
		public format(data:any):void{
			this.offX = parseInt(data.offX);
			this.offY = parseInt(data.offY);
			this.width = parseInt(data.width);
			this.height = parseInt(data.height);
			
			this.u = <number><any> (data.u);
			this.v = <number><any> (data.v);
			this.w = <number><any> (data.w);
			this.h = <number><any> (data.h);
            this.x = <number><any> (data.x);
            this.y = <number><any> (data.y);
		}
	}
}