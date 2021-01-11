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
exports.ProofsModule = void 0;
const helpers_1 = require("../protocols/helpers");
/**
 * The fuctionalities of this Class is used to Send proof request
 */
class ProofsModule {
    constructor(proofService, messageSender, credentialService, ledgerService) {
        this.proofService = proofService;
        this.messageSender = messageSender;
        this.credentialService = credentialService;
        this.ledgerService = ledgerService;
    }
    /**
     * This method is used to send proof request
     * @param connection : Connection to which issuer wants to issue a credential
     * @param ProofRequestTemplate : Template used to send proof request
     */
    sendProofRequest(connection, proofRequestTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            const proofOfferMessage = yield this.proofService.createRequest(connection, proofRequestTemplate);
            const outboundMessage = helpers_1.createOutboundMessage(connection, proofOfferMessage);
            yield this.messageSender.sendMessage(outboundMessage);
        });
    }
    /**
     * This method is used to send Presentation of proof
     * @param proofRequestMessage
     */
    sendPresentation(connection, proofRequestMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.credentialService.getCredentialsForProofReq(proofRequestMessage);
            console.log("Credentials for proof:" + JSON.stringify(credentials));
            const presentation = yield this.proofService.createPresentation(proofRequestMessage, credentials, this.ledgerService);
            console.log("Prrof req:" + JSON.stringify(presentation));
            const outboundMessage = helpers_1.createOutboundMessage(connection, presentation);
            yield this.messageSender.sendMessage(outboundMessage);
        });
    }
    verifyPresentation(connection, proofRequestMessage, presentProofMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.credentialService.getCredentialsForProofReq(proofRequestMessage);
            console.log("Credentials for proof:" + JSON.stringify(credentials));
            const result = yield this.proofService.verifyPresentation(proofRequestMessage, presentProofMessage, credentials, this.ledgerService);
            console.log("PROOF MODULE:Result:" + result);
            // console.log("Prrof req:" + JSON.stringify(presentation));
            // const outboundMessage = createOutboundMessage(connection, presentation);
            // await this.messageSender.sendMessage(outboundMessage);
        });
    }
    proverCreateMasterSecret(masterSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.proofService.proverCreateMasterSecret(masterSecret);
        });
    }
    getProofs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.proofService.getAll();
        });
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.proofService.find(id);
        });
    }
}
exports.ProofsModule = ProofsModule;
