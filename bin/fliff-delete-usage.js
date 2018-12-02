"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = require("os");

require("./colors-set-theme");

var _default = [{
  header: 'Delete LIFF view'.help,
  content: `Delete using LIFF ID` + _os.EOL + _os.EOL + `fliff delete --id ${'<liffId>'.input}`.code + _os.EOL + _os.EOL + `Update using LIFF name` + _os.EOL + _os.EOL + `fliff delete --name ${'<viewName>'.input}`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'id'.code,
    typeLabel: '{underline liffId}'.input,
    description: 'Target LIFF ID'
  }, {
    name: 'name'.code,
    typeLabel: '{underline viewName}'.input,
    description: 'Target view name'
  }]
}];
exports.default = _default;
//# sourceMappingURL=fliff-delete-usage.js.map