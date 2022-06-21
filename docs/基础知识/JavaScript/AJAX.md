# AJAX

### 背景

传统请求交互：返回整个页面数据，占用资源；会重新加载整个页面

### 异步无刷新

通过JS API，向服务端发送请求，获取数据后，通过js控制数据的渲染（DOM操作）

- XMLHttpRequset
    - 优势：出现早，浏览器支持好
    - 劣势：API陈旧，一些现代JS语言特性需要封装。
- Fetch
    - 优势：对一些特性有天然良好的支持
    - 劣势：兼容、缺少事件支持。

### XMLHttpRequest使用

- 创建对象

```javascript
let xhr = new XMLHttpRequest();
```

- 配置参数
    
    ```javascript
    xhr.open(string method,string url,boolean async);
    ```
    
    - method
        - **GET**
        - **POST**
        - **PUT**
        - **DELETE**
        - ...
    - url:请求资源的URL
        - 请求配置参数与数据的设置
            - 动态路由
            
            ```javascript
            let itemId = 1;
            xhr.open('get',`/item/${itemId}`);
            ```
            
            - queryString
            
            ```javascript
            let page = 1;
            let limit = 5;
            xhr.open('get',`/items?page=${page}&limit=${limit}`)
            ```
            
    - async：是否异步模式发送请求，默认true
    
    [XMLHttpRequest.open() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open)
    
- 发送请求

```javascript
xhr.send();
```

- 监听请求相关事件
    
    [事件](AJAX%201584bdcc484447389c271e656cf59c3a/%E4%BA%8B%E4%BB%B6%201143fac1ac3249798addf4acaf77495f.csv)
    
- 获取数据
    - 属性和方法
        - readyState：请求的状态
            - 提供了一个readystatechange事件来监听readyState的变化
            
            [XMLHttpRequest.readyState - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readyState)
            
        - response：返回的原始内容，取决于respondType
        - responseType：返回的数据类型
            
            [XMLHttpRequest.responseType - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType)
            
        - responseText：返回转换成文本类型的响应数据。
        - status：响应状态码
        - statusText：响应状态文本
        - timeout：设置请求超时时间
    - 上传与下载（监听事件的使用）

### Fetch使用(类似axios)

[使用 Fetch - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)

对象的形式进行请求

```javascript
fetch('请求的链接',{
		method:'get',
		...各种参数
	})
  .then(function(res) {
    return res.json();
  })
```
