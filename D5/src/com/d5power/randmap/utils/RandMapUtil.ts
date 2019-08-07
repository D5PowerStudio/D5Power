module d5power{
	/**
	 * 基于三角形和多边形的随机地图生成类
	 * @author nodep
	 * @version 1.0
	 */
	export class RandMapUtil {
		
		private _assistPoints: Array<Point2D>;
		private _points: Array<Point2D>;
		private _tris: Array<Tri2D>;
		private _polgons: Array<Pol2D>;
		private _maxW: number;
		private _maxH: number;

		/**
		 * 构造一个算法结构
		 * @param points
		 * @param maxW
		 * @param maxH
		 */
		public constructor(points: Array<number>, maxW: number, maxH: number) {
			this._points = new Array<Point2D>();
			var index: number = 0;
			var p2d: Point2D;
			while (index < points.length) {
				p2d = new Point2D(points[index], points[index + 1]);
				this._points.push(p2d);
				index += 2;
			}
			this._maxW = maxW;
			this._maxH = maxH;
		}

		/**获取多边形*/
		public getPolgons(): Array<Pol2D> {
			return this._polgons;
		}

		/**
		 * 构造三角形
		 */
		public delaunay(): void {
			this._tris = new Array<Tri2D>();
			//辅助三角形
			this._assistPoints = [new Point2D(this._maxW / 2, -10000), new Point2D(this._maxW + 10000, this._maxH), new Point2D(-10000, this._maxH)];
			this.addTri([this._assistPoints[0], this._assistPoints[1], this._assistPoints[2]]);
			var index: number = 0;
			var p2d: Point2D;
			//三角形插入
			while (index < this._points.length) {
				p2d = this._points[index];
				this.insertPoint(p2d);
				index++;
			}
		}

		/**像图形中插入一个点*/
		private insertPoint(p: Point2D): void {
			//检查外接圆包含此点的三角形
			var tris: Array<Tri2D> = this.findInsideTri(p);
			//排除公共边之后剩余的边
			var edges: Array<Edge2D> = this.delEdgeInCommon(tris);
			//删除三角形
			while (tris.length > 0)
				this.delTri(tris.pop());
			//用插入的点与剩下的边分别形成新的三角形
			while (edges.length > 0) {
				var edge: Edge2D = edges.pop();
				var tri: Tri2D = this.addTri([p, edge.startPoint, edge.endPoint]);
			}
		}

		/**查询所在三角形,返回所有外接圆范围内的三角形,这个步骤很耗时,可以从设计上进行优化*/
		private findInsideTri(p: Point2D): Array<Tri2D> {
			var key: any;
			var tri: Tri2D;
			var list: Array<Tri2D> = [];
			for (key in this._tris) {
				tri = this._tris[key];
				if (TriangleUtil.isInCircumcircle(p, tri))
					list.push(tri);
			}
			return list;
		}

		/**
		 * 删除这些三角形的公共边,并返回他们剩下的边
		 * @param tris
		 */
		private delEdgeInCommon(tris: Array<Tri2D>): Array<Edge2D> {
			var key: any;
			var lastEdges: Array<string> = [];
			var sameEdges: Array<string> = [];
			var returnEdgs: Array<Edge2D> = [];
			var tri: Tri2D;
			for (key in tris) {
				tri = tris[key];
				var edge: Edge2D;
				for (key in tri.edges) {
					edge = tri.edges[key];
					if (lastEdges.indexOf(edge.id) < 0) {
						lastEdges.push(edge.id);
						returnEdgs.push(edge);
					}
					else
						sameEdges.push(edge.id);
				}
			}
			var i: number = returnEdgs.length - 1;
			for (i; i >= 0; i--) {
				if (sameEdges.indexOf((returnEdgs[i] as Edge2D).id) >= 0)
					returnEdgs.splice(i, 1);
			}
			return returnEdgs;
		}

		/**
		 * 从列表中删除一个三角形
		 * @param tri
		 */
		private delTri(tri: Tri2D): void {
			this._tris.splice(this._tris.indexOf(tri), 1);
			tri.del();
		}

		/**
		 * 项列表中添加一个三角形
		 * @param points
		 * @return
		 */
		private addTri(points: Array<Point2D>): Tri2D {
			var v: Array<Point2D> = new Array<Point2D>(3);
			v[0] = points[0];
			v[1] = points[1];
			v[2] = points[2];
			var tri: Tri2D = new Tri2D(v);
			this._tris.push(tri);
			return tri;
		}

		/**
		 * 进行优化
		 * 1.循环所有的四边形，移动他的重心
		 * 2.刷新所有三角形数据
		 * 3.重新生成四边形数据
		 **/
		public optimization(failBack:Function):boolean {
			var key: any;
			//像重心点移动,还有一个办法是每个三角形角度最小的那个点，向对边垂线靠近
			var pol: Pol2D;
			for (key in this._polgons)
				this._polgons[key].moveToFocus(RandMapUtil.getFoucsPoint(this._polgons[key]));
			this._tris = [];
			var p2d: Point2D;
			for (key in this._points) {
				p2d = this._points[key];
				p2d.tris = [];
			}
			this.delaunay();//分割三角形
			try{
				this.voronoi();//创建四边形
			}catch(e){
				failBack.apply(null);
				return false;
			}
			return true;
		}

		/*
		n边多边形可以分成n-2个三角形，将这些三角形看做质点（质点的位置是三角形的重心x1,x2,..，质量是面积s1,s2,..），那么多边形就由这些质点组成，质点坐标以其质量为权的加权算术平均数即是多边形重心坐标x。
		x=(x1*s1+x2*s2+...)/(s1+s2+...)
		s=s1+s2+...
		*/
		/**获取多边形的重心点*///该算法分凸多边形和任意多边形
		public static getFoucsPoint(pol: Pol2D): egret.Point {
			var tS: number = 0;
			var S: number = 0;
			var sx: number = 0;
			var sy: number = 0.;          //S面积,xy横纵坐标和  
			for (var i: number = 0; i < pol.vertex.length; i++) {
				var t0: number = i;
				var t1: number = i + 1;
				if (t1 == pol.vertex.length)
					t1 = 0;
				tS = this.cross(pol.vertex[t0], pol.vertex[t1]) / 2.;
				S += tS;
				sx += tS * (pol.vertex[t0].x + pol.vertex[t1].x) / 3;
				sy += tS * (pol.vertex[t0].y + pol.vertex[t1].y) / 3;
			}
			return new egret.Point(sx / S, sy / S);
		}

		private static cross(p1: egret.Point, p2: egret.Point): number {
			return p1.x * p2.y - p1.y * p2.x;
		}

		/**通过voronoi算法算出多边形*/
		public voronoi(): void {
			this._polgons = new Array<Pol2D>();
			var key: any;
			var p2d: Point2D;
			for (key in this._points) {
				p2d = this._points[key];
				var pol: Pol2D = this.createPolygon(p2d);
				pol.cutself(this._maxW, this._maxH);
				if (pol.vertex.length >= 3)
					this._polgons.push(pol);
				else
					trace("数据异常：四边形的边的数量异常");
			}
		}

		/**
		 * 寻找一个相邻的三角形
		 * @param fromTri 查询的对象
		 * @param exclude 排除的三角对象
		 * @param all 查询的范围
		 * @return
		 */
		private findAdjacent(fromTri: Tri2D, exclude: Array<Tri2D>, all: Array<Tri2D>): Tri2D {
			var target: Tri2D = null;
			var key: any;
			var tri: Tri2D;
			for (key in all) {
				tri = all[key];
				if (exclude.indexOf(tri) >= 0)
					continue;
				if (TriangleUtil.isAdjacent(fromTri, tri)) {
					target = tri;
					break;
				}
			}
			return target;
		}

		/**
		 * 因为三角形的顶点，就是多边形的中心点
		 * 通过这个顶点可以找到拥有这个顶点的三角形
		 * 按照相邻连接的方法将这些三角形的外接圆圆心点连接起来，就是一个多边形
		 */
		private createPolygon(p2d: Point2D): Pol2D {
			var tris: Array<Tri2D> = p2d.tris;
			var startTri: Tri2D = tris[0];
			var pcList: Array<Tri2D> = [startTri];
			//有一种特殊情况，那就是如果三角形的循环无法有效的回归，则说明这个多边形需要进行补充。
			//在无法衔接的这两个三角形里，非共同边但拥有p2d端点的那个线段，就是需要进行补充的线段。而当前的这个三角形的外接圆心到这条边中线的延长线，就是边界焦点。
			//将焦点连接中心点，形成一个新的三角形。
			//之后在反向查询一次，如果无法连同，则再次执行上两步
			//两边都执行一次之后，这个三角形百分百的与外边框相连接。这个时候判断新生成大的两个三角形的焦点是否在同一条边框上，如果在，用他们两个和中心点构成新的三角形。
			//如果不在，以他们两个点外加边框边缘，形成2个是三角形加入数组。再执行通路检测
			var xlTri: Tri2D = this.findAdjacent(startTri, pcList, tris);
			var lastTri: Tri2D = xlTri;
			var tCount: number = 2;
			while (xlTri != null) {
				pcList.push(xlTri);
				lastTri = xlTri;
				xlTri = this.findAdjacent(xlTri, pcList, tris);
				tCount++;
			}
			if (!(TriangleUtil.isAdjacent(lastTri, startTri) && tCount >= 3)) {
				trace("存在无法构造的多边形");
			}
			var points: Array<Point2D> = new Array<Point2D>();
			for (var i: number = 0; i < pcList.length; i++)
				points.push((pcList[i] as Tri2D).center);
			var polyGon2D: Pol2D = new Pol2D(points);
			polyGon2D.centerPoint = p2d;
			return polyGon2D;
		}

		/**
		 * 螺旋循环获取一个新的坐标
		 * @param startX
		 * @param startY
		 * @param movePoint
		 * @return
		 */
		private screwFind(startX: number, startY: number, movePoint: egret.Point): egret.Point {
			var point: egret.Point = new egret.Point();
			if (movePoint.x == movePoint.y && movePoint.x >= 0 && movePoint.y >= 0)//判断是否已循环完一圈
				movePoint.y = movePoint.y + 1;
			else if (Math.abs(movePoint.x) == Math.abs(movePoint.y))//是否需要转角
			{
				if (movePoint.x < 0 && movePoint.y > 0)
					movePoint.y = movePoint.y - 1;
				else if (movePoint.x < 0 && movePoint.y < 0)
					movePoint.x = movePoint.x + 1;
				else
					movePoint.y = movePoint.y + 1;
			}
			else//只是普通的位移,需要判断x,y谁的绝对值更大。然后再区分方向
			{
				if (Math.abs(movePoint.y) > Math.abs(movePoint.x))//如果y的绝对值比x大，则是移动ｘ
				{
					if (movePoint.y > 0)
						movePoint.x = movePoint.x - 1;
					else
						movePoint.x = movePoint.x + 1;
				}
				else//否则移动y
				{
					if (movePoint.x > 0)
						movePoint.y = movePoint.y + 1;
					else
						movePoint.y = movePoint.y - 1;
				}
			}
			point.x = movePoint.x + startX;
			point.y = movePoint.y + startY;
			return point;
		}

		/**查询拥有的三角形*/
		private findOwnTris(p: Point2D): Array<Tri2D> {
			var list: Array<Tri2D> = [];
			var tri: Tri2D;
			var key: any;
			for (key in this._tris) {
				tri = this._tris[key];
				if (tri.vertex.indexOf(p) >= 0)
					list.push(tri);
			}
			return list;
		}

		/**获取测试形状 */
		public getTestShape(): egret.Shape {
			var shape: egret.Shape = new egret.Shape();
			shape.graphics.lineStyle(1, 0x0000FF, 2);
			var pol: Pol2D;
			var key: any;
			for (key in this._polgons) {
				pol = this._polgons[key];
				shape.graphics.beginFill(0xff0000, 0.5);
				shape.graphics.moveTo(pol.vertex[0].x, pol.vertex[0].y);
				for (var i: number = 1; i < pol.vertex.length; i++)
					shape.graphics.lineTo(pol.vertex[i].x, pol.vertex[i].y);
				shape.graphics.lineTo(pol.vertex[0].x, pol.vertex[0].y);
				shape.graphics.endFill();
			}
			return shape;
		}
	}
}