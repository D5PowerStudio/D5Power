module d5power{
	/**
	 * 湖泊
	 */
	export class Lake {

		private static ccId:number = 0;
		public id:number;
		private _areas:Array<number> = new Array<number>();

		public constructor() {
			Lake.ccId ++;
			this.id = Lake.ccId;
		}

		/**添加一个区域ID */
		public addArea(areaId:number):void
		{
			if(this._areas.indexOf(areaId)<0)
				this._areas.push(areaId);
		}

		/**获取区域 */
		public getAreas():Array<number>
		{
			return this._areas;
		}

		public checkSefl():void
		{
			trace("LakeID="+this.id+" AreaCount="+this._areas.length);
		}
	}
}