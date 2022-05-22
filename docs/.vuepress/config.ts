import { defineConfig } from '@vuepress/types';
import AutoNavPlugin from 'vuepress-plugin-auto-navbar';

module.exports = defineConfig({
  title: 'Code More Create',
  description: "Merlin's Blog",
  plugins: [
    ['vuepress-plugin-auto-sidebar', {}],
    [
      '@vuepress/plugin-pwa',
      {
        serviceWorker: true,
        updatePopup: true,
      },
    ],
  ],
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { charset: 'UTF_8'}],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'theme-color', content: '#4c58bb' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#4c58bb' }],
    ['meta', { name: 'msapplication-TileImage', content: '/mstile-150x150.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
  ],
  theme: 'vt',
  themeConfig: {
    logo: 'logo.png',
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
      ignoreFiles: ['个人简历', '学习计划', '面试准备', '互联网公司列表'],
      subNavShow: [
        '其他',
        '工具使用',
        'Vue',
        '设计模式',
        '前端工程化',
        '手写代码系列',
        '计算机网络',
      ],
      deep: 3,
      childrenKey: 'items',
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
