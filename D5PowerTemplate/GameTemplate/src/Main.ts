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

    /**
     * 舞台初始化后运行
     * @param event 
     */
    private onAddToStage(event: egret.Event):void {
        // 请从这里开始编写游戏逻辑
        
    }

    /**
     * 当界面主题加载完成后运行本方法
     */
    private onUIReady():void
    {

    }
}