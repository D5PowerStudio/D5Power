namespace d5power
{
    export class D5ProgressBar extends D5Component
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
        public processTo(value:number):void
        {
            if(this._value==value) return;
            this._bar.delayResize = false;
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
                this._bar.delayResize = true;
                this.removeEventListener(egret.Event.ENTER_FRAME,this.render,this);
            }else{
                this._value+=(this._target_value-this._value)*.2;
                this.process(this._value);
            }
        }


        private _value:number;
        public process(value:number):void
        {
            if(value>100) value=100;
            if(value<0) value=0;
            this._value = value;
            if(value==0)
            {
                this._bar.visible = false;
                this._label && (this._label.visible=false);
            }else{
                this._bar.visible = true;
                this._bar.setSize(Math.ceil(this._fullSize*(value/100)),this._bar.height);
                if(this._label)
                {
                    this._label.visible=true;
                    if(this._label instanceof D5Text)
                    {
                        (<D5Text>this._label).text = value+'%';
                    }else if(this._label instanceof D5BitmapNumber){
                        (<D5BitmapNumber>this._label).setValue(value+'%');
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

        public clone():D5ProgressBar
        {
            if(!this._bg['clone'] || !this._bar['clone']) return;
            var newbar:D5ProgressBar = new D5ProgressBar;
            var bg:D5Component = this._bg['clone']();
            var bar:D5Component = this._bar['clone']();
            var label:D5Component = this._label['clone'] ? this._label['clone']() : null;

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

            
            return newbar;
        }
    }
}