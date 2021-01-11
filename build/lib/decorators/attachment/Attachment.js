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
exports.Attachment = exports.AttachmentData = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const uuid_1 = require("uuid");
/**
 * A JSON object that gives access to the actual content of the attachment
 */
class AttachmentData {
    constructor(options) {
        if (options) {
            this.base64 = options.base64;
            this.json = options.json;
            this.links = options.links;
            this.jws = options.jws;
            this.sha256 = options.sha256;
        }
    }
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsBase64(),
    __metadata("design:type", String)
], AttachmentData.prototype, "base64", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], AttachmentData.prototype, "json", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString({ each: true }),
    __metadata("design:type", Array)
], AttachmentData.prototype, "links", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], AttachmentData.prototype, "jws", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsHash('sha256'),
    __metadata("design:type", String)
], AttachmentData.prototype, "sha256", void 0);
exports.AttachmentData = AttachmentData;
/**
 * Represents DIDComm attachment
 * https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0017-attachments/README.md
 */
class Attachment {
    constructor(options) {
        var _a;
        if (options) {
            this.id = (_a = options.id) !== null && _a !== void 0 ? _a : uuid_1.v4();
            this.description = options.description;
            this.filename = options.filename;
            this.mimeType = options.mimeType;
            this.lastmodTime = options.lastmodTime;
            this.byteCount = options.byteCount;
            this.data = options.data;
        }
    }
}
__decorate([
    class_transformer_1.Expose({ name: '@id' }),
    __metadata("design:type", String)
], Attachment.prototype, "id", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Attachment.prototype, "description", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], Attachment.prototype, "filename", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'mime-type' }),
    class_validator_1.IsOptional(),
    class_validator_1.IsMimeType(),
    __metadata("design:type", String)
], Attachment.prototype, "mimeType", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'lastmod_time' }),
    class_transformer_1.Type(() => Date),
    class_validator_1.IsOptional(),
    class_validator_1.IsDate(),
    __metadata("design:type", Number)
], Attachment.prototype, "lastmodTime", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'byte_count' }),
    class_validator_1.IsOptional(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], Attachment.prototype, "byteCount", void 0);
__decorate([
    class_transformer_1.Type(() => AttachmentData),
    class_validator_1.ValidateNested(),
    __metadata("design:type", AttachmentData)
], Attachment.prototype, "data", void 0);
exports.Attachment = Attachment;
