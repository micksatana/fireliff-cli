"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./colors-set-theme");

var _default = [{
  header: 'Delete trial product information'.help,
  content: `things delete:trial --id ${'<productId>'.input}`.code
}, {
  header: 'Options',
  optionList: [{
    name: 'id'.code,
    description: 'Product ID'
  }]
}];
exports.default = _default;
//# sourceMappingURL=things-delete-usage.js.map