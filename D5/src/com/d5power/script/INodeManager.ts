module d5power
{
    export interface INodeManager
    {
        getNode(index:number):IScriptNode;
        giveId(node:IScriptNode):number;
        runid:number;
    }
}