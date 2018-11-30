import { FLIFF } from '../lib/fliff';
import { FunctionsConfig } from '../lib/functions-config';
import { LIFFGetRequest } from '../lib/liff-get-request';

jest.mock('../lib/liff-get-request');

describe('fliff get', () => {
    const fakeConfig = {
        line: {
            access_token: 'testAccessToken',
            channel_id: 'testChannelId',
            channel_secret: 'testChannelSecret'
        },
        views: {
            'name1': 'abcde',
            'name2': '12345'
        }
    };
    const request = {
        send: () => Promise.resolve(true)
    };
    let fliff = new FLIFF();

    beforeAll(() => {
        FunctionsConfig.config = fakeConfig;
        LIFFGetRequest.mockImplementation(() => request);
    });

    afterAll(() => {
        delete FunctionsConfig.config;
        LIFFGetRequest.mockRestore();
    });

    describe('when able to send', () => {
        const fakeSentResult = {
            data: {
                apps: [
                    { liffId: '12345', view: { type: 'compact', url: 'https://blah1' } },
                    { liffId: 'abcde', view: { type: 'full', url: 'https://blah2' } }
                ]
            }
        };
        const expectedResult = [
            { 'LIFF ID': '12345', 'Type': 'compact', 'URL': 'https://blah1', 'View': 'name2' },
            { 'LIFF ID': 'abcde', 'Type': 'full', 'URL': 'https://blah2', 'View': 'name1' }];
        const options = {};
        let rsSend;

        beforeAll(async () => {
            jest.spyOn(request, 'send').mockResolvedValue(fakeSentResult);
            rsSend = await fliff.get(options);
        });

        afterAll(() => {
            request.send.mockRestore();
        });

        it('sent', () => {
            expect(request.send).toHaveBeenCalled();
        });

        it('return correct result', () => {
            expect(rsSend).toEqual(expectedResult);
        });

    });

    describe('when has detail option', () => {
        const fakeSentResult = {
            data: {
                apps: [
                    { liffId: '12345', view: { type: 'compact', url: 'https://blah1' }, description: 'Blah blah' },
                    { liffId: 'abcde', view: { type: 'full', url: 'https://blah2' }, features: { ble: true } }
                ]
            }
        };
        const expectedResult = [
            { 'LIFF ID': '12345', 'Type': 'compact', 'URL': 'https://blah1', 'View': 'name2', 'Description': 'Blah blah', 'BLE': '\u2613' },
            { 'LIFF ID': 'abcde', 'Type': 'full', 'URL': 'https://blah2', 'View': 'name1', 'Description': '', 'BLE': '\u2713' }];
        const options = { detail: true };
        let rsSend;

        beforeAll(async () => {
            jest.spyOn(request, 'send').mockResolvedValue(fakeSentResult);
            rsSend = await fliff.get(options);
        });

        afterAll(() => {
            request.send.mockRestore();
        });

        it('sent', () => {
            expect(request.send).toHaveBeenCalled();
        });

        it('return correct result', () => {
            expect(rsSend).toEqual(expectedResult);
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
                await expect(fliff.get()).rejects.toEqual(fakeError.response.data.message.error);
            });

        });

        describe('and error is no apps', () => {
            const fakeError = {
                response: {
                    data: {
                        message: 'no apps'
                    }
                }
            };

            beforeAll(async () => {
                jest.spyOn(request, 'send').mockRejectedValue(fakeError);
            });

            afterAll(() => {
                request.send.mockRestore();
            });

            it('resolve with message', async () => {
                await expect(fliff.get()).resolves.toEqual('LIFF app not found'.info);
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
                await expect(fliff.get()).rejects.toEqual(fakeError);
            });

        });

    });

});
