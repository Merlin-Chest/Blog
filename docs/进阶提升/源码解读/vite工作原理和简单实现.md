# vite工作原理和简单实现

## 工作原理

html中，使用`type="module"`的方式，请求main.js文件，这意味着可以使用ESM模块化的方式加载模块，且不需要打包。

- 两个好处
	- 开发阶段，无需打包，启动速度快
	- 按需加载

- 对模块进行预打包，解析成正确的相应路径
- 对非js模块进行解析，转换为js文件

## 简单实现

首先，先用koa在本地启动一个服务器，我们把项目跑在这个端口上。

```js
const Koa = require('koa');

const app = new Koa();
const fs = require('fs');
const path = require('path');
const { reWriteImport } = require('./utils');
const compilerSFC = require('@vue/compiler-sfc');
const compilerDOM = require('@vue/compiler-dom');

app.use(async (ctx) => {
	ctx.body = 'hello mini-vite'
});

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
});
```

接着，当我们去请求根路径的时候，先请求html模板，同时html模板中包含了请求main.js文件的`script`标签，`type`为`module`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="app"></div>
  <script>
   // 临时解决报错，缺少环境变量
    window.process = {
      env: {
        NODE_ENV: 'development',
      }
    }
  </script>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

然后服务器就会发出请求，我们拦截一下请求，返回js文件，设置`content-type`为`application/javascript`

```js
const Koa = require('koa');

const app = new Koa();
const fs = require('fs');
const path = require('path');
const { reWriteImport } = require('./utils');
const compilerSFC = require('@vue/compiler-sfc');
const compilerDOM = require('@vue/compiler-dom');

app.use(async (ctx) => {
  const { url,query } = ctx.request;
  if (url === '/') {
	// ...
  } else if (url.endsWith('.js')) {
    // 加载js文件
    const p = path.join(__dirname, url);
    ctx.type = 'application/javascript';
    ctx.body = reWriteImport(fs.readFileSync(p, 'utf-8'));
  } 
});

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
});
```

那么当我们js文件中存在`import`外部模块是，这个时候浏览器是不存在这个模块的，我们需要引导浏览器，去正确的地方获取文件。

我们统一的将外部模块的前面加入一个统一的前缀`/@modules/`,然后我们的服务端拦截一下这个前缀，然后改写一下路径后，到正确的目录下（node_modules）拿到模块导出的内容，然后再返回给客户端，就可以实现外部模块的加载。

我们实现一个重写import路径函数

```js
function reWriteImport(content) {
  return content.replace(/ from ['"](.*)['"]/g, (s1, s2) => {
    if (s2.startsWith('./') || s2.startsWith('../') || s2.startsWith('/')) {
      return s1;
    }
    return ` from '/@modules/${s2}'`;
  });
}

module.exports = { reWriteImport };
```

然后在返回js文件之间将文件中的import路径进行替换，当js文件执行时，服务器就能拦截点相应的请求。

```js
const Koa = require('koa');

const app = new Koa();
const fs = require('fs');
const path = require('path');
const { reWriteImport } = require('./utils');
const compilerSFC = require('@vue/compiler-sfc');
const compilerDOM = require('@vue/compiler-dom');

app.use(async (ctx) => {
  const { url,query } = ctx.request;
  if (url === '/') {
    // 加载index.html文件
  } else if (url.endsWith('.js')) {
    // 加载js文件
  } else if (url.startsWith('/@modules/')) {
    // 裸模块名称
    const moduleName = url.replace('/@modules/', '');
    const prefix = path.join(__dirname, '../node_modules', moduleName);
    // 请求模块的package.json文件，获取到入口文件
    const { module } = require(`${prefix}/package.json`);
    const filePath = path.join(prefix, module);
    const ret = fs.readFileSync(filePath, 'utf-8');
    ctx.type = 'application/javascript';
    ctx.body = reWriteImport(ret);
  }
});

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
});
```

当外部模块请求完成，我们会需要加载根组件，那么涉及到对vue文件的拦截。

vue文件我们需要使用vue官方提供的解析器对文件内容进行解析，生成ast树，我们在从ast树中获取到对应的内容。

