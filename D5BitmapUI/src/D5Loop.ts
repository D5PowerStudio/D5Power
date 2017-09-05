module d5power
{
    export class D5Loop extends D5Component
    {
        private _workmode:number;
        private _cutsize1:number;
        private _cutsize2:number;
        
        private _partI:egret.Bitmap;
        private _partII:egret.Bitmap;
        private _partIII:egret.Bitmap;
        
        public constructor(mode:number,cutsize1:number,cutsize2:number)
        {
            super();
            this._workmode = mode;
            this._cutsize1 = cutsize1;
            this._cutsize2 = cutsize2;
        }
        
        private buildPart():void
        {
            if(this._partI==null)this._partI = new egret.Bitmap();
            if(this._partII==null)
            {
                this._partII = new egret.Bitmap();
                this._partII.fillMode = egret.BitmapFillMode.REPEAT;
            }
            if(this._partIII==null)
            {
                this._partIII = new egret.Bitmap();
            }
        }
        
        public setSkin(name:string):void
        {
            if(this._nowName == name) return;
            this._nowName = name;
            var data:D5UIResourceData = D5UIResourceData.getData(name);
            if(data==null)
            {
                trace("[D5Loop]No Resource"+name);
                RES.getResByUrl(name,this.onComplate,this);
            }else{
                this.buildPart();
                this._partI.texture = data.getResource(0);
                this._partII.texture = data.getResource(1);
                this._partIII.texture = data.getResource(2);
                this.invalidate();
            }
        }
        
        private onComplate(data:egret.Texture):void
        {
            var sheet:egret.SpriteSheet = new egret.SpriteSheet(data);
            if(this._workmode==0)
            {
                sheet.createTexture('0',0,0,this._cutsize1,data.textureHeight);
                sheet.createTexture('1',this._cutsize1,0,this._cutsize2-this._cutsize1,data.textureHeight);
                sheet.createTexture('2',this._cutsize2,0,data.textureWidth-this._cutsize1,data.textureHeight);
            }else{
                sheet.createTexture('0',0,0,data.textureWidth,this._cutsize1);
                sheet.createTexture('1',0,this._cutsize1,data.textureWidth,this._cutsize2-this._cutsize1);
                sheet.createTexture('2',0,this._cutsize2,data.textureWidth,data.textureHeight-this._cutsize1);
            }
            this.buildPart();
            this._partI.texture = sheet.getTexture('0');
            this._partII.texture = sheet.getTexture('1');
            this._partIII.texture = sheet.getTexture('2');
            this.invalidate();
        }
        
        public draw():void
        {
            if(this._partI==null)
            {
                return;
            }else{

                if(!this.contains(this._partI)) {

                    this.addChildAt(this._partI,0);
                    this.addChildAt(this._partII,0);
                    this.addChildAt(this._partIII,0);
                }
            }

            if(this._workmode == 0)
            {
                this._partII.x = this._partI.width;
                this._partII.width = this._w - this._partI.width - this._partIII.width;
                this._partIII.x = this._partII.x+this._partII.width;
            }else{
                this._partII.y = this._partI.height;
                this._partII.height = this._h - this._partI.height - this._partIII.height;
                this._partIII.y = this._partII.y+this._partII.height;
            }

            super.draw();

        }
    }
}

