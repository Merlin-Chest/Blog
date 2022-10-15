## 实现一个简单的Promise

实现需求
- 要能`new`，所以Promise是一个类
- `new Promise(fn)`，参数是一个函数
- 传进去的函数会接收两个函数`resolve`和`reject`，用来表示成功和失败，则构造函数里 需要有`resolve`和`reject`，用来改变Promise的状态
- 根据规范，promise有`pending`，`fulfilled`，`rejected`三个状态，初始状态为`pending`，调用`resolve`会将其改为`fulfilled`，调用`reject`会改为`rejected`。
- `Promise.then()`支持链式调用

## 实现代码及注解

Promise方法
```js
// all
Promise.myAll = function(arr){
    return new Promise((resolve,reject)=>{
        const resArr = [];
        let length = 0;
        arr.forEach((item, index)=>{
            item.then((res)=>{
                resArr[index] = ({
                    status:'fullfilled',
                    value: res
                });
                if(++length === arr.length) resolve(resArr);
            }).catch((err)=>{
                reject(err);
            })
        })
    })
}

// race
Promise.myRace = function(arr){
    return new Promise((resolve,reject)=>{
        arr.forEach((item)=>{
            item.then((res)=>{
                resolve(res);
            }).catch((err)=>{
                reject(err);
            })
        })
    })
}

// allSettled
Promise.allSettled = function(arr){
    return new Promise((resolve,reject)=>{
        const resArr = [];
        arr.forEach((item,index)=>{
            item.then((res)=>{
                resArr[index] = {
                    status:'fullfilled',
                    value: res
                };
            }).catch((err)=>{
                resArr[index] = {
                    status:'rejected',
                    reason: err
                };
            }).finally(()=>{
                if(resArr.length === arr.length) resolve(resArr);
            })
        })
    })
}
```

## 总结

至此，我们的Promise就简单实现了，只是我们不是原生代码，不能做成微任务，如果一定要做成微任务的话，只能用其他微任务API模拟，比如`MutaionObserver`或者`process.nextTick`。下面再回顾下几个要点:

1.  Promise其实是一个发布订阅模式
2.  `then`方法对于还在`pending`的任务，其实是将回调函数`onFilfilled`和`onRejected`塞入了两个数组
3.  Promise构造函数里面的`resolve`方法会将数组`onFilfilledCallbacks`里面的方法全部拿出来执行，这里面是之前then方法塞进去的成功回调
4.  同理，Promise构造函数里面的`reject`方法会将数组`onRejectedCallbacks`里面的方法全部拿出来执行，这里面是之前then方法塞进去的失败回调
5.  `then`方法会返回一个新的Promise以便执行链式调用
6.  `catch`和`finally`这些实例方法都必须返回一个新的Promise实例以便实现链式调用。

> 文章参考
> - [手写Promise/A+](http://www.dennisgo.cn/Articles/JavaScript/Promise.html)

## Promise相关

### 实现一个并行限制的Promise调度器

```js
class PromiseLimiter{
    constructor(maxCount){
        this.maxCount = maxCount;
        this.tasks = [];
        this.result = [];
    }
    add(fn, delay){
      const task = () => new Promise((resolve, reject)=>{
          setTimeout(()=>{
              resolve(fn());
          }, delay)
      })
      this.tasks.push(task);
    }
    start(){
        for(let i = 0; i < this.maxCount; i++){
            this.request();
        }
    }
    request(){
        if(!this.tasks.length) return;
        this.tasks.shift()().then((res) => {
            this.result.push(res);
            this.request();
        })
    }
}
```

