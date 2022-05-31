define(function (require, exports, module) {
  console.log('b.js');
  exports.getHello = function () {
    return 'b';
  }
});