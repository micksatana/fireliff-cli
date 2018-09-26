import Axios from 'axios';
import { RichMenuAddRequest } from '../lib/rich-menu-add-request';

describe('RichMenuAddRequest', () => {

    describe('when create an instance with options.accessToken', () => {
        let req;
        let accessToken = 'someaccesstoken';

        beforeAll(() => {
            spyOn(Axios, 'create').and.callThrough();
            req = new RichMenuAddRequest({ accessToken });
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
