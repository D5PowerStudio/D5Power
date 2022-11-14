namespace d5power
{
	
	export class IsoHelper
	{
		/**
		 * convert an isometric point to 2D，这里的2d坐标只不过是虚拟的，并不是真实的
		 * */
		public static isoTo2D(pt:egret.Point):egret.Point{
			//gx=(2*isoy+isox)/2;
			//gy=(2*isoy-isox)/2
			var tempPt:egret.Point=new egret.Point(0,0);
			tempPt.x=(2*pt.y+pt.x)/2;
			tempPt.y=(2*pt.y-pt.x)/2;
			return(tempPt);
		}
		/**
		 * convert a 2d point to isometric
		 * */
		public static twoDToIso(pt:egret.Point):egret.Point{
			//gx=(isox-isoxy;
			//gy=(isoy+isox)/2
			var tempPt:egret.Point=new egret.Point(0,0);
			tempPt.x=pt.x-pt.y;
			tempPt.y=(pt.x+pt.y)/2;
			return(tempPt);
		}
		
		/**
		 * convert a 2d point to specific tile row/column
		 * */
		public static getTileCoordinates(pt:egret.Point, tileHeight:number):egret.Point{
			var tempPt:egret.Point=new egert.Point(0,0);
			tempPt.x=Math.floor(pt.x/tileHeight);
			tempPt.y=Math.floor(pt.y/tileHeight);
			
			return(tempPt);
		}
		
		/**
		 * convert specific tile row/column to 2d point
		 * */
		public static get2dFromTileCoordinates(pt:egret.Point, tileHeight:number):egret.Point{
			var tempPt:egret.Point=new egret.Point(0,0);
			tempPt.x=pt.x*tileHeight;
			tempPt.y=pt.y*tileHeight;
			
			return(tempPt);
		}
		
	}
}