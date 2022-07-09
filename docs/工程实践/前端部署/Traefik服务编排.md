# 搭建Traefik服务网关

> 本章节操作在服务器上进行，需要一台服务器与一个域名。

在服务器中，现在维护了 N 个前端应用，起了 N 个容器。但除了使用容器启动服务外，和传统方式并无二致，以前管理进程，现在管理容器。

所以差一个服务的编排功能。

> traefik 是一个现代化的反向代理与负载均衡器，它可以很容易地同 Docker 集成在一起使用。每当 Docker 容器部署成功，便可以自动在网络上进行访问。

我们通过使用`traefik`镜像来搭建一个服务网关，并将它添加到我们的容器中。

```yaml
version: "3"

services:
  traefik: 
    image: traefik:v2.5
    command: --api.insecure=true --providers.docker
    ports:
      - "8000:80"
      - "443:443"
      - "8080:8080"
    volumes:
      # 终极配置文件，已经配置好LTS、Access Log等。后续继续学习。
      - ./traefik.toml:/etc/traefik/traefik.toml
      - ./acme.json:/acme.json
      - ./log:/log
      - /var/run/docker.sock:/var/run/docker.sock
    env_file: .env
```

启动traefik网关服务

```shell
docker-compose up --build
```

此时需要记住这个服务名`traefik_default`，将在后续配置其他服务时需要使用。

## 启动任意一个服务

我们启动`whoami`，是一个简易版web服务，它会在页面中打印一些HTTP报文的头部信息。

```yaml
version: '3'

services:
  whoami:
    image: containous/whoami
    labels:
      # 设置Host 为 `cra.merlin218.top` 进行域名访问
      - traefik.http.routers.whoami.rule=Host(`cra.merlin218.top`)
      # 开启HTTPS
      - traefik.http.routers.whoami.tls=true
      - traefik.http.routers.whoami.tls.certresolver=le

# 使用已存在的 traefik 作为 network
networks:
  default:
    external:
      # 使用`traefik_default`
      name: traefik_default
```

在`traefik`提供的控制台中，我们可以看到我们加载的所有服务的情况。

访问8080端口，我们可以访问控制台。

## 终极配置文件

终极配置文件已经配置好了 LTS、Access Log 等，但是细节就不讲了，直接上配置，完整配置文件详见 [traefik.toml](https://github.com/Merlin218/learn-deploy/tree/master/traefik/traefik.toml)。

## 开启多服务多域名

同样的道理，只要配置好`- traefik.http.routers.xxx.rule=Host(xxx)`即可，`traefik`会自动进行识别。当然二级域名需要提前设置A记录。

部署博客项目

```yaml
version: "3"

services:
  blog:
    build:
        context: .
        dockerfile: blog.Dockerfile
    labels:
      # 设置Host 为 blog.cra.merlin218.top 进行域名访问
      - traefik.http.routers.blog.rule=Host(`blog.cra.merlin218.top`)
      # 开启HTTPS
      - traefik.http.routers.blog.tls=true
      - traefik.http.routers.blog.tls.certresolver=le
# 使用已存在的 traefik 的 network
networks:
  default:
    external:
      name: traefik_default
```
