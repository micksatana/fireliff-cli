"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./colors-set-theme");

var _default = [{
  header: 'Create trial product information'.help,
  content: `things create:trial --liff ${'<liffId>'.input} --product ${'<productName>'.input}`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'liff'.code,
    description: 'LIFF ID'
  }, {
    name: 'product'.code,
    typeLabel: '-p'.code,
    description: 'Product name'
  }]
}];
exports.default = _default;
//# sourceMappingURL=things-create-usage.js.map