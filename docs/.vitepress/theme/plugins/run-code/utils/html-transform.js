export function html_encode(str) {
  if (typeof str == 'string') {
    return str.replace(/<|&|>/g, function (matches) {
      return ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;'
      })[matches];
    });
  }

  return '';
}

export function html_decode(str) {
  if (typeof str == 'string') {
    return str.replace(/&lt;|&gt;|&amp;/g, function (matches) {
      return ({
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&'
      })[matches];
    });
  }

  return '';
}
