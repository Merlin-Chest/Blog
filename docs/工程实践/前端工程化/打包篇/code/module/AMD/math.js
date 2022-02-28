// 定义math.js模块，依赖zero模块
define(['./zero'], function (zero) {
  var add = function (x, y) {
    return x + y;
  };
  return {
    add: add,
    zero: zero
  };
});
