# Vue专题

内容来自：村长学前端，[题解项目地址](http://github.com/57code/vue-interview)

# Vue API

## Vue组件之间都有通信方式

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
## v-if和v-for哪个优先级更高

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
ƒ anonymous() {
	with(this){
		return _c('div',{attrs:{"id":"app"}},
			_l((items),function(item){
				return (item.isActive) 
				? _c('div',{key:item.id},[_v("\n      "+_s(item.name)+"\n    ")]) 
				: _e()
			}),0)
	}
}
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

## 简述 Vue 的生命周期以及每个阶段做的事

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

## v-model双向绑定使用和原理

- `v-model`是一个指令，可以绑定一个响应式数据到视图，同时视图也能改变值。
- 通常用在表单项上，也可以用来自定义组件上。
- 它是是一个语法糖，默认情况下，会展开为`:value`和`@input`。使用它可以减少很多繁琐的代码，提高开发效率
- 两种情况
	- 原生元素，会根据对应的一个标签类型，生成不同的属性名和事件属性
		- 
	- 父子组件，会生成`:modelValue`和`@update:modelValue`两个属性，而且在vue3中可以绑定多个`v-model`
- 原理上是在vue编译器上实现的，在模板转化为render函数的过程中，根据结点的类型，生成不同对应关系的属性和事件。
- 对于基本类型，我们需要触发emit来让父组件修改数据，如果想自定义事件的内容，则需要重写事件就可以。渲染时候会覆盖。否则使用默认的。
- 对于引用类型，实际上父组件和子组件引用的是同一个值，在子组件中直接更改props的值，父组件的值也会改变，所以不需要手动触发emit，但不建议这样使用，因为子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解，无法追溯、
- [v-model Demo](https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBDaGlsZCBmcm9tICcuL0NoaWxkLnZ1ZSdcbmltcG9ydCB7IHJlZiwgcmVhY3RpdmUgfSBmcm9tICd2dWUnXG5cbmNvbnN0IG1zZyA9IHJlZignSGVsbG8gV29ybGQhJylcblxuY29uc3QgY2hlY2tib3ggPSByZWFjdGl2ZShbdHJ1ZSxmYWxzZV0pXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8aDE+e3sgbXNnIH19PC9oMT5cbiAgPGlucHV0IHYtbW9kZWw9XCJtc2dcIj5cbiAgXG4gIDxoMT57e2NoZWNrYm94fX08L2gxPlxuICA8aW5wdXQgaWQ9XCJhYVwiIHR5cGU9XCJjaGVja2JveFwiIHYtbW9kZWw9XCJjaGVja2JveFswXVwiPlxuICA8bGFiZWwgZm9yPVwiYWFcIj4xMTE8L2xhYmVsPlxuICA8aW5wdXQgaWQ9XCJiYlwiIHR5cGU9XCJjaGVja2JveFwiIHYtbW9kZWw9XCJjaGVja2JveFsxXVwiPlxuICA8bGFiZWwgZm9yPVwiYmJcIj4yMjI8L2xhYmVsPlxuICA8Q2hpbGQgdi1tb2RlbDpjb250ZW50PVwibXNnXCIgdi1tb2RlbDpjaGVja0NvbnRlbnQ9XCJjaGVja2JveFwiPjwvQ2hpbGQ+XG48L3RlbXBsYXRlPiIsImltcG9ydC1tYXAuanNvbiI6IntcbiAgXCJpbXBvcnRzXCI6IHtcbiAgICBcInZ1ZVwiOiBcImh0dHBzOi8vc2ZjLnZ1ZWpzLm9yZy92dWUucnVudGltZS5lc20tYnJvd3Nlci5qc1wiXG4gIH1cbn0iLCJDaGlsZC52dWUiOiI8c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgZGVmaW5lUHJvcHMsIGRlZmluZUVtaXRzIH0gZnJvbSAndnVlJ1xuXG5jb25zdCBwcm9wcyA9IGRlZmluZVByb3BzKHtcbiAgY29udGVudDp7XG4gICAgdHlwZTpTdHJpbmcsXG4gICAgcmVxdWlyZTp0cnVlLFxuICAgIGRlZmF1bHQ6J2RlZmF1bHQnXG4gIH0sXG4gIGNoZWNrQ29udGVudDp7XG4gICAgdHlwZTpBcnJheSxcbiAgICByZXF1aXJlOnRydWUsXG4gICAgZGVmYXVsdDpbZmFsc2UsdHJ1ZV1cbiAgfSxcbn0pXG5jb25zdCBlbWl0ID0gZGVmaW5lRW1pdHMoWyd1cGRhdGU6Y29udGVudCcsJ3VwZGF0ZTpjaGVja0NvbnRlbnQnXSlcblxuICBjb25zdCBjaGFuZ2UgPSAoZSk9PntcbiAgICBlbWl0KCd1cGRhdGU6Y2hlY2tDb250ZW50JywgW3Byb3BzLmNoZWNrQ29udGVudFswXSwgZS50YXJnZXQuY2hlY2tlZF0pXG4gIH1cbjwvc2NyaXB0PlxuXG48dGVtcGxhdGU+XG4gIDxoMT57eyBjb250ZW50IH19PC9oMT5cbiAgPGlucHV0IDp2YWx1ZT1cImNvbnRlbnRcIiBAaW5wdXQ9XCIkZW1pdCgndXBkYXRlOmNvbnRlbnQnLCAkZXZlbnQudGFyZ2V0LnZhbHVlKVwiPlxuICBcbiAgPGgxPnt7IGNoZWNrQ29udGVudCB9fTwvaDE+XG4gIDxpbnB1dCBpZD1cImNjXCIgdHlwZT1cImNoZWNrYm94XCIgOmNoZWNrZWQ9XCJjaGVja0NvbnRlbnRbMF1cIiBAY2hhbmdlPVwiY2hlY2tDb250ZW50WzBdID0gJGV2ZW50LnRhcmdldC5jaGVja2VkXCI+XG4gIDxsYWJlbCBmb3I9XCJjY1wiPjMzMzwvbGFiZWw+XG4gIDxpbnB1dCBpZD1cImRkXCIgdHlwZT1cImNoZWNrYm94XCIgOmNoZWNrZWQ9XCJjaGVja0NvbnRlbnRbMV1cIiBAY2hhbmdlPVwiY2hlY2tDb250ZW50WzFdID0gJGV2ZW50LnRhcmdldC5jaGVja2VkXCI+XG4gIDxsYWJlbCBmb3I9XCJkZFwiPjQ0NDwvbGFiZWw+XG48L3RlbXBsYXRlPiJ9)


- 说说nextTick的使用和原理？

- watch和computed的区别以及选择?

- 说一下 Vue 子组件和父组件创建和挂载顺序

- 怎么缓存当前的组件？缓存后怎么更新？

- 你有写过自定义指令吗？自定义指令的应用场景有哪些？

- 说下$attrs和$listeners的使用场景

- v-once的使用场景有哪些？

- Vue中什么是递归组件？举个例子说明下？

- 异步组件是什么？使用场景有哪些？

## Vue3

- 你知道哪些vue3新特性

- Vue3.0的设计目标是什么？做了哪些优化?

- ref和reactive异同

- watch和watchEffect异同

- Vue3.0 性能提升主要是通过哪几方面体现的？

- Vue3.0里为什么要用 Proxy API 替代 defineProperty API ？

- Vue3 所采用的 Composition API 与 Vue2 使用的 Options API 有什么不同？

- 用Vue3.0 写过组件吗？如果想实现一个 Modal你会怎么设计？

# 综合应用

## vue中如何扩展一个组件

- 扩展方式
	- 逻辑扩展
		- vue2：mixins、extends
		- vue3：composition Api
	- 内容扩展
		- slots
- 一些问题
	- mixins：可能存在变量冲突，导致来源不明
- Vue.extend用于扩展Vue应用的构造器，在vue3中原相关方法都迁移到了应用实例上，

## 子组件可以直接改变父组件的数据么，说明原因？

所有prop使得父子之间形成一个**单向下行绑定**， 父级组件发生变更时，子组件中所有的prop都会刷新为新的值，这意味着你不应该在一个子组件中改变prop。

一个父组件下不只有你一个子组件。同样，使用这份 prop 数据的也不只有你一个子组件。如果每个子组件都修改 prop 的话，将会导致修改数据的源头不止一处。

- 修改prop的三种场景
	- 用来传递初始值：本地新建一个data，用props中的值作为初始值
	- 以原始的值传入需要进行转化：使用computed监听prop的值
	- 子组件修改父组件的值：使用emit把修改权限交回给父组件，父组件更新，子组件的prop也会更新。

所以，不能直接修改，直接修改的话会导致数据流错乱，你不清楚修改这个数据的来源是哪个组件。所以我们需要修改数据的源头交回给父组件，保证了数据修改源唯一。

## Vue要做权限管理该怎么做？控制到按钮级别的权限怎么做？

- 主要有两种：页面权限 和 按钮权限
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

- 从0到1自己构架一个vue项目，说说有哪些步骤、哪些重要插件、目录结构你会怎么组织

- 实际工作中，你总结的vue最佳实践有哪些？

- 使用vue渲染大量数据时应该怎么优化？说下你的思路！

- 你知道哪些vue代码优化策略

- SPA、SSR的区别是什么

- 你是怎么处理vue项目中的错误的？

## 原理源码  

- 说一说你对数据响应式理解？

- 说一下你对虚拟 DOM 的理解？

- 你了解diff算法吗？

- 能说说key的作用吗？

- 说说从 template 到 render 处理过程

- Vue实例挂载的过程中发生了什么?

- vue-loader是什么？它有什么作用？

## 全家桶  

- 怎么定义动态路由？怎么获取传过来的动态参数？

- 怎么实现路由懒加载呢？

- router-link和router-view的作用是什么

- Vue-router 除了 router-link 怎么实现跳转

- History模式和Hash模式有何区别？如果使用history模式，部署时要注意什么？

- 在什么场景下会用到嵌套路由？

- vue-router中如何保护路由？

- 说说vue-router完整的导航解析流程是什么？

- 如果让你从零开始写一个vue路由，说说你的思路

- 简单说一说你对vuex理解？

- 你有使用过vuex的module吗？主要是在什么场景下使用？

- vuex中actions和mutations有什么区别？

- 怎么监听vuex数据的变化？

- 页面刷新后vuex的state数据丢失怎么解决？

- 你觉得vuex有什么缺点？

- 如果让你从零开始写一个vuex，说说你的思路