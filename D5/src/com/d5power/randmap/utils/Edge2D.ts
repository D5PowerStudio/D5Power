module d5power{
	/**
	 * 维若图用边数据结构
	 * @author nodep
	 * @version 1.0
	 */
	export class Edge2D {
		public id: string;
		public startPoint: Point2D;
		public endPoint: Point2D;
		public constructor(p1: Point2D, p2: Point2D) {
			if (p1.id > p2.id) {
				this.startPoint = p2;
				this.endPoint = p1;
			}
			else {
				this.startPoint = p1;
				this.endPoint = p2;
			}
			this.id = this.startPoint.id + "_" + this.endPoint.id;
		}
	}
}