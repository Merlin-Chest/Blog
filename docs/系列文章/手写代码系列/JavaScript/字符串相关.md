# 字符串相关

## trim

去除两端的空格

```js
export function trim() {
  const str = this;
  return str.replace(/^\s*|\s*$/g, '');
}

describe('trim',()=>{
  test('trim' , ()=>{
    const str = ' sss  '
    expect(trim.call(str)).toBe(str.trim())
  })
})
```

## slice

**`slice()`** 方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。

> [关于substring、substr、slice及splice的区别](https://segmentfault.com/a/1190000038355541)

```js
export function slice(beginIndex, endIndex) {
  const str = this;
  // 处理beginIndex小于0的情况
  beginIndex = beginIndex < 0 ? str.length + beginIndex : beginIndex;
  // 处理endIndex没有传的情况
  endIndex =
    endIndex === undefined
      ? str.length
      : endIndex < 0
      ? str.length + endIndex
      : endIndex;
  
  if(beginIndex >= endIndex) return '';

  let res = '';

  for (let i = beginIndex; i < endIndex; i++) {
    res += str[i];    
  }
  return res;
}
```

## 模板字符串

```js
export function stringTemplate(str, data) {
  const reg = /\$\{(\w+)\}/
  // 匹配到了
  if(reg.test(str)){
    // 获取到括号中的内容
    const key = str.match(reg)[1]
    // 获取真实的值
    const value = data[key]
    // 替换更新字符串
    str = str.replace(reg, value)
    // 递归，匹配下一个变量
    return stringTemplate(str, data)
  }
  // 匹配不到则直接返回
  return str;
}
```

