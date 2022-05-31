// 原型链继承
function Animal(){
  this.colors = ['black','white'];
}

Animal.prototype.getColors = function(){
  return this.colors;
}

function Dog(){}

Dog.prototype = new Animal();

let dog = new Dog();
dog.colors.push('red');
console.log(dog.getColors());

// 借助构造函数继承
function Animal(name){
  this.name = name;
  this.getName = function(){
    return this.name;
  }
}

function Dog(name,age){
  Animal.call(this, name);
  this.age = age;
}

Dog.prototype = new Animal();

// 
