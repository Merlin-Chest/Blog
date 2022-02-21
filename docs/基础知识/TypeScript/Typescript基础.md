# 基础

Created: October 11, 2021 3:05 PM

## （一）起步

```bash
//查询ts版本
tsc -v

//编译
tsc ts文件路径

//指定输出路径
tsc --outDir 输出路径 文件路径

//指定编译代码版本
tsc --target 代码版本 文件路径

//监听模式
tsc --watch 文件路径
```

## （二）设置配置文件

```json
//tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist",  // 输出路径
    "target": "ES5",  //代码版本
    "watch": true  //监听模式
  },
  // ** 目录下所有文件和子文件夹
  // * 所有文件，也可以指定文件类型 *.ts
  "include": ["./src/**/*"]
}
```

有了配置文件，可直接使用tsc命令

### 指定加载的配置文件

```json
目录结果
--configs
	tsconfig.json
	ts.json
--src
	main.ts
--dist
	main.js

//指令
// -p(--project)
tsc -p ./configs  (默认寻找tsconfig.json)
tsc -p ./configs/ts.json

//tsconfig.json
// 注意：该文件的路径全相对于该文件
{
  "compilerOptions": {
    "outDir": "../dist",  // 输出路径
    "target": "ES5",  //代码版本
    "watch": true  //监听模式
  },
  // ** 目录下所有文件和子文件夹
  // * 所有文件，也可以指定文件类型 *.ts
  "include": ["../src/**/*"]
}
```

## （三）静态语言

- 优点
    - 编译期间就可发现错误
    - 编码规范有助于团队开发协作，利于大型项目开发、项目重构
    - 代码智能提示/检查
    - 代码即文档
- 核心：类型系统
    - 两个重要的组成部分
        - 类型标注（定义、注解）-typing
        - 类型检测（检查）-type-checking

## （四）类型标注

- 基本语法格式：

```json
数据载体：类型
```

- 标注类型
    - 基础的简单的类型标注
    - 高级的深入的类型标注

### （1）基础的简单的类型标注

- #### 基础类型
  
    - string
    - number
    - boolean
- #### 空与未定义类型

    - null
    - undefined

    > 因为null和undefined这两种类型有且只有一个值，在标注一个变量为null和undefined类型，那么这个变量不能修改了

    - 变量声明了，但是未赋值，那么变量值为undefined，如果没有标记类型的话，默认类型是any
    - 默认情况下null和undefined是所有类型的子类型，所以可以对任何值赋null或者undefined，同时默认情况下会有一些隐藏的问题

    ```typescript
    let a:number; 
    a = null; // ok
    a.toFixed(1); //（实际运行是有问题的） 
    ```

    > 技巧：tsconfig.json 指定strictNullChecks配置为true，可以有效检测null或者undefined，避免常见问题，也可以是我们程序编写更加严谨
    > 

    ```typescript
    // 获取元素的方法返回的类型可能会包含 null
    let ele = document.querySelector('div'); 
    //所以最好是先进行必要的判断，再进行操作 
    if (ele) {ele.style.display = 'none'; }
    ```

- #### 对象类型
  
    - ##### 内置对象类型
      
        - 在 JavaScript 中，有许多的内置对象，比如：Object、Array、Date……，我们可以通过对象的 构造函数 或者 类 来进行标注
        
        ```typescript
        let a: object = {}; 
        // 数组这里标注格式有点不太一样，后面我们在数组标注中进行详细讲解 
        let arr: Array<number> = [1,2,3]; 
        let d1: Date = new Date();
        ```
        
    - ##### 自定义对象类型
      
        - 字面量标注：方便，但不利于维护
        
        ```typescript
        let a: {username: string; age: number} = { username: 'zMouse', age: 35 };
        // ok 
        a.username; 
        a.age; 
        // error 
        a.gender;
        ```
        
        - 接口：复用性高，但接口只能作为类型标注使用，不能作为具体值
        
        ```typescript
        // 这里使用了 interface 关键字，在后面的接口章节中会详细讲解 
        interface Person { username: string; age: number; };
        let a: Person = { username: 'zMouse', age: 35 };
        // ok 
        a.username; 
        a.age; 
        // error 
        a.gender;
        ```
        
        - 类与构造函数：功能强大，定义实体的同时也定义类对应的类型，但复杂
        
        ```typescript
        class Person{
        	constructor(public username:string,public age:number){
        		
        	}
        }
        let user:Person = new Person("merlin",18);
        ```
        
    - ##### 拓展：包装对象
    
        ```typescript
        let a: string; 
        a = '1'; 
        // error String有的，string不一定有（对象有的，基础类型不一定有） 
        a = new String('1'); 
        
        let b: String; 
        b = new String('2'); 
        // ok 和上面正好相反 
        b = '2';
        ```
    
