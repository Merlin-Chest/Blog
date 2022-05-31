const each = function (arr, callback) {
  for (let i = 0; i < arr.length; i += 1) {
    callback.call(arr[i], i, arr[i]);
  }
};

each([1, 2, 3], (index, value) => {
  console.log(index, value);
});

const Iterator = function (arr) {
  let current = 0;
  const next = function () {
    current += 1;
  };
  const isDone = function () {
    return current >= arr.length;
  };
  const getCurrent = function () {
    return arr[current];
  };
  return {
    next, isDone, getCurrent,
  };
};

const compare = function (i1, i2) {
  while (!i1.isDone() && !i2.isDone()) {
    if (i1.getCurrent() !== i2.getCurrent()) {
      return false;
    }
    i1.next();
    i2.next();
  }
  return true;
};

const arr1 = new Iterator([1, 2, 3]);
const arr2 = new Iterator([1, 2, 3]);
console.log(compare(arr1, arr2));
