"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofRecord = void 0;
const uuid_1 = require("uuid");
const BaseRecord_1 = require("./BaseRecord");
//TODO :  Draft version -> need storage changes
class ProofRecord extends BaseRecord_1.BaseRecord {
    constructor(props) {
        var _a, _b;
        super((_a = props.id) !== null && _a !== void 0 ? _a : uuid_1.v4(), (_b = props.createdAt) !== null && _b !== void 0 ? _b : Date.now());
        this.type = BaseRecord_1.RecordType.ProofRecord;
        this.presentationRequest = props.presentationRequest;
        this.state = props.state;
        this.connectionId = props.connectionId;
        this.presentationId = props.presentationId;
        this.tags = props.tags;
    }
}
exports.ProofRecord = ProofRecord;
ProofRecord.type = BaseRecord_1.RecordType.ProofRecord;
