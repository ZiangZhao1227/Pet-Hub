"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionAsync = actionAsync;
exports.default = _default;

function _config() {
  const data = require("@expo/config");

  _config = function () {
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

function _CommandError() {
  const data = _interopRequireDefault(require("../CommandError"));

  _CommandError = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _prompts() {
  const data = require("../prompts");

  _prompts = function () {
    return data;
  };

  return data;
}

function _ejectAsync() {
  const data = require("./eject/ejectAsync");

  _ejectAsync = function () {
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

function _TerminalLink() {
  const data = require("./utils/TerminalLink");

  _TerminalLink = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function userWantsToEjectWithoutUpgradingAsync() {
  const answer = await (0, _prompts().confirmAsync)({
    message: `We recommend upgrading to the latest SDK version before ejecting. SDK 37 introduces support for OTA updates and notifications in ejected projects, and includes many features that make ejecting your project easier. Would you like to continue ejecting anyways?`
  });
  return answer;
}

async function actionAsync(projectDir, {
  platform,
  ...options
}) {
  const {
    exp
  } = (0, _config().getConfig)(projectDir);

  if (options.npm) {
    options.packageManager = 'npm';
  } // Set EXPO_VIEW_DIR to universe/exponent to pull expo view code locally instead of from S3 for ExpoKit


  if (_xdl().Versions.lteSdkVersion(exp, '36.0.0')) {
    if (options.force || (await userWantsToEjectWithoutUpgradingAsync())) {
      throw new (_CommandError().default)(`Ejecting to ExpoKit is now deprecated. Upgrade to Expo SDK +37 or downgrade to expo-cli@4.1.3`);
    }
  } else {
    _log().default.debug('Eject Mode: Latest');

    await (0, _ejectAsync().ejectAsync)(projectDir, { ...options,
      platforms: (0, _platformOptions().platformsFromPlatform)(platform)
    });
  }
}

function _default(program) {
  program.command('eject [path]').description(`Create native iOS and Android project files. ${_chalk().default.dim((0, _TerminalLink().learnMore)('https://docs.expo.io/bare/customizing/'))}`).longDescription('Create Xcode and Android Studio projects for your app. Use this if you need to add custom native functionality.').helpGroup('eject').option('--no-install', 'Skip installing npm packages and CocoaPods.').option('--npm', 'Use npm to install dependencies. (default when Yarn is not installed)').option('-p, --platform [platform]', 'Platforms to sync: ios, android, all. Default: all').asyncActionProjectDir(actionAsync);
}
//# sourceMappingURL=eject.js.map