"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionResponseHandler = void 0;
const ConnectionResponseMessage_1 = require("../../protocols/connections/ConnectionResponseMessage");
class ConnectionResponseHandler {
    constructor(connectionService, agentConfig) {
        this.supportedMessages = [ConnectionResponseMessage_1.ConnectionResponseMessage];
        this.connectionService = connectionService;
        this.agentConfig = agentConfig;
    }
    handle(messageContext) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!messageContext.connection) {
                throw new Error(`Connection for verkey ${messageContext.recipientVerkey} not found!`);
            }
            yield this.connectionService.processResponse(messageContext);
            // TODO: should we only send ping message in case of autoAcceptConnection or always?
            // In AATH we have a separate step to send the ping. So for now we'll only do it
            // if auto accept is enable
            if ((_b = (_a = messageContext.connection) === null || _a === void 0 ? void 0 : _a.autoAcceptConnection) !== null && _b !== void 0 ? _b : this.agentConfig.autoAcceptConnections) {
                return yield this.connectionService.createTrustPing(messageContext.connection.id);
            }
        });
    }
}
exports.ConnectionResponseHandler = ConnectionResponseHandler;
