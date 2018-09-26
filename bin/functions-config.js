"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionsConfig = void 0;

var ChildProcess = _interopRequireWildcard(require("child_process"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * FunctionsConfig handle configuration in Firebase Functions
 */
class FunctionsConfig {
  static async get(name) {
    return new Promise((resolve, reject) => {
      let command = `firebase functions:config:get`;

      if (name) {
        command = `${command} ${name}`;
      }

      ChildProcess.exec(command, (error, output) => {
        if (error) {
          return reject(error);
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

}

exports.FunctionsConfig = FunctionsConfig;
//# sourceMappingURL=functions-config.js.map