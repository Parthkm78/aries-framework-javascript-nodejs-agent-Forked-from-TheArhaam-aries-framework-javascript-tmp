"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOutboundMessage = void 0;
function createOutboundMessage(connection, payload, invitation) {
    if (invitation) {
        // TODO: invitation recipientKeys, routingKeys, endpoint could be missing
        // When invitation uses DID
        return {
            connection,
            endpoint: invitation.serviceEndpoint,
            payload,
            recipientKeys: invitation.recipientKeys || [],
            routingKeys: invitation.routingKeys || [],
            senderVk: connection.verkey,
        };
    }
    const { theirDidDoc } = connection;
    if (!theirDidDoc) {
        throw new Error(`DidDoc for connection with verkey ${connection.verkey} not found!`);
    }
    return {
        connection,
        endpoint: theirDidDoc.service[0].serviceEndpoint,
        payload,
        recipientKeys: theirDidDoc.service[0].recipientKeys,
        routingKeys: theirDidDoc.service[0].routingKeys,
        senderVk: connection.verkey,
    };
}
exports.createOutboundMessage = createOutboundMessage;
