const path = require("path");
const fs = require("fs");
const Template = require('./stringTemplate')

/**
 *
 * @param {String} dir 目录路径
 * @param {Array} SuffixIncludes 需要处理的文件后缀
 * @returns
 */
const getAllFiles = (dir: string, SuffixIncludes: string[] = []) => {
  // readdirSync 仅返回当前这层的数据
  let filenameList = fs.readdirSync(dir).filter((filename: string) => {
    // statSync() 用来获取文件信息 stat => status
    let fileInfo = fs.statSync(path.join(dir, filename));
    //获取后缀
    const suffix = filename.slice(filename.lastIndexOf(".") + 1);
    return fileInfo.isFile() && SuffixIncludes.includes(suffix) && isNotReadme(filename)
  });
  //  排序
  filenameList.sort();
  return filenameList;
};

/**
 * @description: 判断是否是README文件
 * @param {string} filename
 * @return {*}
 */
const isNotReadme = (filename: string) => filename.toLocaleLowerCase() !== "readme.md"

/**
 *
 * @param {String} dir 当前的目录路径
 * @param {Array} unDirIncludes 需要排除的某些目录(文件夹)
 * @returns {Array} allDirs 所有的目录
 */
const getAllDirs = (dir: string = ".", unDirIncludes: string[] = []) => {
  // 获取目录数据
  const items = fs.readdirSync(dir);
  let allDirs = [];
  // 递归遍历目录中所有文件夹
  items.forEach((item: string) => {
    let dirName = path.join(dir, item);
    if (fs.statSync(dirName).isDirectory() && !unDirIncludes.includes(item)) {
      allDirs.push(dirName);
      allDirs = allDirs.concat(getAllDirs(dirName, unDirIncludes));
    }
  });
  return allDirs;
};

/**
 *
 * @param {String} dir 当前的目录路径
 * @param {Array} unDirIncludes 需要排除的某些目录(文件夹)
 * @returns {Array} allCurDirs 当前这层所有的目录
 */
const getAllCurDirs = (dir: string = ".", unDirIncludes: string[] = []): string[] => {
  // 获取目录数据
  const items = fs.readdirSync(dir);
  let allCurDirs = [];
  // 递归遍历目录中所有文件夹
  items.forEach((item) => {
    let dirName = path.join(dir, item);
    if (fs.statSync(dirName).isDirectory() && !unDirIncludes.includes(item)) {
      allCurDirs.push(dirName);
    }
  });
  return allCurDirs;
};

/**
 * @description: 生成目录README.md
 * @param {string} dir 文件目录
 * @return {*}
 */
const createReadme = (dir: string, unDirIncludes: string[] = []) => {
  // 获取md文件列表
  let files = getAllFiles(dir, ['md'])
  if (files.length <= 0) {
    files = getAllCurDirs(dir, unDirIncludes).map(item => {
      return {
        title: item.substring(item.lastIndexOf('/') + 1),
        link: item.replace(dir,'.'),
        children: getAllFiles(item, ['md']) || []
      }
    })
  }
  // 生成文件内容
  const content = Template.readmeTemplate(files);
  // 文件路径
  const file = path.join(dir, './README.md')
  // 写入文件
  fs.writeFileSync(file, content)
}

module.exports = {
  getAllFiles, getAllDirs, getAllCurDirs, createReadme
}
