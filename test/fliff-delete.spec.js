import { FLIFF } from '../lib/fliff';
import { FLIFFError } from '../lib/fliff-error';
import { FunctionsConfig } from '../lib/functions-config';
import { LIFFConfig } from '../lib/liff-config';
import { LIFFDeleteRequest } from '../lib/liff-delete-request';

jest.mock('../lib/liff-delete-request');

describe('fliff delete', () => {
    const fakeConfig = {
        line: {
            access_token: 'testAccessToken',
            channel_id: 'testChannelId',
            channel_secret: 'testChannelSecret'
        },
        views: {
            test1: 'abcde',
            test2: '12345'
        }
    };
    const request = {
        send: () => Promise.resolve(true)
    };
    let fliff = new FLIFF();

    beforeAll(() => {
        FunctionsConfig.config = fakeConfig;
        LIFFDeleteRequest.mockImplementation(() => request);
    });

    afterAll(() => {
        delete FunctionsConfig.config;
        LIFFDeleteRequest.mockRestore();
    });

    describe('when missing id and name options', () => {

        it('reject with error', async () => {
            await expect(fliff.delete({})).rejects.toEqual(new FLIFFError(FLIFF.ErrorMessages.DeleteRequiredIdOrName));
        });

    });

    describe('when name option is provided', () => {
        let options = {
            name: 'testName'
        };

        describe('and id option is not provided', () => {

            describe('and name is never set before', () => {
                let rsDelete;

                beforeAll(async () => {
                    jest.spyOn(LIFFConfig, 'getViewIdByName').mockResolvedValue(null);
                    await fliff.delete(options).catch(errDelete => rsDelete = errDelete);
                });

                afterAll(() => {
                    LIFFConfig.getViewIdByName.mockRestore();
                });

                it('try to get id from name', () => {
                    expect(LIFFConfig.getViewIdByName).toHaveBeenCalled();
                });

                it('reject with error', () => {
                    expect(rsDelete).toEqual(new FLIFFError(FLIFF.ErrorMessages.FailedToRetrieveIdUsingName));
                });

            });

        });

    });

    describe('when id option is provided', () => {
        let options = {
            id: 'abcde'
        };

        describe('and name option is not provided', () => {

            describe('and id is never set before', () => {
                let rsDelete;

                beforeAll(async () => {
                    jest.spyOn(LIFFConfig, 'getViewNameById').mockResolvedValue(null);
                    await fliff.delete(options).catch(errDelete => rsDelete = errDelete);
                });

                afterAll(() => {
                    LIFFConfig.getViewNameById.mockRestore();
                });

                it('try to get name from id', () => {
                    expect(LIFFConfig.getViewNameById).toHaveBeenCalled();
                });

                it('reject with error', () => {
                    expect(rsDelete).toEqual(new FLIFFError(FLIFF.ErrorMessages.FailedToRetrieveNameUsingId));
                });

            });

        });

    });

    describe('when all options provided', () => {
        const options = {
            id: 'abcde',
            name: 'test1',
            type: 'full',
            url: 'https://www.facebook.com/intocode',
            description: 'testDesc',
            ble: 'False'
        };
        const expectedData = ['test1'];

        describe('and able to send', () => {
            const fakeSentResult = { response: 'something' };
            let rsSend;

            describe('and able to unset view', () => {

                beforeAll(async () => {
                    jest.spyOn(request, 'send').mockResolvedValue(fakeSentResult);
                    jest.spyOn(LIFFConfig, 'unsetView').mockImplementation(name => Promise.resolve(name));
                    jest.spyOn(LIFFConfig, 'getViewNamesById');
                    rsSend = await fliff.delete(options);
                });

                afterAll(() => {
                    request.send.mockRestore();
                    LIFFConfig.unsetView.mockRestore();
                    LIFFConfig.getViewNamesById.mockRestore();
                });

                it('send with correct data', () => {
                    expect(request.send).toHaveBeenCalledWith(options.id);
                });

                it('return correct result', () => {
                    expect(rsSend).toEqual(expectedData);
                });

            });

            describe('and fail to unset view', () => {
                const fakeError = new Error('some unset error');

                beforeAll(async () => {
                    jest.spyOn(request, 'send').mockResolvedValue(fakeSentResult);
                    jest.spyOn(LIFFConfig, 'unsetView').mockImplementation(() => {
                        throw Error(fakeError);
                    });
                });

                afterAll(() => {
                    request.send.mockRestore();
                    LIFFConfig.unsetView.mockRestore();
                });

                it('reject with error', async () => {
                    await expect(fliff.delete(options)).rejects.toThrowError(new FLIFFError(FLIFF.ErrorMessages.FailedToUnsetViews));
                });

            });

        });

        describe('and not able to send', () => {

            describe('and error is not found', () => {
                const fakeError = {
                    response: {
                        data: {
                            message: 'not found'
                        }
                    }
                };
                let rsDelete;

                beforeAll(async () => {
                    jest.spyOn(request, 'send').mockRejectedValue(fakeError);
                    jest.spyOn(LIFFConfig, 'unsetView').mockImplementation(name => Promise.resolve(name));
                    jest.spyOn(LIFFConfig, 'getViewNamesById');
                    rsDelete = await fliff.delete(options);
                });

                afterAll(() => {
                    request.send.mockRestore();
                    LIFFConfig.unsetView.mockRestore();
                    LIFFConfig.getViewNamesById.mockRestore();
                });

                it('try to unset view', async () => {
                    expect(LIFFConfig.getViewNamesById).toHaveBeenCalledWith(options.id, fakeConfig);
                    expect(LIFFConfig.unsetView).toHaveBeenCalled();
                });

                it('result contains view names', () => {
                    expect(rsDelete).toEqual(expectedData);
                });
            });

            describe('and error has response message in data', () => {
                const fakeError = {
                    response: {
                        data: {
                            error: 'Test error message'
                        }
                    }
                };

                beforeAll(async () => {
                    jest.spyOn(request, 'send').mockRejectedValue(fakeError);
                });

                afterAll(() => {
                    request.send.mockRestore();
                });

                it('reject with error', async () => {
                    await expect(fliff.delete(options)).rejects.toEqual(fakeError.response.data.error);
                });

            });


            describe('and error is something else', () => {
                const fakeError = 'any';

                beforeAll(async () => {
                    jest.spyOn(request, 'send').mockRejectedValue(fakeError);
                });

                afterAll(() => {
                    request.send.mockRestore();
                });

                it('reject with error', async () => {
                    await expect(fliff.delete(options)).rejects.toEqual(fakeError);
                });

            });

        });

    });
});
