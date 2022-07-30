# env

## printenv

获取系统的所有环境变量。

```bash
printenv
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207260007549.png)

环境变量命名一般全为大写。

通过`printenv xxx`可以获得某个环境变量的值。

```bash
printenv USER
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207260009974.png)

## $HOME

当前用户目录，也就是`~`目录。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207260012567.png)

## $USER

当前用户名

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207260015110.png)

## $SHELL

在 linux 中，有许多的 shell 工具，比如：

-   [bash](https://www.gnu.org/software/bash/)
-   [zsh](https://www.zsh.org/)
-   `sh`

而 `bash` 是 linux 系统内置的 shell，我们可以通过环境变量 `SHELL` 获得当前是哪一个 SHELL。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207260016405.png)

## $PATH
可能是写命令行工具最重要的环境变量。打印该环境变量，输出的是以 `:` 分割的路径列表。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207260026780.png)
![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207260026000.png)

假如我们需要执行一个命令，我们需要进入到该命令的目录才能执行，例如：`./script.sh`。

在linux中，有许多全局可执行的命令行工具，那我们是如何定位到这些命令的呢？

则是通过`$PATH`环境变量作为我们全局命令执行的目录。

### 如何写一个命令行工具

我们定义一个全局命令行工具有两种思路：
1. 将自己的命令所在目录纳入`$PATH`中
2. 将自己的命令复制到`$PATH`的某个路径中，一般是软链接。

### 如何设计一个可以切换 node 版本的命令行工具，比如 n 与 nvm

假设 n 18.0.0 为指定当前环境为 node 版本号为 node18.0.0。

则首先找到一个全局目录安装所有版本，假设为 /lib/n。n 18.0.0 则先安装 node 至 /lib/n/18.0.0/ 该目录中。

最终将该目录下 node 执行命令 /lib/n/18.0.0/bin/node，有三种解决方案

1. 软连接到 $PATH 下某个路径，比如 /usr/bin，可全局执行

2. 复制到 $PATH 下某个路径

3. 将 /lib/n/18.0.0/bin/ 即当前版本 node 所在的目录置于 `$PATH` 下，即 `$PATH="/lib/n/18.0.0/bin/:$PATH"`

### which

列出全局命令的完整路径。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207260032054.png)

## 默认环境变量

我们可以使用 `$var` 或者 `${var}` 来引用环境变量，而环境变量还有一些扩展值。

详见文档[Parameter Expansion](https://www.gnu.org/software/bash/manual/bash.html#Brace-Expansion)。

- `${var:-word}`：如果 `var` 不存在，则使用默认值 `word`。
- `${var:=word}`：如果 `var` 不存在，则使用默认值 `word`。并且赋值 `$var=word`
- `${var:+word}`：如果 `var` 存在，则使用默认值 `word`。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207260019499.png)

在 `Dockerfile` 与 `CI` 中，常用到环境变量的扩展，如：

```bash
# 如果不配置环境变量，则其值为 production，并赋值给 NODE_ENV
${NODE_ENV:=production}
```

## export
通过 `export` 可配置环境变量。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207260021134.png)

通过 `export` 配置的环境变量仅在当前 `shell(tty)` 窗口有效，如果再开一个 shell，则无法读取变量。

**如果需要使得配置的环境变量永久有效，需要写入** `~/.bashrc` **或者** `~/.zshrc`。

## 前置环境变量

在执行命令之前置入环境变量，可以用以指定仅在该命令中有效的环境变量。在前端中大量使用。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207260023561.png)
