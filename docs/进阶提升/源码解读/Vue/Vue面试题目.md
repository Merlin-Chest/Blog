# Vue面试题目

内容来自：村长学前端，[题解项目地址](http://github.com/57code/vue-interview)

## Vue API

### Vue组件之间都有通信方式

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
- 而在vue3中，v-if的优先级是高于v-for的，所以它可能也并不会去渲染这个列表，而且如果这样用的话，会直接报错警告。在源码中，作者是用了一个switch语句去处理不同情况的结点类型，而`NodeTypes.IF`也是排在`NodeTypes.FOR`前面,所以在编译过程中会想进入if的判断，再进入for的渲染。

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

- v-model双向绑定使用和原理

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

## 综合应用

- vue中如何扩展一个组件

- 子组件可以直接改变父组件的数据么，说明原因

- Vue要做权限管理该怎么做？控制到按钮级别的权限怎么做？

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