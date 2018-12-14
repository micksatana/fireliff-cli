export class ThingsError extends Error {

    constructor(message) {
        super(message);
        this.name = 'ThingsError';
    }

}
