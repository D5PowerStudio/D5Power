module d5power{	
	/**
	 * 河流
	 */
	export class River {
		public startArea:Area2D;
		public downsteams:Array<AreaPoint> = new Array<AreaPoint>();
	}
}