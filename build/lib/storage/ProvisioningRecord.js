"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvisioningRecord = void 0;
const uuid_1 = require("uuid");
const BaseRecord_1 = require("./BaseRecord");
class ProvisioningRecord extends BaseRecord_1.BaseRecord {
    constructor(props) {
        var _a, _b;
        super((_a = props.id) !== null && _a !== void 0 ? _a : uuid_1.v4(), (_b = props.createdAt) !== null && _b !== void 0 ? _b : Date.now());
        this.type = ProvisioningRecord.type;
        this.mediatorConnectionId = props.mediatorConnectionId;
        this.mediatorPublicVerkey = props.mediatorPublicVerkey;
        this.tags = props.tags || {};
    }
}
exports.ProvisioningRecord = ProvisioningRecord;
ProvisioningRecord.type = BaseRecord_1.RecordType.ProvisioningRecord;
