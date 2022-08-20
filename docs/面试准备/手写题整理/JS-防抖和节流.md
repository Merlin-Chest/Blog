### 防抖（debounce）

该函数会从上一次调用之后，延迟wait毫秒后执行fn方法；定时器存在时，会先清除定时器，重新计时。

**防抖重在清零 `clearTimeout(timer)。`**

#### 使用场景
1.  登录、发短信等按钮避免用户点击太快，以致于发送了多次请求，需要防抖
2.  调整浏览器窗口大小时，resize 次数过于频繁，造成计算过多，此时需要一次到位，就用到了防抖
3.  文本编辑器实时保存，当无任何更改操作一秒后进行保存

```js
/**
 * @description: 该函数会从上一次调用之后，延迟wait毫秒后执行fn方法
 * @param {Function} fn 延迟执行的函数
 * @param {number} interval 延迟时间(ms)
 * @return {*}
 */
function debounce(fn, interval){
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(()=>{
            fn.apply(this, ...args);
        }, interval);
    }
}
```

### 节流（throttle）

高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率。

**节流重在加锁 `timer=timeout`。**

#### 使用场景
1.  `scroll` 事件，每隔一秒计算一次位置信息等
2.  浏览器播放事件，每个一秒计算一次进度信息等
3.  input 框实时搜索并发送请求展示下拉列表，每隔一秒发送一次请求 (也可做防抖)

```js
/**
 * @description: 控制fn方法执行的频率，wait时间内发生一次
 * @param {Function} fn 用户函数
 * @param {number} interval 间隔时间(ms)
 * @return {*}
 */
function throttle(fn, interval){
    let timer = null;
    return function(...args) {
        if(!timer){
            timer = setTimeout(()=>{
                fn.apply(this, ...args);
                timer = null;
            },interval);
        }
    }
}
```
