"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionAsync = actionAsync;
exports.default = _default;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _clearNativeFolder() {
  const data = require("./eject/clearNativeFolder");

  _clearNativeFolder = function () {
    return data;
  };

  return data;
}

function _platformOptions() {
  const data = require("./eject/platformOptions");

  _platformOptions = function () {
    return data;
  };

  return data;
}

function _prebuildAsync() {
  const data = require("./eject/prebuildAsync");

  _prebuildAsync = function () {
    return data;
  };

  return data;
}

function _TerminalLink() {
  const data = require("./utils/TerminalLink");

  _TerminalLink = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function actionAsync(projectDir, {
  platform,
  ...options
}) {
  if (options.npm) {
    options.packageManager = 'npm';
  }

  const platforms = (0, _platformOptions().platformsFromPlatform)(platform); // Clear the native folders before syncing

  await (0, _clearNativeFolder().clearNativeFolder)(projectDir, platforms);
  await (0, _prebuildAsync().prebuildAsync)(projectDir, { ...options,
    platforms
  });
}

function _default(program) {
  program.command('prebuild [path]').description(`Experimental: Create native iOS and Android project files before building natively. ${_chalk().default.dim((0, _TerminalLink().learnMore)('https://docs.expo.io/bare/customizing/'))}`).longDescription('Generate the native iOS and Android projects for your app before building them. The generated code should not be modified directly, instead config plugins should be used to make modifications.').helpGroup('eject').option('--no-install', 'Skip installing npm packages and CocoaPods.').option('--npm', 'Use npm to install dependencies. (default when Yarn is not installed)').option('-p, --platform [platform]', 'Platforms to sync: ios, android, all. Default: all').asyncActionProjectDir(actionAsync);
}
//# sourceMappingURL=prebuild.js.map