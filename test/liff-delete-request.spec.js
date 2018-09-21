import Axios from 'axios';
import { LIFFDeleteRequest } from '../lib/liff-delete-request';

describe('LIFFDeleteRequest', () => {

    describe('when create an instance with options.runtimeConfig', () => {
        let req;
        let accessToken = 'someaccesstoken';

        beforeAll(() => {
            spyOn(Axios, 'create').and.callThrough();
            req = new LIFFDeleteRequest({ accessToken });
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

        describe('when send liffId', () => {
            let liffId = 'shkf2h39fwef';
            beforeAll(() => {
                spyOn(req.axios, 'delete').and.returnValue(Promise.resolve('any'));
                req.send(liffId);
            });
            it('should call to correct endpoint', () => {
                expect(req.axios.delete).toHaveBeenCalledTimes(1);
                expect(req.axios.delete).toBeCalledWith(`${req.endpoint}/${liffId}`);
            });
            afterAll(() => {
                req.axios.delete.restore();
            });
        });

        afterAll(() => {
            Axios.create.restore();
        });

    });

});
