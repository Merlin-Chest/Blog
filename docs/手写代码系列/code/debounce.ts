/*
 * @Author: Merlin218
 * @Date: 2022-02-03 14:58:00
 * @LastEditors: Merlin218
 * @LastEditTime: 2022-02-03 15:16:28
 * @Description: 防抖节流
 */
/**
 * @description: 该函数会从上一次调用之后，延迟wait毫秒后执行fn方法,定时器存在时，会先清除定时器，重新执行定时器
 * @param {Function} fn 延迟执行的函数
 * @param {number} wait 延迟时间
 * @return {*}
 */
function debounce(fn: Function, wait: number) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, wait);
  }
}
