# Function相关函数实现
## new

new完成的事情：
- 创建一个对象，并把函数的prototype继承给对象
- 执行这个函数
- 返回对象

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

## call、apply、bind

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
		throw new ErrorType('not a function');
	}
	const fn = Symbol();
	ctx[fn] = this;
	const that = this;
	const bound = function(...innerArgs){
		return ctx[fn].apply(
			this instanceof that ? this : ctx,
			args.concat(Array.prototype.slice(innerArgs))
		)
	}
	bound.prootype = Object.create(this.prototype);
	return bound;
}
```

## instanceof

```js
function myInstanceof(left, right){
	while(true){
		if(left === null){
			return false;
		}
		if(left.__proto__ === right.prototype){
			return true;
		}
		left = left.__proto__;
	}
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