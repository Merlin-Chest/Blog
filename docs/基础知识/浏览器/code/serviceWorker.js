/* eslint-disable no-restricted-globals */
// 监听install事件
self.addEventListener('install', (e) => {
  e.waitUntil(
    // 打开缓存，缓存需要的数据
    caches.open('my-cache').then((cache) => cache.addAll(['./index.html'])),
  );
});
// 拦截所有请求事件
self.addEventListener('fetch', (e) => {
  // 在 Cache 对象中查询第一个匹配URL请求。如果没有发现匹配项，该代码将转而从网络获取响应。
  e.respondWith(
    caches.match(e.request).then((response) => {
      // 如果存在缓存，直接返回
      if (response) {
        return response;
      }
      // 否则请求资源
      console.log('fetch source');
    }),
  );
});