```json
{
  descriptor: {
    filename: 'anonymous.vue',
    source: '\n' +
      '<template>\n' +
      '  <div>{{ title }}</div>\n' +
      '</template>\n' +
      '\n' +
      '<script>\n' +
      'import { ref } from "vue";\n' +
      'export default {\n' +
      '  setup() {\n' +
      '    const title = ref("Hello Vite");\n' +
      '    return {\n' +
      '      title,\n' +
      '    };\n' +
      '  },\n' +
      '};\n' +
      '</script>\n' +
      '\n' +
      '<style scoped>\n' +
      '</style>\n',
    template: {
      type: 'template',
      content: '\n  <div>{{ title }}</div>\n',
      loc: [Object],
      attrs: {},
      ast: [Object],
      map: [Object]
    },
    script: {
      type: 'script',
      content: '\n' +
        'import { ref } from "vue";\n' +
        'export default {\n' +
        '  setup() {\n' +
        '    const title = ref("Hello Vite");\n' +
        '    return {\n' +
        '      title,\n' +
        '    };\n' +
        '  },\n' +
        '};\n',
      loc: [Object],
      attrs: {},
      map: [Object]
    },
    scriptSetup: null,
    styles: [],
    customBlocks: [],
    cssVars: [],
    slotted: false,
    shouldForceReload: [Function: shouldForceReload]
  },
  errors: []
}
{
  descriptor: {
    filename: 'anonymous.vue',
    source: '\n' +
      '<template>\n' +
      '  <div>{{ title }}</div>\n' +
      '</template>\n' +
      '\n' +
      '<script>\n' +
      'import { ref } from "vue";\n' +
      'export default {\n' +
      '  setup() {\n' +
      '    const title = ref("Hello Vite");\n' +
      '    return {\n' +
      '      title,\n' +
      '    };\n' +
      '  },\n' +
      '};\n' +
      '</script>\n' +
      '\n' +
      '<style scoped>\n' +
      '</style>\n',
    template: {
      type: 'template',
      content: '\n  <div>{{ title }}</div>\n',
      loc: [Object],
      attrs: {},
      ast: [Object],
      map: [Object]
    },
    script: {
      type: 'script',
      content: '\n' +
        'import { ref } from "vue";\n' +
        'export default {\n' +
        '  setup() {\n' +
        '    const title = ref("Hello Vite");\n' +
        '    return {\n' +
        '      title,\n' +
        '    };\n' +
        '  },\n' +
        '};\n',
      loc: [Object],
      attrs: {},
      map: [Object]
    },
    scriptSetup: null,
    styles: [],
    customBlocks: [],
    cssVars: [],
    slotted: false,
    shouldForceReload: [Function: shouldForceReload]
  },
  errors: []
}
```

对于script标签中的内容，我们需要导出的内容转化为一个对象，对于template标签中的内容，我们则需要将模板转化为render函数，然后将render函数加入到对象中，在最后导出这个对象。

```js
const Koa = require('koa');

const app = new Koa();
const fs = require('fs');
const path = require('path');
const { reWriteImport } = require('./utils');
const compilerSFC = require('@vue/compiler-sfc');
const compilerDOM = require('@vue/compiler-dom');

app.use(async (ctx) => {
  const { url,query } = ctx.request;
  if (url === '/') {
    // 加载index.html文件
  } else if (url.endsWith('.js')) {
    // 加载js文件
  } else if (url.startsWith('/@modules/')) {
    // 加载模块
  }else if(url.indexOf('.vue') > -1){
    // 获取路径
    const p = path.join(__dirname, url.split('?')[0]);
    const ast = compilerSFC.parse(fs.readFileSync(p, 'utf-8'));
    if(!query.type){
      // 获取脚本部分的内容
      let script = ''
      if(ast.descriptor.script){
        const scriptContent = ast.descriptor.script.content;
        // 默认替换导出为一个常量
        script = scriptContent.replace('export default ', 'const __script = ');
      }
      ctx.type = 'application/javascript';
      ctx.body = `
      ${reWriteImport(script)}
      import {render as __render} from '${url}?type=template'
      __script.render = __render;
      export default __script;
      `
    }else if(query.type === 'template'){
      // 获取模板部分的内容
      const templateContent = ast.descriptor.template.content;
      const render = compilerDOM.compile(templateContent, {mode: 'module'}).code;
      ctx.type = 'application/javascript';
      ctx.body = reWriteImport(render);
    }
  }
});

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
});

```

之后呢，我们就可以将导出的对象，放入createApp中，实现对组件的渲染啦。