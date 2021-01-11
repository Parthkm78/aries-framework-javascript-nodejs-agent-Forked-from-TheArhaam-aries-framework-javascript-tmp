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
exports.ConnectionInvitationMessage = void 0;
const class_validator_1 = require("class-validator");
const AgentMessage_1 = require("../../agent/AgentMessage");
const messages_1 = require("./messages");
/**
 * Message to invite another agent to create a connection
 *
 * @see https://github.com/hyperledger/aries-rfcs/blob/master/features/0160-connection-protocol/README.md#0-invitation-to-connect
 */
class ConnectionInvitationMessage extends AgentMessage_1.AgentMessage {
    /**
     * Create new ConnectionInvitationMessage instance.
     * @param options
     */
    constructor(options) {
        super();
        this.type = ConnectionInvitationMessage.type;
        if (options) {
            this.id = options.id || this.generateId();
            this.label = options.label;
            if (isDidInvitation(options)) {
                this.did = options.did;
            }
            else {
                this.recipientKeys = options.recipientKeys;
                this.serviceEndpoint = options.serviceEndpoint;
                this.routingKeys = options.routingKeys;
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (options.did && (options.recipientKeys || options.routingKeys || options.serviceEndpoint)) {
                throw new Error('either the did or the recipientKeys/serviceEndpoint/routingKeys must be set, but not both');
            }
        }
    }
}
ConnectionInvitationMessage.type = messages_1.MessageType.ConnectionInvitation;
__decorate([
    class_validator_1.Equals(ConnectionInvitationMessage.type),
    __metadata("design:type", Object)
], ConnectionInvitationMessage.prototype, "type", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], ConnectionInvitationMessage.prototype, "label", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.ValidateIf((o) => o.recipientKeys === undefined),
    __metadata("design:type", String)
], ConnectionInvitationMessage.prototype, "did", void 0);
__decorate([
    class_validator_1.IsString({
        each: true,
    }),
    class_validator_1.IsArray(),
    class_validator_1.ValidateIf((o) => o.did === undefined),
    __metadata("design:type", Array)
], ConnectionInvitationMessage.prototype, "recipientKeys", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.ValidateIf((o) => o.did === undefined),
    __metadata("design:type", String)
], ConnectionInvitationMessage.prototype, "serviceEndpoint", void 0);
__decorate([
    class_validator_1.IsString({
        each: true,
    }),
    class_validator_1.IsOptional(),
    class_validator_1.ValidateIf((o) => o.did === undefined),
    __metadata("design:type", Array)
], ConnectionInvitationMessage.prototype, "routingKeys", void 0);
exports.ConnectionInvitationMessage = ConnectionInvitationMessage;
/**
 * Check whether an invitation is a `DIDInvitationData` object
 *
 * @param invitation invitation object
 */
function isDidInvitation(invitation) {
    return invitation.did !== undefined;
}
