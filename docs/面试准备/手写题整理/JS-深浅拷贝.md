# 深浅拷贝

前阵子做一个图表可视化的项目，对每个类型的图表都配置了默认配置项（对象），一开始没考虑深拷贝问题，结果出篓子了...修改后面的图表，前面的被改了...那么今天就整理下深浅拷贝相关的问题。

### 浅拷贝

拷贝基本类型，对于对象类型，拷贝的是地址
- `Object.assign`
- `...`展开运算符

```js
const _shallowClone = target => {
    if(typeof target === 'object' && target !== null){
        const constructor = target.constructor;
        //复杂数据类型
        if(/^(Function|RegExp|Date|Map|Set)$/.test(constructor.name)) return target;
        // 处理数组和对象
        const clone = Array.isArray(target) ? [] : {};
        for(let prop in target){
            if(target.hasOwnProperty(prop)){
                clone[prop] = target[prop];
            }
        }
        return clone;
    }else{
        return target;
    }
}
```

### 深拷贝

解决对象引用问题

- JSON.parse(JSON.stringify(obj))局限性（[参考](https://github.com/Yuanfang-fe/Blog-X/issues/14)）
	- 对于function、undefined、symbol
		- 在非数组对象中会被忽略（包括属性名）
		- 在数组中会被转化为null（保证单元位置不变）
	- 时间对象会变为字符串
	- RegExp、Error对象变为空对象
	- NaN、Infinity、-Infinity变为null
	- 只能序列化可枚举的自有属性
	- 存在对象循环引用会报错
	- 抛弃对象的constructor，变为Object

##### 循环引用问题
```js
let obj = {
	a: 1,
	b: {
		c: 2,
		d: 3, 
	}
}
obj.c = obj.b
obj.e = obj.a
obj.b.c = obj.c
obj.b.d = obj.b
obj.b.e = obj.b.c
let newObj = JSON.parse(JSON.stringify(obj)) 

console.log(newObj)
// Uncaught TypeError: Converting circular structure to JSON
```

#####  序列化问题

在遇到`函数、undefined 或者 symbol`的时候，该对象也不能正常的序列化

>JSON语法
>  - 支持数字、字符串、布尔值、null四种，不支持undefined
> - NaN、Infinity和-Infinity序列化的结果是null
> - 不支持函数
> - 除了RegExp、Error对象，JSON语法支持其他所有对象
> - 日期对象序列化的结果是字符串，并不会将其还原为日期对象
> - 只能序列化对象的可枚举的自有属性

```js
let a = {
	age: undefined,
	sex: Symbol('male'), 
	jobs: function() {}, name: 'merlin'
}
let b = JSON.parse(JSON.stringify(a))

console.log(b) // {name: "merlin"}
```

#### MessageChannel

使用场景：拷⻉的对象含有内置类型并且不包含函数，可以处理 undefined 和循环引用对象 

```js
function structuralClone(obj) {
	return new Promise(resolve => {
		const { port1, port2 } = new MessageChannel();
		port2.onmessage = ev => resolve(ev.data);
		port1.postMessage(obj)
	}) 
}
var obj = {
	a: 1,
	b: { 
		c: 2
	}
}
obj.b.d = obj.b

// 注意该方法是异步的
const test = async () => {
	const clone = await structuralClone(obj)
	console.log(clone)
}
test()
```

#### 手写深拷贝函数

#### 简单实现版
```ts
/**
 * @description: 判断一个值是否是基本类型及函数
 * @param {string} value 任何值
 * @return {*}
 */

function isPrimitive(value: any) {
 // return /^(string|number|undefined|boolean|symbol)$/.test(typeof target) || target === null;
  return /Number|Boolean|String|Null|Undefined|Symbol|Function/.test(
    Object.prototype.toString.call(value)
  );
}

/**
 * @description: 深拷贝简易版，包含基础类型，函数，对象，数组
 * @param {any} source 原数据
 * @return {*}
 */
function deepCopy(source: any) {
  // 基本类型及函数
  if (isPrimitive(source)) {
    return source;
  }
  // 判断是数组还是对象
  let result = Array.isArray(source) ? [] : {};
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object') {
        result[key] = deepCopy(source[key]);   //递归复制
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}
```

#### 较详细版
- 处理复杂对象，如 `Date`、`Regexp` 等
- 处理循环引用

```js
const isPrimitive = target => {
    return typeof target !== 'object' || target === null;
}
const isCommonComplex = target => /^(Date|RexExp|Set|Map|Function)$/.test(target.constructor.name);
const _completeDeepClone = (target, map = new Map()) => {
    if(isPrimitive(target)) return target;
    else if(isCommonComplex(target)){
        const constructor = target.constructor
        return new constructor(target);
    }else{
        if(map.has(target)){
            return map.get(target);
        }
        let res = Array.isArray(target) ? [] : {};
        map.set(target,res);
        Reflect.ownKeys(target).forEach((key)=>{
            const value = target[key];
            res[key] = _completeDeepClone(value, map);
        })
        return res;
    }
}
```

```ts
/**
 * @description: 判断一个值是否是基本类型及函数
 * @param {string} value 任何值
 * @return {*}
 */

function isPrimitive(target: any) {
  // return /Number|Boolean|String|Null|Undefined|Symbol|Function/.test(
 //   Object.prototype.toString.call(value)
  //);
  return typeof target !== 'object' || target === null;
}

/**
 * @description: 深拷贝函数，包括基础类型，函数，Map，Set，Date，Regex，引用类型等。
 * @param {any} source 原数据
 * @param {WeakMap} memory 记录临时值
 * @return {*}
 */
function deepClone(source:any, memory: WeakMap<object, any> = new WeakMap()) {
  let result;
  // 原始数据类型及函数
  if (isPrimitive(source)) {
    result = source;
  }
  // 数组
  else if (Array.isArray(source)) {
    result = source.map((value) => deepClone(value, memory));
  }
  // 内置对象Date、Regex
  else if (Object.prototype.toString.call(source) === "[object Date]") {
    result = new Date(source);
  } else if (Object.prototype.toString.call(source) === "[object Regex]") {
    result = new RegExp(source);
  }
  // 内置对象Set、Map
  else if (Object.prototype.toString.call(source) === "[object Set]") {
    result = new Set();
    for (const value of source) {
      result.add(deepClone(value, memory));
    }
  } else if (Object.prototype.toString.call(source) === "[object Map]") {
    result = new Map();
    for (const [key, value] of source.entries()) {
      result.set(key, deepClone(value, memory));
    }
  }
  // 引用类型
  else {
    if (memory.has(source)) {
      result = memory.get(source);
    } else {
      result = Object.create(null);
      memory.set(source, result);
		// Reflect.ownKeys()返回所有属性
		// Object.keys()只能返回可枚举属性
      Reflect.ownKeys(source).forEach((key) => {
        const value = source[key];
        result[key] = deepClone(value, memory);
      });
    }
  }
  return result;
}
```

> 参考链接
> - 前端小册——前端面试之道
> - [死磕JS：Reflect.ownKeys() 和 Object.keys() 怎么选?](https://developer.51cto.com/article/648087.html)
> - [JavaScript之对象序列化详解](https://www.cnblogs.com/craftsman-gao/p/5130567.html)