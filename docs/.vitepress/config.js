import { defineConfig } from 'vitepress'
import AutoNavPlugin from 'vitepress-auto-nav-sidebar'
import CodeRunPlugin from './theme/plugins/run-code'
const { nav, sidebar } = AutoNavPlugin({
  ignoreFolders: [
    'node_modules',
    'assets',
    'public',
    '.vitepress',
    'code',
    '.obsidian',
    'utils',
    'resource',
    'xmind'
  ],
  ignoreFiles: ['个人简历', '学习计划', '面试准备', '互联网公司列表', 'index'],
  isCollapse: true,
})


export default defineConfig({
  base: '',
  lang: 'zh-CN',
  title: 'Code More Create',
  // description: "Merlin's Blog",
  assetsInclude: ['**/*.xmind'],
  markdown: {
    config: (md) => {
      md.use(CodeRunPlugin)
      md.use(function (md) {
        const handleImage = md.renderer.rules.image
        md.renderer.rules.image = (tokens, idx, options, env, self) => {
          const url = tokens[idx].attrs[0][1];
          if (/.xmind$/.test(url)) {
            const title = tokens[idx].children[0].content;
            const url = tokens[idx].attrs[0][1];
            return `<XMindViewer src="${url}" title="${title}"></XMindViewer>`;
          } else {
            return handleImage(tokens, idx, options, env, self);
          }
        }
      })
    }
  },
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Code More Create',
    nav: [
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
