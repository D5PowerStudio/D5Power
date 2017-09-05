module d5power
{
    export interface IGD
    {
        posX:number;
        posY:number;
        $pos:egret.Point;
        speed:number;
        beFocus:boolean;
        monitor:egret.DisplayObject;

        setPos(px:number,py:number):void;
        /**
         * 渲染运行
         */
        render(t:number):void;
        /**
         * 数据运行
         */
        run(t:number):void;
    }
}