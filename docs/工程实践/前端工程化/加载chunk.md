## 代码分离方法
-   入口起点：使用 [`entry`](https://www.webpackjs.com/configuration/entry-context) 配置手动地分离代码。
-   防止重复：使用 [`CommonsChunkPlugin`](https://www.webpackjs.com/plugins/commons-chunk-plugin) 去重和分离 chunk。
-   动态导入：通过模块的内联函数调用来分离代码。

## 运行原理
我们下面来解析，动态导入的方式，如何加载chunk。

对于动态导入，

第一种，也是优先选择的方式是，使用符合 [ECMAScript 提案](https://github.com/tc39/proposal-dynamic-import) 的 [`import()` 语法](https://www.webpackjs.com/api/module-methods#import-)。

第二种，则是使用 webpack 特定的 [`require.ensure`](https://www.webpackjs.com/api/module-methods#require-ensure)。

```javascript
// 以下为 index.js 内容
import("./sum").then((m) => {
  m.default(3, 4);
});

// 以下为 sum.js 内容
const sum = (x, y) => x + y;
export default sum;
```

```json
// webpack配置
{
  entry: './index.js',
  mode: 'none',
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: 'chunk.[name].[id].[contenthash].js',
    path: path.resolve(__dirname, 'dist/deterministic'),
    clean: true
  },
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic'
  }
}
```
通过观察打包后的文件 `dist/deterministic/main.xxxxxx.js`，可以发现: 使用 `import()` 加载数据时，以上代码将被 `webpack` 编译为以下代码

```js
__webpack_require__
  .e(/* import() | sum */ 644) // 644则是chunkId，是动态加载模块的一个id，加载完成后👇🏻
  .then(__webpack_require__.bind(__webpack_require__, 709))// 709是moduleId，去获取这个模块👇🏻
  .then((m) => { // 拿到模块后，然后完成对应的任务👇🏻
    m.default(3, 4);
  });
```

此时 `644` 为 chunkId，观察 `chunk.sum.xxxx.js` 文件，以下为 `sum` 函数所构建而成的 chunk:
```js
"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([
  [644],
  {
    /***/ 709: /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      });
      const sum = (x, y) => x + y;

      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = sum;

      /***/
    },
  },
]);
```

以下两个数据结构是加载 `chunk` 的关键:

1.  `__webpack_require__.e`: 加载 chunk。该函数将使用 `document.createElement('script')` 异步加载 chunk 并封装为 Promise。
2.  `self["webpackChunk"].push`: JSONP callback，收集 modules 至 `__webpack_modules__`，并将 `__webpack_require__.e` 的 Promise 进行 resolve。

实际上，在 `webpack` 中可配置 `output.chunkLoading` 来选择加载 chunk 的方式，比如选择通过 `import()` 的方式进行加载。(由于在生产环境需要考虑 import 的兼容性，目前还是 JSONP 方式较多)
```json
{
  entry: './index.js',
  mode: 'none',
  output: {
    filename: 'main.[contenthash].js',
    chunkFilename: '[name].chunk.[chunkhash].js',
    path: path.resolve(__dirname, 'dist/import'),
    clean: true,
    // 默认为 `jsonp`
    chunkLoading: 'import'
  }
})
```

>#jsonp
>JSONP运行原理
>
>**Web页面上调用js文件时则不受是否跨域的影响**（不仅如此，我们还发现凡是拥有`src`这个属性的标签都拥有跨域的能力，比如`<script>`、`<img>`、`<iframe>`)；

#### 原生JS实现JSONP的步骤

客户端
1.  定义获取数据后调用的回调函数
2.  动态生成对服务端JS进行引用的代码
    -   设置`url`为提供`jsonp`服务的`url`地址，并在该`url`中设置相关`callback`参数
    -   创建`script`标签，并设置其`src`属性
    -   把`script`标签加入`head`，此时调用开始。

服务端
- 将客户端发送的`callback`参数作为函数名来包裹住`JSON`数据，返回数据至客户端。
