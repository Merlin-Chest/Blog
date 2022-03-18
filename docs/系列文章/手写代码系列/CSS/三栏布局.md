# 三栏布局

<iframe height="300" style="width: 100%;" scrolling="no" title="三栏布局" src="https://codepen.io/merlin218/embed/VwyeObW?default-tab=css%2Cresult&editable=true&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/merlin218/pen/VwyeObW">
  三栏布局</a> by Merlin218 (<a href="https://codepen.io/merlin218">@merlin218</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

1. flex布局  & table布局

```html
<div id="container">
  <div id="pre">1</div>
  <div id="center">2</div>
  <div id="end">3</div>
</div>
```

- flex

```css
#container {
  display: flex;
  justify-content: space-between;
}

#pre,
#end {
  width: 100px;
}

#center {
  flex: 1;
}
```

- table

```css
#container {
  display: table;
}

#pre,
#center,
#end {
  display: table-cell;
}

#pre,
#end {
  width: 100px;
}
```

2. 流体布局 & BFC

缺点：主要内容模块无法最先加载，当页面中内容较多时会影响用户体验。

```html
<div id="container">
  <div id="pre">1</div>
  <div id="end">3</div>
  <div id="center">2</div>
</div>
```

```css
#pre {
  float: left;
  width: 100px;
}
#end {
  float: right;
  width: 120px;
}
/* 流体布局*/
#center {
  margin-left: 100px;
  margin-right: 120px;
}
/* BFC */
#center {
  overflow: hidden;
}
```

3. 双飞翼布局

- 主要内容模块可以优先加载
- html结构复杂一点

```html
<div id="container">
  <div id="main">
    <div id="center">2</div>
  </div>
  <div id="pre">1</div>
  <div id="end">3</div>
</div>
```

```css
#main {
  float: left;
  width: 100%; /* 会把pre撑到下面去 */
}

/* 设置main中子元素的margin，避免与pre和end重叠 */
#center {
  margin-left: 120px;
  margin-right: 120px;
}

#pre {
  float: left;
  width: 100px;
  margin-left: -100%; /* 利用负100%的margin 去覆盖上main */
}

#end {
  float: right;
  width: 100px;
  margin-left: -100px; /* 负值的margin-left和float会使该元素不动，前面的元素右移动并覆盖在它上面 */
}
```

4. 圣杯布局 & 绝对定位布局

```html
<div id="container">
  <div id="center">2</div>
  <div id="pre">1</div>
  <div id="end">3</div>
</div>
```

- 圣杯布局

```css
#container {
  margin-left: 120px; /* 给两边腾出位置 */
  margin-right: 120px;
}

#center {
  width: 100%;
  float: left;
}

#pre {
  float: left;
  margin-left: -100%; /* 类似于双飞翼布局 */
  width: 100px;
  position: relative; /* 相对定位移动到两边 */
  left: -110px;
}

#end {
  width: 100px;
  float: right; 
  margin-left: -100px;  /* 类似于双飞翼布局 */
  position: relative; /* 相对定位移动到两边 */
  right: -110px;
}
```

- 绝对定位布局

```css
#container{
  position:relative;
}

#center{
  margin:0 120px;
}

#pre,#end{
  width:100px;
  position:absolute;
  top:0;
}

#pre{
  left:0;
}

#end{
  right:0;
}
```