import { ThingsError } from '../lib/things-error';

describe('ThingsError', () => {
    const fakeErrorMessage = 'Test ThingsError message';
    let error;

    beforeAll(() => {
        error = new ThingsError(fakeErrorMessage);
    });

    it('has correct instanceof', () => {
        expect(error instanceof Error).toEqual(true);
        expect(error instanceof ThingsError).toEqual(true);
    });

    it('has correct message', () => {
        expect(error.message).toEqual(fakeErrorMessage);
    });

});
