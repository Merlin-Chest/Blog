## once函数 
实现一个 once 函数，记忆返回结果只执行一次

```ts
/**
 * @description: 使传入的函数只执行一次，每次返回保留的结果
 * @param {Function} fn 函数
 * @return {*}
 */
function once(fn: Function) {
  let result;
  let cancelled = false;

  return (...args) => {
    if (cancelled) return result;
    result = fn(...args);
    cancelled = true;
    return result;
  }
}
```