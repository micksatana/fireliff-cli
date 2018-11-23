import { FLIFF } from '../lib/fliff';
import { FLIFFError } from '../lib/fliff-error';
import { FunctionsConfig } from '../lib/functions-config';

describe('fliff config', () => {

    describe('when no options provided', () => {
        const options = {};
        let fliff;

        beforeAll(() => {
            jest.spyOn(FunctionsConfig, 'set').mockResolvedValue(true);
            fliff = new FLIFF();
        });

        afterAll(() => {
            FunctionsConfig.set.mockRestore();
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

        describe('and able to set config', () => {
            let fliff;

            beforeAll(() => {
                jest.spyOn(FunctionsConfig, 'set').mockResolvedValue(true);
                fliff = new FLIFF();
            });

            afterAll(() => {
                FunctionsConfig.set.mockRestore();
            });

            it('resolves correctly', async () => {
                await expect(fliff.config(options)).resolves.toEqual({ line: { channel_id: options.id } });
            });

        });

        describe('and failed to set config', () => {
            const fakeError = new Error('some error');
            let fliff;

            beforeAll(() => {
                jest.spyOn(FunctionsConfig, 'set').mockRejectedValue(fakeError);
                fliff = new FLIFF();
            });

            afterAll(() => {
                FunctionsConfig.set.mockRestore();
            });

            it('reject with error', async () => {
                await expect(fliff.config(options)).rejects.toEqual(fakeError);
            });

        });

    });

    describe('when options.secret is provided', () => {
        const options = {
            secret: 'testSecret'
        };

        describe('and able to set config', () => {
            let fliff;

            beforeAll(() => {
                jest.spyOn(FunctionsConfig, 'set').mockResolvedValue(true);
                fliff = new FLIFF();
            });

            afterAll(() => {
                FunctionsConfig.set.mockRestore();
            });

            it('resolves correctly', async () => {
                await expect(fliff.config(options)).resolves.toEqual({ line: { channel_secret: options.secret } });
            });

        });

        describe('and failed to set config', () => {
            const fakeError = new Error('some error');
            let fliff;

            beforeAll(() => {
                jest.spyOn(FunctionsConfig, 'set').mockRejectedValue(fakeError);
                fliff = new FLIFF();
            });

            afterAll(() => {
                FunctionsConfig.set.mockRestore();
            });

            it('reject with error', async () => {
                await expect(fliff.config(options)).rejects.toEqual(fakeError);
            });

        });

    });

    describe('when options.token is provided', () => {
        const options = {
            token: 'testToken'
        };

        describe('and able to set config', () => {
            let fliff;

            beforeAll(() => {
                jest.spyOn(FunctionsConfig, 'set').mockResolvedValue(true);
                fliff = new FLIFF();
            });

            afterAll(() => {
                FunctionsConfig.set.mockRestore();
            });

            it('resolves correctly', async () => {
                await expect(fliff.config(options)).resolves.toEqual({ line: { access_token: options.token } });
            });

        });

        describe('and failed to set config', () => {
            const fakeError = new Error('some error');
            let fliff;

            beforeAll(() => {
                jest.spyOn(FunctionsConfig, 'set').mockRejectedValue(fakeError);
                fliff = new FLIFF();
            });

            afterAll(() => {
                FunctionsConfig.set.mockRestore();
            });

            it('reject with error', async () => {
                await expect(fliff.config(options)).rejects.toEqual(fakeError);
            });

        });

    });

});
