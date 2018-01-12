module d5power
{
    /**
     * 地图中的NPC配置
     */
    export class NPConf
    {
        /**
         * NPC编号
         */
        public id:number;
        /**
         * NPC在当前地图的名字
         */
        public name:string;
        /**
         * NPC位置x
         */
        public posx:number;
        /**
         * NPC位置y
         */
        public posy:number;
        /**
         * NPC对话设置
         */
        public say:string;
        /**
         * NPC可执行的脚本
         */
        public script:string;
        /**
         * NPC特殊功能
         */
        public job:ThreeBase;

        public format(obj:any)
        {
            this.id = obj.uid;
            this.name = obj.name;
            this.posx = obj.posx;
            this.posy = obj.posy;
            this.say = obj.say;
            this.script = obj.script;
            if(obj.job!=null)
            {
                this.job = new ThreeBase();
                this.job.type = obj.job.type;
                this.job.key = obj.job.value;
                this.job.count = obj.job.num;
            }
        }
    }
}