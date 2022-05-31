// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function MyPromise(fn) {
  this.status = PENDING; // 初始状态为pending
  this.value = null; // 初始化value
  this.reason = null; // 初始化reason

  // 构造函数里面添加两个数组存储成功和失败的回调
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  // 存一下this,以便resolve和reject里面访问
  const that = this;
  // resolve方法参数是value
  function resolve(value) {
    if (that.status === PENDING) {
      that.status = FULFILLED;
      that.value = value;

      // resolve里面将所有成功的回调拿出来执行
      that.onFulfilledCallbacks.forEach((callback) => {
        callback(that.value);
      });
    }
  }

  // reject方法参数是reason
  function reject(reason) {
    if (that.status === PENDING) {
      that.status = REJECTED;
      that.reason = reason;

      // resolve里面将所有失败的回调拿出来执行
      that.onRejectedCallbacks.forEach((callback) => {
        callback(that.reason);
      });
    }
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

function resolvePromise(promise, x, resolve, reject) {
  // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  // 这是为了防止死循环
  if (promise === x) {
    return reject(new TypeError('The promise and the return value are the same'));
  }

  if (x instanceof MyPromise) {
    // 如果 x 为 Promise ，则使 promise 接受 x 的状态
    // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
    // 这个if跟下面判断then然后拿到执行其实重复了，可有可无
    x.then((y) => {
      resolvePromise(promise, y, resolve, reject);
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
      const { then } = x;
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
          (y) => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          (r) => {
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

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 如果onFulfilled不是函数，给一个默认函数，返回value
  // 后面返回新promise的时候也做了onFulfilled的参数检查，这里可以删除，暂时保留是为了跟规范一一对应，看得更直观
  let realOnFulfilled = onFulfilled;
  if (typeof realOnFulfilled !== 'function') {
    realOnFulfilled = function (value) {
      return value;
    };
  }

  // 如果onRejected不是函数，给一个默认函数，返回reason的Error
  // 后面返回新promise的时候也做了onRejected的参数检查，这里可以删除，暂时保留是为了跟规范一一对应，看得更直观
  let realOnRejected = onRejected;
  if (typeof realOnRejected !== 'function') {
    realOnRejected = function (reason) {
      throw reason;
    };
  }

  const that = this; // 保存一下this

  if (this.status === FULFILLED) {
    const promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onFulfilled !== 'function') {
            resolve(that.value);
          } else {
            const x = realOnFulfilled(that.value);
            resolvePromise(promise2, x, resolve, reject);
          }
        } catch (error) {
          reject(error);
        }
      }, 0);
    });

    return promise2;
  }

  if (this.status === REJECTED) {
    const promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onRejected !== 'function') {
            reject(that.reason);
          } else {
            const x = realOnRejected(that.reason);
            resolvePromise(promise2, x, resolve, reject);
          }
        } catch (error) {
          reject(error);
        }
      }, 0);
    });

    return promise2;
  }

  // 如果还是PENDING状态，将回调保存下来
  if (this.status === PENDING) {
    const promise2 = new MyPromise((resolve, reject) => {
      that.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(that.value);
            } else {
              const x = realOnFulfilled(that.value);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      that.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          try {
            if (typeof onRejected !== 'function') {
              reject(that.reason);
            } else {
              const x = realOnRejected(that.reason);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    });

    return promise2;
  }
};

MyPromise.deferred = function () {
  const result = {};
  result.promise = new MyPromise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

MyPromise.resolve = function (parameter) {
  if (parameter instanceof MyPromise) {
    return parameter;
  }

  return new MyPromise((resolve) => {
    resolve(parameter);
  });
};

MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
};

MyPromise.all = function (promiseList) {
  const resPromise = new MyPromise((resolve, reject) => {
    let count = 0;
    const result = [];
    const { length } = promiseList;

    if (length === 0) {
      return resolve(result);
    }

    promiseList.forEach((promise, index) => {
      MyPromise.resolve(promise).then((value) => {
        count++;
        result[index] = value;
        if (count === length) {
          resolve(result);
        }
      }, (reason) => {
        reject(reason);
      });
    });
  });

  return resPromise;
};

MyPromise.race = function (promiseList) {
  const resPromise = new MyPromise((resolve, reject) => {
    const { length } = promiseList;

    if (length === 0) {
      return resolve();
    }
    for (let i = 0; i < length; i++) {
      MyPromise.resolve(promiseList[i]).then((value) => resolve(value), (reason) => reject(reason));
    }
  });

  return resPromise;
};

MyPromise.prototype.catch = function (onRejected) {
  this.then(null, onRejected);
};

MyPromise.prototype.finally = function (fn) {
  return this.then((value) => MyPromise.resolve(fn()).then(() => value), (error) => MyPromise.resolve(fn()).then(() => {
    throw error;
  }));
};

MyPromise.allSettled = function (promiseList) {
  return new MyPromise((resolve) => {
    const { length } = promiseList;
    const result = [];
    let count = 0;

    if (length === 0) {
      return resolve(result);
    }
    for (let i = 0; i < length; i++) {
      (function (i) {
        const currentPromise = MyPromise.resolve(promiseList[i]);

        currentPromise.then((value) => {
          count++;
          result[i] = {
            status: 'fulfilled',
            value,
          };
          if (count === length) {
            return resolve(result);
          }
        }, (reason) => {
          count++;
          result[i] = {
            status: 'rejected',
            reason,
          };
          if (count === length) {
            return resolve(result);
          }
        });
      }(i));
    }
  });
};

module.exports = MyPromise;
