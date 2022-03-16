# Promise

## 什么是Promise

 - 一种异步编程的解决方案
 - 传统的解决方案——回调函数和事件
 - Promise对象的特点
	1. 对象的状态不受外部影响，内部抛出的错误也不会影响到外部
	2. 支持链式调用
	3. 一旦状态改变，就不会再变
		 - `pending`->`fulfilled`
		 - `pending`->`rejected`
	4. 这两种状态一发生，我们就称为`resolved`，如果状态已经改变了，再去添加回调函数，那么也会拿到结果
		- 与事件的特点不同。事件的特点是，如果你错过了它，再去监听，是得不到结果的
	5. 无法取消`Promise`，一旦新建它就会立即执行，无法中途取消（缺点）
	6. 当处于`pending`状态时，无法得知目前进展到哪一个阶段（缺点）

## 方法
 
 ### then
  - 作用：定义状态改变时的回调函数，第一个参数是`resolved`状态的回调函数，第二个参数是`rejected`状态的回调函数
  - 返回一个新的Promise实例，因此可以采用链式写法

### catch

- `.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数
- 会捕获Promise或者回调函数中的错误。Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个`catch`语句捕获。
- 建议总是使用`catch()`方法，而不使用`then()`方法的第二个参数。因为可以捕获前面`then`方法执行中的错误，也更接近同步的写法（`try/catch`）

### finally

- 用于指定不管 Promise 对象最后状态如何，都会执行的操作
- 本质上还是then的特例
- ES2018新增的标准

### Promise.all

- 用于将多个 Promise 实例，包装成一个新的 Promise 实例
- `p`的状态由`p1`、`p2`、`p3`决定，分成两种情况。
	1. 只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。
	2. 只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。

> 注意：如果作为参数的 Promise 实例，自己定义了`catch`方法，那么它一旦被`rejected`，并不会触发`Promise.all()`的`catch`方法
- 例子
```js
// 注意，如果作为参数的 Promise 实例，自己定义了`catch`方法，那么它一旦被`rejected`，并不会触发`Promise.all()`的`catch`方法。
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]


// 如果`p2`没有自己的`catch`方法，就会调用`Promise.all()`的`catch`方法。
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// Error: 报错了
```
### Promise.race

- 将多个 Promise 实例，包装成一个新的 Promise 实例
- 只要`p1`、`p2`、`p3`之中有一个实例**率先改变状态**，`p`的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给`p`的回调函数。无论状态是resolve还是reject
- 例子：如果指定时间内没有获得结果，就将 Promise 的状态变为`reject`，否则变为`resolve`
```js
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```

### Promise.allSettled

- ES2020标准新增
- 返回的新的 Promise 实例，一旦发生状态变更，状态总是`fulfilled`，不会变成`rejected`。
- 状态变成`fulfilled`后，它的回调函数会接收到一个数组作为参数，该数组的每个成员对应前面数组的每个 Promise 对象。
- `results`的每个成员是一个对象，对象的格式是固定的，对应异步操作的结果

```js
// 异步操作成功时
{status: 'fulfilled', value: value}

// 异步操作失败时
{status: 'rejected', reason: reason}
```

### Promise.any

- ES2021标准引入
- 只要参数实例有一个变成`fulfilled`状态，包装实例就会变成`fulfilled`状态；如果所有参数实例都变成`rejected`状态，包装实例就会变成`rejected`状态。
- `Promise.any()`抛出的错误，不是一个一般的 Error 错误对象，而是一个AggregateError 实例。它相当于一个数组，每个成员对应一个被`rejected`的操作所抛出的错误。

### Promise.resolve

- 将现有对象转为 Promise 对象
- 参数分为四种情况
	- Promise实例，直接返回
	- `thenable`对象（具有then方法的对象），将这个对象转为 Promise 对象，并立即执行`thenable`对象的`then()`方法
	- 参数不是具有`then()`方法的对象，或根本就不是对象，则返回一个新的 Promise 对象，状态为`resolved`
	- 不带参数，直接返回一个`resolved`状态的 Promise 对象

### Promise.reject

- 返回一个新的 Promise 实例，该实例的状态为`rejected`
- 参数：错误信息，字符串

### Promise.try

- 模拟`try`代码块
- 例子

```js
function getUsername(userId) {
  return database.users.get({id: userId})
  .then(function(user) {
    return user.name;
  });
}

try {
  database.users.get({id: userId})
  .then(...)
  // 捕获异步错误
  .catch(...)
} catch (e) {
  // 捕获同步错误
}

// promise.try写法更优雅
Promise.try(() => database.users.get({id: userId}))
  .then(...)
  .catch(...) // 可以捕获异步和同步的错误
```

## 总结

- Promise
	- 异步编程的解决方案
		- 对比回调函数和事件
	- 特点
		- 内部状态不影响外部
		- 链式调用
		- 无法判断事情的进展
		- 无法取消
		- 状态一旦确定不可改变
	- API
		- all：全部fulfilled -> fulfilled；一个reject -> reject
		- any：一个fulfilled -> fulfilled;全部reject -> reject
		- race：第一个响应决定状态和结果
		- allSettled：永远resolve，拿到一个Promise结果数组