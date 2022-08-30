# Vue专题

> 问题来自：村长学前端，[仓库链接](http://github.com/57code/vue-interview)
## 一、Vue API

### 1.Vue组件之间都有通信方式

- 常用的方式有一下：
	- 父子组件
		- props
		- $emit
		- $parent
		- ref
		- $attrs(常用在class、style、id等)
	- 兄弟组件
		- $parent(中间关系人)
		- $root
		- eventBus(vue3已经不推荐)
		- vuex
	- 跨层级
		- eventBus
		- vuex
		- provide/inject
- 回答的时候可以根据实际场景去说明
- vue3中移除的api
	- $children
	- $listeners
	- $on
### 2.v-if和v-for哪个优先级更高

- 在vue2和vue3中完全相反
- 先给出结论，说出细节
- 什么场景下会需要这么做，该这么处理
- 总结、拔高

- 在开发过程中，不应该把v-for和v-if放在一起；而且在vue的文档中也强烈的指出不要把这两个指令放在同个标签中。
- 在vue2中，v-for的优先级是高于v-if的，那么它实际生成的结果是渲染一个列表，在渲染的时候，每次都是使用三目运算法去判断是否渲染这个子项
- 而在vue3中，v-if的优先级是高于v-for的，所以它可能也并不会去渲染这个列表，而且如果这样用的话，会直接报错警告。在源码中，作者是用了一个switch语句去处理不同情况的结点类型，而`NodeTypes.IF`也是排在`NodeTypes.FOR`前面,所以在编译过程中会先进入if的判断，再进入for的渲染。

```js
// vue template explorer
// vue2
// 我们可以看出是先渲染列表，再进行v-if的判断
function anonymous() {
	with(this){
		return _c('div',{attrs:{"id":"app"}},
			_l((items),function(item){
				return (item.isActive) 
				? _c('div',{key:item.id},[_v("\n      "+_s(item.name)+"\n    ")]) 
				: _e()
			}),0)
	}
}
```

```js
// vue3
// 我们可以看出，其实_ctx.item.bool是不存在的,是先进行v-if判断，后进行列表渲染
// <div v-for="item in list" :key="item.key" v-if="item.bool">hi,{{message}}</div>

import { renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, toDisplayString as _toDisplayString, createCommentVNode as _createCommentVNode } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_ctx.item.bool)
    ? (_openBlock(true), _createElementBlock(_Fragment, { key: 0 }, _renderList(_ctx.list, (item) => {
        return (_openBlock(), _createElementBlock("div", {
          key: item.key
        }, "hi," + _toDisplayString(_ctx.message), 1 /* TEXT */))
      }), 128 /* KEYED_FRAGMENT */))
    : _createCommentVNode("v-if", true)
}
```

### 3.简述 Vue 的生命周期以及每个阶段做的事

vue的组件实例被创建之后呢，会有一系列的初始化步骤，比如，数据的观测，模板编译，挂载实例到dom上，以及数据变化时更新dom

在这个过程中，会在特定的时机去运行生命周期钩子，以便用户在特定阶段去添加自己的代码

共有八个阶段，创建前后，挂载前后，更新前后，消耗前后，以及一些特殊场景的生命周期。

### vue3中新增了三个用于调试和服务端渲染的场景

- renderTracked：调试钩子，响应式依赖被收集时调用
- renderTriggered：调试钩子，响应式依赖被触发时调用
- serverPrefetch：组件实例在服务器上被渲染之前调用

### setup函数

- setup函数运行时机比beforeCreate和created都更晚
- 在vue3中没有beforeCreate和created，因为setup早于任何声明周期，当setup调用之后，已经过了beforeCreate和created的时期，此时就算设置了也没有用。

### 4.v-model双向绑定使用和原理
- `v-model`是一个指令，可以绑定一个响应式数据到视图，同时视图也能改变值。
- 通常用在表单项上，也可以用来自定义组件上。
- 它是是一个语法糖，默认情况下，会展开为`:value`和`@input`。使用它可以减少很多繁琐的代码，提高开发效率
- 两种情况
	- 原生元素，会根据对应的一个标签类型，生成不同的属性名和事件属性
	- 父子组件，会生成`:modelValue`和`@update:modelValue`两个属性，而且在vue3中可以绑定多个`v-model`
- 原理上是在vue编译器上实现的，在模板转化为render函数的过程中，根据结点的类型，生成不同对应关系的属性和事件。
- 对于基本类型，我们需要触发emit来让父组件修改数据，如果想自定义事件的内容，则需要重写事件就可以。渲染时候会覆盖。否则使用默认的。
- 对于引用类型，实际上父组件和子组件引用的是同一个值，在子组件中直接更改props的值，父组件的值也会改变，所以不需要手动触发emit，但不建议这样使用，因为子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解，无法追溯。

- [v-model Demo](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBDaGlsZCBmcm9tICcuL0NoaWxkLnZ1ZSdcbmltcG9ydCB7IHJlZiwgcmVhY3RpdmUgfSBmcm9tICd2dWUnXG5cbmNvbnN0IG1zZyA9IHJlZignSGVsbG8gV29ybGQhJylcblxuY29uc3QgY2hlY2tib3ggPSByZWFjdGl2ZShbdHJ1ZSxmYWxzZV0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8aDE+e3sgbXNnIH19PC9oMT5cbiAgPGlucHV0IHYtbW9kZWw9XCJtc2dcIj5cbiAgXG4gIDxoMT57e2NoZWNrYm94fX08L2gxPlxuICA8aW5wdXQgaWQ9XCJhYVwiIHR5cGU9XCJjaGVja2JveFwiIHYtbW9kZWw9XCJjaGVja2JveFswXVwiPlxuICA8bGFiZWwgZm9yPVwiYWFcIj4xMTE8L2xhYmVsPlxuICA8aW5wdXQgaWQ9XCJiYlwiIHR5cGU9XCJjaGVja2JveFwiIHYtbW9kZWw9XCJjaGVja2JveFsxXVwiPlxuICA8bGFiZWwgZm9yPVwiYmJcIj4yMjI8L2xhYmVsPlxuICA8Q2hpbGQgdi1tb2RlbDpjb250ZW50PVwibXNnXCIgdi1tb2RlbDpjaGVja0NvbnRlbnQ9XCJjaGVja2JveFwiPjwvQ2hpbGQ+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJDaGlsZC52dWUiOiI8c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgZGVmaW5lUHJvcHMsIGRlZmluZUVtaXRzIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBwcm9wcyA9IGRlZmluZVByb3BzKHtcbiAgY29udGVudDp7XG4gICAgdHlwZTpTdHJpbmcsXG4gICAgcmVxdWlyZTp0cnVlLFxuICAgIGRlZmF1bHQ6J2RlZmF1bHQnXG4gIH0sXG4gIGNoZWNrQ29udGVudDp7XG4gICAgdHlwZTpBcnJheSxcbiAgICByZXF1aXJlOnRydWUsXG4gICAgZGVmYXVsdDpbZmFsc2UsdHJ1ZV1cbiAgfSxcbn0pXG5jb25zdCBlbWl0ID0gZGVmaW5lRW1pdHMoWyd1cGRhdGU6Y29udGVudCcsJ3VwZGF0ZTpjaGVja0NvbnRlbnQnXSlcblxuICBjb25zdCBjaGFuZ2UgPSAoZSk9PntcbiAgICBlbWl0KCd1cGRhdGU6Y2hlY2tDb250ZW50JywgW3Byb3BzLmNoZWNrQ29udGVudFswXSwgZS50YXJnZXQuY2hlY2tlZF0pXG4gIH1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxoMT57eyBjb250ZW50IH19PC9oMT5cbiAgPGlucHV0IDp2YWx1ZT1cImNvbnRlbnRcIiBAaW5wdXQ9XCIkZW1pdCgndXBkYXRlOmNvbnRlbnQnLCAkZXZlbnQudGFyZ2V0LnZhbHVlKVwiPlxuICBcbiAgPGgxPnt7IGNoZWNrQ29udGVudCB9fTwvaDE+XG4gIDxpbnB1dCBpZD1cImNjXCIgdHlwZT1cImNoZWNrYm94XCIgOmNoZWNrZWQ9XCJjaGVja0NvbnRlbnRbMF1cIiBAY2hhbmdlPVwiY2hlY2tDb250ZW50WzBdID0gJGV2ZW50LnRhcmdldC5jaGVja2VkXCI+XG4gIDxsYWJlbCBmb3I9XCJjY1wiPjMzMzwvbGFiZWw+XG4gIDxpbnB1dCBpZD1cImRkXCIgdHlwZT1cImNoZWNrYm94XCIgOmNoZWNrZWQ9XCJjaGVja0NvbnRlbnRbMV1cIiBAY2hhbmdlPVwiY2hlY2tDb250ZW50WzFdID0gJGV2ZW50LnRhcmdldC5jaGVja2VkXCI+XG4gIDxsYWJlbCBmb3I9XCJkZFwiPjQ0NDwvbGFiZWw+XG48L3RlbXBsYXRlPiJ9)

### 5.说说nextTick的使用和原理
- 使用：nextTick是Vue提供的一个全局API，由于vue的异步更新策略导致我们对数据的修改不会立即体现在dom变化上，此时如果想要 **在修改数据后立即获取到更新后的dom状态** ，就需要使用这个方法
- 原理
	- vue在更新dom时是异步的。只要侦查到数据变化，vue就会开启一个队列，并缓冲在通过事件循环中发生的所有数据变更
	- 如果同个watcher被多次触发，只会被推进队列一次，这种缓冲对于去除重复数据，对于避免不必要的计算和dom操作是非常重要的
	- 最后把这个队列加入微任务中
	- nextTick的原理其实很简单，就是把传进来的回调函数转为微任务加入到事件队列中，因为调用时机是在修改数据之后，自然执行也在vue的队列之后，确保函数在前面的dom操作完成后才调用

### 6.watch和computed的区别以及选择
- computed：计算属性。依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值；
- watch：监听数据的变化。更多的是「观察」的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作；
- 运用场景：
	- 1）当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算
	- 2）当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。
### 7.说一下 Vue 子组件和父组件创建和挂载顺序

### 8.怎么缓存当前的组件？缓存后怎么更新？

### 9.你有写过自定义指令吗？自定义指令的应用场景有哪些？

### 10.说下 $attrs 和 $listeners的使用场景

### 11.v-once的使用场景有哪些？

### 12.Vue中什么是递归组件？举个例子说明下？

### 13.异步组件是什么？使用场景有哪些？

## 二、Vue3

### 1.你知道哪些vue3新特性

- API层面
	- Componsition API
	- setup语法糖
	- Teleport传送门
	- FLagments片段（组件多标签）
	- 自定义渲染器
	- SFC CSS变量（v-bind(变量)）
- 框架层面
	- 更快
		- 响应式基于Proxy
		- 虚拟DOM进行重写
			- 多一些编译优化内容的存储
			- 结点类型更加多样（可能直接是一个组件类型等）
		- 编译器优化
			- 静态提升：对于永远不会变的结点，编译器期间打上标记，、生成代码字符串时，发现静态结点，就会提升它们，将它们序列化成字符串，减少编译以及渲染的成本。
			- patchFlags：对结点的变化进行更精确的标记，如动态的text，动态的class等，数组结点带key等，在patchElement时，根据变化的类型，进行不同的处理和优化。
	- 更小
		- 更好Tree Shaking的支持
	- 更容易维护
		- 把代码抽离出独立的模块，更容易维护
		- Typescript的支持
	- 更容易扩展
		- 独立的响应式模块
		- 自定义渲染器

### 2.Vue3.0的设计目标是什么？做了哪些优化?

### 3.ref和reactive异同

### 4.watch和watchEffect异同

### 5.Vue3.0 性能提升主要是通过哪几方面体现的？

### 6.Vue3.0里为什么要用 Proxy API 替代 defineProperty API ？

### 7.Vue3 所采用的 Composition API 与 Vue2 使用的 Options API 有什么不同？

### 8.用Vue3.0 写过组件吗？如果想实现一个 Modal你会怎么设计？

## 三、综合应用

### 1.vue中如何扩展一个组件

- 扩展方式
	- 逻辑扩展
		- vue2：mixins、extends
		- vue3：composition Api
	- 内容扩展
		- slots
- 一些问题
	- mixins：可能存在变量冲突，导致来源不明
- Vue.extend用于扩展Vue应用的构造器，在vue3中原相关方法都迁移到了应用实例上，

### 2.子组件可以直接改变父组件的数据么，说明原因？

所有prop使得父子之间形成一个**单向下行绑定**， 父级组件发生变更时，子组件中所有的prop都会刷新为新的值，这意味着你不应该在一个子组件中改变prop。

一个父组件下不只有你一个子组件。同样，使用这份 prop 数据的也不只有你一个子组件。如果每个子组件都修改 prop 的话，将会导致修改数据的源头不止一处。

- 修改prop的三种场景
	- 用来传递初始值：本地新建一个data，用props中的值作为初始值
	- 以原始的值传入需要进行转化：使用computed监听prop的值
	- 子组件修改父组件的值：使用emit把修改权限交回给父组件，父组件更新，子组件的prop也会更新。

所以，不能直接修改，直接修改的话会导致数据流错乱，你不清楚修改这个数据的来源是哪个组件。所以我们需要修改数据的源头交回给父组件，保证了数据修改源唯一。

### 3.Vue要做权限管理该怎么做？控制到按钮级别的权限怎么做？

- 主要有两种：**页面权限** 和 **按钮权限**
- 实现方案：
	- 前端实现
		- 把所有的路由信息在前端配置，通过路由守卫要求用户登录，用户登录后根据角色过滤出路由表。比如我会配置一个`asyncRoutes`数组，需要认证的页面在其路由的`meta`中加入一个`roles`字段，等获取到用户角色之后取两者的交集，若不为空则说明可以访问。此过滤过程刚结束，剩下的路由就是用户能访问的路由页面，最后用过`router.addRoutes(accessRoutes)`方式动态添加路由即可。
		- 特点：实现简单，不需要额外的权限管理页面，但维护成本高，新的需求需要修改代码重新打包。
	- 后端实现
		- 把所有的页面路由信息存入数据库，用户登录的时候根据角色查询得到其能访问的所有路由信息，返回给前端，前端再通过`addRoutes`动态添加路由
		- 有专门的角色和权限管理页面，系统设计比较复杂。
	- 按钮权限的控制：通常会实现一个指令，例如`v-permission`,将按钮要求角色通过值传给`v-perission`指令，在指令的`mounted`钩子可以判断当前用户角色和按钮是否存在交集，有则保留，无则移除按钮。

```js
// vue-element-admin 前端实现方案 路由守卫代码
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})
```

### 4.从0到1自己构架一个vue项目，说说有哪些步骤、哪些重要插件、目录结构你会怎么组织

### 5.实际工作中，你总结的vue最佳实践有哪些？

### 6.使用vue渲染大量数据时应该怎么优化？说下你的思路！

### 7.你知道哪些vue代码优化策略


### 8.SPA、SSR的区别是什么

### 9.你是怎么处理vue项目中的错误的？

## 四、原理源码

### 1.说一说你对数据响应式理解？

- 什么是响应式
	- 能够使数据变化能够被检测并且对这种变化做出响应的机制。
- vue为什么需要响应式
	- MVVM框架中要解决的一个核心问题就是数据层和视图层的同步问题，通过数据驱动应用，数据变化，视图更新，要做到这点就需要对数据进行响应式处理，一旦数据改变就可以立即做出视图的更新处理。
- 带来什么好处
	- 响应式结合虚拟DOM和patch算法，可以避免多余的dom操作，专注于业务层面上的代码。
- vue2中的响应式实现？缺点？
	- 对不同数据进行不同处理
		- 如果是使用`defineProporty`的方式定义，当数据被访问时，收集依赖；当数据发生改变时，触发依赖
		- 如果是数组则是覆盖实现了数组对象原型上的7个方法，来实现对依赖的收集和触发。
	- 缺点
		- 初始化时递归遍历属性会造成性能损失
		- 新增或者删除属性，用户需要使用`Vue.set/delete`这样特殊的Api才能生效
		- 不支持ES6中新产生的Map/Set等
- vue3中的新变化
	- 使用Proxy代理响应式对象。
	- 移除了特殊的api，如Vue.set/delete等
	- reactivity抽离出独立的包，使用更加灵活。

### 2.说一下你对虚拟 DOM 的理解？
- 什么是虚拟DOM
	- 本质上是`JavaScript`对象，通过不同的属性描述了一个DOM结点。
- 引入虚拟DOM有什么好处
	- 有效的减少直接操作dom的次数，从而提升程序的性能。
		- 直接操作dom是有限的，一个真实元素上有许多的内容，如果直接进行diff操作，会额外diff许多没有必要的内容；同样的，如果需要进行clone，则需要将全部内容进行复制，也是没有必要的。**如果转化成js对象，这一切会简单很多。**
		- 操作dom是比较消耗性能的操作，频繁的dom操作容易引起页面的重绘和回流，但通过抽象vnode进行中间的处理，可以减少直接操作dom的次数，从而减少页面重绘和回流。
	- 有利于实现跨平台
		- 同一个虚拟结点，可以渲染成不同平台上的对应的内容。
		- vue3中实现了自定义渲染器，以便于对不同平台进行渲染。
- 如何生成，如何转化为真实DOM
	- template模板 -> （ast -> generate -> compile ->） render函数 ->  VNode -> 真实DOM
- diff算法的作用
	- 挂载结束之后，会进入更新流程，但某些响应式数据发生改变时，会引起组件的重新render，此时就会生成新的vdom，和上次的渲染结果diff则可以得到变化的地方，从而转化为最小量的dom操作，高效地更新dom。

### 3.diff算法（patching算法）
- 为何引入diff算法
	- 在vue1.x视图中的每个依赖均有更新函数对应，可以做到精准更新，所以不需要虚拟dom和diff算法。但由于这样的粒度过细，导vue1.x无法承载较大的应用；为了解决这个问题，vue2.x为了解决Watcher的粒度，每个组件只有一个watcher，此时需要引入patching算法来精确的找到发生变化的地方并高效更新。
- diff算法的执行时刻
	- 组件内的响应式数据发生变化时，触发实例执行其更新函数，更新函数会再次执行render函数，获得最新的虚拟dom，然后执行patch操作，并传入新旧两次虚拟dom结点，通过比对两者找到变化的地方，最后转化为对应的dom操作。
- diff算法的过程：
	- 一个递归的过程，深度优先，同层比较：
		- 先判断两个结点是不是相同类型的结点，不同则删除重新创建
		- 如果都是文本则更新文本内容
		- 如果都是元素，则递归更新子元素，同时更新元素属性
		- 更新子节点又分为几种情况：
			- 新的为文本，老的为数组：则清空，设置文本
			- 新的为文本，老的为文本：则更新文本
			- 新的为数组，老的为文本：则清空文本，创建子节点
			- 新的为数组，老的为数组：则比较，实现最小量更新（比较过程）
				- 先首尾进行比较，新的结点多则新增，少则删除；再比较中间部分，通过最长递增子序列的算法找到哪些结点是不需要更新的，再将剩下的结点进行创建、删除、移动等操作，实现最小化的更新。
	- vue3中的优化：编译期间优化patchFlags等，标记出变更的类型，实现更加精确的更新

### 4.最长递增子序列
- 动态规划+贪心算法+二分查找+回溯
```js
function getSequence(arr) {
      const p = arr.slice();
      const result = [0]; // 存储索引
      // let 
      for (let i = 0; i < arr.length; i++) {
        const arrI = arr[i]; // 当前值
        if (arrI != 0) {
          let j = result[result.length - 1]; // 取当前result最大值
          // 是递增的，就把当前值加到result中
          if (arr[i] > arr[j]) {
            p[i] = j; // 备份前一个result的最大值
            result.push(i);
            continue
          }
          // 不是递增的，找到比他大的那个值 在 result 中的索引
          let l = 0;
          let r = result.length - 1;
          while (l < r) {
            let mid = (l + r) >> 1;
            if (arr[result[mid]] < arr[i]) {
              l = mid + 1;
            } else { 而且其实那段话我可以安排
              r = mid;
            }
          }
          // 如果能找到
          if (arr[result[l]] > arr[i]) {
            if (l > 0) { // l = 0时，不需要备份
              p[i] = result[l - 1]; // 备份前一个result的最大值
            }
            // 更新结果
            result[l] = i;
          }
        }
      }
      // 回溯，得到正确答案
      // 因为有可能存在说，遍历到后面的值，比前面的值小，会覆盖之前的结果,可能导致不正确
      // 我们在每次遍历的时候都保留了之前的结果，现在进行还原
      let i = result.length;
      let j = result[i - 1];
      while (i-- > 0) {
        result[i] = j; // 
        j = p[j]; // 找到当前的前一个result最大值
      }
      return result;
}
```

### 5.key的作用
- 作用：优化patch性能，更高效的更新虚拟DOM
- key的必要性
	- 判断key 是 找patch过程中判断两个结点是相同结点 中的一个必要条件，在渲染一组列表中，key往往是唯一的标识，如果不定义key的话，vue只会认为比较两个节点是同一个，哪怕实际上并不是，这导致了频繁的更新元素，使得整个patch过程比较低效
	- 例如：[1,2,3,4,5] -> [1,2,3,6,4,5]
		- 如果不设置key，会导致更新[4,5]为[6,4],最后插入5，**更新三次插入1次**
		- 如果设置key，更新则为在4前面插入6，**插入1次**
- 使用方式
	- 渲染列表时，必须设置，并且必须是唯一标识，应该避免使用数组索引作为key，这可能导致一些隐蔽的bug，
	- vue中在使用相同标签元素过渡切换时，也会去使用key，其目的也是让vue可以区分他们，否则vue只会一环其内部属性而不会触发过渡效果。
- 总结：从源码层面描述下vue如何判断两个结点是否相同
	- 从源码中可以看到，vue判断两个结点是否相同主要判断结点类型和key值，如果不设置key，那么`undefined === undefined`永远为true，可能永远认为两个节点是相同的，只能去做更新操作，造成大量dom更新操作，是不可取的。

### 6.说说从 template 到 render 处理过程

### 7.Vue实例挂载的过程中发生了什么?

### 8.vue-loader是什么？它有什么作用？

## 五.全家桶  

### 1.怎么定义动态路由？怎么获取传过来的动态参数？
- 什么是动态路由
	- 我们给定匹配模式的路由映射到同一个组件，需要定义动态路由
- 什么时候用，如何定义
	- 一个User页面，对所有用户渲染，但id不同
	- `{path:'/user/:id',component:User}`
- 参数如何获取
	- `$route.params`中
	- 可以有多个
- 其他
	- `$router.query: xxx?xxx=xxx`

### 2.怎么实现路由懒加载呢？

### 3.router-link和router-view的作用是什么

### 4.Vue-router 除了 router-link 怎么实现跳转

### 5.History模式和Hash模式有何区别？如果使用history模式，部署时要注意什么？

### 6.在什么场景下会用到嵌套路由？

### 7.vue-router中如何保护路由？

### 8.说说vue-router完整的导航解析流程是什么？

### 9.如果让你从零开始写一个vue路由，说说你的思路
- 单页面应用需要解决的问题就是页面跳转内容改变但不刷新，另外需要以vue插件的形式存在。
	- 先定义一个`createRouter`函数，返回路由器实例
		- 保存用户配置项
		- 监听hash或者popstate事件
		- 回调中根据path匹配到对应路由，渲染相应的组件到router-view中
	- 将router定义成vue插件，即实现install方法，内部做两件事
		- 注册全局组件，router-link和router-view，分别实现页面跳转和内容显示
		- 定义全局变量：$route 和 $router，组件内可以访问当前路由和路由器实例

### 10.简单说一说你对vuex理解？

### 11.你有使用过vuex的module吗？主要是在什么场景下使用？

### 12.vuex中actions和mutations有什么区别？

### 13.怎么监听vuex数据的变化？

### 14.页面刷新后vuex的state数据丢失怎么解决？

### 15.你觉得vuex有什么缺点？

### 16.如果让你从零开始写一个vuex，说说你的思路
