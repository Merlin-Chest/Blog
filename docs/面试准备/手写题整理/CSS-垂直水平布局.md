# CSS垂直居中方案

1. flex布局

```html
<style>
  #container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
<div id="container">
  <div>实现垂直居中布局</div>
</div>
```

2. 绝对定位📌 + transform
```html
<style>
#container {
  position: relative;
  height:100%;
}
#content {
  width:200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
<div id="container">
  <div id="content">实现垂直居中布局
  </div>
</div>
```

3. 绝对定位📌 + margin:auto，该方法适用于**盒子有宽高**的情况

```html
<style>
  #container {
    width:200px;
    height:50px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }
</style>
<div id="container">
    <div>实现垂直居中布局</div>
</div>
```

4. table-cell + 子元素为行内元素
```html
<style>
  #container {
    width:100vw;
    height:100vh;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }
  #content {
    display: inline-block;
  }
</style>
<div id="container">
  <div id="content">
    <div>实现垂直居中布局</div>
  </div>
</div>
```
