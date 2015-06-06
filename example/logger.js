var log4js = require("log4js");
var log4jx = require("../log4jx");

log4jx(log4js, {
  path         : __dirname,
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

var logger = getLogger("category", 'DEBUG');

function getApple() {
  console.log("测试内容console");
  logger.info("测试内容0");
  logger.debug("测试内容1");
  logger.debug("测试内容1", {name:"tom"},{age1:100});
  logger.warn("测试内容2");
  logger.error("测试内容3");
}

getApple();