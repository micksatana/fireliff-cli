"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichMenuUnlinkUserRequest = void 0;

var _richMenuRequest = require("./rich-menu-request");

class RichMenuUnlinkUserRequest extends _richMenuRequest.RichMenuRequest {
  constructor(options) {
    super(options);
    this.endpoint = 'https://api.line.me/v2/bot';
  }

  send(userId) {
    return this.axios.delete(`${this.endpoint}/user/${userId}/richmenu`);
  }

}

exports.RichMenuUnlinkUserRequest = RichMenuUnlinkUserRequest;
//# sourceMappingURL=rich-menu-unlink-user-request.js.map