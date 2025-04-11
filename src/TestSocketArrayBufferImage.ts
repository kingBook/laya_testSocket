const { regClass, property } = Laya;
import Socket = Laya.Socket;
import Event = Laya.Event;

@regClass()
export class TestSocketArrayBufferImage extends Laya.Script {
    private socket: Laya.Socket;

    onEnable(): void {
        this.socket = new Laya.Socket();
        this.socket.connectByUrl("wss://echo.websocket.org:443");
        this.socket.on(Laya.Event.OPEN, this, this.onSocketOpen);
        this.socket.on(Laya.Event.MESSAGE, this, this.onMessageReceived);
        this.socket.on(Laya.Event.ERROR, this, this.onConnectError);
    }

    private onSocketOpen(): void {
        console.log("Socket 已连接");
        /** 一个二进制图片资源路径（本地或在线），请自行替换本地二进制图片路径，
         * 或从官网下载示例图片(路径：https://layaair.com/3.x/demo/resources/res/test.bin)
         */
        const imageUrl = "resources/res/test.bin";
        // 加载二进制图片文件
        Laya.loader.fetch(imageUrl, "arraybuffer").then((arrayBuffer: ArrayBuffer) => {
            // 直接发送加载后的 ArrayBuffer 数据
            this.socket.send(arrayBuffer);
            console.log("发送 ArrayBuffer 数据", arrayBuffer);
        });
    }
    private onMessageReceived(message: any): void {
        if (message instanceof ArrayBuffer) {
            console.log("收到 ArrayBuffer 数据", message);
            
            // 跳过用于加密的前4个字节，只处理有效数据，如果资源没有加密，第二个参数可以不写。
            const uint8Array = new Uint8Array(message, 4);
            
            // 将 ArrayBuffer 转换为图片数据并加载到 LayaAir 引擎中
            const img = new Laya.Image();
            img.size(110, 145); // 设置图片显示大小
            img.skin = Laya.Browser.window.URL.createObjectURL(new Blob([uint8Array], { type: 'image/png' }));
            img.centerX = 0; // 设置图片居中显示

            // 将图片添加到舞台显示
            Laya.stage.addChild(img);
        } else {
            console.log("收到数据:", message);
        }
    }

    private onConnectError(): void {
        console.log("Connection Error");
    }
}