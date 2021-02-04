"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichMenuRequest = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RichMenuRequest {
  constructor(options) {
    this.endpoint = 'https://api.line.me/v2/bot/richmenu';
    this.axios = _axios.default.create({
      headers: {
        authorization: `Bearer ${options.accessToken}`,
        'content-type': options.contentType || 'application/json'
      }
    });
  }

}

exports.RichMenuRequest = RichMenuRequest;
//# sourceMappingURL=rich-menu-request.js.map