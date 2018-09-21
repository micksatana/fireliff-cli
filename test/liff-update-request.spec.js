import Axios from 'axios';
import { LIFFUpdateRequest } from '../lib/liff-update-request';

describe('LIFFUpdateRequest', () => {

    describe('when create an instance with options.runtimeConfig', () => {
        let req;
        let accessToken = 'someaccesstoken';

        beforeAll(() => {
            spyOn(Axios, 'create').and.callThrough();
            req = new LIFFUpdateRequest({ accessToken });
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
            let liffId = 'jfoifhbe949';
            let data = {
                view: {
                    type: 'compact',
                    url: 'https://blahblah'
                }
            };

            beforeAll(() => {
                spyOn(req.axios, 'put').and.returnValue(Promise.resolve('any'));
                req.send(liffId, data);
            });

            it('should call to correct endpoint', () => {
                expect(req.axios.put).toHaveBeenCalledTimes(1);
                expect(req.axios.put).toBeCalledWith(`${req.endpoint}/${liffId}/view`, JSON.stringify(data));
            });

            afterAll(() => {
                req.axios.put.restore();
            });

        });

        afterAll(() => {
            Axios.create.restore();
        });

    });

});
