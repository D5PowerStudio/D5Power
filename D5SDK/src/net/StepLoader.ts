module d5power
{
	/**
	 * 分步加载器以及资源池
	 * @author D5Power Studio
	 */ 
	export class StepLoader
	{
		protected static _pool:any;
		protected static _waitList:Array<D5LoadData>;
		protected static _isLoading:string='';
		protected static _loader:URLLoader;
		private static _me:StepLoader;
		
		
		
		public static get me():StepLoader
		{
			if(!StepLoader._me) new StepLoader();
			return StepLoader._me;
		}
		
		private static onComplate(loader:URLLoader):void
		{

			var arr:Array<D5LoadData> = StepLoader._waitList;

			if(arr.length==0)
			{
				trace('[StepLoader] All data load complated.');
				return;
			}
			var conf:D5LoadData = arr.pop();
			

			var data:any = loader.data;
			if(conf.inpool && data!=null) StepLoader._pool[conf.url] = data;
			
			trace("[stepLoader]","开始处理"+conf.url);
			if(conf.callback != null)
			{
				try
				{
					conf.callback.apply(conf.thisobj,[data]);
				}catch(e){
					trace("资源加载回叫失败",e);
				}
			}

			var finder:D5LoadData;
			// 当加载完一个资源后，循环检查加载队列中是否还有其他同地址的加载请求，一并处理
			for(var id:number = arr.length-1;id>=0;id--)
			{
				finder = arr[id];
				if(finder.url==conf.url)
				{
					if(finder.callback != null)
					{
						try
						{
							finder.callback.apply(finder.thisobj,[data]);
						}catch(e){
							trace("资源加载回叫失败",e.getStackTrace());
						}
					}
					arr.splice(id);
				}
			}
		
			StepLoader._isLoading = '';
			StepLoader.loadNext();
		}
		
		private static onError(e:Event):void
		{
			var arr:Array<D5LoadData> = StepLoader._waitList;
			var data:D5LoadData = arr.pop();
			// 当加载完一个资源后，循环检查加载队列中是否还有其他同地址的加载请求，一并处理
			
			var conf:D5LoadData;
			for(var id:number = arr.length-1;id>=0;id--)
			{
				conf = arr[id];
				if(conf.url == data.url) arr.splice(1);
			}
			
			StepLoader._isLoading = '';
			StepLoader.loadNext();
		}
		
		protected static onProgress():void{}
		
		protected static loadNext():void
		{
			if(StepLoader._isLoading!='') return;
			
			StepLoader._isLoading = '';
			
			if(StepLoader._waitList.length)
			{
				var conf:D5LoadData = StepLoader._waitList[StepLoader._waitList.length-1];
				StepLoader._loader.dataformat = null;
				StepLoader._loader.load(conf.url);
				StepLoader._isLoading = conf.url;
			}else{
				StepLoader._me.complate();
			}
		}

		public static get isLoading():boolean
		{
			if(StepLoader._isLoading=='')
			{
				return true;
			}else{
				return false;
			}
		}
		
		public constructor(passwd:string='')
		{
			StepLoader._me = this;
			
			if(StepLoader._waitList==null)
			{
				StepLoader._pool = {};
				StepLoader._waitList = new Array<D5LoadData>();
				StepLoader._loader = new URLLoader();
				StepLoader._loader.onLoadComplete = StepLoader.onComplate;
				StepLoader._loader.onLoadError = StepLoader.onError;
				StepLoader._loader.onLoadProgress = StepLoader.onProgress;
			}
		}
		
		/**
		 * 根据文件地址从缓存池中获取数据（和getRes功能一致）
		 * get resource from pool,just like function getRes
		 * @param url 文件地址 file address
		 */
		public getResByUrl(url:string):any
		{
			return StepLoader._pool[url];
		}

		/**
		 * 根据文件地址从缓存池中获取数据（和getResByUrl功能一致）
		 * get resource from pool,just like function getResByUrl
		 * @param url 文件地址 file address
		 */
		public getRes(url:string):any
		{
			return StepLoader._pool[url];
		}

		/**
		 * 向缓存池中新增缓存文件
		 * add resource to pool
		 * @param url 		文件地址 file address
		 * @param data 		文件内容 file content
		 */
		public addCache(url:string,data:any)
		{
			StepLoader._pool[url] = data;
		}
		
		private _allComplate:Function;
		private _allComplateObj:any;
		public setAllComplate(fun:Function,thisobj:any=null)
		{
			this._allComplate = fun;
			this._allComplateObj = thisobj;
		}
		
		protected complate():void
		{
			if(this._allComplate!=null)
			{
				try{
					this._allComplate.apply(this._allComplateObj);
				}catch(e){
					//trace("[StepLoader] 尝试呼叫结束函数失败",e.getStackTrace());
				}
				this._allComplate = null;
			}
		}
		
		/**
		 * 新增加载文件
		 * @param	url			文件地址
		 * @param	compalte	加载结束触发函数
		 * @param	thisobj		this
		 * @param	isPool		是否入资源池
		 */ 
		public addLoad(url:string,complate:Function,thisobj:any,isPool:boolean=true):void
		{
			if(url.substr(0,4)=='http') url = url.replace(/\\/g,'/');
			
			if(!url || url=='')
			{
				return;
			}
			
			if(StepLoader._pool[url]!=null)
			{
				// 资源池中存在该资源，直接回叫
				//if(complate!=null) this.complate(StepLoader._pool[url]);
				//trace("[StepLoader] 资源池中存在同地址资源，直接处理无需进入队列。",url);
				StepLoader.loadNext();
				return;
			}
			
			var data:D5LoadData = StepLoader._waitList[url];

			data = new D5LoadData();
			data.callback = complate;
			data.inpool = isPool;
			data.url = url;
			data.thisobj = thisobj;
			StepLoader._waitList.push(data);
			
			StepLoader.loadNext();
		}
		
		/**
		 * 删除资源
		 */ 
		public deleteRes(url:string):void
		{
			var res:any = StepLoader._pool[url];
			
			delete StepLoader._pool[url];
		}
	}
}