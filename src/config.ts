import {resolve as pathResolve} from 'path';
import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

const configDir = pathResolve(__dirname, '../', '.env');
const fs = require('fs');

process.env['FS_PATH'] = __dirname;

const env: ProcessEnv = <ProcessEnv>{};

if (fs.existsSync(configDir)) {
    const defaults = {};
    const tempEnv: ProcessEnv = {
        ...defaults,
        ...dotenv.config({
            path: configDir,
        }).parsed,
    };
    const processEnvKeys: Array<string> = Object.keys(process.env);
    for (const key in tempEnv) {
        // noinspection JSUnfilteredForInLoop
        if (processEnvKeys.indexOf(key) === -1) {
            // noinspection JSUnfilteredForInLoop
            process.env[key] = tempEnv[key];
        }
        // noinspection JSUnfilteredForInLoop
        env[key] = process.env[key];
    }
}
