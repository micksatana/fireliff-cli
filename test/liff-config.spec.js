import { LIFFConfig } from '../lib/liff-config';
import { FunctionsConfig } from '../lib/functions-config';

describe('LIFFConfig', () => {

    describe('setView', () => {
        beforeAll(() => {
            jest.spyOn(FunctionsConfig, 'set').mockImplementation((_, value) => Promise.resolve(value));
            LIFFConfig.setView('testname', 'testvalue');
        });

        it('should set to correct config group', () => {
            expect(FunctionsConfig.set).toHaveBeenCalledWith(`${LIFFConfig.ViewsGroup}.testname`, 'testvalue');
        });

        afterAll(() => {
            FunctionsConfig.set.mockRestore();
        });
    });

    describe('unsetView', () => {
        beforeAll(() => {
            jest.spyOn(FunctionsConfig, 'unset').mockImplementation((name) => Promise.resolve(name));
            LIFFConfig.unsetView('testname', 'testvalue');
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.unset).toHaveBeenCalledWith(`${LIFFConfig.ViewsGroup}.testname`);
        });

        afterAll(() => {
            FunctionsConfig.unset.mockRestore();
        });
    });

    describe('getViewNamesById', () => {
        beforeAll(() => {
            jest.spyOn(FunctionsConfig, 'getNamesById').mockImplementation(() => Promise.resolve([]));
            LIFFConfig.getViewNamesById('testid', {});
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.getNamesById).toHaveBeenCalledWith(LIFFConfig.ViewsGroup, 'testid', {});
        });

        afterAll(() => {
            FunctionsConfig.getNamesById.mockRestore();
        });
    });

    describe('getViewNameById', () => {

        describe('when found names', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(LIFFConfig, 'getViewNamesById').mockImplementation(() => Promise.resolve(['name-1', 'name-2']));
                result = await LIFFConfig.getViewNameById('testid', {});
            });

            it('should get names', () => {
                expect(LIFFConfig.getViewNamesById).toHaveBeenCalledWith('testid', {});
            });

            it('should get correct result', () => {
                expect(result).toEqual('name-1');
            });

            afterAll(() => {
                LIFFConfig.getViewNamesById.mockRestore();
            });

        });

        describe('when names not found', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(LIFFConfig, 'getViewNamesById').mockImplementation(() => Promise.resolve([]));
                result = await LIFFConfig.getViewNameById('testid', {});
            });

            it('should get names', () => {
                expect(LIFFConfig.getViewNamesById).toHaveBeenCalledWith('testid', {});
            });

            it('should get correct result', () => {
                expect(result).toEqual(null);
            });

            afterAll(() => {
                LIFFConfig.getViewNamesById.mockRestore();
            });

        });

    });

    describe('getViewIdByName', () => {
        beforeAll(() => {
            jest.spyOn(FunctionsConfig, 'getIdByName').mockImplementation(() => Promise.resolve([]));
            LIFFConfig.getViewIdByName('testname', {});
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.getIdByName).toHaveBeenCalledWith(LIFFConfig.ViewsGroup, 'testname', {});
        });

        afterAll(() => {
            FunctionsConfig.getIdByName.mockRestore();
        });
    });

    describe('setRichMenu', () => {
        beforeAll(() => {
            jest.spyOn(FunctionsConfig, 'set').mockImplementation((_, value) => Promise.resolve(value));
            LIFFConfig.setRichMenu('testname', 'testvalue');
        });

        it('should set to correct config group', () => {
            expect(FunctionsConfig.set).toHaveBeenCalledWith(`${LIFFConfig.RichMenusGroup}.testname`, 'testvalue');
        });

        afterAll(() => {
            FunctionsConfig.set.mockRestore();
        });
    });

    describe('unsetRichMenu', () => {
        beforeAll(() => {
            jest.spyOn(FunctionsConfig, 'unset').mockImplementation((name) => Promise.resolve(name));
            LIFFConfig.unsetRichMenu('testname', 'testvalue');
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.unset).toHaveBeenCalledWith(`${LIFFConfig.RichMenusGroup}.testname`);
        });

        afterAll(() => {
            FunctionsConfig.unset.mockRestore();
        });
    });

    describe('getRichMenuNamesById', () => {
        beforeAll(() => {
            jest.spyOn(FunctionsConfig, 'getNamesById').mockImplementation(() => Promise.resolve([]));
            LIFFConfig.getRichMenuNamesById('testid', {});
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.getNamesById).toHaveBeenCalledWith(LIFFConfig.RichMenusGroup, 'testid', {});
        });

        afterAll(() => {
            FunctionsConfig.getNamesById.mockRestore();
        });
    });

    describe('getRichMenuNameById', () => {

        describe('when found names', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(LIFFConfig, 'getRichMenuNamesById').mockImplementation(() => Promise.resolve(['name-1', 'name-2']));
                result = await LIFFConfig.getRichMenuNameById('testid', {});
            });

            it('should get names', () => {
                expect(LIFFConfig.getRichMenuNamesById).toHaveBeenCalledWith('testid', {});
            });

            it('should get correct result', () => {
                expect(result).toEqual('name-1');
            });

            afterAll(() => {
                LIFFConfig.getRichMenuNamesById.mockRestore();
            });

        });

        describe('when names not found', () => {
            let result;

            beforeAll(async () => {
                jest.spyOn(LIFFConfig, 'getRichMenuNamesById').mockImplementation(() => Promise.resolve([]));
                result = await LIFFConfig.getRichMenuNameById('testid', {});
            });

            it('should get names', () => {
                expect(LIFFConfig.getRichMenuNamesById).toHaveBeenCalledWith('testid', {});
            });

            it('should get correct result', () => {
                expect(result).toEqual(null);
            });

            afterAll(() => {
                LIFFConfig.getRichMenuNamesById.mockRestore();
            });

        });

    });

    describe('getRichMenuIdByName', () => {
        beforeAll(() => {
            jest.spyOn(FunctionsConfig, 'getIdByName').mockImplementation(() => Promise.resolve([]));
            LIFFConfig.getRichMenuIdByName('testname', {});
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.getIdByName).toHaveBeenCalledWith(LIFFConfig.RichMenusGroup, 'testname', {});
        });

        afterAll(() => {
            FunctionsConfig.getIdByName.mockRestore();
        });
    });

});
