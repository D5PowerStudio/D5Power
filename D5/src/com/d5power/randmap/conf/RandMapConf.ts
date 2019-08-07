module d5power{
	export class RandMapConf {

		private static _map_scale_x:number;

		private static _map_scale_y:number;

		private static _world_w:number = 200000;

		private static _world_h:number = 100000;

		private static _smap_w:number = 800;

		private static _smap_h:number = 800;

		public static get SMAP_W():number
		{
			if(isNaN(this._map_scale_x))
			{
				this._map_scale_x = this._world_w/this._smap_w;
				this._map_scale_y = this._world_h/this._smap_h;
			}
			return this._smap_w;
		}

		public static get SMAP_H():number
		{
			return this._smap_h;
		}

		/**
		 * 世界缩放比例
		 */
		public static get map_scale_x():number{
			return this._map_scale_x;
		}
		/**
		 * 世界缩放比例
		 */
		public static get map_scale_y():number{
			return 	this._map_scale_y;
		}

		/**
		 * 世界宽度
		 */
		public static get WORD_W():number
		{
			return this._world_w;
		}

		/**
		 * 世界高度
		 */
		public static get WORD_H():number
		{
			return this._world_h;
		}

		/**
		 * 是否显示河流
		 */
		public static showRiver:boolean = true;



	}
}