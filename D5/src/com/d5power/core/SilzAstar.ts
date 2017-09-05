//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, MicroGame Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
module d5power {
    export class SilzAstar {

        /**
         * 寻路方式，8方向和4方向，有效值为8和4
         */
        private static WorkMode:number = 8;

        private _grid:Grid;
        private _index:number;
        private _path:Array<any>;
        private astar:AStar;

        /**
         * 地图显示尺寸
         */
        private _cellSize:number = 5;
        /**
         * 路径显示器
         */
        private path:egret.Sprite = new egret.Sprite();
        /**
         * 地图显示器
         */
        private image:egret.Bitmap = new egret.Bitmap();//new BitmapData(1, 1)
        /**
         * 显示容器
         */
        private imageWrapper:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

        /**
         * 显示模式
         */
        private isDisplayMode:boolean = false;

        /**
         * @param    mapdata        地图数据
         * @param    container    显示容器，若为null则不显示地图
         */
        public constructor(mapdata:Array<any>, container:egret.DisplayObjectContainer = null) {
            if (container != null) {
                this.isDisplayMode = true;
                this.imageWrapper.addChild(this.image);

                container.addChild(this.imageWrapper);

                this.imageWrapper.addChild(this.path);
            } else {
                this.isDisplayMode = false;
            }

            this.makeGrid(mapdata);
        }

        public set WORKMODE(v:number) {
            if (v != 8 && v != 4) throw new Error('仅支持8方向或4方向寻路');
        }

        /**
         * @param        xnow    当前坐标X(寻路格子坐标)
         * @param        ynow    当前坐标Y(寻路格子坐标)
         * @param        xpos    目标点X(寻路格子坐标)
         * @param        ypos    目标点Y(寻路格子坐标)
         */
        public find(xnow:number, ynow:number, xpos:number, ypos:number):Array<any> {
            xpos = Math.min(xpos, this._grid.numCols - 1);
            ypos = Math.min(ypos, this._grid.numRows - 1);
            xpos = Math.max(xpos, 0);
            ypos = Math.max(ypos, 0);
            
            // 超出寻路范围
            if(!this._grid.nodeValuable(xpos,ypos)) return null;
            
            this._grid.setEndNode(xpos, ypos); //1


            xnow = Math.min(xnow, this._grid.numCols - 1);
            ynow = Math.min(ynow, this._grid.numRows - 1);
            xnow = Math.max(xnow, 0);
            ynow = Math.max(ynow, 0);

            if(!this._grid.nodeValuable(xnow,ynow)) return null;
            this._grid.setStartNode(xnow, ynow); //2

            if (this.isDisplayMode) {
                var time:number = egret.getTimer();
            }


            if (this.astar.findPath()) { //3
                this._index = 0;

                this.astar.floyd();
                this._path = this.astar.floydPath;

                if (this.isDisplayMode) {
                    time = egret.getTimer() - time;
                    console.log("[SilzAstar]", time + "ms   length:" + this.astar.path.length);
                    console.log("[SilzAstar]", this.astar.floydPath);
                    this.path.graphics.clear();
                    for (var i:number = 0; i < this.astar.floydPath.length; i++) {
                        var p:SilzAstarNode = this.astar.floydPath[i];
                        this.path.graphics.lineStyle(0, 0xff0000);
                        this.path.graphics.drawCircle((p.x + 0.5) * this._cellSize, (p.y + 0.5) * this._cellSize, 2);

                        this.path.graphics.lineStyle(0, 0xff0000, 0.5);
                        this.path.graphics.moveTo(xnow, ynow);
                    }
                }

                return this._path;
            } else if (this.isDisplayMode) {
                this._grid.setEndNode(xpos - 1, ypos - 1);
                time = egret.getTimer() - time;
                console.log("[SilzAstar]", time + "ms 找不到");
            }

            return null;
        }

        private makeGrid(data:Array<any>):void {
            var rows:number = data.length;
            var cols:number = data[0].length;
            this._grid = new Grid(cols, rows);

            var px:number;
            var py:number;

            for (py = 0; py < rows; py++) {
                for (px = 0; px < cols; px++) {
                    this._grid.setWalkable(px, py, data[py][px] == 0);
                }
            }

            if (SilzAstar.WorkMode == 4)
                this._grid.calculateLinks(1);
            else
                this._grid.calculateLinks();

            this.astar = new AStar(this._grid);

            if (this.isDisplayMode) {
                this.drawGrid();
                this.path.graphics.clear();
            }
        }

