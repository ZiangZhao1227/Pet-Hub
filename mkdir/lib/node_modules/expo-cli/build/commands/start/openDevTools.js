"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryOpeningDevToolsAsync = tryOpeningDevToolsAsync;

function _devTools() {
  const data = require("@expo/dev-tools");

  _devTools = function () {
    return data;
  };

  return data;
}

function _xdl() {
  const data = require("@expo/xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
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

function TerminalUI() {
  const data = _interopRequireWildcard(require("./TerminalUI"));

  TerminalUI = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore: not typed
async function tryOpeningDevToolsAsync(projectRoot, {
  exp,
  options
}) {
  const devToolsUrl = await _devTools().DevToolsServer.startAsync(projectRoot);

  _log().default.log(`Developer tools running on ${_chalk().default.underline(devToolsUrl)}`);

  if (!options.nonInteractive && !exp.isDetached) {
    if (await _xdl().UserSettings.getAsync('openDevToolsAtStartup', true)) {
      TerminalUI().openDeveloperTools(devToolsUrl);
    }
  }
}
//# sourceMappingURL=openDevTools.js.map