const strategies = {
  isNotEmpty: (value, errMsg) => {
    if (value == '') {
      return errMsg;
    }
  },
  minLength: (value, length, errMsg) => {
    if (value.length < length) {
      return errMsg;
    }
  },
  isMobile: (value, errMsg) => {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errMsg;
    }
  },
};
class Validator {
  cache = [];
  add(dom, rules) {
    let that = this
    for (let i = 0, rule; rule = rules[i++]){
      
    }
  }
}