- #### 数组类型
  
    - 数组存储的类型必须一致，所以在标注数组类型的时候，同时要标注数组中存储的数据类型
        - 使用泛型标注
        
        ```typescript
        // <number> 表示数组中存储的数据类型，泛型具体概念后续会讲 
        let arr1: Array<number> = []; 
        
        // ok 
        arr1.push(100); 
        // error 
        arr1.push('merlin');
        ```
        
        - 简单标注
        
        ```typescript
        let arr2: string[] = []; 
        
        // ok 
        arr2.push('merlin'); 
        // error 
        arr2.push(1);
        ```
    
- #### 元组类型
  
    - 元组类似数组，但是存储的元素类型不必相同，但是需要注意：
        - 初始化数据的个数以及对应位置标注类型必须一致
        - 越界数据必须是元组标注中的类型之一（标注越界数据可以不用对应顺序 - 联合类型）
        
        ```typescript
        let data1: [string, number] = ['merlin', 100]; 
        
        // ok 
        data1.push(100); 
        // ok 
        data1.push('100'); 
        
        // error 
        data1.push(true);
        ```
    
- #### 枚举类型
  
    - 枚举的作用组织收集一组关联数据的方式，通过枚举我们可以给一组有关联意义的数据赋予一些友好的名字
    
    ```typescript
    enum HTTP_CODE { 
    	OK = 200, 
    	NOT_FOUND = 404, 
    	METHOD_NOT_ALLOWED 
    };
    // 200 
    HTTP_CODE.OK; 
    // 405 
    HTTP_CODE.METHOD_NOT_ALLOWED; 
    // error 
    HTTP_CODE.OK = 1;
    ```
    
    注意事项：
    
    - key 不能是数字
    
    - value 可以是数字，称为 数字类型枚举，也可以是字符串，称为 字符串类型枚举，但不能是其它值，默认为数字：0
    
        ```typescript
        enum URLS { 
        	USER_REGISETER = '/user/register', 
        	USER_LOGIN = '/user/login', 
        	// 如果前一个枚举值类型为字符串，则后续枚举项必须手动赋值 
        	INDEX = 0 
        }
        ```
    
    - 枚举值可以省略，如果省略，则：
        - 第一个枚举值默认为：0
        - 非第一个枚举值为上一个数字枚举值 + 1
        
    - 枚举值为只读（常量），初始化后不可修改
    
- #### 无值类型

    - 表示没有任何数据的类型，通常用于标注无返回值函数的返回值类型，函数默认标注类型为： void

    ```typescript
    function fn():void { 
    	// 没有 return 或者 return undefined 
    }
    ```

    > 在 **strictNullChecks 为 false** 的情况下， undefined 和 null 都可以赋值给 void；但是当 **strictNullChecks 为 true** 的情况下，只有 undefined 才可以赋值给 void

- #### Never类型
  
    - 当一个函数永远不可能执行 return 的时候，返回的就是 never ，与 void 不同， void 是执行了return ， 只是没有值， never 是不会执行 return ，比如抛出错误，导致函数终止执行
    
    ```typescript
    function fn(): never {
    	 throw new Error('error'); 
    }
    ```
    
- #### 任意类型
  
    - 有的时候，我们并不确定这个值到底是什么类型或者不需要对该值进行类型检测，就可以标注为 any类型
    - 特性
        - 一个变量申明未赋值且未标注类型的情况下，默认为 any 类型
        - 任何类型值都可以赋值给 any 类型
        - any 类型也可以赋值给任意类型
        - any 类型有任意属性和方法
    
    > ⚠️ 注意：标注为 any 类型，也意味着放弃对该值的类型检测，同时放弃 IDE 的智能提示
    >
    
    > ☑️ 小技巧：当在tsconfig.json指定 noImplicitAny 配置为 true ，当函数参数出现隐含的 any 类型时报错
    
