"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialRecord = void 0;
const uuid_1 = require("uuid");
const BaseRecord_1 = require("./BaseRecord");
class CredentialRecord extends BaseRecord_1.BaseRecord {
    constructor(props) {
        var _a, _b;
        super((_a = props.id) !== null && _a !== void 0 ? _a : uuid_1.v4(), (_b = props.createdAt) !== null && _b !== void 0 ? _b : Date.now());
        this.type = BaseRecord_1.RecordType.CredentialRecord;
        this.offer = props.offer;
        this.state = props.state;
        this.connectionId = props.connectionId;
        this.request = props.request;
        this.requestMetadata = props.requestMetadata;
        this.credentialId = props.credentialId;
        this.tags = props.tags;
    }
}
exports.CredentialRecord = CredentialRecord;
CredentialRecord.type = BaseRecord_1.RecordType.CredentialRecord;
