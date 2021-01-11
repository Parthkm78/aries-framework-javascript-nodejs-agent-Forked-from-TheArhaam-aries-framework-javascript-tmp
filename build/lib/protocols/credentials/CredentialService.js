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
exports.CredentialService = exports.EventType = void 0;
const uuid_1 = require("uuid");
const events_1 = require("events");
const CredentialRecord_1 = require("../../storage/CredentialRecord");
const CredentialOfferMessage_1 = require("./messages/CredentialOfferMessage");
const CredentialState_1 = require("./CredentialState");
const CredentialRequestMessage_1 = require("./messages/CredentialRequestMessage");
const logger_1 = __importDefault(require("../../logger"));
const CredentialResponseMessage_1 = require("./messages/CredentialResponseMessage");
const JsonEncoder_1 = require("../../utils/JsonEncoder");
const CredentialUtils_1 = require("./CredentialUtils");
const JsonTransformer_1 = require("../../utils/JsonTransformer");
const CredentialAckMessage_1 = require("./messages/CredentialAckMessage");
const Attachment_1 = require("../../decorators/attachment/Attachment");
var EventType;
(function (EventType) {
    EventType["StateChanged"] = "stateChanged";
})(EventType = exports.EventType || (exports.EventType = {}));
class CredentialService extends events_1.EventEmitter {
    constructor(wallet, credentialRepository) {
        super();
        this.wallet = wallet;
        this.credentialRepository = credentialRepository;
    }
    /**
     * Create a new credential record and credential offer message to be send by issuer to holder.
     *
     * @param connection Connection to which issuer wants to issue a credential
     * @param credentialOfferTemplate Template for credential offer
     * @returns Credential offer message
     */
    createOffer(connection, credentialTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            const { credentialDefinitionId, comment, preview } = credentialTemplate;
            const credOffer = yield this.wallet.createCredentialOffer(credentialDefinitionId);
            const attachment = new Attachment_1.Attachment({
                mimeType: 'application/json',
                data: new Attachment_1.AttachmentData({
                    base64: JsonEncoder_1.JsonEncoder.toBase64(credOffer),
                }),
            });
            const credentialOffer = new CredentialOfferMessage_1.CredentialOfferMessage({
                comment,
                attachments: [attachment],
                credentialPreview: preview,
            });
            const credential = new CredentialRecord_1.CredentialRecord({
                connectionId: connection.id,
                offer: credentialOffer,
                state: CredentialState_1.CredentialState.OfferSent,
                tags: { threadId: credentialOffer.id },
            });
            yield this.credentialRepository.save(credential);
            this.emit(EventType.StateChanged, { credential, prevState: null });
            return credentialOffer;
        });
    }
    /**
     * Creates a new credential record by holder based on incoming credential offer from issuer.
     *
     * It does not accept the credential offer. Holder needs to call `createCredentialRequest` method
     * to accept the credential offer.
     *
     * @param messageContext
     */
    processOffer(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentialOffer = messageContext.message;
            const connection = messageContext.connection;
            if (!connection) {
                throw new Error('There is no connection in message context.');
            }
            const credentialRecord = new CredentialRecord_1.CredentialRecord({
                connectionId: connection.id,
                offer: credentialOffer,
                state: CredentialState_1.CredentialState.OfferReceived,
                tags: { threadId: credentialOffer.id },
            });
            yield this.credentialRepository.save(credentialRecord);
            this.emit(EventType.StateChanged, { credential: credentialRecord, prevState: null });
            return credentialRecord;
        });
    }
    /**
     * This method is used to fetch credentials for proofRequest
     * @param proofRequestMessage
     */
    getCredentialsForProofReq(proofRequestMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wallet.getCredentialsForProofReq(JSON.stringify(proofRequestMessage));
        });
    }
    /**
     * Creates credential request message by holder to be send to issuer.
     *
     * @param connection Connection between holder and issuer
     * @param credential
     * @param credentialDefinition
     */
    createRequest(connection, credential, credentialDefinition, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.assertState(credential.state, CredentialState_1.CredentialState.OfferReceived);
            const proverDid = connection.did;
            // FIXME: TypeScript thinks the type of credential.offer is already CredentialOfferMessage, but it still needs to be transformed
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const offer = JsonTransformer_1.JsonTransformer.fromJSON(credential.offer, CredentialOfferMessage_1.CredentialOfferMessage);
            const [offerAttachment] = offer.attachments;
            if (!offerAttachment.data.base64) {
                throw new Error('Missing required base64 encoded attachment data');
            }
            const credOffer = JsonEncoder_1.JsonEncoder.fromBase64(offerAttachment.data.base64);
            const [credReq, credReqMetadata] = yield this.wallet.createCredentialRequest(proverDid, credOffer, credentialDefinition);
            const attachment = new Attachment_1.Attachment({
                mimeType: 'application/json',
                data: new Attachment_1.AttachmentData({
                    base64: JsonEncoder_1.JsonEncoder.toBase64(credReq),
                }),
            });
            const { comment } = options;
            const credentialRequest = new CredentialRequestMessage_1.CredentialRequestMessage({ comment, attachments: [attachment] });
            credentialRequest.setThread({ threadId: credential.tags.threadId });
            credential.requestMetadata = credReqMetadata;
            yield this.updateState(credential, CredentialState_1.CredentialState.RequestSent);
            return credentialRequest;
        });
    }
    /**
     * Updates credential record by issuer based on incoming credential request from holder.
     *
     * @param messageContext
     */
    processRequest(messageContext) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [requestAttachment] = messageContext.message.attachments;
            if (!requestAttachment.data.base64) {
                throw new Error('Missing required base64 encoded attachment data');
            }
            const credReq = JsonEncoder_1.JsonEncoder.fromBase64(requestAttachment.data.base64);
            const [credential] = yield this.credentialRepository.findByQuery({
                threadId: (_a = messageContext.message.thread) === null || _a === void 0 ? void 0 : _a.threadId,
            });
            this.assertState(credential.state, CredentialState_1.CredentialState.OfferSent);
            logger_1.default.log('Credential record found when processing credential request', credential);
            credential.request = credReq;
            yield this.updateState(credential, CredentialState_1.CredentialState.RequestReceived);
            return credential;
        });
    }
    /**
     * Creates credential request message by issuer to be send to holder.
     *
     * @param credentialId Credential record ID
     * @param credentialResponseOptions
     */
    createResponse(credentialId, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const credential = yield this.credentialRepository.find(credentialId);
            if (!credential.request) {
                throw new Error(`Credential does not contain request.`);
            }
            this.assertState(credential.state, CredentialState_1.CredentialState.RequestReceived);
            // FIXME: credential.offer is already CredentialOfferMessage type
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const offer = JsonTransformer_1.JsonTransformer.fromJSON(credential.offer, CredentialOfferMessage_1.CredentialOfferMessage);
            const [offerAttachment] = offer.attachments;
            if (!offerAttachment.data.base64) {
                throw new Error('Missing required base64 encoded attachment data');
            }
            const credOffer = JsonEncoder_1.JsonEncoder.fromBase64(offerAttachment.data.base64);
            const credValues = CredentialUtils_1.CredentialUtils.convertPreviewToValues(offer.credentialPreview);
            const [cred] = yield this.wallet.createCredential(credOffer, credential.request, credValues);
            const responseAttachment = new Attachment_1.Attachment({
                mimeType: 'application/json',
                data: new Attachment_1.AttachmentData({
                    base64: JsonEncoder_1.JsonEncoder.toBase64(cred),
                }),
            });
            const { comment } = options;
            const credentialResponse = new CredentialResponseMessage_1.CredentialResponseMessage({ comment, attachments: [responseAttachment] });
            credentialResponse.setThread({ threadId: credential.tags.threadId });
            credentialResponse.setPleaseAck();
            yield this.updateState(credential, CredentialState_1.CredentialState.CredentialIssued);
            return credentialResponse;
        });
    }
    /**
     * Updates credential record by holder based on incoming credential request from issuer.
     *
     * @param messageContext
     * @param credentialDefinition
     */
    processResponse(messageContext, credentialDefinition) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const threadId = (_a = messageContext.message.thread) === null || _a === void 0 ? void 0 : _a.threadId;
            const [credential] = yield this.credentialRepository.findByQuery({ threadId });
            if (!credential) {
                throw new Error(`No credential found for threadId = ${threadId}`);
            }
            logger_1.default.log('Credential record found when processing credential response', credential);
            if (!credential.requestMetadata) {
                throw new Error('Credential does not contain request metadata.');
            }
            this.assertState(credential.state, CredentialState_1.CredentialState.RequestSent);
            const [responseAttachment] = messageContext.message.attachments;
            if (!responseAttachment.data.base64) {
                throw new Error('Missing required base64 encoded attachment data');
            }
            const cred = JsonEncoder_1.JsonEncoder.fromBase64(responseAttachment.data.base64);
            const credentialId = yield this.wallet.storeCredential(uuid_1.v4(), credential.requestMetadata, cred, credentialDefinition);
            credential.credentialId = credentialId;
            yield this.updateState(credential, CredentialState_1.CredentialState.CredentialReceived);
            return credential;
        });
    }
    createAck(credentialId) {
        return __awaiter(this, void 0, void 0, function* () {
            const credential = yield this.credentialRepository.find(credentialId);
            this.assertState(credential.state, CredentialState_1.CredentialState.CredentialReceived);
            const ackMessage = new CredentialAckMessage_1.CredentialAckMessage({});
            ackMessage.setThread({ threadId: credential.tags.threadId });
            yield this.updateState(credential, CredentialState_1.CredentialState.Done);
            return ackMessage;
        });
    }
    processAck(messageContext) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const threadId = (_a = messageContext.message.thread) === null || _a === void 0 ? void 0 : _a.threadId;
            const [credential] = yield this.credentialRepository.findByQuery({ threadId });
            if (!credential) {
                throw new Error(`No credential found for threadId = ${threadId}`);
            }
            this.assertState(credential.state, CredentialState_1.CredentialState.CredentialIssued);
            yield this.updateState(credential, CredentialState_1.CredentialState.Done);
            return credential;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.credentialRepository.findAll();
        });
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.credentialRepository.find(id);
        });
    }
    assertState(current, expected) {
        if (current !== expected) {
            throw new Error(`Credential record is in invalid state ${current}. Valid states are: ${expected}.`);
        }
    }
    updateState(credential, newState) {
        return __awaiter(this, void 0, void 0, function* () {
            const prevState = credential.state;
            credential.state = newState;
            yield this.credentialRepository.update(credential);
            this.emit(EventType.StateChanged, { credential, prevState });
        });
    }
}
exports.CredentialService = CredentialService;
