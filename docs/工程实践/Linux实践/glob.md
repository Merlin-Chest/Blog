# glob

## glob

`global`，使用通配符来疲累大量文件。

- `*`，匹配0个及以上字符
- `?`，匹配1个字符
- `[...]`，匹配范围，包括\[\]内所有字符
- `**`，匹配0个及多个子目录（在 bash 下，需要开启 globstar 选项，见下 shopt 命令）

```bash
# 列出当前目录下的所有md文件
ls -lah *.md

# 列出当前目录及所有子目录的js文件
ls -lah **/*.js

# 列出当前目录及所有子目录的文件扩展名为三位的文件
ls -lah **/*.???

# 列出当前目录下以2/5/8开头的，文件扩展名为三位的文件
ls -lah [258]*.???
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207230020863.png)

## extglob
一些扩展的glob模式
- `?(pattern-list)`，重复0次或1次的模式
- `*(pattern-list)`，重复0次或多次
- `+(pattern-list)`，重复1次或多次
- `@(pattern-list)`，重复1次
- `!(pattern-list)`，非匹配

```bash
# 获取当前目录下md|jpg|js文件
ls -lah *.*(md|jpg|js)
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207222245387.png)

在 `bash` 中， `extglob` 需要通过 `shopt` 命令手动开启。

> `shopt`，`shell option` 缩写，即 shell 配置的意思。

```bash
$ shopt | grep glob
dotglob         off
extglob         on
failglob        off
globasciiranges on
globstar        off
nocaseglob      off
nullglob        off

$ shopt -s extglob
```

在 `zsh` 中，`extglob` 需要通过 `setopt` 命令手动开启。

```bash
$ setopt extendedglob
$ setopt kshglob
```

> 如何判断当前终端是哪一个shell
> `echo $0` 或者 `echo $SHELL`

