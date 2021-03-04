"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warnIfDependenciesRequireAdditionalSetup = warnIfDependenciesRequireAdditionalSetup;
exports.getSetupWarnings = getSetupWarnings;

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _semver() {
  const data = _interopRequireDefault(require("semver"));

  _semver = function () {
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

function CreateApp() {
  const data = _interopRequireWildcard(require("../utils/CreateApp"));

  CreateApp = function () {
    return data;
  };

  return data;
}

function _TerminalLink() {
  const data = require("../utils/TerminalLink");

  _TerminalLink = function () {
    return data;
  };

  return data;
}

function _configureProjectAsync() {
  const data = require("./configureProjectAsync");

  _configureProjectAsync = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Some packages are not configured automatically on eject and may require
 * users to add some code, eg: to their AppDelegate.
 */
function warnIfDependenciesRequireAdditionalSetup(pkg, sdkVersion, appliedPlugins) {
  const warnings = getSetupWarnings({
    pkg,
    sdkVersion,
    appliedPlugins: appliedPlugins !== null && appliedPlugins !== void 0 ? appliedPlugins : [],
    autoPlugins: _configureProjectAsync().expoManagedPlugins
  });
  logSetupWarnings(warnings);
  return warnings;
} // Exposed for testing


function getSetupWarnings({
  pkg,
  sdkVersion,
  appliedPlugins,
  autoPlugins
}) {
  const pkgsWithExtraSetup = autoPlugins.filter(plugin => !(appliedPlugins === null || appliedPlugins === void 0 ? void 0 : appliedPlugins.includes(plugin))).reduce((prev, curr) => ({ ...prev,
    [curr]: `https://github.com/expo/expo/tree/master/packages/${curr}`
  }), {}); // Starting with SDK 40 the manifest is embedded in ejected apps automatically

  if (sdkVersion && _semver().default.lte(sdkVersion, '39.0.0')) {
    pkgsWithExtraSetup['expo-constants'] = `${_chalk().default.bold('Constants.manifest')} is not available in the bare workflow. You should replace it with ${_chalk().default.bold('Updates.manifest')}. ${_log().default.chalk.dim((0, _TerminalLink().learnMore)('https://docs.expo.io/versions/latest/sdk/updates/#updatesmanifest'))}`;
  }

  const warnings = Object.keys(pkg.dependencies).reduce((prev, key) => {
    if (!(key in pkgsWithExtraSetup)) {
      return prev;
    }

    return { ...prev,
      [key]: pkgsWithExtraSetup[key]
    };
  }, {});
  return warnings;
}

function logSetupWarnings(warnings) {
  const warningLength = Object.keys(warnings).length;

  if (!warningLength) {
    return;
  }

  _log().default.newLine();

  const warnAdditionalSetupStep = CreateApp().logNewSection('Checking if any additional setup steps are required for installed SDK packages.');
  const plural = warningLength > 1;
  warnAdditionalSetupStep.stopAndPersist({
    symbol: '⚠️ ',
    text: _chalk().default.yellow.bold(`The app has ${warningLength} package${plural ? 's' : ''} that require${plural ? '' : 's'} extra setup before building:`)
  });

  for (const [pkgName, message] of Object.entries(warnings)) {
    _log().default.nested(`\u203A ${_chalk().default.bold(pkgName)}: ${message}`);
  }
}
//# sourceMappingURL=setupWarnings.js.map