# NodeJs
>课件链接：
>https://bytedance.feishu.cn/file/boxcnhajaIHVf72ioqswDDbCokc
## Node.js运行时的结构

- v8：JavaScript Runtime，诊断调试工具
- libuv：eventlop（事件循环），syscall（系统调用）

### 特点

- 异步I/O
- 单线程
	- JS单线程
		- 实际：JS线程+uv线程池+V8任务线程池+V8 Inspector线程
	- 优点：不用考虑多线程状态同步问题,也就不需要锁;同时还能比较高效地利用系统资源
	- 缺点：阻塞会产生更多负面影响
		- 解决办法：多进程或多线程
- 跨平台
	- Node.js跨平台+JS无需编译环境(+Web跨平台+诊断工具跨平台）
	- 开发成本低(大部分场景无需担心跨平台问题)，整体学习成本低