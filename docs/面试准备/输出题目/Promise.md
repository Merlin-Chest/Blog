## 题目1

```js
setTimeout(() => console.log('a'));
Promise.resolve().then(
   () => console.log('b’);
 ).then(
   () => Promise.resolve('c').then(
     (data) => {
       setTimeout(() => console.log('d'));
       console.log('f');
       return data;
     }
   )
 ).then(data => console.log(data));
```

> 答案：b f c a d