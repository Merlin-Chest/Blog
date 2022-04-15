# webpack进阶

## 优化构建速度

### 构建费时的分析

使用插件 [speed-measure-webpack-plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin)

```shell
pnpm i -D speed-measure-webpack-plugin
```

```js
// 费时分析
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
...

const config = {...}

module.exports = (env, argv) => {
  // 这里可以通过不同的模式修改 config 配置


  return smp.wrap(config);
}
```

- 有些 Loader 或者 Plugin 新版本会不兼容，需要进行降级处理，但在 webpack5.x 中为了使用费时分析去对插件进行降级或者修改配置写法是非常不划算的，不建议实际开发中使用。

### 优化resolve配置

#### `alias`：用来创建`import`和`require`的别名，用来简化模块引用。
```js
resolve:{
    // 配置别名
    alias: {
      '~': resolve('src'),
      '@': resolve('src'),
      'comps': resolve('src/components'),
    }
  }
```

#### `extensions`：对于没有后缀的文件路径，按照 extensions 配置的数组从左到右的顺序去尝试解析模块。
	- 高频文件后缀名放前面；
	- 手动配置后，默认配置会被覆盖；

```js
// index.js
import file from '../path/to/file';

// webpack.config.js
const config = {
  //...
  resolve: {
    extensions: ['.ts','...'] // 从左到右尝试解析模块，'...'表示默认列表
  },
};
```

#### `module`：解析模块时应该搜索的目录

```js
resolve: {
	// 优先 src 目录下查找需要解析的文件，会大大节省查找时间
     modules: [ path.resolve(__dirname, 'src'), 'node_modules'],
},
```

#### `resolveLoader`：查找loader时应该搜索的目录

```js
resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname,'loader')]
},
```

#### `externals`：提供了「从输出的 bundle 中排除依赖」的方法，例如从 CDN 引入 jQuery，而不是把它打包。

```html
<!-- 在html引入cdn -->
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous"
></script>
```

```js
// 设置config
const config = {
	externals: {
    jquery: 'jQuery',
  },
}

// index.js
import $ from 'jquery';
$('#app').text('hello jquery')
```

#### 缩小范围
- `include`：符合条件的模块进行解析。
- `exclude`：排除符合条件的模块，不解析；优先级更高。

```js
例如在配置 babel 的时候
const path = require('path');

// 路径处理方法
function resolve(dir){
  return path.join(__dirname, dir);
}

const config = {
  //...
  module: { 
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js$/i,
        include: path.resolve(__dirname. 'src'),
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ]
      },
      // ...
    ]
  }
};
```

#### `noParse`
	- 不需要解析依赖的第三方大型类库等，可以通过这个字段进行配置，以提高构建速度
	- 使用 noParse 进行忽略的模块文件中不会解析 `import`、`require` 等语法

```js
const config = {
  //...
  module: { 
    noParse: /jquery|lodash/,
    rules:[...]
  }
};
```

- `webpack.IgnorePlugin`
	- 忽略第三方包指定目录，让这些指定目录不要被打包进去

例子：
1.  安装 moment 插件（时间处理库）
```shell
pnpm i -S moment
```

2.  配置 IgnorePlugin

```js
// 引入 webpack
const webpack = require('webpack')

const config = {
  ...
  plugins:[ // 配置插件
    ...
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ]  
};
```

目的是将插件中的全部语言排除掉，这样就可以大大节省打包的体积了。但我们同时需要手动引入我们需要的语言，才能正常使用。

```js
import moment from 'moment'

//手动引入所需要的语言包
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

let r = moment().endOf('day').fromNow();
console.log(r);
```

#### 多进程配置

> 在小项目中，开启多线程打包反而会增加时间成本，因为启动进程和进程间通信都会有一定开销。

- `thread-loader`：配置在`thread-loader`之后的loader都会在一个单独的worker池中运行。

```shell
pnpm i -D thread-loader
```

```js
const path = require('path');

const config = {
  //...
  module: { 
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader', // 开启多进程打包
            options: {
              worker: 3,
            }
          },
          'babel-loader',
        ]
      },
      // ...
    ]
  }
};
```

- happypack ❌

同样为开启多进程打包的工具，webpack5 已弃用。

#### 利用缓存

- babel-loader

```js
const config = {
 module: { 
    noParse: /jquery/,
    rules: [
      {
        test: /\.js$/i,
        include: resolve('src'),
        exclude: /node_modules/,
        use: [
          // ...
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true // 启用缓存
            }
          },
        ]
      },
      // ...
    ]
  }
}
```

- cache-loader：处理其他loader的缓存
	- 缓存一些性能开销比较大的 loader 的处理结果
	- 缓存位置：`node_modules/.cache/cache-loader`

```shell
pnpm i -D cache-loader
```

```js
const config = {
 module: { 
    // ...
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'cache-loader', // 获取前面 loader 转换的结果
          'css-loader',
          'postcss-loader',
          'sass-loader', 
        ]
      }, 
      // ...
    ]
  }
}
```

- [hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin) 

为模块提供了中间缓存，重复构建时间大约可以减少 80%，但是在 **webpack5 中已经内置了模块缓存，不需要再使用此插件**

- ##### cache持久化缓存

