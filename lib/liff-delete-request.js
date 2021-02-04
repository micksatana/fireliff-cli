import { LIFFRequest } from './liff-request';

export class LIFFDeleteRequest extends LIFFRequest {
  constructor(options) {
    super(options);
  }
  send(liffId) {
    return this.axios.delete(`${this.endpoint}/${liffId}`);
  }
}
