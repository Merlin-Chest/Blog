# HTTP报文格式
- 首行：start-line
	- 请求行
		- 请求方法
		- 请求地址
		- HTTP版本
	- 响应行
		- HTTP版本
		- 状态码
		- 响应信息
- 首部信息：header-filed
- 消息体：message-body

## ABNF语义定义

- 操作符
	- 空白字符：用于分隔元素
	- 选择`/`：表示多个规则可供选择
	- 值范围：`%C##-##`
	- 序列组合`()`：多个规则视为一个元素
	- 不定量重复`m*n`
		- `*`表示0至多个
		- `1*`表示1至多个
		- `2*4`表示2至4个
	- 可选序列`[]`：表示可选元素

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202209141303134.jpg)

## 基于ABNF的HTTP报文格式
`HTTP-message = start-line *( header-field CRLF ) CRLF [ message-body ]`

• start-line = request-line / status-line  
	• request-line=methodSPrequest-targetSPHTTP-versionCRLF  
	• status-line=HTTP-versionSPstatus-codeSPreason-phraseCRLF

• header-field = field-name ":" OWS field-value OWS
	- OWS=*(SP/HTAB)
	- field-name = token
	- field-value = *( field-content / obs-fold )

• message-body = *OCTET
