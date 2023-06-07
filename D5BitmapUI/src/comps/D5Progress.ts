namespace d5power
{
    export class D5Progress extends D5Component
    {
        private _bg:D5Component;
        private _bar:D5Component;
        private _label:D5Component;
        private _fullSize:number;
        private _offset:number;
        private 

        public constructor(bg:D5Component=null,bar:D5Component=null,label:D5Component=null)
        {
            super();
            if(bg && bar) this.init(bg,bar,label);
        }

        public setSize(w: number, h: number): void {
            if(!this._bg || !this._bar) return;
            this._bg.setSize(w,this._bg.height);
            this._bar.setSize(w - this._offset,this._bar.height);
            this._label && (this._label.x = (this._bar.width-this._label.width)*.5+this._bar.x);
        }
        
        private _target_value:number;
        private _show_label:string;
        private _ext:string;
        public processTo(value:number,label:string=null,ext:string=null):void
        {
            if(this._value==value) return;
            this._show_label = label;
            this._ext = ext;
            this._target_value = value;
            this._label && this._label.parent && this.removeChild(this._label);
            this.addEventListener(egret.Event.ENTER_FRAME,this.render,this);
        }

        private render(e:egret.Event):void
        {
            if(Math.abs(this._target_value-this._value)<1)
            {
                
                this._label && this.addChild(this._label);
                this.process(this._target_value);
                this.removeEventListener(egret.Event.ENTER_FRAME,this.render,this);
            }else{
                this._value+=(this._target_value-this._value)*.2;
                this._value = Number(this._value.toFixed(2));
                this.process(this._value);
            }
        }

        private _value:number;
        public process(value:number,label:string=null,ext:string='%'):void
        {
            if(value>100) value=100;
            if(value<0) value=0;
            this._value = value;
            this._show_label = label;
            this._ext = ext;

            if(value==0)
            {
                this._bar.parent && this.removeChild(this._bar);
                this._label && this._label.parent && this.removeChild(this._label);
            }else{
                !this._bar.parent && this.addChild(this._bar);
                this._bar.setSize(Math.ceil(this._fullSize*(value/100)),this._bar.height);
                if(this._label)
                {
                    !this._label.parent && this.addChild(this._label);
                    if(this._label instanceof D5Text)
                    {
                        (<D5Text>this._label).text = (this._show_label ? this._show_label : value) + this._ext;
                    }else if(this._label instanceof D5BitmapNumber){
                        (<D5BitmapNumber>this._label).setValue(value+'');
                    }
                    this._label.x = this._bar.width>this._label.width ? (this._bar.width-this._label.width)*.5+this._bar.x : this._bar.x;
                }
            }
            
        }

        public init(bg:D5Component=null,bar:D5Component=null,label:D5Component):void
        {
            this._bg = bg;
            this._bar = bar;
            this._label = label;

            this._fullSize = this._bar.width;
            this._offset = this._bg.width - this._bar.width;
            this._value = 100;
            
            this._bg.parent && this._bg.parent.addChild(this);
            this.addChild(this._bg);
            this.addChild(this._bar);
            this._label ? this.flyPos(bg,bar,label) : this.flyPos(bg,bar);
        }

        private flyPos(root:egret.DisplayObjectContainer,...target):void
        {
            this.x = root.x;
            this.y = root.y;
            root.x = 0;
            root.y = 0;
            root.parent && root.parent.removeChild(root);

            this.addChild(root);
            for(var i:number=0,j:number=target.length;i<j;i++)
            {
                let comp:D5Component = target[i];
                if(!comp || comp==root) continue;
                if(comp.parent!=root)
                {
                    comp.x -= this.x;
                    comp.y -= this.y;
                }
                comp.parent && comp.parent.removeChild(comp);
                this.addChild(comp);
            }
        }

        public clone():D5Progress
        {
            if(!this._bg['clone'] || !this._bar['clone']) return;
            var newbar:D5Progress = new D5Progress;
            var bg:D5Component = this._bg['clone']();
            var bar:D5Component = this._bar['clone']();
            var label:D5Component = this._label && this._label['clone'] ? this._label['clone']() : null;

            bg.x = this._bg.x;
            bg.y = this._bg.y;
            newbar._bg = bg;


            bar.x = this._bar.x;
            bar.y = this._bar.y;
            newbar._bar = bar;

            newbar.addChild(bg);
            newbar.addChild(bar);
            if(label)
            {
                label.x = this._label.x;
                label.y = this._label.y;
                newbar.addChild(label);
                newbar._label = label;
            }

            newbar._fullSize = this._bar.width;
            newbar._offset = this._bg.width - this._bar.width;
            newbar._value = 100;
            
            return newbar;
        }
    }
}