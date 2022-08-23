import path from 'path';
import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';

(() => {
    const options = commandLineArgs([
        {
            name: 'env',
            alias: 'e',
            defaultValue: 'dev',
            type: String,
        },
    ]);
    const result = dotenv.config({
        path: path.join(__dirname, `env/${options.env}.env`),
    });
    if (result.error) {
        throw result.error;
    }
})();
