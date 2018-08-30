module d5power
{
    export class SingleFrameCharacter extends GameObject implements IGD
    {
        
        public constructor(map:IMap)
        {
            super(map);
            this._monitor = new egret.Bitmap;
            
        }

        public setSkin(path:string):void
        {
            var data:D5UIResourceData = D5UIResourceData.getData(name);
            if(data==null)
            {
                trace("[D5Bitmap]No Resource"+name);
                var texture:egret.Texture = RES.getRes(name);
                if(texture)
                {
                    (<egret.Bitmap>this._monitor).texture = texture;
                }else
                {
                    RES.getResByUrl(name,this.onResReady,this,RES.ResourceItem.TYPE_IMAGE);
                }
                return;
            }
            (<egret.Bitmap>this._monitor).texture = data.getResource(0);
        }

        private onResReady(data:egret.Texture):void
        {
            (<egret.Bitmap>this._monitor).texture = data;
        }
    }

    
}