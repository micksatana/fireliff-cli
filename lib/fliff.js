import { spawn } from 'child_process';
import { mkdir, existsSync } from 'fs';
import { EOL } from 'os';
import * as path from 'path';
import * as prompt from 'prompt';
import './colors-set-theme';
import { FunctionsConfig } from './functions-config';
import { LIFFConfig } from './liff-config';
import { LIFFUpdateRequest } from './liff-update-request';

const copy = require('recursive-copy');
const FailedToRetrieveIdUsingName = `Failed to retrieve LIFF ID using view name`.error;
const FailedToRetrieveNameUsingId = `Failed to retrieve view name using LIFF ID`.error;
const UpdateRequiredIdOrName = `Command ${'fliff update'.prompt} required LIFF ID or name option`.warn + EOL +
    `\r\nTry re-run with option ${'--id <liffId>'.input} OR ${'--name <viewName>'.input}`.help;

export class FLIFF {

    static get ErrorMessages() {
        return {
            FailedToRetrieveIdUsingName,
            FailedToRetrieveNameUsingId,
            UpdateRequiredIdOrName
        };
    }

    static init(initPath) {
        const fbjsonPath = path.resolve(initPath, '../firebase.json');
        const distPath = `${path.basename(initPath)}/dist`;

        mkdir(initPath, errMakeDir => {
            if (errMakeDir) {
                switch (errMakeDir.code) {
                    case 'EEXIST':
                        console.log(`${initPath} already exists`.error);
                        console.log(`Please manually delete ${initPath} and try again`.help);
                        break;
                    default: console.error(errMakeDir);
                }
                process.exit(1);
            }

            copy(path.resolve(__dirname, '../templates/web-views'), initPath, {
                junk: false,
                dot: true,
                filter: [
                    '*',
                    'src/**/*',
                    '!.cache',
                    '!package-lock.json',
                    '!dist',
                    '!node_modules'
                ]
            }, (errCopy, rsCopy) => {
                if (errCopy) {
                    console.error(errMakeDir);
                    process.exit(1);
                }

                console.log('Generated files'.info);
                rsCopy.sort((a, b) => (a.dest > b.dest) ? 1 : ((b.dest > a.dest) ? -1 : 0));
                rsCopy.forEach(file => console.log(file.dest.verbose));

                if (existsSync(fbjsonPath)) {
                    const fbjson = require(fbjsonPath);

                    if (fbjson.hosting && fbjson.hosting.public !== distPath) {
                        console.log(`firebase.json currently set hosting.public to ${fbjson.hosting.public.error}`.warn);
                        console.log(`Please change hosting.public to ${distPath.info}`.warn);
                    }
                }

                prompt.message = ''; // Workaround: Remove annoying prompt: prefix
                prompt.start();
                prompt.get([{
                    name: 'installNow',
                    message: 'Do you want to install node modules now? [yes/no]',
                    validator: /y[es]*|n[o]?/,
                    default: 'yes'
                }], (errPrompt, rsPrompt) => {
                    if (['yes', 'y'].indexOf(rsPrompt.installNow.toLowerCase()) > -1) {
                        const cmdInstall = spawn('npm', ['i', '--loglevel=error'], { cwd: initPath });
                        console.log(`Installing node modules in ${initPath}. Please wait...`);
                        cmdInstall.stderr.on('data', data => console.error(data.toString()));
                        cmdInstall.on('exit', code => {
                            if (code === 0) {
                                console.log('Installed'.help);
                            }
                            process.exit(code);
                        });
                    }
                });
            });
        });
    }

    constructor() {
    }

    async update(options) {
        const req = new LIFFUpdateRequest({ accessToken: FunctionsConfig.AccessToken });
        let data = {};

        if (!options.id && !options.name) {
            return Promise.reject(FLIFF.ErrorMessages.UpdateRequiredIdOrName);
        }

        if (!options.id) {
            options.id = await LIFFConfig.getViewIdByName(options.name, FunctionsConfig.config);
            if (typeof options.id !== 'string') {
                return Promise.reject(FLIFF.ErrorMessages.FailedToRetrieveIdUsingName);
            }
        }

        if (!options.name) {
            options.name = await LIFFConfig.getViewNameById(options.id, FunctionsConfig.config);
            if (typeof options.name !== 'string') {
                return Promise.reject(FLIFF.ErrorMessages.FailedToRetrieveNameUsingId);
            }
        }

        if (options.type || options.url) {
            data.view = {};
            if (options.type) {
                data.view.type = options.type;
            }
            if (options.url) {
                data.view.url = options.url;
            }
        }

        if (options.description) {
            data.description = options.description;
        }

        if (options.ble) {
            data.features = {
                ble: (options.ble.toLowerCase() == 'false') ? false : true
            };
        }

        try {
            return await req.send(options.id, data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return Promise.reject(error.response.data.message.error);
            } else {
                return Promise.reject(error);
            }
        }

    }

}
