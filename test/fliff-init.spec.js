import { FLIFF } from '../lib/fliff';

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const rimraf = require('rimraf');
const { spawn } = require('child_process');

describe('fliff init success', () => {
    const fliffPath = path.resolve(__dirname, '../bin/fliff-cli.js');
    const initFolder = 'web-views';
    const testTime = (new Date()).getTime();
    const testFolderPath = path.resolve(__dirname, `cache/fliff-init-${testTime}`);
    const initPath = path.resolve(testFolderPath, initFolder);
    let cmd;
    let pjsonPath;

    beforeAll(done => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        mkdirp.sync(testFolderPath);
        fs.writeFileSync(path.resolve(testFolderPath, 'firebase.json'), '', { flag: 'w' });
        cmd = spawn(fliffPath, ['init'], { cwd: testFolderPath });
        setTimeout(() => done(), 4000);
    });

    it('should create project folder', () => {
        expect(fs.existsSync(initPath)).toEqual(true);
    });

    it('should create package.json file', () => {
        pjsonPath = path.resolve(initPath, 'package.json');
        expect(fs.existsSync(pjsonPath)).toEqual(true);
    });

    it('should create example index files', () => {
        expect(fs.existsSync(path.resolve(initPath, 'src/index.html'))).toEqual(true);
        expect(fs.existsSync(path.resolve(initPath, 'src/index.js'))).toEqual(true);
        expect(fs.existsSync(path.resolve(initPath, 'src/index.css'))).toEqual(true);
    });

    it('should create lib and images folders', () => {
        expect(fs.existsSync(path.resolve(initPath, 'src/lib'))).toEqual(true);
        expect(fs.existsSync(path.resolve(initPath, 'src/images'))).toEqual(true);
    });

    it('should create .gitignore file', () => {
        expect(fs.existsSync(path.resolve(initPath, '.gitignore'))).toEqual(true);
    });

    it('should create environment files', () => {
        expect(fs.existsSync(path.resolve(initPath, '.env.production'))).toEqual(true);
        expect(fs.existsSync(path.resolve(initPath, '.env.staging'))).toEqual(true);
    });

    afterAll(() => {
        cmd.kill();
        rimraf.sync(testFolderPath);
        console.log.mockRestore();
    });

});

describe('fliff init fail', () => {

    describe('when path already exist', () => {
        let fliff;
        let cachePath = 'cache';

        beforeAll(() => {
            jest.mock('recursive-copy');
            jest.spyOn(fs, 'mkdir').mockImplementation((initPath, callback) => {
                callback({
                    code: 'EEXIST'
                });
            });

            fliff = new FLIFF();
        });

        it('reject with error', async () => {
            await expect(fliff.init(cachePath)).rejects.toThrow(FLIFF.ErrorMessages.FailedToInitPathExists(cachePath));
        });

        afterAll(() => {
            copy.mockRestore();
            fs.mkdir.mockRestore();
        });

    });

    describe('when has unknown error while creating path', () => {
        const fakeError = new Error('something else');
        let fliff;
        let cachePath = 'cache';

        beforeAll(() => {
            jest.spyOn(fs, 'mkdir').mockImplementation((initPath, mkDirOptions, callback) => {
                if (typeof mkDirOptions === 'function') {
                    callback = mkDirOptions;
                }
                callback(fakeError);
            });

            fliff = new FLIFF();
        });

        it('reject with error', async () => {
            await expect(fliff.init(cachePath)).rejects.toThrow(fakeError);
        });

        afterAll(() => {
            fs.mkdir.mockRestore();
        });

    });

    describe('when fail to copy', () => {
        let fliff;
        let cachePath = 'cache';

        beforeAll(() => {
            jest.mock('recursive-copy', () => {
                return jest.fn().mockImplementation((webviewPath, initPath, copyOptions, callback) => {
                    callback(new Error('Copy error'), []);
                });
            });
            jest.spyOn(fs, 'mkdir').mockImplementation((initPath, mkDirOptions, callback) => {
                if (typeof mkDirOptions === 'function') {
                    callback = mkDirOptions;
                }
                callback(null);
            });

            fliff = new FLIFF();
        });

        it('reject with error', async () => {
            await expect(fliff.init(cachePath)).rejects.toThrow(new Error('Copy error'));
        });

        afterAll(() => {
            jest.unmock('recursive-copy');
            fs.mkdir.mockRestore();
        });
    });

});
