#!/usr/bin/env node
"use strict";

require("console.table");

var colors = _interopRequireWildcard(require("colors"));

var fs = _interopRequireWildcard(require("fs"));

var path = _interopRequireWildcard(require("path"));

var util = _interopRequireWildcard(require("util"));

var _package = _interopRequireDefault(require("../package.json"));

var _index = require("./index");

var _shared = require("./shared");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'white',
  help: 'cyan',
  warn: 'yellow',
  code: 'blue',
  error: 'red'
});

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
  name: 'data',
  type: String
}, {
  name: 'image',
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
}, {
  name: 'detail',
  type: Boolean
}], {
  argv
}); // Commands that need Functions config

if (['add', 'delete', 'get'].indexOf(operation) > -1) {
  (0, _shared.getValidatedConfig)().then(async config => {
    let accessToken = config.line.access_token;
    let names;
    let data;
    let dataSrc;
    let imageSrc;
    let req;
    let res;
    let uploadReq;

    switch (operation) {
      case 'add':
        req = new _index.RichMenuAddRequest({
          accessToken
        });
        dataSrc = path.resolve(process.cwd(), options.data || '');
        imageSrc = path.resolve(process.cwd(), options.image || '');

        if (options.data && options.image && fs.existsSync(dataSrc) && fs.existsSync(imageSrc)) {
          data = require(dataSrc);
        } else {
          console.log('Data file and image file must exist'.error);
          process.exit(1);
        }

        try {
          console.log('Sending request to add RichMenu...'.verbose);
          res = await req.send(data);
        } catch (error) {
          console.log(`Failed to add RichMenu`.error);
          console.error(error);
          process.exit(1);
        }

        try {
          console.log(`Created ${options.name.input} with RichMenu ID: ${res.data.richMenuId.info}`.verbose);
          await _index.LIFFConfig.setRichMenu(options.name, res.data.richMenuId);
        } catch (error) {
          console.log(`Failed to set Functions configuration`.error);
          console.log(`Try re-run with the following command`.help);
          console.log(`firebase functions:config:set richmenus.${options.name}=${res.data.richMenuId}`.code);
          console.error(error);
          process.exit(1);
        }

        try {
          console.log(`Uploading image for RichMenu ${res.data.richMenuId.info}`.verbose);
          uploadReq = new _index.RichMenuUploadRequest({
            accessToken
          });
          await uploadReq.send(res.data.richMenuId, imageSrc);
          console.log(`Uploaded`);
        } catch (error) {
          console.log(`Failed to upload image`.error);
          console.error(error);
          process.exit(1);
        }

        break;

      case 'delete':
        req = new _index.RichMenuDeleteRequest({
          accessToken
        });

        if (!options.id && !options.name) {
          console.warn(`Command ${'richmenu delete'.prompt} required RichMenu ID or name option`.warn);
          console.log(`Try re-run ${'richmenu delete --id <richMenuId>'.input} OR  ${'richmenu delete --name <richMenuName>'.input}`.help);
          process.exit(1);
        }

        if (options.name) {
          options.id = await _index.LIFFConfig.getRichMenuIdByName(options.name, config);

          if (typeof options.id !== 'string') {
            console.error(`Failed to retrieve RichMenu ID using RichMenu name ${options.name.input}`.error);
            process.exit(1);
          }
        }

        try {
          console.log(`Sending request to delete RichMenu ${options.id.input}`.verbose);
          res = await req.send(options.id);
          console.log(`Deleted RichMenu ID: ${options.id.input}`.verbose);
        } catch (error) {
          if (error.response && error.response.data) {
            if (error.response.data.message) {
              console.log(error.response.data.message.info);
            } else {
              console.log(`Failed to delete RichMenu ${options.id.input}`.error);
              console.error(error.response.data.error);
              process.exit(1);
            }
          } else {
            console.log(`Failed to delete RichMenu ${options.id.input}`.error);
            console.error(error);
            process.exit(1);
          }
        }

        try {
          names = await _index.LIFFConfig.getRichMenuNamesById(options.id, config);
          await Promise.all(names.map(name => _index.LIFFConfig.unsetRichMenu(name)));
          console.log(`Unset richmenu(s) in Functions configuration`.info, names);
        } catch (error) {
          console.log(`Failed to unset richmenu(s) in Functions configuration`.error);
          console.log(`Try looking for RichMenu name with RichMenu ID ${options.id.input} using ${'richmenu get'.prompt} command and unset it manually`.help);
          console.log(`firebase functions:config:unset richmenus.<richMenuName>`.code);
          console.error(error);
          process.exit(1);
        }

        break;

      case 'get':
        try {
          console.log('Sending request to get RichMenu(s)...'.verbose);
          req = new _index.RichMenuGetRequest({
            accessToken
          });
          res = await req.send();

          if (!res.data.richmenus || res.data.richmenus.length === 0) {
            console.log('RichMenu not found');
            process.exit(0);
          }
        } catch (error) {
          if (error.response && error.response.data) {
            if (error.response.data.message) {
              console.log(error.response.data.message.info);
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

        if (options.detail === true) {
          console.log(util.inspect(res.data.richmenus, false, null, true));
        } else {
          console.table(res.data.richmenus.map(menu => {
            const richmenus = Object.keys(config.richmenus).filter(key => {
              return config.richmenus[key] === menu.richMenuId;
            });
            return {
              'RichMenu': richmenus.join(', '),
              'RichMenu ID': menu.richMenuId,
              'Size': `${menu.size.width}x${menu.size.height}`,
              'Bar Text': menu.chatBarText,
              'Selected': menu.selected,
              'No. of Areas': menu.areas.length
            };
          }));
        }

        break;

      default:
    }
  });
} else if (operation) {
  switch (operation) {
    case 'version':
      console.log(`Version: ${_package.default.version}`);
      break;

    case 'help':
    default: // TODO: Display help message

  }
} else if (options.version) {
  console.log(`Version: ${_package.default.version}`);
}
//# sourceMappingURL=richmenu-cli.js.map