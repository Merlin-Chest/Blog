## find
根据文件名搜索，在某个目录及所有子目录中的文件进行递归搜索，可以根据文件的属性进行查找。

而文件的属性，可以通过`stat`命令进行获得。

```bash
$ find . -name '*.json'

# 在当前目录递归查找包含 hello 的文件
$ find . -name '*hello*'

$ find . -perm 777

# 在当前目录查找类型为 f/d/s 的文件
$ find . -type f
$ find . -type d
$ find . -type s

# 在当前目录查找 inode 为 10086 的文件
# 一般用以寻找硬链接的个数，比如 pnpm 中某一个 package 的全局路径在哪里
$ find . -inum 10086

# 寻找相同的文件（硬链接），与以上命令相似
$ find . -samefile package.json
```

> f:file,普通文件
> d:directory，文件目录
> s：socket
> l：符号连接

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207230844495.png)

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207230844673.png)

## ag
根据文件内容搜索。可根据 [the silver searcher](https://github.com/ggreer/the_silver_searcher) 进行文件内容搜索。

```bash
# 需提前安装
apt install silversearcher-ag

$ ag helloworld
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207230847822.png)

## git grep

如果使用 git 管理项目，并且需要在项目中进行搜索内容的话，则可以使用 `git grep`。

```bash
$ git grep helloworld
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207230851748.png)
