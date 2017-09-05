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

	export class Actions{
		/**
		 * 特殊状态：复活
		 */ 
		public static RELIVE:number = -1;
		/**
		 * Stop 停止
		 * */
		public static Stop:number=8; 
		/**
		 * Run 跑动
		 * */
		public static Run:number=1;
		/**
		 * Sing 施法攻击
		 * */
		public static Sing:number=2;
		/**
		 * Attack 物理攻击
		 * */
		public static Attack:number=2;
		/**
		 * 弓箭攻击
		 * */
		public static BowAtk:number=3;
		
		/**
		 * 坐下
		 */ 
		public static Sit:number = 4;
		
		/**
		 * 死亡
		 */ 
		public static Die:number = 5;
		
		/**
		 * 拾取
		 */ 
		public static Pickup:number = 6;
		
		/**
		 * 被攻击
		 */
		public static BeAtk:number = 7;
		
		/**
		 * 等待（备战）
		 */ 
		public static Wait:number = 8;

		
		public constructor(){
		}
	}
}