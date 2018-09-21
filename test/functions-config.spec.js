import * as ChildProcess from 'child_process';
import { FunctionsConfig } from '../lib/functions-config';

jest.mock('child_process');

describe('FunctionsConfig', () => {

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
                expect(ChildProcess.exec).toBeCalledWith(`firebase functions:config:get`, expect.anything());
            });

            it('should return Firebase Functions config', () => {
                expect(expectedConfig).toEqual(fakeConfig);
            });

            afterAll(() => {
                ChildProcess.exec.restore();
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
                expect(ChildProcess.exec).toBeCalledWith(`firebase functions:config:get ${fakeParam}`, expect.anything());
            });

            it('should return Firebase Functions config', () => {
                expect(expectedConfig).toEqual(fakeConfig[fakeParam]);
            });

            afterAll(() => {
                ChildProcess.exec.restore();
            });

        });

        describe('and error during execution', () => {
            let fakeError = new Error('Some error while running exec');

            beforeAll(() => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(fakeError, JSON.stringify(fakeConfig)));
            });

            it('should reject with the error', () => {
                expect(FunctionsConfig.get()).rejects.toEqual(fakeError);
            });

            afterAll(() => {
                ChildProcess.exec.restore();
            });

        });

        describe('and error during JSON parsing', () => {
            let fakeError = new Error('Some error while parsing');

            beforeAll(() => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(null, JSON.stringify(fakeConfig)));
                spyOn(JSON, 'parse').and.throwError(fakeError);
            });

            it('should reject with the error', () => {
                expect(FunctionsConfig.get()).rejects.toEqual(fakeError);
            });

            afterAll(() => {
                ChildProcess.exec.restore();
                JSON.parse.restore();
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
                expect(ChildProcess.exec).toBeCalledWith(`firebase functions:config:set ${name}=${value}`, expect.anything());
            });

            it('should return value', () => {
                expect(expectedValue).toEqual(value);
            });

            afterAll(() => {
                ChildProcess.exec.restore();
            });

        });

        describe('and error during execution', () => {
            let fakeError = new Error('Some error while running exec');

            beforeAll(() => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(fakeError));
            });

            it('should reject with the error', () => {
                expect(FunctionsConfig.set(name, value)).rejects.toEqual(fakeError);
            });

            afterAll(() => {
                ChildProcess.exec.restore();
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
                expect(ChildProcess.exec).toBeCalledWith(`firebase functions:config:unset ${name}`, expect.anything());
            });

            it('should return value', () => {
                expect(expectedResult).toEqual(name);
            });

            afterAll(() => {
                ChildProcess.exec.restore();
            });

        });

        describe('and error during execution', () => {
            let fakeError = new Error('Some error while running exec');

            beforeAll(() => {
                ChildProcess.exec.mockImplementation((command, callback) => callback(fakeError));
            });

            it('should reject with the error', () => {
                expect(FunctionsConfig.unset(name)).rejects.toEqual(fakeError);
            });

            afterAll(() => {
                ChildProcess.exec.restore();
            });

        });

    });

});