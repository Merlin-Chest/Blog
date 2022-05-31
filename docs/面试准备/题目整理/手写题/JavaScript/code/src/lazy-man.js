class _LazyMan {
  constructor(name) {
    this.tasks = [];
    this.name = name;
    this.timer = null;
    this.sayHi();
  }
  next() {
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      for (let i = 0; i < this.tasks.length; i++) {
        await this.tasks[i]();
      }
    })
    return this;
  }
  sayHi() {
    this.tasks.push(() => {
      console.log(`Hi, This is ${this.name}`);
    })
    return this.next();
  }
  eat(food) {
    this.tasks.push(() => {
      console.log(`Eat ${food}`);
    })
    return this.next();
  }
  beforeSleep(time) {
    this.tasks.unshift(() => this.sleepPromise(time));
  }
  sleep(time) {
    this.taskQueue.push(() => this.sleepPromise(time));
    return this.next();
  }
  sleepPromise(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`Sleep ${time}`);
        resolve();
      }, time * 1000);
    })
  }
}

function LazyMan(name){
  return new LazyMan(name)
}
