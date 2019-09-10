module d5power {
	/**
	 *
	 * @author 
	 *
	 */
	export class GGCallData {
    	
    	public times:number = 0;
    	public loader:egret.URLLoader;
    	public request:egret.URLRequest;
    	public callback:Function;
    	public thisObj:any;
    	
		public constructor() {
		}
	}
}
