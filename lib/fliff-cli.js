#!/usr/bin/env node
import 'console.table';
import * as path from 'path';
import pjson from '../package.json';
import { LIFFAddRequest, LIFFConfig, LIFFDeleteRequest, LIFFGetRequest } from '.';
import { getValidatedConfig } from './shared';
import { FLIFF } from './fliff.js';

const commandLineArgs = require('command-line-args');
const { operation, _unknown } = commandLineArgs([
    { name: 'operation', defaultOption: true }
], { stopAtFirstUnknown: true });
const argv = _unknown || [];
const options = commandLineArgs([
    { name: 'ble', type: String },
    { name: 'description', type: String },
    { name: 'id', type: String },
    { name: 'name', type: String },
    { name: 'type', type: String },
    { name: 'url', type: String },
    { name: 'version', alias: 'v', type: Boolean }
], { argv });

// Commands that need Functions config
if (['add', 'update', 'delete', 'get'].indexOf(operation) > -1) {
    getValidatedConfig().then(async (config) => {
        const accessToken = config.line.access_token;
        const fliff = new FLIFF();
        let viewNames;
        let data;
        let req;
        let res;

        switch (operation) {
            case 'add':
                req = new LIFFAddRequest({ accessToken });
                data = {
                    view: {
                        type: options.type,
                        url: options.url
                    }
                };
                try {
                    console.log('Sending request to add LIFF view...'.verbose);
                    res = await req.send(data);
                } catch (error) {
                    console.log(`Failed to add LIFF view`.error);
                    console.error(error);
                    process.exit(1);
                }

                try {
                    console.log(`Created ${options.name.input} view with LIFF ID: ${res.data.liffId.info}`.verbose);
                    await LIFFConfig.setView(options.name, res.data.liffId);
                } catch (error) {
                    console.log(`Failed to set Functions configuration`.error);
                    console.log(`Try re-run with the following command`.help);
                    console.log(`firebase functions:config:set views.${options.name}=${res.data.liffId}`.code);
                    console.error(error);
                    process.exit(1);
                }

                break;

            case 'delete':
                req = new LIFFDeleteRequest({ accessToken });
                if (!options.id && !options.name) {
                    console.warn(`Command ${'fliff delete'.prompt} required LIFF ID or name option`.warn);
                    console.log(`Try re-run ${'fliff delete --id <liffId>'.input} OR  ${'fliff delete --name <viewName>'.input}`.help);
                    process.exit(1);
                }

                if (options.name) {
                    options.id = await LIFFConfig.getViewIdByName(options.name, config);
                    if (typeof options.id !== 'string') {
                        console.error(`Failed to retrieve LIFF ID with view name ${options.name.input}`.error);
                        process.exit(1);
                    }
                }

                try {
                    console.log(`Sending request to delete LIFF view ${options.id.input}`.verbose);
                    res = await req.send(options.id);
                    console.log(`Deleted view with LIFF ID: ${options.id.input}`.verbose);
                } catch (error) {
                    if (error.response && error.response.data) {
                        if (error.response.data.message === 'not found') {
                            console.log('LIFF app not found'.info);
                        } else {
                            console.log(`Failed to delete LIFF view ${options.id.input}`.error);
                            console.error(error.response.data.error);
                            process.exit(1);
                        }
                    } else {
                        console.log(`Failed to delete LIFF view ${options.id.input}`.error);
                        console.error(error);
                        process.exit(1);
                    }
                }

                try {
                    viewNames = await LIFFConfig.getViewNamesById(options.id, config);
                    await Promise.all(viewNames.map(viewName => LIFFConfig.unsetView(viewName)));
                    console.log(`Unset view(s) in Functions configuration`.info, viewNames);
                } catch (error) {
                    console.log(`Failed to unset view(s) in Functions configuration`.error);
                    console.log(`Try looking for view name with LIFF ID ${options.id.input} using ${'fliff get'.prompt} command and unset it manually`.help);
                    console.log(`firebase functions:config:unset views.<viewName>`.code);
                    console.error(error);
                    process.exit(1);
                }
                break;

            case 'get':
                req = new LIFFGetRequest({ accessToken });
                try {
                    console.log('Sending request to get LIFF view(s)...'.verbose);
                    res = await req.send();
                    console.table(res.data.apps.map(app => {
                        const views = Object.keys(config.views).filter(key => {
                            return config.views[key] === app.liffId;
                        });

                        return {
                            'View': views.join(', '),
                            'LIFF ID': app.liffId,
                            'Type': app.view.type,
                            'URL': app.view.url
                        };
                    }));
                } catch (error) {
                    if (error.response && error.response.data) {
                        if (error.response.data.message === 'no apps') {
                            console.log('LIFF app not found'.info);
                            process.exit(0);
                        } else {
                            console.error(error.response.data.error);
                            process.exit(1);
                        }
                    } else {
                        console.error(error);
                        process.exit(1);
                    }
                }

                break;

            case 'update':
                console.log(`Sending request to update LIFF view`.verbose);
                fliff.update(options)
                    .then(rsUpdate => {
                        console.log(`Updated LIFF ID: ${options.id.input}`.verbose);

                        return rsUpdate;
                    })
                    .catch(errUpdate => {
                        console.log(errUpdate);
                        process.exit(1);
                    });
                break;

            default:

        }

    });
} else if (operation) {
    switch (operation) {
        case 'init':
            FLIFF.init(path.resolve(process.cwd(), 'web-views'));
            break;
        case 'version':
            console.log(`Version: ${pjson.version}`);
            break;
        case 'help':
        default:
            // TODO: Display help message
    }
} else if (options.version) {
    console.log(`Version: ${pjson.version}`);
}
