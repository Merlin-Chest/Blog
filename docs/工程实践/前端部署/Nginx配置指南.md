# Nginx配置指南

> [demo地址](https://github.com/Merlin218/simple-deploy/tree/master/learn-nginx)

## root 与 index

- `root`: 静态资源的根路径。见文档 [https://nginx.org/en/docs/http/ngx_http_core_module.html#root(opens new window)](https://nginx.org/en/docs/http/ngx_http_core_module.html#root)
- `index`: 当请求路径以 `/` 结尾时，则自动寻找该路径下的 index 文件。见文档 [https://nginx.org/en/docs/http/ngx_http_index_module.html#index(opens new window)](https://nginx.org/en/docs/http/ngx_http_index_module.html#index)

`root` 与 `index` 为前端部署的基础，在默认情况下 root 为 `/usr/share/nginx/html`，因此我们部署前端时，往往将构建后的静态资源目录挂载到该地址。

## location

location 用以匹配路由，配置语法如下。

```
location [ = | ~ | ~* | ^~ ] uri { ... }
```

其中 `uri` 前可提供以下修饰符

-   `=` 精确匹配。优先级最高
-   `^~` 前缀匹配，优先级其次
-   `~` 正则匹配，优先级再次 (~* 只是不区分大小写，不单列)
-   `/` 通用匹配，优先级再次

## proxy_pass

`proxy_pass` 反向代理，也是 nginx 最重要的内容，这也是常用的解决跨域的问题。

当使用 `proxy_pass` 代理路径时，有两种情况

1.  代理服务器地址不含 URI，则此时客户端请求路径与代理服务器路径相同。**强烈建议这种方式**
2.  代理服务器地址含 URI，则此时客户端请求路径匹配 location，并将其 location 后的路径附在代理服务器地址后。

## add_header

控制响应头。

由于很多特性都是通过响应头控制，因此基于此指令可做很多事情，比如:

1.  Cache
2.  CORS
3.  HSTS
4.  CSP
5.  ...

### Cache

```
location /static {
    add_header Cache-Control max-age=31536000;
}
```

### CORS

```
location /api {
    add_header Access-Control-Allow-Origin *;
}
```

### HSTS

```
location / {
    listen 443 ssl;

    add_header Strict-Transport-Security max-age=7200;
}
```

### CSP

```
location / {
    add_header Content-Security-Policy "default-src 'self';";
}
```