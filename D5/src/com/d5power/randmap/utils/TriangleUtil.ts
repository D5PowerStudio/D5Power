module d5power{
	/**
	 * 三角函数
	 * @author nodep
	 * @version 1.0
	 */
	export class TriangleUtil {

		/**
		* 求外接圆半径
		* @param tri
		* @return
		*/
		public static getCircumcircleR(tri: Tri2D): number {
			var x1: number = tri.vertex[0].x;
			var x2: number = tri.vertex[1].x;
			var x3: number = tri.vertex[2].x;
			var y1: number = tri.vertex[0].y;
			var y2: number = tri.vertex[1].y;
			var y3: number = tri.vertex[2].y;
			var a: number = Math.sqrt( (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) );
			var b: number = Math.sqrt( (x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3) );
			var c: number = Math.sqrt( (x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3) );
			var p: number = (a + b + c) / 2;
			var S: number = Math.sqrt( p * (p - a) * (p - b) * (p - c) );
			var radius: number = a * b * c / (4 * S);
			return radius;
		}


		/**
		 * 求外接圆圆心坐标
		 * @param tri
		 * @return
		 */
		public static getCircumcirclePoint(tri: Tri2D): Point2D {
			var p: Point2D = new Point2D();
			var x1: number = tri.vertex[0].x;
			var x2: number = tri.vertex[1].x;
			var x3: number = tri.vertex[2].x;
			var y1: number = tri.vertex[0].y;
			var y2: number = tri.vertex[1].y;
			var y3: number = tri.vertex[2].y;
			var t1: number = x1 * x1 + y1 * y1;
			var t2: number = x2 * x2 + y2 * y2;
			var t3: number = x3 * x3 + y3 * y3;
			var temp: number = x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2;
			p.x = (t2 * y3 + t1 * y2 + t3 * y1 - t2 * y1 - t3 * y2 - t1 * y3) / temp / 2;
			p.y = (t3 * x2 + t2 * x1 + t1 * x3 - t1 * x2 - t2 * x3 - t3 * x1) / temp / 2;
			return p;
		}

		/**
		 * 检查一个点是否在一个三角形的外接圆内。
		 * @param point
		 * @param tri
		 * @return
		 */
		public static isInCircumcircle(point: egret.Point, tri: Tri2D): boolean {
			var xd: number = (point.x - tri.center.x);
			var yd: number = (point.y - tri.center.y);
			return Math.sqrt(xd * xd + yd * yd) <= tri.circumR;
		}

		/**
		* 检查两个三角形是否相邻
		* 这个函数所适用的三角形必须是通过特殊流程构造的
		* @param triA
		* @param triB
		*/
		public static isAdjacent(triA: Tri2D, triB: Tri2D): boolean {
			var e1: Edge2D;
			var key: any;
			for (key in triA.edges) {
				e1 = triA.edges[key];
				var e2: Edge2D;
				for (key in triB.edges) {
					e2 = triB.edges[key];
					if (e1.id == e2.id)
						return true;
				}
			}
			return false;
		}

		/**求距离 */
		public static distance(x_x: number, y_y: number): number {
			return Math.abs(Math.sqrt(x_x * x_x + y_y * y_y));
		}
	}
}