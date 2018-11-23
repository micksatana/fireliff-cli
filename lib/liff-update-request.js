import { LIFFRequest } from './liff-request';

export class LIFFUpdateRequest extends LIFFRequest {

    constructor(options) {
        super(options);
    }

    send(liffId, data) {
        return this.axios.put(`${this.endpoint}/${liffId}`, JSON.stringify(data));
    }

}
