"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _commander() {
  const data = _interopRequireDefault(require("commander"));

  _commander = function () {
    return data;
  };

  return data;
}

function _getenv() {
  const data = require("getenv");

  _getenv = function () {
    return data;
  };

  return data;
}

function _terminalLink() {
  const data = _interopRequireDefault(require("terminal-link"));

  _terminalLink = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isProfiling = (0, _getenv().boolish)('EXPO_PROFILE', false); // eslint-disable-next-line no-console

const consoleTime = isProfiling ? console.time : () => {}; // eslint-disable-next-line no-console

const consoleTimeEnd = isProfiling ? console.timeEnd : () => {};

class Log {
  static log(...args) {
    Log.respectProgressBars(() => {
      Log.consoleLog(...Log.withPrefix(args));
    });
  }

  static nested(message) {
    Log.respectProgressBars(() => {
      Log.consoleLog(message);
    });
  }

  static newLine() {
    Log.respectProgressBars(() => {
      Log.consoleLog();
    });
  }

  static addNewLineIfNone() {
    if (!Log._isLastLineNewLine && !Log._printNewLineBeforeNextLog) {
      Log.newLine();
    }
  }

  static printNewLineBeforeNextLog() {
    Log._printNewLineBeforeNextLog = true;
  }

  static setBundleProgressBar(bar) {
    Log._bundleProgressBar = bar;
  }

  static setSpinner(oraSpinner) {
    Log._oraSpinner = oraSpinner;

    if (Log._oraSpinner) {
      const originalStart = Log._oraSpinner.start.bind(Log._oraSpinner);

      Log._oraSpinner.start = text => {
        // Reset the new line tracker
        Log._isLastLineNewLine = false;
        return originalStart(text);
      }; // All other methods of stopping will invoke the stop method.


      const originalStop = Log._oraSpinner.stop.bind(Log._oraSpinner);

      Log._oraSpinner.stop = () => {
        // Reset the target spinner
        Log.setSpinner(null);
        return originalStop();
      };
    }
  }

  static error(...args) {
    Log.respectProgressBars(() => {
      Log.consoleError(...Log.withPrefixAndTextColor(args, _chalk().default.red));
    });
  }

  static nestedError(message) {
    Log.respectProgressBars(() => {
      Log.consoleError(_chalk().default.red(message));
    });
  }

  static warn(...args) {
    Log.respectProgressBars(() => {
      Log.consoleWarn(...Log.withPrefixAndTextColor(args, _chalk().default.yellow));
    });
  } // Only show these logs when EXPO_DEBUG is active


  static debug(...args) {
    if (!Log.isDebug) {
      return;
    }

    Log.respectProgressBars(() => {
      Log.consoleDebug(...Log.withPrefixAndTextColor(args));
    });
  }

  static info(...args) {
    if (!Log.isDebug) {
      return;
    }

    Log.respectProgressBars(() => {
      Log.consoleInfo(...args);
    });
  }

  static nestedWarn(message) {
    Log.respectProgressBars(() => {
      Log.consoleWarn(_chalk().default.yellow(message));
    });
  }

  static gray(...args) {
    Log.respectProgressBars(() => {
      Log.consoleLog(...Log.withPrefixAndTextColor(args));
    });
  }

  static clear() {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
  }

  static _updateIsLastLineNewLine(args) {
    if (args.length === 0) {
      Log._isLastLineNewLine = true;
    } else {
      const lastArg = args[args.length - 1];

      if (typeof lastArg === 'string' && (lastArg === '' || lastArg.match(/[\r\n]$/))) {
        Log._isLastLineNewLine = true;
      } else {
        Log._isLastLineNewLine = false;
      }
    }
  }

  static _maybePrintNewLine() {
    if (Log._printNewLineBeforeNextLog) {
      Log._printNewLineBeforeNextLog = false;
      console.log(); // eslint-disable-line no-console
    }
  }

  static consoleDebug(...args) {
    Log._maybePrintNewLine();

    Log._updateIsLastLineNewLine(args);

    console.debug(...args); // eslint-disable-line no-console
  }

  static consoleInfo(...args) {
    Log._maybePrintNewLine();

    Log._updateIsLastLineNewLine(args);

    console.info(...args); // eslint-disable-line no-console
  }

  static consoleLog(...args) {
    Log._maybePrintNewLine();

    Log._updateIsLastLineNewLine(args);

    console.log(...args); // eslint-disable-line no-console
  }

  static consoleWarn(...args) {
    Log._maybePrintNewLine();

    Log._updateIsLastLineNewLine(args);

    console.warn(...args); // eslint-disable-line no-console
  }

  static consoleError(...args) {
    Log._maybePrintNewLine();

    Log._updateIsLastLineNewLine(args);

    console.error(...args); // eslint-disable-line no-console
  }

  static respectProgressBars(commitLogs) {
    if (Log._bundleProgressBar) {
      Log._bundleProgressBar.terminate();

      Log._bundleProgressBar.lastDraw = '';
    }

    if (Log._oraSpinner) {
      Log._oraSpinner.stop();
    }

    commitLogs();

    if (Log._bundleProgressBar) {
      Log._bundleProgressBar.render();
    }

    if (Log._oraSpinner) {
      Log._oraSpinner.start();
    }
  }

  static getPrefix(chalkColor) {
    return chalkColor(`[${new Date().toTimeString().slice(0, 8)}]`);
  }

  static withPrefixAndTextColor(args, chalkColor = _chalk().default.gray) {
    if (_commander().default.nonInteractive) {
      return [Log.getPrefix(chalkColor), ...args.map(arg => chalkColor(arg))];
    } else {
      return args.map(arg => chalkColor(arg));
    }
  }

  static withPrefix(args, chalkColor = _chalk().default.gray) {
    if (_commander().default.nonInteractive) {
      return [Log.getPrefix(chalkColor), ...args];
    } else {
      return args;
    }
  }

}

exports.default = Log;

_defineProperty(Log, "chalk", _chalk().default);

_defineProperty(Log, "terminalLink", _terminalLink().default);

_defineProperty(Log, "isDebug", (0, _getenv().boolish)('EXPO_DEBUG', false));

_defineProperty(Log, "isProfiling", isProfiling);

_defineProperty(Log, "time", consoleTime);

_defineProperty(Log, "timeEnd", consoleTimeEnd);

_defineProperty(Log, "_bundleProgressBar", void 0);

_defineProperty(Log, "_oraSpinner", void 0);

_defineProperty(Log, "_printNewLineBeforeNextLog", false);

_defineProperty(Log, "_isLastLineNewLine", false);
//# sourceMappingURL=log.js.map