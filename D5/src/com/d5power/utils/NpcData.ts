module d5power {
    /**
     * NPC数据
     */
    export class NpcData {
        /**
         * NPC编号
         */
        public id:number;
        /**
         * NPC素材是否DragonBones
         */
        public isDB:number = 0;
        /**
         * NPC名
         */
        public name:string;
        /**
         * NPC素材
         */
        public skin:string;
        /**
         * NPC头像
         */
        public head:string;
        public inmap:number;

        public constructor(){
        }
        public format(xml:any):void{
            this.id = parseInt(xml.id);
            if(xml.isDB)
            {
                this.isDB = parseInt(xml.isDB);
            }
            this.name = <string><any>(xml.name);
            this.skin = <string><any>(xml.skin);
            this.head = <string><any>(xml.head);
            this.inmap = parseInt(xml.inmap);
        }

        public toString():string{
            return "npc["+this.id+"]"+this.name+","+this.skin+","+this.inmap;
        }
    }
}
