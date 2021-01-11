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
exports.ProofService = exports.EventType = void 0;
const events_1 = require("events");
const RequestPresentationMessage_1 = require("./messages/RequestPresentationMessage");
const Attachment_1 = require("../../decorators/attachment/Attachment");
const JsonEncoder_1 = require("../../utils/JsonEncoder");
const ProofRecord_1 = require("../../storage/ProofRecord");
const ProofState_1 = require("./ProofState");
const ProofUtils_1 = require("./ProofUtils");
const PresentProofMessage_1 = require("./messages/PresentProofMessage");
var EventType;
(function (EventType) {
    EventType["StateChanged"] = "stateChanged";
})(EventType = exports.EventType || (exports.EventType = {}));
class ProofService extends events_1.EventEmitter {
    constructor(wallet, proofRepository) {
        super();
        this.wallet = wallet;
        this.proofRepository = proofRepository;
    }
    /**
     * Create a new Proof Request
     *
     * @param connection Connection to which agent wants to send proof request
     * @param ProofRequestTemplate Template for Proof Request
     * @returns Proof Request message
     */
    createRequest(connection, proofRequestTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comment, proofRequest } = proofRequestTemplate;
            const attachment = new Attachment_1.Attachment({
                mimeType: 'application/json',
                data: new Attachment_1.AttachmentData({
                    base64: JsonEncoder_1.JsonEncoder.toBase64(proofRequest),
                }),
            });
            const requestPresentationMessage = new RequestPresentationMessage_1.RequestPresentationMessage({
                comment,
                attachments: [attachment],
            });
            //save in repository
            const proofRecord = new ProofRecord_1.ProofRecord({
                connectionId: connection.id,
                presentationRequest: requestPresentationMessage,
                state: ProofState_1.ProofState.RequestSent,
                tags: { threadId: requestPresentationMessage.id },
            });
            yield this.proofRepository.save(proofRecord);
            this.emit(EventType.StateChanged, { proofRecord, prevState: ProofState_1.ProofState.RequestSent });
            return requestPresentationMessage;
        });
    }
    /**
     * Process incoming Proof request.
     *
     * @param messageContext
     */
    processRequest(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const proofRequest = messageContext.message;
            const connection = messageContext.connection;
            if (!connection) {
                throw new Error('There is no connection in message context.');
            }
            const [responseAttachment] = messageContext.message.attachments;
            if (!responseAttachment.data.base64) {
                throw new Error('Missing required base64 encoded attachment data');
            }
            const proofRecord = new ProofRecord_1.ProofRecord({
                connectionId: connection.id,
                presentationRequest: proofRequest,
                state: ProofState_1.ProofState.RequestReceived,
                tags: { threadId: proofRequest.id },
            });
            //save in repository
            yield this.proofRepository.save(proofRecord);
            this.emit(EventType.StateChanged, { proofRecord, prevState: ProofState_1.ProofState.RequestReceived });
            //TODO : process for genrating proof
            return proofRecord;
        });
    }
    proverCreateMasterSecret(masterSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wallet.proverCreateMasterSecret(masterSecret);
        });
    }
    /**
    * This method is used to create Presentation of proof
    * @param proofRequestMessage
    */
    createPresentation(proofRequestMessage, proofCred, ledgerService, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let requestParmsObj = yield ProofUtils_1.ProofUtils.constructGenerateProofParms(proofCred.attrs, ledgerService);
            console.log("calling wallet:proverCreateProof:");
            let proof = yield this.wallet.proverCreateProof(JSON.stringify(proofRequestMessage), JSON.stringify(requestParmsObj.reqCred), JSON.stringify(requestParmsObj.schemas), JSON.stringify(requestParmsObj.credDefs), '{}');
            const attachment = new Attachment_1.Attachment({
                mimeType: 'application/json',
                data: new Attachment_1.AttachmentData({
                    base64: JsonEncoder_1.JsonEncoder.toBase64(proof),
                }),
            });
            // const { comment } = options;
            let comment = "Test";
            const presentProofMessage = new PresentProofMessage_1.PresentProofMessage({ comment, attachments: [attachment] });
            // presentProofMessage.setThread({ threadId: credential.tags.threadId });
            // credential.requestMetadata = credReqMetadata;
            // await this.updateState(credential, CredentialState.RequestSent);
            return presentProofMessage;
        });
    }
    verifyPresentation(proofRequestMessage, presentProofMessage, proofCred, ledgerService, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const [responseAttachment] = presentProofMessage.attachments;
            if (!responseAttachment.data.base64) {
                throw new Error('Missing required base64 encoded attachment data');
            }
            const proof = JsonEncoder_1.JsonEncoder.fromBase64(responseAttachment.data.base64);
            let requestParmsObj = yield ProofUtils_1.ProofUtils.constructGenerateProofParms(proofCred.attrs, ledgerService);
            console.log("calling verify prsentation wallet:");
            return yield this.wallet.verifierVerifyProof(JSON.stringify(proofRequestMessage), JSON.stringify(proof), JSON.stringify(requestParmsObj.reqCred), JSON.stringify(requestParmsObj.schemas), JSON.stringify(requestParmsObj.credDefs), '{}', '{}');
        });
    }
    updateState(proofRecord, newState) {
        return __awaiter(this, void 0, void 0, function* () {
            const prevState = proofRecord.state;
            proofRecord.state = newState;
            yield this.proofRepository.update(proofRecord);
            this.emit(EventType.StateChanged, { proofRecord, prevState });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.proofRepository.findAll();
        });
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.proofRepository.find(id);
        });
    }
}
exports.ProofService = ProofService;
