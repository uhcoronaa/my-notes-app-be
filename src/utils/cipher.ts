import crypto from 'crypto';
import get from 'lodash/get';
import * as crypto2 from 'crypto-js';

const key = get(process, 'env.KEY', null);
const iv = get(process, 'env.IV', null);
const keyUi = get(process, 'env.KEYUI', null);

function encrypt(text: string) {
    try {
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, "utf-8"), Buffer.from(iv, "utf-8"));
        const encrypted = cipher.update(text, "utf-8", "hex");
        const finalEncryption = cipher.final("hex");
        return encrypted + finalEncryption;
    }
    catch (err) {
        return new Error('CIPHER_ERROR');
    }
}

function decrypt(text: string) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, "utf-8"), Buffer.from(iv, "utf-8"));
        const encrypted = decipher.update(text, "hex", "utf-8");
        const finalEncryption = decipher.final("utf-8");
        return encrypted + finalEncryption;
    }
    catch (err) {
        return new Error('CIPHER_ERROR');
    }
}

function decrypt2(text: string): string {
    try {
        return crypto2.AES.decrypt(text.trim(), keyUi.trim()).toString(crypto2.enc.Utf8);
    }
    catch (err) {
        throw new Error('CIPHER_ERROR');
    }
}

export { encrypt, decrypt, decrypt2 }