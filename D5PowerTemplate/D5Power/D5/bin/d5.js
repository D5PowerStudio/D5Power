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
var d5power;
(function (d5power) {
    var NodeBase = (function () {
        function NodeBase(manager) {
            this._manager = manager;
            this.runid = manager.runid;
        }
        NodeBase.prototype.check = function () {
            if (this.next != null && this.runid == this._manager.runid) {
                this.next.think();
                this.next.check();
            }
        };
        return NodeBase;
    }());
    d5power.NodeBase = NodeBase;
    __reflect(NodeBase.prototype, "d5power.NodeBase");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var GameObject = (function () {
        function GameObject(map) {
            this.speed = 3;
            this._pos = new egret.Point();
            this._map = map;
        }
        Object.defineProperty(GameObject.prototype, "posX", {
            get: function () {
                return this._pos.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "posY", {
            get: function () {
                return this._pos.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "$pos", {
            get: function () {
                return this._pos;
            },
            enumerable: true,
            configurable: true
        });
        GameObject.prototype.setPos = function (px, py) {
            px = Math.ceil(px);
            py = Math.ceil(py);
            this._pos.x = px;
            this._pos.y = py;
        };
        GameObject.prototype.render = function (t) {
        };
        GameObject.prototype.run = function (t) {
        };
        Object.defineProperty(GameObject.prototype, "monitor", {
            get: function () {
                return this._monitor;
            },
            enumerable: true,
            configurable: true
        });
        GameObject.prototype.updatePos = function (offX, offY) {
            if (offX === void 0) { offX = 0; }
            if (offY === void 0) { offY = 0; }
            var tx = this._pos.x;
            var ty = this._pos.y;
            if (this._map) {
                var wout = this._map.width > d5power.D5Game.screenWidth;
                var hout = this._map.height > d5power.D5Game.screenHeight;
                if (this.beFocus && wout && hout) {
                    // 地图比屏幕大，需要卷动
                    var tw = wout ? d5power.D5Game.screenWidth : this._map.width;
                    var th = hout ? d5power.D5Game.screenHeight : this._map.height;
                    tx = tx > this._map.width - (tw >> 1) ? tx - (this._map.width - tw) : tx;
                    ty = ty > this._map.height - (th >> 1) ? ty - (this._map.height - th) : ty;
                    tx = tx > (tw >> 1) && tx == this._pos.x ? (tw >> 1) : tx;
                    ty = ty > (th >> 1) && ty == this._pos.y ? (th >> 1) : ty;
                }
                else {
                    var target = this._map.getScreenPostion(tx, ty);
                    tx = target.x;
                    ty = target.y;
                }
            }
            if (this._monitor == null)
                return;
            this._monitor.x = tx + offX;
            this._monitor.y = ty + offY;
        };
        return GameObject;
    }());
    d5power.GameObject = GameObject;
    __reflect(GameObject.prototype, "d5power.GameObject", ["d5power.IGD"]);
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    /**
     * 单个任务数据
     */
    var MissionData = (function () {
        function MissionData(id) {
            /**
             * 是否完成
             */
            this.iscomplate = false;
            this.id = id;
            this.need = [];
            this.give = [];
        }
        MissionData.prototype.formatFromJSON = function (data) {
            this.type = data.type;
            this.name = data.name;
            this.info = data.info;
            this.npc_id = data.say;
            this.npc_id = data.npc;
            this.uncompDialog = data.uncomp;
            this.complate_script = data.complateScript;
            this.complate_script = this.complate_script == null || this.complate_script == 'null' ? '' : this.complate_script;
            var block;
            if (this.need == null) {
                this.need = [];
                this.give = [];
            }
            for (var k in data.need) {
                var obj = data.need[k];
                block = new d5power.ThreeBase();
                block.type = obj.type;
                block.key = obj.key;
                block.count = obj.count;
                this.need.push(block);
            }
            for (k in data.give) {
                obj = data.give[k];
                block = new d5power.ThreeBase();
                block.type = obj.type;
                block.key = obj.key;
                block.count = obj.count;
                this.give.push(block);
            }
        };
        Object.defineProperty(MissionData.prototype, "needstring", {
            get: function () {
                var needstr = '';
                for (var k in this.need) {
                    var need = this.need[k];
                    needstr += d5power.MissionNR.getChinese(need.type) + "()";
                }
                return needstr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MissionData.prototype, "isComplate", {
            /**
             * 任务是否完成
             */
            get: function () {
                return this.iscomplate;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 增加完成条件
         */
        MissionData.prototype.addNeed = function (need) {
            if (this.need.indexOf(need) == -1)
                this.need.push(need);
        };
        /**
         * 增加奖励内容
         */
        MissionData.prototype.addGive = function (give) {
            if (this.give.indexOf(give) == -1)
                this.give.push(give);
        };
        /**
         * 检查当前任务是否完成
         */
        MissionData.prototype.check = function (checker) {
            this.iscomplate = true;
            if (this.need != null) {
                for (var k in this.need) {
                    var need = this.need[k];
                    switch (need.type) {
                        case d5power.MissionNR.N_ITEM_NEED:
                        case d5power.MissionNR.N_ITEM_TACKED:
                            this.iscomplate = this.iscomplate && checker.hasItemNum(need.key) >= need.count;
                            break;
                        case d5power.MissionNR.N_MONEY:
                        case d5power.MissionNR.N_MONEY_KEEP:
                            this.iscomplate = this.iscomplate && checker.hasMoney(need.key);
                            break;
                        case d5power.MissionNR.N_MARK:
                            this.iscomplate = this.iscomplate && checker.hasMark(need.key);
                            break;
                        case d5power.MissionNR.N_MONSTER_KILLED:
                            this.iscomplate = this.iscomplate && checker.killMonseterNum(need.key) >= need.count;
                            break;
                        case d5power.MissionNR.N_PLAYER_PROP:
                            this.iscomplate = this.iscomplate && checker.userPro(need.key, need.count);
                            break;
                        case d5power.MissionNR.N_MISSION:
                            this.iscomplate = this.iscomplate && checker.hasMission(need.key);
                            break;
                        case d5power.MissionNR.N_TALK_NPC:
                            this.iscomplate = this.iscomplate && checker.hasTalkedWith(need.key);
                            break;
                        default:
                            if (checker.hasChecker(need.type))
                                this.iscomplate = this.iscomplate && checker.custormCheck(need);
                            break;
                    }
                }
            }
            return this.iscomplate;
        };
        /**
         * 完成任务
         */
        MissionData.prototype.complate = function (checker) {
            if (!this.check(checker))
                return false;
            checker.deleteMission(this);
            if (this.give != null) {
                for (var k in this.give) {
                    var give = this.give[k];
                    switch (give.type) {
                        case d5power.MissionNR.R_ITEM:
                            checker.getItem((give.key), give.count);
                            break;
                        case d5power.MissionNR.R_MONEY:
                            checker.getMoney(give.count);
                            break;
                        case d5power.MissionNR.R_EXP:
                            checker.getExp(give.count);
                            break;
                        case d5power.MissionNR.R_MISSION:
                            checker.addMission(give.key);
                            break;
                    }
                }
            }
            return true;
        };
        /**
         * 承接类任务 ！
         */
        MissionData.TYPE_GET = 0;
        /**
         * 交付类任务 ？
         */
        MissionData.TYPE_COMPLATE = 1;
        return MissionData;
    }());
    d5power.MissionData = MissionData;
    __reflect(MissionData.prototype, "d5power.MissionData");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var NodeAdd = (function (_super) {
        __extends(NodeAdd, _super);
        function NodeAdd(manager) {
            var _this = _super.call(this, manager) || this;
            _this.vars = [];
            _this._manager = manager;
            _this.type = d5power.NodeType.Add;
            return _this;
        }
        NodeAdd.prototype.addVar = function (data) {
            this.vars.push(data);
        };
        NodeAdd.prototype.think = function () {
            var obj;
            this._value = 0;
            for (var i = 0, j = this.vars.length; i < j; i++) {
                obj = this.vars[i];
                if (obj.getValue) {
                    this._value += obj.getValue();
                }
                else if (d5power.ScriptRunner.varLibs[obj] || d5power.ScriptRunner.staticLibs[obj]) {
                    this._value += d5power.ScriptRunner.varLibs[obj] ? d5power.ScriptRunner.varLibs[obj] : d5power.ScriptRunner.staticLibs[obj];
                }
                else {
                    this._value += obj;
                }
            }
        };
        NodeAdd.prototype.getValue = function () {
            this.think();
            return this._value;
        };
        NodeAdd.prototype.dispose = function () {
            this._manager = null;
            this.vars = null;
        };
        NodeAdd.prototype.format = function (obj) {
            if (obj.id > 0 && obj.id < d5power.NodeType.MAX_ID) {
                this.id = obj.id;
                var vars = [];
                var data;
                for (var i = 0; i < obj.vars.length; i++) {
                    data = obj.vars[i];
                    if (data.substr(0, 1) == '#') {
                        data = this._manager.getNode(parseInt(data.substr(1)));
                        if (!data)
                            data = 0;
                    }
                    vars.push(data);
                }
                this.vars = vars;
            }
            else {
                console.error('[NodeAdd]解析失败');
            }
        };
        Object.defineProperty(NodeAdd.prototype, "obj", {
            get: function () {
                var object = {};
                object.type = d5power.NodeType.Add;
                obj.id = this.id;
                var vars = [];
                var obj;
                for (var i = 0; i < this.vars.length; i++) {
                    obj = this.vars[i];
                    if (obj.getValue) {
                        vars.push('#' + obj.id);
                    }
                    else {
                        vars.push(obj);
                    }
                }
                obj.vars = vars;
                return object;
            },
            enumerable: true,
            configurable: true
        });
        return NodeAdd;
    }(d5power.NodeBase));
    d5power.NodeAdd = NodeAdd;
    __reflect(NodeAdd.prototype, "d5power.NodeAdd", ["d5power.IScriptNode", "d5power.IScriptNumber"]);
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var NodeType = (function () {
        function NodeType() {
        }
        /**
         * Node for define vars
         */
        NodeType.Var = 0;
        /**
         * Node for add values
         */
        NodeType.Add = 1;
        /**
         * Max valuable ID
         */
        NodeType.MAX_ID = 999;
        return NodeType;
    }());
    d5power.NodeType = NodeType;
    __reflect(NodeType.prototype, "d5power.NodeType");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var NodeVar = (function (_super) {
        __extends(NodeVar, _super);
        function NodeVar(manager) {
            var _this = _super.call(this, manager) || this;
            _this.area = 0;
            _this.type = d5power.NodeType.Var;
            return _this;
        }
        NodeVar.prototype.think = function () {
            if (this.name == null)
                return;
            if (this.area == NodeVar.AREA_SCENE) {
                d5power.ScriptRunner.varLibs[this.name] = this.value;
            }
            else {
                d5power.ScriptRunner.staticLibs[this.name] = this.value;
            }
        };
        NodeVar.prototype.getValue = function () {
            return parseInt(this.value);
        };
        Object.defineProperty(NodeVar.prototype, "obj", {
            get: function () {
                var object = {};
                object.name = this.name;
                object.value = this.value;
                object.id = this.id;
                object.type = d5power.NodeType.Var;
                return object;
            },
            enumerable: true,
            configurable: true
        });
        NodeVar.prototype.format = function (obj) {
            if (obj.type > 0 && obj.type < d5power.NodeType.MAX_ID) {
                this.id = obj.id;
                this.name = obj.name;
                this.value = obj.value;
            }
            else {
                console.error('[NodeVar]解析失败');
            }
        };
        NodeVar.prototype.dispose = function () { };
        NodeVar.AREA_SCENE = 0;
        NodeVar.AREA_PUBLI = 1;
        return NodeVar;
    }(d5power.NodeBase));
    d5power.NodeVar = NodeVar;
    __reflect(NodeVar.prototype, "d5power.NodeVar", ["d5power.IScriptNode", "d5power.IScriptNumber"]);
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    /**
     * 脚本控制中心
     * Script Control Center
     */
    var ScriptRunner = (function () {
        function ScriptRunner() {
            /**
             * 最后一次脚本脉动的时间
             */
            this._lastPulse = 0;
            if (ScriptRunner._me != null) {
                console.error('[ScriptRunner] please get instance throw getInstance function.');
                return;
            }
            this._nodeLib = [];
            this.reset();
            ScriptRunner.staticLibs = {};
        }
        ScriptRunner.getInstance = function () {
            if (ScriptRunner._me == null) {
                ScriptRunner._me = new ScriptRunner();
            }
            return ScriptRunner._me;
        };
        Object.defineProperty(ScriptRunner, "index", {
            get: function () {
                ScriptRunner._index++;
                return ScriptRunner._index;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScriptRunner.prototype, "runid", {
            get: function () {
                return ScriptRunner._runid;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * load value of index,and callback
         * @param callback
         * @param thisobj
         */
        ScriptRunner.prototype.init = function (callback, thisobj) {
            ScriptRunner._index = 0;
            callback.apply(thisobj);
        };
        /**
         *
         */
        ScriptRunner.prototype.reset = function () {
            for (var i = this._nodeLib.length - 1; i >= 0; i--) {
                this._nodeLib[i].dispose();
            }
            this._nodeLib = [];
            this._tree = [];
            ScriptRunner.varLibs = {};
            // 修改运行批号，从而使批号和内存中的其他但愿不符。造成但愿停运
            ScriptRunner._runid++;
        };
        /**
         * search node by index
         * @param index
         */
        ScriptRunner.prototype.getNode = function (index) {
            var node;
            if (this._nodeLib.length) {
                for (var i = 0, j = this._nodeLib.length; i < j; i++) {
                    node = this._nodeLib[i];
                    if (node.id == index)
                        return node;
                }
            }
            return null;
        };
        /**
         * give id to node
         * @param node
         * @param id
         */
        ScriptRunner.prototype.giveId = function (node, id) {
            if (id === void 0) { id = -1; }
            node.id = id == -1 ? ScriptRunner.index : id;
            return node.id;
        };
        /**
         * 更换场景
         */
        ScriptRunner.prototype.changeScene = function () {
            this.reset();
        };
        ScriptRunner.prototype.addNode = function (node) {
            if (this._tree.indexOf(node) == -1) {
                this._nodeLib.push(node);
                this._tree.push(node);
            }
        };
        /**
         * 运行
         * @param t timestamp
         */
        ScriptRunner.prototype.check = function (t) {
            if (t - this._lastPulse < ScriptRunner._pulse)
                return;
            this._lastPulse = t;
            var node;
            for (var i = this._tree.length - 1; i >= 0; i--) {
                node = this._tree[i];
                node.think();
                node.check();
                this._tree.pop();
            }
        };
        /**
         * 脚本脉动间隔
         *
         */
        ScriptRunner._pulse = 200;
        /**
         * 运行id，用于提供给内存中运行的单元发现自己所属的运行批次已结束。需要终止自身运行
         */
        ScriptRunner._runid = 0;
        ScriptRunner._index = -1;
        return ScriptRunner;
    }());
    d5power.ScriptRunner = ScriptRunner;
    __reflect(ScriptRunner.prototype, "d5power.ScriptRunner", ["d5power.INodeManager"]);
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
     * 三元数据
     */
    var ThreeBase = (function () {
        function ThreeBase() {
        }
        return ThreeBase;
    }());
    d5power.ThreeBase = ThreeBase;
    __reflect(ThreeBase.prototype, "d5power.ThreeBase");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    /**
     * 地图中的NPC配置
     */
    var NPConf = (function () {
        function NPConf() {
        }
        NPConf.prototype.format = function (obj) {
            this.id = obj.uid;
            this.name = obj.name;
            this.posx = obj.posx;
            this.posy = obj.posy;
            this.say = obj.say;
            this.script = obj.script;
            if (obj.job != null) {
                this.job = new d5power.ThreeBase();
                this.job.type = obj.job.type;
                this.job.key = obj.job.value;
                this.job.count = obj.job.num;
            }
        };
        return NPConf;
    }());
    d5power.NPConf = NPConf;
    __reflect(NPConf.prototype, "d5power.NPConf");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var DisplayPluginData = (function () {
        function DisplayPluginData() {
        }
        return DisplayPluginData;
    }());
    d5power.DisplayPluginData = DisplayPluginData;
    __reflect(DisplayPluginData.prototype, "d5power.DisplayPluginData");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var ItemData = (function () {
        function ItemData() {
            this.id = 0;
            this.name = '';
            this.info = '';
            this.buy = 0;
            this.sale = 0;
            this.canAdd = true;
        }
        ItemData.prototype.format = function (obj) {
            this.id = parseInt(obj.id);
            this.name = obj.name;
            this.info = obj.info;
            this.buy = obj.buy;
            this.sale = obj.sale;
            this.canAdd = obj.canAdd;
        };
        return ItemData;
    }());
    d5power.ItemData = ItemData;
    __reflect(ItemData.prototype, "d5power.ItemData");
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
    var MissionNR = (function () {
        function MissionNR() {
        }
        /**
         * 增加用户处理配置
         */
        MissionNR.addCostomDefine = function (data) {
            if (parseInt(data.key) <= MissionNR.SAVE_KEY) {
                return false;
            }
            MissionNR.COSTOM_DEFINE.push(data);
            return true;
        };
        MissionNR.getChinese = function (id) {
            if (id === void 0) { id = 0; }
            switch (id) {
                case MissionNR.N_MONSTER_KILLED:
                    return '杀死怪物';
                case MissionNR.N_ITEM_NEED:
                    return '拥有道具（扣除）';
                case MissionNR.N_ITEM_TACKED:
                    return '拥有道具（不扣除）';
                case MissionNR.N_MISSION:
                    return '拥有任务';
                case MissionNR.N_PLAYER_PROP:
                    return '玩家属性达到';
                case MissionNR.N_TALK_NPC:
                    return '与NPC对话';
                case MissionNR.N_SKILL_LV:
                    return '技能等级达到';
                case MissionNR.N_EQU:
                    return '需要装备';
                case MissionNR.N_SKIN:
                    return '需要皮肤';
                case MissionNR.N_SKILL:
                    return '需要学会技能';
                case MissionNR.N_BUFF:
                    return '需要BUFF状态';
                case MissionNR.R_ITEM:
                    return '奖励道具';
                case MissionNR.R_MONEY:
                    return '奖励游戏币';
                case MissionNR.R_EXP:
                    return '奖励经验';
                case MissionNR.R_MISSION:
                    return '奖励任务';
                default:
                    var length = MissionNR.COSTOM_DEFINE.length;
                    for (var i = 0; i < length; i++) {
                        var data = MissionNR.COSTOM_DEFINE[i];
                        if (data.type == id)
                            return data.key;
                    }
                    break;
            }
            return null;
        };
        /**
         * 系统保存的处理模式
         */
        MissionNR.SAVE_KEY = 200;
        /**
         * 需求与奖励分割线
         */
        MissionNR.N_R_LINE = 100;
        /**
         * 杀死怪物
         */
        MissionNR.N_MONSTER_KILLED = 0;
        /**
         * 拥有物品（不扣除）
         */
        MissionNR.N_ITEM_TACKED = 1;
        /**
         * 拥有物品（扣除）
         */
        MissionNR.N_ITEM_NEED = 2;
        /**
         * 拥有任务
         */
        MissionNR.N_MISSION = 3;
        /**
         * 玩家属性
         */
        MissionNR.N_PLAYER_PROP = 4;
        /**
         * 与NPC对话
         */
        MissionNR.N_TALK_NPC = 5;
        /**
         * 需要技能
         */
        MissionNR.N_SKILL_LV = 6;
        /**
         * 需要主角皮肤
         */
        MissionNR.N_SKIN = 7;
        /**
         * 需要装备某类型道具
         */
        //public static const N_EQU_TYPE:uint = 8;
        /**
         * 需要装备某个特定道具
         */
        MissionNR.N_EQU = 9;
        /**
         * 需要学会技能
         */
        MissionNR.N_SKILL = 10;
        /**
         * 需要增益
         */
        MissionNR.N_BUFF = 11;
        /**
         *需要游戏币
         */
        MissionNR.N_MONEY = 12;
        /**
         *需要标记
         */
        MissionNR.N_MARK = 13;
        /**
         *拥有游戏币
         */
        MissionNR.N_MONEY_KEEP = 14;
        /**
         * 奖励道具
         */
        MissionNR.R_ITEM = 100;
        /**
         * 奖励游戏币
         */
        MissionNR.R_MONEY = 101;
        /**
         * 奖励经验
         */
        MissionNR.R_EXP = 102;
        /**
         * 奖励任务
         */
        MissionNR.R_MISSION = 103;
        /**
         * 奖励属性
         */
        MissionNR.R_PLAYER_PROP = 104;
        /**
         * 获得技能
         */
        MissionNR.R_SKILL = 105;
        /* !!! 以上内容为D5Rpg内部定义，非必要请不要修改，会影响较多代码 !!! */
        MissionNR.COSTOM_DEFINE = [];
        return MissionNR;
    }());
    d5power.MissionNR = MissionNR;
    __reflect(MissionNR.prototype, "d5power.MissionNR");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    /**
     * 背包道具映射
     */
    var PackageItemData = (function () {
        function PackageItemData() {
            this.itemid = 0;
            this.number = 0;
            this.packageid = 0;
        }
        return PackageItemData;
    }());
    d5power.PackageItemData = PackageItemData;
    __reflect(PackageItemData.prototype, "d5power.PackageItemData");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var D5Event = (function () {
        function D5Event() {
        }
        return D5Event;
    }());
    d5power.D5Event = D5Event;
    __reflect(D5Event.prototype, "d5power.D5Event");
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
    var Actions = (function () {
        function Actions() {
        }
        /**
         * 特殊状态：复活
         */
        Actions.RELIVE = -1;
        /**
         * Stop 停止
         * */
        Actions.Stop = 8;
        /**
         * Run 跑动
         * */
        Actions.Run = 1;
        /**
         * Sing 施法攻击
         * */
        Actions.Sing = 2;
        /**
         * Attack 物理攻击
         * */
        Actions.Attack = 2;
        /**
         * 弓箭攻击
         * */
        Actions.BowAtk = 3;
        /**
         * 坐下
         */
        Actions.Sit = 4;
        /**
         * 死亡
         */
        Actions.Die = 5;
        /**
         * 拾取
         */
        Actions.Pickup = 6;
        /**
         * 被攻击
         */
        Actions.BeAtk = 7;
        /**
         * 等待（备战）
         */
        Actions.Wait = 8;
        return Actions;
    }());
    d5power.Actions = Actions;
    __reflect(Actions.prototype, "d5power.Actions");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var BaseMap = (function () {
        /**
         *
         * @param goManager 用来维护和管理地图场景中的各种游戏对象的管理器
         */
        function BaseMap(goManager) {
            if (goManager === void 0) { goManager = null; }
            /**
             * 区块文件格式
             */
            this._tileFormat = '.jpg';
            /**
             * 路点宽度
             */
            this._roadW = 60;
            /**
             * 路点高度
             */
            this._roadH = 30;
            /**
             * 当前渲染的起始区块x
             */
            this._nowStartX = -1;
            /**
             * 当前渲染的起始区块y
             */
            this._nowStartY = -1;
            this._nowName = '';
            this._tempPoint = new egret.Point();
            this._gameObjectManager = goManager;
        }
        BaseMap.rebuildPool = function (num) {
            if (BaseMap._tilePool.length > num) {
                while (BaseMap._tilePool.length > num)
                    BaseMap._tilePool.pop();
            }
            else {
                while (BaseMap._tilePool.length < num)
                    BaseMap._tilePool.push(new egret.Bitmap());
            }
            //console.log("[BaseMap] there are ",num,"tiles in pool.");
        };
        /**
         * 将地砖回收至地砖池
         * @param data 需要回收的地砖
         */
        BaseMap.back2pool = function (data) {
            if (BaseMap._tilePool.indexOf(data) == -1)
                BaseMap._tilePool.push(data);
            //console.log("[BaseMap] 1 tiles get home.there are ",BaseMap._tilePool.length,"tiles in pool.");
        };
        /**
         * 获取一个地砖
         */
        BaseMap.getTile = function () {
            var data;
            data = BaseMap._tilePool.length ? BaseMap._tilePool.pop() : new egret.Bitmap();
            //console.log("[BaseMap] pop 1 tiles.there are ",BaseMap._tilePool.length,"tiles in pool.");
            data.texture = null;
            return data;
        };
        /**
         * 临时创建一个循环地砖的地图
         * @param id 地图编号
         * @param bg 循环地砖素材
         * @param callback 准备完成后的触发函数
         * @param thisobj 触发函数的对象引用
         * @param blockw 区块宽度
         * @param blockh 区块高度
         */
        BaseMap.prototype.createLoop = function (id, bg, callback, thisobj, blockw, blockh) {
            if (blockw === void 0) { blockw = 10; }
            if (blockh === void 0) { blockh = 10; }
            var that = this;
            RES.getResByUrl(bg, function (data) {
                that._mapid = id;
                that._tileW = data.textureWidth;
                that._tileH = data.textureHeight;
                that._mapHeight = this._tileH * blockh;
                that._mapWidth = this._tileW * blockw;
                that._onReady = callback;
                that._onReadyThis = thisobj;
                that._nowStartX = -1;
                that._nowStartY = -1;
                that._loopBg = data;
                that.setupRoad(null);
            }, this);
        };
        /**
         * 进入一个地图
         * @param id 地图编号
         * @param callback 地图准备完成后的触发函数
         * @param thisobj 地图准备完成后的触发函数的处理对象
         */
        BaseMap.prototype.enter = function (id, callback, thisobj) {
            var that = this;
            RES.getResByUrl(d5power.D5Game.RES_SERVER + d5power.D5Game.ASSET_PATH + "/tiles/" + id + "/mapconf.json", function (data) {
                that._data = data;
                that.setup(parseInt(data.id), parseInt(data.mapW), parseInt(data.mapH), parseInt(data.tileX), parseInt(data.tileY), callback, thisobj);
            }, this);
        };
        Object.defineProperty(BaseMap.prototype, "id", {
            /**
             * 地图编号
             */
            get: function () {
                return this._mapid;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置主容器
         * @param container 主容器
         */
        BaseMap.prototype.setContainer = function (container) {
            if (container == this._dbuffer)
                return;
            if (this._dbuffer != null) {
                this._dbuffer.removeChildren();
                if (this._dbuffer.parent)
                    this._dbuffer.parent.removeChild(this._dbuffer);
            }
            this._dbuffer = container;
        };
        /**
         * 设置区块格式
         * @param s 区块格式
         */
        BaseMap.prototype.setTileFormat = function (s) {
            if (s.substr(0, 1) != '.')
                s = "." + s;
            this._tileFormat = s;
        };
        /**
         * 构建一个新的地图
         * @param id 地图编号
         * @param w 地图尺寸宽
         * @param h 地图尺寸高
         * @param tw 区块尺寸高
         * @param th 区块尺寸宽
         * @param onReady 地图准备完成后的回叫函数
         * @param onReadyThis this
         */
        BaseMap.prototype.setup = function (id, w, h, tw, th, onReady, onReadyThis) {
            this._mapid = id;
            this._mapHeight = h;
            this._mapWidth = w;
            this._tileW = tw;
            this._tileH = th;
            this._onReady = onReady;
            this._onReadyThis = onReadyThis;
            this._nowStartX = -1;
            this._nowStartY = -1;
            var that = this;
            var onSmallMapLoaded = function (data) {
                that._smallMap = new egret.SpriteSheet(data);
                that.createSmallData(data.textureWidth, data.textureHeight);
                RES.getResByUrl(d5power.D5Game.RES_SERVER + d5power.D5Game.ASSET_PATH + '/tiles/' + that._mapid + '/roadmap.bin', that.setupRoad, that, RES.ResourceItem.TYPE_BIN);
            };
            RES.getResByUrl(d5power.D5Game.RES_SERVER + d5power.D5Game.ASSET_PATH + '/tiles/' + this._mapid + '/s.jpg', onSmallMapLoaded, this);
        };
        /**
         *
         * @param smallW
         * @param smallH
         */
        BaseMap.prototype.createSmallData = function (smallW, smallH) {
            var smallWidth = smallW / (this._mapWidth / this._tileW);
            var smallHeight = smallH / (this._mapHeight / this._tileH);
            var i;
            var l;
            for (l = 0; l < this._mapWidth / this._tileW; l++) {
                for (i = 0; i < this._mapHeight / this._tileH; i++) {
                    this._smallMap.createTexture('small' + l + '_' + i, i * smallWidth, l * smallHeight, smallWidth, smallHeight, 0, 0);
                }
            }
        };
        Object.defineProperty(BaseMap.prototype, "width", {
            get: function () {
                return this._mapWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseMap.prototype, "height", {
            get: function () {
                return this._mapHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseMap.prototype, "tileWidth", {
            get: function () {
                return this._tileW;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseMap.prototype, "tileHeight", {
            get: function () {
                return this._tileH;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseMap.prototype, "roadWidth", {
            get: function () {
                return this._roadW;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseMap.prototype, "roadHeight", {
            get: function () {
                return this._roadH;
            },
            enumerable: true,
            configurable: true
        });
        BaseMap.prototype.render = function (flush) {
            if (flush === void 0) { flush = false; }
            if (this.mod_buffer) {
                this.mod_buffer = false;
                this._dbuffer.cacheAsBitmap = true;
            }
            var startx = parseInt((d5power.Camera.zeroX / this._tileW));
            var starty = parseInt((d5power.Camera.zeroY / this._tileH));
            this.makeData(startx, starty, flush); // 只有在采用大地图背景的前提下才不断修正数据
            if (this._nowStartX == startx && this._nowStartY == starty && this._posFlush != null) {
                var zero_x = d5power.Camera.zeroX % this._tileW;
                var zero_y = d5power.Camera.zeroY % this._tileH;
                this._dbuffer.x = -zero_x;
                this._dbuffer.y = -zero_y;
            }
        };
        BaseMap.prototype.resize = function () {
            this._areaX = Math.ceil(d5power.D5Game.screenWidth / this._tileW) + 1;
            this._areaY = Math.ceil(d5power.D5Game.screenHeight / this._tileH) + 1;
            console.log("[D5Game] max tiles number ", this._areaX, this._areaY);
            BaseMap.rebuildPool(this._areaX * this._areaY + this._areaX + this._areaY);
        };
        /**
         * 重置地图数据
         */
        BaseMap.prototype.resetRoad = function () {
            this._roadArr = [];
            this._alphaArr = [];
            // 定义临时地图数据
            var h = Math.floor(this._mapHeight / this._roadH);
            var w = Math.floor(this._mapWidth / this._roadW);
            for (var y = 0; y < h; y++) {
                var arr = new Array();
                var arr2 = new Array();
                for (var x = 0; x < w; x++) {
                    arr.push(0);
                    arr2.push(0);
                }
                this._roadArr.push(arr);
                this._alphaArr.push(arr2);
            }
        };
        /**
         * 设置地图数据
         * @param data
         */
        BaseMap.prototype.setRoad = function (data) {
            this._roadArr = data;
        };
        BaseMap.prototype.isInAlphaArea = function (px, py) {
            var tile = this.Postion2Tile(px, py);
            return this._alphaArr[tile.y] && this._alphaArr[tile.y][tile.x] == BaseMap.BIN_ALPHA_VALUE;
        };
        /**
         * 尝试寻找周围可以通过的位置
         * 进行若干次尝试，如果没有发现，则返回null，请注意容错判断
         */
        BaseMap.prototype.getPointAround = function (center, from, r) {
            if (!center || !from)
                return null;
            var i = 0;
            var max = 5;
            var step = Math.PI * 2 / max;
            var gotoP = new egret.Point();
            var angle = d5power.GMath.getPointAngle(center.x - from.x, center.y - from.y) + (Math.random() > .5 ? 1 : -1) * Math.PI / 8;
            while (i < max) {
                var n = step * i + angle;
                gotoP.x = Math.round(center.x - r * Math.cos(n));
                gotoP.y = Math.round(center.y - r * Math.sin(n));
                if (this.PointCanMove(gotoP, from)) {
                    return gotoP;
                }
                i++;
            }
            return null;
        };
        BaseMap.prototype.PointCanMove = function (p, n) {
            if (this._astar == null)
                return true;
            var nodeArr = this._astar.find(n.x, n.y, p.x, p.y);
            return nodeArr != null;
        };
        BaseMap.prototype.getRoadPass = function (px, py) {
            if (this._roadArr[py] == null || this._roadArr[py][px] != 0)
                return false;
            return true;
        };
        BaseMap.prototype.findPath = function (fromx, fromy, tox, toy) {
            return this._astar == null ? null : this._astar.find(fromx, fromy, tox, toy);
        };
        /**
         * 根据屏幕某点坐标获取其在世界（全地图）内的坐标
         */
        BaseMap.prototype.getWorldPostion = function (x, y) {
            this._tempPoint.x = d5power.Camera.zeroX + x;
            this._tempPoint.y = d5power.Camera.zeroY + y;
            return this._tempPoint;
        };
        /**
         * 根据世界坐标获取在屏幕内的坐标
         */
        BaseMap.prototype.getScreenPostion = function (x, y) {
            this._tempPoint.x = x - d5power.Camera.zeroX;
            this._tempPoint.y = y - d5power.Camera.zeroY;
            return this._tempPoint;
        };
        /**
         * 根据路点获得世界（全地图）内的坐标
         */
        BaseMap.prototype.tile2WorldPostion = function (x, y) {
            this._tempPoint.x = x * this._roadW + this._roadW * .5;
            this._tempPoint.y = y * this._roadH + this._roadH * .5;
            return this._tempPoint;
        };
        /**
         * 世界地图到路点的转换
         */
        BaseMap.prototype.Postion2Tile = function (px, py) {
            this._tempPoint.x = Math.floor(px / this._roadW);
            this._tempPoint.y = Math.floor(py / this._roadH);
            return this._tempPoint;
        };
        BaseMap.prototype.reset = function () {
            this._tempPoint = new egret.Point();
            this._mapResource = { tiles: new Object() };
            if (this._dbuffer)
                this._dbuffer.removeChildren();
            //            this._tiledResource = {};
        };
        /**
         * 设置路点。至此，地图准备完毕，通知主程序开始渲染
         * @param data
         */
        BaseMap.prototype.setupRoad = function (res) {
            if (res == null || res == undefined) {
                this.resetRoad();
            }
            else {
                var data = new egret.ByteArray(res);
                var sign = data.readUTFBytes(5);
                var value;
                var px = 0;
                var py = 0;
                if (sign == 'D5Map') {
                    py = data.readShort();
                    px = data.readShort();
                    var resmap = [];
                    for (var y = 0; y < py; y++) {
                        var temp = [];
                        for (var x = 0; x < px; x++) {
                            temp.push(data.readByte());
                        }
                        resmap.push(temp);
                    }
                    this.resetRoad();
                    if (px > 1) {
                        var h = Math.floor(this._mapHeight / this._roadH);
                        var w = Math.floor(this._mapWidth / this._roadW);
                        var k = w == px && h == py ? 1 : py / h;
                        for (y = 0; y < h; y++) {
                            for (x = 0; x < w; x++) {
                                try {
                                    py = Math.floor(y * k);
                                    px = Math.floor(x * k);
                                    value = resmap[py][px];
                                    this._roadArr[y][x] = value == BaseMap.BIN_NO_VALUE ? 1 : 0;
                                    this._alphaArr[y][x] = value;
                                }
                                catch (e) {
                                    trace("［BaseMap］路点超出范围Y:X(" + y + ":" + x + ")", py, px);
                                    this._roadArr[y][x] = BaseMap.BIN_NO_VALUE;
                                    this._alphaArr[y][x] = BaseMap.BIN_NO_VALUE;
                                }
                            }
                        }
                    }
                }
                else {
                    console.log("[BaseMap]非法的地图配置文件");
                }
            }
            this.reset();
            this.resize();
            this._astar = new d5power.SilzAstar(this._roadArr);
            var length = this._data && this._data.npc ? this._data.npc.length : 0;
            if (this._gameObjectManager != null) {
                for (var i = 0; i < length; i++) {
                    var npconf = new d5power.NPConf();
                    npconf.format(this._data.npc[i]);
                    this._gameObjectManager.addNPC(npconf);
                }
            }
            if (this._onReady != null) {
                this._onReady.apply(this._onReadyThis);
            }
        };
        BaseMap.prototype.makeData = function (startx, starty, flush) {
            if (this._nowStartX == startx && this._nowStartY == starty)
                return;
            this._nowStartX = startx;
            this._nowStartY = starty;
            this._posFlush = [];
            for (var i = 0, j = this._dbuffer.numChildren; i < j; i++) {
                this._dbuffer.getChildAt(i).texture = null;
            }
            //this.fillSmallMap(startx, starty);
            var maxY = Math.min(starty + this._areaY, Math.floor(this._mapHeight / this._tileH));
            var maxX = Math.min(startx + this._areaX, Math.floor(this._mapWidth / this._tileW));
            var key;
            for (var y = starty; y < maxY; y++) {
                for (var x = startx; x < maxX; x++) {
                    key = y + '_' + x;
                    if (x < 0 || y < 0) {
                        continue;
                    }
                    else if (this._mapResource.tiles[key] == null) {
                        if (this._loopBg) {
                            this.fillTile((x - this._nowStartX), (y - this._nowStartY), this._loopBg);
                        }
                        else {
                            this._posFlush.push(y + '_' + x + '_' + this._nowStartX + '_' + this._nowStartY + '_' + this._mapid);
                            this.fillSmallMap(y, x, (x - this._nowStartX), (y - this._nowStartY));
                        }
                    }
                    else {
                        this.fillTile((x - this._nowStartX), (y - this._nowStartY), this._mapResource.tiles[key]);
                    }
                }
            }
            if (this._loopBg == null)
                this.loadTiles();
        };
        BaseMap.prototype.clear = function () {
            this._mapResource = { tiles: new Object() };
            var loop;
            while (this._dbuffer.numChildren) {
                loop = this._dbuffer.removeChildAt(0);
                loop.texture = null;
                BaseMap.back2pool(loop);
            }
            this._nowName = '';
            this._tileFormat = '.jpg';
        };
        BaseMap.prototype.loadTiles = function (data) {
            if (data === void 0) { data = null; }
            if (data != null) {
                var pos = this._nowName.split('_');
                if (parseInt(pos[4]) != this._mapid) {
                    console.log("[BaseMap] 读取了已切换了的地图资源");
                    return;
                }
                var tileName = pos[0] + "_" + pos[1];
                if (this._mapResource.tiles[tileName] == null)
                    this._mapResource.tiles[tileName] = data;
                // 若加载后位置已变更，则只存储不渲染
                var tx = parseInt(pos[1]) - this._nowStartX;
                var ty = parseInt(pos[0]) - this._nowStartY;
                if (parseInt(pos[2]) == this._nowStartX && parseInt(pos[3]) == this._nowStartY) {
                    this.fillTile(tx, ty, data);
                }
                this._nowName = '';
            }
            if (this._posFlush.length == 0) {
                this._dbuffer.cacheAsBitmap = false;
                this.mod_buffer = true;
            }
            else if (this._nowName == '') {
                this._nowName = this._posFlush.pop();
                var pos = this._nowName.split('_');
                var name = d5power.D5Game.RES_SERVER + d5power.D5Game.ASSET_PATH + "/tiles/" + this._mapid + "/" + pos[0] + "_" + pos[1] + this._tileFormat;
                RES.getResByUrl(name, this.loadTiles, this);
            }
        };
        BaseMap.prototype.fillTile = function (tx, ty, data) {
            var bitmap = this._dbuffer.getChildByName(tx + "_" + ty);
            if (bitmap == null) {
                bitmap = BaseMap.getTile();
                bitmap.x = tx * this._tileW;
                bitmap.y = ty * this._tileH;
                bitmap.name = tx + "_" + ty;
                this._dbuffer.addChild(bitmap);
            }
            bitmap.texture = data;
            this._dbuffer.cacheAsBitmap = true;
        };
        /**
         * 绘制小地图
         */
        BaseMap.prototype.fillSmallMap = function (startX, startY, tx, ty) {
            if (this._smallMap) {
                var data = this._smallMap.getTexture('small' + startX + '_' + startY);
                var bitmap = this._dbuffer.getChildByName(tx + "_" + ty);
                if (bitmap == null) {
                    bitmap = BaseMap.getTile();
                    bitmap.x = tx * this._tileW;
                    bitmap.y = ty * this._tileH;
                    bitmap.fillMode = egret.BitmapFillMode.SCALE;
                    bitmap.name = tx + "_" + ty;
                    this._dbuffer.addChild(bitmap);
                }
                bitmap.texture = data;
                bitmap.width = this._tileW;
                bitmap.height = this._tileH;
                this._dbuffer.cacheAsBitmap = true;
            }
        };
        /**
         * 在二进制文件中，由于需要1个字节表示多个状态。因此采用大于0的值表示可通过
         * 在导入后进行了转义
         */
        BaseMap.BIN_ALPHA_VALUE = 2;
        BaseMap.BIN_CAN_VALUE = 1;
        BaseMap.BIN_NO_VALUE = 0;
        /**
         * 地砖池，用于地砖重用
         */
        BaseMap._tilePool = new Array();
        return BaseMap;
    }());
    d5power.BaseMap = BaseMap;
    __reflect(BaseMap.prototype, "d5power.BaseMap", ["d5power.IMap"]);
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var Camera = (function () {
        function Camera(map) {
            this._zorderSpeed = 600;
            this._moveSpeed = 1;
            this._moveAngle = 0;
            if (Camera._cameraView == null)
                Camera._cameraView = new egret.Rectangle();
            this._cameraCutView = new egret.Rectangle();
            this._map = map;
        }
        Object.defineProperty(Camera, "needreCut", {
            get: function () {
                return Camera.$needreCut;
            },
            enumerable: true,
            configurable: true
        });
        Camera.prototype.setZero = function (x, y) {
            x = Math.ceil(x);
            y = Math.ceil(y);
            Camera.zeroX = x;
            Camera.zeroY = y;
            var value = this._map.width - d5power.D5Game.screenWidth;
            Camera.zeroX = Camera.zeroX < 0 ? 0 : Camera.zeroX;
            if (this._map.width > d5power.D5Game.screenWidth)
                Camera.zeroX = Camera.zeroX > value ? value : Camera.zeroX;
            value = this._map.height - d5power.D5Game.screenHeight;
            Camera.zeroY = Camera.zeroY < 0 ? 0 : Camera.zeroY;
            if (this._map.height > d5power.D5Game.screenHeight)
                Camera.zeroY = Camera.zeroY > value ? value : Camera.zeroY;
        };
        Camera.prototype.update = function () {
            if (this._focus)
                this.setZero(this._focus.posX - (d5power.D5Game.screenWidth >> 1), this._focus.posY - (d5power.D5Game.screenHeight >> 1));
            Camera._cameraView.x = Camera.zeroX;
            Camera._cameraView.y = Camera.zeroY;
            Camera._cameraView.width = d5power.D5Game.screenWidth;
            Camera._cameraView.height = d5power.D5Game.screenHeight;
        };
        Object.defineProperty(Camera.prototype, "focus", {
            get: function () {
                return this._focus;
            },
            /**
             * 镜头注视
             */
            set: function (o) {
                if (this._focus) {
                    this._focus.beFocus = false;
                }
                this._focus = o;
                o.beFocus = true;
                this.update();
                this.reCut();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "moveSpeed", {
            /**
             * 镜头移动速度
             */
            set: function (s) {
                this._moveSpeed = s;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera, "cameraView", {
            /**
             * 镜头视野矩形
             * 返回镜头在世界地图内测区域
             */
            get: function () {
                return Camera._cameraView;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "cameraCutView", {
            /**
             * 镜头裁剪视野
             */
            get: function () {
                var zero_x = Camera.zeroX;
                var zero_y = Camera.zeroY;
                if (zero_x > 0)
                    zero_x -= this._map.tileWidth * 2;
                if (zero_x > 0)
                    zero_y -= zero_y - this._map.tileHeight * 2;
                zero_x = zero_x < 0 ? 0 : zero_x;
                zero_y = zero_y < 0 ? 0 : zero_y;
                this._cameraCutView.x = zero_x;
                this._cameraCutView.y = zero_y;
                this._cameraCutView.width = d5power.D5Game.screenWidth + this._map.tileWidth * 2;
                this._cameraCutView.height = d5power.D5Game.screenHeight + this._map.tileHeight * 2;
                return this._cameraCutView;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 镜头向上
         * @param    k    倍率
         */
        Camera.prototype.moveNorth = function (k) {
            if (k === void 0) { k = 1; }
            if (this._moveSpeed == 0 || Camera.zeroY == 0)
                return;
            this.focus = null;
            this.setZero(Camera.zeroX, Camera.zeroY - this._moveSpeed * k);
            this.reCut();
        };
        /**
         * 镜头向下
         */
        Camera.prototype.moveSourth = function (k) {
            if (k === void 0) { k = 1; }
            if (this._moveSpeed == 0)
                return;
            this.focus = null;
            this.setZero(Camera.zeroX, Camera.zeroY + this._moveSpeed * k);
            this.reCut();
        };
        /**
         * 镜头向左
         */
        Camera.prototype.moveWest = function (k) {
            if (k === void 0) { k = 1; }
            if (this._moveSpeed == 0 || Camera.zeroX == 0)
                return;
            this.focus = null;
            this.setZero(Camera.zeroX - this._moveSpeed * k, Camera.zeroY);
            this.reCut();
        };
        /**
         * 镜头向右
         */
        Camera.prototype.moveEast = function (k) {
            if (k === void 0) { k = 1; }
            if (this._moveSpeed == 0)
                return;
            this.focus = null;
            this.setZero(Camera.zeroX + this._moveSpeed * k, Camera.zeroY);
            this.reCut();
        };
        Camera.prototype.move = function (xdir, ydir, k) {
            if (k === void 0) { k = 1; }
            this.focus = null;
            this.setZero(Camera.zeroX + this._moveSpeed * xdir * k, Camera.zeroY + this._moveSpeed * ydir * k);
            this.reCut();
        };
        /**
         * 镜头观察某点
         */
        Camera.prototype.lookAt = function (x, y) {
            this.focus = null;
            this.setZero(x - (d5power.D5Game.screenWidth >> 1), y - (d5power.D5Game.screenHeight >> 1));
            this.reCut();
        };
        Camera.prototype.flyTo = function (x, y, callback) {
            if (callback === void 0) { callback = null; }
            if (this._timer != null) {
                console.log("[D5Camera] Camera is moving,can not do this operation.");
                return;
            }
            this.focus = null;
            this._moveCallBack = callback;
            this._moveStart = new egret.Point(Camera.zeroX - (d5power.D5Game.screenWidth >> 1), Camera.zeroY - (d5power.D5Game.screenHeight >> 1));
            this._moveEnd = new egret.Point(x - (d5power.D5Game.screenWidth >> 1), y - (d5power.D5Game.screenHeight >> 1));
            this._timer = new egret.Timer(50);
            this._timer.addEventListener(egret.TimerEvent.TIMER, this.moveCamera, this);
            this._timer.start();
        };
        Camera.prototype.moveCamera = function (e) {
            var k = 8;
            var xspeed = (this._moveEnd.x - this._moveStart.x) / k;
            var yspeed = (this._moveEnd.y - this._moveStart.y) / k;
            this._moveStart.x += xspeed;
            this._moveStart.y += yspeed;
            this.setZero(this._moveStart.x, this._moveStart.y);
            if ((xspeed > -.2 && xspeed < .2) && (yspeed > -.2 && yspeed < .2)) {
                //_scene.Map.$Center = _moveEnd;
                this._moveEnd = null;
                this._timer.stop();
                this._timer.removeEventListener(egret.TimerEvent.TIMER, this.moveCamera, this);
                this._timer = null;
                this.reCut();
                if (this._moveCallBack != null)
                    this._moveCallBack();
            }
        };
        Object.defineProperty(Camera.prototype, "zorderSpeed", {
            get: function () {
                return this._zorderSpeed;
            },
            enumerable: true,
            configurable: true
        });
        Camera.prototype.reCut = function () {
            /*
            var list:Array<IGD> = D5Game.me.dataList;
            var length:number = list.length;
            var obj:IGD;
            var contains:boolean;
            //console.log("[D5Camera] there are ",length,"objects.");
            for (var i:number = 0; i < length; i++) {
                obj = list[i];
                contains = Camera.cameraView.containsPoint(obj.$pos);
                //console.log("[D5Camera] check ",obj.$pos,D5Camera.cameraView);
                if (!obj.inScreen && contains) {
                    D5Game.me.add2Screen(obj);
                } else if(obj.inScreen && !contains) {
                    D5Game.me.remove4Screen(obj);
                }
            }
            */
        };
        Camera.zeroX = 0;
        Camera.zeroY = 0;
        /**
         * 分布渲染时间限制。每次渲染的最大允许占用时间，单位毫秒
         */
        Camera.RenderMaxTime = 10;
        return Camera;
    }());
    d5power.Camera = Camera;
    __reflect(Camera.prototype, "d5power.Camera");
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
    var Direction = (function () {
        //		public var ATK_LD:int = 9;
        //		public var ATK_LU:int = 10;
        //		public var ATK_RD:int = -9;
        //		public var ATK_RU:int = -10;
        //		
        //		public var BE_ATK_LD:int = 11;
        //		public var BE_ATK_LU:int = 12;
        //		public var BE_ATK_RD:int = -11;
        //		public var BE_ATK_RU:int = -12;
        //		
        //		
        //		public var DIE_RD:int = 14;
        //		public var DIE_RU:int = 13;
        //		public var DIE_LU:int = -13;
        //		public var DIE_LD:int = -14;
        //		
        //		
        //		public var WAIT_LD:uint = 2;
        //		public var WAIT_LU:uint = 3;
        //		public var WAIT_RD:int = -2;
        //		public var WAIT_RU:int = -3;
        function Direction() {
        }
        Direction.Down = 0;
        Direction.LeftDown = 1;
        Direction.Left = 2;
        Direction.LeftUp = 3;
        Direction.Up = 4;
        Direction.RightUp = 5;
        Direction.Right = 6;
        Direction.RightDown = 7;
        return Direction;
    }());
    d5power.Direction = Direction;
    __reflect(Direction.prototype, "d5power.Direction");
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
    var GMath = (function () {
        function GMath() {
        }
        /**
         * 获取某点的夹角
         * 返回为弧度值
         */
        GMath.getPointAngle = function (x, y) {
            return Math.atan2(y, x);
        };
        /**
         * 弧度转角度
         */
        GMath.R2A = function (r) {
            return r * GMath.K_R2A;
        };
        /**
         * 角度转弧度
         */
        GMath.A2R = function (a) {
            if (a === void 0) { a = 0; }
            return a * GMath.K_A2R;
        };
        GMath.K_R2A = 180 / Math.PI;
        GMath.K_A2R = Math.PI / 180;
        return GMath;
    }());
    d5power.GMath = GMath;
    __reflect(GMath.prototype, "d5power.GMath");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    /**
     * 玩家数据
     */
    var PlayerData = (function () {
        function PlayerData() {
            this._missionList = [];
            this._itemList = [];
        }
        PlayerData.prototype.getMission = function (id) {
            if (this._missionList.indexOf(id) == -1) {
                this._missionList.push(id);
            }
        };
        return PlayerData;
    }());
    d5power.PlayerData = PlayerData;
    __reflect(PlayerData.prototype, "d5power.PlayerData");
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
    var SilzAstar = (function () {
        /**
         * @param    mapdata        地图数据
         * @param    container    显示容器，若为null则不显示地图
         */
        function SilzAstar(mapdata, container) {
            if (container === void 0) { container = null; }
            /**
             * 地图显示尺寸
             */
            this._cellSize = 5;
            /**
             * 路径显示器
             */
            this.path = new egret.Sprite();
            /**
             * 地图显示器
             */
            this.image = new egret.Bitmap(); //new BitmapData(1, 1)
            /**
             * 显示容器
             */
            this.imageWrapper = new egret.DisplayObjectContainer();
            /**
             * 显示模式
             */
            this.isDisplayMode = false;
            if (container != null) {
                this.isDisplayMode = true;
                this.imageWrapper.addChild(this.image);
                container.addChild(this.imageWrapper);
                this.imageWrapper.addChild(this.path);
            }
            else {
                this.isDisplayMode = false;
            }
            this.makeGrid(mapdata);
        }
        Object.defineProperty(SilzAstar.prototype, "WORKMODE", {
            set: function (v) {
                if (v != 8 && v != 4)
                    throw new Error('仅支持8方向或4方向寻路');
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param        xnow    当前坐标X(寻路格子坐标)
         * @param        ynow    当前坐标Y(寻路格子坐标)
         * @param        xpos    目标点X(寻路格子坐标)
         * @param        ypos    目标点Y(寻路格子坐标)
         */
        SilzAstar.prototype.find = function (xnow, ynow, xpos, ypos) {
            xpos = Math.min(xpos, this._grid.numCols - 1);
            ypos = Math.min(ypos, this._grid.numRows - 1);
            xpos = Math.max(xpos, 0);
            ypos = Math.max(ypos, 0);
            // 超出寻路范围
            if (!this._grid.nodeValuable(xpos, ypos))
                return null;
            this._grid.setEndNode(xpos, ypos); //1
            xnow = Math.min(xnow, this._grid.numCols - 1);
            ynow = Math.min(ynow, this._grid.numRows - 1);
            xnow = Math.max(xnow, 0);
            ynow = Math.max(ynow, 0);
            if (!this._grid.nodeValuable(xnow, ynow))
                return null;
            this._grid.setStartNode(xnow, ynow); //2
            if (this.isDisplayMode) {
                var time = egret.getTimer();
            }
            if (this.astar.findPath()) {
                this._index = 0;
                this.astar.floyd();
                this._path = this.astar.floydPath;
                if (this.isDisplayMode) {
                    time = egret.getTimer() - time;
                    console.log("[SilzAstar]", time + "ms   length:" + this.astar.path.length);
                    console.log("[SilzAstar]", this.astar.floydPath);
                    this.path.graphics.clear();
                    for (var i = 0; i < this.astar.floydPath.length; i++) {
                        var p = this.astar.floydPath[i];
                        this.path.graphics.lineStyle(0, 0xff0000);
                        this.path.graphics.drawCircle((p.x + 0.5) * this._cellSize, (p.y + 0.5) * this._cellSize, 2);
                        this.path.graphics.lineStyle(0, 0xff0000, 0.5);
                        this.path.graphics.moveTo(xnow, ynow);
                    }
                }
                return this._path;
            }
            else if (this.isDisplayMode) {
                this._grid.setEndNode(xpos - 1, ypos - 1);
                time = egret.getTimer() - time;
                console.log("[SilzAstar]", time + "ms 找不到");
            }
            return null;
        };
        SilzAstar.prototype.makeGrid = function (data) {
            var rows = data.length;
            var cols = data[0].length;
            this._grid = new Grid(cols, rows);
            var px;
            var py;
            for (py = 0; py < rows; py++) {
                for (px = 0; px < cols; px++) {
                    this._grid.setWalkable(px, py, data[py][px] == 0);
                }
            }
            if (SilzAstar.WorkMode == 4)
                this._grid.calculateLinks(1);
            else
                this._grid.calculateLinks();
            this.astar = new AStar(this._grid);
            if (this.isDisplayMode) {
                this.drawGrid();
                this.path.graphics.clear();
            }
        };
        SilzAstar.prototype.drawGrid = function () {
            console.log("fuck");
            //			this.image.bitmapData = new BitmapData(this._grid.numCols * this._cellSize, this._grid.numRows * this._cellSize, false, 0xffffff);
            //			for (var i:number = 0; i < this._grid.numCols; i++){
            //				for (var j:number = 0; j < this._grid.numRows; j++){
            //					var node:SilzAstarNode = this._grid.getNode(i, j);
            //					if (!node.walkable){
            //						this.image.bitmapData.fillRect(new egret.Rectangle(i * this._cellSize, j * this._cellSize, this._cellSize, this._cellSize), this.getColor(node));
            //					}
            //				}
            //			}
        };
        SilzAstar.prototype.getColor = function (node) {
            if (!node.walkable)
                return 0;
            if (node == this._grid.startNode)
                return 0xcccccc;
            if (node == this._grid.endNode)
                return 0xcccccc;
            return 0xffffff;
        };
        /**
         * 寻路方式，8方向和4方向，有效值为8和4
         */
        SilzAstar.WorkMode = 8;
        return SilzAstar;
    }());
    d5power.SilzAstar = SilzAstar;
    __reflect(SilzAstar.prototype, "d5power.SilzAstar");
    var AStar = (function () {
        function AStar(grid) {
            this._straightCost = 1.0;
            this._diagCost = Math.SQRT2;
            this.nowversion = 1;
            this.TwoOneTwoZero = 2 * Math.cos(Math.PI / 3);
            this._grid = grid;
            this.heuristic = this.euclidian2;
        }
        AStar.prototype.justMin = function (x, y) {
            return x.f < y.f;
        };
        AStar.prototype.findPath = function () {
            this._endNode = this._grid.endNode;
            this.nowversion++;
            this._startNode = this._grid.startNode;
            //_open = [];
            this._open = new BinaryHeap(this.justMin);
            this._startNode.g = 0;
            return this.search();
        };
        AStar.prototype.floyd = function () {
            if (this.path == null)
                return;
            this._floydPath = this.path.concat();
            var len = this._floydPath.length;
            if (len > 2) {
                var vector = new SilzAstarNode(0, 0);
                var tempVector = new SilzAstarNode(0, 0);
                this.floydVector(vector, this._floydPath[len - 1], this._floydPath[len - 2]);
                for (var i = this._floydPath.length - 3; i >= 0; i--) {
                    this.floydVector(tempVector, this._floydPath[i + 1], this._floydPath[i]);
                    if (vector.x == tempVector.x && vector.y == tempVector.y) {
                        this._floydPath.splice(i + 1, 1);
                    }
                    else {
                        vector.x = tempVector.x;
                        vector.y = tempVector.y;
                    }
                }
            }
            len = this._floydPath.length;
            for (i = len - 1; i >= 0; i--) {
                for (var j = 0; j <= i - 2; j++) {
                    if (this.floydCrossAble(this._floydPath[i], this._floydPath[j])) {
                        for (var k = i - 1; k > j; k--) {
                            this._floydPath.splice(k, 1);
                        }
                        i = j;
                        len = this._floydPath.length;
                        break;
                    }
                }
            }
        };
        AStar.prototype.floydCrossAble = function (n1, n2) {
            var ps = this.bresenhamNodes(new egret.Point(n1.x, n1.y), new egret.Point(n2.x, n2.y));
            for (var i = ps.length - 2; i > 0; i--) {
                if (!this._grid.getNode(ps[i].x, ps[i].y).walkable) {
                    return false;
                }
            }
            return true;
        };
        AStar.prototype.bresenhamNodes = function (p1, p2) {
            var steep = Math.abs(p2.y - p1.y) > Math.abs(p2.x - p1.x);
            if (steep) {
                var temp = p1.x;
                p1.x = p1.y;
                p1.y = temp;
                temp = p2.x;
                p2.x = p2.y;
                p2.y = temp;
            }
            var stepX = p2.x > p1.x ? 1 : (p2.x < p1.x ? -1 : 0);
            var stepY = p2.y > p1.y ? 1 : (p2.y < p1.y ? -1 : 0);
            var deltay = (p2.y - p1.y) / Math.abs(p2.x - p1.x);
            var ret = [];
            var nowX = p1.x + stepX;
            var nowY = p1.y + deltay;
            if (steep) {
                ret.push(new egret.Point(p1.y, p1.x));
            }
            else {
                ret.push(new egret.Point(p1.x, p1.y));
            }
            while (nowX != p2.x) {
                var fy = Math.floor(nowY);
                var cy = Math.ceil(nowY);
                if (steep) {
                    ret.push(new egret.Point(fy, nowX));
                }
                else {
                    ret.push(new egret.Point(nowX, fy));
                }
                if (fy != cy) {
                    if (steep) {
                        ret.push(new egret.Point(cy, nowX));
                    }
                    else {
                        ret.push(new egret.Point(nowX, cy));
                    }
                }
                nowX += stepX;
                nowY += deltay;
            }
            if (steep) {
                ret.push(new egret.Point(p2.y, p2.x));
            }
            else {
                ret.push(new egret.Point(p2.x, p2.y));
            }
            return ret;
        };
        AStar.prototype.floydVector = function (target, n1, n2) {
            target.x = n1.x - n2.x;
            target.y = n1.y - n2.y;
        };
        AStar.prototype.search = function () {
            var node = this._startNode;
            node.version = this.nowversion;
            while (node != this._endNode) {
                var len = node.links.length;
                for (var i = 0; i < len; i++) {
                    var test = node.links[i].node;
                    var cost = node.links[i].cost;
                    var g = node.g + cost;
                    var h = this.heuristic(test);
                    var f = g + h;
                    if (test.version == this.nowversion) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = node;
                        }
                    }
                    else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                        this._open.ins(test);
                        test.version = this.nowversion;
                    }
                }
                if (this._open.a.length == 1) {
                    return false;
                }
                node = (this._open.pop());
            }
            this.buildPath();
            return true;
        };
        AStar.prototype.buildPath = function () {
            this._path = [];
            var node = this._endNode;
            this._path.push(node);
            while (node != this._startNode) {
                node = node.parent;
                this._path.unshift(node);
            }
        };
        Object.defineProperty(AStar.prototype, "path", {
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AStar.prototype, "floydPath", {
            get: function () {
                return this._floydPath;
            },
            enumerable: true,
            configurable: true
        });
        AStar.prototype.manhattan = function (node) {
            return Math.abs(node.x - this._endNode.x) + Math.abs(node.y - this._endNode.y);
        };
        AStar.prototype.manhattan2 = function (node) {
            var dx = Math.abs(node.x - this._endNode.x);
            var dy = Math.abs(node.y - this._endNode.y);
            return dx + dy + Math.abs(dx - dy) / 1000;
        };
        AStar.prototype.euclidian = function (node) {
            var dx = node.x - this._endNode.x;
            var dy = node.y - this._endNode.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        AStar.prototype.chineseCheckersEuclidian2 = function (node) {
            var y = node.y / this.TwoOneTwoZero;
            var x = node.x + node.y / 2;
            var dx = x - this._endNode.x - this._endNode.y / 2;
            var dy = y - this._endNode.y / this.TwoOneTwoZero;
            return this.sqrt(dx * dx + dy * dy);
        };
        AStar.prototype.sqrt = function (x) {
            return Math.sqrt(x);
        };
        AStar.prototype.euclidian2 = function (node) {
            var dx = node.x - this._endNode.x;
            var dy = node.y - this._endNode.y;
            return dx * dx + dy * dy;
        };
        AStar.prototype.diagonal = function (node) {
            var dx = Math.abs(node.x - this._endNode.x);
            var dy = Math.abs(node.y - this._endNode.y);
            var diag = Math.min(dx, dy);
            var straight = dx + dy;
            return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
        };
        return AStar;
    }());
    d5power.AStar = AStar;
    __reflect(AStar.prototype, "d5power.AStar");
    var BinaryHeap = (function () {
        function BinaryHeap(justMinFun) {
            if (justMinFun === void 0) { justMinFun = null; }
            this.a = [];
            this.justMinFun = function (x, y) {
                return this.x < this.y;
            };
            this.a.push(-1);
            if (justMinFun != null)
                this.justMinFun = justMinFun;
        }
        BinaryHeap.prototype.ins = function (value) {
            var p = this.a.length;
            this.a[p] = value;
            var pp = p >> 1;
            while (p > 1 && this.justMinFun(this.a[p], this.a[pp])) {
                var temp = this.a[p];
                this.a[p] = this.a[pp];
                this.a[pp] = temp;
                p = pp;
                pp = p >> 1;
            }
        };
        BinaryHeap.prototype.pop = function () {
            var min = this.a[1];
            this.a[1] = this.a[this.a.length - 1];
            this.a.pop();
            var p = 1;
            var l = this.a.length;
            var sp1 = p << 1;
            var sp2 = sp1 + 1;
            while (sp1 < l) {
                if (sp2 < l) {
                    var minp = this.justMinFun(this.a[sp2], this.a[sp1]) ? sp2 : sp1;
                }
                else {
                    minp = sp1;
                }
                if (this.justMinFun(this.a[minp], this.a[p])) {
                    var temp = this.a[p];
                    this.a[p] = this.a[minp];
                    this.a[minp] = temp;
                    p = minp;
                    sp1 = p << 1;
                    sp2 = sp1 + 1;
                }
                else {
                    break;
                }
            }
            return min;
        };
        return BinaryHeap;
    }());
    d5power.BinaryHeap = BinaryHeap;
    __reflect(BinaryHeap.prototype, "d5power.BinaryHeap");
    var Grid = (function () {
        function Grid(numCols, numRows) {
            this._straightCost = 1.0;
            this._diagCost = Math.SQRT2;
            this._numCols = numCols;
            this._numRows = numRows;
            this._nodes = new Array();
            for (var i = 0; i < this._numCols; i++) {
                this._nodes[i] = new Array();
                for (var j = 0; j < this._numRows; j++) {
                    this._nodes[i][j] = new SilzAstarNode(i, j);
                }
            }
        }
        /**
         *
         * @param   type    0四方向 1八方向 2跳棋
         */
        Grid.prototype.calculateLinks = function (type) {
            if (type === void 0) { type = 0; }
            this.type = type;
            for (var i = 0; i < this._numCols; i++) {
                for (var j = 0; j < this._numRows; j++) {
                    this.initNodeLink(this._nodes[i][j], type);
                }
            }
        };
        Grid.prototype.getType = function () {
            return this.type;
        };
        /**
         *
         * @param   node
         * @param   type    0八方向 1四方向 2跳棋
         */
        Grid.prototype.initNodeLink = function (node, type) {
            var startX = Math.max(0, node.x - 1);
            var endX = Math.min(this.numCols - 1, node.x + 1);
            var startY = Math.max(0, node.y - 1);
            var endY = Math.min(this.numRows - 1, node.y + 1);
            node.links = [];
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    var test = this.getNode(i, j);
                    if (test == node || !test.walkable) {
                        continue;
                    }
                    if (type != 2 && i != node.x && j != node.y) {
                        var test2 = this.getNode(node.x, j);
                        if (!test2.walkable) {
                            continue;
                        }
                        test2 = this.getNode(i, node.y);
                        if (!test2.walkable) {
                            continue;
                        }
                    }
                    var cost = this._straightCost;
                    if (!((node.x == test.x) || (node.y == test.y))) {
                        if (type == 1) {
                            continue;
                        }
                        if (type == 2 && (node.x - test.x) * (node.y - test.y) == 1) {
                            continue;
                        }
                        if (type == 2) {
                            cost = this._straightCost;
                        }
                        else {
                            cost = this._diagCost;
                        }
                    }
                    node.links.push(new Link(test, cost));
                }
            }
        };
        Grid.prototype.nodeValuable = function (x, y) {
            if (!this._nodes || !this._nodes[x] || !this._nodes[x][y])
                return false;
            return true;
        };
        Grid.prototype.getNode = function (x, y) {
            return this._nodes[x][y];
        };
        Grid.prototype.setEndNode = function (x, y) {
            this._endNode = this._nodes[x][y];
        };
        Grid.prototype.setStartNode = function (x, y) {
            this._startNode = this._nodes[x][y];
        };
        Grid.prototype.setWalkable = function (x, y, value) {
            this._nodes[x][y].walkable = value;
        };
        Object.defineProperty(Grid.prototype, "endNode", {
            get: function () {
                return this._endNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "numCols", {
            get: function () {
                return this._numCols;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "numRows", {
            get: function () {
                return this._numRows;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "startNode", {
            get: function () {
                return this._startNode;
            },
            enumerable: true,
            configurable: true
        });
        return Grid;
    }());
    d5power.Grid = Grid;
    __reflect(Grid.prototype, "d5power.Grid");
    var Link = (function () {
        function Link(node, cost) {
            this.node = node;
            this.cost = cost;
        }
        return Link;
    }());
    d5power.Link = Link;
    __reflect(Link.prototype, "d5power.Link");
    var SilzAstarNode = (function () {
        //public var index:int;
        function SilzAstarNode(x, y) {
            this.walkable = true;
            //public var costMultiplier:Number = 1.0;
            this.version = 1;
            this.x = x;
            this.y = y;
        }
        SilzAstarNode.prototype.toString = function () {
            return "x:" + this.x + " y:" + this.y;
        };
        return SilzAstarNode;
    }());
    d5power.SilzAstarNode = SilzAstarNode;
    __reflect(SilzAstarNode.prototype, "d5power.SilzAstarNode");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var BoneCharacter = (function (_super) {
        __extends(BoneCharacter, _super);
        function BoneCharacter(map) {
            var _this = _super.call(this, map) || this;
            _this._waitAction = -1;
            return _this;
        }
        BoneCharacter.prototype.run = function (t) {
            if (this._targetPoint) {
                var radian = d5power.GMath.getPointAngle(this._targetPoint.x - this._pos.x, this._targetPoint.y - this._pos.y);
                var angle = d5power.GMath.R2A(radian) + 90;
                if (this._faceAngle != angle) {
                    this.faceAngle = angle;
                }
                var xisok = false;
                var yisok = false;
                var xspeed = this.speed * Math.cos(radian);
                var yspeed = this.speed * Math.sin(radian);
                if (Math.abs(this._pos.x - this._targetPoint.x) <= 1) {
                    xisok = true;
                    xspeed = 0;
                }
                if (Math.abs(this._pos.y - this._targetPoint.y) <= 1) {
                    yisok = true;
                    yspeed = 0;
                }
                this.setPos(this._pos.x + xspeed, this._pos.y + yspeed);
                if (xisok && yisok) {
                    // 走到新的位置点 更新区块坐标
                    this._targetPoint = null;
                    this.action = d5power.Actions.Wait;
                }
            }
            this.updatePos();
        };
        BoneCharacter.prototype.move2Tile = function (tx, ty) {
            tx = Math.ceil(tx);
            ty = Math.ceil(ty);
            var p = this._map.tile2WorldPostion(tx, ty);
            if (this._targetPoint) {
                this._targetPoint.x = p.x;
                this._targetPoint.y = p.y;
            }
            else {
                this._targetPoint = new egret.Point(p.x, p.y);
            }
            this.action = d5power.Actions.Run;
        };
        BoneCharacter.prototype.setSkin = function (path, onReady, thisobj) {
            var that = this;
            var onTexture = function (data) {
                if (data == null) {
                    onReady.apply(thisobj, null);
                }
                else {
                    that._texture = data;
                    RES.getResByUrl(path + 'tex.json', onTextureData, this);
                }
            };
            var onTextureData = function (data) {
                if (data == null) {
                    onReady.apply(thisobj, null);
                }
                else {
                    that._texture_data = data;
                    RES.getResByUrl(path + 'ske.json', onData, this);
                }
            };
            var onData = function (data) {
                if (data == null) {
                    onReady.apply(thisobj, null);
                }
                else {
                    that._data = data;
                    that._onReady = onReady;
                    that._onReady_obj = thisobj;
                    this.setup();
                }
            };
            if (path.substr(-1) != '/')
                path += '/';
            RES.getResByUrl(path + 'tex.png', onTexture, this);
        };
        BoneCharacter.prototype.setup = function () {
            if (this._factory)
                this._factory.dispose();
            if (this._monitor) {
                this._monitor.parent.removeChild(this._monitor);
                this._monitor.dispose();
            }
            this._factory = new dragonBones.EgretFactory();
            this._factory.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(this._data));
            this._factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(this._texture, this._texture_data));
            this._monitor = this._factory.buildArmatureDisplay("armatureName");
            if (this._texture_data.scale) {
                this._monitor.scaleX = this._monitor.scaleY = this._texture_data.scale;
            }
            this.setPos(this._pos.x, this._pos.y);
            this.faceAngle = this._faceAngle;
            this._onReady.apply(this._onReady_obj, [this]);
            if (this._waitAction != -1)
                this.action = this._waitAction;
        };
        Object.defineProperty(BoneCharacter.prototype, "action", {
            set: function (v) {
                if (!this._monitor) {
                    this._waitAction = v;
                    return;
                }
                this._monitor.animation.play('action' + v);
                this._waitAction = -1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoneCharacter.prototype, "faceAngle", {
            /**
             * 根据角度值修改角色的方向
             * @param   angle   角度
             */
            set: function (angle) {
                this._faceAngle = angle;
                if (!this._monitor)
                    return;
                var s = Math.abs(this._monitor.scaleX);
                if (angle < -22.5)
                    angle += 360;
                if (angle >= -22.5 && angle < 22.5) {
                }
                else if (angle >= 22.5 && angle < 67.5) {
                    this._monitor.scaleX = s * -1;
                }
                else if (angle >= 67.5 && angle < 112.5) {
                    this._monitor.scaleX = s * -1;
                }
                else if (angle >= 112.5 && angle < 157.5) {
                    this._monitor.scaleX = s * -1;
                }
                else if (angle >= 157.5 && angle < 202.5) {
                }
                else if (angle >= 202.5 && angle < 247.5) {
                    this._monitor.scaleX = s;
                }
                else if (angle >= 247.5 && angle < 292.5) {
                    this._monitor.scaleX = s;
                }
                else {
                    this._monitor.scaleX = s;
                }
            },
            enumerable: true,
            configurable: true
        });
        return BoneCharacter;
    }(d5power.GameObject));
    d5power.BoneCharacter = BoneCharacter;
    __reflect(BoneCharacter.prototype, "d5power.BoneCharacter");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var FrameCharacter = (function (_super) {
        __extends(FrameCharacter, _super);
        function FrameCharacter(map) {
            var _this = _super.call(this, map) || this;
            _this._action = 0;
            _this._dir = 0;
            _this._playFrame = 0;
            _this._lastTimer = 0;
            _this._data_renderTime = 0;
            _this._data_totalFrame = 0;
            _this._data_totalDir = 0;
            _this._offX = 0;
            _this._offY = 0;
            _this._monitor = new egret.Bitmap();
            return _this;
        }
        /**
         * 增加挂件
         */
        FrameCharacter.prototype.addDisplayPlugin = function (obj, offX, offY) {
            if (offX === void 0) { offX = 0; }
            if (offY === void 0) { offY = 0; }
            var data = new d5power.DisplayPluginData();
            data.offX = offX;
            data.offY = offY;
            data.obj = obj;
            this._plugin_list.push(data);
            if (this._monitor.parent) {
            }
            else {
            }
        };
        /**
         * 移动到某一个Tile
         */
        FrameCharacter.prototype.move2Tile = function (tx, ty) {
            tx = Math.ceil(tx);
            ty = Math.ceil(ty);
            var p = this._map.tile2WorldPostion(tx, ty);
            if (this._targetPoint) {
                this._targetPoint.x = p.x;
                this._targetPoint.y = p.y;
            }
            else {
                this._targetPoint = new egret.Point(p.x, p.y);
            }
            this.action = d5power.Actions.Run;
        };
        Object.defineProperty(FrameCharacter.prototype, "dir", {
            set: function (v) {
                if (v == this._dir)
                    return;
                this._dir = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameCharacter.prototype, "monitor", {
            get: function () {
                return this._monitor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameCharacter.prototype, "action", {
            set: function (v) {
                if (!this._skin || this._skin == null || v == this._action)
                    return;
                if (this._sheet == null) {
                    this._sheet = d5power.D5SpriteSheet.getInstance(this._skin + v, this);
                }
                else {
                    this._sheet = d5power.D5SpriteSheet.getInstance(this._skin + v, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        FrameCharacter.prototype.setSkin = function (path) {
            var index = path.lastIndexOf('/');
            var action = path.substr(index + 1);
            path = path.substr(0, index) + '/';
            this._skin = path;
            if (parseInt(action) > 0) {
                // 包含动作
                this.action = parseInt(action);
            }
            else {
                this.action = d5power.Actions.Wait;
            }
        };
        FrameCharacter.prototype.onSpriteSheepReady = function (data) {
            this._data_renderTime = data.renderTime;
            this._data_totalFrame = data.totalFrame;
            this._data_totalDir = data.totalDirection;
            this.render(egret.getTimer());
        };
        FrameCharacter.prototype.run = function (t) {
            _super.prototype.run.call(this, t);
            if (this._targetPoint) {
                var radian = d5power.GMath.getPointAngle(this._targetPoint.x - this._pos.x, this._targetPoint.y - this._pos.y);
                var angle = d5power.GMath.R2A(radian) + 90;
                if (this._faceAngle != angle) {
                    this.faceAngle = angle;
                }
                var xisok = false;
                var yisok = false;
                var xspeed = this.speed * Math.cos(radian);
                var yspeed = this.speed * Math.sin(radian);
                if (Math.abs(this._pos.x - this._targetPoint.x) <= 1) {
                    xisok = true;
                    xspeed = 0;
                }
                if (Math.abs(this._pos.y - this._targetPoint.y) <= 1) {
                    yisok = true;
                    yspeed = 0;
                }
                this.setPos(this._pos.x + xspeed, this._pos.y + yspeed);
                if (xisok && yisok) {
                    // 走到新的位置点 更新区块坐标
                    this._targetPoint = null;
                    this.action = d5power.Actions.Wait;
                }
            }
        };
        FrameCharacter.prototype.render = function (t) {
            if (!this._sheet || t - this._lastTimer < this._sheet.renderTime)
                return;
            this._lastTimer = t;
            var direction = this._dir;
            if (this._playFrame >= this._sheet.totalFrame)
                this._playFrame = 0;
            if (this._dir <= 4) {
                if (this._sheet.totalDirection == 1) {
                    direction = 0;
                    this._monitor.texture = this._sheet.getTexture(direction, this._playFrame);
                }
                else if (this._sheet.totalDirection == 4) {
                    if (direction == 1 || direction == 2 || direction == 3) {
                        direction = 1;
                    }
                    this._monitor.texture = this._sheet.getTexture(direction, this._playFrame);
                }
                else {
                    this._monitor.texture = this._sheet.getTexture(direction, this._playFrame);
                }
                this._monitor.scaleX = 1;
                if (this._sheet.uvList) {
                    this._offX = this._sheet.uvList[direction * this._sheet.totalFrame + this._playFrame].offX;
                    this._offY = this._sheet.uvList[direction * this._sheet.totalFrame + this._playFrame].offY;
                }
                else {
                    this._offX = this._sheet.gX;
                    this._offY = this._sheet.gY;
                }
            }
            else {
                if (this._sheet.totalDirection == 1) {
                    direction = 0;
                    this._monitor.texture = this._sheet.getTexture(direction, this._playFrame);
                }
                else if (this._sheet.totalDirection == 4) {
                    direction = 1;
                    this._monitor.texture = this._sheet.getTexture(direction, this._playFrame);
                }
                else {
                    direction = 8 - this._dir;
                    this._monitor.texture = this._sheet.getTexture(direction, this._playFrame);
                }
                this._monitor.scaleX = -1;
                if (this._sheet.uvList) {
                    this._offX = -this._sheet.uvList[direction * this._sheet.totalFrame + this._playFrame].offX;
                    this._offY = this._sheet.uvList[direction * this._sheet.totalFrame + this._playFrame].offY;
                }
                else {
                    this._offX = -this._sheet.gX;
                    this._offY = this._sheet.gY;
                }
            }
            this._playFrame++;
            this.updatePos(this._offX, this._offY);
            /*
            if(this._data.action == d5power.Actions.Attack)
            {
                if(this._playFrame==0 && this._flag)
                {
                    this._data.setAction(d5power.Actions.Wait);
                    this._flag = false;
                }
                if(this._playFrame+1>=this._sheet.totalFrame && !this._flag)
                {
                    this['atkfun']();
                    this._flag = true;
                }
            }
            */
        };
        Object.defineProperty(FrameCharacter.prototype, "faceAngle", {
            /**
             * 根据角度值修改角色的方向
             * @param   angle   角度
             */
            set: function (angle) {
                this._faceAngle = angle;
                if (angle < -22.5)
                    angle += 360;
                if (angle >= -22.5 && angle < 22.5) {
                    this._dir = d5power.Direction.Up;
                }
                else if (angle >= 22.5 && angle < 67.5) {
                    this._dir = d5power.Direction.RightUp;
                }
                else if (angle >= 67.5 && angle < 112.5) {
                    this._dir = d5power.Direction.Right;
                }
                else if (angle >= 112.5 && angle < 157.5) {
                    this._dir = d5power.Direction.RightDown;
                }
                else if (angle >= 157.5 && angle < 202.5) {
                    this._dir = d5power.Direction.Down;
                }
                else if (angle >= 202.5 && angle < 247.5) {
                    this._dir = d5power.Direction.LeftDown;
                }
                else if (angle >= 247.5 && angle < 292.5) {
                    this._dir = d5power.Direction.Left;
                }
                else {
                    this._dir = d5power.Direction.LeftUp;
                }
            },
            enumerable: true,
            configurable: true
        });
        return FrameCharacter;
    }(d5power.GameObject));
    d5power.FrameCharacter = FrameCharacter;
    __reflect(FrameCharacter.prototype, "d5power.FrameCharacter", ["d5power.ISpriteSheetWaiter"]);
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var D5Game = (function () {
        function D5Game() {
        }
        /**
         * 游戏中的每“米”对应程序中的像素值
         */
        D5Game.MI = 50;
        /**
         * 游戏资源服务器，留空则为本地素材相对路径
         */
        D5Game.RES_SERVER = '';
        /**
         * 游戏资源的保存目录
         */
        D5Game.ASSET_PATH = 'resource/assets/';
        D5Game.screenWidth = 1280;
        D5Game.screenHeight = 800;
        D5Game.timer = 0;
        D5Game.FPS = 45;
        return D5Game;
    }());
    d5power.D5Game = D5Game;
    __reflect(D5Game.prototype, "d5power.D5Game");
})(d5power || (d5power = {}));
var d5power;
(function (d5power) {
    var D5World = (function () {
        function D5World(container, map, camera) {
            this._intervalID = -1;
            D5World._that = this;
            this._objList = [];
            this._container = container;
            this._farLayer = new egret.DisplayObjectContainer();
            this._groundLayer = new egret.DisplayObjectContainer();
            this._lowLayer = new egret.DisplayObjectContainer();
            this._middleLayer = new egret.DisplayObjectContainer();
            this._topLayer = new egret.DisplayObjectContainer();
            container.addChild(this._farLayer);
            container.addChild(this._groundLayer);
            container.addChild(this._lowLayer);
            container.addChild(this._middleLayer);
            container.addChild(this._topLayer);
            this.map = map;
            this.camera = camera;
        }
        D5World.prototype.start = function () {
            if (!this._map || !this._camera)
                return;
            if (this._intervalID != -1)
                return;
            this._intervalID = setInterval(this.run, Math.floor(1000 / d5power.D5Game.FPS));
        };
        Object.defineProperty(D5World.prototype, "map", {
            set: function (map) {
                map.setContainer(this._groundLayer);
                this._map = map;
                this.start();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(D5World.prototype, "camera", {
            set: function (camera) {
                this._camera = camera;
                this.start();
            },
            enumerable: true,
            configurable: true
        });
        D5World.prototype.addObject = function (obj) {
            if (this._objList.indexOf(obj) == -1)
                return;
            this._objList.push(obj);
            this._middleLayer.addChild(obj.monitor);
        };
        D5World.prototype.run = function () {
            var that = D5World._that;
            var t = egret.getTimer();
            var obj;
            for (var i = that._objList.length - 1; i >= 0; i--) {
                obj = that._objList[i];
                obj.run(t);
            }
            for (var i = that._objList.length - 1; i >= 0; i--) {
                obj = that._objList[i];
                obj.render(t);
            }
            that._camera.update();
            that._map.render();
        };
        return D5World;
    }());
    d5power.D5World = D5World;
    __reflect(D5World.prototype, "d5power.D5World");
})(d5power || (d5power = {}));
