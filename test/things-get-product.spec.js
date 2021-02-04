import { FunctionsConfig } from '../lib/functions-config';
import { Things } from '../lib/things';
import { ThingsError } from '../lib/things-error';
import { ThingsGetProductRequest } from '../lib/things-get-product-request';

jest.mock('../lib/things-get-product-request');

describe('things get:device', () => {
  let accessToken = 'testAccessToken';

  beforeAll(() => {
    jest
      .spyOn(FunctionsConfig, 'AccessToken', 'get')
      .mockReturnValue(accessToken);
  });

  afterAll(() => {
    FunctionsConfig.AccessToken.mockRestore();
    ThingsGetProductRequest.mockRestore();
  });

  it('contains error messages', () => {
    expect(Things.ErrorMessages.FailedToGetProduct).toBeDefined();
    expect(Things.ErrorMessages.FailedToGetProduct401).toBeDefined();
    expect(Things.ErrorMessages.FailedToGetProduct404).toBeDefined();
  });

  describe('getProduct', () => {
    let deviceId = 'testDeviceID';
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
        ThingsGetProductRequest.mockImplementation(() => {
          return req;
        });
        things = new Things();
        result = await things.getProduct(deviceId);
      });

      it('create request with access token', () => {
        expect(ThingsGetProductRequest).toHaveBeenCalledWith({ accessToken });
      });

      it('send with deviceId', () => {
        expect(req.send).toHaveBeenCalledWith(deviceId);
      });

      it('resolve with response data', () => {
        expect(result).toEqual(res.data);
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
        ThingsGetProductRequest.mockImplementation(() => {
          return req;
        });
        things = new Things();
        await things
          .getProduct(deviceId)
          .catch((catchedError) => (result = catchedError));
      });

      it('reject with error', () => {
        expect(result).toEqual(
          new ThingsError(Things.ErrorMessages.FailedToGetProduct401)
        );
      });
    });

    describe('when failed with 404', () => {
      let things;
      let error = {
        response: {
          status: 404,
        },
      };
      let req = {
        send: () => {},
      };
      let result;

      beforeAll(async () => {
        jest.spyOn(req, 'send').mockRejectedValue(error);
        ThingsGetProductRequest.mockImplementation(() => {
          return req;
        });
        things = new Things();
        await things
          .getProduct(deviceId)
          .catch((catchedError) => (result = catchedError));
      });

      it('reject with error', async () => {
        expect(result).toEqual(
          new ThingsError(Things.ErrorMessages.FailedToGetProduct404)
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
        ThingsGetProductRequest.mockImplementation(() => {
          return req;
        });
        things = new Things();
        await things
          .getProduct(deviceId)
          .catch((catchedError) => (result = catchedError));
      });

      it('reject with error', async () => {
        expect(result).toEqual(
          new ThingsError(Things.ErrorMessages.FailedToGetProduct)
        );
      });
    });
  });
});
