"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["CredentialOffer"] = "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/offer-credential";
    MessageType["CredentialPreview"] = "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview";
    MessageType["CredentialRequest"] = "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/request-credential";
    MessageType["CredentialResponse"] = "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/issue-credential";
    MessageType["CredentialAck"] = "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/ack";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
