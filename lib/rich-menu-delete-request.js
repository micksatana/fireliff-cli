import { RichMenuRequest } from './rich-menu-request';

export class RichMenuDeleteRequest extends RichMenuRequest {
  constructor(options) {
    super(options);
  }
  send(richMenuId) {
    return this.axios.delete(`${this.endpoint}/${richMenuId}`);
  }
}
