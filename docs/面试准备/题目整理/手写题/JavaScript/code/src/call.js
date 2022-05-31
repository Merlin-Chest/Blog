// call
Function.prototype.myCall = function(target,...args){
  // this指向调用myCall函数的对象
  if(typeof this !== 'function'){
    throw new TypeError('not a function');
  }
  target == target || window;
  target.fn = this;
  return target.fn(...args);
}

Function.prototype.myApply = function(target,args){
  // this指向调用myCall函数的对象
  if(typeof this !== 'function'){
    throw new TypeError('not a function');
  }
  if(!Array.isArray(args)){
    
    throw new Error('arg not a array')
  }
  target == target || window;
  target.fn = this;
  return target.fn(args);
}

Function.prototype.myBind = function(thisArg,...args){
  if (typeof this !== 'function') {
    throw TypeError("Bind must be called on a function");
  }
  self = this;
  // 构建一个干净的函数，用于保存原函数的原型
  const nop = function(){};
  // 绑定的函数
  const bound = function(){
    // this instanceof nop, 判断是否使用 new 来调用 bound
    // 如果是 new 来调用的话，this的指向就是其实例，
    // 如果不是 new 调用的话，就改变 this 指向到指定的对象 o
    return self.apply(
      this instanceof nop ? this : thisArg,
      args.concat(Array.prototype.slice.call(arguments))
    )
  }
  // 箭头函数没有prototype，箭头函数this永远执行它所在的作用域
  if(this.prototype){
    nop.prototype = this.prototype;
  }
  bound.prototype = new nop();
  return bound;
}
