"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FLIFF = void 0;

var _fs = require("fs");

var _os = require("os");

var path = _interopRequireWildcard(require("path"));

require("./colors-set-theme");

var _fliffError = require("./fliff-error");

var _functionsConfig = require("./functions-config");

var _liffConfig = require("./liff-config");

var _liffAddRequest = require("./liff-add-request");

var _liffDeleteRequest = require("./liff-delete-request");

var _liffGetRequest = require("./liff-get-request");

var _liffUpdateRequest = require("./liff-update-request");

var _oauthIssueTokenRequest = require("./oauth-issue-token-request");

var _oauthRevokeTokenRequest = require("./oauth-revoke-token-request");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const AddRequiredNameAndUrl = `Command ${'fliff add'.prompt} required name and url options`.warn + _os.EOL + `Try re-run with option ${'--name <viewName>'.input} AND ${'--url <viewURL>'.input}`.help;
const ConfigRequiredIdSecretOrName = `Failed to configure channel. ${'fliff config'.prompt} required id, secret or token options.`.error + _os.EOL + `Try re-run with option ${'--id <channelId>'.input} OR ${'--secret <channelSecret>'.input} OR ${'--token <channelToken>'.input}`.help;
const DeleteRequiredIdOrName = `Command ${'fliff delete'.prompt} required LIFF ID or name option`.warn + _os.EOL + `Try re-run with option ${'--id <liffId>'.input} OR ${'--name <viewName>'.input}`.help;
const FailedToAddLIFF = `Failed to add LIFF view`.error;

const FailedToInitPathExists = initPath => `${initPath} already exists`.error + _os.EOL + `Please manually delete ${initPath} and try again`.help;

const FailedToRetrieveIdUsingName = `Failed to retrieve LIFF ID using view name`.error;
const FailedToRetrieveNameUsingId = `Failed to retrieve view name using LIFF ID`.error;
const FailedToSetView = `Failed to set view in Functions configuration`.error;
const FailedToUnsetViews = `Failed to unset view(s) in Functions configuration`.error;
const RevokeTokenRequiredAccessToken = `Command ${'fliff token --revoke'.prompt} required access token.`.warn + _os.EOL + `Try re-run with access token ${'fliff token --revoke <accessToken>'.input}`.help;
const IssueTokenRequiredChannelIdAndSecret = `Command ${'fliff token'.prompt} required Channel ID and Secret to be configured first`.error + _os.EOL + `Try run ${'fliff config --id <channelId> --secret <channelSecret>'.input} to configure before re-run ${'fliff token'.prompt} again.`.help;
const TokenRequiredIssueOrRevoke = `Command ${'fliff token'.prompt} required issue or revoke options.`.error + _os.EOL + `Try re-run with option ${'--issue'.input} OR ${'--revoke'.input}`.help;
const UpdateRequiredIdOrName = `Command ${'fliff update'.prompt} required LIFF ID or name option`.warn + _os.EOL + `Try re-run with option ${'--id <liffId>'.input} OR ${'--name <viewName>'.input}`.help;

const WarnPublicHostingConfig = (current, preferred) => `firebase.json currently set hosting.public to ${current.error}`.warn + _os.EOL + `Please change hosting.public to ${preferred.info}`.warn;

class FLIFF {
  static get ErrorMessages() {
    return {
      AddRequiredNameAndUrl,
      ConfigRequiredIdSecretOrName,
      DeleteRequiredIdOrName,
      FailedToAddLIFF,
      FailedToInitPathExists,
      FailedToRetrieveIdUsingName,
      FailedToRetrieveNameUsingId,
      FailedToSetView,
      FailedToUnsetViews,
      RevokeTokenRequiredAccessToken,
      IssueTokenRequiredChannelIdAndSecret,
      TokenRequiredIssueOrRevoke,
      UpdateRequiredIdOrName,
      WarnPublicHostingConfig
    };
  }

  constructor() {}

