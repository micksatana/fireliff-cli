import { validateConfig } from '../lib/shared';

describe('validateConfig', () => {
    const config = {
        line: {}
    };

    beforeAll(async () => {
        jest.spyOn(process, 'exit').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
        await validateConfig(config);
    });

    it('should exit with status 1', () => {
        expect(process.exit).toHaveBeenCalledTimes(1);
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    afterAll(() => {
        process.exit.mockRestore();
        console.log.mockRestore();
    });

});