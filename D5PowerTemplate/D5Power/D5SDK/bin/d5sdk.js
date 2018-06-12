var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
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
var d5power;
(function (d5power) {
    var D5EffectSpriteSheet = (function () {
        function D5EffectSpriteSheet() {
            /**
             * 连接数量，此对象的引用计数
             */
            this._link = 0;
            this._link = 0;
            this._waiterList = new Array();
        }
        D5EffectSpriteSheet.getInstance = function (res, getObj) {
            var data;
            if (D5EffectSpriteSheet._pool_inuse[res] != null) {
                data = D5EffectSpriteSheet._pool_inuse[res];
                data._link++;
                if (data._link == 1)
                    data.setup(res);
            }
            else {
                if (D5EffectSpriteSheet._pool_jale.length > 0) {
                    data = D5EffectSpriteSheet._pool_jale.pop();
                }
                else {
                    data = new D5EffectSpriteSheet();
                }
                data._link++;
                data.setup(res);
            }
            if (data._sheet == null) {
                data.addWaiter(getObj);
            }
            else {
                getObj.onSpriteSheepReady(data);
            }
            data.loadID = getObj.loadID;
            return data;
        };
        D5EffectSpriteSheet.back2pool = function (data) {
            D5EffectSpriteSheet._pool_inuse[data._name] = null;
            if (D5EffectSpriteSheet._pool_jale.length < D5EffectSpriteSheet.MAX_IN_JALE && D5EffectSpriteSheet._pool_jale.indexOf(data) == -1) {
                D5EffectSpriteSheet._pool_jale.push(data);
            }
        };
        Object.defineProperty(D5EffectSpriteSheet.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5EffectSpriteSheet.prototype, "renderTime", {
            get: function () {
                return this._renderTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5EffectSpriteSheet.prototype, "totalFrame", {
            get: function () {
                return this._totalFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5EffectSpriteSheet.prototype, "totalDirection", {
            get: function () {
                return this._totalDirection;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5EffectSpriteSheet.prototype, "shadowX", {
            get: function () {
                return this._shadowX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5EffectSpriteSheet.prototype, "shadowY", {
            get: function () {
                return this._shadowY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5EffectSpriteSheet.prototype, "gX", {
            get: function () {
                return this._gX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5EffectSpriteSheet.prototype, "gY", {
            get: function () {
                return this._gY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5EffectSpriteSheet.prototype, "uvList", {
            get: function () {
                return this._uvList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5EffectSpriteSheet.prototype, "frameWidth", {
            get: function () {
                return this._frameW;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5EffectSpriteSheet.prototype, "frameHeight", {
            get: function () {
                return this._frameH;
            },
            enumerable: true,
            configurable: true
        });
        D5EffectSpriteSheet.prototype.addWaiter = function (waiter) {
            if (this._waiterList.indexOf(waiter) == -1)
                this._waiterList.push(waiter);
        };
        D5EffectSpriteSheet.prototype.unlink = function () {
            this._link--;
            if (this._link < 0)
                this._link = 0;
            //console.log('[D5EffectSpriteSheet] unlink ',this._name,this._link);
            if (this._link == 0) {
                this._sheet = null;
                this._waiterList = [];
                D5EffectSpriteSheet._pool_inuse[this._name] = null;
                D5EffectSpriteSheet.back2pool(this);
            }
        };
        D5EffectSpriteSheet.prototype.setup = function (res) {
            this._name = res;
            D5EffectSpriteSheet._pool_inuse[this._name] = this;
            if (res.substr(-4, 4) == '.png') {
                RES.getResByUrl(res, this.onTextureComplete, this, RES.ResourceItem.TYPE_IMAGE);
            }
            else if (res.substr(-4, 4) == 'json') {
                RES.getResByUrl(res, this.onDataComplate, this, RES.ResourceItem.TYPE_JSON);
            }
            else {
                trace("[D5EffectSpriteSheet] can not support this format.");
                return;
            }
        };
        D5EffectSpriteSheet.prototype.getTexture = function (dir, frame) {
            return this._sheet == null ? this._texture : this._sheet.getTexture('frame' + dir + '_' + frame);
        };
        D5EffectSpriteSheet.prototype.onTextureComplete = function (data) {
            //console.log("[D5EffectSpriteSheet] Res is loaded."+this._name);
            // link为0意味着该对象已失去全部引用，被废弃掉了，所以无需再处理程序
            if (this._link == 0)
                return;
            this._sheet = new egret.SpriteSheet(data);
            RES.getResByUrl(this._name + '.json', this.onDataComplate, this, RES.ResourceItem.TYPE_JSON);
        };
        D5EffectSpriteSheet.prototype.onConfigComplate = function (data) {
            if (this._link == 0)
                return;
            this._conf = data;
            RES.getResByUrl(this._name.substr(0, -5) + ".png", this.onDataComplate, this, RES.ResourceItem.TYPE_IMAGE);
        };
        D5EffectSpriteSheet.prototype.onDataComplate = function (texture) {
            //console.log("[D5EffectSpriteSheet] json is loaded."+this._name);
            // link为0意味着该对象已失去全部引用，被废弃掉了，所以无需再处理程序
            if (this._link == 0 || this._conf == null) {
                this._sheet = null;
                return;
            }
            this._sheet = new egret.SpriteSheet(texture);
            var data = this._conf;
            //{"X":-59,"shadowY":12,"FrameWidth":120,"shadowX":20,"Direction":1,"Time":120,"Frame":4,"Y":-114,"FrameHeight":120}
            this._totalFrame = parseInt(data.Frame);
            this._renderTime = parseInt(data.Time);
            this._shadowX = parseInt(data.shadowX);
            this._shadowY = parseInt(data.shadowY);
            if (this._shadowY >= this._shadowX)
                this._shadowY = data.shadowX * 0.5;
            this._totalDirection = parseInt(data.Direction);
            switch (parseInt(data.Direction)) {
                case 1:
                    this._totalDirection = 1;
                    break;
                case 5:
                    this._totalDirection = 8;
                    break;
                case 3:
                    this._totalDirection = 4;
                    break;
            }
            this._gX = parseInt(data.X);
            this._gY = parseInt(data.Y);
            this._frameW = parseInt(data.FrameWidth);
            this._frameH = parseInt(data.FrameHeight);
            this._uvList = data.uv ? data.uv : null;
            //console.log("[D5SpriteSheepINIT] renderTime:",this._renderTime,",shadowY:",this._shadowY);
            var i;
            var l;
            if (data.uv) {
                //console.log("[D5SpriteSheepINIT] totalFrame:",this._totalFrame,",uvdata nums:",data.uv.length);
                for (l = 0; l < this._totalDirection; l++) {
                    for (i = 0; i < this._totalFrame; i++) {
                        var uvLine = l < 5 ? l : 8 - l;
                        var uv = data.uv[uvLine * this._totalFrame + i];
                        if (uv == null) {
                            console.log("[D5SpriteSheepINIT] can not find uv config line:", l, ",frame:", i, "===========================");
                        }
                        else {
                            if (uv.offY == -uv.height)
                                uv.offY += 0.01;
                            //this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth, l * data.FrameHeight, uv.width, uv.height,l<5 ? uv.offX : -uv.width-uv.offX, uv.offY);
                            this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth + uv.x, l * data.FrameHeight + uv.y, uv.width, uv.height, 0, 0);
                            //this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth, l * data.FrameHeight, uv.width, uv.height,l<5 ? uv.offX : -uv.width-uv.offX, uv.offY);
                        }
                    }
                }
            }
            else {
                for (l = 0; l < this._totalDirection; l++) {
                    for (i = 0; i < this._totalFrame; i++) {
                        this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth, l * data.FrameHeight, data.FrameWidth, data.FrameHeight, 0, 0);
                    }
                }
            }
            var i = this._waiterList.length - 1;
            while (i >= 0) {
                var poper = this._waiterList[i];
                if (poper.loadID == this.loadID) {
                    poper.onSpriteSheepReady(this);
                    this._waiterList.splice(i, 1);
                }
            }
        };
        /**
         * 最大允许回收对象池容量
         */
        D5EffectSpriteSheet.MAX_IN_JALE = 200;
        /**
         * 正在使用中的对象
         */
        D5EffectSpriteSheet._pool_inuse = {};
        /**
         * 待重用的对象
         */
        D5EffectSpriteSheet._pool_jale = new Array();
        return D5EffectSpriteSheet;
    }());
    d5power.D5EffectSpriteSheet = D5EffectSpriteSheet;
    __reflect(D5EffectSpriteSheet.prototype, "d5power.D5EffectSpriteSheet", ["d5power.IDisplayer"]);
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    /**
     * 使用要求：必须使用getInstance获得实例，等待onSpriteSheepReady回叫，确保素材加载完毕。
     * 当不再使用时，需要使用unlink断开引用，对象将自动等待重用
     */
    var D5SpriteSheet = (function () {
        function D5SpriteSheet() {
            this._link = 0;
            this._waiterList = new Array();
        }
        D5SpriteSheet.setupUnknow = function (res, ready, readyObj) {
            if (ready === void 0) { ready = null; }
            if (readyObj === void 0) { readyObj = null; }
            var onUnkown = function (data) {
                if (data == null)
                    return;
                D5SpriteSheet._unknow = data;
                if (ready != null)
                    ready.apply(readyObj);
            };
            RES.getResByUrl(res, onUnkown, null, RES.ResourceItem.TYPE_IMAGE);
        };
        D5SpriteSheet.setupShadow = function (res, ready, readyObj) {
            if (ready === void 0) { ready = null; }
            if (readyObj === void 0) { readyObj = null; }
            var onShadow = function (data) {
                if (data == null)
                    return;
                D5SpriteSheet._shadow = data;
                if (ready != null)
                    ready.apply(readyObj);
            };
            RES.getResByUrl(res, onShadow, null, RES.ResourceItem.TYPE_IMAGE);
        };
        Object.defineProperty(D5SpriteSheet, "shadow", {
            get: function () {
                return D5SpriteSheet._shadow;
            },
            enumerable: true,
            configurable: true
        });
        D5SpriteSheet.getInstance = function (res, getObj) {
            var data;
            if (D5SpriteSheet._pool_inuse[res] != null) {
                data = D5SpriteSheet._pool_inuse[res];
                data._link++;
                if (data._link == 1)
                    data.setup(res);
            }
            else {
                if (D5SpriteSheet._pool_jale.length > 0) {
                    data = D5SpriteSheet._pool_jale.pop();
                }
                else {
                    data = new D5SpriteSheet();
                }
                data._link++;
                data.setup(res);
            }
            if (data._sheet == null) {
                data.addWaiter(getObj);
                //console.log("[D5SpriteSheet] please wait.");
            }
            else {
                getObj.onSpriteSheepReady(data);
                //console.log("[D5SpriteSheet] res is ready.");
            }
            data.loadID = getObj.loadID;
            return data;
        };
        D5SpriteSheet.back2pool = function (data) {
            D5SpriteSheet._pool_inuse[data._name] = null;
            if (D5SpriteSheet._pool_jale.length < D5SpriteSheet.MAX_IN_JALE && D5SpriteSheet._pool_jale.indexOf(data) == -1) {
                D5SpriteSheet._pool_jale.push(data);
            }
        };
        Object.defineProperty(D5SpriteSheet.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5SpriteSheet.prototype, "renderTime", {
            get: function () {
                return this._renderTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5SpriteSheet.prototype, "totalFrame", {
            get: function () {
                return this._totalFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5SpriteSheet.prototype, "totalDirection", {
            get: function () {
                return this._totalDirection;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5SpriteSheet.prototype, "shadowX", {
            get: function () {
                return this._shadowX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5SpriteSheet.prototype, "shadowY", {
            get: function () {
                return this._shadowY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5SpriteSheet.prototype, "gX", {
            get: function () {
                return this._gX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5SpriteSheet.prototype, "gY", {
            get: function () {
                return this._gY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5SpriteSheet.prototype, "uvList", {
            get: function () {
                return this._uvList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5SpriteSheet.prototype, "frameWidth", {
            get: function () {
                return this._frameW;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5SpriteSheet.prototype, "frameHeight", {
            get: function () {
                return this._frameH;
            },
            enumerable: true,
            configurable: true
        });
        D5SpriteSheet.prototype.addWaiter = function (waiter) {
            if (this._waiterList.indexOf(waiter) == -1)
                this._waiterList.push(waiter);
        };
        D5SpriteSheet.prototype.setup = function (res) {
            if (res.substr(-4, 4) == '.png') {
                this._name = res.substr(0, res.length - 4);
            }
            else {
                this._name = res;
                res = res + '.png';
            }
            D5SpriteSheet._pool_inuse[this._name] = this;
            //console.log("[D5SpriteSheet] Res is load."+res);
            RES.getResByUrl(res, this.onTextureComplete, this, RES.ResourceItem.TYPE_IMAGE);
        };
        D5SpriteSheet.prototype.unlink = function () {
            this._link--;
            if (this._link < 0)
                this._link = 0;
            //console.log('[D5SpriteSheet] unlink ',this._name,this._link);
            if (this._link == 0) {
                this._sheet = null;
                this._waiterList = [];
                D5SpriteSheet._pool_inuse[this._name] = null;
                D5SpriteSheet.back2pool(this);
            }
        };
        D5SpriteSheet.prototype.onTextureComplete = function (data) {
            //console.log("[D5SpriteSheet] Res is loaded."+this._name);
            // link为0意味着该对象已失去全部引用，被废弃掉了，所以无需再处理程序
            if (this._link == 0)
                return;
            this._sheet = new egret.SpriteSheet(data);
            RES.getResByUrl(this._name + '.json', this.onDataComplate, this, RES.ResourceItem.TYPE_JSON);
        };
        D5SpriteSheet.prototype.getTexture = function (dir, frame) {
            return this._sheet == null ? D5SpriteSheet._unknow : this._sheet.getTexture('frame' + dir + '_' + frame);
        };
        D5SpriteSheet.prototype.onDataComplate = function (data) {
            //console.log("[D5SpriteSheet] json is loaded."+this._name);
            // link为0意味着该对象已失去全部引用，被废弃掉了，所以无需再处理程序
            if (this._link == 0) {
                this._sheet = null;
                return;
            }
            //{"X":-59,"shadowY":12,"FrameWidth":120,"shadowX":20,"Direction":1,"Time":120,"Frame":4,"Y":-114,"FrameHeight":120}
            this._totalFrame = parseInt(data.Frame);
            this._renderTime = parseInt(data.Time);
            this._shadowX = parseInt(data.shadowX);
            this._shadowY = parseInt(data.shadowY);
            if (this._shadowY >= this._shadowX)
                this._shadowY = data.shadowX * 0.5;
            this._totalDirection = parseInt(data.Direction);
            switch (parseInt(data.Direction)) {
                case 1:
                    this._totalDirection = 1;
                    break;
                case 5:
                    this._totalDirection = 8;
                    break;
                case 3:
                    this._totalDirection = 4;
                    break;
            }
            this._gX = parseInt(data.X);
            this._gY = parseInt(data.Y);
            this._frameW = parseInt(data.FrameWidth);
            this._frameH = parseInt(data.FrameHeight);
            this._uvList = data.uv ? data.uv : null;
            //console.log("[D5SpriteSheepINIT] renderTime:",this._renderTime,",shadowY:",this._shadowY);
            var i;
            var l;
            if (data.uv) {
                //console.log("[D5SpriteSheepINIT] totalFrame:",this._totalFrame,",uvdata nums:",data.uv.length);
                for (l = 0; l < this._totalDirection; l++) {
                    for (i = 0; i < this._totalFrame; i++) {
                        var uvLine = l < 5 ? l : (this._totalDirection == 8 ? l : 8 - l);
                        var uv = data.uv[uvLine * this._totalFrame + i];
                        if (uv == null) {
                            console.log("[D5SpriteSheepINIT] can not find uv config line:", l, ",frame:", i, "===========================");
                        }
                        else {
                            if (uv.offY == -uv.height)
                                uv.offY += 0.01;
                            //this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth, l * data.FrameHeight, uv.width, uv.height,l<5 ? uv.offX : -uv.width-uv.offX, uv.offY);
                            this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth + uv.x, l * data.FrameHeight + uv.y, uv.width, uv.height, 0, 0);
                            //this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth, l * data.FrameHeight, uv.width, uv.height,l<5 ? uv.offX : -uv.width-uv.offX, uv.offY);
                        }
                    }
                }
            }
            else {
                for (l = 0; l < this._totalDirection; l++) {
                    for (i = 0; i < this._totalFrame; i++) {
                        this._sheet.createTexture('frame' + l + '_' + i, i * data.FrameWidth, l * data.FrameHeight, data.FrameWidth, data.FrameHeight, 0, 0);
                    }
                }
            }
            while (this._waiterList.length > 0) {
                var poper = this._waiterList.pop();
                if (poper.loadID == this.loadID)
                    poper.onSpriteSheepReady(this);
            }
        };
        /**
         * 对象池最大容量
         * @type {number}
         */
        D5SpriteSheet.MAX_IN_JALE = 200;
        D5SpriteSheet._pool_inuse = {};
        D5SpriteSheet._pool_jale = new Array();
        return D5SpriteSheet;
    }());
    d5power.D5SpriteSheet = D5SpriteSheet;
    __reflect(D5SpriteSheet.prototype, "d5power.D5SpriteSheet", ["d5power.IDisplayer"]);
})(d5power || (d5power = {}));
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
function trace() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var s = "";
    for (var i = 0, j = args.length; i < j; i++) {
        s += args[i] + " ";
    }
    console.log(s);
}
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
var d5power;
(function (d5power) {
    /**
     * 用于处理UI素材的贴图数据
     * 本数据仅供D5BitmapUI使用
     * D5Rpg中的贴图数据直接调用Json中的uv对象，未进行结构化
     */
    var UVData = (function () {
        function UVData() {
            /**
             * 贴图的偏移坐标
             */
            this.offX = 0;
            /**
             * 贴图的偏移坐标
             */
            this.offY = 0;
            /**
             * 贴图宽度
             */
            this.width = 0;
            /**
             * 贴图高度
             */
            this.height = 0;
        }
        /**
         * 格式化数据
         */
        UVData.prototype.format = function (data) {
            this.offX = parseInt(data.offX);
            this.offY = parseInt(data.offY);
            this.width = parseInt(data.width);
            this.height = parseInt(data.height);
            this.u = (data.u);
            this.v = (data.v);
            this.w = (data.w);
            this.h = (data.h);
            this.x = (data.x);
            this.y = (data.y);
        };
        return UVData;
    }());
    d5power.UVData = UVData;
    __reflect(UVData.prototype, "d5power.UVData");
})(d5power || (d5power = {}));
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
var d5power;
(function (d5power) {
    /**
     * @language en_US
     * The Endian class contains values that denote the byte order used to represent multibyte numbers.
     * The byte order is either bigEndian (most significant byte first) or littleEndian (least significant byte first).
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
     * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
     * @version Egret 2.4
     * @platform Web,Native
     */
    var Endian = (function () {
        function Endian() {
        }
        /**
         * @language en_US
         * Indicates the least significant byte of the multibyte number appears first in the sequence of bytes.
         * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte). The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示多字节数字的最低有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Endian.LITTLE_ENDIAN = "littleEndian";
        /**
         * @language en_US
         * Indicates the most significant byte of the multibyte number appears first in the sequence of bytes.
         * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte).  The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示多字节数字的最高有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Endian.BIG_ENDIAN = "bigEndian";
        return Endian;
    }());
    d5power.Endian = Endian;
    __reflect(Endian.prototype, "d5power.Endian");
    /**
     * @language en_US
     * The ByteArray class provides methods and attributes for optimized reading and writing as well as dealing with binary data.
     * Note: The ByteArray class is applied to the advanced developers who need to access data at the byte layer.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    /**
     * @language zh_CN
     * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
     * 注意：ByteArray 类适用于需要在字节层访问数据的高级开发人员。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    var ByteArray = (function () {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function ByteArray(buffer) {
            /**
             * @private
             */
            this.BUFFER_EXT_SIZE = 0; //Buffer expansion size
            /**
             * @private
             */
            this.EOF_byte = -1;
            /**
             * @private
             */
            this.EOF_code_point = -1;
            this._setArrayBuffer(buffer || new ArrayBuffer(this.BUFFER_EXT_SIZE));
            this.endian = Endian.BIG_ENDIAN;
        }
        /**
         * @private
         * @param buffer
         */
        ByteArray.prototype._setArrayBuffer = function (buffer) {
            this.write_position = buffer.byteLength;
            this.data = new DataView(buffer);
            this._position = 0;
        };
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.setArrayBuffer = function (buffer) {
        };
        Object.defineProperty(ByteArray.prototype, "buffer", {
            get: function () {
                return this.data.buffer;
            },
            /**
             * @private
             */
            set: function (value) {
                this.data = new DataView(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "dataView", {
            /**
             * @private
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.data;
            },
            /**
             * @private
             */
            set: function (value) {
                this.data = value;
                this.write_position = value.byteLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bufferOffset", {
            /**
             * @private
             */
            get: function () {
                return this.data.byteOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "position", {
            /**
             * @language en_US
             * The current position of the file pointer (in bytes) to move or return to the ByteArray object. The next time you start reading reading method call in this position, or will start writing in this position next time call a write method.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this._position;
            },
            set: function (value) {
                //if (this._position < value) {
                //    if (!this.validate(value - this._position)) {
                //        return;
                //    }
                //}
                this._position = value;
                this.write_position = value > this.write_position ? value : this.write_position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "length", {
            /**
             * @language en_US
             * The length of the ByteArray object (in bytes).
                      * If the length is set to be larger than the current length, the right-side zero padding byte array.
                      * If the length is set smaller than the current length, the byte array is truncated.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * ByteArray 对象的长度（以字节为单位）。
             * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
             * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.write_position;
            },
            set: function (value) {
                this.write_position = value;
                var tmp = new Uint8Array(new ArrayBuffer(value));
                var byteLength = this.data.buffer.byteLength;
                if (byteLength > value) {
                    this._position = value;
                }
                var length = Math.min(byteLength, value);
                tmp.set(new Uint8Array(this.data.buffer, 0, length));
                this.buffer = tmp.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ByteArray.prototype, "bytesAvailable", {
            /**
             * @language en_US
             * The number of bytes that can be read from the current position of the byte array to the end of the array data.
             * When you access a ByteArray object, the bytesAvailable property in conjunction with the read methods each use to make sure you are reading valid data.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
             * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.data.byteLength - this._position;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language en_US
         * Clears the contents of the byte array and resets the length and position properties to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。

         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.clear = function () {
            this._setArrayBuffer(new ArrayBuffer(this.BUFFER_EXT_SIZE));
        };
        /**
         * @language en_US
         * Read a Boolean value from the byte stream. Read a simple byte. If the byte is non-zero, it returns true; otherwise, it returns false.
         * @return If the byte is non-zero, it returns true; otherwise, it returns false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
         * @return 如果字节不为零，则返回 true，否则返回 false
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readBoolean = function () {
            if (!this.validate(ByteArray.SIZE_OF_BOOLEAN))
                return null;
            return this.data.getUint8(this.position++) != 0;
        };
        /**
         * @language en_US
         * Read signed bytes from the byte stream.
         * @return An integer ranging from -128 to 127
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取带符号的字节
         * @return 介于 -128 和 127 之间的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readByte = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT8))
                return null;
            return this.data.getInt8(this.position++);
        };
        /**
         * @language en_US
         * Read data byte number specified by the length parameter from the byte stream. Starting from the position specified by offset, read bytes into the ByteArray object specified by the bytes parameter, and write bytes into the target ByteArray
         * @param bytes ByteArray object that data is read into
         * @param offset Offset (position) in bytes. Read data should be written from this position
         * @param length Byte number to be read Default value 0 indicates reading all available data
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (length == 0) {
                length = this.bytesAvailable;
            }
            else if (!this.validate(length)) {
                return null;
            }
            if (bytes) {
                bytes.validateBuffer(offset + length);
            }
            else {
                bytes = new ByteArray(new ArrayBuffer(offset + length));
            }
            //This method is expensive
            for (var i = 0; i < length; i++) {
                bytes.data.setUint8(i + offset, this.data.getUint8(this.position++));
            }
        };
        /**
         * @language en_US
         * Read an IEEE 754 double-precision (64 bit) floating point number from the byte stream
         * @return Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
         * @return 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readDouble = function () {
            if (!this.validate(ByteArray.SIZE_OF_FLOAT64))
                return null;
            var value = this.data.getFloat64(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT64;
            return value;
        };
        /**
         * @language en_US
         * Read an IEEE 754 single-precision (32 bit) floating point number from the byte stream
         * @return Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
         * @return 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readFloat = function () {
            if (!this.validate(ByteArray.SIZE_OF_FLOAT32))
                return null;
            var value = this.data.getFloat32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT32;
            return value;
        };
        /**
         * @language en_US
         * Read a 32-bit signed integer from the byte stream.
         * @return A 32-bit signed integer ranging from -2147483648 to 2147483647
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 32 位整数
         * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readInt = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT32))
                return null;
            var value = this.data.getInt32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT32;
            return value;
        };
        ///**
        // * 使用指定的字符集从字节流中读取指定长度的多字节字符串
        // * @param length 要从字节流中读取的字节数
        // * @param charSet 表示用于解释字节的字符集的字符串。可能的字符集字符串包括 "shift-jis"、"cn-gb"、"iso-8859-1"”等
        // * @return UTF-8 编码的字符串
        // * @method egret.ByteArray#readMultiByte
        // */
        //public readMultiByte(length:number, charSet?:string):string {
        //    if (!this.validate(length)) return null;
        //
        //    return "";
        //}
        /**
         * @language en_US
         * Read a 16-bit signed integer from the byte stream.
         * @return A 16-bit signed integer ranging from -32768 to 32767
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 16 位整数
         * @return 介于 -32768 和 32767 之间的 16 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readShort = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT16))
                return null;
            var value = this.data.getInt16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT16;
            return value;
        };
        /**
         * @language en_US
         * Read unsigned bytes from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 255
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取无符号的字节
         * @return 介于 0 和 255 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readUnsignedByte = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT8))
                return null;
            return this.data.getUint8(this.position++);
        };
        /**
         * @language en_US
         * Read a 32-bit unsigned integer from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 4294967295
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 32 位整数
         * @return 介于 0 和 4294967295 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readUnsignedInt = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT32))
                return null;
            var value = this.data.getUint32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT32;
            return value;
        };
        /**
         * @language en_US
         * Read a 16-bit unsigned integer from the byte stream.
         * @return A 16-bit unsigned integer ranging from 0 to 65535
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 16 位整数
         * @return 介于 0 和 65535 之间的 16 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readUnsignedShort = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT16))
                return null;
            var value = this.data.getUint16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            return value;
        };
        /**
         * @language en_US
         * Read a UTF-8 character string from the byte stream Assume that the prefix of the character string is a short unsigned integer (use byte to express length)
         * @return UTF-8 character string
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
         * @return UTF-8 编码的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readUTF = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT16))
                return null;
            var length = this.data.getUint16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            if (length > 0) {
                return this.readUTFBytes(length);
            }
            else {
                return "";
            }
        };
        /**
         * @language en_US
         * Read a UTF-8 byte sequence specified by the length parameter from the byte stream, and then return a character string
         * @param Specify a short unsigned integer of the UTF-8 byte length
         * @return A character string consists of UTF-8 bytes of the specified length
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
         * @param length 指明 UTF-8 字节长度的无符号短整型数
         * @return 由指定长度的 UTF-8 字节组成的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.readUTFBytes = function (length) {
            if (!this.validate(length))
                return null;
            var bytes = new Uint8Array(this.buffer, this.bufferOffset + this.position, length);
            this.position += length;
            /*let bytes: Uint8Array = new Uint8Array(new ArrayBuffer(length));
             for (let i = 0; i < length; i++) {
             bytes[i] = this.data.getUint8(this.position++);
             }*/
            return this.decodeUTF8(bytes);
        };
        /**
         * @language en_US
         * Write a Boolean value. A single byte is written according to the value parameter. If the value is true, write 1; if the value is false, write 0.
         * @param value A Boolean value determining which byte is written. If the value is true, write 1; if the value is false, write 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
         * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeBoolean = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_BOOLEAN);
            this.data.setUint8(this.position++, value ? 1 : 0);
        };
        /**
         * @language en_US
         * Write a byte into the byte stream
         * The low 8 bits of the parameter are used. The high 24 bits are ignored.
         * @param value A 32-bit integer. The low 8 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value 一个 32 位整数。低 8 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeByte = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT8);
            this.data.setInt8(this.position++, value);
        };
        /**
         * @language en_US
         * Write the byte sequence that includes length bytes in the specified byte array, bytes, (starting at the byte specified by offset, using a zero-based index), into the byte stream
         * If the length parameter is omitted, the default length value 0 is used and the entire buffer starting at offset is written. If the offset parameter is also omitted, the entire buffer is written
         * If the offset or length parameter is out of range, they are clamped to the beginning and end of the bytes array.
         * @param bytes ByteArray Object
         * @param offset A zero-based index specifying the position into the array to begin writing
         * @param length An unsigned integer specifying how far into the buffer to write
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
         * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
         * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
         * @param bytes ByteArray 对象
         * @param offset 从 0 开始的索引，表示在数组中开始写入的位置
         * @param length 一个无符号整数，表示在缓冲区中的写入范围
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            var writeLength;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            }
            else if (length == 0) {
                writeLength = bytes.length - offset;
            }
            else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this.validateBuffer(writeLength);
                var tmp_data = new DataView(bytes.buffer);
                var length_1 = writeLength;
                var BYTES_OF_UINT32 = 4;
                for (; length_1 > BYTES_OF_UINT32; length_1 -= BYTES_OF_UINT32) {
                    this.data.setUint32(this._position, tmp_data.getUint32(offset));
                    this.position += BYTES_OF_UINT32;
                    offset += BYTES_OF_UINT32;
                }
                for (; length_1 > 0; length_1--) {
                    this.data.setUint8(this.position++, tmp_data.getUint8(offset++));
                }
            }
        };
        /**
         * @language en_US
         * Write an IEEE 754 double-precision (64 bit) floating point number into the byte stream
         * @param value Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
         * @param value 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeDouble = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_FLOAT64);
            this.data.setFloat64(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT64;
        };
        /**
         * @language en_US
         * Write an IEEE 754 single-precision (32 bit) floating point number into the byte stream
         * @param value Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
         * @param value 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeFloat = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_FLOAT32);
            this.data.setFloat32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT32;
        };
        /**
         * @language en_US
         * Write a 32-bit signed integer into the byte stream
         * @param value An integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个带符号的 32 位整数
         * @param value 要写入字节流的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeInt = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT32);
            this.data.setInt32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT32;
        };
        /**
         * @language en_US
         * Write a 16-bit integer into the byte stream. The low 16 bits of the parameter are used. The high 16 bits are ignored.
         * @param value A 32-bit integer. Its low 16 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
         * @param value 32 位整数，该整数的低 16 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeShort = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT16);
            this.data.setInt16(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT16;
        };
        /**
         * @language en_US
         * Write a 32-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 32 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeUnsignedInt = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_UINT32);
            this.data.setUint32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT32;
        };
        /**
         * @language en_US
         * Write a 16-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 16 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.5
         * @platform Web,Native
         */
        ByteArray.prototype.writeUnsignedShort = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_UINT16);
            this.data.setUint16(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
        };
        /**
         * @language en_US
         * Write a UTF-8 string into the byte stream. The length of the UTF-8 string in bytes is written first, as a 16-bit integer, followed by the bytes representing the characters of the string
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeUTF = function (value) {
            var utf8bytes = this.encodeUTF8(value);
            var length = utf8bytes.length;
            this.validateBuffer(ByteArray.SIZE_OF_UINT16 + length);
            this.data.setUint16(this.position, length, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            this._writeUint8Array(utf8bytes, false);
        };
        /**
         * @language en_US
         * Write a UTF-8 string into the byte stream. Similar to the writeUTF() method, but the writeUTFBytes() method does not prefix the string with a 16-bit length word
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.writeUTFBytes = function (value) {
            this._writeUint8Array(this.encodeUTF8(value));
        };
        /**
         *
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        ByteArray.prototype.toString = function () {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
        };
        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        ByteArray.prototype._writeUint8Array = function (bytes, validateBuffer) {
            if (validateBuffer === void 0) { validateBuffer = true; }
            if (validateBuffer) {
                this.validateBuffer(this.position + bytes.length);
            }
            for (var i = 0; i < bytes.length; i++) {
                this.data.setUint8(this.position++, bytes[i]);
            }
        };
        /**
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        ByteArray.prototype.validate = function (len) {
            //len += this.data.byteOffset;
            if (this.data.byteLength > 0 && this._position + len <= this.data.byteLength) {
                return true;
            }
            else {
                trace('[ByteArray] 1025');
            }
        };
        /**********************/
        /*  PRIVATE METHODS   */
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        ByteArray.prototype.validateBuffer = function (len, needReplace) {
            if (needReplace === void 0) { needReplace = false; }
            this.write_position = len > this.write_position ? len : this.write_position;
            len += this._position;
            if (this.data.byteLength < len || needReplace) {
                var tmp = new Uint8Array(new ArrayBuffer(len + this.BUFFER_EXT_SIZE));
                var length_2 = Math.min(this.data.buffer.byteLength, len + this.BUFFER_EXT_SIZE);
                tmp.set(new Uint8Array(this.data.buffer, 0, length_2));
                this.buffer = tmp.buffer;
            }
        };
        /**
         * @private
         * UTF-8 Encoding/Decoding
         */
        ByteArray.prototype.encodeUTF8 = function (str) {
            var pos = 0;
            var codePoints = this.stringToCodePoints(str);
            var outputBytes = [];
            while (codePoints.length > pos) {
                var code_point = codePoints[pos++];
                if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                    this.encodertrace(code_point);
                }
                else if (this.inRange(code_point, 0x0000, 0x007f)) {
                    outputBytes.push(code_point);
                }
                else {
                    var count = void 0, offset = void 0;
                    if (this.inRange(code_point, 0x0080, 0x07FF)) {
                        count = 1;
                        offset = 0xC0;
                    }
                    else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                        count = 2;
                        offset = 0xE0;
                    }
                    else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                        count = 3;
                        offset = 0xF0;
                    }
                    outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                    while (count > 0) {
                        var temp = this.div(code_point, Math.pow(64, count - 1));
                        outputBytes.push(0x80 + (temp % 64));
                        count -= 1;
                    }
                }
            }
            return new Uint8Array(outputBytes);
        };
        /**
         * @private
         *
         * @param data
         * @returns
         */
        ByteArray.prototype.decodeUTF8 = function (data) {
            var fatal = false;
            var pos = 0;
            var result = "";
            var code_point;
            var utf8_code_point = 0;
            var utf8_bytes_needed = 0;
            var utf8_bytes_seen = 0;
            var utf8_lower_boundary = 0;
            while (data.length > pos) {
                var _byte = data[pos++];
                if (_byte == this.EOF_byte) {
                    if (utf8_bytes_needed != 0) {
                        code_point = this.decodertrace(fatal);
                    }
                    else {
                        code_point = this.EOF_code_point;
                    }
                }
                else {
                    if (utf8_bytes_needed == 0) {
                        if (this.inRange(_byte, 0x00, 0x7F)) {
                            code_point = _byte;
                        }
                        else {
                            if (this.inRange(_byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = _byte - 0xC0;
                            }
                            else if (this.inRange(_byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = _byte - 0xE0;
                            }
                            else if (this.inRange(_byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = _byte - 0xF0;
                            }
                            else {
                                this.decodertrace(fatal);
                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    }
                    else if (!this.inRange(_byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = this.decodertrace(fatal, _byte);
                    }
                    else {
                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        }
                        else {
                            var cp = utf8_code_point;
                            var lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            }
                            else {
                                code_point = this.decodertrace(fatal, _byte);
                            }
                        }
                    }
                }
                //Decode string
                if (code_point !== null && code_point !== this.EOF_code_point) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0)
                            result += String.fromCharCode(code_point);
                    }
                    else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }
            return result;
        };
        /**
         * @private
         *
         * @param code_point
         */
        ByteArray.prototype.encodertrace = function (code_point) {
            trace('[ByteArray]1026', code_point);
        };
        /**
         * @private
         *
         * @param fatal
         * @param opt_code_point
         * @returns
         */
        ByteArray.prototype.decodertrace = function (fatal, opt_code_point) {
            if (fatal) {
                trace('[ByteArray]1027');
            }
            return opt_code_point || 0xFFFD;
        };
        /**
         * @private
         *
         * @param a
         * @param min
         * @param max
         */
        ByteArray.prototype.inRange = function (a, min, max) {
            return min <= a && a <= max;
        };
        /**
         * @private
         *
         * @param n
         * @param d
         */
        ByteArray.prototype.div = function (n, d) {
            return Math.floor(n / d);
        };
        /**
         * @private
         *
         * @param string
         */
        ByteArray.prototype.stringToCodePoints = function (string) {
            /** @type {Array.<number>} */
            var cps = [];
            // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
            var i = 0, n = string.length;
            while (i < string.length) {
                var c = string.charCodeAt(i);
                if (!this.inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                }
                else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                }
                else {
                    if (i == n - 1) {
                        cps.push(0xFFFD);
                    }
                    else {
                        var d = string.charCodeAt(i + 1);
                        if (this.inRange(d, 0xDC00, 0xDFFF)) {
                            var a = c & 0x3FF;
                            var b = d & 0x3FF;
                            i += 1;
                            cps.push(0x10000 + (a << 10) + b);
                        }
                        else {
                            cps.push(0xFFFD);
                        }
                    }
                }
                i += 1;
            }
            return cps;
        };
        /**
         * @private
         */
        ByteArray.SIZE_OF_BOOLEAN = 1;
        /**
         * @private
         */
        ByteArray.SIZE_OF_INT8 = 1;
        /**
         * @private
         */
        ByteArray.SIZE_OF_INT16 = 2;
        /**
         * @private
         */
        ByteArray.SIZE_OF_INT32 = 4;
        /**
         * @private
         */
        ByteArray.SIZE_OF_UINT8 = 1;
        /**
         * @private
         */
        ByteArray.SIZE_OF_UINT16 = 2;
        /**
         * @private
         */
        ByteArray.SIZE_OF_UINT32 = 4;
        /**
         * @private
         */
        ByteArray.SIZE_OF_FLOAT32 = 4;
        /**
         * @private
         */
        ByteArray.SIZE_OF_FLOAT64 = 8;
        return ByteArray;
    }());
    d5power.ByteArray = ByteArray;
    __reflect(ByteArray.prototype, "d5power.ByteArray");
})(d5power || (d5power = {}));
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
var d5power;
(function (d5power) {
    var D5UIResourceData = (function () {
        function D5UIResourceData() {
            this._resList = [];
        }
        D5UIResourceData.setup = function (path, callback, thisobj) {
            var texture;
            var onBitmap = function (data) {
                if (data == null) {
                    callback.apply(thisobj, [-1]);
                }
                else {
                    texture = data;
                    RES.getResByUrl(path + 'uiresource.json', onJson, this, RES.ResourceItem.TYPE_JSON);
                }
            };
            var onJson = function (data) {
                if (data == null) {
                    callback.apply(thisobj, [-2]);
                }
                else {
                    D5UIResourceData.setupResLib(texture, data);
                    callback.apply(thisobj, [1]);
                }
            };
            RES.getResByUrl(path + 'uiresource.png', onBitmap, this, RES.ResourceItem.TYPE_IMAGE);
        };
        D5UIResourceData.setupResLib = function (bitmap, config) {
            var sp = new egret.SpriteSheet(bitmap);
            var obj;
            var uv;
            var cut;
            var cut1;
            var uvList;
            for (var k in config) {
                trace(k, config[k]);
                obj = config[k];
                var data = new D5UIResourceData();
                uvList = [];
                switch (obj.type) {
                    case "D5MirrorBox":
                        cut = obj.cut[0];
                        uv = new d5power.UVData();
                        uv.offX = obj.x;
                        uv.offY = obj.y;
                        uv.width = cut.x;
                        uv.height = cut.y;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + cut.x;
                        uv.offY = obj.y;
                        uv.width = obj.w - cut.x - 1;
                        uv.height = cut.y;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x;
                        uv.offY = obj.y + cut.y - 1;
                        uv.width = cut.x;
                        uv.height = obj.h - cut.y;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + cut.x;
                        uv.offY = obj.y + cut.y;
                        uv.width = obj.w - cut.x - 1;
                        uv.height = obj.h - cut.y - 1;
                        uvList.push(uv);
                        data.setupResource(sp, k, uvList);
                        break;
                    case "D5Window":
                        cut = obj.cut[0];
                        cut1 = obj.cut[1];
                        uv = new d5power.UVData();
                        uv.offX = obj.x;
                        uv.offY = obj.y;
                        uv.width = cut.x;
                        uv.height = cut.y;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + cut.x;
                        uv.offY = obj.y;
                        uv.width = cut1.x - cut.x;
                        uv.height = cut.y;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + cut1.x;
                        uv.offY = obj.y;
                        uv.width = obj.w - cut1.x;
                        uv.height = cut.y;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x;
                        uv.offY = obj.y + cut.y;
                        uv.width = cut.x;
                        uv.height = cut1.y - cut.y;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + cut.x;
                        uv.offY = obj.y + cut.y;
                        uv.width = cut1.x - cut.x;
                        uv.height = cut1.y - cut.y;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + cut1.x;
                        uv.offY = obj.y + cut.y;
                        uv.width = obj.w - cut1.x;
                        uv.height = cut1.y - cut.y;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x;
                        uv.offY = obj.y + cut1.y;
                        uv.width = cut.x;
                        uv.height = obj.h - cut1.y;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + cut.x;
                        uv.offY = obj.y + cut1.y;
                        uv.width = cut1.x - cut.x;
                        uv.height = obj.h - cut1.y;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + cut1.x;
                        uv.offY = obj.y + cut1.y;
                        uv.width = obj.w - cut1.x;
                        uv.height = obj.h - cut1.y;
                        uvList.push(uv);
                        data.setupResource(sp, k, uvList);
                        break;
                    case "D5Button":
                        cut = obj.cut[1];
                        if (cut.x == 0) {
                            uv = new d5power.UVData();
                            uv.offX = obj.x;
                            uv.offY = obj.y;
                            uv.width = obj.w / 4;
                            uv.height = obj.h;
                            uvList.push(uv);
                            uv = new d5power.UVData();
                            uv.offX = obj.x + obj.w / 4;
                            uv.offY = obj.y;
                            uv.width = obj.w / 4;
                            uv.height = obj.h;
                            uvList.push(uv);
                            uv = new d5power.UVData();
                            uv.offX = obj.x + obj.w / 2;
                            uv.offY = obj.y;
                            uv.width = obj.w / 4;
                            uv.height = obj.h;
                            uvList.push(uv);
                            uv = new d5power.UVData();
                            uv.offX = obj.x + obj.w - obj.w / 4;
                            uv.offY = obj.y;
                            uv.width = obj.w / 4;
                            uv.height = obj.h;
                            uvList.push(uv);
                            data.buttonType = 4;
                        }
                        else {
                            uv = new d5power.UVData();
                            uv.offX = obj.x;
                            uv.offY = obj.y;
                            uv.width = obj.w / 2;
                            uv.height = obj.h;
                            uvList.push(uv);
                            uv = new d5power.UVData();
                            uv.offX = obj.x + obj.w / 2;
                            uv.offY = obj.y;
                            uv.width = obj.w / 2;
                            uv.height = obj.h;
                            uvList.push(uv);
                            data.buttonType = 2;
                        }
                        data.setupResource(sp, k, uvList);
                        break;
                    case "D5Button4":
                        uv = new d5power.UVData();
                        uv.offX = obj.x;
                        uv.offY = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + obj.w / 4;
                        uv.offY = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + obj.w / 2;
                        uv.offY = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + obj.w - obj.w / 4;
                        uv.offY = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);
                        data.buttonType = 4;
                        data.setupResource(sp, k, uvList);
                        break;
                    case "D5MirrorLoop":
                        cut = obj.cut[0];
                        if (cut.y == 0) {
                            uv = new d5power.UVData();
                            uv.offX = obj.x;
                            uv.offY = obj.y;
                            uv.width = cut.x;
                            uv.height = obj.h;
                            uvList.push(uv);
                            uv = new d5power.UVData();
                            uv.offX = obj.x + cut.x;
                            uv.offY = obj.y;
                            uv.width = obj.w - cut.x;
                            uv.height = obj.h;
                            uvList.push(uv);
                            D5UIResourceData._typeLoop = 0;
                        }
                        else {
                            uv = new d5power.UVData();
                            uv.offX = obj.x;
                            uv.offY = obj.y;
                            uv.width = obj.w;
                            uv.height = cut.y;
                            uvList.push(uv);
                            uv = new d5power.UVData();
                            uv.offX = obj.x;
                            uv.offY = obj.y + cut.y;
                            uv.width = obj.w;
                            uv.height = obj.h - cut.y;
                            uvList.push(uv);
                            D5UIResourceData._typeLoop = 1;
                        }
                        data.setupResource(sp, k, uvList);
                        break;
                    case "D5Bitmap":
                        uv = new d5power.UVData();
                        uv.offX = obj.x;
                        uv.offY = obj.y;
                        uv.width = obj.w;
                        uv.height = obj.h;
                        uvList.push(uv);
                        data.setupResource(sp, k, uvList);
                        break;
                    case "D5RadioBtn":
                        uv = new d5power.UVData();
                        uv.offX = obj.x;
                        uv.offY = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + obj.w / 4;
                        uv.offY = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + obj.w / 2;
                        uv.offY = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + obj.w - obj.w / 4;
                        uv.offY = obj.y;
                        uv.width = obj.w / 4;
                        uv.height = obj.h;
                        uvList.push(uv);
                        data.setupResource(sp, k, uvList);
                        break;
                    case "D5SliderButton":
                        cut = obj.cut[0];
                        uv = new d5power.UVData();
                        uv.offX = obj.x;
                        uv.offY = obj.y;
                        uv.width = cut.x;
                        uv.height = obj.h / 2;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + cut.x;
                        uv.offY = obj.y;
                        uv.width = obj.w - cut.x;
                        uv.height = obj.h / 2;
                        uvList.push(uv);
                        uv = new d5power.UVData(); //下面是按钮素材   ，上面是背景素材
                        uv.offX = obj.x;
                        uv.offY = obj.y + obj.h / 2;
                        uv.width = obj.w / 4;
                        uv.height = obj.h / 2;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + obj.w / 4;
                        uv.offY = obj.y + obj.h / 2;
                        uv.width = obj.w / 4;
                        uv.height = obj.h / 2;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + obj.w / 2;
                        uv.offY = obj.y + obj.h / 2;
                        uv.width = obj.w / 4;
                        uv.height = obj.h / 2;
                        uvList.push(uv);
                        uv = new d5power.UVData();
                        uv.offX = obj.x + obj.w - obj.w / 4;
                        uv.offY = obj.y + obj.h / 2;
                        uv.width = obj.w / 4;
                        uv.height = obj.h / 2;
                        uvList.push(uv);
                        data.setupResource(sp, k, uvList);
                        break;
                    case "D5BitmapNumber":
                        for (var i = 0; i < 10; i++) {
                            uv = new d5power.UVData();
                            uv.offX = obj.x + i * obj.w / 10;
                            uv.offY = obj.y;
                            uv.width = obj.w / 10;
                            uv.height = obj.h;
                            uvList.push(uv);
                        }
                        data.setupResource(sp, k, uvList);
                        break;
                    case "D5Loop":
                        //"resource/assets/btnbg.png":{"x":883,"w":107,"y":622,"h":108,"type":"D5Loop",
                        //"cut":[{"x":33,"y":0},{"x":79,"y":0}]},
                        cut = obj.cut[0];
                        cut1 = obj.cut[1];
                        if (cut.y == 0) {
                            uv = new d5power.UVData();
                            uv.offX = obj.x;
                            uv.offY = obj.y;
                            uv.width = cut.x;
                            uv.height = obj.h;
                            uvList.push(uv);
                            uv = new d5power.UVData();
                            uv.offX = obj.x + cut.x;
                            uv.offY = obj.y;
                            uv.width = cut1.x - cut.x;
                            uv.height = obj.h;
                            uvList.push(uv);
                            uv = new d5power.UVData();
                            uv.offX = obj.x + cut1.x;
                            uv.offY = obj.y;
                            uv.width = obj.w - cut1.x;
                            uv.height = obj.h;
                            uvList.push(uv);
                        }
                        else {
                            uv = new d5power.UVData();
                            uv.offX = obj.x;
                            uv.offY = obj.y;
                            uv.width = obj.w;
                            uv.height = cut.y;
                            uvList.push(uv);
                            uv = new d5power.UVData();
                            uv.offX = obj.x;
                            uv.offY = obj.y + cut.y;
                            uv.width = obj.w;
                            uv.height = cut1.y - cut.y;
                            uvList.push(uv);
                            uv = new d5power.UVData();
                            uv.offX = obj.x;
                            uv.offY = obj.y + cut1.y;
                            uv.width = obj.w;
                            uv.height = obj.h - cut1.y;
                            uvList.push(uv);
                        }
                        data.setupResource(sp, k, uvList);
                        break;
                }
                D5UIResourceData._resourceLib[k] = data;
            }
        };
        D5UIResourceData.getData = function (name) {
            return D5UIResourceData._resourceLib[name];
        };
        D5UIResourceData.prototype.setupResource = function (sp, name, uvData) {
            this._name = name;
            var txture;
            for (var i = 0, j = uvData.length; i < j; i++) {
                txture = sp.createTexture(name + i, uvData[i].offX, uvData[i].offY, uvData[i].width, uvData[i].height);
                D5UIResourceData._resource[name + i] = txture;
            }
        };
        D5UIResourceData.prototype.getResource = function (id) {
            return D5UIResourceData._resource[this._name + id];
        };
        D5UIResourceData.addResource = function (id, texture, name) {
            if (name === void 0) { name = ''; }
            D5UIResourceData._resource[name + id] = texture;
        };
        D5UIResourceData._resource = {};
        D5UIResourceData._resourceLib = {};
        D5UIResourceData._typeLoop = 0;
        return D5UIResourceData;
    }());
    d5power.D5UIResourceData = D5UIResourceData;
    __reflect(D5UIResourceData.prototype, "d5power.D5UIResourceData");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var D5LoadData = (function () {
        function D5LoadData() {
        }
        return D5LoadData;
    }());
    d5power.D5LoadData = D5LoadData;
    __reflect(D5LoadData.prototype, "d5power.D5LoadData");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    /**
     * 分步加载器以及资源池
     * @author D5Power Studio
     */
    var StepLoader = (function () {
        function StepLoader(passwd) {
            if (passwd === void 0) { passwd = ''; }
            StepLoader._me = this;
            if (StepLoader._waitList == null) {
                StepLoader._pool = {};
                StepLoader._waitList = new Array();
                StepLoader._loader = new d5power.URLLoader();
                StepLoader._loader.onLoadComplete = StepLoader.onComplate;
                StepLoader._loader.onLoadError = StepLoader.onError;
                StepLoader._loader.onLoadProgress = StepLoader.onProgress;
            }
        }
        Object.defineProperty(StepLoader, "me", {
            get: function () {
                if (!StepLoader._me)
                    new StepLoader();
                return StepLoader._me;
            },
            enumerable: true,
            configurable: true
        });
        StepLoader.onComplate = function (loader) {
            var arr = StepLoader._waitList;
            if (arr.length == 0) {
                trace('[StepLoader] All data load complated.');
                return;
            }
            var conf = arr.pop();
            var data = loader.data;
            if (conf.inpool && data != null)
                StepLoader._pool[conf.url] = data;
            trace("[stepLoader]", "开始处理" + conf.url);
            if (conf.callback != null) {
                try {
                    conf.callback.apply(conf.thisobj, [data]);
                }
                catch (e) {
                    trace("资源加载回叫失败", e);
                }
            }
            var finder;
            // 当加载完一个资源后，循环检查加载队列中是否还有其他同地址的加载请求，一并处理
            for (var id = arr.length - 1; id >= 0; id--) {
                finder = arr[id];
                if (finder.url == conf.url) {
                    if (finder.callback != null) {
                        try {
                            finder.callback.apply(finder.thisobj, [data]);
                        }
                        catch (e) {
                            trace("资源加载回叫失败", e.getStackTrace());
                        }
                    }
                    arr.splice(id);
                }
            }
            StepLoader._isLoading = '';
            StepLoader.loadNext();
        };
        StepLoader.onError = function (e) {
            var arr = StepLoader._waitList;
            var data = arr.pop();
            // 当加载完一个资源后，循环检查加载队列中是否还有其他同地址的加载请求，一并处理
            var conf;
            for (var id = arr.length - 1; id >= 0; id--) {
                conf = arr[id];
                if (conf.url == data.url)
                    arr.splice(1);
            }
            StepLoader._isLoading = '';
            StepLoader.loadNext();
        };
        StepLoader.onProgress = function () { };
        StepLoader.loadNext = function () {
            if (StepLoader._isLoading != '')
                return;
            StepLoader._isLoading = '';
            if (StepLoader._waitList.length) {
                var conf = StepLoader._waitList[StepLoader._waitList.length - 1];
                StepLoader._loader.dataformat = null;
                StepLoader._loader.load(conf.url);
                StepLoader._isLoading = conf.url;
            }
            else {
                StepLoader._me.complate();
            }
        };
        Object.defineProperty(StepLoader, "isLoading", {
            get: function () {
                if (StepLoader._isLoading == '') {
                    return true;
                }
                else {
                    return false;
                }
            },
            enumerable: true,
            configurable: true
        });
        StepLoader.prototype.getResByUrl = function (url) {
            return StepLoader._pool[url];
        };
        StepLoader.prototype.setAllComplate = function (fun, thisobj) {
            if (thisobj === void 0) { thisobj = null; }
            this._allComplate = fun;
            this._allComplateObj = thisobj;
        };
        StepLoader.prototype.complate = function () {
            if (this._allComplate != null) {
                try {
                    this._allComplate.apply(this._allComplateObj);
                }
                catch (e) {
                    //trace("[StepLoader] 尝试呼叫结束函数失败",e.getStackTrace());
                }
                this._allComplate = null;
            }
        };
        /**
         * 新增加载文件
         * @param	url			文件地址
         * @param	compalte	加载结束触发函数
         * @param	thisobj		this
         * @param	isPool		是否入资源池
         */
        StepLoader.prototype.addLoad = function (url, complate, thisobj, isPool) {
            if (isPool === void 0) { isPool = true; }
            if (url.substr(0, 4) == 'http')
                url = url.replace(/\\/g, '/');
            if (!url || url == '') {
                return;
            }
            if (StepLoader._pool[url] != null) {
                // 资源池中存在该资源，直接回叫
                //if(complate!=null) this.complate(StepLoader._pool[url]);
                //trace("[StepLoader] 资源池中存在同地址资源，直接处理无需进入队列。",url);
                StepLoader.loadNext();
                return;
            }
            var data = StepLoader._waitList[url];
            data = new d5power.D5LoadData();
            data.callback = complate;
            data.inpool = isPool;
            data.url = url;
            data.thisobj = thisobj;
            StepLoader._waitList.push(data);
            StepLoader.loadNext();
        };
        /**
         * 删除资源
         */
        StepLoader.prototype.deleteRes = function (url) {
            var res = StepLoader._pool[url];
            delete StepLoader._pool[url];
        };
        StepLoader._isLoading = '';
        return StepLoader;
    }());
    d5power.StepLoader = StepLoader;
    __reflect(StepLoader.prototype, "d5power.StepLoader");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var URLLoader = (function () {
        /**
         * 构造函数
         * @param url 加载数据的地址.如果参数不为空的话.将直接开始加载
         * @param dataformat 以什么方式进行加载.如果为空的话.将通过目标文件的后缀名判断,
         * 如果为空且文件后缀不为内置支持的集中文件类型的话.将以文本格式进行加载解析
         */
        function URLLoader(url, dataformat) {
            if (url === void 0) { url = null; }
            if (dataformat === void 0) { dataformat = null; }
            /**
             * 加载地址
             */
            this._url = "";
            /**
             * 加载的数据
             */
            this._data = null;
            /**
             * 格式类型
             */
            this._dataformat = null;
            /**
             * 加载成功后的回叫函数
             */
            this.onLoadComplete = null;
            /**
             * 加载失败的回叫函数
             */
            this.onLoadError = null;
            /**
             * 加载过程/进度的回叫函数
             */
            this.onLoadProgress = null;
            if (url) {
                if (dataformat) {
                    this.dataformat = dataformat;
                }
                this.load(url);
            }
        }
        /**
         * 加载目标地址的数据
         * @param url 数据地址
         */
        URLLoader.prototype.load = function (url) {
            var _this = this;
            this._data = null;
            this._url = url;
            if (null == this._dataformat) {
                this._dataformat = URLLoader.DATAFORMAT_TEXT;
                if (this._url.length >= 4)
                    switch (this._url.substr(this._url.length - 4, 4).toLowerCase()) {
                        case ".bmp":
                            this._dataformat = URLLoader.DATAFORMAT_BITMAP;
                            break;
                        case ".png":
                            this._dataformat = URLLoader.DATAFORMAT_BITMAP;
                            break;
                        case ".jpg":
                            this._dataformat = URLLoader.DATAFORMAT_BITMAP;
                            break;
                        case "glsl":
                        case ".php":
                            this._dataformat = URLLoader.DATAFORMAT_TEXT;
                            break;
                        case "json":
                            this._dataformat = URLLoader.DATAFORMAT_JSON;
                            break;
                        default:
                            this._dataformat = URLLoader.DATAFORMAT_BINARY;
                            break;
                    }
            }
            if (this._xhr == null) {
                this._xhr = this.getXHR();
            }
            if (this._xhr == null) {
                alert("Your browser does not support XMLHTTP.");
                return;
            }
            if (this._xhr.readyState > 0) {
                this._xhr.abort();
            }
            this._xhr.open("GET", this._url, true);
            this._xhr.addEventListener("progress", function (e) { return _this.onProgress(e); }, false);
            this._xhr.addEventListener("readystatechange", function (e) { return _this.onReadyStateChange(e); }, false);
            this._xhr.addEventListener("error", function (e) { return _this.onError(e); }, false);
            if (this.dataformat == URLLoader.DATAFORMAT_BITMAP) {
                this._xhr.responseType = "blob";
            }
            else if (this.dataformat != URLLoader.DATAFORMAT_TEXT && this.dataformat != URLLoader.DATAFORMAT_JSON) {
                this._xhr.responseType = "arraybuffer";
            }
            else {
                this._xhr.responseType = "";
            }
            this._xhr.send();
        };
        Object.defineProperty(URLLoader.prototype, "dataformat", {
            /**
             * 控制以哪种方式接收加载的数据.
             * 如果未赋值则通过加载文件的后缀名来判断加载的类型以解析.
             * 如果未赋值且加载的类型并非为内置支持的文件类型.将以文本格式进行加载
             */
            get: function () {
                return this._dataformat;
            },
            /**
             * 控制以哪种方式接收加载的数据.
             * 如果未赋值则通过加载文件的后缀名来判断加载的类型以解析.
             * 如果未赋值且加载的类型并非为内置支持的文件类型.将以文本格式进行加载
             */
            set: function (value) {
                this._dataformat = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URLLoader.prototype, "data", {
            /**
             * 加载的数据.
             */
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URLLoader.prototype, "url", {
            /**
             * 加载的地址
             */
            get: function () {
                return this._url;
            },
            enumerable: true,
            configurable: true
        });
        URLLoader.prototype.onReadyStateChange = function (event) {
            if (this._xhr.readyState == 4) {
                if (this._xhr.status >= 400 || this._xhr.status == 0) {
                    console.log(this._url, "load fail");
                }
                else {
                    this.loadComplete();
                }
            }
        };
        URLLoader.prototype.loadComplete = function () {
            var _this = this;
            switch (this.dataformat) {
                case URLLoader.DATAFORMAT_BINARY:
                    this._data = new d5power.ByteArray(this._xhr.response);
                    break;
                case URLLoader.DATAFORMAT_SOUND:
                    this._data = this._xhr['responseBody'];
                    break;
                case URLLoader.DATAFORMAT_TEXT:
                    this._data = this._xhr.responseText;
                    break;
                case URLLoader.DATAFORMAT_JSON:
                    var json;
                    try {
                        json = eval('(' + this._xhr.responseText + ')');
                    }
                    catch (e) {
                        json = null;
                    }
                    this._data = json;
                    break;
                case URLLoader.DATAFORMAT_BITMAP:
                    var img = new Image(); //document.createElement("img");
                    if (window['createObjectURL'] != undefined) {
                        img.src = window['createObjectURL'](this._xhr.response);
                    }
                    else if (window['URL'] != undefined) {
                        img.src = window['URL'].createObjectURL(this._xhr.response);
                    }
                    else if (window['webkitURL'] != undefined) {
                        img.src = window['webkitURL'].createObjectURL(this._xhr.response);
                    }
                    var that = this;
                    img.onload = function () {
                        if (that.onLoadComplete) {
                            _this._data = img;
                            that.onLoadComplete(that);
                        }
                    };
                    return;
                default:
                    this._data = this._xhr.responseText;
            }
            if (this.onLoadComplete) {
                this.onLoadComplete(this);
            }
        };
        URLLoader.prototype.onProgress = function (event) {
            //console.log("progress event```");
        };
        URLLoader.prototype.onError = function (event) {
            if (this.onLoadError) {
                this.onLoadError(this);
            }
            console.log("loaderror, url: ", this._url);
            console.log("load error", event);
        };
        URLLoader.prototype.getXHR = function () {
            var xhr = null;
            if (window["XMLHttpRequest"]) {
                xhr = new window["XMLHttpRequest"]();
            }
            else {
                xhr = new ActiveXObject("MSXML2.XMLHTTP");
            }
            return xhr;
        };
        /**
         * 以二进制方式接收加载的数据
         */
        URLLoader.DATAFORMAT_BINARY = "binary";
        /**
         * 以文本的方式接收加载的数据
         * 默认方式
         */
        URLLoader.DATAFORMAT_TEXT = "text";
        /**
         * 以音频的方式接收加载的数据
         */
        URLLoader.DATAFORMAT_SOUND = "sound";
        /**
         * 以图像的方式接收加载的数据
         * 支持jpg.png.等格式
         */
        URLLoader.DATAFORMAT_BITMAP = "bitmap";
        /**
         * 以JSON的方式接收加载的数据
         *
         */
        URLLoader.DATAFORMAT_JSON = "json";
        return URLLoader;
    }());
    d5power.URLLoader = URLLoader;
    __reflect(URLLoader.prototype, "d5power.URLLoader");
})(d5power || (d5power = {}));
