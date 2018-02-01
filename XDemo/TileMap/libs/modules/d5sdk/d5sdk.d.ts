declare module d5power {
    interface IUserInfoDisplayer {
        update(): void;
    }
}
declare module d5power {
    class D5EffectSpriteSheet implements IDisplayer {
        /**
         * 最大允许回收对象池容量
         */
        static MAX_IN_JALE: number;
        /**
         * 正在使用中的对象
         */
        private static _pool_inuse;
        /**
         * 待重用的对象
         */
        private static _pool_jale;
        /**
         * 加载id
         */
        private loadID;
        /**
         * 连接数量，此对象的引用计数
         */
        private _link;
        /**
         * 资源名
         */
        private _name;
        /**
         * 纹理集
         * 针对多帧素材，如果为单张贴图，此属性为空
         */
        private _sheet;
        /**
         * 原始贴图
         */
        private _texture;
        /**
         * 多帧素材的uv配置
         */
        private _conf;
        /**
         * 渲染时间
         */
        private _renderTime;
        /**
         * 最大帧数
         */
        private _totalFrame;
        /**
         * 影子尺寸
         */
        private _shadowX;
        /**
         * 影子尺寸
         */
        private _shadowY;
        /**
         * 包含的方向数量
         */
        private _totalDirection;
        /**
         * 加载等待列表
         */
        private _waiterList;
        /**
         *
         */
        private _gX;
        /**
         *
         */
        private _gY;
        /**
         *
         */
        private _frameW;
        /**
         *
         */
        private _frameH;
        /**
         *
         */
        private _uvList;
        static getInstance(res: string, getObj: ISpriteSheetWaiter): D5EffectSpriteSheet;
        private static back2pool(data);
        constructor();
        readonly name: string;
        readonly renderTime: number;
        readonly totalFrame: number;
        readonly totalDirection: number;
        readonly shadowX: number;
        readonly shadowY: number;
        readonly gX: number;
        readonly gY: number;
        readonly uvList: Array<any>;
        readonly frameWidth: number;
        readonly frameHeight: number;
        addWaiter(waiter: ISpriteSheetWaiter): void;
        unlink(): void;
        setup(res: string): void;
        getTexture(dir: number, frame: number): egret.Texture;
        private onTextureComplete(data);
        private onConfigComplate(data);
        private onDataComplate(texture);
    }
}
declare module d5power {
    /**
     * 使用要求：必须使用getInstance获得实例，等待onSpriteSheepReady回叫，确保素材加载完毕。
     * 当不再使用时，需要使用unlink断开引用，对象将自动等待重用
     */
    class D5SpriteSheet implements IDisplayer {
        private static _unknow;
        static setupUnknow(res: string, ready?: Function, readyObj?: any): void;
        private static _shadow;
        static setupShadow(res: string, ready?: Function, readyObj?: any): void;
        static readonly shadow: egret.Texture;
        /**
         * 对象池最大容量
         * @type {number}
         */
        static MAX_IN_JALE: number;
        private static _pool_inuse;
        private static _pool_jale;
        private loadID;
        static getInstance(res: string, getObj: ISpriteSheetWaiter): D5SpriteSheet;
        private static back2pool(data);
        private _link;
        private _name;
        private _sheet;
        private _renderTime;
        private _totalFrame;
        private _shadowX;
        private _shadowY;
        private _totalDirection;
        private _waiterList;
        private _gX;
        private _gY;
        private _frameW;
        private _frameH;
        private _uvList;
        constructor();
        readonly name: string;
        readonly renderTime: number;
        readonly totalFrame: number;
        readonly totalDirection: number;
        readonly shadowX: number;
        readonly shadowY: number;
        readonly gX: number;
        readonly gY: number;
        readonly uvList: Array<any>;
        readonly frameWidth: number;
        readonly frameHeight: number;
        addWaiter(waiter: ISpriteSheetWaiter): void;
        setup(res: string): void;
        unlink(): void;
        private onTextureComplete(data);
        getTexture(dir: number, frame: number): egret.Texture;
        private onDataComplate(data);
    }
}
declare module d5power {
    interface IDisplayer {
        /**
         * 渲染

        render():void;
        /**
         * 更换素材

        change(f:string,onloaded:Function=null,frame:number=-1,framebak:Function=null):void;
        /**
         * 是否循环动作

        loop:void
        /**
         * 更换动作接口

        action:void;
        /**
         * 更换方向接口

        direction:void;
        
        /**
         * 获得位图显示对象

        monitor:egret.DisplayObject
        
        shadow:egret.Shape;
        
        renderDirection:number;
        
        effectDirection:number
        
        playFrame:number;
        
        totalFrame:number;
        /**
         * 重置播放帧数

        resetFrame():void;

        dispose();
         */
        getTexture(dir: number, frame: number): egret.Texture;
        setup(res: string): void;
        unlink(): void;
        name: string;
        renderTime: number;
        totalFrame: number;
        totalDirection: number;
        shadowX: number;
        shadowY: number;
        uvList: Array<any>;
        /**
         * 重心坐标X
         */
        gX: number;
        /**
         * 重心坐标Y
         */
        gY: number;
        /**
         * 帧宽
         */
        frameWidth: number;
        /**
         * 帧高
         */
        frameHeight: number;
    }
}
declare module d5power {
    interface ISpriteSheetWaiter {
        onSpriteSheepReady(data: IDisplayer): void;
        loadID: number;
    }
}
declare module d5power {
    interface IUserInfoContainer {
        addDisplayer(ui: IUserInfoDisplayer): void;
        removeDisplayer(ui: IUserInfoDisplayer): void;
        getPro(name: string): any;
    }
}
declare function trace(...args: any[]): void;
declare module d5power {
    /**
     * 用于处理UI素材的贴图数据
     * 本数据仅供D5BitmapUI使用
     * D5Rpg中的贴图数据直接调用Json中的uv对象，未进行结构化
     */
    class UVData {
        /**
         * 贴图的偏移坐标
         */
        offX: number;
        /**
         * 贴图的偏移坐标
         */
        offY: number;
        /**
         * 贴图宽度
         */
        width: number;
        /**
         * 贴图高度
         */
        height: number;
        /**
         * 贴图uv
         */
        u: number;
        /**
         * 贴图uv
         */
        v: number;
        /**
         * 素材宽度
         */
        w: number;
        /**
         * 素材高度
         */
        h: number;
        /**
         * 贴图的起始坐标
         */
        x: number;
        /**
         * 贴图的起始坐标
         */
        y: number;
        /**
         * 格式化数据
         */
        format(data: any): void;
    }
}
declare module d5power {
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
    class Endian {
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
        static LITTLE_ENDIAN: string;
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
        static BIG_ENDIAN: string;
    }
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
    class ByteArray {
        /**
         * @private
         */
        private static SIZE_OF_BOOLEAN;
        /**
         * @private
         */
        private static SIZE_OF_INT8;
        /**
         * @private
         */
        private static SIZE_OF_INT16;
        /**
         * @private
         */
        private static SIZE_OF_INT32;
        /**
         * @private
         */
        private static SIZE_OF_UINT8;
        /**
         * @private
         */
        private static SIZE_OF_UINT16;
        /**
         * @private
         */
        private static SIZE_OF_UINT32;
        /**
         * @private
         */
        private static SIZE_OF_FLOAT32;
        /**
         * @private
         */
        private static SIZE_OF_FLOAT64;
        /**
         * @private
         */
        private BUFFER_EXT_SIZE;
        private data;
        /**
         * @private
         */
        private _position;
        /**
         * @private
         */
        private write_position;
        /**
         * @language en_US
         * Changes or reads the byte order; egret.Endian.BIG_ENDIAN or egret.Endian.LITTLE_ENDIAN.
         * @default egret.Endian.BIG_ENDIAN
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 更改或读取数据的字节顺序；egret.Endian.BIG_ENDIAN 或 egret.Endian.LITTLE_ENDIAN。
         * @default egret.Endian.BIG_ENDIAN
         * @version Egret 2.4
         * @platform Web,Native
         */
        endian: string;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(buffer?: ArrayBuffer);
        /**
         * @private
         * @param buffer
         */
        private _setArrayBuffer(buffer);
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        setArrayBuffer(buffer: ArrayBuffer): void;
        /**
         * @private
         */
        buffer: ArrayBuffer;
        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @private
         */
        dataView: DataView;
        /**
         * @private
         */
        readonly bufferOffset: number;
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
        position: number;
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
        length: number;
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
        readonly bytesAvailable: number;
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
        clear(): void;
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
        readBoolean(): boolean;
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
        readByte(): number;
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
        readBytes(bytes: ByteArray, offset?: number, length?: number): void;
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
        readDouble(): number;
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
        readFloat(): number;
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
        readInt(): number;
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
        readShort(): number;
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
        readUnsignedByte(): number;
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
        readUnsignedInt(): number;
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
        readUnsignedShort(): number;
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
        readUTF(): string;
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
        readUTFBytes(length: number): string;
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
        writeBoolean(value: boolean): void;
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
        writeByte(value: number): void;
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
        writeBytes(bytes: ByteArray, offset?: number, length?: number): void;
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
        writeDouble(value: number): void;
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
        writeFloat(value: number): void;
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
        writeInt(value: number): void;
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
        writeShort(value: number): void;
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
        writeUnsignedInt(value: number): void;
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
        writeUnsignedShort(value: number): void;
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
        writeUTF(value: string): void;
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
        writeUTFBytes(value: string): void;
        /**
         *
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        toString(): string;
        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        _writeUint8Array(bytes: Uint8Array, validateBuffer?: boolean): void;
        /**
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        validate(len: number): boolean;
        /**********************/
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        private validateBuffer(len, needReplace?);
        /**
         * @private
         * UTF-8 Encoding/Decoding
         */
        private encodeUTF8(str);
        /**
         * @private
         *
         * @param data
         * @returns
         */
        private decodeUTF8(data);
        /**
         * @private
         *
         * @param code_point
         */
        private encodertrace(code_point);
        /**
         * @private
         *
         * @param fatal
         * @param opt_code_point
         * @returns
         */
        private decodertrace(fatal, opt_code_point?);
        /**
         * @private
         */
        private EOF_byte;
        /**
         * @private
         */
        private EOF_code_point;
        /**
         * @private
         *
         * @param a
         * @param min
         * @param max
         */
        private inRange(a, min, max);
        /**
         * @private
         *
         * @param n
         * @param d
         */
        private div(n, d);
        /**
         * @private
         *
         * @param string
         */
        private stringToCodePoints(string);
    }
}
/**
 * Created by Administrator on 2015/4/22.
 */
