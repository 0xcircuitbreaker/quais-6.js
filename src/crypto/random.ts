/**
 * A **Cryptographically Secure Random Value** is one that has been generated with additional care take to prevent
 * side-channels from allowing others to detect it and prevent others from through coincidence generate the same
 * values.
 */
import { randomBytes as crypto_random } from './crypto.js';

let locked = false;

const _randomBytes = function (length: number): Uint8Array {
    return new Uint8Array(crypto_random(length));
};

let __randomBytes = _randomBytes;

/**
 * Return `length` bytes of cryptographically secure random data.
 *
 * @category Crypto
 * @example
 *
 * ```ts
 * randomBytes(8);
 * ```
 *
 * @param {number} length - The number of bytes to generate.
 * @returns {Uint8Array} The random bytes.
 */
export function randomBytes(length: number): Uint8Array {
    return __randomBytes(length);
}

randomBytes._ = _randomBytes;
randomBytes.lock = function (): void {
    locked = true;
};
randomBytes.register = function (func: (length: number) => Uint8Array) {
    if (locked) {
        throw new Error('randomBytes is locked');
    }
    __randomBytes = func;
};
Object.freeze(randomBytes);
