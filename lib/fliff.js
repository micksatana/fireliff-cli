import { spawn } from 'child_process';
import { mkdir, existsSync } from 'fs';
import { EOL } from 'os';
import * as path from 'path';
import * as prompt from 'prompt';
import './colors-set-theme';
import { FLIFFError } from './fliff-error';
import { FunctionsConfig } from './functions-config';
import { LIFFConfig } from './liff-config';
import { LIFFAddRequest } from './liff-add-request';
import { LIFFDeleteRequest } from './liff-delete-request';
import { LIFFGetRequest } from './liff-get-request';
import { LIFFUpdateRequest } from './liff-update-request';
import { OAuthIssueTokenRequest } from './oauth-issue-token-request';
import { OAuthRevokeTokenRequest } from './oauth-revoke-token-request';

const copy = require('recursive-copy');

const AddRequiredNameAndUrl = `Command ${'fliff add'.prompt} required name and url options`.warn + EOL +
    `Try re-run with option ${'--name <viewName>'.input} AND ${'--url <viewURL>'.input}`.help;
const ConfigRequiredIdSecretOrName = `Failed to configure channel. ${'fliff config'.prompt} required id, secret or token options.`.error + EOL +
    `Try re-run with option ${'--id <channelId>'.input} OR ${'--secret <channelSecret>'.input} OR ${'--token <channelToken>'.input}`.help;
const DeleteRequiredIdOrName = `Command ${'fliff delete'.prompt} required LIFF ID or name option`.warn + EOL +
    `Try re-run with option ${'--id <liffId>'.input} OR ${'--name <viewName>'.input}`.help;
const FailedToAddLIFF = `Failed to add LIFF view`.error;
const FailedToRetrieveIdUsingName = `Failed to retrieve LIFF ID using view name`.error;
const FailedToRetrieveNameUsingId = `Failed to retrieve view name using LIFF ID`.error;
const FailedToSetView = `Failed to set view in Functions configuration`.error;
const FailedToUnsetViews = `Failed to unset view(s) in Functions configuration`.error;
const RevokeTokenRequiredAccessToken = `Command ${'fliff token --revoke'.prompt} required access token.`.warn + EOL +
    `Try re-run with access token ${'fliff token --revoke <accessToken>'.input}`.help;
const IssueTokenRequiredChannelIdAndSecret = `Command ${'fliff token'.prompt} required Channel ID and Secret to be configured first`.error + EOL +
    `Try run ${'fliff config --id <channelId> --secret <channelSecret>'.input} to configure before re-run ${'fliff token'.prompt} again.`.help;
const TokenRequiredIssueOrRevoke = `Command ${'fliff token'.prompt} required issue or revoke options.`.error + EOL +
    `Try re-run with option ${'--issue'.input} OR ${'--revoke'.input}`.help;
const UpdateRequiredIdOrName = `Command ${'fliff update'.prompt} required LIFF ID or name option`.warn + EOL +
    `Try re-run with option ${'--id <liffId>'.input} OR ${'--name <viewName>'.input}`.help;

export class FLIFF {

