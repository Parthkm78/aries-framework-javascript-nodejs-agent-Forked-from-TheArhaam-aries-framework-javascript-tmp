"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboundMessageContext = void 0;
class InboundMessageContext {
    constructor(message, context = {}) {
        this.message = message;
        this.recipientVerkey = context.recipientVerkey;
        if (context.connection) {
            this.connection = context.connection;
            // TODO: which senderkey should we prioritize
            // Or should we throw an error when they don't match?
            this.senderVerkey = context.connection.theirKey || context.senderVerkey || undefined;
        }
        else if (context.senderVerkey) {
            this.senderVerkey = context.senderVerkey;
        }
    }
}
exports.InboundMessageContext = InboundMessageContext;
