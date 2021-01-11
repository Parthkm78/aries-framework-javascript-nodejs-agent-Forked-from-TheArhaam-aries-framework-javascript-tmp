"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["ConnectionInvitation"] = "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation";
    MessageType["ConnectionRequest"] = "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/request";
    MessageType["ConnectionResponse"] = "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/response";
    MessageType["Ack"] = "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/notification/1.0/ack";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
