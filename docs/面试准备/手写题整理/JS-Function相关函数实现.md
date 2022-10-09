# Function相关函数实现
## new

new完成的事情：
- 创建一个对象，并把函数的prototype继承给对象
- 执行这个函数
- 返回
	- 如果函数中返回函数或者对象，返回结果
	- 否则返回创建的实例

```js
function myNew(fn, ...args){
	if(typeof this !== 'function'){
		throw new TypeError('not a function');
	}
	let obj = Object.create(fn.prototype);
	let result = fn.call(obj,...args);
	// result为函数或者对象
	if(result && (typeof result === 'object' || typeof result === 'function')){
		return result;
	}
	return obj;
}
```

## Class 语法糖——ES6转ES5

题目：

```js
class Person {
     constructor (name) {
          this.name = name;
     }
     greet () {
          console.log(`Hi, my name is ${this.name}`);
     }
     greetDelay (time) {
          setTimeout(() => {
               console.log(`Hi, my name is ${this.name}`);
          }, time);
     }
}
```

答案
```js
// 注意var，不能使用let、const
 var Person = (function () {
     function Person (name) {
          this._name = name;
     }
     Person.prototype.greet = function () {
          console.log(“Hi, my name is “ + this._name);
     }
     Person.prototype.greetDelay = function (time) {
	     // 注意this
          var _this = this;
          setTimeout(function () {
               console.log(“Hi, my name is “ + _this.name);
          }, time);
     }
})();
```

## call、apply、bind

- call(ctx, ...args)
	- 判断this是否function
	- this的兼容
	- 通过obj.fn()的方式设置fn的this为obj
	- 前后添加、删除函数
	- 返回结果
- apply(ctx, args)
	- 同上，区别在于传参的形式
- bind(ctx,...args)
	- 特点：返回一个绑定了this和包含前置参数的函数
	- 难点：新函数的this指向
		- 构造函数：把this指向实例
		- 普通函数：this指向指定的ctx

```js
Function.prototype.myCall = function(ctx, ...args){
	if(typeof this !== 'function'){
		throw new ErrorType('not a function');
	}
	ctx = ctx || window;
	const fn = Symbol();
	ctx[fn] = this;
	let result = ctx[fn](...args);
	delete ctx[fn];
	return result;
}

Function.prototype.myApply = function(ctx, args){
	if(typeof this !== 'function'){
		throw new ErrorType('not a function');
	}
	ctx = ctx || window;
	const fn = Symbol();
	ctx[fn] = this;
	let result = ctx[fn](...args);
	delete ctx[fn];
	return result;
}

Function.prototype.myBind = function(ctx, ...args){
	if(typeof this !== 'function'){
		throw new Error('not a function');
	}
	const self = this;
	const fNod = function(){};
	const bound = function(...innerArgs){
	// 因为fNod.prototype = this.prototype;
	// 所以作为构造函数时，this instanceof fNod 为true，所以还是用this
	// 否则就是普通函数调用，否则使用传进来的ctx
		return self.apply(
			this instanceof fNod ? this : ctx,
			args.concat(Array.prototype.slice(innerArgs))
		)
	}
	fNod.prototype = this.prototype;
	bound.prototype = new fNod();
	return bound;
}

const ctx = {str:'str1'};
function Name(str){
	this.str = str;
	console.log(this.str)
}
const NewName = Name.myBind(ctx,'str2');
console.log((new NewName()).str === 'str2'); // true
// 执行NewName后 ctx被修改了
NewName();
console.log(ctx.str === 'str2'); // true
```

## instanceof

```js
function myInstanceof(left, right){
	while(left !== null){
		if(left.__proto__ === right.prototype){
			return true;
		}
		left = left.__proto__;
	}
	return false;
}

function myInstanceof(left, right){
    let p = Object.getPrototypeOf(left);
    while(p){
        if(p == right.prototype) return true;
        p = Object.getPrototypeOf(p);
    }
   return false; 
}
```

## 函数柯里化

理解柯里化 ：用闭包把参数保存起来，当参数的数量足够执行函数了，就开始执行函数。

```js
const currying = function(fn,length){
	length = length || fn.length;
	return function(...args){
		return args.length >= length
		? fn.apply(this,args)
		: currying(fn.bind(this,...args), length - args.length)
	}
}

// test
function add(a,b,c){
	return a + b + c;
}
const add2 = currying(add);
console.log(add2(1)(2)(3));
console.log(add2(1, 2)(3));
console.log(add2(1, 2, 3));
```

## 函数组合

函数组合是指将多个函数按顺序执行，前一个函数的返回值作为下一个函数的参数，最终返回结果。

这样做的好处是可以将复杂任务分割成多个子任务，然后通过组合函数再组合成复杂任务。

```js
const compose = function(...funcs){
	let len = funcs.length;
	let count = len - 1;
	let result;
	return function fn(...args){
		result = funcs[count](...args);
		if(count <= 0){
			count = len - 1;
			return result;
		}
		count--;
		return fn(result);
	}
}

// reduce 实现
const compose = function(...funcs) {
	if(funcs.length === 0){
		return arg => arg;
	}
	if(funcs.length === 1) {
		return funcs[0];
	}
	return funcs.reduce((pre, cur) => (...args) => cur(pre(...args)))
}

```

### 应用

#### koa2 洋葱模型的实现和原理

使用实例

```js
const Koa = require('koa');
const app = new Koa();
 
app.use(async (ctx, next) => {
    ctx.body = 'Hello World';
    console.log(1);
    next();
    console.log(4);
});
 
app.use(async (ctx, next) => {
    console.log(2);
    next();
    console.log(3);
});
 
app.listen(3000);
// 一次输出1、2、3、4
```

原理

1. koa通过use函数，把中间件都push到一个内部数组队列中

```js

use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    // 判断是不是中间件函数是不是生成器 generators
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      // 如果是 generators 函数，会转换成 async/await
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    // 使用 middleware 数组存放中间件
    this.middleware.push(fn);
    return this;
}
```

2. Koa中间件的执行流程主要通过koa-compose中的compose函数完成

> 洋葱模型原理： 所有的中间件依次执行，每次执行一个中间件，**遇到next()就会将控制权传递到下一个中间件**，下一个中间件的next参数，当执行到最后一个中间件的时候，控制权发生反转，开始回头去执行之前所有中间件中剩下未执行的代码； 当最终所有中间件全部执行完后，会返回一个Promise对象，因为我们的compose函数返回的是一个async的函数，async函数执行完后会返回一个Promise，这样我们就能将所有的中间件异步执行同步化，通过then就可以执行响应函数和错误处理函数

```js
function compose (middleware) {
  // 判断是不是数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  // 判断每一个中间件是不是函数
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
 
  /**
   * @param {Object} context
   * @return {Promise}  
   * @api public
   */
 
  return function (context, next) {
    // last called middleware #
    // 计数器，用于判断中间是否执行到最后一个
    let index = -1
    // 从第一个中间件方法开始执行
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        // 递归调用下一个中间件
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

来自网上的一个代码解释：

```js
Promise.resolve(function(context, 中间件2){
	//中间件一第一部分代码
	await/yield Promise.resolve(function(context, 中间件3){
		//中间件二第一部分代码
		await/yield Promise(function(context){
			//中间件三代码
		}());
		//中间件二第二部分代码
	})
	//中间件一第二部分代码
}());
```