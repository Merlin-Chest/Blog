// a.js
define(function (require, exports, module) {
  console.log('a.js');
  exports.getHello = function () {
    return 'a';
  }
});