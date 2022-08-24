# Vue3基础
## Composition API

### **介绍**

1. 函数式、自由组合
2. 将同⼀个逻辑关注点相关的代码配置在⼀起

### **setup**

1. 是⼀个新的组件选项，作为在组件内使⽤ Composition API 的⼊⼝点。
2. 执行时刻很早，甚至早于beforeCreate
3. this不可用也没有必要用
4. 可用参数
- props：属性，是一个Proxy对象
  
解构会失去响应能力

- ctx：上下文，是一个对象，可以解构（{attrs, slots, emit}）
5. return
- 返回render函数的上下文对象
- 返回一个渲染函数
6. 获取组件实例getCurrentInstance()

### **响应式系统 API**

#### reactive：对象响应式

```js
const obj = reactive({count:0})
```

- **toRefs** 把⼀个响应式对象转换成普通对象，该普通对象的每个属性都是⼀个Ref。

```js
  const state = reactive({
  foo: 1,
  bar: 2,
  })
  const stateAsRefs = toRefs(state)
  /* stateAsRefs 的类型如下: {
   foo: Ref<number>,
   bar: Ref<number>
  }
  */
```

- 响应式对象结构丢失响应式

#### ref：单值响应式

```js
const count = ref(0)
console.log(count.value)
```

如果传⼊ ref 的是⼀个对象，将调⽤ reactive ⽅法进⾏深层响应转换。

- 模板中访问：Ref对象在模板中使⽤时会⾃动解套，⽆需额外书写 .value
  
```html
<div>{{ count }}</div>
```

- Ref对象作为 reactive 对象的属性被访问或修改时，也将⾃动解套 value 值
  
```js
const count = ref(0)
const state = reactive({
	count,
})
console.log(state.count) // 0
```


#### readonly：只读属性

​	只读不可改变，如props

#### computed：计算属性

1. 传⼊⼀个 getter 函数，返回⼀个不可⼿动修改的 Ref 对象
   
```js
const count = ref(1)
const doubleCount = computed(() => count.value * 2)
console.log(doubleCount.value) // 2
doubleCount.value++ // 错误
```

2. 传⼊⼀个拥有 get 和 set 函数的对象，创建⼀个可⼿动修改的计算状态
   
```js
const count = ref(1)
const doubleCount = computed({
get: () => count.value * 2,
set: (val) => {
count.value = val / 2
 },
})
doubleCount.value = 4
console.log(count.value) // 2
```

#### watchEffect ：副作⽤侦听器

- ⽴即执⾏传⼊的⼀个函数，并收集响应式的依赖，当依赖变更时重新运⾏该函数

```js
const count = ref(0)
watchEffect(() => console.log(count.value)) // 打印出 0
setTimeout(() => {
count.value++ // 打印出 1
}, 100)
```

#### watch ：侦听器

- watch 侦听特定数据源，并在回调函数中执⾏副作⽤
- 侦听单个数据源：数据源可以是⼀个拥有返回值的 getter 函数，也可以是 ref

```js
// 如果观察的是一个对象里的key，需要使用一个函数来返回
const state = reactive({ count: 0 })
watch(
 () => state.count,
 (count, prevCount) => {}
)
// 直接侦听⼀个 ref
const count = ref(0)
watch(count, (count, prevCount) => {})

//接受第三个参数 options
const state = reactive({ count: 0 })
watch(
 () => state.count,
 (count, prevCount) => {},
  {
immediate:true, //立即执行
  }
) 
```

- 侦听多个数据源

```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {})
```


---

> 对⽐ watchEffect 和 watch 
>
> 1. watch懒执⾏副作⽤
> 2. watch需明确哪些状态改变触发重新执⾏副作⽤
> 3. watch可访问侦听状态变化前后的值。

### **生命周期钩子**

1. ⽣命周期钩⼦可以通过 onXXX 形式导⼊并在setup内部注册，只能在setup()使用
   
```js
import { onMounted, onUpdated, onUnmounted } from 'vue'
const MyComponent = {
	setup() {
		onMounted(() => {
		console.log('mounted!')
	 })
	onUpdated(() => {
		console.log('updated!')
	 })
	onUnmounted(() => {
		console.log('unmounted!')
	 })
	},
}
```

2. 可以多次注册，按顺序执行
   
```js
setup() {
	onMounted(() => {
		console.log('mounted1')
	 })
	onMounted(() => {
		console.log('mounted2')
	 })
}
```

