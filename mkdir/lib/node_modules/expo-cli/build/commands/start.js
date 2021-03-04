"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function () {
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

function sendTo() {
  const data = _interopRequireWildcard(require("../sendTo"));

  sendTo = function () {
    return data;
  };

  return data;
}

function _urlOpts() {
  const data = _interopRequireDefault(require("../urlOpts"));

  _urlOpts = function () {
    return data;
  };

  return data;
}

function TerminalUI() {
  const data = _interopRequireWildcard(require("./start/TerminalUI"));

  TerminalUI = function () {
    return data;
  };

  return data;
}

function _installExitHooks() {
  const data = require("./start/installExitHooks");

  _installExitHooks = function () {
    return data;
  };

  return data;
}

function _openDevTools() {
  const data = require("./start/openDevTools");

  _openDevTools = function () {
    return data;
  };

  return data;
}

function _parseStartOptions() {
  const data = require("./start/parseStartOptions");

  _parseStartOptions = function () {
    return data;
  };

  return data;
}

function _validateDependenciesVersions() {
  const data = require("./start/validateDependenciesVersions");

  _validateDependenciesVersions = function () {
    return data;
  };

  return data;
}

function _deprecatedExtensionWarnings() {
  const data = require("./utils/deprecatedExtensionWarnings");

  _deprecatedExtensionWarnings = function () {
    return data;
  };

  return data;
}

function _profileMethod() {
  const data = require("./utils/profileMethod");

  _profileMethod = function () {
    return data;
  };

  return data;
}

function _ensureTypeScriptSetup() {
  const data = require("./utils/typescript/ensureTypeScriptSetup");

  _ensureTypeScriptSetup = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function action(projectRoot, options) {
  _log().default.log(_chalk().default.gray(`Starting project at ${projectRoot}`)); // Add clean up hooks


  (0, _installExitHooks().installExitHooks)(projectRoot);
  const {
    exp,
    pkg
  } = (0, _profileMethod().profileMethod)(_config().getConfig)(projectRoot, {
    skipSDKVersionRequirement: options.webOnly
  }); // Assert various random things
  // TODO: split up this method

  await (0, _profileMethod().profileMethod)(_urlOpts().default.optsAsync)(projectRoot, options); // TODO: This is useless on mac, check if useless on win32

  const rootPath = _path().default.resolve(projectRoot); // Optionally open the developer tools UI.


  await (0, _profileMethod().profileMethod)(_openDevTools().tryOpeningDevToolsAsync)(rootPath, {
    exp,
    options
  });

  if (_xdl().Versions.gteSdkVersion(exp, '34.0.0')) {
    await (0, _profileMethod().profileMethod)(_ensureTypeScriptSetup().ensureTypeScriptSetupAsync)(projectRoot);
  }

  if (!options.webOnly) {
    // TODO: only validate dependencies if starting in managed workflow
    await (0, _profileMethod().profileMethod)(_validateDependenciesVersions().validateDependenciesVersionsAsync)(projectRoot, exp, pkg); // Warn about expo extensions.

    if (!(0, _config().isLegacyImportsEnabled)(exp)) {
      // Adds a few seconds in basic projects so we should
      // drop this in favor of the upgrade version as soon as possible.
      await (0, _profileMethod().profileMethod)(_deprecatedExtensionWarnings().assertProjectHasExpoExtensionFilesAsync)(projectRoot);
    }
  }

  const startOptions = (0, _profileMethod().profileMethod)(_parseStartOptions().parseStartOptions)(options, exp);
  await (0, _profileMethod().profileMethod)(_xdl().Project.startAsync)(rootPath, { ...startOptions,
    exp
  }); // Send to option...

  const url = await (0, _profileMethod().profileMethod)(_xdl().UrlUtils.constructDeepLinkAsync, 'UrlUtils.constructDeepLinkAsync')(projectRoot);
  const recipient = await (0, _profileMethod().profileMethod)(sendTo().getRecipient)(options.sendTo);

  if (recipient) {
    await sendTo().sendUrlAsync(url, recipient);
  } // Open project on devices.


  await (0, _profileMethod().profileMethod)(_urlOpts().default.handleMobileOptsAsync)(projectRoot, options); // Present the Terminal UI.

  const isTerminalUIEnabled = !options.nonInteractive && !exp.isDetached;

  if (isTerminalUIEnabled) {
    await (0, _profileMethod().profileMethod)(TerminalUI().startAsync, 'TerminalUI.startAsync')(projectRoot, startOptions);
  } else {
    if (!exp.isDetached) {
      _log().default.newLine();

      _urlOpts().default.printQRCode(url);
    }

    _log().default.log(`Your native app is running at ${_chalk().default.underline(url)}`);
  } // Final note about closing the server.


  if (!options.webOnly) {
    _log().default.nested(`Logs for your project will appear below. ${_chalk().default.dim(`Press Ctrl+C to exit.`)}`);
  } else {
    _log().default.nested(`\nLogs for your project will appear in the browser console. ${_chalk().default.dim(`Press Ctrl+C to exit.`)}`);
  }
}

var _default = program => {
  program.command('start [path]').alias('r').description('Start a local dev server for the app').helpGroup('core').option('-s, --send-to [dest]', 'An email address to send a link to').option('-c, --clear', 'Clear the Metro bundler cache') // TODO(anp) set a default for this dynamically based on whether we're inside a container?
  .option('--max-workers [num]', 'Maximum number of tasks to allow Metro to spawn.').option('--dev', 'Turn development mode on').option('--no-dev', 'Turn development mode off').option('--minify', 'Minify code').option('--no-minify', 'Do not minify code').option('--https', 'To start webpack with https protocol').option('--no-https', 'To start webpack with http protocol').urlOpts().allowOffline().asyncActionProjectDir(async (projectRoot, options) => {
    const normalizedOptions = await (0, _parseStartOptions().normalizeOptionsAsync)(projectRoot, options);
    return await action(projectRoot, normalizedOptions);
  });
  program.command('start:web [path]').alias('web').description('Start a Webpack dev server for the web app').helpGroup('core').option('--dev', 'Turn development mode on').option('--no-dev', 'Turn development mode off').option('--minify', 'Minify code').option('--no-minify', 'Do not minify code').option('--https', 'To start webpack with https protocol').option('--no-https', 'To start webpack with http protocol').option('-s, --send-to [dest]', 'An email address to send a link to').urlOpts().allowOffline().asyncActionProjectDir(async (projectRoot, options) => {
    const normalizedOptions = await (0, _parseStartOptions().normalizeOptionsAsync)(projectRoot, { ...options,
      webOnly: true
    });
    return await action(projectRoot, normalizedOptions);
  });
};

exports.default = _default;
//# sourceMappingURL=start.js.map