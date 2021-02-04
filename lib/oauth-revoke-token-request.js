import * as qs from 'qs';
import { OAuthRequest } from './oauth-request';

export class OAuthRevokeTokenRequest extends OAuthRequest {
  constructor() {
    super();
    this.endpoint = `${this.endpoint}/revoke`;
  }

  send(accessToken) {
    return this.axios.post(
      `${this.endpoint}`,
      qs.stringify({ access_token: accessToken })
    );
  }
}
