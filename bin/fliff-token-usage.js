"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = require("os");

require("./colors-set-theme");

var _default = [{
  header: 'Issue/Revoke access token '.help,
  content: `After channel ID and secret are configured. Issue a channel access token and save it.` + _os.EOL + _os.EOL + `fliff token --issue --save`.code + _os.EOL + _os.EOL + `In case you want to revoke an access token, you can run with --revoke option.` + _os.EOL + _os.EOL + `fliff token --revoke`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'issue'.code,
    description: 'Issue a channel access token from pre-configured channel ID and secret'
  }, {
    name: 'save'.code,
    description: 'Apply along with --issue option, the new access token will be replace in Functions configuration.'
  }, {
    name: 'revoke'.code,
    typeLabel: '{underline accessToken}'.input,
    description: 'Revoke a channel access token.'
  }]
}];
exports.default = _default;
//# sourceMappingURL=fliff-token-usage.js.map