"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = require("os");

require("./colors-set-theme");

var _default = [{
  header: 'Update LIFF view'.help,
  content: `Update using LIFF ID` + _os.EOL + _os.EOL + `fliff update --id ${'<liffId>'.input} --type ${'<viewType>'.input} --url ${'<viewUrl>'.input}`.code + _os.EOL + _os.EOL + `Update using LIFF name` + _os.EOL + _os.EOL + `fliff update --name ${'<viewName>'.input} --type ${'<viewType>'.input} --url ${'<viewUrl>'.input}`.code + _os.EOL + _os.EOL + `To update Bluetooth® Low Energy (BLE) flag` + _os.EOL + _os.EOL + `fliff update --id ${'<liffId>'.input} --ble ${'<true|false>'.input}`.code
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
  }, {
    name: 'url'.code,
    typeLabel: '{underline viewUrl}'.input,
    description: 'View URL to be updated'
  }, {
    name: 'type'.code,
    typeLabel: '{underline viewType}'.input,
    description: 'View type to be updated'
  }, {
    name: 'ble'.code,
    typeLabel: '{underline BLE}'.input,
    description: 'Bluetooth® Low Energy (BLE)'
  }]
}];
exports.default = _default;
//# sourceMappingURL=fliff-update-usage.js.map