# Canvas

Created: September 2, 2021 11:42 AM
Tags: HTML, JavaScript

### Canvas标签

- 没有 src 和 alt 属性，只有两个属性—— width和height
- \</canvas\> 标签不能省略

### 创建一个canvas

```html
<canvas id="canvas" width="300" height="500">
	您的浏览器版本过低，请更新！
</canvas>
```

```javascript
//在页面渲染后再进行获取，可以写在一个函数中，onLoad时调用
//定位当前canvas标签
const canvas = document.getElementById('canvas');
//获取当前canvas的上下文内容：相当于画笔
const ctx = canvas.getContext('2d');
```

### 绘制图形

- 绘制矩形
    1. **`[fillRect(x, y, width, height)](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillRect)`**绘制一个填充的矩形
    2. **`[strokeRect(x, y, width, height)](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeRect)`**绘制一个矩形的边框
    3. **`[clearRect(x, y, width, height)](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/clearRect)`**清除指定矩形区域，让清除部分完全透明
- 绘制路径
    1. **`beginPath()`**新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
    2. **`closePath()`**闭合路径之后图形绘制命令又重新指向到上下文中。
    3. **`stroke()`**通过线条来绘制图形轮廓。
    4. **`fill()`**通过填充路径的内容区域生成实心的图形。