"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichMenuLinkUserRequest = void 0;

var _richMenuRequest = require("./rich-menu-request");

class RichMenuLinkUserRequest extends _richMenuRequest.RichMenuRequest {
  constructor(options) {
    super(options);
    this.endpoint = 'https://api.line.me/v2/bot';
  }

  send(richMenuId, userId) {
    return this.axios.post(`${this.endpoint}/user/${userId}/richmenu/${richMenuId}`);
  }

}

exports.RichMenuLinkUserRequest = RichMenuLinkUserRequest;
//# sourceMappingURL=rich-menu-link-user-request.js.map