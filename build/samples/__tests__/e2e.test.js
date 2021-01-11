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
// eslint-disable-next-line
// @ts-ignore
const await_poll_1 = require("await-poll");
const lib_1 = require("../../lib");
const http_1 = require("../http");
const helpers_1 = require("../../lib/__tests__/helpers");
const indy_sdk_1 = __importDefault(require("indy-sdk"));
expect.extend({ toBeConnectedWith: helpers_1.toBeConnectedWith });
const aliceConfig = {
    label: 'e2e Alice',
    mediatorUrl: 'http://localhost:3001',
    walletConfig: { id: 'e2e-alice' },
    walletCredentials: { key: '00000000000000000000000000000Test01' },
    autoAcceptConnections: true,
};
const bobConfig = {
    label: 'e2e Bob',
    mediatorUrl: 'http://localhost:3002',
    walletConfig: { id: 'e2e-bob' },
    walletCredentials: { key: '00000000000000000000000000000Test02' },
    autoAcceptConnections: true,
};
describe('with mediator', () => {
    let aliceAgent;
    let bobAgent;
    let aliceAtAliceBobId;
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        aliceAgent.inboundTransporter.stop = true;
        bobAgent.inboundTransporter.stop = true;
        // Wait for messages to flush out
        yield new Promise(r => setTimeout(r, 1000));
        yield aliceAgent.closeAndDeleteWallet();
        yield bobAgent.closeAndDeleteWallet();
    }));
    test('Alice and Bob make a connection with mediator', () => __awaiter(void 0, void 0, void 0, function* () {
        const aliceAgentSender = new HttpOutboundTransporter();
        const aliceAgentReceiver = new PollingInboundTransporter();
        const bobAgentSender = new HttpOutboundTransporter();
        const bobAgentReceiver = new PollingInboundTransporter();
        aliceAgent = new lib_1.Agent(aliceConfig, aliceAgentReceiver, aliceAgentSender, indy_sdk_1.default);
        yield aliceAgent.init();
        bobAgent = new lib_1.Agent(bobConfig, bobAgentReceiver, bobAgentSender, indy_sdk_1.default);
        yield bobAgent.init();
        const aliceInbound = aliceAgent.routing.getInboundConnection();
        const aliceInboundConnection = aliceInbound && aliceInbound.connection;
        const aliceKeyAtAliceMediator = aliceInboundConnection && aliceInboundConnection.verkey;
        console.log('aliceInboundConnection', aliceInboundConnection);
        const bobInbound = bobAgent.routing.getInboundConnection();
        const bobInboundConnection = bobInbound && bobInbound.connection;
        const bobKeyAtBobMediator = bobInboundConnection && bobInboundConnection.verkey;
        console.log('bobInboundConnection', bobInboundConnection);
        // TODO This endpoint currently exists at mediator only for the testing purpose. It returns mediator's part of the pairwise connection.
        const mediatorConnectionAtAliceMediator = JSON.parse(yield http_1.get(`${aliceAgent.getMediatorUrl()}/api/connections/${aliceKeyAtAliceMediator}`));
        const mediatorConnectionAtBobMediator = JSON.parse(yield http_1.get(`${bobAgent.getMediatorUrl()}/api/connections/${bobKeyAtBobMediator}`));
        console.log('mediatorConnectionAtAliceMediator', mediatorConnectionAtAliceMediator);
        console.log('mediatorConnectionAtBobMediator', mediatorConnectionAtBobMediator);
        expect(aliceInboundConnection).toBeConnectedWith(mediatorConnectionAtAliceMediator);
        expect(bobInboundConnection).toBeConnectedWith(mediatorConnectionAtBobMediator);
    }));
    test('Alice and Bob make a connection via mediator', () => __awaiter(void 0, void 0, void 0, function* () {
        const aliceConnectionAtAliceBob = yield aliceAgent.connections.createConnection();
        if (!aliceConnectionAtAliceBob.invitation) {
            throw new Error('There is no invitation in newly created connection!');
        }
        const bobConnectionAtBobAlice = yield bobAgent.connections.receiveInvitation(aliceConnectionAtAliceBob.invitation.toJSON());
        const aliceConnectionRecordAtAliceBob = yield aliceAgent.connections.returnWhenIsConnected(aliceConnectionAtAliceBob.id);
        if (!aliceConnectionRecordAtAliceBob) {
            throw new Error('Connection not found!');
        }
        const bobConnectionRecordAtBobAlice = yield bobAgent.connections.returnWhenIsConnected(bobConnectionAtBobAlice.id);
        if (!bobConnectionRecordAtBobAlice) {
            throw new Error('Connection not found!');
        }
        expect(aliceConnectionRecordAtAliceBob).toBeConnectedWith(bobConnectionRecordAtBobAlice);
        expect(bobConnectionRecordAtBobAlice).toBeConnectedWith(aliceConnectionRecordAtAliceBob);
        // We save this verkey to send message via this connection in the following test
        aliceAtAliceBobId = aliceConnectionAtAliceBob.id;
    }));
    test('Send a message from Alice to Bob via mediator', () => __awaiter(void 0, void 0, void 0, function* () {
        // send message from Alice to Bob
        const aliceConnectionAtAliceBob = yield aliceAgent.connections.find(aliceAtAliceBobId);
        if (!aliceConnectionAtAliceBob) {
            throw new Error(`There is no connection for id ${aliceAtAliceBobId}`);
        }
        console.log('aliceConnectionAtAliceBob\n', aliceConnectionAtAliceBob);
        const message = 'hello, world';
        yield aliceAgent.basicMessages.sendMessage(aliceConnectionAtAliceBob, message);
        const bobMessages = yield await_poll_1.poll(() => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Getting Bob's messages from Alice...`);
            const messages = yield bobAgent.basicMessages.findAllByQuery({
                from: aliceConnectionAtAliceBob.did,
                to: aliceConnectionAtAliceBob.theirDid,
            });
            return messages;
        }), (messages) => messages.length < 1, 1000);
        const lastMessage = bobMessages[bobMessages.length - 1];
        expect(lastMessage.content).toBe(message);
    }));
});
class PollingInboundTransporter {
    constructor() {
        this.stop = false;
    }
    start(agent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.registerMediator(agent);
        });
    }
    registerMediator(agent) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediatorUrl = agent.getMediatorUrl() || '';
            const mediatorInvitationUrl = yield http_1.get(`${mediatorUrl}/invitation`);
            const { verkey: mediatorVerkey } = JSON.parse(yield http_1.get(`${mediatorUrl}/`));
            yield agent.routing.provision({ verkey: mediatorVerkey, invitationUrl: mediatorInvitationUrl });
            this.pollDownloadMessages(agent);
        });
    }
    pollDownloadMessages(agent) {
        await_poll_1.poll(() => __awaiter(this, void 0, void 0, function* () {
            const downloadedMessages = yield agent.routing.downloadMessages();
            const messages = [...downloadedMessages];
            console.log('downloaded messges', messages);
            while (messages && messages.length > 0) {
                const message = messages.shift();
                yield agent.receiveMessage(message);
            }
        }), () => !this.stop, 1000);
    }
}
class HttpOutboundTransporter {
    sendMessage(outboundPackage, receiveReply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload, endpoint } = outboundPackage;
            if (!endpoint) {
                throw new Error(`Missing endpoint. I don't know how and where to send the message.`);
            }
            console.log('Sending message...');
            console.log(payload);
            if (receiveReply) {
                const response = yield http_1.post(`${endpoint}`, JSON.stringify(payload));
                console.log('response', response);
                const wireMessage = JSON.parse(response);
                console.log('wireMessage', wireMessage);
                return wireMessage;
            }
            else {
                yield http_1.post(`${endpoint}`, JSON.stringify(payload));
            }
        });
    }
}
