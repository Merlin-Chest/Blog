import MyPromise from '../lib/bundle.esm';
import { describe, test, expect } from 'vitest'
describe('MyPromise', () => {
  test('base', () => {
    const p1 = new MyPromise((resolve, reject) => {
      resolve(1);
    });

    return p1.then((res) => {
      expect(res).toBe(1);
    });
  });
  test('resolve reject', () => {
    expect(MyPromise.resolve(1) instanceof MyPromise).toBe(true);
    expect(MyPromise.reject(1) instanceof MyPromise).toBe(true);
  });
  test('race', async () => {
    const p1 = new MyPromise((resolve, reject) => {
      setTimeout(resolve, 500, 'one');
    });
    const p2 = new MyPromise((resolve, reject) => {
      setTimeout(resolve, 100, 'two');
    });
    const p3 = new MyPromise((resolve, reject) => {
      setTimeout(resolve, 300, 'three');
    });
    Promise;
    const value = await MyPromise.race([p1, p2]);
    expect(value).toBe('two');
  });
  test('all', async () => {
    const p1 = new MyPromise((resolve, reject) => {
      resolve(1);
    });
    const p2 = new MyPromise((resolve, reject) => {
      resolve(2);
    });
    const p3 = new MyPromise((resolve, reject) => {
      resolve(3);
    });
    const value = await MyPromise.all([p1, p2, p3]);
    expect(value[0]).toBe(1);
    expect(value[1]).toBe(2);
    expect(value[2]).toBe(3);
  });
});
