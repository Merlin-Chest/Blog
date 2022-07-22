# brace
用以扩展集合、数组，有以下语法：

- `set`：`{a,b,c}`
- `range`：`{1..10}`，`{01..10}`
- `step`：`{1..10..2}`

```bash
$ echo {a,b,c}
a b c

# range: 输出 01 到 10
$ echo {01..10}
01 02 03 04 05 06 07 08 09 10

# step: 输出 1 到 10，但是每一步需要自增 2
$ echo {1..10..2}
1 3 5 7 9

# step: 输出 1 到 10，但是每一步需要自增 3
$ echo {1..10..3}
1 4 7 10

# step: 输出 10 到 1，但是每一步需要自减 2
$ echo {10..1..2}
10 8 6 4 2

$ echo {a..z}
a b c d e f g h i j k l m n o p q r s t u v w x y z
```

如此批量操作就很简单：

```bash
# 列出当前目录下所有的 json 与 md 文件
$ ls -lah {*.json,*.md}

# 创建 a.js 到 z.js 26个文件
$ touch {a..z}.js

$ ls *.js
a.js  c.js  e.js  g.js  i.js  k.js  m.js  o.js  q.js  s.js  u.js  w.js  y.js
b.js  d.js  f.js  h.js  j.js  l.js  n.js  p.js  r.js  t.js  v.js  x.js  z.js

# 生成开头是test的，数字部分从001到099，步长为2的json文件
$ touch test{001..099..2}.json
$ ls *.json
test001.json  test015.json  test029.json  test043.json  test057.json  test071.json  test085.json  test099.json
test003.json  test017.json  test031.json  test045.json  test059.json  test073.json  test087.json
test005.json  test019.json  test033.json  test047.json  test061.json  test075.json  test089.json
test007.json  test021.json  test035.json  test049.json  test063.json  test077.json  test091.json
test009.json  test023.json  test037.json  test051.json  test065.json  test079.json  test093.json
test011.json  test025.json  test039.json  test053.json  test067.json  test081.json  test095.json
test013.json  test027.json  test041.json  test055.json  test069.json  test083.json  test097.json
```

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202207222356249.png)