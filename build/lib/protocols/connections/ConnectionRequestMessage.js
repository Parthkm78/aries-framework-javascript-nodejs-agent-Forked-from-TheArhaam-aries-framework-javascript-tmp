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
exports.ConnectionRequestMessage = void 0;
const class_validator_1 = require("class-validator");
const AgentMessage_1 = require("../../agent/AgentMessage");
const messages_1 = require("./messages");
const Connection_1 = require("./domain/Connection");
const class_transformer_1 = require("class-transformer");
/**
 * Message to communicate the DID document to the other agent when creating a connectino
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0160-connection-protocol/README.md#1-connection-request
 */
class ConnectionRequestMessage extends AgentMessage_1.AgentMessage {
    /**
     * Create new ConnectionRequestMessage instance.
     * @param options
     */
    constructor(options) {
        super();
        this.type = ConnectionRequestMessage.type;
        if (options) {
            this.id = options.id || this.generateId();
            this.label = options.label;
            this.connection = new Connection_1.Connection({
                did: options.did,
                didDoc: options.didDoc,
            });
        }
    }
}
ConnectionRequestMessage.type = messages_1.MessageType.ConnectionRequest;
__decorate([
    class_validator_1.Equals(ConnectionRequestMessage.type),
    __metadata("design:type", Object)
], ConnectionRequestMessage.prototype, "type", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], ConnectionRequestMessage.prototype, "label", void 0);
__decorate([
    class_transformer_1.Type(() => Connection_1.Connection),
    class_validator_1.ValidateNested(),
    __metadata("design:type", Connection_1.Connection)
], ConnectionRequestMessage.prototype, "connection", void 0);
exports.ConnectionRequestMessage = ConnectionRequestMessage;
