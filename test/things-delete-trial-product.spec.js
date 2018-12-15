import { FunctionsConfig } from '../lib/functions-config';
import { Things } from '../lib/things';
import { ThingsError } from '../lib/things-error';
import { ThingsDeleteTrialProductRequest } from '../lib/things-delete-trial-product-request';

jest.mock('../lib/things-delete-trial-product-request');

describe('things delete:trial', () => {
    let accessToken = 'testAccessToken';

    beforeAll(() => {
        jest.spyOn(FunctionsConfig, 'AccessToken', 'get').mockReturnValue(accessToken);
    });

    afterAll(() => {
        FunctionsConfig.AccessToken.mockRestore();
        ThingsDeleteTrialProductRequest.mockRestore();
    });

    it('contains error messages', () => {
        expect(Things.ErrorMessages.FailedToDeleteTrialProduct).toBeDefined();
        expect(Things.ErrorMessages.FailedToDeleteTrialProduct401).toBeDefined();
        expect(Things.ErrorMessages.FailedToDeleteTrialProduct404).toBeDefined();
    });

    describe('deleteTrialProduct', () => {
        let productId = 'testProductID';
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
                ThingsDeleteTrialProductRequest.mockImplementation(() => { return req; });
                things = new Things();
                result = await things.deleteTrialProduct(productId);
            });

            it('create request with access token', () => {
                expect(ThingsDeleteTrialProductRequest).toHaveBeenCalledWith({ accessToken });
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
                ThingsDeleteTrialProductRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.deleteTrialProduct(productId).catch(catchedError => result = catchedError);
            });

            it('reject with error', () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToDeleteTrialProduct401));
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
                ThingsDeleteTrialProductRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.deleteTrialProduct(productId).catch(catchedError => result = catchedError);
            });

            it('reject with error', async () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToDeleteTrialProduct404));
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
                ThingsDeleteTrialProductRequest.mockImplementation(() => { return req; });
                things = new Things();
                await things.deleteTrialProduct(productId).catch(catchedError => result = catchedError);
            });

            it('reject with error', async () => {
                expect(result).toEqual(new ThingsError(Things.ErrorMessages.FailedToDeleteTrialProduct));
            });

        });

    });

});
