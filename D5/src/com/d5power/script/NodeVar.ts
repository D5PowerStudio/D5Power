module d5power
{
    export class NodeVar extends NodeBase implements IScriptNode,IScriptNumber
    {
        private static AREA_SCENE:number = 0;
        private static AREA_PUBLI:number = 1;

        public name:string;
        public area:number;
        public value:any;

        public constructor(manager:INodeManager)
        {
            super(manager);
            this.area = 0;
            this.type = NodeType.Var;
        }

        public think()
        {
            if(this.name==null) return;
            if(this.area == NodeVar.AREA_SCENE)
            {
                ScriptRunner.varLibs[this.name] = this.value;
            }else{
                ScriptRunner.staticLibs[this.name] = this.value;
            }
        }

        public getValue():number
        {
            return parseInt(this.value);
        }

        public get obj():any
        {
            var object:any = {};
            object.name = this.name;
            object.value = this.value;
            object.id = this.id;
            object.type = NodeType.Var;
            return object;
        }

        public format(obj:any){
            if(obj.type>0 && obj.type<NodeType.MAX_ID)
            {
                this.id = obj.id;
                this.name = obj.name;
                this.value = obj.value;
            }else{
                console.error('[NodeVar]解析失败');
            }
        }

        public dispose():void{}
    }
}