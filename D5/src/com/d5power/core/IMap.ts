module d5power
{
    export interface IMap
    {
        width:number;
        height:number;
        tileWidth:number;
        tileHeight:number;

        findPath(fromx:number,fromy:number,tox:number,toy:number):Array<any>;
        tile2WorldPostion(tx:number,ty:number):egret.Point;
        getScreenPostion(wx:number,wy:number):egret.Point;
        render();
        setContainer(container:egret.DisplayObjectContainer);
    }
}