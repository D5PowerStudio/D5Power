module d5power
{
    /**
     * 界面模板处理
     * 
     */
    export class D5Template
    {
        /**
         * 原始皮肤
         */
        private _skin:Array<D5Component>;
        /**
         * 根对象，一般设置为界面的背景部分，用来进行坐标的校准
         */
        private _root:D5Component;
        /**
         * 克隆记录
         */
        private _map:any;

        public constructor()
        {
            this._skin = [];
            this._map = {};
        }

        /**
         * 从配置文件进行初始化，用于编辑器
         * @param obj 配置
         */
        public fromJson(obj:any):void
        {

        }

        /**
         * 从组件直接初始化，用于程序开发
         * @param root 根对象
         * @param target 克隆皮肤
         */
        public fromComponent(root:D5Component,...target):void
        {
            this._root = root;
            var off:Array<number>;
            if(root)
            {
                off = [root.x,root.y];
                this._skin.push(root);
                root.x = 0;
                root.y = 0;
                root.parent && root.parent.removeChild(root);
            }
            
            for(var i:number=0,j:number=target.length;i<j;i++)
            {
                let comp:D5Component = target[i];
                if(!comp || comp==root) continue;
                if(off && comp.parent!=root)
                {
                    comp.x -= off[0];
                    comp.y -= off[1];
                }
                comp.parent && comp.parent.removeChild(comp);
                this._skin.push(comp);
            }
        }

        /**
         * 从一个容器进行初始化，用于程序开发，一般用于add2Me方法之后
         * @param root 根对象
         * @param target 克隆皮肤
         */
        public fromContainer(container:D5Component):void
        {
            this._root = container;
            var off:Array<number> = container ? [container.x,container.y] : null;
            this._skin.push(container);
            container.x = container.y = 0;
            for(var i:number=container.numChildren-1;i>0;i--)
            {
                let comp:D5Component = <D5Component>container.getChildAt(i);
                if(!comp) continue;
                this._skin.push(comp);
            }
            container.parent && container.parent.removeChild(container);
        }

        /**
         * 获取一个克隆皮肤，并绑定到一个类
         * @param bindTarget 要绑定的类
         */
        public getInstanceBind(bindTarget:any):any
        {
            var instance:any = new bindTarget();
            for(var i:number=0,j:number=this._skin.length;i<j;i++)
            {
                let comp:D5Component = this._skin[i];
                if(comp['clone'])
                {
                    let n_comp:any = (<any>comp).clone();
                    n_comp.x = comp.x;
                    n_comp.y = comp.y;
                    instance.addChild(n_comp);
                    try
                    {
                        instance[comp.name] = n_comp;
                    }catch(e){

                    }
                }
            }

            return instance;
        }

        
        /**
         * 获取一个克隆皮肤
         */
        public getInstance():egret.Sprite
        {
            var instance:any = new egret.Sprite();
            for(var i:number=0,j:number=this._skin.length;i<j;i++)
            {
                let comp:D5Component = this._skin[i];
                if(comp['clone'])
                {
                    let n_comp:any = (<any>comp).clone();
                    n_comp.x = comp.x;
                    n_comp.y = comp.y;
                    instance.addChild(n_comp);
                }
            }

            return instance;
        }

        /**
         * 整体移动克隆后的界面，只能针对设置了根对象的皮肤
         * @param name 要移动位置的克隆体名字
         * @param offX 移动坐标
         * @param offY 移动坐标
         */
        public offSet(name:string,offX:number,offY:number):void
        {
            if(!this._root) return;
            if(this._map[name])
            {
                let arr:Array<D5Component> = this._map[name];
                arr.forEach(element => {
                    element.x = element.cloneFrom.x+offX;
                    element.y = element.cloneFrom.y+offY
                });
            }
        }
    }
}