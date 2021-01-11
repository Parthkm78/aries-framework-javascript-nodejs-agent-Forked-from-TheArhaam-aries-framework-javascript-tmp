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
exports.PresentProofMessageHandler = void 0;
const PresentProofMessage_1 = require("../../protocols/proof/messages/PresentProofMessage");
const JsonEncoder_1 = require("../../utils/JsonEncoder");
/**
 * The funtionalities of this class is used to handle proof request
 */
class PresentProofMessageHandler {
    constructor(proofService1) {
        this.supportedMessages = [PresentProofMessage_1.PresentProofMessage];
        this.proofService = proofService1;
    }
    /**
     * This Method is used to process incoming proof request
     * @param messageContext T
     */
    handle(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Proof Presentaion imcoming req:");
            const presentProofMessage = messageContext.message;
            const connection = messageContext.connection;
            if (!connection) {
                throw new Error('There is no connection in message context.');
            }
            const [responseAttachment] = messageContext.message.attachments;
            if (!responseAttachment.data.base64) {
                throw new Error('Missing required base64 encoded attachment data');
            }
            const [credOffer] = JsonEncoder_1.JsonEncoder.fromBase64(responseAttachment.data.base64);
            console.log(credOffer);
            //await this.proofService.processPresentation(messageContext);
        });
    }
}
exports.PresentProofMessageHandler = PresentProofMessageHandler;
