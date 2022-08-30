# JavaScript基础

- JS基本类型？有哪些
    - number、string、**symbol**、boolean、**bigint**、null、undefined
    - 存储类型
        - 引用类型——引用存在栈，内容存在堆
            - 基本类型大小固定，占用空间小
            - 引用类型大小不固定，影响性能
        - 值类型——栈
- 闭包
    - 理解：一个可以访问外部作用域的函数
    - 使用场景：
        - 保护私有变量，不会被回收
        - 函数 curry 化
        - 防抖节流
        - 立即执行函数（IIFE）

```js
for(var i = 0; i < 10; i++){
  setTimeout(function(){
    console.log(i)
    }, 1000) 
}
// 1秒之后输出10个10
```

-   闭包经典题
    -   Let
    -   立即执行函数
    -   立即执行函数 + setTimeout第三个参数
	-   闭包问题：内存泄漏

-   ES6
    -   assign、create、keys、values、entries
    -   Promise
        -   传统的异步编程：回调函数和事件
            -   事件一旦错过，再去监听，拿不到结果
            -   但是promise的结果是一直存在的，后面去then，还是可以拿到结果
        -   Promise 是承诺的意思，状态一旦确定就不能改变。是一种解决异步编程的方案。
        -   解决回调地狱问题
        -   特点
            -   状态一旦确定就不能改变
            -   状态不影响外部，外部捕获不到错误
            -   支持链式调用
            -   无法判断到哪个阶段
            -   无法取消
        -   API
            -   All
            -   Race：状态由第一个返回的结果决定，不管resolve还是reject
            -   Resolve
            -   Reject
            -   Finally
            -   Catch
            -   any
    -   Proxy
    -   解构运算符、展开运算符、剩余参数
    -   Reduce、at、includes、isArray
    -   Let、const
        -   生成块作用域，const值不可变
        -   var存在变量提升（函数优先级大于变量），变量名提升，值不提升
        -   let、const暂时性死区

```
console.log(a, b) // 12 merlin
var a = 12, b ='merlin' 
function foo(){ 
    console.log(a, b) 
    var a = b = 13 
    console.log(a, b) 
} 
foo() // 13 13 13 13
console.log(a, b) // 12 merlin

// 未声明错误 Uncaught ReferenceError: 变量 is not defined

/* 输出：
    undefined undefined
    undefined "merlin"
    13 13
    12 13
*/
```

-   Class
-   Set、Map对象（object 和 Map 的区别）
    -   Map和WeakMap的区别
        
-   for...in\for...of
-   async、await
-   箭头函数和普通函数的区别
	- 箭头函数
	    - 没有自己的 prototype
	    - 不能作为构造函数
	    - 也没有自己的 argument 对象
	    - 不能用作 generator 函数
	    - this 指向定义时的上下文
	    - 不能通过 call、apply、bind 改变 this
	    - 简化回调函数写法：() => {},() => xxx, xxx => {}
	- 普通函数
		- this指向取决于调用方式
			- new -> 指向new出来的对象
			- obj.xxx() -> 指向obj
			- call、apply、bind -> 指定的this
			- 默认，全局对象；严格模式下为undefined
- 模板字符串
- 对象转原始类型
	- 调用内置的`Symbol.toPrimitive`函数，如果存在的话，调用优先级最高
	- 该函数接受一个`hint`参数，表示要转换到的原始值的预期类型
	- 取值是 `number`、`string` 和 `default` 中的任意一个。
	- 否则，如果 hint 是 `string` —— 尝试 `obj.toString()` 和 `obj.valueOf()`，无论哪个存在。
	- 否则，如果 hint 是 `number` 或 `default` —— 尝试 `obj.valueOf()` 和 `obj.toString()`，无论哪个存在。
	- 在实践中，为了便于`进行日志记录或调试`，对于应该返回一种“可读性好”的对象的表示形式的转换，只需要实现 `obj.toString()` 作为字符串转换的“全能”方法就足够了。
- `[] == ![]`和 `{} == !{}`
- 垃圾回收机制
	- 标记清除算法
        - 垃圾收集器在运行时会给内存中的所有变量都加上一个标记，假设内存中所有对象都是垃圾，全标记为0
	- 然后从各个根对象开始遍历，把不是垃圾的节点改成1
		- 清理所有标记为0的垃圾，销毁并回收它们所占用的内存空间
		- 最后，把所有内存中对象标记修改为0，等待下一轮垃圾回收
	- 引用计算算法
		- 当声明了一个变量并且将一个引用类型赋值给该变量的时候这个值的引用次数就为 1
		- 如果同一个值又被赋给另一个变量，那么引用数加 1
		- 如果该变量的值被其他的值覆盖了，则引用次数减 1
		- 当这个值的引用次数变为 0 的时候，说明没有变量在使用，这个值没法被访问了，回收空间，垃圾回收器会在运行的时候清理掉引用次数为 0 的值占用的内存
		- 对象的循环引用，可能会造成内存泄漏
-   事件循环
```
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
  new Promise((resolve)=>{
      resolve('promise in setTimeout')
  }).then((res)=>{
      console.log(res)
  })
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
/*
script start
async2 end
Promise
script end
async1 end
promise1
promise2
setTimeout
promise in setTimeout
*/
```

- JS最大安全整数，IEEE75标准，
- on和addEventListen
- 类数组和可迭代数组，如何转化为数组
- 创建对象的方式
- get和post的区别
- isNaN和Number.isNaN
- new的执行流程
- Proxy的使用，对比Object.defineProperty
- 模块化方案对比（cjs、amd、umd、esm）
- 如何判断一个对象属于某个类
- 对原型、原型链的理解
- 对闭包的理解
- call和apply的区别
- 对象创建的方法有哪些
- 对象继承的方法有哪些
- 响应式和双向绑定的区分
