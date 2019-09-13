import * as ChildProcess from 'child_process';
import { FunctionsConfig } from '../lib/functions-config';
import { FunctionsConfigError } from '../lib/functions-config-error';

jest.mock('child_process');

describe('FunctionsConfig', () => {

    beforeAll(() => {
        FunctionsConfig.config = {
            line: {
                channel_id: 'testChannelId',
                channel_secret: 'testChannelSecret',
                access_token: 'testAccessToken'
            }
        };
    });

    afterAll(() => {
        delete FunctionsConfig.config;
    });

    it('has correct AccessTokenName', () => {
        expect(FunctionsConfig.AccessTokenName).toEqual('access_token');
    });

    it('has correct BaseCommand', () => {
        expect(FunctionsConfig.BaseCommand).toEqual('firebase functions:config');
    });

    it('has correct ChannelIdName', () => {
        expect(FunctionsConfig.ChannelIdName).toEqual('channel_id');
    });

    it('has correct ChannelSecretName', () => {
        expect(FunctionsConfig.ChannelSecretName).toEqual('channel_secret');
    });

    it('has correct SingleChannelGroup', () => {
        expect(FunctionsConfig.SingleChannelGroup).toEqual('line');
    });

    it('has correct AccessToken', () => {
        expect(FunctionsConfig.AccessToken).toEqual(FunctionsConfig.config.line.access_token);
    });

    it('has correct ChannelId', () => {
        expect(FunctionsConfig.ChannelId).toEqual(FunctionsConfig.config.line.channel_id);
    });

    it('has correct ChannelSecret', () => {
        expect(FunctionsConfig.ChannelSecret).toEqual(FunctionsConfig.config.line.channel_secret);
    });

    describe('when get configurations', () => {
        let fakeConfig = {
            hosting: {
                url: 'https://blahblah'
            },
            line: {
                access_token: 'sometoken'
            }
        };
        let expectedConfig;

        describe('and not passing a parameter', () => {

            beforeAll(async () => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(null, JSON.stringify(fakeConfig)));
                expectedConfig = await FunctionsConfig.get();
                return;
            });

            it('should execute with correct command', () => {
                expect(ChildProcess.exec).toHaveBeenCalledWith(`firebase functions:config:get`, expect.anything());
            });

            it('should return Firebase Functions config', () => {
                expect(expectedConfig).toEqual(fakeConfig);
            });

            afterAll(() => {
                ChildProcess.exec.mockRestore();
            });

        });

        describe('and passing a parameter', () => {
            const fakeParam = 'line';

            beforeAll(async () => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(null, JSON.stringify(fakeConfig[fakeParam])));
                expectedConfig = await FunctionsConfig.get(fakeParam);
                return;
            });

            it('should execute with correct command', () => {
                expect(ChildProcess.exec).toHaveBeenCalledWith(`firebase functions:config:get ${fakeParam}`, expect.anything());
            });

            it('should return Firebase Functions config', () => {
                expect(expectedConfig).toEqual(fakeConfig[fakeParam]);
            });

            afterAll(() => {
                ChildProcess.exec.mockRestore();
            });

        });

        describe('and error during execution', () => {
            let fakeError = new Error('Some error while running exec');

            beforeAll(() => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(fakeError, JSON.stringify(fakeConfig)));
                jest.spyOn(FunctionsConfig, 'parseGetConfigError').mockImplementation(x => x);
            });

            it('should reject with the error', async () => {
                await expect(FunctionsConfig.get()).rejects.toEqual(fakeError);
            });

            afterAll(() => {
                ChildProcess.exec.mockRestore();
                FunctionsConfig.parseGetConfigError.mockRestore();
            });

        });

        describe('and error during JSON parsing', () => {
            let fakeError = new Error('Some error while parsing');

            beforeAll(() => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(null, JSON.stringify(fakeConfig)));
                jest.spyOn(JSON, 'parse').mockImplementation(() => {
                    throw fakeError;
                });
            });

            it('should reject with the error', async () => {
                await expect(FunctionsConfig.get()).rejects.toEqual(fakeError);
            });

            afterAll(() => {
                ChildProcess.exec.mockRestore();
                JSON.parse.mockRestore();
            });

        });

    });

    describe('when set a configuration', () => {
        let name = 'views.sign_up';
        let value = '1586348573-Lkb2yren';
        let expectedValue;

        describe('and success', () => {

            beforeAll(async () => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(null));
                expectedValue = await FunctionsConfig.set(name, value);
                return;
            });

            it('should execute with correct command', () => {
                expect(ChildProcess.exec).toHaveBeenCalledWith(`firebase functions:config:set ${name}=${value}`, expect.anything());
            });

            it('should return value', () => {
                expect(expectedValue).toEqual(value);
            });

            afterAll(() => {
                ChildProcess.exec.mockRestore();
            });

        });

        describe('and error during execution', () => {
            let fakeError = new Error('Some error while running exec');

            beforeAll(() => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(fakeError));
            });

            it('should reject with the error', async () => {
                await expect(FunctionsConfig.set(name, value)).rejects.toEqual(fakeError);
            });

            afterAll(() => {
                ChildProcess.exec.mockRestore();
            });

        });

    });

    describe('when unset a configuration', () => {
        let name = 'views.unset';
        let expectedResult;

        describe('and success', () => {

            beforeAll(async () => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(null));
                expectedResult = await FunctionsConfig.unset(name);
                return;
            });

            it('should execute with correct command', () => {
                expect(ChildProcess.exec).toHaveBeenCalledWith(`firebase functions:config:unset ${name}`, expect.anything());
            });

            it('should return value', () => {
                expect(expectedResult).toEqual(name);
            });

            afterAll(() => {
                ChildProcess.exec.mockRestore();
            });

        });

        describe('and error during execution', () => {
            let fakeError = new Error('Some error while running exec');

            beforeAll(() => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(fakeError));
            });

            it('should reject with the error', async () => {
                await expect(FunctionsConfig.unset(name)).rejects.toEqual(fakeError);
            });

            afterAll(() => {
                ChildProcess.exec.mockRestore();
            });

        });

    });

    describe('when using group to get names by ID (getNamesById)', () => {
        const group = 'views';
        const id = 'test-asldfhah023';
        const config = {
            views: {
                'test-get-view-name-1': id,
                'test-get-view-name-2': id
            }
        };

        describe('and without config', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(FunctionsConfig, 'get').mockResolvedValue(config);
                result = await FunctionsConfig.getNamesById(group, id);
            });

            it('should get config', () => {
                expect(FunctionsConfig.get).toHaveBeenCalledTimes(1);
            });

            it('should get correct result', () => {
                expect(result).toEqual(['test-get-view-name-1', 'test-get-view-name-2']);
            });

            afterAll(() => {
                FunctionsConfig.get.mockRestore();
            });

        });

        describe('and with config', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(FunctionsConfig, 'get');
                result = await FunctionsConfig.getNamesById(group, id, config);
            });

            it('should not get config', () => {
                expect(FunctionsConfig.get).not.toHaveBeenCalled();
            });

            it('should get correct result', () => {
                expect(result).toEqual(['test-get-view-name-1', 'test-get-view-name-2']);
            });

            afterAll(() => {
                FunctionsConfig.get.mockRestore();
            });

        });

        describe('and the ID not exists', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(FunctionsConfig, 'get');
                result = await FunctionsConfig.getNamesById(group, 'some-unknown-id', config);
            });

            it('should not get config', () => {
                expect(FunctionsConfig.get).not.toHaveBeenCalled();
            });

            it('should get correct result', () => {
                expect(result).toEqual([]);
            });

            afterAll(() => {
                FunctionsConfig.get.mockRestore();
            });

        });

        describe('and group not exists', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(FunctionsConfig, 'get').mockResolvedValue(config);
                result = await FunctionsConfig.getNamesById('unknown-group', 'some-unknown-id', config);
            });

            it('should get config', () => {
                expect(FunctionsConfig.get).toHaveBeenCalledTimes(1);
            });

            it('should get correct result', () => {
                expect(result).toEqual([]);
            });

            afterAll(() => {
                FunctionsConfig.get.mockRestore();
            });

        });

    });

    describe('when using group to get ID by name (getIdByName)', () => {
        const group = 'views';
        const name = 'test-get-view-name-2';
        const config = {
            views: {
                'test-get-view-name-1': 'test-gsdfo8hfosh',
                'test-get-view-name-2': 'test-sdflashe8fa'
            }
        };

        describe('and without config', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(FunctionsConfig, 'get').mockResolvedValue(config);
                result = await FunctionsConfig.getIdByName(group, name);
            });

            it('should get config', () => {
                expect(FunctionsConfig.get).toHaveBeenCalledTimes(1);
            });

            it('should get correct result', () => {
                expect(result).toEqual(config.views[name]);
            });

            afterAll(() => {
                FunctionsConfig.get.mockRestore();
            });

        });

        describe('and with config', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(FunctionsConfig, 'get');
                result = await FunctionsConfig.getIdByName(group, name, config);
            });

            it('should not get config', () => {
                expect(FunctionsConfig.get).not.toHaveBeenCalled();
            });

            it('should get correct result', () => {
                expect(result).toEqual(config.views[name]);
            });

            afterAll(() => {
                FunctionsConfig.get.mockRestore();
            });

        });

        describe('and the name not exists', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(FunctionsConfig, 'get');
                result = await FunctionsConfig.getIdByName(group, 'some-unknown-name', config);
            });

            it('should not get config', () => {
                expect(FunctionsConfig.get).not.toHaveBeenCalled();
            });

            it('should get correct result', () => {
                expect(result).toEqual(null);
            });

            afterAll(() => {
                FunctionsConfig.get.mockRestore();
            });

        });

        describe('and group not exists', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(FunctionsConfig, 'get').mockResolvedValue(config);
                result = await FunctionsConfig.getIdByName('unknown-group', name, config);
            });

            it('should get config', () => {
                expect(FunctionsConfig.get).toHaveBeenCalledTimes(1);
            });

            it('should get correct result', () => {
                expect(result).toEqual(null);
            });

            afterAll(() => {
                FunctionsConfig.get.mockRestore();
            });

        });

    });

    describe('reload', () => {
        const fakeConfig = 'Some fake config';
        let rsReload;

        beforeAll(async () => {
            jest.spyOn(FunctionsConfig, 'get').mockResolvedValue(fakeConfig);
            rsReload = await FunctionsConfig.reload();
        });

        it('return config', () => {
            expect(rsReload).toEqual(fakeConfig);
        });

        it('set singleton config property', () => {
            expect(FunctionsConfig.config).toEqual(fakeConfig);
        });

        afterAll(() => {
            delete FunctionsConfig.config;
            FunctionsConfig.get.mockRestore();
        });

    });

    describe('parseGetConfigError', () => {

        describe('when receive string', () => {
            const fakeError = new Error('Something Authentication Error blah blah');

            it('able to parse Authentication Error', () => {
                expect(FunctionsConfig.parseGetConfigError(fakeError)).toEqual(new FunctionsConfigError(FunctionsConfig.ErrorMessages.FailedToGetConfigAuthError));
            });

        });

        describe('when receive error', () => {
            const fakeError = 'Something Authentication Error blah blah';

            it('able to parse Authentication Error', () => {
                expect(FunctionsConfig.parseGetConfigError(fakeError)).toEqual(new FunctionsConfigError(FunctionsConfig.ErrorMessages.FailedToGetConfigAuthError));
            });

        });

        describe('when receive unknown error', () => {

            it('return unknown error', () => {
                expect(FunctionsConfig.parseGetConfigError('something else')).toEqual(new FunctionsConfigError(FunctionsConfig.ErrorMessages.FailedToGetConfigUnknownError));
            });

        });

    });

    describe('parseName', () => {

        it('handle uppercase', () => {
            expect(FunctionsConfig.parseName('LOWERCASE')).toEqual('lowercase');
        });

        it('handle space', () => {
            expect(FunctionsConfig.parseName('    ')).toEqual('____');
        });

    });

});
