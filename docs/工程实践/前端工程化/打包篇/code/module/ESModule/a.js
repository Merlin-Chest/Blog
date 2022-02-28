import { foo } from './b.js';
console.log('a.js，b的foo:',foo);
export const bar = 1;
export const bar2 = () => {
  console.log('bar2');
}
export function bar3() {
  console.log('bar3');
}