module d5power{
	/**
	 * 用于地图创建的点
	 * @author nodep
	 * @version 1.0
	 */
	export class Point2D extends egret.Point{
		private static _tid:number = 0;
		public tris:Array<Tri2D> = [];
		public id:number;
		public constructor(tx:number=0,ty:number=0)
		{
			super(tx,ty);
			this.id = ++Point2D._tid;
		}
	}
}