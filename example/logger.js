var log4jx = require("../index");

/// set output format
var log4js = log4jx({
  path  : __dirname,
  format: "[@date] [@level][@pid][@port][@memory][@worker] @category -@data (@file:[@method]:@line:@column)"
});

/// set port number if you need `@port` tag
process.port = 3000;

/**
 * default log4js configure
 * customize your configuration
 *
 * log4js.configure({
 *    appenders     : [
 *      {
 *        type: 'console'
 *      }
 *    ],
 *    replaceConsole: true
 * });
 */
//log4js.configure({
//  appenders     : [
//    {
//      type: 'console'
//    }
//  ],
//  replaceConsole: false
//});

function getApple() {
  console.log("test console");

  //->[2015-06-06 14:01:31.288] [I][36386][3000][20M][ M ] console - test console  (loggerTest.js:[getApple]:48:10)
}

getApple();