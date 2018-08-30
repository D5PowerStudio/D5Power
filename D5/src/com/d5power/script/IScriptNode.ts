module d5power
{
    export interface IScriptNode
    {
        /**
         * 
         */
        type:number;
        /**
         * 
         */
        id:number;
        /**
         * 下一脚本
         */
        next:IScriptNode;
        /**
         * 计算
         */
        think():void;
        /**
         * 检查和运行，一般用于后续脚本的运行
         */
        check():void;
        /**
         * 格式化
         * @param obj 格式化的对象
         */
        format(obj:any):void;

        /**
         * 获取json描述对象
         */
        obj:any;

        /**
         * dispose
         */
        dispose():void;

    }
}