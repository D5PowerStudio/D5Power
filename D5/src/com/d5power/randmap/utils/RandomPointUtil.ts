module d5power{
	/**
	 * 关于随机点的应用函数
	 * @author nodep
	 * @version 1.0
	 */
	export class RandomPointUtil {

		/**
		 * 根据框的宽高和边框的宽度，获取随机点
		 */
		public static getRandomPoints(sizeW: number, sizeH: number, border: number, num: number): Array<number> {
			var pointsStr: Array<string> = new Array<string>();
			var points: Array<number> = new Array<number>();
			var rx: number;
			var ry: number;
			var str:string;
			while (num > 0) {
				rx = Math.floor(Math.random() * (sizeW - border * 2) + border);
				ry = Math.floor(Math.random() * (sizeW - border * 2) + border);
				str = rx + "_" + ry;
				if (pointsStr.indexOf(str) >= 0) {
					continue;
				}
				else {
					pointsStr.push(str);
					num--;
					points.push(rx);
					points.push(ry);
				}
			}
			pointsStr = null;
			return points;
		}
	}
}