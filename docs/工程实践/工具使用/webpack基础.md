# Webpack基础

## 1、webpack 是什么

- 官⽅方⽹网站:[https://webpack.js.org/](https://webpack.js.org/)
- 中⽂文⽹网站:[https://www.webpackjs.com/](https://www.webpackjs.com/)

本质上，`webpack` 是一个现代 `JavaScript` 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

## 2、安装

`webpack` 是一个使用 `Node.js` 实现的一个模块化代码打包工具。所以，我们需要先安装 webpack，安装之前需要搭建好 `Node.js` 环境

```
  npm install -D webpack webpack-cli
```

> 注：不推荐全局安装

- `webpack-cli` : 提供 webpack 命令、工具，类似 `create-react-app`
- `webpack` : webpack 代码，类似 `react`

## 3、使用

```
 ./node_modules/.bin/webpack
 
 // 查看版本
 ./node_modules/.bin/webpack -v
```

也可以编辑 `package.json` 的 `scripts` 来简化输入

```
 // package.json
 {
   ...,
   "scripts": {
	 // scripts 中可以定位到 ./node_modules/.bin/ 目录下
     "start": "webpack"  
   }
 }
```

> scripts 中使用 test、start、restart、stop 命名的时候，可以在调用的时候省略 run，即直接 npm start
> 

当然，还可以使用更加方便的方式：

```
 npx webpack
```

通过 `npx` 也可以帮助我们定位命令到 `./node_modules/.bin/` 目录下

> 注：npm5.2+ 增加，如果没有，可以使用 npm i -g npx 来安装

## 4、打包模块

打包之前，我们需要了解一个概念，入口文件

### 4-1、入口文件

入口文件就是我们项目中加载的第一个文件，比如上面的 `main.js` 文件，其它文件都是通过 `import` 等方式引入的，`webpack` 会从我们指定的入口文件开始分析所有需要依赖的文件，然后把打包成一个完整文件。

### 4-2、打包命令

```
 webpack ./js/index.js
```

上面命令会使用 `webpack` 默认的一些配置对模块文件进行打包，并把打包后的文件输出到默认创建的 `./dist` 目录下，打包后的文件名称默认为 `main.js`。

模块文件打包以后，就可以在不支持 es6 模块语法的浏览器环境下引入使用了。

#### 打包文件分析
- 把分散的模块文件打包到一个文件中，不需要外部引入了
- 内置了一个小型模块加载器(类似 `requireJS`)，实现了打包后的代码隔离与引用

以上就是 webpack 最基础的使用于基本原理，当然强大的 `webpack` 远远不止这些功能。

## 5、打包配置

虽然，我们可以直接通过命令的来打包，但是推荐创建一个 `webpack.config.js` 的配置文件来实现更方便和强大的功能。

`webpack` 命令在运行的时候，默认会读取运行命令所在的目录下的 `webpack.config.js` 文件，通常我们会在项目的根目录下运行命令和创建配置文件。

我们也可以通过 `—config` 选项来指定配置文件路径：

```bash
 webpack --config ./configs/my_webpack.config.js
```

通常情况下，我们的项目目录大致如下：

```text
 -- /dist - 项目打包后存放目录
 -- /node_modules - 第三方模块
 -- /src
 ------ css/
 ------ images/
 ------ js/
 ------ index.js
 -- webpack.config.js
 -- package.json
```

配置文件

```javascript
 module.exports = {
   ... //配置项
 }
```

### 5-1、mode

模式 : `"production" | "development" | "none"`

不同的模式会对 `webpack` 打包的时候进行一些对应的优化配置。

```javascript
 module.exports = {
   mode: 'production'
 }
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202204140950713.png)

### 5-2、entry

指定打包⼊口⽂文件，有三种不同的形式：`string | object | array`

<!--一对一：一个入口、一个打包文件-->

```javascript
 module.exports = {
   entry: './src/index.js'
 }
```

<!--多对一：多个入口、一个打包文件-->

```javascript
 module.exports = {
   entry: [
     './src/index1.js',
     './src/index2.js',
   ]
 }
```

<!--多对多：多个入口、多打包文件-->

```javascript
 module.exports = {
   entry: {
     'index1': "./src/index1.js",
     'index2': "./src/index2.js"
   }
 }
```

### 5-3、output

打包后的文件位置

```
 module.exports = {
   ...,
   output: {
     path: path.resolve(__dirname, "dist"),
     filename: "bundle.js",
     filename: "[name].js"
   }
 }
```

- 可以指定一个固定的文件名称，如果是多入口多出口(`entry` 为对象)，则不能使用单文件出口，需要使用下面的方式
	- 通过 `webpack` 内置的变量占位符：`[name]`
	- [Template strings](https://webpack.docschina.org/configuration/output/#template-strings)

- 占位符类型
	- ext：文件后缀名
	- name：文件名
	- path：文件相对路径
	- folder：文件所在文件夹
	- hash：每次构建生成的唯一 hash 值
	- chunkhash：根据 chunk 生成 hash 值
	- contenthash：根据文件内容生成hash 值
- 区分三种hash
	- **hash** ：任何一个文件改动，整个项目的构建 hash 值都会改变；
	- **chunkhash**：文件的改动只会影响其所在 chunk 的 hash 值；
	- **contenthash**：每个文件都有单独的 hash 值，文件的改动只会影响自身的 hash 值；

## 6、深入

webpack 默认支持处理 JS 与 JSON 文件，其他类型都处理不了，这里必须借助 Loader 来对不同类型的文件的进行处理。

### 6-1、执行简要流程

- `loaders`：`webpack` 中非常核心的内容之一，前面我们说的非 js 类型的模块处理就靠它了。webpack 可以使用 loader 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。你可以使用 Node.js 来很简单地编写自己的 loader。
- `plugins`：`webpack` 中另外一个核心的内容，它主要是扩展 `webpack` 本身的一些功能。插件可以运行在 `webpack` 的不同阶段（钩子 / 生命周期）。

## 7、Loaders

[https://webpack.js.org/loaders/](https://webpack.js.org/loaders/)

```javascript
 module.exports = {
   ...,
   module: {
     rules:[
       {
         test:/\.xxx$/,
         use:{
           loader: 'xxx-load'
         }
       }
     ]
   }
 }
```

当 `webpack` 碰到不识别的模块的时候，`webpack` 会在配置的 `module` 中进行该文件解析规则的查找

- `rules` 就是我们为不同类型的文件定义的解析规则对应的 loader，它是一个数组
- 每一种类型规则通过 test 选项来定义，通过正则进行匹配，通常我们会通过正则的方式来匹配文件后缀类型
- `use` 针对匹配到文件类型，调用对应的 `loader` 进行处理

### 7-1、raw-loader

在 `webpack` 中通过 import 方式导入文件内容，loader 并不是 `webpack` 内置的，所以首先要安装

```
 npm install --save-dev raw-loader
```

然后在 `webpack.config.js` 中进行配置

```javascript
 module.exports = {
   ...,
   module: {
       rules: [
       {
         test: /\.(txt|md)$/,
         use: 'raw-loader'
       }
     ]
   }
 }
```

### 7-2、图片资源处理

#### file-loader

解决图片引入问题，并将图片 copy 到指定目录，默认为 dist

```
 npm install --save-dev file-loader
```

```javascript
 rules: [
   ...,
   {
     test: /\.(png|jpe?g|gif)$/,
     use: {
       loader: "file-loader",
       options: {
         // placeholder 占位符 [name] 源资源模块的名称
         // [ext] 源资源模块的后缀
         name: "[name]_[hash].[ext]",
         //打包后的存放位置
         outputPath: "./images",
         // 打包后文件的 url
         publicPath: './images',
       }
     }
   }
 ]
```

> 占位符：https://webpack.js.org/loaders/file-loader#placeholders
> 

#### url-loader

解依赖 file-loader，当图片小于 limit 值的时候，会将图片转为 base64 编码，大于 limit 值的时候依然是使用 file-loader 进行拷贝。

**配置和 file-loader 类似，多了一个 limit 的配置。**

直接使用url-loader代替file-loader

```js
const config = {
  //...
  module: { 
    rules: [
      {
         // ...
      }, 
      {
        test: /\.(jpe?g|png|gif)$/i,
        use:[
          {
            loader: 'url-loader',
            options: {
              name: '[name][hash:8].[ext]',
              // 文件小于 50k 会转换为 base64，大于则拷贝文件
              limit: 50 * 1024
            }
          }
        ]
      },
    ]
  },
  // ...
}
```

#### img-loader

作用：压缩图片

#### webpack5中新增了资源模块

允许使用资源文件（字体，图片等）而无需配置额外的loader
（用起来确实舒服）

资源模块支持以下四个配置：

> 1.  `asset/resource` 将资源分割为单独的文件，并导出 url，类似之前的 file-loader 的功能.
> 2.  `asset/inline` 将资源导出为 dataUrl 的形式，类似之前的 url-loader 的小于 limit 参数时功能.
> 3.  `asset/source` 将资源导出为源码（source code）. 类似的 raw-loader 功能.
> 4.  `asset` 会根据文件大小来选择使用哪种类型，当文件小于 8 KB（默认） 的时候会使用 asset/inline，否则会使用 asset/resource

```js
// 使用webpack5自带资源模块
      {
        test: /\.(png|jpe?g|gif)$/,
        // asset 会根据文件大小来选择使用哪种类型
        // 当文件小于 8 KB（默认） 的时候会使用 asset/inline
        // 否则会使用 asset/resource
        type: 'asset',
        generator:{
          filename:"[name][hash:8][ext]"
        },
        parser:{
          dataUrlCondition:{
            maxSize:50 * 1024 // 超过50kb 不转 base64
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: "[name][hash:8][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 超过100kb 不转 base64
          }
        }
      },
```

### 7-3、css-loader

对 `@import` 和 `url()` 进行处理，就像 js 解析 `import/require()` 一样。

```bash
 npm install --save-dev css-loader
```

```javascript
 rules: [
   ...,
   {
     test: /\.css$/,
     use: {
       loader: "css-loader",
       options: {
         // 启用/禁用 url() 处理
         url: true,
         // 启用/禁用 @import 处理
         import: true,
         // 启用/禁用 Sourcemap
         sourceMap: false
       }
     }
   }
 ]
```

### 7-4、style-loader

把 `css-loader` 生成的内容，用 `style` 标签挂载到⻚面的 `head` 中

```bash
 npm install --save-dev style-loader
```

```javascript
 rules: [
   ...,
   {
     test: /\.css$/,
     use: ["style-loader", "css-loader"]
   }
 ]
```

同一个任务的 `loader` 可以同时挂载多个，处理顺序为：从右到左，也就是先通过 `css-loader` 处理，然后把处理后的 `css` 字符串交给 `style-loader` 进行处理

```
 rules: [
   ...,
   {
     test: /\.css$/,
     use: [
       {
         loader: 'style-loader',
         options: {}
       },
       'css-loader'
     ]
   }
 ]
```

style-loader 核心逻辑相当于：

```js
const content = `${样式内容}`
const style = document.createElement('style');
style.innerHTML = content;
document.head.appendChild(style);
```

通过动态添加 style 标签的方式，将样式引入页面

> 对比MiniCssExtractPlugin.loader

```js
// 使用style-loader把css-loader处理完的内容通过style标签插入到head标签中

use: ['style-loader', 'css-loader']

// MiniCssExtractPlugin.loader是把css提取到单独的css文件中，然后通过link标签引入文件

use: [MiniCssExtractPlugin.loader, 'css-loader']
```

### 7-5、postcss-loader

使用 [postcss-loader](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Floaders%2Fpostcss-loader%2F "https://webpack.docschina.org/loaders/postcss-loader/")，自动添加 CSS3 部分属性的浏览器前缀。

```bash
pnpm install postcss postcss-loader postcss-preset-env -D
```

```js
const config = {
  // ...
  module: { 
    rules: [
      {
        test: /\.css$/, //匹配所有的 css 文件
        use: [
          'style-loader',
          'css-loader', 
          'postcss-loader'
        ]
      }
    ]
  }, 
  // ...
}
```

创建 `postcss` 配置文件 `postcss.config.js`

```js
// postcss.config.js
module.exports = {
  plugins: [require('postcss-preset-env')]
}
```

创建 `postcss-preset-env` 配置文件 `.browserslistrc`

```bash
# 换行相当于 and
last 2 versions # 回退两个浏览器版本
> 0.5% # 全球超过0.5%人使用的浏览器，可以通过 caniuse.com 查看不同浏览器不同版本占有率
IE 10 # 兼容IE 10
```

结果：
![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202204141222058.png)

### 7.6、less-loader或sass-loader

```shell
pnpm i less-loader -D

pnpm i node-sass sass-loader -D
```

### 7.7、babel-loader

对js代码进行兼容处理

```shell
npm install babel-loader @babel/core @babel/preset-env -D
```

-   `babel-loader` 使用 Babel 加载 ES2015+ 代码并将其转换为 ES5
-   `@babel/core` Babel 编译的核心包
-   `@babel/preset-env` Babel 编译的预设，可以理解为 Babel 插件的超集

```js
	{
        test: /\.js$/i,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ],
            }
          }
        ]
      },
