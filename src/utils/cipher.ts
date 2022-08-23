import get from 'lodash/get';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

const saltRounds = +get(process, 'env.SALT_ROUNDS', null);

function encrypt(text: string) {
    try {
        const salt = genSaltSync(saltRounds);
        const hash = hashSync(text, salt);
        return hash;
    }
    catch (err) {
        console.log(err);
        return new Error('CIPHER_ERROR');
    }
}

function compare(text: string, hash: string) {
    try {
        return compareSync(text, hash);
    }
    catch (err) {
        console.log(err);
        return new Error('CIPHER_ERROR');
    }
}

export { encrypt, compare }