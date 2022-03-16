# Webpack知识体系
>[课件链接](https://bytedance.feishu.cn/file/boxcnjX3wzA3dU2zWwBNHgYgs9g)
>[webpack5体系思维导图](https://gitmind.cn/app/doc/fac1c196e29b8f9052239f16cff7d4c7)
## 什么是webpack

前端资源的打包管理工具

 - 多份资源文件打包成一个Bundle 
 - 支持Babel、Eslint、TS、CoffeScript、Less、 Sass
 - 支持模块化处理CSS、图片等资源文件 
 - 支持HMR+开发服务器
 - 支持持续监听、持续构建 
 - 支持代码分离 
 - 支持Tree-shaking 
 - 支持Sourcemap
 - ...

## webpack打包流程

- 入口处理
- 依赖解析
- 资源解析
- （步骤2、3递归调用，直到全部的资源全部处理完毕）
- 资源合并打包

## 使用webpack

- 流程类
	- 输入
		- entry
		- context
	- 模块解析
		- resolve
		- externals
	- 模块转译
		- module
- 工具类
![image](https://cdn.jsdelivr.net/gh/Merlin218/image-storage@master/picX/image.6hg7prnfn1mo.webp)
## Loader组件

## Plugin组件

## 如何学习webpack