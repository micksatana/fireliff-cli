import * as ChildProcess from 'child_process';
import { EOL } from 'os';

/**
 * FunctionsConfig handle configuration in Firebase Functions
 */
export class FunctionsConfig {

    static SingleChannelGroup = 'line';

    static AccessTokenName = 'access_token';

    static get AccessToken() {
        return FunctionsConfig.config[FunctionsConfig.SingleChannelGroup][FunctionsConfig.AccessTokenName];
    }

    static async get(name) {
        return new Promise((resolve, reject) => {
            let command = `firebase functions:config:get`;

            if (name) {
                command = `${command} ${name}`;
            }

            ChildProcess.exec(command, (error, output) => {
                if (error) {
                    return reject(FunctionsConfig.parseConfigError(error));
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

    static parseConfigError(errorText) {
        let errorMessage = 'Failed to get configuration'.error + EOL + 'Suggestions:'.info + EOL;

        if (/Authentication Error/.test(errorText)) {
            return errorMessage + 'Your credentials are no longer valid. Please run firebase login --reauth'.verbose;
        } else {
            return errorMessage + `Run ${'firebase init'.code} to start a project directory in the current folder.`.verbose + EOL +
                `Run ${'firebase use --add'.code} to set active project.`.verbose;
        }
    }

    static async set(name, value) {
        return new Promise((resolve, reject) => {
            ChildProcess.exec(`firebase functions:config:set ${name}=${value}`, (error) => {
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
            ChildProcess.exec(`firebase functions:config:unset ${name}`, (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve(name);
            });
        });
    }

}
