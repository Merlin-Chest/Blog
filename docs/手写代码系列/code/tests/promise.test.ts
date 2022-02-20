import MyPromise from "../lib/bundle.esm";

describe('MyPromise', () => {
  test('base', () => {
    let p1 = new MyPromise((resolve: Function, reject: Function) => {
      resolve(1)
    })

    return p1.then((res: any) => {
      expect(res).toBe(1)
    })
  });
  test('resolve reject', () => {
    expect(MyPromise.resolve(1) instanceof MyPromise).toBe(true)
    expect(MyPromise.reject(1) instanceof MyPromise).toBe(true)
  });
  test('race', async () => {
    let p1 = new MyPromise((resolve: Function, reject: Function) => {
      resolve(1)
    })
    let p2 = new MyPromise((resolve: Function, reject: Function) => {
      resolve(2)
    })
    let p3 = new MyPromise((resolve: Function, reject: Function) => {
      resolve(3)
    })
    let value = await MyPromise.race([p1, p2, p3]);
    console.log(value)
  })
  test('all', async () => {
    let p1 = new MyPromise((resolve: Function, reject: Function) => {
      resolve(1)
    })
    let p2 = new MyPromise((resolve: Function, reject: Function) => {
      resolve(2)
    })
    let p3 = new MyPromise((resolve: Function, reject: Function) => {
      resolve(3)
    })
    let value = await MyPromise.all([p1, p2, p3])
    expect(value[0]).toBe(1)
    expect(value[1]).toBe(2)
    expect(value[2]).toBe(3)
  });
})