- #### 未知类型（v3 added）
  
    - unknow，3.0 版本中新增，属于安全版的 any，但是与 any 不同的是
        - unknow 仅能赋值给 unknow、any
        - unknow 没有任何属性和方法
- #### 函数类型
  
    - 函数也有自己的类型标注格式
    
    ```typescript
    函数名称( 参数1: 类型, 参数2: 类型... ): 返回值类型;
    function add(x: number, y: number): number { return x + y; }
    ```
    

### （2）接口定义

对复杂的对象类型进行标注的一种方式，或者给其它代码定义一种契约（比如：类）

```typescript
interface Point { x: number; y: number; }
let p1: Point = { x: 100, y: 100 };
```

- 可选属性（？）

```typescript
interface Point {
 x: number;
 y: number;
 color?: string;
}
```

- 只读属性（readonly）：该属性除了初始化以外，是不能被再次赋值的

```typescript
interface Point { readonly x: number; readonly y: number; }
```

- 任意（可变 ）属性：通过索引类型来实现
    - 数字类型索引

    ```typescript
    interface Point {
       x: number;
       y: number;
       [prop: number]: number; 
    }
    ```

    - 字符串索引类型

    ```typescript
    interface Point {
       x: number;
       y: number;
       [prop: string]: number;
    }
    ```

    > ⚠️ 数字索引是字符串索引的子类型
    >
    > ```typescript
    > interface Point {
    >    x: number;
    >    y: number;
    >    [prop: string]: number; 
    > }
    > 
    > let point:Point = {
    >   x:100,
    >   y:200
    > }
    > 
    > point[0] = 300 //ok  等价于point['0'] = 300
    > ```

    > ⚠️  索引签名参数类型必须为 string 或 number 之一，但两者可同时出现
    >
    > ```typescript
    > interface Point {
    >    [prop1: string]: string;
    >    [prop2: number]: string;  
    > }
    > ```

    > ⚠️ 当同时存在数字类型缩影和字符串类型索引的时候，数字类型的值类型必须是字符串类型的值类型（或者其子类型）
    >
    > ```typescript
    > interface Point1 {
    >  [prop1: string]: string;
    >  [prop2: number]: number; // 错误 
    > }
    > interface Point2 {
    >  [prop1: string]: Object;
    >  [prop2: number]: Date; // 正确 
    > }
    > ```

- 使用接口描述函数

    ```typescript
    interface IFunc {
     (a: string): string; 
    }
    let fn: IFunc = function(a:string) {}
    ```

    > 对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配，只要求对应位置上的参数类型是兼容的。
    >
    > ```typescript
    > interface IFunc {
    >  (a: string): string; 
    > }
    > let fn: IFunc = function(b:string) {}  //ok
    > ```
- 将接口合并：多个同名的接口合并成一个接口
  
    ```typescript
    interface Box {
     height: number;
     width: number; 
    }
    interface Box {
     scale: number; 
    }
    let box: Box = {height: 5, width: 6, scale: 10}
    ```
    
    - 如果合并的接口存在同名的非函数类型，则必须保证他们类型一致，否则编译报错
    - 接口中的同名函数则是采用重载（具体后期函数详解中讲解）

### （3）高级类型

- 联合类型：联合类型也可以称为多选类型，当我们希望标注一个变量为多个类型之一时可以选择联合类型标注，或的关系

```typescript
function css(ele: Element, attr: string, value: string|number) {
 // ... 
}
let box = document.querySelector('.box'); 
// document.querySelector 方法返回值就是一个联合类型 
if (box) { 
// ts 会提示有 null 的可能性，加上判断更严谨 
	css(box, 'width', '100px'); 
	css(box, 'opacity', 1);
  css(box, 'opacity', [1,2]); // 错误 
}
```

- 交叉类型：也称为合并类型，可以把多种类型合并到一起成为一种新的类型，并且 的关系

```typescript
interface o1 {
	x: number,
  y: string
}; 
interface o2 {
	z: number
}; 
let o: o1 & o2 = Object.assign({}, {x:1,y:'2'}, {z: 100});
```

