# 对象相关

## Object.freeze()

冻结一个对象，不能删除、修改、拓展一个对象。

对比Object.seal()：seal可以修改值的属性，如果原来的属性是`writable`的话。

```js
Object._freeze = function (obj) {
  if(typeof object !== 'object' || object === null) {
        throw new TypeError(`the ${object} is not a object`)
    }
 
    const keys = Object.getOwnPropertyNames(object)
    const symbols = Object.getOwnPropertySymbols(object)
 
    ;[...keys, ...symbols].forEach(key => {
        Object.defineProperty(object, key, {
            configurable: false,
            writable: false,
        })
    })
 
    Object.preventExtensions(object);
    // 或者
};
```

## Object.is()

- 需要判断+/-0和NaN的情况
	- 如果x等于y，应该返回true
		- 存在一种情况，两个都是0，要通过`1/x === 1/y`来判断是否同号，相等为true，不相等为false
	- 如果x不等于y
		- 存在一种情况，两个都是NaN，应该返回true（NaN !== NaN -> true）

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