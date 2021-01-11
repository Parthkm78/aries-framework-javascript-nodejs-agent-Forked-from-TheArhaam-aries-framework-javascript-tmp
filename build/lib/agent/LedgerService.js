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
exports.LedgerService = void 0;
const logger_1 = __importDefault(require("../logger"));
const indyError_1 = require("../utils/indyError");
class LedgerService {
    constructor(wallet, indy) {
        this.wallet = wallet;
        this.indy = indy;
    }
    connect(poolName, poolConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.log(`Creating pool config with name "${poolName}".`);
                yield this.indy.createPoolLedgerConfig(poolName, poolConfig);
            }
            catch (error) {
                if (indyError_1.isIndyError(error, 'PoolLedgerConfigAlreadyExistsError')) {
                    logger_1.default.log(error.indyName);
                }
                else {
                    throw error;
                }
            }
            logger_1.default.log('Setting protocol version');
            yield this.indy.setProtocolVersion(2);
            logger_1.default.log('Opening pool');
            this.poolHandle = yield this.indy.openPoolLedger(poolName);
        });
    }
    getPublicDid(did) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.poolHandle) {
                throw new Error('Pool has not been initialized.');
            }
            const request = yield this.indy.buildGetNymRequest(null, did);
            logger_1.default.log('request', request);
            const response = yield this.indy.submitRequest(this.poolHandle, request);
            logger_1.default.log('response', response);
            const result = yield this.indy.parseGetNymResponse(response);
            logger_1.default.log('result', result);
            return result;
        });
    }
    registerSchema(did, schemaTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.poolHandle) {
                throw new Error('Pool has not been initialized.');
            }
            const { name, attributes, version } = schemaTemplate;
            const [schemaId, schema] = yield this.indy.issuerCreateSchema(did, name, version, attributes);
            logger_1.default.log(`Register schema with ID = ${schemaId}:`, schema);
            const request = yield this.indy.buildSchemaRequest(did, schema);
            logger_1.default.log('Register schema request', request);
            const requestWithTaa = yield this.appendTaa(request);
            const signedRequest = yield this.wallet.signRequest(did, requestWithTaa);
            const response = yield this.indy.submitRequest(this.poolHandle, signedRequest);
            logger_1.default.log('Register schema response', response);
            return [schemaId, schema];
        });
    }
    getCredentialSchema(schemaId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.poolHandle) {
                throw new Error('Pool has not been initialized.');
            }
            const request = yield this.indy.buildGetSchemaRequest(null, schemaId);
            logger_1.default.log('Get schema request', request);
            const response = yield this.indy.submitRequest(this.poolHandle, request);
            logger_1.default.log('Get schema response', response);
            const [, schema] = yield this.indy.parseGetSchemaResponse(response);
            logger_1.default.log('Get schema result: ', schema);
            return schema;
        });
    }
    registerCredentialDefinition(did, credentialDefinitionTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.poolHandle) {
                throw new Error('Pool has not been initialized.');
            }
            const { schema, tag, signatureType, config } = credentialDefinitionTemplate;
            const [credDefId, credDef] = yield this.wallet.createCredentialDefinition(did, schema, tag, signatureType, config);
            logger_1.default.log(`Register credential definition with ID = ${credDefId}:`, credDef);
            const request = yield this.indy.buildCredDefRequest(did, credDef);
            logger_1.default.log('Register credential definition request:', request);
            const requestWithTaa = yield this.appendTaa(request);
            const signedRequest = yield this.wallet.signRequest(did, requestWithTaa);
            const response = yield this.indy.submitRequest(this.poolHandle, signedRequest);
            logger_1.default.log('Register credential definition response:', response);
            return [credDefId, credDef];
        });
    }
    getCredentialDefinition(credDefId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.poolHandle) {
                throw new Error('Pool has not been initialized.');
            }
            const request = yield this.indy.buildGetCredDefRequest(null, credDefId);
            logger_1.default.log('Get credential definition request:', request);
            const response = yield this.indy.submitRequest(this.poolHandle, request);
            logger_1.default.log('Get credential definition response:', response);
            const [, credentialDefinition] = yield this.indy.parseGetCredDefResponse(response);
            logger_1.default.log('Get credential definition result: ', credentialDefinition);
            return credentialDefinition;
        });
    }
    appendTaa(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorAgreement = yield this.getTransactionAuthorAgreement();
            // If ledger does not have TAA, we can just send request
            if (authorAgreement == null) {
                return request;
            }
            const requestWithTaa = yield this.indy.appendTxnAuthorAgreementAcceptanceToRequest(request, authorAgreement.text, authorAgreement.version, authorAgreement.digest, this.getFirstAcceptanceMechanism(authorAgreement), 
            // Current time since epoch
            // We can't use ratification_ts, as it must be greater than 1499906902
            Math.floor(new Date().getTime() / 1000));
            return requestWithTaa;
        });
    }
    getTransactionAuthorAgreement() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO Replace this condition with memoization
            if (this.authorAgreement !== undefined) {
                return this.authorAgreement;
            }
            if (!this.poolHandle) {
                throw new Error('Pool has not been initialized.');
            }
            const taaRequest = yield this.indy.buildGetTxnAuthorAgreementRequest(null);
            const taaResponse = yield this.indy.submitRequest(this.poolHandle, taaRequest);
            const acceptanceMechanismRequest = yield this.indy.buildGetAcceptanceMechanismsRequest(null);
            const acceptanceMechanismResponse = yield this.indy.submitRequest(this.poolHandle, acceptanceMechanismRequest);
            // TAA can be null
            if (taaResponse.result.data == null) {
                this.authorAgreement = null;
                return null;
            }
            // If TAA is not null, we can be sure AcceptanceMechanisms is also not null
            const authorAgreement = taaResponse.result.data;
            const acceptanceMechanisms = acceptanceMechanismResponse.result.data;
            this.authorAgreement = Object.assign(Object.assign({}, authorAgreement), { acceptanceMechanisms });
            return this.authorAgreement;
        });
    }
    getFirstAcceptanceMechanism(authorAgreement) {
        const [firstMechanism] = Object.keys(authorAgreement.acceptanceMechanisms.aml);
        return firstMechanism;
    }
}
exports.LedgerService = LedgerService;
