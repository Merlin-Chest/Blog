window.miniConsole = {
  log(...args) {
    console.log(Array.prototype.join.call(args));
  },
};
