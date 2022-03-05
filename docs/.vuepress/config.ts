const rootPath = require('path').dirname(__dirname);
const { getNavConfig } = require("./utils/handleNav");

// 需要排除的一些目录
const ignoreDirs = ["node_modules", "assets", "public", ".vuepress", "code", ".obsidian", "utils"];

// 显示子sub的内容
const showSubNavCtx = ['其他', '工具使用', 'Vue', '设计模式', '前端工程化']

module.exports = {
  // base: '/blog/',
  lang: 'zh-cn',
  // 在使用 vuepress-vite 包的时候，你可以忽略这个字段，因为 Vite 是默认打包工具
  bundler: '@vuepress/bundler-vite',
  // Vite 打包工具的配置项
  bundlerConfig: {
    // 查看下方
  },
  themeConfig: {
    logo: 'logo.jpg',
    navbar: getNavConfig(rootPath, ignoreDirs, showSubNavCtx), // 自动生成导航栏配置
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    displayAllHeaders: true,
    lastUpdated: '最后更新时间', // string | boolean
    smoothScroll: true, // 页面滚动效果
    repo: 'Merlin218',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    // 以下为可选的编辑链接选项

    // 假如你的文档仓库和项目本身不在一个仓库：
    // docsRepo: 'Merlin218/Merlin.github.io',
    // 假如文档不是放在仓库的根目录下：
    // docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'master',
    // 默认是 false, 设置为 true 来启用
    editLinks: false,
  },
};