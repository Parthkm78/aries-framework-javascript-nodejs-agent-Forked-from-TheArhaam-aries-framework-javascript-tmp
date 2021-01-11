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
exports.ConnectionsModule = void 0;
const ConnectionState_1 = require("../protocols/connections/domain/ConnectionState");
const ConnectionInvitationMessage_1 = require("../protocols/connections/ConnectionInvitationMessage");
const __1 = require("..");
const JsonTransformer_1 = require("../utils/JsonTransformer");
class ConnectionsModule {
    constructor(agentConfig, connectionService, consumerRoutingService, messageSender) {
        this.agentConfig = agentConfig;
        this.connectionService = connectionService;
        this.consumerRoutingService = consumerRoutingService;
        this.messageSender = messageSender;
    }
    createConnection(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.connectionService.createConnectionWithInvitation({
                autoAcceptConnection: config === null || config === void 0 ? void 0 : config.autoAcceptConnection,
                alias: config === null || config === void 0 ? void 0 : config.alias,
            });
            if (!connection.invitation) {
                throw new Error('Connection has no invitation assigned.');
            }
            // If agent has inbound connection, which means it's using a mediator, we need to create a route for newly created
            // connection verkey at mediator.
            if (this.agentConfig.inboundConnection) {
                this.consumerRoutingService.createRoute(connection.verkey);
            }
            return connection;
        });
    }
    /**
     * Receive connection invitation and create connection. If auto accepting is enabled
     * via either the config passed in the function or the global agent config, a connection
     * request message will be send.
     *
     * @param invitationJson json object containing the invitation to receive
     * @param config config for handling of invitation
     * @returns new connection record
     */
    receiveInvitation(invitationJson, config) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const invitationMessage = JsonTransformer_1.JsonTransformer.fromJSON(invitationJson, ConnectionInvitationMessage_1.ConnectionInvitationMessage);
            let connection = yield this.connectionService.processInvitation(invitationMessage, {
                autoAcceptConnection: config === null || config === void 0 ? void 0 : config.autoAcceptConnection,
                alias: config === null || config === void 0 ? void 0 : config.alias,
            });
            // if auto accept is enabled (either on the record or the global agent config)
            // we directly send a connection request
            if ((_a = connection.autoAcceptConnection) !== null && _a !== void 0 ? _a : this.agentConfig.autoAcceptConnections) {
                connection = yield this.acceptInvitation(connection.id);
            }
            return connection;
        });
    }
    /**
     * Accept a connection invitation (by sending a connection request message) for the connection with the specified connection id.
     * This is not needed when auto accepting of connections is enabled.
     *
     * @param connectionId the id of the connection for which to accept the invitation
     * @returns connection record
     */
    acceptInvitation(connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const outboundMessage = yield this.connectionService.createRequest(connectionId);
            // If agent has inbound connection, which means it's using a mediator,
            // we need to create a route for newly created connection verkey at mediator.
            if (this.agentConfig.inboundConnection) {
                yield this.consumerRoutingService.createRoute(outboundMessage.connection.verkey);
            }
            yield this.messageSender.sendMessage(outboundMessage);
            return outboundMessage.connection;
        });
    }
    /**
     * Accept a connection request (by sending a connection response message) for the connection with the specified connection id.
     * This is not needed when auto accepting of connection is enabled.
     *
     * @param connectionId the id of the connection for which to accept the request
     * @returns connection record
     */
    acceptRequest(connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const outboundMessage = yield this.connectionService.createResponse(connectionId);
            yield this.messageSender.sendMessage(outboundMessage);
            return outboundMessage.connection;
        });
    }
    /**
     * Accept a connection response (by sending a trust ping message) for the connection with the specified connection id.
     * This is not needed when auto accepting of connection is enabled.
     *
     * @param connectionId the id of the connection for which to accept the response
     * @returns connection record
     */
    acceptResponse(connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const outboundMessage = yield this.connectionService.createTrustPing(connectionId);
            yield this.messageSender.sendMessage(outboundMessage);
            return outboundMessage.connection;
        });
    }
    returnWhenIsConnected(connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = (connection) => {
                return connection.id === connectionId && connection.state === ConnectionState_1.ConnectionState.Complete;
            };
            const connection = yield this.connectionService.find(connectionId);
            if (connection && isConnected(connection))
                return connection;
            return new Promise(resolve => {
                const listener = ({ connection }) => {
                    if (isConnected(connection)) {
                        this.events().off(__1.ConnectionEventType.StateChanged, listener);
                        resolve(connection);
                    }
                };
                this.events().on(__1.ConnectionEventType.StateChanged, listener);
            });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connectionService.getConnections();
        });
    }
    find(connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connectionService.find(connectionId);
        });
    }
    findConnectionByVerkey(verkey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connectionService.findByVerkey(verkey);
        });
    }
    findConnectionByTheirKey(verkey) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connectionService.findByTheirKey(verkey);
        });
    }
    events() {
        return this.connectionService;
    }
}
exports.ConnectionsModule = ConnectionsModule;
