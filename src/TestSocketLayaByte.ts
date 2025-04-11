const { regClass, property } = Laya;

@regClass()
export class TestSocketLayaByte extends Laya.Script {
    private socket: Laya.Socket;
    private byte: Laya.Byte;

    onEnable() {
        // 创建 Socket 对象
        this.socket = new Laya.Socket();
        //  初始化用于二进制数据处理的 Laya.Byte
        this.byte = new Laya.Byte();
        // 设置字节序为小端模式
        this.byte.endian = Laya.Byte.LITTLE_ENDIAN;

        // 注册事件监听
        this.socket.on(Laya.Event.OPEN, this, this.onSocketOpen);
        this.socket.on(Laya.Event.MESSAGE, this, this.onMessageReceived);
        this.socket.on(Laya.Event.CLOSE, this, this.onSocketClose);
        this.socket.on(Laya.Event.ERROR, this, this.onConnectError);

        // 建立连接（此处使用 connectByUrl 方式，实际可根据需要选择其他方式）
        this.socket.connectByUrl("wss://echo.websocket.org:443");
    }

    // 连接成功回调
    private onSocketOpen(e: any): void {
        console.log("WebSocket 已连接");
        // 按顺序写入数据：一个字节、一个 16 位整数、一个 32 位浮点数、一段字符串
        this.byte.writeByte(99);
        this.byte.writeInt16(2025);
        this.byte.writeFloat32(0.12345672398805618);
        this.byte.writeUTFString("二进制数据示例");

        // 发送时必须传入二进制数据byte.buffer（ArrayBuffer 对象），而非传入 byte 对象
        this.socket.send(this.byte.buffer);
        //清空缓冲区，避免数据残留影响后续操作。
        this.byte.clear();
    }

    // 接收数据回调
    private onMessageReceived(msg: any): void {
        console.log("接收到消息：", msg);

        // 判断消息类型是否为 ArrayBuffer（二进制数据）
        if (msg instanceof ArrayBuffer) {
            // 创建 Laya.Byte 实例，用于操作二进制数据
            let byte = new Laya.Byte();
            // 设置字节序列的字节序
            byte.endian = Laya.Byte.LITTLE_ENDIAN;
            // 将 ArrayBuffer 中的二进制数据写入 Laya.Byte 对象中
            byte.writeArrayBuffer(msg);

            // 重置字节流的位置指针，从0开始读取数据
            byte.pos = 0;

            // 从字节流中读取一个字节（8位）
            let a = byte.getByte();  // 获取一个字节（1个byte）
            // 从字节流中读取一个16位整数（2个字节）
            let b = byte.getInt16();  // 获取一个16位整数
            // 从字节流中读取一个32位浮点数（4个字节）
            let c = byte.getFloat32();  // 获取一个32位浮点数
            // 从字节流中读取一个UTF-8编码的字符串
            let d = byte.getUTFString();  // 获取一个UTF-8字符串

            // 打印解析结果
            console.log("解析结果：", a, b, c, d);
        }
        // 清空 socket 输入流中的数据，确保下次读取是干净的
        this.socket.input.clear();
    }


    // 连接关闭回调
    private onSocketClose(e: any): void {
        console.log("WebSocket 连接已关闭");
    }

    // 连接错误回调
    private onConnectError(e: any): void {
        console.error("WebSocket 连接出错：", e);
    }
}