# 事件循环

## 前言

JavaScript是一门单线程的非阻塞的脚本语言。
- 单线程，由于JavaScript在浏览器中，需要进行各种各样的dom操作，为了避免线程冲突，则选择采用一个主线程来执行代码，来保证程序执行的一致性。
- 非阻塞，JavaScript引擎通过`Event Loop`事件循环机制来避免代码运行时的阻塞问题，也是本文的主题，下面对事件循环机制的运作进行分析。

### 进程与线程

本质上来说，两个名词都是CPU工作时间片的一个描述。

进程描述了 CPU 在运行指令及加载和保存上下文所需的时间，也就是代表一个程序。

线程是进程中的更小单位，描述了执行一段指令所需的时间。

 拿浏览器来说，当你`打开一个 Tab ⻚`时，其实就是 `创建了一个进程`，一个进程中可以`有多个线程`，比如渲染线程、JS 引擎线程、HTTP 请求线程等等。当你`发起一个请求`时，其实就是`创建了一个线程`，当请求结束后，该线程可能就会被销毁。

> JS单线程的好处
> 节省内存，节约上下文切换时间，没有锁的问题

## 浏览器环境下

在JavaScript中，我们可以将代码分为：
- 宏任务（macro task）
	- script（代码片段，包括了同步代码）
	- `setTimeout`
	- `setInterval`
	- `I/O`
	- `UI Rendering`
	- ...
- 微任务（micro task）
	- `Promise`
	- `Process.nextTick（Node独有）`
	- `MutationObserver`
	- ...

同时，也具备了不同代码执行时的容器，用来管理代码的当前运作状态。
- 函数调用栈
	- 执行同步代码，后进先出，当函数执行的时候，会被添加到栈的顶部，当执行栈执行完成后，就会从栈顶移出，直到栈内被清空。
- 宏任务队列 / 微任务队列
	- 先进先出，当异步任务在事件池有了结果后，将注册的回调函数放入任务队列中等待被执行。
- Web APIs事件池（宏任务）
	- 用来存储异步事件，当异步任务到达时机时，将注册的回调函数放入任务队列中等待主线程空闲的时候（也就是调用栈被清空时），被读取到栈内等待主线程的执行。

![image](https://cdn.jsdelivr.net/gh/Merlin218/image-storage@master/picX/image.15vawwy79ucg.webp)

>微任务没有像宏任务那样的Web APIs事件池，直接进入队列。

下面通过一段代码，分析事件循环的运作过程：

```js
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end') 
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```

首先，先执行同步代码，也属于宏任务，毋庸置疑，最开始打印`script start`，

接着呢，我们定义了`async1`和`async2`两个函数，函数定义可以跳过，

接着，调用`async1`，其中`await`处会返回一个`Promise`，await后面的部分会作为`Promise.then(cb)`cb回调函数中的内容。于是执行`async2`打印`async2 end`，由于这个过程是异步的，所以await后面的部分不会立即调用，而是进入微任务队列，等待执行。

接着，`setTimeout`是宏任务，进入`web APIs`等待执行。

接着，打印`promise`和`script end`，`.then中cb函数的内容`会被推进微任务队列中等待执行。

此时，同步代码已经执行完成，检查微任务队列是否为空，然后按照先入先出规则，依次执行。此时会依次打印`async1 end`、`promise1`、`promise2`

当微任务队列全部执行完后，会检查是否需要渲染页面，之后进入下一个`Event Loop`，执行宏任务，打印`setTimeout`

当执行完一个宏任务，浏览器会再次去检查**microtask队列是否为空**（执行完一个task的具体标志是函数执行栈为空），**如果不为空则会一次性执行完所有microtask**。然后继续取下一个task执行，以此类推。

> DOM（重新）渲染的时机在于微任务和宏任务之间。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202204121515830.png)

