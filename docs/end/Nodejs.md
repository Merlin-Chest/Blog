# NodeJS

Created: July 21, 2021 5:39 PM
Tags: nodejs

### Node.js介绍

- Node.js 诞生于2009年，Node.js采用C++语言编写而成，是 一个Javascript的运行环境。Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境 ，让JavaScript的运行脱离浏览器端，可以使用JavaScript语言 书写服务器端代码。

### **安装Node.js**

[Node.js官网](https://nodejs.org/)下载稳定版本,node偶数版本为稳定版本，奇数版本为非稳定版本。

- mac 直接安装 或者 brew来安装
- 安装完Node.js会自动安装NPM(Node Package Manager)：包管理工具；
- 通过指令 node -v 来查看是否安装完成和查看node版本号；npm -v 来查看npm版本。

### 使用Node.js实现第一个服务器

初步感受Node.js

```
//引入http模块
let http = require("http");
//创建一个服务器
let serve = http.createServer((req,res)=>{
    console.log("hello");
    res.end("hello world");
})
//设置端口号
serve.listen(3000);
```

- Google Chrome 默认非安全端口列表，尽量避免以下端口。
    
    1,    // tcpmux
    7,    // echo
    9,    // discard
    11,   // systat
    13,   // daytime
    15,   // netstat
    17,   // qotd
    19,   // chargen
    20,   // ftp data
    21,   // ftp access
    22,   // ssh
    23,   // telnet
    25,   // smtp
    37,   // time
    42,   // name
    43,   // nicname
    53,   // domain
    77,   // priv-rjs
    79,   // finger
    87,   // ttylink
    95,   // supdup
    101,  // hostriame
    102,  // iso-tsap
    103,  // gppitnp
    104,  // acr-nema
    109,  // pop2
    110,  // pop3
    111,  // sunrpc
    113,  // auth
    115,  // sftp
    117,  // uucp-path
    119,  // nntp
    123,  // NTP
    135,  // loc-srv /epmap
    139,  // netbios
    143,  // imap2
    179,  // BGP
    389,  // ldap
    465,  // smtp+ssl
    512,  // print / exec
    513,  // login
    514,  // shell
    515,  // printer
    526,  // tempo
    530,  // courier
    531,  // chat
    532,  // netnews
    540,  // uucp
    556,  // remotefs
    563,  // nntp+ssl
    587,  // stmp?
    601,  // ??
    636,  // ldap+ssl
    993,  // ldap+ssl
    995,  // pop3+ssl
    2049, // nfs
    3659, // apple-sasl / PasswordServer
    4045, // lockd
    6000, // X11
    6665, // Alternate IRC [Apple addition]
    6666, // Alternate IRC [Apple addition]
    6667, // Standard IRC [Apple addition]
    6668, // Alternate IRC [Apple addition]
    
    6669, // Alternate IRC [Apple addition]
    

### **模块化**

一、为什么会有模块化

- 在JavaScript发展初期就是为了实现简单的页面交互逻辑，寥寥数语即，如今随着前端代码日益膨胀
    
    这时候JavaScript作为嵌入式的脚本语言的定位动摇了，JavaScript却没有为组织代码提供任何明显帮助，JavaScript极其简单的代码组织规范不足以驾驭如此庞大规模的代码；
    

二、Node.js中的模块化  commonjs规范

- CommonJS就是为JS的表现来制定规范，因为js没有模块的功能所以CommonJS应运而生，它希望js可以在任何地方运行，不只是浏览器中。
    
    1、创建自定义模块
    
    - 引入一个文件 形式模块
        
        home.js执行文件
        
        ```jsx
        //通过require来引入
        require("./aModule"); //注意一定要有"./"，文件后缀可加可不加。
        ```
        
        amodule.js文件
        
        ```jsx
        console.log("我是amodule模块111");
        ```
        
    - 引入文件夹形式模块
        - home.js执行文件
        
        ```jsx
        require("./aModuledir"); //必须加"./"
        ```
        
        aModuleDir里的index.js文件,会自动查找文件夹下的index.js文件执行
        
        ```jsx
        console.log("我是aModule模块文件夹");
        ```
        
        - 当然也可以配置默认启动文件，在文件夹内新建package.json来指定执行文件
        
        ```jsx
        {
          "name":"aModule",
          "version":"1.0.0",
          "main":"test.js"
        }
        ```
        
- 自定义模块的按需导出
    
    通过module.exports 导出； ___dirname  , __filename
    
    ```
    module.exports = {
        a:"我是a的值",
        b(){
            console.log("我是导出的b函数");
        }
    }
    ```
    
    引入导出文件
    
    ```
    let mymodule = require("bModule");
    console.log(mymodule.a);
    mymodule.b();
    ```
    
    或者 通过  exports来导出
    
    ```
    exports.fn = function(){
        console.log("我是fn函数");
    }
    ```
    
    导入文件
    
    ```
    let myfn = require("bModule").fn;
    myfn();
    // 或者 通过解构赋值
    let { fn } = require("bModule");
    fn();
    ```
    
- 模块加载的优先级 ,先文件再目录；

2、内置模块；

nodejs内置模块有：Buffer，C/C++Addons，Child Processes，Cluster，Console，Cr

ypto，Debugger，DNS，Domain，Errors，Events，File System，

Globals，HTTP，HTTPS，Modules，Net，OS，Path，Process，P unycode，Query Strings，Readline，REPL，Stream，String De coder，Timers，TLS/SSL，TTY，UDP/Datagram，URL， Utilities，V8，VM，ZLIB；内置模块不需要安装，外置模块需要安装；

### **npm包管理器**

NPM(Node Package Manager)  官网的地址是 [npm官网](https://www.npmjs.com/)

- npm常用指令；
    - npm init：引导创建一个package.json文件
    - npm help(npm -h) ：查看npm帮助信息
    - npm version (npm -v) : 查看npm版本；
    - npm search：查找
    - npm install (npm i)：安装 默认在当前目录，如果没有node_modules 会创建文件夹；
        - npm install module_name -S 或者--save 即 npm install module_name --save 写入dependencies
        - npm install module_name -D 或者 —save-dev 即 npm install module_name --save-dev 写入devDependencies
        - npm install module_name -g 全局安装(命令行使用)
        - 指定版本安装模块 npm i module_name @1.0 通过 "@"符号指定；
    - npm update(npm -up)：更新
    - npm remove 或者 npm uninstall：删除
    - npm root 查看当前包安装的路径 或者通过 npm root -g 来查看全局安装路径；

## **fs模块**

- fs是文件操作模块，所有文件操作都是有同步和异步之分，特点是同步会加上 "Sync" 如：异步读取文件 "readFile"，同步读取文件 "readFileSync"；
    
    文件操作
    
    - 文件读取：
        - 异步读取
        
        ```jsx
        let fs = require("fs");
        fs.readFile("1.txt",(err,data)=>{
            if(err){
                return console.log(err);
            }
            console.log(data.toString());
        })
        ```
        
        - 同步读取文件
        
        ```jsx
        let fs = require("fs");
        let res = fs.readFileSync("1.txt");
        console.log(res.toString());
        ```
        
    - 文件写入：
        
        ```jsx
        let fs = require("fs");
        **//flag配置  "a":追加写入，"w":写入，"r":读取**
        fs.writeFile("2.txt","我是要写入的内容",{flag:"w"},err=>{
            if(err){
                return console.log(err);
            }
            console.log("写入成功");
        })
        ```
        
    - 文件删除
        
        ```jsx
        fs.unlink("2.txt",err=>{
            if(err){
                return console.log(err);
            }
            console.log("删除成功");
        })
        ```
        
    - 复制文件
        - 先读取文件再写入文件
        
        ```jsx
        function mycopy(src,dest){
           fs.writeFileSync(dest,fs.readFileSync(src));
        }
        mycopy("1.txt","4.txt");
        ```
        
    - 修改文件名，目录也可以通过rename来操作
        
        ```jsx
        fs.rename("1.txt","5.txt",function (err) {
            if(err){
                console.log(err);
            }else{
                console.log("修改成功");
            }
        });
        ```
        
    - 判断文件是否存在
        
        ```jsx
        fs.exists("4.txt",function (exists) {
            console.log(exists);
        })
        ```
        
    - 获取文件或者目录的详细信息
        
        ```jsx
        fs.stat("index.html",(err,stat)=>{
        	if(err){
        		return console.log(err)
        	}
        	//判断是否是文件
        	let res = stat.isFile();
        	//判断是否是目录
        	let res = stat.isDirectory();
        })
        ```
        
    - 删除非空目录
        
        ```jsx
        function removeDir(path) {
            //读取目录
            let data = fs.readdirSync(path)
            for (let i = 0; i < data.length; i++){
                //补充路径
                let url = path + '/' + data[i];
                //获取详细信息
                let stat = fs.statSync(url);
                //是文件 ？直接删除 ：目录继续查找
                if (stat.isDirtectory()) {
                    removeDir(url)
                }
                else {
                    fs.unlinkSync(url);
                }
            }
            //删除文件完毕，删除该空目录
            fs.rmdirSync(path);
        }
        ```
        

### **buffer缓冲区**

- buffer的创建
    - 直接创建
    - 数组创建
    - 字符串创建
    - 乱码的处理
        - Buffer.concat进行连接
        - StringDecoder类
    - buffer转换tostring

### stream流

- stream流：流与数据处理方面密不可分
    - 流的原理
    - 流数据的获取
        - pipe
        - data
        - end
    - copy的流方法实现
    - 加载视图的流方法实现

### **总结**

- nodejs的安装及使用
- 服务端及客户端
- commonjs模块化
- fs模块的使用(文件操作及目录操作)
- stream
- buffer