# 实现三角形

<iframe height="300" style="width: 100%;" scrolling="no" title="三角形实现" src="https://codepen.io/merlin218/embed/YzYqzXv?default-tab=css%2Cresult&editable=true&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/merlin218/pen/YzYqzXv">
  三角形实现</a> by Merlin218 (<a href="https://codepen.io/merlin218">@merlin218</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

```html
<div id="triangle"></div>
```

1. 等腰三角形

```css
#triangle {
  width: 0;
  height: 0;
  border: 40px solid;
  border-color: black transparent transparent;
  border-top-left-radius: 30px;
}
```

2. 等边三角形

```css
#triangle {
  position: relative;
  background-color: orange;
  top: 25px; /* 位置偏移 */
  left: 25px;
}
#triangle:before,
#triangle:after {
  content: "";
  position: absolute;
  background-color: inherit;
}
#triangle,
#triangle:before,
#triangle:after {
  width: 50px;
  height: 50px;
  border-top-right-radius: 30%; /* 实现圆角 */
}
#triangle {
  transform: rotate(-60deg) skewX(-30deg) scale(1, 0.866);
}
#triangle:before {
  transform: rotate(-135deg) skewX(-45deg) scale(1.414, 0.707)
    translate(0, -50%);
}
#triangle:after {
  transform: rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translate(50%);
}
```