"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateDependenciesVersionsAsync = validateDependenciesVersionsAsync;

function _jsonFile() {
  const data = _interopRequireDefault(require("@expo/json-file"));

  _jsonFile = function () {
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

function _intersection() {
  const data = _interopRequireDefault(require("lodash/intersection"));

  _intersection = function () {
    return data;
  };

  return data;
}

function _resolveFrom() {
  const data = _interopRequireDefault(require("resolve-from"));

  _resolveFrom = function () {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function validateDependenciesVersionsAsync(projectRoot, exp, pkg) {
  if (!_xdl().Versions.gteSdkVersion(exp, '33.0.0')) {
    return;
  }

  const bundleNativeModulesPath = _resolveFrom().default.silent(projectRoot, 'expo/bundledNativeModules.json');

  if (!bundleNativeModulesPath) {
    _log().default.warn(`Your project is in SDK version >= 33.0.0, but the ${_chalk().default.underline('expo')} package version seems to be older.`);

    return;
  }

  const bundledNativeModules = await _jsonFile().default.readAsync(bundleNativeModulesPath);
  const bundledNativeModulesNames = Object.keys(bundledNativeModules);
  const projectDependencies = Object.keys(pkg.dependencies || []);
  const modulesToCheck = (0, _intersection().default)(bundledNativeModulesNames, projectDependencies);
  const incorrectDeps = [];

  for (const moduleName of modulesToCheck) {
    const expectedRange = bundledNativeModules[moduleName];
    const actualRange = pkg.dependencies[moduleName];

    if ((_semver().default.valid(actualRange) || _semver().default.validRange(actualRange)) && typeof expectedRange === 'string' && !_semver().default.intersects(expectedRange, actualRange)) {
      incorrectDeps.push({
        moduleName,
        expectedRange,
        actualRange
      });
    }
  }

  if (incorrectDeps.length > 0) {
    _log().default.warn('Some dependencies are incompatible with the installed expo package version:');

    incorrectDeps.forEach(({
      moduleName,
      expectedRange,
      actualRange
    }) => {
      _log().default.warn(` - ${_chalk().default.underline(moduleName)} - expected version range: ${_chalk().default.underline(expectedRange)} - actual version installed: ${_chalk().default.underline(actualRange)}`);
    });

    _log().default.warn('Your project may not work correctly until you install the correct versions of the packages.\n' + `To install the correct versions of these packages, please run: ${_chalk().default.inverse('expo install [package-name ...]')}`);
  }
}
//# sourceMappingURL=validateDependenciesVersions.js.map