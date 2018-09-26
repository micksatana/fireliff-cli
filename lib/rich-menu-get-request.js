import { RichMenuRequest } from './rich-menu-request';

export class RichMenuGetRequest extends RichMenuRequest {
    constructor(options) {
        super(options);
    }
    send() {
        return this.axios.get(`${this.endpoint}/list`);
    }
}
