#!/usr/bin/env node
"use strict";

require("console.table");

var path = _interopRequireWildcard(require("path"));

var _package = _interopRequireDefault(require("../package.json"));

var _ = require(".");

var _shared = require("./shared");

var _fliff = require("./fliff.js");

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
  name: 'id',
  type: String
}, {
  name: 'name',
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
}); // Commands that need Functions config

if (['add', 'update', 'delete', 'get'].indexOf(operation) > -1) {
  (0, _shared.getValidatedConfig)().then(async config => {
    let accessToken = config.line.access_token;
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
        req = new _.LIFFDeleteRequest({
          accessToken
        });

        if (!options.id && !options.name) {
          console.warn(`Command ${'fliff delete'.prompt} required LIFF ID or name option`.warn);
          console.log(`Try re-run ${'fliff delete --id <liffId>'.input} OR  ${'fliff delete --name <viewName>'.input}`.help);
          process.exit(1);
        }

        if (options.name) {
          options.id = await _.LIFFConfig.getViewIdByName(options.name, config);

          if (typeof options.id !== 'string') {
            console.error(`Failed to retrieve LIFF ID with view name ${options.name.input}`.error);
            process.exit(1);
          }
        }

        try {
          console.log(`Sending request to delete LIFF view ${options.id.input}`.verbose);
          res = await req.send(options.id);
          console.log(`Deleted view with LIFF ID: ${options.id.input}`.verbose);
        } catch (error) {
          if (error.response && error.response.data) {
            if (error.response.data.message === 'not found') {
              console.log('LIFF app not found'.info);
            } else {
              console.log(`Failed to delete LIFF view ${options.id.input}`.error);
              console.error(error.response.data.error);
              process.exit(1);
            }
          } else {
            console.log(`Failed to delete LIFF view ${options.id.input}`.error);
            console.error(error);
            process.exit(1);
          }
        }

        try {
          viewNames = await _.LIFFConfig.getViewNamesById(options.id, config);
          await Promise.all(viewNames.map(viewName => _.LIFFConfig.unsetView(viewName)));
          console.log(`Unset view(s) in Functions configuration`.info, viewNames);
        } catch (error) {
          console.log(`Failed to unset view(s) in Functions configuration`.error);
          console.log(`Try looking for view name with LIFF ID ${options.id.input} using ${'fliff get'.prompt} command and unset it manually`.help);
          console.log(`firebase functions:config:unset views.<viewName>`.code);
          console.error(error);
          process.exit(1);
        }

        break;

      case 'get':
        req = new _.LIFFGetRequest({
          accessToken
        });

        try {
          console.log('Sending request to get LIFF view(s)...'.verbose);
          res = await req.send();
          console.table(res.data.apps.map(app => {
            const views = Object.keys(config.views).filter(key => {
              return config.views[key] === app.liffId;
            });
            return {
              'View': views.join(', '),
              'LIFF ID': app.liffId,
              'Type': app.view.type,
              'URL': app.view.url
            };
          }));
        } catch (error) {
          if (error.response && error.response.data) {
            if (error.response.data.message === 'no apps') {
              console.log('LIFF app not found'.info);
              process.exit(0);
            } else {
              console.error(error.response.data.error);
              process.exit(1);
            }
          } else {
            console.error(error);
            process.exit(1);
          }
        }

        break;

      case 'update':
        req = new _.LIFFUpdateRequest({
          accessToken
        });

        if (!options.id && !options.name) {
          console.warn(`Command ${'fliff update'.prompt} required LIFF ID or name option`.warn);
          console.log(`Try re-run with option ${'--id <liffId>'.input} OR ${'--name <viewName>'.input}`.help);
          process.exit(1);
        }

        if (!options.id) {
          options.id = await _.LIFFConfig.getViewIdByName(options.name, config);

          if (typeof options.id !== 'string') {
            console.error(`Failed to retrieve LIFF ID with view name ${options.name.input}`.error);
            process.exit(1);
          }
        }

        if (!options.name) {
          options.name = await _.LIFFConfig.getViewNameById(options.id, config);

          if (typeof options.name !== 'string') {
            console.error(`Failed to retrieve view name with LIFF ID ${options.id.input}`.error);
            process.exit(1);
          }
        }

        if (!options.type || !options.url) {
          console.warn(`Command ${'fliff update'.prompt} required both LIFF type AND url options to be updated`.warn);
          console.log(`Try re-run with options ${'--type <type> --url <url>'.input}`.help);
          process.exit(1);
        }

        data = {
          type: options.type,
          url: options.url
        };

        try {
          console.log(`Sending request to update LIFF view ${options.id.input}`.verbose);
          res = await req.send(options.id, data);
          console.log(`Updated view with LIFF ID: ${options.id.input}`.verbose);
        } catch (error) {
          console.log(`Failed to update LIFF view ${options.id.input}`.error);

          if (error.response && error.response.data && error.response.data.message) {
            console.log(error.response.data.message.error, data);
          } else {
            console.error(error);
          }

          process.exit(1);
        }

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

    case 'help':
    default: // TODO: Display help message

  }
} else if (options.version) {
  console.log(`Version: ${_package.default.version}`);
}
//# sourceMappingURL=fliff-cli.js.map