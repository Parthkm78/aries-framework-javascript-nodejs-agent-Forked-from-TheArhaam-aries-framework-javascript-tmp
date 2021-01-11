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
exports.CredentialResponseMessage = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const AgentMessage_1 = require("../../../agent/AgentMessage");
const Attachment_1 = require("../../../decorators/attachment/Attachment");
const MessageType_1 = require("./MessageType");
class CredentialResponseMessage extends AgentMessage_1.AgentMessage {
    constructor(options) {
        super();
        this.type = CredentialResponseMessage.type;
        if (options) {
            this.id = options.id || this.generateId();
            this.comment = options.comment;
            this.attachments = options.attachments;
        }
    }
}
CredentialResponseMessage.type = MessageType_1.MessageType.CredentialResponse;
__decorate([
    class_validator_1.Equals(CredentialResponseMessage.type),
    __metadata("design:type", Object)
], CredentialResponseMessage.prototype, "type", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CredentialResponseMessage.prototype, "comment", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'credentials~attach' }),
    class_transformer_1.Type(() => Attachment_1.Attachment),
    class_validator_1.IsArray(),
    class_validator_1.ValidateNested({
        each: true,
    }),
    __metadata("design:type", Array)
], CredentialResponseMessage.prototype, "attachments", void 0);
exports.CredentialResponseMessage = CredentialResponseMessage;
