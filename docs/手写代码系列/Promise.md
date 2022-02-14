## 提前了解

### Js的两种任务执行模式

 - 同步模式
 - 异步模式
	 - 异步任务
		 - 宏任务`Tasks`
			 - 由宿主（浏览器、node）发起的
			 - 创建方式
				 - `setTimeout`、`setInterval`、`MessageChannel`、`I/O，事件队列`、`setImmediate（Node环境）`、`script（整体代码块）`
		 - 微任务`Jobs`
			 - 由JS自身发起的
			 - 创建方式
				 - `requestAnimationFrame（有争议）`、`MutationObserver`、`Promise.[ then/catch/finally ]`、`process.nextTick（Node环境）`、`queueMicrotask`