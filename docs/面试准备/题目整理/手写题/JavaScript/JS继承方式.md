# JS继承方式

## 原型继承

Son.prototype = new Father();

- 存在问题
	- 包含引用类型值的原型会被所有实例共享
	- 创建子类类型时，无法向超类类型的构造函数中传递参数

```js
// 原型继承
function Father(){
    this.name = ["hhh","bbb"];
}
function Child(){}
Child.prototype = new Father();
let obj1 = new Child();
obj1.name.push('ccc');
let obj2 = new Child();
console.log(obj2.name); // ['hhh','bbb','ccc']
```

## 借助构造函数继承

- 又称**经典继承**。
- 在子类构造函数中调用父类的构造函数，借用call和apply
- 存在问题
	- 只能继承父类构造函数的属性
	- 方法都只能在构造函数中定义，没办法实现方法的复用

```js
function Father(){
    this.name = 'father';
}
function Child(...args){
    Father.call(this, ...args);
}
```

## 组合式继承

- 结合以上两种继承方式的优点
- 使用原型链实现对原型方法的继承
- 使用构造函数实现对实例属性的继承
- JavaScript中最常用的继承方式
- 缺点是无论什么情况下都会调用两次超类的构造函数（耗内存），组合寄生式继承解决此问题。

```js
// 组合继承
function Father(){
    this.name = 'father';
}
function Child(...args){
    Father.call(this, ...args);
}
Child.prototype = new Father();
Child.prototype.constructor = Child;
Child.prototype.show = function(){
    console.log('1');
}
```

## 原型式继承

- 通过已有的对象创建新对象
- 缺点：所有实例都会继承原型上的属性，无法实现复用
- ES5中`Object.create()`规范了原型式继承
	- 不考虑第二个参数，Object.create() 与 create() 方法的行为相同
	- 第二个参数，与 Object.defineProterties() 方法的第二个参数格式相同，会覆盖原型对象上的同名属性

```js
function create(obj){
    let fn = function(){};
    fn.prototype = obj;
    return new fn();
}
```

## 寄生式继承

- 在原型式继承的基础上包装一层壳
- 无法复用

```js
// 寄生式继承
function parasitism(obj){
    let ins = Object.create(obj);
    ins.show = function(){
        return '1';
    }
    return ins;
}
```

## 组合寄生式继承

- 区别于组合继承，就是把第二次调用构造函数改成使用Object.create()函数来实现

```js
// 组合寄生式继承
function Father(){
    this.name = 'father';
}
function Child(...args){
    Father.call(this, ...args);
}
Child.prototype = Object.create(Father.prototype);
Child.prototype.constructor = Child;

// 等效于
// const F = function(){}
// F.prototype = Father.prototype;
// Child.prototype = new F();

// 不能直接Child.prototype = Father.prototype
// 这样子如果增加 Child.prototype.testProp = 1; 同时会影响 Parent.prototype 。
```

## 原型链演示图

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202203232325870.png)
