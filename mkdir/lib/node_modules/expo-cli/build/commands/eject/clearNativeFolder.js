"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearNativeFolder = clearNativeFolder;
exports.promptToClearMalformedNativeProjectsAsync = promptToClearMalformedNativeProjectsAsync;

function _configPlugins() {
  const data = require("@expo/config-plugins");

  _configPlugins = function () {
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

function _commander() {
  const data = _interopRequireDefault(require("commander"));

  _commander = function () {
    return data;
  };

  return data;
}

function fs() {
  const data = _interopRequireWildcard(require("fs-extra"));

  fs = function () {
    return data;
  };

  return data;
}

function path() {
  const data = _interopRequireWildcard(require("path"));

  path = function () {
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

function _prompts() {
  const data = require("../../prompts");

  _prompts = function () {
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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function directoryExistsAsync(file) {
  var _await$fs$stat$catch$, _await$fs$stat$catch;

  return (_await$fs$stat$catch$ = (_await$fs$stat$catch = await fs().stat(file).catch(() => null)) === null || _await$fs$stat$catch === void 0 ? void 0 : _await$fs$stat$catch.isDirectory()) !== null && _await$fs$stat$catch$ !== void 0 ? _await$fs$stat$catch$ : false;
}

async function clearNativeFolder(projectRoot, folders) {
  const step = CreateApp().logNewSection(`Clearing ${folders.join(', ')}`);

  try {
    await Promise.all(folders.map(folderName => fs().remove(path().join(projectRoot, folderName))));
    step.succeed(`Cleared ${folders.join(', ')} code`);
  } catch (error) {
    step.fail(`Failed to delete ${folders.join(', ')} code: ${error.message}`);
    throw error;
  }
}

async function isAndroidProjectValidAsync(projectRoot) {
  // Only perform the check if the native folder is present.
  if (!(await directoryExistsAsync(path().join(projectRoot, 'android')))) {
    return true;
  }

  try {
    await Promise.all([_configPlugins().AndroidConfig.Paths.getAppBuildGradleAsync(projectRoot), _configPlugins().AndroidConfig.Paths.getProjectBuildGradleAsync(projectRoot), _configPlugins().AndroidConfig.Paths.getAndroidManifestAsync(projectRoot), _configPlugins().AndroidConfig.Paths.getMainApplicationAsync(projectRoot)]);
    return true;
  } catch (_unused) {
    return false;
  }
}

async function isIOSProjectValidAsync(projectRoot) {
  // Only perform the check if the native folder is present.
  if (!(await directoryExistsAsync(path().join(projectRoot, 'ios')))) {
    return true;
  }

  try {
    // If any of the following required files are missing, then the project is malformed.
    await Promise.all([_configPlugins().IOSConfig.Paths.getAppDelegate(projectRoot), _configPlugins().IOSConfig.Paths.getAllXcodeProjectPaths(projectRoot), _configPlugins().IOSConfig.Paths.getAllInfoPlistPaths(projectRoot), _configPlugins().IOSConfig.Paths.getAllPBXProjectPaths(projectRoot)]);
    return true;
  } catch (_unused2) {
    return false;
  }
}

async function promptToClearMalformedNativeProjectsAsync(projectRoot) {
  const [isAndroidValid, isIOSValid] = await Promise.all([isAndroidProjectValidAsync(projectRoot), isIOSProjectValidAsync(projectRoot)]);

  if (isAndroidValid && isIOSValid) {
    return;
  }

  const platforms = [!isAndroidValid && 'android', !isIOSValid && 'ios'].filter(Boolean);
  const displayPlatforms = platforms.map(platform => _chalk().default.cyan(platform)); // Prompt which platforms to reset.

  const message = platforms.length > 1 ? `The ${displayPlatforms[0]} and ${displayPlatforms[1]} projects are malformed` : `The ${displayPlatforms[0]} project is malformed`;

  if ( // If the process is non-interactive, default to clearing the malformed native project.
  // This would only happen on re-running eject.
  _commander().default.nonInteractive || ( // Prompt to clear the native folders.
  await (0, _prompts().confirmAsync)({
    message: `${message}, would you like to clear the project files and reinitialize them?`,
    initial: true
  }))) {
    await clearNativeFolder(projectRoot, platforms);
  } else {
    // Warn the user that the process may fail.
    _log().default.warn('Continuing with malformed native projects');
  }
}
//# sourceMappingURL=clearNativeFolder.js.map