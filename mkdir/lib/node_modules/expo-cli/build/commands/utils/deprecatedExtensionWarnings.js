"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertProjectHasExpoExtensionFilesAsync = assertProjectHasExpoExtensionFilesAsync;

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

function _findYarnWorkspaceRoot() {
  const data = _interopRequireDefault(require("find-yarn-workspace-root"));

  _findYarnWorkspaceRoot = function () {
    return data;
  };

  return data;
}

function _glob() {
  const data = _interopRequireDefault(require("glob"));

  _glob = function () {
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

function _prompts() {
  const data = require("../../prompts");

  _prompts = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function queryExpoExtensionFilesAsync(projectRoot, ignore) {
  return new Promise((resolve, reject) => {
    (0, _glob().default)('**/*.expo.@(js|jsx|ts|tsx)', {
      absolute: true,
      ignore,
      cwd: projectRoot
    }, (error, matches) => {
      if (error) reject(error);else resolve(matches);
    });
  });
}

async function assertProjectHasExpoExtensionFilesAsync(projectRoot, checkNodeModules = false) {
  if (checkNodeModules) {
    await assertModulesHasExpoExtensionFilesAsync(projectRoot);
  } else {
    _log().default.time('assertProjectHasExpoExtensionFilesAsync');

    const matches = await queryExpoExtensionFilesAsync(projectRoot, [`**/@(Carthage|Pods|node_modules|ts-declarations|.expo)/**`, '@(ios|android|web)/**']).catch(() => []);

    _log().default.timeEnd('assertProjectHasExpoExtensionFilesAsync');

    if (matches.length) {
      await promptMatchesAsync(matches);
    }
  }
}

async function assertModulesHasExpoExtensionFilesAsync(projectRoot) {
  const spinner = (0, _ora().default)('Checking project for deprecated features, this may take a moment.').start();
  const root = (0, _findYarnWorkspaceRoot().default)(projectRoot) || projectRoot;

  _log().default.time('assertModulesHasExpoExtensionFilesAsync');

  let matches = await queryExpoExtensionFilesAsync(root, [`**/@(Carthage|Pods|ts-declarations|.expo)/**`, '@(ios|android|web)/**']).catch(() => []);

  _log().default.timeEnd('assertModulesHasExpoExtensionFilesAsync');

  matches = matches.filter(value => {
    if (value.includes('node_modules')) {
      // Remove duplicate files from packages compiled with bob
      return !value.match(/node_modules\/.*\/lib\/commonjs/g);
    }

    return true;
  });

  if (!matches.length) {
    spinner.succeed('Validated project');
    return;
  } else {
    spinner.fail('Found project files with deprecated features');
  }

  logMatchedFiles(matches);
}

function logMatchedFiles(matches) {
  const hasNodeModules = matches.find(match => match.includes('node_modules/'));

  _log().default.error(_chalk().default.red(`Project is using deprecated ${_chalk().default.bold`.expo.*`} file extensions.\nPlease refactor the following files${hasNodeModules ? ' and upgrade modules' : ''} accordingly:\n\n`) + _chalk().default.reset(matches.map(match => `- ${match}`).join('\n') + _chalk().default.dim(`\n\nDangerously disable this check with ${_chalk().default.bold(`EXPO_LEGACY_IMPORTS=1`)}\nLearn more: http://expo.fyi/expo-extension-migration\n`)));
}

async function promptMatchesAsync(matches) {
  logMatchedFiles(matches); // Skip in nonInteractive to give users a bypass

  if (_commander().default.nonInteractive || (await (0, _prompts().confirmAsync)({
    message: 'Would you like to continue anyways?',
    initial: true
  }))) {
    return;
  }

  throw new (_CommandError().SilentError)();
}
//# sourceMappingURL=deprecatedExtensionWarnings.js.map