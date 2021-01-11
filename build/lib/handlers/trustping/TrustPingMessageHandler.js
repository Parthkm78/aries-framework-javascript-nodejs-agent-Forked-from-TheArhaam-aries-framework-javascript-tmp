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
exports.TrustPingMessageHandler = void 0;
const ConnectionState_1 = require("../../protocols/connections/domain/ConnectionState");
const TrustPingMessage_1 = require("../../protocols/trustping/TrustPingMessage");
class TrustPingMessageHandler {
    constructor(trustPingService, connectionService) {
        this.supportedMessages = [TrustPingMessage_1.TrustPingMessage];
        this.trustPingService = trustPingService;
        this.connectionService = connectionService;
    }
    handle(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connection, recipientVerkey } = messageContext;
            if (!connection) {
                throw new Error(`Connection for verkey ${recipientVerkey} not found!`);
            }
            // TODO: This is better addressed in a middleware of some kind because
            // any message can transition the state to complete, not just an ack or trust ping
            if (connection.state === ConnectionState_1.ConnectionState.Responded) {
                yield this.connectionService.updateState(connection, ConnectionState_1.ConnectionState.Complete);
            }
            return this.trustPingService.processPing(messageContext, connection);
        });
    }
}
exports.TrustPingMessageHandler = TrustPingMessageHandler;
