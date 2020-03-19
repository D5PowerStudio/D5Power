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
    export class D5Component extends egret.Sprite 
    {
        public static UIPostion:string = 'd5power_uiposition';
        private static _actionList:Array<D5Component>=[];
        private static _actionTimer:egret.Timer;
        private static _actionRunning:boolean=false;

        protected static addAction(target:D5Component,conf:any):void
        {
            
            if(!this._actionRunning) setTimeout(this.actionRener,20);
        }

        protected static actionRener():void
        {
            D5Component._actionRunning = true;
            var o:D5Component;
            for(var i:number=0;i<D5Component._actionList.length;i--)
            {
                o = D5Component._actionList[i];
                if(!o._actionConf)
                {
                    D5Component._actionList.splice(i,1);
                }else{
                    o.action();
                    if(o._actionConf.done) D5Component._actionList.splice(i,1);
                }
            }

            if(D5Component._actionList.length) setTimeout(this.actionRener,20);
        }

        public static MOVE_NUMBER:number = 10;
		public static MOVE_NONE:number = 0;
		public static MOVE_LEFT:number = 1;
		public static MOVE_RIGHT:number = 2;
		public static MOVE_DOWN:number = 3;
		public static MOVE_UP:number = 4;
		public static MOVE_ALPHA:number = 5;
        public static autoRelease:boolean=false;
        private static _preloadList:any = {};

        protected _w:number;
        protected _h:number;
        protected _nowName:string;
        /**
         * 移动速度
         */
        protected _speed:number = 2;
        /**
         * 旋转速度
         */
        protected _rspeed:number = 1;
        /**
         * 缩放速度
         */
        protected _xspeed:number = 0.05
        /**
         * 动作配置
         */
        protected _actionConf:any;
        /**
         * 归属，用于判断加载进度
         */
        protected _belone:string;
        protected _moveAction:number = 0;
        /**
         * 对齐模式
         */
        protected _marginMode:number;
        /**
         * 相对坐标
         */
        protected _relx:number;
        /**
         * 相对坐标
         */
        protected _rely:number;
        
        /**
         * 对齐目标
         */
        protected _margin_target:string
        

		public get moveAction():number
		{
			return this._moveAction;
		}

		public set moveAction(value:number)
		{
			this._moveAction = value;
		}
        /**
         * 动画顺序
         */
        public animationIndex:number;
        /**
         * 携带数据
         */
        public extdata:any;
		public startX:number;
		public startY:number;
		private static _me:D5Component;
		public static get me():D5Component
		{
			if(D5Component._me==null) D5Component._me = new D5Component();
			return D5Component._me;
		}
        public constructor()
        {
            super();
            if(D5Component.autoRelease) this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.dispose,this);
        }
        private static _moveList:Array<any> = [];
		
		public static addMoveList(target:D5Component):void
		{
			D5Component._moveList.push(target);
			if(!D5Component.me.hasEventListener(egret.Event.ENTER_FRAME))D5Component.me.addEventListener(egret.Event.ENTER_FRAME,this.onMoveUI,this);
		}
		private static onMoveUI(e:egret.Event):void
		{
			var obj:D5Component
			for(var i:number=D5Component._moveList.length-1;i>=0;i--)
			{
				obj = D5Component._moveList[i];
//				if((obj.x==obj.startX && obj.y==obj.startY &&obj.moveAction != D5Component.MOVE_ALPHA)||(obj.alpha==1&&obj.moveAction == D5Component.MOVE_ALPHA))
//				{
//					D5Component._moveList.splice(i,1);
//					continue;
//				}
				switch(obj.moveAction)
				{
					case D5Component.MOVE_LEFT:
						obj.x+= (obj.startX - obj.x)/5;
                        if(Math.ceil(obj.x) >= obj.startX) 
                        {
                            obj.x = obj.startX;
                            D5Component._moveList.splice(i,1);
                        }
						break;
					case D5Component.MOVE_RIGHT:
						obj.x-= (obj.x - obj.startX)/5;
                        if(Math.floor(obj.x) <= obj.startX) 
                        {
                            obj.x = obj.startX;
                            D5Component._moveList.splice(i,1);
                        }
						break;
					case D5Component.MOVE_UP:
						obj.y+= (obj.startY - obj.y)/5;
                        if(Math.ceil(obj.y) >= obj.startY) 
                        {
                            obj.y = obj.startY;
                            D5Component._moveList.splice(i,1);
                        }
						break;
					case D5Component.MOVE_DOWN:
						obj.y-=  (obj.y - obj.startY)/5;
                        if(Math.floor(obj.y) <= obj.startY) 
                        {
                            obj.y = obj.startY;
                            D5Component._moveList.splice(i,1);
                        }
						break;
					case D5Component.MOVE_ALPHA:
						obj.alpha+=(1 - obj.alpha)/5;
                        if(Math.abs(1 - obj.alpha) <= 0.01) 
                        {
                            obj.alpha = 1;
                            D5Component._moveList.splice(i,1);
                        }
						break;
				}
			}
			if(D5Component._moveList.length==0)D5Component.me.removeEventListener(egret.Event.ENTER_FRAME,this.onMoveUI,this);
        }

        /**
         * 让组件播放动画
         * @param conf 处理的参数x,y,loop
         */
        public go(conf:any):void
        {
            if(!this._actionConf) this._actionConf={x:this.x,y:this.y,sx:this.x,sy:this.y,posdone:true,loop:false,done:false};
            for(var k in conf) this._actionConf[k] = conf[k];
            
            if(this.x+this.y!=this._actionConf.x+this._actionConf.y) this._actionConf.posdone = false;
        }
        
        /**
         * 动画实现
         */
        protected action():void
        {
            if(this._actionConf.posdone)
            {
                var angle:number = Math.atan2(this._actionConf.y-this.y,this._actionConf.x-this.x);
                var speed:number;

                var target:number = this._actionConf.x;
                if(this.x!=target)
                {
                    speed = this._speed*Math.cos(angle);
                    this.x = Math.abs(this.x-target)<this._speed ? target : speed+this.x ;
                }

                target = this._actionConf.y;
                if(this.y!=this._actionConf.y)
                {
                    speed = this._speed*Math.sin(angle);
                    this.y = Math.abs(this.y-target)<this._speed ? target : speed+this.y ;
                }

                if(this.x==this._actionConf.x && this.y==this._actionConf.y)
                {
                    if(this._actionConf.loop)
                    {
                        this._actionConf.x = this._actionConf.sx;
                        this._actionConf.y = this._actionConf.sy;
                        this._actionConf.x = this.x;
                        this._actionConf.y = this.y;
                    }else{
                        this._actionConf.posdone = true;
                    }
                }
            }

            if(this._actionConf.posdone) this._actionConf.done = true;
        }
		
        /**
		 * 将与自己同容器，且在自己范围内的对象纳入自己的自对象，形成一个整体
		 * 
		 * @param   e   
		 * @param   skip    不进行合并的对象
         * @param   contain 必然进行合并的对象
		 */
		public add2Me(e:egret.Event=null,skip:Array<any>=null,contain:Array<any>=null):void
		{
			if(parent==null)
			{
				this.addEventListener(egret.Event.ADDED_TO_STAGE,this.add2Me,this);
				return;
			}
			if(e) this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.add2Me,this);
			var rect:egret.Rectangle = new egret.Rectangle(this.x,this.y,this.width,this.height);
			var arr:Array<egret.DisplayObject> = [];
			var _root:egret.DisplayObjectContainer = this.parent;
			for(var i:number=_root.numChildren-1;i>=0;i--)
			{
                var obj:any = _root.getChildAt(i);
                if(skip && skip.indexOf(obj)!=-1) continue;
				if(obj!=this)
				{
					if(rect.contains(obj.x,obj.y) || (contain!=null && contain.indexOf(obj)!=-1))
					{
						obj.x = obj.x-this.x;
						obj.y = obj.y-this.y;
						arr.push(obj);
					}
				}
			}
			
			for(i=arr.length-1;i>=0;i--)
			{
				this.addChild(arr[i]);
            }
            
            //this.parent.setChildIndex(this,0);
        }
        
        public setSkin(name:string):void
        {
            
        }
        protected static _pro_binding_source:IUserInfoContainer;
        /**
         * 属性绑定目标
         */
        public static setproBindingSource(obj:IUserInfoContainer):void
        {
            this._pro_binding_source = obj;
        }

        public static  get proBindingSource():IUserInfoContainer
        {
            return this._pro_binding_source;
        }

        public setSize(w:number,h:number):void
        {
            this._w = w;
            this._h = h;
            this.invalidate();
        }
        public get nowName():string
        {
            return this._nowName;
        }
        public get width():number
        {
            return this._w;
        }
        public get height():number
        {
            return this._h;
        }

        public static getComponentByURL(res:string,container:egret.DisplayObjectContainer,onPre:Function=null):void
        {
            var onLoaded:Function = function(obj:any)
            {
                var arr:Array<any> = obj.uiList;
                var length:number = arr.length;
                var comObj:any;
                var uiObj:D5Component;
                var src:string;
                var list:Array<any>=[];
                container['_realWidth'] = parseInt(obj.width);
                container['_realHeight'] = parseInt(obj.height);
                container['_flyX'] = obj.flyx;
                container['_flyY'] = obj.flyy;
                if(container['drawBg'] && <string>obj.bgImg!='')
                {
                    container['drawBg'](obj.bgImg);
                }
                
                for(var i:number = 0;i < length;i++)
                {
                    comObj = arr[i];
                    uiObj = D5Component.getCompoentByJson(comObj,container);
                    src = comObj.file;
                    if(src && D5UIResourceData.getData(src)==null)
                    {
                        uiObj._belone = res;
                        list.push(uiObj);
                    }else{
                        src = comObj.src;
                        if(src && D5UIResourceData.getData(src)==null)
                        {
                            uiObj._belone = res;
                            list.push(uiObj);
                        }
                    }

                    
                    container.addChild(uiObj);
                }

                if(list.length)
                {
                    D5Component._preloadList[res]=[list,onPre,container];
                }else{
                    if(onPre) onPre.apply(container,[0]);
                }
                
            }
            
            RES.getResByUrl(res,onLoaded,null,RES.ResourceItem.TYPE_JSON);
        }

        protected loadResource(name:string,callback:Function,thisobj:any):void
        {
            RES.getResByUrl(name,callback,thisobj,RES.ResourceItem.TYPE_IMAGE);
        }

        public static getCompoentByJson(value:any,container:egret.DisplayObjectContainer):any
        {
            var com:D5Component;
            switch(value.Class)
            {
                case "D5Window":
                    com = new d5power.D5Window();
                    (<D5Window>com).x1 = parseInt(value.x1);
                    (<D5Window>com).y1 = parseInt(value.y1);
                    (<D5Window>com).x2 = parseInt(value.x2);
                    (<D5Window>com).y2 = parseInt(value.y2);
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width,value.height);
                    var arr:Array<any> = value.uiList;
                    var length:number = arr.length;
                    var comObj:any;
                    for(var i:number = 0;i < length;i++)
                    {
                        comObj = arr[i];
                        com.addChild(this.getCompoentByJson(comObj,container));
                    }
                    if(container) container[com.name] = com;
                    break;
                case "D5MirrorBox":
                    com = new d5power.D5MirrorBox();
                    com.name = value.name;
                    (<D5MirrorBox>com).cutX = parseInt(value.cutX);
                    (<D5MirrorBox>com).cutY = parseInt(value.cutY);
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width,value.height);
                    var arr:Array<any> = value.uiList;
                    var length:number = arr.length;
                    var comObj:any;
                    for(var i:number = 0;i < length;i++)
                    {
                        comObj = arr[i];
                        com.addChild(this.getCompoentByJson(comObj,container));
                    }
                    if(container) container[com.name] = com;
                    break;
                case "D5Button":
                    com = new d5power.D5Button();
                    (<D5Button>com).type = parseInt(value.type);
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    (<D5Button>com).setSound(value.soundDown)
                    com.x = value.x;
                    com.y = value.y;
                    (<D5Button>com).setIcon(value.icon)
                    var callback_String:string = value.listener;
                    if(value.lable&&value.lable!='')
                    {
                        (<D5Button>com).setLable(value.lable);
                    }
                    if(callback_String!='' && callback_String!='null' && callback_String!=null && container!=null)
                    {
//                        if(container.hasOwnProperty(callback_String))
//                        {
//                        (<D5Button>com).setCallback(container[callback_String]);
//                        }else{
//                            trace("[D5Component] 未在"+container+"中发现所需要的按钮响应函数"+callback_String);
//                        }
                        (<D5Button>com).setCallback(container[callback_String]);
                    }
                    if(container) container[com.name] = com;
                    break;
                case "D5MirrorLoop":
                    com = new d5power.D5MirrorLoop();
                    com.name = value.name;
                    (<D5MirrorLoop>com)._mode = value.workmode;
                    (<D5MirrorLoop>com)._cutSize = value.cutsize;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width,value.height);
                    if(container) container[com.name] = com;
                    break;
                case "D5Lib":
                    com = new d5power.D5Lib();
                    com.name = value.name;
                    (<D5Lib>com).init(value.src);
                    com.x = value.x;
                    com.y = value.y;
                    if(value.rotation!=0) com.rotation = value.rotation;
                    if(value.zoom) com.scaleX = com.scaleY = value.zoom;
                    if(container) container[com.name] = com;
                    break;
                case "D5Bitmap":
                    com = new d5power.D5Bitmap();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    (<d5power.D5Bitmap>com).script = value.script;
                    if(value.anchor!='')
                    {
                        com.anchorOffsetX = value.width*value.anchor;
                        com.anchorOffsetY = value.height*value.anchor;
                    }
                    com.x = value.x;
                    com.y = value.y;
                    if(value.rotation!=0) com.rotation = value.rotation;
                    if(value.zoom) com.scaleX = com.scaleY = value.zoom;
                    if(container) container[com.name] = com;
                    break;
                case "D5RadioBtn":
                    com = new d5power.D5RadioBtn();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    if(value.group!=null && value.group!='') (<D5RadioBtn>com).groupName=value.group;
                    if(value.lable&&value.lable!='')
                    {
                        (<D5RadioBtn>com).setLable(value.lable);
                    }
                    if(container) container[com.name] = com;
                    break;
                case "D5FlyBox":
                    com = new d5power.D5FlyBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    (<D5FlyBox>com).setMaxWidth((<number>value.maxWidth));
                    if(container) container[com.name] = com;
                    break;
                case "D5HBox":
                    com = new d5power.D5HBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    if(container) container[com.name] = com;
                    break;
                case "D5VBox":
                    com = new d5power.D5VBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    if(container) container[com.name] = com;
                    break;
                case "D5Text":
                    com = new d5power.D5Text(value.textValue=='文字' ? '' : value.textValue,value.fontColor,-1,value.filterColor,value.fontSize);
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width,value.height);
                    (<D5Text>com).setType(value.type);
                    (<D5Text>com).setTextAlign(value.alignType);
                    (<D5Text>com).setFontBold((<boolean>value.bold));
                    (<D5Text>com).setBgColor(value.bgColor);
                    (<D5Text>com).setLtBorder(value.ltColor);
                    (<D5Text>com).setRbBorder(value.rbColor);
                    (<D5Text>com).setWrapFlg(value.wrapType);
                    (<D5Text>com).setIsPassword(value.password=='1' ? true : false);
                    (<D5Text>com).setTextID((value.textID).toString());
                    (<D5Text>com)._binding = value.binding;
                    if(container) container[com.name] = com;
                    if(container && <IProBindingContainer><any>container && (<D5Text>com)._binding!='') (<IProBindingContainer><any>container).addBinder(<D5Text>com);
                    break;
                case "D5ImageBox":
                    com = new d5power.D5ImageBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width,value.height);
                    (<D5ImageBox>com).showNum(<boolean>value.shownum);
                    (<D5ImageBox>com).setLogo((value.bg).toString());
                    if(container) container[com.name] = com;
                    break;
                case "D5ButtonGroup":
                    com = new d5power.D5ButtonGroup();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    var arr:Array<any> = value.uiList;
                    var length:number = arr.length;
                    var comObj:any;
                    for(var i:number = 0;i < length;i++)
                    {
                        comObj = arr[i];
                        com.addChild(this.getCompoentByJson(comObj,container));
                    }
                    if(container) container[com.name] = com;
                    break;
                case "D5Swf":
                    com = new d5power.D5Swf();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    (<D5Swf>com).setSrc(value.src);
                    if(container) container[com.name] = com;
                    break;
                case "D5BitmapNumber":
                    com = new d5power.D5BitmapNumber();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    //(<D5BitmapNumber>com).setPadding(value.src);
                    (<D5BitmapNumber>com).setAlign(value.align);
                    (<D5BitmapNumber>com).setValue('0');
                    if(container) container[com.name] = com;
                    break;
                case "D5Shape":
                    com = new d5power.D5Shape();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    (<D5Shape>com).drawAlpha = value.fillAlpha==null ? 1 : value.fillAlpha;
                    (<D5Shape>com).lineAlpha = value.tickNessAlpha==null ? 1 : value.tickNessAlpha;
                    (<D5Shape>com).setWorkMode(value.workMode);
                    (<D5Shape>com).setFillColor(value.fillColor);
                    (<D5Shape>com).setTickNess(value.tickNess);
                    (<D5Shape>com).setColor(value.color);
                    (<D5Shape>com).setOffX(value.offX);
                    (<D5Shape>com).setOffY(value.offY);
                    (<D5Shape>com).setSize(value.width,value.height);
                    (<D5Shape>com).setRadius(value.radius);
                    (<D5Shape>com).maskName = value.maskName;
                    (<D5Shape>com).pointString = value.pointString;
                    if(container) container[com.name] = com;
                    break;
                case "D5Loop":
                
                    com = new D5Loop(value.workmode,value.cutsize1,value.cutsize2);
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    com.setSkin(value.file);
                    com.setSize(value.width,value.height);
                    if(container) container[com.name] = com;
                    break;
                case "D5Music":
                    com = new D5Music();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    (<D5Music>com).loop = value.loop=='1';
                    (<D5Music>com).src = value.src;
                    (<D5Music>com).autoPlay = value.autoPlay=='1';
                    (<D5Music>com).keep = value.keep=='1';
                    if(container) container[com.name] = com;
                    break;
            }
            com.startX = value.x;
            com.startY = value.y;
            var scalex:number = Number(value.scalex);
            var scaley:number = Number(value.scaley);
            if(!isNaN(scalex) && scalex!=1.0) com.scaleX = scalex;
            if(!isNaN(scaley) && scaley!=1.0) com.scaleY = scaley;
            com.moveAction = parseInt(value.moveAction);
            com._marginMode = parseInt(value.margin_mode);
			if(com._marginMode!=0)
			{
                com.setRelPos(Number(value.relx),Number(value.rely),value.margin_target);
            }
            return com;
        }

        /**
         * 设置相对坐标
         * @param px 
         * @param py 
         * @param margin_target 
         */
        protected setRelPos(px:number,py:number,margin_target:string):void
        {
            if(isNaN(px) || isNaN(py)) return;
            this._relx = px;
            this._rely = py;
            this._margin_target = margin_target;

            if(margin_target!=null && margin_target!='' && margin_target!='null')
            {
                var target:D5Component;
				if(this._margin_target!=null && this._margin_target!='')
				{
					target = <D5Component>this.parent.getChildByName(this._margin_target);
					if(target) target.removeEventListener(D5Component.UIPostion,this.autoFllowPos,this);
				}
				
				this._margin_target = margin_target;
				var waitBegin:number = egret.getTimer();
                var lastWait:number = waitBegin;
                var that:D5Component = this;
				var cancleWait:Function = function(e:Event=null):void
				{
					this.removeEventListener(egret.Event.ENTER_FRAME,wait,this);
					this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,cancleWait,this);
				}
				var wait:Function = function(e:Event=null):void
				{
					var t:number = egret.getTimer();
					if(t-lastWait<500) return;
					if(t-waitBegin>5000)
					{
						cancleWait();
						return;
					}
					lastWait = t;
					target = <D5Component>this.parent.getChildByName(this._margin_target);
					if(target)
					{
						cancleWait();
						target.addEventListener(D5Component.UIPostion,this.autoFllowPos,this);
						var evt:egret.Event = new egret.Event(egret.Event.ACTIVATE);
						this.autoFllowPos(evt);
					}
				}
				
				this.addEventListener(egret.Event.ENTER_FRAME,wait,this);
				this.addEventListener(egret.Event.REMOVED_FROM_STAGE,cancleWait,this);
            }
        }

        protected autoFllowPos(e:egret.Event=null):void
        {
            if(!parent) return;
			if(e==null)
			{
				// 舞台对齐
				this.x = Math.floor(this._relx*(this.parent.width));
				this.y = Math.floor(this._rely*(this.parent.height));
			}else{
				var target:D5Component = <D5Component> (e.type==egret.Event.ACTIVATE ? this.parent.getChildByName(this._margin_target) : e.currentTarget);
				if(target)
				{
					this.x = target.x+this._relx+(this._relx>0 ? target.width*target.scaleX : (this._relx<0 ? -this.width*this.scaleX : 0));
					this.y = target.y+this._rely+(this._rely>0 ? target.height*target.height : (this._rely<0 ? -this.height*this.scaleY : 0));
				}
			}
        }
        
        $setX(v:number):boolean
        {
            this.dispatchEvent(new egret.Event(D5Component.UIPostion));
            return super.$setX(v);
        }

        public dispose():void
        {
            
        }

        protected invalidate():void
        {
            this.once(egret.Event.ENTER_FRAME, this.draw,this);
        }

        public draw():void
        {
            this.invalidateSize();
            this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
        }
        
        public invalidateSize(): void 
        {
            if(this._belone){
                var target:Array<any> = D5Component._preloadList[this._belone];
                if(!target) return;
                var list:Array<any> = target[0];
                var callback:Function = target[1];
                var thisobj:any = target[2];

                var index:number = list.indexOf(this);
                if(index!=-1)list.splice(index,1);
                callback.apply(thisobj,[list.length]);

                if(!list.length) delete D5Component._preloadList[this._belone];
                this._belone=null;
            }
        }
        

        protected autoCache():void
        {
            this.cacheAsBitmap=false;
            this.once(egret.Event.ENTER_FRAME, this.onAutoCache,this);
        }

        private onAutoCache(event:Event):void
        {
            this.cacheAsBitmap=true;
        }

    }
}