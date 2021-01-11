"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signData = exports.unpackAndVerifySignatureDecorator = void 0;
const SignatureDecorator_1 = require("./SignatureDecorator");
const timestamp_1 = __importDefault(require("../../utils/timestamp"));
const buffer_1 = require("../../utils/buffer");
const JsonEncoder_1 = require("../../utils/JsonEncoder");
const BufferEncoder_1 = require("../../utils/BufferEncoder");
/**
 * Unpack and verify signed data before casting it to the supplied type.
 *
 * @param decorator Signature decorator to unpack and verify
 * @param wallet wallet instance
 *
 * @return Resulting data
 */
function unpackAndVerifySignatureDecorator(decorator, wallet) {
    return __awaiter(this, void 0, void 0, function* () {
        const signerVerkey = decorator.signer;
        // first 8 bytes are for 64 bit integer from unix epoch
        const signedData = BufferEncoder_1.BufferEncoder.fromBase64(decorator.signatureData);
        const signature = BufferEncoder_1.BufferEncoder.fromBase64(decorator.signature);
        const isValid = yield wallet.verify(signerVerkey, signedData, signature);
        if (!isValid) {
            throw new Error('Signature is not valid!');
        }
        // TODO: return Connection instance instead of raw json
        return JsonEncoder_1.JsonEncoder.fromBuffer(signedData.slice(8));
    });
}
exports.unpackAndVerifySignatureDecorator = unpackAndVerifySignatureDecorator;
/**
 * Sign data supplied and return a signature decorator.
 *
 * @param data the data to sign
 * @param walletHandle the handle of the wallet to use for signing
 * @param signerKey Signers verkey
 * @param indy Indy instance
 *
 * @returns Resulting signature decorator.
 */
function signData(data, wallet, signerKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataBuffer = buffer_1.Buffer.concat([timestamp_1.default(), JsonEncoder_1.JsonEncoder.toBuffer(data)]);
        const signatureBuffer = yield wallet.sign(dataBuffer, signerKey);
        const signatureDecorator = new SignatureDecorator_1.SignatureDecorator({
            signatureType: 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/signature/1.0/ed25519Sha512_single',
            signature: BufferEncoder_1.BufferEncoder.toBase64URL(signatureBuffer),
            signatureData: BufferEncoder_1.BufferEncoder.toBase64URL(dataBuffer),
            signer: signerKey,
        });
        return signatureDecorator;
    });
}
exports.signData = signData;
