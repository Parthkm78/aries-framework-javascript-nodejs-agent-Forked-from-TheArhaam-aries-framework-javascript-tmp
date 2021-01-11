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
exports.MessageReceiver = void 0;
const logger_1 = __importDefault(require("../logger"));
const messages_1 = require("../protocols/routing/messages");
const InboundMessageContext_1 = require("./models/InboundMessageContext");
const JsonTransformer_1 = require("../utils/JsonTransformer");
class MessageReceiver {
    constructor(config, envelopeService, connectionService, dispatcher) {
        this.config = config;
        this.envelopeService = envelopeService;
        this.connectionService = connectionService;
        this.dispatcher = dispatcher;
    }
    /**
     * Receive and handle an inbound DIDComm message. It will unpack the message, transform it
     * to it's corresponding message class and finaly dispatch it to the dispatcher.
     *
     * @param inboundPackedMessage the message to receive and handle
     */
    receiveMessage(inboundPackedMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof inboundPackedMessage !== 'object' || inboundPackedMessage == null) {
                throw new Error('Invalid message received. Message should be object');
            }
            logger_1.default.logJson(`Agent ${this.config.label} received message:`, inboundPackedMessage);
            const unpackedMessage = yield this.unpackMessage(inboundPackedMessage);
            logger_1.default.logJson('inboundMessage', unpackedMessage);
            // TODO move `message` declaration down right above `messageContext` creation
            const message = yield this.transformMessage(unpackedMessage);
            const senderKey = unpackedMessage.sender_verkey;
            let connection = undefined;
            if (senderKey && unpackedMessage.recipient_verkey) {
                // TODO: only attach if theirKey is present. Otherwise a connection that may not be complete, validated or correct will
                // be attached to the message context. See #76
                connection = (yield this.connectionService.findByVerkey(unpackedMessage.recipient_verkey)) || undefined;
                // We check whether the sender key is the same as the key we have stored in the connection
                // otherwise everyone could send messages to our key and we would just accept
                // it as if it was send by the key of the connection.
                if (connection && connection.theirKey != null && connection.theirKey != senderKey) {
                    throw new Error(`Inbound message 'sender_key' ${senderKey} is different from connection.theirKey ${connection.theirKey}`);
                }
            }
            const messageContext = new InboundMessageContext_1.InboundMessageContext(message, {
                connection,
                senderVerkey: senderKey,
                recipientVerkey: unpackedMessage.recipient_verkey,
            });
            return yield this.dispatcher.dispatch(messageContext);
        });
    }
    /**
     * Unpack a message using the envelope service. Will perform extra unpacking steps for forward messages.
     * If message is not packed, it will be returned as is, but in the unpacked message structure
     *
     * @param packedMessage the received, probably packed, message to unpack
     */
    unpackMessage(packedMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the inbound message has no @type field we assume
            // the message is packed and must be unpacked first
            if (!this.isUnpackedMessage(packedMessage)) {
                let unpackedMessage;
                try {
                    // TODO: handle when the unpacking fails. At the moment this will throw a cryptic
                    // indy-sdk error. Eventually we should create a problem report message
                    unpackedMessage = yield this.envelopeService.unpackMessage(packedMessage);
                }
                catch (error) {
                    logger_1.default.log('error while unpacking message', error);
                    throw error;
                }
                // if the message is of type forward we should check whether the
                //  - forward message is intended for us (so unpack inner `msg` and pass that to dispatcher)
                //  - or that the message should be forwarded (pass unpacked forward message with packed `msg` to dispatcher)
                if (unpackedMessage.message['@type'] === messages_1.MessageType.ForwardMessage) {
                    logger_1.default.logJson('Forwarded message', unpackedMessage);
                    try {
                        unpackedMessage = yield this.envelopeService.unpackMessage(unpackedMessage.message.msg);
                    }
                    catch (_a) {
                        // To check whether the `to` field is a key belonging to us could be done in two ways.
                        // We now just try to unpack, if it errors it means we don't have the key to unpack the message
                        // if we can unpack the message we certainly are the owner of the key in the to field.
                        // Another approach is to first check whether the key belongs to us and only unpack if so.
                        // I think this approach is better, but for now the current approach is easier
                        // It is thus okay to silently ignore this error
                    }
                }
                return unpackedMessage;
            }
            // If the message does have an @type field we assume
            // the message is already unpacked an use it directly
            else {
                const unpackedMessage = { message: packedMessage };
                return unpackedMessage;
            }
        });
    }
    isUnpackedMessage(message) {
        return '@type' in message;
    }
    /**
     * Transform an unpacked DIDComm message into it's corresponding message class. Will look at all message types in the registered handlers.
     *
     * @param unpackedMessage the unpacked message for which to transform the message in to a class instance
     */
    transformMessage(unpackedMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageType = unpackedMessage.message['@type'];
            const MessageClass = this.dispatcher.getMessageClassForType(messageType);
            if (!MessageClass) {
                throw new Error(`No handler for message type "${messageType}" found`);
            }
            // Cast the plain JSON object to specific instance of Message extended from AgentMessage
            const message = JsonTransformer_1.JsonTransformer.fromJSON(unpackedMessage.message, MessageClass);
            return message;
        });
    }
}
exports.MessageReceiver = MessageReceiver;
