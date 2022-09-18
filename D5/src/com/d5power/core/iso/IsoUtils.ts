namespace d5power
{
	export class IsoUtils
	{
		// a more accurate version of 1.2247...
		public static Y_CORRECT:number = Math.cos(-Math.PI / 6) * Math.SQRT2;
		
		/**
		 * Converts a 3D point in isometric space to a 2D screen position.
		 * @arg pos the 3D point.
		 */
		public static isoToScreen(pos:Point3D):egret.Point
		{
			var screenX:number = pos.x - pos.z;
			var screenY:number = pos.y * this.Y_CORRECT + (pos.x + pos.z) * .5;
			return new egret.Point(screenX, screenY);
		}
		
		/**
		 * Converts a 2D screen position to a 3D point in isometric space, assuming y = 0.
		 * @arg point the 2D point.
		 */
		public static screenToIso(point:egret.Point):Point3D
		{
			var xpos:number = point.y + point.x * .5;
			var ypos:number = 0;
			var zpos:number = point.y - point.x * .5;
			return new Point3D(xpos, ypos, zpos);
		}
		
	}
}