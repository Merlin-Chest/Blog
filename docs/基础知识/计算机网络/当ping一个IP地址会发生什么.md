# ping一个IP地址会发生什么

### Ping的作用和原理

`ping`是用来探测本机与远程主机之间能否可达的命令，是定位网络通不通的重要手段。

`ping` 命令是基于 ICMP 协议来工作的。
>`ICMP` 全称为 Internet 控制报文协议（ Internet Control Message Protocol）

### 工作过程

ping 命令会发送一份`ICMP回显请求报文(ICMP ECHO_REQUEST)`给目标主机，并等待返回`ICMP回显应答(ICMP ECHO_RESPONSE)`。

因为ICMP协议会要求目标主机在收到消息之后，`必须返回`ICMP应答消息给源主机，

如果源主机在一定时间内收到了目标主机的应答，则表明两台主机之间网络是可达的。

除了监测是否可达以外，还可以利用`应答时间和发起时间之间的差值`，计算出数据包的延迟耗时。