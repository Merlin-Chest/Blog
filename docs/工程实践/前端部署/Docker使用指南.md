# Docker使用指南
## Dcoker基本概念

- 镜像（`Image`）：Docker 镜像是一个特殊的文件系统，除了提供[容器](https://cloud.tencent.com/product/tke?from=10680)运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。
- 容器（`Container`）：镜像（`Image`）和容器（`Container`）的关系，就像是面向对象程序设计中的 `类` 和 `实例` 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
- 仓库（`Repository`）：仓库（`Repository`）类似Git的远程仓库，集中存放镜像文件。

## 常用命令
### 系统服务
- `docker version`：查看版本信息
- `docker -v`
- `systemctl start docker`：启动docker
- `systemctl stop docker`：关闭docker
- `systemctl enable docker`：设置开机启动
- `service docker restart`：重新启动docker
- `service docker stop`：关闭docker服务

### 镜像

- `docker search xxx`：检索镜像
- `docker pull -[选项] [镜像地址]`:拉取镜像
- `docker image ls/docker images`：列出镜像
- `docker rmi [镜像id]`：删除指定镜像
- `docker save`：导出镜像
- `docker load`：导入镜像
- `docker build`：镜像构建
- `docker run [镜像id]`：运行镜像

### 容器生命周期

- `docker run [镜像id或镜像名]`：新建并运行
- `docker start [容器id]`：启动已终止容器
- `docker ps`：列出运行的容器
- `docker ps -a`：列出全部容器（包括停止和运行）
- `docker stop [容器id]`
- `docker kill [容器id]`
- `docker restart [容器id]`
- `docker rm [容器id]`
- `docker attach [容器id]`
- `docker exec [容器id]`
	- `-d,--detach`：在后台执行
	- `-i,--interactive=true | false`：打开标准输入接受用户输入命令
- `docker export [容器id]`：导出一个已经创建的容器到一个文件
- `docker import [路径]`：导入容器快照文件

### 其他

- `docker logs [容器id]`：查看日志
	- `-f`：跟踪日志输出
	- `--since`：显示某些开始时间的所有日志
	- `--tail`：仅列出最新N条容器日志
	- `-t`：显示时间戳
- `docker cp host_path containerID:container_path`：从主机复制到容器
- `docker cp containerID:container_path host_path`：从容器复制到主机