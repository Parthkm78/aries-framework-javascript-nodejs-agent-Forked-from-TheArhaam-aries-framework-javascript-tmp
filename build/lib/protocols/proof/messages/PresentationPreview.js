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
exports.PresentationPreviewMessage = exports.AttributePredicateMessage = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const AgentMessage_1 = require("../../../agent/AgentMessage");
const messages_1 = require("./messages");
const JsonTransformer_1 = require("../../../utils/JsonTransformer");
/**
 * Message part of connection protocol used to complete the connection
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0037-present-proof/README.md#presentation-preview
 */
class AttributePredicateMessage {
    /**
     * Create new ConnectionResponseMessage instance.
     * @param options
     */
    constructor(options) {
        if (options) {
            this.name = options.name;
            this.credDefId = options.credDefId;
            this.mimeType = options.mimeType || '';
            this.value = options.value || '';
            this.referent = options.referent || '';
            this.predicate = options.predicate || '';
            this.threshold = options.threshold || '';
        }
    }
    toJSON() {
        return JsonTransformer_1.JsonTransformer.toJSON(this);
    }
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AttributePredicateMessage.prototype, "name", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AttributePredicateMessage.prototype, "credDefId", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AttributePredicateMessage.prototype, "mimeType", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AttributePredicateMessage.prototype, "value", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AttributePredicateMessage.prototype, "referent", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AttributePredicateMessage.prototype, "predicate", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], AttributePredicateMessage.prototype, "threshold", void 0);
exports.AttributePredicateMessage = AttributePredicateMessage;
class PresentationPreviewMessage extends AgentMessage_1.AgentMessage {
    constructor(options) {
        super();
        this.type = PresentationPreviewMessage.type;
        if (options) {
            this.comment = options.comment;
            this.attributes = options.attributes;
            this.predicates = options.predicates;
        }
    }
}
PresentationPreviewMessage.type = messages_1.MessageType.PresentationPreview;
__decorate([
    class_validator_1.Equals(PresentationPreviewMessage.type),
    __metadata("design:type", Object)
], PresentationPreviewMessage.prototype, "type", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], PresentationPreviewMessage.prototype, "comment", void 0);
__decorate([
    class_validator_1.IsString(),
    class_transformer_1.Expose({ name: 'proof_preview_attribute' }),
    __metadata("design:type", Object)
], PresentationPreviewMessage.prototype, "attributes", void 0);
__decorate([
    class_validator_1.IsString(),
    class_transformer_1.Expose({ name: 'prrof_preview_predicates' }),
    __metadata("design:type", Object)
], PresentationPreviewMessage.prototype, "predicates", void 0);
exports.PresentationPreviewMessage = PresentationPreviewMessage;
