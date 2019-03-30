module d5power{
	/**
	 * 多边形顶点
	 */
	export class AreaPoint extends egret.Point {
		public id: number = 0;
		public nears: Array<AreaPoint> = [];//相邻的点
		public areas: Array<number> = [];//所属区域ID
		public elevation: number = 10;//默认海拔
		public sorted: boolean = false;
		public river: number = 0;

		public constructor(tx: number = 0, ty: number = 0) {
			super(tx, ty);
		}

		/**
		 * 寻找下游
		 * 从小到大进行排序
		 */
		public static findDownstream(p2d:AreaPoint,river:River): AreaPoint {
			if (!p2d.sorted) {
				p2d.sorted = true;//从小到大排序
				p2d.nears.sort(function (a: AreaPoint, b: AreaPoint): number {
					if (a.elevation > b.elevation) return 1;
					else if (a.elevation == b.elevation) return 0;
					return -1;
				})
			}
			for(var i:number=0;i<p2d.nears.length;i++)
			{
				if(river.downsteams.indexOf(p2d.nears[i])<0)
					return p2d.nears[i];
			}
			return null
		}
	}
}