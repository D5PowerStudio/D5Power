module d5power
{
    /**
	 * 单个任务数据
	 */

    export class MissionData
    {
        /**
		 * 承接类任务 ！
		 */ 
		public static TYPE_GET:number = 0;
		
		/**
		 * 交付类任务 ？
		 */ 
		public static TYPE_COMPLATE:number = 1;
		
		 public type:number;
		/**
		 * 任务ID
		 */ 
		 public id:number;
		/**
		 * 任务名
		 */ 
		 public name:string;
		/**
		 * 任务内容
		 */ 
		 public info:string;
		/**
		 * NPC对话内容
		 */ 
		 public npc_said:string;
		/**
		 * 未完成任务的对话
		 */ 
		 public uncompDialog:string;
		/**
		 * 相关NPC
		 */ 
		 public npc_id:number;
		/**
		 * 是否完成
		 */ 
		 public iscomplate:boolean=false;
		
		/**
		 * 任务完成后脚本
		 */ 
		 public complate_script:string;
		/**
		 * 任务需求
		 */ 
		 public need:Array<ThreeBase>;
		/**
		 * 任务奖励
		 */ 
		 public give:Array<ThreeBase>;
		

		public constructor(id:number)
		{
            this.id = id;
            this.need = [];
            this.give = [];
		}
		
		public formatFromJSON(data:any):void
		{
			
			this.type = data.type;
			this.name = data.name;
			this.info = data.info;
			this.npc_id = data.say;
			this.npc_id = data.npc;
			this.uncompDialog = data.uncomp;
			this.complate_script = data.complateScript;
			this.complate_script = this.complate_script==null || this.complate_script=='null' ? '' : this.complate_script;
			
			var block:ThreeBase;
			
			if(this.need==null)
			{
				this.need = [];
				this.give = [];
			}
            
			for(var k in data.need)
			{
                var obj:any = data.need[k];
				block = new ThreeBase();
				block.type = obj.type;
                block.key = obj.key;
                block.count = obj.count;

				this.need.push(block);
			}
			
			for(k in data.give)
			{
                obj = data.give[k];
				block = new ThreeBase();
				block.type = obj.type;
                block.key = obj.key;
                block.count = obj.count;

				this.give.push(block);
			}
        }

		public fromXML(xml:XML):void{
			this.type = xml.nodes.type;
			this.name = xml.nodes.name;
			this.info = xml.nodes.info;
			this.npc_id = xml.nodes.say;
			this.npc_id = xml.nodes.npc;
			this.uncompDialog = xml.nodes.uncomp;
			//this.complate_script = data.complateScript;
			//this.complate_script = this.complate_script==null || this.complate_script=='null' ? '' : this.complate_script;
			
			var block:ThreeBase;
			
			if(this.need==null)
			{
				this.need = [];
				this.give = [];
			}
            
			for(var i:number=0,j:number = xml.children.length;i<j;i++)
			{
				var node:any = xml.children[i];
				if(node.name=='need')
				{
					block = new ThreeBase();
					block.type = node.attributes.type;
					block.key = node.attributes.value;
					block.count = node.attributes.num;
					this.need.push(block);
				}else if(node.name=="give"){
					block = new ThreeBase();
					block.type = node.attributes.type;
					block.key = node.attributes.value;
					block.count = node.attributes.num;
					this.give.push(block);
				}
			}
		}
		
		public get needstring():string
		{
			var needstr:string = '';
			for(var k in this.need)
			{
                var need:ThreeBase = this.need[k];
				needstr+=MissionNR.getChinese(need.type)+"()"
			}
			
			return needstr;
		}
		/**
		 * 任务是否完成
		 */ 
		public get isComplate():boolean
		{
			return this.iscomplate;
		}
		
		/**
		 * 增加完成条件 
		 */ 
		public addNeed(need:ThreeBase):void
		{
			if(this.need.indexOf(need)==-1) this.need.push(need);
		}
		/**
		 * 增加奖励内容
		 */ 
		public addGive(give:ThreeBase):void
		{
			if(this.give.indexOf(give)==-1) this.give.push(give);
		}
		/**
		 * 检查当前任务是否完成
		 */ 
		public check(checker:IMissionManager):boolean
		{		
			this.iscomplate=true;
			if(this.need!=null)
			{
				for(var k in this.need)
				{
                    var need:ThreeBase = this.need[k];
					switch(need.type)
					{
						case MissionNR.N_ITEM_NEED:
						case MissionNR.N_ITEM_TACKED:
							this.iscomplate = this.iscomplate && checker.hasItemNum(<number><any>need.key)>=need.count;
							break;
						case MissionNR.N_MONEY:
						case MissionNR.N_MONEY_KEEP:
							this.iscomplate = this.iscomplate && checker.hasMoney(<number><any>need.key);
							break;
						case MissionNR.N_MARK:
							this.iscomplate = this.iscomplate && checker.hasMark(<number><any>need.key);
							break;
						case MissionNR.N_MONSTER_KILLED:
							this.iscomplate = this.iscomplate && checker.killMonseterNum(<number><any>need.key)>=need.count;
							break;
						case MissionNR.N_PLAYER_PROP:
							this.iscomplate = this.iscomplate && checker.userPro(need.key,need.count);
							break;
						case MissionNR.N_MISSION:
							this.iscomplate = this.iscomplate && checker.hasMission(<number><any>need.key);
							break;
						case MissionNR.N_TALK_NPC:
							this.iscomplate = this.iscomplate && checker.hasTalkedWith(<number><any>need.key);
							break;
						default:
							if(checker.hasChecker(need.type)) this.iscomplate = this.iscomplate && checker.custormCheck(need);
							break;
					}
				}
			}
			return this.iscomplate;
		}
		
		/**
		 * 完成任务
		 */ 
		public complate(checker:IMissionManager):boolean
		{
			if(!this.check(checker)) return false;
			
			checker.deleteMission(this);
			if(this.give!=null)
			{
				for(var k in this.give)
				{
                    var give:ThreeBase = this.give[k];
					switch(give.type)
					{
						case MissionNR.R_ITEM:
							checker.getItem(<number><any>(give.key),give.count);
							break;
						case MissionNR.R_MONEY:
							checker.getMoney(give.count);
							break;
						case MissionNR.R_EXP:
							checker.getExp(give.count);
							break;
						case MissionNR.R_MISSION:
							checker.addMission(<number><any>give.key);
							break;
					}
				}
			}
			return true;
		}
    }
}