"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LIFFAddRequest = void 0;

var _liffRequest = require("./liff-request");

class LIFFAddRequest extends _liffRequest.LIFFRequest {
  constructor(options) {
    super(options);
  }

  send(data) {
    return this.axios.post(this.endpoint, JSON.stringify(data));
  }

}

exports.LIFFAddRequest = LIFFAddRequest;
//# sourceMappingURL=liff-add-request.js.map