declare module d5power {
    class D5UIResourceData {
        private static _resource;
        private static _resourceLib;
        static _typeLoop: number;
        static setup(path: string, callback: Function, thisobj: any): void;
        static setupResLib(bitmap: egret.Texture, config: any): void;
        static getData(name: string): D5UIResourceData;
        private _resList;
        private _name;
        buttonType: number;
        constructor();
        setupResource(sp: egret.SpriteSheet, name: string, uvData: Array<UVData>): void;
        getResource(id: number): egret.Texture;
        static addResource(id: number, texture: egret.Texture, name?: string): void;
    }
}
declare module d5power {
    class D5LoadData {
        url: string;
        callback: Function;
        thisobj: any;
        inpool: boolean;
    }
}
declare module d5power {
    /**
     * 分步加载器以及资源池
     * @author D5Power Studio
     */
    class StepLoader {
        protected static _pool: any;
        protected static _waitList: Array<D5LoadData>;
        protected static _isLoading: string;
        protected static _loader: URLLoader;
        private static _me;
        static readonly me: StepLoader;
        private static onComplate(loader);
        private static onError(e);
        protected static onProgress(): void;
        protected static loadNext(): void;
        static readonly isLoading: boolean;
        constructor(passwd?: string);
        getResByUrl(url: string): any;
        private _allComplate;
        private _allComplateObj;
        setAllComplate(fun: Function, thisobj?: any): void;
        protected complate(): void;
        /**
         * 新增加载文件
         * @param	url			文件地址
         * @param	compalte	加载结束触发函数
         * @param	thisobj		this
         * @param	isPool		是否入资源池
         */
        addLoad(url: string, complate: Function, thisobj: any, isPool?: boolean): void;
        /**
         * 删除资源
         */
        deleteRes(url: string): void;
    }
}
declare module d5power {
    class URLLoader {
        /**
         * 加载地址
         */
        private _url;
        /**
         * 加载的数据
         */
        private _data;
        private _xhr;
        /**
         * 格式类型
         */
        private _dataformat;
        /**
         * 加载成功后的回叫函数
         */
        onLoadComplete: Function;
        /**
         * 加载失败的回叫函数
         */
        onLoadError: Function;
        /**
         * 加载过程/进度的回叫函数
         */
        onLoadProgress: Function;
        /**
         * 以二进制方式接收加载的数据
         */
        static DATAFORMAT_BINARY: string;
        /**
         * 以文本的方式接收加载的数据
         * 默认方式
         */
        static DATAFORMAT_TEXT: string;
        /**
         * 以音频的方式接收加载的数据
         */
        static DATAFORMAT_SOUND: string;
        /**
         * 以图像的方式接收加载的数据
         * 支持jpg.png.等格式
         */
        static DATAFORMAT_BITMAP: string;
        /**
         * 以JSON的方式接收加载的数据
         *
         */
        static DATAFORMAT_JSON: string;
        /**
         * 构造函数
         * @param url 加载数据的地址.如果参数不为空的话.将直接开始加载
         * @param dataformat 以什么方式进行加载.如果为空的话.将通过目标文件的后缀名判断,
         * 如果为空且文件后缀不为内置支持的集中文件类型的话.将以文本格式进行加载解析
         */
        constructor(url?: string, dataformat?: string);
        /**
         * 加载目标地址的数据
         * @param url 数据地址
         */
        load(url: string): void;
        /**
         * 控制以哪种方式接收加载的数据.
         * 如果未赋值则通过加载文件的后缀名来判断加载的类型以解析.
         * 如果未赋值且加载的类型并非为内置支持的文件类型.将以文本格式进行加载
         */
        /**
         * 控制以哪种方式接收加载的数据.
         * 如果未赋值则通过加载文件的后缀名来判断加载的类型以解析.
         * 如果未赋值且加载的类型并非为内置支持的文件类型.将以文本格式进行加载
         */
        dataformat: string;
        /**
         * 加载的数据.
         */
        readonly data: any;
        /**
         * 加载的地址
         */
        readonly url: string;
        private onReadyStateChange(event);
        private loadComplete();
        private onProgress(event);
        private onError(event);
        private getXHR();
    }
}
