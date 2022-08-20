# 延时函数实现

## setInterval实现setTImeout

```js
function mySetTimeout(fn, delay){
    let timer = null;
    return (timer = setInterval(()=>{
        fn();
        clearInterval(timer)
    },delay));
}
```

## setTImeout实现setInterval


```js
function mySetInterval(fn, delay){
    let timer = null;
    const interval = function(){
        timer = setTimeout(()=>{
          fn();
          interval();
        }, delay);
    }
    interval();
    return {
        cancel:function(){
            clearTimeout(timer);
        }
    }
}
```