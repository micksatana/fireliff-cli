#!/usr/bin/env node
"use strict";

require("console.table");

var path = _interopRequireWildcard(require("path"));

var _package = _interopRequireDefault(require("../package.json"));

var _ = require(".");

require("./colors-set-theme");

var _fliff = require("./fliff.js");

var _shared = require("./shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const commandLineArgs = require('command-line-args');

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
  name: 'ble',
  type: String
}, {
  name: 'description',
  type: String
}, {
  name: 'id',
  type: String
}, {
  name: 'issue',
  type: Boolean
}, {
  name: 'name',
  type: String
}, {
  name: 'revoke',
  type: String
}, {
  name: 'save',
  type: Boolean
}, {
  name: 'secret',
  type: String
}, {
  name: 'type',
  type: String
}, {
  name: 'url',
  type: String
}, {
  name: 'version',
  alias: 'v',
  type: Boolean
}], {
  argv
});
const fliff = new _fliff.FLIFF(); // Commands that need Functions config

if (['add', 'update', 'delete', 'get', 'token'].indexOf(operation) > -1) {
  (0, _shared.getValidatedConfig)().then(async config => {
    const accessToken = config.line.access_token;
    let viewNames;
    let data;
    let req;
    let res;

    switch (operation) {
      case 'add':
        req = new _.LIFFAddRequest({
          accessToken
        });
        data = {
          view: {
            type: options.type,
            url: options.url
          }
        };

        try {
          console.log('Sending request to add LIFF view...'.verbose);
          res = await req.send(data);
        } catch (error) {
          console.log(`Failed to add LIFF view`.error);
          console.error(error);
          process.exit(1);
        }

        try {
          console.log(`Created ${options.name.input} view with LIFF ID: ${res.data.liffId.info}`.verbose);
          await _.LIFFConfig.setView(options.name, res.data.liffId);
        } catch (error) {
          console.log(`Failed to set Functions configuration`.error);
          console.log(`Try re-run with the following command`.help);
          console.log(`firebase functions:config:set views.${options.name}=${res.data.liffId}`.code);
          console.error(error);
          process.exit(1);
        }

        break;

      case 'delete':
        console.log(`Sending request to delete LIFF view(s)...`.verbose);
        fliff.delete(options).then(rsDelete => {
          console.log(`Deleted view with LIFF ID: ${options.id.input}`.verbose);
          console.log(`Unset view(s) in Functions configuration`.info, rsDelete);
          return rsDelete;
        }).catch(errDelete => {
          const message = errDelete.message || errDelete;
          console.log(message.error);
          process.exit(1);
        });
        break;

      case 'get':
        console.log('Sending request to get LIFF view(s)...'.verbose);
        fliff.get(options).then(rsGet => {
          if (typeof rsGet === 'string') {
            console.log(rsGet);
          } else {
            console.table(rsGet);
          }

          return rsGet;
        }).catch(errGet => {
          const message = errGet.message || errGet;
          console.log(message.error);
          process.exit(1);
        });
        break;

      case 'update':
        console.log(`Sending request to update LIFF view`.verbose);
        fliff.update(options).then(rsUpdate => {
          console.log(`Updated LIFF ID: ${options.id.input}`.info);
          return rsUpdate;
        }).catch(errUpdate => {
          const message = errUpdate.message || errUpdate;
          console.log(message.error);
          process.exit(1);
        });
        break;

      case 'token':
        if (options.issue === true) {
          console.log('Issuing channel access token'.verbose);
        } else if (options.revoke !== undefined) {
          console.log('Revoking channel access token'.verbose);
        }

        fliff.token(options).then(rsToken => {
          if (options.issue === true && rsToken.accessToken) {
            console.log(`The following token has been issued.`.info);
            console.log(JSON.stringify(rsToken, undefined, 2));

            if (options.save === true) {
              console.log(`The access token is saved on Firebase Functions Configuration.`.info);
            } else {
              console.log(`This access token is NOT saved on Firebase Functions Configuration.`.warn);
              console.log(`If you would like to saved on Firebase Functions Configuration. Try re-run using ${'fliff token --issue --save'.input} `.help);
            }
          } else if (options.revoke !== undefined && rsToken === true) {
            console.log(`The token is revoked.`.info);
          } else {
            console.log('Unknown response').warn;
          }

          return rsToken;
        }).catch(errToken => {
          const message = errToken.message || errToken;
          console.log(message.error);
          process.exit(1);
        });
        break;

      default:
    }
  });
} else if (operation) {
  switch (operation) {
    case 'init':
      _fliff.FLIFF.init(path.resolve(process.cwd(), 'web-views'));

      break;

    case 'version':
      console.log(`Version: ${_package.default.version}`);
      break;

    case 'config':
      console.log(`Configuring Firebase Functions`.verbose);
      fliff.config(options).then(rsConfig => {
        console.log(`The following property has been updated.`.info);
        console.log(JSON.stringify(rsConfig, undefined, 2));
        console.log(`Firebase Functions configured`.info);
        return rsConfig;
      }).catch(errConfig => {
        const message = errConfig.message || errConfig;
        console.log(message.error);
        process.exit(1);
      });
      break;

    case 'help':
    default: // TODO: Display help message

  }
} else if (options.version) {
  console.log(`Version: ${_package.default.version}`);
}
//# sourceMappingURL=fliff-cli.js.map