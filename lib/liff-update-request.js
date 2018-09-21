import { LIFFRequest } from './liff-request';

export class LIFFUpdateRequest extends LIFFRequest {
    constructor(options) {
        super(options);
    }
    send(liffId, data) {
        return this.axios.put(`https://api.line.me/liff/v1/apps/${liffId}/view`, JSON.stringify(data));
    }
}
