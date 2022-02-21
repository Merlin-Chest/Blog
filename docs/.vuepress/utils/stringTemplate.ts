
const readmeTemplate = (files: string[]) => {
  return `
---
navbar:false
---

## 该章节包含以下内容：
  
  `+ files.map(item => `
### [${item.replace('.md', '')}](${item})

  `).join('');
}

module.exports = {
  readmeTemplate
}