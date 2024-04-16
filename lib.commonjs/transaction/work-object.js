"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkObject = void 0;
const format_1 = require("../providers/format");
const quais_1 = require("../quais");
const utils_1 = require("../utils");
const proto_encode_1 = require("../utils/proto-encode");
const transaction_1 = require("./transaction");
/**
 *  Represents a WorkObject, which includes header, body, and transaction information.
 */
class WorkObject {
    #woHeader;
    #woBody;
    #tx;
    /**
     *  Constructs a WorkObject instance.
     *
     *  @param woHeader The header information of the WorkObject.
     *  @param woBody The body information of the WorkObject.
     *  @param tx The transaction associated with the WorkObject.
     *  @param signature The signature of the transaction (optional).
     */
    constructor(woHeader, woBody, tx) {
        this.#woHeader = woHeader;
        this.#woBody = woBody;
        this.#tx = transaction_1.Transaction.from(tx);
        this.#woHeader.txHash = this.#tx.hash;
        this.#validate();
    }
    /** Gets the header information of the WorkObject. */
    get woHeader() { return this.#woHeader; }
    set woHeader(value) { this.#woHeader = value; }
    /** Gets the body information of the WorkObject. */
    get woBody() { return this.#woBody; }
    set woBody(value) { this.#woBody = value; }
    /** Gets the transaction associated with the WorkObject. */
    get tx() { return this.#tx; }
    set tx(value) { this.#tx = transaction_1.Transaction.from(value); }
    /**
     *  Gets the serialized representation of the WorkObject.
     *  Throws an error if the WorkObject transaction is unsigned.
     */
    get serialized() {
        (0, quais_1.assert)(this.#tx.signature != null, "cannot serialize unsigned work object; maybe you meant .unsignedSerialized", "UNSUPPORTED_OPERATION", { operation: ".serialized" });
        return this.#serialize();
    }
    /**
     *  Gets the pre-image of the WorkObject.
     *  The hash of this is the digest which needs to be signed to authorize this WorkObject.
     */
    get unsignedSerialized() {
        return this.#serialize();
    }
    /**
    *  Creates a clone of the current WorkObject.
    *
    *  @returns A new WorkObject instance that is a clone of the current instance.
    */
    clone() {
        return WorkObject.from(this);
    }
    /**
     *  Converts the WorkObject to a JSON-like object.
     *
     *  @returns The WorkObject as a WorkObjectLike object.
     */
    toJSON() {
        return {
            woHeader: this.woHeader,
            woBody: this.woBody,
            tx: this.tx.toJSON(),
        };
    }
    /**
     *  Converts the WorkObject to its protobuf representation.
     *
     *  @returns The WorkObject as a ProtoWorkObject.
     */
    toProtobuf() {
        return {
            wo_header: {
                difficulty: (0, quais_1.getBytes)(this.woHeader.difficulty, "difficulty"),
                header_hash: { value: (0, quais_1.getBytes)(this.woHeader.headerHash, "header_hash") },
                location: { value: new Uint8Array(this.woHeader.location) },
                nonce: (0, quais_1.getNumber)(this.woHeader.nonce, "nonce"),
                number: (0, format_1.formatNumber)(this.woHeader.number, "number"),
                parent_hash: { value: (0, quais_1.getBytes)(this.woHeader.parentHash, "parent_hash") },
                tx_hash: { value: (0, quais_1.getBytes)(this.woHeader.txHash, "tx_hash") },
            },
            // wo_body: {
            //     ext_transactions: { work_objects: this.woBody.extTransactions.map(etx => WorkObject.from(etx).toProtobuf()) },
            //     header: {
            //         base_fee: getBytes(this.woBody.header.baseFeePerGas, "base_fee"),
            //         coinbase: getBytes(this.woBody.header.miner, "coinbase"),
            //         evm_root: { value: getBytes(this.woBody.header.evmRoot, "evm_root") },
            //         etx_hash: { value: getBytes(this.woBody.header.extTransactionsRoot, "etx_hash") },
            //         etx_rollup_hash: { value: getBytes(this.woBody.header.extRollupRoot, "etx_rollup_hash") },
            //         etx_set_hash: { value: getBytes(this.woBody.header.etxSetHash, "etx_set_hash") },
            //         extra: getBytes(this.woBody.header.extraData, "extra"),
            //         gas_limit: getNumber(this.woBody.header.gasLimit, "gas_limit"),
            //         gas_used: getNumber(this.woBody.header.gasUsed, "gas_used"),
            //         manifest_hash: this.woBody.header.manifestHash.map(h => ({ value: getBytes(h, "manifest_hash") })),
            //         number: this.woBody.header.number.map(n => formatNumber(n, "number")),
            //         parent_delta_s: this.woBody.header.parentDeltaS.map(h => formatNumber(h, "parent_delta_s")),
            //         parent_entropy: this.woBody.header.parentEntropy.map(h => formatNumber(h, "parent_entropy")),
            //         parent_hash: this.woBody.header.parentHash.map(h => ({ value: getBytes(h, "parent_hash") })),
            //         receipt_hash: { value: getBytes(this.woBody.header.receiptsRoot, "receipt_hash") },
            //         tx_hash: { value: getBytes(this.woBody.header.transactionsRoot, "tx_hash") },
            //         uncle_hash: { value: getBytes(this.woBody.header.sha3Uncles, "uncle_hash") },
            //         utxo_root: { value: getBytes(this.woBody.header.utxoRoot) },
            //     },
            //     transactions: { work_objects: this.woBody.transactions.map(tx => WorkObject.from(tx).toProtobuf()) },
            //     uncles: { work_objects: this.woBody.uncles.map(uncle => WorkObject.from(uncle).toProtobuf()) },
            //     manifest: { manifest: this.woBody.manifest.map(m => ({ value: getBytes(m) })) },
            // },
            wo_body: null,
            tx: this.tx.toProtobuf(),
        };
    }
    /**
     *  Creates a WorkObject instance from a WorkObjectLike object.
     *
     *  @param data The WorkObjectLike object to create the WorkObject from.
     *  @returns A new WorkObject instance.
     */
    static from(wo) {
        if (typeof (wo) === "string") {
            const decodedProtoWo = (0, utils_1.decodeProtoWorkObject)((0, quais_1.getBytes)(wo));
            return WorkObject.fromProto(decodedProtoWo);
        }
        return new WorkObject(wo.woHeader, wo.woBody, wo.tx);
    }
    /**
     * Creates a WorkObject instance from a ProtoWorkObject object.
     *
     * @param protoWo The ProtoWorkObject object to create the WorkObject from.
     * @returns A new WorkObject instance.
     */
    static fromProto(protoWo) {
        // Assuming methods to convert ProtoHeader and ProtoWorkObjects to their respective interfaces
        const woHeader = {
            difficulty: (0, quais_1.hexlify)(protoWo.wo_header?.difficulty || new Uint8Array()),
            headerHash: (0, quais_1.hexlify)(protoWo.wo_header?.header_hash?.value || new Uint8Array()),
            location: protoWo.wo_header?.location?.value ? Array.from(protoWo.wo_header.location.value) : [],
            nonce: protoWo.wo_header?.nonce?.toString() || "0",
            number: (0, quais_1.hexlify)(protoWo.wo_header?.number || new Uint8Array()),
            parentHash: (0, quais_1.hexlify)(protoWo.wo_header?.parent_hash?.value || new Uint8Array()),
            txHash: (0, quais_1.hexlify)(protoWo.wo_header?.tx_hash?.value || new Uint8Array()),
        };
        const woBody = {
            extTransactions: protoWo.wo_body?.ext_transactions?.work_objects.map(WorkObject.fromProto) || [],
            header: {
                baseFeePerGas: (0, quais_1.hexlify)(protoWo.wo_body?.header?.base_fee || new Uint8Array()),
                evmRoot: (0, quais_1.hexlify)(protoWo.wo_body?.header?.evm_root?.value || new Uint8Array()),
                extRollupRoot: (0, quais_1.hexlify)(protoWo.wo_body?.header?.etx_rollup_hash?.value || new Uint8Array()),
                extTransactionsRoot: (0, quais_1.hexlify)(protoWo.wo_body?.header?.etx_hash?.value || new Uint8Array()),
                etxSetHash: (0, quais_1.hexlify)(protoWo.wo_body?.header?.etx_set_hash?.value || new Uint8Array()),
                extraData: (0, quais_1.hexlify)(protoWo.wo_body?.header?.extra || new Uint8Array()),
                gasLimit: protoWo.wo_body?.header?.gas_limit?.toString() || "0",
                gasUsed: protoWo.wo_body?.header?.gas_used?.toString() || "0",
                manifestHash: protoWo.wo_body?.header?.manifest_hash?.map(hash => (0, quais_1.hexlify)(hash.value)) || [],
                miner: (0, quais_1.hexlify)(protoWo.wo_body?.header?.coinbase || new Uint8Array()),
                number: protoWo.wo_body?.header?.number?.map(n => (0, quais_1.hexlify)(n)) || [],
                parentDeltaS: protoWo.wo_body?.header?.parent_delta_s?.map(h => (0, quais_1.hexlify)(h)) || [],
                parentEntropy: protoWo.wo_body?.header?.parent_entropy?.map(h => (0, quais_1.hexlify)(h)) || [],
                parentHash: protoWo.wo_body?.header?.parent_hash?.map(hash => (0, quais_1.hexlify)(hash.value)) || [],
                receiptsRoot: (0, quais_1.hexlify)(protoWo.wo_body?.header?.receipt_hash?.value || new Uint8Array()),
                sha3Uncles: (0, quais_1.hexlify)(protoWo.wo_body?.header?.uncle_hash?.value || new Uint8Array()),
                transactionsRoot: (0, quais_1.hexlify)(protoWo.wo_body?.header?.tx_hash?.value || new Uint8Array()),
                utxoRoot: (0, quais_1.hexlify)(protoWo.wo_body?.header?.utxo_root?.value || new Uint8Array()),
            },
            manifest: protoWo.wo_body?.manifest?.manifest.map(hash => (0, quais_1.hexlify)(hash.value)) || [],
            transactions: protoWo.wo_body?.transactions?.work_objects.map(WorkObject.fromProto) || [],
            uncles: protoWo.wo_body?.uncles?.work_objects.map(WorkObject.fromProto) || [],
        };
        // Convert ProtoTransaction to TransactionLike using Transaction.fromProto
        const tx = protoWo.tx
            ? transaction_1.Transaction.fromProto(protoWo.tx).toJSON()
            : {};
        // Create a new WorkObject instance with the converted header, body, and transaction
        return new WorkObject(woHeader, woBody, tx);
    }
    /**
     *  Serializes the WorkObject to a string.
     *
     *  @returns The serialized string representation of the WorkObject.
     */
    #serialize() {
        return (0, proto_encode_1.encodeProtoWorkObject)(this.toProtobuf());
    }
    /**
     *  Validates the WorkObject.
     *  Ensures that the body header number and parent hashes are of the correct length.
     *
     *  TODO: This method should validate the entire WorkObject.
     */
    #validate() {
        this.#woBody.header.number = this.#woBody.header.number.slice(0, 2);
        this.#woBody.header.parentHash = this.#woBody.header.parentHash.slice(0, 2);
    }
}
exports.WorkObject = WorkObject;
//# sourceMappingURL=work-object.js.map