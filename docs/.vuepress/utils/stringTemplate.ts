const commonTop = (config: { title: string }) => `---
sidebar: false
title: `+ config.title + `
---
## 该章节包含以下内容`

/**
 * @description: 
 * @param {string} files 文件列表
 * @param {string} title 生成页面标题
 * @return {*}
 */
const READMETemplate = (files: string[], title: string) => {
  //  如果为空数组
  if (files.length <= 0) return '';

  // 如果是字符串数组
  if (typeof files[0] === 'string') {
    return commonTop({ title }) + files.map(item => `
- [${item.replace('.md', '')}](${item})

  `).join('');
  }

  // 如果是带children的对象数组
  return commonTop({ title }) + files.map((item: any) => {
    // 获取该每个子目录的md文件
    let childrenTemplate = item.children.map(child => `
- [${child.replace('.md', '')}](${item.link + '/' + child})

  `).join('');
    return `
#### [${item.title}](${item.link})
    ` + childrenTemplate
  }).join('');
}

module.exports = {
  READMETemplate
}