> TypeScript 在编译过程中只会转换语法（比如扩展运算符，箭头函数等语法进行转换，对于API 是不会进行转换的（也没必要转换，而是引入一些扩展库进行处理的），如果我们的代码中使用了 target 中没有的 API ，则需要手动进行引入，默认情况下 TypeScript 会根据target 载入核心的类型库
>
> target 为 es5 时: ["dom", "es5", "scripthost"]
>
> target 为 es6 时: ["dom", "es6", "dom.iterable", "scripthost"]
>
> 如果代码中使用了这些默认载入库以外的代码，则可以通过 lib 选项来进行设置
>
> http://www.typescriptlang.org/docs/handbook/compiler-options.html
>

- 字面量类型：有的时候，我们希望标注的不是某个类型，而是一个固定值，就可以使用字面量类型，配合联合类型会更有用

```typescript
function setPosition(ele: Element, direction: 'left' | 'top' | 'right' | 'bottom') {
 // ... 
}
// ok 
box && setDirection(box, 'bottom'); 
// error 
box && setDirection(box, 'hehe');
```

- 类型别名：有的时候类型标注比较复杂，这个时候我们可以类型标注起一个相对简单的名字

```typescript
type dir = 'left' | 'top' | 'right' | 'bottom'; 
function setPosition(ele: Element, direction: dir) {
 // ... 
}
```

- 使用类型别名定义函数类型：使用类型别名定义函数类型，和接口有点不太相同

```typescript
type callback = (a: string) => string; 
let fn: callback = function(a) {}; 

// 或者直接 
let fn: (a: string) => string = function(a) {}
```

> interface 与 type 的区别
>
> - **interface**
>   - 只能描述 object / class / function 的类型
>   - 同名 interface 自动合并，利于扩展
>
> - **type**
>   - 不能重名
>   - 能描述所有数据

- 类型推导
  
    TypeScript 编译器会根据当前上下文自动的推导出对应的类型标注，这个过程发生在：
    
    - 初始化变量
    - 设置函数默认参数值
    - 返回函数值
    
    ```typescript
    // 自动推断 x 为 number 
    let x = 1;
    // 不能将类型“"a"”分配给类型“number” 
    x = 'a'; 
    // 函数参数类型、函数返回值会根据对应的默认值和返回值进行自动推断 
    function fn(a = 1) {return a * a}
    ```
    
- 类型断言
  
    有的时候，我们可能标注一个更加精确的类型（缩小类型标注范围）
    
    ```typescript
    let img = document.querySelector('#img');
    
    //类型断言
    let img = <HTMLImageElement>document.querySelector('#img');
    let img = document.querySelector('#img') as HTMLImageElement;
    ```
    
    > 注意：断言只是一种预判，并不会数据本身产生实际的作用
    即：类似转换，但并非真的转换了
    > 

## 函数

- 函数的标注对象
    - 参数
    - 返回值
    
    ```typescript
    function fn(a:string):string {}
    let fn:(a:string) => string = function(a){}
    
    type callback = (a:string) => string
    interface ICallBack{
      (a:string):string
    }
    
    let fn:callback = function(a){}
    let fn:ICallBack = function(a){}
    ```
    
- 可选参数（?）

```typescript
let div = document.querySelector('div');
function css(el:HTMLElement,attr:string,value?:string){
   //...
}
//设置
div && css(div,'width','100px');
//获取
div && css(div,'width');
```

- 默认参数
    - 有默认值的参数也是可选的
    - 设置了默认值的参数可以根据值自动推导类型
    
    ```typescript
    function sort(items:Array<any>,order = 'desc'){}
    
    sort([1,2,3]);
    
    //可以通过联合类型来限制取值
    function sort(items:Array<any>,order:'desc'|'asc' = 'desc'){}
    ```
    
- 剩余参数
  
    剩余参数是一个数组，标注时一定要注意
    

```typescript
interface IObj{
    [key:any]:any;
}
function merge(target:IObj,...others:Array<IObj>){
    return Object.assign(target,...others);
}

let newObj = merge({x:1},{y:2},{z:3});
```

### 函数中的this

- 普通函数：不标注时为any

```typescript
interface T{
    a:number;
    fn:(x:number) => void
}

let obj1:T = {
    a:1,
    fn(x:number){
        //any类型
        console.log(this)
    }
}

let obj2:T = {
    a:1,
    fn(this:T,x:number){
        //通过第一个参数位标注this的类型
        console.log(this)
    }
}
```

