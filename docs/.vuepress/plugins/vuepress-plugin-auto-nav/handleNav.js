import FileHelper from './utils/fileHelper';
import { getOptions } from './defaultConfig';
var getNav = function (path, unDirIncludes, showSubNavCtx, depth, prefix) {
    if (unDirIncludes === void 0) { unDirIncludes = []; }
    if (showSubNavCtx === void 0) { showSubNavCtx = []; }
    if (prefix === void 0) { prefix = '/'; }
    var options = getOptions();
    if (depth >= options.deep)
        return [];
    var arr = [];
    FileHelper.getAllCurDirs(path, unDirIncludes).forEach(function (dir) {
        var text = dir.substring(dir.lastIndexOf('/') + 1);
        var link = prefix + text + '/';
        FileHelper.createREADME(dir);
        if (FileHelper.hasSubDirs(dir, unDirIncludes)) {
            arr.push({
                text: text,
                link: link,
                items: getNav(dir, unDirIncludes, showSubNavCtx, depth + 1, link)
            });
        }
        else {
            arr.push({
                text: text,
                link: link
            });
        }
    });
    return arr;
};
export { getNav };
