"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FLIFF = void 0;

var _child_process = require("child_process");

var _fs = require("fs");

var _os = require("os");

var path = _interopRequireWildcard(require("path"));

var prompt = _interopRequireWildcard(require("prompt"));

require("./colors-set-theme");

var _functionsConfig = require("./functions-config");

var _liffConfig = require("./liff-config");

var _liffUpdateRequest = require("./liff-update-request");

var _fliffError = require("./fliff-error");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const copy = require('recursive-copy');

const ConfigRequiredIdSecretOrName = `Failed to configure channel. ${'fliff config'.prompt} required id, secret or token options.`.error + _os.EOL + `Try re-run with option ${'--id <channelId>'.input} OR ${'--secret <channelSecret>'.input} OR ${'--token <channelToken>'.input}`.help;
const FailedToRetrieveIdUsingName = `Failed to retrieve LIFF ID using view name`.error;
const FailedToRetrieveNameUsingId = `Failed to retrieve view name using LIFF ID`.error;
const UpdateRequiredIdOrName = `Command ${'fliff update'.prompt} required LIFF ID or name option`.warn + _os.EOL + `Try re-run with option ${'--id <liffId>'.input} OR ${'--name <viewName>'.input}`.help;

class FLIFF {
  static get ErrorMessages() {
    return {
      ConfigRequiredIdSecretOrName,
      FailedToRetrieveIdUsingName,
      FailedToRetrieveNameUsingId,
      UpdateRequiredIdOrName
    };
  }

  static init(initPath) {
    const fbjsonPath = path.resolve(initPath, '../firebase.json');
    const distPath = `${path.basename(initPath)}/dist`;
    (0, _fs.mkdir)(initPath, errMakeDir => {
      if (errMakeDir) {
        switch (errMakeDir.code) {
          case 'EEXIST':
            console.log(`${initPath} already exists`.error);
            console.log(`Please manually delete ${initPath} and try again`.help);
            break;

          default:
            console.error(errMakeDir);
        }

        process.exit(1);
      }

      copy(path.resolve(__dirname, '../templates/web-views'), initPath, {
        junk: false,
        dot: true,
        filter: ['*', 'src/**/*', '!.cache', '!package-lock.json', '!dist', '!node_modules']
      }, (errCopy, rsCopy) => {
        if (errCopy) {
          console.error(errMakeDir);
          process.exit(1);
        }

        console.log('Generated files'.info);
        rsCopy.sort((a, b) => a.dest > b.dest ? 1 : b.dest > a.dest ? -1 : 0);
        rsCopy.forEach(file => console.log(file.dest.verbose));

        if ((0, _fs.existsSync)(fbjsonPath)) {
          const fbjson = require(fbjsonPath);

          if (fbjson.hosting && fbjson.hosting.public !== distPath) {
            console.log(`firebase.json currently set hosting.public to ${fbjson.hosting.public.error}`.warn);
            console.log(`Please change hosting.public to ${distPath.info}`.warn);
          }
        }

        prompt.message = ''; // Workaround: Remove annoying prompt: prefix

        prompt.start();
        prompt.get([{
          name: 'installNow',
          message: 'Do you want to install node modules now? [yes/no]',
          validator: /y[es]*|n[o]?/,
          default: 'yes'
        }], (errPrompt, rsPrompt) => {
          if (['yes', 'y'].indexOf(rsPrompt.installNow.toLowerCase()) > -1) {
            const cmdInstall = (0, _child_process.spawn)('npm', ['i', '--loglevel=error'], {
              cwd: initPath
            });
            console.log(`Installing node modules in ${initPath}. Please wait...`);
            cmdInstall.stderr.on('data', data => console.error(data.toString()));
            cmdInstall.on('exit', code => {
              if (code === 0) {
                console.log('Installed'.help);
              }

              process.exit(code);
            });
          }
        });
      });
    });
  }

  constructor() {}

  async config(options) {
    let result = {};

    if (!options.id && !options.secret && !options.token) {
      return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.ConfigRequiredIdSecretOrName));
    } else {
      result[_functionsConfig.FunctionsConfig.SingleChannelGroup] = {};
    }

    if (options.id) {
      try {
        await _functionsConfig.FunctionsConfig.set(`${_functionsConfig.FunctionsConfig.SingleChannelGroup}.${_functionsConfig.FunctionsConfig.ChannelIdName}`, options.id);
        result[_functionsConfig.FunctionsConfig.SingleChannelGroup][_functionsConfig.FunctionsConfig.ChannelIdName] = options.id;
      } catch (errId) {
        return Promise.reject(errId);
      }
    }

    if (options.secret) {
      try {
        await _functionsConfig.FunctionsConfig.set(`${_functionsConfig.FunctionsConfig.SingleChannelGroup}.${_functionsConfig.FunctionsConfig.ChannelSecretName}`, options.secret);
        result[_functionsConfig.FunctionsConfig.SingleChannelGroup][_functionsConfig.FunctionsConfig.ChannelSecretName] = options.secret;
      } catch (errSecret) {
        return Promise.reject(errSecret);
      }
    }

    if (options.token) {
      try {
        await _functionsConfig.FunctionsConfig.set(`${_functionsConfig.FunctionsConfig.SingleChannelGroup}.${_functionsConfig.FunctionsConfig.AccessTokenName}`, options.token);
        result[_functionsConfig.FunctionsConfig.SingleChannelGroup][_functionsConfig.FunctionsConfig.AccessTokenName] = options.token;
      } catch (errToken) {
        return Promise.reject(errToken);
      }
    }

    return result;
  }

  async update(options) {
    const req = new _liffUpdateRequest.LIFFUpdateRequest({
      accessToken: _functionsConfig.FunctionsConfig.AccessToken
    });
    let data = {};

    if (!options.id && !options.name) {
      return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.UpdateRequiredIdOrName));
    }

    if (!options.id) {
      options.id = await _liffConfig.LIFFConfig.getViewIdByName(options.name, _functionsConfig.FunctionsConfig.config);

      if (typeof options.id !== 'string') {
        return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.FailedToRetrieveIdUsingName));
      }
    }

    if (!options.name) {
      options.name = await _liffConfig.LIFFConfig.getViewNameById(options.id, _functionsConfig.FunctionsConfig.config);

      if (typeof options.name !== 'string') {
        return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.FailedToRetrieveNameUsingId));
      }
    }

    if (options.type || options.url) {
      data.view = {};

      if (options.type) {
        data.view.type = options.type;
      }

      if (options.url) {
        data.view.url = options.url;
      }
    }

    if (options.description) {
      data.description = options.description;
    }

    if (options.ble) {
      data.features = {
        ble: options.ble.toLowerCase() == 'false' ? false : true
      };
    }

    try {
      return await req.send(options.id, data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return Promise.reject(error.response.data.message.error);
      } else {
        return Promise.reject(error);
      }
    }
  }

}

exports.FLIFF = FLIFF;
//# sourceMappingURL=fliff.js.map