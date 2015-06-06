var path = require("path");
var util = require('util');
var cluster = require("cluster");
var dateFormat = require('./lib/date_format');

var colours = {
  ALL  : "grey",
  TRACE: "blue",
  DEBUG: "cyan",
  INFO : "green",
  WARN : "yellow",
  ERROR: "red",
  FATAL: "magenta",
  OFF  : "grey"
};

var styles = {
  //styles
  'bold'     : [1, 22],
  'italic'   : [3, 23],
  'underline': [4, 24],
  'inverse'  : [7, 27],
  //grayscale
  'white'    : [37, 39],
  'grey'     : [90, 39],
  'black'    : [90, 39],
  //colors
  'blue'     : [34, 39],
  'cyan'     : [36, 39],
  'green'    : [32, 39],
  'magenta'  : [35, 39],
  'red'      : [31, 39],
  'yellow'   : [33, 39]
};

// override instance methods
function extend(log4js) {
  var logger = log4js.getLogger();
  log4js.layouts.colouredLayout = colouredLayout;
  ["trace", "debug", "info", "warn", "error", "fatal"].forEach(function (method) {
    var original = logger.constructor.prototype[method];
    logger.constructor.prototype[method] = function log() {
      var args = [''].concat([].slice.call(arguments));
      var trace = getTrace(log);
      args.push(colorize(format(trace, exports.format.split('@data')[1]), colours[method.toUpperCase()]));
      return original.apply(this, args);
    };
  });
}

function prepareStackTrace(error, structuredStackTrace) {
  var trace = structuredStackTrace[0];
  return {
    // file name
    file  : trace.getFileName(),
    // line number
    line  : trace.getLineNumber(),
    // column number
    column: trace.getColumnNumber(),
    // method name
    method: trace.getMethodName() || trace.getFunctionName() || "<anonymous>"
  };
}

function getTrace(caller) {
  var original = Error.prepareStackTrace;
  var error = {};
  Error.captureStackTrace(error, caller || getTrace);
  Error.prepareStackTrace = prepareStackTrace;
  var stack = error.stack;
  Error.prepareStackTrace = original;
  return error.stack;
}

// format trace
function format(trace, format) {
  if (trace.file) {
    // absolute path -> relative path
    exports.path && (trace.file = path.relative(exports.path, trace.file));
  } else {
    trace.file = "";
  }

  return format
    .split("@file").join(trace.file)
    .split("@line").join(trace.line)
    .split("@method").join(trace.method)
    .split("@column").join(trace.column)

    //.split("@data").join(formatLogData(trace.data))

    .split("@date").join(trace.startTime ? dateFormat.asString(trace.startTime) : '@date')
    .split("@level").join(trace.level)
    .split("@category").join(trace.categoryName)
    .split("@pid").join(process.pid || '@pid')
    .split("@port").join(process.port || '@port')
    .split("@worker").join(((cluster.worker && cluster.worker.id) ? "worker-" + cluster.worker.id : "master"));
}


function colorizeStart(style) {
  return style ? '\x1B[' + styles[style][0] + 'm' : '';
}

function colorizeEnd(style) {
  return style ? '\x1B[' + styles[style][1] + 'm' : '';
}

function colorize(str, style) {
  return colorizeStart(style) + str + colorizeEnd(style);
}


/**
 * colouredLayout - taken from masylum's fork.
 * same as basicLayout, but with colours.
 */
function colouredLayout(loggingEvent) {
  return timestampLevelAndCategory(
      loggingEvent,
      colours[loggingEvent.level.toString()]
    ) + formatLogData(loggingEvent.data);
}

function timestampLevelAndCategory(loggingEvent, colour) {
  return colorize(
    format(loggingEvent, exports.format.split('@data')[0])
    , colour
  );
}

function formatLogData(logData) {
  var data = Array.isArray(logData) ? logData : Array.prototype.slice.call(arguments);
  return util.format.apply(util, wrapErrorsWithInspect(data));
}

function wrapErrorsWithInspect(items) {
  return items.map(function (item) {
    if ((item instanceof Error) && item.stack) {
      return {
        inspect: function () {
          return util.format(item) + '\n' + item.stack;
        }
      };
    } else {
      return item;
    }
  });
}

var extended = false;

exports = module.exports = function (log4js, options) {
  extended || extend(log4js);
  extended = true;

  // init
  exports.path = null;
  exports.format = "[@date] [@level] @category -@data [@method] (@file:@line:@column)";

  if (options && options.format) {
    var dataIndex = options.format.indexOf('@data');
    if (dataIndex === -1) {
      throw new Error('@data require in format param');
    }
    if (options.format.indexOf('@date') > dataIndex
      || options.format.indexOf('@level') > dataIndex
      || options.format.indexOf('@category') > dataIndex) {
      throw new Error('@data must after @date,@level,@category');
    }
  }

  options || (options = {});
  options.path && (exports.path = options.path);
  options.format && (exports.format = options.format);

  return log4js;
};