    static get ErrorMessages() {
        return {
            AddRequiredNameAndUrl,
            ConfigRequiredIdSecretOrName,
            DeleteRequiredIdOrName,
            FailedToAddLIFF,
            FailedToRetrieveIdUsingName,
            FailedToRetrieveNameUsingId,
            FailedToSetView,
            FailedToUnsetViews,
            RevokeTokenRequiredAccessToken,
            IssueTokenRequiredChannelIdAndSecret,
            TokenRequiredIssueOrRevoke,
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

    async add(options) {

        if (!options.name || !options.url) {
            return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.AddRequiredNameAndUrl));
        }

        if (!options.type) {
            options.type = 'full';
        }

        const req = new LIFFAddRequest({ accessToken: FunctionsConfig.AccessToken });
        const data = {
            view: {
                type: options.type,
                url: options.url
            }
        };
        let res;

        try {
            res = await req.send(data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return Promise.reject(new FLIFFError(error.response.data.message.error));
            } else {
                return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.FailedToAddLIFF));
            }
        }

        try {
            return await LIFFConfig.setView(options.name, res.data.liffId);
        } catch (error) {
            return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.FailedToSetView));
        }
    }

    async config(options) {
        let result = {};

        if (!options.id && !options.secret && !options.token) {
            return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.ConfigRequiredIdSecretOrName));
        } else {
            result[FunctionsConfig.SingleChannelGroup] = {};
        }

        if (options.id) {
            try {
                await FunctionsConfig.set(`${FunctionsConfig.SingleChannelGroup}.${FunctionsConfig.ChannelIdName}`, options.id);
                result[FunctionsConfig.SingleChannelGroup][FunctionsConfig.ChannelIdName] = options.id;
            } catch (errId) {
                return Promise.reject(errId);
            }
        }

        if (options.secret) {
            try {
                await FunctionsConfig.set(`${FunctionsConfig.SingleChannelGroup}.${FunctionsConfig.ChannelSecretName}`, options.secret);
                result[FunctionsConfig.SingleChannelGroup][FunctionsConfig.ChannelSecretName] = options.secret;
            } catch (errSecret) {
                return Promise.reject(errSecret);
            }
        }

        if (options.token) {
            try {
                await FunctionsConfig.set(`${FunctionsConfig.SingleChannelGroup}.${FunctionsConfig.AccessTokenName}`, options.token);
                result[FunctionsConfig.SingleChannelGroup][FunctionsConfig.AccessTokenName] = options.token;
            } catch (errToken) {
                return Promise.reject(errToken);
            }
        }

        return result;
    }

    async token(options) {

        if (!options.issue && options.revoke === undefined) {
            return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.TokenRequiredIssueOrRevoke));
        }

        if (options.issue === true) {

            if (!FunctionsConfig.ChannelId || !FunctionsConfig.ChannelSecret) {
                return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.IssueTokenRequiredChannelIdAndSecret));
            }

            try {
                const req = new OAuthIssueTokenRequest();
                const res = await req.send(FunctionsConfig.ChannelId, FunctionsConfig.ChannelSecret);
                const tokenData = (res.status === 200) ? {
                    accessToken: res.data.access_token,
                    expiresIn: res.data.expires_in,
                    type: res.data.token_type
                } : false;

                if (tokenData) {
                    if (options.save === true) {
                        await FunctionsConfig.set(`${FunctionsConfig.SingleChannelGroup}.${FunctionsConfig.AccessTokenName}`, tokenData.accessToken);

                        return tokenData;
                    }

                    return tokenData;
                } else {
                    return Promise.reject(new FLIFFError(res.statusText));
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error_description) {
                    return Promise.reject(error.response.data.error_description);
                } else {
                    return Promise.reject(error);
                }
            }

        } else if (options.revoke !== undefined) {

            if (options.revoke === null) {
                return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.RevokeTokenRequiredAccessToken));
            }

            try {
                const req = new OAuthRevokeTokenRequest();
                const res = await req.send(options.revoke);

                return (res.status === 200) ? true : Promise.reject(new FLIFFError(res.statusText));
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error_description) {
                    return Promise.reject(error.response.data.error_description);
                } else {
                    return Promise.reject(error);
                }
            }

        }

    }


    async delete(options) {

        if (!options.id && !options.name) {
            return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.DeleteRequiredIdOrName));
        }

        if (!options.id) {
            options.id = await LIFFConfig.getViewIdByName(options.name, FunctionsConfig.config);
            if (typeof options.id !== 'string') {
                return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.FailedToRetrieveIdUsingName));
            }
        }

        if (!options.name) {
            options.name = await LIFFConfig.getViewNameById(options.id, FunctionsConfig.config);
            if (typeof options.name !== 'string') {
                return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.FailedToRetrieveNameUsingId));
            }
        }

        try {
            const req = new LIFFDeleteRequest({ accessToken: FunctionsConfig.AccessToken });
            await req.send(options.id);
        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message !== 'not found') {
                    return Promise.reject(error.response.data.error);
                }
            } else {
                return Promise.reject(error);
            }
        }

        try {
            const viewNames = await LIFFConfig.getViewNamesById(options.id, FunctionsConfig.config);
            await Promise.all(viewNames.map(viewName => LIFFConfig.unsetView(viewName)));

            return viewNames;
        } catch (error) {
            return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.FailedToUnsetViews));
        }

    }

    async update(options) {
        let data = {};

        if (!options.id && !options.name) {
            return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.UpdateRequiredIdOrName));
        }

        if (!options.id) {
            options.id = await LIFFConfig.getViewIdByName(options.name, FunctionsConfig.config);
            if (typeof options.id !== 'string') {
                return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.FailedToRetrieveIdUsingName));
            }
        }

        if (!options.name) {
            options.name = await LIFFConfig.getViewNameById(options.id, FunctionsConfig.config);
            if (typeof options.name !== 'string') {
                return Promise.reject(new FLIFFError(FLIFF.ErrorMessages.FailedToRetrieveNameUsingId));
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
            const req = new LIFFUpdateRequest({ accessToken: FunctionsConfig.AccessToken });

            return await req.send(options.id, data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return Promise.reject(error.response.data.message.error);
            } else {
                return Promise.reject(error);
            }
        }

    }

    async get() {
        try {
            const req = new LIFFGetRequest({ accessToken: FunctionsConfig.AccessToken });
            const res = await req.send();

            return res.data.apps.map(app => {
                const views = Object.keys(FunctionsConfig.config.views).filter(key => {
                    return FunctionsConfig.config.views[key] === app.liffId;
                });

                return {
                    'View': views.join(', '),
                    'LIFF ID': app.liffId,
                    'Type': app.view.type,
                    'URL': app.view.url
                };
            });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                if (error.response.data.message === 'no apps') {
                    return 'LIFF app not found'.info;
                } else {
                    return Promise.reject(error.response.data.message.error);
                }
            } else {
                return Promise.reject(error);
            }
        }
    }

}
