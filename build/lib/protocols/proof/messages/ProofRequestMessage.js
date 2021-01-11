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
exports.RequestedPredicates = exports.AttributeFilter = exports.RequestedAttributes = exports.ProofRequestMessage = void 0;
const class_transformer_1 = require("class-transformer");
class ProofRequestMessage {
    constructor(proofRequest) {
        if (proofRequest) {
            this.name = proofRequest.name;
            this.version = proofRequest.version;
            this.nonce = proofRequest.nonce;
            this.requestedAttributes = proofRequest.requestedAttributes;
            this.requestedPredicates = proofRequest.requestedPredicates;
        }
    }
}
__decorate([
    class_transformer_1.Expose({ name: 'requested_attributes' }),
    __metadata("design:type", RequestedAttributes)
], ProofRequestMessage.prototype, "requestedAttributes", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'requested_predicates' }),
    __metadata("design:type", RequestedPredicates)
], ProofRequestMessage.prototype, "requestedPredicates", void 0);
exports.ProofRequestMessage = ProofRequestMessage;
// IN PROGRESS
class RequestedAttributes {
}
exports.RequestedAttributes = RequestedAttributes;
//This can be added in future as per requireent
class AttributeFilter {
}
exports.AttributeFilter = AttributeFilter;
// IN PROGRESS
class RequestedPredicates {
}
exports.RequestedPredicates = RequestedPredicates;
