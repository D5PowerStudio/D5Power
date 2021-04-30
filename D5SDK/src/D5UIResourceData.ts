//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, MicroGame Technology Inc.
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
/**
 * Created by Administrator on 2015/4/22.
 */
module d5power
{
    export class D5UIResourceData
    {
        private static _resource:any = {};

        private static _resourceLib:any={};

        private static _uvLib:any = {};

        public typeLoop:number = 0;

        public static setup(path:string,callback:Function,thisobj:any):void
        {
            var texture:egret.Texture;
            var onBitmap:Function = function(data:egret.Texture):void
            {
                if(data==null)
                {
                    callback.apply(thisobj,[-1]);
                }else{
                    texture = data;
                    var store_data:any = StepLoader.me.getResByUrl(path+'uiresource.json');
                    store_data ? onJson(store_data) : RES.getResByUrl(path+'uiresource.json',onJson,this,RES.ResourceItem.TYPE_JSON);
                }
            }

            var onJson:Function = function(data:any):void
            {
                if(data==null)
                {
                    callback.apply(thisobj,[-2]);
                }else{
                    D5UIResourceData.setupResLib(texture,data);
                    callback.apply(thisobj,[1]);
                }
            }

            var store_data:any = StepLoader.me.getResByUrl(path+'uiresource.png');
            store_data ? onBitmap(store_data) : RES.getResByUrl(path+'uiresource.png',onBitmap,this,RES.ResourceItem.TYPE_IMAGE);

        }

