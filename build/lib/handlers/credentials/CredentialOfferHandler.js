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
exports.CredentialOfferHandler = void 0;
const CredentialOfferMessage_1 = require("../../protocols/credentials/messages/CredentialOfferMessage");
class CredentialOfferHandler {
    constructor(credentialService) {
        this.supportedMessages = [CredentialOfferMessage_1.CredentialOfferMessage];
        this.credentialService = credentialService;
    }
    handle(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.credentialService.processOffer(messageContext);
        });
    }
}
exports.CredentialOfferHandler = CredentialOfferHandler;
