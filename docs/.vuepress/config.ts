import { defineConfig,DefaultThemeConfig } from '@vuepress/types';
import AutoNavPlugin from 'vuepress-plugin-auto-navbar';

module.exports = defineConfig({
  title: 'Code More Create',
  plugins: [['vuepress-plugin-auto-sidebar', {}]],
  theme: 'vt',
  themeConfig: {
    logo: 'logo.jpg',
    nav: AutoNavPlugin({
      ignoreFolders: [
        'node_modules',
        'assets',
        'public',
        '.vuepress',
        'code',
        '.obsidian',
        'utils',
      ],
      ignoreFiles: ['个人简历', '学习计划'],
      subNavShow: ['其他', '工具使用', 'Vue', '设计模式', '前端工程化', '手写代码系列','计算机网络'],
      deep: 3,
      childrenKey: 'items'
    }),
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    editLinks: true,
    lastUpdated: true, // string | boolean
    smoothScroll: true, // 页面滚动效果
    repo: 'https://github.com/Merlin218',
    editLinkText: '更正错误',
    docsRepo: 'https://github.com/Merlin218/Merlin218.github.io',
    docsBranch: 'master',
    docsDir: 'docs',
  },
});
