import { FunctionsConfig } from '../lib/functions-config';
import { Things } from '../lib/things';
import { ThingsError } from '../lib/things-error';
import { ThingsGetDeviceByDeviceUserRequest } from '../lib/things-get-device-by-device-user-request';

jest.mock('../lib/things-get-device-by-device-user-request');

describe('things get:device', () => {
    let accessToken = 'testAccessToken';

    beforeAll(() => {
        jest.spyOn(FunctionsConfig, 'AccessToken', 'get').mockReturnValue(accessToken);
    });

    afterAll(() => {
        FunctionsConfig.AccessToken.mockRestore();
        ThingsGetDeviceByDeviceUserRequest.mockRestore();
    });

    it('contains error messages', () => {
        expect(Things.ErrorMessages.FailedToGetDeviceByDeviceUser).toBeDefined();
    });

    describe('getDeviceByDeviceUser', () => {
        let deviceId = 'testDeviceID';
        let userId = 'testUserID';
        let res = {
            data: {
                userId: 'testUserId',
                device: {
                    id: 'testDeviceId',
                    deviceId: 'testDeviceId',
                    deviceSpecificDeviceId: 'testPSDI'
                },
                deviceDisplayName: 'Test Device Name'
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
                ThingsGetDeviceByDeviceUserRequest.mockImplementation(() => { return req; });
                things = new Things();
                result = await things.getDeviceByDeviceUser(deviceId, userId);
            });

            it('create request with access token', () => {
                expect(ThingsGetDeviceByDeviceUserRequest).toHaveBeenCalledWith({ accessToken });
            });

            it('send with correct data', () => {
                expect(req.send).toHaveBeenCalledWith(deviceId, userId);
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
                ThingsGetDeviceByDeviceUserRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.getDeviceByDeviceUser(deviceId, userId).catch(catchedError => result = catchedError);
            });

            it('reject with error', () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToGetDeviceByDeviceUser401));
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
                ThingsGetDeviceByDeviceUserRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.getDeviceByDeviceUser(deviceId, userId).catch(catchedError => result = catchedError);
            });

            it('reject with error', async () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToGetDeviceByDeviceUser404));
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
                ThingsGetDeviceByDeviceUserRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.getDeviceByDeviceUser(deviceId, userId).catch(catchedError => result = catchedError);
            });

            it('reject with error', async () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToGetDeviceByDeviceUser));
            });

        });

    });

});
