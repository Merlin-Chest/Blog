# chmod/chown

## chown

change owner,更改文件的所属用户及组。

`chown -R`可以将子文件所属用户及用户组进行修改。

```bash
ls -lah .

# total 132K
# ...
# drwxr-xr-x  6 lighthouse docker 4.0K Jul  9 17:37 actions-runner
# ...

ls -lah .

chown -R root:root actions-runner

# drwxr-xr-x  6 root root  4.0K Jul  9 17:37 actions-runner
```

### EACESS
前端使用`yarn`转包的时候，经常会遇到问题：`EACCES: permission denied, unlink ...`

该问题可能的原因是：非该文件的用户去修改文件内容。比如`node_modules`所属的用户应该是`train`，但实际为root，导致没有权限。

我们可以通过`chown -R train:train node_modules`来解决。

## chmod
change mode，更改文件的读写权限。

`mode`，指linux中对每个文件的访问权限。可以通过`stat`读取。

```bash
# 八进制模式
stat -c %a xxx
# 644

# 可读形式
stat -c %A xxx
# -rw-r--r--
```

> 文件的权限
> - r：可读，二进制为100，也就是4
> - w：可写，二进制为010，也就是2
> - x：可执行，二进制为001，也就是1

对于`644`代表的释义：
- `rw-`：表示当前用户可写可读，为`110`，`6`
- `r--`:表示当前用户组可读，为`100`，`4`
- `r--`：表示其他用户可读，为`100`，`4`

通过`chmod`与数字所代表的权限，可修改某个文件的权限。

```bash
# rwx、rwx、rwx表示所有用户可读可写可执行
chmod 777 xxx
```

也可以使用可读形式添加权限。

```bash
# u:user
# g:group
# o:other
# all:all
# +-=:增加减少等于
# perms：权限

# 给当前用户添加可读权限
chmod u+r xxx
# 给所有用户添加可读权限
chmod a+r xxx
# 给所有用户删除可读权限
chmod a-r xxx
# 给当前用户设置可读可写可执行权限
chmod u=rwx xxx
```

## 相关问题
- 在 Node.js 或其它语言中如何修改 user 及 mode
- 当我们新建了一个文件时，他默认的 mode 是多少
	- 普通用户：664
	- root用户：644