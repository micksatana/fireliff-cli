"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionsConfig = void 0;

var ChildProcess = _interopRequireWildcard(require("child_process"));

var _os = require("os");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * FunctionsConfig handle configuration in Firebase Functions
 */
class FunctionsConfig {
  static get AccessToken() {
    return FunctionsConfig.config[FunctionsConfig.SingleChannelGroup][FunctionsConfig.AccessTokenName];
  }

  static async get(name) {
    return new Promise((resolve, reject) => {
      let command = `firebase functions:config:get`;

      if (name) {
        command = `${command} ${name}`;
      }

      ChildProcess.exec(command, (error, output) => {
        if (error) {
          return reject(FunctionsConfig.parseConfigError(error));
        }

        try {
          let config = JSON.parse(output);
          return resolve(config);
        } catch (jsonParseError) {
          return reject(jsonParseError);
        }
      });
    });
  }

  static async getNamesById(group, id, config) {
    const names = [];

    if (!config || !config[group]) {
      config = await FunctionsConfig.get();
    }

    if (config && config[group]) {
      for (let name in config[group]) {
        if (config[group][name] === id) {
          names.push(name);
        }
      }
    }

    return names;
  }

  static async getIdByName(group, name, config) {
    if (!config || !config[group]) {
      config = await FunctionsConfig.get();
    }

    if (config && config[group]) {
      for (let prop in config[group]) {
        if (prop === name) {
          return config[group][prop];
        }
      }
    }

    return null;
  }

  static parseName(name) {
    return name.toLowerCase().replace(/\s/g, '_');
  }

  static parseConfigError(errorText) {
    let errorMessage = 'Failed to get configuration'.error + _os.EOL + 'Suggestions:'.info + _os.EOL;

    if (/Authentication Error/.test(errorText)) {
      return errorMessage + 'Your credentials are no longer valid. Please run firebase login --reauth'.verbose;
    } else {
      return errorMessage + `Run ${'firebase init'.code} to start a project directory in the current folder.`.verbose + _os.EOL + `Run ${'firebase use --add'.code} to set active project.`.verbose;
    }
  }

  static async set(name, value) {
    return new Promise((resolve, reject) => {
      ChildProcess.exec(`firebase functions:config:set ${name}=${value}`, error => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      });
    });
  }

  static reload() {
    return FunctionsConfig.get().then(config => FunctionsConfig.config = config);
  }

  static async unset(name) {
    return new Promise((resolve, reject) => {
      ChildProcess.exec(`firebase functions:config:unset ${name}`, error => {
        if (error) {
          return reject(error);
        }

        return resolve(name);
      });
    });
  }

}

exports.FunctionsConfig = FunctionsConfig;

_defineProperty(FunctionsConfig, "SingleChannelGroup", 'line');

_defineProperty(FunctionsConfig, "AccessTokenName", 'access_token');
//# sourceMappingURL=functions-config.js.map