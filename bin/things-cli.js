#!/usr/bin/env node
"use strict";

require("console.table");

require("./colors-set-theme");

var _thingsCliUsage = _interopRequireWildcard(require("./things-cli-usage"));

var _shared = require("./shared");

var _things = require("./things.js");

var _package = _interopRequireDefault(require("../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const versionText = `Things CLIs v${_package.default.version} for Things API v1`.help;

try {
  const commandLineArgs = require('command-line-args');

  const commandLineUsage = require('command-line-usage');

  const {
    operation,
    _unknown
  } = commandLineArgs([{
    name: 'operation',
    defaultOption: true
  }], {
    stopAtFirstUnknown: true
  });
  const argv = _unknown || [];
  const options = commandLineArgs([{
    name: 'help',
    alias: 'h',
    type: Boolean
  }, {
    name: 'id',
    type: String
  }, {
    name: 'liff',
    type: String
  }, {
    name: 'product',
    alias: 'p',
    type: String
  }, {
    name: 'user',
    type: String
  }, {
    name: 'version',
    alias: 'v',
    type: Boolean
  }], {
    argv
  });
  const things = new _things.Things();

  if (options.help) {
    switch (operation) {
      case 'get':
        console.log(commandLineUsage(_thingsCliUsage.getUsage));
        break;

      case 'create':
        console.log(commandLineUsage(_thingsCliUsage.createUsage));
        break;

      case 'delete':
        console.log(commandLineUsage(_thingsCliUsage.deleteUsage));
        break;

      default:
        console.log(commandLineUsage(_thingsCliUsage.default));
    }

    process.exit(0);
  }

  if (['create:trial', 'delete:trial', 'get:device', 'get:product'].indexOf(operation) > -1) {
    (0, _shared.getConfig)().then(_shared.validateConfig).then(() => {
      switch (operation) {
        case 'create:trial':
          if (!options.liff || !options.product) {
            console.error(`Command ${'things create:trial'.prompt} required LIFF ID and product name`.warn + EOL + `Try re-run with option ${'--liff <liffId>'.input} and ${'--product <productName>'.input}`.help);
            process.exit(1);
          }

          return things.createTrial(options.liff, options.product).then(result => {
            console.log(result);
            return;
          });

        case 'delete:trial':
          break;

        case 'get:device':
          if (!options.id) {
            console.error(`Command ${'things get:device'.prompt} required Device ID option`.warn + EOL + `Try re-run with option ${'--id <deviceId>'.input}`.help);
            process.exit(1);
          }

          if (!options.user) {
            things.getProduct(options.id);
          }

          break;

        case 'get:product':
          break;
      }

      return;
    }).catch(error => {
      console.error(error.message || error.toString());
      process.exit(1);
    });
  } else if (operation) {
    switch (operation) {
      case 'version':
        console.log(versionText);
        break;

      case 'help':
      default:
        console.log(commandLineUsage(_thingsCliUsage.default));
    }
  } else if (options.version) {
    console.log(versionText);
  } else {
    console.log(commandLineUsage(_thingsCliUsage.default));
  }
} catch (commandError) {
  (0, _shared.commandErrorHandler)(commandError);
}
//# sourceMappingURL=things-cli.js.map