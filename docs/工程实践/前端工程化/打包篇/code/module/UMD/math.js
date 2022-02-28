(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["xxx"], factory);
  } else if (typeof exports === "object" && typeof module !== 'undefined') {
    // CommonJS
    module.exports = factory(require("xxx"));
  } else {
    // 全局变量
    global.math = factory(global["xxx"]);
  }
})(this, function () {
  return {
    add: (x, y) => {
      return x + y;
    }
  }
});