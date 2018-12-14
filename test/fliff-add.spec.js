import { FLIFF } from '../lib/fliff';
import { FLIFFError } from '../lib/fliff-error';
import { FunctionsConfig } from '../lib/functions-config';
import { LIFFConfig } from '../lib/liff-config';
import { LIFFAddRequest } from '../lib/liff-add-request';

jest.mock('../lib/liff-add-request');

describe('fliff add', () => {
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
        LIFFAddRequest.mockImplementation(() => request);
    });

    afterAll(() => {
        delete FunctionsConfig.config;
        LIFFAddRequest.mockRestore();
    });

    describe('when missing name options', () => {

        it('reject with error', async () => {
            await expect(fliff.add({ url: 'https://blah' })).rejects.toEqual(new FLIFFError(FLIFF.ErrorMessages.AddRequiredNameAndUrl));
        });

    });

    describe('when missing url options', () => {

        it('reject with error', async () => {
            await expect(fliff.add({ name: 'test1' })).rejects.toEqual(new FLIFFError(FLIFF.ErrorMessages.AddRequiredNameAndUrl));
        });

    });

    describe('when name and url options provided but omit type option', () => {
        const options = {
            name: 'test1',
            url: 'https://www.facebook.com/intocode',
            description: 'Blah blah',
            ble: 'true'
        };

        describe('and able to send and set view', () => {
            const fakeSentResult = { data: { liffId: '12345' } };
            let rsSend;

            beforeAll(async () => {
                jest.spyOn(request, 'send').mockResolvedValue(fakeSentResult);
                jest.spyOn(LIFFConfig, 'setView').mockImplementation((name, id) => Promise.resolve(id));
                rsSend = await fliff.add(options);
            });

            afterAll(() => {
                request.send.mockRestore();
                LIFFConfig.setView.mockRestore();
            });

            it('send with correct data', () => {
                expect(request.send).toHaveBeenCalledWith({
                    view: {
                        type: 'full',
                        url: options.url
                    },
                    description: options.description,
                    features: {
                        ble: true
                    }
                });
            });

            it('set view', () => {
                expect(LIFFConfig.setView).toHaveBeenCalledWith(options.name, fakeSentResult.data.liffId);
            });

            it('return correct result', () => {
                expect(rsSend).toEqual(fakeSentResult.data.liffId);
            });

        });

    });

    describe('when all options provided', () => {
        const options = {
            name: 'Test 1',
            type: 'compact',
            url: 'https://www.facebook.com/intocode',
            ble: 'false'
        };

        describe('and able to send', () => {
            const fakeSentResult = { data: { liffId: '12345' } };
            let rsSend;

            describe('and able to set view', () => {

                beforeAll(async () => {
                    jest.spyOn(request, 'send').mockResolvedValue(fakeSentResult);
                    jest.spyOn(LIFFConfig, 'setView').mockImplementation((name, id) => Promise.resolve(id));
                    rsSend = await fliff.add(options);
                });

                afterAll(() => {
                    request.send.mockRestore();
                    LIFFConfig.setView.mockRestore();
                });

                it('send with correct data', () => {
                    expect(request.send).toHaveBeenCalledWith({
                        view: {
                            type: options.type,
                            url: options.url
                        },
                        description: options.name,
                        features: {
                            ble: false
                        }
                    });
                });

                it('set view', () => {
                    expect(LIFFConfig.setView).toHaveBeenCalledWith(options.name.toLowerCase().replace(/\s/g, '_'), fakeSentResult.data.liffId);
                });

                it('return correct result', () => {
                    expect(rsSend).toEqual(fakeSentResult.data.liffId);
                });

            });

            describe('and fail to set view', () => {
                const fakeError = new Error('some set error');

                beforeAll(async () => {
                    jest.spyOn(request, 'send').mockResolvedValue(fakeSentResult);
                    jest.spyOn(LIFFConfig, 'setView').mockImplementation(() => {
                        throw Error(fakeError);
                    });
                });

                afterAll(() => {
                    request.send.mockRestore();
                    LIFFConfig.setView.mockRestore();
                });

                it('reject with error', async () => {
                    await expect(fliff.add(options)).rejects.toThrow(new FLIFFError(FLIFF.ErrorMessages.FailedToSetView));
                });

            });

        });

        describe('and not able to send', () => {

            describe('and has response with message', () => {
                const fakeErrorResponse = {
                    response: {
                        data: {
                            message: 'some error message'
                        }
                    }
                };
                beforeAll(async () => {
                    jest.spyOn(request, 'send').mockRejectedValue(fakeErrorResponse);
                });

                afterAll(() => {
                    request.send.mockRestore();
                });

                it('reject with error', async () => {
                    await expect(fliff.add(options)).rejects.toThrow(fakeErrorResponse.response.data.message);
                });
            });

            describe('and has without message', () => {

                beforeAll(async () => {
                    jest.spyOn(request, 'send').mockRejectedValue(new Error('something'));
                });

                afterAll(() => {
                    request.send.mockRestore();
                });

                it('reject with error', async () => {
                    await expect(fliff.add(options)).rejects.toThrow(FLIFF.ErrorMessages.FailedToAddLIFF);
                });

            });

        });

    });
});