        public static setupResLib(bitmap:egret.Texture,config:any)
        {
            var sp:egret.SpriteSheet = new egret.SpriteSheet(bitmap);
            var obj:any;
            var uv:UVData;
            var cut:any;
            var cut1:any;
            var uvList:Array<UVData>;
            for(var k in config)
            {
                trace(k,config[k]);
                obj = config[k];
                var data:D5UIResourceData = new D5UIResourceData();
                uvList = [];
                switch(obj.type)
                {
                    case "D5MirrorBox":

                        cut = obj.cut[0];

                        uv = new UVData();
                        uv.x = obj.x;
                        uv.y = obj.y;
                        uv.width = cut.x;
                        uv.height = cut.y;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x+cut.x;
                        uv.y = obj.y;
                        uv.width = obj.w - cut.x - 1;
                        uv.height = cut.y;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x;
                        uv.y = obj.y + cut.y - 1;
                        uv.width = cut.x;
                        uv.height = obj.h-cut.y;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x+cut.x;
                        uv.y = obj.y+cut.y;
                        uv.width = obj.w - cut.x - 1;
                        uv.height = obj.h - cut.y - 1;
                        uvList.push(uv);

                        data.setupResource(sp,k,uvList);
                        break;

                    case "D5Window":

                        cut = obj.cut[0];
                        cut1 = obj.cut[1];

                        uv = new UVData();
                        uv.x = obj.x;
                        uv.y = obj.y;
                        uv.width = cut.x;
                        uv.height = cut.y;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x+cut.x;
                        uv.y = obj.y;
                        uv.width = cut1.x-cut.x;
                        uv.height = cut.y;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + cut1.x;
                        uv.y = obj.y;
                        uv.width = obj.w - cut1.x;
                        uv.height = cut.y;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x;
                        uv.y = obj.y+cut.y;
                        uv.width = cut.x;
                        uv.height = cut1.y-cut.y;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x+cut.x;
                        uv.y = obj.y+cut.y;
                        uv.width = cut1.x-cut.x;
                        uv.height = cut1.y-cut.y;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + cut1.x;
                        uv.y = obj.y + cut.y;
                        uv.width = obj.w - cut1.x;
                        uv.height = cut1.y - cut.y;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x;
                        uv.y = obj.y + cut1.y;
                        uv.width = cut.x;
                        uv.height = obj.h - cut1.y;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + cut.x;
                        uv.y = obj.y + cut1.y;
                        uv.width = cut1.x - cut.x;
                        uv.height = obj.h - cut1.y;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + cut1.x;
                        uv.y = obj.y + cut1.y;
                        uv.width = obj.w - cut1.x;
                        uv.height = obj.h - cut1.y;
                        uvList.push(uv);

                        data.setupResource(sp,k,uvList);
                        break;

                    case "D5Button":

                        cut = obj.cut[1];
                        if(cut.x==0)    //4帧按钮
                        {
                            uv = new UVData();
                            uv.x = obj.x;
                            uv.y = obj.y;
                            uv.width = obj.w/4;
                            uv.height = obj.h;
                            uvList.push(uv);

                            uv = new UVData();
                            uv.x = obj.x + obj.w/4;
                            uv.y = obj.y;
                            uv.width = obj.w/4;
                            uv.height = obj.h;
                            uvList.push(uv);

                            uv = new UVData();
                            uv.x = obj.x + obj.w/2;
                            uv.y = obj.y;
                            uv.width = obj.w/4;
                            uv.height = obj.h;
                            uvList.push(uv);

                            uv = new UVData();
                            uv.x = obj.x + obj.w - obj.w/4;
                            uv.y = obj.y;
                            uv.width = obj.w/4;
                            uv.height = obj.h;
                            uvList.push(uv);

                            data.buttonType = 4;
                        }
                        else
                        {
                            uv = new UVData();
                            uv.x = obj.x;
                            uv.y = obj.y;
                            uv.width = obj.w/2;
                            uv.height = obj.h;
                            uvList.push(uv);

                            uv = new UVData();
                            uv.x = obj.x + obj.w/2;
                            uv.y = obj.y;
                            uv.width = obj.w/2;
                            uv.height = obj.h;
                            uvList.push(uv);
                            data.buttonType = 2;
                        }


                        data.setupResource(sp,k,uvList);
                        break;
                    case "D5Button2":
                        uv = new UVData();
                        uv.x = obj.x;
                        uv.y = obj.y;
                        uv.width = obj.w/2;
                        uv.height = obj.h;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + obj.w/2;
                        uv.y = obj.y;
                        uv.width = obj.w/2;
                        uv.height = obj.h;
                        uvList.push(uv);
                        data.buttonType = 2;

                        data.setupResource(sp,k,uvList);
                        break;
                    case "D5Button4":
                        uv = new UVData();
                        uv.x = obj.x;
                        uv.y = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + obj.w / 4;
                        uv.y = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + obj.w / 2;
                        uv.y = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + obj.w - obj.w / 4;
                        uv.y = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);

                        data.buttonType = 4;
                        data.setupResource(sp,k,uvList);
                        break;


                    case "D5MirrorLoop":

                        cut = obj.cut[0];

                        if(cut.y == 0)           //X轴拉伸
                        {
                            uv = new UVData();
                            uv.x = obj.x;
                            uv.y = obj.y;
                            uv.width = cut.x;
                            uv.height = obj.h;
                            uvList.push(uv);

                            uv = new UVData();
                            uv.x = obj.x + cut.x;
                            uv.y = obj.y;
                            uv.width = obj.w - cut.x - 1;
                            uv.height = obj.h;
                            uvList.push(uv);


                            data.typeLoop = 0;

                        }else{                   //y轴拉伸

                            uv = new UVData();
                            uv.x = obj.x;
                            uv.y = obj.y;
                            uv.width = obj.w;
                            uv.height = cut.y;
                            uvList.push(uv);

                            uv = new UVData();
                            uv.x = obj.x;
                            uv.y = obj.y + cut.y;
                            uv.width = obj.w;
                            uv.height = obj.h - cut.y - 1;
                            uvList.push(uv);

                            data.typeLoop = 1;

                        }

                        data.setupResource(sp,k,uvList);
                        break;

                    case "D5Bitmap":

                        uv = new UVData();
                        uv.x = obj.x;
                        uv.y = obj.y;
                        uv.offX = obj.offX;
                        uv.offY = obj.offY;
                        uv.width = obj.w;
                        uv.height = obj.h;
                        uvList.push(uv);

                        data.setupResource(sp,k,uvList);
                        D5UIResourceData.addUVConf(0,uv,k);
                        break;

                    case "D5RadioBtn":

                        uv = new UVData();
                        uv.x = obj.x;
                        uv.y = obj.y;
                        uv.width = obj.w/4;
                        uv.height = obj.h;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + obj.w/4;
                        uv.y = obj.y;
                        uv.width = obj.w/4;
                        uv.height = obj.h;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + obj.w/2;
                        uv.y = obj.y;
                        uv.width = obj.w/4;
                        uv.height = obj.h;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + obj.w - obj.w/4;
                        uv.y = obj.y;
                        uv.width = obj.w/4;
                        uv.height = obj.h;
                        uvList.push(uv);

                        data.setupResource(sp,k,uvList);
                        break;

                    case "D5SliderButton":

                        cut = obj.cut[0];

                        uv = new UVData();
                        uv.x = obj.x;
                        uv.y = obj.y;
                        uv.width = cut.x;
                        uv.height = obj.h / 2;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + cut.x;
                        uv.y = obj.y;
                        uv.width = obj.w - cut.x;
                        uv.height = obj.h / 2;
                        uvList.push(uv);

                        uv = new UVData();              //下面是按钮素材   ，上面是背景素材
                        uv.x = obj.x;
                        uv.y = obj.y + obj.h / 2;
                        uv.width = obj.w / 4;
                        uv.height = obj.h / 2;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + obj.w/4;
                        uv.y = obj.y + obj.h / 2;
                        uv.width = obj.w / 4;
                        uv.height = obj.h / 2;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + obj.w/2;
                        uv.y = obj.y + obj.h / 2;
                        uv.width = obj.w/4;
                        uv.height = obj.h / 2;
                        uvList.push(uv);

                        uv = new UVData();
                        uv.x = obj.x + obj.w - obj.w/4;
                        uv.y = obj.y + obj.h / 2;
                        uv.width = obj.w/4;
                        uv.height = obj.h / 2;
                        uvList.push(uv);

                        data.setupResource(sp,k,uvList);
                        break;
                    case "D5BitmapNumber":
                        
                        var extData:string = !obj.extData ? '' : obj.extData;
                        var count:number = extData=='' ? 10 : 10+extData.length;
                        for(var i:number=0;i<count;i++)
                        {
                            uv = new UVData();
                            uv.x = obj.x+i*obj.w/count;
                            uv.y = obj.y;
                            uv.width = obj.w/count;
                            uv.height = obj.h;
                            uvList.push(uv);
                        }
                        data.extData = extData;
                        data.setupResource(sp,k,uvList);
                        break;
                    case "D5Loop":
                        //"resource/assets/btnbg.png":{"x":883,"w":107,"y":622,"h":108,"type":"D5Loop",
                        //"cut":[{"x":33,"y":0},{"x":79,"y":0}]},
                        cut = obj.cut[0];
                        cut1 = obj.cut[1];
                        if(cut.y == 0)           //X轴拉伸
                        {
                            uv = new UVData();
                            uv.x = obj.x;
                            uv.y = obj.y;
                            uv.width = cut.x;
                            uv.height = obj.h;
                            uvList.push(uv);

                            uv = new UVData();
                            uv.x = obj.x + cut.x;
                            uv.y = obj.y;
                            uv.width = cut1.x - cut.x - 1;
                            uv.height = obj.h;
                            uvList.push(uv);
                            
                            uv = new UVData();
                            uv.x = obj.x+cut1.x;
                            uv.y = obj.y;
                            uv.width = obj.w-cut1.x;
                            uv.height = obj.h;
                            uvList.push(uv);

                        }else{                   //y轴拉伸
                            uv = new UVData();
                            uv.x = obj.x;
                            uv.y = obj.y;
                            uv.width = obj.w;
                            uv.height = cut.y;
                            uvList.push(uv);

                            uv = new UVData();
                            uv.x = obj.x;
                            uv.y = obj.y + cut.y;
                            uv.width = obj.w;
                            uv.height = cut1.y - cut.y - 1;
                            uvList.push(uv);

                            uv = new UVData();
                            uv.x = obj.x;
                            uv.y = obj.y+cut1.y;
                            uv.width = obj.w;
                            uv.height = obj.h-cut1.y;
                            uvList.push(uv);

                        }

                        data.setupResource(sp,k,uvList);
                        break;

                }
                D5UIResourceData._resourceLib[k] = data;
            }
        }

        public static getData(name:string):D5UIResourceData
        {
            return <D5UIResourceData>D5UIResourceData._resourceLib[name];
        }

        private _resList:Array<string>;
        private _name:string;
        public  buttonType:number;
        public extData:string='';
        public constructor()
        {
            this._resList = [];
        }

        public setupResource(sp:egret.SpriteSheet,name:string,uvData:Array<UVData>):void
        {
            this._name=name;
            
            var txture:egret.Texture;
            for(var i:number=0,j:number=uvData.length;i<j;i++)
            {
                txture = sp.createTexture(name+i,uvData[i].x,uvData[i].y,uvData[i].width,uvData[i].height);
                D5UIResourceData._resource[name+i] = txture
            }
        }

        public getResource(id:number):egret.Texture
        {
            return D5UIResourceData._resource[this._name+id];
        }

        public getUVConf(id:number):UVData
        {
            return D5UIResourceData._uvLib[this._name+id];
        }
        
        public static addResource(id:number,texture:egret.Texture,name:string=''):void
        {
            D5UIResourceData._resource[name+id] = texture;
        }

        public static addUVConf(id:number,uv:UVData,name=''):void
        {
            D5UIResourceData._uvLib[name+id] = uv;
        }
    }
}