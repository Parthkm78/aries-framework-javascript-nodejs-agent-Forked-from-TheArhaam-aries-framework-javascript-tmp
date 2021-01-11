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
exports.Dispatcher = void 0;
class Dispatcher {
    constructor(messageSender) {
        this.handlers = [];
        this.messageSender = messageSender;
    }
    registerHandler(handler) {
        this.handlers.push(handler);
    }
    dispatch(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = messageContext.message;
            const handler = this.getHandlerForType(message.type);
            if (!handler) {
                throw new Error(`No handler for message type "${message.type}" found`);
            }
            const outboundMessage = yield handler.handle(messageContext);
            if (outboundMessage) {
                const threadId = outboundMessage.payload.getThreadId();
                // check for return routing, with thread id
                if (message.hasReturnRouting(threadId)) {
                    return yield this.messageSender.packMessage(outboundMessage);
                }
                yield this.messageSender.sendMessage(outboundMessage);
            }
            return outboundMessage || undefined;
        });
    }
    getHandlerForType(messageType) {
        for (const handler of this.handlers) {
            for (const MessageClass of handler.supportedMessages) {
                if (MessageClass.type === messageType)
                    return handler;
            }
        }
    }
    getMessageClassForType(messageType) {
        for (const handler of this.handlers) {
            for (const MessageClass of handler.supportedMessages) {
                if (MessageClass.type === messageType)
                    return MessageClass;
            }
        }
    }
}
exports.Dispatcher = Dispatcher;
