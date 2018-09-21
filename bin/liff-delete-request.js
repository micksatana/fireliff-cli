"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LIFFDeleteRequest = void 0;

var _liffRequest = require("./liff-request");

class LIFFDeleteRequest extends _liffRequest.LIFFRequest {
  constructor(options) {
    super(options);
  }

  send(liffId) {
    return this.axios.delete(`${this.endpoint}/${liffId}`);
  }

}

exports.LIFFDeleteRequest = LIFFDeleteRequest;
//# sourceMappingURL=liff-delete-request.js.map