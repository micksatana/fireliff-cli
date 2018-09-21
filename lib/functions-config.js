
import * as ChildProcess from 'child_process';

/**
 * FunctionsConfig handle configuration in Firebase Functions
 */
export class FunctionsConfig {

    static async get(name) {
        return new Promise((resolve, reject) => {
            let command = `firebase functions:config:get`;

            if (name) {
                command = `${command} ${name}`;
            }

            ChildProcess.exec(command, (error, output) => {
                if (error) {
                    return reject(error);
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
