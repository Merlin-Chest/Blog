import { getNav } from './handleNav';
import { resolve } from 'path';
import { setOptions, defaultOptions } from './defaultConfig';
var AutoNavPlugin = function (options) {
    if (!options)
        options = defaultOptions;
    var assignOptions = Object.assign({}, defaultOptions, options);
    setOptions(assignOptions);
    var path = resolve(process.cwd(), 'docs');
    return getNav(path, options.ignoreFolders, options.subNavShow, 0);
};
export default AutoNavPlugin;
