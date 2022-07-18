# cat
`concatenate and print files`，连接和打印至标准输出。

```bash
# 单文件输出
cat README.md

# 多文件输出
cat README.md README1.md
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207181202741.png)

那你知道在 cat 时实际做了什么吗？

library：open/read

我们在打开一个文件，读取内容时，在操作系统底层实际上做了两步操作。

- [open](https://www.man7.org/linux/man-pages/man2/open.2.html)：`open("package.json")`，并返回**文件描述符**，即 `file descriptor`，简写 `fd`，一个非负整数，通过文件描述符可用来读写文件。
- [read](https://www.man7.org/linux/man-pages/man2/read.2.html)：`read(3)`，通过 `fd` 读取文件内容，其中的 3 为文件描述符。
## less

更高级更强大的查看文件内容工具，可使用 vim 命令控制上下移动以及关键词搜索。

附加参数：
- `-N`：显示行号
- `-Q`：不使用警告音

按键：
- `Q`：退出
- ...

```bash
less README.md

# 显示行号
less -N README.md
```

## head

读取文件或者标准输入的前N行或者前N个字节。

```bash
# 输出文件前10行内容
head -10 README.md
head --lines 10 README.md

# 输出文件前10个字节
head -c 10 README.md
```

## tail
读取文件或者标准输入最后N行或者N个字节。

```bash
tail -10 README.md
```

但是它与 `head` 最大不同的一点是：`--follow`，简写为 `-f`。它可以实时打印文件中最新内容。

**在调试日志时非常有用**：日志一行一行追加到文件中，而 `tail -f` 可以实时打印追加的内容。

```bash
tail -f log.json

# 如果为了做实验，可再打开一个窗口通过 >> 重定向追加内容至 log.json，具体查看下一章

echo test >> log.json
```