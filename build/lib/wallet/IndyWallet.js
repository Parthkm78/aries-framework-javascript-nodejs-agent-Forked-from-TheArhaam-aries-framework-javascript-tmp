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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndyWallet = void 0;
const logger_1 = __importDefault(require("../logger"));
const indyError_1 = require("../utils/indyError");
const JsonEncoder_1 = require("../utils/JsonEncoder");
class IndyWallet {
    constructor(walletConfig, walletCredentials, indy) {
        this.walletConfig = walletConfig;
        this.walletCredentials = walletCredentials;
        this.indy = indy;
    }
    get walletHandle() {
        return this.wh;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.indy.createWallet(this.walletConfig, this.walletCredentials);
            }
            catch (error) {
                logger_1.default.log('error', error);
                if (indyError_1.isIndyError(error, 'WalletAlreadyExistsError')) {
                    logger_1.default.log(error.indyName);
                }
                else {
                    throw error;
                }
            }
            this.wh = yield this.indy.openWallet(this.walletConfig, this.walletCredentials);
            try {
                logger_1.default.log(`Creating master secret...`);
                this.masterSecretId = yield this.indy.proverCreateMasterSecret(this.wh, this.walletConfig.id);
            }
            catch (error) {
                logger_1.default.log('error', error);
                if (indyError_1.isIndyError(error, 'AnoncredsMasterSecretDuplicateNameError')) {
                    // master secret id is the same as the master secret id passed in the create function
                    // so if it already exists we can just assign it.
                    this.masterSecretId = this.walletConfig.id;
                    logger_1.default.log(`master secret with id ${this.masterSecretId} already exists`, error.indyName);
                }
                else {
                    throw error;
                }
            }
            logger_1.default.log(`Wallet opened with handle: ${this.wh}`);
        });
    }
    initPublicDid(didConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const [did, verkey] = yield this.createDid(didConfig);
            this.publicDidInfo = {
                did,
                verkey,
            };
        });
    }
    getPublicDid() {
        return this.publicDidInfo;
    }
    createDid(didConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            return this.indy.createAndStoreMyDid(this.wh, didConfig || {});
        });
    }
    createCredentialDefinition(issuerDid, schema, tag, signatureType, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            return this.indy.issuerCreateAndStoreCredentialDef(this.wh, issuerDid, schema, tag, signatureType, config);
        });
    }
    createCredentialOffer(credDefId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            return this.indy.issuerCreateCredentialOffer(this.wh, credDefId);
        });
    }
    /**
     *
     * @param proof This method is used to fetch credentials for proof request
     */
    getCredentialsForProofReq(proof) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            return yield this.indy.proverGetCredentialsForProofReq(this.wh, proof);
        });
    }
    /**
     *
     * @param proof This method is used to create proof for prover
     */
    proverCreateProof(proofReq, requestedCredentials, schemas, credentialDefs, revStates) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh || !this.masterSecretId) {
                throw Error('Wallet has not been initialized yet');
            }
            // console.log("isnide indy");
            return yield this.indy.proverCreateProof(this.wh, proofReq, requestedCredentials, this.masterSecretId, schemas, credentialDefs, revStates);
        });
    }
    proverCreateMasterSecret(masterSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            return yield this.indy.proverCreateMasterSecret(this.wh, masterSecret);
        });
    }
    /**
     *  This method is used to verify the proof
     * @param wh
     * @param proofReq
     * @param proof
     * @param requestedCredentials
     * @param schemas
     * @param credentialDefs
     * @param revocRegDefs
     * @param revocRegs
     */
    verifierVerifyProof(proofReq, proof, requestedCredentials, schemas, credentialDefs, revocRegDefs, revocRegs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh || !this.masterSecretId) {
                throw Error('Wallet has not been initialized yet');
            }
            // console.log("isnide indy");
            return yield this.indy.verifierVerifyProof(proofReq, proof, requestedCredentials, schemas, credentialDefs, revocRegDefs, revocRegs);
        });
    }
    createCredentialRequest(proverDid, offer, credDef) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh || !this.masterSecretId) {
                throw Error('Wallet has not been initialized yet');
            }
            return this.indy.proverCreateCredentialReq(this.wh, proverDid, offer, credDef, this.masterSecretId);
        });
    }
    createCredential(credOffer, credReq, credValues) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            // TODO This is just dummy tails writer config to get dummy blob reader handle because revocations feature
            // is not part of the credential issuance task. It needs to be implemented properly together with revocations
            // feature implementation.
            const tailsWriterConfig = {
                base_dir: '',
                uri_pattern: '',
            };
            const blobReaderHandle = yield this.indy.openBlobStorageReader('default', tailsWriterConfig);
            return this.indy.issuerCreateCredential(this.wh, credOffer, credReq, credValues, null, blobReaderHandle);
        });
    }
    storeCredential(credentialId, credReqMetadata, cred, credDef) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            return this.indy.proverStoreCredential(this.wh, credentialId, credReqMetadata, cred, credDef, null);
        });
    }
    pack(payload, recipientKeys, senderVk) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            const messageRaw = JsonEncoder_1.JsonEncoder.toBuffer(payload);
            const packedMessage = yield this.indy.packMessage(this.wh, messageRaw, recipientKeys, senderVk);
            return JsonEncoder_1.JsonEncoder.fromBuffer(packedMessage);
        });
    }
    unpack(messagePackage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            const unpackedMessageBuffer = yield this.indy.unpackMessage(this.wh, JsonEncoder_1.JsonEncoder.toBuffer(messagePackage));
            const unpackedMessage = JsonEncoder_1.JsonEncoder.fromBuffer(unpackedMessageBuffer);
            return Object.assign(Object.assign({}, unpackedMessage), { message: JsonEncoder_1.JsonEncoder.fromString(unpackedMessage.message) });
        });
    }
    sign(data, verkey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            const signatureBuffer = yield this.indy.cryptoSign(this.wh, verkey, data);
            return signatureBuffer;
        });
    }
    verify(signerVerkey, data, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            // check signature
            const isValid = yield this.indy.cryptoVerify(signerVerkey, data, signature);
            return isValid;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            return this.indy.closeWallet(this.wh);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw Error('Wallet has not been initialized yet');
            }
            return this.indy.deleteWallet(this.walletConfig, this.walletCredentials);
        });
    }
    addWalletRecord(type, id, value, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw new Error(`Wallet has not been initialized yet`);
            }
            return this.indy.addWalletRecord(this.wh, type, id, value, tags);
        });
    }
    updateWalletRecordValue(type, id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw new Error(`Wallet has not been initialized yet`);
            }
            return this.indy.updateWalletRecordValue(this.wh, type, id, value);
        });
    }
    updateWalletRecordTags(type, id, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw new Error(`Wallet has not been initialized yet`);
            }
            return this.indy.addWalletRecordTags(this.wh, type, id, tags);
        });
    }
    deleteWalletRecord(type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw new Error(`Wallet has not been initialized yet`);
            }
            return this.indy.deleteWalletRecord(this.wh, type, id);
        });
    }
    search(type, query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wh) {
                throw new Error(`Wallet has not been initialized yet`);
            }
            const sh = yield this.indy.openWalletSearch(this.wh, type, query, options);
            const generator = function (indy, wh) {
                return __asyncGenerator(this, arguments, function* () {
                    try {
                        while (true) {
                            // count should probably be exported as a config?
                            const recordSearch = yield __await(indy.fetchWalletSearchNextRecords(wh, sh, 10));
                            for (const record of recordSearch.records) {
                                yield yield __await(record);
                            }
                        }
                    }
                    catch (error) {
                        // pass
                    }
                    finally {
                        yield __await(indy.closeWalletSearch(sh));
                        return yield __await(void 0);
                    }
                });
            };
            return generator(this.indy, this.wh);
        });
    }
    getWalletRecord(type, id, options) {
        if (!this.wh) {
            throw new Error(`Wallet has not been initialized yet`);
        }
        return this.indy.getWalletRecord(this.wh, type, id, options);
    }
    signRequest(myDid, request) {
        if (!this.wh) {
            throw new Error(`Wallet has not been initialized yet`);
        }
        return this.indy.signRequest(this.wh, myDid, request);
    }
    keyForLocalDid(did) {
        if (!this.wh) {
            throw Error('Wallet has not been initialized yet');
        }
        return this.indy.keyForLocalDid(this.wh, did);
    }
}
exports.IndyWallet = IndyWallet;
