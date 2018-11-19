import Axios from 'axios';
import { RichMenuDeleteRequest } from '../lib/rich-menu-delete-request';

describe('RichMenuDeleteRequest', () => {

    describe('when create an instance with options.accessToken', () => {
        let req;
        let accessToken = 'someaccesstoken';

        beforeAll(() => {
            jest.spyOn(Axios, 'create');
            req = new RichMenuDeleteRequest({ accessToken });
        });

        it('should have correct endpoint', () => {
            expect(req.endpoint).toEqual('https://api.line.me/v2/bot/richmenu');
        });

        it('should create axios instance with correct headers for LINE API', () => {
            expect(Axios.create).toHaveBeenCalledWith({
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
                jest.spyOn(req.axios, 'delete').mockResolvedValue('any');
                req.send(richMenuId);
            });
            it('should call to correct endpoint', () => {
                expect(req.axios.delete).toHaveBeenCalledTimes(1);
                expect(req.axios.delete).toHaveBeenCalledWith(`${req.endpoint}/${richMenuId}`);
            });
            afterAll(() => {
                req.axios.delete.mockRestore();
            });
        });

        afterAll(() => {
            Axios.create.mockRestore();
        });

    });

});
