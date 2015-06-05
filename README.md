log4jx 
[![Build Status](https://secure.travis-ci.org/gynmi/log4jx.png?branch=master)](http://travis-ci.org/gynmi/log4jx)
==================

`log4js-node` のログ出力にファイル名、関数名、行番号、列番号を付加します。

Example
---------
```
//->[2014-02-18 12:24:14.238] [INFO] category - log4jx-test <anonymous> (loggerTest.js:57:9)
//->[2015-06-05 23:20:43.767] [INFO] category - 测试内容 [getAllCount] (loggerTest.js:12:10)
//->[2015-06-05 23:20:43.771] [DEBUG] category - 测试内容 [getAllCount] (loggerTest.js:13:10)
//->[2015-06-05 23:20:43.772] [WARN] category - 测试内容 [getAllCount] (loggerTest.js:14:10)
//->[2015-06-05 23:20:43.772] [ERROR] category - 测试内容 [getAllCount] (loggerTest.js:15:10)
```

Installation
---------
```
npm install log4jx
```

Usage
---------
```js
var log4js = require("log4js"),
    log4jx = require("log4jx");

log4jx(log4js, {
  path: __dirname,
  format: "[@name] (@file:@line:@column)"
});

var logger = log4js.getLogger("category");
logger.info("log4jx-test");
```

Options
---------
### path
文件路径

default: `null`

### format
输出格式

default: `"[@name] (@file:@line:@column)"`

#### 以下参数说明:
* @name   : 函数名
* @file   : 当前文件名
* @line   : 行号
* @column : 列号

License
---------
Version 0.0.1
