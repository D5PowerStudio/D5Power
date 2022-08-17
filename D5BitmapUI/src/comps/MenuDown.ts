namespace d5power
{
	/**
	 *	下拉菜单选项
	 */
	export class MenuDown extends egret.Sprite
	{
		private static _uiconf:string = '{"isLib":0,"Class":"ui","width":100,"y":0,"flyx":"0","uiList":[{"name":"bg","width":100,"margin_mode":0,"margin_right":0,"fillAlpha":1,"margin_target":"","workMode":0,"tickNessAlpha":1,"maskName":"","height":100,"round":null,"pointString":"","scalex":1,"offX":0,"radius":0,"x":0,"scaley":1,"link_then_dispose":0,"relx":"","y":0,"rely":"","offY":0,"moveAction":0,"tickNess":-1,"rotation":0,"Class":"D5Shape","color":0,"linkto":null,"fillColor":3881787}],"autoFix":0,"name":"instance979","className":"","flyy":"0","x":0,"packageName":"","bgImg":"","height":100,"label":"","alignMode":0,"drag":0,"bgColor":0}';
        public static CLICK:string = "MenuDownClick";
		protected _uiSrc:string;
		protected _lineStyle:string;
		protected _arrowStyle:string;
		private _scrollView:egret.ScrollView;
		
		public _realWidth:number=200;
		public _realHeight:number=200;
		public _flyX:number=0;
		public _flyY:number=0;
		/**
		 * 开始滚动的最大条数
		 */
		public beginScroll:number=10;
		public bg:D5Shape;
 
		
		
		private _list:D5List;
		private _son:MenuDown;
		private _conf:Array<any>;
		private _thisobj:any;

		/**
		 * 标准样式配置，包含bg:下拉菜单的背景颜色，line:下拉菜单的边线颜色,bga:背景透明度,linea:边线透明度,color:文字颜色,hover:鼠标经过背景，hovera:鼠标经过透明度,left:左侧边距
		 */
		public static style:any = {bg:0x296c8c,bga:1,hover:0x296c8c,hovera:1,line:0x296c8c,linea:1,color:0xffffff,left:5}
		
		public constructor(thisobj:any,lineStyle:string=null,arrowStyle:string = null,fixedWidth:number=200)
		{
			super();
			this._thisobj = thisobj;
			this._list = new D5List();
			this._list.leftPadding = MenuDown.style.left;
			this._list.lineStyle = MenuDown.style.line;
			this._list.y = 3;
			this._list.setFormat(fixedWidth,28,MenuDown.style.color,MenuDown.style.hover,MenuDown.style.hovera);
            //this._list.addEventListener(egret.Event.CHANGE,this.onHover,this);
			this._list.addEventListener(egret.Event.CHANGE,this.onClick,this);

			this._uiSrc = "resource/ui/menu_down.d5ui.json";
			
			this._lineStyle = lineStyle;
			this._arrowStyle = arrowStyle;
			d5power.D5Component.getComponentByJSON(this._uiSrc,JSON.parse(MenuDown._uiconf),this,this.onPre);
		}

		public setFormat(blockW:number,blockH:number,textColor:number,hoverColor:number,hoverAlpha:number=1.0,textSize:number=12):void
		{
			this._list.setFormat(blockW,blockH,textColor,hoverColor,hoverAlpha,textSize);
		}

		public autoClose(stg:egret.Stage):void
		{
			stg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onStageDown,this);
		}

		private onStageDown(e:egret.TouchEvent):void
		{
			if(!this.hitTestPoint(e.stageX,e.stageY,true))
			{
				this.hidden();
			}
		}

        private onPre(count:number):void
        {
            if(count==0) this.once(egret.Event.ENTER_FRAME,this.onCreate,this);
        }
		
		public get conf():Array<any>
		{
			return this._conf;
		}
		
		public setup(conf:Array<any>,thisobj:any=null):void
		{
			this._conf = conf;
			if(thisobj!=null) this._thisobj = thisobj;
			if(this.bg)
			{
				this._list.cacheAsBitmap = false;
				this._list.removeAllStuff();
				for(var i:number=0,j:number=conf.length;i<j;i++)
				{
					this._list.addStuff(conf[i][0],conf[i][1]);
				}
				this.bg.x = -4;

				this.bg.setTickNess(1);
				this.bg.setFillColor(MenuDown.style.bg);
				this.bg.setColor(MenuDown.style.line);
				this.bg.lineAlpha = MenuDown.style.linea;
				this.bg.drawAlpha = MenuDown.style.bga;

				this.bg.setSize(this._list.blockW + this._list.x * 2 + 12, this._list.height + this._list.y * 2);
                this.addChild(this._list);
				/*
				if(j>this.beginScroll*1.2)
				{
					if(!this._scrollView)
					{
						this._scrollView = new egret.ScrollView;
					}
					this._scrollView.setContent(this._list);
					this._scrollView.width = this._list.blockW;
					this._scrollView.height = this._list.blockH*this.beginScroll;
					this._scrollView.x = this._list.x;
					this._scrollView.y = this._list.y;
					this.bg.setSize(this._list.blockW + this._list.x * 2 + 12, this._list.blockH * this.beginScroll + this._list.y * 2 + 10);
                    this.addChild(this._scrollView);
					
                }else{
                    
                }
				*/
			}
			this._conf = null;
		}

		protected hidden():void
		{
			this.parent && this.parent.removeChild(this);
		}
		
		/**
		 * 请在此方法中编写释放功能，如果有关闭按钮，可以直接将关闭按钮的侦听设置在此
		 */
		public dispose(e:MouseEvent=null,justCloseMe:Boolean=false):void
		{
			this._list = null;
			if(this.parent)
			{
				if(!justCloseMe && this.parent instanceof MenuDown) (<MenuDown><any>this.parent).dispose();
				this.parent.removeChild(this);
			}
		}
		
		public reset():void
		{
			this._list && this._list.removeAllStuff();
		}
		
		/**
		 * 此方法将在UI界面初始化完成后运行。可以在本方法中增加侦听，赋予初始值等
		 */
		private onCreate():void
		{
			if(this._conf) this.setup(this._conf);
		}
		private _hovered:D5HoverText;
		private onHover(e:Event):void
		{
			if(this._son && this._hovered && this._son._conf===this._hovered.data) return;
			if(this._hovered)
			{
				if(this._son)
				{
					this._son.parent && this._son.parent.removeChild(this._son);
					this._son.dispose(null,true);
					this._son = null;
					
				}
				this._son = new MenuDown(this._thisobj,this._lineStyle);
				this._son.setup(this._hovered.data);
				this._son.x = this._list.width+5;
				this._son.y = this._list.y+this._list.blockH*this._list.getIndex(this._hovered);
                this.addChild(this._son);
			}else{
				if(this._son && this.contains(this._son)) this._son.dispose(null,true);
				this._son = null;
			}
		}
		
		private onClick(e:Event):void
		{
			if(this._list.value instanceof Function) 
			{
				try
				{
					this._list.value.apply(this._thisobj,[this._list.lable]);
				}catch(err){
					try
					{
						this._list.value.apply(this._thisobj);
					}catch(err){
						var evt:egret.Event = new egret.Event(MenuDown.CLICK);
						this.dispatchEvent(evt);
						trace("[MenuDown] ",err.message);
						trace(err.stack);
					}
				}
			}
			this.hidden();
		}
	}
}