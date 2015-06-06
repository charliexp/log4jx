##log4jx 
==================
`log4js-node` 扩展
此模块是借鉴`log4js-node-extend`模块, 再添加一些自主想法

再造轮子, 在已有的log4js打印日志的项目中简单添加几行代码就可以使用自定义布局, 是不是很简单呢

可以自由添加进程号, 执行文件路径, 函数追踪, 行号, 列数等
现时建议按照格式增减, 以后会增加完全自由布局, 现在只算是半自由布局
(暂时还有几个小bug, console.log 控制台打印还追踪不到, 研究中)

动机: 很多交接项目有只用console.log或log4js打印的, 刚接手时是否感觉看控制台只有输出内容表示很头疼, 由此想到这个东东

Installation
---------
```
npm install log4jx
```

Usage
---------
```js
var log4js = require("log4js");
var log4jx = require("log4jx");

/// 只需要添加4～5行代码就可以拥有追踪输出代码的功能, 还犹豫什么, 把星星点亮吧
log4jx(log4js, {
  path  : __dirname,
  format: "[@date] [@level][@pid][@worker] @category -@data (@file:[@method]:@line:@column)"
});

log4js.configure({
  appenders     : [
    {
      type: 'console'
    }
  ],
  replaceConsole: true
});

function getLogger(name, level) {
  var dateFileLog = log4js.getLogger(name);
  level = level || log4js.levels.INFO;
  dateFileLog.setLevel(level);
  return dateFileLog;
}

var logger = getLogger("category", "DEBUG");

function getApple() {
  console.log("测试内容console");
  logger.info("测试内容0");
  logger.debug("测试内容1");
  logger.debug("测试内容1.5", {name:"tom"},{age1:100});
  logger.warn("测试内容2");
  logger.error("测试内容3");
}

getApple();
```

Result
---------
```js

//->[2015-06-06 14:01:31.288] [INFO][36386][master] console - 测试内容console  (../node_modules/log4js/lib/log4js.js:[log]:372:10)
//->[2015-06-06 14:01:31.291] [INFO][36386][master] category - 测试内容0  (loggerTest.js:[getApple]:49:10)
//->[2015-06-06 14:01:31.292] [DEBUG][36386][master] category - 测试内容1  (loggerTest.js:[getApple]:50:10)
//->[2015-06-06 14:01:31.292] [DEBUG][36386][master] category - 测试内容1 { name: 'tom' } { age1: 100 }  (loggerTest.js:[getApple]:51:10)
//->[2015-06-06 14:01:31.294] [WARN][36386][master] category - 测试内容2  (loggerTest.js:[getApple]:52:10)
//->[2015-06-06 14:01:31.294] [ERROR][36386][master] category - 测试内容3  (loggerTest.js:[getApple]:53:10)

```

Options
---------
### path
当前执行文件的路径为基准, 显示相对路径
如果不传此参数默认显示绝对路径

default: `null`

### format
输出格式

default: `"[@date] [@level] @category -@data [@method] (@file:@line:@column)"`

#### 以下全部参数说明:
* @name     : 函数名
* @file     : 当前文件名
* @line     : 行号
* @column   : 列号
* @date     : 日期时间
* @level    : 日志级别
* @category : 别名
* @worker   : [worker-n | master]
* @pid      : 进程号
* @port     : 端口号(需自行赋值, 未实现)

License
---------
Version 0.0.3
