module d5power
{
    export class ItemData
    {
        public id:number;
        public name:string;
        public info:string;
        public buy:number;
        public sale:number;
        /**
         * 是否可叠加
         */
        public canAdd:boolean;

        public constructor()
        {
            this.id = 0;
            this.name = '';
            this.info = '';
            this.buy = 0;
            this.sale = 0;
            this.canAdd = true;
        }

        public format(obj:any)
        {
            this.id = parseInt(obj.id);
            this.name = obj.name;
            this.info = obj.info;
            this.buy = obj.buy;
            this.sale = obj.sale;
            this.canAdd = obj.canAdd;
        }
    }
}