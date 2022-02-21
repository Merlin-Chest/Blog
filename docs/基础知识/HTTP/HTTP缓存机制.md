# HTTP缓存

HTTP 缓存分为以下两种，两者都是通过 HTTP 响应头控制缓存
1.  强制缓存
2.  协商缓存

### 强制缓存

再次请求无需向服务器发送请求

- 与之相关的 Response `Headers`
	- Expires：使用绝对的时间，且具有固定的格式
	- Cache-Control：具有强大的缓存控制能力
		- `no-cache`每次请求需要校验服务器资源的新鲜度
		-   `max-age=31536000`，浏览器在一年内都不需要向服务器请求资源

### 协商缓存

再次请求时，需要向服务器校验新鲜度，如果资源是新鲜的，返回 304，直接从浏览器获取资源。

- 与之相关的 Request/Response `Headers`
	-   `Last-Modified`/`If-Modified-Since`
	-   `Etag`/`If-None-Match`

