module d5power
{
    export class ResLibParser
    {
        private _callback:Function;
        private _thisobj:Function;
		private _lib:any;
		private _total:number;
		private _count:number;
		private _loadCount:number;
		private _loadTotal:number;
		private _strFile:Array<String> = ['.json','.xml','.d5ui'];
		private _processFun:Function;
        private _extLib:Array<any>;
        
        
        public constructor(lib:any,onComplate:Function,thisobj:any,onProcess:Function=null,extLib:Array<any>=null)
        {
            if(extLib){
				for(var i:number=0,j:number=extLib.length;i<j;i++)
				{
					var obj:Object = extLib[i];
					if(!obj.hasOwnProperty('addCache'))
					{
						throw new Error('[ResLibParser] 扩展库必须具备addCache属性\n[ResLibParser] your extension lib must support addCache function.');
					}
				}
            }
            
            this._extLib = extLib;
			this._lib = lib;
			this._processFun = onProcess;
            this._callback = onComplate;
            this._thisobj = thisobj;

            if(lib instanceof ByteArray)
			{
				this.onComplate(lib);
			}else{
                StepLoader.me.addLoad(lib,this.onComplate,this);
            }
        }

        /**
		 * 资源库的原始数据
         * orgin data of resource lib
		 */
		public get lib():any
		{
			return this._lib;
        }
        
        private onComplate(res:any):void
		{
            if(res && (res instanceof ByteArray))
            {
                var data:ByteArray = <ByteArray> res;
                data.position = 0;
				this._total = data.readUnsignedInt();
				this._count = 0;
				this.parseData(data);
            }
        }
        
        private parseData(data:ByteArray):void
		{
            if(this._count>=this._total) return;
            
			var path:string = data.readUTF();
			var length:number = data.readUnsignedInt();
			var b:ByteArray = new ByteArray();
			
			data.readBytes(b,0,length);
			b.position = 0;
			var extname:String = path.substr(path.lastIndexOf('.'));
			if(this._strFile.indexOf(extname)==-1)
			{
                // Image file
                this._loadCount++;
                this._loadTotal++;
                var that:ResLibParser = this;
				egret.BitmapData.create("arraybuffer",b.buffer,function(bitmap:egret.BitmapData){
                    var texture:egret.Texture = new egret.Texture();
                    texture.bitmapData = bitmap;
                    that.update(path,texture);
                });
			}else{
				// UTFFile
				var str:string = b.readUTFBytes(b.bytesAvailable);
				switch(extname)
				{
					case '.json':
						
						try
						{
							var json:Object = JSON.parse(str);
							this.update(path,json);
						}catch(e){
							trace("Format JSON error");
						}
						break;
					default:
						//this.update(path,str);
						break;
				}
				
			}
			b.clear();
			this._count++;
			this.parseData(data);
			
        }
        
        private update(path:string,data:any):void
		{
			//trace(path,data);
            StepLoader.me.addCache(path,data);
			if(this._extLib && this._extLib.length)
			{
				for(var i:number=0,j:number=this._extLib.length;i<j;i++)
				{
					var o:Object = this._extLib[i];
                    if(o['addCache'])
                    {
                        try
                        {
                            o['addCache'](path,data)
                        }catch(e){
                            trace("[ResLibParser] add cache fail. "+e.stack);
                        }
                        
                    }
				}
			}
		}


    }
}