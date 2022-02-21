// 单例实现
// 命名空间
let MyApp = {
  event: {},
  dom: {
    style: {},
  },
};

// 使用闭包
let MyApp = (function () {
  let _event = {};
  let _dom = {
    style: {},
  };
  return {
    getDOM: () => {
      return _dom;
    },
    getEvent: (eventName) => {
      return _event[eventName];
    },
  };
})();

// 惰性单例
const getSingle = (fn) => {
  let instance;
  // 注意此处返回函数而不是直接返回实例
  return function () {
    return instance || (instance = fn.apply(this, arguments));
  };
};

let createApp = function () {
  let _event = {};
  let _dom = {
    style: {},
  };
  return {
    getDOM: () => {
      return _dom;
    },
    getEvent: (eventName) => {
      return _event[eventName];
    },
  };
};

const createSingleApp = getSingle(createApp);

let app1 = createSingleApp();
let app2 = createSingleApp();

console.log(app1 === app2);
