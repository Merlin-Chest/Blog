const FileHelper = require('./fileHelper')

/**
 * @description: 获取导航配置项
 * @param {string} path 目录路径
 * @param {string} unDirIncludes 排除文件
 * @param {string} prefix 父级前缀
 * @return {*} 返回nav配置
 */
const getNav = (path: string, unDirIncludes: string[] = [], showSubNavCtx: string[] = []) => {
  const allCurDirs = FileHelper.getAllCurDirs(path, unDirIncludes);
  return allCurDirs.map((dir: string) => {
    const text = dir.substring(dir.lastIndexOf('/') + 1);
    const link = dir.substring(dir.lastIndexOf('/')) + '/';
    return hasSubDirs(dir, unDirIncludes) ? {
      text,
      link,
      children: getSubNav(dir, unDirIncludes, link, showSubNavCtx)
    } : {
      text,
      children: getMdFiles(dir, link)
    }
  });
}

/**
 * @description: 获取二级目录配置
 * @param {string} path 目录路径
 * @param {string} unDirIncludes 排除文件
 * @param {string} prefix 父级前缀
 * @return {*} 返回二级nav配置
 */
const getSubNav = (path: string, unDirIncludes: string[] = [], prefix: string = '/', showSubNavCtx: string[] = []) => {
  // 获取全部子目录路径
  const allCurDirs = FileHelper.getAllCurDirs(path, unDirIncludes);
  return allCurDirs.map((dir: string) => {
    // 处理配置
    const text = dir.substring(dir.lastIndexOf('/') + 1)
    const link = prefix + text + '/'
    return {
      text,
      link,
      children: showSubNavCtx.includes(text) ? getMdFiles(dir, link) : []
    }
  });
}

/**
 * @description: 判断是否存在子目录
 * @param {string} path 目录路径
 * @param {string} unDirIncludes 排除文件
 * @return {*} 返回布尔值
 */
const hasSubDirs = (path: string, unDirIncludes: string[] = []) => {
  return FileHelper.getAllCurDirs(path, unDirIncludes).length !== 0
}

/**
 * @description: 获取子目录文件
 * @param {string} path 目录路径
 * @param {string} prefix 文件前缀
 * @return {array} 返回带前缀的文件名列表
 */
const getMdFiles = (path: string, prefix: string = '') => {
  const files = FileHelper.getAllFiles(path, ['md'])
  //自动在该目录下生成README文件
  FileHelper.createReadme(path);
  return files.map(item => prefix + item);
}

exports.getNavConfig = getNav