"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./colors-set-theme");

var _default = [{
  header: 'Get product ID and PSDI by device ID'.help,
  content: `things get:product --device ${'<deviceId>'.input}`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'device'.code,
    typeLabel: '-d'.code,
    description: 'Device ID'
  }]
}, {
  header: 'Get device information by device ID and user ID'.help,
  content: `things get:device --device ${'<deviceId>'.input} --user ${'<userId>'.input}`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'device'.code,
    typeLabel: '-d'.code,
    description: 'Device ID'
  }, {
    name: 'user'.code,
    typeLabel: '-u'.code,
    description: 'User ID'
  }]
}, {
  header: 'Get device information by product ID and user ID'.help,
  content: `things get:device --product ${'<product>'.input} --user ${'<userId>'.input}`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'product'.code,
    typeLabel: '-p'.code,
    description: 'Product ID'
  }, {
    name: 'user'.code,
    typeLabel: '-u'.code,
    description: 'User ID'
  }]
}, {
  header: 'Get trial product information'.help,
  content: `things get:trial`.code
}];
exports.default = _default;
//# sourceMappingURL=things-get-usage.js.map