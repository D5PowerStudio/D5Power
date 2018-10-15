module d5power
{
    /**
     * 脚本控制中心
     * Script Control Center
     */
    export class ScriptRunner implements INodeManager
    {
        private static _me:ScriptRunner;

        public static getInstance():ScriptRunner
        {
            if(ScriptRunner._me==null)
            {
                ScriptRunner._me = new ScriptRunner();
            }

            return ScriptRunner._me;
        }
        /**
         * 脚本脉动间隔
         * 
         */
        private static _pulse:number = 200;
        /**
         * 脚本树
         */
        private _tree:Array<IScriptNode>;
        /**
         * All Nodes
         */
        private _nodeLib:Array<IScriptNode>;
        /**
         * 最后一次脚本脉动的时间
         */
        private _lastPulse:number = 0;
        /**
         * 变量库，仅在当前场景生效
         */
        public static varLibs:any;
        /**
         * 全局变量库
         */
        public static staticLibs:any;

        /**
         * 运行id，用于提供给内存中运行的单元发现自己所属的运行批次已结束。需要终止自身运行
         */
        private static _runid:number = 0;

        private static _index:number = -1;

        private static get index():number
        {
            ScriptRunner._index++;
            return ScriptRunner._index;
        }


        public constructor()
        {
            if(ScriptRunner._me!=null)
            {
                console.error('[ScriptRunner] please get instance throw getInstance function.');
                return;
            }
            this._nodeLib = [];
            this.reset();
            ScriptRunner.staticLibs = {};
        }

        public get runid():number
        {
            return ScriptRunner._runid;
        }

        /**
         * load value of index,and callback
         * @param callback 
         * @param thisobj 
         */
        public init(callback:Function,thisobj:any):void
        {
            ScriptRunner._index = 0;
            callback.apply(thisobj);
        }

        /**
         * 
         */
        private reset():void
        {
            for(var i:number = this._nodeLib.length-1;i>=0;i--)
            {
                this._nodeLib[i].dispose();
            }

            this._nodeLib = [];
            this._tree = [];
            ScriptRunner.varLibs = {};
            // 修改运行批号，从而使批号和内存中的其他但愿不符。造成但愿停运
            ScriptRunner._runid++;
        }

        /**
         * search node by index
         * @param index 
         */
        public getNode(index:number):IScriptNode
        {
            var node:IScriptNode;
            if(this._nodeLib.length)
            {
                
                for(var i:number=0,j:number=this._nodeLib.length;i<j;i++)
                {
                    node = this._nodeLib[i];
                    if(node.id==index) return node;
                }
            }

            return null;
        }

        /**
         * give id to node
         * @param node 
         * @param id 
         */
        public giveId(node:IScriptNode,id:number=-1):number
        {
            node.id = id==-1 ? ScriptRunner.index : id;
            return node.id;
        }

        /**
         * 更换场景
         */
        public changeScene():void
        {
            this.reset();
        }

        public addNode(node:IScriptNode):void
        {
            if(this._tree.indexOf(node)==-1)
            {
                this._nodeLib.push(node);
                this._tree.push(node);
            }
        }

        /**
         * 运行
         * @param t timestamp
         */
        public check(t:number):void
        {
            if(t-this._lastPulse<ScriptRunner._pulse) return;

            this._lastPulse = t;
            var node:IScriptNode;
            for(var i:number=this._tree.length-1;i>=0;i--)
            {
                node = this._tree[i];
                node.think();
                node.check();
                this._tree.pop();
            }
        }
    }
}