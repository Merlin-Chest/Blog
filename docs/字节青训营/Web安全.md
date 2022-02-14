### 攻击篇:

1.  Cross-Site Scripting(XSS)
    -   跨站脚本攻击,攻击者通过一些方式将自己的恶意代码注入到网页中,用户点击网页就会执行恶意代码
    -   因为开发者盲目信任用户提交的内容并且将用户提交的字符串转化成了DOM
    -   XSS特点:
        -   通常难以从 UI 上感知（暗地执行脚本）
        -   窃取用户信息（cookie/token）
        -   绘制 UI(例如弹窗),诱骗用户点击/填写表单
    -   XSS攻击类型:
        1.  存储型 Stored XSS
            -   恶意脚本被存在数据库中
            -   访问页面,然后可以读,写用户数据
            -   危害最大,对全部用户可见
        2.  反射型 Refleted XSS
            -   不涉及数据库,主要是从URL上攻击
        3.  基于DOM DOM-based XSS
            -   不需要服务器的参与
            -   恶意攻击的发起 + 执行,全部在浏览器完成
        4.  Mutation-based XSS
            -   利用了浏览器渲染 DOM 的特性(独特优化)
            -   不同浏览器,会有区别(按浏览器进行攻击)
2.  Cross-Site request forgery(CSRF) 跨站伪造请求
    -   在用户不知情的前提下
    -   利用用户权限（cookie）
    -   构造指定的 HTTP 请求,窃取或修改用户敏感信息
3.  Injection 注入
    
    -   SQL injection:  
        
    
    向服务器发送HTTP请求带有SQL参数,服务器会拼接SQL代码来执行,然后就可以修改或者删除数据,或者获取数据
    -   CLI
    -   OS command
    -   Server-Side Request Forgery(SSRF):服务端伪造请求,SSRF不是Injection,但和Injection原理类似
4.  Denial of Service(Dos):  
    通过某种形式,导致服务器资源被显著消耗,来不及相应更多请求,最后请求越压越多,服务器崩溃
    -   ReDos:基于正则表达式的拒绝服务攻击,基于正则表达式的贪婪匹配算法进行攻击
    -   Distributed DoS(DDoS):短时间内有大量僵尸设备的请求,导致服务器不能即使完成全部请求,例如利用TCP进行请求最后请求越压越多,服务器崩溃  
        攻击特点:
        -   直接访问 IP
        -   任意 API
        -   消耗大量带宽(耗尽)
5.  中间人攻击,利用局域网的一些协议机制
    1.  明文传输
    2.  信息篡改不可知
    3.  对方身份未验证

### 防御篇:

1.  XSS
    -   永远不要信任用户的提交内容
    -   不用将用户提交的内容之间转换成DOM
    -   现成工具:
        -   前端
            -   主流框架防御 XSS
            -   google-closure-library
        -   服务端（Node）
            -   DOMPurify
    -   一些注意:
        1.  若要进行将string转DOM时要使用转义
        2.  要上传 svg 文件时,进行一次扫描
        3.  尽量不要做让用户自定义跳转的行为
        4.  要留意可以自定义样式的东西
2.  Content Security Pollicy(CSP)
    -   允许开发者定义哪些源(域名)被认为是安全的
    -   来自安全源的脚本可以执行,否则直接抛错
    -   拒绝eval + inline script
3.  CSRF的防御
    -   判断是否是合法来源
    -   通过限制请求来源
    -   可以校验 Origin 和 Referer
    -   判断合法来源的方式:
        1.  if(请求来自合法页面)
        2.  then(服务器接收过页面请求)
        3.  then(服务器可以标识)
    -   通过传递给用户 token 然后用户下次使用 token + 用户信息 就可以了
    -   尽量将 GET 和 POST 的请求单独操作,不要合并操作
4.  Samesite cookie  
    cookie 有 Samesite 属性,加上 Samesite 后,会限制第三方网站,可以用来防御 CSRF 攻击,还有用户追踪
5.  Injection防御
    1.  找到查询SQL的地方,使用 prepared statement 可以让代码提前编译,让SQL注入语句不能执行
    2.  对于其他的注入可以使用:  
        1.  最小权限原则
        2.  建立允许名单 + 过滤
        3.  对 URL 类型参数进行协议,域名,ip等限制
6.  Regex Dos防御
    1.  避免使用 正则表达式的贪婪模式
    2.  代码扫描 + 正则测试性能
    3.  拒绝使用用户提供的正则
    4.  使用 负载均衡,AP网关,CDN等进行过滤
    5.  快速自动扩容,非核心服务降级等方式进行扛量
7.  防御中间人攻击
    -   使用HTTPS协议,HTTPS具有可靠性(加密),完整性(MAC验证),不可抵赖性(数字签名)

### 总结

-   安全无小事
-   使用的依赖(npm package,甚至是Node.js),可能成为最薄弱的一环
    -   [left-pad事件]
    -   [eslint-scope事件]
    -   [event-stream事件]
-   保持学习的心态.