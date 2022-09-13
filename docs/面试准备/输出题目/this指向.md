# this 指向
```js
function foo() {
  console.log( this.a );
}

function doFoo() {
  foo();
}

var obj = {
  a: 1,
  doFoo: doFoo
};

var a = 2; 
obj.doFoo();
```

输出结果：2

> 在Javascript中，this指向函数执行时的当前对象。在执行foo的时候，执行环境就是doFoo函数，执行环境为全局。所以，foo中的this是指向window的，所以会打印出2。

```js
'use strict';

function a() {
    console.log(this);
}
a.call(null); // null
a.call(undefined); // undefined
```

在严格模式中，null 就是 null，undefined 就是 undefined。非严格模式下是`window`对象。

```js
var length = 10;
function fn() {
    console.log(this.length);
}
 
var obj = {
  length: 5,
  method: function(fn) {
    fn();
    arguments[0]();
  }
};
 
obj.method(fn, 1);
```

输出结果：10 2
- fn()：this指向window，输出10
- argument\[0\]()：相当于argument调用了方法，this指向arguments，这里传了两个参数，说明argument的length是2。

```js
 var a = 10; 
 var obt = { 
   a: 20, 
   fn: function(){ 
     var a = 30; 
     console.log(this.a)
   } 
 }
 obt.fn();  // 20
 obt.fn.call(); // 10
 (obt.fn)(); // 20
```

(obt.fn)()， 这里给表达式加了括号，而括号的作用是改变表达式的运算顺序，而在这里加与不加括号并无影响；相当于  obt.fn()，所以会打印出 20。

```js
function a(xx){
  this.x = xx;
  return this
};
// 调用的时候，x = 5，返回windows
// 当进行赋值操作是，x又被赋值为windows
var x = a(5);
console.log(x.x)  // window

// 改变了x的值，x = 6
var y = a(6);

console.log(x.x)  // 此时的x为6，所以x.x 为 undefined
console.log(y.x)  // 6
```

```js
function foo(something){
    this.a = something
}

var obj1 = {}

var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); // 2

var baz = new bar(3);
console.log(obj1.a); // 2
console.log(baz.a); // 3
```

主要都是考察this绑定的优先级。记住以下结论即可：

**this绑定的优先级：new绑定 > 显式绑定 > 隐式绑定 > 默认绑定。**

