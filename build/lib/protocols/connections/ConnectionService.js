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
exports.EventType = exports.ConnectionService = void 0;
const events_1 = require("events");
const class_validator_1 = require("class-validator");
const helpers_1 = require("../helpers");
const ConnectionState_1 = require("./domain/ConnectionState");
const DidDoc_1 = require("./domain/DidDoc");
const ConnectionRecord_1 = require("../../storage/ConnectionRecord");
const ConnectionInvitationMessage_1 = require("./ConnectionInvitationMessage");
const ConnectionRequestMessage_1 = require("./ConnectionRequestMessage");
const ConnectionResponseMessage_1 = require("./ConnectionResponseMessage");
const SignatureDecoratorUtils_1 = require("../../decorators/signature/SignatureDecoratorUtils");
const Connection_1 = require("./domain/Connection");
const ConnectionRole_1 = require("./domain/ConnectionRole");
const TrustPingMessage_1 = require("../trustping/TrustPingMessage");
const JsonTransformer_1 = require("../../utils/JsonTransformer");
var EventType;
(function (EventType) {
    EventType["StateChanged"] = "stateChanged";
})(EventType || (EventType = {}));
exports.EventType = EventType;
class ConnectionService extends events_1.EventEmitter {
    constructor(wallet, config, connectionRepository) {
        super();
        this.wallet = wallet;
        this.config = config;
        this.connectionRepository = connectionRepository;
    }
    /**
     * Create a new connection record containing a connection invitation message
     *
     * @param config config for creation of connection and invitation
     * @returns new connection record
     */
    createConnectionWithInvitation(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: public did, multi use
            const connectionRecord = yield this.createConnection({
                role: ConnectionRole_1.ConnectionRole.Inviter,
                state: ConnectionState_1.ConnectionState.Invited,
                alias: config === null || config === void 0 ? void 0 : config.alias,
                autoAcceptConnection: config === null || config === void 0 ? void 0 : config.autoAcceptConnection,
            });
            const { didDoc } = connectionRecord;
            const invitation = new ConnectionInvitationMessage_1.ConnectionInvitationMessage({
                label: this.config.label,
                recipientKeys: didDoc.service[0].recipientKeys,
                serviceEndpoint: didDoc.service[0].serviceEndpoint,
                routingKeys: didDoc.service[0].routingKeys,
            });
            connectionRecord.invitation = invitation;
            this.connectionRepository.update(connectionRecord);
            return connectionRecord;
        });
    }
    /**
     * Process a received invitation message. This will not accept the invitation
     * or send an invitation request message. It will only create a connection record
     * with all the information about the invitation stored. Use {@link ConnectionService#createRequest}
     * after calling this function to create a connection request.
     *
     * @param invitation the invitation message to process
     * @returns new connection record.
     */
    processInvitation(invitation, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionRecord = yield this.createConnection({
                role: ConnectionRole_1.ConnectionRole.Invitee,
                state: ConnectionState_1.ConnectionState.Invited,
                alias: config === null || config === void 0 ? void 0 : config.alias,
                autoAcceptConnection: config === null || config === void 0 ? void 0 : config.autoAcceptConnection,
                invitation,
                tags: {
                    invitationKey: invitation.recipientKeys && invitation.recipientKeys[0],
                },
            });
            return connectionRecord;
        });
    }
    /**
     * Create a connectino request message for the connection with the specified connection id.
     *
     * @param connectionId the id of the connection for which to create a connection request
     * @returns outbound message contaning connection request
     */
    createRequest(connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionRecord = yield this.connectionRepository.find(connectionId);
            // TODO: should we also check for role? In theory we can only send request if we are the invitee
            if (connectionRecord.state !== ConnectionState_1.ConnectionState.Invited) {
                throw new Error('Connection must be in Invited state to send connection request message');
            }
            const connectionRequest = new ConnectionRequestMessage_1.ConnectionRequestMessage({
                label: this.config.label,
                did: connectionRecord.did,
                didDoc: connectionRecord.didDoc,
            });
            yield this.updateState(connectionRecord, ConnectionState_1.ConnectionState.Requested);
            // TODO: remove invitation from this call. Will do when replacing outbound message
            return helpers_1.createOutboundMessage(connectionRecord, connectionRequest, connectionRecord.invitation);
        });
    }
    /**
     * Process a received connection request message. This will not accept the connection request
     * or send a connection response message. It will only update the existing connection record
     * with all the new information from the connection request message. Use {@link ConnectionService#createResponse}
     * after calling this function to create a connection respone.
     *
     * @param messageContext the message context containing a connetion request message
     * @returns updated connection record
     */
    processRequest(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message, connection: connectionRecord, recipientVerkey } = messageContext;
            if (!connectionRecord) {
                throw new Error(`Connection for verkey ${recipientVerkey} not found!`);
            }
            // TODO: validate using class-validator
            if (!message.connection) {
                throw new Error('Invalid message');
            }
            connectionRecord.theirDid = message.connection.did;
            connectionRecord.theirDidDoc = message.connection.didDoc;
            if (!connectionRecord.theirKey) {
                throw new Error(`Connection with id ${connectionRecord.id} has no recipient keys.`);
            }
            connectionRecord.tags = Object.assign(Object.assign({}, connectionRecord.tags), { theirKey: connectionRecord.theirKey, threadId: message.id });
            yield this.updateState(connectionRecord, ConnectionState_1.ConnectionState.Requested);
            return connectionRecord;
        });
    }
    /**
     * Create a connection response message for the connection with the specified connection id.
     *
     * @param connectionId the id of the connection for which to create a connection response
     * @returns outbound message contaning connection response
     */
    createResponse(connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionRecord = yield this.connectionRepository.find(connectionId);
            // TODO: should we also check for role? In theory we can only send response if we are the inviter
            if (connectionRecord.state !== ConnectionState_1.ConnectionState.Requested) {
                throw new Error('Connection must be in Requested state to send connection response message');
            }
            const connection = new Connection_1.Connection({
                did: connectionRecord.did,
                didDoc: connectionRecord.didDoc,
            });
            const connectionJson = JsonTransformer_1.JsonTransformer.toJSON(connection);
            const connectionResponse = new ConnectionResponseMessage_1.ConnectionResponseMessage({
                threadId: connectionRecord.tags.threadId,
                connectionSig: yield SignatureDecoratorUtils_1.signData(connectionJson, this.wallet, connectionRecord.verkey),
            });
            yield this.updateState(connectionRecord, ConnectionState_1.ConnectionState.Responded);
            return helpers_1.createOutboundMessage(connectionRecord, connectionResponse);
        });
    }
    /**
     * Process a received connection response message. This will not accept the connection request
     * or send a connection acknowledgement message. It will only update the existing connection record
     * with all the new information from the connection response message. Use {@link ConnectionService#createTrustPing}
     * after calling this function to create a trust ping message.
     *
     * @param messageContext the message context containing a connetion response message
     * @returns updated connection record
     */
    processResponse(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message, connection: connectionRecord, recipientVerkey } = messageContext;
            if (!connectionRecord) {
                throw new Error(`Connection for verkey ${recipientVerkey} not found!`);
            }
            const connectionJson = yield SignatureDecoratorUtils_1.unpackAndVerifySignatureDecorator(message.connectionSig, this.wallet);
            const connection = JsonTransformer_1.JsonTransformer.fromJSON(connectionJson, Connection_1.Connection);
            yield class_validator_1.validateOrReject(connection);
            // Per the Connection RFC we must check if the key used to sign the connection~sig is the same key
            // as the recipient key(s) in the connection invitation message
            const signerVerkey = message.connectionSig.signer;
            const invitationKey = connectionRecord.tags.invitationKey;
            if (signerVerkey !== invitationKey) {
                throw new Error('Connection in connection response is not signed with same key as recipient key in invitation');
            }
            connectionRecord.theirDid = connection.did;
            connectionRecord.theirDidDoc = connection.didDoc;
            if (!connectionRecord.theirKey) {
                throw new Error(`Connection with id ${connectionRecord.id} has no recipient keys.`);
            }
            connectionRecord.tags = Object.assign(Object.assign({}, connectionRecord.tags), { theirKey: connectionRecord.theirKey, threadId: message.getThreadId() });
            yield this.updateState(connectionRecord, ConnectionState_1.ConnectionState.Responded);
            return connectionRecord;
        });
    }
    /**
     * Create a trust ping message for the connection with the specified connection id.
     *
     * @param connectionId the id of the connection for which to create a trust ping message
     * @returns outbound message contaning trust ping message
     */
    createTrustPing(connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionRecord = yield this.connectionRepository.find(connectionId);
            if (connectionRecord.state !== ConnectionState_1.ConnectionState.Responded && connectionRecord.state !== ConnectionState_1.ConnectionState.Complete) {
                throw new Error('Connection must be in Responded or Complete state to send ack message');
            }
            // TODO:
            //  - create ack message
            //  - allow for options
            //  - maybe this shouldn't be in the connection service?
            const response = new TrustPingMessage_1.TrustPingMessage();
            yield this.updateState(connectionRecord, ConnectionState_1.ConnectionState.Complete);
            return helpers_1.createOutboundMessage(connectionRecord, response);
        });
    }
    /**
     * Process a received ack message. This will update the state of the connection
     * to Completed if this is not already the case.
     *
     * @param messageContext the message context containing an ack message
     * @returns updated connection record
     */
    processAck(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = messageContext.connection;
            if (!connection) {
                throw new Error(`Connection for verkey ${messageContext.recipientVerkey} not found!`);
            }
            // TODO: This is better addressed in a middleware of some kind because
            // any message can transition the state to complete, not just an ack or trust ping
            if (connection.state === ConnectionState_1.ConnectionState.Responded && connection.role === ConnectionRole_1.ConnectionRole.Inviter) {
                yield this.updateState(connection, ConnectionState_1.ConnectionState.Complete);
            }
            return connection;
        });
    }
    updateState(connectionRecord, newState) {
        return __awaiter(this, void 0, void 0, function* () {
            const prevState = connectionRecord.state;
            connectionRecord.state = newState;
            yield this.connectionRepository.update(connectionRecord);
            const event = {
                connection: connectionRecord,
                prevState,
            };
            this.emit(EventType.StateChanged, event);
        });
    }
    createConnection(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [did, verkey] = yield this.wallet.createDid();
            const publicKey = new DidDoc_1.PublicKey(`${did}#1`, DidDoc_1.PublicKeyType.ED25519_SIG_2018, did, verkey);
            const service = new DidDoc_1.Service(`${did};indy`, this.config.getEndpoint(), [verkey], this.config.getRoutingKeys(), 0, 'IndyAgent');
            const auth = new DidDoc_1.Authentication(publicKey);
            const didDoc = new DidDoc_1.DidDoc(did, [auth], [publicKey], [service]);
            const connectionRecord = new ConnectionRecord_1.ConnectionRecord({
                did,
                didDoc,
                verkey,
                state: options.state,
                role: options.role,
                tags: Object.assign({ verkey }, options.tags),
                invitation: options.invitation,
                alias: options.alias,
                autoAcceptConnection: options.autoAcceptConnection,
            });
            yield this.connectionRepository.save(connectionRecord);
            return connectionRecord;
        });
    }
    getConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connectionRepository.findAll();
        });
    }
    find(connectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield this.connectionRepository.find(connectionId);
                return connection;
            }
            catch (_a) {
                // connection not found.
                return null;
            }
        });
    }
    findByVerkey(verkey) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionRecords = yield this.connectionRepository.findByQuery({ verkey });
            if (connectionRecords.length > 1) {
                throw new Error(`There is more than one connection for given verkey ${verkey}`);
            }
            if (connectionRecords.length < 1) {
                return null;
            }
            return connectionRecords[0];
        });
    }
    findByTheirKey(verkey) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionRecords = yield this.connectionRepository.findByQuery({ theirKey: verkey });
            if (connectionRecords.length > 1) {
                throw new Error(`There is more than one connection for given verkey ${verkey}`);
            }
            if (connectionRecords.length < 1) {
                return null;
            }
            return connectionRecords[0];
        });
    }
}
exports.ConnectionService = ConnectionService;
