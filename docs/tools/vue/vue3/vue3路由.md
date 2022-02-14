# Vue3-Router

Created: August 26, 2021 10:36 AM
Tags: vue

### 引入方式

- CDN

```html
<script src="[https://unpkg.com/vue-router@next](https://unpkg.com/vue-router@next)"></script>
```

- 在我们的vue项⽬中使⽤

```bash
npm i vue-router@next -S
```

- 引⼊vue-router插件

```javascript
//main.js
import router from "./router/index";
createApp(App)
 .use(router)
 .mount("#app");
```

### 配置路由

```javascript
//router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import CourseList from "/comps/CourseList.vue";
import CourseAdd from "/comps/CourseAdd.vue";
// 1. 配置路由
const routes = [
 { path: "/", component: CourseList },
 { path: "/add", component: CourseAdd },
];
// 2. 创建路由器实例
export default createRouter({
// 3. 提供⼀个history实现
history: createWebHashHistory(),
routes,
});
```

### 使用

- 添加⼊⼝

```javascript
<router-view></router-view>
```

- 跳转

```javascript
<router-link to="/add">新增</router-link>
```

### 动态路由

- 基本⽤法
    - 路由配置： { path: "/course/:id", component: CourseDetail }
    - 参数获取： this.$route.params.id 或 useRoute().params.id
- 修改路由配置

```javascript
//router/index.js
import CourseDetail from "/comps/CourseDetail.vue";
const routes = [
 { path: "/course/:id", component: CourseDetail },
];
```

- 跳转

```javascript
<router-link :to="'/course/' + c.id">{{ c.name }}</router-link>
```

- 页面获取路由参数

```javascript
<template> 
	<div> 
		<h3>{{ course.name }}</h3> 
		<p>id: {{ $route.params.id }}</p> 
		<p>price: {{ course.price }}</p>
	</div>
</template>
```

- 响应参数变化
    - 参数变化时，组件实例会复⽤，导致⻚⾯不会响应参数的变化。id变为2，显示内容还是1的。
    - 解决方案
        - 监听params： this.$watch(() => this.$route.params, (params, prevParams) => {})
        - 利⽤导航钩⼦
        
        ```javascript
        async beforeRouteUpdate(to, from) {
        // 响应路由变化
        this.userData = await fetchUser(to.params.id)
        },
        ```
        
    - 改进案例
    
    ```javascript
    watch(
    	 () => route.params,
    	 () => {
    	getCourseById(route.params.id).then(ret => {
    		course.value = ret;
     });
     }
    );
    ```
    
- 通配或404处理

```javascript
const routes = [
// 下⾯配置会匹配所有path，匹配内容放⼊`$route.params.pathMatch`
 { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
// 匹配所有以`/user-`开头path，匹配内容放⼊`$route.params.afterUser`
 { path: '/user-:afterUser(.*)', component: UserGeneric },
]
```

### 嵌套路由

- 修改路由配置

```javascript
const routes = [
	 {
			path: "/",
			redirect: "/course",
	 },
	 {
			path: "/course",
			component: CourseList,
		//孩子路由
			children: [
				 { path: "/course/:id", component: CourseDetail },
				 { path: "/course/add", component: CourseAdd },
			 ],
	 },
	 { path: "/:pathMatch(.*)*", component: NotFound },
];
```

- CourseList中发⽣两个变化
    - 需要添加⼀个 router-view 显示嵌套路由内容
    
    ```javascript
    <p>
    	<router-link to="/course/add">新增</router-link>
    </p> 
    	<router-view></router-view>
    ```
    
    - 导航也随之变化

### 编程式导航

| 声明式编程                         | 编程式编程           |
| -------------------------------- | ------------------- |
| \<router-link :to="...">         | router.push(...)    |
| \<router-link :to="..." replace> | Router.replace(...) |

- 常见用法

```javascript
// 传递path
router.push(`/user/${username}`)

// 或者
router.push({ path: `/user/${username}` })
```

- 几个例子
  
    ```vue
    <button @click="$router.push('/add')">新增</button>
    ```
    
    ```javascript
    // 使⽤`name`和`params`搭配，以利⽤⾃动的URL编码；不能使⽤`path`和`params`搭配
    router.push({ name: 'user', params: { username } })
    ```
    
    ```vue
    <ul>
    	<li @click="showDetail(c)">
    	 {{ c.name }}
    	</li>
    </ul>
    <script>
    	setup() {
    		const router = useRouter();
    		const selectedCourse = ref(null);
    		const showDetail = c => {
    			selectedCourse.value = c;
    			//注意name
    			router.push({ name: "detail", params: { id: c.id } });
    		 };
    		return { courses, showDetail };
    	},
    </script>
  ```
    ```    
    //路由定义时需要⼀个name，router/index.js
    { path: "/course/:id", name: "detail", component: CourseDetail}
    ```
  
- 使用命名路由
    - 好处
        - ⽆需编写复杂URL
        - params ⾃动编码/解码
        - 避免path之间的排名竞争
    - router-link中也可使⽤
    
    ```vue
    <router-link :to="{ name: 'bar', params: { param: 'abc' }}">Bar</router-link>
    ```
    

### 路由守卫

- 方式
    - 全局守卫
    - 单个路由守卫
    - 组件内部路由钩子