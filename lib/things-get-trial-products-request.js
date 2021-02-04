import { ThingsRequest } from './things-request';

export class ThingsGetTrialProductsRequest extends ThingsRequest {
  constructor(options) {
    super(options);

    this.endpoint = `${this.endpoint}/trial/products`;
  }

  send() {
    return this.axios.get(this.endpoint);
  }
}
