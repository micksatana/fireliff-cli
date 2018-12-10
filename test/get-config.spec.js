import { getConfig } from '../lib/shared';
import { FunctionsConfig } from '../lib/functions-config';

describe('getConfig', () => {
    beforeAll(() => {
        // getConfig display lots of things via console.log, we don't want to see while testing
        jest.spyOn(console, 'log').mockImplementation(() => {});
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
            jest.spyOn(FunctionsConfig, 'get').mockResolvedValue(config);
            result = await getConfig();
        });

        it('should get config', () => {
            expect(FunctionsConfig.get).toHaveBeenCalledTimes(1);
        });

        it('should get correct result', () => {
            expect(result).toEqual(config);
        });

        afterAll(() => {
            FunctionsConfig.get.mockRestore();
        });

    });

    describe('when cannot get config', () => {
        const expectedError = new Error('Error while getting config');

        beforeAll(async () => {
            jest.spyOn(FunctionsConfig, 'get').mockImplementation(() => {
                throw expectedError;
            });
            jest.spyOn(process, 'exit').mockImplementation(() => {});
            await getConfig();
        });

        it('should get config and fail', () => {
            expect(FunctionsConfig.get).toHaveBeenCalledTimes(1);
        });

        it('should exit with status 1', () => {
            expect(process.exit).toHaveBeenCalledTimes(1);
            expect(process.exit).toHaveBeenCalledWith(1);
        });

        afterAll(() => {
            FunctionsConfig.get.mockRestore();
            process.exit.mockRestore();
        });

    });

    afterAll(() => {
        console.log.mockRestore();
    });
});
