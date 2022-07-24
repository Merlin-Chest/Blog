# JSX
[文献链接](https://ijpqg5zm8j.feishu.cn/docs/doccnf8zVMcqwwjw6TWz5SnoUmf#hX0qpF

## jsx简介

JSX，是一个 JavaScript 的语法扩展。

JSX，也是一个表达式。

JSX 防止注入攻击。

JSX会被转化成React.createElement()函数调用。

### 需要注意的几点
- 关键字冲突

因为 JSX 只是 JS 的语法糖，所以 React 在设计 DOM Element API 时，避免了与 JavaScript 的关键字冲突的一些属性名。

> 有 TypeScript 的支持，可以通过静态检查、智能提示保证代码正确性，无需记忆
- 使用 html 字符串

React 会对插入在文字做 html 转义，避免一些安全问题。可以使用 `dangerouslySetInnerHTML` 属性来设置某个 DOM Element 的 innerHTML。