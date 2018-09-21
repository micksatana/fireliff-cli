import Axios from 'axios';
import { LIFFGetRequest } from '../lib/liff-get-request';

describe('LIFFGetRequest', () => {

    describe('when create an instance with options.runtimeConfig', () => {
        let req;
        let accessToken = 'someaccesstoken';

        beforeAll(() => {
            spyOn(Axios, 'create').and.callThrough();
            req = new LIFFGetRequest({ accessToken });
        });

        it('should have correct endpoint', () => {
            expect(req.endpoint).toEqual('https://api.line.me/liff/v1/apps');
        });

        it('should create axios instance with correct headers for LINE API', () => {
            expect(Axios.create).toBeCalledWith({
                headers: {
                    'authorization': `Bearer ${accessToken}`,
                    'content-type': 'application/json'
                }
            });
            expect(req.axios).toBeDefined();
        });

        describe('when send a request', () => {
            beforeAll(() => {
                spyOn(req.axios, 'get').and.returnValue(Promise.resolve('any'));
                req.send();
            });
            it('should call to correct endpoint', () => {
                expect(req.axios.get).toHaveBeenCalledTimes(1);
                expect(req.axios.get).toBeCalledWith(req.endpoint);
            });
            afterAll(() => {
                req.axios.get.restore();
            });
        });

        afterAll(() => {
            Axios.create.restore();
        });

    });

});
