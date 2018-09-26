import { LIFFConfig } from '../lib/liff-config';
import { FunctionsConfig } from '../lib/functions-config';

describe('LIFFConfig', () => {

    describe('setView', () => {
        beforeAll(() => {
            spyOn(FunctionsConfig, 'set').and.callFake((_, value) => Promise.resolve(value));
            LIFFConfig.setView('testname', 'testvalue');
        });

        it('should set to correct config group', () => {
            expect(FunctionsConfig.set).toBeCalledWith(`${LIFFConfig.ViewsGroup}.testname`, 'testvalue');
        });

        afterAll(() => {
            FunctionsConfig.set.restore();
        });
    });

    describe('unsetView', () => {
        beforeAll(() => {
            spyOn(FunctionsConfig, 'unset').and.callFake((name) => Promise.resolve(name));
            LIFFConfig.unsetView('testname', 'testvalue');
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.unset).toBeCalledWith(`${LIFFConfig.ViewsGroup}.testname`);
        });

        afterAll(() => {
            FunctionsConfig.unset.restore();
        });
    });

    describe('getViewNamesById', () => {
        beforeAll(() => {
            spyOn(FunctionsConfig, 'getNamesById').and.callFake(() => Promise.resolve([]));
            LIFFConfig.getViewNamesById('testid', {});
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.getNamesById).toBeCalledWith(LIFFConfig.ViewsGroup, 'testid', {});
        });

        afterAll(() => {
            FunctionsConfig.getNamesById.restore();
        });
    });

    describe('getViewNameById', () => {

        describe('when found names', () => {
            let result;

            beforeAll(async () => {
                spyOn(LIFFConfig, 'getViewNamesById').and.callFake(() => Promise.resolve(['name-1', 'name-2']));
                result = await LIFFConfig.getViewNameById('testid', {});
            });

            it('should get names', () => {
                expect(LIFFConfig.getViewNamesById).toBeCalledWith('testid', {});
            });

            it('should get correct result', () => {
                expect(result).toEqual('name-1');
            });

            afterAll(() => {
                LIFFConfig.getViewNamesById.restore();
            });

        });

        describe('when names not found', () => {
            let result;

            beforeAll(async () => {
                spyOn(LIFFConfig, 'getViewNamesById').and.callFake(() => Promise.resolve([]));
                result = await LIFFConfig.getViewNameById('testid', {});
            });

            it('should get names', () => {
                expect(LIFFConfig.getViewNamesById).toBeCalledWith('testid', {});
            });

            it('should get correct result', () => {
                expect(result).toEqual(null);
            });

            afterAll(() => {
                LIFFConfig.getViewNamesById.restore();
            });

        });

    });

    describe('getViewIdByName', () => {
        beforeAll(() => {
            spyOn(FunctionsConfig, 'getIdByName').and.callFake(() => Promise.resolve([]));
            LIFFConfig.getViewIdByName('testname', {});
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.getIdByName).toBeCalledWith(LIFFConfig.ViewsGroup, 'testname', {});
        });

        afterAll(() => {
            FunctionsConfig.getIdByName.restore();
        });
    });

    describe('setRichMenu', () => {
        beforeAll(() => {
            spyOn(FunctionsConfig, 'set').and.callFake((_, value) => Promise.resolve(value));
            LIFFConfig.setRichMenu('testname', 'testvalue');
        });

        it('should set to correct config group', () => {
            expect(FunctionsConfig.set).toBeCalledWith(`${LIFFConfig.RichMenusGroup}.testname`, 'testvalue');
        });

        afterAll(() => {
            FunctionsConfig.set.restore();
        });
    });

    describe('unsetRichMenu', () => {
        beforeAll(() => {
            spyOn(FunctionsConfig, 'unset').and.callFake((name) => Promise.resolve(name));
            LIFFConfig.unsetRichMenu('testname', 'testvalue');
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.unset).toBeCalledWith(`${LIFFConfig.RichMenusGroup}.testname`);
        });

        afterAll(() => {
            FunctionsConfig.unset.restore();
        });
    });

    describe('getRichMenuNamesById', () => {
        beforeAll(() => {
            spyOn(FunctionsConfig, 'getNamesById').and.callFake(() => Promise.resolve([]));
            LIFFConfig.getRichMenuNamesById('testid', {});
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.getNamesById).toBeCalledWith(LIFFConfig.RichMenusGroup, 'testid', {});
        });

        afterAll(() => {
            FunctionsConfig.getNamesById.restore();
        });
    });

    describe('getRichMenuNameById', () => {

        describe('when found names', () => {
            let result;

            beforeAll(async () => {
                spyOn(LIFFConfig, 'getRichMenuNamesById').and.callFake(() => Promise.resolve(['name-1', 'name-2']));
                result = await LIFFConfig.getRichMenuNameById('testid', {});
            });

            it('should get names', () => {
                expect(LIFFConfig.getRichMenuNamesById).toBeCalledWith('testid', {});
            });

            it('should get correct result', () => {
                expect(result).toEqual('name-1');
            });

            afterAll(() => {
                LIFFConfig.getRichMenuNamesById.restore();
            });

        });

        describe('when names not found', () => {
            let result;

            beforeAll(async () => {
                spyOn(LIFFConfig, 'getRichMenuNamesById').and.callFake(() => Promise.resolve([]));
                result = await LIFFConfig.getRichMenuNameById('testid', {});
            });

            it('should get names', () => {
                expect(LIFFConfig.getRichMenuNamesById).toBeCalledWith('testid', {});
            });

            it('should get correct result', () => {
                expect(result).toEqual(null);
            });

            afterAll(() => {
                LIFFConfig.getRichMenuNamesById.restore();
            });

        });

    });

    describe('getRichMenuIdByName', () => {
        beforeAll(() => {
            spyOn(FunctionsConfig, 'getIdByName').and.callFake(() => Promise.resolve([]));
            LIFFConfig.getRichMenuIdByName('testname', {});
        });

        it('should unset to correct config group', () => {
            expect(FunctionsConfig.getIdByName).toBeCalledWith(LIFFConfig.RichMenusGroup, 'testname', {});
        });

        afterAll(() => {
            FunctionsConfig.getIdByName.restore();
        });
    });

});
