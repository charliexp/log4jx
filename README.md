## log4jx 
---------

[中文文档](https://github.com/gynmi/log4jx/blob/master/README_CN.md)

`log4js-node` extend
This module is to learn from the `log4js-node-extend` module

Simply adding a few lines of code to the existing log4js print log can use a custom layout.

You can freely add process, execute the file path, tracing function, line number, column number, memory control, port number etc.
@data is the output of print content.
The layout of the @data before and after the layout can increase or decrease, but the label before and after @data can not be interchangeable.
For more use, see the example.

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

/// Just add 4 ~ 5 lines of code can have tracking the function of the output code
log4jx(log4js, {
  path  : __dirname,
  format: "[@date] [@level][@pid][@port][@memory][@worker] @category -@data (@file:[@method]:@line:@column)"
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
  console.log("test console");
  logger.info("test info");
  logger.debug("test debug");
  logger.debug("test debug", {name:"tom"},{age:100});
  logger.warn("test warn");
  logger.error("test error");
  
  //->[2015-06-06 14:01:31.288] [I][36386][3000][20M][ M ] console - test console  (loggerTest.js:[getApple]:48:10)
  //->[2015-06-06 14:01:31.291] [I][36386][3000][20M][ M ] category - test info  (loggerTest.js:[getApple]:49:10)
  //->[2015-06-06 14:01:31.292] [D][36386][3000][20M][ M ] category - test debug  (loggerTest.js:[getApple]:50:10)
  //->[2015-06-06 14:01:31.292] [D][36386][3000][20M][ M ] category - test debug object { name: 'tom' } { age: 100 }  (loggerTest.js:[getApple]:51:10)
  //->[2015-06-06 14:01:31.294] [W][36386][3000][20M][ M ] category - test warn  (loggerTest.js:[getApple]:52:10)
  //->[2015-06-06 14:01:31.294] [E][36386][3000][20M][ M ] category - test error  (loggerTest.js:[getApple]:53:10)
}

getApple();

```

OR

```js
var log4jx = require("log4jx");

/// Just add 4 ~ 5 lines of code can have tracking the function of the output code
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
The path of the current execution file is a reference, showing the relative path
If you do not pass this parameter, the absolute path is shown

default: `null`

### Format
output format

default: `"[@date] [@level] @category -@data [@method] (@file:@line:@column)"`

#### All the following parameters:
* @name     : function name
* @file     : current file name
* @line     : line number
* @column   : column number
* @date     : current date time
* @level    : log level [I:INFO|D:DEBUG|W:WARN|E:ERROR]
* @category : another name
* @worker   : [W-n:worker-n | M:master]
* @memory   : [100MB]
* @pid      : process number
* @port     : port number

License
---------
Version 0.0.4
