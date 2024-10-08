//! TODO: fix these tests
/*
import assert from 'assert';

import { loadTests } from './utils.js';

import type { TestCaseWallet } from './types.js';

import {
    isError,
    getBytes,
    decryptKeystoreJson,
    decryptKeystoreJsonSync,
    encryptKeystoreJson,
    encryptKeystoreJsonSync,
    QuaiHDWallet,
    Wallet,
} from '../index.js';

import type { HDWalletStatic } from "../wallet/hdwallet.js";
import { HDWallet } from "../wallet/hdwallet.js";

describe('Tests JSON Wallet Formats', function () {
    const tests = loadTests<TestCaseWallet>('wallets');

    tests.forEach((test) => {
        if (test.type !== 'keystore') {
            return;
        }
        it(`tests decrypting Keystore JSON (sync): ${test.name}`, function () {
            this.timeout(20000);
            const password = getBytes(test.password);
            const account = decryptKeystoreJsonSync(test.content, password);
            //console.log(account);
            assert.equal(account.address, test.address, 'address');
        });
    });

    tests.forEach((test) => {
        if (test.type !== 'keystore') {
            return;
        }
        it(`tests decrypting Keystore JSON (async): ${test.name}`, async function () {
            this.timeout(20000);
            const password = getBytes(test.password);
            const account = await decryptKeystoreJson(test.content, password);
            //console.log(account);
            assert.equal(account.address, test.address, 'address');
        });
    });

    tests.forEach((test) => {
        it(`tests decrypting JSON (sync): ${test.name}`, function () {
            this.timeout(20000);
            const password = getBytes(test.password);
            const wallet = Wallet.fromEncryptedJsonSync(test.content, password);
            //console.log(wallet);
            assert.equal(wallet.address, test.address, 'address');
        });
    });

    tests.forEach((test) => {
        it(`tests decrypting JSON (async): ${test.name}`, async function () {
            this.timeout(20000);
            const password = getBytes(test.password);
            const wallet = await Wallet.fromEncryptedJson(test.content, password);
            //console.log(wallet);
            assert.equal(wallet.address, test.address, 'address');
        });
    });

    it('tests encrypting wallet with mnemonic', function () {
        this.timeout(20000);
        const WalletClass = QuaiHDWallet as typeof QuaiHDWallet & HDWalletStatic<QuaiHDWallet>;
        const wallet = WalletClass.createRandom("m/44'/60'/0'/0/0");
        assert.ok(wallet.mnemonic, 'mnemonic');
        const phrase = wallet.mnemonic.phrase;
        const json = wallet.encryptSync('foobar');
        const wallet2 = Wallet.fromEncryptedJsonSync(json, 'foobar');

        assert.ok(wallet2 instanceof QuaiHDWallet && wallet2.mnemonic);
        assert.equal(wallet2.mnemonic.phrase, phrase, 'phrase');

        assert.equal(wallet2.address, wallet.address, 'address');
    });
});

describe('Tests Extra JSON Wallet Functions', function () {

    const badKeystoreOptions: Array<{ name: string; options: any; error: string }> = [
        {
            name: 'invalid salt type',
            options: { salt: 42 },
            error: 'invalid BytesLike value',
        },
        {
            name: 'invalid uuid type',
            options: { uuid: 42 },
            error: 'invalid BytesLike value',
        },
        {
            name: 'invalid uuid length',
            options: { uuid: '0x1234' },
            error: 'invalid options.uuid',
        },
        {
            name: 'invalid iv type',
            options: { iv: 42 },
            error: 'invalid BytesLike value',
        },
        {
            name: 'invalid iv length',
            options: { iv: '0x1234' },
            error: 'invalid options.iv',
        },
        {
            name: 'invalid scrypt N (non-one-hot-encoded)',
            options: { scrypt: { N: 1023 } },
            error: 'invalid scrypt N parameter',
        },
        {
            name: 'invalid scrypt N (non-integer)',
            options: { scrypt: { N: 1.5 } },
            error: 'invalid scrypt N parameter',
        },
        {
            name: 'invalid scrypt r',
            options: { scrypt: { r: 1.5 } },
            error: 'invalid scrypt r parameter',
        },
        {
            name: 'invalid scrypt p',
            options: { scrypt: { p: 1.5 } },
            error: 'invalid scrypt p parameter',
        },
    ];
    const WalletClass = HDWallet as typeof HDWallet & HDWalletStatic<HDWallet>;
    const wallet = WalletClass.createRandom("m/44'/994'/0'/0");
    const account = { address: wallet.address, privateKey: wallet.privateKey };
    const password = 'foobar';

    for (const { name, options, error } of badKeystoreOptions) {
        it(`tests bad keystore options: ${name}`, function () {
            assert.throws(
                () => {
                    const result = encryptKeystoreJsonSync(account, password, options);
                    console.log(result);
                },
                (e: any) => {
                    return isError(e, 'INVALID_ARGUMENT') && e.message.startsWith(error);
                },
            );
        });
    }

    // Mainly to round out weird edge cases in coverage
    it('tests encryption with options (sync)', function () {
        assert.ok(encryptKeystoreJsonSync(account, password));
    });

    // Mainly to round out weird edge cases in coverage
    it('tests encryption with options (async)', async function () {
        assert.ok(await encryptKeystoreJson(account, password));
    });
});
*/
