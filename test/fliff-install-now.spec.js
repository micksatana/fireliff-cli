import { FLIFF } from '../lib/fliff';
const prompt = require('prompt');
const childProcess = require('child_process');

jest.mock('prompt');
jest.mock('child_process');

describe('fliff installNow method', () => {
  const initPath = 'cache';

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    console.log.mockRestore();
  });

  describe('when get fail', () => {
    let fliff;
    let rsInstall;

    beforeAll(async () => {
      jest.spyOn(prompt, 'start').mockImplementation(() => {});
      jest.spyOn(prompt, 'get').mockImplementation((arr, callback) => {
        callback(new Error('Get error'), null);
      });
      fliff = new FLIFF();

      await fliff
        .installNow(initPath)
        .catch((errInstall) => (rsInstall = errInstall));
    });

    afterAll(() => {
      prompt.start.mockRestore();
      prompt.get.mockRestore();
    });

    it('start', () => {
      expect(fliff.prompt.start).toHaveBeenCalled();
    });

    it('get', () => {
      expect(fliff.prompt.get).toHaveBeenCalledWith(
        [
          {
            name: 'installNow',
            message: 'Do you want to install node modules now? [yes/no]',
            validator: /y[es]*|n[o]?/,
            default: 'yes',
          },
        ],
        expect.anything()
      );
    });

    it('reject with error', () => {
      expect(rsInstall).toEqual(new Error('Get error'));
    });
  });

  describe('when user answer yes', () => {
    describe('and success', () => {
      let fliff;

      beforeAll(() => {
        jest.spyOn(prompt, 'start').mockImplementation(() => {});
        jest.spyOn(prompt, 'get').mockImplementation((arr, callback) => {
          callback(null, {
            installNow: 'yes',
          });
        });
        jest.spyOn(childProcess, 'spawn').mockImplementation(() => {
          return {
            stderr: {
              on: () => {},
            },
            on: (name, callback) => {
              callback(0);
            },
          };
        });
        fliff = new FLIFF();
      });

      afterAll(() => {
        prompt.start.mockRestore();
        prompt.get.mockRestore();
        childProcess.spawn.mockRestore();
      });

      it('resolve true', async () => {
        await expect(fliff.installNow(initPath)).resolves.toEqual(true);
      });
    });

    describe('and fail', () => {
      let fliff;

      beforeAll(async () => {
        jest.spyOn(prompt, 'start').mockImplementation(() => {});
        jest.spyOn(prompt, 'get').mockImplementation((arr, callback) => {
          callback(null, {
            installNow: 'yes',
          });
        });
        jest.spyOn(childProcess, 'spawn').mockImplementation(() => {
          return {
            stderr: {
              on: () => {},
            },
            on: (name, callback) => {
              callback(1);
            },
          };
        });
        fliff = new FLIFF();
      });

      afterAll(() => {
        prompt.start.mockRestore();
        prompt.get.mockRestore();
        childProcess.spawn.mockRestore();
      });

      it('reject with code', async () => {
        await expect(fliff.installNow(initPath)).rejects.toEqual(1);
      });
    });
  });
});
