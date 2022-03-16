# 如何写好JavaScript
>课件链接：
> [跟着月影学 JavaScript (上)](https://bytedance.feishu.cn/file/boxcn0vymHvT8flR0loNcQfZ4ne)
> [跟着月影学 JavaScript (下)](https://bytedance.feishu.cn/file/boxcnzft1B4IVEyqF9LDIxkz61e)

## 写好JS的一些原则

- 各司其责
- 组件封装
- 过程抽象
	
## 各司其责

- HTML负责结构
- CSS负责样式
- JS负责行为功能

## 一个例子：实现夜间模式

- HTML/CSS/JS各司其责
- 避免JS直接操作样式（方案一）
- 可以用class来表示状态（方案二）
- 追求零JS方案（方案三）

- 方案一：JavaScript直接操控CSS（不推荐）
- 方案二：JavaScript更改ClassName
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
    body.night {
      background-color: black;
      color: white;
    }

    #modeChange::after {
      content: '🌞';
      float: right;
      font-size: 2em;
    }

    body.night #modeChange::after {
      content: '🌜';
    }
  </style>
</head>

<body>
  <div id="modeChange"></div>
  <header>
    <h1>深夜食堂</h1>
  </header>
  <main>...</main>

  <script>
    const modeBtn = document.querySelector('#modeChange');
    const body = document.body;
    modeBtn.addEventListener('click', () => {
      if (body.className !== 'night') {
        body.className = 'night'
      } else {
        body.className = ''
      }
    })
  </script>
</body>

</html>
```
- 方案三：无JavaScript方案，使用一个`checkbox`匹配`label`判断`checked`状态
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
    #modeChange {
      display: none;
    }

    #modeBtn::after {
      content: '🌞';
      float: right;
      font-size: 2em;
    }

    #modeChange:checked+.content {
      background-color: black;
      color: white;
    }

    #modeChange:checked+.content #modeBtn::after {
      content: '🌜';
    }
  </style>
</head>

<body>
  <input id="modeChange" type="checkbox" />
  <div class="content">
    <header>
      <label id="modeBtn" for="modeChange"></label>
      <h1>深夜食堂</h1>
    </header>
    <main>
      ...
    </main>
  </div>
</body>

</html>
```
## 一个例子：实现轮播图

- 好的组件应具备：
	- 封装性
	- 正确性
	- 扩展性
	- 复用性

- API设计
	- 原子操作
	- 职责单一
	- 满足灵活性

- 事件流控制

- 重构
	- 插件化
	- 模板化
		- HTML模板化
	- 抽象化（组件框架）
		- 将通用的组件模型抽象出来
		- ![image](https://cdn.jsdelivr.net/gh/Merlin218/image-storage@master/picX/image.4qwjf5o3v7nk.webp)

## 过程抽象

### 一个例子：操作次数限制
- 一些异步交互
- 一次性的HTTP请求

## 高阶函数

- 以函数作为参数
- 以函数作为返回值
- 常用于作为函数装饰器

### 等价函数HOF0

```js
function HOF0(fn){
	return function(...args){
		return fn.apply(this,args);
	}
}
```

### 常用高阶函数

- Once
- 节流函数`Throttle`
- 防抖函数`Debounce`
- `Consumer`
- `Iterative`

### 为什么要使用纯函数

-  xx

### 编程泛式

- 命令式
- 声明式

## 

- 