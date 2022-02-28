// CommonJS
// const math = require('./CommonJS/math')
// console.log(math.add(1, 1))

// AMD
// require(['./AMD/math'], function (math) {
//   console.log(math.zero)
//   alert(math.add(1, 1));
// })

// CMD
// define(function (require, exports, module) {
//   var a = require('./CMD/a'); //在需要时申明
//   console.log(a.getHello());
//   var b = require('./CMD/b'); //在需要时申明
//   console.log(b.getHello());
// });

// ES Module
import { add } from './ESModule/math.js'
console.log(add(1, 1))