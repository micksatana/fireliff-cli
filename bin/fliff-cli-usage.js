"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "addUsage", {
  enumerable: true,
  get: function () {
    return _fliffAddUsage.default;
  }
});
Object.defineProperty(exports, "configUsage", {
  enumerable: true,
  get: function () {
    return _fliffConfigUsage.default;
  }
});
Object.defineProperty(exports, "deleteUsage", {
  enumerable: true,
  get: function () {
    return _fliffDeleteUsage.default;
  }
});
Object.defineProperty(exports, "getUsage", {
  enumerable: true,
  get: function () {
    return _fliffGetUsage.default;
  }
});
Object.defineProperty(exports, "initUsage", {
  enumerable: true,
  get: function () {
    return _fliffInitUsage.default;
  }
});
Object.defineProperty(exports, "tokenUsage", {
  enumerable: true,
  get: function () {
    return _fliffTokenUsage.default;
  }
});
Object.defineProperty(exports, "updateUsage", {
  enumerable: true,
  get: function () {
    return _fliffUpdateUsage.default;
  }
});
exports.default = void 0;

var _fliffAddUsage = _interopRequireDefault(require("./fliff-add-usage"));

var _fliffConfigUsage = _interopRequireDefault(require("./fliff-config-usage"));

var _fliffDeleteUsage = _interopRequireDefault(require("./fliff-delete-usage"));

var _fliffGetUsage = _interopRequireDefault(require("./fliff-get-usage"));

var _fliffInitUsage = _interopRequireDefault(require("./fliff-init-usage"));

var _fliffTokenUsage = _interopRequireDefault(require("./fliff-token-usage"));

var _fliffUpdateUsage = _interopRequireDefault(require("./fliff-update-usage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = [].concat(_fliffConfigUsage.default, _fliffTokenUsage.default, _fliffInitUsage.default, _fliffAddUsage.default, _fliffUpdateUsage.default, _fliffDeleteUsage.default, _fliffGetUsage.default);

exports.default = _default;
//# sourceMappingURL=fliff-cli-usage.js.map