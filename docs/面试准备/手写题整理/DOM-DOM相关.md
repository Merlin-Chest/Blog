# DOM-DOM相关

## DOM树的左视图

思路：DOM也是一棵树，层序遍历，只需输出每一层的最左边元素。主要左右子树的添加顺序。

```js
const getLeftDOM = (root) => {
  if(!root) return [];
  const res = [];
  let level = [];
  level.push(root);
  while(level.length > 0){
    const len = level.length;
    const temp = [];
    for(let i = 0; i < len; i++){
      const node = level[i];
      // 把每一层最左边的结点加进去
      if(i === 0) res.push(node);
      if(node.children && node.children.length > 0){
        for(const child of node.children){
          temp.push(child);
        }
      }
    }
    level = temp;
  }
  return res;
}
console.log(getLeftDOM(document.body))
```

## DOM的最大深度

使用递归计算

```js
// 求dom树的最大深度
const getDepth = node => {
  if (!node.children || node.children.length === 0) {
    return 1
  }
  const maxChildrenDepth = [...node.children].map(v => getDepth(v))
  return 1 + Math.max(...maxChildrenDepth)
}
console.log(getDepth(document.body))
```

## DOM的种类

```js
const getAllNodeType = (node, set)=>{
  if(!node.children || node.children.length === 0) return [];
  if(!set){set = new Set();}
  for(const child of node.children){
    set.add(child.tagName);
    if(child.children && child.children.length > 0) {
      getAllNodeType(child, set);
    }
  }
  return [...set];
}
console.log(getAllNodeType(document.body))
```
