# 数组相关

## reduce

1.  接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值
2.  可以接收一个初始值，当没有初始值时，默认初始值为数组中的第一项

```js
Array.prototype._reduce = function(fn, prev) {
    if(prev)
    for(let i=0 ; i<this.length ; i++) {
        if(prev === undefined) {
            prev = fn(this[i], this[i+1], i+1, this)
                ++i
        } else {
            prev = fn(prev, this[i], i, this)
        }
    }
    return prev
}
```

## 数组去重

```js
// 第一种
function mySet1(arr) {
    return [...new Set(arr)];
}
// 第二种
function mySet2(arr) {
    return arr.reduce((pre, cur) => {
        if (!pre.includes[cur])
	        pre.push(cur);
        return pre;
    }, []);
}
// 第三种
function mySet3(arr){
    // 不能用{},无法区分数字和字符串
    const map = new Map();
    const res = []
    // in 取索引，of取值
    for(const num of arr){
        if(!map.get(num)){
            res.push(num);
            map.set(num, true);
        }
    }
    return res;
}
```

## 数组扁平化

```js
// flat
function flat(arr){
    if(!Arrays.isArray(arr)) return arr;
    return arr.reduce(
        (prev,cur) => prev.concat(Array.isArray(cur) ? flat(cur) : cur)
    ,[]);
}

function flat(arr, dep){
    if(!Array.isArray(arr)) return arr;
    if(dep === 0) return arr;
    return arr.reduce((prev,cur)=>
        prev.concat(Array.isArray(cur) ? flat(cur, dep - 1) : cur);
    ,[]);
}

function flat(arr){
    if(!Array.isArray(arr)) return arr;
    const newArr = [];
    for(let item of arr){
        if(!Array.isArray(item)){
            newArr.push(item)
        }else{
            newArr.push(...flat(item));
        }
    }
    return newArr;
}
```