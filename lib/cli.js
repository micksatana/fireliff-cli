#!/usr/bin/env node
import 'console.table';
import * as colors from 'colors';
import pjson from '../package.json';
import { FunctionsConfig, LIFFAddRequest, LIFFConfig, LIFFDeleteRequest, LIFFGetRequest, LIFFUpdateRequest } from './index';

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'white',
    help: 'cyan',
    warn: 'yellow',
    code: 'blue',
    error: 'red'
});

const Commander = require('commander');

Commander
    .version(pjson.version, '-v, --version')
    .command('fliff <operation>')
    .option('--id <id>', 'LIFF view id in Firebase Functions configuration')
    .option('--name <name>', 'LIFF view name in Firebase Functions configuration')
    .option('--type <type>', 'LIFF view type could be compact|tall|full')
    .option('--url <url>', 'LIFF view URL')
    .action(async (operation, cmd) => {
        let accessToken;
        let config;
        let viewNames;
        let data;
        let req;
        let res;

        try {
            console.log('Get Firebase Functions configuration'.verbose);
            config = await FunctionsConfig.get();
            if (!config.line || !config.line.access_token) {
                console.log('Functions configuration not found: line.access_token'.help);
                console.log('Find your LINE channel access token and use with the following command'.help);
                console.log(`${'firebase functions:config:set line.access_token='.code}${'<channelAccessToken>'.prompt}`);
                process.exit(1);
            }
            accessToken = config.line.access_token;
        } catch (error) {
            console.log('Failed to get configuration'.error);
            console.error(error);
            process.exit(1);
        }

        switch (operation) {
            case 'add':
                req = new LIFFAddRequest({ accessToken });
                data = {
                    view: {
                        type: cmd.type,
                        url: cmd.url
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
                    console.log(`Created ${cmd.name.input} view with LIFF ID: ${res.data.liffId.info}`.verbose);
                    await LIFFConfig.setView(cmd.name, res.data.liffId);
                } catch (error) {
                    console.log(`Failed to set Functions configuration`.error);
                    console.log(`Try re-run with the following command`.help);
                    console.log(`firebase functions:config:set views.${cmd.name}=${res.data.liffId}`.prompt);
                    console.error(error);
                    process.exit(1);
                }

                break;

            case 'delete':
                req = new LIFFDeleteRequest({ accessToken });
                if (!cmd.id && !cmd.name) {
                    console.warn(`Command ${'fliff delete'.prompt} required LIFF ID or name option`.warn);
                    console.log(`Try re-run ${'fliff delete --id <liffId>'.input} OR  ${'fliff delete --name <viewName>'.input}`.help);
                    process.exit(1);
                }

                if (cmd.name) {
                    cmd.id = LIFFConfig.getViewIdByName(cmd.name, config);
                    if (typeof cmd.id !== 'string') {
                        console.error(`Failed to retrieve LIFF ID with view name ${cmd.name.input}`.error);
                        process.exit(1);
                    }
                }

                try {
                    console.log(`Sending request to delete LIFF view ${cmd.id.input}`.verbose);
                    res = await req.send(cmd.id);
                    console.log(`Deleted view with LIFF ID: ${cmd.id.input}`.verbose);
                } catch (error) {
                    if (error.response && error.response.data) {
                        if (error.response.data.message === 'not found') {
                            console.log('LIFF app not found'.info);
                        } else {
                            console.log(`Failed to delete LIFF view ${cmd.id.input}`.error);
                            console.error(error.response.data.error);
                            process.exit(1);
                        }
                    } else {
                        console.log(`Failed to delete LIFF view ${cmd.id.input}`.error);
                        console.error(error);
                        process.exit(1);
                    }
                }

                try {
                    viewNames = LIFFConfig.getViewNamesById(cmd.id, config);
                    await Promise.all(viewNames.map(viewName => LIFFConfig.unsetView(viewName)));
                    console.log(`Unset view(s) in Functions configuration`.info, viewNames);
                } catch (error) {
                    console.log(`Failed to unset view(s) in Functions configuration`.error);
                    console.log(`Try looking for view name with LIFF ID ${cmd.id.input} using ${'fliff get'.prompt} command and unset it manually`.help);
                    console.log(`firebase functions:config:unset views.<viewName>`.prompt);
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
                req = new LIFFUpdateRequest({ accessToken });
                if (!cmd.id && !cmd.name) {
                    console.warn(`Command ${'fliff update'.prompt} required LIFF ID or name option`.warn);
                    console.log(`Try re-run with option ${'--id <liffId>'.input} OR ${'--name <viewName>'.input}`.help);
                    process.exit(1);
                }

                if (!cmd.id) {
                    cmd.id = LIFFConfig.getViewIdByName(cmd.name, config);
                    if (typeof cmd.id !== 'string') {
                        console.error(`Failed to retrieve LIFF ID with view name ${cmd.name.input}`.error);
                        process.exit(1);
                    }
                }
                if (!cmd.name) {
                    cmd.name = LIFFConfig.getViewNameById(cmd.id, config);
                    if (typeof cmd.name !== 'string') {
                        console.error(`Failed to retrieve view name with LIFF ID ${cmd.id.input}`.error);
                        process.exit(1);
                    }
                }

                if (!cmd.type || !cmd.url) {
                    console.warn(`Command ${'fliff update'.prompt} required both LIFF type AND url options to be updated`.warn);
                    console.log(`Try re-run with options ${'--type <type> --url <url>'.input}`.help);
                    process.exit(1);
                }

                data = {
                    type: cmd.type,
                    url: cmd.url
                };

                try {
                    console.log(`Sending request to update LIFF view ${cmd.id.input}`.verbose);
                    res = await req.send(cmd.id, data);
                    console.log(`Updated view with LIFF ID: ${cmd.id.input}`.verbose);
                } catch (error) {
                    console.log(`Failed to update LIFF view ${cmd.id.input}`.error);
                    if (error.response && error.response.data && error.response.data.message) {
                        console.log(error.response.data.message.error, data);
                    } else {
                        console.error(error);
                    }
                    process.exit(1);
                }

                break;

            default:

        }
    });

Commander.parse(process.argv);
