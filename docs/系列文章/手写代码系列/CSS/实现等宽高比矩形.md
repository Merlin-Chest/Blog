# 实现等宽高比矩形

<iframe height="300" style="width: 100%;" scrolling="no" title="等宽高比矩形" src="https://codepen.io/merlin218/embed/rNpeNop?default-tab=css%2Cresult&editable=true&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/merlin218/pen/rNpeNop">
  等宽高比矩形</a> by Merlin218 (<a href="https://codepen.io/merlin218">@merlin218</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

```html
<div class="wrap">
  <div class="box">
  </div>
</div>
```

```css
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

```