# CSS专题

### 1. CSS选择器有哪些？CSS选择器的权重？
- `!important`(不算选择器) 无限大
- `内联样式` 1000
- id选择器`#` 0100
- 类`.`、伪类`:`、属性`[]` 0010
- 标签、伪元素`::` 0001
- `*`通配选择器、子类`>`、兄弟`+` 0000
- 继承的样式没有权值
### 2. 文本/元素水平垂直居中的实现方案
- `float`
### 3. 讲一下盒子模型
- 包括`content`、`padding`、`border`、`margin`。
- 种类：`border-box`、`content-box`（box-sizing）
### 4. 清除浮动
### 5. margin重叠发生在什么情况下❎
### 6. 实现左右固定宽度，中间自适应
### 7. 什么是BFC？什么是触发BFC？BFS有什么应用
- 块级格式化上下文。可以看做隔离了的独立容器，内部元素不会在布局上影响其他元素，并且具有一些特性。
- 触发BFC
	- html根元素
	- 浮动元素
	- 绝对定位元素
	- display为`inline-block`、`table-cells`、`flex`
	- overflow除visible以外的值
- 应用
	- 同个BFC下 **垂直外边距** 会重叠
	- BFC可以包含浮动元素，可以清除浮动
	- BFC可以阻止元素被浮动元素覆盖（文本不会被浮动元素覆盖）
### 8. flex布局有什么属性
- `flex: flex-grow 增长系数 | flex-shrink 收缩系数 | flex-basis 初始大小`
- `flex-flow: flex-direction 排列方向 flex-wrap 是否换行`
- `align-items`元素在交叉轴上的对齐方式
- `justify-content`元素在主轴上的对齐方式
### 9. CSS的提升性能的方法
### 10. 隐藏元素方法有哪些
- display:none，不占据空间，无法点击
- visibility:hidden，占据空间，无法点击
- transform：scale(0,0),占据空间，无法点击
- opacity:0，占据空间，可以点击
### 11. transition和animation的区别
### 12. 单行、多行文本溢出隐藏❎
- 单行溢出隐藏
	- `overflow: hidden;`
	- `text-overflow: elipsis;`
	- `white-space: nowrap`
- 多行溢出隐藏
	- `display: -webkit-box;`将容器作为弹性伸缩盒模型
	- `-webkit-box-orient: vertical;`弹性伸缩盒模型子节点排列方式
	-  `-webkit-line-clamp: 2;`限制容器最多显示多少行文本，超出则算“溢出”
	- `overflow: hidden;`
### 13. display的block、inline和inline-block的区别
- block：块级元素，有宽高，独占一行
- inline：行内元素，高度，行高以及底边距不可改变
- inline-block：行内块状元素，具备两者特性
### 14. 对`requestAnimationframe`的理解
- 浏览器（所以只能在浏览器中使用）专门为动画提供 API，让 dom 动画、canvas 动画、svg 动画、webGL 动画等有一个统一的刷新机制。
- 你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
- 若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用 `window.requestAnimationFrame()`
- 在隐藏或不可见的元素中， `requestAnimationFrame` 将不会进行重绘或回流，这当然就意味着更少的 CPU、GPU 和内存使用量
- 当页面处理未激活的状态下，该页面的屏幕绘制任务也会被系统暂停，因此跟着系统步伐走的 requestAnimationFrame 也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了 CPU 开销。
### 15. CSS中可继承与不可继承属性有哪些
- 可继承属性
	- `font`相关属性
		- font-family：规定字体系列
		- font-weight
		- font-size
		- font-style：规定字体风格
		- font-variant：设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是其字体尺寸更小。
		- font-stretch：
		- font-size-adjust
	- `text`相关属性
		- text-indent：文本缩进
		- text-align：文本水平对齐
		- line-height：增加或减少单词间的空白
		- word-spacing：增加或减少字符间的空白
		- text-transform：控制文本大小写
		- direction：文本的书写方向
		- color
	- `visibility`
	- 表格布局相关属性
	- 列表布局相关属性
	- 光标属性`cursor`
	- ...
- 不可继承属性
	- `display`
	- 文本相关属性
		- vertical-align：垂直文本对齐
		- text-decoration：规定添加到文本的装饰
		- text-shadow
		- white-space
		- unicode-bidi：设置文本的方向
	- 盒子模型相关属性
	- 背景相关属性
	- 定位相关属性
	- ... 
### 16. 替换元素的概念及计算规则
- 
### 17. 对line-height的理解及赋值方式
### 18. 有哪些css预/后处理器，使用原因是什么？
### 19. CSS常用的单位
### 20. 响应式设计的概念和基本原理
### 21. css div 垂直水平居中，并完成 div 高度永远是宽度的一半（宽度可以不指定）
### 22. CSS实现自适应正方形、等宽高比矩形
### 23. CSS实现三角形❎
### 24. CSS的求值过程
### 25. 如何实现图文环绕的效果