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
        var runner:d5power.ScriptRunner = new d5power.ScriptRunner();

        var block0:d5power.NodeVar = new d5power.NodeVar(runner);
        block0.name = 'a';
        block0.value = 10;

        var block1:d5power.NodeVar = new d5power.NodeVar(runner);
        block1.name ='b';
        block1.value = 20;

        var block2:d5power.NodeAdd = new d5power.NodeAdd(runner);
        block2.addVar('a');
        block2.addVar('b');
        block2.addVar(5);

        block0.next = block1;
        block1.next = block2;

        runner.addNode(block0);
        runner.check(5000);

    }
}