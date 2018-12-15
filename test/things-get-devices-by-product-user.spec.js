import { FunctionsConfig } from '../lib/functions-config';
import { Things } from '../lib/things';
import { ThingsError } from '../lib/things-error';
import { ThingsGetDevicesByProductUserRequest } from '../lib/things-get-devices-by-product-user-request';

jest.mock('../lib/things-get-devices-by-product-user-request');

describe('things get:device', () => {
    let accessToken = 'testAccessToken';

    beforeAll(() => {
        jest.spyOn(FunctionsConfig, 'AccessToken', 'get').mockReturnValue(accessToken);
    });

    afterAll(() => {
        FunctionsConfig.AccessToken.mockRestore();
        ThingsGetDevicesByProductUserRequest.mockRestore();
    });

    it('contains error messages', () => {
        expect(Things.ErrorMessages.FailedToGetDevicesByProductUser).toBeDefined();
    });

    describe('getDevicesByProductUser', () => {
        let productId = 'testProductID';
        let userId = 'testUserID';
        let res = {
            data: {
                items: [
                    {
                        userId: 'testUserId',
                        device: {
                            id: 'testDeviceId',
                            productId: 'testProductId',
                            productSpecificDeviceId: 'testPSDI'
                        },
                        deviceDisplayName: 'Test Product Name'
                    }
                ]
            }
        };

        describe('when success', () => {
            let things;
            let result;
            let req = {
                send: () => { }
            };

            beforeAll(async () => {
                jest.spyOn(req, 'send').mockResolvedValue(res);
                ThingsGetDevicesByProductUserRequest.mockImplementation(() => { return req; });
                things = new Things();
                result = await things.getDevicesByProductUser(productId, userId);
            });

            it('create request with access token', () => {
                expect(ThingsGetDevicesByProductUserRequest).toHaveBeenCalledWith({ accessToken });
            });

            it('send with correct data', () => {
                expect(req.send).toHaveBeenCalledWith(productId, userId);
            });

            it('resolve with response data', () => {
                expect(result).toEqual(res.data);
            });

        });

        describe('when failed with 401', () => {
            let things;
            let error = {
                response: {
                    status: 401
                }
            };
            let req = {
                send: () => { }
            };
            let result;

            beforeAll(async () => {
                jest.spyOn(req, 'send').mockRejectedValue(error);
                ThingsGetDevicesByProductUserRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.getDevicesByProductUser(productId, userId).catch(catchedError => result = catchedError);
            });

            it('reject with error', () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToGetDevicesByProductUser401));
            });

        });

        describe('when failed with 404', () => {
            let things;
            let error = {
                response: {
                    status: 404
                }
            };
            let req = {
                send: () => { }
            };
            let result;

            beforeAll(async () => {
                jest.spyOn(req, 'send').mockRejectedValue(error);
                ThingsGetDevicesByProductUserRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.getDevicesByProductUser(productId, userId).catch(catchedError => result = catchedError);
            });

            it('reject with error', async () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToGetDevicesByProductUser404));
            });

        });

        describe('when failed with unknown', () => {
            let things;
            let error = {
                response: {
                    status: 500
                }
            };
            let req = {
                send: () => { }
            };
            let result;

            beforeAll(async () => {
                jest.spyOn(req, 'send').mockRejectedValue(error);
                ThingsGetDevicesByProductUserRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.getDevicesByProductUser(productId, userId).catch(catchedError => result = catchedError);
            });

            it('reject with error', async () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToGetDevicesByProductUser));
            });

        });

    });

});
