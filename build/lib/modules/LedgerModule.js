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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerModule = void 0;
class LedgerModule {
    constructor(wallet, ledgerService) {
        this.ledgerService = ledgerService;
        this.wallet = wallet;
    }
    connect(poolName, poolConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ledgerService.connect(poolName, poolConfig);
        });
    }
    registerPublicDid() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: handle ping response message
        });
    }
    getPublicDid(did) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ledgerService.getPublicDid(did);
        });
    }
    registerCredentialSchema(schema) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const did = (_a = this.wallet.getPublicDid()) === null || _a === void 0 ? void 0 : _a.did;
            if (!did) {
                throw new Error('Agent has no public DID.');
            }
            return this.ledgerService.registerSchema(did, schema);
        });
    }
    getSchema(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ledgerService.getCredentialSchema(id);
        });
    }
    registerCredentialDefinition(credentialDefinitionTemplate) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const did = (_a = this.wallet.getPublicDid()) === null || _a === void 0 ? void 0 : _a.did;
            if (!did) {
                throw new Error('Agent has no public DID.');
            }
            return this.ledgerService.registerCredentialDefinition(did, credentialDefinitionTemplate);
        });
    }
    proverCreateCredentialReq(credentialDefinitionTemplate) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const did = (_a = this.wallet.getPublicDid()) === null || _a === void 0 ? void 0 : _a.did;
            if (!did) {
                throw new Error('Agent has no public DID.');
            }
            return this.ledgerService.registerCredentialDefinition(did, credentialDefinitionTemplate);
        });
    }
    getCredentialDefinition(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ledgerService.getCredentialDefinition(id);
        });
    }
}
exports.LedgerModule = LedgerModule;
