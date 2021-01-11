"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRecord = exports.RecordType = void 0;
var RecordType;
(function (RecordType) {
    RecordType["BaseRecord"] = "BaseRecord";
    RecordType["ConnectionRecord"] = "ConnectionRecord";
    RecordType["BasicMessageRecord"] = "BasicMessageRecord";
    RecordType["ProvisioningRecord"] = "ProvisioningRecord";
    RecordType["CredentialRecord"] = "CredentialRecord";
    RecordType["ProofRecord"] = "PresentationRecord";
})(RecordType = exports.RecordType || (exports.RecordType = {}));
class BaseRecord {
    constructor(id, createdAt) {
        this.type = BaseRecord.type;
        this.id = id;
        this.createdAt = createdAt;
        this.tags = {};
    }
    getValue() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = this, { id, tags } = _a, value = __rest(_a, ["id", "tags"]);
        return JSON.stringify(value);
    }
    static fromPersistence(typeClass, props) {
        // eslint-disable-next-line
        // @ts-ignore
        const { value } = props, rest = __rest(props, ["value"]);
        return new typeClass(Object.assign(Object.assign({}, JSON.parse(value)), rest));
    }
}
exports.BaseRecord = BaseRecord;
// Required because Javascript doesn't allow accessing static types
// like instance.static_member
BaseRecord.type = RecordType.BaseRecord;
