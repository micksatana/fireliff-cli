"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LIFFUpdateRequest = void 0;

var _liffRequest = require("./liff-request");

class LIFFUpdateRequest extends _liffRequest.LIFFRequest {
  constructor(options) {
    super(options);
  }

  send(liffId, data) {
    return this.axios.put(`${this.endpoint}/${liffId}`, JSON.stringify(data));
  }

}

exports.LIFFUpdateRequest = LIFFUpdateRequest;
//# sourceMappingURL=liff-update-request.js.map