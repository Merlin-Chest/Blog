# Object.is

```js
Object.is = function(x, y) {
    if (x === y) { 
      // 如果 x !== 0 则需要判断+0和-0，通过 1/x 和 1/ y 来判断
      return x !== 0 || 1 / x === 1 / y;
    }
    // NaN === NaN  -> false, Object.is(NaN,NaN)  -> true
    // 如果x和y都是NaN的话,返回true
    return x !== x && y !== y; // NaN
}
```