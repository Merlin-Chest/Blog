# ln
在两个文件间创建链接，默认为硬链接。

```bash
# 创建一个硬链接
ln nohup.out nohup.hard.out
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207170940534.png)

我们可以发现硬链接文件和源文件：
- links变成了2，代表硬链接个数
- 具有相同的Inode：99
- 具有相同的size及属性

在前端使用pnpm作为包管理工具的项目中，硬链接到处存在。

```bash

# 使用 pnpm 作为前端依赖的项目中的硬链接

$ stat node_modules/.pnpm/react@17.0.2/node_modules/react/package.json
```

## ln -s:symbol link

`ln -s`，在两个文件之间创建软链接。

```bash
# 创建软链接
ln -s nohup.out nohup.soft.out
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207170948688.png)

我们可以看到，软链接文件与源文件：
- 具有完全不同的Inode，证明是两个独立的文件
- 不同的size和属性
- 软链接文件中拥有`symbolic link`标志

在前端使用pnpm包管理工具，软链接到处存在。

```bash
# 使用 pnpm 作为前端依赖的项目中的软链接

$ ls -lah node_modules/react

# lrwxrwxrwx 1 root root 37 Jun 22 17:47 node_modules/react -> .pnpm/react@17.0.2/node_modules/react
```

## 相关问题
- 我们修改了文件的 mode，在 git 中是否有更改操作
	- `git config core.fileMode false`可以忽略mode的更改
- 我们修改了文件的 mtime，在 git 中是否有更改操作
- 在 pnpm 中，为什么不全部使用软链接
- 在 Node.js 或其它语言中如何执行 `ln`