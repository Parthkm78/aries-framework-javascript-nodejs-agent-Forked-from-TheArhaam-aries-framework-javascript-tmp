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
exports.BatchMessageMessage = exports.BatchMessage = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const uuid_1 = require("uuid");
const BaseMessage_1 = require("../../agent/BaseMessage");
const AgentMessage_1 = require("../../agent/AgentMessage");
const messages_1 = require("./messages");
/**
 * A message that contains multiple waiting messages.
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0212-pickup/README.md#batch
 */
class BatchMessage extends AgentMessage_1.AgentMessage {
    constructor(options) {
        super();
        this.type = BatchMessage.type;
        if (options) {
            this.id = options.id || this.generateId();
            this.messages = options.messages;
        }
    }
}
BatchMessage.type = messages_1.MessageType.Batch;
__decorate([
    class_validator_1.Equals(BatchMessage.type),
    __metadata("design:type", Object)
], BatchMessage.prototype, "type", void 0);
__decorate([
    class_transformer_1.Type(() => BatchMessageMessage),
    class_validator_1.IsArray(),
    class_validator_1.ValidateNested()
    // TODO: Update to attachment decorator
    // However i think the usage of the attachment decorator
    // as specified in the Pickup Protocol is incorrect
    ,
    class_transformer_1.Expose({ name: 'messages~attach' }),
    __metadata("design:type", Array)
], BatchMessage.prototype, "messages", void 0);
exports.BatchMessage = BatchMessage;
class BatchMessageMessage {
    constructor(options) {
        if (options) {
            this.id = options.id || uuid_1.v4();
            this.message = options.message;
        }
    }
}
__decorate([
    class_validator_1.Matches(BaseMessage_1.MessageIdRegExp),
    __metadata("design:type", String)
], BatchMessageMessage.prototype, "id", void 0);
exports.BatchMessageMessage = BatchMessageMessage;
