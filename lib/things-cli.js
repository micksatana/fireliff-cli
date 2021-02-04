#!/usr/bin/env node
import 'console.table';
import { EOL } from 'os';
import './colors-set-theme';
import thingsUsage, {
  createUsage,
  deleteUsage,
  getUsage,
} from './things-cli-usage';
import { commandErrorHandler, getConfig, validateConfig } from './shared';
import { Things } from './things.js';
import pjson from '../package.json';

const versionText = `Things CLIs v${pjson.version} for Things API v1`.help;

try {
  const commandLineArgs = require('command-line-args');
  const commandLineUsage = require('command-line-usage');

  const { operation, _unknown } = commandLineArgs(
    [{ name: 'operation', defaultOption: true }],
    { stopAtFirstUnknown: true }
  );
  const argv = _unknown || [];
  const options = commandLineArgs(
    [
      { name: 'device', alias: 'd', type: String },
      { name: 'help', alias: 'h', type: Boolean },
      { name: 'id', type: String },
      { name: 'liff', alias: 'l', type: String },
      { name: 'name', alias: 'n', type: String },
      { name: 'product', alias: 'p', type: String },
      { name: 'user', alias: 'u', type: String },
      { name: 'version', alias: 'v', type: Boolean },
      { name: 'debug', type: Boolean },
    ],
    { argv }
  );

  const things = new Things();

  if (options.help) {
    if (/^get/.test(operation)) {
      console.log(commandLineUsage(getUsage));
    } else if (/^create/.test(operation) || /^add/.test(operation)) {
      console.log(commandLineUsage(createUsage));
    } else if (
      /^delete/.test(operation) ||
      /^remove/.test(operation) ||
      /^rm/.test(operation)
    ) {
      console.log(commandLineUsage(deleteUsage));
    } else {
      console.log(commandLineUsage(thingsUsage));
    }
    process.exit(0);
  }

  if (
    [
      'create:trial',
      'delete:trial',
      'get:device',
      'get:product',
      'get:trial',
    ].indexOf(operation) > -1
  ) {
    switch (operation) {
      case 'create:trial':
        if (!options.liff || !options.product) {
          console.error(
            `Command ${
              'things create:trial'.prompt
            } required LIFF ID and product name`.warn +
              EOL +
              `Try re-run with option ${'--liff <liffId>'.input} and ${
                '--product <productName>'.input
              }`.help
          );
          process.exit(1);
        }
        break;

      case 'delete:trial':
        if (!options.product) {
          console.error(
            `Command ${'things delete:trial'.prompt} required Product ID`.warn +
              EOL +
              `Try re-run with option ${'--product <productId>'.input}`.help
          );
          process.exit(1);
        }
        break;

      case 'get:device':
        if (
          (!options.user && !options.product) ||
          (!options.user && !options.device)
        ) {
          console.error(
            `Command ${
              'things get:device'.prompt
            } required User ID together with either product ID or device ID`
              .warn +
              EOL +
              `Try re-run with option ${'--user <userId>'.input}, and  ${
                '--product <productId>'.input
              } OR  ${'--device <deviceId>'.input}`.help
          );
          process.exit(1);
        }
        break;

      case 'get:product':
        if (!options.device) {
          console.error(
            `Command ${'things get:product'.prompt} required Device ID option`
              .warn +
              EOL +
              `Try re-run with option ${'--device <deviceId>'.input}`.help
          );
          process.exit(1);
        }
        break;
    }

    getConfig()
      .then(validateConfig)
      .then(() => {
        switch (operation) {
          case 'create:trial':
            return things
              .createTrialProduct(options.liff, options.product)
              .then((result) => {
                console.log(result);
                return;
              });

          case 'delete:trial':
            return things.deleteTrialProduct(options.product).then((result) => {
              console.log(result);
              return;
            });

          case 'get:device':
            if (options.product) {
              return things
                .getDevicesByProductUser(options.product, options.user)
                .then((result) => {
                  console.log(result);
                  return;
                });
            } else {
              return things
                .getDeviceByDeviceUser(options.device, options.user)
                .then((result) => {
                  console.log(result);
                  return;
                });
            }

          case 'get:product':
            return things.getProduct(options.device).then((result) => {
              console.log(result);
              return;
            });

          case 'get:trial':
            return things.getTrialProducts().then((result) => {
              console.log(result);
              return;
            });
        }

        return;
      })
      .catch((error) => {
        if (options.debug) {
          console.log('Response', error.response);
        }

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
