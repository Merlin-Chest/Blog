
const readmeTemplate = (files: string[]) => {
  //  如果为空数组
  if (files.length <= 0) return '';

  // 如果是字符串数组
  if (typeof files[0] === 'string') {
    return `
## 该章节包含以下内容
  
  `+ files.map(item => `
- [${item.replace('.md', '')}](${item})

  `).join('');
  }

  // 如果是带children的对象数组
  return `
## 该章节包含以下内容
  
  `+ files.map((item: any) => {
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
  readmeTemplate
}