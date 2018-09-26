"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichMenuGetRequest = void 0;

var _richMenuRequest = require("./rich-menu-request");

class RichMenuGetRequest extends _richMenuRequest.RichMenuRequest {
  constructor(options) {
    super(options);
  }

  send() {
    return this.axios.get(`${this.endpoint}/list`);
  }

}

exports.RichMenuGetRequest = RichMenuGetRequest;
//# sourceMappingURL=rich-menu-get-request.js.map