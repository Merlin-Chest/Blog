```js
function handleRgba(str){
    let arr = str.substring(str.indexOf('(')+1,str.indexOf(')')).split(',');
    console.log(arr);
    let res = '#';
    for(let i = 0;i < 3;i++){
        res += parseInt(arr[i]).toString(16);
    }
    return [res,arr[3].toString()];
}
```