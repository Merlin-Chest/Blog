/*
 * @Author: Merlin218
 * @Date: 2022-02-07 10:50:15
 * @LastEditors: Merlin218
 * @LastEditTime: 2022-02-07 10:53:45
 * @Description: once函数
 */

/**
 * @description: 使传入的函数只执行一次，每次返回保留的结果
 * @param {Function} fn 函数
 * @return {*}
 */
function once(fn: Function) {
  let result;
  let cancelled = false;

  return (...args) => {
    if (cancelled) return result;
    result = fn(...args);
    cancelled = true;
    return result;
  }
}
