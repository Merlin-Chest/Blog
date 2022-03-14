import { defineConfig } from "vuepress/config";
const nav = require('./nav');

module.exports = defineConfig({
  title: 'Code More Create',
  plugins: {
    "vuepress-plugin-auto-sidebar": {},
    // require('../../../vuepress-plugin-auto-nav/src'): {}
  },
  theme: 'vt',
  themeConfig: {
    logo: 'logo.jpg', nav,
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
