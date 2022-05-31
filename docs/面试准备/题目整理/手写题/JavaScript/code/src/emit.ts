class EventEmitter{
  private caches: {
    [eventName:string]: Array<Function>;
  };
  constructor(){
    this.caches = {}
  }
  on(eventName:string, fn:Function){
    if(this.caches[eventName]){
      this.caches[eventName].push(fn);
    }else{
      this.caches[eventName] = [fn];
    }
  }
  off(eventName:string, fn:Function){
    let taskes = this.caches[eventName];
    if(taskes){
      const index = taskes.findIndex(f => f === fn)
      if(index >= 0){
        taskes.splice(index,1);
      }
    }
  }
  emit(eventName:string,once= false,...args:any[]){
    if(this.caches[eventName]){
      // 创建副本，如果回调函数内继续注册相同事件，会造成死循环(使用for..of的情况下，可以改用forEach则不会出现此问题)
      let tasks = this.caches[eventName].slice();
      for(const fn of tasks){
        fn(...args);
      }
      if(once){
        delete this.caches[eventName];
      }
    }
  }
}

let eventBus = new EventEmitter();

eventBus.on('aaa',(name:string,age:number)=>{
  console.log(`name:${name},age:${age}`)
})

eventBus.emit('aaa',false,'merlin',22)
