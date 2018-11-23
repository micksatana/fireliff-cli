import { FLIFF } from '../lib/fliff';
import { FLIFFError } from '../lib/fliff-error';
import { FunctionsConfig } from '../lib/functions-config';
import { OAuthIssueTokenRequest } from '../lib/oauth-issue-token-request';
import { OAuthRevokeTokenRequest } from '../lib/oauth-revoke-token-request';

jest.mock('../lib/oauth-issue-token-request');
jest.mock('../lib/oauth-revoke-token-request');

describe('fliff token', () => {
    let fliff;

    beforeAll(() => {
        fliff = new FLIFF();
    });

    describe('when neither issue nor revoke', () => {
        const options = {};

        it('reject with error', async () => {
            await expect(fliff.token(options)).rejects.toEqual(new FLIFFError(FLIFF.ErrorMessages.TokenRequiredIssueOrRevoke));
        });

    });

    describe('when issue option is provided without save option', () => {
        const options = { issue: true };

        describe('and channel id and secret loaded in config', () => {

            beforeAll(() => {
                jest.spyOn(FunctionsConfig, 'ChannelId', 'get').mockReturnValue('testChannelId');
                jest.spyOn(FunctionsConfig, 'ChannelSecret', 'get').mockReturnValue('testChannelSecret');
            });

            afterAll(() => {
                FunctionsConfig.ChannelId.mockRestore();
                FunctionsConfig.ChannelSecret.mockRestore();
            });

            describe('and able to send request successfully', () => {
                const fakeResponse = {
                    status: 200,
                    data: {
                        access_token: 'accessToken',
                        expires_in: 40000,
                        token_type: 'Bearer'
                    }
                };
                const expectedTokenData = {
                    accessToken: fakeResponse.data.access_token,
                    expiresIn: fakeResponse.data.expires_in,
                    type: fakeResponse.data.token_type
                };
                const request = {
                    send: () => { }
                };
                let rsUpdate;

                beforeAll(async () => {
                    jest.spyOn(request, 'send').mockResolvedValue(fakeResponse);
                    OAuthIssueTokenRequest.mockImplementation(() => request);
                    rsUpdate = await fliff.token(options);
                });

                afterAll(() => {
                    request.send.mockRestore();
                    OAuthIssueTokenRequest.mockRestore();
                });

                it('call with correct channel id and secret', () => {
                    expect(request.send).toHaveBeenCalledWith(FunctionsConfig.ChannelId, FunctionsConfig.ChannelSecret);
                });

                it('resolve correct result', () => {
                    expect(rsUpdate).toEqual(expectedTokenData);
                });

            });

            describe('and able to send a request that returned unknown status', () => {
                const fakeResponse = {
                    status: 666,
                    statusText: 'Some devil unhandled status'
                };
                const request = {
                    send: () => { }
                };

                beforeAll(() => {
                    jest.spyOn(request, 'send').mockResolvedValue(fakeResponse);
                    OAuthIssueTokenRequest.mockImplementation(() => request);
                });

                it('reject with error', async () => {
                    await expect(fliff.token(options)).rejects.toEqual(new FLIFFError(fakeResponse.statusText));
                });

                afterAll(() => {
                    OAuthIssueTokenRequest.mockRestore();
                    request.send.mockRestore();
                });

            });

            describe('and not able to send request', () => {
                const request = {
                    send: () => { }
                };

                beforeAll(() => OAuthIssueTokenRequest.mockImplementation(() => request));

                afterAll(() => OAuthIssueTokenRequest.mockRestore());

                describe('and has error description', () => {
                    const fakeError = {
                        response: {
                            data: {
                                error_description: 'testErrorDescription'
                            }
                        }
                    };

                    beforeAll(async () => {
                        jest.spyOn(request, 'send').mockRejectedValue(fakeError);
                    });

                    afterAll(() => {
                        request.send.mockRestore();
                    });

                    it('reject with error description', async () => {
                        await expect(fliff.token(options)).rejects.toEqual(fakeError.response.data.error_description);
                    });

                });

                describe('and error description not found', () => {
                    const fakeError = {};

                    beforeAll(async () => {
                        jest.spyOn(request, 'send').mockRejectedValue(fakeError);
                    });

                    afterAll(() => {
                        request.send.mockRestore();
                    });

                    it('reject with error', async () => {
                        await expect(fliff.token(options)).rejects.toEqual(fakeError);
                    });

                });

            });

        });

        describe('and channel id not loaded in config', () => {

            beforeAll(() => {
                jest.spyOn(FunctionsConfig, 'ChannelId', 'get').mockReturnValue(undefined);
                jest.spyOn(FunctionsConfig, 'ChannelSecret', 'get').mockReturnValue('xxx');
            });

            afterAll(() => {
                FunctionsConfig.ChannelId.mockRestore();
                FunctionsConfig.ChannelSecret.mockRestore();
            });

            it('reject with error', async () => {
                await expect(fliff.token(options)).rejects.toEqual(new FLIFFError(FLIFF.ErrorMessages.IssueTokenRequiredChannelIdAndSecret));
            });

        });

        describe('and channel secret not loaded in config', () => {

            beforeAll(() => {
                jest.spyOn(FunctionsConfig, 'ChannelId', 'get').mockReturnValue('yyy');
                jest.spyOn(FunctionsConfig, 'ChannelSecret', 'get').mockReturnValue(undefined);
            });

            afterAll(() => {
                FunctionsConfig.ChannelId.mockRestore();
                FunctionsConfig.ChannelSecret.mockRestore();
            });

            it('reject with error', async () => {
                await expect(fliff.token(options)).rejects.toEqual(new FLIFFError(FLIFF.ErrorMessages.IssueTokenRequiredChannelIdAndSecret));
            });

        });

    });

    describe('when issue option is provided with save option', () => {
        const options = { issue: true, save: true };

        describe('and channel id and secret loaded in config', () => {
            const request = {
                send: () => Promise.resolve(true)
            };

            beforeAll(() => {
                jest.spyOn(FunctionsConfig, 'ChannelId', 'get').mockReturnValue('testChannelId');
                jest.spyOn(FunctionsConfig, 'ChannelSecret', 'get').mockReturnValue('testChannelSecret');
                OAuthIssueTokenRequest.mockImplementation(() => request);
            });

            afterAll(() => {
                FunctionsConfig.ChannelId.mockRestore();
                FunctionsConfig.ChannelSecret.mockRestore();
                OAuthIssueTokenRequest.mockRestore();
            });

            describe('and able to send request successfully', () => {
                const fakeResponse = {
                    status: 200,
                    data: {
                        access_token: 'accessToken',
                        expires_in: 40000,
                        token_type: 'Bearer'
                    }
                };
                const expectedTokenData = {
                    accessToken: fakeResponse.data.access_token,
                    expiresIn: fakeResponse.data.expires_in,
                    type: fakeResponse.data.token_type
                };
                let rsUpdate;

                beforeAll(async () => {
                    jest.spyOn(request, 'send').mockResolvedValue(fakeResponse);
                    jest.spyOn(FunctionsConfig, 'set').mockResolvedValue(null);
                    rsUpdate = await fliff.token(options);
                });

                it('call with correct channel id and secret', () => {
                    expect(request.send).toHaveBeenCalledWith(FunctionsConfig.ChannelId, FunctionsConfig.ChannelSecret);
                });

                it('save config', () => {
                    expect(FunctionsConfig.set).toHaveBeenCalledWith('line.access_token', fakeResponse.data.access_token);
                });

                it('resolve correct result', () => {
                    expect(rsUpdate).toEqual(expectedTokenData);
                });

                afterAll(() => {
                    request.send.mockRestore();
                    FunctionsConfig.set.mockRestore();
                });

            });

        });

    });

    describe('when revoke option is provided without access token', () => {
        const options = { revoke: null };

        it('reject with error', async () => {
            await expect(fliff.token(options)).rejects.toEqual(new FLIFFError(FLIFF.ErrorMessages.RevokeTokenRequiredAccessToken));
        });

    });

    describe('when revoke option is provided with access token', () => {
        const options = { revoke: 'testAccessToken' };

        describe('and able to send a request successfully', () => {
            const fakeResponse = {
                status: 200
            };
            const request = {
                send: () => { }
            };

            beforeAll(() => {
                jest.spyOn(request, 'send').mockResolvedValue(fakeResponse);
                OAuthRevokeTokenRequest.mockImplementation(() => request);
            });

            it('resolve true', async () => {
                await expect(fliff.token(options)).resolves.toEqual(true);
            });

            afterAll(() => {
                OAuthRevokeTokenRequest.mockRestore();
                request.send.mockRestore();
            });

        });

        describe('and able to send a request that returned unknown status', () => {
            const fakeResponse = {
                status: 666,
                statusText: 'Some devil unhandled status'
            };
            const request = {
                send: () => { }
            };

            beforeAll(() => {
                jest.spyOn(request, 'send').mockResolvedValue(fakeResponse);
                OAuthRevokeTokenRequest.mockImplementation(() => request);
            });

            it('reject with error', async () => {
                await expect(fliff.token(options)).rejects.toEqual(new FLIFFError(fakeResponse.statusText));
            });

            afterAll(() => {
                OAuthRevokeTokenRequest.mockRestore();
                request.send.mockRestore();
            });

        });

        describe('and not able to send a request', () => {

            describe('and has error description', () => {
                const fakeError = {
                    response: {
                        data: {
                            error_description: 'Some error description'
                        }
                    }
                };
                const request = {
                    send: () => { }
                };

                beforeAll(() => {
                    jest.spyOn(request, 'send').mockRejectedValue(fakeError);
                    OAuthRevokeTokenRequest.mockImplementation(() => request);
                });

                afterAll(() => {
                    OAuthRevokeTokenRequest.mockRestore();
                    request.send.mockRestore();
                });

                it('reject with error description', async () => {
                    await expect(fliff.token(options)).rejects.toEqual(fakeError.response.data.error_description);
                });

            });

            describe('and has unknown error', () => {
                const fakeError = new Error('something else');
                const request = {
                    send: () => { }
                };

                beforeAll(() => {
                    jest.spyOn(request, 'send').mockRejectedValue(fakeError);
                    OAuthRevokeTokenRequest.mockImplementation(() => request);
                });

                afterAll(() => {
                    OAuthRevokeTokenRequest.mockRestore();
                    request.send.mockRestore();
                });

                it('reject with error', async () => {
                    await expect(fliff.token(options)).rejects.toEqual(fakeError);
                });

            });

        });

    });

});
