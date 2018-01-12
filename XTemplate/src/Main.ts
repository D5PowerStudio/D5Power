/**
 * D5Power游戏框架模版
 * 
 * @author D5-Howard(d5@microgame.cn)
 * 
 */
class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        
    }
}