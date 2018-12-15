import { FunctionsConfig } from '../lib/functions-config';
import { Things } from '../lib/things';
import { ThingsError } from '../lib/things-error';
import { ThingsGetTrialProductsRequest } from '../lib/things-get-trial-products-request';

jest.mock('../lib/things-get-trial-products-request');

describe('things get:trial', () => {
    let accessToken = 'testAccessToken';

    beforeAll(() => {
        jest.spyOn(FunctionsConfig, 'AccessToken', 'get').mockReturnValue(accessToken);
    });

    afterAll(() => {
        FunctionsConfig.AccessToken.mockRestore();
        ThingsGetTrialProductsRequest.mockRestore();
    });

    it('contains error messages', () => {
        expect(Things.ErrorMessages.FailedToGetTrialProducts).toBeDefined();
        expect(Things.ErrorMessages.FailedToGetTrialProducts401).toBeDefined();
        expect(Things.ErrorMessages.FailedToGetTrialProducts404).toBeDefined();
    });

    describe('getTrialProducts', () => {
        let res = {
            data: 'blahblah'
        };

        describe('when success', () => {
            let things;
            let result;
            let req = {
                send: () => { }
            };

            beforeAll(async () => {
                jest.spyOn(req, 'send').mockResolvedValue(res);
                ThingsGetTrialProductsRequest.mockImplementation(() => { return req; });
                things = new Things();
                result = await things.getTrialProducts();
            });

            it('create request with access token', () => {
                expect(ThingsGetTrialProductsRequest).toHaveBeenCalledWith({ accessToken });
            });

            it('send with ', () => {
                expect(req.send).toHaveBeenCalled();
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
                ThingsGetTrialProductsRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.getTrialProducts().catch(catchedError => result = catchedError);
            });

            it('reject with error', () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToGetTrialProducts401));
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
                ThingsGetTrialProductsRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.getTrialProducts().catch(catchedError => result = catchedError);
            });

            it('reject with error', async () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToGetTrialProducts404));
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
                ThingsGetTrialProductsRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.getTrialProducts().catch(catchedError => result = catchedError);
            });

            it('reject with error', async () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToGetTrialProducts));
            });

        });

    });

});
