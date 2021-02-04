import { ThingsRequest } from './things-request';

export class ThingsGetProductRequest extends ThingsRequest {
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
