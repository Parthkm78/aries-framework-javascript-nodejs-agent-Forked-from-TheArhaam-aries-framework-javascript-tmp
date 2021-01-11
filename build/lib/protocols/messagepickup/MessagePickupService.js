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
exports.MessagePickupService = void 0;
const helpers_1 = require("../helpers");
const BatchPickupMessage_1 = require("./BatchPickupMessage");
const BatchMessage_1 = require("./BatchMessage");
class MessagePickupService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    batchPickup(inboundConnection) {
        return __awaiter(this, void 0, void 0, function* () {
            const batchPickupMessage = new BatchPickupMessage_1.BatchPickupMessage({
                batchSize: 10,
            });
            return helpers_1.createOutboundMessage(inboundConnection.connection, batchPickupMessage);
        });
    }
    // TODO: add support for batchSize property
    batch(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.messageRepository) {
                throw new Error('There is no message repository.');
            }
            if (!connection.theirKey) {
                throw new Error('Trying to find messages to connection without theirKey!');
            }
            const messages = this.messageRepository.findByVerkey(connection.theirKey);
            // TODO: each message should be stored with an id. to be able to conform to the id property
            // of batch message
            const batchMessages = messages.map(msg => new BatchMessage_1.BatchMessageMessage({
                message: msg,
            }));
            const batchMessage = new BatchMessage_1.BatchMessage({
                messages: batchMessages,
            });
            yield this.messageRepository.deleteAllByVerkey(connection.theirKey); // TODO Maybe, don't delete, but just marked them as read
            return helpers_1.createOutboundMessage(connection, batchMessage);
        });
    }
}
exports.MessagePickupService = MessagePickupService;
