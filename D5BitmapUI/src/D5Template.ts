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
                if(off)
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
         * 获取一个克隆皮肤
         * @param contianer 容器
         * @param offX 坐标
         * @param offY 坐标
         * @param conf 扩展配置，格式{原始皮肤组件名:{重定义属性:重定义值}}，例：{name:'btn_help',img_temp:{setSkin:"resource/assets/ui/icon_gan.png"},txt_temp:{setText:"Help"}},
         */
        public getInstance(contianer:egret.DisplayObjectContainer,offX:number,offY:number,conf:any=null):D5Component
        {
            var root:D5Component;
            var arr:Array<D5Component> = [];
            for(var i:number=0,j:number=this._skin.length;i<j;i++)
            {
                let comp:D5Component = this._skin[i];
                if(comp['clone'])
                {
                    let n_comp:any = (<any>comp).clone();
                    arr.push(<D5Component>n_comp);
                    n_comp.x = comp.x+offX;
                    n_comp.y = comp.y+offY;
                    (<D5Component>n_comp).cloneFrom = comp;
                    if(conf && conf[comp.name])
                    {
                        let obj:any = conf[comp.name];
                        for(var k in obj)
                        {
                            if(n_comp[k])
                            {
                                n_comp[k] instanceof Function ? n_comp[k](obj[k]) : (n_comp[k] = obj[k]);
                            }
                        }
                    }
                    n_comp.setSize(comp.width,comp.height);
                    if(this._root==comp)
                    {
                        root = n_comp;
                        if(conf && conf.name) contianer[conf.name] = root;
                    }
                    contianer.addChild(n_comp);
                }
            }

            if(conf && conf.name) this._map[conf.name] = arr;
            return root;
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