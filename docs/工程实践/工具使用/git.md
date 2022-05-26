# Git

## 初始化

- 在当前目录新建代码库`git init`
- 新建目录，并初始化代码库`git init [name]`
- 克隆一个项目`git clone [url]`

## 配置git

- 显示当前的git配置`git config --list`
- 编辑git配置文件`git config -e [--global]`
- 设置提交代码时的用户信息
	- `git config [--global] user.name "[name]"`
	- `git config [--global] user.email "[email]"`

## 增加/删除文件

- 添加文件到暂存区
	- 指定文件：`git add [file1] [file2]`
	- 指定目录，包括子目录：`git add [dir]`
	- 所有文件：`git add .`
- 停止追踪文件，但仍会保留在工作区
	- `git rm --cached [file]`
- 改名文件，并将这个改名放入暂存区
	- `git mv [file-original] [file-renamed]`

## 代码提交

- 代码提交暂存区到仓库区
	- `git commit -m [message]`
	- 指定文件：`git commit [file1] [file2] ... -m [message]`
- 将改动直接提交到仓库区
	- `git commit -a`
- 提交时显示所有diff信息
	- `git commit -v`
- 用新的一次commit替代上一次提交，如果代码没有发生改变，则用来改写上一次commit的提交信息
	- `git commit --amend -m [message]`

## 分支相关

- 查看本地分支`git branch`
- 查看远程分支`git branch -r`
- 查看所有分支`git branch -a`

- 创建本地分支`git branch [name]`
- 创建本地分支并切换`git checkout -b [name]`
- 创建新分支，指向指定的commit`git branch [branch] [commit]`
- 创建新分支，与指定的远程分支建立追踪关系`git branch --track [branch] [remote-branch]`

- 切换当前分支`git checkout [name]`
- 切换到上一个分支`git checkout -`

- 建立追踪关系，在现有分支与指定的远程分支之间``
- 删除已经合并的分支`git branch -d [name]`
- 强制删除某分支`git branch -D [name]`

- 合并分支到当前分支`git merge [name]`

## 版本（tag）相关

tag是git版本库的一个标记，指向某个commit的指针。

tag主要用于发布版本的管理，一个版本发布之后，我们可以为git打上 v.1.0.1 v.1.0.2 …这样的标签。

- 列出所有tag`git tag`
- 新建一个tag在当前commit`git tag [tag]`
- 新建tag在指定commit`git tag [tag] [commit]`
- 删除本地tag`git tag -d [tag]`
- 删除远程tag`git push origin :refs/tags/[tagName]`
- 查看tag信息`git show [tag]`
- 提交指定tag`git push [remote] [tag]`
- 提交所有tag`git push [remote] --tags`
- 新建一个分支，指向某个tag`git checkout -b [branch] [tag]`

## 查看信息

- 显示有变更的文件`git status`
- 显示当前分支的版本信息`git log`
- 显示commit历史，以及每次commit发生变更的文件`git log --stat`
- 搜索提交历史`git log -S [keyword]`
- 显示暂存区和工作区的差异`git diff`
- 显示暂存区与上一个commit的差异`git diff --cached [file]`

## 远程仓库相关

- 把本地的某个分支提交到远程，并作为远程仓库的xxx分支
	- `git push origin test:master` => 提交本地test分支作为远程的master分支
- `git pull [remote] [branch]`
- `git push [remote] [branch]`
	- `--force`强制推送，即使有冲突
	- `--all`推送所有分支


在项目开发过程中个，一般都会添加 .gitignore 文件，规则很简单，但有时会发现，规则不生效。
原因是 .gitignore 只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。
那么解决方法就是先把本地缓存删除（改变成未track状态），然后再提交。

```
git rm -r --cached .

git add .

git commit -m 'update .gitignore'
```