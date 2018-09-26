import Axios from 'axios';

export class RichMenuRequest {
    constructor(options) {
        this.endpoint = 'https://api.line.me/v2/bot/richmenu';
        this.axios = Axios.create({
            headers: {
                'authorization': `Bearer ${options.accessToken}`,
                'content-type': options.contentType || 'application/json'
            }
        });
    }
}