妙⽤：可以⽤在其他可复⽤的逻辑中

```js
function useCounter() {
const counter = ref(0)
let timer
onMounted(() => {
timer = setInterval(() => counter.value++, 1000)
 })
onUnmounted(() => {
clearInterval(timer)
 })
return counter
}
setup() {
const counter = useCounter()
return { counter }
}
```

> 与 2.x 版本⽣命周期相对应的组合式 API
> 
- beforeCreate -> 直接写到 setup()
- created -> 直接写到 setup()
- beforeMount -> onBeforeMount
- mounted -> onMounted
- beforeUpdate -> onBeforeUpdate
- updated -> onUpdated
- beforeDestroy -> onBeforeUnmount 变化
- destroyed -> onUnmounted 变化
- errorCaptured -> onErrorCaptured
- onRenderTracked 新增
- onRenderTriggered 新增

### 依赖注入

- 在setup中依赖注⼊使⽤ provide 和 inject

```js
import { provide, inject } from 'vue'
const Ancestor = {
	setup() {
		provide('colorTheme', 'dark')
	},
}
const Descendent = {
	setup() {
		const theme = inject('colorTheme',"white") //第二个值为默认值 
	return {
		theme,
	 }
 },
}
```

注⼊值的响应性

- 如果注⼊⼀个响应式对象，则它的状态变化也可以被侦听

```js
// 提供者响应式数据
const themeRef = ref('dark')
provide('colorTheme', themeRef)
// 使⽤者响应式数据
const theme = inject('colorTheme')
watchEffect(() => {
console.log(`theme set to: ${theme.value}`)
})
```

### refs

- 为了获得对模板内元素或组件实例的引⽤，我们可以像往常⼀样在 setup() 中声明⼀个 **同名**的ref 并返回它

```js
<template> 
	<div ref="root"></div>
</template> 
<script>
import { ref, onMounted } from 'vue'
export default {
	setup() {
		const root = ref(null)
		onMounted(() => {
			// 挂载后, dom会被赋值给root这个ref对象
			console.log(root.value) // <div/>
		 })
		return {
			root,
		 }
	 },
 }
</script>
```

## 可复用性

### 混入

- ⾮常灵活的⽅式，来分发 Vue 组件中的可复⽤功能
- 当组件使⽤混⼊对象时，所有混⼊对象的选项将被“混合”进⼊该组件本身的选项

```js
// 定义⼀个混⼊对象
const myMixin = {
	created() {
		console.log('hello from mixin!')
	},
}
const app = Vue.createApp({
	// 使⽤混⼊
	mixins: [myMixin],
	// 混⼊对象的选项会和组件本身的选项合并
	created() {
		console.log('hello from app!')
	 }
})
// 全局混⼊
app.mixin({
	beforeCreate() {
	}
})
app.mount('#demo') // 'hello from app!' 'hello from mixin!'
```

mixin是vue2就有的功能，存在**来源不明、命名冲突**等问题
vue3中使⽤composition-api复⽤逻辑是更好的解决⽅案

### 自定义指令

- 对普通 DOM 元素进⾏底层操作

```js
const app = Vue.createApp({})
// 全局注册指令 `v-focus`
app.directive('focus', {
	mounted(el) {
		el.focus()
	}
})
// 局部注册指令 `v-focus`
directives: {
	focus: {
		mounted(el) {
			el.focus()
		}
	}
}
```

- 指令钩⼦函数：钩⼦函数和vue2相较有⼀些变化，现在和组件钩⼦⼀致：
- beforeMount ：当指令第⼀次绑定到元素并且在挂载⽗组件之前调⽤，这⾥可以做⼀次性初始化设置。
- mounted ：在挂载绑定元素到⽗组件时调⽤。
- beforeUpdate ：在更新包含组件的 VNode 之前调⽤。
- updated ：在包含组件的 VNode 及其⼦组件的 **VNode** 更新后调⽤。
- beforeUnmount ：在卸载绑定元素的⽗组件之前调⽤
- unmounted ：当指令与元素解除绑定且⽗组件已卸载时，只调⽤⼀次。

### TelePort传送

- 有时组件模板的⼀部分在逻辑上属于该组件，⽽从技术⻆度来看，最好将模板的这⼀部分移动到 DOM中 Vue app 之外的其他位置
- ⽐如⼀个弹窗内容、消息通知等。