- 箭头函数：this是固定的，取决于标注

```typescript
interface T{
    a:number;
    fn:(x:number)=>void
}
let obj2:T = {
    a:2,
    fn:(this:T){
        return ()=>{
            //T，取决于标注
            console.log(this)
        }
    }
}
```

### 函数重载

```typescript
function showOrHide(ele:HTMLElement,attr:string,value:'block'|'none'|number){
  //
}
let div = document.querySelector('div');

if(div){
    showOrHide(div,'display','none');
    showOrHide(div,'opacity',1);
    //error 这里是有问题的，虽然通过联合类型可以实现同时处理接受不同类型的参数，但多个参数之间是一种组合的模式，我们需要的应该是一种对应关系
    showOrHide(div,'display',1);
}
```

如下：

```typescript
function showOrHide(ele:HTMLElement,attr:'display',value:'block'|'none');
function showOrHide(ele:HTMLElement,attr:'opacity',value:number);
function showOrHide(ele:HTMLElement,attr:any,value:any){
    ele.style[attr] = value;
}
let div = document.querySelector('div');

if(div){
    showOrHide(div,'display','none');
    showOrHide(div,'opacity',1);
    //通过函数重载可以设置不同的参数对应关系
    showOrHide(div,'display','block');
}
```

- 重载函数类型只需要定义结构，不需要实体，类似接口

```typescript
interface PlainObject{
    [key:string]:string|number;
}
function css(ele:HTMLElement,attr:PlainObject);
function css(ele:HTMLElement,attr:string,value:string|number);
function css(ele:HTMLElement,attr:any,value?:any){
    if(typeof attr === 'string' && value){
        ele.style[attr] = value
    }
    if(typeof attr === 'object'){
        for(let key in attr){
            ele.style[key] = attr[key]
        }
    }
}
let div = document.querySelector('div');
if(div){
    css(div,'width','100px');
    css(dic,{
        width:'100px'
    });
    //error,如果不使用重载，这里就会有问题
    css(div,'width');
}
```

## 面向对象编程

### 类

- 类的基础
    - class关键字
        - 大驼峰命名：每个单词首字母大写
        - 类的特征定义在内部
    - 构造函数：constructor
        - 通过class定义一个类后，可以通过new关键字来调用该类得到实例化对像
        - 默认情况下，构造函数是一个空函数
        - 构造函数会在类被实例化时被调用
        - 自定义的构造函数会覆盖默认构造函数
        - 如果实例化一个类时无需传入对象，可参略（）
        - 构造函数不允许有return和返回值类型标注（因为要返回实例化对象）
    - 成员属性定义 & 成员方法
    
    ```typescript
    class User{
      username:string;
      age:number;
      constructor( 
        username:string,
        age:number
      ){
        this.username = username
        this.age = age
      }
      postArticle(title:string,content:string){
        console.log(`发表了一篇文章:${title}`)
      }
    }
    
    let user = new User('merlin',18)
    
    user.postArticle('hhh','hhh')
    ```
    
    - this关键字 & 构造函数参数
        - ts 提供了一个简化操作：给构造函数参数添加修饰符来直接生成成员属性
            - public 就是类的默认修饰符，表示该成员可以在任何地方进行读写操作
            
            ```typescript
            class User {
             constructor( public id: number, public username: string ) {
               // 可以省略初始化赋值
             }
             postArticle(title: string, content: string): void {
               console.log(`${this.username} 发表了一篇文章： ${title}`) 
             } 
            }
            
            let user1 = new User(1, 'zMouse'); 
            let user2 = new User(2, 'MT');
            ```
        
    - 继承
        - super关键字
        
        ```typescript
        class VIP extends User{
          constructor(username:string,id:number,public score: number){
        		super(username,id);
        	}
        }
        ```
        
        - 在子类中，我们可以通过 super 来引用父类
            - 如果子类没有重写构造函数，则会在默认的 constructor 中调用 super()
            - 如果子类有自己的构造函数，则需要在子类构造函数中显示的调用父类构造函数 : super(//参数) ，否则会报错
            - 在子类构造函数中只有在 super(//参数) 之后才能访问 this
            - 在子类中，可以通过 super 来访问父类的成员属性和方法
            - 通过 super 访问父类的的同时，会自动绑定上下文对象为当前子类 this
        - 方法的重写 & 重载