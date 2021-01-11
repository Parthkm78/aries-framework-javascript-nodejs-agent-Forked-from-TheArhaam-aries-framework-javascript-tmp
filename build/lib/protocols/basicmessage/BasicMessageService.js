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
exports.EventType = exports.BasicMessageService = void 0;
const events_1 = require("events");
const helpers_1 = require("../helpers");
const BasicMessageRecord_1 = require("../../storage/BasicMessageRecord");
const BasicMessage_1 = require("./BasicMessage");
var EventType;
(function (EventType) {
    EventType["MessageReceived"] = "messageReceived";
})(EventType || (EventType = {}));
exports.EventType = EventType;
class BasicMessageService extends events_1.EventEmitter {
    constructor(basicMessageRepository) {
        super();
        this.basicMessageRepository = basicMessageRepository;
    }
    send(message, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const basicMessage = new BasicMessage_1.BasicMessage({
                content: message,
            });
            const basicMessageRecord = new BasicMessageRecord_1.BasicMessageRecord({
                id: basicMessage.id,
                sentTime: basicMessage.sentTime.toISOString(),
                content: basicMessage.content,
                tags: { from: connection.did || '', to: connection.theirDid || '' },
            });
            yield this.basicMessageRepository.save(basicMessageRecord);
            return helpers_1.createOutboundMessage(connection, basicMessage);
        });
    }
    /**
     * @todo use connection from message context
     */
    save({ message }, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const basicMessageRecord = new BasicMessageRecord_1.BasicMessageRecord({
                id: message.id,
                sentTime: message.sentTime.toISOString(),
                content: message.content,
                tags: { from: connection.theirDid || '', to: connection.did || '' },
            });
            yield this.basicMessageRepository.save(basicMessageRecord);
            this.emit(EventType.MessageReceived, { verkey: connection.verkey, message });
        });
    }
    findAllByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.basicMessageRepository.findByQuery(query);
        });
    }
}
exports.BasicMessageService = BasicMessageService;
