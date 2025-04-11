const { regClass, property } = Laya;

@regClass()
export class TestSocketString extends Laya.Script {
    private socket: Laya.Socket;

    //组件被启用后执行，例如节点被添加到舞台后
    onEnable(): void {
        this.socket = new Laya.Socket();

        // 注册事件监听
        this.socket.on(Laya.Event.OPEN, this, this.onSocketOpen);
        this.socket.on(Laya.Event.MESSAGE, this, this.onMessageReceived);
        this.socket.on(Laya.Event.CLOSE, this, this.onSocketClose);
        this.socket.on(Laya.Event.ERROR, this, this.onConnectError);

        // 建立连接（此处使用 connectByUrl 方式，实际可根据需要选择其他方式）
        this.socket.connectByUrl("wss://echo.websocket.org:443");
    }


    /** 连接成功回调，发送字符串数据 */
    private onSocketOpen(e: any): void {
        console.log("WebSocket 已连接");

        // 发送字符串示例
        this.socket.send("Hello, LayaAir WebSocket!");
    }

    /**  接收数据回调 */
    private onMessageReceived(msg: any): void {
        console.log("接收到消息：");
        if (typeof msg === "string") {
            console.log("文本数据：", msg);
        } else {
            console.log("接收到非字符串数据", msg);
        }
        // 清除输入缓存，避免残留数据
        this.socket.input.clear();
    }

    /** 连接关闭回调 */
    private onSocketClose(e: any): void {
        console.log("WebSocket 连接已关闭", e);
    }

    /** 连接错误回调 */
    private onConnectError(e: any): void {
        console.error("WebSocket 连接出错：", e);
    }


}