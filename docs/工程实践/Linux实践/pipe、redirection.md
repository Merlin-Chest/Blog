## pipe

`|` 构成了管道，它将前面命令的标准输出作为下一个命令的标准输入。

```bash
# 读取文件内容，读取前十行，再读取最后三行（十行中的后三行）
cat README.md | head -10 | tail -3
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207182058296.png)


## stdin/stdout

标准输入、标准输出，其实就是有特殊的文件描述符。
- `stdin`，fd = 0，直接从键盘中读取数据。
- `stdout`，fd = 1，直接将数据打印至终端。
- `stderr`，fd = 2，标准错误，直接将异常信息打印至终端。

## redirection

- `>`：将文件描述符或标准输出中内容写入文件。会覆盖原内容。
- `>>`：将文件描述符或标准输出中内容追加入文件。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207182102150.png)

## heredoc
```bash
cat << EOF > README.md
```

其意思是将标准输入时的内容，写入到 README.md 中。

其中 `<< EOF`，称作 `Hear Document`，当最终写入 EOF（End of line）时，则 heredoc 会停止输入。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207182112507.png)

## 日志重定向

有时，为了不显示日志，可将所有标准输出重定向至 `/dev/null`。

`/dev/null` 是一个空文件，对于所有的输入都统统吃下，化为乌有。

```bash
# 把标准输出（1）重定向到/dev/null
echo hello > /dev/null

# 如果后边跟一个 2>&1，表示将 stderr (fd 为2) 重定向至 &1 (fd===1 的文件，及 stdout)

# 那么标准错误输出也会重定向到/dev/null
cat hello > /dev/null 2>&1
```