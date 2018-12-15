"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThingsRequest = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ThingsRequest {
  constructor(options) {
    this.endpoint = 'https://api.line.me/things/v1';
    this.axios = _axios.default.create({
      headers: {
        'authorization': `Bearer ${options.accessToken}`,
        'content-type': 'application/json'
      }
    });
  }

}

exports.ThingsRequest = ThingsRequest;
//# sourceMappingURL=things-request.js.map