通过配置 [cache](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Fconfiguration%2Fcache%2F%23root "https://webpack.docschina.org/configuration/cache/#root") 缓存生成的 webpack 模块和 chunk，来改善构建速度。

```js
const config = {
  cache: {
    type: 'filesystem',
  },
};
```

### 优化构建结果

#### 构建结果分析

- 使用[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)插件
- 以直观的看到打包结果中，文件的体积大小、各模块依赖关系、文件是够重复等问题，极大的方便我们在进行项目优化的时候，进行问题诊断。

```shell
pnpm i -D webpack-bundle-analyzer
```

```js
plugins:[
	// ...
	new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件
    })
]
```

#### 压缩CSS

- 安装 [`optimize-css-assets-webpack-plugin`](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)
- 配置
```js
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// ...

const config = {
  // ...
  optimization: {
    minimize: true,
    minimizer: [
      // 添加 css 压缩配置
      new OptimizeCssAssetsPlugin({}),
    ]
  },
 // ...
}
```

#### 压缩JS

使用`webpack5`内置插件[terser-webpack-plugin](https://www.npmjs.com/package/terser-webpack-plugin)，直接引用即可。

```js
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  // ...
  optimization: {
    minimize: true, // 开启最小化
    minimizer: [
      // ...
      new TerserPlugin({})
    ]
  },
  // ...
}
```

#### 清除无用CSS

[purgecss-webpack-plugin](https://www.purgecss.cn/plugins/webpack.html#%E7%94%A8%E6%B3%95) 会单独提取 CSS 并清除用不到的 CSS。

```js
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin')
const glob = require('glob'); // 文件匹配模式

const config = {
	plugins:[
		// ...
		    // 清除无用css
    new PurgecssWebpackPlugin({
      paths: glob.sync(`${path.resolve(__dirname, 'src')}/**/*`, { nodir: true })
    }),
    ]
}

```

#### Tree-Shaking

Tree-shaking 作用是剔除没有使用的代码，以降低包的体积

-   webpack 默认支持，需要在 .bablerc 里面设置 `model：false`，即可在生产环境下默认开启。

[从过去到现在，聊聊 Tree-shaking](https://mp.weixin.qq.com/s/TNXO2ifPymaTxIqzBAmkSQ)

#### Scope Hoisting

Scope Hoisting 即作用域提升，原理是将多个模块放在同一个作用域下，并重命名防止命名冲突，**通过这种方式可以减少函数声明和内存开销**。

-   webpack 默认支持，在生产环境下默认开启
-   只支持 es6 代码

### 运行时体验

运行时优化的核心就是提升首屏的加载速度，主要的方式是
- **降低首屏加载文件体积，首屏不需要的文件进行预加载或者按需加载。**

#### 入口点分割

配置多个打包入口，多页打包。

#### splitChunks 分包配置

optimization.splitChunks 是基于 [SplitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin/) 插件实现的。

默认情况下，它只会影响到按需加载的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。

webpack 将根据以下条件自动拆分 chunks：

-   新的 chunk 可以被共享，或者模块来自于 `node_modules` 文件夹
-   新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
-   当按需加载 chunks 时，并行请求的最大数量小于或等于 30
-   当加载初始化页面时，并发请求的最大数量小于或等于 30

1. 默认配置介绍
```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', // 有效值为 `all`，`async` 和 `initial`
      minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
      minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
      minChunks: 1, // 拆分前必须共享模块的最小 chunks 数。
      maxAsyncRequests: 30, // 最大的按需(异步)加载次数
      maxInitialRequests: 30, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
      enforceSizeThreshold: 50000,
      cacheGroups: { // 配置提取模块的方案
        defaultVendors: {
          test: /[\/]node_modules[\/]/,
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
};
```

- 项目中的使用

```js
const config = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: { // 配置提取模块的方案
        default: false,
        styles: {
            name: 'styles',
            test: /\.(s?css|less|sass)$/,
            chunks: 'all',
            enforce: true,
            priority: 10,
          },
          common: {
            name: 'chunk-common',
            chunks: 'all',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            enforce: true,
            reuseExistingChunk: true,
          },
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 2,
            enforce: true,
            reuseExistingChunk: true,
          },
         // ... 根据不同项目再细化拆分内容
      },
    },
  },
}
```

#### 代码懒加载

针对首屏加载不太需要的一些资源，我们可以通过懒加载的方式去实现。

```js
import logo from '../public/logo.jpg'

const img = new Image()
img.src = logo

document.getElementById('imgBox')?.appendChild(img)

// 按需加载
img.addEventListener('click', () => {
  import('./desc').then(({ default: element }) => {
    console.log(element)
    document.body.appendChild(element)
  })
})
```

#### prefetch 与 preload

- **prefetch** (预获取)：浏览器空闲的时候进行资源的拉取

```js
// 按需加载
img.addEventListener('click', () => {
  import( /* webpackPrefetch: true */ './desc').then(({ default: element }) => {
    console.log(element)
    document.body.appendChild(element)
  })
})
```

##### preload

- **preload** (预加载)：提前加载后面会用到的关键资源
- ⚠️ 因为会提前拉取资源，如果不是特殊需要，谨慎使用

官网示例：

```js
import(/* webpackPreload: true */ 'ChartingLibrary');
```