```

配置babel

useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill

useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill

useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill
        // useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
        // useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
        useBuiltIns: "usage",
        corejs: "3.9.1", // 是 core-js 版本号
        targets: { // 目标兼容对象
          chrome: "58",
          ie: "11",
        },
      },
    ],
  ],
};
```

### 7.8、vue-loader

```js
modules: {
	rules: [    
		// 处理vue文件
	    {
	        test: /\.vue$/,
	        use: 'vue-loader'
	    },
      // ,,,
	]
},
plugins:[
	new VueLoaderPlugin()
]
```

更多细节前往[查看文档](https://vue-loader.vuejs.org/zh/)

7-9、ts-loader

```js
resolve:{
	// 解析文件格式列表，'...'为默认列表['js','json']
	extensions: ['.ts','...'] 
},
modules: {
	rules: [    
	  // 处理ts文件
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      // ,,,
	]
},
```

## 8、Plugins

扩展 `webpack` 本身的一些功能，它们会运行在 `webpack` 的不同阶段（钩子 / 生命周期）。webpack 自身也是构建于你在 webpack 配置中用到的**相同的插件系统**之上！

插件目的在于解决 [loader](https://webpack.docschina.org/concepts/loaders) 无法实现的**其他事**。

### 8-1、HtmlWebpackPlugin

在打包结束后，⾃动生成⼀个 `html` 文件，并把打包生成的 js、css等模块引⼊到该 `html` 中

```bash
 npm install --save-dev html-webpack-plugin
```

```javascript
 // webpack.config.js
 const HtmlWebpackPlugin = require("html-webpack-plugin");
 module.exports = {
   ...
   plugins: [
      new HtmlWebpackPlugin({
        title: "My App",
        filename: "app.html",
        template: "./src/html/index.html"
      })
   ]
 };
```

```html
 <!--./src/html/index.html-->
 <!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta http-equiv="X-UA-Compatible" content="ie=edge">
     <title><%=htmlWebpackPlugin.options.title%></title>
 </head>
 <body>
     <h1>html-webpack-plugin</h1>
 </body>
 </html>
```

在 `html` 模板中，可以通过 `<%=htmlWebpackPlugin.options.XXX%>` 的方式获取配置的值

**更多的配置**

- `title`: ⽤来生成⻚面的 `title` 元素
- `filename`: 输出的 `HTML` ⽂件名，默认是 `index.html`， 也可以直接配置子目录
- `template`: 模板⽂件路径，⽀持加载器（`loader`），⽐如 `html!./index.html`
- `inject`: `true | 'head' | 'body' | false`，注⼊所有的资源到特定的 `template` 或者 `templateContent` 中，如果设置为 `true` 或者 `body`，所有的 `javascript` 资源将被放置到 `body` 元素的底部，`'head'` 将放置到 `head` 元素中
- `favicon`: 添加特定的 `favicon` 路径到输出的 `HTML` 文件中
- `minify`: `{} | false`， 传递 `html-minifier` 选项给 `minify` 输出
- `hash`: `true | false`，如果为 `true`，将添加 `webpack` 编译生成的 `hash` 到所有包含的脚本和 `CSS` ⽂件，对于解除 `cache` 很有用
- `cache`: `true | false`，如果为 `true`，这是默认值，仅在文件修改之后才会发布文件
- `showErrors`: `true | false`，如果为 `true`，这是默认值，错误信息会写入到 `HTML` ⻚面中
- `chunks`: 允许只添加某些块 (⽐如，仅 unit test 块)
- `chunksSortMode`: 允许控制块在添加到⻚面之前的排序方式，⽀持的值:`'none' | 'default' |{function}-default:'auto'`
- `excludeChunks`: 允许跳过某些块，(⽐如，跳过单元测试的块)

### 8-2、clean-webpack-plugin

删除（清理）构建目录

```
 npm install --save-dev clean-webpack-plugin
```

```
 const {CleanWebpackPlugin} = require('clean-webpack-plugin');
 module.exports = {
   ...
   plugins: [
     ...,
     new CleanWebpackPlugin(),
     ...
   ]
 }
```

### 8-3、mini-css-extract-plugin

提取 `CSS` 到一个单独的文件中

```
 npm install --save-dev mini-css-extract-plugin
```

```
 const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 module.exports = {
   ...,
   module: {
     rules: [
       {
         test: /\.s[ac]ss$/,
         use: [
           {
             loader: MiniCssExtractPlugin.loader
           },
           'css-loader',
           'sass-loader'
         ]
       }
     ]
   },
   plugins: [
     ...,
     new MiniCssExtractPlugin({
       filename: '[name].css'
     }),
     ...
   ]
 }
```

## 9、WebpackDevServer

每次的代码修改都需要重新编译打包，刷新浏览器，特别麻烦，我们可以通过安装 `webpackDevServer` 来改善这方面的体验

```
 npm install --save-dev webpack-dev-server
```

启动命令：

```
 npx webpack-dev-server
```

或者，`package.json` 中添加 `scripts`

```
 ...,
 "scripts": {
   "server": "webpack-dev-server"
 }
```

修改 `webpack.config.js`

```
 module.exports = {
   ...,
   devServer: {
     // 扩展的虚拟路径
     contentBase: "./abc",
     // 自动开启浏览器
     open: true,
     // 端口
     port: 8081
   }
 }
```

**为什么要配置 contentBase ？**

因为 webpack 在进行打包的时候，对静态文件的处理，例如图片，都是直接 copy 到 dist 目录下面。但是对于本地开发来说，这个过程太费时，也没有必要，所以在设置 contentBase 之后，就直接到对应的静态目录下面去读取文件，而不需对文件做任何移动，节省了时间和性能开销。

### 9-1、Proxy

当下前端的开发都是前后端分离开发的，前端开发过程中代码会运行在一个服务器环境下(如当前的 `WebpackDevServer`)，那么在处理一些后端请求的时候通常会出现跨域的问题。`WebpackDevServer` 内置了一个代理服务，通过内置代理就可以把我们的跨域请求转发目标服务器上(`WebpackDevServer` 内置的代理发送的请求属于后端 - `node`，不受同源策略限制)，具体如下：

<!--后端代码，以 node 为例-->

```
 const Koa = require('koa');
 const KoaRouter = require('koa-router');
 
 const app = new Koa();
 const router = new KoaRouter();
 
 router.get('/api/info', async ctx => {
     ctx.body = {
         username: 'zMouse',
         gender: 'male'
     }
 })
 
 app.use( router.routes() );
 app.listen(8787);
```

<!--前端代码-->

```
 axios({
   url: 'http://localhost:8787/api/info'
 }).then(res => {
   console.log('res',res.data);
 })
```

默认情况下，该代码运行以后会出现跨域请求错误，修改 `webpack` 配置

```
 module.exports = {
   ...,
   devServer: {
     // 生成的虚拟目录路径
     contentBase: "./dist",
     // 自动开启浏览器
     open: true,
     // 端口
     port: 8081,
     proxy: {
       '/api': {
         target: 'http://localhost:8787'
       }
     }
   }
 }
```

通过 `proxy` 设置，当我们在当前 `WebpackDevServer` 环境下发送以 `/api` 开头的请求都会被转发到 `http://localhost:8787` 目标服务器下

```
 axios({
   //url: 'http://locahost:8081/api/info',
   url: '/api/info'
 }).then(res => {
   console.log('res',res.data);
 })
```

注意 `url` 地址要填写 `WebpackDevServer` 域，比如当前 `WebpackDevServer` 开启的是 `http://localhost:8081`，也就是我们当前前端代码运行的环境，那么请求的 `url` 也必须发送到这里，当我们的请求满足了 `proxy` 中设置的 `/api` 开头，那么就会把请求转发到 `target` ，所以最后的实际请求是：`http://lcoahost:8787/api/info`

### **9 - 2、Hot Module Replacement**

在之前当代码有变化，我们使用的 `live reload`，也就是刷新整个页面，虽然这样为我们省掉了很多手动刷新页面的麻烦，但是这样即使只是修改了很小的内容，也会刷新整个页面，无法保持页面操作状态。`HMR` 随之就出现了，它的核心的局部（模块）更新，也就是不刷新页面，只更新变化的部分

```jsx
 module.exports = {
   ...,
   devServer: {
     // 生成的虚拟目录路径
     contentBase: "./dist",
     // 自动开启浏览器
     open: true,
     // 端口
     port: 8081,
     // 开启热更新
     hot:true,
     // 即使 HMR 不生效，也不去刷新整个页面(选择开启)
     hotOnly:true,
     proxy: {
       '/api': {
         target: 'http://localhost:8787'
       }
     }
   }
 }
```

开启 `HMR` 以后，当代码发生变化，`webpack` 即会进行编译，并通过 `websocket` 通知客户端(浏览器)，我们需要监听处理来自 `webpack` 的通知，然后通过 `HMR` 提供的  `API` 来完成我们的局部更新逻辑

<!--./fn1.js-->

```jsx
 export default function() {
     console.log('start1!');
 }
```

<!--index.js-->

```jsx
 import fn1 from './fn1.js';
 box1.onclick = fn1;
 
 if (module.hot) {//如果开启 HMR
     module.hot.accept('./fn1.js', function() {
       // 更新逻辑
       box1.onclick = fn1;
     })
 }
```

上面代码就是 当 ./fn1.js 模块代码发生变化的时候，把最新的 fn1 函数绑定到 box1.onclick 上

从上面就可以看到，`HMR` 其实就是以模块为单位，当模块代码发生修改的时候，通知客户端进行对应的更新，而客户端则根据具体的模块来更新我们的页面逻辑(这些逻辑需要自己去实现)，好在当前一些常用的更新逻辑都有了现成的插件

**css热更新**

样式热更新比较简单，`style-loader` 中就已经集成实现了，我们只需要在 `use` 中使用就可以了

**react 热更新**

- [https://github.com/gaearon/react-hot-loader](https://github.com/gaearon/react-hot-loader)
- react 脚手架中也有集成

**vue 热更新**

- [https://github.com/vuejs/vue-loader](https://github.com/vuejs/vue-loader)
- vue 脚手架中也有集成

## 10、sourceMap

我们实际运行在浏览器的代码是通过 `webpack` 打包合并甚至是压缩混淆过的代码，所生成的代码并不利于我们的调试和错误定位，我们可以通过 `sourceMap` 来解决这个问题，`sourceMap` 本质是一个记录了编译后代码与源代码的映射关系的文件，我们可以通过 `webpack` 的 `devtool` 选项来开启 `sourceMap`

```jsx
 module.exports = {
   mode: 'production',
   devtool: 'source-map',
   ...
 }
```

除了 `source-map` 这种类型之外，还有很多种类型可以用，例如：

-   `eval`
-   `eval-source-map`
-   `cheap-source-map`
-   `inline-source-map`
-   `cheap-module-source-map`
-   `inline-cheap-source-map`
-   `cheap-module-eval-source-map`
-   `inline-cheap-module-source-map`
-   `hidden-source-map`
-   `nosources-source-map`

首先，编译后会为每一个编译文件生成一个对应的 `.map` 文件，同时在编译文件中添加一段对应的 `map` 文件引入代码

```
 ...
 //# sourceMappingURL=xx.js.map
```

```
 ...
 /*# sourceMappingURL=xx.css.map*/
```

同时，现代浏览器都能够识别 `sourceMap` 文件，如 `chrome`，会在 `Sources` 面板中显示根据编译文件与对应的 `map` 文件定位到源文件中，有利于我们的调试和错误定位

### 配置项差异

通过打包发现，`eval`和`inline`都是没有对应的map文件的。

总结一下：

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202204141759625.png)

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202204141759902.png)

#### 推荐配置

1.  本地开发：

- 推荐：`eval-cheap-module-source-map`
- 理由：
	- 本地开发首次打包慢点没关系，因为 `eval` 缓存的原因，rebuild 会很快
	- 开发中，我们每行代码不会写的太长，只需要定位到行就行，所以加上 `cheap`
	- 我们希望能够找到源代码的错误，而不是打包后的，所以需要加上 `module`

2.  生产环境：

- 推荐：`(none)`
- 理由：
	- 就是不想别人看到我的源代码

## 11、Code Spliting

将代码分割到多个不同的bundle(打包后)文件中，可以通过按需加载等方式对资源进行加载，使用合理的情况下可以极大影响加载速度。

### 11-1、入口起点

通过设置多个入口文件的方式实现最简单的代码分割

```jsx
 entry: {
   index: "./src/index.js",
   list: "./src/list.js",
 },
 output: {
   path: resolve(__dirname, "../dist"),
   // 多入口文件的filename不能写死名称，需要通过[name]配置
   filename: "js/[name].js",
 }
```

### 11-2、防止重复

通过设置dependOn配置多个模块之间的共享

```jsx
 entry: {
   index: {
     import: "./src/index.js",
     dependOn: "axios",
   },
   list: {
     import: "./src/list.js",
     dependOn: "axios",
   },
   axios: "axios",
 },
```

> When you opt-in to code splitting, Webpack may duplicate modules between chunks depending on heuristics. If this happens, then you can end up with multiple instances of the same module, each with their own state that can easily get out of sync.However, you can set optimization.runtimeChunk to . This moves Webpack's runtime module loader into its own bundle rather than being inlined into each entry, creating a global registry that allows code-splitted modules to be shared between entries. This doesn't prevent Webpack from copying module code between entry points, but it prevents it creating two instances of the same module at runtime, while reducing the number of HTTP requests needed to load modules for a given page."single"当你选择使用代码分割时，webpack可能会受启发式的在多个chunk中复制依赖模块。如果发生了这种事情，这时您有可能得到相同模块的多个实例，他们之间的状态将会很难保证同步。当然，您可以通过设置 optimization.runtimeChunk为“single”进行解决 。这会将Webpack的运行时模块加载程序移到它自己的包中，而不是内联到每个条目中，从而创建一个全局注册表，允许在条目之间共享代码分割的模块。这并不能阻止Webpack在入口点之间复制模块代码，但它可以防止Webpack在运行时创建同一模块的两个实例，同时减少为给定页面加载模块所需的HTTP请求数。runtimeChunk: "single"是对于确保模块实例化正确所必须的，它默认是禁用状态，这在Webpack代码分割指南中记载着。Although using multiple entry points per page is allowed in webpack, it should be avoided when possible in favor of an entry point with multiple imports: entry: { page: ['./analytics', './app'] }. This results in a better optimization and consistent execution order when using async script tags.尽管我们可以在webpack中对每个页面配置多入口，但我们应当避免像entry: { page: ['./analytics', './app'] }这样的多入口使用多引入的情况。这会让我们在使用async属性的script标签时获得更好的优化以及保证其一致的执行顺序。

### **11 - 2 - 1、SplitChunksPlugin**

将公共的依赖模块提取到已有的入口chunk文件或新的chunk文件当中

```jsx
 entry: {
   index: "./src/index.js",
   list: "./src/list.js",
 },
 optimization: {
   splitChunks: {
     // async表示只从异步加载得模块（动态加载import()）里面进行拆分
     // initial表示只从入口模块进行拆分
     // all表示以上两者都包括
     chunks: "all",
   },
 }
```

```jsx
 // 默认配置
 optimization: {
   splitChunks: {
     chunks: 'async',
     minSize: 20000,
     minRemainingSize: 0,
     minChunks: 1,
     maxAsyncRequests: 30,
     maxInitialRequests: 30,
     enforceSizeThreshold: 50000,
     cacheGroups: {
       defaultVendors: {
         test: /[\\/]node_modules[\\/]/,
         priority: -10,
         reuseExistingChunk: true,
       },
       default: {
         minChunks: 2,
         priority: -20,
         reuseExistingChunk: true,
       },
     },
   },
 },
```

### **11 - 3、动态导入**

通过`import()`动态导入模块，可以通过内联注释对chunk进行一些配置

[模块方法 | webpack 中文文档 (docschina.org)](https://webpack.docschina.org/api/module-methods/#magic-comments)

```jsx
 import(/* webpackChunkName: 'data', webpackPreload: true*/ './data')
   .then(data => {
     console.log(data);
   })
```

## **12、预加载/预获取**

通过内联注释`webpackPrefetch`和`webpackPreload`两种资源提示告知浏览器对资源进行不同的加载处理

```jsx
 const data = import(/* webpackChunkName: 'data', webpackPreload: true */ './data.js')
 const data = import(/* webpackChunkName: 'data', webpackPrefetch: true */ './data.js')
```

> 与 prefetch 指令相比，preload 指令有许多不同之处：preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。浏览器支持程度不同。
> 

## **13、外部扩展**

通过externals配置在输出的bundle中排除某些依赖，这些依赖将会在用户环境中所包含。

```jsx
 externals:
   lodash: '_'
 },
```

## **14、tree shaking**

将上下文中的dead-code移除，就像摇树上的枯叶使其掉落一样

```jsx
optimization: {
   usedExports: true,
}
```
