import { defineConfig } from 'vitepress'
import AutoNavPlugin from 'vitepress-auto-nav-sidebar'

const { nav, sidebar } = AutoNavPlugin({
  ignoreFolders: [
    'node_modules',
    'assets',
    'public',
    '.vitepress',
    'code',
    '.obsidian',
    'utils',
    'resource'
  ],
  ignoreFiles: ['个人简历', '学习计划', '面试准备', '互联网公司列表','index'],
  isCollapse: true,
})


export default defineConfig({
  lang: 'zh-CN',
  title: 'Code More Create',
  // description: 'Vite & Vue powered static site generator.',
  themeConfig: {
    logo: 'logo.png',
    siteTitle: 'Code More Create',
    nav:[
      ...nav,
      {
        text: '🌱 算法笔记',
        link: 'https://algorithm.merlin218.top'
      }
    ], sidebar,
    footer: {
      message: 'MIT Licensed | Copyright © 2021 - 2022',
      copyright: '粤ICP备2021165391号'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Merlin218'
      }
    ],
    editLink: {
      pattern: 'https://github.com/Merlin218/Merlin218.github.io/edit/master/docs/:path',
      text: '更正错误'
    },
    lastUpdatedText: '更新时间'
  },
})
