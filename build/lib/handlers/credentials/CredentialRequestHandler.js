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
exports.CredentialRequestHandler = void 0;
const CredentialRequestMessage_1 = require("../../protocols/credentials/messages/CredentialRequestMessage");
const helpers_1 = require("../../protocols/helpers");
class CredentialRequestHandler {
    constructor(credentialService) {
        this.supportedMessages = [CredentialRequestMessage_1.CredentialRequestMessage];
        this.credentialService = credentialService;
    }
    handle(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const credential = yield this.credentialService.processRequest(messageContext);
            const message = yield this.credentialService.createResponse(credential.id);
            if (!messageContext.connection) {
                throw new Error('There is no connection in message context.');
            }
            return helpers_1.createOutboundMessage(messageContext.connection, message);
        });
    }
}
exports.CredentialRequestHandler = CredentialRequestHandler;
