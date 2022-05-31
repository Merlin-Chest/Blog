/* eslint-disable no-unused-vars */
// 单例实现
// 命名空间
const MyApp = {
  event: {},
  dom: {
    style: {},
  },
};

// 使用闭包
const MyApp1 = (function () {
  const event = {};
  const dom = {
    style: {},
  };
  return {
    getDOM: () => dom,
    getEvent: (eventName) => event[eventName],
  };
}());

// 惰性单例
const getSingle = (fn) => {
  let instance;
  // 注意此处返回函数而不是直接返回实例
  return function (...args) {
    if (!instance) {
      instance = fn.apply(this, args);
    }
    return instance;
  };
};

const createApp = function () {
  const event = {};
  const dom = {
    style: {},
  };
  return {
    getDOM: () => dom,
    getEvent: (eventName) => event[eventName],
  };
};

const createSingleApp = getSingle(createApp);

const app1 = createSingleApp();
const app2 = createSingleApp();

console.log(app1 === app2);
