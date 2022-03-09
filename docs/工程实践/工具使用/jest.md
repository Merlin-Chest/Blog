# Jest

### 安装

```bash
npm i jest -D
yarn add jest -D
```

### 配置ESM

场景一：项目使用打包工具支持esm，写测试时使用esm语法报错

```javascript
//babel.config.js
module.exports = {
  //把当前代码基于你当前的node版本进行编译
  presets:[["@babel/preset-env",{targets:{node:"current"}}]]
}
```

```bash
// 安装依赖
yarn add --dev babel-jest @babel/core @babel/prest-env
```

 场景二：使nodejs支持esm，同时让jest知道要用esm的形式运行

```json
{
  "name": "support-esm",
  "version": "1.0.0",
  "description": "探索 jest 是否支持 nodejs 的 esm 规范",
  "main": "index.js",
  "type": "module",// 使nodejs支持esm
  "scripts": {
    "test": "NODE_OPTIONS=--experimental-vm-modules jest" // 添加参数，让jest知道要用esm的形式运行
  },
 }
```

### 编写一个vue组件测试

测试组件，明确：输入和输出。

```javascript
//Greeting.spec.js
import Greeting from "xxx"
describe("Greeting.vue",()=>{
  const wrapper = mount(Greeting);
  //验证 断言
  //Vue and TDD
  expect(wrapper.text()).toMatch("Vue adn TDD");
})
```

>  先写测试，再写逻辑

### 渲染组件

- mount(组件，{props:{},slots:{}, ... })
  - 真实挂载，会渲染出组件中子组件的内容
- shallowMount()
  - 存根的技术，将子组件用排除不稳定因素

### 条件渲染

- get()：获取，选择器，获取某个元素，返回元素
- find()：查找，返回boolean
- exists()：是否存在——v-if
- isVisible()：是否显示——v-show
- toBe()：是否是某个值
- toContain()：是否包含某个值
- toEqual()：是否等于某个值

```vue
<template>
  <nav>
    <a id="profile" href="/profile">My Profile</a>
    <a v-if="admin" id="admin" href="/admin">My Profile</a>
    <a v-show="shouldShowDropdown" id="user-dropdown">My Profile</a>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      admin: false,
      shouldShowDropdown: false,
    };
  },
};
</script>

```

```javascript
import { mount } from "@vue/test-utils";
import Foo from "../../src/components/Foo.vue";

describe("Foo", () => {
  const wrapper = mount(Foo);

  it("获取 a", () => {
    const profile = wrapper.get("#profile");
    expect(profile.text()).toMatch("My Profile");
  });
  it("检测一个元素是否存在", () => {
    const admin = wrapper.find("#admin");
    expect(admin.exists()).toBe(false);
  });

  it("存在", () => {
    const wrapper = mount(Foo, {
      data() {
        return {
          admin: true,
        };
      },
    });
    const admin = wrapper.find("#admin");
    expect(admin.exists()).toBe(true);
  });
  it("是不是存在", () => {
    const admin = wrapper.find("#user-dropdown");
    expect(admin.isVisible()).toBe(false);
  });
});

```

### emit 事件

- trigger()：触发事件
- emitted()：派发事件
- toHaveProperty()：是否包含某属性
- toBeTruthy()：真实的，有值的

```vue
<template>
  <button @click="handleClick">Increment</button>
</template>

<script>
export default {
  setup(props, { emit }) {
    let count = 1;
    const handleClick = () => {
      emit("increment", {
        count: count,
        success: count % 2 === 0,
      });
      count++;
    };
    return {
      handleClick,
    };
  },
};
</script>

```

```javascript
import { mount } from "@vue/test-utils";
import Counter from "../../src/components/Counter.vue";

describe("Counter", () => {
  it("emit event", () => {
    const wrapper = mount(Counter);

    wrapper.get("button").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("increment");
    expect(wrapper.emitted("increment")).toBeTruthy();
  });

  // it("emit value", () => {
  //   const wrapper = mount(Counter);

  //   wrapper.get("button").trigger("click");
  //   wrapper.get("button").trigger("click");
  //   expect(wrapper.emitted("increment")[0]).toEqual([1]);
  //   expect(wrapper.emitted("increment")[1]).toEqual([2]);
  // });

  it("emit value object", () => {
    const wrapper = mount(Counter);

    wrapper.get("button").trigger("click");
    wrapper.get("button").trigger("click");
    expect(wrapper.emitted("increment")[0]).toEqual([
      {
        count: 1,
        success: false,
      },
    ]);
    expect(wrapper.emitted("increment")[1]).toEqual([
      {
        count: 2,
        success: true,
      },
    ]);
  });
});

```

### 设置组件的props

- setValue()：设置元素值
- setProps()：设置元素属性值

```vue
<template>
  <div>
    <input v-model="password" />
    <div v-if="error" data-test="error">{{ error }}</div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
export default {
  props: {
    minLength: {
      type: Number,
    },
  },
  setup(props) {
    const password = ref("password");
    const error = computed(() => {
      if (password.value.length < props.minLength) {
        return `Password must be least ${props.minLength} characters.`;
      }
      return "";
    });

    return {
      password,
      error,
    };
  },
};
</script>
```

```javascript
import { mount } from "@vue/test-utils";
import Password from "../../src/components/Password.vue";

describe("Password", () => {
  it("init", async () => {
    const wrapper = mount(Password, {
      props: {
        minLength: 10,
      },
    });

    await wrapper.get("input").setValue("hahaha");

    expect(wrapper.text()).toContain("Password must be least 10 characters.");
    expect(wrapper.find("[data-test='error']").exists()).toBe(true);

    await wrapper.setProps({
      minLength: 5,
    });
    expect(wrapper.find("[data-test='error']").exists()).toBe(false);
  });
});

```

### slot插槽

- 六种场景
  - 默认插槽
  - 多个插槽
  - 具名插槽
  - 接收一个组件
  - 接收一个对象
  - 接受一个h函数渲染的虚拟节点

```vue
<template>
  <div>
    <slot></slot>
    <header>
      <slot :msg="msg" name="header" />
    </header>
    <main>
      <slot name="main" />
    </main>
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>

<script>
export default {
  setup() {
    return {
      msg: "message",
    };
  },
};
</script>
```

```javascript
import Layout from "../../src/components/Layout.vue";
import Foo from "../../src/components/Foo.vue";
import { mount } from "@vue/test-utils";
import { h } from "@vue/runtime-core";

describe("Layout", () => {
  it("default", () => {
    const wrapper = mount(Layout, {
      slots: {
        default: "div",
      },
    });
    expect(wrapper.text()).toContain("div");
  });
  it("多个", () => {
    const wrapper = mount(Layout, {
      slots: {
        default: "div",
        header: "<div>header</div>",
      },
    });
    expect(wrapper.get("header").text()).toContain("header");
  });
  it("具名插槽", () => {
    const wrapper = mount(Layout, {
      slots: {
        header: `
        <template #header="data">
          hello {{data.msg}}
        </template>
        `,
      },
    });
    expect(wrapper.find("header").text()).toContain("hello message");
  });
  it("高级用法", () => {
    const wrapper = mount(Layout, {
      slots: {
        // default: "div",
        // default: Foo,
        // default: {
        //   template: `<div id="hello">hello</div>`,
        // },
        default: h("div", "ok"),
      },
    });
    expect(wrapper.text()).toContain("ok");
  });
});

```

