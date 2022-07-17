# ssh隧道

当我们在宿主机（个人的 mac、windows 等笔记本）本地进行开发时，只需要在浏览器打开 `localhost`，便可以愉快地进行开发。

当我们在远程服务器中对某一 `web` 服务进行开发并测试时，我们很难在宿主机本地进行调试。

此时可借助于 `ssh 隧道`，将服务器端口号映射到宿主机本地，则可以愉快地将服务器作为开发环境了。

创建ssh隧道的常用参数如下：

```
-C：压缩传输，提高传输速度
-f ：将ssh传输转入后台执行，不占用当前的shell。
-N：建立静默连接（建立了连接，但是看不到具体的会话）
-g 允许远程主机连接本地用于转发的端口。
-L：本地端口转发
-R：远程端口转发
-D：动态转发（socks代理）
-P：指定ssh端口。
```

## ssh -NL

以下命令将远程服务器中的 `localhost:5000` 映射到本地的 5000 端口，在浏览器中可直接输入 `localhost:5000` 进行开发调试。

```bash
# -L: 将服务器中 localhost:5000 映射到本地 5000 端口
merlin$ npx serve . -p 5000

local$ ssh -NR 5000:localhost:5000 merlin

local$ curl localhost:5000
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207101447584.png)

> 在服务器中安装了 mysql 数据库，我们如何更安全地链接数据库？
> 在公网上进行禁止访问，使用ssh隧道在本地对它进行访问

## ssh -NR

以下命令将本地的 `localhost:5000` 映射到远程服务器的 5000 端口。

```bash
local$ npx serve . -p 5000

local$ ssh -NR 5000:localhost:5000 merlin

merlin$ curl localhost:5000
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207101527341.png)

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207101527940.png)

### 使用场景

如何使我们的远程服务器也能科学上网？

在本地开发中，我们通常会使用代理软件去访问外网，实际上是流量会通过本地的一个端口去获取内容，再返回给本地浏览器。

如果我们可以把服务器的端口映射到本地的端口，那么我们的机器也可以访问外网了。

```bash
# 这个是代理软件提供的终端命令，可以看到走的是本地机器的7890端口
merlin$ export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890

# 将远程的端口映射到本地
local$ ssh -NR 7890:localhost:7890 merlin

# 机器使用代理方式访问，需要设置HTTP_PROXY变量
merlin$ export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890

merlin$ curl www.google.com
```

## ssh隧道的特点
- 优点
1. 不需要安装和配置额外的软件
2. 使用SSH认证并自带加密，不需要使其它VPN软件一样配置共享密钥或者证书
3. 兼容性强，可以建立二层隧道或三层隧道，所有3/4层协议如：ICMP、TCP/UDP 等都可支持
4.  配置过程简单

- 缺点
1.  基于TCP协议，其传输效率较低
2.  隧道依赖于单个TCP连接，容易中断或假死
3.  需要ROOT权限