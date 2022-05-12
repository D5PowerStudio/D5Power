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
		
		public _realWidth:number=200;
		public _realHeight:number=200;
		public _flyX:Number=0;
		public _flyY:Number=0;
		public bg:D5Window;
 
		
		
		private _list:D5List;
		private _son:MenuDown;
		private _conf:Array<any>;
		private _thisobj:any;
		
		public constructor(thisobj:any,lineStyle:string=null,arrowStyle:string = null,fixedWidth:number=200)
		{
			super();
			this._thisobj = thisobj;
			this._list = new D5List();
			this._list.y = 3;
			this._list.setFormat(fixedWidth,28,-1,0x296c8c);
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
				this.parent.removeChild(this);
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
		
		public setup(conf:Array<any>):void
		{
			this._conf = conf;
			if(this.bg)
			{
				this._list.removeAllStuff();
				for(var i:number=0,j:number=conf.length;i<j;i++)
				{
					this._list.addStuff(conf[i][0],conf[i][1]);
				}
				this.bg.x = -4;
				this.bg.setSize(this._list.blockW+this._list.x*2+12,this._list.blockH*this._list.count+this._list.y*2+10);
			}
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
			this.addChild(this._list);
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
			this.dispose();
		}
	}
}