#!/usr/bin/env node
import 'console.table';
import { EOL } from 'os';
import './colors-set-theme';
import thingsUsage, { createUsage, deleteUsage, getUsage } from './things-cli-usage';
import { commandErrorHandler, getConfig, validateConfig } from './shared';
import { Things } from './things.js';
import pjson from '../package.json';

const versionText = `Things CLIs v${pjson.version} for Things API v1`.help;

try {
    const commandLineArgs = require('command-line-args');
    const commandLineUsage = require('command-line-usage');

    const { operation, _unknown } = commandLineArgs([
        { name: 'operation', defaultOption: true }
    ], { stopAtFirstUnknown: true });
    const argv = _unknown || [];
    const options = commandLineArgs([
        { name: 'help', alias: 'h', type: Boolean },
        { name: 'id', type: String },
        { name: 'liff', type: String },
        { name: 'product', alias: 'p', type: String },
        { name: 'user', type: String },
        { name: 'version', alias: 'v', type: Boolean }
    ], { argv });

    const things = new Things();

    if (options.help) {
        switch (operation) {
            case 'get': console.log(commandLineUsage(getUsage)); break;
            case 'create': console.log(commandLineUsage(createUsage)); break;
            case 'delete': console.log(commandLineUsage(deleteUsage)); break;
            default: console.log(commandLineUsage(thingsUsage));
        }
        process.exit(0);
    }

    if (['create:trial', 'delete:trial', 'get:device', 'get:product'].indexOf(operation) > -1) {
        getConfig()
            .then(validateConfig)
            .then(() => {

                switch (operation) {

                    case 'create:trial':
                        if (!options.liff || !options.product) {
                            console.error(`Command ${'things create:trial'.prompt} required LIFF ID and product name`.warn + EOL +
                                `Try re-run with option ${'--liff <liffId>'.input} and ${'--product <productName>'.input}`.help);
                            process.exit(1);
                        }

                        return things.createTrial(options.liff, options.product)
                            .then(result => {
                                console.log(result);
                                return;
                            });

                    case 'delete:trial':
                        break;

                    case 'get:device':
                        if (!options.id) {
                            console.error(`Command ${'things get:device'.prompt} required Device ID option`.warn + EOL +
                                `Try re-run with option ${'--id <deviceId>'.input}`.help);
                            process.exit(1);
                        }
                        if (!options.user) {
                            things.getProduct(options.id);
                        }
                        break;

                    case 'get:product':
                        break;

                }

                return;
            })
            .catch(error => {
                console.error(error.message || error.toString());
                process.exit(1);
            });

    } else if (operation) {
        switch (operation) {
            case 'version':
                console.log(versionText);
                break;
            case 'help':
            default:
                console.log(commandLineUsage(thingsUsage));
        }
    } else if (options.version) {
        console.log(versionText);
    } else {
        console.log(commandLineUsage(thingsUsage));
    }
} catch (commandError) {
    commandErrorHandler(commandError);
}
