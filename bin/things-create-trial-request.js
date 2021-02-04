"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThingsCreateTrialRequest = void 0;

var _thingsRequest = require("./things-request");

class ThingsCreateTrialRequest extends _thingsRequest.ThingsRequest {
  constructor(options) {
    super(options);
    this.endpoint = `${this.endpoint}/trial/products`;
  }
  /**
   *
   * @param {string} liffId LIFF ID
   * @param {string} name Product name
   */


  send(liffId, name) {
    return this.axios.post(this.endpoint, JSON.stringify({
      liffId,
      name
    }));
  }

}

exports.ThingsCreateTrialRequest = ThingsCreateTrialRequest;
//# sourceMappingURL=things-create-trial-request.js.map