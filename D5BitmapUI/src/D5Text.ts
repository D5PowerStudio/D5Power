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

	export class D5Text extends D5Component implements IProBindingSupport
    {
        public static LEFT:number = 0;
        public static CENTER:number = 1;
        public static RIGHT:number = 2;
        public static TOP:number = 0;
        public static MIDDLE:number = 1;
        public static BOTTOM:number = 2;
        public static AUTO_PADDINGX:number = 0;
        public static AUTO_PADDINGY:number = 0;
        /**
         * 绑定属性
         */
        public _binding:string;

        public _textField:egret.TextField;
        /**
         * 背景色
         */
        public _bgColor:number=-1;
        /**
         * 亮色边
         */
        public _lightBorder:number=-1;
        /**
         * 暗色边
         */
        public _darkBorder:number=-1;
        /**
         * 当前的描边颜色
         */
        private _filterColor:number=-1;
        /**
         * 最大宽度
         */
        private _maxWidth:number=0;
        /**
         *文本id,用此id去语言包取对应的值
         */
        private _textID:string;

        /**
         * 输入框的提示信息
         */
        private _placeholder:string;
//        /**
//         * 设置对齐
//         */
//        private _alignType:number = 0;

		/**
		 * 
		 * @param	_text		字符内容
		 * @param	fontcolor	字体颜色
		 * @param	bgcolor		文本框背景颜色
		 * @param	border		文本框边线颜色
		 */
		public constructor(_text:string = '', fontcolor:number = -1, bgcolor:number = -1, border:number = -1,size:number=12)
        {
			super();
            
            this._textField = new egret.TextField();
            if(D5Style.default_txt_font_family!='' && D5Style.default_txt_font_family) this._textField.fontFamily = D5Style.default_txt_font_family;
            this._textField.verticalAlign = egret.VerticalAlign.MIDDLE;
            this._textField.textAlign = egret.HorizontalAlign.LEFT; //egret.VerticalAlign.MIDDLE;
			if (fontcolor>=0) this._textField.textColor = fontcolor;
			if (bgcolor>=0) this.setBgColor(bgcolor);
			if (border>=0) this.setFontBorder(border);
            this._textField.lineSpacing = 4;
            this.setFontSize(size);
			if (_text != ''){
				this.setText(_text);
			}
			
			this.addChild(this._textField);
           
        }

        private _cache:egret.RenderTexture;
        public drawStatic():void
        {
            
            this.clearStatic();
            this._cache = new egret.RenderTexture();
            this._cache.drawToTexture(this);
            this.removeChildren();
            this.addChild(new egret.Bitmap(this._cache));
            
        }

        public clearStatic():void
        {
            if(this._cache)
            {
                this.removeChildren();
                this._cache.dispose();
            }
            if(!this._textField.parent) this.addChild(this._textField);
            this._cache=null;
        }
        
        public set placeholder(v:string)
        {
            if(v==null) v = this._textField.text;
            this._placeholder = v;
            if(v && v!='')
            {
                this.text = v;
                this._textField.displayAsPassword = false;
                this._textField.addEventListener(egret.FocusEvent.FOCUS_IN,this.autoPlaceholder,this);
                this._textField.addEventListener(egret.FocusEvent.FOCUS_OUT,this.autoPlaceholder,this);
            }else{
                this._textField.removeEventListener(egret.FocusEvent.FOCUS_IN,this.autoPlaceholder,this);
                this._textField.removeEventListener(egret.FocusEvent.FOCUS_OUT,this.autoPlaceholder,this);
            }
        }

        private autoPlaceholder(e:egret.FocusEvent):void
        {
            if(e.type==egret.FocusEvent.FOCUS_IN)
            {
                if(this._placeholder==this._textField.text) this._textField.text = '';
                if(this._isPass==1) this._textField.displayAsPassword = true;
            }else{
                if(this._textField.text=='')
                {
                    this._textField.text = this._placeholder;
                    if(this._isPass==1) this._textField.displayAsPassword = false;
                }
            }
        }

        public update():void
        {
            this.setText(<string>(D5Component._pro_binding_source.getPro(this._binding)));
        }
        public invalidateSize(): void
        {
           //this._w = this._maxWidth==0 || this._textField.multiline==false ? this._textField.textWidth+6 : this._maxWidth;
            //this._h = this._textField.textHeight+10;
//            console.log("[d5text]"+this._textField.textHeight+"|"+this._textField.height);
            this.setWidth(this._w);
            this.setHeight(this._h);
        }
        
        public clone():D5Text
        {
            var copy:D5Text = new D5Text();
            this.copyFormat(copy,this.text);
            // 针对静态文本，在复制的过程中复制文本内容
            if(this._textField.type != egret.TextFieldType.INPUT) copy.text = this._textField.text;
            return copy;
        }
        
        /**
		 * 将自身的格式复制设置给目标文本
		 * @param		target		想复制当前文本格式的D5Text
		 */ 
		public copyFormat(target:D5Text,content:String='文字'):void
		{
            if(this._cache)
            {
                target._cache = this._cache;
                target.removeChildren();
                target.addChild(new egret.Bitmap(target._cache));
            }else{
                target.setFontBold(this.fontBold);
                target.setFontSize(this.fontSize);
                target.setFontBorder(this.fontBorder);
                target.setSize(this._w,this._h);
                target._maxWidth = this._maxWidth;
                target._textField.verticalAlign = this._textField.verticalAlign;
                target._textField.textAlign = this._textField.textAlign;
                
                target._textField.multiline = this._textField.multiline;
                target._textField.type = this._textField.type;
                target.setTextColor(this.textColor);
                target.setLtBorder(this.ltBorder);
                target.setRbBorder(this.rbBorder);
                target.setBgColor(this.bgColor);
                target.setIsPassword(this.isPassword);
            }
			
		}
       
        /**
         * 设置文本内容的描边
         * @param	color	描边的值，-1为删除描边
         */
        public setVerticalAlign(value:number = 0)
        {
            switch (value)
            {
                case D5Text.TOP:
                    this._textField.verticalAlign = egret.VerticalAlign.TOP;
                    break;
                case D5Text.MIDDLE:
                    this._textField.verticalAlign = egret.VerticalAlign.MIDDLE;
                    break;
                case D5Text.BOTTOM:
                    this._textField.verticalAlign = egret.VerticalAlign.BOTTOM;
                    break;
            }
        }


        /**
         * 设置文本内容的描边
         * @param	color	描边的值，-1为删除描边
         */
        public setFontBorder(color:number = 0)
        {
            if(color<0){
                this._textField.stroke = 0;
            }else{
                this._textField.stroke = 1;
                this._textField.strokeColor = color;
            }

            this._filterColor = color;
        }

        public get fontBorder():number
        {
            return this._filterColor;
        }

        /**
         * 传入内容文本,兼容旧版。建议直接使用text属性
         */
        public setText(t:string)
        {
            if (this._textField == null){
                return;
            }
            if(t==null) t = '';
            if(t=='' && this._placeholder!='') t = this._placeholder;
            this._textField.text = t;
        }
        
        
        public set text(t:string)
        {
            if (this._textField == null){
                return;
            }
            this._textField.text = t;
        }

        public get text():string
        {
            return (this._placeholder==this._textField.text) ? "" : this._textField.text;
        }
        public get textField():egret.TextField
        {
            return this._textField;
        }
        
        /**
        *传入html文本
        */ 
        public setHtmlText(html:string): void 
        {
            if(this._textField == null) return;
            this._textField.textFlow = (new egret.HtmlTextParser).parser(html);
        }    
        
		
		/**
		 * 设置背景颜色
		 */ 
		public setBgColor(v:number = 0)
        {
			this._bgColor = v;
			this.setSize(this._w,this._h);
		}

        public get bgColor():number
        {
            return this._bgColor;
        }

        /**
         * 设置边框颜色
         * @param	lt	LeftTop，左侧和顶部的线条颜色
         * @param	rb	RightBottom,右侧和底部的线条颜色
         */
        public setLtBorder(v:number = 0)
        {
            this._lightBorder = v;
            this.setSize(this._w,this._h);
        }

        public get ltBorder():number
        {
            return this._lightBorder;
        }

        public setRbBorder(v:number = 0)
        {
            this._darkBorder = v;
            this.setSize(this._w,this._h);
        }

        public get rbBorder():number
        {
            return this._darkBorder;
        }

        private _isPass:number=0;
        /**
         * 是否以密码的状态显示文本
         */
        public setIsPassword(v:boolean)
        {
            this._isPass = v ? 1 : 0;
            if(this._textField.text!=this._placeholder) this._textField.displayAsPassword = v;
        }

        public get isPassword():boolean
        {
            return this._textField.displayAsPassword;
        }

        /**
         *文本id,用此id去语言包取对应的值
         */
        public get textID():string
        {
            return this._textID;
        }

        public setTextID(value:string)
        {
            this._textID = value;
        }

        /**
         *设置宽高
         */
        public setWidth(value:number)
        {
            this._w = value;
            this._textField.width = this._maxWidth>0 && value > this._maxWidth ? this._maxWidth:value;
        }

        public setHeight(value:number)
        {
            this._h = value;
            this._textField.height = value;
            this._textField.$setHeight(value);
        }

        /**
         *设置对齐
         */
        public setTextAlign(value:number):void
        {
            switch (value)
            {
                case D5Text.LEFT:
                    this._textField.textAlign = egret.HorizontalAlign.LEFT;
                    break;
                case D5Text.CENTER:
                    this._textField.textAlign = egret.HorizontalAlign.CENTER;
                    break;
                case D5Text.RIGHT:
                    this._textField.textAlign = egret.HorizontalAlign.RIGHT;
                    break;
            }
        }

        /**
         *背景宽高
         */
        public _setSize(w:number, h:number = 0):void
        {
            this._w = w;
            this._h = h;

            this.graphics.clear();
            if(this._bgColor!=-1){
                this.graphics.beginFill(this._bgColor);
            }

            if(this._lightBorder!=-1){
                if(this._darkBorder==-1) this._darkBorder=this._lightBorder;
                this.graphics.lineStyle(1,this._lightBorder);
                this.graphics.lineTo(this._w,0);
                this.graphics.lineStyle(1,this._darkBorder);
                this.graphics.lineTo(this._w,this._h);
                this.graphics.lineTo(0,this._h);
                this.graphics.lineStyle(1,this._lightBorder);
                this.graphics.lineTo(0,0);
                this.graphics.endFill();
            }else if(this._bgColor!=-1){
                this.graphics.drawRect(0,0,this._w,this._h);
                this.graphics.endFill();
            }
            
            this._textField.x = D5Text.AUTO_PADDINGX
            this._textField.y = D5Text.AUTO_PADDINGY;
            this._textField.height = h;
            this._textField.width = w;
        }

         /**
         * 自动调整宽度和高度
         */
        public autoGrow():void
        {
            if(this._textField == null) return;
            this._w = this._textField.multiline==false || this._maxWidth==0 ? this._textField.textWidth+6 : this._maxWidth;
            this._h = this._textField.textHeight+10;
            this.setSize(this._w,this._h);
//            console.log("[d5text2]"+this._textField.textHeight+"|"+this._textField.height);
//            this.invalidate();
            
        }
        /**
         * 是否为多行
         */
        public setWrapFlg(flg:number = 0)
        {
            var b:boolean;
            if(flg == 1) b = true;
            else if(flg == 0) b = false;
            this._textField.multiline = b;
            if(b) this._textField.verticalAlign = egret.VerticalAlign.TOP;
        }

        public get wrapFlg():number
        {
            return this._textField.multiline==true?1:0;
        }

        /**
         * 将文本框锁定在某背景元素上,使文本框的宽\高\坐标与目标完全一致
         * @param	d
         */
        public lockTo(d:egret.DisplayObject,changeHeight:boolean=false,padding:number=0):void
        {
            this._w = d.width-padding*2;
            if (changeHeight){
                this._h = d.height-padding*2;
            }
            this.x = d.x+padding;
            this.y = d.y+padding;

        }

        /**
         * 设置字体大小
         */
        public setFontSize(size:number = 0)
        {
            this._textField.size = size;
        }
        public get fontSize():number
        {
            return this._textField.size;
        }
        /**
         * 设置字体加粗
         */
        public setFontBold(b:boolean)
        {
            this._textField.bold = b;
        }

        public get fontBold():boolean{
            return this._textField.bold;
        }

        public set type(v:number)
        {
            if(v == 1)
            {
                this._textField.type = egret.TextFieldType.INPUT;
                
            }else{
                this._textField.type = egret.TextFieldType.DYNAMIC;
            }
        }

        /**
         * 设置文本的输入类型（是否允许输入）1,允许输入；0，不允许
         */
        public setType(u:number = 0)
        {
            if(u == 1)
            {
                this._textField.type = egret.TextFieldType.INPUT;
                
            }else{
                this._textField.type = egret.TextFieldType.DYNAMIC;
            }
        }

        public get type():number{
            return this._textField.type == egret.TextFieldType.INPUT ? 1 : 0;
        }

        /**
         * 文本内容宽高
         */
        public get textWidth():number{
            return this._textField.textWidth;
        }

        public get textHeight():number{
            return this._textField.textHeight;
        }

        /**
         * 设置文本颜色
         */
        public setTextColor(u:number = 0)
        {
			this._textField.textColor = u;
        }

		public get textColor():number
        {
			return this._textField.textColor;
		}
		
		public set textColor(u:number)
        {
			this._textField.textColor = u;
        }

        public autoStatic():void
        {
            var arr:Array<egret.DisplayObject> = [];
            var _root:egret.DisplayObjectContainer = this.parent;
			for(var i:number=_root.numChildren-1;i>=0;i--)
			{
                var obj:any = _root.getChildAt(i);
                if(obj instanceof D5Text && !obj.type && obj!=this)
				{
					obj.x = obj.x-this.x;
                    obj.y = obj.y-this.y;
                    arr.push(obj);
				}
			}
			
			for(i=arr.length-1;i>=0;i--)
			{
				this.addChild(arr[i]);
            }
            
            var rect:egret.Rectangle = this.getBounds();
            this._w = rect.width;
            this._h = rect.height;
            this.cacheAsBitmap = true;
        }

        protected get canStatic():boolean
        {
            return false;
        }
        
        public clear(): void 
        {
        }
        public dispose():void
        {
            if(this._textField)
            {
                if(this._textField.parent)this._textField.parent.removeChild(this._textField);
                this._textField = null;
            }
        }
        
	}
}