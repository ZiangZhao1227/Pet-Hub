"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeMetroConfig = writeMetroConfig;

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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
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

function _updatePackageJson() {
  const data = require("./updatePackageJson");

  _updatePackageJson = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function writeMetroConfig({
  projectRoot,
  pkg,
  tempDir
}) {
  /**
   * Add metro config, or warn if metro config already exists. The developer will need to add the
   * hashAssetFiles plugin manually.
   */
  const updatingMetroConfigStep = CreateApp().logNewSection('Adding Metro bundler configuration');

  try {
    const sourceConfigPath = _path().default.join(tempDir, 'metro.config.js');

    const targetConfigPath = _path().default.join(projectRoot, 'metro.config.js');

    const targetConfigPathExists = _fsExtra().default.existsSync(targetConfigPath);

    if (targetConfigPathExists) {
      // Prevent re-runs from throwing an error if the metro config hasn't been modified.
      const contents = (0, _updatePackageJson().createFileHash)(_fsExtra().default.readFileSync(targetConfigPath, 'utf8'));
      const targetContents = (0, _updatePackageJson().createFileHash)(_fsExtra().default.readFileSync(sourceConfigPath, 'utf8'));

      if (contents !== targetContents) {
        throw new Error('Existing Metro configuration found; not overwriting.');
      } else {
        // Nothing to change, hide the step and exit.
        updatingMetroConfigStep.stop();
        updatingMetroConfigStep.clear();
        return;
      }
    } else if (_fsExtra().default.existsSync(_path().default.join(projectRoot, 'metro.config.json')) || pkg.metro || _fsExtra().default.existsSync(_path().default.join(projectRoot, 'rn-cli.config.js'))) {
      throw new Error('Existing Metro configuration found; not overwriting.');
    }

    _fsExtra().default.copySync(sourceConfigPath, targetConfigPath);

    updatingMetroConfigStep.succeed('Added Metro bundler configuration.');
  } catch (e) {
    updatingMetroConfigStep.stopAndPersist({
      symbol: '⚠️ ',
      text: _chalk().default.yellow('Metro bundler configuration not applied:')
    });

    _log().default.nested(`\u203A ${e.message}`);

    _log().default.nested(`\u203A You will need to add the ${_chalk().default.bold('hashAssetFiles')} plugin to your Metro configuration.\n  ${_log().default.chalk.dim((0, _TerminalLink().learnMore)('https://docs.expo.io/bare/installing-updates/'))}`);

    _log().default.newLine();
  }
}
//# sourceMappingURL=writeMetroConfig.js.map