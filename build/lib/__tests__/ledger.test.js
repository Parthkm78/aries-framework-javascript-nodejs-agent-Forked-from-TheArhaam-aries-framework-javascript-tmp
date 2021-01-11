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
const __1 = require("..");
const path_1 = __importDefault(require("path"));
const indy_sdk_1 = __importDefault(require("indy-sdk"));
const did_1 = require("../utils/did");
const genesisPath = process.env.GENESIS_TXN_PATH
    ? path_1.default.resolve(process.env.GENESIS_TXN_PATH)
    : path_1.default.join(__dirname, '../../../network/genesis/local-genesis.txn');
const faberConfig = {
    label: 'Faber',
    walletConfig: { id: 'faber' },
    walletCredentials: { key: '00000000000000000000000000000Test01' },
    publicDidSeed: process.env.TEST_AGENT_PUBLIC_DID_SEED,
    genesisPath,
    poolName: 'test-pool',
};
describe('ledger', () => {
    let faberAgent;
    let schemaId;
    let faberAgentPublicDid;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        faberAgent = new __1.Agent(faberConfig, new DummyInboundTransporter(), new DummyOutboundTransporter(), indy_sdk_1.default);
        yield faberAgent.init();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield faberAgent.closeAndDeleteWallet();
    }));
    test(`initialization of agent's public DID`, () => __awaiter(void 0, void 0, void 0, function* () {
        faberAgentPublicDid = faberAgent.getPublicDid();
        console.log('faberAgentPublicDid', faberAgentPublicDid);
        expect(faberAgentPublicDid).toEqual(expect.objectContaining({
            did: expect.stringMatching(did_1.DID_IDENTIFIER_REGEX),
            verkey: expect.stringMatching(did_1.VERKEY_REGEX),
        }));
    }));
    test('get public DID from ledger', () => __awaiter(void 0, void 0, void 0, function* () {
        if (!faberAgentPublicDid) {
            throw new Error('Agent does not have publid did.');
        }
        const result = yield faberAgent.ledger.getPublicDid(faberAgentPublicDid.did);
        let { verkey } = faberAgentPublicDid;
        // Agent’s public did stored locally in Indy wallet and created from public did seed during
        // its initialization always returns full verkey. Therefore we need to align that here.
        if (did_1.isFullVerkey(verkey) && did_1.isAbbreviatedVerkey(result.verkey)) {
            verkey = yield indy_sdk_1.default.abbreviateVerkey(faberAgentPublicDid.did, verkey);
        }
        expect(result).toEqual(expect.objectContaining({
            did: faberAgentPublicDid.did,
            verkey: verkey,
            role: '101',
        }));
    }));
    test('register schema on ledger', () => __awaiter(void 0, void 0, void 0, function* () {
        if (!faberAgentPublicDid) {
            throw new Error('Agent does not have publid did.');
        }
        const schemaName = `test-schema-${Date.now()}`;
        const schemaTemplate = {
            name: schemaName,
            attributes: ['name', 'age'],
            version: '1.0',
        };
        [schemaId] = yield faberAgent.ledger.registerCredentialSchema(schemaTemplate);
        const ledgerSchema = yield faberAgent.ledger.getSchema(schemaId);
        expect(schemaId).toBe(`${faberAgentPublicDid.did}:2:${schemaName}:1.0`);
        expect(ledgerSchema).toEqual(expect.objectContaining({
            attrNames: expect.arrayContaining(['name', 'age']),
            id: `${faberAgentPublicDid.did}:2:${schemaName}:1.0`,
            name: schemaName,
            seqNo: expect.any(Number),
            ver: '1.0',
            version: '1.0',
        }));
    }));
    test('register definition on ledger', () => __awaiter(void 0, void 0, void 0, function* () {
        if (!faberAgentPublicDid) {
            throw new Error('Agent does not have publid did.');
        }
        const schema = yield faberAgent.ledger.getSchema(schemaId);
        const credentialDefinitionTemplate = {
            schema: schema,
            tag: 'TAG',
            signatureType: 'CL',
            config: { support_revocation: true },
        };
        const [credDefId] = yield faberAgent.ledger.registerCredentialDefinition(credentialDefinitionTemplate);
        const ledgerCredDef = yield faberAgent.ledger.getCredentialDefinition(credDefId);
        const credDefIdRegExp = new RegExp(`${faberAgentPublicDid.did}:3:CL:[0-9]+:TAG`);
        expect(credDefId).toEqual(expect.stringMatching(credDefIdRegExp));
        expect(ledgerCredDef).toEqual(expect.objectContaining({
            id: expect.stringMatching(credDefIdRegExp),
            schemaId: expect.any(String),
            type: 'CL',
            tag: 'TAG',
            ver: '1.0',
            value: expect.objectContaining({
                primary: expect.anything(),
                revocation: expect.anything(),
            }),
        }));
    }));
});
class DummyInboundTransporter {
    start() {
        console.log('Starting agent...');
    }
}
class DummyOutboundTransporter {
    sendMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Sending message...');
        });
    }
}
