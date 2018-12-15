"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThingsDeleteTrialProductRequest = void 0;

var _thingsRequest = require("./things-request");

class ThingsDeleteTrialProductRequest extends _thingsRequest.ThingsRequest {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/trial/products`;
  }
  /**
   * 
   * @param {string} productId Product ID
   */


  send(productId) {
    return this.axios.delete(`${this.endpoint}/${productId}`);
  }

}

exports.ThingsDeleteTrialProductRequest = ThingsDeleteTrialProductRequest;
//# sourceMappingURL=things-delete-trial-product-request.js.map