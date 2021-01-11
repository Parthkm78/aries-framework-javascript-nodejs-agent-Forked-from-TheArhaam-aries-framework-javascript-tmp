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
exports.MessageSender = void 0;
const TransportDecorator_1 = require("../decorators/transport/TransportDecorator");
const InboundMessageContext_1 = require("./models/InboundMessageContext");
const JsonTransformer_1 = require("../utils/JsonTransformer");
class MessageSender {
    constructor(envelopeService, outboundTransporter) {
        this.envelopeService = envelopeService;
        this.outboundTransporter = outboundTransporter;
    }
    packMessage(outboundMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.envelopeService.packMessage(outboundMessage);
        });
    }
    sendMessage(outboundMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const outboundPackage = yield this.envelopeService.packMessage(outboundMessage);
            yield this.outboundTransporter.sendMessage(outboundPackage, false);
        });
    }
    sendAndReceiveMessage(outboundMessage, ReceivedMessageClass) {
        return __awaiter(this, void 0, void 0, function* () {
            outboundMessage.payload.setReturnRouting(TransportDecorator_1.ReturnRouteTypes.all);
            const outboundPackage = yield this.envelopeService.packMessage(outboundMessage);
            const inboundPackedMessage = yield this.outboundTransporter.sendMessage(outboundPackage, true);
            const inboundUnpackedMessage = yield this.envelopeService.unpackMessage(inboundPackedMessage);
            const message = JsonTransformer_1.JsonTransformer.fromJSON(inboundUnpackedMessage.message, ReceivedMessageClass);
            const messageContext = new InboundMessageContext_1.InboundMessageContext(message, {
                connection: outboundMessage.connection,
                recipientVerkey: inboundUnpackedMessage.recipient_verkey,
                senderVerkey: inboundUnpackedMessage.sender_verkey,
            });
            return messageContext;
        });
    }
}
exports.MessageSender = MessageSender;
