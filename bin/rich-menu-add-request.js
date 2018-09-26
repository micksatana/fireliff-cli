"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichMenuAddRequest = void 0;

var _richMenuRequest = require("./rich-menu-request");

class RichMenuAddRequest extends _richMenuRequest.RichMenuRequest {
  constructor(options) {
    super(options);
  }

  send(data) {
    return this.axios.post(this.endpoint, JSON.stringify(data));
  }

}

exports.RichMenuAddRequest = RichMenuAddRequest;
//# sourceMappingURL=rich-menu-add-request.js.map