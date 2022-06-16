import { defineConfig } from 'vitepress'
import AutoNavPlugin from 'vitepress-auto-nav-sider'

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
  subNavShow: [
    '其他',
    '工具使用',
    'Vue',
    '设计模式',
    '前端工程化',
    '手写题',
    '题目整理',
    '计算机网络',
    '源码解读'
  ],
  filePrefix: '',
})


export default defineConfig({
  lang: 'zh-CN',
  title: 'VitePress',
  description: 'Vite & Vue powered static site generator.',
  themeConfig: {
    logo: 'logo.png',
    siteTitle: 'Code More Create',
    nav, sidebar,
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
