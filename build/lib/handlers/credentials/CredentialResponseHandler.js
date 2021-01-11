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
exports.CredentialResponseHandler = void 0;
const CredentialResponseMessage_1 = require("../../protocols/credentials/messages/CredentialResponseMessage");
const JsonEncoder_1 = require("../../utils/JsonEncoder");
const helpers_1 = require("../../protocols/helpers");
class CredentialResponseHandler {
    constructor(credentialService, ledgerService) {
        this.supportedMessages = [CredentialResponseMessage_1.CredentialResponseMessage];
        this.credentialService = credentialService;
        this.ledgerService = ledgerService;
    }
    handle(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const [responseAttachment] = messageContext.message.attachments;
            if (!responseAttachment.data.base64) {
                throw new Error('Missing required base64 encoded attachment data');
            }
            const cred = JsonEncoder_1.JsonEncoder.fromBase64(responseAttachment.data.base64);
            const credentialDefinition = yield this.ledgerService.getCredentialDefinition(cred.cred_def_id);
            const credential = yield this.credentialService.processResponse(messageContext, credentialDefinition);
            if (messageContext.message.requiresAck()) {
                if (!messageContext.connection) {
                    throw new Error('There is no connection in message context.');
                }
                const message = yield this.credentialService.createAck(credential.id);
                return helpers_1.createOutboundMessage(messageContext.connection, message);
            }
        });
    }
}
exports.CredentialResponseHandler = CredentialResponseHandler;
