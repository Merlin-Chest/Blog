# HTML专题

### 1. src和href的区别

- src：对资源文件的引用，例如请求js脚本或者图片等；当解析js时，默认情况下会阻塞html的渲染
- href：对超文本的引用，建立联系，可以是网络资源，或者是文件，或者锚点，不会阻塞对html的处理

### 2. a标签中href的几种跳转方法
- `href="javascript:js_method();"` 执行js方法（不推荐）
- `href="javascript:void(0)" onclick="js_method()"` 执行js方法（推荐）
- `href="javascript:;" οnclick="js_method()"` 与上面方法类似，执行一行空的js代码
- `href="#"` 返回页面顶部
- `href="#top"` 跳到对应的id
- `href="http://xxx"` 新建窗口，访问网址
- `href="./test.doc"` 下载文件

### 3. HTML语义化的理解？好处？常用的语义化标签有？
- 根据内容的结构化，使用合适的带有具体语义的标签，用正确的标签做正确的事情。
- 好处：可读性强；便于维护；有助于搜索引擎爬取相关信息，有利于SEO；对读屏软件可以根据文章生成目录；
- 常用的语义化标签
	- `header`头部
	- `nav`导航
	- `footer`底部
	- `main`主要区域
	- `section`区块
	- `article`主要内容
	- `aside`侧边

### 4. DOCTYPE（文档类型）作用？有什么意义 ✅ 
- 告诉浏览器一个用什么文档类型来解析。必须声明在文档第一行`<!DOCTYPE html>`，现在不需要表明具体的版本。
	- 标准模式：以W3C的标准模式解析渲染页面
	- 怪异模式：浏览器以自己的怪异模式解析

### 5. script标签中defer和async的相同点和不同点 ✅
- 相同点：该脚本会异步加载，不会阻塞页面渲染。
- 不同点：
	- defer：加载完会在页面全部渲染完成后再执行，多个defer脚本会按顺序执行
	- async：会在加载完立即执行，占用html渲染进程，并且不保证执行顺序

### 7. meta标签的作用？常用的有哪些？❎
- 用来描述网页文档的属性，如标题，页面描述，作者等
- 常用：
	- `<meta charset="UTF-8" />` HTML的编码类型
	- `<meta name="keywords" content="关键词" />`
	- `<meta name="description" content="页面描述信息" />`
	- `<meta http-equiv="refresh" content="秒数;url=跳转链接" />` 刷新网页
	- `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">` 适配移动端，可以控制视口的大小和比例
		- width：宽度（数值/device-width) 
		- height：高度（数值/device-height）
		- initial-scale：初始缩放比例 
		- maximum-scale：最大缩放比例 
		- minimum-scale：最小缩放比例 
		- user-scalable：是否允许用户缩放(yes/no)
	- `<meta name="robots" content="index,follow" />` content参数有几种
		- all:文件将被检索，且页面上的链接可以备查询
		- none：文件将不被检索，且页面上的链接不可以被查询
		- index：文件将被检索
		- follow：页面是上的链接可以被查询
		- onindex：文件将不被检索
		- onfollow：页面上的链接不可以被查询

### 8. HTML5有哪些更新

- #### 标签方面
- 语义化标签
    - `header`头部、`nav`导航、`footer`底部、`main`主要区域、`section`区块、`article`主要内容、`aside`侧边
 - 表单控件：`calendar`、`date`、`time`、`email`、`url`、`search`
- video标签
	- 属性
		- poster：封面，默认视频文件第一帧
		- controls：控制面板
		- width、height
		- autoplay
  - audio标签
	  - 属性
		  - controls：控制面板
		  - autoplay
		  - `loop="true"`：循环播放
- source标签
	- 用来指定视频源
  - 移除了一些元素
    - 纯表现的元素：`big`、`center`、`font`、`s`、`strike`
    - 对可用性产生负面影响的元素：`frame`、`frameset`、`noframes`;

- canvas
- localStorage长期存储数据，关闭浏览器不会丢失
- sessionStorage的数据在浏览器关闭后自动删除
- webWorker
- webSocket
- 地理位置定位

- IE8/IE7/IE6支持通过document.createElement方法产生的标签，可以利用这一特性让这些浏览器支持HTML5新标签，浏览器支持新标签后，还需要添加标签默认的样式。
### 9. img标签srcset属性的作用
- srcset属性用于设置不同屏幕密度下，img 会自动加载不同的图片。
- `<img src="image-128.png" srcset="image-128.png 128w, image-256.png 256w, image-512.png 512w" sizes="(max-width: 360px) 340px, 128px" />`
- srcset指定图片的地址和对应的图片质量。w单位，可以理解成图片质量。如果可视区域小于这个质量的值，浏览器会自动选择一个最小的可用图片。
- sizes用来设置图片的尺寸零界点。指默认显示128px, 如果视区宽度大于360px, 则显示340px。
### 10. 行内元素有哪些？块状元素有哪些？空元素有哪些？❎
- 行内元素：a/span/img/input/select/strong
- 块状元素：div/ul/li/ol/dl/dt/dd（键值对）/h1-h6/p
- 空元素：br/hr(段落分隔)/img
### 11. webWorker
- webWorker是在后台运行的js，独立于其他脚本，不会影响页面的性能，并且通过postMessage将结果传回主线程，这样子在进行复杂操作的时候，就不会阻塞主线程。
### 12. HTML5离线存储怎么使用？工作原理是什么？如何管理？
- server worker
### 13. title与h1的区别、b与strong的区别、i与em的区别？
### 14. iframe有什么优点和缺点
### 15. label标签的作用，如何使用
### 16. canvas和svg的区别
### 17. head标签有什么作用，哪些是必不可少的
### 18. 浏览器乱码有哪些情况？如何解决？
### 19. 渐进增强和优雅降级（前者更合理）
### 20. HTML5的drag API
### 21. link和@import的区别
### 22. 讲一下HTML的解析过程
