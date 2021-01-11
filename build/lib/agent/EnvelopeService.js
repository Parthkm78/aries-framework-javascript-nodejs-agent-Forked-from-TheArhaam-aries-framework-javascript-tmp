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
exports.EnvelopeService = void 0;
const logger_1 = __importDefault(require("../logger"));
const ForwardMessage_1 = require("../protocols/routing/ForwardMessage");
class EnvelopeService {
    constructor(wallet) {
        this.wallet = wallet;
    }
    packMessage(outboundMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connection, routingKeys, recipientKeys, senderVk, payload, endpoint } = outboundMessage;
            const { verkey, theirKey } = connection;
            const message = payload.toJSON();
            logger_1.default.logJson('outboundMessage', { verkey, theirKey, routingKeys, endpoint, message });
            let outboundPackedMessage = yield this.wallet.pack(message, recipientKeys, senderVk);
            if (routingKeys && routingKeys.length > 0) {
                for (const routingKey of routingKeys) {
                    const [recipientKey] = recipientKeys;
                    const forwardMessage = new ForwardMessage_1.ForwardMessage({
                        to: recipientKey,
                        message: outboundPackedMessage,
                    });
                    logger_1.default.logJson('Forward message created', forwardMessage);
                    outboundPackedMessage = yield this.wallet.pack(forwardMessage.toJSON(), [routingKey], senderVk);
                }
            }
            return { connection, payload: outboundPackedMessage, endpoint };
        });
    }
    unpackMessage(packedMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.wallet.unpack(packedMessage);
        });
    }
}
exports.EnvelopeService = EnvelopeService;
