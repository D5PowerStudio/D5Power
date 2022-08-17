namespace d5power
{
	/**
	 *	这是由D5Power BitmapUI编辑器自动生成的文件
	 *	请在项目中修改这些注释来说明类的实际功能
	 */
	export class Menu extends egret.Sprite
	{
		private static _uiconf:string = '{"isLib":0,"Class":"ui","width":500,"y":0,"flyx":"0","uiList":[{"name":"bg","width":500,"margin_mode":0,"margin_right":0,"fillAlpha":0.8,"margin_target":"","workMode":0,"tickNessAlpha":1,"maskName":"","height":30,"round":"0","pointString":"","scalex":1,"offX":0,"radius":0,"x":0,"scaley":1,"link_then_dispose":0,"relx":"","y":0,"rely":"","offY":0,"moveAction":0,"tickNess":-1,"rotation":0,"Class":"D5Shape","color":0,"linkto":null,"fillColor":0},{"bold":"0","name":"btn_file","width":51,"margin_mode":0,"margin_right":0,"margin_target":"","fontColor":16777215,"filterColor":-1,"ltColor":-1,"placeholder":"","fontSize":14,"height":22,"fontFamily":"","scalex":"1.00","binding":"","wrapType":0,"scriptVarBinding":"","x":8,"scaley":"1.00","link_then_dispose":0,"relx":"","y":5,"rbColor":-1,"password":"0","rely":"","moveAction":0,"textValue":"三个字","rotation":0,"Class":"D5Text","alignType":0,"type":0,"linkto":null,"textID":"三个字","bgColor":-1}],"autoFix":0,"name":"instance979","className":"","flyy":"0","x":0,"packageName":"","bgImg":"","height":30,"label":"","alignMode":0,"drag":0,"bgColor":-1}';
		protected _uiSrc:string;
		protected _lineStyle:string;
		protected _arrowStyle:string;
		
		public _realWidth:number=800;
		public _realHeight:number=24;
		public _flyX:Number=0;
		public _flyY:Number=0;

        // 编辑器绑定变量定义开始，请勿删除本行注释
		public bg:D5MirrorLoop;
		public btn_file:D5Text;
 
        // 编辑器绑定变量定义结束，请勿删除本行注释
		private _menuConf:Array<any>;
		
		private _downMenu:MenuDown;
		private _thisobj:any;
		public constructor(thisobj:any,lineStyle:string=null,arrowStyle:string=null)
		{
			super();
			this._thisobj = thisobj;
			this._lineStyle = lineStyle;
			this._arrowStyle = arrowStyle;
            this._uiSrc = "resource/ui/main_menu.d5ui.json";
			d5power.D5Component.getComponentByJSON(this._uiSrc,JSON.parse(Menu._uiconf),this,this.onPre);
            
		}

        private onPre(count:number):void
        {
            if(count==0) this.once(egret.Event.ENTER_FRAME,this.onCreate,this);
        }
		
		public setup(conf:Array<any>):void
		{
			this._menuConf = conf;
			if(this.bg!=null) this.buildMenu(this._menuConf);
		}
		
		/**
		 * 请在此方法中编写释放功能，如果有关闭按钮，可以直接将关闭按钮的侦听设置在此
		 */
		public dispose(e:MouseEvent=null):void
		{
			this.stage.removeEventListener(egret.Event.RESIZE,this.autoFly,this);
			if(this.parent) this.parent.removeChild(this);
		}

        private autoFly(e:egret.Event=null):void
        {
            this.bg.setSize(this.stage.stageWidth,this.bg.height);
        }
        
		/**
		 * 此方法将在UI界面初始化完成后运行。可以在本方法中增加侦听，赋予初始值等
		 */
		private onCreate():void
		{
			
			// 自动浮动
			if(this.stage)
			{
				this.flyPos();
			}else{
				this.addEventListener(egret.Event.ADDED_TO_STAGE,this.flyPos,this);
			}

			for(var i:number=0,j:number=this.numChildren;i<j;i++)
			{
				var obj:D5Text = this.getChildAt(i) as D5Text;
				if(obj) obj.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDownMenu,this);
			}
			
			if(this._menuConf!=null) this.buildMenu(this._menuConf);
			this.reSize();
		}

        private flyPos(e:egret.Event=null):void
        {
            if(e!=null) this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.flyPos,this);
            this.stage.addEventListener(egret.Event.RESIZE,this.autoFly,this);
            this.autoFly();
            this.visible = true;
            mouse.enable(this.stage);
        }
		
		private buildMenu(conf:Array<any>,parent:D5Button=null):void
		{
			var btn:D5Text;
			for(var i:number=0,j:number = conf.length;i<j;i++)
			{
				if(i==0)
				{
					btn = this.btn_file;
				}else{
					btn = this.btn_file.clone();
					this.addChild(btn);
				}
				btn.x = this.btn_file.x+i*(this.btn_file.width+5);
				btn.y = this.btn_file.y;
				btn.text = conf[i][0];
				btn.touchEnabled = true;
                btn.addEventListener(mouse.MouseEvent.MOUSE_OVER,this.onMouseOver,this);
				if(conf[i][1] instanceof Array)
				{
					btn.extdata = conf[i][1];
					btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDownMenu,this);
				}else if(conf[i][1] instanceof Function){
					btn.addEventListener(egret.TouchEvent.TOUCH_TAP,conf[i][1],this);
				}else{
					
				}
			}
		}
		
		
		private _nowDown:D5Button;
		
		public closeDownMenu(e:Event = null):void
		{
			this._downMenu.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.closeDownMenu,this);
			if(e==null) this._downMenu.dispose();
			this._downMenu = null;
			this._nowDown = null;
		}
		
		private onMouseOver(e:egret.TouchEvent):void
		{
			if(this._downMenu && this._nowDown!=e.currentTarget)
			{
				this.closeDownMenu();
				this.onDownMenu(e);
			}
		}
		
		private onDownMenu(e:egret.TouchEvent):void
		{
			var target:D5Button = e.currentTarget as D5Button;
			if(this._downMenu)
			{
				this.closeDownMenu();
			}else{
				this._downMenu = new MenuDown(this._thisobj,this._lineStyle,this._arrowStyle);
//				target.data = D5BitmapUIEditor.me.upDateOpenList()
				this._downMenu.setup(target.extdata);
				this._downMenu.x = target.x;
				this._downMenu.y = target.height+1;
				this._downMenu.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.closeDownMenu,this);
				this.addChild(this._downMenu);
				this._nowDown = target;
				this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onStageDown,this);
			}
		}
		
		private onStageDown(e:egret.TouchEvent):void
		{
			if(!this.hitTestPoint(e.stageX,e.stageY,true) && this._downMenu)
			{
				this.closeDownMenu();
			}
		}
		
		public reSize():void
		{
			if(this.stage==null || this.bg==null) return;
			this.bg.setSize(this.stage.stageWidth,this.height);
		}
	}
}