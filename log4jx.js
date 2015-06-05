var path = require("path");
var colours = {
  ALL: "grey",
  TRACE: "blue",
  DEBUG: "cyan",
  INFO: "green",
  WARN: "yellow",
  ERROR: "red",
  FATAL: "magenta",
  OFF: "grey"
};
var styles = {
  //styles
  'bold'      : [1,  22],
  'italic'    : [3,  23],
  'underline' : [4,  24],
  'inverse'   : [7,  27],
  //grayscale
  'white'     : [37, 39],
  'grey'      : [90, 39],
  'black'     : [90, 39],
  //colors
  'blue'      : [34, 39],
  'cyan'      : [36, 39],
  'green'     : [32, 39],
  'magenta'   : [35, 39],
  'red'       : [31, 39],
  'yellow'    : [33, 39]
};

function colorizeStart(style) {
  return style ? '\x1B[' + styles[style][0] + 'm' : '';
}
function colorizeEnd(style) {
  return style ? '\x1B[' + styles[style][1] + 'm' : '';
}
function colorize (str, style) {
  return colorizeStart(style) + str + colorizeEnd(style);
}

// override instance methods
function extend(log4js) {
  var logger = log4js.getLogger();
  ["trace", "debug", "info", "warn", "error", "fatal"].forEach(function (method) {
    var original = logger.constructor.prototype[method];
    logger.constructor.prototype[method] = function log() {
      var args = [].slice.call(arguments),
        trace = getTrace(log);
      args.push(colorize(formatter(trace),colours[method.toUpperCase()]));
      return original.apply(this, args);
    };
  });
}

function prepareStackTrace(error, structuredStackTrace) {
  var trace = structuredStackTrace[0];
  return {
    // method name
    name: trace.getMethodName() || trace.getFunctionName() || "<anonymous>",
    // file name
    file: trace.getFileName(),
    // line number
    line: trace.getLineNumber(),
    // column number
    column: trace.getColumnNumber()
  };
}

function getTrace(caller) {
  var original = Error.prepareStackTrace,
    error = {};
  Error.captureStackTrace(error, caller || getTrace);
  Error.prepareStackTrace = prepareStackTrace;
  var stack = error.stack;
  Error.prepareStackTrace = original;
  return stack;
}

// format trace
function formatter(trace) {
  if (trace.file) {
    // absolute path -> relative path
    exports.path && (trace.file = path.relative(exports.path, trace.file));
  } else {
    trace.file = "";
  }

  return exports.format
    .split("@name").join(trace.name)
    .split("@file").join(trace.file)
    .split("@line").join(trace.line)
    .split("@column").join(trace.column);
}

var extended = false;
exports = module.exports = function (log4js, options) {
  extended || extend(log4js);
  extended = true;

  // init
  exports.path = null;
  exports.format = "at @name (@file:@line:@column)";

  options || (options = {});
  options.path && (exports.path = options.path);
  options.format && (exports.format = options.format);

  return log4js;
};
