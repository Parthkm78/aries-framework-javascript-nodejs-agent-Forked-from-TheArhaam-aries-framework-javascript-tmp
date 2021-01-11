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
exports.MessagePickupHandler = void 0;
const BatchPickupMessage_1 = require("../../protocols/messagepickup/BatchPickupMessage");
class MessagePickupHandler {
    constructor(messagePickupService) {
        this.supportedMessages = [BatchPickupMessage_1.BatchPickupMessage];
        this.messagePickupService = messagePickupService;
    }
    handle(messageContext) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!messageContext.connection) {
                throw new Error(`Connection for verkey ${messageContext.recipientVerkey} not found!`);
            }
            return this.messagePickupService.batch(messageContext.connection);
        });
    }
}
exports.MessagePickupHandler = MessagePickupHandler;
