const { regClass, property } = Laya;
import Socket = Laya.Socket;
import Event = Laya.Event;

@regClass()
export class TestSocketArrayBuffer extends Laya.Script {
    private socket: Socket;

    onEnable(): void {
        this.socket = new Socket();
        this.socket.connectByUrl("wss://echo.websocket.org:443");

        this.socket.on(Event.OPEN, this, this.onSocketOpen);
        this.socket.on(Event.MESSAGE, this, this.onMessageReceived);
        this.socket.on(Event.ERROR, this, this.onConnectError);
    }

    private onSocketOpen(): void {
        console.log("Socket Connected");

        // 创建一个 ArrayBuffer，大小为 8 字节
        let buffer = new ArrayBuffer(8);
        let view = new DataView(buffer);

        // 写入整数
        view.setInt32(0, 123456, true);  // 小端字节序
        view.setInt32(4, 654321, true);

        // 发送数据
        this.socket.send(buffer);
    }

    private onMessageReceived(message: any): void {
        if (message instanceof ArrayBuffer) {
            // 创建 DataView 来解析 ArrayBuffer
            const view = new DataView(message);
            try {
                // 解析数据
                const num1 = view.getInt32(0, true); // 小端字节序
                const num2 = view.getInt32(4, true);

                // 打印解析结果
                console.log("Received binary data:");
                console.log("Number 1:", num1);
                console.log("Number 2:", num2);
            } catch (error) {
                console.error("Error parsing binary data:", error);
            }
        } else {
            console.log("Received non-binary message:", message);
        }
    }

    private onConnectError(): void {
        console.log("Connection Error");
    }
}