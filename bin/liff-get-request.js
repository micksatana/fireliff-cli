"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LIFFGetRequest = void 0;

var _liffRequest = require("./liff-request");

class LIFFGetRequest extends _liffRequest.LIFFRequest {
  constructor(options) {
    super(options);
  }

  send() {
    return this.axios.get(this.endpoint);
  }

}

exports.LIFFGetRequest = LIFFGetRequest;
//# sourceMappingURL=liff-get-request.js.map