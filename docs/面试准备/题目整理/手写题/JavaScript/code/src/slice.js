/*
 * @Author: Merlin
 * @Date: 2022-04-06 17:12:35
 * @LastEditTime: 2022-04-06 17:19:16
 * @LastEditors: Merlin
 * @Description:
 */

export function slice(beginIndex, endIndex) {
  const str = this;
  // 处理beginIndex小于0的情况
  beginIndex = beginIndex < 0 ? str.length + beginIndex : beginIndex;
  // 处理endIndex没有传的情况
  endIndex =
    endIndex === undefined
      ? str.length
      : endIndex < 0
      ? str.length + endIndex
      : endIndex;
  
  if(beginIndex >= endIndex) return '';

  let res = '';

  for (let i = beginIndex; i < endIndex; i++) {
    res += str[i];    
  }
  return res;
}
