"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialOfferMessage = exports.CredentialPreviewAttribute = exports.CredentialPreview = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const AgentMessage_1 = require("../../../agent/AgentMessage");
const MessageType_1 = require("./MessageType");
const JsonTransformer_1 = require("../../../utils/JsonTransformer");
const Attachment_1 = require("../../../decorators/attachment/Attachment");
/**
 * This is not a message but an inner object for other messages in this protocol. It is used construct a preview of the data for the credential that is to be issued.
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0036-issue-credential/README.md#preview-credential
 */
class CredentialPreview {
    constructor(options) {
        this.type = CredentialPreview.type;
        if (options) {
            this.attributes = options.attributes;
        }
    }
    toJSON() {
        return JsonTransformer_1.JsonTransformer.toJSON(this);
    }
}
CredentialPreview.type = MessageType_1.MessageType.CredentialPreview;
__decorate([
    class_transformer_1.Expose({ name: '@type' }),
    class_validator_1.Equals(CredentialPreview.type),
    __metadata("design:type", Object)
], CredentialPreview.prototype, "type", void 0);
__decorate([
    class_transformer_1.Type(() => CredentialPreviewAttribute),
    class_validator_1.ValidateNested(),
    __metadata("design:type", Array)
], CredentialPreview.prototype, "attributes", void 0);
exports.CredentialPreview = CredentialPreview;
class CredentialPreviewAttribute {
    constructor(options) {
        if (options) {
            this.name = options.name;
            this.mimeType = options.mimeType;
            this.value = options.value;
        }
    }
    toJSON() {
        return JsonTransformer_1.JsonTransformer.toJSON(this);
    }
}
__decorate([
    class_transformer_1.Expose({ name: 'mime-type' }),
    __metadata("design:type", String)
], CredentialPreviewAttribute.prototype, "mimeType", void 0);
exports.CredentialPreviewAttribute = CredentialPreviewAttribute;
/**
 * Message part of Issue Credential Protocol used to continue or initiate credential exchange by issuer.
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0036-issue-credential/README.md#offer-credential
 */
class CredentialOfferMessage extends AgentMessage_1.AgentMessage {
    constructor(options) {
        super();
        this.type = CredentialOfferMessage.type;
        if (options) {
            this.id = options.id || this.generateId();
            this.comment = options.comment;
            this.credentialPreview = options.credentialPreview;
            this.attachments = options.attachments;
        }
    }
}
CredentialOfferMessage.type = MessageType_1.MessageType.CredentialOffer;
__decorate([
    class_validator_1.Equals(CredentialOfferMessage.type),
    __metadata("design:type", Object)
], CredentialOfferMessage.prototype, "type", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CredentialOfferMessage.prototype, "comment", void 0);
__decorate([
    class_validator_1.IsString(),
    class_transformer_1.Expose({ name: 'credential_preview' }),
    __metadata("design:type", CredentialPreview)
], CredentialOfferMessage.prototype, "credentialPreview", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'offers~attach' }),
    class_transformer_1.Type(() => Attachment_1.Attachment),
    class_validator_1.IsArray(),
    class_validator_1.ValidateNested({
        each: true,
    }),
    __metadata("design:type", Array)
], CredentialOfferMessage.prototype, "attachments", void 0);
exports.CredentialOfferMessage = CredentialOfferMessage;
