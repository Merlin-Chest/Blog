## CSS使用

- 外联：使用link标签引用
- 嵌入：嵌入到style标签中
- 内联：嵌入到元素的style属性中

## CSS加载过程

![](https://raw.githubusercontent.com/Merlin218/image-storage/master/picGo/202201151123759.png)

### 选择器

- `*`通配选择器
- 标签选择器
- `#`id选择器
- `.`类选择器
- `[]`属性选择器，可以匹配值，匹配正则符号。

### 伪类`:`

- 状态
	- link、active、visited、hover、focus、...
- 顺序
	- `:nth-of-type()`具有一组兄弟节点的标签, 用 n 来筛选出在一组兄弟节点的位置。
	- `:first-child`表示在一组兄弟元素中的第一个元素。
	- `:last-child`表示在一组兄弟元素中的最后一个元素。
	- `:nth-child(an+b)`表示所有当前元素的兄弟元素，按照位置先后顺序从1开始排序，表达式`(an+b)`匹配到的元素集合
		- `:nth-child(1)`表示父元素中子元素为第一的标签
		- `:nth-child(2n+1)`表示奇数行
		- `:nth-child(odd)`表示奇数行
		- `:nth-child(2n)`表示偶数行
		- `:nth-child(even)`表示偶数行

>网上的一种说法
>
>  `nth-child`  按照个数来算。
> 
> `nth-of-type`  按照类型来计算，如果是class那么碰到不同类型的，单独一类，符合条件的选中。
### 伪元素`::`
- 附加至选择器末的关键词，允许你对被选择元素的特定部分修改样式。
- 常用
	- `::before`
	- `::after`
	- `::first-line`


### 选择器组合

![](https://raw.githubusercontent.com/Merlin218/image-storage/master/picGo/202201151138533.png)

### 选择器组`,`

## 颜色表示

- `#xxxxxx(xx)`：十六进制
- `rgba`：红蓝绿三通道+`alpha`透明度
- `hsla`：色相、饱和度、明亮度+`alpha`透明度

## 字体表示

### 字体样式
`font-family`使用建议：
- 字体列表最后写上通用字体族
- 英文字体放在中文字体之前

![](https://raw.githubusercontent.com/Merlin218/image-storage/master/picGo/202201151152895.png)

使用`web Fonts`：

```css
@font-facw:{
	font-family:"xxx";
	src:url("xxx") format("woff2");
}
```

### 字体大小
- `font-size`
- 关键字：`small`、`medium`、...
- 单位：`px`、`em`、`rem`...

> em：根据父元素
> 
> rem：根据根元素

### 字体样式

- `font-style`：normal / italic / ...
- `font—weight`：normal(400) / bold(700) / 100 / 200 / ...

## 文本


- `text-decoration`:none / underline / line-through / ...
- `white-space`: normal / nowrap 不换行 / pre 保留 / pre-wrap 一行显示不下时换行/ pre-wrap 保留换行

## 其他

aria-xxx

优雅降级/渐进增强