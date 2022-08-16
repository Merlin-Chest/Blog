# ES6基础
[JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

### let 与 const（块级作用域）

- let
    - 不能重复声明
    - 作用域：全局作用域 和 块作用域 {}
    - 不会进行预解析
- const
    - 不能重复赋值、声明
    - 块级作用域
    - 不会进行预解析

> 对比var、let和const
> - `var`声明是全局作用域或函数作用域，而`let`和`const`是块作用域。
> - `var`变量可以在其范围内更新和重新声明； `let`变量可以被更新但不能重新声明； `const`变量既不能更新也不能重新声明。
> - 它们都被提升到其作用域的顶端。但是，`var`变量会被初始化为undefined，`let`和`const`变量不会被初始化（暂时性死区）。
> -在声明期间可以不初始化`var`和`let`，但是必须初始化`const`。

```js
console.log(a, b) // a,b变量提升，不会报错，a，b为undefined
var a = 12, b ='merlin' // a,b赋值
function foo(){ 
    console.log(a, b) // a变量提升，a为undefined，b取全局作用域的值merlin
    var a = b = 13 // a赋值，b重新赋值
    console.log(a, b) // 13 13
} 
foo() 
console.log(a, b) // a为全局作用域12，b在函数中被修改为13

/* 输出：
    undefined undefined
    undefined "merlin"
    13 13
    12 13
*/
```

### 解构赋值

```javascript
let obj = {a:1,b:2}
let {a,b} = obj

let arr = ["a","b","c"] // 或 let arr = "abc"
let [e,f] = arr

//快速交换a,b
[a,b] = [b,a]
```

- 顺序、名称必须一致

### 展开运算符

```javascript
// ①
let arr = [1,2,3,4]
let arr2 = ['a','b',...arr,'c','d']
//arr2 = ['a','b',1,2,3,4,'c','d']
// ②
let [a,b,...c] = arr
//a = 1,b = 2,c = [3,4]
// ③
let obj = {
	a:1,
	b:2
};
let obj2 = {
	...obj,
	c:3,
	d:4
};
let [a,b,...c] = obj2
//a = 1,b = 2,c = {c:3,d:4}
// ④
let obj2 = obj
//传的是地址，改变obj2，obj跟着改变
let obj2 = {...obj}
//创建新的对象，互不影响
```

### Set 对象

```javascript
//构造函数 用来构造某一类型的对象 - 对象的实例化
let arr = [1,2,3,4,5,5,4,3,2,1]
let s = new Set(arr);
//set = {1,2,3,4,5} 数组去重，保留第一个出现的值
arr = [...s];
//重新转化为数组
```

```javascript
//size属性
s.size  ==> 数值的个数 ==> length
s.clear()    //清空所有值
s.delete(val)   //删除某一项，参数：要删除的数值；返回值：true或false 
s.has(val)  //查看是否包含某一项，参数：要查找的数值；返回值：true或false
s.add(val)   //增加某一项，返回set对象本身
//链式使用
s.add(1).add(2).add(3)
```

### Map 对象

```javascript
let arr = [
	["a",1],
	["b",2],
	["c",3],
];
let m = new Map(arr)
//{a:1,b:2,c:3}
```

```javascript
m.clear()    //清空所有值
m.delete(key)   //删除某一项，参数：要删除的key值；返回值：true或false 
m.get(key)   //获取某个val，参数：要获取的key值；返回值：val值
m.has(val)  //是否包含某一项，参数：要查找的key值；返回值：true或false
m.set(key,val)   //增加某一项，返回set对象本身
//链式使用
m.set("a",1).set("b",2)
``` 

### 箭头函数

- 箭头函数：
	- ( ) ⇒ 返回值；( ) ⇒ { 执行语句 }；
	- 形参 ⇒ 返回值；
	- （形参，形参） ⇒ 返回值
- 箭头函数不定参：剩余参数
  
    ```javascript
    let f = (...arg) => { console.log(arg) }
    let f = (a,b,...arg) => { console.log(a,b,arg) }
    ```
    
- 箭头函数本身没有this，调用箭头函数this时，指向**其定义时**，所在**作用域的this**，并继承这个值，所以它在定义为就被确定了。
```js
var id = 'GLOBAL';
var obj = {
  id: 'OBJ',
  a: function(){
    console.log(this.id);
  },
  b: () => {
    console.log(this.id);
  }
};

obj.a();    // 'OBJ'
obj.b();    // 'GLOBAL'
```

上面这个例子，对象`obj`的方法`a`使用普通函数定义的，**普通函数作为对象的方法调用时，`this`指向它所属的对象**。所以，`this.id`就是`obj.id`，所以输出`'OBJ'`。 但是方法`b`是使用箭头函数定义的，箭头函数中的`this`实际是继承的它定义时所处的全局执行环境中的`this`，所以指向`Window`对象，所以输出`'GLOBAL'`。（**这里要注意，定义对象的大括号`{}`是无法形成一个单独的执行环境的，它依旧是处于全局执行环境中！！**）

### Array数组新增方法

```javascript
let lis = document.querySelectorAll("#list li");
let arr = [];
**lis = Array.from(lis);**  //将类数组转化为真正的数组
****lis = [...lis]; //将类数组转化为真正的数组
```

```javascript
**Array.of(1,2,3,4,"A")**  //参数：要放入数组中的数据，返回值：新数组
```

```javascript
**Array.isArray(data)** //检测是否为数组，返回值：true/false
```

- flat( ),flatMap( )：数组扁平化

```javascript
//数组扁平化
let arr = [
	["小明","18"],
	["小红","19"]
]
arr.flat(depth) //depth=1,返回["小明","18","小红","19"]
arr.flat(Infinity) //无限扁平

let newArr = arr.flatMap((item)=>{   //flatMap只能扁平化一层
	item = item.filter((item,index)=>{
		return index == 0;
	});
	return item;
})
```

- includes()：查找某值

```javascript
let arr = ["a","b","c","d","e"];
arr.includes("c",3)  //参数：要查找的值，从第几位开始检索（可选）
```

- forEach()：为每个元素执行的函数

```javascript
let arr = [1,2,3,4,5];
arr.forEach(function(item,index,a){
	console.log(item,index,a,this)
})
//不能中断
//map,filter,eveny,some,find,findIndex 等基于forEach
```


- join(data)：用data将数组连接成字符串

```javascript
arr.join("")  //将数组转化为字符串
```

- map( )：返回的是一个数组

### 字符串方法

```javascript
let str = "Hello"
str.includes("c",3)  //参数：要查找的值，从第几位开始检索（可选）
str.startsWith("He",3) //参数：开始的值，从第几位开始（可选）
str.endsWith("lo",3)  //参数：结束的值，总共多少位（可选）
str.repeat(num)  //参数：重复多少次
```

### 模板字符串

```javascript
let name = 我;
//let name = () =>{}
let age = 18;
p = `今年${name}${age}了`;
```

### 简洁表示法

```javascript
let a = 1
let b = 2
let obj = {
	a,  //a:a
	b  //b:b
}
```

### 属性名表达式

```javascript
let name = "小明";
let obj = {
	c(){
		console.log("a");
	},
	name:111   // name:111
	[name]:111  // "小明":111
}
```

### 对象合并

```javascript
let obj = {
	a:1,
	b:2
}
let obj2 = {
	c:3,
	d:4
}
obj2 = Object.assign(obj2,obj)  //obj合并到obj2中
obj2 = Object.assign({},obj,obj2)  //obj,obj2合并到{}中
```

### is方法

```javascript
Object.is(val1,val2) //判断两个值是不是相同的值
```

- 以下情况下都为True
    - 两个值都是undefined
    - 两个值都是null
    - 两个值都是true / false
    - 两个都是相同个字符按照相同的顺序组成的字符串
    - 两个值指向同一个对象（比较的是地址）
    - 两个值都是数字并且都是正零+0/-0/NaN
