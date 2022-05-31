/**
 * @description: 去除收尾空格
 * @return {string}
 */
export function trim() {
  const str = this;
  return str.replace(/^\s*|\s*$/g, '');
}
