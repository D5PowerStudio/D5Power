module d5power
{
    /**
     * 玩家数据
     */
    export class PlayerData
    {
        /**
         * 玩家id
         */
        public uid:number;
        /**
         * 任务列表
         */
        private _missionList:Array<number>;
        /**
         * 背包
         */
        private _itemList:Array<PackageItemData>;

        public constructor()
        {
            this._missionList = [];
            this._itemList = [];
        }

        public getMission(id:number):void
        {
            if(this._missionList.indexOf(id)==-1)
            {
                this._missionList.push(id);
            }
        }

    }
}