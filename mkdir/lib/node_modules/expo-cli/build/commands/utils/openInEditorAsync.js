"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openInEditorAsync = openInEditorAsync;

function osascript() {
  const data = _interopRequireWildcard(require("@expo/osascript"));

  osascript = function () {
    return data;
  };

  return data;
}

function _spawnAsync() {
  const data = _interopRequireDefault(require("@expo/spawn-async"));

  _spawnAsync = function () {
    return data;
  };

  return data;
}

function _envEditor() {
  const data = _interopRequireDefault(require("env-editor"));

  _envEditor = function () {
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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function guessEditor() {
  if (process.env.EXPO_EDITOR) {
    return _envEditor().default.getEditor(process.env.EXPO_EDITOR);
  }

  try {
    return _envEditor().default.defaultEditor();
  } catch (_unused) {
    return _envEditor().default.getEditor('vscode');
  }
}

async function openInEditorAsync(path, options = {}) {
  const editor = options.editor ? _envEditor().default.getEditor(options.editor) : guessEditor();

  if (process.platform === 'darwin') {
    // This will use the ENV var $EXPO_EDITOR if set, or else will try various
    // popular editors, looking for one that is open, or if none are, one that is installed
    await osascript().openInEditorAsync(path, editor.name);
  }

  if (!editor) {
    _log().default.error('Could not find your editor, you can set it by defining $EXPO_EDITOR environment variable (e.g. "code" or "atom")');

    return;
  }

  const stdio = editor.isTerminalEditor ? 'inherit' : 'ignore';
  const editorProcess = (0, _spawnAsync().default)(editor.binary, [path], {
    stdio,
    detached: true
  });
  editorProcess.child.unref();
  return editorProcess;
}
//# sourceMappingURL=openInEditorAsync.js.map