        private drawGrid():void {
            console.log("fuck")
//			this.image.bitmapData = new BitmapData(this._grid.numCols * this._cellSize, this._grid.numRows * this._cellSize, false, 0xffffff);
//			for (var i:number = 0; i < this._grid.numCols; i++){
//				for (var j:number = 0; j < this._grid.numRows; j++){
//					var node:SilzAstarNode = this._grid.getNode(i, j);
//					if (!node.walkable){
//						this.image.bitmapData.fillRect(new egret.Rectangle(i * this._cellSize, j * this._cellSize, this._cellSize, this._cellSize), this.getColor(node));
//					}
//				}
//			}
        }

        private getColor(node:SilzAstarNode):number {
            if (!node.walkable)
                return 0;
            if (node == this._grid.startNode)
                return 0xcccccc;
            if (node == this._grid.endNode)
                return 0xcccccc;
            return 0xffffff;
        }

    }


    export class AStar {
        //private var _open:Array;
        private _open:BinaryHeap;
        private _grid:Grid;
        private _endNode:SilzAstarNode;
        private _startNode:SilzAstarNode;
        private _path:Array<any>;
        private _floydPath:Array<any>;
        public heuristic:Function;
        private _straightCost:number = 1.0;
        private _diagCost:number = Math.SQRT2;
        private nowversion:number = 1;


        public constructor(grid:Grid) {
            this._grid = grid;
            this.heuristic = this.euclidian2;

        }

        private justMin(x:any, y:any):boolean {
            return x.f < y.f;
        }

        public findPath():boolean {
            this._endNode = this._grid.endNode;
            this.nowversion++;
            this._startNode = this._grid.startNode;
            //_open = [];
            this._open = new BinaryHeap(this.justMin);
            this._startNode.g = 0;
            return this.search();
        }

        public floyd():void {
            if (this.path == null)
                return;
            this._floydPath = this.path.concat();
            var len:number = this._floydPath.length;
            if (len > 2) {
                var vector:SilzAstarNode = new SilzAstarNode(0, 0);
                var tempVector:SilzAstarNode = new SilzAstarNode(0, 0);
                this.floydVector(vector, this._floydPath[len - 1], this._floydPath[len - 2]);
                for (var i:number = this._floydPath.length - 3; i >= 0; i--) {
                    this.floydVector(tempVector, this._floydPath[i + 1], this._floydPath[i]);
                    if (vector.x == tempVector.x && vector.y == tempVector.y) {
                        this._floydPath.splice(i + 1, 1);
                    } else {
                        vector.x = tempVector.x;
                        vector.y = tempVector.y;
                    }
                }
            }
            len = this._floydPath.length;
            for (i = len - 1; i >= 0; i--) {
                for (var j:number = 0; j <= i - 2; j++) {
                    if (this.floydCrossAble(this._floydPath[i], this._floydPath[j])) {
                        for (var k:number = i - 1; k > j; k--) {
                            this._floydPath.splice(k, 1);
                        }
                        i = j;
                        len = this._floydPath.length;
                        break;
                    }
                }
            }
        }

        private floydCrossAble(n1:SilzAstarNode, n2:SilzAstarNode):boolean {
            var ps:Array<any> = this.bresenhamNodes(new egret.Point(n1.x, n1.y), new egret.Point(n2.x, n2.y));
            for (var i:number = ps.length - 2; i > 0; i--) {
                if (!this._grid.getNode(ps[i].x, ps[i].y).walkable) {
                    return false;
                }
            }
            return true;
        }

        private bresenhamNodes(p1:egret.Point, p2:egret.Point):Array<any> {
            var steep:boolean = Math.abs(p2.y - p1.y) > Math.abs(p2.x - p1.x);
            if (steep) {
                var temp:number = p1.x;
                p1.x = p1.y;
                p1.y = temp;
                temp = p2.x;
                p2.x = p2.y;
                p2.y = temp;
            }
            var stepX:number = p2.x > p1.x ? 1 : (p2.x < p1.x ? -1 : 0);
            var stepY:number = p2.y > p1.y ? 1 : (p2.y < p1.y ? -1 : 0);
            var deltay:number = (p2.y - p1.y) / Math.abs(p2.x - p1.x);
            var ret:Array<any> = [];
            var nowX:number = p1.x + stepX;
            var nowY:number = p1.y + deltay;
            if (steep) {
                ret.push(new egret.Point(p1.y, p1.x));
            } else {
                ret.push(new egret.Point(p1.x, p1.y));
            }
            while (nowX != p2.x) {
                var fy:number = Math.floor(nowY)
                var cy:number = Math.ceil(nowY);
                if (steep) {
                    ret.push(new egret.Point(fy, nowX));
                } else {
                    ret.push(new egret.Point(nowX, fy));
                }
                if (fy != cy) {
                    if (steep) {
                        ret.push(new egret.Point(cy, nowX));
                    } else {
                        ret.push(new egret.Point(nowX, cy));
                    }
                }
                nowX += stepX;
                nowY += deltay;
            }
            if (steep) {
                ret.push(new egret.Point(p2.y, p2.x));
            } else {
                ret.push(new egret.Point(p2.x, p2.y));
            }
            return ret;
        }

