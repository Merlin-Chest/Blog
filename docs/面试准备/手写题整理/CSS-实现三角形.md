# 实现三角形

1. 等腰三角形

```html
<style>
  #triangle {
    width: 0;
    height: 0;
    border: 40px solid;
    border-color: black transparent transparent;
  }
</style>
<div id="triangle"></div>
```

2. 等边三角形

```html
<style>
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
</style>
<div id="triangle"></div>
```
