module d5power
{
    /**
     * 背包道具映射
     */
    export class PackageItemData
    {
        /**
         * 道具id
         */
        public itemid:number;
        /**
         * 道具数量
         */
        public number:number;
        /**
         * 背包id
         */
        public packageid:number;

        public constructor()
        {
            this.itemid = 0;
            this.number = 0;
            this.packageid = 0;
        }
    }
}