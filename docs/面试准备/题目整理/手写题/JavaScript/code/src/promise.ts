// const PENDING: statusType = 'pending';
// const RESOLVED: statusType = 'fulfilled';
// const REJECTED: statusType = 'reject';

// type statusType = 'pending' | 'fulfilled' | 'reject'

// interface MyPromise<T> {
//   status: statusType; // 状态
//   value: T | null; // 结果或者错误
//   resolvedCallbacks: Function[]; // 成功回调队列
//   rejectedCallbacks: Function[]; // 失败回调队列
// }

// function MyPromise<T>(this: MyPromise<T>, fn: (resolve: Function, reject: Function) => void) {
//   // 初始化
//   const that = this;
//   that.status = PENDING;
//   that.value = null;
//   that.resolvedCallbacks = [];
//   that.rejectedCallbacks = [];

//   // 成功函数
//   function resolve(value: any) {
//     // 保证函数的执行顺序 ?? 因为事件循环中，宏任务是最后执行的吗
//     setTimeout(() => {
//       if (that.status === PENDING) {
//         that.status = RESOLVED;
//         that.value = value;
//         that.resolvedCallbacks.map((cb: Function) => cb(that.value))
//       }
//     }, 0)

//   }
//   // 失败函数
//   function reject(error: any) {
//     // 保证函数的执行顺序
//     setTimeout(() => {
//       if (that.status === PENDING) {
//         that.status = REJECTED;
//         that.value = error;
//         that.rejectedCallbacks.map((cb: Function) => cb(that.value))
//       }
//     }, 0)
//   }

//   try {
//     fn(resolve, reject);
//   } catch (err) {
//     reject(err)
//   }
// }

// // then方法
// MyPromise.prototype.then = function (this: MyPromise<T>, onFulfilled?: Function, onRejected?: Function) {
//   const that = this;
//   let promise2:MyPromise<any>;
//   // 避免onFulfilled或onRejected不是函数
//   onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value: any) => value;
//   onRejected = typeof onRejected === 'function' ? onRejected : (error: any) => { throw error };

//   // 处于pending
//   if (that.status === PENDING) {
//     return (promise2 = new MyPromise((resolve:Function, reject:Function) => {
//       that.resolvedCallbacks.push(() => {
//         try {
//           const value = onFulfilled();
//           resolutionProcedure(promise2,value,resolve,reject)
//         } catch (err) {
//           reject(err)
//         }
//       });
//       that.rejectedCallbacks.push(() => {
//         try {
//           const error = onRejected();
//           resolutionProcedure(promise2, error, resolve, reject)
//         } catch (err) {
//           reject(err)
//         }
//       });
//     }))
//   }
//   // 处于resolved
//   if (that.status === RESOLVED) {
//     onFulfilled(that.value)
//   }
//   // 处于rejected
//   if (that.status === REJECTED) {
//     onRejected(that.value)
//   }
// }

// function resolutionProcedure(promise2:MyPromise, x:any, resolve:Function, reject:Function){}
type statusType = 'pending' | 'fulfilled' | 'reject'

const PENDING: statusType = 'pending';
const FULFILLED: statusType = 'fulfilled';
const REJECTED: statusType = 'reject';

class MyPromise {
  private status: statusType; // Promise状态

  private value: any; // 异步调用成功的结果

  private reason: any; // 异步调用失败的原因

  private onFulfilledCallbacks: []; // 存储成功的回调，由于需要支持链式回调，所以需要设计为数组，下同

  private onRejectedCallbacks: []; // 存储失败的回调

  // 将现有对象转为Promise对象
  // 如果 Promise.resolve 方法的参数，不是具有 then 方法的对象（又称 thenable 对象），
  // 则返回一个新的 Promise 对象，且它的状态为fulfilled。
  static resolve: Function = (parameter: any) => {
    if (parameter instanceof MyPromise) {
      return parameter;
    }
    return new MyPromise((resolve: Function) => {
      resolve(parameter);
    });
  };

  // 返回一个新的Promise实例，该实例的状态为rejected。
  // Promise.reject方法的参数reason，会被传递给实例的回调函数。
  static reject: Function = (reason: any) => new MyPromise(
    (resolve: Function, reject: Function) => {
      reject(reason);
    },
  )

