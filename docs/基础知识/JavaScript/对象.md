# 对象

## 对象的定义

对象有两种形式定义

- 声明形式
```javascript
let obj = {
    key:value;
}
```

- 构造形式

```javascript
let obj = new Object();
obj.key = value;
```

## 对象的类型

对象是JavaScript的基础。

> 在JavaScript中共有六种主要类型：
> - string
> - number
> - boolean
> - null
> - undefined
> - object
> 
> 简单基本类型（前五项）本身并不是对象。
> 
> 对于`typeof null` 返回字符串'object'，原理是在JavaScript中二进制前三位都为0的话会判断为是object类型，null的二进制表示是全0，这导致误判。

### 内置对象

- String
- Number
- Boolean
- Object
- Function
- Array
- Date
- RegExp
- Error

> 区分字面量和对象，见下方代码：

```javascript
let str = "hello";
typeof str; // "string"
 
let str = new String();
typeof str; // "object"
 
 
str.length;
"hello".length;
```

> 第一种方式声明的变量实际是一个字面量，并且是一个不可更改的值，如果要在这个字面量执行一些操作，需要将这个字面量转化为String对象，其他对象类型同理。
> 
> 我们可以直接在字面量上访问属性或方法，实际上是JavaScript引擎自动地把字面量转化为了String对象。

## 对象里藏了哪些内容

对象的内容是由一些存储在特定命名位置的值组成的，我们称为`属性`。值可以还是任意类型。在对象中，属性名永远是`字符串`

访问对象对应key的值有两种方法：

- 属性访问（`.`操作符）

- 键访问（`[]`操作符）

> 两者的区别在于.操作符要求属性明满足标识符的命名规范，[]操作符可以接受任意UTF8/Unicode字符串作为属性名。

### 可计算属性名

可以使用[]包裹一个表达式作为属性名。

### “方法”

当属性是一个函数，我们会称之为“方法”，

但在JavaScript中，从技术角度来说，函数永远不会“属于”一个对象。

除了对函数的不同访问可能引发的`隐式绑定this`之外，属性访问返回的函数与其他函数没有什么区别。

### 特殊的对象——数组

数组也支持`[]`访问形式，数组有一套更为结构化的值存储机制（仍然不限制值的类型）。

数组和普通的对象都根据对应的行为和用途进行了优化，所以最好只用对象来存储`键/值对`，只用数组来存储数值下标/值对。

### 对象的复制

- 对于JSON安全的对象来说，有一种巧妙的复制方法：
  
```javascript
let newobj = JSON.parse(JSON.stringfy(someObj));
```

- 在ES6中，定义了`Object.assign(..)`实现对象的浅拷贝
  - 它会遍历一个或多个源对象的所有可枚举自有键并把它们复制（使用=操作符赋值）到目标对象中。
- 深拷贝的实现我们后续文章在探讨...

### 属性描述符

在ES5之后，所以的属性都有了属性描述符。

```javascript
let obj = {
  a:2
}

Object.getOwnPropertyDescriptor(obj, "a");
```

我们可以看到，一个普通的对象属性对应的属性描述符不仅仅包含值，还有另外三个特性：

- writable：决定是否可以更改属性的值
  - 如果不可写，对属性值的修改会静默失败，在严格模式下会报错。
- enumerable：可枚举，是否出现在对象属性遍历中。
- configurable：可配置
  - 可以使用defineProperty()来修改属性描述符
  - 把configurable修改换成false是单向操作，无法撤销！
    - 当此时的writable为true时，可以修改为false，反正不能修改。
  - 会禁用：删除这个属性， `delete  xxx` 静默无效

### 对象不变性

- 对象常量：结合`writable：false`和`configurable:false`创建一个真正的常量属性。
- 禁止扩展：使用`Object.preventExtensions(..)`来禁止一个对象新增属性且保留已有属性。
- 密封：`Object.seal(..)`，不能添加新属性，且不能重新配置或删除任何属性，不过属性的值可以修改。
  - 内部实现：调用`Object.preventExtensions(..)`，并把所有属性都标记为`cofigurable:false`
- 冻结：最高级不可变性，`Object.freeze(..)`，禁止对于对象本身及其任意直接属性的修改，（对象的引用属性是不受影响的）。

