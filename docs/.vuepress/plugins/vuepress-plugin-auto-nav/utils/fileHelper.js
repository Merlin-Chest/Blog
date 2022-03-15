import path from 'path';
import { readdirSync, statSync, writeFileSync } from 'fs';
import Template from './stringTemplate';
var getAllFiles = function (dir, SuffixIncludes) {
    if (SuffixIncludes === void 0) { SuffixIncludes = []; }
    var filenameList = readdirSync(dir).filter(function (filename) {
        var fileInfo = statSync(path.join(dir, filename));
        var suffix = filename.slice(filename.lastIndexOf(".") + 1);
        return fileInfo.isFile() && SuffixIncludes.includes(suffix) && isNotReadme(filename);
    });
    filenameList.sort();
    return filenameList;
};
var isNotReadme = function (filename) { return filename.toLocaleLowerCase() !== "readme.md"; };
var getAllDirs = function (dir, unDirIncludes) {
    if (dir === void 0) { dir = "."; }
    var items = readdirSync(dir);
    var allDirs = [];
    items.forEach(function (item) {
        var dirName = path.join(dir, item);
        if (statSync(dirName).isDirectory() && !unDirIncludes.includes(item)) {
            allDirs.push(dirName);
            allDirs = allDirs.concat(getAllDirs(dirName, unDirIncludes));
        }
    });
    return allDirs;
};
var getAllCurDirs = function (dir, unDirIncludes) {
    if (dir === void 0) { dir = "."; }
    var items = readdirSync(dir);
    var allCurDirs = [];
    items.forEach(function (item) {
        var dirName = path.join(dir, item);
        if (statSync(dirName).isDirectory() && !unDirIncludes.includes(item)) {
            allCurDirs.push(dirName);
        }
    });
    return allCurDirs;
};
var createREADME = function (dir, unDirIncludes) {
    if (unDirIncludes === void 0) { unDirIncludes = []; }
    var configs = {
        files: getAllFiles(dir, ['md']),
        folders: getAllCurDirs(dir, unDirIncludes).map(function (item) {
            return {
                title: item.substring(item.lastIndexOf('/') + 1),
                link: item.replace(dir, '.'),
                items: getAllFiles(item, ['md']) || []
            };
        })
    };
    var content = Template.READMETemplate(configs, dir.substring(dir.lastIndexOf('/') + 1));
    var file = path.join(dir, './README.md');
    writeFileSync(file, content);
};
var hasSubDirs = function (path, unDirIncludes) {
    if (unDirIncludes === void 0) { unDirIncludes = []; }
    return getAllCurDirs(path, unDirIncludes).length > 0;
};
var getMdFiles = function (path, prefix) {
    if (prefix === void 0) { prefix = ''; }
    var files = getAllFiles(path, ['md']);
    createREADME(path);
    return files.map(function (item) { return prefix + item; });
};
export default {
    getAllFiles: getAllFiles,
    getAllDirs: getAllDirs,
    getAllCurDirs: getAllCurDirs,
    createREADME: createREADME,
    hasSubDirs: hasSubDirs,
    getMdFiles: getMdFiles
};
