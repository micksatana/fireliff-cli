import { getValidatedConfig } from '../lib/shared';
import { FunctionsConfig } from '../lib/functions-config';

describe('getValidatedConfig', () => {
    beforeAll(() => {
        // getValidatedConfig display lots of things via console.log, we don't want to see while testing
        spyOn(console, 'log').and.callFake(() => {});
    });
    
    describe('when able to get config with line.access_token', () => {
        const config = {
            line: {
                access_token: 'test-token'
            },
            views: {
                'test-shared': 'test-asdflhaso'
            },
            richmenus: {
                'test-shared': 'test-sdlhfow3f'
            }
        };

        let result;

        beforeAll(async () => {
            spyOn(FunctionsConfig, 'get').and.returnValue(Promise.resolve(config));
            result = await getValidatedConfig();
        });

        it('should get config', () => {
            expect(FunctionsConfig.get).toHaveBeenCalledTimes(1);
        });

        it('should get correct result', () => {
            expect(result).toEqual(config);
        });

        afterAll(() => {
            FunctionsConfig.get.restore();
        });

    });

    describe('when able to get config without line.access_token', () => {
        const config = {
            line: {},
            views: {
                'test-shared': 'test-asdflhaso'
            },
            richmenus: {
                'test-shared': 'test-sdlhfow3f'
            }
        };

        beforeAll(async () => {
            spyOn(FunctionsConfig, 'get').and.returnValue(Promise.resolve(config));
            spyOn(process, 'exit').and.callFake(() => {});
            await getValidatedConfig();
        });

        it('should get config', () => {
            expect(FunctionsConfig.get).toHaveBeenCalledTimes(1);
        });

        it('should exit with status 1', () => {
            expect(process.exit).toHaveBeenCalledTimes(1);
            expect(process.exit).toBeCalledWith(1);
        });

        afterAll(() => {
            FunctionsConfig.get.restore();
            process.exit.restore();
        });

    });

    describe('when cannot get config', () => {
        const expectedError = new Error('Error while getting config');

        beforeAll(async () => {
            spyOn(FunctionsConfig, 'get').and.throwError(expectedError);
            spyOn(process, 'exit').and.callFake(() => {});
            await getValidatedConfig();
        });

        it('should get config and fail', () => {
            expect(FunctionsConfig.get).toHaveBeenCalledTimes(1);
        });

        it('should exit with status 1', () => {
            expect(process.exit).toHaveBeenCalledTimes(1);
            expect(process.exit).toBeCalledWith(1);
        });

        afterAll(() => {
            FunctionsConfig.get.restore();
            process.exit.restore();
        });

    });

    afterAll(() => {
        console.log.restore();
    });
});
