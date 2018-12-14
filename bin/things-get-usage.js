"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./colors-set-theme");

var _default = [{
  header: 'Get product ID and PSDI by device ID'.help,
  content: `things get:device --id ${'<deviceId>'.input}`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'id'.code,
    description: 'Device ID'
  }]
}, {
  header: 'Get device information by device ID and user ID'.help,
  content: `things get:device --id ${'<deviceId>'.input} --user ${'<userId>'.input}`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'id'.code,
    description: 'Device ID'
  }, {
    name: 'user'.code,
    description: 'User ID'
  }]
}, {
  header: 'Get device information by product ID and user ID'.help,
  content: `things get:product --id ${'<product>'.input} --user ${'<userId>'.input}`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'id'.code,
    description: 'Product ID'
  }, {
    name: 'user'.code,
    description: 'User ID'
  }]
}, {
  header: 'Get trial product information'.help,
  content: `things get:trial`.code
}];
exports.default = _default;
//# sourceMappingURL=things-get-usage.js.map