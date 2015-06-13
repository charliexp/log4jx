var log4js = require("log4js");
var log4jx = require("../index");

/// 只需要添加4～5行代码就可以拥有追踪输出代码的功能
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