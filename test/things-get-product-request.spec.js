import Axios from 'axios';
import { ThingsGetProductRequest } from '../lib/things-get-product-request';

describe('ThingsGetRequest', () => {
  describe('when create an instance with options.accessToken', () => {
    let req;
    let accessToken = 'someaccesstoken';

    beforeAll(() => {
      jest.spyOn(Axios, 'create');
      req = new ThingsGetProductRequest({ accessToken });
    });

    it('should have correct endpoint', () => {
      expect(req.endpoint).toEqual('https://api.line.me/things/v1/devices');
    });

    it('should create axios instance with correct headers for LINE API', () => {
      expect(Axios.create).toHaveBeenCalledWith({
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
      });

      expect(req.axios).toBeDefined();
    });

    describe('when send a request', () => {
      let deviceId = 'xxxx';

      beforeAll(() => {
        jest.spyOn(req.axios, 'get').mockResolvedValue('any');
        req.send(deviceId);
      });

      it('should call to correct endpoint', () => {
        expect(req.axios.get).toHaveBeenCalledTimes(1);
        expect(req.axios.get).toHaveBeenCalledWith(
          `https://api.line.me/things/v1/devices/${deviceId}`
        );
      });

      afterAll(() => {
        req.axios.get.mockRestore();
      });
    });

    afterAll(() => {
      Axios.create.mockRestore();
    });
  });
});
