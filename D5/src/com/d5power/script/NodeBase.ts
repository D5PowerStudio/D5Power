module d5power
{
    export class NodeBase
    {
        public id:number;
        public next:IScriptNode;
        public type:number;
        public runid:number;
        protected _manager:INodeManager;
        
        public constructor(manager:INodeManager)
        {
            this._manager = manager;
            this.runid = manager.runid;
        }

        public check():void
        {
            if(this.next!=null && this.runid==this._manager.runid)
            {
                this.next.think();
                this.next.check();
            }
        }
    }
}