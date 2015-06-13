##log4jx 
==================
`log4js-node` 扩展
此模块是借鉴`log4js-node-extend`模块, 再添加一些自主想法

再造轮子, 在已有的log4js打印日志的项目中简单添加几行代码就可以使用自定义布局.

可以自由添加进程号, 执行文件路径, 函数追踪, 行号, 列数, 内存监控, 端口号等.
@data是输出打印的内容.
@data前后的布局可以自由增减, 但是@data前后的标签不能互换.
更多使用方法, 请查看example里面的例子.

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
  format: "[@date] [@level][@pid][@port][@memory][@worker] @category -@data (@file:[@method]:@line:@column)"
});
/// set port number
process.port = 3000;

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
  console.log("test console");
  logger.info("test info");
  logger.debug("test debug");
  logger.debug("test debug", {name:"tom"},{age:100});
  logger.warn("test warn");
  logger.error("test error");
  
  //->[2015-06-06 14:01:31.288] [I][36386][3000][20M][ M ] console - test console  (full_logger.js:[getApple]:48:10)
  //->[2015-06-06 14:01:31.291] [I][36386][3000][20M][ M ] category - test info  (full_logger.js:[getApple]:49:10)
  //->[2015-06-06 14:01:31.292] [D][36386][3000][20M][ M ] category - test debug  (full_logger.js:[getApple]:50:10)
  //->[2015-06-06 14:01:31.292] [D][36386][3000][20M][ M ] category - test debug object { name: 'tom' } { age: 100 }  (full_logger.js:[getApple]:51:10)
  //->[2015-06-06 14:01:31.294] [W][36386][3000][20M][ M ] category - test warn  (full_logger.js:[getApple]:52:10)
  //->[2015-06-06 14:01:31.294] [E][36386][3000][20M][ M ] category - test error  (full_logger.js:[getApple]:53:10)
}

getApple();

```

OR

```js
var log4jx = require("log4jx");

/// set output format
var log4js = log4jx({
  path  : __dirname,
  format: "[@date] [@level][@pid][@port][@memory][@worker] @category -@data (@file:[@method]:@line:@column)"
});

/// set port number if you need `@port` tag
process.port = 3000;

function getApple() {
  console.log("test console");

  //->[2015-06-06 14:01:31.288] [I][36386][3000][20M][ M ] console - test console  (logger.js:[getApple]:48:10)
}

getApple();

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
* @level    : 日志级别 [I:INFO|D:DEBUG|W:WARN|E:ERROR]
* @category : 别名
* @worker   : [W-n:worker-n | M:master]
* @memory   : 当前进程占用内存[100MB]
* @pid      : 进程号
* @port     : 端口号(process.port赋值)

License
---------
Version 0.0.4
