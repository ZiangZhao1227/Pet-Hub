"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installExitHooks = installExitHooks;

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

function _ora() {
  const data = _interopRequireDefault(require("ora"));

  _ora = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function installExitHooks(projectRoot) {
  const killSignals = ['SIGINT', 'SIGTERM'];

  for (const signal of killSignals) {
    process.on(signal, () => {
      const spinner = (0, _ora().default)({
        text: 'Stopping server',
        color: 'white'
      }).start();

      _log().default.setSpinner(spinner);

      _xdl().Project.stopAsync(projectRoot).then(() => {
        spinner.stopAndPersist({
          text: 'Stopped server',
          symbol: `\u203A`
        });
        process.exit();
      }).catch(error => {
        spinner.fail('Failed to stop server');

        _log().default.error(error);
      });
    });
  }
}
//# sourceMappingURL=installExitHooks.js.map