> 注意：每执行一个宏任务都算是一个事件周期，也就是说当有多个宏任务时，对应多个周期，在这些周期的间隔都会拿出微任务去执行。

## Node环境下

每次事件循环都包含了6个阶段，对应到 libuv 源码中的实现，如下图所示：
![image](http://lynnelv.github.io/img/article/event-loop/node-libuv.png)

-   **timers 阶段**：这个阶段执行timer（`setTimeout`、`setInterval`）的回调
-   **I/O callbacks 阶段**：执行一些系统调用错误，比如网络通信的错误回调
-   **idle, prepare 阶段**：仅node内部使用
-   **poll 阶段**：获取新的I/O事件, 适当的条件下node将阻塞在这里
-   **check 阶段**：执行 `setImmediate()` 的回调
-   **close callbacks 阶段**：执行 `socket` 的 `close` 事件回调

主要了解`timers`、`poll`、`check`阶段。

### timers 阶段

检查有无已过期的timer，如果有则把它的回调压入timer的任务队列中等待执行。

事实上不能保证timer在预设时间到了就会立即执行，会受机器上其它运行程序影响，或者那个时间点主线程不空闲。

`setTimeout()` 和 `setImmediate()` 的执行顺序是不确定的。

```javascript
setTimeout(() => {
  console.log('timeout')
}, 0)

setImmediate(() => {
  console.log('immediate')
})
```

但是把它们放到一个`I/O回调`里面，就一定是 `setImmediate()` 先执行，因为poll阶段后面就是check阶段。

### poll 阶段

poll 阶段主要有2个功能：

-   处理 poll 队列的事件
-   当有已超时的 timer，执行它的回调函数

将同步执行poll队列里的回调，直到队列为空或执行的回调达到系统上限，检查是否有预设的`setImmediate`，有的话进入`check`阶段，没有的话会阻塞。此时，会有一个检查机制，检查timer队列是否为空，如果timer队列非空，event loop就开始下一轮事件循环，即重新进入到timer阶段。

### check 阶段

`setImmediate()`的回调会被加入check队列中， 从event loop的阶段图可以知道，check阶段的执行顺序在poll阶段之后。

### 举个例子

```js
console.log('start')
setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(function() {
    console.log('promise1')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
  Promise.resolve().then(function() {
    console.log('promise2')
  })
}, 0)
Promise.resolve().then(function() {
  console.log('promise3')
})
console.log('end')
//start=>end=>promise3=>timer1=>timer2=>promise1=>promise2
```

-   一开始执行同步代码，依次打印出start end，并将2个timer依次放入timer队列
-   然后会先去执行微任务，所以打印出promise3
-   然后进入`timers`阶段，执行timer1的回调函数，打印timer1，并将promise.then回调放入`micro task`队列，同样的步骤执行timer2，打印timer2
-   `timers`阶段结束，会执行微任务，打印出promise1，promise2，然后再进入下一个阶段

### 小结

-   event loop 的每个阶段都有一个任务队列
-   当 event loop 到达某个阶段时，将执行该阶段的任务队列，直到队列清空或执行的回调达到系统上限后，才会转入下一个阶段
-   在Node.js中，`microtask`会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行`microtask`队列的任务。
-   当所有阶段被顺序执行一次后，称 `event loop 完成了一个 tick`

## microtask的执行时机

-   Node端，microtask 在事件循环的各个阶段之间执行
-   浏览器端，microtask 在事件循环的 macrotask 执行完之后执行

> 文章参考：
> - [深入理解js事件循环机制（Node.js篇）](http://lynnelv.github.io/js-event-loop-nodejs)
>  - [一篇文章教会你Event loop——浏览器和Node](https://segmentfault.com/a/1190000013861128)
>  - [一次弄懂Event Loop（彻底解决此类面试问题）](https://juejin.cn/post/6844903764202094606)
> -  [# 浏览器与Node的事件循环(Event Loop)有何区别?](https://juejin.cn/post/6844903761949753352)