export class FLIFFError extends Error {

    constructor(message) {
        super(message);
        this.name = 'FLIFFError';
    }

}
