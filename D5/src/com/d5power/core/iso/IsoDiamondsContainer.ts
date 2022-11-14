namespace d5poewr
{
	public class IsoDiamondsContainer extends egret.DisplayObjectContainer
	{
		public static tileData:BitmapData;
		public static offsetMx:egret.Matrix = new egret.Matrix(1, 0, 0, 1, -32);
		public staticIsoDiamondsContainer.Tile_Width:number = 64;//iso diamond的widht,其height为32s
		public static Square_Width:number = IsoDiamondsContainer.Tile_Width * .5;
		private _w:number;
		private _h:number;
		private _nw:number;//new width
		private _nh:number;
		private _xoffset:number;
		private _yoffset:number;
		private _virtualRec:egret.Rectangle;//这个长方形是由真实的长方形补全得来
		private needOffsetRelatedCenter:Boolean;
		private gridType:number;
		public constructor(w:number,h:number,xoffset:number = 0,yoffset:number = 0,needOffsetRelatedCenter:Boolean=true)
		{
			super();
			
			if(IsoDiamondsContainer.tileData==null)
			{
				IsoDiamondsContainer.tileData = (new _openTileClass as Bitmap).bitmapData;
				Tile_Width = tileData.width;
				Square_Width =IsoDiamondsContainer.Tile_Width*.5;
				offsetMx.tx = -Square_Width;
				this.needOffsetRelatedCenter = needOffsetRelatedCenter;
				update(w,h,xoffset,yoffset);
			}else{
				this.needOffsetRelatedCenter = needOffsetRelatedCenter;
				update(w,h,xoffset,yoffset);
			}
			
			
		}
		
		private _num:number;
		
		public get nh():number
		{
			return _nh;
		}
		
		public get nw():number
		{
			return _nw;
		}
		
		private _virtualRecShape:egret.Shape;//这个元素在等角世界里
		private endX:number;
		private endY:number;
		private _widthDirection:number;
		private _heightDirection:number;
		private _width:number;
		private _height:number;
		private virtualRecZero:egret.Point;
		protected zeroPointX:number;
		protected zeroPointY:number;
		public update(w:number,h:number,xoffset:number,yoffset:number,leftTopPoint:egret.Point=null):void
		{
			this._w = w;
			this._h = h;
			
			this._xoffset = xoffset;
			this._yoffset = yoffset;
			
			this._widthDirection = Math.ceil( this._w / IsoDiamondsContainer.Tile_Width);
			this._heightDirection = Math.ceil(this._h / (IsoDiamondsContainer.Tile_Width * .5));
			this._num = this._widthDirection + this._heightDirection;
			this._width = this._num * IsoDiamondsContainer.Tile_Width;
			this._height = this._num * IsoDiamondsContainer.Tile_Width * .5;
			
			this.__nw = this.__widthDirection * IsoDiamondsContainer.Tile_Width;
			this.__nh = this.__heightDirection * IsoDiamondsContainer.Tile_Width * .5;
			virtualRecZero = new Point();
			virtualRecZero.x = 0 * Square_Width;
			virtualRecZero.y = _widthDirection * Square_Width;
			virtualRecZero = IsoHelper.twoDToIso(virtualRecZero);
			_virtualRec = new Rectangle(virtualRecZero.x ,virtualRecZero.y,_nw,_nh);
			endX = _virtualRec.width - Math.abs(_virtualRec.x);
			endY = _virtualRec.height + virtualRecZero.y;
			
			if(leftTopPoint)
			{
				zeroPointX = leftTopPoint.x;
				zeroPointY = leftTopPoint.y - _widthDirection;
			}
			if(needOffsetRelatedCenter) updateCoordinate();
		}
		
		public updateDiamondColor():void
		{
			
			var roadArr:Array = WorldMap.me.roadMap;
			if(roadArr==null) return;
			var dis:DisplayObject;
			var arr:Array;
			var tileX:number,tileY:number;
			var color:number;
			for(var i:number=0;i < this.numChildren;i++)
			{
				dis = this.getChildAt(i);
				arr = dis.name.split('_');
				tileX = int(arr[0]) + zeroPointX;
				tileY = int(arr[1]) + zeroPointY;
//				if(roadArr[tileX][tileY] == 1) changeShapeColor(dis as Shape,0xff0000);
//				else changeShapeColor(dis as Shape,0x3e3e3e);
				if(tileX >= roadArr.length) return;
				color =getColor(roadArr[tileX][tileY]);
				changeShapeColor(dis as Shape,color);
			}
		}
		
		public updateDiamondColorByPos(tilePosX:number,tilePosY:number):void
		{
			var dis:DisplayObject;
			var tileX:number,tileY:number;
			var arr:Array;
			for(var i:number=0;i < this.numChildren;i++)
			{
				dis = this.getChildAt(i);
				arr = dis.name.split('_');
				tileX = int(arr[0]) + zeroPointX;
				tileY = int(arr[1]) + zeroPointY;
				if(tileX == tilePosX && tileY == tilePosY)
				{
					var color:number = getColor(WorldMap.me.roadMap[tileX][tileY]);
					changeShapeColor(dis as Shape,color);
					return;
				}
			}
		}
		
		private getColor(colorID:number):number
		{
			var color:number;
			if(colorID == 1)
			{
				color = 0xff0000;
			}else if(colorID == 5)
			{
				color = 0xffff00;
			}else
			{
				color = 0x3e3e3e;
			}
			return color;
		}
		
		protected changeShapeColor(shape:egret.Shape,c:number):void
		{
			shape.graphics.clear();
			this.drawShape(shape,c,IsoDiamondsContainer.Tile_Width);
		}
		
		public get n():number
		{
			return num;
		}
		
		
		private isShowAll:Boolean;
		public draw(c:number=0xff0000,isShowVirtualRect:Boolean = false,isShowAll:Boolean=false,gridType:number = 0):void
		{
//			updateCoordinate()
			this.gridType = gridType;
			this.isShowAll = isShowAll; 
			updateTiles(c);
			if(isShowVirtualRect) drawVirtualRect();
		}
		
		private drawVirtualRect():void
		{
			
			_virtualRecShape = getRec(_nw,_nh,0x00ff00);
			_virtualRecShape.x = virtualRecZero.x ;
			_virtualRecShape.y = virtualRecZero.y;
			addChild(_virtualRecShape);
		}
		
		public var centerOffsetx:number = 0//相对于virtualRec进行的偏差
		public var centerOffsety:number = 0
		private updateCoordinate():void
		{
			var tempx:number = x;
			var tempy:number = y;
			x = (_nw - _width ) * .5 + _xoffset;
			y = (_nh - _height ) * .5 + _yoffset;
			this.x += num  *IsoDiamondsContainer.Tile_Width * .5;
			centerOffsetx = tempx - x;
			centerOffsety = tempy - y;
		}
		
		public var tileList:Dictionary;

		private updateTiles(c:number):void
		{
			tileList = new Dictionary();
			while(this.numChildren) removeChildAt(0);
			var p:Point; 
			var tile:Shape ;
			var cp:Point
			for(var i:number = 0;i < num ; ++i)
			{
				for(var j:number = 0; j < num ;++j)
				{
					p = new Point();
					p.x = j * Square_Width;
					p.y = i * Square_Width;
					p = IsoHelper.twoDToIso(p);
					cp = getTileCenterPos(p.x,p.y);
					if(!isShowAll)
					{
						if(isInRect(cp.x,cp.y))
						{
							tile = getTileShape(Tile_Width,c);
							tile.x = p.x;
							tile.y = p.y;
							addChild(tile);
							tile.name = j + '_' + i;
							
							tileList[tile.name] = tile;
						}
					}else
					{
						tile = getTileShape(Tile_Width,c);
						tile.x = p.x;
						tile.y = p.y;
						addChild(tile);
						tile.name = j + '_' + i;
						
						tileList[tile.name] = tile;
//						trace('iso',j,i);
					}
				}
				
			}
			
			this.graphics.beginFill(0xff0000);
			this.graphics.drawRect(0,0,1280,200);
		}
		
		public twoDToIso(x:number,y:number):Point
		{
			var p:Point = new Point();
			p.x = x * Square_Width;
			p.y = y * Square_Width;
			p = IsoHelper.twoDToIso(p);
			return p;
		}
		
		public getTileCenterPos(x:number,y:number):Point
		{
			var p:Point = new Point();
			y +=IsoDiamondsContainer.Tile_Width * .25  ;
			p.x = x;p.y = y;
			return p;
		}
		
		private getTileShape(w:number,c:number = 0xff0000):Shape
		{
			//此菱形的注册点位于top
			var s:Shape = new Shape();
			//s.visible = false;
			drawShape(s,c,w);
			return s;
		}
		
		protected drawShape(s:Shape,c:number,w:number):void
		{
			var graphics:Graphics = s.graphics;
			if(gridType == 0)
			{
				graphics.beginBitmapFill(IsoDiamondsContainer.tileData, IsoDiamondsContainer.offsetMx, false);
				graphics.lineStyle(0,c, 0);
				graphics.moveTo(0,0);
				graphics.lineTo(w*.5,w*.25);
				graphics.lineTo(0,w*.5);
				graphics.lineTo(-w*.5,w*.25);
				graphics.lineTo(0,0);
				graphics.endFill();
				
			}else
			{
				graphics.beginFill(c,.1);
				graphics.lineStyle(0,c,.5);
				graphics.moveTo(0,0);
				graphics.lineTo(w*.5,w*.25);
				graphics.lineTo(0,w*.5);
				graphics.lineTo(-w*.5,w*.25);
				graphics.lineTo(0,0);
				graphics.endFill();
			}
			
		}
		
		public isInRect(x:number,y:number):Boolean
		{
			if(x >= virtualRecZero.x && x <= endX && y >= virtualRecZero.y && y <= endY)
			{
				return true;
			}
			return false;
		}
		
		/**
		 * 相对于世界地图的坐标 
		 * @param p
		 * @return 
		 * 
		 */
		public getCoordinateRelatedWorldMap(p:Point):Point
		{
			p.x -= virtualRecZero.x;//virtualRecZero相当于世界坐标的0，0点
			p.y -= virtualRecZero.y;
//			p.x -= centerOffsetx;
//			p.y -= centerOffsety;
			return p;
		}
		
		private getRec(w:number,h:number,c:number = 0):Shape
		{
			var rec:Shape = new Shape(); 
			rec.graphics.lineStyle(0,c);
			rec.graphics.drawRect(0,0,w,h);
			return rec;
		}
		
		public get virtualZero():Point
		{
			return virtualRecZero;
		}
	}
}