import * as ChildProcess from 'child_process';
import { EOL } from 'os';
import './colors-set-theme';

const FailedToGetConfig = 'Failed to get configuration'.error;
const FailedToGetConfigAuthError = [
    FailedToGetConfig,
    'Suggestions:'.info,
    'Your credentials are no longer valid. Please run firebase login --reauth'.verbose
].join(EOL);
const FailedToGetConfigUnknownError = [
    FailedToGetConfig,
    'Suggestions:'.info,
    `Run ${'firebase init'.code} to start a project directory in the current folder.`.verbose,
    `Run ${'firebase use --add'.code} to set active project.`.verbose
].join(EOL);

/**
 * FunctionsConfig handle configuration in Firebase Functions
 */
export class FunctionsConfig {

    static AccessTokenName = 'access_token';
    static SingleChannelGroup = 'line';

    static get BaseCommand() {
        return 'firebase functions:config';
    }

    static get ErrorMessages() {
        return {
            FailedToGetConfig, FailedToGetConfigAuthError, FailedToGetConfigUnknownError
        };
    }

    static get AccessToken() {
        return FunctionsConfig.config[FunctionsConfig.SingleChannelGroup][FunctionsConfig.AccessTokenName];
    }

    static async get(name) {
        return new Promise((resolve, reject) => {
            let command = `${FunctionsConfig.BaseCommand}:get`;

            if (name) {
                command = `${command} ${name}`;
            }

            ChildProcess.exec(command, (error, output) => {
                if (error) {
                    return reject(FunctionsConfig.parseGetConfigError(error));
                }

                try {
                    let config = JSON.parse(output);
                    return resolve(config);
                } catch (jsonParseError) {
                    return reject(jsonParseError);
                }
            });
        });
    }

    static async getNamesById(group, id, config) {
        const names = [];

        if (!config || !config[group]) {
            config = await FunctionsConfig.get();
        }

        if (config && config[group]) {
            for (let name in config[group]) {
                if (config[group][name] === id) {
                    names.push(name);
                }
            }
        }

        return names;
    }

    static async getIdByName(group, name, config) {
        if (!config || !config[group]) {
            config = await FunctionsConfig.get();
        }

        if (config && config[group]) {
            for (let prop in config[group]) {
                if (prop === name) {
                    return config[group][prop];
                }
            }
        }
        return null;
    }

    static parseName(name) {
        return name.toLowerCase().replace(/\s/g, '_');
    }

    /**
     * 
     * @param {Error|string} error 
     * @return {string} error message intented to be used in console.log
     */
    static parseGetConfigError(error) {
        let errorMessage = (error instanceof Error) ? error.message : error;

        if (/Authentication Error/.test(errorMessage)) {
            return FunctionsConfig.ErrorMessages.FailedToGetConfigAuthError;
        } else {
            return FunctionsConfig.ErrorMessages.FailedToGetConfigUnknownError;
        }
    }

    static async set(name, value) {
        return new Promise((resolve, reject) => {
            ChildProcess.exec(`${FunctionsConfig.BaseCommand}:set ${name}=${value}`, (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve(value);
            });
        });
    }

    static reload() {
        return FunctionsConfig.get().then(config => FunctionsConfig.config = config);
    }

    static async unset(name) {
        return new Promise((resolve, reject) => {
            ChildProcess.exec(`${FunctionsConfig.BaseCommand}:unset ${name}`, (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve(name);
            });
        });
    }

}
