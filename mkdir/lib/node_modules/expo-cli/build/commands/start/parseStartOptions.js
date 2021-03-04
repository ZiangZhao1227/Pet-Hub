"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBooleanArg = setBooleanArg;
exports.normalizeOptionsAsync = normalizeOptionsAsync;
exports.parseRawArguments = parseRawArguments;
exports.parseStartOptions = parseStartOptions;

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

function _log() {
  const data = _interopRequireDefault(require("../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasBooleanArg(rawArgs, argName) {
  return rawArgs.includes('--' + argName) || rawArgs.includes('--no-' + argName);
}

function getBooleanArg(rawArgs, argName) {
  if (rawArgs.includes('--' + argName)) {
    return true;
  } else {
    return false;
  }
}

function setBooleanArg(argName, rawArgs, fallback) {
  if (rawArgs.includes(`--${argName}`)) {
    return true;
  } else if (rawArgs.includes(`--no-${argName}`)) {
    return false;
  } else {
    return fallback;
  }
} // The main purpose of this function is to take existing options object and
// support boolean args with as defined in the hasBooleanArg and getBooleanArg
// functions.


async function normalizeOptionsAsync(projectRoot, options) {
  var _options$parent;

  const rawArgs = ((_options$parent = options.parent) === null || _options$parent === void 0 ? void 0 : _options$parent.rawArgs) || [];
  const opts = parseRawArguments(options, rawArgs); // Side-effect

  await cacheOptionsAsync(projectRoot, opts);
  return opts;
} // The main purpose of this function is to take existing options object and
// support boolean args with as defined in the hasBooleanArg and getBooleanArg
// functions.


function parseRawArguments(options, rawArgs) {
  var _options$parent2;

  const opts = { ...options,
    // This is necessary to ensure we don't drop any options
    webOnly: !!options.webOnly,
    // This is only ever true in the start:web command
    nonInteractive: (_options$parent2 = options.parent) === null || _options$parent2 === void 0 ? void 0 : _options$parent2.nonInteractive,
    // setBooleanArg is used to flip the default commander logic which automatically sets a value to `true` if the inverse option isn't provided.
    // ex: `dev == true` if `--no-dev` is a possible flag, but `--no-dev` was not provided in the command.
    dev: setBooleanArg('dev', rawArgs, true),
    minify: setBooleanArg('minify', rawArgs, false),
    https: setBooleanArg('https', rawArgs, false)
  };

  if (hasBooleanArg(rawArgs, 'android')) {
    opts.android = getBooleanArg(rawArgs, 'android');
  }

  if (hasBooleanArg(rawArgs, 'ios')) {
    opts.ios = getBooleanArg(rawArgs, 'ios');
  }

  if (hasBooleanArg(rawArgs, 'web')) {
    opts.web = getBooleanArg(rawArgs, 'web');
  }

  if (hasBooleanArg(rawArgs, 'localhost')) {
    opts.localhost = getBooleanArg(rawArgs, 'localhost');
  }

  if (hasBooleanArg(rawArgs, 'lan')) {
    opts.lan = getBooleanArg(rawArgs, 'lan');
  }

  if (hasBooleanArg(rawArgs, 'tunnel')) {
    opts.tunnel = getBooleanArg(rawArgs, 'tunnel');
  }

  return opts;
}

async function cacheOptionsAsync(projectDir, options) {
  await _xdl().ProjectSettings.setAsync(projectDir, {
    devClient: options.devClient,
    scheme: options.scheme,
    dev: options.dev,
    minify: options.minify,
    https: options.https
  });
}

function parseStartOptions(options, exp) {
  const startOpts = {};

  if (options.clear) {
    startOpts.reset = true;
  }

  if (options.nonInteractive) {
    startOpts.nonInteractive = true;
  }

  if (options.webOnly) {
    startOpts.webOnly = true;
  }

  if (options.maxWorkers) {
    startOpts.maxWorkers = options.maxWorkers;
  }

  if (options.devClient) {
    startOpts.devClient = true;
  }

  if ((0, _config().isLegacyImportsEnabled)(exp)) {
    // For `expo start`, the default target is 'managed', for both managed *and* bare apps.
    // See: https://docs.expo.io/bare/using-expo-client
    startOpts.target = options.devClient ? 'bare' : 'managed';

    _log().default.debug('Using target: ', startOpts.target);
  }

  return startOpts;
}
//# sourceMappingURL=parseStartOptions.js.map