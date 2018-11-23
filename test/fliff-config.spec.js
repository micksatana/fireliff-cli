import { FLIFF } from '../lib/fliff';
import { FLIFFError } from '../lib/fliff-error';
import { FunctionsConfig } from '../lib/functions-config';

describe('fliff config', () => {

    beforeAll(() => {
        jest.spyOn(FunctionsConfig, 'set').mockResolvedValue(true);
    });

    afterAll(() => {
        FunctionsConfig.set.mockRestore();
    });

    describe('when no options provided', () => {
        const options = {};
        let fliff;

        beforeAll(() => {
            fliff = new FLIFF();
            FunctionsConfig.set.mockReset();
        });

        it('reject with error', async () => {
            await expect(fliff.config(options)).rejects.toEqual(new FLIFFError(FLIFF.ErrorMessages.ConfigRequiredIdSecretOrName));
        });

        it('not set', () => {
            expect(FunctionsConfig.set).not.toHaveBeenCalled();
        });

    });

    describe('when options.id is provided', () => {
        const options = {
            id: 'testId'
        };
        let fliff;

        beforeAll(() => {
            fliff = new FLIFF();
        });

        it('resolves correctly', async () => {
            await expect(fliff.config(options)).resolves.toEqual({ line: { channel_id: options.id } });
        });
    });

    describe('when options.secret is provided', () => {
        const options = {
            secret: 'testSecret'
        };
        let fliff;

        beforeAll(() => {
            fliff = new FLIFF();
        });

        it('resolves correctly', async () => {
            await expect(fliff.config(options)).resolves.toEqual({ line: { channel_secret: options.secret } });
        });
    });

    describe('when options.token is provided', () => {
        const options = {
            token: 'testToken'
        };
        let fliff;

        beforeAll(() => {
            fliff = new FLIFF();
        });

        it('resolves correctly', async () => {
            await expect(fliff.config(options)).resolves.toEqual({ line: { access_token: options.token } });
        });
    });

});
