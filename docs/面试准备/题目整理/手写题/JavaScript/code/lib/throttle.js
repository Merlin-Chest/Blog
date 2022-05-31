"use strict";
/*
 * @Author: Merlin218
 * @Date: 2022-02-03 15:34:32
 * @LastEditors: Merlin218
 * @LastEditTime: 2022-02-03 15:38:55
 * @Description: 节流函数
 */
/**
 * @description: 控制fn方法执行的频率，wait时间内发生一次
 * @param {Function} fn 用户函数
 * @param {number} wait 间隔时间(ms)
 * @return {*}
 */
function throttle(fn, wait) {
    let timer;
    return (...args) => {
        // 当timer存在时，直接跳过不执行
        if (!timer) {
            timer = setTimeout(() => {
                fn(...args);
                // 函数执行后，计时清除计时器，在下次调用时可以重新设定
                timer = null;
            }, wait);
        }
    };
}
