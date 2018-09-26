import Axios from 'axios';
import { RichMenuDeleteRequest } from '../lib/rich-menu-delete-request';

describe('RichMenuDeleteRequest', () => {

    describe('when create an instance with options.accessToken', () => {
        let req;
        let accessToken = 'someaccesstoken';

        beforeAll(() => {
            spyOn(Axios, 'create').and.callThrough();
            req = new RichMenuDeleteRequest({ accessToken });
        });

        it('should have correct endpoint', () => {
            expect(req.endpoint).toEqual('https://api.line.me/v2/bot/richmenu');
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

        describe('when send richMenuId', () => {
            let richMenuId = 'sdlfjoee';
            beforeAll(() => {
                spyOn(req.axios, 'delete').and.returnValue(Promise.resolve('any'));
                req.send(richMenuId);
            });
            it('should call to correct endpoint', () => {
                expect(req.axios.delete).toHaveBeenCalledTimes(1);
                expect(req.axios.delete).toBeCalledWith(`${req.endpoint}/${richMenuId}`);
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
