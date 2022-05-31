const v8 = require('v8-natives');
const { performance, PerformanceObserver } = require('perf_hooks')

function test(x) {
  return x + x;
}



const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries())
  observer.disconnect()
})

obs.observe({
  entryTypes: ['measure'],
  buffered: true
})

performance.mark('start')

let number = 100000000

// v8.neverOptimizeFunction(test);

while (number--) {
  test(1);
}
  
performance.mark('end');

performance.measure('test', 'start','end');