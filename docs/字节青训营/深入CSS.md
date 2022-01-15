### 选择器的特异度
![image](https://cdn.jsdelivr.net/gh/Merlin218/image-storage@master/picX/image.6g4r61wq2i9s.webp)
- 样式覆盖
### 继承

某些属性会自动继承其父元素的`计算值`，除非显式指定一个值。

#### 初始值

CSS中每个属性都有一个初始值。
可以使用`initial`重置初始值。

#### CSS计算过程

filtering --`声明值`--> cascading --`层叠值`--> defaulting --`指定值`--> resolving --`计算值`--> formating --`使用值`-->constraining(浏览器进行限制，例如将小数像素值转化为整数)-->`实际值`


### 布局

#### 布局相关技术

- 常规流
	- 行级
	- 块级
	- 表格布局
	- Flex
	- Grid
- 脱离常规流
	- 浮动
	- 绝对定位

#### 盒子模型
- width
- height
- padding
	- 指定四个方向的内边距
	- 百分比相对于容器`宽度`
- border
	- `border:width style color`
	- 当四边颜色不同时，会用斜线分开
		- 实现小三角思路：content为0，设置一边的border
- margin
	- `margin:0 auto`水平居中
	- `margin collapse`：高度折叠，左右不会合并（尝试）
- box-sizing
	- 常规布局，设置为`box-sizing:border-box`
- overflow
	- visible / hidden / scroll
- display
	- block / inline / inline-block / none

> ![image](https://cdn.jsdelivr.net/gh/Merlin218/image-storage@master/picX/image.3ithvnu1uvuo.webp)

#### 行级排版上下文
- 只包含行级盒子的容器
- 排版规则
	- 盒子在一行内水平摆放
	- 行放不下时，换行显示
	- `text-align`决定一行内盒子的水平对齐
	- `vertical-align`决定一个盒子在行内的垂直对齐
	- 避开浮动`float`元素

#### 块级排版上下文
- 某些容器会创建BFC
- 根元素
- 浮动、绝对定位、 inline-block
- Flex子项和Grid子项
- overflow值不是 visible的块盒
- display: flow-root

![image](https://cdn.jsdelivr.net/gh/Merlin218/image-storage@master/picX/image.3h1w00sywqf4.webp)

#### Flex排版上下文

- 一种新的排版上下文
	- 可以控制子级盒子的摆放的流向(→←↑↓)
摆放顺序
■盒子宽度和高度
水平和垂直方向的对齐
是否允许折行
- 主轴与侧轴
- `flex-direction`: row / column / row-reserve / column-reserve
- `justify-content`
- `align-items`
- `align-self`:给特定元素设定
- `order`：默认为0，给元素设定顺序
- `flexibility`
	- `flex-grow`有剩余空间时的伸展能力
	- `flex-shrink`容器空间不足时收缩的能力，默认为1
	- `flex-basis`没有伸展或收缩时的基础长度

![image](https://cdn.jsdelivr.net/gh/Merlin218/image-storage@master/picX/image.35norh0gqqtc.webp)

#### Grid排版上下文

- `display:grid`使元素生成一个块级的Grid容器
- 使用`grid-template`相关属性将容器划分为网格
- 设置每一个子项占哪些行列

##### 划分网络

- `grid-template-columns`
- `grid-template-rows`

##### 分配空间

- `grid-area`: 1/1/3/3
	- `grid-row-start`:1
	- `grid-column-start`: 1
	- `grid-row-end`: 3
	- `grid-column-end`: 3

#### Float

- 适用场景：图文环绕

### position属性
- `static`：默认值，非定位元素
- `relative`：相对自己偏移
- `absolute`
	- 脱离常规流
	- 相对于最近`非static祖先`定位
	- 不会对流内元素布局造成影响
- `fixed`
- `sticky`