  static all(promiseList: MyPromise[]) {
    const resPromise = new MyPromise((resolve: Function, reject: Function) => {
      let count = 0;
      const result: any[] = [];
      const { length } = promiseList;

      if (length === 0) {
        return resolve(result);
      }

      promiseList.forEach((promise: MyPromise, index: number) => {
        MyPromise.resolve(promise).then((value: any) => {
          count += 1;
          result[index] = value;
          if (count === length) {
            resolve(result);
          }
        }, (reason: any) => {
          reject(reason);
        });
      });
    });
    return resPromise;
  }

  static race(promiseList: MyPromise[]) {
    const { length } = promiseList;
    if (length === 0) {
      MyPromise.resolve();
    }
    return new MyPromise((resolve: Function, reject: Function) => {
      for (let i = 0; i < length; i += 1) {
        MyPromise.resolve(promiseList[i]).then((value: any) => {
          resolve(value);
        }, (reason: any) => {
          reject(reason);
        });
      }
    });
  }

  static allSettled(promiseList: MyPromise[]) {
    return new MyPromise((resolve: Function) => {
      let count = 0;
      const result: any[] = [];
      const { length } = promiseList;

      if (length === 0) {
        return resolve(result);
      }

      promiseList.forEach((promise: MyPromise, index: number) => {
        MyPromise.resolve(promise).then((value: any) => {
          result[index] = {
            status: 'fulfilled',
            value,
          };
        }, (reason: any) => {
          result[index] = {
            status: 'fulfilled',
            reason,
          };
        }).finally(() => {
          count += 1;
          if (count === length) {
            return resolve(result);
          }
        });
      });
    });
  }

  static deferred() {
    const result: any = {};
    result.promise = new MyPromise((resolve: Function, reject: Function) => {
      result.resolve = resolve;
      result.reject = reject;
    });

    return result;
  }

