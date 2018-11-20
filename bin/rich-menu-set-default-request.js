"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichMenuSetDefaultRequest = void 0;

var _richMenuRequest = require("./rich-menu-request");

class RichMenuSetDefaultRequest extends _richMenuRequest.RichMenuRequest {
  constructor(options) {
    super(options);
    this.endpoint = 'https://api.line.me/v2/bot/user/all/richmenu';
  }

  send(richMenuId) {
    return this.axios.post(`${this.endpoint}/${richMenuId}`);
  }

}

exports.RichMenuSetDefaultRequest = RichMenuSetDefaultRequest;
//# sourceMappingURL=rich-menu-set-default-request.js.map