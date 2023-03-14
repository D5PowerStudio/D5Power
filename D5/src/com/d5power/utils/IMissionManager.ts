module d5power
{
	export interface IMissionManager
	{
		/**
		 * 获得任务
		 */
		addMission(id:number):boolean;
		/**
		 * 删除任务
		 */
		deleteMission(data:MissionData):boolean;
		/**
		 * 自定义条件检测
		 */
		custormCheck(data:ThreeBase):boolean
        /**
         * 自定义条件进度
         * @param data 
         */
        custormProcess(data:ThreeBase):string;
		/**
		 * 是否具备某个条件的独立检查器
		 */ 
		hasChecker(type:number):boolean
		/**
		 * 是否具备某个任务
		 */ 
		hasMission(id:number):boolean
		/**
		 * 检查某物品数量
		 */ 
		hasItemNum(itemid:number):number;
		/**
		 * 检查时否拥有特定数量的游戏币
		 */ 
		hasMoney(value:number):boolean;
		/**
		 * 检查是否拥有某个标记
		 */ 
		hasMark(id:number):boolean;
		/**
		 * 是否和某NPC对话过
		 */ 
		hasTalkedWith(npcid:number):boolean;
		/**
		 * 杀死怪物数量
		 */ 
		killMonseterNum(monsterid:number):number;
		/**
		 * 玩家属性达到
		 */ 
		userPro(pro_name:string,value:number):boolean;
		/**
		 * 得到某物品
		 */ 
		getItem(itemid:number,num:number):boolean;
		
		/**
		 * 获得经验
		 */ 
		getExp(num:number):void;
		
		/**
		 * 获得某个任务
		 */  
		addMissionById(id:number):void;
		/**
		 * 获得游戏币
		 */ 
		getMoney(num:number):boolean
	}
}