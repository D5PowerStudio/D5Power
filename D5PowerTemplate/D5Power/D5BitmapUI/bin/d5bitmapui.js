var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
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
var d5power;
(function (d5power) {
    var D5Component = (function (_super) {
        __extends(D5Component, _super);
        function D5Component() {
            var _this = _super.call(this) || this;
            _this._moveAction = 0;
            if (D5Component.autoRelease)
                _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.dispose, _this);
            return _this;
        }
        Object.defineProperty(D5Component.prototype, "moveAction", {
            get: function () {
                return this._moveAction;
            },
            set: function (value) {
                this._moveAction = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5Component, "me", {
            get: function () {
                if (D5Component._me == null)
                    D5Component._me = new D5Component();
                return D5Component._me;
            },
            enumerable: true,
            configurable: true
        });
        D5Component.addMoveList = function (target) {
            D5Component._moveList.push(target);
            if (!D5Component.me.hasEventListener(egret.Event.ENTER_FRAME))
                D5Component.me.addEventListener(egret.Event.ENTER_FRAME, this.onMoveUI, this);
        };
        D5Component.onMoveUI = function (e) {
            var obj;
            for (var i = D5Component._moveList.length - 1; i >= 0; i--) {
                obj = D5Component._moveList[i];
                //				if((obj.x==obj.startX && obj.y==obj.startY &&obj.moveAction != D5Component.MOVE_ALPHA)||(obj.alpha==1&&obj.moveAction == D5Component.MOVE_ALPHA))
                //				{
                //					D5Component._moveList.splice(i,1);
                //					continue;
                //				}
                switch (obj.moveAction) {
                    case D5Component.MOVE_LEFT:
                        obj.x += (obj.startX - obj.x) / 5;
                        if (Math.ceil(obj.x) >= obj.startX) {
                            obj.x = obj.startX;
                            D5Component._moveList.splice(i, 1);
                        }
                        break;
                    case D5Component.MOVE_RIGHT:
                        obj.x -= (obj.x - obj.startX) / 5;
                        if (Math.floor(obj.x) <= obj.startX) {
                            obj.x = obj.startX;
                            D5Component._moveList.splice(i, 1);
                        }
                        break;
                    case D5Component.MOVE_UP:
                        obj.y += (obj.startY - obj.y) / 5;
                        if (Math.ceil(obj.y) >= obj.startY) {
                            obj.y = obj.startY;
                            D5Component._moveList.splice(i, 1);
                        }
                        break;
                    case D5Component.MOVE_DOWN:
                        obj.y -= (obj.y - obj.startY) / 5;
                        if (Math.floor(obj.y) <= obj.startY) {
                            obj.y = obj.startY;
                            D5Component._moveList.splice(i, 1);
                        }
                        break;
                    case D5Component.MOVE_ALPHA:
                        obj.alpha += (1 - obj.alpha) / 5;
                        if (Math.abs(1 - obj.alpha) <= 0.01) {
                            obj.alpha = 1;
                            D5Component._moveList.splice(i, 1);
                        }
                        break;
                }
            }
            if (D5Component._moveList.length == 0)
                D5Component.me.removeEventListener(egret.Event.ENTER_FRAME, this.onMoveUI, this);
        };
        /**
         * 将与自己同容器，且在自己范围内的对象纳入自己的自对象，形成一个整体
         *
         * @param   e
         * @param   skip    不进行合并的对象
         * @param   contain 必然进行合并的对象
         */
        D5Component.prototype.add2Me = function (e, skip, contain) {
            if (e === void 0) { e = null; }
            if (skip === void 0) { skip = null; }
            if (contain === void 0) { contain = null; }
            if (parent == null) {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.add2Me, this);
                return;
            }
            if (e)
                this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.add2Me, this);
            var rect = new egret.Rectangle(this.x, this.y, this.width, this.height);
            var arr = [];
            var _root = this.parent;
            for (var i = _root.numChildren - 1; i >= 0; i--) {
                var obj = _root.getChildAt(i);
                if (skip && skip.indexOf(obj) == -1)
                    continue;
                if (obj != this) {
                    if (rect.contains(obj.x, obj.y) || (contain != null && contain.indexOf(obj) != -1)) {
                        obj.x = obj.x - this.x;
                        obj.y = obj.y - this.y;
                        arr.push(obj);
                    }
                }
            }
            for (i = arr.length - 1; i >= 0; i--) {
                this.addChild(arr[i]);
            }
            this.parent.setChildIndex(this, 0);
        };
        D5Component.prototype.setSkin = function (name) {
        };
        /**
         * 属性绑定目标
         */
        D5Component.setproBindingSource = function (obj) {
            this._pro_binding_source = obj;
        };
        Object.defineProperty(D5Component, "proBindingSource", {
            get: function () {
                return this._pro_binding_source;
            },
            enumerable: true,
            configurable: true
        });
        D5Component.prototype.setSize = function (w, h) {
            this._w = w;
            this._h = h;
            this.invalidate();
        };
        Object.defineProperty(D5Component.prototype, "nowName", {
            get: function () {
                return this._nowName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5Component.prototype, "width", {
            get: function () {
                return this._w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5Component.prototype, "height", {
            get: function () {
                return this._h;
            },
            enumerable: true,
            configurable: true
        });
        D5Component.getComponentByURL = function (res, container, onPre) {
            if (onPre === void 0) { onPre = null; }
            var onLoaded = function (obj) {
                var arr = obj.uiList;
                var length = arr.length;
                var comObj;
                var uiObj;
                var src;
                var list = [];
                container['_realWidth'] = parseInt(obj.width);
                container['_realHeight'] = parseInt(obj.height);
                container['_flyX'] = obj.flyx;
                container['_flyY'] = obj.flyy;
                if (container['drawBg'] && obj.bgImg != '') {
                    container['drawBg'](obj.bgImg);
                }
                for (var i = 0; i < length; i++) {
                    comObj = arr[i];
                    uiObj = D5Component.getCompoentByJson(comObj, container);
                    src = comObj.file;
                    if (src && d5power.D5UIResourceData.getData(src) == null) {
                        uiObj._belone = res;
                        list.push(uiObj);
                    }
                    src = comObj.src;
                    if (src && d5power.D5UIResourceData.getData(src) == null) {
                        uiObj._belone = res;
                        list.push(uiObj);
                    }
                    container.addChild(uiObj);
                }
                if (list.length) {
                    D5Component._preloadList[res] = [list, onPre, container];
                }
                else {
                    if (onPre)
                        onPre.apply(container, [0]);
                }
            };
            RES.getResByUrl(res, onLoaded, null, RES.ResourceItem.TYPE_JSON);
        };
        D5Component.prototype.loadResource = function (name, callback, thisobj) {
            RES.getResByUrl(name, callback, thisobj, RES.ResourceItem.TYPE_IMAGE);
        };
        D5Component.getCompoentByJson = function (value, container) {
            var com;
            switch (value.Class) {
                case "D5Window":
                    com = new d5power.D5Window();
                    com.x1 = parseInt(value.x1);
                    com.y1 = parseInt(value.y1);
                    com.x2 = parseInt(value.x2);
                    com.y2 = parseInt(value.y2);
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width, value.height);
                    var arr = value.uiList;
                    var length = arr.length;
                    var comObj;
                    for (var i = 0; i < length; i++) {
                        comObj = arr[i];
                        com.addChild(this.getCompoentByJson(comObj, container));
                    }
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5MirrorBox":
                    com = new d5power.D5MirrorBox();
                    com.name = value.name;
                    com.cutX = parseInt(value.cutX);
                    com.cutY = parseInt(value.cutY);
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width, value.height);
                    var arr = value.uiList;
                    var length = arr.length;
                    var comObj;
                    for (var i = 0; i < length; i++) {
                        comObj = arr[i];
                        com.addChild(this.getCompoentByJson(comObj, container));
                    }
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5Button":
                    com = new d5power.D5Button();
                    com.type = parseInt(value.type);
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.setSound(value.soundDown);
                    com.x = value.x;
                    com.y = value.y;
                    com.setIcon(value.icon);
                    var callback_String = value.listener;
                    if (value.lable && value.lable != '') {
                        com.setLable(value.lable);
                    }
                    if (callback_String != '' && callback_String != 'null' && callback_String != null && container != null) {
                        //                        if(container.hasOwnProperty(callback_String))
                        //                        {
                        //                        (<D5Button>com).setCallback(container[callback_String]);
                        //                        }else{
                        //                            trace("[D5Component] 未在"+container+"中发现所需要的按钮响应函数"+callback_String);
                        //                        }
                        com.setCallback(container[callback_String]);
                    }
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5MirrorLoop":
                    com = new d5power.D5MirrorLoop();
                    com.name = value.name;
                    com._mode = value.workmode;
                    com._cutSize = value.cutsize;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width, value.height);
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5Bitmap":
                    com = new d5power.D5Bitmap();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5RadioBtn":
                    com = new d5power.D5RadioBtn();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    if (value.group != null && value.group != '')
                        com.groupName = value.group;
                    if (value.lable && value.lable != '') {
                        com.setLable(value.lable);
                    }
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5FlyBox":
                    com = new d5power.D5FlyBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    com.setMaxWidth(value.maxWidth);
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5HBox":
                    com = new d5power.D5HBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5VBox":
                    com = new d5power.D5VBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5Text":
                    com = new d5power.D5Text(value.textValue == '文字' ? '' : value.textValue, value.fontColor, -1, value.filterColor, value.fontSize);
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width, value.height);
                    com.setType(value.type);
                    com.setTextAlign(value.alignType);
                    com.setFontBold(value.bold);
                    com.setBgColor(value.bgColor);
                    com.setLtBorder(value.ltColor);
                    com.setRbBorder(value.rbColor);
                    com.setWrapFlg(value.wrapType);
                    com.setIsPassword(value.password);
                    com.setTextID((value.textID).toString());
                    com._binding = value.binding;
                    if (container)
                        container[com.name] = com;
                    if (container && container && com._binding != '')
                        container.addBinder(com);
                    break;
                case "D5ImageBox":
                    com = new d5power.D5ImageBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width, value.height);
                    com.showNum(value.shownum);
                    com.setLogo((value.bg).toString());
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5ButtonGroup":
                    com = new d5power.D5ButtonGroup();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    var arr = value.uiList;
                    var length = arr.length;
                    var comObj;
                    for (var i = 0; i < length; i++) {
                        comObj = arr[i];
                        com.addChild(this.getCompoentByJson(comObj, container));
                    }
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5Swf":
                    com = new d5power.D5Swf();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    com.setSrc(value.src);
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5BitmapNumber":
                    com = new d5power.D5BitmapNumber();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    //(<D5BitmapNumber>com).setPadding(value.src);
                    com.setAlign(value.align);
                    com.setValue(1);
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5Shape":
                    com = new d5power.D5Shape();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    com.drawAlpha = value.fillAlpha == null ? 1 : value.fillAlpha;
                    com.setWorkMode(value.workMode);
                    com.setFillColor(value.fillColor);
                    com.setTickNess(value.tickNess);
                    com.setColor(value.color);
                    com.setOffX(value.offX);
                    com.setOffY(value.offY);
                    com.setSize(value.width, value.height);
                    com.setRadius(value.radius);
                    com.pointString = value.pointString;
                    if (container)
                        container[com.name] = com;
                    break;
                case "D5Loop":
                    com = new d5power.D5Loop(value.workmode, value.cutsize1, value.cutsize2);
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    com.setSkin(value.file);
                    com.setSize(value.width, value.height);
                    if (container)
                        container[com.name] = com;
                    break;
            }
            com.startX = value.x;
            com.startY = value.y;
            com.moveAction = parseInt(value.moveAction);
            return com;
        };
        D5Component.prototype.dispose = function () {
        };
        D5Component.prototype.invalidate = function () {
            this.once(egret.Event.ENTER_FRAME, this.draw, this);
        };
        D5Component.prototype.draw = function () {
            this.invalidateSize();
            this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
        };
        D5Component.prototype.invalidateSize = function () {
            if (this._belone) {
                var target = D5Component._preloadList[this._belone];
                var list = target[0];
                var callback = target[1];
                var thisobj = target[2];
                var index = list.indexOf(this);
                if (index != -1)
                    list.splice(index, 1);
                callback.apply(thisobj, [list.length]);
                if (!list.length)
                    delete D5Component._preloadList[this._belone];
            }
        };
        D5Component.prototype.autoCache = function () {
            this.cacheAsBitmap = false;
            this.once(egret.Event.ENTER_FRAME, this.onAutoCache, this);
        };
        D5Component.prototype.onAutoCache = function (event) {
            this.cacheAsBitmap = true;
        };
        D5Component.MOVE_NUMBER = 10;
        D5Component.MOVE_NONE = 0;
        D5Component.MOVE_LEFT = 1;
        D5Component.MOVE_RIGHT = 2;
        D5Component.MOVE_DOWN = 3;
        D5Component.MOVE_UP = 4;
        D5Component.MOVE_ALPHA = 5;
        D5Component.autoRelease = false;
        D5Component._preloadList = {};
        D5Component._moveList = [];
        return D5Component;
    }(egret.Sprite));
    d5power.D5Component = D5Component;
    __reflect(D5Component.prototype, "d5power.D5Component");
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
var d5power;
(function (d5power) {
    var D5FlyBox = (function (_super) {
        __extends(D5FlyBox, _super);
        /**
         * @pararm	w	最大的自动换行宽度
         */
        function D5FlyBox() {
            var _this = _super.call(this) || this;
            _this._maxWidth = 0;
            _this._usedWidth = 0;
            _this._usedHeight = 0;
            _this._paddingx = 5;
            _this._paddingy = 5;
            _this._align = 0;
            /**
             * 原始X坐标
             */
            _this._zerox = 0;
            return _this;
        }
        /**
         * 设置对齐模式
         */
        D5FlyBox.prototype.setMode = function (values) {
            this._align = values;
            this.redraw();
        };
        D5FlyBox.prototype.setX = function (value) {
            //			super.x = value;
            this._zerox = this.x;
        };
        D5FlyBox.prototype.setPaddingx = function (num) {
            if (num === void 0) { num = 0; }
            this._paddingx = num;
            this.redraw();
        };
        D5FlyBox.prototype.setPaddingy = function (num) {
            if (num === void 0) { num = 0; }
            this._paddingy = num;
            this.redraw();
        };
        D5FlyBox.prototype.getPaddingx = function () {
            return this._paddingx;
        };
        D5FlyBox.prototype.getPaddingy = function () {
            return this._paddingy;
        };
        /**
         * 设置最大宽度，当内容超过最大宽度后，即会自动换行
         */
        D5FlyBox.prototype.setMaxWidth = function (w) {
            if (w === void 0) { w = 0; }
            this._maxWidth = w;
            this.redraw();
        };
        Object.defineProperty(D5FlyBox.prototype, "maxWidth", {
            get: function () {
                return this._maxWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5FlyBox.prototype, "$maxWidth", {
            get: function () {
                return this._maxWidth;
            },
            enumerable: true,
            configurable: true
        });
        D5FlyBox.prototype.parseToXML = function () {
            var result = "<D5FlyBox name='" + this.name + "' x='" + this.x + "' y='" + this.y + "' maxWidth='" + this._maxWidth + "'/>\n";
            return result;
        };
        D5FlyBox.prototype.setEditorMode = function () {
            if (this._editorBG != null)
                return;
            this._editorBG = new egret.Shape();
            this.addChild(this._editorBG);
            this.updateEditorBG();
        };
        D5FlyBox.prototype.addChild = function (child) {
            var obj = _super.prototype.addChild.call(this, child);
            obj.addEventListener(egret.Event.RESIZE, this.redraw, this);
            this.redraw();
            return obj;
        };
        D5FlyBox.prototype.removeChild = function (child) {
            var obj = _super.prototype.removeChild.call(this, child);
            obj.removeEventListener(egret.Event.RESIZE, this.redraw, this);
            this.redraw();
            return obj;
        };
        D5FlyBox.prototype.redraw = function (e) {
            if (e === void 0) { e = null; }
            this._usedWidth = 0;
            this._usedHeight = 0;
            var obj;
            var perMaxHeight = 0;
            for (var i = 0, j = this.numChildren; i < j; i++) {
                obj = this.getChildAt(i);
                if (this._usedWidth + this._paddingx + obj.width > this._maxWidth) {
                    this._usedHeight += perMaxHeight + this._paddingy;
                    perMaxHeight = 0;
                    this._usedWidth = 0;
                }
                obj.x = this._usedWidth;
                obj.y = this._usedHeight;
                perMaxHeight = perMaxHeight < obj.height ? obj.height : perMaxHeight;
                this._usedWidth += obj.width + this._paddingx;
            }
            //			if(this._align==D5FlyBox.CENTER){
            //				super.x = parseInt((this._maxWidth-this._w)>>1)+this._zerox;
            //			}
            this.setSize(this._maxWidth, this._usedHeight + perMaxHeight);
            if (this._editorBG != null)
                this.updateEditorBG();
            this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
        };
        D5FlyBox.prototype.updateEditorBG = function () {
            this._editorBG.graphics.clear();
            this._editorBG.graphics.lineStyle(1, 0);
            this._editorBG.graphics.beginFill(0xffffff, .5);
            this._editorBG.graphics.drawRect(0, 0, this._maxWidth, this._usedHeight < 20 ? 20 : this._usedHeight);
            this._editorBG.graphics.endFill();
        };
        D5FlyBox.LEFT = 0;
        D5FlyBox.CENTER = 1;
        return D5FlyBox;
    }(d5power.D5Component));
    d5power.D5FlyBox = D5FlyBox;
    __reflect(D5FlyBox.prototype, "d5power.D5FlyBox");
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
var d5power;
(function (d5power) {
    var D5MirrorBox = (function (_super) {
        __extends(D5MirrorBox, _super);
        function D5MirrorBox() {
            var _this = _super.call(this) || this;
            _this.cutX = 0;
            _this.cutY = 0;
            return _this;
        }
        D5MirrorBox.prototype.setRes = function (data) {
            this.onComplate(data);
        };
        D5MirrorBox.prototype.onComplate = function (data) {
            var sheet = new egret.SpriteSheet(data);
            sheet.createTexture('0', 0, 0, this.cutX, this.cutY);
            sheet.createTexture('1', this.cutX, 0, data.textureWidth - this.cutX, this.cutY);
            sheet.createTexture('2', 0, this.cutY, this.cutX, data.textureHeight - this.cutY);
            sheet.createTexture('3', this.cutX, this.cutY, data.textureWidth - this.cutX, data.textureHeight - this.cutY);
            if (this.lt == null)
                this.lt = new egret.Bitmap();
            this.lt.texture = sheet.getTexture('0');
            if (this.t == null)
                this.t = new egret.Bitmap();
            this.t.texture = sheet.getTexture('1');
            this.t.fillMode = egret.BitmapFillMode.REPEAT;
            if (this.rt == null)
                this.rt = new egret.Bitmap();
            this.rt.texture = sheet.getTexture('0');
            this.rt.scaleX = -1;
            if (this.l == null)
                this.l = new egret.Bitmap();
            this.l.texture = sheet.getTexture('2');
            this.l.fillMode = egret.BitmapFillMode.REPEAT;
            if (this.m == null)
                this.m = new egret.Bitmap();
            this.m.texture = sheet.getTexture('3');
            this.m.fillMode = egret.BitmapFillMode.REPEAT;
            if (this.r == null)
                this.r = new egret.Bitmap();
            this.r.texture = sheet.getTexture('2');
            this.r.scaleX = -1;
            this.r.fillMode = egret.BitmapFillMode.REPEAT;
            if (this.lb == null)
                this.lb = new egret.Bitmap();
            this.lb.texture = sheet.getTexture('0');
            this.lb.scaleY = -1;
            if (this.b == null)
                this.b = new egret.Bitmap();
            this.b.texture = sheet.getTexture('1');
            this.b.scaleY = -1;
            this.b.fillMode = egret.BitmapFillMode.REPEAT;
            if (this.rb == null)
                this.rb = new egret.Bitmap();
            this.rb.texture = sheet.getTexture('0');
            this.rb.scaleX = this.rb.scaleY = -1;
            this.rb.fillMode = egret.BitmapFillMode.REPEAT;
            this.invalidate();
        };
        D5MirrorBox.prototype.setSkin = function (name) {
            if (this._nowName == name)
                return;
            this._nowName = name;
            var data = d5power.D5UIResourceData.getData(name);
            if (data == null) {
                trace("[D5MirrorBox]No Resource" + name);
                this.loadResource(name, this.onComplate, this);
                return;
            }
            if (this.lt == null)
                this.lt = new egret.Bitmap();
            this.lt.texture = data.getResource(0);
            if (this.t == null)
                this.t = new egret.Bitmap();
            this.t.texture = data.getResource(1);
            this.t.fillMode = egret.BitmapFillMode.REPEAT;
            if (this.rt == null)
                this.rt = new egret.Bitmap();
            this.rt.texture = data.getResource(0);
            this.rt.scaleX = -1;
            if (this.l == null)
                this.l = new egret.Bitmap();
            this.l.texture = data.getResource(2);
            this.l.fillMode = egret.BitmapFillMode.REPEAT;
            if (this.m == null)
                this.m = new egret.Bitmap();
            this.m.texture = data.getResource(3);
            this.m.fillMode = egret.BitmapFillMode.REPEAT;
            if (this.r == null)
                this.r = new egret.Bitmap();
            this.r.texture = data.getResource(2);
            this.r.scaleX = -1;
            this.r.fillMode = egret.BitmapFillMode.REPEAT;
            if (this.lb == null)
                this.lb = new egret.Bitmap();
            this.lb.texture = data.getResource(0);
            this.lb.scaleY = -1;
            if (this.b == null)
                this.b = new egret.Bitmap();
            this.b.texture = data.getResource(1);
            this.b.scaleY = -1;
            this.b.fillMode = egret.BitmapFillMode.REPEAT;
            if (this.rb == null)
                this.rb = new egret.Bitmap();
            this.rb.texture = data.getResource(0);
            this.rb.scaleX = this.rb.scaleY = -1;
            this.rb.fillMode = egret.BitmapFillMode.REPEAT;
            this.invalidate();
        };
        D5MirrorBox.prototype.draw = function () {
            if (this.l == null) {
                return;
            }
            else {
                if (!this.contains(this.l)) {
                    this.addChildAt(this.lt, 0);
                    this.addChildAt(this.t, 0);
                    this.addChildAt(this.rt, 0);
                    this.addChildAt(this.l, 0);
                    this.addChildAt(this.m, 0);
                    this.addChildAt(this.r, 0);
                    this.addChildAt(this.lb, 0);
                    this.addChildAt(this.b, 0);
                    this.addChildAt(this.rb, 0);
                }
                this.t.x = this.m.x = this.b.x = this.lt.width;
                this.rt.x = this.r.x = this.rb.x = this._w;
                this.l.y = this.m.y = this.r.y = this.lt.height;
                this.lb.y = this.b.y = this.rb.y = this._h;
                this.m.width = this.t.width = this.b.width = this._w - this.lt.width * 2;
                this.m.height = this.l.height = this.r.height = this._h - this.lt.height * 2;
            }
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
            this.autoCache();
            _super.prototype.draw.call(this);
        };
        Object.defineProperty(D5MirrorBox.prototype, "mBitmap", {
            get: function () {
                return this.m;
            },
            enumerable: true,
            configurable: true
        });
        D5MirrorBox.prototype.dispose = function () {
            if (this.lt) {
                if (this.lt.parent)
                    this.lt.parent.removeChild(this.lt);
                this.lt.texture = null;
                this.lt = null;
            }
            if (this.t) {
                if (this.t.parent)
                    this.t.parent.removeChild(this.t);
                this.t.texture = null;
                this.t = null;
            }
            if (this.rt) {
                if (this.rt.parent)
                    this.rt.parent.removeChild(this.rt);
                this.rt.texture = null;
                this.rt = null;
            }
            if (this.l) {
                if (this.l.parent)
                    this.l.parent.removeChild(this.l);
                this.l.texture = null;
                this.l = null;
            }
            if (this.m) {
                if (this.m.parent)
                    this.m.parent.removeChild(this.m);
                this.m.texture = null;
                this.m = null;
            }
            if (this.r) {
                if (this.r.parent)
                    this.r.parent.removeChild(this.r);
                this.r.texture = null;
                this.r = null;
            }
            if (this.lb) {
                if (this.lb.parent)
                    this.lb.parent.removeChild(this.lb);
                this.lb.texture = null;
                this.lb = null;
            }
            if (this.b) {
                if (this.b.parent)
                    this.b.parent.removeChild(this.b);
                this.b.texture = null;
                this.b = null;
            }
            if (this.rb) {
                if (this.rb.parent)
                    this.rb.parent.removeChild(this.rb);
                this.rb.texture = null;
                this.rb = null;
            }
        };
        return D5MirrorBox;
    }(d5power.D5Component));
    d5power.D5MirrorBox = D5MirrorBox;
    __reflect(D5MirrorBox.prototype, "d5power.D5MirrorBox");
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
var d5power;
(function (d5power) {
    var D5Text = (function (_super) {
        __extends(D5Text, _super);
        //        /**
        //         * 设置对齐
        //         */
        //        private _alignType:number = 0;
        /**
         *
         * @param	_text		字符内容
         * @param	fontcolor	字体颜色
         * @param	bgcolor		文本框背景颜色
         * @param	border		文本框边线颜色
         */
        function D5Text(_text, fontcolor, bgcolor, border, size) {
            if (_text === void 0) { _text = ''; }
            if (fontcolor === void 0) { fontcolor = -1; }
            if (bgcolor === void 0) { bgcolor = -1; }
            if (border === void 0) { border = -1; }
            if (size === void 0) { size = 12; }
            var _this = _super.call(this) || this;
            /**
             * 背景色
             */
            _this._bgColor = -1;
            /**
             * 亮色边
             */
            _this._lightBorder = -1;
            /**
             * 暗色边
             */
            _this._darkBorder = -1;
            /**
             * 当前的描边颜色
             */
            _this._filterColor = -1;
            /**
             * 最大宽度
             */
            _this._maxWidth = 200;
            _this._textField = new egret.TextField();
            _this._textField.verticalAlign = egret.VerticalAlign.MIDDLE;
            _this._textField.textAlign = egret.HorizontalAlign.LEFT; //egret.VerticalAlign.MIDDLE;
            if (fontcolor >= 0)
                _this._textField.textColor = fontcolor;
            if (bgcolor >= 0)
                _this.setBgColor(bgcolor);
            if (border >= 0)
                _this.setFontBorder(border);
            _this._textField.lineSpacing = 4;
            _this.setFontSize(size);
            if (_text != '') {
                _this.setText(_text);
            }
            _this.addChild(_this._textField);
            return _this;
        }
        D5Text.prototype.update = function () {
            this.setText((d5power.D5Component._pro_binding_source.getPro(this._binding)));
        };
        D5Text.prototype.invalidateSize = function () {
            this._w = this._maxWidth == 0 || this._textField.multiline == false ? this._textField.textWidth + 6 : this._maxWidth;
            this._h = this._textField.textHeight + 10;
            //            console.log("[d5text]"+this._textField.textHeight+"|"+this._textField.height);
            this.setWidth(this._w);
            this.setHeight(this._h);
        };
        D5Text.prototype.clone = function () {
            var copy = new D5Text();
            this.copyFormat(copy);
            return copy;
        };
        /**
         * 将自身的格式复制设置给目标文本
         * @param		copy		想复制当前文本格式的D5Text
         */
        D5Text.prototype.copyFormat = function (copy, content) {
            if (content === void 0) { content = '文字'; }
            copy.setFontBold(this.fontBold);
            copy.setFontSize(this.fontSize);
            copy.setFontBorder(this.fontBorder);
            copy.setSize(this._w, this._h);
            copy._maxWidth = this._maxWidth;
            copy._textField.verticalAlign = this._textField.verticalAlign;
            copy._textField.textAlign = this._textField.textAlign;
            copy._textField.multiline = this._textField.multiline;
            copy._textField.type = this._textField.type;
            copy.setTextColor(this.textColor);
            copy.setLtBorder(this.ltBorder);
            copy.setRbBorder(this.rbBorder);
            copy.setBgColor(this.bgColor);
            copy.setIsPassword(this.isPassword);
        };
        /**
         * 设置文本内容的描边
         * @param	color	描边的值，-1为删除描边
         */
        D5Text.prototype.setVerticalAlign = function (value) {
            if (value === void 0) { value = 0; }
            switch (value) {
                case D5Text.TOP:
                    this._textField.verticalAlign = egret.VerticalAlign.TOP;
                    break;
                case D5Text.MIDDLE:
                    this._textField.verticalAlign = egret.VerticalAlign.MIDDLE;
                    break;
                case D5Text.BOTTOM:
                    this._textField.verticalAlign = egret.VerticalAlign.BOTTOM;
                    break;
            }
        };
        /**
         * 设置文本内容的描边
         * @param	color	描边的值，-1为删除描边
         */
        D5Text.prototype.setFontBorder = function (color) {
            if (color === void 0) { color = 0; }
            if (color < 0) {
                this._textField.stroke = 0;
            }
            else {
                this._textField.stroke = 1;
                this._textField.strokeColor = color;
            }
            this._filterColor = color;
        };
        Object.defineProperty(D5Text.prototype, "fontBorder", {
            get: function () {
                return this._filterColor;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 传入内容文本,兼容旧版。建议直接使用text属性
         */
        D5Text.prototype.setText = function (t) {
            if (this._textField == null) {
                return;
            }
            this._textField.text = t;
        };
        Object.defineProperty(D5Text.prototype, "text", {
            get: function () {
                return this._textField.text;
            },
            set: function (t) {
                if (this._textField == null) {
                    return;
                }
                this._textField.text = t;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5Text.prototype, "textField", {
            get: function () {
                return this._textField;
            },
            enumerable: true,
            configurable: true
        });
        /**
        *传入html文本
        */
        D5Text.prototype.setHtmlText = function (html) {
            if (this._textField == null)
                return;
            this._textField.textFlow = (new egret.HtmlTextParser).parser(html);
        };
        /**
         * 设置背景颜色
         */
        D5Text.prototype.setBgColor = function (v) {
            if (v === void 0) { v = 0; }
            this._bgColor = v;
            this.setSize(this._w, this._h);
        };
        Object.defineProperty(D5Text.prototype, "bgColor", {
            get: function () {
                return this._bgColor;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置边框颜色
         * @param	lt	LeftTop，左侧和顶部的线条颜色
         * @param	rb	RightBottom,右侧和底部的线条颜色
         */
        D5Text.prototype.setLtBorder = function (v) {
            if (v === void 0) { v = 0; }
            this._lightBorder = v;
            this.setSize(this._w, this._h);
        };
        Object.defineProperty(D5Text.prototype, "ltBorder", {
            get: function () {
                return this._lightBorder;
            },
            enumerable: true,
            configurable: true
        });
        D5Text.prototype.setRbBorder = function (v) {
            if (v === void 0) { v = 0; }
            this._darkBorder = v;
            this.setSize(this._w, this._h);
        };
        Object.defineProperty(D5Text.prototype, "rbBorder", {
            get: function () {
                return this._darkBorder;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 是否以密码的状态显示文本
         */
        D5Text.prototype.setIsPassword = function (v) {
            this._textField.displayAsPassword = v;
        };
        Object.defineProperty(D5Text.prototype, "isPassword", {
            get: function () {
                return this._textField.displayAsPassword;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5Text.prototype, "textID", {
            /**
             *文本id,用此id去语言包取对应的值
             */
            get: function () {
                return this._textID;
            },
            enumerable: true,
            configurable: true
        });
        D5Text.prototype.setTextID = function (value) {
            this._textID = value;
        };
        /**
         *设置宽高
         */
        D5Text.prototype.setWidth = function (value) {
            this._w = value;
            this._textField.width = value > this._maxWidth ? this._maxWidth : value;
        };
        D5Text.prototype.setHeight = function (value) {
            this._h = value;
            this._textField.height = value;
            this._textField.$setHeight(value);
        };
        /**
         *设置对齐
         */
        D5Text.prototype.setTextAlign = function (value) {
            switch (value) {
                case D5Text.LEFT:
                    this._textField.textAlign = egret.HorizontalAlign.LEFT;
                    break;
                case D5Text.CENTER:
                    this._textField.textAlign = egret.HorizontalAlign.CENTER;
                    break;
                case D5Text.RIGHT:
                    this._textField.textAlign = egret.HorizontalAlign.RIGHT;
                    break;
            }
        };
        /**
         *背景宽高
         */
        D5Text.prototype.setSize = function (w, h) {
            if (h === void 0) { h = 0; }
            var needZoom = false;
            this._w = w;
            this._h = h;
            this.graphics.clear();
            if (this._bgColor != -1) {
                this.graphics.beginFill(this._bgColor);
                needZoom = true;
            }
            if (this._lightBorder != -1) {
                if (this._darkBorder == -1)
                    this._darkBorder = this._lightBorder;
                this.graphics.lineStyle(1, this._lightBorder);
                this.graphics.lineTo(this._w, 0);
                this.graphics.lineStyle(1, this._darkBorder);
                this.graphics.lineTo(this._w, this._h);
                this.graphics.lineTo(0, this._h);
                this.graphics.lineStyle(1, this._lightBorder);
                this.graphics.lineTo(0, 0);
                this.graphics.endFill();
                needZoom = true;
            }
            else if (this._bgColor != -1) {
                this.graphics.drawRect(0, 0, this._w, this._h);
                this.graphics.endFill();
                needZoom = true;
            }
            if (needZoom) {
                this._textField.x = this._textField.y = D5Text.AUTO_PADDING;
                this._textField.height = h - D5Text.AUTO_PADDING * 2;
                this._textField.width = w - D5Text.AUTO_PADDING * 2;
            }
            else {
                this._textField.height = h;
                this._textField.width = w;
            }
        };
        /**
        * 自动调整宽度和高度
        */
        D5Text.prototype.autoGrow = function () {
            if (this._textField == null)
                return;
            this._w = this._maxWidth == 0 || this._textField.multiline == false ? this._textField.textWidth + 6 : this._maxWidth;
            this._h = this._textField.textHeight + 10;
            this.setSize(this._w, this._h);
            //            console.log("[d5text2]"+this._textField.textHeight+"|"+this._textField.height);
            //            this.invalidate();
        };
        /**
         * 是否为多行
         */
        D5Text.prototype.setWrapFlg = function (flg) {
            if (flg === void 0) { flg = 0; }
            var b;
            if (flg == 1)
                b = true;
            else if (flg == 0)
                b = false;
            this._textField.multiline = b;
            if (b)
                this._textField.verticalAlign = egret.VerticalAlign.TOP;
        };
        Object.defineProperty(D5Text.prototype, "wrapFlg", {
            get: function () {
                return this._textField.multiline == true ? 1 : 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 将文本框锁定在某背景元素上,使文本框的宽\高\坐标与目标完全一致
         * @param	d
         */
        D5Text.prototype.lockTo = function (d, changeHeight, padding) {
            if (changeHeight === void 0) { changeHeight = false; }
            if (padding === void 0) { padding = 0; }
            this._w = d.width - padding * 2;
            if (changeHeight) {
                this._h = d.height - padding * 2;
            }
            this.x = d.x + padding;
            this.y = d.y + padding;
        };
        /**
         * 设置字体大小
         */
        D5Text.prototype.setFontSize = function (size) {
            if (size === void 0) { size = 0; }
            this._textField.size = size;
        };
        Object.defineProperty(D5Text.prototype, "fontSize", {
            get: function () {
                return this._textField.size;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置字体加粗
         */
        D5Text.prototype.setFontBold = function (b) {
            this._textField.bold = b;
        };
        Object.defineProperty(D5Text.prototype, "fontBold", {
            get: function () {
                return this._textField.bold;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置文本的输入类型（是否允许输入）1,允许输入；0，不允许
         */
        D5Text.prototype.setType = function (u) {
            if (u === void 0) { u = 0; }
            if (u == 1) {
                this._textField.type = egret.TextFieldType.INPUT;
            }
            else {
                this._textField.type = egret.TextFieldType.DYNAMIC;
            }
        };
        Object.defineProperty(D5Text.prototype, "type", {
            get: function () {
                return this._textField.type == egret.TextFieldType.INPUT ? 1 : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5Text.prototype, "textWidth", {
            /**
             * 文本内容宽高
             */
            get: function () {
                return this._textField.textWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5Text.prototype, "textHeight", {
            get: function () {
                return this._textField.textHeight;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置文本颜色
         */
        D5Text.prototype.setTextColor = function (u) {
            if (u === void 0) { u = 0; }
            this._textField.textColor = u;
        };
        Object.defineProperty(D5Text.prototype, "textColor", {
            get: function () {
                return this._textField.textColor;
            },
            set: function (u) {
                this._textField.textColor = u;
            },
            enumerable: true,
            configurable: true
        });
        D5Text.prototype.clear = function () {
        };
        D5Text.prototype.dispose = function () {
            if (this._textField) {
                if (this._textField.parent)
                    this._textField.parent.removeChild(this._textField);
                this._textField = null;
            }
        };
        D5Text.LEFT = 0;
        D5Text.CENTER = 1;
        D5Text.RIGHT = 2;
        D5Text.TOP = 0;
        D5Text.MIDDLE = 1;
        D5Text.BOTTOM = 2;
        D5Text.AUTO_PADDING = 3;
        return D5Text;
    }(d5power.D5Component));
    d5power.D5Text = D5Text;
    __reflect(D5Text.prototype, "d5power.D5Text", ["d5power.IProBindingSupport"]);
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
var d5power;
(function (d5power) {
    var D5ImageBox = (function (_super) {
        __extends(D5ImageBox, _super);
        function D5ImageBox() {
            var _this = _super.call(this) || this;
            /**
             * 是否显示数量
             */
            _this._showNum = false;
            return _this;
        }
        D5ImageBox.prototype.onComplate = function (data) {
            if (this._logo == null) {
                this._logo = new egret.Bitmap();
            }
            this._logo.texture = data;
            this.addChildAt(this._logo, 0);
            this.invalidate();
        };
        /**
         * 设置物品图片
         */
        D5ImageBox.prototype.setLogo = function (url) {
            if (this.spr == null) {
                this.spr = new egret.Sprite();
                this.addChild(this.spr);
            }
            for (var i = 0; i < this.spr.numChildren; i++) {
                var obj = this.spr.getChildAt(i);
                if (obj.parent)
                    obj.parent.removeChild(obj);
                obj = null;
            }
            if (url != "") {
                this._url = url;
                this.loadResource(this._url, this.onComplate, this);
                //this.addEventListener(egret.Event.COMPLETE,this.over,this);
            }
        };
        D5ImageBox.prototype.removeLogo = function () {
            if (this._logo && this.contains(this._logo)) {
                this.removeChild(this._logo);
                //this._logo = null;
            }
        };
        D5ImageBox.prototype.draw = function () {
            if (this._logo) {
                this._logo.scaleX = this._w / this._logo.width;
                this._logo.scaleY = this._h / this._logo.height;
                this._logo.fillMode = egret.BitmapFillMode.REPEAT;
            }
            _super.prototype.draw.call(this);
        };
        D5ImageBox.prototype.over = function (evt) {
            this.loadResource(this._url, this.onComplate, this);
        };
        Object.defineProperty(D5ImageBox.prototype, "url", {
            /**
             * 设置URL，本功能仅用来保存URL，不会加载地址
             * 如需要加载，请使用logo属性，或者通过logoData直接设置位图数据
             */
            set: function (v) {
                this._url = v;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 是否显示数量（例如背包的右下角数据）
         */
        D5ImageBox.prototype.showNum = function (b) {
            this._showNum = b;
            if (!this._showNum && this.numShower != null && this.contains(this.numShower)) {
                this.removeChild(this.numShower);
                this.numShower = null;
            }
            else if (this._showNum && this.numShower == null) {
                this.buildNumShower();
            }
        };
        D5ImageBox.prototype.buildNumShower = function () {
            if (this.numShower == null) {
                this.numShower = new d5power.D5Text('0', 0xd4cc75);
                this.numShower.setFontBorder(0x000000);
                this.numShower.setTextAlign(d5power.D5Text.RIGHT);
                this.numShower.setSize(50, 18);
            }
            this.numShower.x = this._w - this.numShower.width;
            this.numShower.y = this._h - this.numShower.height;
            this.addChild(this.numShower);
        };
        /**
         * 设置数量
         */
        D5ImageBox.prototype.setNum = function (v) {
            this._itemNum = v;
            if (this.numShower != null)
                this.numShower.setText(v.toString());
        };
        Object.defineProperty(D5ImageBox.prototype, "num", {
            /**
             * 获取数量
             */
            get: function () {
                return this._itemNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5ImageBox.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        D5ImageBox.prototype.setId = function (value) {
            this._id = value;
        };
        D5ImageBox.prototype.dispose = function () {
            if (this.spr) {
                if (this.spr.parent)
                    this.spr.parent.removeChild(this.spr);
                this.spr = null;
            }
            if (this._logo) {
                if (this._logo.parent)
                    this._logo.parent.removeChild(this._logo);
                this._logo.texture = null;
                this._logo = null;
            }
            if (this.numShower) {
                if (this.numShower.parent)
                    this.numShower.parent.removeChild(this.numShower);
                this.numShower.dispose();
                this.numShower = null;
            }
        };
        D5ImageBox._resourceLib = {};
        return D5ImageBox;
    }(d5power.D5MirrorBox));
    d5power.D5ImageBox = D5ImageBox;
    __reflect(D5ImageBox.prototype, "d5power.D5ImageBox");
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
var d5power;
(function (d5power) {
    /**
     *
     * @author
     *
     */
    var D5BitmapNumber = (function (_super) {
        __extends(D5BitmapNumber, _super);
        function D5BitmapNumber() {
            var _this = _super.call(this) || this;
            _this._align = 0;
            _this._keepLength = 0;
            _this._nowValue = 0;
            _this._targetValue = 0;
            _this._lastrender = 0;
            _this._box = new d5power.D5HBox();
            //            this._box.setPadding(0);
            _this._displayer = [];
            _this.addChild(_this._box);
            return _this;
        }
        D5BitmapNumber.getBitmap = function () {
            if (D5BitmapNumber._pool.length)
                return D5BitmapNumber._pool.pop();
            return new egret.Bitmap;
        };
        D5BitmapNumber.back2Pool = function (v) {
            v.texture = null;
            if (v.parent)
                v.parent.removeChild(v);
            if (D5BitmapNumber._pool.indexOf(v) == -1)
                D5BitmapNumber._pool.push(v);
        };
        D5BitmapNumber.prototype.setAlign = function (v) {
            this._align = v;
        };
        /**
         * 设置保持长度
         */
        D5BitmapNumber.prototype.keepLength = function (v) {
            this._keepLength = v;
        };
        Object.defineProperty(D5BitmapNumber.prototype, "autoGrow", {
            /**
             * 是否开启自动增长功能
             */
            set: function (v) {
                this._autoAdd = v;
            },
            enumerable: true,
            configurable: true
        });
        D5BitmapNumber.prototype.setSkin = function (name) {
            if (this._nowName == name)
                return;
            this._nowName = name;
            this.data = d5power.D5UIResourceData.getData(name);
            if (this.data == null) {
                trace("[D5Button]No Resource" + name);
                return;
            }
        };
        D5BitmapNumber.prototype.setValue = function (v) {
            var str = v + '';
            var len = str.length;
            this._targetValue = parseInt(v);
            this.cacheAsBitmap = false;
            if (!this._autoAdd) {
                this.drawNumber(str);
            }
            else if (this._targetValue != this._nowValue) {
                this.addEventListener(egret.Event.ENTER_FRAME, this.autoAddRender, this);
            }
        };
        D5BitmapNumber.prototype.drawNumber = function (str) {
            var pnumber;
            var bitmap;
            var len = str.length;
            if (len > 0 && this._displayer.length != str.length && this._keepLength == 0) {
                var i;
                var j;
                if (len > this._displayer.length) {
                    // 需要新增
                    for (i = this._displayer.length; i < len; i++) {
                        bitmap = D5BitmapNumber.getBitmap();
                        this._displayer.push(bitmap);
                        this._box.addChild(bitmap);
                    }
                }
                else {
                    // 需要减少
                    while (this._displayer.length <= len) {
                        bitmap = this._displayer.pop();
                        D5BitmapNumber.back2Pool(bitmap);
                    }
                }
                var perW = this.data.getResource(0).textureWidth;
                this._w = len * perW;
                switch (this._align) {
                    case d5power.D5Text.CENTER:
                        this._box.x = -this._w >> 1;
                        break;
                    case d5power.D5Text.RIGHT:
                        this._box.x = -this._w - perW;
                        break;
                }
            }
            for (var i = 0; i < len; i++) {
                pnumber = str.substr(i, 1);
                bitmap = this._displayer[i];
                bitmap.texture = this.data.getResource(parseInt(pnumber));
            }
        };
        D5BitmapNumber.prototype.setPadding = function (v) {
            this._box.setPadding(v);
        };
        D5BitmapNumber.prototype.dispose = function () {
            this.data = null;
            if (this._box) {
                if (this._box.parent)
                    this._box.parent.removeChild(this._box);
                this._box.dispose();
                this._box = null;
            }
        };
        D5BitmapNumber.prototype.autoAddRender = function (e) {
            var t = egret.getTimer();
            if (t - this._lastrender < 30)
                return;
            this._lastrender = t;
            var nowOld = this._nowValue;
            this._nowValue += (this._targetValue - this._nowValue) / 5;
            if (Math.ceil(this._nowValue) == this._targetValue) {
                this._nowValue = this._targetValue;
                this.removeEventListener(egret.Event.ENTER_FRAME, this.autoAddRender, this);
                this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
                this.autoCache();
            }
            // 避免小数转整后相同而导致的渲染
            if (parseInt(this._nowValue) == parseInt(nowOld))
                return;
            this.drawNumber(Math.floor(this._nowValue) + '');
        };
        D5BitmapNumber._pool = [];
        return D5BitmapNumber;
    }(d5power.D5Component));
    d5power.D5BitmapNumber = D5BitmapNumber;
    __reflect(D5BitmapNumber.prototype, "d5power.D5BitmapNumber");
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
var d5power;
(function (d5power) {
    var D5Button = (function (_super) {
        __extends(D5Button, _super);
        function D5Button() {
            var _this = _super.call(this) || this;
            _this.type = 4;
            _this._iconAutoFly = false;
            return _this;
        }
        D5Button.prototype.showIcon = function (v) {
            if (this._icon)
                this._icon.visible = v;
        };
        Object.defineProperty(D5Button.prototype, "iconDisplay", {
            get: function () {
                return this._icon == null ? false : this._icon.visible;
            },
            enumerable: true,
            configurable: true
        });
        D5Button.prototype.setIcon = function (url, xpos, ypos) {
            if (xpos === void 0) { xpos = 0; }
            if (ypos === void 0) { ypos = 0; }
            if (url == '')
                return;
            if (!this._icon)
                this._icon = new d5power.D5Bitmap();
            this._icon.setSkin(url);
            this._icon.x = xpos;
            this._icon.y = ypos;
            if (this._icon.x == 0 && this._icon.y == 0)
                this._iconAutoFly = true;
            if (this._w != 0)
                this.flyIcon();
        };
        D5Button.prototype.flyIcon = function () {
            if (this._icon) {
                if (this.contains(this._icon))
                    this.setChildIndex(this._icon, this.numChildren - 1);
                else
                    this.addChild(this._icon);
                if (this._lable && this.contains(this._lable) && this.contains(this._icon) && this._iconAutoFly) {
                    this._icon.x = (this.a.width - this._icon.width - this._lable.width) >> 1;
                    this._lable.x = this._icon.x + this._icon.height;
                }
                else {
                    if (this._icon.x == 0) {
                        this._icon.x = (this._w - this._icon.width) >> 1;
                    }
                    if (this._icon.y == 0) {
                        this._icon.y = (this._h - this._icon.height) >> 1;
                    }
                }
            }
        };
        D5Button.prototype.setLable = function (lab) {
            if (this._lable == null) {
                this._lable = new d5power.D5Text();
                this._lable.setFontSize(d5power.D5Style.default_btn_lable_size);
                this._lable.setFontBold(d5power.D5Style.default_btn_lable_bold);
                if (d5power.D5Style.default_btn_lable_border != -1)
                    this._lable.setFontBorder(d5power.D5Style.default_btn_lable_border);
                this.addChild(this._lable);
            }
            this._lable.setText(lab);
            this._lable.autoGrow();
            //this._lable.setWidth(lab.length * d5power.D5Style.default_btn_lable_size);
            //this._lable.setHeight(d5power.D5Style.default_btn_lable_size);
            this.autoLableSize();
        };
        D5Button.prototype.autoLableSize = function () {
            if (this._lable == null || this.a == null)
                return;
            this._lable.x = Math.abs(this.a.width - this._lable.width) / 2;
            this._lable.y = Math.abs(this.a.height - this._lable.height) / 2;
        };
        D5Button.prototype.enabled = function (b) {
            this.touchEnabled = b;
            if (b) {
                if (this._sheet == null) {
                    this.a.texture = this.data.getResource(0);
                }
                else {
                    this.a.texture = this._sheet.getTexture('0');
                }
            }
            else {
                if (this.type == 2) {
                    if (this._sheet == null) {
                        this.a.texture = this.data.getResource(0);
                    }
                    else {
                        this.a.texture = this._sheet.getTexture('0');
                    }
                }
                else {
                    if (this._sheet == null) {
                        this.a.texture = this.data.getResource(3);
                    }
                    else {
                        this.a.texture = this._sheet.getTexture('3');
                    }
                }
            }
            this.invalidate();
        };
        D5Button.prototype.setRes = function (data) {
            this.onComplate(data);
        };
        D5Button.prototype.onComplate = function (data) {
            this._sheet = new egret.SpriteSheet(data);
            if (this.type = 4) {
                this._sheet.createTexture('0', 0, 0, data.textureWidth / 4, data.textureHeight);
                this._sheet.createTexture('1', data.textureWidth / 4, 0, data.textureWidth / 4, data.textureHeight);
                this._sheet.createTexture('2', data.textureWidth / 2, 0, data.textureWidth / 4, data.textureHeight);
                this._sheet.createTexture('3', data.textureWidth * 3 / 4, 0, data.textureWidth / 4, data.textureHeight);
            }
            else {
                this._sheet.createTexture('0', 0, 0, data.textureWidth / 2, data.textureHeight);
                this._sheet.createTexture('1', data.textureWidth / 2, 0, data.textureWidth / 2, data.textureHeight);
            }
            this.drawButton();
            this.invalidate();
        };
        D5Button.prototype.drawButton = function () {
            if (this.a == null)
                this.a = new egret.Bitmap();
            this.a.texture = this._sheet ? this._sheet.getTexture('0') : this.data.getResource(0);
            this._w = this.a.width;
            this._h = this.a.height;
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.btnDown, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.btnUp, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnClick, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.btnOutSide, this);
            if (this._icon)
                this.flyIcon();
        };
        D5Button.prototype.setSkin = function (name) {
            if (this._nowName == name)
                return;
            this._nowName = name;
            this.data = d5power.D5UIResourceData.getData(name);
            if (this.data == null) {
                trace("[D5Button]No Resource" + name);
                this.loadResource(name, this.onComplate, this);
                return;
            }
            this.type = this.data.buttonType;
            this.drawButton();
            this.invalidate();
        };
        D5Button.prototype.setSound = function (sound) {
            sound = sound.replace('resource/', '');
            this.sound = sound;
        };
        D5Button.prototype.btnDown = function (evt) {
            if (this.type == 2) {
                if (this._sheet == null) {
                    this.a.texture = this.data.getResource(1);
                }
                else {
                    this.a.texture = this._sheet.getTexture('1');
                }
            }
            else {
                if (this._sheet == null) {
                    this.a.texture = this.data.getResource(1);
                }
                else {
                    this.a.texture = this._sheet.getTexture('1');
                }
            }
            this.invalidate();
        };
        D5Button.prototype.btnUp = function (evt) {
            if (this._sheet == null) {
                this.a.texture = this.data.getResource(0);
            }
            else {
                this.a.texture = this._sheet.getTexture('0');
            }
            this.invalidate();
        };
        D5Button.prototype.btnOutSide = function (evt) {
            if (this._sheet == null) {
                this.a.texture = this.data.getResource(0);
            }
            else {
                this.a.texture = this._sheet.getTexture('0');
            }
            this.invalidate();
        };
        D5Button.prototype.btnClick = function (evt) {
            var sound = RES.getRes(this.sound);
            if (sound)
                sound.play();
            if (this._callback2 != null && this.enabled) {
                this._callback2(evt);
            }
            this.invalidate();
        };
        D5Button.prototype.draw = function () {
            if (this.a == null) {
                return;
            }
            else {
                if (!this.contains(this.a)) {
                    this.addChildAt(this.a, 0);
                }
            }
            _super.prototype.draw.call(this);
            if (this._lable != null) {
                this.addChild(this._lable);
                this.autoLableSize();
            }
        };
        D5Button.prototype.setCallback = function (fun) {
            this._callback2 = fun;
        };
        D5Button.prototype.dispose = function () {
            this.data = null;
            if (this._callback2) {
                this._callback2 = null;
            }
            if (this.a) {
                if (this.a.parent)
                    this.a.parent.removeChild(this.a);
                this.a.texture = null;
                this.a = null;
            }
            if (this._icon) {
                if (this._icon.parent)
                    this._icon.parent.removeChild(this._icon);
                this._icon.dispose();
                this._icon = null;
            }
            if (this._lable) {
                if (this._lable.parent)
                    this._lable.parent.removeChild(this._lable);
                this._lable.dispose();
                this._lable = null;
            }
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.btnDown, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.btnUp, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.btnClick, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.btnOutSide, this);
        };
        return D5Button;
    }(d5power.D5Component));
    d5power.D5Button = D5Button;
    __reflect(D5Button.prototype, "d5power.D5Button");
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
var d5power;
(function (d5power) {
    /**
     *
     * @author
     *
     */
    var D5CDdisplayer = (function (_super) {
        __extends(D5CDdisplayer, _super);
        function D5CDdisplayer() {
            var _this = _super.call(this) || this;
            _this._mode = 0;
            _this._color = 0;
            _this.alpha = 0.8;
            _this.setSize(60, 60);
            return _this;
        }
        D5CDdisplayer.prototype.setMode = function (v) {
            this._mode = v;
        };
        D5CDdisplayer.prototype.setColor = function (v) {
            this._color = v;
        };
        D5CDdisplayer.prototype.setAlpha = function (value) {
            this.alpha = value;
        };
        Object.defineProperty(D5CDdisplayer.prototype, "cding", {
            /**
            * 是否正在CD
            */
            get: function () {
                return this._cding;
            },
            enumerable: true,
            configurable: true
        });
        D5CDdisplayer.prototype.setSize = function (w, h) {
            _super.prototype.setSize.call(this, w, h);
            this._progressMax = (w + h) * 2;
            this._startX = w >> 1;
            this._startY = h >> 1;
            this._drawPath = [[(w >> 1), 0, 0], [w, 0, (w >> 1)], [w, h, (w >> 1) + h], [0, h, (w >> 1) + h + w], [0, 0, (w >> 1) + h + h + w], [(w >> 1), 0, (w + h) * 2]];
        };
        /**
        * 开始CD
        * @param	v	CD时间，单位秒
        */
        D5CDdisplayer.prototype.startCD = function (v) {
            this._cd = v * 1000;
            this._cding = true;
            this._startTime = egret.getTimer();
            this._progressLen = 0;
            if (v < 2) {
                this._renderSpeed = 20;
            }
            else if (v < 6) {
                this._renderSpeed = 40;
            }
            else if (v < 10) {
                this._renderSpeed = 100;
            }
            else if (v < 30) {
                this._renderSpeed = 150;
            }
            else if (v < 120) {
                this._renderSpeed = 200;
            }
            else {
                this._renderSpeed = 800;
            }
            this.graphics.clear();
            this.graphics.beginFill(this._color, this.alpha);
            this.graphics.drawRect(0, 0, this.width, this.height);
            this.addEventListener(egret.Event.ENTER_FRAME, this.render, this);
        };
        D5CDdisplayer.prototype.render = function (e) {
            if (e === void 0) { e = null; }
            if (this._mode == D5CDdisplayer.CIRCLE) {
                this.renderCircle();
            }
            else {
                this.renderRect();
            }
        };
        D5CDdisplayer.prototype.renderCircle = function (e) {
            if (e === void 0) { e = null; }
            var t = egret.getTimer();
            var checker = t - this._lastRender;
            if (checker < this._renderSpeed)
                return;
            checker = t - this._startTime;
            if (checker >= this._cd) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.render, this);
                this._cding = false;
                this.graphics.clear();
                return;
            }
            this._progressLen = checker * 360 / this._cd;
            this.graphics.clear();
            this.graphics.beginFill(this._color, this.alpha);
            this.graphics.moveTo(this._startX, this._startY);
            var angle;
            for (var i = 0; i < this._progressLen; i += 5) {
                angle = i * Math.PI / 180;
                this.graphics.lineTo(this._startX + this._startX * Math.sin(angle), this._startY - this._startY * Math.cos(angle));
            }
            this.graphics.lineTo(this._startX, this._startY);
            this.graphics.endFill();
            this._lastRender = t;
        };
        D5CDdisplayer.prototype.renderRect = function (e) {
            if (e === void 0) { e = null; }
            var t = egret.getTimer();
            var checker = t - this._lastRender;
            if (checker < this._renderSpeed)
                return;
            checker = t - this._startTime;
            if (checker >= this._cd) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.render, this);
                this._cding = false;
                this.graphics.clear();
                return;
            }
            this._progressLen = this._progressMax * (checker / this._cd);
            this.graphics.clear();
            if (this._color == 0xffffff) {
                this.graphics.beginFill(0x000000, 0.1);
                this.graphics.drawRect(0, 0, this.width, this.height);
                this.graphics.endFill();
            }
            this.graphics.beginFill(this._color, this.alpha);
            this.graphics.moveTo(this._startX, this._startY);
            var nowX = -1;
            var nowY = -1;
            for (var i = 0; i < 6; i++) {
                if (i < 4 && this._progressLen > this._drawPath[i + 1][2])
                    continue;
                if (nowX == -1) {
                    switch (i) {
                        case 0:
                            nowX = this._drawPath[i][0] + this._progressLen;
                            nowY = this._drawPath[i][1];
                            break;
                        case 1:
                            nowX = this._drawPath[i][0];
                            nowY = this._drawPath[i][1] + this._progressLen - this._drawPath[i][2];
                            break;
                        case 2:
                            nowX = this._drawPath[i][0] - this._progressLen + this._drawPath[i][2];
                            nowY = this._drawPath[i][1];
                            break;
                        case 3:
                            nowX = this._drawPath[i][0];
                            nowY = this._drawPath[i][1] - this._progressLen + this._drawPath[i][2];
                            break;
                        case 4:
                            nowX = this._drawPath[i][0] + this._progressLen - this._drawPath[i][2];
                            nowY = this._drawPath[i][1];
                            break;
                    }
                    this.graphics.lineTo(nowX, nowY);
                }
                else {
                    this.graphics.lineTo(this._drawPath[i][0], this._drawPath[i][1]);
                }
            }
            this.graphics.lineTo(this._startX, this._startY);
            this.graphics.endFill();
            this._lastRender = t;
        };
        D5CDdisplayer.CIRCLE = 0;
        D5CDdisplayer.RECT = 1;
        return D5CDdisplayer;
    }(d5power.D5Component));
    d5power.D5CDdisplayer = D5CDdisplayer;
    __reflect(D5CDdisplayer.prototype, "d5power.D5CDdisplayer");
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
var d5power;
(function (d5power) {
    var D5ButtonGroup = (function (_super) {
        __extends(D5ButtonGroup, _super);
        /**
         * 构造函数
         * @param	w	按钮组的容器宽度
         */
        function D5ButtonGroup(w) {
            if (w === void 0) { w = 0; }
            var _this = _super.call(this) || this;
            _this._itemNum = 0;
            _this._bgShapeFlg = 0;
            _this._w = w;
            _this._hasDefaultSelected = true;
            _this.items = [];
            _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this._onItemClick, _this);
            return _this;
        }
        D5ButtonGroup.prototype.unsetup = function (e) {
            if (e === void 0) { e = null; }
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onItemClick, this);
            var length = this.items.length;
            for (var i = 0; i < length; i++) {
                var item = this.items[i];
                if (item.parent)
                    item.parent.removeChild(item);
                item = null;
            }
        };
        /**
         * 按钮数量
         */
        D5ButtonGroup.prototype.setItemNum = function (num) {
            if (num === void 0) { num = 0; }
            this._itemNum = num;
        };
        Object.defineProperty(D5ButtonGroup.prototype, "itemNum", {
            /**
             * 按钮数量
             */
            get: function () {
                return this.items.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5ButtonGroup.prototype, "hasDefaultSelected", {
            /**
             * 是否具备默认选项
             */
            get: function () {
                return this._hasDefaultSelected;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 是否具备默认选项
         */
        D5ButtonGroup.prototype.setHasDefaultSelected = function (value) {
            this._hasDefaultSelected = value;
        };
        /**
         * 向按钮组中增加对象
         */
        D5ButtonGroup.prototype.addItem = function (item) {
            if (item == null) {
                trace("[D5ButtonGroup] 按钮组只能添加按钮对象");
                return;
            }
            this.addChild(item);
            if (this.items.indexOf(item) == -1)
                this.items.push(item);
        };
        D5ButtonGroup.prototype.addChild = function (child) {
            if (!(child instanceof d5power.D5Button)) {
                trace("[D5ButtonGroup] 按钮组只能添加按钮对象");
                return null;
            }
            if (this.items.indexOf(child) == -1)
                this.items.push(child);
            return _super.prototype.addChild.call(this, child);
        };
        /**
         * 从按钮组中移除某对象
         */
        D5ButtonGroup.prototype.removeItem = function (item) {
            this.removeChild(item);
            if (item.hasEventListener(egret.TouchEvent.TOUCH_TAP))
                item.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onItemClick, this);
        };
        /**
         * 点击事件
         */
        D5ButtonGroup.prototype._onItemClick = function (e) {
            var item = (e.target);
            if (item != this._lastSelectedItem) {
                this._lastSelectedItem = item;
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
        };
        D5ButtonGroup.prototype.getSelectedID = function () {
            return this.items.indexOf(this._lastSelectedItem);
        };
        D5ButtonGroup.prototype.setEditorMode = function () {
            this.createBgShape();
        };
        /**
         *此组件默认背景
         */
        D5ButtonGroup.prototype.createBgShape = function (w, h) {
            if (w === void 0) { w = 500; }
            if (h === void 0) { h = 60; }
            this.graphics.beginFill(0x3e3e3e);
            this.graphics.drawRect(0, 0, w, h);
            this.graphics.endFill();
            this._bgShapeFlg = 1;
        };
        D5ButtonGroup.prototype.clearVirtualBackground = function () {
            this.graphics.clear();
            this._bgShapeFlg = 0;
        };
        Object.defineProperty(D5ButtonGroup.prototype, "bgShapeFlg", {
            get: function () {
                return this._bgShapeFlg;
            },
            set: function (flg) {
                this._bgShapeFlg = flg;
            },
            enumerable: true,
            configurable: true
        });
        D5ButtonGroup.prototype.dispose = function () {
            this.unsetup();
        };
        return D5ButtonGroup;
    }(d5power.D5FlyBox));
    d5power.D5ButtonGroup = D5ButtonGroup;
    __reflect(D5ButtonGroup.prototype, "d5power.D5ButtonGroup");
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
var d5power;
(function (d5power) {
    var D5HBox = (function (_super) {
        __extends(D5HBox, _super);
        function D5HBox() {
            var _this = _super.call(this) || this;
            _this._padding = 5;
            _this.autoFly = true;
            return _this;
        }
        D5HBox.prototype.setEditorMode = function () {
            if (this._editorBG != null)
                return;
            this._editorBG = new egret.Shape();
            this._editorBG.graphics.clear();
            this._editorBG.graphics.lineStyle(1, 0);
            this._editorBG.graphics.beginFill(0xff9900, .5);
            this._editorBG.graphics.drawRect(0, 0, 60, 20);
            this._editorBG.graphics.endFill();
            this.addChild(this._editorBG);
        };
        D5HBox.prototype.parseToXML = function () {
            var result = "<D5HBox name='" + this.name + "' x='" + this.x + "' y='" + this.y + "'/>\n";
            return result;
        };
        /**
         * Override of addChild to force layout;
         */
        D5HBox.prototype.addChildAt = function (child, index) {
            if (index === void 0) { index = 0; }
            _super.prototype.addChildAt.call(this, child, index);
            child.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.invalidate();
            return child;
        };
        D5HBox.prototype.addChild = function (child) {
            _super.prototype.addChild.call(this, child);
            child.addEventListener(egret.Event.RESIZE, this.onResize, this);
            if (this.autoFly)
                this.invalidate();
            return child;
        };
        /**
         * Override of removeChild to force layout;
         */
        D5HBox.prototype.removeChild = function (child) {
            _super.prototype.removeChild.call(this, child);
            child.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            if (this.autoFly)
                this.invalidate();
            return child;
        };
        /**
         * Override of removeChild to force layout;
         */
        D5HBox.prototype.removeChildAt = function (index) {
            if (index === void 0) { index = 0; }
            var child = _super.prototype.removeChildAt.call(this, index);
            child.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            if (this.autoFly)
                this.invalidate();
            return child;
        };
        D5HBox.prototype.onResize = function (event) {
            if (this.autoFly)
                this.invalidate();
        };
        /**
         * Draws the visual ui of the component, in this case, laying out the sub components.
         */
        D5HBox.prototype.draw = function () {
            this._w = 0;
            this._h = 0;
            var xpos = 0;
            for (var i = 0; i < this.numChildren; i++) {
                var child = this.getChildAt(i);
                child.x = xpos;
                xpos += child.width;
                xpos += this._padding;
                this._w += child.width;
                this._h = Math.max(this._h, child.height);
            }
            this._w += this._padding * (this.numChildren - 1);
            this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
        };
        /**
         * Gets / sets the spacing between each sub component.
         */
        D5HBox.prototype.setPadding = function (s) {
            this._padding = s;
            this.invalidate();
        };
        Object.defineProperty(D5HBox.prototype, "padding", {
            get: function () {
                return this._padding;
            },
            enumerable: true,
            configurable: true
        });
        return D5HBox;
    }(d5power.D5Component));
    d5power.D5HBox = D5HBox;
    __reflect(D5HBox.prototype, "d5power.D5HBox");
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
var d5power;
(function (d5power) {
    var D5List = (function (_super) {
        __extends(D5List, _super);
        function D5List() {
            var _this = _super.call(this) || this;
            _this._blockW = 0;
            _this._blockH = 0;
            _this._textColor = 0;
            _this._hoverColor = 0;
            _this._fontSize = 0;
            _this.setupListener();
            return _this;
        }
        Object.defineProperty(D5List.prototype, "className", {
            get: function () {
                return 'D5List';
            },
            enumerable: true,
            configurable: true
        });
        D5List.prototype.drawBackground = function (background, alpha, line) {
            if (alpha === void 0) { alpha = 1; }
            if (line === void 0) { line = 0; }
            this.graphics.beginFill(background, alpha);
            this.graphics.lineStyle(1, line);
            this.graphics.drawRect(0, 0, this._blockW, this.height);
            this.graphics.endFill();
        };
        /**
         * 设置列表样式
         *
         * @param	blockW		每个区块的宽度
         * @param	blockH		每个区块的高度
         * @param	textColor	字体颜色
         * @param	hoverColor	鼠标经过颜色
         * @param	hoverAlpha	鼠标经过透明度
         * @param	textSize	字体大小
         */
        D5List.prototype.setFormat = function (blockW, blockH, textColor, hoverColor, hoverAlpha, textSize) {
            if (hoverAlpha === void 0) { hoverAlpha = 1.0; }
            if (textSize === void 0) { textSize = 12; }
            this._blockW = blockW;
            this._blockH = blockH;
            this._textColor = textColor;
            this._hoverColor = hoverColor;
            this._hoverAlpha = hoverAlpha;
            this._fontSize = textSize;
            this.flushFormat();
        };
        D5List.prototype.setblockW = function (value) {
            if (value === void 0) { value = 0; }
            this._blockW = value;
            this.flushFormat();
        };
        D5List.prototype.dispose = function () {
            if (this.parent)
                this.parent.removeChild(this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdd, this);
        };
        D5List.prototype.addStuff = function (lable, data) {
            var lab;
            if (lable instanceof egret.DisplayObjectContainer) {
                lab = lable;
                lab.name = data.toString();
            }
            else {
                if (!(typeof (lable) == "string"))
                    lable = lable.toString();
                lab = new d5power.D5HoverText(lable, 0xffffff);
                if (this._blockW > 0) {
                    this.flushFormatDoing(lab);
                }
                else {
                    //(<D5HoverText><any> lab).autoGrow();
                    lab.setHover(this._hoverColor, this._hoverAlpha);
                    lab.autoGrow();
                }
                lab.setData(data);
            }
            this._list.push(lab);
            this._content.addChild(lab);
        };
        D5List.prototype.removeStuffByIndex = function (index) {
            if (index === void 0) { index = 0; }
            if (index >= this._list.length)
                return;
            var lab = this._list[index];
            if (this._content.contains(lab))
                this._content.removeChild(lab);
            this._list.splice(index, 1);
        };
        D5List.prototype.removeAllStuff = function () {
            while (this._list.length)
                this.removeStuffByIndex(0);
            this._selected = null;
        };
        Object.defineProperty(D5List.prototype, "height", {
            get: function () {
                var p = (this._content).padding;
                return this._list.length > 0 ? this._list.length * (this._list[0].height + p) - p + this._content.y * 2 : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5List.prototype, "value", {
            /**
             * 当前选择的值
             */
            get: function () {
                if (this._selected == null)
                    return null;
                if (this._selected instanceof d5power.D5HoverText) {
                    return (this._selected).data;
                }
                else {
                    return this._selected.name;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5List.prototype, "lable", {
            get: function () {
                if (this._selected == null)
                    return '';
                if (this._selected instanceof d5power.D5HoverText) {
                    return (this._selected).text;
                }
                else {
                    return this._selected.toString();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5List.prototype, "index", {
            get: function () {
                return this._list.indexOf(this._selected);
            },
            enumerable: true,
            configurable: true
        });
        D5List.prototype.setupListener = function () {
            this._list = [];
            this._content = new d5power.D5VBox();
            this._content.x = this._content.y = 4;
            this.addChild(this._content);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
            //			addEventListener(Event.ADDED_TO_STAGE,onAdd);
        };
        D5List.prototype.onMove = function (e) {
            var t = this.getUnderMouse(e.stageX, e.stageY);
            if (t == null)
                return;
            if (t instanceof d5power.D5HoverText) {
                if (!t.isHover && t != this._selected) {
                    if (this._selected && this._selected instanceof d5power.D5HoverText)
                        (this._selected).unhover();
                    t.hover();
                    this._selected = t;
                }
            }
            else {
            }
        };
        D5List.prototype.onClick = function (e) {
            var t = this.getUnderMouse(e.stageX, e.stageY);
            if (t) {
                this._selected = t;
                this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
            }
            if (d5power.D5HoverText.lastHover) {
                d5power.D5HoverText.lastHover.unhover();
                d5power.D5HoverText.lastHover = null;
            }
        };
        D5List.prototype.onAdd = function (e) {
            this._stage = this.stage;
        };
        D5List.prototype.onStageClick = function (e) {
            if (this.parent && this.stage) {
                if (e.target == this)
                    return;
                this.parent.removeChild(this);
                if (this.stage)
                    this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onStageClick, this);
            }
        };
        D5List.prototype.getUnderMouse = function (px, py) {
            if (py === void 0) { py = 0; }
            var length = this._list.length;
            for (var i = 0; i < length; i++) {
                var t = this._list[i];
                if (t.hitTestPoint(px, py)) {
                    return t;
                }
            }
            return null;
        };
        D5List.prototype.flushFormat = function () {
            var length = this._list.length;
            for (var i = 0; i < length; i++) {
                var t = this._list[i];
                this.flushFormatDoing(t);
            }
        };
        D5List.prototype.flushFormatDoing = function (t) {
            t.setSize(this._blockW - this._content.x * 2, this._blockH);
            t.setTextColor(this._textColor);
            t.setHover(this._hoverColor, this._hoverAlpha);
            t.setFontSize(this._fontSize);
        };
        return D5List;
    }(d5power.D5Component));
    d5power.D5List = D5List;
    __reflect(D5List.prototype, "d5power.D5List");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var D5Loop = (function (_super) {
        __extends(D5Loop, _super);
        function D5Loop(mode, cutsize1, cutsize2) {
            var _this = _super.call(this) || this;
            _this._workmode = mode;
            _this._cutsize1 = cutsize1;
            _this._cutsize2 = cutsize2;
            return _this;
        }
        D5Loop.prototype.buildPart = function () {
            if (this._partI == null)
                this._partI = new egret.Bitmap();
            if (this._partII == null) {
                this._partII = new egret.Bitmap();
                this._partII.fillMode = egret.BitmapFillMode.REPEAT;
            }
            if (this._partIII == null) {
                this._partIII = new egret.Bitmap();
            }
        };
        D5Loop.prototype.setSkin = function (name) {
            if (this._nowName == name)
                return;
            this._nowName = name;
            var data = d5power.D5UIResourceData.getData(name);
            if (data == null) {
                trace("[D5Loop]No Resource" + name);
                this.loadResource(name, this.onComplate, this);
            }
            else {
                this.buildPart();
                this._partI.texture = data.getResource(0);
                this._partII.texture = data.getResource(1);
                this._partIII.texture = data.getResource(2);
                this.invalidate();
            }
        };
        D5Loop.prototype.onComplate = function (data) {
            var sheet = new egret.SpriteSheet(data);
            if (this._workmode == 0) {
                sheet.createTexture('0', 0, 0, this._cutsize1, data.textureHeight);
                sheet.createTexture('1', this._cutsize1, 0, this._cutsize2 - this._cutsize1, data.textureHeight);
                sheet.createTexture('2', this._cutsize2, 0, data.textureWidth - this._cutsize1, data.textureHeight);
            }
            else {
                sheet.createTexture('0', 0, 0, data.textureWidth, this._cutsize1);
                sheet.createTexture('1', 0, this._cutsize1, data.textureWidth, this._cutsize2 - this._cutsize1);
                sheet.createTexture('2', 0, this._cutsize2, data.textureWidth, data.textureHeight - this._cutsize1);
            }
            this.buildPart();
            this._partI.texture = sheet.getTexture('0');
            this._partII.texture = sheet.getTexture('1');
            this._partIII.texture = sheet.getTexture('2');
            this.invalidate();
        };
        D5Loop.prototype.draw = function () {
            if (this._partI == null) {
                return;
            }
            else {
                if (!this.contains(this._partI)) {
                    this.addChildAt(this._partI, 0);
                    this.addChildAt(this._partII, 0);
                    this.addChildAt(this._partIII, 0);
                }
            }
            if (this._workmode == 0) {
                this._partII.x = this._partI.width;
                this._partII.width = this._w - this._partI.width - this._partIII.width;
                this._partIII.x = this._partII.x + this._partII.width;
            }
            else {
                this._partII.y = this._partI.height;
                this._partII.height = this._h - this._partI.height - this._partIII.height;
                this._partIII.y = this._partII.y + this._partII.height;
            }
            _super.prototype.draw.call(this);
        };
        return D5Loop;
    }(d5power.D5Component));
    d5power.D5Loop = D5Loop;
    __reflect(D5Loop.prototype, "d5power.D5Loop");
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
var d5power;
(function (d5power) {
    var D5MirrorLoop = (function (_super) {
        __extends(D5MirrorLoop, _super);
        function D5MirrorLoop() {
            var _this = _super.call(this) || this;
            _this._mode = 0;
            _this._cutSize = 0;
            return _this;
        }
        D5MirrorLoop.prototype.setRes = function (data) {
            this.onComplate(data);
        };
        D5MirrorLoop.prototype.onComplate = function (data) {
            var sheet = new egret.SpriteSheet(data);
            if (this._mode == 0) {
                sheet.createTexture('0', 0, 0, this._cutSize, data.textureHeight);
                sheet.createTexture('1', this._cutSize, 0, data.textureWidth - this._cutSize, data.textureHeight);
                if (this.front == null)
                    this.front = new egret.Bitmap();
                this.front.texture = sheet.getTexture('0');
                if (this.enter == null)
                    this.enter = new egret.Bitmap();
                this.enter.texture = sheet.getTexture('1');
                this.enter.fillMode = egret.BitmapFillMode.REPEAT;
                if (this.after == null)
                    this.after = new egret.Bitmap();
                this.after.texture = sheet.getTexture('0');
                this.after.scaleX = -1;
            }
            else {
                sheet.createTexture('0', 0, 0, data.textureWidth, this._cutSize);
                sheet.createTexture('1', 0, this._cutSize, data.textureWidth, data.textureHeight - this._cutSize);
                if (this.front == null)
                    this.front = new egret.Bitmap();
                this.front.texture = sheet.getTexture('0');
                if (this.enter == null)
                    this.enter = new egret.Bitmap();
                this.enter.texture = sheet.getTexture('1');
                this.enter.fillMode = egret.BitmapFillMode.REPEAT;
                if (this.after == null)
                    this.after = new egret.Bitmap();
                this.after.texture = sheet.getTexture('0');
                this.after.scaleY = -1;
            }
            this.invalidate();
        };
        D5MirrorLoop.prototype.setSkin = function (name) {
            if (this._nowName == name)
                return;
            this._nowName = name;
            var data = d5power.D5UIResourceData.getData(name);
            if (data == null) {
                trace("[D5MirrorLoop]No Resource" + name);
                this.loadResource(name, this.onComplate, this);
                return;
            }
            if (d5power.D5UIResourceData._typeLoop == 0) {
                this._mode = 0;
                if (this.front == null)
                    this.front = new egret.Bitmap();
                this.front.texture = data.getResource(0);
                if (this.enter == null)
                    this.enter = new egret.Bitmap();
                this.enter.texture = data.getResource(1);
                this.enter.fillMode = egret.BitmapFillMode.REPEAT;
                if (this.after == null)
                    this.after = new egret.Bitmap();
                this.after.texture = data.getResource(0);
                this.after.scaleX = -1;
            }
            else {
                this._mode = 1;
                if (this.front == null)
                    this.front = new egret.Bitmap();
                this.front.texture = data.getResource(0);
                if (this.enter == null)
                    this.enter = new egret.Bitmap();
                this.enter.texture = data.getResource(1);
                this.enter.fillMode = egret.BitmapFillMode.REPEAT;
                if (this.after == null)
                    this.after = new egret.Bitmap();
                this.after.texture = data.getResource(0);
                this.after.scaleY = -1;
            }
            this.invalidate();
        };
        D5MirrorLoop.prototype.draw = function () {
            if (this.front == null) {
                return;
            }
            else {
                if (!this.contains(this.front)) {
                    this.addChildAt(this.front, 0);
                    this.addChildAt(this.enter, 0);
                    this.addChildAt(this.after, 0);
                }
            }
            if (this._mode == 0) {
                this.enter.x = this.front.width;
                this.enter.width = this._w - this.front.width * 2;
                this.after.x = this._w;
            }
            else {
                this.enter.y = this.front.height;
                this.enter.height = this._h - this.front.height * 2;
                this.after.y = this._h;
            }
            this.autoCache();
            _super.prototype.draw.call(this);
        };
        D5MirrorLoop.prototype.clone = function () {
            var ui = new D5MirrorLoop();
            ui._mode = this._mode;
            ui._cutSize = this._cutSize;
            ui.setSkin(this._nowName);
            ui.setSize(this.width, this.height);
            return ui;
        };
        Object.defineProperty(D5MirrorLoop.prototype, "mBitmap", {
            get: function () {
                return this.enter;
            },
            enumerable: true,
            configurable: true
        });
        D5MirrorLoop.prototype.dispose = function () {
            if (this.front) {
                if (this.front.parent)
                    this.front.parent.removeChild(this.front);
                this.front.texture = null;
                this.front = null;
            }
            if (this.enter) {
                if (this.enter.parent)
                    this.enter.parent.removeChild(this.enter);
                this.enter.texture = null;
                this.enter = null;
            }
            if (this.after) {
                if (this.after.parent)
                    this.after.parent.removeChild(this.after);
                this.after.texture = null;
                this.after = null;
            }
        };
        return D5MirrorLoop;
    }(d5power.D5Component));
    d5power.D5MirrorLoop = D5MirrorLoop;
    __reflect(D5MirrorLoop.prototype, "d5power.D5MirrorLoop");
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
var d5power;
(function (d5power) {
    var D5RadioBtn = (function (_super) {
        __extends(D5RadioBtn, _super);
        function D5RadioBtn() {
            var _this = _super.call(this) || this;
            _this._selected = false;
            return _this;
        }
        D5RadioBtn.disposeLib = function (group, target) {
            if (target === void 0) { target = null; }
            var radio;
            for (var i = D5RadioBtn._radioLib.length - 1; i >= 0; i--) {
                radio = D5RadioBtn._radioLib[i];
                if (target == null || (target === radio) && radio._groupName == group) {
                    this._radioLib.splice(i, 1);
                }
            }
        };
        Object.defineProperty(D5RadioBtn.prototype, "groupName", {
            set: function (v) {
                this._groupName = v;
                if (v != null && v != '' && D5RadioBtn._radioLib.indexOf(this) == -1) {
                    D5RadioBtn._radioLib.push(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        D5RadioBtn.prototype.setLable = function (lab) {
            if (this._lable == null) {
                this._lable = new d5power.D5Text();
                this._lable.setFontSize(d5power.D5Style.default_btn_lable_size);
                this._lable.setFontBold(d5power.D5Style.default_btn_lable_bold);
                if (d5power.D5Style.default_btn_lable_border != -1)
                    this._lable.setFontBorder(d5power.D5Style.default_btn_lable_border);
                this.addChild(this._lable);
            }
            this._lable.setText(lab);
        };
        D5RadioBtn.prototype.autoLableSize = function () {
            if (this._lable == null || this.a == null)
                return;
            trace(this.a.height, this._lable.height, "左左右右");
            //            this._lable.autoGrow();
            this._lable.x = this.a.width;
            this._lable.y = (this.a.height - this._lable.height) >> 1;
        };
        D5RadioBtn.prototype.setSelected = function (value) {
            if (this._groupName) {
                var list = D5RadioBtn._radioLib;
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i] != this && list[i]._groupName == this._groupName) {
                        list[i]._selected = false;
                        list[i].updateFace();
                    }
                }
            }
            this._selected = value;
            this.updateFace();
        };
        Object.defineProperty(D5RadioBtn.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (v) {
                this.setSelected(v);
            },
            enumerable: true,
            configurable: true
        });
        D5RadioBtn.prototype.updateFace = function () {
            if (this._selected) {
                this.a.texture = this.data.getResource(2);
                this.invalidate();
            }
            else {
                this.a.texture = this.data.getResource(0);
                this.invalidate();
            }
        };
        D5RadioBtn.prototype.enabled = function (b) {
            if (b) {
                this.a.texture = this.data.getResource(0);
            }
            else {
                this.a.texture = this.data.getResource(3);
            }
            this.invalidate();
        };
        D5RadioBtn.prototype.setSkin = function (name) {
            if (this._nowName == name)
                return;
            this._nowName = name;
            this.data = d5power.D5UIResourceData.getData(name);
            if (this.data == null) {
                trace("[D5RadioBtn]No Resource" + name);
                return;
            }
            this.a = new egret.Bitmap();
            this.a.texture = this.data.getResource(0);
            this.touchEnabled = true;
            this.enabled(true);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.btnDown, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.btnUp, this);
            this.invalidate();
        };
        D5RadioBtn.prototype.btnDown = function (evt) {
            this.a.texture = this.data.getResource(2);
            this.invalidate();
        };
        D5RadioBtn.prototype.btnUp = function (evt) {
            this.setSelected(!this._selected);
        };
        D5RadioBtn.prototype.draw = function () {
            if (this.a == null) {
            }
            else {
                if (!this.contains(this.a)) {
                    this.addChildAt(this.a, 0);
                }
            }
            _super.prototype.draw.call(this);
            if (this._lable != null) {
                this.addChild(this._lable);
                this.autoLableSize();
            }
        };
        D5RadioBtn.prototype.dispose = function () {
            if (this.a) {
                if (this.a.parent)
                    this.a.parent.removeChild(this.a);
                this.a.texture = null;
                this.a = null;
            }
            if (this._lable) {
                if (this._lable.parent)
                    this._lable.parent.removeChild(this._lable);
                this._lable = null;
            }
            this.data = null;
            if (this._groupName != null) {
                D5RadioBtn.disposeLib(this._groupName);
            }
        };
        D5RadioBtn._radioLib = [];
        return D5RadioBtn;
    }(d5power.D5Component));
    d5power.D5RadioBtn = D5RadioBtn;
    __reflect(D5RadioBtn.prototype, "d5power.D5RadioBtn");
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
 * Created by Administrator on 2015/8/28.
 */
var d5power;
(function (d5power) {
    /**
     *
     * @author
     *
     */
    var D5Shape = (function (_super) {
        __extends(D5Shape, _super);
        function D5Shape() {
            var _this = _super.call(this) || this;
            _this._workMode = 0;
            _this._tickNess = 0;
            _this._offX = 0;
            _this._offY = 0;
            _this._radius = 0;
            _this.drawAlpha = 1;
            _this._shape = new egret.Shape();
            _this.addChild(_this._shape);
            return _this;
        }
        Object.defineProperty(D5Shape.prototype, "pointString", {
            set: function (value) {
                this._points = value.split(',');
                this.invalidate();
            },
            enumerable: true,
            configurable: true
        });
        D5Shape.prototype.draw = function () {
            if (this._shape)
                this._shape.graphics.clear();
            switch (this._workMode) {
                case D5Shape.RECT:
                    this._shape.graphics.beginFill(this._fillColor, this.drawAlpha);
                    if (this._tickNess > 0) {
                        this._shape.graphics.lineStyle(this._tickNess, this._color, this.drawAlpha);
                    }
                    this._shape.graphics.drawRect(this._offX, this._offY, this._w, this._h);
                    this._shape.graphics.endFill();
                    break;
                case D5Shape.CIRCLE:
                    this._shape.graphics.beginFill(this._fillColor, this.drawAlpha);
                    if (this._tickNess > 0) {
                        this._shape.graphics.lineStyle(this._tickNess, this._color, this.drawAlpha);
                    }
                    this._shape.graphics.drawCircle(this._offX, this._offY, this._radius);
                    this._shape.graphics.endFill();
                    break;
                case D5Shape.CUSTOM:
                    this._shape.graphics.beginFill(this._fillColor, this.drawAlpha);
                    if (this._tickNess > 0) {
                        this._shape.graphics.lineStyle(this._tickNess, this._color);
                    }
                    var temp;
                    var tempX;
                    var tempY;
                    for (var i = 0; i < this._points.length; i++) {
                        temp = this._points[i].split('_');
                        tempX = parseInt(temp[0]);
                        tempY = parseInt(temp[1]);
                        if (i == 0) {
                            this._shape.graphics.moveTo(tempX, tempY);
                        }
                        else {
                            this._shape.graphics.lineTo(tempX, tempY);
                        }
                    }
                    this._shape.graphics.endFill();
                    break;
            }
            _super.prototype.draw.call(this);
        };
        Object.defineProperty(D5Shape.prototype, "fillColor", {
            /**
             *填充颜色
             */
            get: function () {
                return this._fillColor;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        D5Shape.prototype.setFillColor = function (value) {
            if (this._fillColor == value)
                return;
            this._fillColor = value;
            this.invalidate();
        };
        Object.defineProperty(D5Shape.prototype, "tickNess", {
            /**
             * 线条粗细，0为不显示线条
             */
            get: function () {
                return this._tickNess;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        D5Shape.prototype.setTickNess = function (value) {
            if (this._tickNess == value)
                return;
            this._tickNess = value;
            this.invalidate();
        };
        Object.defineProperty(D5Shape.prototype, "color", {
            /**
             * 线条颜色
             */
            get: function () {
                return this._color;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        D5Shape.prototype.setColor = function (value) {
            if (this._color == value)
                return;
            this._color = value;
            this.invalidate();
        };
        Object.defineProperty(D5Shape.prototype, "offX", {
            /**
             * 偏移坐标x,y
             */
            get: function () {
                return this._offX;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        D5Shape.prototype.setOffX = function (value) {
            if (this._offX == value)
                return;
            this._offX = value;
            this.invalidate();
        };
        Object.defineProperty(D5Shape.prototype, "offY", {
            /**
             * 偏移坐标x,y
             */
            get: function () {
                return this._offY;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        D5Shape.prototype.setOffY = function (value) {
            if (this._offY == value)
                return;
            this._offY = value;
            this.invalidate();
        };
        Object.defineProperty(D5Shape.prototype, "drawWidth", {
            get: function () {
                return this._w;
            },
            enumerable: true,
            configurable: true
        });
        D5Shape.prototype.clone = function () {
            var obj = new D5Shape();
            obj._workMode = this._workMode;
            obj._fillColor = this._fillColor;
            obj._tickNess = this._tickNess;
            obj._color = this._color;
            obj._offX = this._offX;
            obj._offY = this._offY;
            obj._radius = this._radius;
            obj.setSize(this._w, this._h);
            obj.drawAlpha = this.drawAlpha;
            obj.invalidate();
            return obj;
        };
        D5Shape.prototype.setDrawWidth = function (value) {
            if (this._w == value)
                return;
            this._w = value;
            this.invalidate();
        };
        Object.defineProperty(D5Shape.prototype, "drawHeight", {
            get: function () {
                return this._h;
            },
            enumerable: true,
            configurable: true
        });
        D5Shape.prototype.setDrawHeight = function (value) {
            if (this._h == value)
                return;
            this._h = value;
            this.invalidate();
        };
        D5Shape.prototype.setSize = function (w, h) {
            if (this._w == w && this._h == h)
                return;
            this._w = w;
            this._h = h;
            this.invalidate();
        };
        Object.defineProperty(D5Shape.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            enumerable: true,
            configurable: true
        });
        D5Shape.prototype.setRadius = function (value) {
            if (this._radius == value)
                return;
            this._radius = value;
            this.invalidate();
        };
        Object.defineProperty(D5Shape.prototype, "workMode", {
            get: function () {
                return this._workMode;
            },
            enumerable: true,
            configurable: true
        });
        D5Shape.prototype.setWorkMode = function (value) {
            if (this._workMode == value)
                return;
            this._workMode = value;
            this.invalidate();
        };
        D5Shape.prototype.dispose = function () {
            if (this._shape) {
                if (this._shape.parent)
                    this._shape.parent.removeChild(this._shape);
                this._shape = null;
            }
        };
        /**
         * 工作模式矩形
         */
        D5Shape.RECT = 0;
        /**
         * 工作模式圆
         */
        D5Shape.CIRCLE = 1;
        /**
         * 自定义填充
         */
        D5Shape.CUSTOM = 2;
        return D5Shape;
    }(d5power.D5Component));
    d5power.D5Shape = D5Shape;
    __reflect(D5Shape.prototype, "d5power.D5Shape");
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
var d5power;
(function (d5power) {
    var D5SliderButton = (function (_super) {
        __extends(D5SliderButton, _super);
        function D5SliderButton() {
            var _this = _super.call(this) || this;
            _this._arrCell = [];
            _this._dataArr = [];
            return _this;
        }
        D5SliderButton.prototype.setDataName = function (arr) {
            this._dataArr = arr;
        };
        Object.defineProperty(D5SliderButton.prototype, "dataName", {
            get: function () {
                return this._dataArr;
            },
            enumerable: true,
            configurable: true
        });
        D5SliderButton.prototype.setSkin = function (name) {
            if (this._nowName == name)
                return;
            this._nowName = name;
            this.data = d5power.D5UIResourceData.getData(name);
            if (this.data == null) {
                trace("No Resource");
                return;
            }
            this.front = new egret.Bitmap();
            this.front.texture = this.data.getResource(0);
            this.enter = new egret.Bitmap();
            this.enter.texture = this.data.getResource(1);
            this.enter.fillMode = egret.BitmapFillMode.REPEAT;
            this.after = new egret.Bitmap();
            this.after.texture = this.data.getResource(0);
            this.after.scaleX = -1;
            this.button = new egret.Bitmap();
            this.button.texture = this.data.getResource(2);
            this.touchEnabled = this.button.touchEnabled = true;
            this.button.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.btnDown, this);
            this.button.addEventListener(egret.TouchEvent.TOUCH_END, this.btnUp, this);
            this.invalidate();
        };
        D5SliderButton.prototype.setTable = function (info) {
            if (this.text == null) {
                this.text = new d5power.D5Text();
                this.text.setWidth(this._w - this.button.width);
                this.text.setTextColor(0xff0000);
                this.text.setText(info);
            }
            else {
                this.text.setTextColor(0xff0000);
                this.text.setText(info);
            }
        };
        D5SliderButton.prototype.btnDown = function (evt) {
            this.button.texture = this.data.getResource(4);
            this.invalidate();
            if (this.box == null) {
                this.box = new d5power.D5MirrorBox();
                this.box.setSkin('box0');
                this.box.x = 0;
                this.box.y = this.button.height;
                this.box.setSize(this._w, 100);
                this.addChild(this.box);
                this.vBox = new d5power.D5VBox();
                this.vBox.x = 5;
                this.vBox.y = 10;
            }
            else {
                this.box.visible = !this.box.visible;
            }
            if (this.box.visible) {
                this.showList(this._dataArr);
            }
        };
        D5SliderButton.prototype.showList = function (arr) {
            this.cleanCell();
            for (var i = 0; i < arr.length; i++) {
                this.cell = new d5power.ListCell();
                this.cell.showCell(this._w, arr[i]);
                this._arrCell.push(this.cell);
                this.vBox.addChild(this.cell);
                this.cell.setBtnID(i);
                this.cell.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.changeName, this);
            }
            this.box.setSize(this._w, this._dataArr.length * 25);
        };
        D5SliderButton.prototype.changeName = function (evt) {
            this.box.visible = !this.box.visible;
            var id = evt.currentTarget.btnID;
            this.setTable(this._dataArr[id]);
        };
        D5SliderButton.prototype.cleanCell = function () {
            if (this._arrCell == null || this._arrCell.length == 0)
                return;
            for (var j = 0; j < this._arrCell.length; j++) {
                var obj = this._arrCell[j];
                obj.dispose();
                if (obj.parent)
                    obj.parent.removeChild(obj);
                obj = null;
            }
            this._arrCell.splice(0, this._arrCell.length);
        };
        D5SliderButton.prototype.btnUp = function (evt) {
            this.button.texture = this.data.getResource(2);
            this.invalidate();
        };
        D5SliderButton.prototype.draw = function () {
            if (this.front == null) {
            }
            else {
                if (!this.contains(this.front)) {
                    this.addChild(this.front);
                    this.addChild(this.enter);
                    this.addChild(this.after);
                    this.addChild(this.button);
                }
            }
            this.enter.x = this.front.width;
            this.enter.width = this._w - this.front.width * 2;
            this.after.x = this._w - this.front.width;
            this.button.x = this._w - this.button.width;
            _super.prototype.draw.call(this);
            this.addChild(this.text);
            this.box.addChild(this.vBox);
        };
        return D5SliderButton;
    }(d5power.D5Component));
    d5power.D5SliderButton = D5SliderButton;
    __reflect(D5SliderButton.prototype, "d5power.D5SliderButton");
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
var d5power;
(function (d5power) {
    var D5Style = (function () {
        function D5Style() {
        }
        /**
         * 默认Lable颜色
         */
        D5Style.default_lable_color = 0xffffff;
        /**
         * 默认按钮文字描边颜色
         */
        D5Style.default_btn_lable_border = -1;
        /**
         * 默认按钮文字大小
         */
        D5Style.default_btn_lable_size = 18;
        /**
         * 默认按钮文字是否加粗
         */
        D5Style.default_btn_lable_bold = false;
        /**
         * UI控件是否自动释放
         */
        D5Style.autoRelease = false;
        return D5Style;
    }());
    d5power.D5Style = D5Style;
    __reflect(D5Style.prototype, "d5power.D5Style");
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
var d5power;
(function (d5power) {
    var D5Swf = (function (_super) {
        __extends(D5Swf, _super);
        function D5Swf() {
            var _this = _super.call(this) || this;
            _this._loadID = 0;
            _this._playFrame = 0;
            _this._monitor = new egret.Bitmap();
            _this._zoom = 1;
            return _this;
        }
        D5Swf.prototype.setSrc = function (src) {
            this._src = src;
            this.addParticle();
        };
        Object.defineProperty(D5Swf.prototype, "loadID", {
            get: function () {
                return this._loadID;
            },
            enumerable: true,
            configurable: true
        });
        D5Swf.prototype.setEditorMode = function () {
            if (!this._drager) {
                this._drager = new egret.Shape();
                this._drager.graphics.beginFill(Math.random() * 0xffffff, .5);
                this._drager.graphics.drawRect(-20, -20, 40, 40);
                this._drager.graphics.endFill();
            }
            this.addChild(this._drager);
        };
        D5Swf.prototype.addParticle = function () {
            this._loadID++;
            d5power.D5SpriteSheet.getInstance(this._src + '.png', this);
            //RES.getResByUrl(this._src+'.png', this.onTextureComplete, this);
        };
        D5Swf.prototype.onSpriteSheepReady = function (data) {
            if (this._spriteSheet)
                this._spriteSheet.unlink();
            this._spriteSheet = data;
            if (!this.contains(this._monitor))
                this.addChild(this._monitor);
            this.onLoadComplate();
            this.addEventListener(egret.Event.ENTER_FRAME, this.runAction, this);
        };
        D5Swf.prototype.runAction = function (e) {
            if (egret.getTimer() - this._lastRender < this._spriteSheet.renderTime)
                return;
            this._lastRender = egret.getTimer();
            var direction = 0;
            this._monitor.texture = this._spriteSheet.getTexture(direction, this._playFrame);
            if (this._spriteSheet.uvList) {
                this._monitor.x = this._spriteSheet.uvList[direction * this._spriteSheet.totalFrame + this._playFrame].offX;
                this._monitor.y = this._spriteSheet.uvList[direction * this._spriteSheet.totalFrame + this._playFrame].offY;
            }
            else {
                this._monitor.x = this._spriteSheet.gX;
                this._monitor.y = this._spriteSheet.gY;
            }
            this._playFrame++;
            if (this._playFrame >= this._spriteSheet.totalFrame)
                this._playFrame = 0;
        };
        D5Swf.prototype.setZoom = function (value) {
            if (this._zoom == value)
                return;
            this._zoom = value;
            this.invalidate();
        };
        D5Swf.prototype.onLoadComplate = function () {
            //if(this._w==0){
            //	this._w = data.width;
            //	this._h = data.height;
            //}
            if (this._drager)
                this.addChild(this._drager);
            this.invalidate();
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        };
        D5Swf.prototype.draw = function () {
            if (this._zoom != 1)
                this.scaleX = this.scaleY = this._zoom;
            this.dispatchEvent(new egret.Event(egret.Event.CHANGE));
        };
        D5Swf.prototype.dispose = function () {
            if (this._monitor) {
                if (this._monitor.parent)
                    this._monitor.parent.removeChild(this._monitor);
                this._monitor.texture = null;
                this._monitor = null;
            }
            this._spriteSheet = null;
        };
        return D5Swf;
    }(d5power.D5Component));
    d5power.D5Swf = D5Swf;
    __reflect(D5Swf.prototype, "d5power.D5Swf", ["d5power.ISpriteSheetWaiter"]);
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
var d5power;
(function (d5power) {
    var D5Bitmap = (function (_super) {
        __extends(D5Bitmap, _super);
        function D5Bitmap() {
            return _super.call(this) || this;
        }
        D5Bitmap.prototype.setSkin = function (name) {
            if (this._nowName == name)
                return;
            this._nowName = name;
            var data = d5power.D5UIResourceData.getData(name);
            if (data == null) {
                trace("[D5Bitmap]No Resource" + name);
                var texture = RES.getRes(name);
                if (texture) {
                    this.bit = new egret.Bitmap();
                    this.bit.texture = texture;
                    this.invalidate();
                }
                else {
                    this.setSrc(name);
                }
                return;
            }
            if (this.bit == null) {
                this.bit = new egret.Bitmap();
            }
            this.bit.texture = data.getResource(0);
            this.setSize(this.bit.$getWidth(), this.bit.$getHeight());
            this.invalidate();
        };
        D5Bitmap.prototype.setComplete = function (fun, thisObj) {
            this._onComplate = fun;
            this._onComplateObj = thisObj;
        };
        D5Bitmap.prototype.setSrc = function (url) {
            this._url = url;
            if (url == null) {
                this.bit.texture = null;
                return;
            }
            this.loadResource(this._url, this.onComplate, this);
        };
        D5Bitmap.prototype.clone = function () {
            var b = new D5Bitmap();
            b.setSize(this._w, this._h);
            b.setSkin(this._nowName);
            return b;
        };
        D5Bitmap.prototype.setRes = function (data) {
            this.onComplate(data);
        };
        D5Bitmap.prototype.onComplate = function (data) {
            if (this.bit == null)
                this.bit = new egret.Bitmap();
            this.addChild(this.bit);
            if (data == null) {
                trace(this.name, 'resource hot found ==============');
                data = D5Bitmap._defaultTexture;
            }
            this.bit.texture = data;
            this.setSize(this.bit.$getWidth(), this.bit.$getHeight());
            //this.invalidate();
            if (this._onComplate != null) {
                try {
                    this._onComplate.apply(this._onComplateObj);
                    this._onComplate = null;
                }
                catch (e) {
                    trace(e);
                }
                this._onComplate = null;
                this._onComplateObj = null;
            }
        };
        D5Bitmap.prototype.draw = function () {
            if (this.bit == null) {
            }
            else {
                if (!this.contains(this.bit)) {
                    this.addChildAt(this.bit, 0);
                }
            }
            _super.prototype.draw.call(this);
        };
        D5Bitmap.prototype.dispose = function () {
            if (this.bit) {
                if (this.bit.parent)
                    this.bit.parent.removeChild(this.bit);
                this.bit.texture = null;
                this.bit = null;
            }
        };
        /**
         * 默认贴图
         */
        D5Bitmap._defaultTexture = new egret.Texture();
        return D5Bitmap;
    }(d5power.D5Component));
    d5power.D5Bitmap = D5Bitmap;
    __reflect(D5Bitmap.prototype, "d5power.D5Bitmap");
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
var d5power;
(function (d5power) {
    var D5HoverText = (function (_super) {
        __extends(D5HoverText, _super);
        function D5HoverText(_text, fontcolor, bgcolor, border, size) {
            if (_text === void 0) { _text = ''; }
            if (fontcolor === void 0) { fontcolor = -1; }
            if (bgcolor === void 0) { bgcolor = -1; }
            if (border === void 0) { border = -1; }
            if (size === void 0) { size = 12; }
            var _this = _super.call(this, _text, fontcolor, bgcolor, border, size) || this;
            /**
             * 鼠标经过颜色
             */
            _this._hoverColor = 0;
            _this.touchChildren = true;
            _this.touchEnabled = true;
            return _this;
        }
        Object.defineProperty(D5HoverText.prototype, "className", {
            get: function () {
                return 'D5HoverText';
            },
            enumerable: true,
            configurable: true
        });
        D5HoverText.prototype.init = function (e) {
            if (e === void 0) { e = null; }
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouse, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onMouse, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        };
        D5HoverText.prototype.onRemove = function (e) {
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouse, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onMouse, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        };
        /**
         * 设置状态
         */
        D5HoverText.prototype.setHover = function (colorV, alphaV) {
            this._hover = true;
            this._hoverColor = colorV;
            this._hoverAlpha = alphaV;
            this.unhover();
            if (!this.hasEventListener(egret.TouchEvent.TOUCH_BEGIN)) {
                this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouse, this);
                this.addEventListener(egret.TouchEvent.TOUCH_END, this.onMouse, this);
                this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
            }
        };
        D5HoverText.prototype.hover = function () {
            if (!this._hover)
                return;
            D5HoverText.lastHover = this;
            this.graphics.clear();
            this.graphics.beginFill(this._hoverColor, this._hoverAlpha);
            this.graphics.drawRect(0, 0, this._w, this._h);
            this.graphics.endFill();
            this._isHover = true;
        };
        D5HoverText.prototype.unhover = function () {
            if (!this._hover)
                return;
            this.graphics.clear();
            //			this.graphics.beginFill(this._hoverColor,0);
            //			this.graphics.drawRect(0,0,this._textField.width,this._textField.height);
            //			this.graphics.endFill();
            this._isHover = false;
        };
        Object.defineProperty(D5HoverText.prototype, "isHover", {
            get: function () {
                return this._isHover;
            },
            enumerable: true,
            configurable: true
        });
        D5HoverText.prototype.onMouse = function (e) {
            switch (e.type) {
                case egret.TouchEvent.TOUCH_BEGIN:
                    this.hover();
                    break;
                case egret.TouchEvent.TOUCH_END:
                    this.unhover();
                    break;
            }
        };
        D5HoverText.prototype.setData = function (data) {
            this._data = data;
        };
        Object.defineProperty(D5HoverText.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        return D5HoverText;
    }(d5power.D5Text));
    d5power.D5HoverText = D5HoverText;
    __reflect(D5HoverText.prototype, "d5power.D5HoverText");
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
 * Created by Administrator on 2015/9/1.
 */
var d5power;
(function (d5power) {
    var D5UILoader = (function (_super) {
        __extends(D5UILoader, _super);
        function D5UILoader() {
            var _this = _super.call(this) || this;
            _this._realWidth = 0;
            _this._realHeight = 0;
            _this._flyX = 0;
            _this._flyY = 0;
            return _this;
        }
        D5UILoader.prototype.addBinder = function (obj) {
            if (this._bindingList == null)
                this._bindingList = new Array();
            this._bindingList.push(obj);
        };
        D5UILoader.prototype.setup = function (url) {
            this.removeChildren();
            RES.getResByUrl(this._uiSrc, this.LoadComplete, this);
        };
        D5UILoader.prototype.LoadComplete = function (data) {
            if (data) {
                d5power.D5Component.getComponentByURL(data, this);
            }
            if (this.stage) {
                this.flyPos();
            }
            else {
                this.addEventListener(egret.Event.ADDED_TO_STAGE, this.flyPos, this);
            }
        };
        D5UILoader.prototype.dispose = function () {
            this.stage.removeEventListener(egret.Event.RESIZE, this.autoFly, this);
            if (this.parent)
                this.parent.removeChild(this);
        };
        D5UILoader.prototype.flyPos = function (e) {
            if (e === void 0) { e = null; }
            if (e != null)
                this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.flyPos, this);
            if (d5power.D5Component.proBindingSource && this._bindingList) {
                d5power.D5Component.proBindingSource.addDisplayer(this);
                this.stage.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.autoDispose, this);
                this.update();
            }
            if (this._flyX != 0 && this._flyY != 0)
                this.stage.addEventListener(egret.Event.RESIZE, this.autoFly, this);
            this.autoFly();
        };
        D5UILoader.prototype.autoFly = function (e) {
            if (e === void 0) { e = null; }
            this.x = this._flyX == 1 ? (this.stage.stageWidth - this._realWidth) : (this._flyX == .5 ? (this.stage.stageWidth - this._realWidth) >> 1 : (this.stage.stageWidth * this._flyX));
            this.y = this._flyY == 1 ? (this.stage.stageHeight - this._realHeight) : (this._flyY == .5 ? (this.stage.stageHeight - this._realHeight) >> 1 : (this.stage.stageHeight * this._flyY));
        };
        D5UILoader.prototype.autoDispose = function (e) {
            this.stage.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.autoDispose, this);
            trace("[D5UILoader] ", name, ' 自动释放');
            if (d5power.D5Component.proBindingSource && this._bindingList) {
                d5power.D5Component.proBindingSource.removeDisplayer(this);
                this._bindingList = null;
            }
            this.stage.removeEventListener(egret.Event.RESIZE, this.autoFly, this);
        };
        D5UILoader.prototype.update = function () {
            if (this._bindingList) {
                var ui;
                for (var i = 0; i < this._bindingList.length; i++) {
                    ui = this._bindingList[i];
                    ui.update();
                }
            }
        };
        Object.defineProperty(D5UILoader.prototype, "width", {
            get: function () {
                return this._realWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5UILoader.prototype, "height", {
            get: function () {
                return this._realHeight;
            },
            enumerable: true,
            configurable: true
        });
        return D5UILoader;
    }(egret.Sprite));
    d5power.D5UILoader = D5UILoader;
    __reflect(D5UILoader.prototype, "d5power.D5UILoader", ["d5power.IUserInfoDisplayer", "d5power.IProBindingContainer"]);
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
var d5power;
(function (d5power) {
    var D5VBox = (function (_super) {
        __extends(D5VBox, _super);
        function D5VBox() {
            var _this = _super.call(this) || this;
            _this._padding = 5;
            return _this;
        }
        D5VBox.prototype.setEditorMode = function () {
            if (this._editorBG != null)
                return;
            this._editorBG = new egret.Shape();
            this._editorBG.graphics.clear();
            this._editorBG.graphics.lineStyle(1, 0);
            this._editorBG.graphics.beginFill(0x00ff00, .5);
            this._editorBG.graphics.drawRect(0, 0, 60, 20);
            this._editorBG.graphics.endFill();
            this.addChild(this._editorBG);
        };
        D5VBox.prototype.parseToXML = function () {
            var result = "<D5VBox name='" + this.name + "' x='" + this.x + "' y='" + this.y + "'/>\n";
            return result;
        };
        /**
         * Override of addChild to force layout;
         */
        D5VBox.prototype.addChild = function (child) {
            _super.prototype.addChild.call(this, child);
            child.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.invalidate();
            return child;
        };
        /**
         * Override of removeChild to force layout;
         */
        D5VBox.prototype.removeChild = function (child) {
            _super.prototype.removeChild.call(this, child);
            child.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            this.invalidate();
            return child;
        };
        /**
         * Override of removeChild to force layout;
         */
        D5VBox.prototype.removeChildAt = function (index) {
            if (index === void 0) { index = 0; }
            var child = _super.prototype.removeChildAt.call(this, index);
            child.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            this.invalidate();
            return child;
        };
        /**
         * Internal handler for resize event of any attached component. Will redo the layout based on new size.
         */
        D5VBox.prototype.onResize = function (event) {
            this.invalidate();
        };
        /**
         * Draws the visual ui of the component, in this case, laying out the sub components.
         */
        D5VBox.prototype.draw = function () {
            //console.info("[draw D5VBox]");
            this._w = 0;
            this._h = 0;
            var ypos = 0;
            for (var i = 0; i < this.numChildren; i++) {
                var child = this.getChildAt(i);
                child.y = ypos;
                ypos += child.height;
                ypos += this._padding;
                this._h += child.height;
                this._w = Math.max(this._w, child.width);
                //console.info("[D5VBOX]"+child.x+"||"+child.y);
            }
            this._h += this._padding * (this.numChildren - 1);
            this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
        };
        Object.defineProperty(D5VBox.prototype, "padding", {
            get: function () {
                return this._padding;
            },
            /**
             * Gets / sets the spacing between each sub component.
             */
            set: function (s) {
                this._padding = s;
                this.invalidate();
            },
            enumerable: true,
            configurable: true
        });
        return D5VBox;
    }(d5power.D5Component));
    d5power.D5VBox = D5VBox;
    __reflect(D5VBox.prototype, "d5power.D5VBox");
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
var d5power;
(function (d5power) {
    var D5Window = (function (_super) {
        __extends(D5Window, _super);
        function D5Window() {
            var _this = _super.call(this) || this;
            _this.x1 = 0;
            _this.y1 = 0;
            _this.x2 = 0;
            _this.y2 = 0;
            return _this;
        }
        D5Window.prototype.setRes = function (data) {
            this.onComplate(data);
        };
        D5Window.prototype.onComplate = function (data) {
            var sheet = new egret.SpriteSheet(data);
            sheet.createTexture('0', 0, 0, this.x1, this.y1);
            sheet.createTexture('1', this.x1, 0, this.x2 - this.x1, this.y1);
            sheet.createTexture('2', this.x2, 0, data.textureWidth - this.x2, this.y1);
            sheet.createTexture('3', 0, this.y1, this.x1, this.y2 - this.y1);
            sheet.createTexture('4', this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
            sheet.createTexture('5', this.x2, this.y1, data.textureWidth - this.x2, this.y2 - this.y1);
            sheet.createTexture('6', 0, this.y2, this.x1, data.textureHeight - this.y2);
            sheet.createTexture('7', this.x1, this.y2, this.x2 - this.x1, data.textureHeight - this.y2);
            sheet.createTexture('8', this.x2, this.y2, data.textureWidth - this.x2, data.textureHeight - this.y2);
            this.lt = new egret.Bitmap();
            this.lt.texture = sheet.getTexture('0');
            this.t = new egret.Bitmap();
            this.t.texture = sheet.getTexture('1');
            this.t.fillMode = egret.BitmapFillMode.REPEAT;
            this.rt = new egret.Bitmap();
            this.rt.texture = sheet.getTexture('2');
            this.l = new egret.Bitmap();
            this.l.texture = sheet.getTexture('3');
            this.l.fillMode = egret.BitmapFillMode.REPEAT;
            this.m = new egret.Bitmap();
            this.m.texture = sheet.getTexture('4');
            this.m.fillMode = egret.BitmapFillMode.REPEAT;
            this.r = new egret.Bitmap();
            this.r.texture = sheet.getTexture('5');
            this.lb = new egret.Bitmap();
            this.lb.texture = sheet.getTexture('6');
            this.b = new egret.Bitmap();
            this.b.texture = sheet.getTexture('7');
            this.b.fillMode = egret.BitmapFillMode.REPEAT;
            this.rb = new egret.Bitmap();
            this.rb.texture = sheet.getTexture('8');
            this.invalidate();
        };
        D5Window.prototype.setSkin = function (name) {
            if (this._nowName == name)
                return;
            this._nowName = name;
            var data = d5power.D5UIResourceData.getData(name);
            if (data == null) {
                trace("[D5Window]No Resource" + name);
                this.loadResource(name, this.onComplate, this);
                return;
            }
            this.lt = new egret.Bitmap();
            this.lt.texture = data.getResource(0);
            this.t = new egret.Bitmap();
            this.t.texture = data.getResource(1);
            this.t.fillMode = egret.BitmapFillMode.REPEAT;
            this.rt = new egret.Bitmap();
            this.rt.texture = data.getResource(2);
            this.l = new egret.Bitmap();
            this.l.texture = data.getResource(3);
            this.l.fillMode = egret.BitmapFillMode.REPEAT;
            this.m = new egret.Bitmap();
            this.m.texture = data.getResource(4);
            this.m.fillMode = egret.BitmapFillMode.REPEAT;
            this.r = new egret.Bitmap();
            this.r.texture = data.getResource(5);
            this.lb = new egret.Bitmap();
            this.lb.texture = data.getResource(6);
            this.b = new egret.Bitmap();
            this.b.texture = data.getResource(7);
            this.b.fillMode = egret.BitmapFillMode.REPEAT;
            this.rb = new egret.Bitmap();
            this.rb.texture = data.getResource(8);
            //trace(list[0].textureWidth.toString(),list[0].textureHeight.toString());
            this.invalidate();
        };
        D5Window.prototype.draw = function () {
            if (this.l == null) {
                return;
            }
            else {
                if (!this.contains(this.l)) {
                    this.addChildAt(this.lt, 0);
                    this.addChildAt(this.t, 0);
                    this.addChildAt(this.rt, 0);
                    this.addChildAt(this.l, 0);
                    this.addChildAt(this.m, 0);
                    this.addChildAt(this.r, 0);
                    this.addChildAt(this.lb, 0);
                    this.addChildAt(this.b, 0);
                    this.addChildAt(this.rb, 0);
                }
                this.m.width = this.t.width = this.b.width = this._w - this.lt.width - this.rt.width;
                this.m.height = this.l.height = this.r.height = this._h - this.lt.height - this.lb.height;
                this.t.x = this.m.x = this.b.x = this.lt.width;
                this.rt.x = this.r.x = this.rb.x = this.lt.width + this.t.width;
                this.l.y = this.m.y = this.r.y = this.lt.height;
                this.lb.y = this.b.y = this.rb.y = this.lt.height + this.l.height;
            }
            _super.prototype.draw.call(this);
            this.autoCache();
        };
        D5Window.prototype.dispose = function () {
            if (this.lt) {
                if (this.lt.parent)
                    this.lt.parent.removeChild(this.lt);
                this.lt.texture = null;
                this.lt = null;
            }
            if (this.t) {
                if (this.t.parent)
                    this.t.parent.removeChild(this.t);
                this.t.texture = null;
                this.t = null;
            }
            if (this.rt) {
                if (this.rt.parent)
                    this.rt.parent.removeChild(this.rt);
                this.rt.texture = null;
                this.rt = null;
            }
            if (this.l) {
                if (this.l.parent)
                    this.l.parent.removeChild(this.l);
                this.l.texture = null;
                this.l = null;
            }
            if (this.m) {
                if (this.m.parent)
                    this.m.parent.removeChild(this.m);
                this.m.texture = null;
                this.m = null;
            }
            if (this.r) {
                if (this.r.parent)
                    this.r.parent.removeChild(this.r);
                this.r.texture = null;
                this.r = null;
            }
            if (this.lb) {
                if (this.lb.parent)
                    this.lb.parent.removeChild(this.lb);
                this.lb.texture = null;
                this.lb = null;
            }
            if (this.b) {
                if (this.b.parent)
                    this.b.parent.removeChild(this.b);
                this.b.texture = null;
                this.b = null;
            }
            if (this.rb) {
                if (this.rb.parent)
                    this.rb.parent.removeChild(this.rb);
                this.rb.texture = null;
                this.rb = null;
            }
        };
        return D5Window;
    }(d5power.D5Component));
    d5power.D5Window = D5Window;
    __reflect(D5Window.prototype, "d5power.D5Window");
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
var d5power;
(function (d5power) {
    var ListCell = (function (_super) {
        __extends(ListCell, _super);
        function ListCell() {
            return _super.call(this) || this;
        }
        ListCell.prototype.setBtnID = function (id) {
            this._id = id;
        };
        Object.defineProperty(ListCell.prototype, "btnID", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        ListCell.prototype.showCell = function (w, msg) {
            this.touchEnabled = true;
            this.loop = new d5power.D5MirrorLoop();
            this.loop.setSkin('loop0');
            this.loop.setSize(w, 0);
            this.addChild(this.loop);
            this.text = new d5power.D5Text();
            this.text.setWidth(w);
            this.text.setFontSize(5);
            this.text.setTextColor(0xff0000);
            this.text.setText(msg);
            this.addChild(this.text);
        };
        ListCell.prototype.dispose = function () {
            if (this.text.parent)
                this.text.parent.removeChild(this.text);
            this.text = null;
            if (this.loop.parent)
                this.loop.parent.removeChild(this.loop);
            this.loop = null;
        };
        return ListCell;
    }(egret.Sprite));
    d5power.ListCell = ListCell;
    __reflect(ListCell.prototype, "d5power.ListCell");
})(d5power || (d5power = {}));
