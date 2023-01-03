module d5power {
    
    export class URLLoader {
        /**
         * 加载地址
         */
        private _url:string = "";

        /**
         * 加载的数据
         */
        private _data:any = null;
        private _xhr:XMLHttpRequest;
        /**
         * 格式类型
         */
        private _dataformat:string = null;
        /**
         * 加载成功后的回叫函数
         */
        public onLoadComplete:Function = null;

        /**
         * 加载失败的回叫函数
         */
        public onLoadError:Function = null;
        /**
         * 加载过程/进度的回叫函数
         */
        public onLoadProgress:Function = null;

        /**
         * 以二进制方式接收加载的数据
         */
        public static DATAFORMAT_BINARY:string = "binary";
        
        /** 
         * 以文本的方式接收加载的数据
         * 默认方式
         */
        public static DATAFORMAT_TEXT:string = "text";

        public static DATAFORMAT_XML:string = "xml";
        /**
         * 以音频的方式接收加载的数据
         */
        public static DATAFORMAT_SOUND:string = "sound";

       
        /**
         * 以图像的方式接收加载的数据
         * 支持jpg.png.等格式
         */
        public static DATAFORMAT_BITMAP:string = "bitmap";

        /**
         * 以JSON的方式接收加载的数据
         * 
         */
        public static DATAFORMAT_JSON:string = "json";
        
        /**
         * 构造函数
         * @param url 加载数据的地址.如果参数不为空的话.将直接开始加载
         * @param dataformat 以什么方式进行加载.如果为空的话.将通过目标文件的后缀名判断,
         * 如果为空且文件后缀不为内置支持的集中文件类型的话.将以文本格式进行加载解析
         */
        constructor(url:string = null, dataformat:string = null) {
            if (dataformat) {
                this.dataformat = dataformat;
            }
            if (url) {
                this.load(url);
            }
        }

        /**
         * 加载目标地址的数据
         * @param url 数据地址
         */
        public load(url:string) {
            this._data = null;
            this._url = url;

            if (null == this._dataformat) {

                this._dataformat = URLLoader.DATAFORMAT_TEXT;

                if (this._url.length >= 4) switch (this._url.substr(this._url.length - 4, 4).toLowerCase()) {
                    case ".bmp":
                        this._dataformat = URLLoader.DATAFORMAT_BITMAP;
                        break;
                    case ".png":
                        this._dataformat = URLLoader.DATAFORMAT_BITMAP;
                        break;
                    case ".jpg":
                        this._dataformat = URLLoader.DATAFORMAT_BITMAP;
                        break;
                    case '.xml':
                        this._dataformat = URLLoader.DATAFORMAT_XML;
                        break;
                    case "glsl":
                    case ".php":
                    case ".js":
                    case ".ts":
                    case ".txt":
                        this._dataformat = URLLoader.DATAFORMAT_TEXT;
                        break;
                    case "json":
                        this._dataformat = URLLoader.DATAFORMAT_JSON;
                        break;
                    case '.bin':
                        this._dataformat = URLLoader.DATAFORMAT_BINARY;
                        break;
                    default:
                        this._dataformat = URLLoader.DATAFORMAT_BINARY;
                        break;
                }
            }

            if (this._xhr == null) {
                this._xhr = this.getXHR();
            }
            if (this._xhr == null) {
                alert("Your browser does not support XMLHTTP.");
                return;
            }
            if (this._xhr.readyState > 0) {
                this._xhr.abort();
            }

            this._xhr.open("GET", this._url, true);
            this._xhr.addEventListener("progress", (e) => this.onProgress(e), false);
            this._xhr.addEventListener("readystatechange", (e) => this.onReadyStateChange(e), false);
            this._xhr.addEventListener("loadend", (e) => this.onError(e), false);
           
            if (this.dataformat == URLLoader.DATAFORMAT_BITMAP) {
                this._xhr.responseType = "blob";
            }else if(this.dataformat == URLLoader.DATAFORMAT_TEXT || this.dataformat==URLLoader.DATAFORMAT_XML || this.dataformat==URLLoader.DATAFORMAT_JSON){
                this._xhr.responseType = "";
            }else{
                this._xhr.responseType = "arraybuffer";
            }
            this._xhr.send();
        }

        /**
         * 控制以哪种方式接收加载的数据.
         * 如果未赋值则通过加载文件的后缀名来判断加载的类型以解析.
         * 如果未赋值且加载的类型并非为内置支持的文件类型.将以文本格式进行加载
         */
        public get dataformat():string {
            return this._dataformat;
        }

        /**
         * 控制以哪种方式接收加载的数据.
         * 如果未赋值则通过加载文件的后缀名来判断加载的类型以解析.
         * 如果未赋值且加载的类型并非为内置支持的文件类型.将以文本格式进行加载
         */
        public set dataformat(value:string) {
            this._dataformat = value;

        }

        /**
         * 加载的数据.
         */
        public get data():any {
            return this._data;
        }

        /**
         * 加载的地址
         */
        public get url():string {
            return this._url;
        }

        private onReadyStateChange(event:Event):void {
            if (this._xhr.readyState == 4) {
                if (this._xhr.status >= 400 || this._xhr.status == 0) {
                    console.log(this._url, "load fail");
                } else {
                    this.loadComplete();
                }
            }
        }

        private loadComplete(): void {
            switch (this.dataformat) {
                case URLLoader.DATAFORMAT_BINARY:
                    this._data = new ByteArray(this._xhr.response);
                    break;
                case URLLoader.DATAFORMAT_SOUND:
                    this._data = this._xhr['responseBody'];
                    break;
                case URLLoader.DATAFORMAT_TEXT:
                    this._data = this._xhr.responseText;
                    break;
                case URLLoader.DATAFORMAT_XML:
                    this._data = XML.parse(this._xhr.responseText);
                    break;
                case URLLoader.DATAFORMAT_JSON:
                    var json:any;
                    try
                    {
                        json = eval('('+this._xhr.responseText+')');
                    }catch(e){
                        json = null;
                        trace("[URLLoader] JSON parse fail.");
                        trace(e.stack);
                    }
                    this._data = json;
                    break;
                case URLLoader.DATAFORMAT_BITMAP:
                    var img = new Image();//document.createElement("img");
                    if (window['createObjectURL'] != undefined) { // basic
                        img.src = window['createObjectURL'](this._xhr.response);
                    } else if (window['URL'] != undefined) { // mozilla(firefox)
                        img.src = window['URL'].createObjectURL(this._xhr.response);
                    } else if (window['webkitURL'] != undefined) { // webkit or chrome
                        img.src = window['webkitURL'].createObjectURL(this._xhr.response);
                    }
                    var that = this;
                    img.onload = () => {
                        if (that.onLoadComplete) {
                            this._data = img;
                            that.onLoadComplete(that);
                        }
                    };
                    return;
                
                default:
                    this._data = this._xhr.responseText;
            }

            if (this.onLoadComplete) {
                this.onLoadComplete(this);
            }
        }

        private onProgress(event:any):void {
            //console.log("progress event```");
        }

        private onError(event:any):void {
            if ((<any>event.target).status==404 && this.onLoadError) {
                this.onLoadError(this);
                console.log("loaderror, url: ", this._url);
                console.log("load error", event);
            }
        }


        private getXHR():any {
            var xhr:any = null;
            if (window["XMLHttpRequest"]) {
                xhr = new window["XMLHttpRequest"]();
            } else {
                xhr = new ActiveXObject("MSXML2.XMLHTTP");
            }
            return xhr;
        }
    }
}