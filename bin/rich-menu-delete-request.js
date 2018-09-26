"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichMenuDeleteRequest = void 0;

var _richMenuRequest = require("./rich-menu-request");

class RichMenuDeleteRequest extends _richMenuRequest.RichMenuRequest {
  constructor(options) {
    super(options);
  }

  send(richMenuId) {
    return this.axios.delete(`${this.endpoint}/${richMenuId}`);
  }

}

exports.RichMenuDeleteRequest = RichMenuDeleteRequest;
//# sourceMappingURL=rich-menu-delete-request.js.map