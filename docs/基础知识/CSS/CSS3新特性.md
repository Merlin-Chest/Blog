# CSS3新特性

## 过渡

transition: CSS属性，花费时间，效果曲线（默认ease），延迟时间（默认0）

## 动画

animation: 动画名称，一个周期花费的时间，运动曲线（默认ease），动画延迟（默认0），播放次数（默认1），是否反向播放（默认normal），是否暂停动画（默认running）

```css
/* 执行一次logo2-line动画，运动时间2s，运动曲线为linear */
animation: logo2-line 2s linear;

/*无限执行logo2-line动画，每次运动时间2秒，运动曲线为 linear，并且执行反向动画*/
animation: logo2-line 2s linear alternate infinite;
```

还有一个重要属性

```css
animation-fill-mode : none | forwards | backwards | both;
/*none：不改变默认行为。    
forwards ：当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）。    
backwards：在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）。 
both：向前和向后填充模式都被应用。  */
```

## 形状转换

transform：适用于2D或3D转换的元素
transform-origin：转换元素的位置（围绕哪个点进行转换，默认(50%,50%,0)）

```css
/* 旋转30度 */
transform:rotate(30deg);
/* 水平旋转30度 */
transform:rotateX(180deg);
/* 竖直旋转30度 */
transform:rotateY(180deg);
/* 三个方向各90度 */
transform:rotate3d(1,1,1,90deg);
/* 水平竖直平移30px */
transform:translate(30px,30px);
/* 缩放到0.8 */
transform:scale(.8)
/* 倾斜10度 */
transform: skew(10deg,10deg);
```

## 选择器

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207311536837.png)

## 阴影

box-shadow：水平阴影的位置 垂直阴影的位置 模糊距离 阴影的大小 阴影的颜色 阴影开始的方向（默认从里往外，设置inset就是从外往里）;

## 边框

### 边框图片

border-image: 图片url 图像边界向内偏移量 图像边界的宽度（默认为边框的宽度） 用于指定在边框外部绘制偏移的量（默认0） 铺满方式（默认：拉伸stretch，还有重复repeat、铺满round）

### 边框圆角

border-radius: n1,n2,n3,n4;

n1-n4四个值的顺序是：左上角，右上角，右下角，左下角

## 背景

### 设定背景区域

background-clip：默认border-box，可以改成padding-box、content-box

### 设置背景起点

background-Origin：border-box，、padding-box或content-box

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207311612855.png)

### 设置背景大小

background-size: `contain`、`cover`、`auto`、`100% 100%`...

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207311616132.png)


### 设置多背景

`,`分隔即可。

例如：background:url('test.jpg') no-repeat left, url(logo.png) no-repeat right;

## 倒影（反射）



