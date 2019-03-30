module d5power{
	/**
	 * 业务用三角形
	 * @author nodep
	 * @version 1.0
	 */
	export class Tri2D {

		//是否已初始化三角函数
		public inited: boolean = false;
		//顶点
		public vertex: Array<Point2D>;
		//外接圆心
		public center: Point2D;
		//外接圆半径
		public circumR: number = 0;
		//三角形的三条边
		public edges: Array<Edge2D> = new Array<Edge2D>(3);
		//是否属于辅助三角形
		public isAssist: boolean = false;
		/**重心*/
		public focusPoint: egret.Point;
		/**面积*/
		public area: number;

		public constructor(points: Array<Point2D>, autoBuild: boolean = true) {
			this.vertex = points;
			this.vertex[0].tris.push(this);
			this.vertex[1].tris.push(this);
			this.vertex[2].tris.push(this);
			this.inited = autoBuild;
			this.edges[0] = new Edge2D(points[0], points[1]);
			this.edges[1] = new Edge2D(points[1], points[2]);
			this.edges[2] = new Edge2D(points[2], points[0]);
			if (this.inited)
				this.flush();
		}

		/**
		* 刷新三角形的重要属性
		*/
		public flush(): void {
			this.inited = true;
			this.center = TriangleUtil.getCircumcirclePoint(this);
			this.circumR = TriangleUtil.getCircumcircleR(this);
		}

		/**三角形被销毁*/
		public del(): void {
			this.vertex[0].tris.splice(this.vertex[0].tris.indexOf(this), 1);
			this.vertex[1].tris.splice(this.vertex[1].tris.indexOf(this), 1);
			this.vertex[2].tris.splice(this.vertex[2].tris.indexOf(this), 1);
		}
	}
}