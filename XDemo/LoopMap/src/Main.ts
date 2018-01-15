//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    private _map:d5power.BaseMap;
    private _camera:d5power.Camera;

    private _layer_ui:egret.DisplayObjectContainer;
    private _layer_map:egret.DisplayObjectContainer;
    private _layer_objects:egret.DisplayObjectContainer;

    private _objList:Array<d5power.GameObject>;
    private _masker:egret.Sprite;

    public static me:Main;

    public constructor() {
        super();

        Main.me = this;
        this._objList = [];
        

        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.init,this);
    }

    private init(e:egret.Event):void
    {
        this.stage.scaleMode = egret.StageScaleMode.NO_SCALE;
        d5power.D5Game.screenWidth = this.stage.stageWidth;
        d5power.D5Game.screenHeight = this.stage.stageHeight;

        //d5power.D5UIResourceData.setup('resource/assets/ui/default/',this.uiReady,this);
        this.gameStart();
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.init,this);
    }

    private uiReady():void
    {
        this.gameStart();

    }

    public gameStart():void
    {
        this._layer_ui = new egret.DisplayObjectContainer();
        this._layer_map = new egret.DisplayObjectContainer();
        this._layer_objects = new egret.DisplayObjectContainer();

        this.addChild(this._layer_map);
        this.addChild(this._layer_objects);
        this.addChild(this._layer_ui);


        //var win:d5power.WinNpcPro = new d5power.WinNpcPro();
        //this._layer_ui.addChild(win);

        this._map = new d5power.BaseMap();
        this._map.setContainer(this._layer_map);
        //this._map.enter(560,this.onReady,this);
        
        this._map.createLoop(561,'resource/bg.png',this.onReady,this,3,3);

        this._camera = new d5power.Camera(this._map);

        this.stage.addEventListener(egret.Event.RESIZE,this.onResize,this);
    }

    public addObject(obj:d5power.GameObject):void
    {
        if(this._objList.indexOf(obj)==-1)
        {
            this._objList.push(obj);
        }

        if(obj.monitor.parent!=this._layer_objects) this._layer_objects.addChild(obj.monitor);
    }

    private onResize(e:egret.Event):void
    {
        if(this._map) this._map.resize();
    }

    private onBonesReady(target:d5power.BoneCharacter):void
    {
        if(target!=null)
        {
            var d:egret.DisplayObject = target.monitor;
            target.setPos(10,10);
            this.addObject(target);
        }

        
    }


    private onReady():void
    {
        var that:Main = this;

        // var character:d5power.FrameCharacter = new d5power.FrameCharacter(this._map);
        // character.setSkin('resource/character/1/');
        // character.setPos(200,300);
        // character.dir=d5power.Direction.RightUp;
        // this.addObject(character);

        // var character2:d5power.BoneCharacter = new d5power.BoneCharacter(this._map);
        // character2.action = 8;
        // character2.setSkin('resource/character/2',this.onBonesReady,this);
        // character2.move2Tile(18,10);
        // this._camera.focus = character2;

        this.addEventListener(egret.Event.ENTER_FRAME,function(e:egret.Event){
            var t:number = egret.getTimer();
            
            //character.run(t);
            //character.render(t);

            //character2.run(t);

            that._camera.update();
            that._map.render(); 
            
        },this);
    }
}