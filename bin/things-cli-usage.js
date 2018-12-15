"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createUsage", {
  enumerable: true,
  get: function () {
    return _thingsCreateUsage.default;
  }
});
Object.defineProperty(exports, "deleteUsage", {
  enumerable: true,
  get: function () {
    return _thingsDeleteUsage.default;
  }
});
Object.defineProperty(exports, "getUsage", {
  enumerable: true,
  get: function () {
    return _thingsGetUsage.default;
  }
});
exports.default = void 0;

var _thingsCreateUsage = _interopRequireDefault(require("./things-create-usage"));

var _thingsDeleteUsage = _interopRequireDefault(require("./things-delete-usage"));

var _thingsGetUsage = _interopRequireDefault(require("./things-get-usage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = [].concat(_thingsCreateUsage.default, _thingsDeleteUsage.default, _thingsGetUsage.default);

exports.default = _default;
//# sourceMappingURL=things-cli-usage.js.map