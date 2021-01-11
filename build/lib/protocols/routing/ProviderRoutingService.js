"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRoutingService = void 0;
const helpers_1 = require("../helpers");
const KeylistUpdateMessage_1 = require("../coordinatemediation/KeylistUpdateMessage");
class ProviderRoutingService {
    constructor() {
        this.routingTable = {};
    }
    /**
     * @todo use connection from message context
     */
    updateRoutes(messageContext, connection) {
        const { message } = messageContext;
        for (const update of message.updates) {
            switch (update.action) {
                case KeylistUpdateMessage_1.KeylistUpdateAction.add:
                    this.saveRoute(update.recipientKey, connection);
                    break;
                case KeylistUpdateMessage_1.KeylistUpdateAction.remove:
                    this.removeRoute(update.recipientKey, connection);
                    break;
            }
        }
    }
    forward(messageContext) {
        const { message, recipientVerkey } = messageContext;
        // TODO: update to class-validator validation
        if (!message.to) {
            throw new Error('Invalid Message: Missing required attribute "to"');
        }
        const connection = this.findRecipient(message.to);
        if (!connection) {
            throw new Error(`Connection for verkey ${recipientVerkey} not found!`);
        }
        if (!connection.theirKey) {
            throw new Error(`Connection with verkey ${connection.verkey} has no recipient keys.`);
        }
        return helpers_1.createOutboundMessage(connection, message);
    }
    getRoutes() {
        return this.routingTable;
    }
    findRecipient(recipientKey) {
        const connection = this.routingTable[recipientKey];
        // TODO: function with find in name should now throw error when not found.
        // It should either be called getRecipient and throw error
        // or findRecipient and return null
        if (!connection) {
            throw new Error(`Routing entry for recipientKey ${recipientKey} does not exists.`);
        }
        return connection;
    }
    saveRoute(recipientKey, connection) {
        if (this.routingTable[recipientKey]) {
            throw new Error(`Routing entry for recipientKey ${recipientKey} already exists.`);
        }
        this.routingTable[recipientKey] = connection;
    }
    removeRoute(recipientKey, connection) {
        const storedConnection = this.routingTable[recipientKey];
        if (!storedConnection) {
            throw new Error('Cannot remove non-existing routing entry');
        }
        if (storedConnection.id !== connection.id) {
            throw new Error('Cannot remove routing entry for another connection');
        }
        delete this.routingTable[recipientKey];
    }
}
exports.ProviderRoutingService = ProviderRoutingService;
