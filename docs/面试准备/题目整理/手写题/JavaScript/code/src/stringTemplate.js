/*
 * @Author: Merlin
 * @Date: 2022-04-06 17:29:20
 * @LastEditTime: 2022-04-07 16:22:10
 * @LastEditors: Merlin
 * @Description: 模板字符串
 */

export function stringTemplate(str, data) {
  const reg = /\$\{(\w+)\}/

  if(reg.test(str)){
    // 匹配到了
    // 获取到括号中的内容
    const key = str.match(reg)[1]
    // 获取真实的值
    const value = data[key]
    // 替换更新字符串
    str = str.replace(reg, value)
    // 递归，匹配下一个变量
    return stringTemplate(str, data)
  }
  // 匹配不到则直接返回
  return str;
}
