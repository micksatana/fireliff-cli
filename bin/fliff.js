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

var _fliffError = require("./fliff-error");

var _functionsConfig = require("./functions-config");

var _liffConfig = require("./liff-config");

var _liffGetRequest = require("./liff-get-request");

var _liffUpdateRequest = require("./liff-update-request");

var _oauthIssueTokenRequest = require("./oauth-issue-token-request");

var _oauthRevokeTokenRequest = require("./oauth-revoke-token-request");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const copy = require('recursive-copy');

const ConfigRequiredIdSecretOrName = `Failed to configure channel. ${'fliff config'.prompt} required id, secret or token options.`.error + _os.EOL + `Try re-run with option ${'--id <channelId>'.input} OR ${'--secret <channelSecret>'.input} OR ${'--token <channelToken>'.input}`.help;
const FailedToRetrieveIdUsingName = `Failed to retrieve LIFF ID using view name`.error;
const FailedToRetrieveNameUsingId = `Failed to retrieve view name using LIFF ID`.error;
const RevokeTokenRequiredAccessToken = `Command ${'fliff token --revoke'.prompt} required access token.`.warn + _os.EOL + `Try re-run with access token ${'fliff token --revoke <accessToken>'.input}`.help;
const IssueTokenRequiredChannelIdAndSecret = `Command ${'fliff token'.prompt} required Channel ID and Secret to be configured first`.error + _os.EOL + `Try run ${'fliff config --id <channelId> --secret <channelSecret>'.input} to configure before re-run ${'fliff token'.prompt} again.`.help;
const TokenRequiredIssueOrRevoke = `Command ${'fliff token'.prompt} required issue or revoke options.`.error + _os.EOL + `Try re-run with option ${'--issue'.input} OR ${'--revoke'.input}`.help;
const UpdateRequiredIdOrName = `Command ${'fliff update'.prompt} required LIFF ID or name option`.warn + _os.EOL + `Try re-run with option ${'--id <liffId>'.input} OR ${'--name <viewName>'.input}`.help;

class FLIFF {
  static get ErrorMessages() {
    return {
      ConfigRequiredIdSecretOrName,
      FailedToRetrieveIdUsingName,
      FailedToRetrieveNameUsingId,
      RevokeTokenRequiredAccessToken,
      IssueTokenRequiredChannelIdAndSecret,
      TokenRequiredIssueOrRevoke,
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

  async get() {
    const req = new _liffGetRequest.LIFFGetRequest({
      accessToken: _functionsConfig.FunctionsConfig.AccessToken
    });

    try {
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