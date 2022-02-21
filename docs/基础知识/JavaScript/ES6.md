# ES6基础

Tags: ES6, JavaScript

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

### 解构赋值

```javascript
let obj = {a:1,b:2}
let {a,b} = obj

let arr = ["a","b","c"]    || let arr = "abc"
let [e,f] = arr

//快速交换a,b
[a,b] = [b,a]
```

- 顺序、名称必须一致

### 展开运算符

```javascript
①
let arr = [1,2,3,4]
let arr2 = ['a','b',...arr,'c','d']
//arr2 = ['a','b',1,2,3,4,'c','d']
②
let [a,b,...c] = arr
//a = 1,b = 2,c = [3,4]
③
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
④
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
let m = Map(arr)
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

- 箭头函数：( ) ⇒ 返回值；( ) ⇒ { 执行语句 }；形参 ⇒ 返回值；（形参，形参） ⇒ 返回值
  
    ```javascript
    let fn = () =>{};
    ```
    
- 箭头函数不定参：剩余参数
  
    ```javascript
    let f = (...arg) => { console.log(arg) }
    let f = (a,b,...arg) => { console.log(a,b,arg) }
    ```
    
- 箭头函数本身没有this，调用箭头函数this时，指向**其声明时**，所在**作用域的this**
- 参数默认值

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

### 数组方法

- find( ),findIndex( )：**返回该值&索引**

```javascript
let arr = [1,2,3,4] // ["a","b","c"]
//arr.indexOf("a")
let val = arr.find((item,index)=>{
	if(item > 3){
		return true;
	}
});
//箭头函数写法
let val = **arr.find(item=>iten>=3);  //返回该值**
let index = **arr.findIndex(item=>iten>=3);  //返回该值的索引**
//找不到返回undefined
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

let newArr = **arr.flatMap**((item)=>{   //flatMap只能扁平化一层
	item = **item.filter**((item,index)=>{
		return index == 0;
	});
	return item;
})
```

- fill( )：数组填充

```javascript
let arr = [1,2,3,4,5]
**arr.fill("a",2,4)**
//[1,2,"a","a",5]
```

- includes( )：查找某值

```javascript
let arr = ["a","b","c","d","e"];
**arr.includes("c",3)**  //参数：要查找的值，从第几位开始检索（可选）
```

- forEach( )：为每个元素执行的函数

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
**str.includes("c",3)  //参数：要查找的值，从第几位开始检索（可选）**
**str.startsWith("He",3) //参数：开始的值，从第几位开始（可选）
str.endsWith("lo",3)  //参数：结束的值，总共多少位（可选）
str.repeat(num)  //参数：重复多少次** 
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

### babel使用：兼容性处理