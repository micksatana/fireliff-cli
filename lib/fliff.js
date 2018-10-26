import * as colors from 'colors';
import { mkdir, existsSync } from 'fs';
import * as path from 'path';
import * as prompt from 'prompt';
import { spawn } from 'child_process';

const copy = require('recursive-copy');

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

export class FLIFF {
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
}