"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _os = require("os");

require("./colors-set-theme");

var _default = [{
  header: 'Get LIFF view'.help,
  content: `List LIFF apps` + _os.EOL + _os.EOL + `fliff get`.code + _os.EOL + _os.EOL + `List LIFF apps with description and Bluetooth® Low Energy (BLE) flag` + _os.EOL + _os.EOL + `fliff get --detail`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'detail'.code,
    description: 'Apply this option will display description and Bluetooth® Low Energy (BLE) flag'
  }]
}];
exports.default = _default;
//# sourceMappingURL=fliff-get-usage.js.map