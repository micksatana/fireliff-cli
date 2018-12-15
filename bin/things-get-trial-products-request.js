"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThingsGetTrialProductsRequest = void 0;

var _thingsRequest = require("./things-request");

class ThingsGetTrialProductsRequest extends _thingsRequest.ThingsRequest {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/trial/products`;
  }

  send() {
    return this.axios.get(this.endpoint);
  }

}

exports.ThingsGetTrialProductsRequest = ThingsGetTrialProductsRequest;
//# sourceMappingURL=things-get-trial-products-request.js.map