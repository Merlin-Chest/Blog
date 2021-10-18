const path = require("path");
module.exports = {
  lang: "zh-cn",
  // 在使用 vuepress-vite 包的时候，你可以忽略这个字段，因为 Vite 是默认打包工具
  bundler: "@vuepress/bundler-vite",
  // Vite 打包工具的配置项
  bundlerConfig: {
    // 查看下方
  },
  theme: path.resolve(__dirname, './theme'),
  themeConfig: {
    navbar: [
      {
        text: "前端基础",
        link: "/base/",
        children: [
          "/base/Javascript.md",
          "/base/Typescript.md",
          "/base/ES6.md",
          "/base/AJAX.md",
          "/base/Canvas基础.md",
          {
            text: "专题",
            link: "/base/subject/",
            children: ["/base/subject/异步专题.md"],
          },
        ],
      },
      {
        text: "Vue",
        link: "/vue/",
        children: [
          "/vue/vue基础.md",
          "/vue/vue-router.md",
          {
            text: "原理",
            link: "/vue/principle/",
            children: ["/vue/principle/数据响应式.md"],
          },
        ],
      },
      {
        text: "工具插件",
        link: "/tools/",
        children: ["/tools/webpack.md", "/tools/axios.md"],
      },
      {
        text: "后端基础",
        link: "/end/",
        children: [
          "/end/Koa.md",
          "/end/Nodejs.md",
          "/end/即时通信.md",
          "/end/模版引擎.md",
        ],
      },
    ],
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: "https://gitee.com/merlin218",
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: "Gitee",

    // 以下为可选的编辑链接选项

    // 假如你的文档仓库和项目本身不在一个仓库：
    docsRepo: "Merlin218/Merlin.github.io",
    // 假如文档不是放在仓库的根目录下：
    docsDir: "docs",
    // 假如文档放在一个特定的分支下：
    docsBranch: "master",
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: "帮助我们改善此页面！",
  },
};
