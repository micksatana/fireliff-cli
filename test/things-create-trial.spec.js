import { EOL } from 'os';
import { FunctionsConfig } from '../lib/functions-config';
import { Things } from '../lib/things';
import { ThingsError } from '../lib/things-error';
import { ThingsCreateTrialRequest } from '../lib/things-create-trial-request';

jest.mock('../lib/things-create-trial-request');

describe('things create:trial', () => {
  let accessToken = 'testAccessToken';

  beforeAll(() => {
    jest
      .spyOn(FunctionsConfig, 'AccessToken', 'get')
      .mockReturnValue(accessToken);
  });

  afterAll(() => {
    FunctionsConfig.AccessToken.mockRestore();
    ThingsCreateTrialRequest.mockRestore();
  });

  it('contains error messages', () => {
    expect(Things.ErrorMessages.FailedToCreateTrial).toBeDefined();
    expect(Things.ErrorMessages.FailedToCreateTrial400).toBeDefined();
    expect(Things.ErrorMessages.FailedToCreateTrial401).toBeDefined();
    expect(Things.ErrorMessages.FailedToCreateTrial403).toBeDefined();
  });

  describe('createTrialProduct', () => {
    let liffId = 'testLIFFID';
    let productName = 'testProductName';
    let res = {
      data: 'blahblah',
    };

    describe('when success', () => {
      let things;
      let result;
      let req = {
        send: () => {},
      };

      beforeAll(async () => {
        jest.spyOn(req, 'send').mockResolvedValue(res);
        ThingsCreateTrialRequest.mockImplementation(() => {
          return req;
        });
        things = new Things();
        result = await things.createTrialProduct(liffId, productName);
      });

      it('create request with access token', () => {
        expect(ThingsCreateTrialRequest).toHaveBeenCalledWith({ accessToken });
      });

      it('send with liffId', () => {
        expect(req.send).toHaveBeenCalledWith(liffId, productName);
      });

      it('resolve with response data', () => {
        expect(result).toEqual(res.data);
      });
    });

    describe('when failed with detail', () => {
      let things;
      let error = {
        response: {
          data: {
            detail: 'blahblah',
          },
        },
      };
      let req = {
        send: () => {},
      };
      let result;

      beforeAll(async () => {
        jest.spyOn(req, 'send').mockRejectedValue(error);
        ThingsCreateTrialRequest.mockImplementation(() => {
          return req;
        });
        things = new Things();
        await things
          .createTrialProduct(liffId, productName)
          .catch((catchedError) => (result = catchedError));
      });

      it('reject with error', () => {
        expect(result).toEqual(
          new ThingsError(
            Things.ErrorMessages.FailedToCreateTrial +
              EOL +
              error.response.data.detail.warn
          )
        );
      });
    });

    describe('when failed with 400', () => {
      let things;
      let error = {
        response: {
          status: 400,
        },
      };
      let req = {
        send: () => {},
      };
      let result;

      beforeAll(async () => {
        jest.spyOn(req, 'send').mockRejectedValue(error);
        ThingsCreateTrialRequest.mockImplementation(() => {
          return req;
        });
        things = new Things();
        await things
          .createTrialProduct(liffId, productName)
          .catch((catchedError) => (result = catchedError));
      });

      it('reject with error', () => {
        expect(result).toEqual(
          new ThingsError(Things.ErrorMessages.FailedToCreateTrial400)
        );
      });
    });

    describe('when failed with 401', () => {
      let things;
      let error = {
        response: {
          status: 401,
        },
      };
      let req = {
        send: () => {},
      };
      let result;

      beforeAll(async () => {
        jest.spyOn(req, 'send').mockRejectedValue(error);
        ThingsCreateTrialRequest.mockImplementation(() => {
          return req;
        });
        things = new Things();
        await things
          .createTrialProduct(liffId, productName)
          .catch((catchedError) => (result = catchedError));
      });

      it('reject with error', () => {
        expect(result).toEqual(
          new ThingsError(Things.ErrorMessages.FailedToCreateTrial401)
        );
      });
    });

    describe('when failed with 403', () => {
      let things;
      let error = {
        response: {
          status: 403,
        },
      };
      let req = {
        send: () => {},
      };
      let result;

      beforeAll(async () => {
        jest.spyOn(req, 'send').mockRejectedValue(error);
        ThingsCreateTrialRequest.mockImplementation(() => {
          return req;
        });
        things = new Things();
        await things
          .createTrialProduct(liffId, productName)
          .catch((catchedError) => (result = catchedError));
      });

      it('reject with error', async () => {
        expect(result).toEqual(
          new ThingsError(Things.ErrorMessages.FailedToCreateTrial403)
        );
      });
    });

    describe('when failed with unknown', () => {
      let things;
      let error = {
        response: {
          status: 500,
        },
      };
      let req = {
        send: () => {},
      };
      let result;

      beforeAll(async () => {
        jest.spyOn(req, 'send').mockRejectedValue(error);
        ThingsCreateTrialRequest.mockImplementation(() => {
          return req;
        });
        things = new Things();
        await things
          .createTrialProduct(liffId, productName)
          .catch((catchedError) => (result = catchedError));
      });

      it('reject with error', async () => {
        expect(result).toEqual(
          new ThingsError(Things.ErrorMessages.FailedToCreateTrial)
        );
      });
    });
  });
});
