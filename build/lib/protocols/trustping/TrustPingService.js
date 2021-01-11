"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustPingService = void 0;
const helpers_1 = require("../helpers");
const TrustPingResponseMessage_1 = require("./TrustPingResponseMessage");
/**
 * @todo use connection from message context
 */
class TrustPingService {
    processPing({ message }, connection) {
        if (message.responseRequested) {
            const response = new TrustPingResponseMessage_1.TrustPingResponseMessage({
                threadId: message.id,
            });
            return helpers_1.createOutboundMessage(connection, response);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    processPingResponse(inboundMessage) {
        // TODO: handle ping response message
    }
}
exports.TrustPingService = TrustPingService;
