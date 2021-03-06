# HTTP/HTTPS代理

## HTTP代理的原理

代理服务器会自动提取请求数据包中的`HTTP请求数据`发送给服务端，并服务端的`HTTP响应数据`转发给发送请求的客户端，HTTP代理服务器使用的端口通常是8080。

-   对于Web客户端来说，代理扮演的服务器角色，接收请求（Request），返回响应（Response）。
-   对于Web服务器来说，代理扮演的客户端角色，发送请求（Request），接收响应（Response）。

### HTTP 代理步骤

-   `客户端`向`代理`发起`TCP连接`；
-   代理接收客户端的连接，双方`建立连接`；
-   `客户端`向`代理`发送`HTTP请求`，请求内容和没有HTTP代理的内容完全相同；
-   代理`解析HTTP请求`；
-   `代理`向`服务器`发起`TCP连接`；
-   `服务器`接收`代理`的连接；
-   `代理`向`服务器`发送`HTTP`请求（这个HTTP请求是基于用户的HTTP请求，`可能会有修改`）
-   `服务器`发送`响应`给`代理`；
-   `代理`发送`响应`给发送请求的`客户端`；

### 不同HTTP代理的区别：

-   全匿名代理，不改变客户端的request fields（请求信息），使服务器端看来就像有个真正的客户浏览器在访问。客户端的真实IP是隐藏起来的。
-   普通匿名代理，能隐藏客户端的真实IP，但会更改客户端的request fields（请求信息），服务器端有可能会被认为使用了代理。
-   透明代理（简单代理），改变客户端的request fields（请求信息），并会传送真实IP地址。

## HTTPS代理

HTTPS代理有多种做法，通常使用`CONNECT method`，通过proxy建立一条隧道(隧道代理)，这样，`proxy无法解密数据`；此外，还有一种类似于中间人攻击的代理手法。

### CONNECT方法代理步骤

-   `客户端`向`代理`发起`CONNECT`请求；
-   `代理`向`服务端`发起`TCP`连接请求；
-  当TCP连接建立完成后， `代理`向`客户端`返回`HTTP/1.0 OK`，隧道建立完成；
-   `代理`转发`客户端`的数据给`服务器`，转发`服务器`的数据给`客户端`，直到任何一方连接结束；

## 跨域问题

服务器与服务器之间请求数据并不会存在跨域行为，`跨域行为是浏览器安全策略限制`

- 代理服务器的运用
	- `Nginx`
	- `webpack`的`devServer`
	- ...