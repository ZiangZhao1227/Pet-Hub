"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNativeProjectsFromTemplateAsync = createNativeProjectsFromTemplateAsync;
exports.resolveBareEntryFile = resolveBareEntryFile;

function _paths() {
  const data = require("@expo/config/paths");

  _paths = function () {
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

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
    return data;
  };

  return data;
}

function _npmPackageArg() {
  const data = _interopRequireDefault(require("npm-package-arg"));

  _npmPackageArg = function () {
    return data;
  };

  return data;
}

function _pacote() {
  const data = _interopRequireDefault(require("pacote"));

  _pacote = function () {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
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

function _CommandError() {
  const data = require("../../CommandError");

  _CommandError = function () {
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

function _extractTemplateAppAsync() {
  const data = require("../../utils/extractTemplateAppAsync");

  _extractTemplateAppAsync = function () {
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

function GitIgnore() {
  const data = _interopRequireWildcard(require("../utils/GitIgnore"));

  GitIgnore = function () {
    return data;
  };

  return data;
}

function _updatePackageJson() {
  const data = require("./updatePackageJson");

  _updatePackageJson = function () {
    return data;
  };

  return data;
}

function _writeMetroConfig() {
  const data = require("./writeMetroConfig");

  _writeMetroConfig = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function directoryExistsAsync(file) {
  var _await$fs$stat$catch$, _await$fs$stat$catch;

  return (_await$fs$stat$catch$ = (_await$fs$stat$catch = await _fsExtra().default.stat(file).catch(() => null)) === null || _await$fs$stat$catch === void 0 ? void 0 : _await$fs$stat$catch.isDirectory()) !== null && _await$fs$stat$catch$ !== void 0 ? _await$fs$stat$catch$ : false;
}
/**
 *
 * @param projectRoot
 * @param tempDir
 *
 * @return `true` if the project is ejecting, and `false` if it's syncing.
 */


async function createNativeProjectsFromTemplateAsync({
  projectRoot,
  exp,
  pkg,
  tempDir,
  platforms
}) {
  const copiedPaths = await cloneNativeDirectoriesAsync({
    projectRoot,
    tempDir,
    exp,
    pkg,
    platforms
  });
  (0, _writeMetroConfig().writeMetroConfig)({
    projectRoot,
    pkg,
    tempDir
  });
  const depsResults = await (0, _updatePackageJson().updatePackageJSONAsync)({
    projectRoot,
    tempDir,
    pkg
  });
  return {
    hasNewProjectFiles: !!copiedPaths.length,
    // If the iOS folder changes or new packages are added, we should rerun pod install.
    needsPodInstall: copiedPaths.includes('ios') || depsResults.hasNewDependencies || depsResults.hasNewDevDependencies,
    ...depsResults
  };
}
/**
 * Extract the template and copy the ios and android directories over to the project directory.
 *
 * @param force should create native projects even if they already exist.
 * @return `true` if any project files were created.
 */


async function cloneNativeDirectoriesAsync({
  projectRoot,
  tempDir,
  exp,
  pkg,
  platforms
}) {
  const templateSpec = await validateBareTemplateExistsAsync(exp.sdkVersion); // NOTE(brentvatne): Removing spaces between steps for now, add back when
  // there is some additional context for steps

  const creatingNativeProjectStep = CreateApp().logNewSection('Creating native project directories (./ios and ./android) and updating .gitignore');
  const targetPaths = getTargetPaths(projectRoot, pkg, platforms);
  let copiedPaths = [];
  let skippedPaths = [];

  try {
    await (0, _extractTemplateAppAsync().extractTemplateAppAsync)(templateSpec, tempDir, exp);
    [copiedPaths, skippedPaths] = await copyPathsFromTemplateAsync(projectRoot, tempDir, targetPaths);
    const results = GitIgnore().mergeGitIgnorePaths(_path().default.join(projectRoot, '.gitignore'), _path().default.join(tempDir, '.gitignore'));
    let message = `Created native project${platforms.length > 1 ? 's' : ''}`;

    if (skippedPaths.length) {
      message += _log().default.chalk.dim(` | ${skippedPaths.map(path => _log().default.chalk.bold(`/${path}`)).join(', ')} already created`);
    }

    if (!(results === null || results === void 0 ? void 0 : results.didMerge)) {
      message += _log().default.chalk.dim(` | gitignore already synced`);
    } else if (results.didMerge && results.didClear) {
      message += _log().default.chalk.dim(` | synced gitignore`);
    }

    creatingNativeProjectStep.succeed(message);
  } catch (e) {
    _log().default.error(e.message);

    creatingNativeProjectStep.fail('Failed to create the native project - see the output above for more information.');

    _log().default.log(_chalk().default.yellow('You may want to delete the `./ios` and/or `./android` directories before running eject again.'));

    throw new (_CommandError().SilentError)(e);
  }

  return copiedPaths;
}

async function validateBareTemplateExistsAsync(sdkVersion) {
  // Validate that the template exists
  const sdkMajorVersionNumber = _semver().default.major(sdkVersion);

  const templateSpec = (0, _npmPackageArg().default)(`expo-template-bare-minimum@sdk-${sdkMajorVersionNumber}`);

  try {
    await _pacote().default.manifest(templateSpec);
  } catch (e) {
    if (e.code === 'E404') {
      throw new Error(`Unable to eject because an eject template for SDK ${sdkMajorVersionNumber} was not found.`);
    } else {
      throw e;
    }
  }

  return templateSpec;
}

async function copyPathsFromTemplateAsync(projectRoot, templatePath, paths) {
  const copiedPaths = [];
  const skippedPaths = [];

  for (const targetPath of paths) {
    const projectPath = _path().default.join(projectRoot, targetPath);

    if (!(await directoryExistsAsync(projectPath))) {
      copiedPaths.push(targetPath);

      _fsExtra().default.copySync(_path().default.join(templatePath, targetPath), projectPath);
    } else {
      skippedPaths.push(targetPath);
    }
  }

  return [copiedPaths, skippedPaths];
}

function getTargetPaths(projectRoot, pkg, platforms) {
  const targetPaths = [...platforms];
  const bareEntryFile = resolveBareEntryFile(projectRoot, pkg.main); // Only create index.js if we cannot resolve the existing entry point (after replacing the expo entry).

  if (!bareEntryFile) {
    targetPaths.push('index.js');
  }

  return targetPaths;
}

function resolveBareEntryFile(projectRoot, main) {
  // expo app entry is not needed for bare projects.
  if ((0, _updatePackageJson().isPkgMainExpoAppEntry)(main)) return null; // Look at the `package.json`s `main` field for the main file.

  const resolvedMainField = main !== null && main !== void 0 ? main : './index'; // Get a list of possible extensions for the main file.

  const extensions = (0, _paths().getBareExtensions)(['ios', 'android']); // Testing the main field against all of the provided extensions - for legacy reasons we can't use node module resolution as the package.json allows you to pass in a file without a relative path and expect it as a relative path.

  return (0, _paths().getFileWithExtensions)(projectRoot, resolvedMainField, extensions);
}
//# sourceMappingURL=createNativeProjectsFromTemplateAsync.js.map