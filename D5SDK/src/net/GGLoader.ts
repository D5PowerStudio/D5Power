module d5power
{
    export class GGLoader {
        private static _loading:any = {};

        /**
         * d5.gg服务器地址
         */
        public static GG_SERVER:string = 'https://s1.d5.gg/';
        /**
         * 通过游戏工坊申请的appid
         */
        private _APPID:string = '';
        /**
         * 通讯签名，由服务器发放
         */
        private _SIGN:string = '';
        /**
         * 时间戳，由服务器发放
         */
        private _TIMESTAME:string = '';
        /**
         * 项目编号，由服务器发放
         */
        private _GAMEID:number = 0;


        private static _me:GGLoader;
        public static get me():GGLoader
        {
            if(GGLoader._me == null) GGLoader._me = new GGLoader();
            return GGLoader._me;
        }

        /**
         * 公共参数
         */
        private _postVars:string = '';

        public constructor()
        {
            
        }

        /**
         * 初始化
         */
        public init(appid:string,callback:Function=null,thisobj:any=null):void
        {
            var that:GGLoader = this;
            this.load(0x0001,{appid:appid,server:1},function(res):void{
                if(res.code==1)
                {
                    that._GAMEID = res.data.appindex;
                    that._SIGN = res.data.sign;
                    that._TIMESTAME = res.data.time;
                    that.initGlobalVar();
                    if(callback!=null) callback.apply(thisobj,[1]);
                }else{
                    if(callback!=null) callback.apply(thisobj,[res.code]);
                }
            },this);
        }

        /**
         * MD5加密
         */
        public MD5(src:string)
        {
            var m: md5 = new md5();
            return m.hex_md5(src);
        }

        private initGlobalVar()
        {
            this._postVars = 'gameid='+this._GAMEID+'&time='+this._TIMESTAME+'&sign='+this._SIGN;
            trace(this._postVars);
        }

        /**
         * 设置公共参数
         */
        public set globalData(v:any)
        {
            if(!v) return;
            this.initGlobalVar();
            for(var k in v)
            {
                this._postVars+=k+'='+v[k]+'&'
            }
            if(this._postVars.length>1) this._postVars = this._postVars.substr(0,this._postVars.length-1);
        }

        public get(url:string,callback:Function=null,thisobj:any=null):void
        {
            let loader: egret.URLLoader = new egret.URLLoader();
            let req = new egret.URLRequest(url);

            loader.once(egret.Event.COMPLETE,function(e:egret.Event):void{
                try
                {
                    let obj = JSON.parse(loader.data)
                    callback.apply(thisobj,[obj])
                }catch(e){
                    callback.apply(thisobj,[{code:0,data:null,msg:'解析未成功'}])
                }
                
            },this);

            loader.once(egret.IOErrorEvent.IO_ERROR,function(e:egret.IOErrorEvent):void{
                callback.apply(thisobj,[{code:0,data:null,msg:'加载未成功'}])
            },this);

            loader.load(req);
        }

        public post(url:string,data: Object = null,callback: Function = null,thisObj:any = null):void
        {
            var loader: egret.URLLoader = new egret.URLLoader();
            var req = new egret.URLRequest(url);

            
            var var_source = "";
            if(data!=null)
            {
                for(var k in data) var_source+= "&"+k+"="+data[k];
            }
            var urlvar: egret.URLVariables = new egret.URLVariables(var_source);
            req.data = urlvar;
            req.method = egret.URLRequestMethod.POST;

            loader.once(egret.Event.COMPLETE,function(e:egret.Event):void{
                try
                {
                    let obj = JSON.parse(loader.data)
                    callback.apply(thisObj,[obj])
                }catch(e){
                    callback.apply(thisObj,[{code:0,data:null,msg:'解析未成功'}])
                }
                
            },this);
            loader.once(egret.IOErrorEvent.IO_ERROR,function(e:egret.IOErrorEvent):void{
                callback.apply(thisObj,[{code:0,data:null,msg:'加载未成功'}])
            },this);

            loader.load(req);
            
        }

        
        public load(cmd: number,data: Object = null,callback: Function = null,thisObj:any = null,server:string=''): void 
        {
            var loader: egret.URLLoader = new egret.URLLoader();
            

            var req = new egret.URLRequest(server=='' ? GGLoader.GG_SERVER : server);

            var var_source = this._postVars+ "&do=" + cmd;
            if(data != null) {
                for(var k in data) {
                    var_source+= "&"+k+"="+data[k];
                }
            }
            var urlvar: egret.URLVariables = new egret.URLVariables(var_source);
            req.data = urlvar;
            req.method = egret.URLRequestMethod.POST;

        
            loader.addEventListener(egret.Event.COMPLETE,this.onloaded,this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onLoadError,this);
            loader.load(req);
            
            var gdata:GGCallData = new GGCallData();
            gdata.loader = loader;
            gdata.request = req;
            gdata.callback = callback;
            gdata.thisObj = thisObj;
            
            GGLoader._loading[var_source] = gdata;
        }

        private onloaded(e: Event): void {
            var url: string = this.getUrl(<egret.URLLoader><any>e.target);
            trace("[GGLoader 54]" +url);
            var gdata:GGCallData = GGLoader._loading[url];

            delete GGLoader._loading[url];
            
            if(gdata == null || gdata.loader == null) {
                trace("[GGLoader 61]gdata=null");
                return;
            }

            try {
                trace(gdata.loader.data);
                var obj: Object = JSON.parse(gdata.loader.data);
                if(gdata.callback!=null) gdata.callback.apply(gdata.thisObj,[obj]);
            } catch(e) {
                trace('JSON parse Error:',gdata.loader.data,"\n",e);
                trace(e.stack);
            }



            gdata.loader.removeEventListener(egret.Event.COMPLETE,this.onloaded,this);
            gdata.loader.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onLoadError,this);
        }

        private onLoadError(e: egret.IOErrorEvent): void {
            var url: string = this.getUrl(<egret.URLLoader><any>e.target);
            trace("[GGLoader 75]" + url);
            var gdata:GGCallData = GGLoader._loading[url];
    
            
            if(gdata && gdata.times < 3) {
                trace("[GGLoader 78]",gdata.times);
                gdata.loader.load(gdata.request);
                gdata.times++;
            } else {
                trace("加载失败！",url);
                delete GGLoader._loading[url];
                gdata.loader.removeEventListener(egret.Event.COMPLETE,this.onloaded,this);
                gdata.loader.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onLoadError,this);
            }
        }  

        private getUrl(loader: egret.URLLoader):string
        {
            for(var url in GGLoader._loading)
            {
                if((<GGCallData>GGLoader._loading[url]).loader === loader)  return url;
            }
            return null;
        }
    }
}