"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ejectAsync = ejectAsync;

function _maybeBailOnGitStatusAsync() {
  const data = _interopRequireDefault(require("../utils/maybeBailOnGitStatusAsync"));

  _maybeBailOnGitStatusAsync = function () {
    return data;
  };

  return data;
}

function _clearNativeFolder() {
  const data = require("./clearNativeFolder");

  _clearNativeFolder = function () {
    return data;
  };

  return data;
}

function _logNextSteps() {
  const data = require("./logNextSteps");

  _logNextSteps = function () {
    return data;
  };

  return data;
}

function _platformOptions() {
  const data = require("./platformOptions");

  _platformOptions = function () {
    return data;
  };

  return data;
}

function _prebuildAsync() {
  const data = require("./prebuildAsync");

  _prebuildAsync = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Entry point into the eject process, delegates to other helpers to perform various steps.
 *
 * 1. Verify git is clean
 * 2. Prebuild the project
 * 3. Log project info
 */
async function ejectAsync(projectRoot, {
  platforms,
  ...options
}) {
  (0, _platformOptions().assertPlatforms)(platforms);
  if (await (0, _maybeBailOnGitStatusAsync().default)()) return;
  await (0, _clearNativeFolder().promptToClearMalformedNativeProjectsAsync)(projectRoot);
  const results = await (0, _prebuildAsync().prebuildAsync)(projectRoot, {
    platforms,
    ...options
  });
  (0, _logNextSteps().logNextSteps)(results);
}
//# sourceMappingURL=ejectAsync.js.map