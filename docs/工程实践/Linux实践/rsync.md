# rsync
## 远程复制
将本地的图片 拷贝到 merlin 服务器的 /root 目录下

```bash
# -l：--links，拷贝符号链接
# -a：--archive，归档模式
# -h：--human-readable，可读化格式进行输出
# -z：--compress，压缩传输
# -v：--verbose，详细输出

$ rsync -lahzv /Users/merlin/Downloads/avataaars.png merlin:/root/picture.png
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207112247555.png)

## 归档模式
最大的好处是可以拷贝元属性，如ctime/mtime/mode等等，这对于静态资源服务器非常有用。

> 关于元属性，可参考 [stat](https://q.shanyue.tech/command/stat.html) 命令

```bash
# 查看其 picture.png 信息
$ ls -lah | grep picture
-rw-r--r--  1        501 staff   37K Jul 10 15:39 picture.png

# yarn2.lock 使用 rsync 拷贝
$ rsync -lahzv /Users/merlin/Downloads/avataaars.png merlin:/root/picture.png
# yarn3.lock 使用 cp 拷贝
$ cp picture.png picture1.png

# 观察可知
# rsync 修改时间/mode 与源文件保持一致
# cp 修改时间为当前最新时间，mode 也不一致
$ ls -lah | grep picture
-rw-r--r--  1        501 staff   37K Jul 10 15:39 picture.png
-rw-r--r--@   1 merlin  staff    37K  7 10 15:39 picture.png
-rw-r--r--@   1 merlin  staff    37K  7 11 22:42 picture1.png
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207112243636.png)

## 拷贝目录
拷贝目录，则需要看原目录是否以 `/` 结尾。

- 不以 `/` 结尾，代表将该目录连同目录名一起进行拷贝
- 以 `/` 结尾，代表将该目录下所有内容进行拷贝

```bash
# 以下以拷贝 react 目录为例

# 拷贝react整个文件夹到服务器abc下
$ rsync -lahz ~/Documents/react ~/Documents/abc/

# 以下效果相同
# 拷贝react整个文件夹到服务器Documents下并改名为adc
$ rsync -lahz ~/Documents/react ~/Documents/abc
# 拷贝react下文件到服务器abc文件夹下
$ rsync -lahz ~/Documents/react/ ~/Documents/abc
# 拷贝react下文件到服务器abc文件夹下
$ rsync -lahz ~/Documents/react/ ~/Documents/abc/
```

## 几个问题

- 在 Node.js 或其它语言中如何实现 `cp`。参考 [fsp.cp](https://nodejs.org/api/fs.html#fspromisescpsrc-dest-options)。(cp 实际上是通过库函数 open/write 模拟实现)
- 为何说保留复制文件时的元属性，对静态资源服务器有益
	- 有利于进行相关缓存策略的设置，并且保留原始的编辑时间等