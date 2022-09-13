# this

## 为什么要用this

使用this可以让我们灵活地在不同的上下文中重复的使用函数，不需要针对每个对象编写不同版本的函数。

因此，掌握this的指向，对我们来说额外重要。

> 什么是上下文？
> 
> 当一个函数被调用时，会创建一个活动记录，包括函数在哪被调用，调用方式，传入参数等，this则是其中的一个属性，在函数执行的过程中会用到。

## 对this的误解

- this指向函数本身？no！

- this指向函数作用域？no！

this指向是在运行时绑定的，与函数声明的位置没有任何关系，取决于函数的调用方式，在哪里被调用。

## 函数的调用位置

首先我们想理解一下调用位置和调用栈，这里有一段函数。

```javascript
function baz() {
  // 此处的调用栈为 baz
  // 调用位置：全局作用域
  console.log('baz');
  bar();
}

function bar() {
  // 此处的调用栈为 baz -> bar
  // 调用位置：baz
  console.log('bar');
  foo();
}

function foo() {
  // 此处的调用栈为 baz -> bar -> foo
  // 调用位置：bar
  debugger
  console.log('foo')
}

baz()
```

我们在浏览器中执行一下它：

![Untitled.gif](https://raw.githubusercontent.com/Merlin218/image-storage/master/2021/12/12-11-40-56-Untitled.gif)

可以看到当前位置的函数调用列表，这个就是调用栈。而栈中的第二个元素，就是该函数的调用位置。

## this的绑定规则

### 默认绑定

this指向全局对象，当函数内使用严格模式时，this会绑定到undefined。

> 有个细节：决定this绑定对象的并不是调用位置是否处于严格模式，而是该函数的函数体是否是处于严格模式。见下面的代码：

```javascript
function foo(){
    "use strict";
    console.log(this.a);
}

function foo1(){
    console.log(this.a);
}

var a = 2;
foo(); // TypeError:this is undefined


(function(){
    "use strict";
    foo1(); // 2
})();
```

## 隐式绑定

判断调用位置是否有上下文对象，或者是否被某个对象拥有或包含该函数引用，符合条件的话，this会隐式绑定为该对象。

- 函数中的this只会指向它上一层的
  
  ```javascript
  function foo(){
     console.log(this.a);   
  }
  var obj2 = {
      a:3,
      foo:foo
  };
  var obj1 = {
      a:2;
      obj2:obj2
  };
  obj1.obj2.foo() // 3 而不是2，只会指向上一层的上下文
  ```

- 隐式丢失
  
  看下面的例子，fn虽然是obj.foo的一个引用，但实际上引用的是foo函数本身，因此可以fn()是一个不带修饰的函数调用，应用了默认绑定。
  
  > 注意：无论是在Object中直接定义函数，还是想定义函数再添加为引用属性，这个函数严格来说都不属于这个对象。
  
  ```javascript
  function foo(){
     console.log(this.a);   
  }
  var obj = {
      a:3,
      foo:foo
  };
  
  var a = 2;
  var fn = obj.foo;
  fn(); // 2 而不是3，相当于没有上下文
  ```

### 显式绑定

直接指定this的绑定对象

- call 与 apply：使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数
	- 参数
	    - this的绑定对象
	    - 多个参数（call）或参数数组（apply）

> 如果传入一个原始值，会被转化为其对象形式，以下同理。

- bind：硬绑定，创建一个新函数，this指定为目标上下文。
	- 参数
	    - this的绑定对象
	    - 参数列表，绑定为新函数的参数

- API调用的上下文
  
  某些API提供了可选参数，其作用和bind(...)一样，确保你的回调函数使用指定的this。
  
```js
var obj = {
    id:'ok'
}
[1,2,3].forEach(function(el){
    console.log(el,this.id)
},obj);
//1ok 2ok 3ok
```

### new绑定

创建过程：
1. 创建一个全新的对象
2. 执行`prototype`连接
3. 将该对象绑定到函数调用的this
4. 如果函数中没有返回其他对象，自动返回创建的对象。

```javascript
function foo(a){
    this.a = a
}
var bar = new foo(2);
console.log(bar.a); // 2
```

## 绑定规则优先级

1. 函数是否在new中调用 ？this绑定的是新创建的对象 ：继续往下
2. 函数是否通过call、apply或者bind调用 ？this绑定指定对象：继续往下
3. 函数是否在某个上下文对象中调用 ？this绑定该上下文对象 ：继续往下
4. 默认绑定，是否是严格模式 ？undefined ：全局对象。

```js
'use strict';

function a() {
  console.log(this);

  function b() {
    console.log(this);
  }
  b();
}
let obj = {
  aa: 1,
  a: a
}
obj.a(); 
// { aa:1, a:function a(){xxx} }
// undefined
a();
// undefined
// undefined
```

## 绑定的其他情况

-  使用call、apply等时，如果将要绑定的this传入`null`时，在非严格模式下，会应用默认绑定规则绑定到全局对象，将导致不可预计的后果，如修改全局对象。
- 创建一个空的非委托的对象，将this指向它。
  
  > Object.create(null) 不会创建Object.prototype这个委托，比{}更空。

- 间接引用——隐式丢失
- 使用软绑定
  
```js
//来自《你不知道的JavaScript》上册
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function (obj, ...args1) {
    //传入的obj是我们想要设置的默认的this绑定值
    var fn = this;
    var bound = function (...args2) {
      return fn.apply(
        // 如果this指向全局对象，说明默认绑定，则绑定为obj
        (!this || this === (window || global)) ? obj : this,
        //新的参数列表
        [...args1, ...args2]
      );
    };
    bound.prototype = Object.create(fn.prototype);
    return bound;
  };
}
```

## 箭头函数的this

箭头函数的this是根据定义函数时外层（函数或者全局）作用域来决定的。常用于回调函数中。

```javascript
'use strict';
function foo(){
    return () => {
        console.log(this.a) // this为foo的上下文
    }
}
var obj = {
    a:2;
}
var obj2 = {
    a:3;
}
foo()(); // Uncaught TypeError: Cannot read properties of undefined
// 严格模式下全局上下文为undefined
var bar = foo.bind(obj);
bar()(); // 2
```

如果对一个函数进行多次 bind，那么上下文会是什么呢?

```js
let a = {}
let fn = function () { console.log(this) } 
fn.bind().bind(a)() // => ?

// fn.bind().bind(a) 等于 
let fn2 = function fn1() {
  return function() {
    return fn.apply()
  }.apply(a) 
}
fn2();
```

 不管我们给函数 bind 几次，fn 中的 this 永远由第一次 bind 决定，所以结果永远是 window。