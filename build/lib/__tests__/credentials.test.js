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
/* eslint-disable no-console */
// @ts-ignore
const await_poll_1 = require("await-poll");
const rxjs_1 = require("rxjs");
const path_1 = __importDefault(require("path"));
const indy_sdk_1 = __importDefault(require("indy-sdk"));
const __1 = require("..");
const helpers_1 = require("./helpers");
const CredentialRecord_1 = require("../storage/CredentialRecord");
const CredentialOfferMessage_1 = require("../protocols/credentials/messages/CredentialOfferMessage");
const CredentialState_1 = require("../protocols/credentials/CredentialState");
const genesisPath = process.env.GENESIS_TXN_PATH
    ? path_1.default.resolve(process.env.GENESIS_TXN_PATH)
    : path_1.default.join(__dirname, '../../../network/genesis/local-genesis.txn');
const faberConfig = {
    label: 'Faber',
    walletConfig: { id: 'credentials-test-faber' },
    walletCredentials: { key: '00000000000000000000000000000Test01' },
    publicDidSeed: process.env.TEST_AGENT_PUBLIC_DID_SEED,
    autoAcceptConnections: true,
    genesisPath,
    poolName: 'credentials-test-faber-pool',
};
const aliceConfig = {
    label: 'Alice',
    walletConfig: { id: 'credentials-test-alice' },
    walletCredentials: { key: '00000000000000000000000000000Test01' },
    autoAcceptConnections: true,
    genesisPath,
    poolName: 'credentials-test-alice-pool',
};
const credentialPreview = new CredentialOfferMessage_1.CredentialPreview({
    attributes: [
        new CredentialOfferMessage_1.CredentialPreviewAttribute({
            name: 'name',
            mimeType: 'text/plain',
            value: 'John',
        }),
        new CredentialOfferMessage_1.CredentialPreviewAttribute({
            name: 'age',
            mimeType: 'text/plain',
            value: '99',
        }),
    ],
});
describe('credentials', () => {
    let faberAgent;
    let aliceAgent;
    let credDefId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const faberMessages = new rxjs_1.Subject();
        const aliceMessages = new rxjs_1.Subject();
        const faberAgentInbound = new helpers_1.SubjectInboundTransporter(faberMessages);
        const faberAgentOutbound = new helpers_1.SubjectOutboundTransporter(aliceMessages);
        const aliceAgentInbound = new helpers_1.SubjectInboundTransporter(aliceMessages);
        const aliceAgentOutbound = new helpers_1.SubjectOutboundTransporter(faberMessages);
        faberAgent = new __1.Agent(faberConfig, faberAgentInbound, faberAgentOutbound, indy_sdk_1.default);
        aliceAgent = new __1.Agent(aliceConfig, aliceAgentInbound, aliceAgentOutbound, indy_sdk_1.default);
        yield faberAgent.init();
        yield aliceAgent.init();
        const schemaTemplate = {
            name: `test-schema-${Date.now()}`,
            attributes: ['name', 'age'],
            version: '1.0',
        };
        const [, ledgerSchema] = yield registerSchema(faberAgent, schemaTemplate);
        const definitionTemplate = {
            schema: ledgerSchema,
            tag: 'TAG',
            signatureType: 'CL',
            config: { support_revocation: false },
        };
        const [ledgerCredDefId] = yield registerDefinition(faberAgent, definitionTemplate);
        credDefId = ledgerCredDefId;
        const publidDid = (_b = (_a = faberAgent.getPublicDid()) === null || _a === void 0 ? void 0 : _a.did) !== null && _b !== void 0 ? _b : 'Th7MpTaRZVRYnPiabds81Y';
        yield ensurePublicDidIsOnLedger(faberAgent, publidDid);
        yield makeConnection(faberAgent, aliceAgent);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield faberAgent.closeAndDeleteWallet();
        yield aliceAgent.closeAndDeleteWallet();
    }));
    test(`when faber issues credential then alice gets credential offer`, () => __awaiter(void 0, void 0, void 0, function* () {
        // We assume that Faber has only one connection and it's a connection with Alice
        const [firstConnection] = yield faberAgent.connections.getAll();
        // Issue credential from Faber to Alice
        yield faberAgent.credentials.issueCredential(firstConnection, {
            credentialDefinitionId: credDefId,
            comment: 'some comment about credential',
            preview: credentialPreview,
        });
        // We assume that Alice has only one credential and it's a credential from Faber
        const [firstCredential] = yield await_poll_1.poll(() => aliceAgent.credentials.getCredentials(), (credentials) => credentials.length < 1, 100);
        expect(firstCredential).toMatchObject({
            createdAt: expect.any(Number),
            id: expect.any(String),
            offer: {
                '@id': expect.any(String),
                '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/offer-credential',
                comment: 'some comment about credential',
                credential_preview: {
                    '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview',
                    attributes: [
                        {
                            name: 'name',
                            'mime-type': 'text/plain',
                            value: 'John',
                        },
                        {
                            name: 'age',
                            'mime-type': 'text/plain',
                            value: '99',
                        },
                    ],
                },
                'offers~attach': expect.any(Array),
            },
            tags: { threadId: firstCredential.offer['@id'] },
            type: CredentialRecord_1.CredentialRecord.name,
            state: CredentialState_1.CredentialState.OfferReceived,
        });
    }));
    test(`when alice accepts the credential offer then faber sends a credential to alice`, () => __awaiter(void 0, void 0, void 0, function* () {
        // We assume that Alice has only one credential and it's a credential from Faber
        let [aliceCredential] = yield aliceAgent.credentials.getCredentials();
        // We assume that Faber has only one credential and it's a credential issued to Alice
        let [faberCredential] = yield faberAgent.credentials.getCredentials();
        // Accept credential offer from Faber
        yield aliceAgent.credentials.acceptCredential(aliceCredential);
        aliceCredential = yield await_poll_1.poll(() => aliceAgent.credentials.find(aliceCredential.id), (credentialRecord) => !credentialRecord || credentialRecord.state !== CredentialState_1.CredentialState.Done, 100);
        console.log('aliceCredential', aliceCredential);
        faberCredential = yield await_poll_1.poll(() => __awaiter(void 0, void 0, void 0, function* () { return faberAgent.credentials.find(faberCredential.id); }), (credentialRecord) => !credentialRecord || credentialRecord.state !== CredentialState_1.CredentialState.Done, 100);
        console.log('faberCredential', faberCredential);
        expect(aliceCredential).toMatchObject({
            type: CredentialRecord_1.CredentialRecord.name,
            id: expect.any(String),
            createdAt: expect.any(Number),
            tags: {
                threadId: expect.any(String),
            },
            offer: expect.any(Object),
            request: undefined,
            requestMetadata: expect.any(Object),
            credentialId: expect.any(String),
            state: CredentialState_1.CredentialState.Done,
        });
        expect(faberCredential).toMatchObject({
            type: CredentialRecord_1.CredentialRecord.name,
            id: expect.any(String),
            createdAt: expect.any(Number),
            tags: {
                threadId: expect.any(String),
            },
            offer: expect.any(Object),
            request: expect.any(Object),
            requestMetadata: undefined,
            credentialId: undefined,
            state: CredentialState_1.CredentialState.Done,
        });
    }));
});
function registerSchema(agent, schemaTemplate) {
    return __awaiter(this, void 0, void 0, function* () {
        const [schemaId] = yield agent.ledger.registerCredentialSchema(schemaTemplate);
        console.log('schemaId', schemaId);
        const ledgerSchema = yield agent.ledger.getSchema(schemaId);
        console.log('ledgerSchemaId, ledgerSchema', schemaId, ledgerSchema);
        return [schemaId, ledgerSchema];
    });
}
function registerDefinition(agent, definitionTemplate) {
    return __awaiter(this, void 0, void 0, function* () {
        const [credDefId] = yield agent.ledger.registerCredentialDefinition(definitionTemplate);
        const ledgerCredDef = yield agent.ledger.getCredentialDefinition(credDefId);
        console.log('ledgerCredDefId, ledgerCredDef', credDefId, ledgerCredDef);
        return [credDefId, ledgerCredDef];
    });
}
function ensurePublicDidIsOnLedger(agent, publicDid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Ensure test DID ${publicDid} is written to ledger`);
            const agentPublicDid = yield agent.ledger.getPublicDid(publicDid);
            console.log(`Ensure test DID ${publicDid} is written to ledger: Success`, agentPublicDid);
        }
        catch (error) {
            // Unfortunately, this won't prevent from the test suite running because of Jest runner runs all tests
            // regardless thorwn errors. We're more explicit about the problem with this error handling.
            throw new Error(`Test DID ${publicDid} is not written on ledger or ledger is not available.`);
        }
    });
}
function makeConnection(agentA, agentB) {
    return __awaiter(this, void 0, void 0, function* () {
        const aliceConnectionAtAliceBob = yield agentA.connections.createConnection();
        if (!aliceConnectionAtAliceBob.invitation) {
            throw new Error('There is no invitation in newly created connection!');
        }
        const bobConnectionAtBobAlice = yield agentB.connections.receiveInvitation(aliceConnectionAtAliceBob.invitation.toJSON());
        const aliceConnectionRecordAtAliceBob = yield agentA.connections.returnWhenIsConnected(aliceConnectionAtAliceBob.id);
        if (!aliceConnectionRecordAtAliceBob) {
            throw new Error('Connection not found!');
        }
        const bobConnectionRecordAtBobAlice = yield agentB.connections.returnWhenIsConnected(bobConnectionAtBobAlice.id);
        if (!bobConnectionRecordAtBobAlice) {
            throw new Error('Connection not found!');
        }
    });
}
