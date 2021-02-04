"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThingsGetProductRequest = void 0;

var _thingsRequest = require("./things-request");

class ThingsGetProductRequest extends _thingsRequest.ThingsRequest {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/devices`;
  }
  /**
   *
   * @param {string} deviceId
   */


  send(deviceId) {
    return this.axios.get(`${this.endpoint}/${deviceId}`);
  }

}

exports.ThingsGetProductRequest = ThingsGetProductRequest;
//# sourceMappingURL=things-get-product-request.js.map