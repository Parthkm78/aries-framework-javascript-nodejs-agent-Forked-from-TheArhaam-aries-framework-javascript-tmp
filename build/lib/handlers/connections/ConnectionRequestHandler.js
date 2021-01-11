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
exports.ConnectionRequestHandler = void 0;
const ConnectionRequestMessage_1 = require("../../protocols/connections/ConnectionRequestMessage");
class ConnectionRequestHandler {
    constructor(connectionService, agentConfig) {
        this.supportedMessages = [ConnectionRequestMessage_1.ConnectionRequestMessage];
        this.connectionService = connectionService;
        this.agentConfig = agentConfig;
    }
    handle(messageContext) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!messageContext.connection) {
                throw new Error(`Connection for verkey ${messageContext.recipientVerkey} not found!`);
            }
            yield this.connectionService.processRequest(messageContext);
            if ((_b = (_a = messageContext.connection) === null || _a === void 0 ? void 0 : _a.autoAcceptConnection) !== null && _b !== void 0 ? _b : this.agentConfig.autoAcceptConnections) {
                return yield this.connectionService.createResponse(messageContext.connection.id);
            }
        });
    }
}
exports.ConnectionRequestHandler = ConnectionRequestHandler;
