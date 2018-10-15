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
module d5power {
    
    export class D5Socket{
        /**
         * 以字符串格式发送和接收数据
         */
        public static TYPE_STRING:string = "webSocketTypeString";
        /**
         * 以二进制格式发送和接收数据
         */
        public static TYPE_BINARY:string = "webSocketTypeBinary";

        /**
         * @private
         */
        private socket:ISocket;

        /**
         * @private
         */
        private _writeMessage:string = "";
        /**
         * @private
         */
        private _readMessage:string = "";

        /**
         * @private
         */
        private _connected:boolean = false;
        /**
         * @private
         */
        private _connecting:boolean = false;

        private _callback:Function;

        private _callbackObj:any;


        /**
         * 创建一个WebSocket对象
         * 参数为预留参数，现版本暂不处理，连接地址和端口号在 connect 函数中传入
         */
        constructor(callback:Function=null,thisobj:any=null) {
            this._connected = false;
            this._writeMessage = "";
            this._readMessage = "";

            this._callback = callback;
            this._callbackObj = thisobj;

            this.socket = new HTML5WebSocket();
            this.socket.addCallBacks(this.onConnect, this.onClose, this.onSocketData, this.onError, this);
        }
        

        /**
         * 将套接字连接到指定的主机和端口
         * @param host 要连接到的主机的名称或 IP 地址
         * @param port 要连接到的端口号
         */
        public connect(host:string, port:number = 60991,protocols:string|string[]=null):void {
            if(!this._connecting && !this._connected) {
                this._connecting = true;
                this.socket.connect(host, port,protocols);
            }
        }

        /**
         * 根据提供的url连接
         * @param url 全地址。如ws://echo.websocket.org:80
         */
        public connectByUrl(url:string,protocols:string|string[]=null):void {
            if(!this._connecting && !this._connected) {
                this._connecting = true;
                this.socket.connectByUrl(url,protocols);
            }
        }


        /**
         * 关闭套接字
         */
        public close():void {
            if(this._connected) {
                this.socket.close();
            }
        }

        public static CONNECT:string = 'connect';
        public static CLOSE:string = 'close';
        public static IOERROR:string = 'ioerror';
        public static SOCKETDATA:string = 'socketdata';
        /**
         * @private
         * 
         */
        private onConnect():void {
            this._connected = true;
            this._connecting = false;
            
            this._callback.apply(this._callbackObj,[D5Socket.CONNECT]);
        }

        /**
         * @private
         * 
         */
        private onClose():void {
            this._connected = false;
            this._callback.apply(this._callbackObj,[D5Socket.CLOSE]);
        }

        /**
         * @private
         * 
         */
        private onError():void {
            if(this._connecting) {
                this._connecting = false;
            }
            this._callback.apply(this._callbackObj,[D5Socket.IOERROR]);
        }

        /**
         * @private
         * 
         * @param message 
         */
        private onSocketData(message:any):void {
            if (this._type==D5Socket.TYPE_STRING) {
                this._readMessage += message;
            }
            else {
                this._readByte._writeUint8Array(new Uint8Array(message));
            }
            this._callback.apply(this._callbackObj,[D5Socket.SOCKETDATA]);
        }

        private warn(id:number):void
        {
            console.log("D5Socket:"+id);
            
        }

        /**
         * 对套接字输出缓冲区中积累的所有数据进行刷新
         */
        public flush():void {
            if (!this._connected) {
                this.warn(3101);
                return;
            }
            if (this._writeMessage) {
                this.socket.send(this._writeMessage);
                this._writeMessage = "";
            }
            if (this._bytesWrite) {
                this.socket.send(this._writeByte.buffer);
                this._bytesWrite = false;
                this._writeByte.clear();
            }
            this._isReadySend = false;
        }

        /**
         * @private
         */
        private _isReadySend:boolean = false;


        /**
         * 将字符串数据写入套接字
         * @param message 要写入套接字的字符串
         */
        public writeUTF(message:string):void {
            if (!this._connected) {
                this.warn(3101);
                return;
            }
            if (this._type == D5Socket.TYPE_BINARY) {
                this._bytesWrite = true;
                this._writeByte.writeUTF(message);
            }
            else {
                this._writeMessage += message;
            }

            this.flush();
            // return;
            // if (this._isReadySend) {
            //     return;
            // }
            // this._isReadySend = true;
            // egret.callLater(this.flush, this);
        }


        /**
         * 从套接字读取一个 UTF-8 字符串
         * @returns {string}
         */
        public readUTF():string {
            let message:string;
            if (this._type == D5Socket.TYPE_BINARY) {
                this._readByte.position = 0;
                message = this._readByte.readUTF();
                this._readByte.clear();
            }
            else {
                message = this._readMessage;
                this._readMessage = "";
            }
            return message;
        }

        /**
         * @private
         */
        private _readByte:ByteArray
        /**
         * @private
         */
        private _writeByte:ByteArray;
        /**
         * @private
         */
        private _bytesWrite:boolean = false;


        /**
         * 从指定的字节数组写入一系列字节。写入操作从 offset 指定的位置开始。
         * 如果省略了 length 参数，则默认长度 0 将导致该方法从 offset 开始写入整个缓冲区。
         * 如果还省略了 offset 参数，则写入整个缓冲区。
         * @param bytes 要从中读取数据的 ByteArray 对象
         * @param offset ByteArray 对象中从零开始的偏移量，应由此开始执行数据写入
         * @param length 要写入的字节数。默认值 0 导致从 offset 参数指定的值开始写入整个缓冲区
         */
        public writeBytes(bytes:ByteArray, offset:number = 0, length:number = 0):void {
            if (!this._connected) {
                this.warn(3101);
                return;
            }
            if (!this._writeByte) {
                this.warn(3102);
                return;
            }
            this._bytesWrite = true;
            this._writeByte.writeBytes(bytes, offset, length);
            this.flush();
        }


        /**
         * 从套接字读取 length 参数指定的数据字节数。从 offset 所表示的位置开始，将这些字节读入指定的字节数组
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset 数据读取的偏移量应从该字节数组中开始
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         */
        public readBytes(bytes:ByteArray, offset:number = 0, length:number = 0):void {
            if (!this._readByte) {
                this.warn(3102);
                return;
            }
            this._readByte.position = 0;
            this._readByte.readBytes(bytes, offset, length);
            this._readByte.clear();
        }


        /**
         * 表示此 Socket 对象目前是否已连接
         */
        public get connected():boolean {
            return this._connected;
        }

        /**
         * @private
         */
        private _type:string = D5Socket.TYPE_STRING;

        /**
         * 发送和接收数据的格式，默认是字符串格式
         */
        public get type():string {
            return this._type;
        }

        public set type(value:string) {
            this._type = value;
            if (value == D5Socket.TYPE_BINARY && !this._writeByte) {
                this._readByte = new ByteArray();
                this._writeByte = new ByteArray();
            }
        }
    }
}
