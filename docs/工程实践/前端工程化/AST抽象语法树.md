## 什么是抽象语法树

在语言转化过程中的产物，涉及到工程化诸多环节的应用。

而在语言转换的过程中，实质上就是对其 AST 的操作，核心步骤就是 AST 三步走：

1.  Code -> AST (Parse解析)
2.  AST -> AST (Transform转化)
3.  AST -> Code (Generate生成)

不同的语言拥有不同的解析器，比如 `Javascript` 的解析器和 `CSS` 的解析器就完全不同。

对相同的语言，也存在诸多的解析器，也就会生成多种 AST，如 `babel` 与 `espree`。

在 [AST Explorer](https://astexplorer.net/)中，列举了诸多语言的解析器(Parser)，及转化器(Transformer)。

## AST 的生成

AST 的生成这一步骤被称为**解析(Parser)**，而该步骤也有两个阶段: 词法分析(Lexical Analysis)和语法分析(Syntactic Analysis)。

### 词法分析
用以将代码转化为 `Token` 流，维护一个关于 Token 的数组。
```javascript
// Code
a = 3

// Token
[
  { type: { ... }, value: "a", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "=", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "3", start: 4, end: 5, loc: { ... } },
  ...
]
```

词法分析后的 Token 流也有诸多应用，如:
1.  代码检查，如 eslint 判断是否以分号结尾，判断是否含有分号的 token
2.  语法高亮，如 highlight/prism 使之代码高亮
3.  模板语法，如 ejs 等模板也离不开

### 语法分析

语法分析将 Token 流转化为结构化的 AST，方便操作。
```json
{
  "type": "Program",
  "start": 0,
  "end": 5,
  "body": [
    {
      "type": "ExpressionStatement",
      "start": 0,
      "end": 5,
      "expression": {
        "type": "AssignmentExpression",
        "start": 0,
        "end": 5,
        "operator": "=",
        "left": {
          "type": "Identifier",
          "start": 0,
          "end": 1,
          "name": "a"
        },
        "right": {
          "type": "Literal",
          "start": 4,
          "end": 5,
          "value": 3,
          "raw": "3"
        }
      }
    }
  ],
  "sourceType": "module"
}
```