### \[\[Get\]\]与\[\[Put\]\]

#### \[\[Get\]\]

我们对属性的访问其实存在一个微小且重要的细节，实际上并不仅仅是在对象中查找名字为xxx的属性，而是会进行一次\[\[Get\]\]操作。

对象默认内置的\[\[Get\]\]操作首先在对象中查找是否有名称相同的属性，找到这返回属性的值，没有则会遍历可能存在的\[\[prototype\]\]链；当无论如何都找不到名称相同的属性，则会返回undefined。

我们看下面的代码：

```javascript
let obj = {
    a:undefined
};
obj.a; // undefined
obj.b; // undefined
```

不出所料，对属性a和b的访问都会返回undefined，但其内部的\[\[Get\]\]操作，实际上对b进行了更复杂的处理。因此，**我们仅仅通过返回值，无法确实某个属性不存在还是持有undefined值。** 在下文我们会讲到解决方案。

#### \[\[Put\]\]

对对象属性的赋值则会触发\[\[Put\]\]操作，具体如下：

- 判断属性是否存在，如果存在
  
  - ？判断是否有访问描述符，如果有且为setter，调用setter
  
  - ？属性的writable是否为false，如果是，失败或者报错（严格模式下）
  
  - ：将该值设置为属性的值

- 不存在，\[\[Put\]\]操作会在\[\[prototype\]\]链上进行更加复杂的操作。我们在原型链的文章中会继续描述。

### Getter和Setter

在ES5中，可以使用getter和setter部分改写默认操作，但只能应用在单个属性上。

当你定义了一个属性的getter或setter时，会被定义为访问描述符，此时JavaScript会忽略它的value和writable属性，更关心get和set以及configurable和enumerable。

getter和setter通常都是成对出现，且具有意义，否则会出现意外。

```javascript
let obj = {
    get a(){
        return 2;
    }
}
obj.a = 3;
obj.a // 2
```

由于我们只定义了a的getter，所以对a的赋值操作没有生效，且不会抛出错误；及时我们加入了合法的setter，由于get操作始终都返回2，所以set也没有意义。

### 属性存在性

我们在上文讲到，仅仅通过返回值，无法确实某个属性的存在性。

我们可以使用`hasOwnProperty()`或 `in操作符` 来进行判断，两者的区别在于，`in操作符`会对[[prototype]]链上的属性也进行检查，而`hasOwnProperty()`只会对对象本身进行检查。

```javascript
let obj ={
    a:2
}
("a" in obj); // true
("b" in obj); // false

obj.hasOwnProperty("a"); //true
obj.hasOwnProperty("b"); //false
```

#### 可枚举性

可枚举表示可以出现在对象属性的遍历中。下面我们来区分几个与对象属性相关的API：

- 包含原型链
  - in操作符
- 仅限于本身  
  - propertyIsEnumerable(...)：检查给定的属性名是否直接存在于对象中且可枚举
  - hasOwnProperty(...)：是否存在某个属性
  - Object.keys(...)：会返回一个数组，包含所有可枚举属性
  - Object.getOwnPropertyNames(...)：返回一个数组，包含全部属性，无论是否可枚举

## 对象遍历

for...in...循环可以用来遍历对象的可枚举属性列表（包含原型链），那么如何遍历属性的值呢？

- 对数值索引的数组来说
  - 可以使用标准的for循环遍历
  - forEach()：遍历数组中每一个值，忽略回调函数中的返回值
  - every()：一直运行直到回调函数返回false，简单理解为：判断是否所有元素都符合条件
  - some()：一直运行直到回调函数返回true，简单理解为：判断是否至少有一个元素符合条件
  - for...of...：首先会先访问对象请求一个迭代器对象，通过调用迭代器对象的next()方法来遍历所有值。
    - next()：默认返回形式: `{value : ... , done : ... }`
- 对于对象来说，可以自定义迭代器对象来实现遍历。例如：
  
```javascript
let obj = {
    a: 2,
    b: 3
}
Object.defineProperty(obj, Symbol.iterator, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: function () {
      let o = this;
      let idx = 0;
      let ks = Object.keys(o);
      return {
        next: function () {
          return {
            value: o[ks[idx++]],
            done:(idx>ks.length)
          }
        }
      }
    }
})
```
