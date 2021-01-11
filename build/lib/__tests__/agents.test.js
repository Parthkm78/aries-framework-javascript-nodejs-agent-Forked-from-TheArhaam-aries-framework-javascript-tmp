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
const rxjs_1 = require("rxjs");
const __1 = require("..");
const helpers_1 = require("./helpers");
const indy_sdk_1 = __importDefault(require("indy-sdk"));
expect.extend({ toBeConnectedWith: helpers_1.toBeConnectedWith });
const aliceConfig = {
    label: 'Alice',
    walletConfig: { id: 'alice' },
    walletCredentials: { key: '00000000000000000000000000000Test01' },
    autoAcceptConnections: true,
};
const bobConfig = {
    label: 'Bob',
    walletConfig: { id: 'bob' },
    walletCredentials: { key: '00000000000000000000000000000Test02' },
    autoAcceptConnections: true,
};
describe('agents', () => {
    let aliceAgent;
    let bobAgent;
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield aliceAgent.closeAndDeleteWallet();
        yield bobAgent.closeAndDeleteWallet();
    }));
    test('make a connection between agents', () => __awaiter(void 0, void 0, void 0, function* () {
        const aliceMessages = new rxjs_1.Subject();
        const bobMessages = new rxjs_1.Subject();
        const aliceAgentInbound = new helpers_1.SubjectInboundTransporter(aliceMessages);
        const aliceAgentOutbound = new helpers_1.SubjectOutboundTransporter(bobMessages);
        const bobAgentInbound = new helpers_1.SubjectInboundTransporter(bobMessages);
        const bobAgentOutbound = new helpers_1.SubjectOutboundTransporter(aliceMessages);
        aliceAgent = new __1.Agent(aliceConfig, aliceAgentInbound, aliceAgentOutbound, indy_sdk_1.default);
        yield aliceAgent.init();
        bobAgent = new __1.Agent(bobConfig, bobAgentInbound, bobAgentOutbound, indy_sdk_1.default);
        yield bobAgent.init();
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
    }));
    test('send a message to connection', () => __awaiter(void 0, void 0, void 0, function* () {
        const aliceConnections = yield aliceAgent.connections.getAll();
        console.log('aliceConnections', aliceConnections);
        const bobConnections = yield bobAgent.connections.getAll();
        console.log('bobConnections', bobConnections);
        // send message from Alice to Bob
        const lastAliceConnection = aliceConnections[aliceConnections.length - 1];
        console.log('lastAliceConnection\n', lastAliceConnection);
        const message = 'hello, world';
        yield aliceAgent.basicMessages.sendMessage(lastAliceConnection, message);
        const bobMessages = yield await_poll_1.poll(() => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Getting Bob's messages from Alice...`);
            const messages = yield bobAgent.basicMessages.findAllByQuery({
                from: lastAliceConnection.did,
                to: lastAliceConnection.theirDid,
            });
            return messages;
        }), (messages) => messages.length < 1);
        const lastMessage = bobMessages[bobMessages.length - 1];
        expect(lastMessage.content).toBe(message);
    }));
});
