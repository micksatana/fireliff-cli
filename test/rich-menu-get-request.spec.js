import Axios from 'axios';
import { RichMenuGetRequest } from '../lib/rich-menu-get-request';

describe('RichMenuGetRequest', () => {

    describe('when create an instance with options.accessToken', () => {
        let req;
        let accessToken = 'someaccesstoken';

        beforeAll(() => {
            jest.spyOn(Axios, 'create');
            req = new RichMenuGetRequest({ accessToken });
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

        describe('when send a request', () => {
            beforeAll(() => {
                jest.spyOn(req.axios, 'get').mockResolvedValue('any');
                req.send();
            });
            it('should call to correct endpoint', () => {
                expect(req.axios.get).toHaveBeenCalledTimes(1);
                expect(req.axios.get).toHaveBeenCalledWith(`${req.endpoint}/list`);
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