```js
//js
app.component('modal-button', {
	template: `
		<button @click="modalOpen = true">
			打开弹窗
		</button>
		<teleport to="body">
			<div v-if="modalOpen" class="modal">
				<div>
				<slot></slot>
				<button @click="modalOpen = false">关闭</button>
				</div>
			</div>
		</teleport>
	`,
	data() {
		return {
			modalOpen: false
		 }
	 }
)}

//html & css
<modal-button> 
	<template v-slot>
		弹窗内容。。。
	</template>
</model-button> 

<style>
	.modal {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .5);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	 }
	.modal div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: white;
		width: 300px;
		height: 300px;
		padding: 5px;
	 }
</style>
```

### 渲染函数

- 提供完全JS编程能⼒，可以解决更复杂的模板需求

```js
const app = Vue.createApp({})
app.component('x-heading', {
	render() {
		return Vue.h(
			'h' + this.level, // tag name
			 {}, // props/attributes
		this.$slots.default() // array of children
	 )
 },
props: {
	level: {
		type: Number,
		required: true
	 }
 }
})
```

渲染函数中⽤ if / else 和 map() 来替代 v-if 和 v-for

```js
props: ['items'],
render() {
	if (this.items.length) {
		return Vue.h('ul', this.items.map((item) => {
			return Vue.h('li', item.name)
		 }))
	 } else {
		return Vue.h('p', 'No items found.')
	 }
}
```

v-model 指令展开为 modelValue 和 onUpdate:modelValue ，要实现同等功能必须提供这些prop

```js
props: ['modelValue'],
	render() {
		return Vue.h(SomeComponent, {
		modelValue: this.modelValue,
		'onUpdate:modelValue': value => this.$emit('update:modelValue', value)
	})
}
```

事件处理需要提供⼀个正确的prop名称，例如，要处理 click 事件，prop名称应该是 onClick 

```js
render() {
	return Vue.h('div', {
		onClick: $event => console.log('clicked', $event.target)
	 })
}
```

对于 .passive 、 .capture 和 .once 事件修饰符，Vue提供了专属的对象语法

```js
render() {
	return Vue.h('input', {
		onClick: {
			handler: this.doThisOnceInCapturingMode,
			once: true,
			capture: true
		},
	})
}
```

> 对于所有其它的修饰符，需要在事件处理函数中⼿动使⽤事件⽅法
> 

通过 this.$slots 访问静态插槽的内容，每个插槽都是⼀个 VNode 数组

```js
render() {
	// `<div><slot></slot></div>`
	return Vue.h('div', {}, this.$slots.default())
}
```

如果要将插槽传递给⼦组件

```js
render() {
	// `<child v-slot="props"><span>{{ props.text }}</span></child>`
	return Vue.h('div', [
		Vue.h('child', {}, {
			// 传递⼀个对象作为children
			// 形如 { name: props => VNode | Array<VNode> }
			default: (props) => Vue.h('span', props.text)
		 })
	 ])
}
```

### 插件

- ⾃包含的代码，通常给 Vue 添加全局功能
- 可以是包含 install() ⽅法的 object ，也可以是 function

```js
export default {
	install: (app, options) => {
		// 插件接收应⽤实例和插件选项
	 }
}
```

- 常见任务

```js
export default {
	install: (app, options) => {
		//添加指令/组件/过渡等全局资源
		app.component('comp', {})
		//全局混⼊⼀些组件选项
		app.mixin({})
		//添加实例⽅法
		app.config.globalProperties.xx = xx
	 }
}
```

- 使用插件：实例挂载之前调⽤use()注册插件

```js
app.use(plugin)
```

- 范例：实现⼀个Message插件

```js
const MessagePlugin = function (app) {
const MyMessage = {
	props: {
		msg: {
			type: String,
			required: true
		},
		duration: {
			type: Number,
			default: 1000
		}
	},
	template: `
		<div class="message-box">
		<p>{{msg}}</p>
		</div>
	`,
	mounted() {
		setTimeout(() => {
			app.config.globalProperties.$message(null)
		 }, this.duration);
	},
}
const container = document.createElement('div')
document.body.appendChild(container)
app.config.globalProperties.$message = function (props) {
		if (props) {
			render(h(MyMessage, props), container)
		} else {
			render(null, container)
		}
  }
}
```
