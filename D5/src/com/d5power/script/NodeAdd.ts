module d5power
{
    export class NodeAdd extends NodeBase implements IScriptNode,IScriptNumber
    {
        
        public vars:Array<string | IScriptNumber | number>;
        private _value:number;
        

        public constructor(manager:INodeManager)
        {
            super(manager);
            this.vars = [];
            this._manager = manager;
            this.type = NodeType.Add;
        }

        public addVar(data:string | IScriptNumber | number):void
        {
            this.vars.push(data);
        }

        public think():void
        {
            var obj:any;
            this._value = 0;
            for(var i:number=0,j:number = this.vars.length;i<j;i++)
            {
                obj = this.vars[i];
                if((<IScriptNumber>obj).getValue)
                {
                    this._value+=(<IScriptNumber>obj).getValue();
                }else if(ScriptRunner.varLibs[obj] || ScriptRunner.staticLibs[obj]){
                    this._value+=ScriptRunner.varLibs[obj] ? ScriptRunner.varLibs[obj] : ScriptRunner.staticLibs[obj];
                }else{
                    this._value+=obj;
                }
            }
        }

        public getValue():number
        {
            this.think();
            return this._value;
        }

        public dispose():void{
            this._manager = null;
            this.vars = null;
        }

        public format(obj:any):void
        {
            if(obj.id>0 && obj.id<NodeType.MAX_ID)
            {
                this.id = obj.id;
                var vars:Array<string | IScriptNumber | number> = [];
                var data:any;
                for(var i:number=0;i<obj.vars.length;i++)
                {
                    data = obj.vars[i];
                    if((<string>data).substr(0,1)=='#')
                    {
                        data = this._manager.getNode(parseInt((<string>data).substr(1)));
                        if(!data) data = 0;
                    }

                    vars.push(data);
                }
                this.vars = vars;
                
            }else{
                console.error('[NodeAdd]解析失败');
            }
        }

        public get obj():any
        {
            var object:any = {};
            object.type = NodeType.Add;
            obj.id = this.id;
            var vars:Array<string> = [];
            var obj:any;
            for(var i:number = 0;i<this.vars.length;i++)
            {
                obj = this.vars[i];
                if((<IScriptNumber>obj).getValue)
                {
                    vars.push('#'+(<IScriptNumber>obj).id);
                }else{
                    vars.push(obj);
                }
            }
            obj.vars = vars;
            return object;
        }
    }
}