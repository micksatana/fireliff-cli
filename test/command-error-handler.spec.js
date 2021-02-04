import '../lib/colors-set-theme';
import { commandErrorHandler } from '../lib/shared';

describe('commandErrorHandler', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterAll(() => {
    console.log.mockRestore();
    process.exit.mockRestore();
  });

  describe('when UNKNOWN_OPTION', () => {
    let error;

    beforeAll(() => {
      error = new Error('Blah blah error');
      error.name = 'UNKNOWN_OPTION';
      error.optionName = 'blah';

      commandErrorHandler(error);
    });

    it('log error', () => {
      expect(console.log).toHaveBeenCalledWith(
        `Unknown option ${error.optionName.input}`.error
      );
    });

    it('exit with code 1', () => {
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('when unknown error', () => {
    let error;

    beforeAll(() => {
      error = new Error('something else');
      error.name = 'somethingelse';

      commandErrorHandler(error);
    });

    it('log error', () => {
      expect(console.log).toHaveBeenCalledWith(error.toString().error);
    });

    it('exit with code 1', () => {
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
