##log4jx 

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

function getAllCount(name) {
  logger.info('info',name);
  logger.debug('debug',name);
  logger.warn('warn',name);
  logger.error('error',name);
}

getAllCount("测试内容");
```

Result
---------
```js
//->[2015-06-05 23:20:43.767] [INFO] category - 测试内容 [getAllCount] (loggerTest.js:12:10)
//->[2015-06-05 23:20:43.771] [DEBUG] category - 测试内容 [getAllCount] (loggerTest.js:13:10)
//->[2015-06-05 23:20:43.772] [WARN] category - 测试内容 [getAllCount] (loggerTest.js:14:10)
//->[2015-06-05 23:20:43.772] [ERROR] category - 测试内容 [getAllCount] (loggerTest.js:15:10)

//->[2014-02-18 12:24:14.238] [INFO] category - 测试内容 <anonymous> (loggerTest.js:57:9)
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
