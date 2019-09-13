"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuthIssueTokenRequest = void 0;

var qs = _interopRequireWildcard(require("qs"));

var _oauthRequest = require("./oauth-request");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class OAuthIssueTokenRequest extends _oauthRequest.OAuthRequest {
  constructor() {
    super();
    this.endpoint = `${this.endpoint}/accessToken`;
  }

  send(channelId, channelSecret) {
    return this.axios.post(`${this.endpoint}`, qs.stringify({
      grant_type: 'client_credentials',
      client_id: channelId,
      client_secret: channelSecret
    }));
  }

}

exports.OAuthIssueTokenRequest = OAuthIssueTokenRequest;
//# sourceMappingURL=oauth-issue-token-request.js.map