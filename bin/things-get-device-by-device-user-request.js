"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThingsGetDeviceByDeviceUserRequest = void 0;

var _thingsRequest = require("./things-request");

class ThingsGetDeviceByDeviceUserRequest extends _thingsRequest.ThingsRequest {
  constructor(options) {
    super(options);
  }
  /**
   * 
   * @param {string} deviceId Device ID
   * @param {string} userId User ID
   */


  send(deviceId, userId) {
    return this.axios.get(`${this.endpoint}/devices/${deviceId}/users/${userId}/links`);
  }

}

exports.ThingsGetDeviceByDeviceUserRequest = ThingsGetDeviceByDeviceUserRequest;
//# sourceMappingURL=things-get-device-by-device-user-request.js.map