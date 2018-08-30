module d5power
{
    /**
     * 可以获得数值的脚本类型
     */
    export interface IScriptNumber extends IScriptNode
    {
        getValue():number;
    }
}