  init(initPath) {
    return new Promise((resolve, reject) => {
      const fbjsonPath = path.resolve(initPath, '../firebase.json');
      const distPath = `${path.basename(initPath)}/dist`;
      (0, _fs.mkdir)(initPath, errMakeDir => {
        if (errMakeDir) {
          switch (errMakeDir.code) {
            case 'EEXIST':
              return reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.FailedToInitPathExists(initPath)));

            default:
              return reject(errMakeDir);
          }
        }

        const copy = require('recursive-copy');

        copy(path.resolve(__dirname, '../templates/web-views'), initPath, {
          junk: false,
          dot: true,
          filter: ['*', 'src/**/*', '!.cache', '!package-lock.json', '!dist', '!node_modules']
        }, (errCopy, rsCopy) => {
          if (errCopy) {
            return reject(errCopy);
          }

          rsCopy.sort((a, b) => a.dest > b.dest ? 1 : b.dest > a.dest ? -1 : 0);
          const files = rsCopy.map(file => file.dest);
          let message = '';

          if ((0, _fs.existsSync)(fbjsonPath)) {
            const fbjson = require(fbjsonPath);

            if (fbjson.hosting && fbjson.hosting.public !== distPath) {
              message = FLIFF.ErrorMessages.WarnPublicHostingConfig(fbjson.hosting.public, distPath);
            }
          }

          return resolve({
            files,
            message
          });
        });
      });
    });
  }

  installNow(initPath) {
    return new Promise((resolve, reject) => {
      this.prompt = require('prompt');
      this.prompt.message = ''; // Workaround: Remove annoying prompt: prefix

      this.prompt.start();
      this.prompt.get([{
        name: 'installNow',
        message: 'Do you want to install node modules now? [yes/no]',
        validator: /y[es]*|n[o]?/,
        default: 'yes'
      }], (errPrompt, rsPrompt) => {
        if (errPrompt) {
          return reject(errPrompt);
        }

        if (['yes', 'y'].indexOf(rsPrompt.installNow.toLowerCase()) > -1) {
          const spawn = require('child_process').spawn;

          const cmdInstall = spawn('npm', ['i', '--loglevel=error'], {
            cwd: initPath
          });
          console.log(`Installing node modules in ${initPath}. Please wait...`);
          cmdInstall.stderr.on('data', data => reject(data.toString()));
          cmdInstall.on('exit', code => {
            if (code === 0) {
              return resolve(true);
            }

            return reject(code);
          });
        }
      });
    });
  }

  async add(options) {
    if (!options.name || !options.url) {
      return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.AddRequiredNameAndUrl));
    }

    if (!options.type) {
      options.type = 'full';
    }

    const name = options.name.toLowerCase().replace(/\s/g, '_');
    const description = options.description ? options.description : options.name;
    const req = new _liffAddRequest.LIFFAddRequest({
      accessToken: _functionsConfig.FunctionsConfig.AccessToken
    });
    const data = {
      view: {
        type: options.type,
        url: options.url
      },
      description
    };
    let res;

    if (options.ble) {
      data.features = {
        ble: options.ble.toLowerCase() == 'false' ? false : true
      };
    }

    try {
      res = await req.send(data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return Promise.reject(new _fliffError.FLIFFError(error.response.data.message.error));
      } else {
        return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.FailedToAddLIFF));
      }
    }

    try {
      return await _liffConfig.LIFFConfig.setView(name, res.data.liffId);
    } catch (error) {
      return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.FailedToSetView));
    }
  }

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

  async token(options) {
    if (!options.issue && options.revoke === undefined) {
      return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.TokenRequiredIssueOrRevoke));
    }

    if (options.issue === true) {
      if (!_functionsConfig.FunctionsConfig.ChannelId || !_functionsConfig.FunctionsConfig.ChannelSecret) {
        return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.IssueTokenRequiredChannelIdAndSecret));
      }

      try {
        const req = new _oauthIssueTokenRequest.OAuthIssueTokenRequest();
        const res = await req.send(_functionsConfig.FunctionsConfig.ChannelId, _functionsConfig.FunctionsConfig.ChannelSecret);
        const tokenData = res.status === 200 ? {
          accessToken: res.data.access_token,
          expiresIn: res.data.expires_in,
          type: res.data.token_type
        } : false;

        if (tokenData) {
          if (options.save === true) {
            await _functionsConfig.FunctionsConfig.set(`${_functionsConfig.FunctionsConfig.SingleChannelGroup}.${_functionsConfig.FunctionsConfig.AccessTokenName}`, tokenData.accessToken);
            return tokenData;
          }

          return tokenData;
        } else {
          return Promise.reject(new _fliffError.FLIFFError(res.statusText));
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error_description) {
          return Promise.reject(error.response.data.error_description);
        } else {
          return Promise.reject(error);
        }
      }
    } else if (options.revoke !== undefined) {
      if (options.revoke === null) {
        return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.RevokeTokenRequiredAccessToken));
      }

      try {
        const req = new _oauthRevokeTokenRequest.OAuthRevokeTokenRequest();
        const res = await req.send(options.revoke);
        return res.status === 200 ? true : Promise.reject(new _fliffError.FLIFFError(res.statusText));
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error_description) {
          return Promise.reject(error.response.data.error_description);
        } else {
          return Promise.reject(error);
        }
      }
    }
  }

  async delete(options) {
    if (!options.id && !options.name) {
      return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.DeleteRequiredIdOrName));
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

    try {
      const req = new _liffDeleteRequest.LIFFDeleteRequest({
        accessToken: _functionsConfig.FunctionsConfig.AccessToken
      });
      await req.send(options.id);
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message !== 'not found') {
          return Promise.reject(error.response.data.error);
        }
      } else {
        return Promise.reject(error);
      }
    }

    try {
      const viewNames = await _liffConfig.LIFFConfig.getViewNamesById(options.id, _functionsConfig.FunctionsConfig.config);
      await Promise.all(viewNames.map(viewName => _liffConfig.LIFFConfig.unsetView(viewName)));
      return viewNames;
    } catch (error) {
      return Promise.reject(new _fliffError.FLIFFError(FLIFF.ErrorMessages.FailedToUnsetViews));
    }
  }

  async update(options) {
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
      const req = new _liffUpdateRequest.LIFFUpdateRequest({
        accessToken: _functionsConfig.FunctionsConfig.AccessToken
      });
      return await req.send(options.id, data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return Promise.reject(error.response.data.message.error);
      } else {
        return Promise.reject(error);
      }
    }
  }

  async get() {
    try {
      const req = new _liffGetRequest.LIFFGetRequest({
        accessToken: _functionsConfig.FunctionsConfig.AccessToken
      });
      const res = await req.send();
      return res.data.apps.map(app => {
        const views = Object.keys(_functionsConfig.FunctionsConfig.config.views).filter(key => {
          return _functionsConfig.FunctionsConfig.config.views[key] === app.liffId;
        });
        return {
          'View': views.join(', '),
          'LIFF ID': app.liffId,
          'Type': app.view.type,
          'URL': app.view.url
        };
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message === 'no apps') {
          return 'LIFF app not found'.info;
        } else {
          return Promise.reject(error.response.data.message.error);
        }
      } else {
        return Promise.reject(error);
      }
    }
  }

}

exports.FLIFF = FLIFF;
//# sourceMappingURL=fliff.js.map