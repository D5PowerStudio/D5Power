module d5power
{
    export class SingleFrameCharacter extends GameObject implements IGD
    {
        private _skinReady:boolean = false;
        private _offX:number;
        private _offY:number;
        public constructor(map:IMap)
        {
            super(map);
            this._monitor = new egret.Bitmap;
            
        }

        public setSkin(path:string):void
        {
            var data:D5UIResourceData = D5UIResourceData.getData(path);
            if(data==null)
            {
                trace("[D5Bitmap]No Resource"+path);
                var texture:egret.Texture = RES.getRes(path);
                if(texture)
                {
                    this.onResReady(texture);
                }else
                {
                    RES.getResByUrl(path,this.onResReady,this,RES.ResourceItem.TYPE_IMAGE);
                }
                return;
            }
            (<egret.Bitmap>this._monitor).texture = data.getResource(0);
        }

        private _lastTimer:number;
        public run(t:number):void
        {
            if(!this._skinReady) return;
            this.updatePos(this._offX,this._offY);
        }

        private onResReady(data:egret.Texture):void
        {
            this._skinReady = true;
            this._offX = -data.textureWidth>>1;
            this._offY = -data.textureHeight;
            (<egret.Bitmap>this._monitor).texture = data;
        }
    }

    
}