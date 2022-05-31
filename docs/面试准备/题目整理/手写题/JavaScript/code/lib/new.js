"use strict";
// new
function myNew(fn, ...args) {
    let obj = {};
    obj = Object.create(fn.prototype);
    let result = fn.call(obj, ...args);
    return typeof result === 'object' || result instanceof Function ? result : obj;
}
function foo(name, age) {
    this.name = name;
    this.age = age;
}
foo.prototype.print = function () {
    console.log(this.name, this.age);
};
let newFoo = myNew(foo, 'merlin', 22);
newFoo.print();
