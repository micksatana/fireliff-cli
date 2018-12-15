"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThingsGetDevicesByProductUserRequest = void 0;

var _thingsRequest = require("./things-request");

class ThingsGetDevicesByProductUserRequest extends _thingsRequest.ThingsRequest {
  constructor(options) {
    super(options);
  }
  /**
   * 
   * @param {string} productId Product ID
   * @param {string} userId User ID
   */


  send(productId, userId) {
    return this.axios.get(`${this.endpoint}/products/${productId}/users/${userId}/links`);
  }

}

exports.ThingsGetDevicesByProductUserRequest = ThingsGetDevicesByProductUserRequest;
//# sourceMappingURL=things-get-devices-by-product-user-request.js.map