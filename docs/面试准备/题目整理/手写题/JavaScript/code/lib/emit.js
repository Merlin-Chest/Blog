"use strict";
/*
 * @Author: Merlin
 * @Date: 2022-03-20 20:50:28
 * @LastEditTime: 2022-03-21 19:39:44
 * @LastEditors: Merlin
 * @Description: emitter
 */
class EventEmitter {
    constructor() {
        this.caches = {};
    }
    on(eventName, fn) {
        if (this.caches[eventName]) {
            this.caches[eventName].push(fn);
        }
        else {
            this.caches[eventName] = [fn];
        }
    }
    off(eventName, fn) {
        let taskes = this.caches[eventName];
        if (taskes) {
            const index = taskes.findIndex(f => f === fn);
            if (index >= 0) {
                taskes.splice(index, 1);
            }
        }
    }
    emit(eventName, once = false, ...args) {
        if (this.caches[eventName]) {
            // 创建副本，如果回调函数内继续注册相同事件，会造成死循环
            let tasks = this.caches[eventName].slice();
            for (const fn of tasks) {
                fn(...args);
            }
            if (once) {
                delete this.caches[eventName];
            }
        }
    }
}
let eventBus = new EventEmitter();
eventBus.on('aaa', (name, age) => {
    console.log(`name:${name},age:${age}`);
});
eventBus.emit('aaa', false, 'merlin', 22);
