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
exports.getMockConnection = void 0;
const indy_sdk_1 = __importDefault(require("indy-sdk"));
const uuid_1 = require("uuid");
const IndyWallet_1 = require("../../wallet/IndyWallet");
const ConnectionService_1 = require("./ConnectionService");
const ConnectionRecord_1 = require("../../storage/ConnectionRecord");
const AgentConfig_1 = require("../../agent/AgentConfig");
const ConnectionState_1 = require("./domain/ConnectionState");
const ConnectionRole_1 = require("./domain/ConnectionRole");
const ConnectionInvitationMessage_1 = require("./ConnectionInvitationMessage");
const Repository_1 = require("../../storage/Repository");
const DidDoc_1 = require("./domain/DidDoc");
const Connection_1 = require("./domain/Connection");
const SignatureDecoratorUtils_1 = require("../../decorators/signature/SignatureDecoratorUtils");
const InboundMessageContext_1 = require("../../agent/models/InboundMessageContext");
const ConnectionResponseMessage_1 = require("./ConnectionResponseMessage");
const SignatureDecorator_1 = require("../../decorators/signature/SignatureDecorator");
const ConnectionRequestMessage_1 = require("./ConnectionRequestMessage");
const TrustPingMessage_1 = require("../trustping/TrustPingMessage");
const AckMessage_1 = require("./AckMessage");
const JsonTransformer_1 = require("../../utils/JsonTransformer");
jest.mock('./../../storage/Repository');
const ConnectionRepository = Repository_1.Repository;
function getMockConnection({ state = ConnectionState_1.ConnectionState.Invited, role = ConnectionRole_1.ConnectionRole.Invitee, id = 'test', did = 'test-did', verkey = 'key-1', didDoc = new DidDoc_1.DidDoc(did, [], [], [new DidDoc_1.Service(`${did};indy`, 'https://endpoint.com', [verkey], [], 0, 'IndyAgent')]), tags = {}, invitation = new ConnectionInvitationMessage_1.ConnectionInvitationMessage({
    label: 'test',
    recipientKeys: [verkey],
    serviceEndpoint: 'https:endpoint.com/msg',
}), theirDid = 'their-did', theirDidDoc = new DidDoc_1.DidDoc(theirDid, [], [], [new DidDoc_1.Service(`${did};indy`, 'https://endpoint.com', [verkey], [], 0, 'IndyAgent')]), } = {}) {
    return new ConnectionRecord_1.ConnectionRecord({
        did,
        didDoc,
        theirDid,
        theirDidDoc,
        id,
        role,
        state,
        tags,
        verkey,
        invitation,
    });
}
exports.getMockConnection = getMockConnection;
describe('ConnectionService', () => {
    const walletConfig = { id: 'test-wallet' + '-ConnectionServiceTest' };
    const walletCredentials = { key: 'key' };
    const initConfig = {
        label: 'agent label',
        host: 'http://agent.com',
        port: 8080,
        walletConfig,
        walletCredentials,
    };
    let wallet;
    let agentConfig;
    let connectionRepository;
    let connectionService;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        wallet = new IndyWallet_1.IndyWallet(walletConfig, walletCredentials, indy_sdk_1.default);
        yield wallet.init();
        agentConfig = new AgentConfig_1.AgentConfig(initConfig);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield wallet.close();
        yield wallet.delete();
    }));
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        ConnectionRepository.mockClear();
        connectionRepository = new ConnectionRepository();
        connectionService = new ConnectionService_1.ConnectionService(wallet, agentConfig, connectionRepository);
    });
    describe('createConnectionWithInvitation', () => {
        it('returns a connection record with values set', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(6);
            const connection = yield connectionService.createConnectionWithInvitation();
            expect(connection.role).toBe(ConnectionRole_1.ConnectionRole.Inviter);
            expect(connection.state).toBe(ConnectionState_1.ConnectionState.Invited);
            expect(connection.autoAcceptConnection).toBeUndefined();
            expect(connection.id).toEqual(expect.any(String));
            expect(connection.verkey).toEqual(expect.any(String));
            expect(connection.tags).toEqual(expect.objectContaining({
                verkey: connection.verkey,
            }));
        }));
        it('returns a connection record with invitation', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const connection = yield connectionService.createConnectionWithInvitation();
            expect(connection.invitation).toEqual(expect.objectContaining({
                label: initConfig.label,
                recipientKeys: [expect.any(String)],
                routingKeys: [],
                serviceEndpoint: `${initConfig.host}:${initConfig.port}/msg`,
            }));
        }));
        it('saves the connection record in the connection repository', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const saveSpy = jest.spyOn(connectionRepository, 'save');
            yield connectionService.createConnectionWithInvitation();
            expect(saveSpy).toHaveBeenCalledWith(expect.any(ConnectionRecord_1.ConnectionRecord));
        }));
        it('returns a connection record with the autoAcceptConnection parameter from the config', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(3);
            const connectionTrue = yield connectionService.createConnectionWithInvitation({ autoAcceptConnection: true });
            const connectionFalse = yield connectionService.createConnectionWithInvitation({ autoAcceptConnection: false });
            const connectionUndefined = yield connectionService.createConnectionWithInvitation();
            expect(connectionTrue.autoAcceptConnection).toBe(true);
            expect(connectionFalse.autoAcceptConnection).toBe(false);
            expect(connectionUndefined.autoAcceptConnection).toBeUndefined();
        }));
        it('returns a connection record with the alias parameter from the config', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const aliasDefined = yield connectionService.createConnectionWithInvitation({ alias: 'test-alias' });
            const aliasUndefined = yield connectionService.createConnectionWithInvitation();
            expect(aliasDefined.alias).toBe('test-alias');
            expect(aliasUndefined.alias).toBeUndefined();
        }));
    });
    describe('processInvitation', () => {
        it('returns a connection record containing the information from the connection invitation', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(9);
            const recipientKey = 'key-1';
            const invitation = new ConnectionInvitationMessage_1.ConnectionInvitationMessage({
                label: 'test label',
                recipientKeys: [recipientKey],
                serviceEndpoint: 'https://test.com/msg',
            });
            const connection = yield connectionService.processInvitation(invitation);
            const connectionAlias = yield connectionService.processInvitation(invitation, { alias: 'test-alias' });
            expect(connection.role).toBe(ConnectionRole_1.ConnectionRole.Invitee);
            expect(connection.state).toBe(ConnectionState_1.ConnectionState.Invited);
            expect(connection.autoAcceptConnection).toBeUndefined();
            expect(connection.id).toEqual(expect.any(String));
            expect(connection.verkey).toEqual(expect.any(String));
            expect(connection.tags).toEqual(expect.objectContaining({
                verkey: connection.verkey,
                invitationKey: recipientKey,
            }));
            expect(connection.invitation).toMatchObject(invitation);
            expect(connection.alias).toBeUndefined();
            expect(connectionAlias.alias).toBe('test-alias');
        }));
        it('returns a connection record with the autoAcceptConnection parameter from the config', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(3);
            const invitation = new ConnectionInvitationMessage_1.ConnectionInvitationMessage({
                did: 'did:sov:test',
                label: 'test label',
            });
            const connectionTrue = yield connectionService.processInvitation(invitation, { autoAcceptConnection: true });
            const connectionFalse = yield connectionService.processInvitation(invitation, {
                autoAcceptConnection: false,
            });
            const connectionUndefined = yield connectionService.processInvitation(invitation);
            expect(connectionTrue.autoAcceptConnection).toBe(true);
            expect(connectionFalse.autoAcceptConnection).toBe(false);
            expect(connectionUndefined.autoAcceptConnection).toBeUndefined();
        }));
        it('returns a connection record with the alias parameter from the config', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const invitation = new ConnectionInvitationMessage_1.ConnectionInvitationMessage({
                did: 'did:sov:test',
                label: 'test label',
            });
            const aliasDefined = yield connectionService.processInvitation(invitation, { alias: 'test-alias' });
            const aliasUndefined = yield connectionService.processInvitation(invitation);
            expect(aliasDefined.alias).toBe('test-alias');
            expect(aliasUndefined.alias).toBeUndefined();
        }));
    });
    describe('createRequest', () => {
        it('returns a connection request message containing the information from the connection record', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(4);
            const connection = getMockConnection();
            // make separate mockFind variable to get the correct jest mock typing
            const mockFind = connectionRepository.find;
            mockFind.mockReturnValue(Promise.resolve(connection));
            const outboundMessage = yield connectionService.createRequest('test');
            expect(outboundMessage.connection.state).toBe(ConnectionState_1.ConnectionState.Requested);
            expect(outboundMessage.payload.label).toBe(initConfig.label);
            expect(outboundMessage.payload.connection.did).toBe('test-did');
            expect(outboundMessage.payload.connection.didDoc).toEqual(connection.didDoc);
        }));
        const invalidConnectionStates = [
            ConnectionState_1.ConnectionState.Init,
            ConnectionState_1.ConnectionState.Requested,
            ConnectionState_1.ConnectionState.Responded,
            ConnectionState_1.ConnectionState.Complete,
        ];
        test.each(invalidConnectionStates)('throws an error when connection state is %s and not INVITED', state => {
            expect.assertions(1);
            // make separate mockFind variable to get the correct jest mock typing
            const mockFind = connectionRepository.find;
            mockFind.mockReturnValue(Promise.resolve(getMockConnection({ state })));
            expect(connectionService.createRequest('test')).rejects.toThrowError('Connection must be in Invited state to send connection request message');
        });
    });
    describe('processRequest', () => {
        it('returns a connection record containing the information from the connection request', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(5);
            const connectionRecord = getMockConnection({
                state: ConnectionState_1.ConnectionState.Invited,
                verkey: 'my-key',
            });
            const theirDid = 'their-did';
            const theirVerkey = 'their-verkey';
            const theirDidDoc = new DidDoc_1.DidDoc(theirDid, [], [], [new DidDoc_1.Service(`${theirDid};indy`, 'https://endpoint.com', [theirVerkey], [], 0, 'IndyAgent')]);
            const connectionRequest = new ConnectionRequestMessage_1.ConnectionRequestMessage({
                did: theirDid,
                didDoc: theirDidDoc,
                label: 'test-label',
            });
            const messageContext = new InboundMessageContext_1.InboundMessageContext(connectionRequest, {
                connection: connectionRecord,
                senderVerkey: theirVerkey,
                recipientVerkey: 'my-key',
            });
            const processedConnection = yield connectionService.processRequest(messageContext);
            expect(processedConnection.state).toBe(ConnectionState_1.ConnectionState.Requested);
            expect(processedConnection.theirDid).toBe(theirDid);
            // TODO: we should transform theirDidDoc to didDoc instance after retrieving from persistence
            expect(processedConnection.theirDidDoc).toEqual(theirDidDoc);
            expect(processedConnection.tags.theirKey).toBe(theirVerkey);
            expect(processedConnection.tags.threadId).toBe(connectionRequest.id);
        }));
        it('throws an error when the message context does not have a connection', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const connectionRequest = new ConnectionRequestMessage_1.ConnectionRequestMessage({
                did: 'did',
                label: 'test-label',
            });
            const messageContext = new InboundMessageContext_1.InboundMessageContext(connectionRequest, {
                recipientVerkey: 'test-verkey',
            });
            expect(connectionService.processRequest(messageContext)).rejects.toThrowError('Connection for verkey test-verkey not found!');
        }));
        it('throws an error when the message does not contain a connection parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const connection = getMockConnection();
            const connectionRequest = new ConnectionRequestMessage_1.ConnectionRequestMessage({
                did: 'did',
                label: 'test-label',
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            delete connectionRequest.connection;
            const messageContext = new InboundMessageContext_1.InboundMessageContext(connectionRequest, {
                connection,
                recipientVerkey: 'test-verkey',
            });
            expect(connectionService.processRequest(messageContext)).rejects.toThrowError('Invalid message');
        }));
        it('throws an error when the message does not contain a did doc with any recipientKeys', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const connection = getMockConnection();
            const connectionRequest = new ConnectionRequestMessage_1.ConnectionRequestMessage({
                did: 'did',
                label: 'test-label',
            });
            const messageContext = new InboundMessageContext_1.InboundMessageContext(connectionRequest, {
                connection,
                recipientVerkey: 'test-verkey',
            });
            expect(connectionService.processRequest(messageContext)).rejects.toThrowError(`Connection with id ${connection.id} has no recipient keys.`);
        }));
    });
    describe('createResponse', () => {
        it('returns a connection response message containing the information from the connection record', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            // Needed for signing connection~sig
            const [did, verkey] = yield wallet.createDid();
            const connectionRecord = getMockConnection({
                did,
                verkey,
                state: ConnectionState_1.ConnectionState.Requested,
            });
            // make separate mockFind variable to get the correct jest mock typing
            const mockFind = connectionRepository.find;
            mockFind.mockReturnValue(Promise.resolve(connectionRecord));
            const outboundMessage = yield connectionService.createResponse('test');
            const connection = new Connection_1.Connection({
                did: connectionRecord.did,
                didDoc: connectionRecord.didDoc,
            });
            const plainConnection = JsonTransformer_1.JsonTransformer.toJSON(connection);
            expect(outboundMessage.connection.state).toBe(ConnectionState_1.ConnectionState.Responded);
            expect(yield SignatureDecoratorUtils_1.unpackAndVerifySignatureDecorator(outboundMessage.payload.connectionSig, wallet)).toEqual(plainConnection);
        }));
        const invalidConnectionStates = [
            ConnectionState_1.ConnectionState.Init,
            ConnectionState_1.ConnectionState.Invited,
            ConnectionState_1.ConnectionState.Responded,
            ConnectionState_1.ConnectionState.Complete,
        ];
        test.each(invalidConnectionStates)('throws an error when connection state is %s and not REQUESTED', state => {
            expect.assertions(1);
            // make separate mockFind variable to get the correct jest mock typing
            const mockFind = connectionRepository.find;
            mockFind.mockReturnValue(Promise.resolve(getMockConnection({ state })));
            expect(connectionService.createResponse('test')).rejects.toThrowError('Connection must be in Requested state to send connection response message');
        });
    });
    describe('processResponse', () => {
        it('returns a connection record containing the information from the connection response', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(3);
            const [did, verkey] = yield wallet.createDid();
            const [theirDid, theirVerkey] = yield wallet.createDid();
            const connectionRecord = getMockConnection({
                did,
                verkey,
                state: ConnectionState_1.ConnectionState.Requested,
                tags: {
                    // processResponse checks wether invitation key is same as signing key for connetion~sig
                    invitationKey: theirVerkey,
                },
            });
            const otherPartyConnection = new Connection_1.Connection({
                did: theirDid,
                didDoc: new DidDoc_1.DidDoc(theirDid, [], [], [new DidDoc_1.Service(`${did};indy`, 'https://endpoint.com', [theirVerkey], [], 0, 'IndyAgent')]),
            });
            const plainConnection = JsonTransformer_1.JsonTransformer.toJSON(otherPartyConnection);
            const connectionSig = yield SignatureDecoratorUtils_1.signData(plainConnection, wallet, theirVerkey);
            const connectionResponse = new ConnectionResponseMessage_1.ConnectionResponseMessage({
                threadId: uuid_1.v4(),
                connectionSig,
            });
            const messageContext = new InboundMessageContext_1.InboundMessageContext(connectionResponse, {
                connection: connectionRecord,
                senderVerkey: connectionRecord.theirKey,
                recipientVerkey: connectionRecord.myKey,
            });
            const processedConnection = yield connectionService.processResponse(messageContext);
            expect(processedConnection.state).toBe(ConnectionState_1.ConnectionState.Responded);
            expect(processedConnection.theirDid).toBe(theirDid);
            // TODO: we should transform theirDidDoc to didDoc instance after retrieving from persistence
            expect(processedConnection.theirDidDoc).toEqual(otherPartyConnection.didDoc);
        }));
        it('throws an error when the connection sig is not signed with the same key as the recipient key from the invitation', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const [did, verkey] = yield wallet.createDid();
            const [theirDid, theirVerkey] = yield wallet.createDid();
            const connectionRecord = getMockConnection({
                did,
                verkey,
                state: ConnectionState_1.ConnectionState.Requested,
                tags: {
                    // processResponse checks wether invitation key is same as signing key for connetion~sig
                    invitationKey: 'some-random-key',
                },
            });
            const otherPartyConnection = new Connection_1.Connection({
                did: theirDid,
                didDoc: new DidDoc_1.DidDoc(theirDid, [], [], [new DidDoc_1.Service(`${did};indy`, 'https://endpoint.com', [theirVerkey], [], 0, 'IndyAgent')]),
            });
            const plainConnection = JsonTransformer_1.JsonTransformer.toJSON(otherPartyConnection);
            const connectionSig = yield SignatureDecoratorUtils_1.signData(plainConnection, wallet, theirVerkey);
            const connectionResponse = new ConnectionResponseMessage_1.ConnectionResponseMessage({
                threadId: uuid_1.v4(),
                connectionSig,
            });
            const messageContext = new InboundMessageContext_1.InboundMessageContext(connectionResponse, {
                connection: connectionRecord,
                senderVerkey: connectionRecord.theirKey,
                recipientVerkey: connectionRecord.myKey,
            });
            // For some reason expect(connectionService.processResponse(messageContext)).rejects.toThrowError()
            // doesn't work here.
            try {
                yield connectionService.processResponse(messageContext);
            }
            catch (error) {
                expect(error.message).toBe('Connection in connection response is not signed with same key as recipient key in invitation');
            }
        }));
        it('throws an error when the message context does not have a connection', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const connectionResponse = new ConnectionResponseMessage_1.ConnectionResponseMessage({
                threadId: uuid_1.v4(),
                connectionSig: new SignatureDecorator_1.SignatureDecorator({
                    signature: '',
                    signatureData: '',
                    signatureType: '',
                    signer: '',
                }),
            });
            const messageContext = new InboundMessageContext_1.InboundMessageContext(connectionResponse, {
                recipientVerkey: 'test-verkey',
            });
            expect(connectionService.processResponse(messageContext)).rejects.toThrowError('Connection for verkey test-verkey not found!');
        }));
        it('throws an error when the message does not contain a did doc with any recipientKeys', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const [did, verkey] = yield wallet.createDid();
            const [theirDid, theirVerkey] = yield wallet.createDid();
            const connectionRecord = getMockConnection({
                did,
                verkey,
                state: ConnectionState_1.ConnectionState.Requested,
                tags: {
                    // processResponse checks wether invitation key is same as signing key for connetion~sig
                    invitationKey: theirVerkey,
                },
                theirDid: undefined,
                theirDidDoc: undefined,
            });
            const otherPartyConnection = new Connection_1.Connection({
                did: theirDid,
            });
            const plainConnection = JsonTransformer_1.JsonTransformer.toJSON(otherPartyConnection);
            const connectionSig = yield SignatureDecoratorUtils_1.signData(plainConnection, wallet, theirVerkey);
            const connectionResponse = new ConnectionResponseMessage_1.ConnectionResponseMessage({
                threadId: uuid_1.v4(),
                connectionSig,
            });
            const messageContext = new InboundMessageContext_1.InboundMessageContext(connectionResponse, {
                connection: connectionRecord,
            });
            try {
                yield connectionService.processResponse(messageContext);
            }
            catch (error) {
                expect(error.message).toBe(`Connection with id ${connectionRecord.id} has no recipient keys.`);
            }
        }));
    });
    describe('createTrustPing', () => {
        it('returns a trust ping message', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const connection = getMockConnection({
                state: ConnectionState_1.ConnectionState.Responded,
            });
            // make separate mockFind variable to get the correct jest mock typing
            const mockFind = connectionRepository.find;
            mockFind.mockReturnValue(Promise.resolve(connection));
            const outboundMessage = yield connectionService.createTrustPing('test');
            expect(outboundMessage.connection.state).toBe(ConnectionState_1.ConnectionState.Complete);
            expect(outboundMessage.payload).toEqual(expect.any(TrustPingMessage_1.TrustPingMessage));
        }));
        const invalidConnectionStates = [ConnectionState_1.ConnectionState.Init, ConnectionState_1.ConnectionState.Invited, ConnectionState_1.ConnectionState.Requested];
        test.each(invalidConnectionStates)('throws an error when connection state is %s and not RESPONDED or COMPLETED', state => {
            expect.assertions(1);
            // make separate mockFind variable to get the correct jest mock typing
            const mockFind = connectionRepository.find;
            mockFind.mockReturnValue(Promise.resolve(getMockConnection({ state })));
            expect(connectionService.createTrustPing('test')).rejects.toThrowError('Connection must be in Responded or Complete state to send ack message');
        });
    });
    describe('processAck', () => {
        it('throws an error when the message context does not have a connection', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const ack = new AckMessage_1.AckMessage({
                status: AckMessage_1.AckStatus.OK,
                threadId: 'thread-id',
            });
            const messageContext = new InboundMessageContext_1.InboundMessageContext(ack, {
                recipientVerkey: 'test-verkey',
            });
            expect(connectionService.processAck(messageContext)).rejects.toThrowError('Connection for verkey test-verkey not found!');
        }));
        it('updates the state to Completed when the state is Responded and role is Inviter', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const connection = getMockConnection({
                state: ConnectionState_1.ConnectionState.Responded,
                role: ConnectionRole_1.ConnectionRole.Inviter,
            });
            const ack = new AckMessage_1.AckMessage({
                status: AckMessage_1.AckStatus.OK,
                threadId: 'thread-id',
            });
            const messageContext = new InboundMessageContext_1.InboundMessageContext(ack, {
                recipientVerkey: 'test-verkey',
                connection,
            });
            const updatedConnection = yield connectionService.processAck(messageContext);
            expect(updatedConnection.state).toBe(ConnectionState_1.ConnectionState.Complete);
        }));
        it('does not update the state when the state is not Responded or the role is not Inviter', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const connection = getMockConnection({
                state: ConnectionState_1.ConnectionState.Responded,
                role: ConnectionRole_1.ConnectionRole.Invitee,
            });
            const ack = new AckMessage_1.AckMessage({
                status: AckMessage_1.AckStatus.OK,
                threadId: 'thread-id',
            });
            const messageContext = new InboundMessageContext_1.InboundMessageContext(ack, {
                recipientVerkey: 'test-verkey',
                connection,
            });
            const updatedConnection = yield connectionService.processAck(messageContext);
            expect(updatedConnection.state).toBe(ConnectionState_1.ConnectionState.Responded);
        }));
    });
    describe('getConnections', () => {
        it('returns the connections from the connections repository', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const expectedConnections = [getMockConnection(), getMockConnection(), getMockConnection()];
            // make separate mockFind variable to get the correct jest mock typing
            const mockFindAll = connectionRepository.findAll;
            mockFindAll.mockReturnValue(Promise.resolve(expectedConnections));
            const connections = yield connectionService.getConnections();
            expect(connections).toEqual(expectedConnections);
            expect(mockFindAll).toBeCalled();
        }));
    });
    describe('find', () => {
        it('returns the connection from the connections repository', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const id = 'test-id';
            const expectedConnection = getMockConnection({
                id,
            });
            // make separate mockFind variable to get the correct jest mock typing
            const mockFind = connectionRepository.find;
            mockFind.mockReturnValue(Promise.resolve(expectedConnection));
            const connection = yield connectionService.find(id);
            expect(connection).toEqual(expectedConnection);
            expect(mockFind).toBeCalledWith(id);
        }));
        it('returns null when the connections repository throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const id = 'test-id';
            // make separate mockFind variable to get the correct jest mock typing
            const mockFind = connectionRepository.find;
            mockFind.mockReturnValue(Promise.reject());
            const connection = yield connectionService.find(id);
            expect(connection).toBeNull();
            expect(mockFind).toBeCalledWith(id);
        }));
    });
    describe('findByVerkey', () => {
        it('returns the connection from the connections repository', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const verkey = 'test-verkey';
            const expectedConnection = getMockConnection({
                verkey,
            });
            // make separate mockFind variable to get the correct jest mock typing
            const mockFindByQuery = connectionRepository.findByQuery;
            mockFindByQuery.mockReturnValue(Promise.resolve([expectedConnection]));
            const connection = yield connectionService.findByVerkey(verkey);
            expect(connection).toEqual(expectedConnection);
            expect(mockFindByQuery).toBeCalledWith({ verkey });
        }));
        it('returns null when the connection repository does not return any connections', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const verkey = 'test-verkey';
            // make separate mockFind variable to get the correct jest mock typing
            const mockFindByQuery = connectionRepository.findByQuery;
            mockFindByQuery.mockReturnValue(Promise.resolve([]));
            const connection = yield connectionService.findByVerkey(verkey);
            expect(connection).toBeNull();
            expect(mockFindByQuery).toBeCalledWith({ verkey });
        }));
        it('throws an error when the connection repository returns more than one connection', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const verkey = 'test-verkey';
            const expectedConnections = [getMockConnection({ verkey }), getMockConnection({ verkey })];
            // make separate mockFind variable to get the correct jest mock typing
            const mockFindByQuery = connectionRepository.findByQuery;
            mockFindByQuery.mockReturnValue(Promise.resolve(expectedConnections));
            expect(connectionService.findByVerkey(verkey)).rejects.toThrowError('There is more than one connection for given verkey test-verkey');
            expect(mockFindByQuery).toBeCalledWith({ verkey });
        }));
    });
    describe('findByTheirKey', () => {
        it('returns the connection from the connections repository', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const theirKey = 'test-theirVerkey';
            const expectedConnection = getMockConnection();
            // make separate mockFind variable to get the correct jest mock typing
            const mockFindByQuery = connectionRepository.findByQuery;
            mockFindByQuery.mockReturnValue(Promise.resolve([expectedConnection]));
            const connection = yield connectionService.findByTheirKey(theirKey);
            expect(connection).toEqual(expectedConnection);
            expect(mockFindByQuery).toBeCalledWith({ theirKey });
        }));
        it('returns null when the connection repository does not return any connections', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const theirKey = 'test-theirVerkey';
            // make separate mockFind variable to get the correct jest mock typing
            const mockFindByQuery = connectionRepository.findByQuery;
            mockFindByQuery.mockReturnValue(Promise.resolve([]));
            const connection = yield connectionService.findByTheirKey(theirKey);
            expect(connection).toBeNull();
            expect(mockFindByQuery).toBeCalledWith({ theirKey });
        }));
        it('throws an error when the connection repository returns more than one connection', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const theirKey = 'test-theirVerkey';
            const expectedConnections = [getMockConnection(), getMockConnection()];
            // make separate mockFind variable to get the correct jest mock typing
            const mockFindByQuery = connectionRepository.findByQuery;
            mockFindByQuery.mockReturnValue(Promise.resolve(expectedConnections));
            expect(connectionService.findByTheirKey(theirKey)).rejects.toThrowError('There is more than one connection for given verkey test-theirVerkey');
            expect(mockFindByQuery).toBeCalledWith({ theirKey });
        }));
    });
});
