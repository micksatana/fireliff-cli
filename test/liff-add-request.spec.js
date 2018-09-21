import Axios from 'axios';
import { LIFFAddRequest } from '../lib/liff-add-request';

describe('LIFFAddRequest', () => {

    describe('when create an instance with options.runtimeConfig', () => {
        let req;
        let accessToken = 'someaccesstoken';

        beforeAll(() => {
            spyOn(Axios, 'create').and.callThrough();
            req = new LIFFAddRequest({ accessToken });
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

        describe('when send data', () => {
            let data = { some: 'data' };
            beforeAll(() => {
                spyOn(req.axios, 'post').and.returnValue(Promise.resolve('any'));
                req.send(data);
            });
            it('should call to correct endpoint', () => {
                expect(req.axios.post).toHaveBeenCalledTimes(1);
                expect(req.axios.post).toBeCalledWith(req.endpoint, JSON.stringify(data));
            });
            afterAll(() => {
                req.axios.post.restore();
            });
        });

        afterAll(() => {
            Axios.create.restore();
        });

    });

});
