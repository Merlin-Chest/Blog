# 实现等宽高比矩形

```html
<style>
  /* .wrap:包裹矩形的div，用来控制矩形的大小 */
  .wrap {
    width: 20%;
  }
  /* .box 矩形div，宽度是.wrap的百分百，这主要是为了方便高度的计算 */
  .box {
    width: 100%;
    height: 0px; /* 防止矩形被里面的内容撑出多余的高度 */
    padding-bottom: 56.25%; /* 16:9 56.25%，4:3 75% 1:1 100% */
    background: pink;
  }
</style>
<div class="wrap">
  <div class="box">
  </div>
</div>
```

