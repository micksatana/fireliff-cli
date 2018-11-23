import { FLIFF } from '../lib/fliff';
import { FLIFFError } from '../lib/fliff-error';
import { FunctionsConfig } from '../lib/functions-config';
import { LIFFConfig } from '../lib/liff-config';
import { LIFFUpdateRequest } from '../lib/liff-update-request';

jest.mock('../lib/liff-update-request');

describe('fliff update', () => {
    const fakeConfig = {
        line: {
            access_token: 'testAccessToken',
            channel_id: 'testChannelId',
            channel_secret: 'testChannelSecret'
        }
    };
    const request = {
        send: () => Promise.resolve(true)
    };
    let fliff = new FLIFF();

    beforeAll(() => {
        FunctionsConfig.config = fakeConfig;
        LIFFUpdateRequest.mockImplementation(() => request);
    });

    afterAll(() => {
        delete FunctionsConfig.config;
        LIFFUpdateRequest.mockRestore();
    });

    describe('when missing id and name options', () => {

        it('reject with error', async () => {
            await expect(fliff.update({})).rejects.toEqual(new FLIFFError(FLIFF.ErrorMessages.UpdateRequiredIdOrName));
        });

    });

    describe('when name option is provided', () => {
        let options = {
            name: 'testName'
        };

        describe('and id option is not provided', () => {

            describe('and name is never set before', () => {
                let rsUpdate;

                beforeAll(async () => {
                    jest.spyOn(LIFFConfig, 'getViewIdByName').mockResolvedValue(null);
                    await fliff.update(options).catch(errUpdate => rsUpdate = errUpdate);
                });

                afterAll(() => {
                    LIFFConfig.getViewIdByName.mockRestore();
                });

                it('try to get id from name', () => {
                    expect(LIFFConfig.getViewIdByName).toHaveBeenCalled();
                });

                it('reject with error', () => {
                    expect(rsUpdate).toEqual(new FLIFFError(FLIFF.ErrorMessages.FailedToRetrieveIdUsingName));
                });

            });

        });

    });

    describe('when id option is provided', () => {
        let options = {
            id: 'testId'
        };

        describe('and name option is not provided', () => {

            describe('and id is never set before', () => {
                let rsUpdate;

                beforeAll(async () => {
                    jest.spyOn(LIFFConfig, 'getViewNameById').mockResolvedValue(null);
                    await fliff.update(options).catch(errUpdate => rsUpdate = errUpdate);
                });

                afterAll(() => {
                    LIFFConfig.getViewNameById.mockRestore();
                });

                it('try to get name from id', () => {
                    expect(LIFFConfig.getViewNameById).toHaveBeenCalled();
                });

                it('reject with error', () => {
                    expect(rsUpdate).toEqual(new FLIFFError(FLIFF.ErrorMessages.FailedToRetrieveNameUsingId));
                });

            });

        });

    });

    describe('when all options provided', () => {
        const options = {
            id: 'testId',
            name: 'testName',
            type: 'full',
            url: 'https://www.facebook.com/intocode',
            description: 'testDesc',
            ble: 'False'
        };
        const expectedData = {
            description: options.description,
            features: {
                ble: (options.ble.toLowerCase() == 'false') ? false : true
            },
            view: {
                type: options.type,
                url: options.url
            }
        };

        describe('and able to send', () => {
            const fakeSentResult = { response: 'something' };
            let rsSend;

            beforeAll(async () => {
                jest.spyOn(request, 'send').mockResolvedValue(fakeSentResult);
                rsSend = await fliff.update(options);
            });

            afterAll(() => {
                request.send.mockRestore();
            });

            it('send with correct data', () => {
                expect(request.send).toHaveBeenCalledWith(options.id, expectedData);
            });

            it('return correct result', () => {
                expect(rsSend).toEqual(fakeSentResult);
            });

        });

        describe('and not able to send', () => {

            describe('and error has response message in data', () => {
                const fakeError = {
                    response: {
                        data: {
                            message: {
                                error: 'Test error message'
                            }
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
                    await expect(fliff.update(options)).rejects.toEqual(fakeError.response.data.message.error);
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
                    await expect(fliff.update(options)).rejects.toEqual(fakeError);
                });

            });

        });

    });
});
