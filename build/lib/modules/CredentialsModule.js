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
exports.CredentialsModule = void 0;
const helpers_1 = require("../protocols/helpers");
const logger_1 = __importDefault(require("../logger"));
const CredentialOfferMessage_1 = require("../protocols/credentials/messages/CredentialOfferMessage");
const JsonEncoder_1 = require("../utils/JsonEncoder");
const JsonTransformer_1 = require("../utils/JsonTransformer");
class CredentialsModule {
    constructor(connectionService, credentialService, ledgerService, messageSender) {
        this.connectionService = connectionService;
        this.credentialService = credentialService;
        this.ledgerService = ledgerService;
        this.messageSender = messageSender;
    }
    issueCredential(connection, credentialTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentialOfferMessage = yield this.credentialService.createOffer(connection, credentialTemplate);
            const outboundMessage = helpers_1.createOutboundMessage(connection, credentialOfferMessage);
            yield this.messageSender.sendMessage(outboundMessage);
        });
    }
    acceptCredential(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.log('acceptCredential credential', credential);
            // FIXME: credential.offer is already CredentialOfferMessage type
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const offer = JsonTransformer_1.JsonTransformer.fromJSON(credential.offer, CredentialOfferMessage_1.CredentialOfferMessage);
            const [offerAttachment] = offer.attachments;
            if (!offerAttachment.data.base64) {
                throw new Error('Missing required base64 encoded attachment data');
            }
            const credOffer = JsonEncoder_1.JsonEncoder.fromBase64(offerAttachment.data.base64);
            const credentialDefinition = yield this.ledgerService.getCredentialDefinition(credOffer.cred_def_id);
            const connection = yield this.connectionService.find(credential.connectionId);
            if (!connection) {
                throw new Error(`There is no connection with ID ${credential.connectionId}`);
            }
            const credentialRequestMessage = yield this.credentialService.createRequest(connection, credential, credentialDefinition);
            const outboundMessage = helpers_1.createOutboundMessage(connection, credentialRequestMessage);
            yield this.messageSender.sendMessage(outboundMessage);
        });
    }
    getCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.credentialService.getAll();
        });
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.credentialService.find(id);
        });
    }
}
exports.CredentialsModule = CredentialsModule;
