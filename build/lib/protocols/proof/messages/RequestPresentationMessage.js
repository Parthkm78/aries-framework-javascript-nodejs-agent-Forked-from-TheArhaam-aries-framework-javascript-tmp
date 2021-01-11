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
exports.RequestPresentationMessage = void 0;
const class_validator_1 = require("class-validator");
const AgentMessage_1 = require("../../../agent/AgentMessage");
const messages_1 = require("./messages");
const Attachment_1 = require("../../../decorators/attachment/Attachment");
const class_transformer_1 = require("class-transformer");
/**
 * Message to request a proof presentation from another agent
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0037-present-proof/README.md#request-presentation
 */
class RequestPresentationMessage extends AgentMessage_1.AgentMessage {
    /**
     * Create new RequestPresentationMessage instance.
     * @param options
     */
    constructor(options) {
        super();
        this.type = RequestPresentationMessage.type;
        if (options) {
            this.id = options.id || this.generateId();
            this.comment = options.comment;
            this.attachments = options.attachments;
        }
    }
}
RequestPresentationMessage.type = messages_1.MessageType.RequestPresentation;
__decorate([
    class_validator_1.Equals(RequestPresentationMessage.type),
    __metadata("design:type", Object)
], RequestPresentationMessage.prototype, "type", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], RequestPresentationMessage.prototype, "comment", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'request-presentation~attach' }),
    class_transformer_1.Type(() => Attachment_1.Attachment),
    class_validator_1.IsArray(),
    class_validator_1.ValidateNested({
        each: true,
    }),
    __metadata("design:type", Array)
], RequestPresentationMessage.prototype, "attachments", void 0);
exports.RequestPresentationMessage = RequestPresentationMessage;
