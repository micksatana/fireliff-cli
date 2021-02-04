"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuthRevokeTokenRequest = void 0;

var qs = _interopRequireWildcard(require("qs"));

var _oauthRequest = require("./oauth-request");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class OAuthRevokeTokenRequest extends _oauthRequest.OAuthRequest {
  constructor() {
    super();
    this.endpoint = `${this.endpoint}/revoke`;
  }

  send(accessToken) {
    return this.axios.post(`${this.endpoint}`, qs.stringify({
      access_token: accessToken
    }));
  }

}

exports.OAuthRevokeTokenRequest = OAuthRevokeTokenRequest;
//# sourceMappingURL=oauth-revoke-token-request.js.map