  constructor(fn: Function) {
    this.status = PENDING; // 初始状态为pending
    this.value = null; // 初始化value
    this.reason = null; // 初始化reason
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // 存一下this,以便resolve和reject里面访问
    const that = this;
    function resolve(value: any) {
      setTimeout(() => {
        if (that.status === PENDING) {
          // 改变状态，拿到结果
          that.status = FULFILLED;
          that.value = value;

          // resolve里面将所有成功的回调拿出来执行
          that.onFulfilledCallbacks.forEach((callback: Function) => {
            callback(that.value);
          });
        }
      }, 0);
    }
    function reject(reason: any) {
      setTimeout(() => {
        if (that.status === PENDING) {
          that.status = REJECTED;
          that.reason = reason;

          that.onRejectedCallbacks.forEach((callback: Function) => {
            callback(that.reason);
          });
        }
      }, 0);
    }

    try {
      fn(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // then方法
  then(onFulfilled?: any, onRejected?: any) {
    // 如果onFulfilled不是函数，给一个默认函数，返回value
    let realOnFulfilled: any = onFulfilled;
    if (typeof realOnFulfilled !== 'function') {
      realOnFulfilled = function (value: any) {
        return value;
      };
    }

    // 如果onRejected不是函数，给一个默认函数，返回reason的Error
    let realOnRejected: any = onRejected;
    if (typeof realOnRejected !== 'function') {
      realOnRejected = function (reason: Error | string) {
        if (reason instanceof Error) {
          throw reason;
        } else {
          throw new Error(reason);
        }
      };
    }
    // 如果状态为成功，执行成功回调
    if (this.status === FULFILLED) {
      // 根据规范，需要返回一个新的Promise
      // 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 新promise 必须拒绝执行，并返回拒因 e。
      const promise2 = new MyPromise((resolve: Function, reject: Function) => {
        // onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用。
        // 这一条的意思是实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
        // 所以在我们执行onFulfilled 和 onRejected的时候都应该包到setTimeout里面去。
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(this.value);
            } else {
              // 处理realOnFulfilled返回值
              const value = realOnFulfilled(this.value);
              MyPromise.prototype.resolvePromise(
                promise2,
                value,
                resolve,
                reject,
              ); // 调用Promise 解决过程
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      return promise2;
    }
    // 如果状态为失败，执行失败回调
    if (this.status === REJECTED) {
      // 根据规范，需要返回一个新的Promise
      // 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 新promise 必须拒绝执行，并返回拒因 e。
      const promise2 = new MyPromise(
        (resolve: Function, reject: Function) => {
          setTimeout(() => {
            try {
              if (typeof onRejected !== 'function') {
                reject(this.reason);
              } else {
              // realOnRejected执行完成，新promise该被resolve
                realOnRejected(this.reason);
                resolve();
              }
            } catch (error) {
              reject(error);
            }
          }, 0);
        },
      );
      return promise2;
    }

    // 如果还是PENDING状态，将回调保存下来
    if (this.status === PENDING) {
      // 如果还是PENDING状态，也不能直接保存回调方法了，需要包一层来捕获错误
      const that = this;
      const promise2 = new MyPromise((resolve: Function, reject: Function) => {
        this.onFulfilledCallbacks.push(function () {
          setTimeout(() => {
            try {
              realOnFulfilled(that.value);
            } catch (error) {
              reject(error);
            }
          }, 0);
        } as never);
        this.onRejectedCallbacks.push(function () {
          setTimeout(() => {
            try {
              realOnRejected(that.reason);
            } catch (error) {
              reject(error);
            }
          }, 0);
        } as never);
      });
      return promise2;
    }
  }

  catch(onRejected: Function) {
    return this.then(null, onRejected);
  }

  finally(fn: Function) {
    return this.then((value: any) => MyPromise.resolve(fn()).then(
      () => value,
    ), (error: any) => MyPromise.resolve(fn()).then(() => {
      throw error;
    }));
  }

  private static resolvePromise(
    promise: MyPromise,
    x: any,
    resolve: Function,
    reject: Function,
  ) {
    // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
    // 这是为了防止死循环
    if (promise === x) {
      return reject(new TypeError('The promise and the return value are the same'));
    }

    if (x instanceof MyPromise) {
      // 如果 x 为 Promise ，则使 promise 接受 x 的状态
      // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
      // 这个if跟下面判断then然后拿到执行其实重复了，可有可无
      x.then((y: any) => {
        MyPromise.prototype.resolvePromise(promise, y, resolve, reject);
      }, reject);
    }
    // 如果 x 为对象或者函数
    else if (typeof x === 'object' || typeof x === 'function') {
      // 这个坑是跑测试的时候发现的，如果x是null，应该直接resolve
      if (x === null) {
        return resolve(x);
      }

      try {
        // 把 x.then 赋值给 then
        var { then } = x;
      } catch (error) {
        // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
        return reject(error);
      }

      // 如果 then 是函数
      if (typeof then === 'function') {
        let called = false;
        // 将 x 作为函数的作用域 this 调用之
        // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
        // 名字重名了，我直接用匿名函数了
        try {
          then.call(
            x,
            // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
            (y: any) => {
              // 如果 resolvePromise 和 rejectPromise 均被调用，
              // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
              // 实现这条需要前面加一个变量called
              if (called) return;
              called = true;
              MyPromise.prototype.resolvePromise(promise, y, resolve, reject);
            },
            // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
            (r: any) => {
              if (called) return;
              called = true;
              reject(r);
            },
          );
        } catch (error) {
          // 如果调用 then 方法抛出了异常 e：
          // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
          if (called) return;

          // 否则以 e 为据因拒绝 promise
          reject(error);
        }
      } else {
        // 如果 then 不是函数，以 x 为参数执行 promise
        resolve(x);
      }
    } else {
      // 如果 x 不为对象或者函数，以 x 为参数执行 promise
      resolve(x);
    }
  }
}

module.exports = MyPromise;
// 至此，我们的Promise就简单实现了，只是我们不是原生代码，不能做成微任务，如果一定要做成微任务的话，只能用其他微任务API模拟，比如MutationObserver或者process.nextTick。下面再回顾下几个要点:

// Promise其实是一个发布订阅模式
// then方法对于还在pending的任务，其实是将回调函数onFilfilled和onRejected塞入了两个数组
// Promise构造函数里面的resolve方法会将数组onFilfilledCallbacks里面的方法全部拿出来执行，这里面是之前then方法塞进去的成功回调
// 同理，Promise构造函数里面的reject方法会将数组onRejectedCallbacks里面的方法全部拿出来执行，这里面是之前then方法塞进去的失败回调
// then方法会返回一个新的Promise以便执行链式调用
// catch和finally这些实例方法都必须返回一个新的Promise实例以便实现链式调用
