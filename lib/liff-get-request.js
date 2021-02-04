import { LIFFRequest } from './liff-request';

export class LIFFGetRequest extends LIFFRequest {
  constructor(options) {
    super(options);
  }
  send() {
    return this.axios.get(this.endpoint);
  }
}
