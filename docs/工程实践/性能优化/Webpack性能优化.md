# Webpack性能优化

两个问题：
- 减少Webpack打包时间
- 减少Webpack打包大小

## 优化打包时间

### 优化Loader

对于`Loader`来说，影响打包效率主要来自`babel`。因为`babel`会将代码转化为`AST`树，对`AST`继续转变为新的代码，项目越大，代码越多，效率越低。

优化方案：
```js
module.exports = {
  module: {
    rules: [
      {
        // js 文件才使用 babel，优化文件搜索范围
        test: /\.js$/,
        // 将转译的结果缓存到文件系统中，只编译更改的代码文件
        loader: 'babel-loader?cacheDirectory=true',
        // 只在 src 文件夹下查找
        include: [resolve('src')],
        // 不会去查找的路径
        exclude: /node_modules/
      }
    ]
  }
}
```

### HappyPack

Webpack 在打包的过程中是单线程的，特别是在执行 Loader 的时候，长时间编译的任务很多，这样就会导致等待的情况。

**HappyPack 可以将 Loader 的同步执行转换为并行的**，这样就能充分利用系统资源来加快打包效率。

```js
module: {
  loaders: [
    {
      test: /\.js$/,
      include: [resolve('src')],
      exclude: /node_modules/,
      // id 后面的内容对应下面
      loader: 'happypack/loader?id=happybabel'
    }
  ]
},
plugins: [
  new HappyPack({
    id: 'happybabel',
    loaders: ['babel-loader?cacheDirectory'],
    // 开启 4 个线程
    threads: 4
  })
]
```

### DllPlugin

**DllPlugin 可以将特定的类库提前打包然后引入**。这种方式可以极大的减少打包类库的次数，只有当类库更新版本才有需要重新打包，并且也实现了将公共代码抽离成单独文件的优化方案。

```js
// 单独配置在一个文件中
// webpack.dll.conf.js
const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    // 想统一打包的类库
    vendor: ['react']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].dll.js',
    library: '[name]-[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      // name 必须和 output.library 一致
      name: '[name]-[hash]',
      // 该属性需要与 DllReferencePlugin 中一致
      context: __dirname,
      path: path.join(__dirname, 'dist', '[name]-manifest.json')
    })
  ]
}
```

然后我们需要执行这个配置文件生成依赖文件，接下来我们需要使用 `DllReferencePlugin` 将依赖文件引入项目中

```js
// webpack.conf.js
module.exports = {
  // ...省略其他配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      // manifest 就是之前打包出来的 json 文件
      manifest: require('./dist/vendor-manifest.json'),
    })
  ]
}
```

### 代码压缩

在 Webpack3 中，一般使用 `UglifyJS` 来压缩代码，但是这个是单线程运行的，为了加快效率，我们可以使用 `webpack-parallel-uglify-plugin` 来并行运行 `UglifyJS`，从而提高效率。

在 Webpack4 中，我们就不需要以上这些操作了，只需要将 `mode` 设置为 `production` 就可以默认开启以上功能。代码压缩也是我们必做的性能优化方案，当然我们不止可以压缩 JS 代码，还可以压缩 HTML、CSS 代码，并且在压缩 JS 代码的过程中，我们还可以通过配置实现比如删除 `console.log` 这类代码的功能。

### 其他优化点

- `resolve.extension`用来表明文件后缀列表，默认查找顺序是 `['.js', '.json']`，如果你的导入文件没有添加后缀就会按照这个顺序查找文件。我们应该尽可能`减少后缀列表长度`，然后将`出现频率高的后缀排在前面`
- `resolve.alias`：可以通过别名的方式来映射一个路径，能让 Webpack 更快找到路径。
- `module.noParse`：如果你确定一个文件下没有其他依赖，就可以使用该属性让 Webpack 不扫描该文件，这种方式对于大型的类库很有帮助

## 优化文件体积

### 按需加载

首页能加载的文件体积越小越好，将每个路由页面单独打包为一个文件

鉴于用的框架不同，实现起来都是不一样的。但底层的机制都是一样的：当使用的时候再去下载对应文件，返回一个 `Promise`，当 `Promise` 成功以后去执行回调。

### Scope Hoisting

分析出模块之间的依赖关系，尽可能的把打包出来的模块合并到一个函数中去。

比如我们希望打包两个文件

```js
// test.js  
export const a = 1  
// index.js  
import { a } from './test.js'
```

对于这种情况，我们打包出来的代码会类似这样

```js
 [  
  /* 0 */  
  function (module, exports, require) {  
  //...  
  },  
  /* 1 */  
  function (module, exports, require) {  
  //...  
  }  
 ]
```

如果使用 `Scope Hoisting` 的话，代码就会尽可能的合并到一个函数中去，也就变成了这样的类似代码。

```js
[
  /* 0 */
  function (module, exports, require) {
    //...
  }
]
```

开启这个功能，只需要启用 `optimization.concatenateModules` 就可以了。

### Tree Shaking

实现删除项目中未被引用的代码。在`生成环境`下会自动开启这个功能。