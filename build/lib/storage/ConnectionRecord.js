"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionRecord = void 0;
const uuid_1 = require("uuid");
const BaseRecord_1 = require("./BaseRecord");
const ConnectionInvitationMessage_1 = require("../protocols/connections/ConnectionInvitationMessage");
const JsonTransformer_1 = require("../utils/JsonTransformer");
class ConnectionRecord extends BaseRecord_1.BaseRecord {
    constructor(props) {
        var _a, _b;
        super((_a = props.id) !== null && _a !== void 0 ? _a : uuid_1.v4(), (_b = props.createdAt) !== null && _b !== void 0 ? _b : Date.now());
        this.type = ConnectionRecord.type;
        this.did = props.did;
        this.didDoc = props.didDoc;
        this.verkey = props.verkey;
        this.theirDid = props.theirDid;
        this.theirDidDoc = props.theirDidDoc;
        this.state = props.state;
        this.role = props.role;
        this.endpoint = props.endpoint;
        this.alias = props.alias;
        this.autoAcceptConnection = props.autoAcceptConnection;
        this.tags = props.tags;
        this.invitation = props.invitation;
        // We need a better approach for this. After retrieving the connection message from
        // persistence it is plain json, so we need to transform it to a message class
        // if transform all record classes with class transformer this wouldn't be needed anymore
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const _invitation = props._invitation;
        if (_invitation) {
            this._invitation = _invitation;
        }
    }
    get invitation() {
        if (this._invitation)
            return JsonTransformer_1.JsonTransformer.fromJSON(this._invitation, ConnectionInvitationMessage_1.ConnectionInvitationMessage);
    }
    set invitation(invitation) {
        if (invitation)
            this._invitation = JsonTransformer_1.JsonTransformer.toJSON(invitation);
    }
    get myKey() {
        if (!this.didDoc) {
            return null;
        }
        return this.didDoc.service[0].recipientKeys[0];
    }
    get theirKey() {
        if (!this.theirDidDoc) {
            return null;
        }
        return this.theirDidDoc.service[0].recipientKeys[0];
    }
}
exports.ConnectionRecord = ConnectionRecord;
ConnectionRecord.type = BaseRecord_1.RecordType.ConnectionRecord;
