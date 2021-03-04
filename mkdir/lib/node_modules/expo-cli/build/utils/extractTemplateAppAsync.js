"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractAndPrepareTemplateAppAsync = extractAndPrepareTemplateAppAsync;
exports.extractTemplateAppAsync = extractTemplateAppAsync;

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

function _fsExtra() {
  const data = _interopRequireDefault(require("fs-extra"));

  _fsExtra = function () {
    return data;
  };

  return data;
}

function _merge() {
  const data = _interopRequireDefault(require("lodash/merge"));

  _merge = function () {
    return data;
  };

  return data;
}

function _minipass() {
  const data = _interopRequireDefault(require("minipass"));

  _minipass = function () {
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

function _tar() {
  const data = _interopRequireDefault(require("tar"));

  _tar = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function sanitizedName(name) {
  return name.replace(/[\W_]+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function escapeXMLCharacters(original) {
  const noAmps = original.replace('&', '&amp;');
  const noLt = noAmps.replace('<', '&lt;');
  const noGt = noLt.replace('>', '&gt;');
  const noApos = noGt.replace('"', '\\"');
  return noApos.replace("'", "\\'");
}

class Transformer extends _minipass().default {
  constructor(config, settings) {
    super();
    this.config = config;
    this.settings = settings;

    _defineProperty(this, "data", '');
  }

  write(data) {
    this.data += data;
    return true;
  }

  getNormalizedName() {
    if (['.xml', '.plist'].includes(this.settings.extension)) {
      return escapeXMLCharacters(this.config.name);
    }

    return this.config.name;
  }

  end() {
    const name = this.getNormalizedName();
    const replaced = this.data.replace(/Hello App Display Name/g, name).replace(/HelloWorld/g, sanitizedName(name)).replace(/helloworld/g, sanitizedName(name.toLowerCase()));
    super.write(replaced);
    return super.end();
  }

} // Binary files, don't process these (avoid decoding as utf8)


const binaryExtensions = ['.png', '.jar', '.keystore', '.otf', '.ttf'];

function createFileTransform(config) {
  return function transformFile(entry) {
    const extension = _path().default.extname(entry.path);

    if (!binaryExtensions.includes(extension) && config.name) {
      return new Transformer(config, {
        extension
      });
    }

    return undefined;
  };
}
/**
 * Extract a template app to a given file path and clean up any properties left over from npm to
 * prepare it for usage.
 */


async function extractAndPrepareTemplateAppAsync(templateSpec, projectRoot, config) {
  await extractTemplateAppAsync(templateSpec, projectRoot, {
    name: 'name' in config ? config.name : config.expo.name
  });
  const appFile = new (_jsonFile().default)(_path().default.join(projectRoot, 'app.json'));
  const appJson = (0, _merge().default)(await appFile.readAsync(), config);
  await appFile.writeAsync(appJson);
  const packageFile = new (_jsonFile().default)(_path().default.join(projectRoot, 'package.json'));
  let packageJson = await packageFile.readAsync(); // Adding `private` stops npm from complaining about missing `name` and `version` fields.
  // We don't add a `name` field because it also exists in `app.json`.

  packageJson = { ...packageJson,
    private: true
  }; // These are metadata fields related to the template package, let's remove them from the package.json.

  delete packageJson.name;
  delete packageJson.version;
  delete packageJson.description;
  delete packageJson.tags;
  delete packageJson.repository; // pacote adds these, but we don't want them in the package.json of the project.

  delete packageJson._resolved;
  delete packageJson._integrity;
  delete packageJson._from;
  await packageFile.writeAsync(packageJson);
  return projectRoot;
}
/**
 * Extract a template app to a given file path.
 */


async function extractTemplateAppAsync(templateSpec, targetPath, config) {
  await _pacote().default.tarball.stream(templateSpec, tarStream => {
    return extractTemplateAppAsyncImpl(targetPath, config, tarStream);
  }, {
    cache: _path().default.join(_xdl().UserSettings.dotExpoHomeDirectory(), 'template-cache')
  });
  return targetPath;
}

async function extractTemplateAppAsyncImpl(targetPath, config, tarStream) {
  await _fsExtra().default.mkdirp(targetPath);
  await new Promise((resolve, reject) => {
    const extractStream = _tar().default.x({
      cwd: targetPath,
      strip: 1,
      // TODO(ville): pending https://github.com/DefinitelyTyped/DefinitelyTyped/pull/36598
      // @ts-ignore property missing from the type definition
      transform: createFileTransform(config),

      onentry(entry) {
        if (config.name) {
          // Rewrite paths for bare workflow
          entry.path = entry.path.replace(/HelloWorld/g, entry.path.includes('android') ? sanitizedName(config.name.toLowerCase()) : sanitizedName(config.name)).replace(/helloworld/g, sanitizedName(config.name).toLowerCase());
        }

        if (entry.type && /^file$/i.test(entry.type) && _path().default.basename(entry.path) === 'gitignore') {
          // Rename `gitignore` because npm ignores files named `.gitignore` when publishing.
          // See: https://github.com/npm/npm/issues/1862
          entry.path = entry.path.replace(/gitignore$/, '.gitignore');
        }
      }

    });

    tarStream.on('error', reject);
    extractStream.on('error', reject);
    extractStream.on('close', resolve);
    tarStream.pipe(extractStream);
  });
}
//# sourceMappingURL=extractTemplateAppAsync.js.map