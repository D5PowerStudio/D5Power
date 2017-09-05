module d5power
{
    export class PlayerData
    {
        public uid:number;
        private _missionList:Array<number>;

        public constructor()
        {
            this._missionList = [];
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