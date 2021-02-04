import { LIFFRequest } from './liff-request';

export class LIFFAddRequest extends LIFFRequest {
  constructor(options) {
    super(options);
  }
  send(data) {
    return this.axios.post(this.endpoint, JSON.stringify(data));
  }
}
