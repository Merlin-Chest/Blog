# WebSocket数据帧格式以及服务端数据推送

> 内容参考
> - [【Node】基于HTTP实现简单的WebSocket服务器（处理数据帧格式）](https://zhuanlan.zhihu.com/p/343762053)
> - [WebSocket协议（二）- 数据帧格式以及服务端数据推送](https://www.timefly.cn/learn-websocket-protocol-2/)

WebSocket协议中，数据是`通过数据帧来传递`的，协议规定了数据帧的格式，服务端要想给客户端推送数据，必须将要推送的数据组装成一个数据帧，这样客户端才能接收到正确的数据；同样，服务端接收到客户端发送的数据时，必须按照帧的格式来解包，才能真确获取客户端发来的数据。

## 数据帧格式

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202208160849629.png)

1. FIN

1个bit位，用来标记当前数据帧是不是最后一个数据帧，因为一个消息可能会分成多个数据帧来传递，当然，如果只需要一个数据帧的话，第一个数据帧也就是最后一个。

2. RSV1, RSV2, RSV3

这三个，各占用一个bit位，根据RFC的介绍，这三个bit位是用做扩展用途，没有这个需求的话设置位0。

3. Opcode

故名思议，操作码，占用4个bit位，也就是一个16进制数，它用来描述要传递的数据是什么或者用来干嘛的，只能为下面这些值：

- 0x0 denotes a continuation frame 标示当前数据帧为分片的数据帧，也就是当一个消息需要分成多个数据帧来传送的时候，需要将opcode设置位0x0。
- 0x1 denotes a text frame 标示当前数据帧传递的内容是文本
- 0x2 denotes a binary frame 标示当前数据帧传递的是二进制内容，不要转换成字符串
- 0x8 denotes a connection close 标示请求关闭连接
- 0x9 denotes a ping 标示Ping请求
- 0xA denotes a pong 标示Pong数据包，当收到Ping请求时自动给回一个Pong
- 目前协议中就规定了这么多，0x30x7以及0xB0xF都是预留作为其它用途的。

4. MASK

占用一个bit位，标示数据有没有使用掩码，RFC中有说明，服务端发送给客户端的数据帧不能使用掩码，客户端发送给服务端的数据帧必须使用掩码。

如果一个帧的数据使用了掩码，那么在Maksing-key部分必须是一个32个bit位的掩码，用来给服务端解码数据。

5. Payload len

数据的长度，默认位7个bit位。

如果数据的长度小于125个字节（注意：是字节）则用默认的7个bit来标示数据的长度。

如果数据的长度为126个字节，则用后面相邻的2个字节来保存一个16bit位的无符号整数作为数据的长度。

如果数据的长度大于126个字节，则用后面相邻的8个字节来保存一个64bit位的无符号整数作为数据的长度。

6. Masking-key

数据掩码，如果MASK设置位0，则该部分可以省略，如果MASK设置位1，怎Masking-key位一个32位的掩码。用来解码客户端发送给服务端的数据帧。

7. Payload data

该部分，也是最后一部分，是帧真正要发送的数据，可以是任意长度。

### 解析数据帧

```js
// 当读取socket的数据不足以解析成一个完整的消息时, 存到cacheData, 等待下一次读取socket数据
let cacheData = [];
function decodeDataFrame(socket, data) {
  if (cacheData.length > 0) {
    data = Buffer.concat([cacheData, data]);
    cacheData = [];
  }
  // 数据长度不足以继续解析, 缓存数据
  // 一个Socket数据帧至少2个字节
  if (data.length < 2) {
    cacheData = data;
    return;
  }
  let index = 0;
  const firstByte = data.readUInt8(index++);
  const secondByte = data.readUInt8(index++);
  // 参考数据帧格式图进行理解
  const frame = {
    fin: (firstByte >> 7),
    rsv: (firstByte >> 4) & 0x7,
    opcode: firstByte & 0xf,
    mask: (secondByte >> 7),
    payloadLen: secondByte & 0x7f, // & 01111111
    maskingKey: null,
  }
  if (frame.payloadLen >= 126) {
    // payloadLen等于126，说明后2个字节存储数据长度
    if (frame.payloadLen === 126) {
      // 数据长度不足以继续解析, 缓存数据
      if (data.length < index + 2) {
        cacheData = data;
        return;
      }
      // 使用大端读取方式, 因为TCP数据传输使用的就是大端字节序(网络字节序)
      frame.payloadLen = data.readUInt16BE(index);
      index += 2;
    }
    // payloadLen等于127，说明后8个字节存储数据长度
    if (frame.payloadLen === 127) {
      if (data.length < index + 8) {
        cacheData = data;
        return;
      }
      // 一般情况下, 数据长度不会超过2^32次，所以只读后四个字节即可
      data.readUInt32BE(index);
      index += 4;
      frame.payloadLen = data.readUInt32BE(index);
      index += 4;
    }
  }
  if (frame.mask) {
    // 数据长度不足以继续解析, 缓存数据
    // 4 为掩码数据对应的字节数.
    if (data.length < index + 4 + frame.payloadLen) {
      cacheData = data;
      return;
    }
    const parsedBytes = [];
    // 获取掩码数据
    const maskByte = [data[index++], data[index++], data[index++], data[index++]];
    // 解析数据
    for (let i = 0; i < frame.payloadLen; i++) {
      parsedBytes.push(data[index++] ^ maskByte[i % 4]);
    }
    // 解析完成, 合成数据
    frame.payloadBuffer = Buffer.from(parsedBytes);
  } else {
    // 数据长度不足以继续解析, 缓存数据
    if (data.length < index + frame.payloadLen) {
      cacheData = data;
      return;
    }
    // 截取数据
    frame.payloadBuffer = data.subarray(index, index + frame.payloadLen);
    // 如果还有多余的数据, 继续解析
    if (data.length - index - frame.payloadLen > 0) {
      return Buffer.concat([frame.payloadBuffer, decodeDataFrame(socket, data.subarray(index + frame.payloadLen))]);
    }
  }
  return frame.payloadBuffer;
}
```

### 生成关键帧

```js
function encodeDataFrame(config) {
  const bufArr = [];
  const firstByte = Buffer.alloc(1);
  const secondByte = Buffer.alloc(1);
  bufArr.push(firstByte, secondByte);
  // 往第一个字节写入数据：FIN + rsv1 + rsv2 + rsv3 + opcode
  firstByte.writeUInt8((config.fin << 7) + (config.rsv << 4) + config.opcode);
  // mask + payloadLen
  // 获取要发送的消息体长度
  const payloadLen = config.payloadBuffer.length;
  if (payloadLen > 125) {
    if (payloadLen > 65535) {
      // 2 ^ 7 - 1 = 127 : 01111111 通过最后一位来判断用多少字节存储数据
      // 消息体长度大于65535，需要用8字节表示
      secondByte.writeUInt8((config.mask << 7) + 127); // 头部第二个字节
      const lenByte = Buffer.alloc(8);
      lenByte.writeUInt32BE(0) // 因为4个字节可表示的消息体长度已经达到2^32次, 所以前四个字节设为0, 
      lenByte.writeUInt32BE(payloadLen.length, 4);
      bufArr.push(lenByte);
    } else {
      // 2 ^ 7 - 2 = 126 : 01111110 通过最后一位来判断用多少字节存储数据
      // 消息体长度小于65535，需要用2字节表示
      secondByte.writeUInt8((config.mask << 7) + 126); // 头部第二个字节
      const lenByte = Buffer.alloc(2);
      lenByte.writeUInt16BE(payloadLen.length);
      bufArr.push(lenByte)
    }
  } else {
    // 消息体长度小于125，需要用1字节表示
    secondByte.writeUInt8((config.mask << 7) + payloadLen); // 头部第二个字节
  }
  // 服务器消息不需要掩码
  // payloadData
  bufArr.push(config.payloadBuffer);
  return Buffer.concat(bufArr);
}
```


## 服务端推送数据

客户端代码：

```html
<body>
  <div>learn ws</div>
  <script>
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = function () {
      console.info('connected');
      // 连接完成后, 向服务器发送数据
      ws.send(JSON.stringify({
        msg: 'hello ws!'
      }));
    };
    ws.onmessage = (msg) => {
      console.info(JSON.parse(msg.data));
    }
  </script>
</body>
```

服务端代码：

```js
const net = require('net');
const { encodeDataFrame, decodeDataFrame } = require('./handleFrame');

const server = net.createServer(socket => {
  // 说明TCP连接已建立
  console.log('tcp client connected');
  socket.on('data', data => {
    const dataString = data.toString();
    // 匹配Sec-WebSocket-Key字段，判断是否是websocket协议转化的握手包
    const key = getWebSocketKey(dataString);
    if (key) {
      // 判断是否是websocket协议切换握手包
    } else {
      // websocket数据帧
      // 解码数据帧
      const res = decodeDataFrame(socket, data);
      // 解码后，触发自定义用户事件，把从客户端来的数据返回给客户端
      socket.emit('message', res);
    }
  });

  socket.on('message', (msg) => {
    console.info('收到客户端的信息：', msg.toString());
    // 给客户端发送消息，生成数据帧
    socket.write(encodeDataFrame({
      fin: 1, // 用来标识这是消息的最后一段, 一个消息可能分成多段发送
      rsv: 0,  // 默认是0, 用来设置自定义协议, 设置的话双方都必须实现
      opcode: 1, // 操作码, 用来描述该段消息
      mask: 0, // 标识是否需要根据掩码做混淆息计算, 如果为1, 那么会有4个字节存储掩码, 服务器向客户端发送数据不用做混淆运算
      payloadBuffer: msg // 消息的内容
    }))
  })

  socket.on('end', () => {
    console.log('client disconnected');
  })
})

server.listen(8080, () => {
  console.log('start in: localhost:8080')
});
```
