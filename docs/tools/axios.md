# Axios

Created: September 28, 2021 9:19 AM

## **1、axios 介绍与基础使用**

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中，支持特性：

- 从浏览器创建 [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- 从 node.js 创建 [http](http://nodejs.org/api/http.html) 请求
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 拦截请求和响应
- 转换请求和响应数据
- 取消请求
- 自动转换 `JSON` 数据
- 客户端支持防御[XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)

[起步](https://axios-http.com/zh/docs/intro)

[axios](https://www.npmjs.com/package/axios)

[GitHub - axios/axios: Promise based HTTP client for the browser and node.js](https://github.com/axios/axios)

## **2、axios 源码 - axios 类**

`Axios` 类是最核心 的类，封装并提供了请求所使用的 `API` 。

```jsx
 // Axios 类
 function Axios() {
   // 初始化
 }
 Axios.prototype.request = function(config) {
   // Axios 统一的请求入口方法
 }
```

`Axios` 基于 `request` 方法又提供了一些列 `HTTP` 方法的别名函数：

```jsx
 // Provide aliases for supported request methods
 // 针对不需要提交正文数据的请求封装处理
 utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
   /*eslint func-names:0*/
   Axios.prototype[method] = function(url, config) {
     return this.request(mergeConfig(config || {}, {
       method: method,
       url: url,
       data: (config || {}).data
     }));
   };
 });
 // 针对可以提交正文数据的请求处理
 utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
   /*eslint func-names:0*/
   Axios.prototype[method] = function(url, data, config) {
     return this.request(mergeConfig(config || {}, {
       method: method,
       url: url,
       data: data
     }));
   };
 });
```

## **6、axios 源码 - 工厂函数**

`axios` 提供一个函数 `createInstance` 来辅助创建 `Axios` 类的实例。但是需要注意的，该函数返回的并不是 `Axios` 实例对象，而是实例对象的 `request` 方法，并且把实例对象的其它别名方法挂载到 `request` 方法上（函数也是对象，可以添加属性方法）。所以才有下面的用法：

```jsx
 axios({...});
 axios.get('/', {...})
 ...
```

```jsx
 function createInstance(defaultConfig) {
   var context = new Axios(defaultConfig);
   var instance = bind(Axios.prototype.request, context);
 
   // Copy axios.prototype to instance
   utils.extend(instance, Axios.prototype, context);
 
   // Copy context to instance
   utils.extend(instance, context);
 
   return instance;
 }
```

当我们引用 `Axios` 库的时候，它会内部调用 `createInstance` 初始化并返回 `request` ：

```jsx
 var axios = createInstance(defaults);
 ...
 
 module.exports = axios;
 // 下面写法是为了兼容 ESM 模块的默认导出
 module.exports.default = axios;
```

同时给导出的 `axios` 提供了一些其它方法：

**原始类**

```jsx
 // 挂载原始Axios类
 axios.Axios = Axios;
```

**工厂函数**

```jsx
 // 创建实例的的工厂函数
 axios.create = function create(instanceConfig) {
   return createInstance(mergeConfig(axios.defaults, instanceConfig));
 };
```

所以，我们可以通过工厂函数来创建另外一个 `axios request` ：

```jsx
 // 使用默认的 request
 axios.get('/user');
 
 // 使用新的配置发送请求
 let newRequest = axios.create({baseURL: 'http://localhost:9999'});
 newRequest.get('/user');
```

## **3、axios 源码 - 配置处理**

在 `Axios` 中分别有三处配置点：

- 请求方法配置
- 实例配置
- 全局配置

> 参考：https://axios-http.com/zh/docs/req_config
> 

### **请求方法配置**

是指在 `request` 以及 `get`、`post` 等别名方法中传入的配置

```jsx
 axios({
   url: '/user'
 });
 axios.get('/user', {
   params: {
     page:1,
     limit:2
   }
 })
 ...
```

### **实例化配置**

我们还可以通过实例化的时候传入基础配置（我们可以把某些请求公用的配置在实例化的时候传入）

```jsx
 let newRequest = axios.create({
   baseURL: 'http://localhost:9999'
 });
```

### **全局（默认）配置**

`axios` 还有一组默认配置项，如果实例化的时候没有传入或者 `axios` 默认导出的那个实例化使用的就是默认配置。

```jsx
 // 默认配置 可以通过 axios.defaults 来获取
 axios.defaults.baseURL = 'http://localhost:8888';
 axios.get('/user');
```

### **配置优先级**

> 请求配置 > 实例配置 > 默认配置
> 

## **4、axios 源码 - 拦截器的应用与实现**

在 `axios` 中有一个类似中间件的机制用来在 `request` 方法请求之前和响应以后（用户代码执行之前）去处理一些任务。

```jsx
 // Add a request interceptor
 axios.interceptors.request.use(function (config) {
     // Do something before request is sent
     return config;
   }, function (error) {
     // Do something with request error
     return Promise.reject(error);
   });
 
 // Add a response interceptor
 axios.interceptors.response.use(function (response) {
     // Any status code that lie within the range of 2xx cause this function to trigger
     // Do something with response data
     return response;
   }, function (error) {
     // Any status codes that falls outside the range of 2xx cause this function to trigger
     // Do something with response error
     return Promise.reject(error);
   });
```

> 参考：https://axios-http.com/zh/docs/interceptors
> 

### **拦截器源码**

拦截器本质上就是类似中间件数组，一共有两组：请求、响应

```jsx
 function Axios(instanceConfig) {
   this.defaults = instanceConfig;
   this.interceptors = {
     request: new InterceptorManager(),
     response: new InterceptorManager()
   };
 }
```

```jsx
 // 拦截器的执行
 Axios.prototype.request = function request(config) {
   ...
   var requestInterceptorChain = [];
   var synchronousRequestInterceptors = true;
   this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
     if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
       return;
     }
 
     synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
 
     requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
   });
 
   var responseInterceptorChain = [];
   this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
     responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
   });
 
   var promise;
 
   if (!synchronousRequestInterceptors) {
			//代码链 （拦截器）
			//chain = [fulfilled[1],rejected[1],fulfilled[0],rejected[0],dispatchRequest, undefined,fulfilled[3],rejected[3],fulfilled[4],rejected[4]]
     var chain = [dispatchRequest, undefined];
 
     Array.prototype.unshift.apply(chain, requestInterceptorChain);
     chain.concat(responseInterceptorChain);
 
     promise = Promise.resolve(config);
     while (chain.length) {
			//(fulfilled,rejected) 每次一组两个
       promise = promise.then(chain.shift(), chain.shift());
     }
 
     return promise;
   }
 
 
   var newConfig = config;
   while (requestInterceptorChain.length) {
     var onFulfilled = requestInterceptorChain.shift();
     var onRejected = requestInterceptorChain.shift();
     try {
       newConfig = onFulfilled(newConfig);
     } catch (error) {
       onRejected(error);
       break;
     }
   }
 
   try {
     promise = dispatchRequest(newConfig);
   } catch (error) {
     return Promise.reject(error);
   }
 
   while (responseInterceptorChain.length) {
     promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
   }
 
   return promise;
 }
```

### **拦截器的应用**

```
 // 添加请求拦截器
 axios.interceptors.request.use(function (config) {
     // 发送 token
     try {
       let token = localStorage.getItem('token');
       config.headers.authorization = token;
     } catch(e){}
     return config;
   }, function (error) {
     return Promise.reject(error);
   });
 
 // 添加响应拦截器
 axios.interceptors.response.use(function (response) {
     console.log('请求日志', response);
     return response;
   }, function (error) {
     console.log('请求日志', response);
     alert('出错了');
     return Promise.reject(error);
   });
```

## **5、axios 源码 - 适配器**

在浏览器中我们使用 `XMLHttpRequest` 提供的 `API` 来发送请求，在 `Node.js` 端我们需要使用 `http` 模块提供的 `API` 来发送请求，他们在底层提供的 `API` 结构包括针对响应数据的格式包装也不并不一致。那么 `axios` 为了能够解决这种差异，让使用者在不同的环境下使用统一的 `API` ，就采用了适配模式。

![Untitled](../tools/Axios%2081d155ce10ba4b7fbf66eaa44e20d8c7/Untitled.png)