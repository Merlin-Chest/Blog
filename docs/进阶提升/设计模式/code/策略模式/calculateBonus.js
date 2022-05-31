const strategies = {
  S(salary) {
    return salary * 4;
  },
  A(salary) {
    return salary * 3;
  },
  B(salary) {
    return salary * 2;
  },
};

function calculateBonus(level, salary) {
  return strategies[level](salary);
}

console.log(calculateBonus('S', 10000)); // 40000
console.log(calculateBonus('A', 10000)); // 40000
console.log(calculateBonus('B', 10000)); // 40000
