import fs from 'fs-extra';
import logger from 'jet-logger';
import childProcess from 'child_process';
import commandLineArgs from 'command-line-args';

(async () => {
    try {
        await remove('./dist/');
        const options = commandLineArgs([
            {
                name: 'env',
                alias: 'e',
                defaultValue: 'dev',
                type: String,
            },
        ]);
        await copy(`./src/pre-start/env/${options.env}.env`, `./dist/pre-start/env/${options.env}.env`);        
        await exec('tsc', './')
    } catch (err) {
        logger.err(err);
    }
})();

function remove(loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.remove(loc, (err) => {
            return (!!err ? rej(err) : res());
        });
    });
}

function copy(src: string, dest: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.copy(src, dest, (err) => {
            return (!!err ? rej(err) : res());
        });
    });
}

function exec(cmd: string, loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
            if (!!stdout) {
                logger.info(stdout);
            }
            if (!!stderr) {
                logger.warn(stderr);
            }
            return (!!err ? rej(err) : res());
        });
    });
}
