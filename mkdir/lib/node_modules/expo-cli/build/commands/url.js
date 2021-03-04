"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

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

function _printRunInstructionsAsync() {
  const data = _interopRequireDefault(require("../printRunInstructionsAsync"));

  _printRunInstructionsAsync = function () {
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

function _getBuildStatusAsync() {
  const data = require("./build/getBuildStatusAsync");

  _getBuildStatusAsync = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function assertHTTPS(url) {
  if (url && !_xdl().UrlUtils.isHttps(url)) {
    throw new (_CommandError().default)('INVALID_PUBLIC_URL', '--public-url must be a valid HTTPS URL.');
  }
}

async function assertProjectRunningAsync(projectRoot) {
  if ((await _xdl().ProjectSettings.getCurrentStatusAsync(projectRoot)) !== 'running') {
    throw new (_CommandError().default)('NOT_RUNNING', `Project is not running. Please start it with \`expo start\`.`);
  }
}

const logArtifactUrl = platform => async (projectRoot, options) => {
  var _result$jobs, _result$jobs$filter$, _result$jobs$filter$$;

  assertHTTPS(options.publicUrl);
  const result = await (0, _getBuildStatusAsync().getBuildStatusAsync)(projectRoot, {
    current: false,
    ...(options.publicUrl ? {
      publicUrl: options.publicUrl
    } : {})
  });
  const url = (_result$jobs = result.jobs) === null || _result$jobs === void 0 ? void 0 : (_result$jobs$filter$ = _result$jobs.filter(job => job.platform === platform)[0]) === null || _result$jobs$filter$ === void 0 ? void 0 : (_result$jobs$filter$$ = _result$jobs$filter$.artifacts) === null || _result$jobs$filter$$ === void 0 ? void 0 : _result$jobs$filter$$.url;

  if (!url) {
    throw new (_CommandError().default)(`No ${platform} binary file found. Use "expo build:${platform}" to create one.`);
  }

  _log().default.nested(url);
};

async function getWebAppUrlAsync(projectRoot) {
  const url = await _xdl().UrlUtils.constructWebAppUrlAsync(projectRoot);

  if (!url) {
    throw new (_CommandError().default)('NOT_RUNNING', `Webpack dev server is not running. Please start it with \`expo start:web\`.`);
  }

  return url;
}

function logUrl(url) {
  _log().default.newLine();

  _urlOpts().default.printQRCode(url);

  _log().default.log('Your URL is\n\n' + _chalk().default.underline(url) + '\n');
}

async function action(projectRoot, options) {
  await _urlOpts().default.optsAsync(projectRoot, options);
  await assertProjectRunningAsync(projectRoot);
  const url = options.web ? await getWebAppUrlAsync(projectRoot) : await _xdl().UrlUtils.constructDeepLinkAsync(projectRoot);
  logUrl(url);

  if (!options.web) {
    await (0, _printRunInstructionsAsync().default)();
    await _urlOpts().default.handleMobileOptsAsync(projectRoot, options);
  }
}

function _default(program) {
  program.command('url [path]').alias('u').helpGroup('url').option('-w, --web', 'Return the URL of the web app').description('Log a URL for opening the project in Expo Go').urlOpts().allowOffline().asyncActionProjectDir(action);
  program.command('url:ipa [path]').helpGroup('url').option('--public-url <url>', 'The URL of an externally hosted manifest (for self-hosted apps)').description('Log the download URL for the standalone iOS binary').asyncActionProjectDir(logArtifactUrl('ios'));
  program.command('url:apk [path]').helpGroup('url').option('--public-url <url>', 'The URL of an externally hosted manifest (for self-hosted apps)').description('Log the download URL for the standalone Android binary').asyncActionProjectDir(logArtifactUrl('android'));
}
//# sourceMappingURL=url.js.map