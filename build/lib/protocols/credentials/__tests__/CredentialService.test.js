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
const Repository_1 = require("../../../storage/Repository");
const CredentialService_1 = require("../CredentialService");
const CredentialRecord_1 = require("../../../storage/CredentialRecord");
const InboundMessageContext_1 = require("../../../agent/models/InboundMessageContext");
const CredentialState_1 = require("../CredentialState");
const StubWallet_1 = require("./StubWallet");
const CredentialOfferMessage_1 = require("../messages/CredentialOfferMessage");
const JsonEncoder_1 = require("../../../utils/JsonEncoder");
const CredentialRequestMessage_1 = require("../messages/CredentialRequestMessage");
const CredentialResponseMessage_1 = require("../messages/CredentialResponseMessage");
const fixtures_1 = require("./fixtures");
const CredentialAckMessage_1 = require("../messages/CredentialAckMessage");
const Attachment_1 = require("../../../decorators/attachment/Attachment");
jest.mock('./../../../storage/Repository');
const CredentialRepository = Repository_1.Repository;
const connection = { id: '123' };
const preview = new CredentialOfferMessage_1.CredentialPreview({
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
const attachment = new Attachment_1.Attachment({
    id: '6526420d-8d1c-4f70-89de-54c9f3fa9f5c',
    mimeType: '',
    data: new Attachment_1.AttachmentData({
        base64: 'eyJzY2hlbWFfaWQiOiJhYWEiLCJjcmVkX2RlZl9pZCI6IlRoN01wVGFSWlZSWW5QaWFiZHM4MVk6MzpDTDoxNzpUQUciLCJub25jZSI6Im5vbmNlIiwia2V5X2NvcnJlY3RuZXNzX3Byb29mIjp7fX0',
    }),
});
const requestAttachment = new Attachment_1.Attachment({
    id: '6526420d-8d1c-4f70-89de-54c9f3fa9f5c',
    mimeType: '',
    data: new Attachment_1.AttachmentData({
        base64: JsonEncoder_1.JsonEncoder.toBase64(fixtures_1.credReq),
    }),
});
// A record is deserialized to JSON when it's stored into the storage. We want to simulate this behaviour for `offer`
// object to test our service would behave correctly. We use type assertion for `offer` attribute to `any`.
const mockCredentialRecord = ({ state, request, requestMetadata, tags, }) => new CredentialRecord_1.CredentialRecord({
    offer: new CredentialOfferMessage_1.CredentialOfferMessage({
        comment: 'some comment',
        credentialPreview: preview,
        attachments: [attachment],
    }).toJSON(),
    request: request,
    requestMetadata: requestMetadata,
    state: state || CredentialState_1.CredentialState.OfferSent,
    tags: tags || {},
    connectionId: '123',
});
describe('CredentialService', () => {
    let wallet;
    let credentialRepository;
    let credentialService;
    let repositoryFindMock;
    let repositoryFindByQueryMock;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        wallet = new StubWallet_1.StubWallet();
        yield wallet.init();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield wallet.close();
        yield wallet.delete();
    }));
    beforeEach(() => {
        credentialRepository = new CredentialRepository();
        credentialService = new CredentialService_1.CredentialService(wallet, credentialRepository);
        // make separate repositoryFindMock variable to get the correct jest mock typing
        repositoryFindMock = credentialRepository.find;
        // make separate repositoryFindByQueryMock variable to get the correct jest mock typing
        repositoryFindByQueryMock = credentialRepository.findByQuery;
    });
    describe('createCredentialOffer', () => {
        let credentialTemplate;
        beforeEach(() => {
            credentialTemplate = {
                credentialDefinitionId: 'Th7MpTaRZVRYnPiabds81Y:3:CL:17:TAG',
                comment: 'some comment',
                preview,
            };
        });
        test('creates credential record in OFFER_SENT state with offer, thread ID', () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            const repositorySaveSpy = jest.spyOn(credentialRepository, 'save');
            // when
            const credentialOffer = yield credentialService.createOffer(connection, credentialTemplate);
            // then
            expect(repositorySaveSpy).toHaveBeenCalledTimes(1);
            const [[createdCredentialRecord]] = repositorySaveSpy.mock.calls;
            expect(createdCredentialRecord).toMatchObject({
                type: CredentialRecord_1.CredentialRecord.name,
                id: expect.any(String),
                createdAt: expect.any(Number),
                offer: credentialOffer,
                tags: { threadId: createdCredentialRecord.offer.id },
                state: 'OFFER_SENT',
            });
        }));
        test(`emits stateChange event with a new credential in OFFER_SENT state`, () => __awaiter(void 0, void 0, void 0, function* () {
            const eventListenerMock = jest.fn();
            credentialService.on(CredentialService_1.EventType.StateChanged, eventListenerMock);
            yield credentialService.createOffer(connection, credentialTemplate);
            expect(eventListenerMock).toHaveBeenCalledTimes(1);
            const [[event]] = eventListenerMock.mock.calls;
            expect(event).toMatchObject({
                prevState: null,
                credential: {
                    state: 'OFFER_SENT',
                },
            });
        }));
        test('returns credential offer message', () => __awaiter(void 0, void 0, void 0, function* () {
            const credentialOffer = yield credentialService.createOffer(connection, credentialTemplate);
            expect(credentialOffer.toJSON()).toMatchObject({
                '@id': expect.any(String),
                '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/offer-credential',
                comment: 'some comment',
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
                'offers~attach': [
                    {
                        '@id': expect.any(String),
                        'mime-type': 'application/json',
                        data: {
                            base64: expect.any(String),
                        },
                    },
                ],
            });
        }));
    });
    describe('processCredentialOffer', () => {
        let messageContext;
        let credentialOfferMessage;
        beforeEach(() => {
            credentialOfferMessage = new CredentialOfferMessage_1.CredentialOfferMessage({
                comment: 'some comment',
                credentialPreview: preview,
                attachments: [attachment],
            });
            messageContext = new InboundMessageContext_1.InboundMessageContext(credentialOfferMessage);
            messageContext.connection = connection;
        });
        test('creates and return credential record in OFFER_RECEIVED state with offer, thread ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const repositorySaveSpy = jest.spyOn(credentialRepository, 'save');
            // when
            const returnedCredentialRecrod = yield credentialService.processOffer(messageContext);
            // then
            const expectedCredentialRecord = {
                type: CredentialRecord_1.CredentialRecord.name,
                id: expect.any(String),
                createdAt: expect.any(Number),
                offer: credentialOfferMessage,
                tags: { threadId: credentialOfferMessage.id },
                state: 'OFFER_RECEIVED',
            };
            expect(repositorySaveSpy).toHaveBeenCalledTimes(1);
            const [[createdCredentialRecord]] = repositorySaveSpy.mock.calls;
            expect(createdCredentialRecord).toMatchObject(expectedCredentialRecord);
            expect(returnedCredentialRecrod).toMatchObject(expectedCredentialRecord);
        }));
        test(`emits stateChange event with OFFER_RECEIVED`, () => __awaiter(void 0, void 0, void 0, function* () {
            const eventListenerMock = jest.fn();
            credentialService.on(CredentialService_1.EventType.StateChanged, eventListenerMock);
            // when
            yield credentialService.processOffer(messageContext);
            // then
            expect(eventListenerMock).toHaveBeenCalledTimes(1);
            const [[event]] = eventListenerMock.mock.calls;
            expect(event).toMatchObject({
                prevState: null,
                credential: {
                    state: 'OFFER_RECEIVED',
                },
            });
        }));
    });
    describe('createCredentialRequest', () => {
        let credentialRecord;
        beforeEach(() => {
            credentialRecord = mockCredentialRecord({
                state: CredentialState_1.CredentialState.OfferReceived,
                tags: { threadId: 'fd9c5ddb-ec11-4acd-bc32-540736249746' },
            });
        });
        test('updates state to REQUEST_SENT, set request metadata', () => __awaiter(void 0, void 0, void 0, function* () {
            const repositoryUpdateSpy = jest.spyOn(credentialRepository, 'update');
            // when
            yield credentialService.createRequest(connection, credentialRecord, fixtures_1.credDef);
            // then
            expect(repositoryUpdateSpy).toHaveBeenCalledTimes(1);
            const [[updatedCredentialRecord]] = repositoryUpdateSpy.mock.calls;
            expect(updatedCredentialRecord).toMatchObject({
                requestMetadata: { cred_req: 'meta-data' },
                state: 'REQUEST_SENT',
            });
        }));
        test(`emits stateChange event with REQUEST_SENT`, () => __awaiter(void 0, void 0, void 0, function* () {
            const eventListenerMock = jest.fn();
            credentialService.on(CredentialService_1.EventType.StateChanged, eventListenerMock);
            // when
            yield credentialService.createRequest(connection, credentialRecord, fixtures_1.credDef);
            // then
            expect(eventListenerMock).toHaveBeenCalledTimes(1);
            const [[event]] = eventListenerMock.mock.calls;
            expect(event).toMatchObject({
                prevState: 'OFFER_RECEIVED',
                credential: {
                    state: 'REQUEST_SENT',
                },
            });
        }));
        test('returns credential request message base on existing credential offer message', () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            const comment = 'credential request comment';
            // when
            const credentialRequest = yield credentialService.createRequest(connection, credentialRecord, fixtures_1.credDef, {
                comment,
            });
            // then
            expect(credentialRequest.toJSON()).toMatchObject({
                '@id': expect.any(String),
                '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/request-credential',
                '~thread': {
                    thid: 'fd9c5ddb-ec11-4acd-bc32-540736249746',
                },
                comment,
                'requests~attach': [
                    {
                        '@id': expect.any(String),
                        'mime-type': 'application/json',
                        data: {
                            base64: expect.any(String),
                        },
                    },
                ],
            });
        }));
        const validState = CredentialState_1.CredentialState.OfferReceived;
        const invalidCredentialStates = Object.values(CredentialState_1.CredentialState).filter(state => state !== validState);
        test(`throws an error when state transition is invalid`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all(invalidCredentialStates.map((state) => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(credentialService.createRequest(connection, mockCredentialRecord({ state }), fixtures_1.credDef)).rejects.toThrowError(`Credential record is in invalid state ${state}. Valid states are: ${validState}.`);
            })));
        }));
    });
    describe('processCredentialRequest', () => {
        let credential;
        let messageContext;
        beforeEach(() => {
            credential = mockCredentialRecord({ state: CredentialState_1.CredentialState.OfferSent });
            const credentialRequest = new CredentialRequestMessage_1.CredentialRequestMessage({ comment: 'abcd', attachments: [requestAttachment] });
            credentialRequest.setThread({ threadId: 'somethreadid' });
            messageContext = new InboundMessageContext_1.InboundMessageContext(credentialRequest);
        });
        test('updates state to REQUEST_RECEIVED, set request and returns credential record', () => __awaiter(void 0, void 0, void 0, function* () {
            const repositoryUpdateSpy = jest.spyOn(credentialRepository, 'update');
            // given
            repositoryFindByQueryMock.mockReturnValue(Promise.resolve([credential]));
            // when
            const returnedCredentialRecord = yield credentialService.processRequest(messageContext);
            // then
            expect(repositoryFindByQueryMock).toHaveBeenCalledTimes(1);
            const [[findByQueryArg]] = repositoryFindByQueryMock.mock.calls;
            expect(findByQueryArg).toEqual({ threadId: 'somethreadid' });
            const expectedCredentialRecord = {
                state: 'REQUEST_RECEIVED',
                request: fixtures_1.credReq,
            };
            expect(repositoryUpdateSpy).toHaveBeenCalledTimes(1);
            const [[updatedCredentialRecord]] = repositoryUpdateSpy.mock.calls;
            expect(updatedCredentialRecord).toMatchObject(expectedCredentialRecord);
            expect(returnedCredentialRecord).toMatchObject(expectedCredentialRecord);
        }));
        test(`emits stateChange event from OFFER_SENT to REQUEST_RECEIVED`, () => __awaiter(void 0, void 0, void 0, function* () {
            const eventListenerMock = jest.fn();
            credentialService.on(CredentialService_1.EventType.StateChanged, eventListenerMock);
            repositoryFindByQueryMock.mockReturnValue(Promise.resolve([credential]));
            yield credentialService.processRequest(messageContext);
            expect(eventListenerMock).toHaveBeenCalledTimes(1);
            const [[event]] = eventListenerMock.mock.calls;
            expect(event).toMatchObject({
                prevState: 'OFFER_SENT',
                credential: {
                    state: 'REQUEST_RECEIVED',
                },
            });
        }));
        const validState = CredentialState_1.CredentialState.OfferSent;
        const invalidCredentialStates = Object.values(CredentialState_1.CredentialState).filter(state => state !== validState);
        test(`throws an error when state transition is invalid`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all(invalidCredentialStates.map((state) => __awaiter(void 0, void 0, void 0, function* () {
                repositoryFindByQueryMock.mockReturnValue(Promise.resolve([mockCredentialRecord({ state })]));
                yield expect(credentialService.processRequest(messageContext)).rejects.toThrowError(`Credential record is in invalid state ${state}. Valid states are: ${validState}.`);
            })));
        }));
    });
    describe('createCredentialResponse', () => {
        const threadId = 'fd9c5ddb-ec11-4acd-bc32-540736249746';
        let credential;
        beforeEach(() => {
            credential = mockCredentialRecord({
                state: CredentialState_1.CredentialState.RequestReceived,
                request: fixtures_1.credReq,
                tags: { threadId },
            });
        });
        test('updates state to CREDENTIAL_ISSUED', () => __awaiter(void 0, void 0, void 0, function* () {
            const repositoryUpdateSpy = jest.spyOn(credentialRepository, 'update');
            // given
            repositoryFindMock.mockReturnValue(Promise.resolve(credential));
            // when
            yield credentialService.createResponse(credential.id);
            // then
            expect(repositoryFindMock).toHaveBeenCalledTimes(1);
            expect(repositoryUpdateSpy).toHaveBeenCalledTimes(1);
            const [[updatedCredentialRecord]] = repositoryUpdateSpy.mock.calls;
            expect(updatedCredentialRecord).toMatchObject({
                state: 'CREDENTIAL_ISSUED',
            });
        }));
        test(`emits stateChange event from REQUEST_RECEIVED to CREDENTIAL_ISSUED`, () => __awaiter(void 0, void 0, void 0, function* () {
            const eventListenerMock = jest.fn();
            credentialService.on(CredentialService_1.EventType.StateChanged, eventListenerMock);
            // given
            repositoryFindMock.mockReturnValue(Promise.resolve(credential));
            // when
            yield credentialService.createResponse(credential.id);
            // then
            expect(eventListenerMock).toHaveBeenCalledTimes(1);
            const [[event]] = eventListenerMock.mock.calls;
            expect(event).toMatchObject({
                prevState: 'REQUEST_RECEIVED',
                credential: {
                    state: 'CREDENTIAL_ISSUED',
                },
            });
        }));
        test('returns credential response message base on credential request message', () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            repositoryFindMock.mockReturnValue(Promise.resolve(credential));
            const comment = 'credential response comment';
            // when
            const credentialResponse = yield credentialService.createResponse(credential.id, { comment });
            // then
            expect(credentialResponse.toJSON()).toMatchObject({
                '@id': expect.any(String),
                '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/issue-credential',
                '~thread': {
                    thid: 'fd9c5ddb-ec11-4acd-bc32-540736249746',
                },
                comment,
                'credentials~attach': [
                    {
                        '@id': expect.any(String),
                        'mime-type': 'application/json',
                        data: {
                            base64: expect.any(String),
                        },
                    },
                ],
                '~please_ack': expect.any(Object),
            });
            // We're using instance of `StubWallet`. Value of `cred` should be as same as in the credential response message.
            const [cred] = yield wallet.createCredential(fixtures_1.credOffer, fixtures_1.credReq, {});
            const [responseAttachment] = credentialResponse.attachments;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(JsonEncoder_1.JsonEncoder.fromBase64(responseAttachment.data.base64)).toEqual(cred);
        }));
        test('throws error when credential record has no request', () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            repositoryFindMock.mockReturnValue(Promise.resolve(mockCredentialRecord({ state: CredentialState_1.CredentialState.RequestSent })));
            // when, then
            yield expect(credentialService.createResponse(credential.id)).rejects.toThrowError('Credential does not contain request.');
        }));
        const validState = CredentialState_1.CredentialState.RequestReceived;
        const invalidCredentialStates = Object.values(CredentialState_1.CredentialState).filter(state => state !== validState);
        test(`throws an error when state transition is invalid`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all(invalidCredentialStates.map((state) => __awaiter(void 0, void 0, void 0, function* () {
                repositoryFindMock.mockReturnValue(Promise.resolve(mockCredentialRecord({ state, tags: { threadId }, request: fixtures_1.credReq })));
                yield expect(credentialService.createResponse(credential.id)).rejects.toThrowError(`Credential record is in invalid state ${state}. Valid states are: ${validState}.`);
            })));
        }));
    });
    describe('processCredentialResponse', () => {
        let credential;
        let messageContext;
        beforeEach(() => {
            credential = mockCredentialRecord({
                state: CredentialState_1.CredentialState.RequestSent,
                requestMetadata: { cred_req: 'meta-data' },
            });
            const credentialResponse = new CredentialResponseMessage_1.CredentialResponseMessage({ comment: 'abcd', attachments: [attachment] });
            credentialResponse.setThread({ threadId: 'somethreadid' });
            messageContext = new InboundMessageContext_1.InboundMessageContext(credentialResponse);
        });
        test('finds credential record by thread ID and saves credential attachment into the wallet', () => __awaiter(void 0, void 0, void 0, function* () {
            const walletSaveSpy = jest.spyOn(wallet, 'storeCredential');
            // given
            repositoryFindByQueryMock.mockReturnValue(Promise.resolve([credential]));
            // when
            yield credentialService.processResponse(messageContext, fixtures_1.credDef);
            // then
            expect(repositoryFindByQueryMock).toHaveBeenCalledTimes(1);
            const [[findByQueryArg]] = repositoryFindByQueryMock.mock.calls;
            expect(findByQueryArg).toEqual({ threadId: 'somethreadid' });
            expect(walletSaveSpy).toHaveBeenCalledTimes(1);
            const [[...walletSaveArgs]] = walletSaveSpy.mock.calls;
            expect(walletSaveArgs).toEqual(expect.arrayContaining([
                expect.any(String),
                { cred_req: 'meta-data' },
                {
                    schema_id: 'aaa',
                    cred_def_id: 'Th7MpTaRZVRYnPiabds81Y:3:CL:17:TAG',
                    nonce: 'nonce',
                    key_correctness_proof: {},
                },
                fixtures_1.credDef,
            ]));
        }));
        test(`updates state to CREDENTIAL_RECEIVED, set credentialId and returns credential record`, () => __awaiter(void 0, void 0, void 0, function* () {
            const repositoryUpdateSpy = jest.spyOn(credentialRepository, 'update');
            // given
            repositoryFindByQueryMock.mockReturnValue(Promise.resolve([credential]));
            // when
            const updatedCredential = yield credentialService.processResponse(messageContext, fixtures_1.credDef);
            // then
            const expectedCredentialRecord = {
                credentialId: expect.any(String),
                state: 'CREDENTIAL_RECEIVED',
            };
            expect(repositoryUpdateSpy).toHaveBeenCalledTimes(1);
            const [[updatedCredentialRecord]] = repositoryUpdateSpy.mock.calls;
            expect(updatedCredentialRecord).toMatchObject(expectedCredentialRecord);
            expect(updatedCredential).toMatchObject(expectedCredentialRecord);
        }));
        test(`emits stateChange event from REQUEST_SENT to CREDENTIAL_RECEIVED`, () => __awaiter(void 0, void 0, void 0, function* () {
            const eventListenerMock = jest.fn();
            credentialService.on(CredentialService_1.EventType.StateChanged, eventListenerMock);
            // given
            repositoryFindByQueryMock.mockReturnValue(Promise.resolve([credential]));
            // when
            yield credentialService.processResponse(messageContext, fixtures_1.credDef);
            // then
            expect(eventListenerMock).toHaveBeenCalledTimes(1);
            const [[event]] = eventListenerMock.mock.calls;
            expect(event).toMatchObject({
                prevState: 'REQUEST_SENT',
                credential: {
                    state: 'CREDENTIAL_RECEIVED',
                },
            });
        }));
        test('throws error when credential record has no request metadata', () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            repositoryFindByQueryMock.mockReturnValue(Promise.resolve([mockCredentialRecord({ state: CredentialState_1.CredentialState.RequestSent })]));
            // when, then
            yield expect(credentialService.processResponse(messageContext, fixtures_1.credDef)).rejects.toThrowError('Credential does not contain request metadata.');
        }));
        const validState = CredentialState_1.CredentialState.RequestSent;
        const invalidCredentialStates = Object.values(CredentialState_1.CredentialState).filter(state => state !== validState);
        test(`throws an error when state transition is invalid`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all(invalidCredentialStates.map((state) => __awaiter(void 0, void 0, void 0, function* () {
                repositoryFindByQueryMock.mockReturnValue(Promise.resolve([mockCredentialRecord({ state, requestMetadata: { cred_req: 'meta-data' } })]));
                yield expect(credentialService.processResponse(messageContext, fixtures_1.credDef)).rejects.toThrowError(`Credential record is in invalid state ${state}. Valid states are: ${validState}.`);
            })));
        }));
    });
    describe('createAck', () => {
        const threadId = 'fd9c5ddb-ec11-4acd-bc32-540736249746';
        let credential;
        beforeEach(() => {
            credential = mockCredentialRecord({
                state: CredentialState_1.CredentialState.CredentialReceived,
                tags: { threadId },
            });
        });
        test('updates state to DONE', () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            const repositoryUpdateSpy = jest.spyOn(credentialRepository, 'update');
            repositoryFindMock.mockReturnValue(Promise.resolve(credential));
            // when
            yield credentialService.createAck(credential.id);
            // then
            expect(repositoryFindMock).toHaveBeenCalledTimes(1);
            expect(repositoryUpdateSpy).toHaveBeenCalledTimes(1);
            const [[updatedCredentialRecord]] = repositoryUpdateSpy.mock.calls;
            expect(updatedCredentialRecord).toMatchObject({
                state: 'DONE',
            });
        }));
        test(`emits stateChange event from CREDENTIAL_RECEIVED to DONE`, () => __awaiter(void 0, void 0, void 0, function* () {
            const eventListenerMock = jest.fn();
            credentialService.on(CredentialService_1.EventType.StateChanged, eventListenerMock);
            // given
            repositoryFindMock.mockReturnValue(Promise.resolve(credential));
            // when
            yield credentialService.createAck(credential.id);
            // then
            expect(eventListenerMock).toHaveBeenCalledTimes(1);
            const [[event]] = eventListenerMock.mock.calls;
            expect(event).toMatchObject({
                prevState: 'CREDENTIAL_RECEIVED',
                credential: {
                    state: 'DONE',
                },
            });
        }));
        test('returns credential response message base on credential request message', () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            repositoryFindMock.mockReturnValue(Promise.resolve(credential));
            // when
            const ackMessage = yield credentialService.createAck(credential.id);
            // then
            expect(ackMessage.toJSON()).toMatchObject({
                '@id': expect.any(String),
                '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/ack',
                '~thread': {
                    thid: 'fd9c5ddb-ec11-4acd-bc32-540736249746',
                },
            });
        }));
        const validState = CredentialState_1.CredentialState.CredentialReceived;
        const invalidCredentialStates = Object.values(CredentialState_1.CredentialState).filter(state => state !== validState);
        test(`throws an error when state transition is invalid`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all(invalidCredentialStates.map((state) => __awaiter(void 0, void 0, void 0, function* () {
                repositoryFindMock.mockReturnValue(Promise.resolve(mockCredentialRecord({ state, tags: { threadId } })));
                yield expect(credentialService.createAck(credential.id)).rejects.toThrowError(`Credential record is in invalid state ${state}. Valid states are: ${validState}.`);
            })));
        }));
    });
    describe('processAck', () => {
        let credential;
        let messageContext;
        beforeEach(() => {
            credential = mockCredentialRecord({ state: CredentialState_1.CredentialState.CredentialIssued });
            const credentialRequest = new CredentialAckMessage_1.CredentialAckMessage({});
            credentialRequest.setThread({ threadId: 'somethreadid' });
            messageContext = new InboundMessageContext_1.InboundMessageContext(credentialRequest);
        });
        test('updates state to DONE and returns credential record', () => __awaiter(void 0, void 0, void 0, function* () {
            const repositoryUpdateSpy = jest.spyOn(credentialRepository, 'update');
            // given
            repositoryFindByQueryMock.mockReturnValue(Promise.resolve([credential]));
            // when
            const returnedCredentialRecord = yield credentialService.processAck(messageContext);
            // then
            const expectedCredentialRecord = {
                state: 'DONE',
            };
            expect(repositoryFindByQueryMock).toHaveBeenCalledTimes(1);
            expect(repositoryUpdateSpy).toHaveBeenCalledTimes(1);
            const [[updatedCredentialRecord]] = repositoryUpdateSpy.mock.calls;
            expect(updatedCredentialRecord).toMatchObject(expectedCredentialRecord);
            expect(returnedCredentialRecord).toMatchObject(expectedCredentialRecord);
        }));
        test(`emits stateChange event from CREDENTIAL_ISSUED to DONE`, () => __awaiter(void 0, void 0, void 0, function* () {
            const eventListenerMock = jest.fn();
            credentialService.on(CredentialService_1.EventType.StateChanged, eventListenerMock);
            // given
            repositoryFindByQueryMock.mockReturnValue(Promise.resolve([credential]));
            // when
            yield credentialService.processAck(messageContext);
            // then
            expect(eventListenerMock).toHaveBeenCalledTimes(1);
            const [[event]] = eventListenerMock.mock.calls;
            expect(event).toMatchObject({
                prevState: 'CREDENTIAL_ISSUED',
                credential: {
                    state: 'DONE',
                },
            });
        }));
        test('throws error when there is no credential found by thread ID', () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            repositoryFindByQueryMock.mockReturnValue(Promise.resolve([]));
            // when, then
            yield expect(credentialService.processAck(messageContext)).rejects.toThrowError('No credential found for threadId = somethreadid');
        }));
        const validState = CredentialState_1.CredentialState.CredentialIssued;
        const invalidCredentialStates = Object.values(CredentialState_1.CredentialState).filter(state => state !== validState);
        test(`throws an error when state transition is invalid`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all(invalidCredentialStates.map((state) => __awaiter(void 0, void 0, void 0, function* () {
                repositoryFindByQueryMock.mockReturnValue(Promise.resolve([mockCredentialRecord({ state })]));
                yield expect(credentialService.processAck(messageContext)).rejects.toThrowError(`Credential record is in invalid state ${state}. Valid states are: ${validState}.`);
            })));
        }));
    });
});
