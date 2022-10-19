# Reactivity模块

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202205082130574.png)

## 原理

- 利用ES6中Proxy作为拦截器，在get时收集依赖，在set时触发依赖，来实现响应式
- 依赖 => 副作用函数 => 用户的函数
- targetMap结构

```json
  targetMap:{
    [target:Map]:{
      [key: Set]:[]
    }
  }
```

## 相关函数实现

### ReactiveEffect类

```typescript
//响应式依赖 — 类
class ReactiveEffect {
  private _fn: any;

  constructor(fn) {
    this._fn = fn;
  }
  run() {
    //用户传进来的函数，可能出错
    try {
      activeEffect = this;
      return this._fn();
    } finally {
      //todo
    }
  }
}
```

### effect()：包装依赖函数

```typescript
let activeEffect: ReactiveEffect; //当前的依赖

export function effect(fn) {
  //为当前的依赖创建响应式实例
  const _effect = new ReactiveEffect(fn);
  //最开始调用一次
  _effect.run();

  return _effect.run.bind(_effect);
}
```

> bind：创建一个新函数，使新函数的this指向传入的第一个参数，其他参数作为新函数的参数

### track()：收集/添加依赖

```typescript
const targetMap = new WeakMap();
//把依赖添加到targetMap对应target的key中，在重新set时在trigger中重新触发
export function track(target: Object, key) {
  if (!activeEffect) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}
```

> *WeakMap和Map的区别*
>
> *1、WeakMap只接受对象作为key，如果设置其他类型的数据作为key，会报错。*
>
> *2、WeakMap的key所引用的对象都是弱引用，只要对象的其他引用被删除，垃圾回收机制就会释放该对象占用的内存，从而避免内存泄漏。*
>
> *3、由于WeakMap的成员随时可能被垃圾回收机制回收，成员的数量不稳定，所以没有size属性。*
>
> *4、没有clear()方法*
>
> *5、不能遍历*

### trigger()：触发依赖

```typescript
//一次性触发对应target中key的所有依赖
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let deps = depsMap.get(key);

  for (const effect of deps) {
    effect.run();
  }
}
```

## 边缘情况

1. reactive(reactive(obj))

   ```typescript
   export function isReactive(target) {
     return !!(target && target.__isReactive);
   }
   ```

2. let a = reactive(obj),b = reactive(obj)

3. hasChanged

4. 深层对象代理

5. 数组

6. 嵌套effect
