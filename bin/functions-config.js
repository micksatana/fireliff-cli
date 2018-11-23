"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionsConfig = void 0;

var ChildProcess = _interopRequireWildcard(require("child_process"));

var _os = require("os");

require("./colors-set-theme");

var _functionsConfigError = require("./functions-config-error");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const FailedToGetConfig = 'Failed to get configuration'.error;
const FailedToGetConfigAuthError = [FailedToGetConfig, 'Suggestions:'.info, 'Your credentials are no longer valid. Please run firebase login --reauth'.verbose].join(_os.EOL);
const FailedToGetConfigUnknownError = [FailedToGetConfig, 'Suggestions:'.info, `Run ${'firebase init'.code} to start a project directory in the current folder.`.verbose, `Run ${'firebase use --add'.code} to set active project.`.verbose].join(_os.EOL);
/**
 * FunctionsConfig handle configuration in Firebase Functions
 */

class FunctionsConfig {
  //
  // Read-only
  //
  static get AccessToken() {
    return FunctionsConfig.config[FunctionsConfig.SingleChannelGroup][FunctionsConfig.AccessTokenName];
  }

  static get AccessTokenName() {
    return 'access_token';
  }

  static get BaseCommand() {
    return 'firebase functions:config';
  }

  static get ChannelId() {
    return FunctionsConfig.config[FunctionsConfig.SingleChannelGroup][FunctionsConfig.ChannelIdName];
  }

  static get ChannelSecret() {
    return FunctionsConfig.config[FunctionsConfig.SingleChannelGroup][FunctionsConfig.ChannelSecretName];
  }

  static get ChannelIdName() {
    return 'channel_id';
  }

  static get ChannelSecretName() {
    return 'channel_secret';
  }

  static get ErrorMessages() {
    return {
      FailedToGetConfig,
      FailedToGetConfigAuthError,
      FailedToGetConfigUnknownError
    };
  }

  static get SingleChannelGroup() {
    return 'line';
  } //
  // Methods
  //


  static async get(name) {
    return new Promise((resolve, reject) => {
      let command = `${FunctionsConfig.BaseCommand}:get`;

      if (name) {
        command = `${command} ${name}`;
      }

      ChildProcess.exec(command, (error, output) => {
        if (error) {
          return reject(FunctionsConfig.parseGetConfigError(error));
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
  /**
   * Find value (id) of a property in a group
   * 
   * @param {string} group 
   * @param {string} name 
   * @param {*} config 
   */


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
  /**
   * Find properties in a group which their value matched id
   * 
   * @param {string} group 
   * @param {string} id 
   * @param {*} config 
   */


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
  /**
   * 
   * @param {Error|string} error 
   * @return {string} error message intented to be used in console.log
   */


  static parseGetConfigError(error) {
    let errorMessage = error instanceof Error ? error.message : error;

    if (/Authentication Error/.test(errorMessage)) {
      return new _functionsConfigError.FunctionsConfigError(FunctionsConfig.ErrorMessages.FailedToGetConfigAuthError);
    } else {
      return new _functionsConfigError.FunctionsConfigError(FunctionsConfig.ErrorMessages.FailedToGetConfigUnknownError);
    }
  }
  /**
   * 
   * @param {string} name
   * @return {string} name in Firebase Functions Config acceptable format 
   */


  static parseName(name) {
    return name.toLowerCase().replace(/\s/g, '_');
  }
  /**
   * Load configuration and set into config
   * 
   * @return {Promise} config 
   */


  static reload() {
    return FunctionsConfig.get().then(config => FunctionsConfig.config = config);
  }

  static async set(name, value) {
    return new Promise((resolve, reject) => {
      ChildProcess.exec(`${FunctionsConfig.BaseCommand}:set ${name}=${value}`, error => {
        if (error) {
          return reject(error);
        }

        return resolve(value);
      });
    });
  }

  static async unset(name) {
    return new Promise((resolve, reject) => {
      ChildProcess.exec(`${FunctionsConfig.BaseCommand}:unset ${name}`, error => {
        if (error) {
          return reject(error);
        }

        return resolve(name);
      });
    });
  }

}

exports.FunctionsConfig = FunctionsConfig;
//# sourceMappingURL=functions-config.js.map