        private floydVector(target:SilzAstarNode, n1:SilzAstarNode, n2:SilzAstarNode):void {
            target.x = n1.x - n2.x;
            target.y = n1.y - n2.y;
        }

        public search():boolean {
            var node:SilzAstarNode = this._startNode;
            node.version = this.nowversion;
            while (node != this._endNode) {
                var len:number = node.links.length;
                for (var i:number = 0; i < len; i++) {
                    var test:SilzAstarNode = node.links[i].node;
                    var cost:number = node.links[i].cost;
                    var g:number = node.g + cost;
                    var h:number = this.heuristic(test);
                    var f:number = g + h;
                    if (test.version == this.nowversion) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = node;
                        }
                    } else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                        this._open.ins(test);
                        test.version = this.nowversion;
                    }

                }
                if (this._open.a.length == 1) {
                    return false;
                }
                node = <SilzAstarNode><any> (this._open.pop());
            }
            this.buildPath();
            return true;
        }

        private buildPath():void {
            this._path = [];
            var node:SilzAstarNode = this._endNode;
            this._path.push(node);
            while (node != this._startNode) {
                node = node.parent;
                this._path.unshift(node);
            }
        }

        public get path():Array<any> {
            return this._path;
        }

        public get floydPath():Array<any> {
            return this._floydPath;
        }

        public manhattan(node:SilzAstarNode):number {
            return Math.abs(node.x - this._endNode.x) + Math.abs(node.y - this._endNode.y);
        }

        public manhattan2(node:SilzAstarNode):number {
            var dx:number = Math.abs(node.x - this._endNode.x);
            var dy:number = Math.abs(node.y - this._endNode.y);
            return dx + dy + Math.abs(dx - dy) / 1000;
        }

        public euclidian(node:SilzAstarNode):number {
            var dx:number = node.x - this._endNode.x;
            var dy:number = node.y - this._endNode.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        private TwoOneTwoZero:number = 2 * Math.cos(Math.PI / 3);

        public chineseCheckersEuclidian2(node:SilzAstarNode):number {
            var y:number = node.y / this.TwoOneTwoZero;
            var x:number = node.x + node.y / 2;
            var dx:number = x - this._endNode.x - this._endNode.y / 2;
            var dy:number = y - this._endNode.y / this.TwoOneTwoZero;
            return this.sqrt(dx * dx + dy * dy);
        }

        private sqrt(x:number):number {
            return Math.sqrt(x);
        }

        public euclidian2(node:SilzAstarNode):number {
            var dx:number = node.x - this._endNode.x;
            var dy:number = node.y - this._endNode.y;
            return dx * dx + dy * dy;
        }

        public diagonal(node:SilzAstarNode):number {
            var dx:number = Math.abs(node.x - this._endNode.x);
            var dy:number = Math.abs(node.y - this._endNode.y);
            var diag:number = Math.min(dx, dy);
            var straight:number = dx + dy;
            return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
        }
    }

    export class BinaryHeap {
        public a:Array<any> = [];
        public justMinFun:Function = function (x:any, y:any):boolean {
            return this.x < this.y;
        };

        public constructor(justMinFun:Function = null) {
            this.a.push(-1);
            if (justMinFun != null)
                this.justMinFun = justMinFun;
        }

        public ins(value:any):void {
            var p:number = this.a.length;
            this.a[p] = value;
            var pp:number = p >> 1;
            while (p > 1 && this.justMinFun(this.a[p], this.a[pp])) {
                var temp:any = this.a[p];
                this.a[p] = this.a[pp];
                this.a[pp] = temp;
                p = pp;
                pp = p >> 1;
            }
        }

        public pop():any {
            var min:any = this.a[1];
            this.a[1] = this.a[this.a.length - 1];
            this.a.pop();
            var p:number = 1;
            var l:number = this.a.length;
            var sp1:number = p << 1;
            var sp2:number = sp1 + 1;
            while (sp1 < l) {
                if (sp2 < l) {
                    var minp:number = this.justMinFun(this.a[sp2], this.a[sp1]) ? sp2 : sp1;
                } else {
                    minp = sp1;
                }
                if (this.justMinFun(this.a[minp], this.a[p])) {
                    var temp:any = this.a[p];
                    this.a[p] = this.a[minp];
                    this.a[minp] = temp;
                    p = minp;
                    sp1 = p << 1;
                    sp2 = sp1 + 1;
                } else {
                    break;
                }
            }
            return min;
        }
    }

    export class Grid {

        private _startNode:SilzAstarNode;
        private _endNode:SilzAstarNode;
        private _nodes:Array<any>;
        private _numCols:number;
        private _numRows:number;

        private type:number;

        private _straightCost:number = 1.0;
        private _diagCost:number = Math.SQRT2;

        public constructor(numCols:number, numRows:number) {
            this._numCols = numCols;
            this._numRows = numRows;
            this._nodes = new Array<any>();

            for (var i:number = 0; i < this._numCols; i++) {
                this._nodes[i] = new Array<any>();
                for (var j:number = 0; j < this._numRows; j++) {
                    this._nodes[i][j] = new SilzAstarNode(i, j);
                }
            }
        }

        /**
         *
         * @param   type    0四方向 1八方向 2跳棋
         */
        public calculateLinks(type:number = 0):void {
            this.type = type;
            for (var i:number = 0; i < this._numCols; i++) {
                for (var j:number = 0; j < this._numRows; j++) {
                    this.initNodeLink(this._nodes[i][j], type);
                }
            }
        }

        public getType():number {
            return this.type;
        }

        /**
         *
         * @param   node
         * @param   type    0八方向 1四方向 2跳棋
         */
        private initNodeLink(node:SilzAstarNode, type:number):void {
            var startX:number = Math.max(0, node.x - 1);
            var endX:number = Math.min(this.numCols - 1, node.x + 1);
            var startY:number = Math.max(0, node.y - 1);
            var endY:number = Math.min(this.numRows - 1, node.y + 1);
            node.links = [];
            for (var i:number = startX; i <= endX; i++) {
                for (var j:number = startY; j <= endY; j++) {
                    var test:SilzAstarNode = this.getNode(i, j);
                    if (test == node || !test.walkable) {
                        continue;
                    }
                    if (type != 2 && i != node.x && j != node.y) {
                        var test2:SilzAstarNode = this.getNode(node.x, j);
                        if (!test2.walkable) {
                            continue;
                        }
                        test2 = this.getNode(i, node.y);
                        if (!test2.walkable) {
                            continue;
                        }
                    }
                    var cost:number = this._straightCost;
                    if (!((node.x == test.x) || (node.y == test.y))) {
                        if (type == 1) {
                            continue;
                        }
                        if (type == 2 && (node.x - test.x) * (node.y - test.y) == 1) {
                            continue;
                        }
                        if (type == 2) {
                            cost = this._straightCost;
                        } else {
                            cost = this._diagCost;
                        }
                    }
                    node.links.push(new Link(test, cost));
                }
            }
        }
        
        public nodeValuable(x:number,y:number):boolean
        {
            if(!this._nodes || !this._nodes[x] || !this._nodes[x][y]) return false;
            return true;
        }

        public getNode(x:number, y:number):SilzAstarNode {
            return this._nodes[x][y];
        }

        public setEndNode(x:number, y:number):void {
            this._endNode = this._nodes[x][y];
        }

        public setStartNode(x:number, y:number):void {
            this._startNode = this._nodes[x][y];
        }

        public setWalkable(x:number, y:number, value:boolean):void {
            this._nodes[x][y].walkable = value;
        }

        public get endNode():SilzAstarNode {
            return this._endNode;
        }

        public get numCols():number {
            return this._numCols;
        }

        public get numRows():number {
            return this._numRows;
        }

        public get startNode():SilzAstarNode {
            return this._startNode;
        }

    }

    export class Link {
        public node:SilzAstarNode;
        public cost:number;

        public constructor(node:SilzAstarNode, cost:number) {
            this.node = node;
            this.cost = cost;
        }

    }

    export class SilzAstarNode {
        public x:number;
        public y:number;
        public f:number;
        public g:number;
        public h:number;
        public walkable:boolean = true;
        public parent:SilzAstarNode;
        //public var costMultiplier:Number = 1.0;
        public version:number = 1;
        public links:Array<any>;

        //public var index:int;
        public constructor(x:number, y:number) {
            this.x = x;
            this.y = y;
        }

        public toString():string {
            return "x:" + this.x + " y:" + this.y;
        }
    }
}