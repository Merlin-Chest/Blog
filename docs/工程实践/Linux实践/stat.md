Stat

stat，查看文件系统信息。

```
root@VM-20-8-ubuntu:~# stat pic
File: pic
Size: 4096 Blocks: 8 IO Block: 4096 directory
Device: fc02h/64514d Inode: 656654 Links: 2
Access: (0755/drwxr-xr-x) Uid: ( 501/ UNKNOWN) Gid: ( 50/ staff)
Access: 2022-07-11 23:04:08.340363030 +0800
Modify: 2022-07-11 22:50:21.000000000 +0800
Change: 2022-07-11 23:03:58.312417759 +0800
Birth: -

root@VM-20-8-ubuntu:~# stat nohup.out
File: nohup.out
Size: 336 Blocks: 8 IO Block: 4096 regular file
Device: fc02h/64514d Inode: 99 Links: 1
Access: (0600/-rw-------) Uid: ( 0/ root) Gid: ( 0/ root)
Access: 2022-07-10 23:02:38.951373529 +0800
Modify: 2022-07-10 23:02:38.587375636 +0800
Change: 2022-07-10 23:02:38.587375636 +0800
Birth: -
```

- regular file：普通文件
- directory：文件夹
- size：文件大小
- Inode：每个文件的Inode编号
- Links：文件硬链接个数
- Access：文件访问模式
- Access：atime，文件访问时间
- Modify：mtime，文件修改时间（在HTTP服务器中，常以此作为last-modified响应头）    
- Change：ctime，文件修改时间（包括属性，比如mode和owner，包括mtime，因此ctime总比mtime大）
- Birth：某些操作系统其值为 -

> 对于每个字段的释义详细，可查看 [stat](https://www.man7.org/linux/man-pages/man2/stat.2.html#DESCRIPTION)

## stat -c

可以对指定文件的指定属性进行输出。

- %a 以八进制表示访问权限
- %A 以可读性是表示访问权限
- %b 内存分配的块数
- %B 每个分配块的大小
- %d 十进制设备号
- %D 十六进制设备号
- %f 十六进制表示文件类型
- %F 文件类型
- %g ownerID
- %G ownerName
- %h 硬链接的数量
- %i inode编号
- %m 挂载目录
- %n 文件名
- %s 总字节大小
- ...
![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207151438051.png)

## 文件类型

`stat -c "%F" xxx`

- `regular file`
- `directory`
- `symbolic link`
- `character special file`
- `character special file`
- `block special file`
- `socket`

同时，还可以使用`ls -lah`查看文件类型，第一个字符表示文件类型。

-   -，regular file，普通文件。
-   d，directory，目录文件。
-   l，symbolic link，符号链接。
-   s，socket，套接字文件，一般以 `.sock` 作为后缀。（可把 `.sock` 理解为 API，我们可以像 HTTP 一样对它请求数据）
-   b，block special file，块设备文件。
-   c，character special file，字符设备文件。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207151454747.png)
