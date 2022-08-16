# WebSocket连接建立

> 内容参考
> - [WebSocket协议（一）- 简介以及连接建立过程](https://timefly.cn/learn-websocket-protocol-1/)

## 什么是WebSocket

WebSocket是HTML5开始提供的一种在单个TCP 连接上进行全双工通讯的协议。

首先WebSocket是一个协议，只要经过一次握手就可以跟WebSocket服务器建立全双工通信的连接，既然是全双工通信，所以连接建立成功之后，客户端可以向服务器端发送数据，服务端也可以主动向客户端推送数据。

> 在WebSocket之前，实现实时更新服务器数据的功能都是通过`轮询`的方式来实现的，这些实现方式有一个共同点，都是`由客户端主动向服务器端发起请求`，轮询的方式就有一个轮询时间间隔的问题，**间隔长了服务端的数据不能及时更新到客户端，间隔短了就会有许多无用的请求，增加服务器压力**

WebSocket是基于TCP协议的通信协议，不是HTTP协议的增强功能，复用HTTP连接。

## 如何建立WebSocket连接

首先建立TCP连接。

```js
const net = require('net');
const crypto = require('crypto');

var wsGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const server = net.createServer(socket => {
  // 说明TCP连接已建立
  console.log('tcp client connected');
  socket.on('data', data => {

  });

  socket.on('end', () => {
    console.log('client disconnected');
  })
})

server.listen(8080, () => {
  console.log('start in: localhost:8080')
});
```

在浏览器中发起请求。

```html
<body>
  <div>learn ws</div>
  <script>
    const ws = new WebSocket('ws://localhost:8080');
  </script>
</body>
```

在服务端控制带看到 tcp client connected 的输出，说明已经建立TCP连接。

建立TCP连接之后，开始建立WebSocket连接，上文说过WebSocket连接只需一次成功握手即可建立。

### 握手过程


![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202208160831672.png)

首先客户端会发送一个握手包。这里就体现出了WebSocket与Http协议的联系，**握手包的报文格式必须符合HTTP报文格式的规范**。

> WebSocket报文格式
> - 方法必须位GET方法
> - HTTP版本不能低于1.1
> - 必须包含Upgrade头部，值必须为websocket
> - 必须包含Sec-WebSocket-Key头部，值是一个Base64编码的16字节随机字符串。
> - 必须包含Sec-WebSocket-Version头部，值必须为13
> - 其他可选首部可以参考：https://tools.ietf.org/html/rfc6455#section-4.1

服务端验证客户端的握手包符合规范之后也会发送一个握手包给客户端。格式如下：

- 必须包含Connection头部，值必须为Upgrade
- 必须包含一个Upgrade头部，值必须为websocket
- 必须包含一个Sec-Websocket-Accept头部，值是根据如下规则计算的：
  - 首先将一个固定的字符串258EAFA5-E914-47DA-95CA-C5AB0DC85B11拼接到Sec-WebSocket-Key对应值的后面。
  - 对拼接后的字符串进行一次SHA-1计算
  - 将计算结果进行Base-64编码

3）客户端收到服务端的握手包之后，验证报文格式时候符合规范，以2）中同样的方式计算Sec-WebSocket-Accept并与服务端握手包里的值进行比对。

代码如下：

```js
const net = require('net');
const crypto = require('crypto');

var wsGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

const server = net.createServer(socket => {
  // 说明TCP连接已建立
  console.log('tcp client connected');
  socket.on('data', data => {
    const dataString = data.toString();
    // 匹配Sec-WebSocket-Key字段
    // 判断是否是websocket协议切换握手包
    const key = getWebSocketKey(dataString);
    if (key) {
      console.log('dataString:', dataString)
      const acceptKey = genAcceptKey(key);
      socket.write('HTTP/1.1 101 Switching Protocols\r\n');
      socket.write('Upgrade: websocket\r\n');
      socket.write('Connection: Upgrade\r\n');
      socket.write('Sec-WebSocket-Accept: ' + acceptKey + '\r\n');
      // 协议中规定需要以空行结尾，才符合规范
      socket.write('\r\n');
    }
  });

  socket.on('end', () => {
    console.log('client disconnected');
  })
})

server.listen(8080, () => {
  console.log('start in: localhost:8080')
});


function getWebSocketKey(dataString) {
  const match = dataString.match(/Sec\-WebSocket\-Key:\s(.+)\r\n/);
  if (match) {
    return match[1];
  }
  return null;
}

function genAcceptKey(webSocketKey) {
  return crypto.createHash('sha1').update(webSocketKey + wsGUID).digest('base64');
}
```

```html
<body>
  <div>learn ws</div>
  <script>
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = function () {
      console.info('connected');
    };
  </script>
</body>
```

## WebSocket和HTTP的关系

通过建立连接这个过程，我们可以思考下WebSocket与HTTP服务的关系。

WebSocket和HTTP都是基于TCP协议，我们这个Demo出于学习的目的只是实现WebSocket协议，实际应用中**WebSocket服务与HTTP服务应该在同一个TCP服务之上，同一个host，同一个port。**

客户端握手包中的Upgrade头部、以及服务端握手包的101状态码，以及头部结束后要有一个空行，这些都是在HTTP协议中有定义过的:

- Upgrade头部：https://tools.ietf.org/html/rfc2616#section-14.42 客户端希望通过另一种协议进行通信，希望服务端进行协议转换。
- 101状态码：https://tools.ietf.org/html/rfc2616#section-10.1.2 服务端理解了客户端的Upgrade头部信息，同意进行协议转换。

**所以说HTTP与WebSocket是存在交集的两个不同的协议，正是这部分交集使我们更方便地在Web应用开发中使用它。**

WebSocket连接建立成功之后就真跟HTTP协议没有什么关系了，之后的数据传输完全就是WebSocket协议的内容了。
